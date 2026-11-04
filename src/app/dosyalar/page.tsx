"use client";

import { useState } from "react";
import { FileSearch, FolderKanban, ShieldQuestion } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Micro, PageHead, Panel, Pill, Table, Td, Tr } from "@/components/ui";
import { CASES, EVIDENCE } from "@/data/cases";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/evidence-state";
import { LAB_MODULES } from "@/data/labs";
import Link from "next/link";

export default function CasesPage() {
  const { snap, act } = useStore();
  const active = snap?.profile?.activeCaseId ?? "AG-DFIR-2026-001";
  const [open, setOpen] = useState<string>(active);

  const c = CASES.find((x) => x.caseId === open) ?? CASES[0];
  const caseEvidence = EVIDENCE.filter((e) => e.caseId === c.caseId);
  const findings = (snap?.findings ?? []).filter((f) => f.caseId === c.caseId);
  const timeline = (snap?.timeline ?? []).filter((t) => t.caseId === c.caseId);
  const custody = (snap?.custody ?? []).filter((x) => x.caseId === c.caseId);
  const live = (id: string) => (snap?.evidence ?? []).find((e) => e.evidenceId === id);

  return (
    <div>
      <PageHead
        kicker="Soruşturma Dosyaları · Case Files"
        title="Vaka Kayıtları"
        en="Investigation registry"
        desc="Bütün kişi, şirket, kurum, dosya ve cihaz bilgileri kurgusaldır. Her dosya kendi kapsamı, araştırma soruları, delil seti ve bağlı laboratuvar modülleriyle tanımlıdır."
        right={
          <div className="text-right">
            <Micro>Aktif Dosya</Micro>
            <div className="mt-1 font-mono text-[15px] text-cyan tnum">{active}</div>
          </div>
        }
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {CASES.map((cs) => {
          const on = open === cs.caseId;
          const isActive = active === cs.caseId;
          const evCount = EVIDENCE.filter((e) => e.caseId === cs.caseId).length;
          const fCount = (snap?.findings ?? []).filter((f) => f.caseId === cs.caseId).length;
          return (
            <button
              key={cs.caseId}
              onClick={() => setOpen(cs.caseId)}
              className={`border p-4 text-left transition-all duration-150 ${
                on ? "border-cyan bg-cyan/[0.08]" : "border-line bg-panel/60 hover:border-line2"
              }`}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono text-[12px] text-cyan">{cs.caseId}</span>
                <div className="flex gap-1.5">
                  {isActive && <Pill tone="amber">aktif</Pill>}
                  <Pill tone="idle">{evCount} delil</Pill>
                </div>
              </div>
              <div className="mt-2 flex items-start gap-2">
                <FolderKanban size={15} className="mt-0.5 shrink-0 text-mist" />
                <span className="text-[14.5px] font-medium leading-snug text-paper">{cs.title}</span>
              </div>
              <p className="mt-2 line-clamp-3 text-[12.5px] leading-relaxed text-mist2">{cs.subject}</p>
              <div className="mt-3 flex items-center justify-between font-mono text-[10.5px] text-mist tnum">
                <span>{cs.modules.length} modül</span>
                <span>{fCount} bulgu</span>
                <span>{cs.openedAt.slice(0, 10)}</span>
              </div>
            </button>
          );
        })}
      </div>

      <Panel
        title={`${c.caseId} — ${c.title}`}
        en="Case detail"
        right={
          <div className="flex gap-2">
            {active !== c.caseId && (
              <Btn onClick={() => void act("setCase", { caseId: c.caseId })} tone="amber">
                Aktif Yap
              </Btn>
            )}
          </div>
        }
      >
        <div className="grid gap-5 p-4 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
          <div className="space-y-4">
            <div>
              <Micro>Konu · Subject</Micro>
              <p className="mt-1.5 text-[14px] leading-relaxed text-paper">{c.subject}</p>
            </div>
            <div className="border border-line bg-charcoal p-3.5">
              <Micro>İnceleme Talebi ve Kapsam · Scope</Micro>
              <p className="mt-1.5 text-[13px] leading-relaxed text-mist2">{c.brief}</p>
              <div className="mt-2.5 border-t border-line pt-2.5">
                <p className="text-[12.5px] leading-relaxed text-mist2">{c.scope}</p>
              </div>
            </div>

            <div>
              <Micro>Araştırma Soruları · Research questions</Micro>
              <ol className="mt-2 space-y-2">
                {c.questions.map((q, i) => (
                  <li key={q} className="flex gap-3 border border-line bg-charcoal px-3.5 py-2.5">
                    <span className="font-mono text-[11.5px] text-cyan tnum">{String(i + 1).padStart(2, "0")}</span>
                    <span className="text-[13px] leading-relaxed text-mist2">{q}</span>
                  </li>
                ))}
              </ol>
            </div>

            <div>
              <Micro>Bağlı Laboratuvar Modülleri</Micro>
              <div className="mt-2 flex flex-wrap gap-2">
                {c.modules.map((m) => {
                  const lab = LAB_MODULES.find((l) => l.key === m);
                  return (
                    <Link key={m} href={`/laboratuvar/${m}`}>
                      <Pill tone="cyan" className="hover:bg-cyan/20">
                        {lab?.code ?? m} · {lab?.title ?? ""}
                      </Pill>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="border border-line bg-charcoal p-3.5">
              <div className="flex items-center gap-2">
                <ShieldQuestion size={14} className="text-cyan" />
                <Micro className="text-cyan">Dosya Özeti</Micro>
              </div>
              <dl className="mt-3 space-y-2 font-mono text-[11.5px]">
                {[
                  ["Dosya No", c.caseId],
                  ["Açılış", c.openedAt.replace("T", " ").replace(".000Z", "Z")],
                  ["Durum", c.status === "open" ? "açık" : c.status],
                  ["Delil", `${caseEvidence.length} kayıt`],
                  ["Custody", `${custody.length} işlem`],
                  ["Bulgu", `${findings.length} kayıt`],
                  ["Zaman çizelgesi", `${timeline.length} satır`],
                ].map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-3 border-b border-line pb-1.5">
                    <dt className="text-mist">{k}</dt>
                    <dd className="truncate text-paper tnum">{v}</dd>
                  </div>
                ))}
              </dl>
            </div>

            <div>
              <Micro>Bu Dosyadaki Deliller</Micro>
              <Table head={["Delil", "Tür", "Durum"]}>
                {caseEvidence.map((e) => {
                  const l = live(e.evidenceId);
                  const st = l?.status ?? e.status;
                  return (
                    <Tr key={e.evidenceId}>
                      <Td mono className="text-cyan">{e.evidenceId}</Td>
                      <Td className="text-mist2">{e.type}</Td>
                      <Td>
                        <Pill tone={STATUS_TONE[st] ?? "idle"}>{STATUS_LABELS[st] ?? st}</Pill>
                      </Td>
                    </Tr>
                  );
                })}
              </Table>
            </div>

            <div className="border border-line bg-charcoal p-3.5">
              <div className="flex items-center gap-2">
                <FileSearch size={14} className="text-amber" />
                <Micro className="text-amber">Aydınlatma Notu</Micro>
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-mist2">
                Her vaka bağımsızdır; bulgular bir vakadan diğerine taşınamaz. Ortak delil seti yalnızca bitirme vakasında
                (AG-DFIR-2026-007) bilinçli olarak çoklu kaynak içerir.
              </p>
            </div>
          </div>
        </div>
      </Panel>
    </div>
  );
}
