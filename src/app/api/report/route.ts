import { NextResponse } from "next/server";
import { buildReport, nextReportNo, type ReportPayload } from "@/lib/report";
import { runAction } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const caseId = searchParams.get("caseId") ?? "AG-DFIR-2026-001";
    const payload = buildReport(caseId);
    return NextResponse.json({ ok: true, payload });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const caseId = String(body.caseId ?? "AG-DFIR-2026-001");
    const payload: ReportPayload = buildReport(caseId);
    payload.reportNo = nextReportNo(caseId);
    await runAction({
      type: "saveReport",
      reportNo: payload.reportNo,
      caseId,
      author: payload.author,
      scope: payload.scope,
      payload,
    });
    return NextResponse.json({ ok: true, payload });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
