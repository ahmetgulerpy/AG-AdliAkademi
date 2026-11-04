"use client";

import { useEffect, useMemo, useState } from "react";
import { FileDown, FileJson, FileText, Printer, RefreshCw } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Empty, Micro, PageHead, Panel, Pill, Progress, Table, Td, Tr } from "@/components/ui";
import { CASES } from "@/data/cases";
import type { ReportPayload } from "@/lib/report-shared";
import { buildMarkdown, buildPdfDoc } from "@/lib/pdf";
import { utc } from "@/lib/format";

async function ensureVfs() {
  const mod: any = await import("pdfmake/build/pdfmake");
  const pdfMake = (mod?.default ?? mod) as any;
  const v: any = await import("pdfmake/build/vfs_fonts");
  const vfs = v?.default ?? v?.pdfMake?.vfs ?? v?.vfs;
  if (vfs && typeof pdfMake.addVirtualFileSystem === "function") {
    // pdfmake 0.3+: gömülü Roboto fontlarını (Türkçe destekli) sanal dosya sistemine kaydet
    pdfMake.addVirtualFileSystem(vfs);
  } else if (vfs) {
    pdfMake.vfs = vfs;
  }
  return pdfMake;
}

function download(name: string, mime: string, data: string) {
  const blob = new Blob([data], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export default function ReportsPage() {
  const { snap, act } = useStore();
  const active = snap?.profile?.activeCaseId ?? "AG-DFIR-2026-001";
  const [caseId, setCaseId] = useState(active);
  const [payload, setPayload] = useState<ReportPayload | null>(null);
  const [busy, setBusy] = useState(false);
  const [preview, setPreview] = useState<"none" | "md" | "json">("none");
  const [sec, setSec] = useState<number | null>(1);

  useEffect(() => {
    let alive = true;
    void (async () => {
      try {
        const r = await fetch(`/api/report?caseId=${encodeURIComponent(caseId)}`, { cache: "no-store" });
        const j = await r.json();
        if (alive && j.ok) {
          setPayload(j.payload as ReportPayload);
          setSec(1);
        }
      } catch {
        /* rapor daha sonra tekrar denenebilir */
      }
    })();
    return () => {
      alive = false;
    };
  }, [caseId]);

  const md = useMemo(() => (payload ? buildMarkdown(payload) : ""), [payload]);

  const generate = async () => {
    setBusy(true);
    try {
      const r = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ caseId }),
      });
      const j = await r.json();
      if (j.ok) setPayload(j.payload as ReportPayload);
    } finally {
      setBusy(false);
    }
  };

  const exportPdf = async () => {
    if (!payload) return;
    setBusy(true);
    try {
      const pdfMake = await ensureVfs();
      const doc = buildPdfDoc(payload);
      pdfMake.createPdf(doc).download(`${payload.reportNo}_${payload.caseId}.pdf`);
    } finally {
      setBusy(false);
    }
  };

  const saved = snap?.reports ?? [];
  const evidenceNotAcquired = (snap?.evidence ?? []).filter(
    (e) => e.caseId === caseId && !["acquired", "hash_verified", "review_pending", "reviewing", "reviewed", "findings_recorded", "reported"].includes(e.status),
  );

  return (
    <div>
      <div className="relative mb-7 overflow-hidden border border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(images/report-desk.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/92 to-charcoal/25" aria-hidden="true" />
        <div className="relative px-5 py-9 sm:px-8 sm:py-11">
          <Micro className="text-cyan">Adli Bilişim Raporu · Forensic Report</Micro>
          <h1 className="mt-3 max-w-3xl text-[30px] font-bold leading-[1.02] tracking-tight text-paper sm:text-[40px]">
            Profesyonel Raporlama Motoru
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-mist2">
            Rapor doğrudan soruşturma veritabanından beslenir. Yalnızca gerçekten edinilmiş deliller, yalnızca
            hesaplanmış hash sonuçları ve yalnızca gerçekleştirilmiş inceleme sonuçları eklenir; eksik bilgi uydurulmaz.
          </p>
        </div>
      </div>

      <PageHead
        kicker="Rapor No · AG-REPORT-XXXX"
        title="Rapor Oluştur ve Dışa Aktar"
        en="Generate & export"
        desc="Gerçek, seçilebilir metin içeren PDF; gömülü Türkçe destekli font, sayfa numarası, içindekiler, tablolar, delil kimlikleri ve tarih bilgileriyle üretilir."
        right={
          <div className="flex flex-col items-end gap-2">
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="border border-line2 bg-[#0d1015] px-3 py-2 font-mono text-[12px] text-paper outline-none focus:border-cyan"
            >
              {CASES.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId} — {c.title}
                </option>
              ))}
            </select>
            <div className="flex gap-2">
              <Btn onClick={() => void generate()} tone="primary" disabled={busy}>
                <RefreshCw size={13} /> Raporu Oluştur
              </Btn>
              <Btn onClick={() => void exportPdf()} tone="cyan" disabled={busy || !payload}>
                <FileDown size={13} /> PDF İndir
              </Btn>
            </div>
          </div>
        }
      />

      {!payload ? (
        <Empty text="Rapor yükleniyor…" />
      ) : (
        <div className="grid gap-5 xl:grid-cols-[300px_minmax(0,1fr)]">
          <aside className="space-y-4 xl:sticky xl:top-[68px] xl:self-start">
            <Panel title="Bölümler" en="18 sections">
              <ol className="max-h-[520px] divide-y divide-line/70 overflow-y-auto">
                {payload.sections.map((s) => (
                  <li key={s.no}>
                    <button
                      onClick={() => setSec(s.no)}
                      className={`flex w-full items-center gap-2.5 px-3.5 py-2.5 text-left transition-colors ${
                        sec === s.no ? "bg-cyan/10 text-cyan" : "text-mist2 hover:bg-white/[0.03]"
                      }`}
                    >
                      <span className="font-mono text-[11px] tnum">{String(s.no).padStart(2, "0")}</span>
                      <span className="text-[12.5px]">{s.title}</span>
                    </button>
                  </li>
                ))}
              </ol>
            </Panel>

            <Panel title="Rapor Bütünlüğü" en="Report integrity">
              <div className="space-y-3 p-4">
                <div>
                  <div className="flex justify-between font-mono text-[11.5px]">
                    <span className="text-mist">Edinilmiş delil</span>
                    <span className="text-good tnum">
                      {payload.counts.acquired}/{payload.counts.evidence}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress
                      value={payload.counts.evidence ? Math.round((payload.counts.acquired / payload.counts.evidence) * 100) : 0}
                      tone="good"
                    />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between font-mono text-[11.5px]">
                    <span className="text-mist">Hash doğrulanmış</span>
                    <span className="text-cyan tnum">
                      {payload.counts.verified}/{payload.counts.evidence}
                    </span>
                  </div>
                  <div className="mt-1.5">
                    <Progress
                      value={payload.counts.evidence ? Math.round((payload.counts.verified / payload.counts.evidence) * 100) : 0}
                      tone="cyan"
                    />
                  </div>
                </div>
                <dl className="space-y-1.5 font-mono text-[11.5px]">
                  {[
                    ["Bulgu", payload.counts.findings],
                    ["Custody", payload.custody.length],
                    ["Zaman kaydı", payload.counts.timeline],
                    ["Sınırlılık", payload.limitations.length],
                  ].map(([k, v]) => (
                    <div key={String(k)} className="flex justify-between border-b border-line pb-1.5">
                      <dt className="text-mist">{k}</dt>
                      <dd className="text-paper tnum">{v}</dd>
                    </div>
                  ))}
                </dl>
                {evidenceNotAcquired.length > 0 && (
                  <div className="border border-amber/45 bg-amber/[0.07] p-2.5">
                    <Micro className="text-amber">Rapora alınmadı</Micro>
                    <p className="mt-1.5 text-[12px] leading-relaxed text-mist2">
                      {evidenceNotAcquired.map((e) => e.evidenceId).join(", ")} henüz edinilmemiştir; envanterde
                      görünür ancak raporun delil tablolarına dahil edilmez.
                    </p>
                  </div>
                )}
              </div>
            </Panel>

            <Panel title="Dışa Aktarım" en="Export">
              <div className="space-y-2 p-4">
                <Btn onClick={() => void exportPdf()} tone="cyan" className="w-full justify-center" disabled={busy}>
                  <FileDown size={13} /> PDF (gerçek belge)
                </Btn>
                <Btn onClick={() => download(`${payload.reportNo}.md`, "text/markdown", md)} tone="default" className="w-full justify-center">
                  <FileText size={13} /> Markdown
                </Btn>
                <Btn
                  onClick={() => download(`${payload.reportNo}.json`, "application/json", JSON.stringify(payload, null, 2))}
                  tone="default"
                  className="w-full justify-center"
                >
                  <FileJson size={13} /> JSON
                </Btn>
                <Btn onClick={() => window.print()} tone="amber" className="w-full justify-center">
                  <Printer size={13} /> Yazdır
                </Btn>
                <div className="flex gap-1.5 pt-1">
                  {(["none", "md", "json"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPreview(p === preview ? "none" : p)}
                      className={`flex-1 border px-2 py-1.5 font-mono text-[10px] uppercase tracking-[0.1em] ${
                        preview === p ? "border-cyan bg-cyan/15 text-cyan" : "border-line2 text-mist hover:text-paper"
                      }`}
                    >
                      {p === "none" ? "önizleme yok" : p}
                    </button>
                  ))}
                </div>
              </div>
            </Panel>
          </aside>

          <div className="min-w-0 space-y-5">
            {preview !== "none" ? (
              <Panel
                title={preview === "md" ? "Markdown Önizleme" : "JSON Önizleme"}
                en={preview === "md" ? "Markdown" : "JSON"}
                right={<Pill tone="cyan">{preview === "md" ? `${md.split("\n").length} satır` : `${JSON.stringify(payload).length} bayt`}</Pill>}
              >
                <pre className="max-h-[70vh] overflow-auto bg-[#0d1015] p-4 font-mono text-[12px] leading-relaxed text-mist2">
                  {preview === "md" ? md : JSON.stringify(payload, null, 2)}
                </pre>
              </Panel>
            ) : (
              <>
                <Panel
                  title={`Bölüm ${String(sec).padStart(2, "0")} — ${payload.sections.find((s) => s.no === sec)?.title ?? ""}`}
                  en={payload.reportNo}
                  right={<Pill tone="cyan">{payload.caseId}</Pill>}
                >
                  <div className="p-5">
                    <SectionView sec={sec ?? 1} p={payload} />
                  </div>
                </Panel>

                <Panel title="Kayıtlı Raporlar" en="Stored reports">
                  {saved.length === 0 ? (
                    <div className="p-4">
                      <Empty text="Henüz kayıtlı rapor yok." hint="“Raporu Oluştur” düğmesi raporu veritabanına kaydeder ve ilgili delilleri raporlanmış durumuna geçirir." />
                    </div>
                  ) : (
                    <Table head={["Rapor No", "Dosya", "Tarih (UTC)", "Hazırlayan", "Kapsam"]}>
                      {saved.map((r) => (
                        <Tr key={String(r.reportNo)}>
                          <Td mono className="text-cyan">{String(r.reportNo)}</Td>
                          <Td mono className="text-mist">{String(r.caseId)}</Td>
                          <Td mono className="whitespace-nowrap text-mist tnum">{utc(String(r.createdAt))}</Td>
                          <Td className="text-mist2">{String(r.author)}</Td>
                          <Td className="max-w-[340px] truncate text-mist2">{String(r.scope)}</Td>
                        </Tr>
                      ))}
                    </Table>
                  )}
                </Panel>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SectionView({ sec, p }: { sec: number; p: ReportPayload }) {
  switch (sec) {
    case 1:
      return (
        <div>
          <h2 className="font-serif text-[22px] font-semibold text-paper">AG CYBER LAB</h2>
          <div className="mt-1 font-mono text-[11px] uppercase tracking-[0.2em] text-blue2">
            Digital Forensics Academy &amp; Investigation Environment
          </div>
          <h3 className="mt-5 text-[19px] font-semibold text-paper">DİJİTAL ADLİ BİLİŞİM İNCELEME RAPORU</h3>
          <p className="mt-1 font-mono text-[12px] text-mist">Digital Forensic Examination Report</p>
          <dl className="mt-6 grid gap-2.5 sm:grid-cols-2">
            {[
              ["Rapor Numarası", p.reportNo],
              ["Dosya Numarası", p.caseId],
              ["İnceleme Konusu", p.caseTitle],
              ["Rapor Tarihi (UTC)", p.createdAt],
              ["Hazırlayan", `${p.author} — ${p.role}`],
              ["Saat Dilimi", "UTC / ISO 8601 · yerel +03:00"],
            ].map(([k, v]) => (
              <div key={k} className="border border-line bg-charcoal px-3.5 py-2.5">
                <Micro className="text-[9px]">{k}</Micro>
                <div className="mt-1 text-[13.5px] text-paper">{v}</div>
              </div>
            ))}
          </dl>
          <p className="mt-5 border-l-2 border-amber pl-3.5 text-[13px] leading-relaxed text-mist2">
            Bu rapor nesnel teknik değerlendirme niteliğindedir; suç isnadı veya kesin hukuki hüküm içermez. Bütün veriler
            sentetik (kurgusal) olarak üretilmiştir.
          </p>
        </div>
      );
    case 2:
      return (
        <Table head={["Alan", "Değer"]}>
          <Tr>
            <Td className="text-mist">Case ID</Td>
            <Td mono className="text-paper">{p.caseId}</Td>
          </Tr>
          <Tr>
            <Td className="text-mist">Başlık</Td>
            <Td className="text-paper">{p.caseTitle}</Td>
          </Tr>
          <Tr>
            <Td className="text-mist">İncelemeci</Td>
            <Td className="text-paper">
              {p.author} — {p.role}
            </Td>
          </Tr>
          <Tr>
            <Td className="text-mist">Kapsamdaki delil</Td>
            <Td mono className="text-paper tnum">{p.counts.evidence}</Td>
          </Tr>
          <Tr>
            <Td className="text-mist">Hash doğrulanmış</Td>
            <Td mono className="text-cyan tnum">{p.counts.verified}</Td>
          </Tr>
        </Table>
      );
    case 3:
      return (
        <div className="space-y-3">
          <p className="text-[14px] leading-relaxed text-paper/90">{p.brief}</p>
          <div className="border border-line bg-charcoal p-3.5">
            <Micro>Kapsam</Micro>
            <p className="mt-1.5 text-[13px] leading-relaxed text-mist2">{p.scope}</p>
          </div>
        </div>
      );
    case 4:
      return <p className="text-[14px] leading-relaxed text-paper/90">{p.authorization}</p>;
    case 5:
      return (
        <ol className="space-y-2.5">
          {p.methods.map((m, i) => (
            <li key={m} className="flex gap-3 text-[13.5px] leading-relaxed text-mist2">
              <span className="font-mono text-cyan tnum">{String(i + 1).padStart(2, "0")}</span>
              <span>{m}</span>
            </li>
          ))}
        </ol>
      );
    case 6:
      return (
        <ul className="space-y-2">
          {p.tools.map((t) => (
            <li key={t} className="border border-line bg-charcoal px-3.5 py-2.5 text-[13px] text-mist2">
              {t}
            </li>
          ))}
        </ul>
      );
    case 7:
      return p.evidence.length ? (
        <Table head={["Delil", "Tür", "Kaynak", "Seri", "Boyut", "Durum"]}>
          {p.evidence.map((e) => (
            <Tr key={e.evidenceId}>
              <Td mono className="text-cyan">{e.evidenceId}</Td>
              <Td className="text-mist2">{e.type}</Td>
              <Td className="text-mist2">{e.sourceDevice}</Td>
              <Td mono className="text-mist">{e.serial}</Td>
              <Td mono className="text-mist tnum">{e.size}</Td>
              <Td>
                <Pill tone="ok">{e.statusLabel}</Pill>
              </Td>
            </Tr>
          ))}
        </Table>
      ) : (
        <Empty text="Edinilmiş delil yok — rapora delil tablosu eklenmedi." />
      );
    case 8:
      return (
        <Table head={["Delil", "Yöntem", "Edinim (+03)", "Edinim yapan"]}>
          {p.evidence.map((e) => (
            <Tr key={e.evidenceId}>
              <Td mono className="text-cyan">{e.evidenceId}</Td>
              <Td className="text-mist2">{e.method}</Td>
              <Td mono className="whitespace-nowrap text-paper tnum">{e.acquiredAt}</Td>
              <Td className="text-mist">{e.acquiredBy}</Td>
            </Tr>
          ))}
        </Table>
      );
    case 9:
      return p.evidence.length ? (
        <Table head={["Delil", "SHA-256", "Durum"]}>
          {p.evidence.map((e) => (
            <Tr key={e.evidenceId}>
              <Td mono className="text-cyan">{e.evidenceId}</Td>
              <Td mono className="break-all text-mist2">
                {e.sha256 || <span className="text-amber">— hesaplanmadı —</span>}
              </Td>
              <Td>
                <Pill tone={e.hashState === "Doğrulandı" ? "ok" : e.hashState === "Hesaplanmadı" ? "warn" : "wait"}>
                  {e.hashState}
                </Pill>
              </Td>
            </Tr>
          ))}
        </Table>
      ) : (
        <Empty text="Hash satırı yok." />
      );
    case 11:
      return p.findings.length ? (
        <div className="space-y-4">
          {p.findings.map((f) => (
            <article key={f.id} className="border border-line bg-charcoal p-4">
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="font-mono text-[12.5px] text-blue2">{f.id}</span>
                <Pill tone={f.confidence === "direct" ? "ok" : f.confidence === "unverified" ? "warn" : "info"}>
                  {f.confidenceLabel}
                </Pill>
                <Pill tone="cyan">{f.evidenceId}</Pill>
                <span className="ml-auto font-mono text-[11px] text-mist tnum">{f.occurredAt}</span>
              </div>
              <h4 className="mt-2 text-[15px] font-medium text-paper">{f.title}</h4>
              <p className="mt-1.5 text-[13.5px] leading-relaxed text-mist2">{f.desc}</p>
              <div className="mt-3 grid gap-2.5 md:grid-cols-3">
                <div className="border border-line bg-[#0d1015] p-2.5">
                  <Micro className="text-[9px]">Kaynak</Micro>
                  <p className="mt-1 text-[12.5px] text-mist2">{f.source}</p>
                </div>
                <div className="border border-line bg-[#0d1015] p-2.5">
                  <Micro className="text-[9px]">Yöntem</Micro>
                  <p className="mt-1 text-[12.5px] text-mist2">{f.method}</p>
                </div>
                <div className="border border-line bg-[#0d1015] p-2.5">
                  <Micro className="text-[9px]">Not</Micro>
                  <p className="mt-1 text-[12.5px] text-mist2">{f.note || "—"}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <Empty text="Bu dosyada bulgu yok — raporun bulgu bölümü boş bırakılır." hint="Bulgu eklemek için Bulgular sayfasını kullanın." />
      );
    case 12:
      return p.timeline.length ? (
        <Table head={["UTC", "Yerel", "Ofset", "Kaynak", "Açıklama"]}>
          {p.timeline.map((t, i) => (
            <Tr key={i}>
              <Td mono className="whitespace-nowrap text-cyan tnum">{t.utc}</Td>
              <Td mono className="whitespace-nowrap text-paper tnum">{t.local}</Td>
              <Td mono className="text-mist tnum">{t.offset}</Td>
              <Td className="whitespace-nowrap text-mist2">{t.source}</Td>
              <Td className="text-mist2">{t.description}</Td>
            </Tr>
          ))}
        </Table>
      ) : (
        <Empty text="Zaman çizelgesi boş — Modül G'den kaynak aktarın." />
      );
    case 16:
      return (
        <ul className="space-y-2.5">
          {p.limitations.map((l) => (
            <li key={l} className="flex gap-2.5 border-l-2 border-amber pl-3.5 text-[13.5px] leading-relaxed text-mist2">
              <span>{l}</span>
            </li>
          ))}
        </ul>
      );
    case 18:
      return p.custody.length ? (
        <Table head={["Seq", "Delil", "Tarih", "İşlemci", "Geçiş", "İşlem"]}>
          {p.custody.map((c, i) => (
            <Tr key={i}>
              <Td mono className="text-mist tnum">{c.seq}</Td>
              <Td mono className="text-cyan">{c.evidenceId}</Td>
              <Td mono className="whitespace-nowrap text-paper tnum">{c.at}</Td>
              <Td className="text-mist2">{c.operator}</Td>
              <Td mono className="whitespace-nowrap text-mist">
                {c.prev} → {c.next}
              </Td>
              <Td className="text-paper">{c.action}</Td>
            </Tr>
          ))}
        </Table>
      ) : (
        <Empty text="Custody kaydı yok." />
      );
    default:
      return (
        <div>
          <p className="text-[13.5px] leading-relaxed text-mist2">
            Bu bölüm rapor motorunda otomatik doldurulur; içerik doğrudan soruşturma veritabanından gelir. Soldaki
            listeden başka bir bölüm seçebilir veya PDF/Markdown/JSON olarak dışa aktarabilirsiniz.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-4">
            {[
              ["Delil", payloadCounts(p, "evidence")],
              ["Doğrulanmış", payloadCounts(p, "verified")],
              ["Bulgu", payloadCounts(p, "findings")],
              ["Zaman", payloadCounts(p, "timeline")],
            ].map(([k, v]) => (
              <div key={String(k)} className="border border-line bg-charcoal p-3">
                <Micro>{k}</Micro>
                <div className="mt-1.5 font-mono text-[20px] text-cyan tnum">{v}</div>
              </div>
            ))}
          </div>
        </div>
      );
  }
}

function payloadCounts(p: ReportPayload, k: "evidence" | "verified" | "findings" | "timeline") {
  return p.counts[k];
}
