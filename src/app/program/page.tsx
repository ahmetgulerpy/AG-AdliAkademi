"use client";

import { useMemo, useState } from "react";
import { CheckCircle2, Circle, FlaskConical, Timer } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Micro, PageHead, Panel, Pill, Progress, Table, Td, Tr } from "@/components/ui";
import { LESSONS, LEVELS, lessonsByLevel } from "@/data/academy";
import { LAB_MODULES } from "@/data/labs";
import type { Level } from "@/data/types";

export default function CurriculumPage() {
  const { snap } = useStore();
  const [filter, setFilter] = useState<Level | "all">("all");

  const prog = useMemo(() => {
    const m = new Map<string, { status: string; score: number | null; completedAt: string | null }>();
    (snap?.lessonProgress ?? []).forEach((p) =>
      m.set(p.lessonId, { status: p.status, score: p.score ?? null, completedAt: (p.completedAt as string) ?? null }),
    );
    return m;
  }, [snap?.lessonProgress]);

  const labs = snap?.labs ?? [];
  const rows = LESSONS.filter((l) => filter === "all" || l.level === filter).sort((a, b) => a.order - b.order);

  return (
    <div>
      <PageHead
        kicker="Eğitim Programı · Curriculum"
        title="Modül Bazlı Eğitim Takibi"
        en="Module-by-module tracking"
        desc="Her dersin seviyesi, süresi, bağlı laboratuvar modülü, sınav sonucu ve tamamlanma durumu tek tabloda. Filtreler akademik seviyeye göre çalışır."
        right={
          <div className="flex flex-wrap gap-1.5">
            <button
              onClick={() => setFilter("all")}
              className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.13em] ${
                filter === "all" ? "border-cyan bg-cyan/15 text-cyan" : "border-line2 text-mist hover:text-paper"
              }`}
            >
              Tümü
            </button>
            {LEVELS.map((lv) => (
              <button
                key={lv.key}
                onClick={() => setFilter(lv.key as Level)}
                className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.13em] ${
                  filter === lv.key ? "border-cyan bg-cyan/15 text-cyan" : "border-line2 text-mist hover:text-paper"
                }`}
              >
                {lv.code}
              </button>
            ))}
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4">
        {LEVELS.map((lv) => {
          const list = lessonsByLevel(lv.key as Level);
          const done = list.filter((l) => prog.get(l.id)?.status === "completed").length;
          return (
            <div key={lv.key} className="border border-line bg-panel/60 p-4">
              <Micro>{lv.code}</Micro>
              <div className="mt-2 font-mono text-[22px] leading-none text-paper tnum">
                {done}
                <span className="text-[13px] text-mist">/{list.length}</span>
              </div>
              <div className="mt-2.5">
                <Progress value={Math.round((done / list.length) * 100)} />
              </div>
            </div>
          );
        })}
        <div className="border border-line bg-panel/60 p-4">
          <Micro>Lab İlerlemesi</Micro>
          <div className="mt-2 font-mono text-[22px] leading-none text-cyan tnum">
            {labs.filter((l) => l.status === "completed").length}
            <span className="text-[13px] text-mist">/8</span>
          </div>
          <div className="mt-2.5">
            <Progress value={Math.round((labs.filter((l) => l.status === "completed").length / 8) * 100)} tone="cyan" />
          </div>
        </div>
      </div>

      <Panel title="Ders Çizelgesi" en="Lesson Register">
        <Table head={["#", "Seviye", "Ders / Lesson", "Süre", "Laboratuvar", "Sınav", "Durum", ""]}>
          {rows.map((l) => {
            const p = prog.get(l.id);
            const completed = p?.status === "completed";
            const inProg = p?.status === "in_progress";
            const lab = LAB_MODULES.find((x) => x.key === l.labModule);
            return (
              <Tr key={l.id} className={completed ? "bg-good/[0.03]" : ""}>
                <Td mono className="text-mist tnum">
                  {String(l.order).padStart(2, "0")}
                </Td>
                <Td>
                  <Pill tone={l.level === "beginner" ? "info" : l.level === "intermediate" ? "cyan" : "wait"}>
                    {l.level === "beginner" ? "L1" : l.level === "intermediate" ? "L2" : "L3"}
                  </Pill>
                </Td>
                <Td>
                  <div className="font-medium text-paper">{l.title}</div>
                  <div className="mt-0.5 font-mono text-[10.5px] uppercase tracking-[0.1em] text-mist">{l.titleEn}</div>
                </Td>
                <Td mono className="whitespace-nowrap text-mist tnum">
                  {l.minutes} dk
                </Td>
                <Td>
                  {lab ? (
                    <a
                      href={`/laboratuvar/${lab.key}`}
                      className="inline-flex items-center gap-1.5 font-mono text-[11px] text-cyan hover:underline"
                    >
                      <FlaskConical size={12} /> {lab.code}
                    </a>
                  ) : (
                    <span className="text-mist">—</span>
                  )}
                </Td>
                <Td mono className="text-mist tnum">
                  {p?.score !== null && p?.score !== undefined ? `${p.score}/${l.quiz.length}` : `${l.quiz.length} soru`}
                </Td>
                <Td>
                  {completed ? (
                    <span className="inline-flex items-center gap-1.5 text-good">
                      <CheckCircle2 size={13} /> <span className="font-mono text-[11px]">TAMAMLANDI</span>
                    </span>
                  ) : inProg ? (
                    <span className="inline-flex items-center gap-1.5 text-blue2">
                      <Timer size={13} /> <span className="font-mono text-[11px]">DEVAM EDİYOR</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-mist">
                      <Circle size={13} /> <span className="font-mono text-[11px]">BAŞLANMADI</span>
                    </span>
                  )}
                </Td>
                <Td>
                  <a
                    href={`/akademi/${l.id}`}
                    className="border border-line2 px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.12em] text-mist2 transition-colors hover:border-cyan hover:text-cyan"
                  >
                    Aç
                  </a>
                </Td>
              </Tr>
            );
          })}
        </Table>
      </Panel>

      <div className="mt-5 grid gap-4 md:grid-cols-3">
        {LAB_MODULES.map((m) => {
          const st = labs.find((l) => l.moduleId === m.key);
          const steps = JSON.parse(st?.stepsDone || "[]") as string[];
          return (
            <a key={m.key} href={`/laboratuvar/${m.key}`} className="group border border-line bg-panel/60 p-4 transition-colors hover:border-cyan/50">
              <div className="flex items-center justify-between">
                <Micro className="text-cyan">{m.code}</Micro>
                <Pill tone={st?.status === "completed" ? "ok" : steps.length ? "info" : "idle"}>
                  {steps.length}/{m.steps.length}
                </Pill>
              </div>
              <h3 className="mt-2 text-[14.5px] font-medium text-paper group-hover:text-cyan">{m.title}</h3>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.1em] text-mist">{m.titleEn}</p>
              <p className="mt-2 text-[12.5px] leading-relaxed text-mist2">{m.summary}</p>
              <div className="mt-3">
                <Progress value={Math.round((steps.length / m.steps.length) * 100)} tone="cyan" />
              </div>
            </a>
          );
        })}
      </div>

      <div className="mt-5 flex flex-wrap gap-2.5">
        <Btn href="/akademi" tone="primary">
          Akademiye Dön
        </Btn>
        <Btn href="/ilerleme" tone="cyan">
          İlerleme Raporu
        </Btn>
        <Btn href="/laboratuvar" tone="amber">
          Laboratuvar
        </Btn>
      </div>
    </div>
  );
}
