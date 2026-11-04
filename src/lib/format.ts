/** Bayt, tarih ve sayı biçimlendirme — Türkçe. */

const NF = new Intl.NumberFormat("tr-TR");

export function bytes(n: number): string {
  if (!n) return "0 B";
  const u = ["B", "KB", "MB", "GB", "TB"];
  let i = 0;
  let v = n;
  while (v >= 1024 && i < u.length - 1) {
    v /= 1024;
    i++;
  }
  return `${NF.format(Math.round(v * 10) / 10)} ${u[i]}`;
}

export function num(n: number): string {
  return NF.format(n);
}

/** ISO UTC -> "2026-02-06 05:31:05Z" */
export function utc(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().replace("T", " ").replace(".000Z", "Z").replace("Z", "Z");
}

/** ISO UTC -> yerel (+03:00) eşleşmesi verilen ofsetle */
export function localFromUtc(iso: string | null | undefined, offsetHours = 3): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  const shifted = new Date(d.getTime() + offsetHours * 3600 * 1000);
  return shifted.toISOString().replace("T", " ").replace(".000Z", "");
}

export function withOffset(iso: string | null | undefined, offset = "+03:00"): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${d.toISOString().replace(".000Z", "")}${offset}`;
}

export function nowIso(): string {
  return new Date().toISOString();
}

export function dateOnly(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toISOString().slice(0, 10);
}
