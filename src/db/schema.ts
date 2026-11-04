import { integer, sqliteTable, text, primaryKey } from "drizzle-orm/sqlite-core";

/**
 * AG CYBER LAB – yerel SQLite şeması.
 * Tüm veriler proje içindeki data/agcyberlab.db dosyasında saklanır.
 * DDL idempotent'tir: ilk çalıştırmada otomatik oluşturulur, sonraki
 * çalıştırmalarda mevcut kayıtlar silinmez.
 */

export const profiles = sqliteTable("profiles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  displayName: text("display_name").notNull().default("İncelemeci"),
  role: text("role").notNull().default("Analyst"),
  mode: text("mode").notNull().default("learning"), // learning | investigation
  activeCaseId: text("active_case_id").notNull().default("AG-DFIR-2026-001"),
  level: text("level").notNull().default("beginner"),
  totalMinutes: integer("total_minutes").notNull().default(0),
  createdAt: text("created_at").notNull(),
});

export const cases = sqliteTable("cases", {
  caseId: text("case_id").primaryKey(),
  title: text("title").notNull(),
  subject: text("subject").notNull(),
  status: text("status").notNull().default("open"),
  openedAt: text("opened_at").notNull(),
  scope: text("scope").notNull(),
  brief: text("brief").notNull(),
});

export const evidence = sqliteTable("evidence", {
  evidenceId: text("evidence_id").primaryKey(),
  caseId: text("case_id").notNull(),
  type: text("type").notNull(),
  sourceDevice: text("source_device").notNull(),
  serialNumber: text("serial_number"),
  acquisitionMethod: text("acquisition_method").notNull().default("Pending"),
  acquiredAt: text("acquired_at"),
  acquiredBy: text("acquired_by"),
  sizeBytes: integer("size_bytes").notNull().default(0),
  sha256: text("sha256"),
  hashVerifiedAt: text("hash_verified_at"),
  status: text("status").notNull().default("registered"),
  storageLocation: text("storage_location").notNull().default("Kilitli delil dolabı / RAF-A"),
  integrityNote: text("integrity_note"),
  reviewedAt: text("reviewed_at"),
});

/** Append-only delil muhafaza zinciri (Chain of Custody). */
export const custodyLogs = sqliteTable("custody_logs", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  seq: integer("seq").notNull().default(1),
  evidenceId: text("evidence_id").notNull(),
  caseId: text("case_id").notNull(),
  occurredAt: text("occurred_at").notNull(), // UTC ISO-8601
  utcOffset: text("utc_offset").notNull().default("+03:00"),
  operator: text("operator").notNull(),
  prevStatus: text("prev_status").notNull(),
  newStatus: text("new_status").notNull(),
  action: text("action").notNull(),
  reason: text("reason").notNull(),
  mode: text("mode").notNull().default("learning"),
  correctedFrom: integer("corrected_from"),
});

export const findings = sqliteTable("findings", {
  findingId: text("finding_id").primaryKey(),
  caseId: text("case_id").notNull(),
  evidenceId: text("evidence_id"),
  title: text("title").notNull(),
  description: text("description").notNull(),
  sourceRecord: text("source_record").notNull(),
  occurredAt: text("occurred_at").notNull(),
  method: text("method").notNull(),
  reviewerNote: text("reviewer_note").notNull().default(""),
  confidence: text("confidence").notNull().default("direct"), // direct|verified|supporting|circumstantial|unverified
  supporting: text("supporting").notNull().default("[]"),
  contradicting: text("contradicting").notNull().default("[]"),
  alternatives: text("alternatives").notNull().default("[]"),
  mode: text("mode").notNull().default("investigation"),
  createdAt: text("created_at").notNull(),
});

export const timelineEvents = sqliteTable("timeline_events", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  caseId: text("case_id").notNull(),
  evidenceId: text("evidence_id"),
  source: text("source").notNull(),
  utcAt: text("utc_at").notNull(),
  localAt: text("local_at").notNull(),
  utcOffset: text("utc_offset").notNull().default("+03:00"),
  description: text("description").notNull(),
  confidence: text("confidence").notNull().default("supporting"),
  related: text("related").notNull().default("[]"),
  imported: integer("imported").notNull().default(0),
});

export const lessonProgress = sqliteTable("lesson_progress", {
  lessonId: text("lesson_id").primaryKey(),
  status: text("status").notNull().default("not_started"), // not_started | in_progress | completed
  score: integer("score"),
  completedAt: text("completed_at"),
  mode: text("mode").notNull().default("learning"),
  seconds: integer("seconds").notNull().default(0),
});

export const labProgress = sqliteTable("lab_progress", {
  moduleId: text("module_id").primaryKey(),
  status: text("status").notNull().default("not_started"),
  stepsDone: text("steps_done").notNull().default("[]"),
  findingsCount: integer("findings_count").notNull().default(0),
  completedAt: text("completed_at"),
  mode: text("mode").notNull().default("learning"),
});

export const quizAttempts = sqliteTable("quiz_attempts", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  lessonId: text("lesson_id").notNull(),
  score: integer("score").notNull(),
  total: integer("total").notNull(),
  answers: text("answers").notNull(),
  mode: text("mode").notNull().default("learning"),
  createdAt: text("created_at").notNull(),
});

export const reports = sqliteTable("reports", {
  reportNo: text("report_no").primaryKey(),
  caseId: text("case_id").notNull(),
  createdAt: text("created_at").notNull(),
  author: text("author").notNull(),
  scope: text("scope").notNull(),
  payload: text("payload").notNull(),
});

export const auditLog = sqliteTable("audit_log", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  at: text("at").notNull(),
  actor: text("actor").notNull(),
  action: text("action").notNull(),
  target: text("target").notNull(),
  detail: text("detail").notNull().default(""),
});

export const settings = sqliteTable("settings", {
  key: text("key").primaryKey(),
  value: text("value").notNull(),
});

export const badges = sqliteTable("badges", {
  code: text("code").primaryKey(),
  label: text("label").notNull(),
  earnedAt: text("earned_at"),
});

export const DDL = `
CREATE TABLE IF NOT EXISTS profiles (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  display_name TEXT NOT NULL DEFAULT 'İncelemeci',
  role TEXT NOT NULL DEFAULT 'Analyst',
  mode TEXT NOT NULL DEFAULT 'learning',
  active_case_id TEXT NOT NULL DEFAULT 'AG-DFIR-2026-001',
  level TEXT NOT NULL DEFAULT 'beginner',
  total_minutes INTEGER NOT NULL DEFAULT 0,
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS cases (
  case_id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subject TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open',
  opened_at TEXT NOT NULL,
  scope TEXT NOT NULL,
  brief TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS evidence (
  evidence_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  type TEXT NOT NULL,
  source_device TEXT NOT NULL,
  serial_number TEXT,
  acquisition_method TEXT NOT NULL DEFAULT 'Pending',
  acquired_at TEXT,
  acquired_by TEXT,
  size_bytes INTEGER NOT NULL DEFAULT 0,
  sha256 TEXT,
  hash_verified_at TEXT,
  status TEXT NOT NULL DEFAULT 'registered',
  storage_location TEXT NOT NULL DEFAULT 'Kilitli delil dolabı / RAF-A',
  integrity_note TEXT,
  reviewed_at TEXT
);
CREATE TABLE IF NOT EXISTS custody_logs (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  seq INTEGER NOT NULL DEFAULT 1,
  evidence_id TEXT NOT NULL,
  case_id TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  utc_offset TEXT NOT NULL DEFAULT '+03:00',
  operator TEXT NOT NULL,
  prev_status TEXT NOT NULL,
  new_status TEXT NOT NULL,
  action TEXT NOT NULL,
  reason TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'learning',
  corrected_from INTEGER
);
CREATE TABLE IF NOT EXISTS findings (
  finding_id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  evidence_id TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  source_record TEXT NOT NULL,
  occurred_at TEXT NOT NULL,
  method TEXT NOT NULL,
  reviewer_note TEXT NOT NULL DEFAULT '',
  confidence TEXT NOT NULL DEFAULT 'direct',
  supporting TEXT NOT NULL DEFAULT '[]',
  contradicting TEXT NOT NULL DEFAULT '[]',
  alternatives TEXT NOT NULL DEFAULT '[]',
  mode TEXT NOT NULL DEFAULT 'investigation',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS timeline_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  case_id TEXT NOT NULL,
  evidence_id TEXT,
  source TEXT NOT NULL,
  utc_at TEXT NOT NULL,
  local_at TEXT NOT NULL,
  utc_offset TEXT NOT NULL DEFAULT '+03:00',
  description TEXT NOT NULL,
  confidence TEXT NOT NULL DEFAULT 'supporting',
  related TEXT NOT NULL DEFAULT '[]',
  imported INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lesson_progress (
  lesson_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'not_started',
  score INTEGER,
  completed_at TEXT,
  mode TEXT NOT NULL DEFAULT 'learning',
  seconds INTEGER NOT NULL DEFAULT 0
);
CREATE TABLE IF NOT EXISTS lab_progress (
  module_id TEXT PRIMARY KEY,
  status TEXT NOT NULL DEFAULT 'not_started',
  steps_done TEXT NOT NULL DEFAULT '[]',
  findings_count INTEGER NOT NULL DEFAULT 0,
  completed_at TEXT,
  mode TEXT NOT NULL DEFAULT 'learning'
);
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  lesson_id TEXT NOT NULL,
  score INTEGER NOT NULL,
  total INTEGER NOT NULL,
  answers TEXT NOT NULL,
  mode TEXT NOT NULL DEFAULT 'learning',
  created_at TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS reports (
  report_no TEXT PRIMARY KEY,
  case_id TEXT NOT NULL,
  created_at TEXT NOT NULL,
  author TEXT NOT NULL,
  scope TEXT NOT NULL,
  payload TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS audit_log (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  at TEXT NOT NULL,
  actor TEXT NOT NULL,
  action TEXT NOT NULL,
  target TEXT NOT NULL,
  detail TEXT NOT NULL DEFAULT ''
);
CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS badges (
  code TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  earned_at TEXT
);
CREATE INDEX IF NOT EXISTS idx_custody_evidence ON custody_logs(evidence_id, id);
CREATE INDEX IF NOT EXISTS idx_findings_case ON findings(case_id, created_at);
CREATE INDEX IF NOT EXISTS idx_timeline_case ON timeline_events(case_id, utc_at);
CREATE INDEX IF NOT EXISTS idx_evidence_case ON evidence(case_id);
`;

export type Profile = typeof profiles.$inferSelect;
export type CaseRecord = typeof cases.$inferSelect;
export type EvidenceRecord = typeof evidence.$inferSelect;
export type CustodyRecord = typeof custodyLogs.$inferSelect;
export type FindingRecord = typeof findings.$inferSelect;
export type TimelineRecord = typeof timelineEvents.$inferSelect;
export type LessonProgressRecord = typeof lessonProgress.$inferSelect;
export type LabProgressRecord = typeof labProgress.$inferSelect;
export type ReportRecord = typeof reports.$inferSelect;
