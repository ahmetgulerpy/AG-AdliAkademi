"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";

export type Snapshot = {
  profile: {
    id: number;
    displayName: string;
    role: string;
    mode: string;
    activeCaseId: string;
    level: string;
    totalMinutes: number;
    createdAt: string;
  };
  evidence: Array<Record<string, unknown> & { evidenceId: string; caseId: string; status: string }>;
  custody: Array<Record<string, unknown> & { id: number; evidenceId: string }>;
  findings: Array<Record<string, unknown> & { findingId: string; caseId: string }>;
  timeline: Array<Record<string, unknown> & { id: number; caseId: string }>;
  lessonProgress: Array<Record<string, unknown> & { lessonId: string; status: string; score?: number | null }>;
  labs: Array<Record<string, unknown> & { moduleId: string; status: string; stepsDone: string }>;
  quizAttempts: Array<Record<string, unknown> & { id: number; lessonId: string }>;
  reports: Array<Record<string, unknown> & { reportNo: string }>;
  audit: Array<Record<string, unknown> & { id: number }>;
  badges: Array<Record<string, unknown> & { code: string; label: string; earnedAt?: string | null }>;
  stats: {
    completedLessons: number;
    totalLessons: number;
    completedLabs: number;
    totalLabs: number;
    avgScore: number | null;
    quizCount: number;
    evidenceAcquired: number;
    evidenceTotal: number;
    findings: number;
    timeline: number;
    minutes: number;
    level: string;
  };
};

type Ctx = {
  snap: Snapshot | null;
  loading: boolean;
  toast: { kind: "ok" | "err"; text: string } | null;
  refresh: () => Promise<void>;
  act: (type: string, payload?: Record<string, unknown>) => Promise<{ ok: boolean; message: string; data?: unknown }>;
  clearToast: () => void;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: React.ReactNode }) {
  const [snap, setSnap] = useState<Snapshot | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<{ kind: "ok" | "err"; text: string } | null>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch("/api/state", { cache: "no-store" });
      const j = await r.json();
      if (j.ok) setSnap(j as Snapshot);
    } catch {
      /* sessiz: sonraki denemede tekrar */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const act = useCallback(
    async (type: string, payload: Record<string, unknown> = {}) => {
      try {
        const r = await fetch("/api/actions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ type, ...payload }),
        });
        const j = await r.json();
        setToast({ kind: j.ok ? "ok" : "err", text: j.message ?? (j.ok ? "Tamam" : "Hata") });
        if (timer.current) clearTimeout(timer.current);
        timer.current = setTimeout(() => setToast(null), 5200);
        await refresh();
        return j as { ok: boolean; message: string; data?: unknown };
      } catch (e) {
        setToast({ kind: "err", text: `Bağlantı hatası: ${String(e)}` });
        return { ok: false, message: "Bağlantı hatası" };
      }
    },
    [refresh],
  );

  return (
    <StoreCtx.Provider value={{ snap, loading, toast, refresh, act, clearToast: () => setToast(null) }}>
      {children}
    </StoreCtx.Provider>
  );
}

export function useStore(): Ctx {
  const c = useContext(StoreCtx);
  if (!c) throw new Error("StoreProvider bulunamadı.");
  return c;
}
