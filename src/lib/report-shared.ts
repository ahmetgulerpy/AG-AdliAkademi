/** Sunucu bağımlılığı olmayan rapor tipleri ve sabitleri (istemci + sunucu güvenli). */

export type ReportPayload = {
  reportNo: string;
  caseId: string;
  createdAt: string;
  author: string;
  role: string;
  mode: string;
  caseTitle: string;
  subject: string;
  scope: string;
  brief: string;
  authorization: string;
  methods: string[];
  tools: string[];
  evidence: {
    evidenceId: string;
    type: string;
    sourceDevice: string;
    serial: string;
    status: string;
    statusLabel: string;
    acquiredAt: string;
    acquiredBy: string;
    method: string;
    size: string;
    sha256: string;
    hashState: string;
    storage: string;
  }[];
  custody: {
    seq: number;
    evidenceId: string;
    at: string;
    utc: string;
    operator: string;
    prev: string;
    next: string;
    action: string;
    reason: string;
  }[];
  findings: {
    id: string;
    title: string;
    evidenceId: string;
    desc: string;
    source: string;
    occurredAt: string;
    method: string;
    confidence: string;
    confidenceLabel: string;
    note: string;
    supporting: string[];
    contradicting: string[];
    alternatives: string[];
  }[];
  timeline: {
    utc: string;
    local: string;
    offset: string;
    source: string;
    evidenceId: string;
    description: string;
    confidence: string;
  }[];
  limitations: string[];
  sections: { no: number; title: string }[];
  counts: { evidence: number; acquired: number; verified: number; findings: number; timeline: number };
};

export const CONFIDENCE_LABELS: Record<string, string> = {
  direct: "Doğrudan gözlem",
  verified: "Teknik olarak doğrulanmış",
  supporting: "Destekleyici bulgu",
  circumstantial: "Dolaylı bulgu",
  unverified: "Doğrulanmamış iddia",
};

export const REPORT_SECTIONS = [
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

export const SIMULATION_NOTICE =
  "Bu platform eğitim amaçlı sanal bir laboratuvardır. Bütün senaryolar, cihazlar, kullanıcılar ve kayıtlar sentetiktir. Gerçek disk, USB veya bellek üzerinde hiçbir işlem yapılmaz; gerçek adli edinim yapılmış gibi davranılmaz.";
