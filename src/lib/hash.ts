import { createHash } from "node:crypto";

/** Sunucu tarafında gerçek SHA-256 (node:crypto). */
export function sha256(input: string | Buffer | Uint8Array): string {
  return createHash("sha256").update(input).digest("hex");
}

export function isHex64(v: unknown): v is string {
  return typeof v === "string" && /^[0-9a-f]{64}$/i.test(v);
}

/** Tarayıcı tarafında gerçek SHA-256 (Web Crypto API). */
export async function sha256Browser(input: string | ArrayBuffer | Uint8Array): Promise<string> {
  const data =
    typeof input === "string"
      ? new TextEncoder().encode(input)
      : input instanceof Uint8Array
        ? input.buffer.slice(input.byteOffset, input.byteOffset + input.byteLength)
        : input;
  const buf = await crypto.subtle.digest("SHA-256", data as ArrayBuffer);
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

/** Özet karşılaştırması: farklılık nibble (4 bit) düzeyinde işaretlenir. */
export function diffMask(a: string, b: string): boolean[] {
  const len = Math.max(a.length, b.length);
  const out: boolean[] = [];
  for (let i = 0; i < len; i++) out.push((a[i] ?? "") !== (b[i] ?? ""));
  return out;
}

export function diffPercent(a: string, b: string): number {
  if (a.length !== b.length || a.length === 0) return 100;
  let d = 0;
  for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) d++;
  return Math.round((d / a.length) * 1000) / 10;
}

export const SAMPLE_PLAINTEXT = "AG CYBER LAB - DELIL EV-001 - ADLI INCELEME ORNEGI 2026-02-06";
