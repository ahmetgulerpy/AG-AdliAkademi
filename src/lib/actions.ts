import { db } from "@/db";
import { ensureSeed } from "@/db/seed";
import {
  auditLog,
  badges,
  custodyLogs,
  evidence,
  findings,
  labProgress,
  lessonProgress,
  profiles,
  quizAttempts,
  reports,
  timelineEvents,
} from "@/db/schema";
import { eq, sql } from "drizzle-orm";
import { applyTransition, type EvidenceView, type Transition, STATUS_LABELS } from "./evidence-state";
import { sha256 } from "./hash";
import { LESSONS } from "@/data/academy";

export type Snapshot = Awaited<ReturnType<typeof getSnapshot>>;

export async function getSnapshot() {
  ensureSeed();
  const profile = db.select().from(profiles).limit(1).all()[0];
  const ev = db.select().from(evidence).all();
  const custody = db.select().from(custodyLogs).all().sort((a, b) => a.id - b.id);
  const fnd = db.select().from(findings).all().sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  const tl = db.select().from(timelineEvents).all().sort((a, b) => a.utcAt.localeCompare(b.utcAt));
  const lp = db.select().from(lessonProgress).all();
  const lab = db.select().from(labProgress).all();
  const quiz = db.select().from(quizAttempts).all();
  const rep = db.select().from(reports).all().sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  const aud = db.select().from(auditLog).all().sort((a, b) => b.id - a.id).slice(0, 40);
  const bdg = db.select().from(badges).all();
  const moduleIds = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const normalizedLabs = moduleIds.map(
    (id) => lab.find((l) => l.moduleId === id) ?? { moduleId: id, status: "not_started", stepsDone: "[]", findingsCount: 0, completedAt: null, mode: "learning" },
  );
  const completedLessons = lp.filter((l) => l.status === "completed").length;
  const completedLabs = normalizedLabs.filter((l) => l.status === "completed").length;
  const avgScore =
    quiz.length > 0 ? Math.round((quiz.reduce((s, q) => s + (q.score / q.total) * 100, 0) / quiz.length) * 10) / 10 : null;
  const level =
    completedLessons >= 14 && completedLabs >= 6 ? "advanced" : completedLessons >= 7 && completedLabs >= 3 ? "intermediate" : "beginner";
  if (profile && profile.level !== level) db.update(profiles).set({ level }).run();

  return {
    profile: { ...profile, level },
    evidence: ev,
    custody,
    findings: fnd,
    timeline: tl,
    lessonProgress: lp,
    labs: normalizedLabs,
    quizAttempts: quiz,
    reports: rep,
    audit: aud,
    badges: bdg,
    stats: {
      completedLessons,
      totalLessons: LESSONS.length,
      completedLabs,
      totalLabs: 8,
      avgScore,
      quizCount: quiz.length,
      evidenceAcquired: ev.filter((e) => ["acquired", "hash_verified", "reviewing", "reviewed", "findings_recorded", "reported"].includes(e.status)).length,
      evidenceTotal: ev.length,
      findings: fnd.length,
      timeline: tl.length,
      minutes: profile?.totalMinutes ?? 0,
      level,
    },
  };
}

type EvidenceRow = (typeof evidence.$inferSelect);

function view(e: EvidenceRow, findingsCount: number): EvidenceView {
  return {
    status: e.status,
    sha256: e.sha256,
    acquiredAt: e.acquiredAt,
    acquisitionMethod: e.acquisitionMethod,
    reviewedAt: e.reviewedAt,
    findingsCount,
  };
}

function log(action: string, target: string, detail = "", actor = "İncelemeci") {
  db.insert(auditLog)
    .values({ at: new Date().toISOString(), actor, action, target, detail })
    .run();
}

function custodySeq(evidenceId: string) {
  const rows = db.select().from(custodyLogs).all().filter((c) => c.evidenceId === evidenceId);
  return rows.length + 1;
}

function pushCustody(
  e: EvidenceRow,
  newStatus: string,
  action: string,
  reason: string,
  mode: string,
  operator = "İncelemeci",
) {
  db.insert(custodyLogs)
    .values({
      seq: custodySeq(e.evidenceId),
      evidenceId: e.evidenceId,
      caseId: e.caseId,
      occurredAt: new Date().toISOString(),
      utcOffset: "+03:00",
      operator,
      prevStatus: e.status,
      newStatus,
      action,
      reason,
      mode,
    })
    .run();
}

export type ActionResult = { ok: boolean; message: string; data?: unknown };

export async function runAction(body: Record<string, unknown>): Promise<ActionResult> {
  ensureSeed();
  const type = String(body.type ?? "");
  const mode = String(body.mode ?? "learning");
  const actor = "İncelemeci";

  switch (type) {
    case "setMode": {
      const m = body.mode === "investigation" ? "investigation" : "learning";
      db.update(profiles).set({ mode: m }).run();
      log("mode_change", "profile", `Çalışma modu: ${m === "learning" ? "Öğrenme" : "İnceleme"}`, actor);
      return { ok: true, message: `Çalışma modu "${m === "learning" ? "Öğrenme" : "İnceleme"}" olarak ayarlandı.` };
    }
    case "setCase": {
      db.update(profiles).set({ activeCaseId: String(body.caseId) }).run();
      log("case_change", String(body.caseId), "Aktif soruşturma dosyası değiştirildi.", actor);
      return { ok: true, message: `Aktif dosya: ${body.caseId}` };
    }
    case "studyTime": {
      const mins = Number(body.minutes ?? 0);
      const p = db.select().from(profiles).limit(1).all()[0];
      if (p) db.update(profiles).set({ totalMinutes: Math.max(0, p.totalMinutes + mins) }).run();
      return { ok: true, message: "Süre kaydedildi." };
    }
    case "transitionEvidence": {
      const id = String(body.evidenceId ?? "");
      const t = String(body.transition ?? "") as Transition;
      const e = db.select().from(evidence).all().find((x) => x.evidenceId === id);
      if (!e) return { ok: false, message: "Delil bulunamadı." };
      const fcount = db.select().from(findings).all().filter((f) => f.evidenceId === id).length;
      const res = applyTransition(view(e, fcount), t);
      if (!res.ok) {
        log("transition_rejected", id, res.error, actor);
        return { ok: false, message: res.error };
      }
      const now = new Date().toISOString();
      const patch: Partial<typeof evidence.$inferInsert> = { status: res.to };
      let reason = "";

      if (t === "complete_acquisition") {
        const method = String(body.method ?? e.acquisitionMethod);
        // Sentetik ama deterministik: delil kimliği + boyut + yöntem özeti.
        const digest = sha256(`${e.evidenceId}|${e.caseId}|${e.sizeBytes}|${method}|${now}`);
        patch.acquisitionMethod = method;
        patch.acquiredAt = now;
        patch.acquiredBy = actor;
        patch.sha256 = digest;
        patch.hashVerifiedAt = null;
        reason = `Bit-by-bit edinim tamamlandı (${method}). Üretilen SHA-256: ${digest.slice(0, 16)}…`;
      } else if (t === "verify_hash") {
        if (!e.sha256) return { ok: false, message: "Hash bulunamadı." };
        // Edinim anındaki özet yeniden hesaplanır ve karşılaştırılır.
        const recomputed = sha256(`${e.evidenceId}|${e.caseId}|${e.sizeBytes}|${e.acquisitionMethod}|${e.acquiredAt}`);
        if (recomputed !== e.sha256) {
          patch.status = "integrity_issue";
          patch.integrityNote = "Edinim sonrası yeniden hesaplanan özet ile kayıt altındaki özet eşleşmedi.";
          reason = "Bütünlük doğrulaması BAŞARISIZ: özet eşleşmedi.";
          db.update(evidence).set(patch).where(eq(evidence.evidenceId, id)).run();
          pushCustody(e, "integrity_issue", "Bütünlük sorunu", reason, mode, actor);
          log("integrity_fail", id, reason, actor);
          return { ok: false, message: reason };
        }
        patch.hashVerifiedAt = now;
        patch.integrityNote = null;
        reason = `SHA-256 yeniden hesaplandı ve edinim kaydıyla EŞLEŞTİ: ${e.sha256}`;
      } else if (t === "flag_integrity_issue") {
        patch.integrityNote = String(body.note ?? "İncelemeci tarafından işaretlendi.");
        reason = `Bütünlük sorunu işaretlendi: ${patch.integrityNote}`;
      } else if (t === "start_acquisition") {
        reason = "Edinim işlemi başlatıldı; kaynak medya yazma engelleyici üzerinden bağlandı.";
      } else if (t === "request_acquisition") {
        reason = "Edinim talebi oluşturuldu; kaynak medya envantere alındı ve edinim sıraya alındı.";
      } else if (t === "start_review") {
        reason = "İnceleme başlatıldı; analiz kopyası üzerinde işlem yapılıyor.";
      } else if (t === "complete_review") {
        patch.reviewedAt = now;
        reason = "İnceleme tamamlandı; bulgu üretimi için ön koşul sağlandı.";
      } else if (t === "record_findings") {
        reason = `Bulgu kaydı mevcut (${fcount} adet); delil bulgu aşamasına geçti.`;
      } else if (t === "mark_reported") {
        reason = "Delil, oluşturulan inceleme raporuna eklendi.";
      } else if (t === "reacquire") {
        patch.sha256 = null;
        patch.hashVerifiedAt = null;
        patch.acquiredAt = null;
        reason = "Bütünlük sorunu sonrası yeniden edinim başlatıldı; önceki özetler geçersiz sayıldı.";
      }

      db.update(evidence).set(patch).where(eq(evidence.evidenceId, id)).run();
      pushCustody(e, res.to, STATUS_LABELS[res.to] ?? res.to, reason, mode, actor);
      log("transition", id, `${STATUS_LABELS[e.status]} → ${STATUS_LABELS[res.to]} (${reason})`, actor);
      return { ok: true, message: `${e.evidenceId}: ${STATUS_LABELS[e.status]} → ${STATUS_LABELS[res.to]}`, data: { sha256: patch.sha256 ?? e.sha256, status: res.to } };
    }

    case "createFinding": {
      const caseId = String(body.caseId ?? "");
      const evidenceId = body.evidenceId ? String(body.evidenceId) : null;
      const title = String(body.title ?? "").trim();
      const description = String(body.description ?? "").trim();
      if (!title || !description) return { ok: false, message: "Başlık ve teknik açıklama zorunludur." };
      const existing = db.select().from(findings).all().filter((f) => f.caseId === caseId);
      const n = existing.length + 1;
      const findingId = `FND-${caseId.slice(-3)}-${String(n).padStart(3, "0")}`;
      const row = {
        findingId,
        caseId,
        evidenceId,
        title,
        description,
        sourceRecord: String(body.sourceRecord ?? "—"),
        occurredAt: String(body.occurredAt ?? new Date().toISOString()),
        method: String(body.method ?? "Manuel inceleme"),
        reviewerNote: String(body.reviewerNote ?? ""),
        confidence: String(body.confidence ?? "direct"),
        supporting: JSON.stringify(body.supporting ?? []),
        contradicting: JSON.stringify(body.contradicting ?? []),
        alternatives: JSON.stringify(body.alternatives ?? []),
        mode,
        createdAt: new Date().toISOString(),
      };
      db.insert(findings).values(row).run();
      if (evidenceId) {
        const ev = db.select().from(evidence).all().find((x) => x.evidenceId === evidenceId);
        if (ev && ["reviewing", "reviewed"].includes(ev.status)) {
          const cnt = db.select().from(findings).all().filter((f) => f.evidenceId === evidenceId).length;
          if (cnt >= 1 && ev.status === "reviewed") {
            db.update(evidence).set({ status: "findings_recorded" }).where(eq(evidence.evidenceId, evidenceId)).run();
            pushCustody(ev, "findings_recorded", "Bulgular kaydedildi", `${ev.evidenceId} için ${cnt}. bulgu kaydedildi.`, mode, actor);
          }
        }
      }
      log("finding_create", findingId, title, actor);
      return { ok: true, message: `Bulgu kaydedildi: ${findingId}`, data: { findingId } };
    }

    case "deleteFinding": {
      const id = String(body.findingId ?? "");
      const f = db.select().from(findings).all().find((x) => x.findingId === id);
      if (!f) return { ok: false, message: "Bulgu bulunamadı." };
      db.delete(findings).where(eq(findings.findingId, id)).run();
      // findall'ı kullanarak yalnızca hedef satırı silmek yerine koşul uygula
      log("finding_delete", id, f.title, actor);
      return { ok: true, message: "Bulgu silindi." };
    }

    case "lessonStart": {
      const id = String(body.lessonId ?? "");
      const cur = db.select().from(lessonProgress).all().find((l) => l.lessonId === id);
      if (cur) {
        if (cur.status === "not_started")
          db.update(lessonProgress).set({ status: "in_progress", mode }).where(eq(lessonProgress.lessonId, id)).run();
      } else {
        db.insert(lessonProgress).values({ lessonId: id, status: "in_progress", mode }).run();
      }
      return { ok: true, message: "Ders başlatıldı." };
    }

    case "lessonComplete": {
      const id = String(body.lessonId ?? "");
      const cur = db.select().from(lessonProgress).all().find((l) => l.lessonId === id);
      const now = new Date().toISOString();
      if (cur) db.update(lessonProgress).set({ status: "completed", completedAt: now, mode }).where(eq(lessonProgress.lessonId, id)).run();
      else db.insert(lessonProgress).values({ lessonId: id, status: "completed", completedAt: now, mode }).run();
      const done = db.select().from(lessonProgress).all().filter((l) => l.status === "completed").length;
      maybeBadge("lesson_first", "İlk Ders Tamamlandı");
      if (done >= 7) maybeBadge("level_mid", "Ora Seviye Aşkın");
      if (done >= 14) maybeBadge("level_adv", "İleri Seviye Aşkın");
      log("lesson_complete", id, `Tamamlanan ders sayısı: ${done}`, actor);
      return { ok: true, message: "Ders tamamlandı.", data: { done } };
    }

    case "quizSubmit": {
      const id = String(body.lessonId ?? "");
      const answers = Array.isArray(body.answers) ? (body.answers as number[]) : [];
      const lesson = LESSONS.find((l) => l.id === id);
      if (!lesson) return { ok: false, message: "Ders bulunamadı." };
      let score = 0;
      lesson.quiz.forEach((q, i) => {
        if (answers[i] === q.answer) score++;
      });
      db.insert(quizAttempts)
        .values({ lessonId: id, score, total: lesson.quiz.length, answers: JSON.stringify(answers), mode, createdAt: new Date().toISOString() })
        .run();
      const pct = (score / lesson.quiz.length) * 100;
      const now = new Date().toISOString();
      const cur = db.select().from(lessonProgress).all().find((l) => l.lessonId === id);
      const best = cur?.score ?? -1;
      if (pct >= 70) {
        if (cur) db.update(lessonProgress).set({ status: "completed", score: Math.max(best, score), completedAt: cur.completedAt ?? now, mode }).where(eq(lessonProgress.lessonId, id)).run();
        else db.insert(lessonProgress).values({ lessonId: id, status: "completed", score, completedAt: now, mode }).run();
        maybeBadge("quiz_pass", "Sınav Başarısı");
      } else if (cur) {
        db.update(lessonProgress).set({ score: Math.max(best, score), mode }).where(eq(lessonProgress.lessonId, id)).run();
      }
      log("quiz_submit", id, `${score}/${lesson.quiz.length}`, actor);
      return { ok: true, message: `Doğru: ${score}/${lesson.quiz.length}`, data: { score, total: lesson.quiz.length, pct } };
    }

    case "labStep": {
      const id = String(body.moduleId ?? "");
      const cur = db.select().from(labProgress).all().find((l) => l.moduleId === id);
      const steps = cur ? (JSON.parse(cur.stepsDone || "[]") as string[]) : [];
      const step = String(body.step ?? "");
      if (!steps.includes(step)) steps.push(step);
      const total = Number(body.totalSteps ?? 5);
      const status = steps.length >= total ? "completed" : "in_progress";
      const now = new Date().toISOString();
      if (cur) db.update(labProgress).set({ stepsDone: JSON.stringify(steps), status, completedAt: status === "completed" ? (cur.completedAt ?? now) : null, mode }).where(eq(labProgress.moduleId, id)).run();
      else db.insert(labProgress).values({ moduleId: id, status, stepsDone: JSON.stringify(steps), completedAt: status === "completed" ? now : null, mode }).run();
      if (status === "completed") maybeBadge(`lab_${id.toLowerCase()}`, `Laboratuvar Modülü ${id}`);
      log("lab_step", id, `${steps.length}/${total}`, actor);
      return { ok: true, message: "Adım kaydedildi.", data: { steps, status } };
    }

    case "importTimeline": {
      const rows = Array.isArray(body.rows) ? (body.rows as Record<string, string>[]) : [];
      let added = 0;
      const existing = db.select().from(timelineEvents).all();
      const keys = new Set(existing.map((e) => `${e.caseId}|${e.utcAt}|${e.description}`));
      for (const r of rows) {
        const k = `${r.caseId}|${r.utcAt}|${r.description}`;
        if (keys.has(k)) continue;
        keys.add(k);
        db.insert(timelineEvents)
          .values({
            caseId: r.caseId,
            evidenceId: r.evidenceId ?? null,
            source: r.source,
            utcAt: r.utcAt,
            localAt: r.localAt,
            utcOffset: r.utcOffset ?? "+03:00",
            description: r.description,
            confidence: r.confidence ?? "supporting",
            related: JSON.stringify(r.related ?? []),
            imported: 1,
          })
          .run();
        added++;
      }
      log("timeline_import", String(body.caseId ?? ""), `${added} satır eklendi.`, actor);
      return { ok: true, message: `${added} zaman çizelgesi satırı eklendi.`, data: { added } };
    }

    case "clearTimeline": {
      db.delete(timelineEvents).where(sql`1 = 1`).run();
      log("timeline_clear", "all", "Zaman çizelgesi temizlendi.", actor);
      return { ok: true, message: "Zaman çizelgesi temizlendi." };
    }

    case "saveReport": {
      const reportNo = String(body.reportNo ?? "");
      const caseId = String(body.caseId ?? "");
      db.insert(reports)
        .values({
          reportNo,
          caseId,
          createdAt: new Date().toISOString(),
          author: String(body.author ?? "İncelemeci"),
          scope: String(body.scope ?? ""),
          payload: JSON.stringify(body.payload ?? {}),
        })
        .onConflictDoUpdate({ target: reports.reportNo, set: { payload: JSON.stringify(body.payload ?? {}), createdAt: new Date().toISOString() } })
        .run();
      const evs = db.select().from(evidence).all().filter((e) => e.caseId === caseId);
      evs.forEach((e) => {
        const hasFindings = db.select().from(findings).all().some((f) => f.evidenceId === e.evidenceId);
        if (e.status === "findings_recorded" && hasFindings) {
          db.update(evidence).set({ status: "reported" }).where(eq(evidence.evidenceId, e.evidenceId)).run();
          pushCustody(e, "reported", "Raporlandı", `${reportNo} numaralı rapora eklendi.`, mode, actor);
        }
      });
      log("report_save", reportNo, caseId, actor);
      return { ok: true, message: `Rapor kaydedildi: ${reportNo}` };
    }

    default:
      return { ok: false, message: "Bilinmeyen işlem." };
  }
}

function maybeBadge(code: string, label: string) {
  const has = db.select().from(badges).all().some((b) => b.code === code);
  if (!has) db.insert(badges).values({ code, label, earnedAt: new Date().toISOString() }).run();
}
