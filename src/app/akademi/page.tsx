"use client";

import Link from "next/link";
import { useMemo } from "react";
import { ChevronRight, FlaskConical, BookOpen } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Empty, Micro, PageHead, Panel, Pill, Progress } from "@/components/ui";
import { LESSONS, LEVELS, lessonsByLevel } from "@/data/academy";
import type { Level } from "@/data/types";

export default function AcademyPage() {
  const { snap } = useStore();
  const progress = useMemo(() => {
    const m = new Map<string, { status: string; score: number | null }>();
    (snap?.lessonProgress ?? []).forEach((p) => m.set(p.lessonId, { status: p.status, score: p.score ?? null }));
    return m;
  }, [snap?.lessonProgress]);

  const done = (id: string) => progress.get(id)?.status === "completed";

  return (
    <div>
      <div className="relative mb-7 overflow-hidden border border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(images/academy-bench.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/90 to-charcoal/30" aria-hidden="true" />
        <div className="relative px-5 py-9 sm:px-8 sm:py-11">
          <Micro className="text-cyan">AG CYBER LAB Academy</Micro>
          <h1 className="mt-3 max-w-3xl text-[30px] font-bold leading-[1.02] tracking-tight text-paper sm:text-[40px]">
            Dijital Adli Bilişim Akademisi
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-mist2">
            Başlangıçtan ileri seviyeye üç aşamalı eğitim programı. Her ders; öğrenme hedefleri, teknik çalışma prensibi,
            gerçek çıktı örnekleri, etkileşimli diyagram, sık yapılan hatalar, bilgi kontrolü ve modül sonu sınavı içerir.
            Her dersin sonunda doğrudan ilgili laboratuvar modülüne geçebilirsin.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Btn href="/program" tone="cyan">
              Eğitim Programı
            </Btn>
            <Btn href="/ilerleme" tone="default">
              İlerlemem
            </Btn>
          </div>
        </div>
      </div>

      <PageHead
        kicker="Üç Seviye · Three Levels"
        title="Öğrenme Yolu"
        en="Learning Path"
        desc="Seviyeler birbirinin ön koşuludur: tamamlanan ders ve laboratuvar sayılarına göre seviyen otomatik yükselir."
        right={
          <div className="text-right">
            <Micro>Toplam İlerleme</Micro>
            <div className="mt-1 font-mono text-[28px] leading-none text-cyan tnum">
              {Math.round(
                ((snap?.stats.completedLessons ?? 0) / LESSONS.length) * 100,
              )}
              %
            </div>
          </div>
        }
      />

      <div className="space-y-6">
        {LEVELS.map((lv) => {
          const list = lessonsByLevel(lv.key as Level);
          const finished = list.filter((l) => done(l.id)).length;
          const pct = Math.round((finished / list.length) * 100);
          const locked = false;
          return (
            <Panel
              key={lv.key}
              title={`${lv.code} — ${lv.title}`}
              en={lv.titleEn}
              right={
                <div className="flex items-center gap-3">
                  <Pill tone={pct === 100 ? "ok" : pct > 0 ? "info" : "idle"}>
                    {finished}/{list.length}
                  </Pill>
                  <span className="font-mono text-[11px] text-mist tnum">%{pct}</span>
                </div>
              }
            >
              <div className="grid gap-5 p-4 lg:grid-cols-[280px_minmax(0,1fr)]">
                <div>
                  <p className="text-[13px] leading-relaxed text-mist2">{lv.desc}</p>
                  <div className="mt-4">
                    <Progress value={pct} />
                  </div>
                  <dl className="mt-4 space-y-2 font-mono text-[11px]">
                    <div className="flex justify-between border-b border-line pb-2">
                      <dt className="text-mist">Ders süresi</dt>
                      <dd className="text-paper tnum">{list.reduce((s, l) => s + l.minutes, 0)} dk</dd>
                    </div>
                    <div className="flex justify-between border-b border-line pb-2">
                      <dt className="text-mist">Sınav sorusu</dt>
                      <dd className="text-paper tnum">{list.reduce((s, l) => s + l.quiz.length, 0)}</dd>
                    </div>
                    <div className="flex justify-between">
                      <dt className="text-mist">Bağlantılı lab</dt>
                      <dd className="text-paper tnum">{new Set(list.map((l) => l.labModule).filter(Boolean)).size}</dd>
                    </div>
                  </dl>
                  <div className="mt-4">
                    <Btn href="/program" tone="default" className="w-full justify-center">
                      Program Tablosu
                    </Btn>
                  </div>
                </div>

                <ol className="space-y-1.5">
                  {list.map((l, i) => {
                    const d = done(l.id);
                    const inProg = progress.get(l.id)?.status === "in_progress";
                    const score = progress.get(l.id)?.score;
                    return (
                      <li key={l.id}>
                        <Link
                          href={`/akademi/${l.id}`}
                          className={`group flex items-start gap-3 border px-3.5 py-3 transition-all duration-150 ${
                            d
                              ? "border-good/35 bg-good/[0.05] hover:border-good/60"
                              : inProg
                                ? "border-blue/50 bg-blue/[0.07] hover:border-blue"
                                : "border-line bg-charcoal/70 hover:border-line2 hover:bg-panel"
                          }`}
                        >
                          <span
                            className={`mt-0.5 font-mono text-[11px] tnum ${
                              d ? "text-good" : inProg ? "text-blue2" : "text-mist"
                            }`}
                          >
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className="min-w-0 flex-1">
                            <span className="flex flex-wrap items-center gap-2">
                              <span className="text-[14px] font-medium text-paper">{l.title}</span>
                              {d && <Pill tone="ok">Tamamlandı</Pill>}
                              {score !== undefined && score !== null && (
                                <span className="font-mono text-[10px] text-mist tnum">
                                  Sınav {score}/{l.quiz.length}
                                </span>
                              )}
                            </span>
                            <span className="mt-1 block font-mono text-[10.5px] uppercase tracking-[0.1em] text-mist">
                              {l.titleEn}
                            </span>
                            <span className="mt-1.5 block text-[12.5px] leading-relaxed text-mist2">{l.summary}</span>
                            <span className="mt-2 flex flex-wrap items-center gap-2.5">
                              <Micro className="text-[9px]">{l.minutes} dk</Micro>
                              <Micro className="text-[9px]">{l.quiz.length} soru</Micro>
                              {l.labModule && (
                                <span className="inline-flex items-center gap-1 font-mono text-[10px] text-cyan">
                                  <FlaskConical size={11} /> MODÜL {l.labModule}
                                </span>
                              )}
                            </span>
                          </span>
                          <ChevronRight
                            size={16}
                            className="mt-1 shrink-0 text-mist transition-transform duration-150 group-hover:translate-x-1 group-hover:text-cyan"
                          />
                        </Link>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </Panel>
          );
        })}
      </div>

      {!snap && (
        <div className="mt-6">
          <Empty text="İlerleme verisi yükleniyor…" />
        </div>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3 border border-line bg-panel/60 px-4 py-3.5">
        <BookOpen size={15} className="text-cyan" />
        <p className="flex-1 text-[12.5px] text-mist2">
          Etkileşimli bileşenler: terim sözlüğü, kavram kartları, hash karşılaştırma aracı, zaman damgası açıklama aracı,
          Windows Event ID öğrenme alanı, örnek Registry inceleme alanı ve çoktan seçmeli sınavlar.
        </p>
        <Btn href="/sozluk" tone="cyan">
          Sözlüğü Aç
        </Btn>
      </div>
    </div>
  );
}
