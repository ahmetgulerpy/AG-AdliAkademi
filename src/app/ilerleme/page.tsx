"use client";

import { Award, Clock, GraduationCap, FlaskConical } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Empty, Micro, PageHead, Panel, Pill, Progress, Table, Td, Tr } from "@/components/ui";
import { LESSONS, LEVELS } from "@/data/academy";
import { LAB_MODULES } from "@/data/labs";
import { utc } from "@/lib/format";

const LEVEL_LABEL: Record<string, string> = {
  beginner: "LEVEL 1 · BEGINNER",
  intermediate: "LEVEL 2 · INTERMEDIATE",
  advanced: "LEVEL 3 · ADVANCED",
};

export default function ProgressPage() {
  const { snap, act } = useStore();

  if (!snap) return <Empty text="İlerleme verisi yükleniyor…" />;

  const prog = snap.lessonProgress;
  const completed = prog.filter((p) => p.status === "completed");
  const inProgress = prog.filter((p) => p.status === "in_progress");
  const attempts = [...snap.quizAttempts].sort((a, b) => (b.id as number) - (a.id as number));
  const lvlStats = LEVELS.map((l) => {
    const total = LESSONS.filter((x) => x.level === l.key).length;
    const done = LESSONS.filter((x) => x.level === l.key && completed.some((c) => c.lessonId === x.id)).length;
    return { ...l, total, done, pct: Math.round((done / total) * 100) };
  });

  return (
    <div>
      <PageHead
        kicker="Kullanıcı İlerlemesi · Learning Analytics"
        title={`${snap.profile.displayName} — İnceleme Defteri`}
        en={`${snap.profile.role} · ${LEVEL_LABEL[snap.stats.level]}`}
        desc="Tamamlanan dersler, devam eden dersler, tamamlanan laboratuvarlar, sınav sonuçları, modül başarı oranları, kazanılan rozetler, toplam öğrenme süresi ve eğitim seviyesi."
        right={
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <Micro>Seviye</Micro>
              <div className="mt-1 font-mono text-[16px] text-cyan">{LEVEL_LABEL[snap.stats.level]}</div>
            </div>
            <Btn onClick={() => void act("studyTime", { minutes: 5 })} tone="cyan" title="5 dakikalık oturum süresi ekle">
              <Clock size={13} /> Süre Ekle (+5dk)
            </Btn>
          </div>
        }
      />

      <div className="mb-5 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
        {[
          ["Tamamlanan Ders", `${completed.length}`, `/${LESSONS.length}`],
          ["Devam Eden", `${inProgress.length}`, "ders"],
          ["Tamamlanan Lab", `${snap.stats.completedLabs}`, "/8"],
          ["Sınav Sayısı", `${snap.stats.quizCount}`, "deneme"],
          ["Sınav Ort.", `${snap.stats.avgScore ?? "—"}`, "%"],
          ["Bulgu", `${snap.stats.findings}`, "kayıt"],
          ["Öğrenme Süresi", `${snap.stats.minutes}`, "dk"],
        ].map(([k, v, s]) => (
          <div key={k} className="border border-line bg-panel/60 px-3.5 py-3">
            <Micro className="text-[9px]">{k}</Micro>
            <div className="mt-1.5 font-mono text-[22px] leading-none text-paper tnum">
              {v}
              <span className="text-[12px] text-mist">{s}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          <Panel title="Seviye Bazlı Başarı Oranları" en="Level mastery">
            <div className="space-y-4 p-4">
              {lvlStats.map((l) => (
                <div key={l.key}>
                  <div className="mb-1.5 flex items-baseline justify-between gap-3">
                    <span className="text-[13.5px] text-paper">
                      {l.code} — {l.title}
                      <span className="ml-2 font-mono text-[11px] uppercase tracking-[0.1em] text-mist">{l.titleEn}</span>
                    </span>
                    <span className="font-mono text-[12px] text-mist tnum">
                      {l.done}/{l.total} · %{l.pct}
                    </span>
                  </div>
                  <Progress value={l.pct} tone={l.pct === 100 ? "good" : l.pct > 0 ? "cyan" : "blue"} />
                </div>
              ))}
              <div>
                <div className="mb-1.5 flex items-baseline justify-between">
                  <span className="text-[13.5px] text-paper">
                    Laboratuvar <span className="ml-2 font-mono text-[11px] text-mist">LABORATORY</span>
                  </span>
                  <span className="font-mono text-[12px] text-mist tnum">
                    {snap.stats.completedLabs}/8 · %{Math.round((snap.stats.completedLabs / 8) * 100)}
                  </span>
                </div>
                <Progress value={Math.round((snap.stats.completedLabs / 8) * 100)} tone="cyan" />
              </div>
            </div>
          </Panel>

          <Panel title="Sınav Denemeleri" en="Quiz attempts">
            {attempts.length === 0 ? (
              <div className="p-4">
                <Empty text="Henüz sınav denemesi yok." hint="Her dersin sonundaki çoktan seçmeli sınavı tamamlayın." />
              </div>
            ) : (
              <Table head={["Tarih", "Ders", "Doğru", "Oran", "Sonuç", "Mod"]}>
                {attempts.slice(0, 30).map((a) => {
                  const l = LESSONS.find((x) => x.id === a.lessonId);
                  const score = Number(a.score);
                  const total = Number(a.total);
                  const pct = Math.round((score / total) * 100);
                  return (
                    <Tr key={a.id as number}>
                      <Td mono className="whitespace-nowrap text-mist tnum">{utc(String(a.createdAt))}</Td>
                      <Td className="text-paper">{l?.title ?? String(a.lessonId)}</Td>
                      <Td mono className="text-mist tnum">
                        {score}/{total}
                      </Td>
                      <Td mono className="text-cyan tnum">%{pct}</Td>
                      <Td>
                        <Pill tone={pct >= 70 ? "ok" : "warn"}>{pct >= 70 ? "geçti" : "kaldı"}</Pill>
                      </Td>
                      <Td>
                        <Pill tone="idle">{String(a.mode) === "investigation" ? "INV" : "LRN"}</Pill>
                      </Td>
                    </Tr>
                  );
                })}
              </Table>
            )}
          </Panel>

          <Panel title="Laboratuvar İlerlemesi" en="Lab progress">
            <div className="grid gap-3 p-4 sm:grid-cols-2">
              {LAB_MODULES.map((m) => {
                const st = snap.labs.find((l) => l.moduleId === m.key);
                const steps = JSON.parse(st?.stepsDone || "[]") as string[];
                return (
                  <a
                    key={m.key}
                    href={`/laboratuvar/${m.key}`}
                    className="border border-line bg-charcoal p-3.5 transition-colors hover:border-cyan/50"
                  >
                    <div className="flex items-center justify-between">
                      <Micro className="text-cyan">{m.code}</Micro>
                      <Pill tone={st?.status === "completed" ? "ok" : steps.length ? "info" : "idle"}>
                        {steps.length}/{m.steps.length}
                      </Pill>
                    </div>
                    <div className="mt-2 text-[13.5px] text-paper">{m.title}</div>
                    <div className="mt-2">
                      <Progress value={Math.round((steps.length / m.steps.length) * 100)} tone={st?.status === "completed" ? "good" : "cyan"} />
                    </div>
                    {!!st?.completedAt && (
                      <div className="mt-2 font-mono text-[10.5px] text-mist tnum">Tamamlandı: {utc(String(st.completedAt))}</div>
                    )}
                  </a>
                );
              })}
            </div>
          </Panel>
        </div>

        <div className="space-y-5">
          <Panel title="Rozetler" en="Badges">
            <div className="grid grid-cols-2 gap-2.5 p-4">
              {snap.badges.length === 0 && <div className="col-span-2"><Empty text="Henüz rozet kazanılmadı." /></div>}
              {snap.badges.map((b) => (
                <div key={String(b.code)} className="border border-amber/45 bg-amber/[0.07] p-3 text-center">
                  <Award size={17} className="mx-auto text-amber" />
                  <div className="mt-2 text-[12.5px] font-medium text-paper">{String(b.label)}</div>
                  <div className="mt-1 font-mono text-[10px] text-mist tnum">{b.earnedAt ? utc(String(b.earnedAt)) : ""}</div>
                </div>
              ))}
              {[
                { code: "all_lessons", label: "Tüm Dersler", need: `${completed.length}/${LESSONS.length}` },
                { code: "all_labs", label: "Tüm Laboratuvarlar", need: `${snap.stats.completedLabs}/8` },
                { code: "all_findings", label: "10 Bulgu", need: `${snap.stats.findings}/10` },
                { code: "report", label: "İlk Rapor", need: `${snap.reports.length}/1` },
              ].map((b) => (
                <div key={b.code} className="border border-dashed border-line2 p-3 text-center opacity-70">
                  <Award size={17} className="mx-auto text-mist" />
                  <div className="mt-2 text-[12.5px] text-mist2">{b.label}</div>
                  <div className="mt-1 font-mono text-[10px] text-mist tnum">{b.need}</div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel title="Devam Eden Dersler" en="In progress">
            {inProgress.length === 0 ? (
              <div className="p-4"><Empty text="Devam eden ders yok." hint="Akademiden bir ders başlatın." /></div>
            ) : (
              <ul className="divide-y divide-line/70">
                {inProgress.map((p) => {
                  const l = LESSONS.find((x) => x.id === p.lessonId);
                  return (
                    <li key={p.lessonId}>
                      <a href={`/akademi/${p.lessonId}`} className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-white/[0.03]">
                        <GraduationCap size={14} className="shrink-0 text-blue2" />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-paper">{l?.title ?? p.lessonId}</span>
                        <span className="font-mono text-[10.5px] text-mist">devam</span>
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Tamamlanan Dersler" en="Completed">
            {completed.length === 0 ? (
              <div className="p-4"><Empty text="Tamamlanan ders yok." /></div>
            ) : (
              <ul className="max-h-[380px] divide-y divide-line/70 overflow-y-auto">
                {completed.map((p) => {
                  const l = LESSONS.find((x) => x.id === p.lessonId);
                  return (
                    <li key={p.lessonId}>
                      <a href={`/akademi/${p.lessonId}`} className="flex items-center gap-3 px-4 py-2.5 transition-colors hover:bg-white/[0.03]">
                        <FlaskConical size={13} className="shrink-0 text-good" />
                        <span className="min-w-0 flex-1 truncate text-[13px] text-paper">{l?.title ?? p.lessonId}</span>
                        {p.score !== null && p.score !== undefined && (
                          <span className="font-mono text-[10.5px] text-mist tnum">
                            {p.score}/{l?.quiz.length}
                          </span>
                        )}
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </Panel>

          <Panel title="Denetim Kaydı" en="Audit log">
            <ul className="max-h-[300px] divide-y divide-line/70 overflow-y-auto">
              {snap.audit.map((a) => (
                <li key={a.id as number} className="px-4 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.1em] text-cyan">{String(a.action)}</span>
                    <span className="ml-auto font-mono text-[10px] text-mist tnum">{utc(String(a.at))}</span>
                  </div>
                  <p className="mt-1 text-[12px] leading-relaxed text-mist2">{String(a.detail)}</p>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}
