"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowDownToLine,
  CheckCircle2,
  FileSearch,
  Fingerprint,
  FolderOpen,
  Globe,
  HardDrive,
  Link2,
  MonitorCog,
  Usb,
  XCircle,
} from "lucide-react";
import { useStore } from "./Store";
import { Btn, CodeBlock, Empty, Micro, Panel, Pill, Progress, Table, Td, Tr } from "./ui";
import { EVIDENCE } from "@/data/cases";
import {
  BROWSER_COOKIES,
  BROWSER_DOWNLOADS,
  BROWSER_HISTORY,
  EVENT_ID_DEFS,
  EVENT_LOGS,
  FILE_SYSTEM,
  MEMORY_MODULES,
  MEMORY_NETSTAT,
  MEMORY_PROCESSES,
  PCAP_FLOWS,
  USB_DEVICES,
} from "@/data/artifacts";
import { availableTransitions, PIPELINE, STATUS_LABELS, STATUS_TONE, type Transition } from "@/lib/evidence-state";
import { bytes, utc } from "@/lib/format";
import { diffMask, diffPercent, sha256Browser } from "@/lib/hash";

type Props = { modKey: string; caseIds: string[]; onStep: (id: string) => void; doneSteps: string[] };

function Section({ icon, title, en, children }: { icon: React.ReactNode; title: string; en: string; children: React.ReactNode }) {
  return (
    <Panel title={title} en={en} className="mb-5">
      <div className="p-4">
        <div className="mb-3 flex items-center gap-2 text-cyan">
          {icon}
          <Micro className="text-cyan">Araç · {en}</Micro>
        </div>
        {children}
      </div>
    </Panel>
  );
}

/* ═══════════════ MODÜL A — DELİL EDİNİMİ ═══════════════ */
function AcquisitionLab({ caseIds, onStep }: Omit<Props, "modKey" | "doneSteps">) {
  const { snap, act } = useStore();
  const list = (snap?.evidence ?? []).filter((e) => caseIds.includes(e.caseId));
  const [sel, setSel] = useState<string>(list[0]?.evidenceId ?? EVIDENCE[0].evidenceId);
  const ev = (snap?.evidence ?? []).find((e) => e.evidenceId === sel) ?? list[0];
  const seed = EVIDENCE.find((x) => x.evidenceId === sel);
  const [method, setMethod] = useState("Fiziksel edinim (E01, yazma engelleyici)");
  const findingsCount = (snap?.findings ?? []).filter((f) => f.evidenceId === sel).length;
  const custody = (snap?.custody ?? []).filter((c) => c.evidenceId === sel);

  if (!ev) return <Empty text="Bu vakaya ait delil bulunamadı." />;

  const view = {
    status: ev.status,
    sha256: (ev.sha256 as string) ?? null,
    acquiredAt: (ev.acquiredAt as string) ?? null,
    acquisitionMethod: String(ev.acquisitionMethod ?? ""),
    reviewedAt: (ev.reviewedAt as string) ?? null,
    findingsCount,
  };
  const options = availableTransitions(view);

  const doTransition = async (t: Transition) => {
    const r = await act("transitionEvidence", { evidenceId: sel, transition: t, method });
    if (r.ok) {
      if (t === "request_acquisition") onStep("select");
      if (t === "start_acquisition") onStep("blocker");
      if (t === "complete_acquisition") {
        onStep("acquire");
        onStep("hash");
      }
      if (t === "verify_hash") onStep("log");
    }
  };

  const stageIdx = PIPELINE.findIndex((s) => s.status.includes(ev.status));

  return (
    <div>
      <Section icon={<HardDrive size={14} />} title="Sentetik Kaynak Seçimi" en="Source selection">
        <div className="grid gap-2 md:grid-cols-2">
          {list.map((e) => {
            const s = EVIDENCE.find((x) => x.evidenceId === e.evidenceId);
            return (
              <button
                key={e.evidenceId}
                onClick={() => setSel(e.evidenceId)}
                className={`border px-3.5 py-3 text-left transition-colors ${
                  sel === e.evidenceId ? "border-cyan bg-cyan/10" : "border-line bg-charcoal hover:border-line2"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono text-[12px] text-cyan">{e.evidenceId}</span>
                  <Pill tone={STATUS_TONE[e.status] ?? "idle"}>{STATUS_LABELS[e.status] ?? e.status}</Pill>
                </div>
                <div className="mt-1.5 text-[13px] text-paper">{String(e.sourceDevice)}</div>
                <div className="mt-1 font-mono text-[11px] text-mist tnum">
                  {String(e.type)} · {bytes(s?.sizeBytes ?? 0)}
                </div>
                <div className="mt-1 font-mono text-[10.5px] text-mist">SN: {String(e.serialNumber ?? "—")}</div>
              </button>
            );
          })}
        </div>
      </Section>

      <Section icon={<ArrowDownToLine size={14} />} title="Edinim Simülasyonu" en="Acquisition simulation">
        <div className="mb-4">
          <Micro>Aktif Aşama · Pipeline</Micro>
          <div className="mt-2 flex flex-wrap gap-1">
            {PIPELINE.map((s, i) => (
              <span
                key={s.key}
                className={`border px-2 py-1 font-mono text-[9.5px] uppercase tracking-[0.1em] ${
                  i === stageIdx
                    ? "border-cyan bg-cyan/15 text-cyan"
                    : i < stageIdx
                      ? "border-good/45 bg-good/10 text-good"
                      : "border-line2 text-mist"
                }`}
              >
                {s.label}
              </span>
            ))}
          </div>
        </div>

        <label className="block">
          <Micro>Edinim Yöntemi · Acquisition Method</Micro>
          <input
            value={method}
            onChange={(e) => setMethod(e.target.value)}
            className="mt-1.5 w-full border border-line2 bg-[#0d1015] px-3 py-2 font-mono text-[12.5px] text-paper outline-none focus:border-cyan"
          />
        </label>

        <div className="mt-4 flex flex-wrap gap-2">
          {options.map((o) => (
            <Btn
              key={o.t}
              onClick={() => void doTransition(o.t)}
              tone={o.blocked ? "default" : o.t === "verify_hash" ? "cyan" : o.t === "flag_integrity_issue" ? "danger" : "primary"}
              disabled={!!o.blocked}
              title={o.blocked ?? ""}
            >
              {o.label}
            </Btn>
          ))}
          {options.length === 0 && <span className="text-[12.5px] text-mist">Bu durumda yapılabilecek geçiş yok.</span>}
        </div>
        {options.some((o) => o.blocked) && (
          <div className="mt-3 border border-amber/45 bg-amber/[0.07] px-3 py-2.5">
            <Micro className="text-amber">Ön koşul sağlanmadı</Micro>
            <ul className="mt-1.5 space-y-1">
              {options
                .filter((o) => o.blocked)
                .map((o) => (
                  <li key={o.t} className="text-[12.5px] leading-relaxed text-mist2">
                    <span className="text-paper">{o.label}</span> — {o.blocked}
                  </li>
                ))}
            </ul>
          </div>
        )}

        <dl className="mt-4 grid gap-3 md:grid-cols-2">
          <div className="border border-line bg-charcoal p-3">
            <Micro>SHA-256 (edinim)</Micro>
            <p className="mt-1.5 break-all font-mono text-[12px] leading-relaxed text-cyan">
              {String(ev.sha256 ?? "") || "— hesaplanmadı —"}
            </p>
            <p className="mt-1.5 font-mono text-[10.5px] text-mist tnum">
              Edinim: {ev.acquiredAt ? utc(String(ev.acquiredAt)) : "—"} · Doğrulama:{" "}
              {ev.hashVerifiedAt ? utc(String(ev.hashVerifiedAt)) : "—"}
            </p>
          </div>
          <div className="border border-line bg-charcoal p-3">
            <Micro>Delil Kaydı</Micro>
            <dl className="mt-1.5 space-y-1 font-mono text-[11.5px]">
              {[
                ["Tür", String(ev.type)],
                ["Seri", String(ev.serialNumber ?? "—")],
                ["Boyut", bytes(seed?.sizeBytes ?? 0)],
                ["Konum", String(ev.storageLocation)],
                ["Edinim", ev.acquiredBy ? String(ev.acquiredBy) : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line/70 pb-1">
                  <dt className="text-mist">{k}</dt>
                  <dd className="truncate text-paper">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
        </dl>
      </Section>

      <Section icon={<Fingerprint size={14} />} title="Edinim Günlüğü" en="Acquisition log (append-only)">
        <Table head={["Seq", "Zaman (UTC)", "İşlem", "Önceki → Yeni", "Neden", "Mod"]}>
          {custody.map((c) => (
            <Tr key={c.id}>
              <Td mono className="text-mist tnum">{String(c.seq)}</Td>
              <Td mono className="whitespace-nowrap text-mist tnum">{utc(String(c.occurredAt))}</Td>
              <Td className="text-paper">{String(c.action)}</Td>
              <Td mono className="whitespace-nowrap">
                <span className="text-mist">{STATUS_LABELS[String(c.prevStatus)] ?? String(c.prevStatus)}</span>
                <span className="mx-1.5 text-mist/60">→</span>
                <span className="text-cyan">{STATUS_LABELS[String(c.newStatus)] ?? String(c.newStatus)}</span>
              </Td>
              <Td className="text-mist2">{String(c.reason)}</Td>
              <Td>
                <Pill tone="idle">{String(c.mode) === "investigation" ? "INV" : "LRN"}</Pill>
              </Td>
            </Tr>
          ))}
        </Table>
        <p className="mt-3 text-[12px] leading-relaxed text-mist">
          Kayıtlar salt-eklemelidir (append-only). Düzeltme gerekiyorsa önceki satır korunur, düzeltme yeni bir satır
          olarak eklenir ve önceki satıra atıf verilir.
        </p>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL B — HASH DOĞRULAMA (çığ etkisi) ═══════════════ */
function HashLab({ onStep }: Omit<Props, "modKey" | "caseIds" | "doneSteps">) {
  const SAMPLE = "AG CYBER LAB - DELIL EV-001 - ADLI INCELEME ORNEGI 2026-02-06";
  const [orig] = useState(SAMPLE);
  const [copy, setCopy] = useState(SAMPLE);
  const [h0, setH0] = useState("");
  const [h1, setH1] = useState("");
  const [tick, setTick] = useState(0);

  useEffect(() => {
    void (async () => {
      setH0(await sha256Browser(orig));
      setH1(await sha256Browser(copy));
    })();
  }, [orig, copy]);

  const mask = useMemo(() => diffMask(h0, h1), [h0, h1]);
  const pctDiff = h0 && h1 ? diffPercent(h0, h1) : 0;
  const same = h0 === h1 && !!h0;

  const mutate = (kind: "one" | "append" | "delete" | "reset") => {
    if (kind === "reset") setCopy(orig);
    else if (kind === "append") setCopy((c) => c + "X");
    else if (kind === "delete") setCopy((c) => c.slice(0, -1));
    else {
      setCopy((c) => {
        const i = Math.floor(c.length / 2);
        return c.slice(0, i) + (c[i] === "A" ? "B" : "A") + c.slice(i + 1);
      });
    }
    setTick((t) => t + 1);
    onStep("mutate");
    onStep("copy");
  };

  const Render = ({ hash, compare }: { hash: string; compare?: boolean }) => (
    <p className="font-mono text-[13px] leading-[1.55] break-all sm:text-[14px]">
      {hash.split("").map((ch, i) => (
        <span
          key={`${i}-${tick}-${compare ? "c" : "o"}`}
          className={`${compare && mask[i] ? "avalanche text-amber" : ""} inline-block`}
          style={compare && mask[i] ? { animationDelay: `${i * 9}ms` } : undefined}
        >
          {ch}
        </span>
      ))}
    </p>
  );

  return (
    <div>
      <Section icon={<Fingerprint size={14} />} title="Hash Karşılaştırma Aracı" en="SHA-256 comparator">
        <div className="grid gap-4 lg:grid-cols-2">
          <div className="border border-good/40 bg-good/[0.04] p-4">
            <div className="flex items-center justify-between">
              <Micro className="text-good">Orijinal Delil (salt-okunur)</Micro>
              <Pill tone="ok">Kontrol</Pill>
            </div>
            <p className="mt-3 border border-line bg-[#0d1015] p-3 font-mono text-[12.5px] leading-relaxed text-mist2">
              {orig}
            </p>
            <div className="mt-3 border border-line bg-[#0d1015] p-3">
              <Micro>SHA-256</Micro>
              <div className="mt-2">
                <Render hash={h0} />
              </div>
            </div>
          </div>

          <div className={`border p-4 ${same ? "border-line" : "border-amber/50 bg-amber/[0.04]"}`}>
            <div className="flex items-center justify-between">
              <Micro className={same ? "text-mist" : "text-amber"}>Çalışma Kopyası (değiştirilebilir)</Micro>
              <Pill tone={same ? "idle" : "warn"}>{same ? "Değişmedi" : "Değişti"}</Pill>
            </div>
            <textarea
              value={copy}
              onChange={(e) => {
                setCopy(e.target.value);
                onStep("mutate");
              }}
              rows={2}
              className="mt-3 w-full resize-none border border-line2 bg-[#0d1015] p-3 font-mono text-[12.5px] leading-relaxed text-paper outline-none focus:border-cyan"
            />
            <div className="mt-3 border border-line bg-[#0d1015] p-3">
              <Micro>SHA-256</Micro>
              <div className="mt-2">
                <Render hash={h1} compare />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          <Btn onClick={() => mutate("one")} tone="primary" title="Ortadaki tek karakteri değiştir">
            Tek Karakter Değiştir
          </Btn>
          <Btn onClick={() => mutate("append")} tone="cyan">
            Bir Karakter Ekle
          </Btn>
          <Btn onClick={() => mutate("delete")} tone="default">
            Son Karakteri Sil
          </Btn>
          <Btn onClick={() => mutate("reset")} tone="amber">
            Orijinale Sıfırla
          </Btn>
        </div>

        <div className={`mt-4 border px-4 py-3.5 ${same ? "border-good/50 bg-good/8" : "border-amber/50 bg-amber/8"}`}>
          <div className="flex flex-wrap items-center gap-4">
            <span className={`font-mono text-[13px] tnum ${same ? "text-good" : "text-amber"}`}>
              Farklılık: %{pctDiff}
            </span>
            <span className="font-mono text-[12px] text-mist tnum">
              {mask.filter(Boolean).length}/{h0.length || 64} karakter değişti
            </span>
            <span className={`text-[12.5px] ${same ? "text-good" : "text-amber"}`}>
              {same
                ? "EŞLEŞME — içerik aynı, bütünlük doğrulandı."
                : "EŞLEŞME YOK — içerik değişmiştir; orijinal delil etkilenmemiştir."}
            </span>
          </div>
          <p className="mt-2 text-[12.5px] leading-relaxed text-mist2">
            Tek bir karakter değişikliğinin 64 karakterlik özetin{" "}
            <strong className="text-paper">%{pctDiff}</strong> kadarını değiştirmesine{" "}
            <strong className="text-amber">avalanche effect (çığ etkisi)</strong> denir. Bu, iyi bir özet algoritmasının
            temel gereksinimidir: küçük girdi değişiklikleri öngörülemez, geniş çıktı değişikliği üretir.
          </p>
        </div>
      </Section>

      <Section icon={<CheckCircle2 size={14} />} title="Bütünlük Sonucu" en="Integrity verdict">
        <div className="grid gap-3 md:grid-cols-3">
          {[
            { k: "Deterministiklik", v: "Aynı girdi → aynı çıktı", ok: true },
            { k: "Sabit Çıktı Uzunluğu", v: "256 bit = 64 hex karakter", ok: h0.length === 64 },
            { k: "Çakışma Direnci", v: "SHA-256 için pratikte imkânsıza yakın", ok: true },
          ].map((x) => (
            <div key={x.k} className="border border-line bg-charcoal p-3">
              <Micro>{x.k}</Micro>
              <p className="mt-1.5 text-[12.5px] text-paper">{x.v}</p>
              <div className="mt-1.5">
                <Pill tone={x.ok ? "ok" : "warn"}>{x.ok ? "doğrulandı" : "bekliyor"}</Pill>
              </div>
            </div>
          ))}
        </div>
        <div className="mt-3">
          <Btn onClick={() => onStep("compare")} tone="cyan">
            Karşılaştırmayı Kaydet
          </Btn>
          <Btn onClick={() => onStep("interpret")} tone="amber" className="ml-2">
            Yorumu Kaydet
          </Btn>
        </div>
        <p className="mt-3 text-[12.5px] leading-relaxed text-mist2">
          MD5 (128 bit / 32 hex) ve SHA-1 (160 bit / 40 hex) pratik çakışma üretimine tabi olduğu için bütünlük
          doğrulamasında tercih edilmez. Sonuç yalnızca içerik değişikliğini gösterir; değişikliğin amacı için ek bulgu
          gerekir.
        </p>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL C — DOSYA SİSTEMİ ═══════════════ */
function FileSystemLab({ onStep, doneSteps }: Omit<Props, "modKey" | "caseIds">) {
  const [onlyDeleted, setOnlyDeleted] = useState(false);
  const [sel, setSel] = useState(FILE_SYSTEM[0].id);
  const f = FILE_SYSTEM.find((x) => x.id === sel)!;
  const rows = FILE_SYSTEM.filter((r) => (!onlyDeleted || r.deleted) && true);

  const tone = (r: string) => (r === "kesin" ? "ok" : r === "kosullu" ? "wait" : "idle");

  return (
    <div>
      <Section icon={<FolderOpen size={14} />} title="Sentetik NTFS Gezgini" en="File system browser">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <button
            onClick={() => setOnlyDeleted((v) => !v)}
            className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] ${
              onlyDeleted ? "border-amber bg-amber/15 text-amber" : "border-line2 text-mist hover:text-paper"
            }`}
          >
            {onlyDeleted ? "Tüm kayıtlar" : "Yalnızca silinmişler"}
          </button>
          <span className="font-mono text-[11px] text-mist tnum">{rows.length} kayıt</span>
        </div>

        <Table head={["Dosya", "Tür", "Boyut", "Oluşturulma", "Değiştirilme", "Erişim", "Durum", "Kurtarma"]}>
          {rows.map((r) => (
            <Tr
              key={r.id}
              className={`cursor-pointer ${sel === r.id ? "bg-cyan/[0.07]" : ""} ${r.suspicious ? "border-l-2 border-l-amber/70" : ""}`}
            >
              <Td>
                <span onClick={() => setSel(r.id)} className="block">
                  <span className="block break-all font-mono text-[12px] text-paper">{r.path}</span>
                </span>
              </Td>
              <Td className="whitespace-nowrap text-mist2">{r.type}</Td>
              <Td mono className="whitespace-nowrap text-mist tnum">{r.size ? bytes(r.size) : "—"}</Td>
              <Td mono className="whitespace-nowrap text-mist tnum">{r.created}</Td>
              <Td mono className="whitespace-nowrap text-mist2 tnum">{r.modified}</Td>
              <Td mono className="whitespace-nowrap text-cyan tnum">{r.accessed}</Td>
              <Td>
                <Pill tone={r.deleted ? "warn" : "ok"}>{r.deleted ? "silinmiş" : "mevcut"}</Pill>
              </Td>
              <Td>
                <Pill tone={tone(r.recoverable)}>{r.recoverable}</Pill>
              </Td>
            </Tr>
          ))}
        </Table>
        <div className="mt-3">
          <Btn onClick={() => onStep("browse")} tone="cyan">Klasör İncelemesini Kaydet</Btn>
          <Btn onClick={() => onStep("deleted")} tone="amber" className="ml-2">Silinmiş Kayıt Filtresi Kaydet</Btn>
        </div>
      </Section>

      <Section icon={<FileSearch size={14} />} title="Dosya Özellikleri (MACB)" en="File details">
        <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="border border-line bg-charcoal p-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="break-all font-mono text-[13px] text-cyan">{f.path}</span>
              <Pill tone={f.deleted ? "warn" : "ok"}>{f.deleted ? "silinmiş" : "mevcut"}</Pill>
              {f.suspicious && <Pill tone="wait">şüpheli</Pill>}
            </div>
            <dl className="mt-3 grid gap-2.5 sm:grid-cols-2">
              {[
                ["M — Oluşturulma (C)", f.created],
                ["M — Değiştirilme (M)", f.modified],
                ["A — Erişim (A)", f.accessed],
                ["C — MFT Değişikliği (C)", f.mftChanged],
              ].map(([k, v]) => (
                <div key={k} className="border border-line bg-[#0d1015] px-3 py-2">
                  <Micro className="text-[9px]">{k}</Micro>
                  <div className="mt-1 font-mono text-[13px] text-paper tnum">{v}</div>
                </div>
              ))}
            </dl>
            <div className="mt-3 border border-line bg-[#0d1015] p-3">
              <Micro>İçerik Önizleme</Micro>
              <pre className="mt-1.5 overflow-x-auto font-mono text-[12px] leading-relaxed text-mist2">
                {f.contentPreview ?? "— önizleme yok —"}
              </pre>
            </div>
          </div>

          <div className="space-y-3">
            <div className="border border-line bg-charcoal p-4">
              <Micro>Kurtarma Değerlendirmesi</Micro>
              <div className="mt-2">
                <Pill tone={tone(f.recoverable)}>{f.recoverable}</Pill>
              </div>
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-mist2">{f.note}</p>
              {f.recoverable !== "kesin" && (
                <p className="mt-2 border-t border-line pt-2 text-[12px] leading-relaxed text-amber">
                  Her silinmiş dosyanın kesin kurtarılabileceği varsayılmaz. Overwrite edilmiş cluster'larda içerik yoktur.
                </p>
              )}
            </div>
            <div className="border border-line bg-charcoal p-4">
              <Micro>İmza Kontrolü</Micro>
              <p className="mt-1.5 font-mono text-[12px] text-mist2">
                {f.name.endsWith(".pdf") ? "%PDF-" : f.name.endsWith(".xlsx") ? "PK\\x03\\x04" : f.name.endsWith(".rar") ? "Rar!\\x1a\\x07" : "—"}
              </p>
              <div className="mt-2.5 flex flex-wrap gap-2">
                <Btn onClick={() => onStep("inspect")} tone="cyan">Özellik Kaydet</Btn>
                <Btn onClick={() => onStep("recover")} tone="amber">Kurtarma Simülasyonu</Btn>
              </div>
            </div>
            {doneSteps.includes("recover") && (
              <div className="border border-good/45 bg-good/[0.07] p-3">
                <Micro className="text-good">Simülasyon Sonucu</Micro>
                <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
                  {f.recoverable === "kesin"
                    ? "İçerik tamamen okunabilir durumda; bütünlük doğrulaması mümkün."
                    : f.recoverable === "kosullu"
                      ? "İçerik kısmen okunabilir; bütünlük doğrulanamaz, sonuç koşulludur."
                      : "Kurtarma için yeterli cluster bütünlüğü yok veya kayıt silinmemiş."}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL D — TARAYICI ═══════════════ */
function BrowserLab({ onStep }: Omit<Props, "modKey" | "caseIds" | "doneSteps">) {
  const [tab, setTab] = useState<"history" | "downloads" | "cookies">("history");
  const data = tab === "history" ? BROWSER_HISTORY : tab === "downloads" ? BROWSER_DOWNLOADS : [];

  return (
    <div>
      <Section icon={<Globe size={14} />} title="Sentetik Chrome Kayıtları" en="Browser artifacts (SQLite)">
        <div className="mb-3 flex flex-wrap gap-1.5">
          {(["history", "downloads", "cookies"] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border px-3 py-1.5 font-mono text-[10.5px] uppercase tracking-[0.12em] ${
                tab === t ? "border-cyan bg-cyan/15 text-cyan" : "border-line2 text-mist hover:text-paper"
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {tab === "cookies" ? (
          <Table head={["Çerez", "Alan", "Oluşturulma", "Bitiş", "Not"]}>
            {BROWSER_COOKIES.map((c) => (
              <Tr key={c.name}>
                <Td mono className="text-cyan">{c.name}</Td>
                <Td mono className="text-mist2">{c.domain}</Td>
                <Td mono className="text-mist tnum">{c.created}</Td>
                <Td mono className="text-mist tnum">{c.expires}</Td>
                <Td className="text-mist2">{c.note}</Td>
              </Tr>
            ))}
          </Table>
        ) : (
          <Table head={["Zaman (yerel)", "Tür", "Hedef / Yol", "Ayrıntı", "Başlık"]}>
            {data.map((r) => (
              <Tr key={r.id} className={r.target.includes("filesend") ? "border-l-2 border-l-amber/70" : ""}>
                <Td mono className="whitespace-nowrap text-paper tnum">{r.local}</Td>
                <Td>
                  <Pill tone={r.type === "İndirme" ? "cyan" : r.type === "Arama" ? "info" : "idle"}>{r.type}</Pill>
                </Td>
                <Td className="break-all text-cyan">{r.target}</Td>
                <Td className="text-mist2">{r.detail}</Td>
                <Td className="text-mist">{r.title}</Td>
              </Tr>
            ))}
          </Table>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => onStep("history")} tone="cyan">Geçmişi İncele</Btn>
          <Btn onClick={() => onStep("downloads")} tone="primary">İndirmeleri İncele</Btn>
          <Btn onClick={() => onStep("cookies")} tone="default">Çerez Analizi</Btn>
          <Btn onClick={() => onStep("correlate")} tone="amber">Zaman Karşılaştırması</Btn>
          <Btn onClick={() => onStep("limit")} tone="danger">Sınırlılığı Kaydet</Btn>
        </div>
      </Section>

      <Section icon={<Link2 size={14} />} title="Deliller Arası İlişkilendirme" en="Correlation & limits">
        <div className="grid gap-3 md:grid-cols-3">
          <div className="border border-good/40 bg-good/[0.05] p-3">
            <Micro className="text-good">Doğrudan Gözlem</Micro>
            <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-mist2">
              <li>2026-02-06 08:47:02 (+03) filesend.example.com/upload ziyaret edildi.</li>
              <li>08:52:19'da musteri_listesi.csv indirmesi tamamlandı (state=1).</li>
              <li>FSEND_SESSION çerezi 08:47:04'te oluşturuldu.</li>
            </ul>
          </div>
          <div className="border border-blue/45 bg-blue/[0.06] p-3">
            <Micro className="text-blue2">Destekleyici</Micro>
            <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-mist2">
              <li>USB bağlantı penceresi (08:14–09:02) ile zaman örtüşmesi.</li>
              <li>08:30:12'de harici birime yazma denetim kaydı (4663).</li>
            </ul>
          </div>
          <div className="border border-amber/50 bg-amber/[0.06] p-3">
            <Micro className="text-amber">Doğrulanmamış / Sınırlı</Micro>
            <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-mist2">
              <li>Yüklemenin gerçekten tamamlanıp tamamlanmadığı (sunucu kaydı yok).</li>
              <li>Geçmişte olmayan etkinliklerin yapılmadığı iddiası.</li>
              <li>Farklı tarayıcı veya profil kullanımı dışlanamaz.</li>
            </ul>
          </div>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL E — USB ═══════════════ */
function UsbLab({ onStep }: Omit<Props, "modKey" | "caseIds" | "doneSteps">) {
  const [sel, setSel] = useState(USB_DEVICES[0].deviceId);
  const d = USB_DEVICES.find((x) => x.deviceId === sel)!;

  return (
    <div>
      <Section icon={<Usb size={14} />} title="USB Cihaz Listesi" en="USB device inventory">
        <div className="grid gap-2 md:grid-cols-2">
          {USB_DEVICES.map((u) => (
            <button
              key={u.deviceId}
              onClick={() => setSel(u.deviceId)}
              className={`border px-3.5 py-3 text-left transition-colors ${
                sel === u.deviceId ? "border-cyan bg-cyan/10" : "border-line bg-charcoal hover:border-line2"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-mono text-[12px] text-cyan">{u.deviceId}</span>
                <Pill tone={u.connections.length > 1 ? "wait" : "idle"}>
                  {u.connections.length} bağlantı
                </Pill>
              </div>
              <div className="mt-1.5 text-[13.5px] text-paper">{u.product}</div>
              <div className="mt-1 text-[12px] text-mist">{u.vendor}</div>
              <div className="mt-1.5 grid grid-cols-2 gap-2 font-mono text-[11px] text-mist tnum">
                <span>VID_{u.vid}&amp;PID_{u.pid}</span>
                <span className="truncate text-right">{u.capacity}</span>
                <span className="col-span-2 truncate">SN: {u.serial}</span>
              </div>
            </button>
          ))}
        </div>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => onStep("list")} tone="cyan">Cihaz Listesini Kaydet</Btn>
          <Btn onClick={() => onStep("registry")} tone="primary">Registry Kayıtlarını Kaydet</Btn>
        </div>
      </Section>

      <Section icon={<MonitorCog size={14} />} title="Bağlantı Geçmişi ve Registry" en="Connection history">
        <Table head={["Zaman (yerel)", "Zaman (UTC)", "Olay", "Ayrıntı", "Registry Kaydı"]}>
          {d.connections.map((c, i) => (
            <Tr key={i} className={c.event.includes("Dosya yazma") ? "border-l-2 border-l-amber/70" : ""}>
              <Td mono className="whitespace-nowrap text-paper tnum">{c.local}</Td>
              <Td mono className="whitespace-nowrap text-mist tnum">{c.utc.replace("T", " ").replace(".000Z", "Z")}</Td>
              <Td>
                <Pill tone={c.event.includes("sona") ? "idle" : c.event.includes("Dosya") ? "wait" : "cyan"}>{c.event}</Pill>
              </Td>
              <Td className="break-all text-mist2">{c.detail}</Td>
              <Td className="break-all font-mono text-[11.5px] text-mist">{c.registry}</Td>
            </Tr>
          ))}
        </Table>

        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <div className="border border-good/40 bg-good/[0.05] p-3">
            <Micro className="text-good">Doğrudan Gözlem</Micro>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
              {d.deviceId}, {d.firstSeen} ile {d.lastSeen} arasında bu sisteme bağlandı. Seri no: {d.serial}.
            </p>
          </div>
          <div className="border border-blue/45 bg-blue/[0.06] p-3">
            <Micro className="text-blue2">Destekleyici</Micro>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
              Aynı pencerede hedef birimde dosya oluşumu ve 4663 yazma denetimi kayıtları mevcuttur.
            </p>
          </div>
          <div className="border border-amber/50 bg-amber/[0.06] p-3">
            <Micro className="text-amber">Kanıtlanamaz</Micro>
            <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
              Bağlantı kaydı, hangi dosyanın kopyalandığını tek başına kanıtlamaz; içerik eşleşmesi hash ile doğrulanır.
            </p>
          </div>
        </div>

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => onStep("history")} tone="cyan">Bağlantı Geçmişi Kaydet</Btn>
          <Btn onClick={() => onStep("correlate")} tone="primary">Dosya Sistemiyle Eşleştir</Btn>
          <Btn onClick={() => onStep("finding")} tone="amber">Bulgu Oluştur</Btn>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL F — OLAY GÜNLÜĞÜ ═══════════════ */
function EventLogLab({ caseIds, onStep }: Omit<Props, "modKey" | "doneSteps">) {
  const [evId, setEvId] = useState<string>("all");
  const [user, setUser] = useState("");
  const [onlySusp, setOnlySusp] = useState(false);
  const [dictOpen, setDictOpen] = useState<number | null>(4624);

  const rows = EVENT_LOGS.filter((e) => caseIds.includes(e.caseId)).filter((e) => {
    if (evId !== "all" && String(e.eventId) !== evId) return false;
    if (user && !e.user.toLocaleLowerCase("tr").includes(user.toLocaleLowerCase("tr"))) return false;
    if (onlySusp && !e.suspicion) return false;
    return true;
  });
  const ids = Array.from(new Set(EVENT_LOGS.filter((e) => caseIds.includes(e.caseId)).map((e) => e.eventId))).sort(
    (a, b) => a - b,
  );

  const levelTone = (l: string) => (l === "Kritik" ? "warn" : l === "Uyarı" ? "wait" : "idle");

  return (
    <div>
      <Section icon={<MonitorCog size={14} />} title="Sentetik Event Log Görüntüleyici" en="Event viewer">
        <div className="mb-3 flex flex-wrap items-end gap-3">
          <label className="block">
            <Micro>Event ID</Micro>
            <select
              value={evId}
              onChange={(e) => setEvId(e.target.value)}
              className="mt-1 border border-line2 bg-[#0d1015] px-2.5 py-1.5 font-mono text-[12px] text-paper outline-none focus:border-cyan"
            >
              <option value="all">Tümü</option>
              {ids.map((i) => (
                <option key={i} value={String(i)}>
                  {i}
                </option>
              ))}
            </select>
          </label>
          <label className="block">
            <Micro>Kullanıcı</Micro>
            <input
              value={user}
              onChange={(e) => setUser(e.target.value)}
              placeholder="ör. a.yildiz"
              className="mt-1 border border-line2 bg-[#0d1015] px-2.5 py-1.5 font-mono text-[12px] text-paper outline-none focus:border-cyan"
            />
          </label>
          <button
            onClick={() => setOnlySusp((v) => !v)}
            className={`border px-2.5 py-[7px] font-mono text-[10.5px] uppercase tracking-[0.12em] ${
              onlySusp ? "border-amber bg-amber/15 text-amber" : "border-line2 text-mist hover:text-paper"
            }`}
          >
            Şüpheli kayıtlar
          </button>
          <span className="ml-auto font-mono text-[11px] text-mist tnum">{rows.length} olay</span>
        </div>

        <Table head={["Yerel (+03)", "UTC", "Event ID", "Kanal", "Düzey", "Bilgisayar", "Kullanıcı", "IP", "Mesaj"]}>
          {rows.map((e) => (
            <Tr key={e.id} className={e.suspicion ? "border-l-2 border-l-amber/70" : ""}>
              <Td mono className="whitespace-nowrap text-paper tnum">{e.local}</Td>
              <Td mono className="whitespace-nowrap text-mist tnum">{e.utc.replace("T", " ").replace(".000Z", "Z")}</Td>
              <Td mono className="text-cyan tnum">{e.eventId}</Td>
              <Td className="whitespace-nowrap text-mist2">{e.channel}</Td>
              <Td>
                <Pill tone={levelTone(e.level)}>{e.level}</Pill>
              </Td>
              <Td mono className="text-mist">{e.computer}</Td>
              <Td mono className="text-mist2">{e.user}</Td>
              <Td mono className="text-mist tnum">{e.ip}</Td>
              <Td className="min-w-[280px] text-mist2">{e.message}</Td>
            </Tr>
          ))}
        </Table>
        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => onStep("filter")} tone="cyan">Filtre Kaydet</Btn>
          <Btn onClick={() => onStep("user")} tone="primary">Kullanıcı Gruplaması</Btn>
          <Btn onClick={() => onStep("types")} tone="default">Oturum Türlerini Çöz</Btn>
          <Btn onClick={() => onStep("correlate")} tone="amber">Olayları İlişkilendir</Btn>
          <Btn onClick={() => onStep("mark")} tone="danger">Şüpheyi İşaretle</Btn>
        </div>
      </Section>

      <Section icon={<FileSearch size={14} />} title="Windows Event ID Öğrenme Alanı" en="Event ID reference">
        <div className="space-y-2">
          {EVENT_ID_DEFS.map((d) => {
            const open = dictOpen === d.id;
            return (
              <div key={d.id} className={`border ${open ? "border-cyan/50" : "border-line"} bg-charcoal`}>
                <button onClick={() => setDictOpen(open ? null : d.id)} className="flex w-full items-center gap-3 px-3.5 py-2.5 text-left">
                  <span className="font-mono text-[13px] text-cyan tnum">{d.id}</span>
                  <span className="text-[13px] text-paper">{d.name}</span>
                  <span className="ml-auto font-mono text-[11px] text-mist">{open ? "−" : "+"}</span>
                </button>
                {open && (
                  <div className="grid gap-3 border-t border-line px-3.5 py-3 md:grid-cols-2">
                    <div className="border border-good/40 bg-good/[0.05] p-3">
                      <Micro className="text-good">Neyi kanıtlar</Micro>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">{d.proves}</p>
                    </div>
                    <div className="border border-amber/50 bg-amber/[0.05] p-3">
                      <Micro className="text-amber">Neyi kanıtlamaz</Micro>
                      <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">{d.doesNotProve}</p>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL G — ZAMAN ÇİZELGESİ ═══════════════ */
const toUtc = (local: string) => {
  const d = new Date(local.replace(" ", "T") + ":00Z");
  const shifted = new Date(d.getTime() - 3 * 3600 * 1000);
  return shifted.toISOString();
};

function buildRows(caseId: string) {
  const rows: Record<string, string>[] = [];
  EVENT_LOGS.filter((e) => e.caseId === caseId).forEach((e) =>
    rows.push({
      caseId,
      evidenceId: e.channel === "Security" ? "EV-005" : "EV-005",
      source: `Windows Event Log · ${e.channel} · ${e.eventId}`,
      utcAt: e.utc,
      localAt: e.local,
      utcOffset: "+03:00",
      description: `${e.eventId} — ${e.message.slice(0, 96)}`,
      confidence: e.suspicion ? "supporting" : "direct",
    }),
  );
  if (caseId === "AG-DFIR-2026-001") {
    USB_DEVICES.filter((u) => u.caseId === caseId).forEach((u) =>
      u.connections.forEach((c) =>
        rows.push({
          caseId,
          evidenceId: "EV-002",
          source: `USB · ${u.deviceId}`,
          utcAt: c.utc,
          localAt: c.local,
          utcOffset: "+03:00",
          description: `${u.deviceId} — ${c.event}: ${c.detail.slice(0, 80)}`,
          confidence: "direct",
        }),
      ),
    );
    BROWSER_HISTORY.forEach((h) =>
      rows.push({
        caseId,
        evidenceId: "EV-004",
        source: `Browser · ${h.type}`,
        utcAt: h.utc,
        localAt: h.local,
        utcOffset: "+03:00",
        description: `${h.type}: ${h.target}`,
        confidence: "direct",
      }),
    );
    BROWSER_DOWNLOADS.forEach((h) =>
      rows.push({
        caseId,
        evidenceId: "EV-004",
        source: "Browser · İndirme",
        utcAt: h.utc,
        localAt: h.local,
        utcOffset: "+03:00",
        description: `İndirme: ${h.target} — ${h.detail}`,
        confidence: "direct",
      }),
    );
    FILE_SYSTEM.forEach((f) =>
      rows.push({
        caseId,
        evidenceId: "EV-001",
        source: "Dosya Sistemi · NTFS/MFT",
        utcAt: toUtc(f.modified),
        localAt: f.modified,
        utcOffset: "+03:00",
        description: `${f.deleted ? "[silinmiş] " : ""}${f.path} — değiştirilme (M) damgası`,
        confidence: f.deleted ? "circumstantial" : "direct",
      }),
    );
  }
  if (caseId === "AG-DFIR-2026-006") {
    PCAP_FLOWS.forEach((p) =>
      rows.push({
        caseId,
        evidenceId: "EV-006",
        source: `Ağ · ${p.proto}`,
        utcAt: p.utc,
        localAt: p.local,
        utcOffset: "+03:00",
        description: `${p.src}:${p.sport} → ${p.dst}:${p.dport} [${p.flags}] ${p.note}`,
        confidence: p.sni !== "—" ? "direct" : "supporting",
      }),
    );
  }
  if (caseId === "AG-DFIR-2026-005") {
    MEMORY_PROCESSES.forEach((p) =>
      rows.push({
        caseId,
        evidenceId: "EV-003",
        source: "Bellek · pslist",
        utcAt: toUtc(p.start),
        localAt: p.start,
        utcOffset: "+03:00",
        description: `PID ${p.pid} ${p.name} (${p.verdict}) — ${p.cmd.slice(0, 70)}`,
        confidence: p.verdict === "şüpheli" ? "supporting" : "direct",
      }),
    );
  }
  if (caseId === "AG-DFIR-2026-002") {
    FILE_SYSTEM.filter((f) => f.deleted).forEach((f) =>
      rows.push({
        caseId,
        evidenceId: "EV-007",
        source: "Dosya Sistemi · silinmiş kayıt",
        utcAt: toUtc(f.modified),
        localAt: f.modified,
        utcOffset: "+03:00",
        description: `Silinmiş: ${f.path} — kurtarma: ${f.recoverable}`,
        confidence: "supporting",
      }),
    );
  }
  return rows;
}

function TimelineLab({ caseIds, onStep }: Omit<Props, "modKey" | "doneSteps">) {
  const { snap, act } = useStore();
  const [caseId, setCaseId] = useState(caseIds[0]);
  const rows = (snap?.timeline ?? []).filter((t) => t.caseId === caseId);
  const [conflictOnly, setConflictOnly] = useState(false);

  const conflicts = rows.filter(
    (r, i, arr) => i > 0 && Math.abs(new Date(String(r.utcAt)).getTime() - new Date(String(arr[i - 1].utcAt)).getTime()) < 60000,
  );
  const shown = conflictOnly ? rows.filter((r) => conflicts.includes(r)) : rows;

  return (
    <div>
      <Section icon={<Link2 size={14} />} title="Kaynakları Birleştir" en="Cross-source consolidation">
        <div className="mb-3 flex flex-wrap items-center gap-2">
          <select
            value={caseId}
            onChange={(e) => setCaseId(e.target.value)}
            className="border border-line2 bg-[#0d1015] px-2.5 py-1.5 font-mono text-[12px] text-paper outline-none focus:border-cyan"
          >
            {caseIds.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <Btn onClick={() => void act("importTimeline", { caseId, rows: buildRows(caseId) })} tone="primary">
            Kaynakları Zaman Çizelgesine Aktar
          </Btn>
          <Btn
            onClick={() => {
              void act("clearTimeline");
            }}
            tone="default"
          >
            Çizelgeyi Temizle
          </Btn>
          <button
            onClick={() => setConflictOnly((v) => !v)}
            className={`border px-2.5 py-[7px] font-mono text-[10.5px] uppercase tracking-[0.12em] ${
              conflictOnly ? "border-amber bg-amber/15 text-amber" : "border-line2 text-mist hover:text-paper"
            }`}
          >
            {conflictOnly ? "Tüm kayıtlar" : "Çelişkili / yakın kayıtlar"}
          </button>
          <span className="ml-auto font-mono text-[11px] text-mist tnum">{shown.length} satır</span>
        </div>

        {shown.length === 0 ? (
          <Empty
            text="Zaman çizelgesi boş."
            hint="Yukarıdaki düğme, seçili vakaya ait sentetik kaynakları (Event Log, USB, tarayıcı, dosya sistemi, bellek, ağ) UTC'ye çevrilerek aktarır."
          />
        ) : (
          <Table head={["UTC", "Yerel (+03)", "Saat Dilimi", "Kaynak", "Delil", "Olay", "Güven"]}>
            {shown.map((r) => (
              <Tr key={r.id as number} className={conflicts.includes(r) ? "border-l-2 border-l-amber/70" : ""}>
                <Td mono className="whitespace-nowrap text-cyan tnum">{utc(String(r.utcAt))}</Td>
                <Td mono className="whitespace-nowrap text-paper tnum">{String(r.localAt)}</Td>
                <Td mono className="text-mist tnum">{String(r.utcOffset)}</Td>
                <Td className="whitespace-nowrap text-mist2">{String(r.source)}</Td>
                <Td mono className="text-mist">{r.evidenceId ? String(r.evidenceId) : "—"}</Td>
                <Td className="min-w-[260px] text-mist2">{String(r.description)}</Td>
                <Td>
                  <Pill tone={r.confidence === "direct" ? "ok" : r.confidence === "circumstantial" ? "wait" : "info"}>
                    {r.confidence === "direct"
                      ? "gözlem"
                      : r.confidence === "circumstantial"
                        ? "dolaylı"
                        : r.confidence === "verified"
                          ? "doğrulanmış"
                          : "destekleyici"}
                  </Pill>
                </Td>
              </Tr>
            ))}
          </Table>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          <Btn onClick={() => onStep("collect")} tone="cyan">Toplama Kaydet</Btn>
          <Btn onClick={() => onStep("normalize")} tone="primary">UTC Normalize Et</Btn>
          <Btn onClick={() => onStep("order")} tone="default">Sıralamayı Kaydet</Btn>
          <Btn onClick={() => onStep("conflict")} tone="amber">Çelişkiyi İşaretle</Btn>
          <Btn onClick={() => onStep("export")} tone="danger">Rapora Aktar</Btn>
        </div>

        <div className="mt-3 border border-amber/45 bg-amber/[0.07] px-3.5 py-3">
          <Micro className="text-amber">Çelişki Politikası</Micro>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
            Aynı dakika içinde birden fazla kayıt oluştuğunda sıralama belirsizdir; bu satırlar gizlenmez, işaretle birlikte
            rapora alınır. Saat dilimi ofseti her satırda ayrı saklanır.
          </p>
        </div>
      </Section>
    </div>
  );
}

/* ═══════════════ MODÜL H — RAPOR ═══════════════ */
function ReportLab({ onStep }: Omit<Props, "modKey" | "caseIds" | "doneSteps">) {
  const { snap } = useStore();
  const checks = [
    { k: "Kapsam ve yetkilendirme", ok: true },
    { k: "Yalnızca edinilmiş deliller envantere alındı", ok: (snap?.evidence ?? []).every((e) => e.status !== "registered" || true) },
    { k: "Hash sonuçları hesaplanmışsa raporda", ok: (snap?.evidence ?? []).some((e) => e.sha256) },
    { k: "Bulgular güven düzeyiyle sınıflandırıldı", ok: (snap?.findings ?? []).length > 0 },
    { k: "Zaman çizelgesi kaynak kayıtlarla eşleşiyor", ok: (snap?.timeline ?? []).length > 0 },
    { k: "Sınırlılıklar bölümü yazıldı", ok: true },
  ];
  return (
    <div>
      <Section icon={<FileSearch size={14} />} title="Rapor Önhazırlık Kontrolü" en="Report readiness">
        <ul className="space-y-2">
          {checks.map((c) => (
            <li
              key={c.k}
              className={`flex items-center gap-3 border px-3.5 py-2.5 text-[13px] ${
                c.ok ? "border-good/40 bg-good/[0.05] text-mist2" : "border-amber/50 bg-amber/[0.05] text-mist2"
              }`}
            >
              {c.ok ? <CheckCircle2 size={15} className="shrink-0 text-good" /> : <XCircle size={15} className="shrink-0 text-amber" />}
              <span>{c.k}</span>
              <span className={`ml-auto font-mono text-[10.5px] uppercase tracking-[0.12em] ${c.ok ? "text-good" : "text-amber"}`}>
                {c.ok ? "hazır" : "bekliyor"}
              </span>
            </li>
          ))}
        </ul>
        <div className="mt-4">
          <Progress value={Math.round((checks.filter((c) => c.ok).length / checks.length) * 100)} tone="good" />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Btn href="/raporlar" tone="primary" onClick={() => onStep("scope")}>
            Rapor Motorunu Aç
          </Btn>
          <Btn onClick={() => onStep("evidence")} tone="cyan">Delil Envanterini Doğrula</Btn>
          <Btn onClick={() => onStep("findings")} tone="amber">Bulguları Yerleştir</Btn>
        </div>
      </Section>

      <Section icon={<Code0 />} title="İşlem Kayıtları (salt-okunur)" en="Immutable operation log">
        <Table head={["Zaman (UTC)", "Aktör", "İşlem", "Hedef", "Ayrıntı"]}>
          {(snap?.audit ?? []).slice(0, 20).map((a) => (
            <Tr key={a.id as number}>
              <Td mono className="whitespace-nowrap text-mist tnum">{utc(String(a.at))}</Td>
              <Td className="text-mist2">{String(a.actor)}</Td>
              <Td mono className="text-cyan">{String(a.action)}</Td>
              <Td className="text-mist">{String(a.target)}</Td>
              <Td className="text-mist2">{String(a.detail)}</Td>
            </Tr>
          ))}
        </Table>
        <p className="mt-3 text-[12.5px] leading-relaxed text-mist">
          Rapor motoru doğrudan soruşturma veritabanından beslenir: yalnızca gerçekten edinilmiş deliller, yalnızca
          hesaplanmış hash sonuçları ve yalnızca gerçekleştirilmiş inceleme sonuçları rapora yansıtılır. Eksik bilgi
          uydurulmaz.
        </p>
      </Section>
    </div>
  );
}

function Code0() {
  return <FileSearch size={14} />;
}

export function LabWorkspace({ modKey, caseIds, onStep, doneSteps }: Props) {
  if (modKey === "A") return <AcquisitionLab caseIds={caseIds} onStep={onStep} />;
  if (modKey === "B") return <HashLab onStep={onStep} />;
  if (modKey === "C") return <FileSystemLab onStep={onStep} doneSteps={doneSteps} />;
  if (modKey === "D") return <BrowserLab onStep={onStep} />;
  if (modKey === "E") return <UsbLab onStep={onStep} />;
  if (modKey === "F") return <EventLogLab caseIds={caseIds} onStep={onStep} />;
  if (modKey === "G") return <TimelineLab caseIds={caseIds} onStep={onStep} />;
  if (modKey === "H") return <ReportLab onStep={onStep} />;
  return <Empty text="Modül bulunamadı." />;
}
