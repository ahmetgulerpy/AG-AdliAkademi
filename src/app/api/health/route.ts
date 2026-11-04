import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/actions";

export const runtime = "nodejs";

export async function GET() {
  try {
    const snap = await getSnapshot();
    return NextResponse.json({
      ok: true,
      db: "sqlite:data/agcyberlab.db",
      evidence: snap.stats.evidenceTotal,
      acquired: snap.stats.evidenceAcquired,
      findings: snap.stats.findings,
      lessons: `${snap.stats.completedLessons}/${snap.stats.totalLessons}`,
      labs: `${snap.stats.completedLabs}/${snap.stats.totalLabs}`,
      level: snap.stats.level,
      ts: new Date().toISOString(),
    });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
