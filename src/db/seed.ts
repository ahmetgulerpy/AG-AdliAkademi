import { db } from "./index";
import {
  auditLog,
  cases,
  custodyLogs,
  evidence,
  lessonProgress,
  labProgress,
  profiles,
  settings,
} from "./schema";
import { CASES, EVIDENCE } from "@/data/cases";

export const NOW = () => new Date().toISOString();

/**
 * Mevcut kayıtları silmeden, yalnızca eksik satırları ekleyen idempotent tohumlama.
 * (INSERT ... ON CONFLICT DO NOTHING mantığı manuel kontrol ile sağlanır.)
 */
export function ensureSeed() {
  const now = NOW();

  const existingProfiles = db.select().from(profiles).all();
  if (existingProfiles.length === 0) {
    db.insert(profiles)
      .values({
        displayName: "İncelemeci",
        role: "Dijital Adli Bilişim Analisti",
        mode: "learning",
        activeCaseId: "AG-DFIR-2026-001",
        level: "beginner",
        createdAt: now,
      })
      .run();
  }

  const existingCases = db.select().from(cases).all();
  const knownCaseIds = new Set(existingCases.map((c) => c.caseId));
  const caseRows = CASES.filter((c) => !knownCaseIds.has(c.caseId));
  if (caseRows.length > 0) db.insert(cases).values(caseRows).run();

  const existingEvidence = db.select().from(evidence).all();
  const knownEvidenceIds = new Set(existingEvidence.map((e) => e.evidenceId));
  const evidenceRows = EVIDENCE.filter((e) => !knownEvidenceIds.has(e.evidenceId));
  if (evidenceRows.length > 0) {
    db.insert(evidence)
      .values(
        evidenceRows.map((e) => ({
          evidenceId: e.evidenceId,
          caseId: e.caseId,
          type: e.type,
          sourceDevice: e.sourceDevice,
          serialNumber: e.serialNumber ?? null,
          acquisitionMethod: e.acquisitionMethod,
          acquiredAt: null,
          acquiredBy: null,
          sizeBytes: e.sizeBytes,
          sha256: null,
          hashVerifiedAt: null,
          status: e.status,
          storageLocation: e.storageLocation,
          integrityNote: null,
          reviewedAt: null,
        })),
      )
      .run();

    // Her delil için açılış (Kayıt) custody satırı — yalnızca ilk kez.
    for (const e of evidenceRows) {
      db.insert(custodyLogs)
        .values({
          seq: 1,
          evidenceId: e.evidenceId,
          caseId: e.caseId,
          occurredAt: now,
          utcOffset: "+03:00",
          operator: "Sistem / Kayıt Görevlisi",
          prevStatus: "none",
          newStatus: "registered",
          action: "Kayıt",
          reason: `${e.evidenceId} delil envanterine kaydedildi.`,
          mode: "learning",
        })
        .run();
    }
  }

  const knownModules = db.select().from(labProgress).all();
  const knownModuleIds = new Set(knownModules.map((m) => m.moduleId));
  const moduleIds = ["A", "B", "C", "D", "E", "F", "G", "H"];
  const moduleRows = moduleIds
    .filter((id) => !knownModuleIds.has(id))
    .map((id) => ({ moduleId: id, status: "not_started", stepsDone: "[]" }));
  if (moduleRows.length > 0) db.insert(labProgress).values(moduleRows).run();

  const knownLessons = db.select().from(lessonProgress).all();
  if (knownLessons.length === 0) {
    db.insert(settings)
      .values({ key: "seededAt", value: now })
      .onConflictDoNothing()
      .run();
  }

  const auditCount = db.select().from(auditLog).all().length;
  if (auditCount === 0) {
    db.insert(auditLog)
      .values({
        at: now,
        actor: "system",
        action: "bootstrap",
        target: "data/agcyberlab.db",
        detail: "Yerel SQLite veritabanı oluşturuldu; sentetik delil seti yüklendi.",
      })
      .run();
  }
}
