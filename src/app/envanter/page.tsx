"use client";

import { useState } from "react";
import { Fingerprint, Lock, ShieldAlert } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Empty, Micro, PageHead, Panel, Pill, Progress, Table, Td, Tr } from "@/components/ui";
import { EVIDENCE } from "@/data/cases";
import {
  PIPELINE,
  STATUS_LABELS,
  STATUS_TONE,
  availableTransitions,
  type Transition,
} from "@/lib/evidence-state";
import { bytes, utc } from "@/lib/format";

export default function EvidencePage() {
  const { snap, act } = useStore();
  const [sel, setSel] = useState(EVIDENCE[0].evidenceId);
  const [method, setMethod] = useState("Fiziksel edinim (E01, yazma engelleyici ile bit-by-bit)");

  const live = (id: string) => (snap?.evidence ?? []).find((e) => e.evidenceId === id);
  const ev = live(sel) ?? snap?.evidence?.[0];
  const seed = EVIDENCE.find((e) => e.evidenceId === (ev?.evidenceId ?? sel));

  if (!snap || !ev) return <Empty text="Delil envanteri yükleniyor…" />;

  const findingsCount = (snap.findings ?? []).filter((f) => f.evidenceId === ev.evidenceId).length;
  const custody = (snap.custody ?? []).filter((c) => c.evidenceId === ev.evidenceId);
  const view = {
    status: ev.status,
    sha256: (ev.sha256 as string) ?? null,
    acquiredAt: (ev.acquiredAt as string) ?? null,
    acquisitionMethod: String(ev.acquisitionMethod ?? ""),
    reviewedAt: (ev.reviewedAt as string) ?? null,
    findingsCount,
  };
  const options = availableTransitions(view);
  const stageIdx = PIPELINE.findIndex((s) => s.status.includes(ev.status));

  const doT = async (t: Transition) => {
    await act("transitionEvidence", { evidenceId: ev.evidenceId, transition: t, method });
  };

  const statusCounts = (snap.evidence ?? []).reduce<Record<string, number>>((acc, e) => {
    acc[e.status] = (acc[e.status] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div>
      <PageHead
        kicker="Delil Envanteri · Evidence Inventory"
        title="Delil Yönetimi ve Durum Makinesi"
        en="Evidence management & state machine"
        desc="Her delilin benzersiz kimliği, edinim bilgisi, SHA-256 özeti, saklama konumu ve ilişkili bulguları burada tutulur. Kayıt → Edinim → Bütünlük Doğrulama → İnceleme → Bulgular → Raporlama sırası dışında geçiş yapılamaz."
        right={
          <div className="text-right">
            <Micro>Edinilen / Toplam</Micro>
            <div className="mt-1 font-mono text-[28px] leading-none text-cyan tnum">
              {snap.stats.evidenceAcquired}/{snap.stats.evidenceTotal}
            </div>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-2.5 md:grid-cols-4 xl:grid-cols-6">
        {Object.entries(STATUS_LABELS)
          .filter(([k]) => k !== "none")
          .map(([k, label]) => (
            <div key={k} className="border border-line bg-panel/60 px-3 py-2.5">
              <div className="font-mono text-[10px] uppercase tracking-[0.1em] text-mist">{label}</div>
              <div
                className={`mt-1.5 font-mono text-[20px] leading-none tnum ${
                  STATUS_TONE[k] === "ok" ? "text-good" : STATUS_TONE[k] === "warn" ? "text-bad" : STATUS_TONE[k] === "wait" ? "text-amber" : "text-mist2"
                }`}
              >
                {statusCounts[k] ?? 0}
              </div>
            </div>
          ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.5fr)_380px]">
        <div className="space-y-5">
          <Panel title="Delil Kayıtları" en="Evidence register">
            <Table head={["Delil ID", "Dosya", "Tür", "Kaynak Cihaz", "Seri", "Boyut", "Durum", "SHA-256"]}>
              {snap.evidence.map((e) => {
                const s = EVIDENCE.find((x) => x.evidenceId === e.evidenceId);
                const sha = (e.sha256 as string) ?? "";
                return (
                  <Tr
                    key={e.evidenceId}
                    className={`cursor-pointer ${ev.evidenceId === e.evidenceId ? "bg-cyan/[0.07]" : ""}`}
                  >
                    <Td>
                      <span onClick={() => setSel(e.evidenceId)} className="block font-mono text-cyan">
                        {e.evidenceId}
                      </span>
                    </Td>
                    <Td mono className="whitespace-nowrap text-mist">{e.caseId}</Td>
                    <Td className="whitespace-nowrap text-mist2">{String(e.type)}</Td>
                    <Td className="text-mist2">{String(e.sourceDevice)}</Td>
                    <Td mono className="whitespace-nowrap text-mist">{String(e.serialNumber ?? "—")}</Td>
                    <Td mono className="whitespace-nowrap text-mist tnum">{bytes(s?.sizeBytes ?? 0)}</Td>
                    <Td>
                      <Pill tone={STATUS_TONE[e.status] ?? "idle"}>{STATUS_LABELS[e.status] ?? e.status}</Pill>
                    </Td>
                    <Td mono className="max-w-[170px] truncate">
                      {sha ? (
                        <span className="text-cyan" title={sha}>
                          {sha.slice(0, 14)}…
                        </span>
                      ) : (
                        <span className="text-mist">—</span>
                      )}
                    </Td>
                  </Tr>
                );
              })}
            </Table>
          </Panel>

          <Panel title="Delil Muhafaza Zinciri (Append-only)" en="Chain of custody">
            <div className="p-4">
              <div className="mb-4">
                <Micro>Aşama · Pipeline</Micro>
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

              {custody.length === 0 ? (
                <Empty text="Bu delil için işlem kaydı yok." />
              ) : (
                <Table head={["Seq", "Tarih/Saat (+03)", "UTC", "İşlemci", "Durum geçişi", "İşlem", "Neden"]}>
                  {custody.map((c) => (
                    <Tr key={c.id as number}>
                      <Td mono className="text-mist tnum">{String(c.seq)}</Td>
                      <Td mono className="whitespace-nowrap text-paper tnum">
                        {new Date(String(c.occurredAt)).toISOString().replace("T", " ").replace(".000Z", "")} +03:00
                      </Td>
                      <Td mono className="whitespace-nowrap text-mist tnum">{utc(String(c.occurredAt))}</Td>
                      <Td className="whitespace-nowrap text-mist2">{String(c.operator)}</Td>
                      <Td mono className="whitespace-nowrap">
                        <span className="text-mist">{STATUS_LABELS[String(c.prevStatus)] ?? String(c.prevStatus)}</span>
                        <span className="mx-1.5 text-mist/60">→</span>
                        <span className="text-cyan">{STATUS_LABELS[String(c.newStatus)] ?? String(c.newStatus)}</span>
                      </Td>
                      <Td className="whitespace-nowrap text-paper">{String(c.action)}</Td>
                      <Td className="min-w-[240px] text-mist2">{String(c.reason)}</Td>
                    </Tr>
                  ))}
                </Table>
              )}
              <p className="mt-3 border-t border-line pt-3 text-[12.5px] leading-relaxed text-mist">
                Kayıtlar geriye dönük sessizce değiştirilemez. Bir hata düzeltilecekse önceki kayıt korunur; düzeltme yeni
                bir satır olarak eklenir.
              </p>
            </div>
          </Panel>
        </div>

        {/* Sağ: seçili delil denetçisi */}
        <aside className="space-y-4 xl:sticky xl:top-[68px] xl:self-start">
          <div className="border border-line bg-panel/70 p-4">
            <div className="flex items-center justify-between">
              <span className="font-mono text-[14px] text-cyan">{ev.evidenceId}</span>
              <Pill tone={STATUS_TONE[ev.status] ?? "idle"}>{STATUS_LABELS[ev.status] ?? ev.status}</Pill>
            </div>

            <dl className="mt-3 space-y-2 font-mono text-[11.5px]">
              {[
                ["Dosya", String(ev.caseId)],
                ["Tür", String(ev.type)],
                ["Kaynak", String(ev.sourceDevice)],
                ["Seri", String(ev.serialNumber ?? "—")],
                ["Yöntem", String(ev.acquisitionMethod)],
                ["Edinim", ev.acquiredAt ? utc(String(ev.acquiredAt)) : "edinilmedi"],
                ["Edinim yapan", String(ev.acquiredBy ?? "—")],
                ["Boyut", bytes(seed?.sizeBytes ?? 0)],
                ["Konum", String(ev.storageLocation)],
                ["Hash doğrulama", ev.hashVerifiedAt ? utc(String(ev.hashVerifiedAt)) : "yapılmadı"],
                ["İnceleme", ev.reviewedAt ? utc(String(ev.reviewedAt)) : "yapılmadı"],
                ["Bulgu", `${findingsCount} kayıt`],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5">
                  <dt className="shrink-0 text-mist">{k}</dt>
                  <dd className="truncate text-right text-paper">{v}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-3 border border-line bg-[#0d1015] p-3">
              <Micro className="text-cyan">SHA-256</Micro>
              <p className="mt-1.5 break-all font-mono text-[12px] leading-relaxed text-cyan">
                {String(ev.sha256 ?? "") || "— hesaplanmadı —"}
              </p>
              {!ev.sha256 && (
                <p className="mt-2 flex items-start gap-1.5 text-[11.5px] leading-relaxed text-amber">
                  <Lock size={12} className="mt-0.5 shrink-0" />
                  Delil henüz edinilmedi; özet alanı bilinçli olarak boştur ve rapora yansıtılmaz.
                </p>
              )}
            </div>

            <label className="mt-3 block">
              <Micro>Edinim Yöntemi</Micro>
              <input
                value={method}
                onChange={(e) => setMethod(e.target.value)}
                className="mt-1.5 w-full border border-line2 bg-[#0d1015] px-3 py-2 font-mono text-[12px] text-paper outline-none focus:border-cyan"
              />
            </label>

            <div className="mt-3 space-y-2">
              <Micro>İzin Verilen Geçişler</Micro>
              {options.length === 0 ? (
                <p className="text-[12.5px] text-mist">Bu durumda bekleyen işlem yok.</p>
              ) : (
                options.map((o) => (
                  <div key={o.t}>
                    <Btn
                      onClick={() => void doT(o.t)}
                      disabled={!!o.blocked}
                      title={o.blocked ?? ""}
                      tone={o.blocked ? "default" : o.t === "flag_integrity_issue" ? "danger" : o.t === "verify_hash" ? "cyan" : "primary"}
                      className="w-full justify-center"
                    >
                      {o.label}
                    </Btn>
                    {o.blocked && <p className="mt-1 text-[11.5px] leading-relaxed text-amber">{o.blocked}</p>}
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="border border-line bg-panel/70 p-4">
            <div className="flex items-center gap-2">
              <ShieldAlert size={14} className="text-amber" />
              <Micro className="text-amber">Durum Kuralları</Micro>
            </div>
            <ul className="mt-2 space-y-1.5 text-[12.5px] leading-relaxed text-mist2">
              <li>• Kayıtlı delil henüz edinilmemiş olabilir.</li>
              <li>• Edinilmeden hash doğrulanmış gösterilemez.</li>
              <li>• İncelenmemiş delil için bulgu üretilemez.</li>
              <li>• Bütünlük sorunu, incelemeyi durdurur.</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 border border-line bg-panel/70 px-4 py-3">
            <Fingerprint size={14} className="text-cyan" />
            <span className="text-[12px] text-mist2">Custody satırları salt-eklemelidir; silme işlemi yoktur.</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
