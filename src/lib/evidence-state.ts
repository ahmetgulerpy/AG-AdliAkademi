/**
 * Delil durum makinesi (Evidence State Machine)
 * Kayıt → Edinim → Bütünlük Doğrulama → İnceleme → Bulgular → Raporlama
 * Geçişler yalnızca ön koşullar sağlandığında kabul edilir.
 */

export const STATUS_LABELS: Record<string, string> = {
  none: "—",
  registered: "Kayıtlı",
  not_acquired: "Henüz edinilmedi",
  acquisition_pending: "Edinim bekliyor",
  acquiring: "Edinim devam ediyor",
  acquired: "Edinildi",
  hash_verified: "Hash doğrulandı",
  review_pending: "İnceleme bekliyor",
  reviewing: "İnceleniyor",
  reviewed: "İnceleme tamamlandı",
  findings_recorded: "Bulgular kaydedildi",
  reported: "Raporlandı",
  integrity_issue: "Bütünlük sorunu tespit edildi",
};

/** Durumun görsel sınıfı: mutlak / bekleme / uyarı */
export const STATUS_TONE: Record<string, "ok" | "wait" | "warn" | "idle"> = {
  registered: "idle",
  not_acquired: "wait",
  acquisition_pending: "wait",
  acquiring: "wait",
  acquired: "ok",
  hash_verified: "ok",
  review_pending: "wait",
  reviewing: "wait",
  reviewed: "ok",
  findings_recorded: "ok",
  reported: "ok",
  integrity_issue: "warn",
  none: "idle",
};

export type EvidenceView = {
  status: string;
  sha256: string | null;
  acquiredAt: string | null;
  acquisitionMethod: string;
  reviewedAt: string | null;
  findingsCount: number;
};

export type Transition =
  | "request_acquisition"
  | "start_acquisition"
  | "complete_acquisition"
  | "verify_hash"
  | "flag_integrity_issue"
  | "start_review"
  | "complete_review"
  | "record_findings"
  | "mark_reported"
  | "reacquire";

export const TRANSITION_LABELS: Record<Transition, string> = {
  request_acquisition: "Edinim talebi oluştur",
  start_acquisition: "Edinimi başlat",
  complete_acquisition: "Edinimi tamamla (SHA-256 üret)",
  verify_hash: "Bütünlüğü doğrula",
  flag_integrity_issue: "Bütünlük sorunu işaretle",
  start_review: "İncelemeyi başlat",
  complete_review: "İncelemeyi tamamla",
  record_findings: "Bulgu kaydına taşı",
  mark_reported: "Rapora ekle",
  reacquire: "Yeniden edinim yap",
};

type Rule = { to: string; check?: (e: EvidenceView) => string | null };

const rules: Record<Transition, { from: string[]; rule: Rule }> = {
  request_acquisition: { from: ["registered", "not_acquired"], rule: { to: "acquisition_pending" } },
  start_acquisition: { from: ["acquisition_pending", "acquiring", "registered"], rule: { to: "acquiring" } },
  complete_acquisition: {
    from: ["acquiring"],
    rule: {
      to: "acquired",
      check: (e) =>
        !e.acquisitionMethod || e.acquisitionMethod.trim().length < 4
          ? "Edinim yöntemi tanımlanmadan edinim tamamlanamaz."
          : null,
    },
  },
  verify_hash: {
    from: ["acquired"],
    rule: {
      to: "hash_verified",
      check: (e) =>
        !e.sha256
          ? "SHA-256 hesaplanmadan bütünlük doğrulaması yapılamaz. Önce edinimi tamamlayın."
          : e.sha256.length !== 64
            ? "Özet değeri 64 onaltılık karakter olmalıdır."
            : null,
    },
  },
  flag_integrity_issue: { from: ["acquired", "hash_verified", "reviewing", "reviewed"], rule: { to: "integrity_issue" } },
  start_review: {
    from: ["hash_verified", "review_pending", "reviewing"],
    rule: {
      to: "reviewing",
      check: (e) => (e.status === "reviewing" ? "İnceleme zaten devam ediyor." : null),
    },
  },
  complete_review: {
    from: ["reviewing"],
    rule: {
      to: "reviewed",
      check: (e) => (e.status !== "reviewing" ? "Önce incelemeyi başlatın." : null),
    },
  },
  record_findings: {
    from: ["reviewed", "findings_recorded"],
    rule: {
      to: "findings_recorded",
      check: (e) => (e.findingsCount < 1 ? "Bu delil için henüz bulgu kaydı yok." : null),
    },
  },
  mark_reported: {
    from: ["findings_recorded", "reviewed"],
    rule: {
      to: "reported",
      check: (e) =>
        e.findingsCount < 1
          ? "Bulgu kaydı olmadan delil raporlanamaz."
          : e.status !== "reported" && e.reviewedAt === null
            ? "İnceleme tamamlanmadan raporlanamaz."
            : null,
    },
  },
  reacquire: { from: ["integrity_issue", "acquired"], rule: { to: "acquiring" } },
};

export function availableTransitions(e: EvidenceView): { t: Transition; label: string; blocked?: string }[] {
  const out: { t: Transition; label: string; blocked?: string }[] = [];
  (Object.keys(rules) as Transition[]).forEach((t) => {
    const def = rules[t];
    if (!def.from.includes(e.status)) return;
    const blocked = def.rule.check?.(e) ?? undefined;
    out.push({ t, label: TRANSITION_LABELS[t], blocked });
  });
  return out;
}

export function applyTransition(
  e: EvidenceView,
  t: Transition,
): { ok: true; to: string } | { ok: false; error: string } {
  const def = rules[t];
  if (!def) return { ok: false, error: "Bilinmeyen işlem." };
  if (!def.from.includes(e.status)) {
    return {
      ok: false,
      error: `Geçersiz durum geçişi: "${STATUS_LABELS[e.status]}" durumundan "${TRANSITION_LABELS[t]}" işlemine izin verilmez. İzin verilen kaynak durumlar: ${def.from.map((s) => STATUS_LABELS[s]).join(", ")}.`,
    };
  }
  const err = def.rule.check?.(e);
  if (err) return { ok: false, error: err };
  return { ok: true, to: def.rule.to };
}

/** Durum makinesi: sırası korunan ana aşamalar (görselleştirme için). */
export const PIPELINE: { key: string; label: string; status: string[] }[] = [
  { key: "register", label: "Kayıt", status: ["registered", "not_acquired", "acquisition_pending"] },
  { key: "acquire", label: "Edinim", status: ["acquiring", "acquired"] },
  { key: "integrity", label: "Bütünlük Doğrulama", status: ["hash_verified", "integrity_issue"] },
  { key: "review", label: "İnceleme", status: ["review_pending", "reviewing", "reviewed"] },
  { key: "findings", label: "Bulgular", status: ["findings_recorded"] },
  { key: "report", label: "Raporlama", status: ["reported"] },
];
