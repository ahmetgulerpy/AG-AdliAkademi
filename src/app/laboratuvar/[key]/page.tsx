"use client";

import Link from "next/link";
import { notFound, useParams } from "next/navigation";
import { ArrowLeft, CheckCircle2, CircleDashed, GraduationCap, Lightbulb, TriangleAlert } from "lucide-react";
import { useState } from "react";
import { useStore } from "@/components/Store";
import { Btn, Micro, PageHead, Panel, Pill, Progress } from "@/components/ui";
import { getLab } from "@/data/labs";
import { getLesson } from "@/data/academy";
import { LabWorkspace } from "@/components/LabWorkspaces";

export default function LabModulePage() {
  const params = useParams<{ key: string }>();
  const mod = getLab(params.key);
  const { snap, act, } = useStore();
  const [hint, setHint] = useState(false);

  if (!mod) notFound();

  const st = snap?.labs?.find((l) => l.moduleId === mod.key);
  const steps = JSON.parse(st?.stepsDone || "[]") as string[];
  const lesson = getLesson(mod.lessonId);
  const pct = Math.round((steps.length / mod.steps.length) * 100);

  const toggle = (stepId: string) =>
    void act("labStep", { moduleId: mod.key, step: stepId, totalSteps: mod.steps.length });

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/laboratuvar" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.13em] text-mist hover:text-cyan">
          <ArrowLeft size={13} /> Laboratuvar
        </Link>
        <span className="h-3 w-px bg-line2" />
        <Pill tone="cyan">{mod.code}</Pill>
        <Pill tone={st?.status === "completed" ? "ok" : "idle"}>
          {st?.status === "completed" ? "Tamamlandı" : `${steps.length}/${mod.steps.length} adım`}
        </Pill>
        <span className="ml-auto font-mono text-[11px] text-mist tnum">%{pct}</span>
      </div>

      <PageHead
        kicker={`${mod.code} · ${mod.titleEn}`}
        title={mod.title}
        en={mod.titleEn}
        desc={mod.summary}
        right={
          <div className="flex flex-col items-end gap-2">
            <div className="w-[200px]">
              <Progress value={pct} tone={st?.status === "completed" ? "good" : "cyan"} />
            </div>
            {lesson && (
              <Btn href={`/akademi/${lesson.id}`} tone="amber">
                <GraduationCap size={13} /> Bu Konuyu Akademide Öğren
              </Btn>
            )}
          </div>
        }
      />

      <div className="mb-5 flex items-start gap-2.5 border border-amber/45 bg-amber/[0.07] px-4 py-3">
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber" />
        <p className="text-[12.5px] leading-relaxed text-mist2">{mod.warn}</p>
      </div>

      <div className="grid gap-5 xl:grid-cols-[260px_minmax(0,1fr)]">
        {/* Sol: adımlar */}
        <aside className="space-y-4 xl:sticky xl:top-[68px] xl:self-start">
          <Panel title="Adımlar" en="Procedure">
            <ol className="space-y-2 p-4">
              {mod.steps.map((s, i) => {
                const done = steps.includes(s.id);
                return (
                  <li key={s.id}>
                    <button
                      onClick={() => toggle(s.id)}
                      className={`w-full border px-3 py-2.5 text-left transition-colors ${
                        done ? "border-good/45 bg-good/8" : "border-line bg-charcoal hover:border-line2"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {done ? (
                          <CheckCircle2 size={14} className="mt-0.5 shrink-0 text-good" />
                        ) : (
                          <CircleDashed size={14} className="mt-0.5 shrink-0 text-mist" />
                        )}
                        <div className="min-w-0">
                          <div className={`text-[13px] font-medium ${done ? "text-good" : "text-paper"}`}>
                            <span className="mr-2 font-mono text-[10.5px] text-mist tnum">{String(i + 1).padStart(2, "0")}</span>
                            {s.label}
                          </div>
                          <div className="mt-1 text-[11.5px] leading-relaxed text-mist">{s.detail}</div>
                        </div>
                      </div>
                    </button>
                    {hint && <p className="mt-1.5 pl-7 text-[11.5px] leading-relaxed text-amber/90">💡 {s.hint}</p>}
                  </li>
                );
              })}
            </ol>
            <div className="border-t border-line px-4 py-3">
              <button
                onClick={() => setHint((h) => !h)}
                className="inline-flex items-center gap-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist transition-colors hover:text-amber"
              >
                <Lightbulb size={12} /> {hint ? "İpuçlarını Gizle" : "İpuçlarını Göster"}
              </button>
            </div>
          </Panel>

          <Panel title="Bağlantılı Kaynaklar" en="Cross-links">
            <ul className="space-y-2 p-4">
              {lesson && (
                <li>
                  <a href={`/akademi/${lesson.id}`} className="block border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-mist2 transition-colors hover:border-cyan hover:text-cyan">
                    Akademi dersi: {lesson.title}
                  </a>
                </li>
              )}
              <li>
                <a href="/envanter" className="block border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-mist2 transition-colors hover:border-cyan hover:text-cyan">
                  Delil Envanteri ve durum makinesi
                </a>
              </li>
              <li>
                <a href="/bulgular" className="block border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-mist2 transition-colors hover:border-cyan hover:text-cyan">
                  Bulgu yönetimi
                </a>
              </li>
              <li>
                <a href="/raporlar" className="block border border-line bg-charcoal px-3 py-2.5 text-[12.5px] text-mist2 transition-colors hover:border-cyan hover:text-cyan">
                  Rapor motoru
                </a>
              </li>
            </ul>
          </Panel>
        </aside>

        {/* Sağ: modüle özel çalışma alanı */}
        <div className="min-w-0">
          <LabWorkspace modKey={mod.key} caseIds={mod.caseIds} onStep={toggle} doneSteps={steps} />
        </div>
      </div>
    </div>
  );
}
