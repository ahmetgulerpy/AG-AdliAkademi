import type { ReactNode } from "react";

export function Micro({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <span className={`micro ${className}`}>{children}</span>;
}

export function Panel({
  children,
  className = "",
  title,
  en,
  right,
}: {
  children: ReactNode;
  className?: string;
  title?: string;
  en?: string;
  right?: ReactNode;
}) {
  return (
    <section className={`border border-line bg-panel/70 ${className}`}>
      {(title || right) && (
        <header className="flex items-center gap-3 border-b border-line px-4 py-2.5">
          <h2 className="text-[13.5px] font-semibold tracking-tight text-paper">{title}</h2>
          {en && <Micro className="text-[9px] text-mist/80">{en}</Micro>}
          <div className="ml-auto">{right}</div>
        </header>
      )}
      {children}
    </section>
  );
}

export function PageHead({
  kicker,
  title,
  en,
  desc,
  right,
}: {
  kicker: string;
  title: string;
  en?: string;
  desc?: string;
  right?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-col gap-4 border-b border-line pb-5 md:flex-row md:items-end">
      <div className="min-w-0 flex-1">
        <Micro className="text-cyan">{kicker}</Micro>
        <h1 className="mt-2 text-[26px] font-semibold leading-[1.1] tracking-tight text-paper sm:text-[32px]">
          {title}
        </h1>
        {en && <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.16em] text-mist">{en}</div>}
        {desc && <p className="mt-3 max-w-3xl text-[13.5px] leading-relaxed text-mist2">{desc}</p>}
      </div>
      {right && <div className="shrink-0">{right}</div>}
    </div>
  );
}

const TONES: Record<string, string> = {
  ok: "border-good/45 bg-good/10 text-good",
  wait: "border-amber/45 bg-amber/10 text-amber",
  warn: "border-bad/50 bg-bad/10 text-bad",
  idle: "border-line2 bg-white/3 text-mist2",
  info: "border-blue/50 bg-blue/12 text-blue2",
  cyan: "border-cyan/45 bg-cyan/10 text-cyan",
};

export function Pill({
  children,
  tone = "idle",
  className = "",
}: {
  children: ReactNode;
  tone?: keyof typeof TONES | string;
  className?: string;
}) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 border px-2 py-[3px] font-mono text-[10px] uppercase tracking-[0.12em] ${
        TONES[tone] ?? TONES.idle
      } ${className}`}
    >
      {children}
    </span>
  );
}

export function Stat({ label, value, sub, tone = "text-paper" }: { label: string; value: ReactNode; sub?: string; tone?: string }) {
  return (
    <div className="border border-line bg-panel/60 px-4 py-3.5">
      <Micro className="text-[9px]">{label}</Micro>
      <div className={`mt-2 font-mono text-[26px] leading-none tnum ${tone}`}>{value}</div>
      {sub && <div className="mt-2 text-[11.5px] text-mist">{sub}</div>}
    </div>
  );
}

export function Table({ head, children, className = "" }: { head: string[]; children: ReactNode; className?: string }) {
  return (
    <div className={`w-full overflow-x-auto ${className}`}>
      <table className="w-full min-w-[680px] border-collapse text-left">
        <thead>
          <tr className="border-b border-line bg-white/[0.02]">
            {head.map((h) => (
              <th key={h} className="micro px-3 py-2.5 font-normal whitespace-nowrap">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
}

export function Tr({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <tr className={`border-b border-line/70 align-top transition-colors hover:bg-white/[0.025] ${className}`}>{children}</tr>;
}

export function Td({ children, className = "", mono = false }: { children: ReactNode; className?: string; mono?: boolean }) {
  return (
    <td className={`px-3 py-2.5 text-[12.5px] ${mono ? "font-mono tnum" : ""} ${className}`}>{children}</td>
  );
}

/** Modül A–H durum boru hattı: Kayıt → Edinim → Bütünlük → İnceleme → Bulgular → Raporlama */
export function Pipeline({ stages, current }: { stages: string[]; current: string }) {
  const activeIdx = stages.indexOf(current);
  return (
    <ol className="flex flex-wrap items-stretch gap-1">
      {stages.map((s, i) => {
        const done = activeIdx > -1 && i < activeIdx;
        const now = i === activeIdx;
        return (
          <li key={s} className="flex items-center gap-1">
            <span
              className={`border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] transition-colors ${
                now
                  ? "border-cyan bg-cyan/15 text-cyan"
                  : done
                    ? "border-good/45 bg-good/10 text-good"
                    : "border-line2 text-mist"
              }`}
            >
              {s}
            </span>
            {i < stages.length - 1 && <span className="text-mist/50">›</span>}
          </li>
        );
      })}
    </ol>
  );
}

/** Etkileşimli diyagram: yatay boru hattı düğümleri (SVG değil, HTML). */
export function DiagramFlow({ title, nodes, note }: { title: string; nodes: { label: string; sub?: string }[]; note?: string }) {
  return (
    <div className="border border-line bg-charcoal hatch p-4">
      <Micro className="text-cyan">{title}</Micro>
      <div className="mt-4 flex flex-col gap-2 md:flex-row md:items-stretch">
        {nodes.map((n, i) => (
          <div key={n.label + i} className="flex flex-1 items-center gap-2">
            <div className="min-w-0 flex-1 border border-line2 bg-panel px-3 py-2.5">
              <div className="truncate text-[13px] font-medium text-paper">{n.label}</div>
              {n.sub && <div className="mt-1 truncate font-mono text-[10px] text-mist">{n.sub}</div>}
            </div>
            {i < nodes.length - 1 && <span className="hidden font-mono text-cyan md:block">→</span>}
          </div>
        ))}
      </div>
      {note && <p className="mt-3 border-t border-line pt-3 text-[12px] leading-relaxed text-mist2">{note}</p>}
    </div>
  );
}

export function CodeBlock({ children, caption }: { children: string; caption?: string }) {
  return (
    <figure className="border border-line bg-[#0d1015]">
      {caption && (
        <figcaption className="border-b border-line px-3 py-2">
          <Micro className="text-mist">{caption}</Micro>
        </figcaption>
      )}
      <pre className="overflow-x-auto px-4 py-3.5 font-mono text-[12px] leading-[1.65] text-mist2 whitespace-pre">
        {children}
      </pre>
    </figure>
  );
}

export function Btn({
  children,
  onClick,
  href,
  tone = "default",
  disabled,
  title,
  className = "",
}: {
  children: ReactNode;
  onClick?: () => void;
  href?: string;
  tone?: "default" | "primary" | "cyan" | "amber" | "danger";
  disabled?: boolean;
  title?: string;
  className?: string;
}) {
  const tones = {
    default: "border-line2 text-mist2 hover:border-mist hover:text-paper",
    primary: "border-blue bg-blue text-white hover:bg-blue2",
    cyan: "border-cyan/60 bg-cyan/12 text-cyan hover:bg-cyan/22",
    amber: "border-amber/60 bg-amber/12 text-amber hover:bg-amber/22",
    danger: "border-bad/55 bg-bad/10 text-bad hover:bg-bad/20",
  } as const;
  const cls = `inline-flex items-center gap-2 border px-3.5 py-2 font-mono text-[11px] uppercase tracking-[0.13em] transition-all duration-150 disabled:cursor-not-allowed disabled:opacity-40 ${tones[tone]} ${className}`;
  if (href && !disabled)
    return (
      <a href={href} onClick={onClick} className={cls} title={title}>
        {children}
      </a>
    );
  return (
    <button type="button" onClick={onClick} disabled={disabled} title={title} className={cls}>
      {children}
    </button>
  );
}

export function Progress({ value, tone = "blue" }: { value: number; tone?: "blue" | "cyan" | "good" }) {
  const v = Math.max(0, Math.min(100, value));
  const bar = tone === "cyan" ? "bg-cyan" : tone === "good" ? "bg-good" : "bg-blue";
  return (
    <div className="h-[5px] w-full bg-[#0e1116]" role="progressbar" aria-valuenow={v} aria-valuemin={0} aria-valuemax={100}>
      <div
        className={`h-full ${bar} transition-[width] duration-500 ease-out`}
        style={{ width: `${v}%` }}
      />
    </div>
  );
}

export function Empty({ text, hint }: { text: string; hint?: string }) {
  return (
    <div className="border border-dashed border-line2 px-5 py-8 text-center">
      <div className="text-[13px] text-mist2">{text}</div>
      {hint && <div className="mt-1.5 text-[12px] text-mist">{hint}</div>}
    </div>
  );
}
