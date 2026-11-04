import { NextResponse } from "next/server";
import { getSnapshot } from "@/lib/actions";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const snap = await getSnapshot();
    return NextResponse.json({ ok: true, ...snap });
  } catch (e) {
    return NextResponse.json({ ok: false, error: String(e) }, { status: 500 });
  }
}
