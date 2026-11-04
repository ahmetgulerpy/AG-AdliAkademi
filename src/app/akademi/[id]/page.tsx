"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, FlaskConical, Lightbulb, XCircle } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, CodeBlock, DiagramFlow, Micro, PageHead, Panel, Pill } from "@/components/ui";
import { LESSONS, getLesson } from "@/data/academy";
import { getLab } from "@/data/labs";

export default function LessonPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const lesson = getLesson(id);
  const { snap, act } = useStore();

  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [result, setResult] = useState<{ score: number; total: number; detail: { correct: boolean; explain: string; answer: number }[] } | null>(null);
  const [hint, setHint] = useState(false);

  const progress = snap?.lessonProgress?.find((p) => p.lessonId === id);
  const completed = progress?.status === "completed";
  const lab = lesson?.labModule ? getLab(lesson.labModule) : undefined;

  useEffect(() => {
    if (lesson) void act("lessonStart", { lessonId: lesson.id });
    setAnswers({});
    setResult(null);
    setHint(false);
    window.scrollTo({ top: 0 });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const neighbours = useMemo(() => {
    const i = LESSONS.findIndex((l) => l.id === id);
    return { prev: LESSONS[i - 1], next: LESSONS[i + 1] };
  }, [id]);

  if (!lesson) {
    return (
      <div className="border border-bad/50 bg-bad/10 p-6">
        <h1 className="text-[18px] text-paper">Ders bulunamadı</h1>
        <p className="mt-2 text-[13px] text-mist2">Kayıtlı ders kimliği: {id}</p>
        <Btn href="/akademi" tone="cyan" className="mt-4">
          Akademiye Dön
        </Btn>
      </div>
    );
  }

  const submit = async () => {
    const detail = lesson.quiz.map((q, i) => ({
      correct: answers[i] === q.answer,
      explain: q.explain,
      answer: q.answer,
    }));
    const res = await act("quizSubmit", { lessonId: lesson.id, answers: lesson.quiz.map((_, i) => answers[i]) });
    const d = res.data as { score: number; total: number } | undefined;
    setResult({ score: d?.score ?? detail.filter((x) => x.correct).length, total: lesson.quiz.length, detail });
  };

  const lvlPill = lesson.level === "beginner" ? "info" : lesson.level === "intermediate" ? "cyan" : "wait";

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-3">
        <Link href="/akademi" className="inline-flex items-center gap-1.5 font-mono text-[11px] uppercase tracking-[0.13em] text-mist hover:text-cyan">
          <ArrowLeft size={13} /> Akademi
        </Link>
        <span className="h-3 w-px bg-line2" />
        <Pill tone={lvlPill}>
          {lesson.level === "beginner" ? "Level 1 · Beginner" : lesson.level === "intermediate" ? "Level 2 · Intermediate" : "Level 3 · Advanced"}
        </Pill>
        <Pill tone={completed ? "ok" : progress?.status === "in_progress" ? "info" : "idle"}>
          {completed ? "Tamamlandı" : progress?.status === "in_progress" ? "Devam ediyor" : "Başlanmadı"}
        </Pill>
        <span className="ml-auto font-mono text-[11px] text-mist tnum">
          {String(lesson.order).padStart(2, "0")} / {LESSONS.length} · {lesson.minutes} dk
        </span>
      </div>

      <PageHead
        kicker={`${lesson.id} · Öğrenme Hedefleri`}
        title={lesson.title}
        en={lesson.titleEn}
        desc={lesson.summary}
        right={
          <div className="flex flex-col items-end gap-2">
            <Btn
              onClick={() => (completed ? undefined : void act("lessonComplete", { lessonId: lesson.id }))}
              tone={completed ? "default" : "primary"}
              disabled={completed}
            >
              {completed ? "Ders Tamamlandı" : "Dersi Tamamla"}
            </Btn>
            {lab && (
              <Btn href={`/laboratuvar/${lab.key}`} tone="cyan">
                <FlaskConical size={13} /> Bu Konuyu Laboratuvarda Uygula
              </Btn>
            )}
          </div>
        }
      />

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_300px]">
        <div className="min-w-0 space-y-5">
          <Panel title="Öğrenme Hedefleri" en="Learning Objectives">
            <ol className="grid gap-2.5 p-4 md:grid-cols-2">
              {lesson.objectives.map((o, i) => (
                <li key={o} className="flex gap-3 border border-line bg-charcoal px-3 py-2.5 text-[12.5px] leading-relaxed text-mist2">
                  <span className="font-mono text-[11px] text-cyan tnum">O{i + 1}</span>
                  <span>{o}</span>
                </li>
              ))}
            </ol>
          </Panel>

          <Panel title="Konunun Tanımı" en="Definition">
            <p className="p-4 text-[14px] leading-[1.75] text-paper/90">{lesson.definition}</p>
          </Panel>

          <Panel title="Teknik Çalışma Prensibi" en="Technical Principle">
            <ol className="space-y-3 p-4">
              {lesson.principle.map((p, i) => (
                <li key={i} className="flex gap-3 border-l-2 border-blue/70 pl-4">
                  <span className="font-mono text-[11px] text-blue2 tnum">{String(i + 1).padStart(2, "0")}</span>
                  <p className="text-[13.5px] leading-[1.7] text-mist2">{p}</p>
                </li>
              ))}
            </ol>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Neden Önemlidir?" en="Why it matters">
              <ul className="space-y-3 p-4">
                {lesson.why.map((w) => (
                  <li key={w} className="flex gap-2.5 text-[13px] leading-relaxed text-mist2">
                    <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-amber" />
                    <span>{w}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Nasıl Çalışır?" en="How it works">
              <ol className="space-y-2.5 p-4">
                {lesson.how.map((h) => (
                  <li key={h} className="text-[13px] leading-relaxed text-mist2">
                    {h}
                  </li>
                ))}
              </ol>
            </Panel>
          </div>

          <DiagramFlow title={lesson.diagram.title} nodes={lesson.diagram.nodes} note={lesson.diagram.note} />

          <Panel title="Kullanılan Araçlar" en="Tools">
            <div className="grid gap-3 p-4 md:grid-cols-2">
              {lesson.tools.map((t) => (
                <div key={t.name} className="border border-line bg-charcoal p-3">
                  <div className="font-mono text-[12.5px] text-cyan">{t.name}</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-mist2">{t.desc}</p>
                </div>
              ))}
            </div>
          </Panel>

          <div className="grid gap-5 md:grid-cols-2">
            <Panel title="Gerçek Dünyada Kullanımı" en="Real-world use">
              <ul className="space-y-2.5 p-4">
                {lesson.realWorld.map((r) => (
                  <li key={r} className="flex gap-2.5 text-[13px] leading-relaxed text-mist2">
                    <span className="font-mono text-cyan">›</span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </Panel>
            <Panel title="Sık Yapılan Hatalar" en="Common mistakes" className="border-amber/40">
              <ul className="space-y-3.5 p-4">
                {lesson.mistakes.map((m) => (
                  <li key={m.wrong} className="border-l-2 border-amber/70 pl-3.5">
                    <div className="flex gap-2 text-[13px] font-medium text-amber">
                      <XCircle size={14} className="mt-0.5 shrink-0" />
                      <span>{m.wrong}</span>
                    </div>
                    <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">{m.why}</p>
                  </li>
                ))}
              </ul>
            </Panel>
          </div>

          <Panel title="Teknik Örnek" en="Technical example">
            <div className="p-4">
              <CodeBlock caption={lesson.example.caption}>{lesson.example.code}</CodeBlock>
            </div>
          </Panel>

          {/* ————— Bilgi kontrolü + sınav ————— */}
          <Panel title="Bilgi Kontrolü ve Modül Sonu Sınavı" en="Knowledge check & final quiz" className="border-blue/40">
            <div className="space-y-5 p-4">
              {lesson.quiz.map((q, qi) => {
                const chosen = answers[qi];
                const shown = result?.detail[qi];
                return (
                  <fieldset key={qi} className="border border-line bg-charcoal p-4">
                    <legend className="px-2">
                      <Micro className="text-blue2">Soru {String(qi + 1).padStart(2, "0")}</Micro>
                    </legend>
                    <p className="text-[14px] leading-relaxed text-paper">{q.q}</p>
                    <div className="mt-3 space-y-2">
                      {q.options.map((opt, oi) => {
                        const isChosen = chosen === oi;
                        const isAnswer = q.answer === oi;
                        let cls = "border-line2 hover:border-mist hover:bg-white/[0.03]";
                        if (shown) {
                          if (isAnswer) cls = "border-good/60 bg-good/10";
                          else if (isChosen) cls = "border-bad/60 bg-bad/10";
                          else cls = "border-line opacity-60";
                        } else if (isChosen) cls = "border-blue bg-blue/15";
                        return (
                          <label
                            key={oi}
                            className={`flex cursor-pointer items-start gap-3 border px-3 py-2.5 text-[13px] leading-relaxed transition-colors ${cls}`}
                          >
                            <input
                              type="radio"
                              name={`q-${qi}`}
                              checked={isChosen}
                              onChange={() => setAnswers((a) => ({ ...a, [qi]: oi }))}
                              disabled={!!result}
                              className="mt-1 accent-[#2F6BFF]"
                            />
                            <span className={shown && !isAnswer ? "text-mist" : "text-paper"}>
                              <span className="mr-2 font-mono text-[11px] text-mist">{String.fromCharCode(65 + oi)}</span>
                              {opt}
                            </span>
                            {shown && isAnswer && <CheckCircle2 size={15} className="ml-auto shrink-0 text-good" />}
                            {shown && !isAnswer && isChosen && <XCircle size={15} className="ml-auto shrink-0 text-bad" />}
                          </label>
                        );
                      })}
                    </div>
                    {shown && (
                      <div
                        className={`mt-3 border px-3 py-2.5 text-[12.5px] leading-relaxed ${
                          shown.correct ? "border-good/45 bg-good/8 text-good" : "border-amber/50 bg-amber/8 text-mist2"
                        }`}
                      >
                        <Micro className={shown.correct ? "text-good" : "text-amber"}>
                          {shown.correct ? "Doğru" : "Neden yanlış?"}
                        </Micro>
                        <p className="mt-1.5">{q.explain}</p>
                      </div>
                    )}
                  </fieldset>
                );
              })}

              {!result ? (
                <div className="flex flex-wrap items-center gap-3">
                  <Btn
                    onClick={() => void submit()}
                    tone="primary"
                    disabled={Object.keys(answers).length < lesson.quiz.length}
                    title={Object.keys(answers).length < lesson.quiz.length ? "Tüm soruları yanıtlayın" : ""}
                  >
                    Sınavı Gönder
                  </Btn>
                  <span className="font-mono text-[11px] text-mist tnum">
                    {Object.keys(answers).length}/{lesson.quiz.length} yanıtlandı
                  </span>
                  <span className="ml-auto text-[12px] text-mist">Geçme notu: %70</span>
                </div>
              ) : (
                <div
                  className={`flex flex-wrap items-center gap-3 border px-4 py-3 ${
                    (result.score / result.total) * 100 >= 70 ? "border-good/50 bg-good/10" : "border-amber/50 bg-amber/10"
                  }`}
                >
                  <span className="font-mono text-[13px] text-paper tnum">
                    {result.score}/{result.total} doğru · %{Math.round((result.score / result.total) * 100)}
                  </span>
                  <span className={`text-[12.5px] ${(result.score / result.total) * 100 >= 70 ? "text-good" : "text-amber"}`}>
                    {(result.score / result.total) * 100 >= 70
                      ? "Ders tamamlandı sayıldı."
                      : "Geçme notu altında. Açıklamaları gözden geçirip tekrar deneyin."}
                  </span>
                  <div className="ml-auto flex gap-2">
                    <Btn
                      onClick={() => {
                        setAnswers({});
                        setResult(null);
                      }}
                      tone="default"
                    >
                      Tekrar Dene
                    </Btn>
                    {(result.score / result.total) * 100 >= 70 && (
                      <Btn onClick={() => void act("lessonComplete", { lessonId: lesson.id })} tone="cyan">
                        Tamamlandı İşaretle
                      </Btn>
                    )}
                  </div>
                </div>
              )}
            </div>
          </Panel>

          <Panel title="İleri Okuma ve Kaynaklar" en="Further reading">
            <ul className="space-y-3 p-4">
              {lesson.readings.map((r) => (
                <li key={r.title} className="border border-line bg-charcoal px-3.5 py-3">
                  <div className="text-[13px] font-medium text-paper">{r.title}</div>
                  <p className="mt-1 text-[12.5px] leading-relaxed text-mist2">{r.note}</p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="grid gap-3 sm:grid-cols-2">
            {neighbours.prev ? (
              <a href={`/akademi/${neighbours.prev.id}`} className="group border border-line bg-panel/60 p-4 transition-colors hover:border-line2">
                <Micro>← Önceki</Micro>
                <div className="mt-1.5 text-[14px] text-paper group-hover:text-cyan">{neighbours.prev.title}</div>
              </a>
            ) : (
              <span />
            )}
            {neighbours.next && (
              <a
                href={`/akademi/${neighbours.next.id}`}
                className="group border border-line bg-panel/60 p-4 text-right transition-colors hover:border-line2"
              >
                <Micro>Sonraki →</Micro>
                <div className="mt-1.5 text-[14px] text-paper group-hover:text-cyan">{neighbours.next.title}</div>
              </a>
            )}
          </div>
        </div>

        {/* Sağ ray */}
        <aside className="space-y-4 xl:sticky xl:top-[68px] xl:self-start">
          <div className="border border-line bg-panel/70 p-4">
            <Micro className="text-cyan">Bu Ders Hakkında</Micro>
            <dl className="mt-3 space-y-2.5 font-mono text-[11.5px]">
              {[
                ["Kimlik", lesson.id],
                ["Seviye", lesson.level],
                ["Süre", `${lesson.minutes} dk`],
                ["Soru", `${lesson.quiz.length}`],
                ["Lab", lesson.labModule ? `MODÜL ${lesson.labModule}` : "—"],
              ].map(([k, v]) => (
                <div key={k} className="flex justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-mist">{k}</dt>
                  <dd className="truncate text-paper tnum">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <Micro>Durum</Micro>
              <div className="mt-1.5">
                <Pill tone={completed ? "ok" : "idle"}>{completed ? "completed" : progress?.status ?? "not_started"}</Pill>
              </div>
            </div>
          </div>

          <div className="border border-line bg-panel/70 p-4">
            <div className="flex items-center gap-2">
              <Lightbulb size={14} className="text-amber" />
              <Micro className="text-amber">İpucu</Micro>
            </div>
            <button
              onClick={() => setHint((h) => !h)}
              className="mt-2 w-full border border-line2 px-3 py-2 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist2 transition-colors hover:border-amber hover:text-amber"
            >
              {hint ? "İpucunu Gizle" : "İpucunu Göster"}
            </button>
            {hint && (
              <p className="mt-2.5 text-[12.5px] leading-relaxed text-mist2">
                Öğrenme modunda ipuçları açıktır. İnceleme modunda ipuçları isteğe bağlıdır; yanıtları önce kendin
                değerlendirmen beklenir.
              </p>
            )}
          </div>

          {lab && (
            <div className="border border-cyan/40 bg-cyan/[0.06] p-4">
              <Micro className="text-cyan">Uygulama Bağlantısı</Micro>
              <h4 className="mt-2 text-[14px] font-medium text-paper">{lab.title}</h4>
              <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">{lab.summary}</p>
              <div className="mt-3">
                <Btn href={`/laboratuvar/${lab.key}`} tone="cyan" className="w-full justify-center">
                  <ArrowRight size={13} /> Laboratuvara Geç
                </Btn>
              </div>
            </div>
          )}

          <div className="border border-line bg-panel/70 p-4">
            <Micro>Mod Sıfırlama</Micro>
            <p className="mt-2 text-[12.5px] leading-relaxed text-mist2">
              Bu dersteki yanıtlar ve ilerleme, seçili çalışma moduyla (Öğrenme / İnceleme) ayrı ayrı kaydedilir.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
