"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  GraduationCap,
  ListChecks,
  FlaskConical,
  FolderSearch,
  PackageSearch,
  FileWarning,
  FileText,
  BookOpenText,
  TrendingUp,
} from "lucide-react";
import { useStore } from "./Store";

const NAV = [
  { href: "/", label: "Ana Panel", en: "Dashboard", Icon: LayoutDashboard },
  { href: "/akademi", label: "Akademi", en: "Academy", Icon: GraduationCap },
  { href: "/program", label: "Eğitim Programı", en: "Curriculum", Icon: ListChecks },
  { href: "/laboratuvar", label: "Laboratuvar", en: "Laboratory", Icon: FlaskConical },
  { href: "/dosyalar", label: "Soruşturma Dosyaları", en: "Cases", Icon: FolderSearch },
  { href: "/envanter", label: "Delil Envanteri", en: "Evidence", Icon: PackageSearch },
  { href: "/bulgular", label: "Bulgular", en: "Findings", Icon: FileWarning },
  { href: "/raporlar", label: "Raporlar", en: "Reports", Icon: FileText },
  { href: "/sozluk", label: "Teknik Sözlük", en: "Glossary", Icon: BookOpenText },
  { href: "/ilerleme", label: "Kullanıcı İlerlemesi", en: "Progress", Icon: TrendingUp },
];

function Mark() {
  return (
    <svg viewBox="0 0 40 40" className="h-9 w-9 shrink-0" aria-hidden="true">
      <defs>
        <linearGradient id="agc" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2F6BFF" />
          <stop offset="100%" stopColor="#38D6E6" />
        </linearGradient>
      </defs>
      <path d="M20 2.5 35.5 11v18L20 37.5 4.5 29V11Z" fill="none" stroke="url(#agc)" strokeWidth="1.6" />
      <path d="M20 7.6 31 13.8v12.4L20 32.4 9 26.2V13.8Z" fill="none" stroke="#38D6E6" strokeWidth="0.7" opacity="0.5" />
      <path d="M14.4 25.6 20 12.4l5.6 13.2" fill="none" stroke="#E8ECF2" strokeWidth="2.1" strokeLinecap="square" />
      <path d="M16.6 21.4h6.8" stroke="#F2C14E" strokeWidth="1.6" />
    </svg>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { snap, toast, act } = useStore();
  const mode = snap?.profile?.mode ?? "learning";
  const activeCase = snap?.profile?.activeCaseId ?? "AG-DFIR-2026-001";

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <div className="min-h-screen">
      {/* ————— Sol navigasyon rayı ————— */}
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[74px] flex-col border-r border-line bg-ink/95 backdrop-blur lg:flex xl:w-[228px]">
        <Link href="/" className="flex items-center gap-3 border-b border-line px-4 py-4 xl:px-5">
          <Mark />
          <span className="hidden leading-tight xl:block">
            <span className="block text-[15px] font-semibold tracking-tight text-paper">AG CYBER LAB</span>
            <span className="micro mt-1 block text-[9px]">Forensics Academy</span>
          </span>
        </Link>

        <nav className="flex-1 overflow-y-auto py-3">
          {NAV.map(({ href, label, en, Icon }) => {
            const on = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`group relative flex items-center gap-3 px-4 py-2.5 transition-colors duration-150 xl:px-5 ${
                  on ? "bg-blue/12 text-paper" : "text-mist2 hover:bg-white/4 hover:text-paper"
                }`}
                title={`${label} — ${en}`}
              >
                <span
                  className={`absolute left-0 top-0 h-full w-[2px] transition-all duration-150 ${
                    on ? "bg-cyan" : "bg-transparent group-hover:bg-line2"
                  }`}
                />
                <Icon size={17} strokeWidth={1.6} className={on ? "text-cyan" : ""} />
                <span className="hidden min-w-0 flex-1 truncate text-[13.5px] xl:block">{label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-line px-4 py-3 xl:px-5">
          <div className="micro mb-1.5 hidden xl:block">Session</div>
          <div className="font-mono text-[11px] text-mist tnum">
            {snap ? `${snap.stats.completedLessons}/${snap.stats.totalLessons} ders` : "…"}
          </div>
          <div className="font-mono text-[11px] text-mist tnum">
            {snap ? `${snap.stats.completedLabs}/${snap.stats.totalLabs} lab` : "…"}
          </div>
        </div>
      </aside>

      {/* ————— Üst vaka bağlam çubuğu ————— */}
      <header className="sticky top-0 z-30 border-b border-line bg-ink/92 backdrop-blur lg:pl-[74px] xl:pl-[228px]">
        <div className="flex h-[52px] items-center gap-3 px-4 sm:px-6">
          <div className="flex items-center gap-2 lg:hidden">
            <Mark />
          </div>
          <div className="micro hidden sm:block">Case ID</div>
          <span className="font-mono text-[12.5px] text-cyan tnum">{activeCase}</span>
          <span className="hidden h-4 w-px bg-line2 sm:block" />
          <div className="micro hidden md:block">Mode</div>

          <div className="flex items-center border border-line2 bg-panel p-[2px]">
            {(["learning", "investigation"] as const).map((m) => (
              <button
                key={m}
                onClick={() => void act("setMode", { mode: m })}
                className={`px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.14em] transition-colors duration-150 ${
                  mode === m
                    ? m === "learning"
                      ? "bg-blue text-white"
                      : "bg-amber text-charcoal"
                    : "text-mist hover:text-paper"
                }`}
              >
                {m === "learning" ? "Öğrenme" : "İnceleme"}
              </button>
            ))}
          </div>

          <div className="ml-auto flex items-center gap-3">
            <span className="hidden font-mono text-[11px] text-mist tnum sm:block">
              {snap ? `${snap.stats.evidenceAcquired}/${snap.stats.evidenceTotal} delil edinildi` : "…"}
            </span>
            <span className="hidden items-center gap-1.5 md:flex">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-good" />
              <span className="micro">SQLite · data/agcyberlab.db</span>
            </span>
            <span className="border border-line2 bg-panel px-2 py-1 font-mono text-[10px] uppercase tracking-[0.14em] text-mist2">
              {mode === "learning" ? "Learning" : "Investigation"}
            </span>
          </div>
        </div>

        {/* Küçük ekranlar için yatay navigasyon şeridi */}
        <nav className="flex gap-1 overflow-x-auto border-t border-line px-3 py-1.5 lg:hidden">
          {NAV.map(({ href, label, Icon }) => {
            const on = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap border px-2.5 py-1.5 text-[12px] transition-colors ${
                  on ? "border-cyan/60 bg-cyan/12 text-cyan" : "border-transparent text-mist2"
                }`}
              >
                <Icon size={13} strokeWidth={1.7} />
                {label}
              </Link>
            );
          })}
        </nav>
      </header>

      {/* ————— Uygulama içeriği ————— */}
      <main className="lg:pl-[74px] xl:pl-[228px]">
        <div className="mx-auto w-full max-w-[1560px] px-4 py-6 sm:px-6 sm:py-8">{children}</div>
        <footer className="mt-10 border-t border-line px-4 py-6 sm:px-6">
          <p className="max-w-4xl text-[12px] leading-relaxed text-mist">
            <span className="micro mr-2 text-amber">Simülasyon</span>
            AG CYBER LAB eğitim amaçlı sanal bir laboratuvardır. Bütün senaryolar, cihazlar, kullanıcılar ve kayıtlar
            sentetiktir. Kullanıcının kendi bilgisayarındaki dosyalara izinsiz erişilmez; gerçek disk, USB veya fiziksel
            bellek üzerinde otomatik işlem yapılmaz ve gerçek adli edinim yapılmış gibi davranılmaz. Gerçek
            incelemelerde uygun yetkilendirme, delil koruma, doğrulanmış araçlar ve belgelenmiş işlem zinciri gerekir.
          </p>
          <p className="mt-3 font-mono text-[10.5px] uppercase tracking-[0.14em] text-mist/70">
            AG CYBER LAB · Learn. Investigate. Analyze. Report.
          </p>
        </footer>
      </main>

      {/* ————— Bildirim ————— */}
      {toast && (
        <div
          role="status"
          className={`fixed bottom-5 right-5 z-50 max-w-[420px] border px-4 py-3 text-[13px] shadow-2xl ${
            toast.kind === "ok"
              ? "border-good/50 bg-[#0f1d19] text-paper"
              : "border-bad/50 bg-[#201214] text-paper"
          }`}
        >
          <span className={`micro mr-2 ${toast.kind === "ok" ? "text-good" : "text-bad"}`}>
            {toast.kind === "ok" ? "OK" : "HATA"}
          </span>
          {toast.text}
        </div>
      )}
    </div>
  );
}
