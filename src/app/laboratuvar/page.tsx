"use client";

import Link from "next/link";
import { ArrowRight, FlaskConical, GraduationCap, TriangleAlert } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Micro, PageHead, Panel, Pill, Progress } from "@/components/ui";
import { LAB_MODULES } from "@/data/labs";
import { getLesson } from "@/data/academy";
import { SIMULATION_NOTICE } from "@/lib/report-shared";

export default function LabIndex() {
  const { snap } = useStore();
  const labs = snap?.labs ?? [];

  return (
    <div>
      <div className="relative mb-7 overflow-hidden border border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40"
          style={{ backgroundImage: "url(images/lab-imaging.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/92 to-charcoal/20" aria-hidden="true" />
        <div className="relative px-5 py-9 sm:px-8 sm:py-11">
          <Micro className="text-cyan">AG CYBER LAB Forensics</Micro>
          <h1 className="mt-3 max-w-3xl text-[30px] font-bold leading-[1.02] tracking-tight text-paper sm:text-[40px]">
            Sanal İnceleme Laboratuvarı
          </h1>
          <p className="mt-3 max-w-2xl text-[14px] leading-relaxed text-mist2">
            Sekiz uygulama modülü; her biri kendi sentetik delil setine, açıklamasına, araçlarına, işlem geçmişine ve
            bulgularına sahiptir. Bütün modüller aynı soruşturma dosyaları üzerinden birbiriyle ilişkilendirilir.
          </p>
          <div className="mt-5 flex flex-wrap gap-2.5">
            <Btn href="/dosyalar" tone="cyan">
              Soruşturma Dosyaları
            </Btn>
            <Btn href="/envanter" tone="default">
              Delil Envanteri
            </Btn>
            <Btn href="/bulgular" tone="default">
              Bulgular
            </Btn>
          </div>
        </div>
      </div>

      <div className="mb-5 flex items-start gap-2.5 border border-amber/45 bg-amber/[0.07] px-4 py-3">
        <TriangleAlert size={16} className="mt-0.5 shrink-0 text-amber" />
        <p className="text-[12.5px] leading-relaxed text-mist2">
          <span className="micro mr-2 text-amber">Simülasyon</span>
          {SIMULATION_NOTICE}
        </p>
      </div>

      <PageHead
        kicker="Laboratuvar · Laboratory Modules"
        title="Sekiz Uygulama Modülü"
        en="Applied forensics modules"
        desc="Her modülde beş adım vardır. Adımlar tamamlandığında modül tamamlanır; bulgu yalnızca incelenmiş delillere bağlanabilir."
        right={
          <div className="text-right">
            <Micro>Tamamlanan</Micro>
            <div className="mt-1 font-mono text-[28px] leading-none text-cyan tnum">
              {labs.filter((l) => l.status === "completed").length}/8
            </div>
          </div>
        }
      />

      <div className="grid gap-4 lg:grid-cols-2">
        {LAB_MODULES.map((m) => {
          const st = labs.find((l) => l.moduleId === m.key);
          const steps = JSON.parse(st?.stepsDone || "[]") as string[];
          const pct = Math.round((steps.length / m.steps.length) * 100);
          const lesson = getLesson(m.lessonId);
          const caseCount = m.caseIds.length;
          return (
            <article key={m.key} className="flex flex-col border border-line bg-panel/60 transition-colors hover:border-cyan/40">
              <header className="flex items-start gap-3 border-b border-line px-4 py-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center border border-cyan/50 bg-cyan/10 font-mono text-[15px] text-cyan">
                  {m.key}
                </span>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <Micro className="text-cyan">{m.code}</Micro>
                    <Pill tone={st?.status === "completed" ? "ok" : steps.length ? "info" : "idle"}>
                      {st?.status === "completed" ? "Tamamlandı" : `${steps.length}/${m.steps.length} adım`}
                    </Pill>
                  </div>
                  <h2 className="mt-1.5 text-[16px] font-semibold text-paper">{m.title}</h2>
                  <div className="font-mono text-[10.5px] uppercase tracking-[0.11em] text-mist">{m.titleEn}</div>
                </div>
              </header>

              <div className="flex-1 space-y-3.5 p-4">
                <p className="text-[13px] leading-relaxed text-mist2">{m.summary}</p>

                <div className="flex flex-wrap gap-1.5">
                  {m.tools.map((t) => (
                    <Pill key={t} tone="idle">
                      {t}
                    </Pill>
                  ))}
                </div>

                <div>
                  <Micro>Adımlar</Micro>
                  <ol className="mt-2 space-y-1.5">
                    {m.steps.map((s, i) => {
                      const done = steps.includes(s.id);
                      return (
                        <li key={s.id} className="flex gap-2.5 text-[12.5px] leading-relaxed">
                          <span className={`font-mono text-[11px] tnum ${done ? "text-good" : "text-mist"}`}>
                            {String(i + 1).padStart(2, "0")}
                          </span>
                          <span className={done ? "text-good" : "text-mist2"}>{s.label}</span>
                        </li>
                      );
                    })}
                  </ol>
                </div>

                <div>
                  <Micro>İlerleme</Micro>
                  <div className="mt-1.5">
                    <Progress value={pct} tone={st?.status === "completed" ? "good" : "cyan"} />
                  </div>
                </div>

                <div className="flex flex-wrap items-center gap-2 border-t border-line pt-3">
                  <Micro>Vaka</Micro>
                  {m.caseIds.slice(0, 2).map((c) => (
                    <Link key={c} href="/dosyalar">
                      <Pill tone="info" className="hover:bg-blue/25">
                        {c}
                      </Pill>
                    </Link>
                  ))}
                  {caseCount > 2 && <Pill tone="idle">+{caseCount - 2}</Pill>}
                </div>
              </div>

              <footer className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
                <Btn href={`/laboratuvar/${m.key}`} tone="cyan">
                  <FlaskConical size={13} /> Modülü Aç
                </Btn>
                {lesson && (
                  <Btn href={`/akademi/${lesson.id}`} tone="default">
                    <GraduationCap size={13} /> Bu Konuyu Akademide Öğren
                  </Btn>
                )}
                <span className="ml-auto self-center text-mist">
                  <ArrowRight size={14} />
                </span>
              </footer>
            </article>
          );
        })}
      </div>

      <Panel className="mt-6" title="Laboratuvar İlke Kuralları" en="Lab rules">
        <ul className="grid gap-3 p-4 md:grid-cols-2">
          {[
            "Edinilmemiş delil için hash doğrulanmış gösterilemez; durum makinesi bu geçişi reddeder.",
            "İncelenmemiş bir delil için bulgu üretilemez; bulgu, incelemenin çıktısıdır.",
            "Kurtarma simülasyonunda her dosyanın gerçekten kurtarılabilir olup olmadığı ayrı ayrı belirtilir.",
            "Tarayıcı geçmişinde bulunmayan bir işlemin kesinlikle gerçekleşmediği iddia edilmez.",
            "Bir USB cihazının bağlanması, tek başına belirli bir dosyanın kopyalandığını kanıtlamaz.",
            "Zaman çizelgesindeki eksik veya çelişkili bilgiler gizlenmez, ayrıca işaretlenir.",
          ].map((t) => (
            <li key={t} className="flex gap-2.5 text-[12.5px] leading-relaxed text-mist2">
              <span className="mt-[7px] h-1.5 w-1.5 shrink-0 bg-cyan" />
              <span>{t}</span>
            </li>
          ))}
        </ul>
      </Panel>
    </div>
  );
}
