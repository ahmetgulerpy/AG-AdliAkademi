import { db } from "@/db";
import { ensureSeed } from "@/db/seed";
import { custodyLogs, evidence, findings, profiles, reports, timelineEvents, cases } from "@/db/schema";
import { STATUS_LABELS } from "./evidence-state";
import { bytes, utc, withOffset } from "./format";
import { CASES, EVIDENCE } from "@/data/cases";

import { CONFIDENCE_LABELS, type ReportPayload } from "./report-shared";

export { CONFIDENCE_LABELS, REPORT_SECTIONS, SIMULATION_NOTICE } from "./report-shared";
export type { ReportPayload } from "./report-shared";

const SECTIONS = [
  "Kapak Sayfası",
  "Dosya Bilgileri",
  "İnceleme Talebi ve Kapsamı",
  "Yetkilendirme",
  "İnceleme Yöntemi",
  "Kullanılan Teknik Araçlar",
  "Delil Envanteri",
  "Delil Edinim Kayıtları",
  "Hash Doğrulama",
  "Teknik Analizler",
  "Bulgular",
  "Zaman Çizelgesi",
  "Deliller Arası İlişkilendirme",
  "Teknik Değerlendirme",
  "Sonuç ve Kanaat",
  "Sınırlılıklar",
  "Ekler",
  "Delil Muhafaza Zinciri",
];

/** AG-REPORT-XXXX biçiminde, dosyaya göre artan rapor numarası. */
export function nextReportNo(caseId: string): string {
  ensureSeed();
  const seq = db.select().from(reports).all().filter((r) => r.caseId === caseId).length + 1;
  return `AG-REPORT-${caseId.slice(-3)}${String(seq).padStart(2, "0")}`;
}

export function buildReport(caseId: string): ReportPayload {
  ensureSeed();
  const profile = db.select().from(profiles).limit(1).all()[0];
  const cs = db.select().from(cases).all().find((c) => c.caseId === caseId) ?? CASES.find((c) => c.caseId === caseId);
  const evAll = db.select().from(evidence).all().filter((e) => e.caseId === caseId);
  const fndAll = db.select().from(findings).all().filter((f) => f.caseId === caseId);
  const tlAll = db.select().from(timelineEvents).all().filter((t) => t.caseId === caseId);
  const custodyAll = db.select().from(custodyLogs).all().sort((a, b) => a.id - b.id);

  // RAPOR KURALI: yalnızca gerçekten edinilmiş deliller listelenir.
  const acquiredStatuses = ["acquired", "hash_verified", "review_pending", "reviewing", "reviewed", "findings_recorded", "reported"];
  const listedEvidence = evAll.filter((e) => acquiredStatuses.includes(e.status));
  const notAcquired = evAll.filter((e) => !acquiredStatuses.includes(e.status));

  const payload: ReportPayload = {
    reportNo: `AG-REPORT-${caseId.slice(-3)}01`,
    caseId,
    createdAt: new Date().toISOString(),
    author: profile?.displayName ?? "İncelemeci",
    role: profile?.role ?? "Dijital Adli Bilişim Analisti",
    mode: profile?.mode ?? "learning",
    caseTitle: cs?.title ?? caseId,
    subject: cs?.subject ?? "",
    scope: cs?.scope ?? "",
    brief: cs?.brief ?? "",
    authorization:
      "İnceleme, kurum Bilgi Güvenliği Yetkilisi tarafından yazılı olarak yetkilendirilmiştir. Kapsam yalnızca belirtilen sentetik delil setiyle sınırlıdır; gerçek cihaz veya kullanıcı verisi üzerinde hiçbir işlem yapılmamıştır.",
    methods: [
      "Fiziksel (bit-by-bit) ve mantıksal edinim — yazma engelleyici kullanımı ile simüle edilmiştir.",
      "Kriptografik özet (SHA-256) ile bütünlük doğrulaması.",
      "Dosya sistemi (NTFS/MFT), Registry, olay günlüğü ve tarayıcı artefakt analizi.",
      "Çoklu kaynak zaman çizelgesi korelasyonu (UTC normalize).",
      "Bulgu sınıflandırması: doğrudan gözlem / teknik doğrulanmış / destekleyici / dolaylı / doğrulanmamış iddia.",
    ],
    tools: [
      "AG CYBER LAB Delil Yönetim Sistemi (durum makinesi + append-only custody)",
      "Web Crypto API — SHA-256 (tarayıcı ve sunucu: node:crypto)",
      "Sentetik EVTX görüntüleyici (Event ID filtreleme)",
      "Sentetik NTFS/MFT gezgini ve imza tabanlı kurtarma simülasyonu",
      "Birleştirilmiş zaman çizelgesi motoru (ofset normalizasyonu)",
      "pdfmake — gömülü Roboto font ailesi ile PDF üretimi",
    ],
    evidence: listedEvidence.map((e) => ({
      evidenceId: e.evidenceId,
      type: e.type,
      sourceDevice: e.sourceDevice,
      serial: e.serialNumber ?? "—",
      status: e.status,
      statusLabel: STATUS_LABELS[e.status] ?? e.status,
      acquiredAt: e.acquiredAt ? withOffset(e.acquiredAt) : "edinilmedi",
      acquiredBy: e.acquiredBy ?? "—",
      method: e.acquisitionMethod,
      size: bytes(e.sizeBytes),
      sha256: e.sha256 ?? "",
      hashState: e.hashVerifiedAt ? "Doğrulandı" : e.sha256 ? "Hesaplandı — doğrulanmadı" : "Hesaplanmadı",
      storage: e.storageLocation,
    })),
    custody: custodyAll
      .filter((c) => listedEvidence.some((e) => e.evidenceId === c.evidenceId))
      .map((c) => ({
        seq: c.seq,
        evidenceId: c.evidenceId,
        at: withOffset(c.occurredAt),
        utc: utc(c.occurredAt),
        operator: c.operator,
        prev: STATUS_LABELS[c.prevStatus] ?? c.prevStatus,
        next: STATUS_LABELS[c.newStatus] ?? c.newStatus,
        action: c.action,
        reason: c.reason,
      })),
    findings: fndAll.map((f) => ({
      id: f.findingId,
      title: f.title,
      evidenceId: f.evidenceId ?? "—",
      desc: f.description,
      source: f.sourceRecord,
      occurredAt: withOffset(f.occurredAt),
      method: f.method,
      confidence: f.confidence,
      confidenceLabel: CONFIDENCE_LABELS[f.confidence] ?? f.confidence,
      note: f.reviewerNote,
      supporting: JSON.parse(f.supporting || "[]"),
      contradicting: JSON.parse(f.contradicting || "[]"),
      alternatives: JSON.parse(f.alternatives || "[]"),
    })),
    timeline: tlAll.map((t) => ({
      utc: utc(t.utcAt),
      local: t.localAt,
      offset: t.utcOffset,
      source: t.source,
      evidenceId: t.evidenceId ?? "—",
      description: t.description,
      confidence: t.confidence,
    })),
    limitations: [
      notAcquired.length
        ? `${notAcquired.length} adet delil (${notAcquired.map((e) => e.evidenceId).join(", ")}) henüz edinilmemiştir ve bu raporun bulgu kapsamına dahil değildir.`
        : "Kapsamdaki tüm deliller edinilmiştir.",
      ...evAll
        .filter((e) => !e.hashVerifiedAt)
        .map((e) => `${e.evidenceId} için bütünlük doğrulaması (hash verify) tamamlanmamıştır; analiz sonuçları bu delil için ön koşullu olarak değerlendirilmelidir.`),
      "Tüm veriler sentetik (kurgusal) olarak üretilmiştir; gerçek bir adli edinim değildir.",
      "Eksik veya çelişkili zaman kayıtları gizlenmemiş, zaman çizelgesinde ayrıca işaretlenmiştir.",
      "Şifreli içerikler (ör. TLS yükü, parola korumalı arşiv) açılmamış; yalnızca metadata üzerinden değerlendirme yapılmıştır.",
      "Bu rapor hukuki kanaat veya suç isnadı içermez; nesnel teknik değerlendirme niteliğindedir.",
    ],
    sections: SECTIONS.map((title, i) => ({ no: i + 1, title })),
    counts: {
      evidence: listedEvidence.length,
      acquired: listedEvidence.filter((e) => e.acquiredAt).length,
      verified: listedEvidence.filter((e) => e.hashVerifiedAt).length,
      findings: fndAll.length,
      timeline: tlAll.length,
    },
  };
  return payload;
}

export const SEED_EVIDENCE_COUNT = EVIDENCE.length;
