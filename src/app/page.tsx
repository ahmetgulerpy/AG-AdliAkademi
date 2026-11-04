"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Radio, ShieldCheck, AlertTriangle } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, DiagramFlow, Empty, Micro, PageHead, Panel, Pill, Stat, Table, Td, Tr } from "@/components/ui";
import { CASES, EVIDENCE } from "@/data/cases";
import { LESSONS } from "@/data/academy";
import { LAB_MODULES } from "@/data/labs";
import { STATUS_LABELS, STATUS_TONE } from "@/lib/evidence-state";
import { bytes, utc } from "@/lib/format";

export default function Dashboard() {
  const { snap, loading, act } = useStore();
  const [clock, setClock] = useState("");
  const mode = snap?.profile?.mode ?? "learning";

  useEffect(() => {
    const t = setInterval(() => setClock(new Date().toISOString().slice(11, 19) + "Z"), 1000);
    setClock(new Date().toISOString().slice(11, 19) + "Z");
    return () => clearInterval(t);
  }, []);

  const activeCase = useMemo(
    () => CASES.find((c) => c.caseId === (snap?.profile?.activeCaseId ?? "AG-DFIR-2026-001")) ?? CASES[0],
    [snap?.profile?.activeCaseId],
  );

  const nextLesson = useMemo(() => {
    const done = new Set((snap?.lessonProgress ?? []).filter((l) => l.status === "completed").map((l) => l.lessonId));
    return LESSONS.find((l) => !done.has(l.id)) ?? LESSONS[0];
  }, [snap?.lessonProgress]);

  const nextLab = useMemo(() => {
    const labs = snap?.labs ?? [];
    return LAB_MODULES.find((m) => labs.find((l) => l.moduleId === m.key)?.status !== "completed") ?? LAB_MODULES[0];
  }, [snap?.labs]);

  if (loading || !snap) {
    return (
      <div className="grid min-h-[60vh] place-items-center">
        <div className="text-center">
          <div className="mx-auto mb-4 h-8 w-8 animate-spin border-2 border-line2 border-t-cyan" />
          <Micro>Yerel SQLite veritabanı okunuyor…</Micro>
        </div>
      </div>
    );
  }

  const recentCustody = [...snap.custody].sort((a, b) => (b.id as number) - (a.id as number)).slice(0, 7);
  const problems = snap.evidence.filter((e) => e.status === "integrity_issue");

  return (
    <div>
      {/* ————— HERO ————— */}
      <div className="relative mb-7 overflow-hidden border border-line">
        <div
          className="absolute inset-0 bg-cover bg-center opacity-[0.42]"
          style={{ backgroundImage: "url(images/evidence-hero.jpg)" }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/92 to-charcoal/25" aria-hidden="true" />
        <div className="relative grid gap-6 px-5 py-9 sm:px-8 sm:py-12 lg:grid-cols-[minmax(0,1fr)_320px]">
          <div className="min-w-0">
            <Micro className="text-cyan">Digital Forensics Academy &amp; Investigation Environment</Micro>
            <h1 className="mt-3 text-[34px] font-bold leading-[0.98] tracking-[-0.02em] text-paper sm:text-[48px]">
              AG CYBER LAB
            </h1>
            <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.24em] text-mist">
              Dijital Adli Bilişim Akademisi ve Sanal İnceleme Laboratuvarı
            </p>
            <p className="mt-5 max-w-2xl text-[14px] leading-relaxed text-mist2">
              Bir konuyu akademide öğren, laboratuvar sentetik delili üzerinde uygula, bulgunu güven düzeyiyle kaydet,
              gerçek işlem kayıtlarından beslenen adli raporu üret. Her delil, bulgu ve rapor kendi kaynağıyla tutarlıdır.
            </p>
            <div className="mt-6 flex flex-wrap gap-2.5">
              <Btn href="/akademi" tone="primary">
                Eğitime Başla <ArrowRight size={13} />
              </Btn>
              <Btn href="/laboratuvar" tone="cyan">
                Laboratuvara Geç
              </Btn>
              <Btn href="/raporlar" tone="amber">
                Rapor Oluştur
              </Btn>
            </div>
          </div>

          <div className="border border-line2 bg-ink/85 p-4 backdrop-blur-sm">
            <div className="flex items-center justify-between">
              <Micro>Canlı Oturum</Micro>
              <span className="font-mono text-[11px] text-cyan tnum">{clock}</span>
            </div>
            <dl className="mt-3 space-y-2.5 font-mono text-[11.5px]">
              {[
                ["Mod", mode === "learning" ? "LEARNING" : "INVESTIGATION"],
                ["Seviye", snap.stats.level.toUpperCase()],
                ["Dosya", snap.profile.activeCaseId],
                ["İncelemeci", snap.profile.displayName],
              ].map(([k, v]) => (
                <div key={k} className="flex items-baseline justify-between gap-3 border-b border-line pb-2">
                  <dt className="text-mist">{k}</dt>
                  <dd className="truncate text-paper tnum">{v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-3">
              <Micro>Veri Kaynağı</Micro>
              <p className="mt-1.5 font-mono text-[10.5px] leading-relaxed text-mist">
                SQLite · ./data/agcyberlab.db
                <br />
                Sunucu tarafı Drizzle ORM · yerel dosya
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* ————— İstatistikler ————— */}
      <div className="mb-7 grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        <Stat label="Tamamlanan Ders" value={`${snap.stats.completedLessons}/${snap.stats.totalLessons}`} sub="Akademi modülleri" />
        <Stat label="Tamamlanan Lab" value={`${snap.stats.completedLabs}/${snap.stats.totalLabs}`} sub="Uygulama modülleri" />
        <Stat
          label="Edinilen Delil"
          value={`${snap.stats.evidenceAcquired}/${snap.stats.evidenceTotal}`}
          sub="Durum makinesi"
          tone={problems.length ? "text-bad" : "text-good"}
        />
        <Stat label="Kayıtlı Bulgu" value={snap.stats.findings} sub="Güven düzeyi ile" tone="text-cyan" />
        <Stat label="Zaman Çizelgesi" value={snap.stats.timeline} sub="UTC normalize kayıt" />
        <Stat label="Öğrenme Süresi" value={`${snap.stats.minutes}dk`} sub={`Sınav ort.: ${snap.stats.avgScore ?? "—"}`} />
      </div>

      <div className="grid gap-5 xl:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
        <div className="space-y-5">
          {/* Kaldığın yerden devam */}
          <Panel title="Kaldığın Yerden Devam" en="Resume">
            <div className="grid gap-3 p-4 md:grid-cols-2">
              <div className="border border-line bg-charcoal p-4">
                <div className="flex items-center justify-between">
                  <Micro className="text-blue2">Akademi · Academy</Micro>
                  <Pill tone="info">{nextLesson.level === "beginner" ? "L1" : nextLesson.level === "intermediate" ? "L2" : "L3"}</Pill>
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-paper">{nextLesson.title}</h3>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist">{nextLesson.titleEn}</p>
                <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-mist2">{nextLesson.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Btn href={`/akademi/${nextLesson.id}`} tone="primary">
                    Derse Devam Et
                  </Btn>
                  <span className="font-mono text-[11px] text-mist tnum">{nextLesson.minutes} dk</span>
                </div>
              </div>

              <div className="border border-line bg-charcoal p-4">
                <div className="flex items-center justify-between">
                  <Micro className="text-cyan">Laboratuvar · Laboratory</Micro>
                  <Pill tone="cyan">{nextLab.code}</Pill>
                </div>
                <h3 className="mt-2.5 text-[15px] font-semibold leading-snug text-paper">{nextLab.title}</h3>
                <p className="mt-1 font-mono text-[10.5px] uppercase tracking-[0.12em] text-mist">{nextLab.titleEn}</p>
                <p className="mt-2.5 line-clamp-3 text-[12.5px] leading-relaxed text-mist2">{nextLab.summary}</p>
                <div className="mt-3 flex items-center gap-2">
                  <Btn href={`/laboratuvar/${nextLab.key}`} tone="cyan">
                    Modülü Aç
                  </Btn>
                  <span className="font-mono text-[11px] text-mist tnum">{nextLab.steps.length} adım</span>
                </div>
              </div>
            </div>
          </Panel>

          {/* Aktif vaka */}
          <Panel
            title={`Aktif Soruşturma — ${activeCase.caseId}`}
            en="Active Case"
            right={
              <Link href="/dosyalar" className="micro text-cyan hover:underline">
                Tüm Dosyalar →
              </Link>
            }
          >
            <div className="space-y-4 p-4">
              <div>
                <h3 className="text-[17px] font-semibold text-paper">{activeCase.title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-mist2">{activeCase.subject}</p>
              </div>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="border border-line bg-charcoal p-3">
                  <Micro>Kapsam · Scope</Micro>
                  <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">{activeCase.scope}</p>
                </div>
                <div className="border border-line bg-charcoal p-3">
                  <Micro>Araştırma Soruları · Research Questions</Micro>
                  <ol className="mt-1.5 space-y-1.5">
                    {activeCase.questions.slice(0, 4).map((q, i) => (
                      <li key={q} className="flex gap-2 text-[12.5px] leading-relaxed text-mist2">
                        <span className="font-mono text-cyan tnum">{String(i + 1).padStart(2, "0")}</span>
                        <span>{q}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {activeCase.modules.map((m) => {
                  const lab = LAB_MODULES.find((l) => l.key === m);
                  return (
                    <Link key={m} href={`/laboratuvar/${m}`}>
                      <Pill tone="cyan" className="hover:bg-cyan/20">
                        {lab?.code ?? m}
                      </Pill>
                    </Link>
                  );
                })}
              </div>
            </div>
          </Panel>

          {/* Delil durumu */}
          <Panel
            title="Delil Durumu"
            en="Evidence Status"
            right={
              <Link href="/envanter" className="micro text-cyan hover:underline">
                Envanter →
              </Link>
            }
          >
            <Table head={["Delil ID", "Tür", "Kaynak Cihaz", "Boyut", "Durum", "SHA-256"]}>
              {snap.evidence.map((e) => {
                const seed = EVIDENCE.find((x) => x.evidenceId === e.evidenceId);
                const sha = (e.sha256 as string) ?? "";
                return (
                  <Tr key={e.evidenceId}>
                    <Td mono className="text-cyan">
                      {e.evidenceId}
                    </Td>
                    <Td>{String(e.type ?? "")}</Td>
                    <Td className="text-mist2">{String(e.sourceDevice ?? "")}</Td>
                    <Td mono className="text-mist">
                      {bytes(seed?.sizeBytes ?? 0)}
                    </Td>
                    <Td>
                      <Pill tone={STATUS_TONE[e.status] ?? "idle"}>{STATUS_LABELS[e.status] ?? e.status}</Pill>
                    </Td>
                    <Td mono className="max-w-[190px] truncate text-mist">
                      {sha ? `${sha.slice(0, 20)}…` : "— hesaplanmadı —"}
                    </Td>
                  </Tr>
                );
              })}
            </Table>
            {problems.length > 0 && (
              <div className="flex items-start gap-2 border-t border-bad/40 bg-bad/8 px-4 py-3">
                <AlertTriangle size={15} className="mt-0.5 shrink-0 text-bad" />
                <p className="text-[12.5px] text-bad">
                  {problems.map((p) => p.evidenceId).join(", ")} için bütünlük sorunu tespit edildi. İnceleme durduruldu;
                  yeniden edinim gerekiyor.
                </p>
              </div>
            )}
          </Panel>
        </div>

        {/* Sağ yan sütun */}
        <div className="space-y-5">
          <Panel title="Delil Muhafaza Zinciri" en="Chain of Custody — son işlemler">
            {recentCustody.length === 0 ? (
              <div className="p-4">
                <Empty text="Henüz işlem kaydı yok." hint="İlk edinim talebi custody defterini başlatır." />
              </div>
            ) : (
              <ol className="divide-y divide-line/70">
                {recentCustody.map((c) => (
                  <li key={c.id} className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <Radio size={12} className="text-cyan" />
                      <span className="font-mono text-[11.5px] text-cyan tnum">{String(c.evidenceId)}</span>
                      <span className="ml-auto font-mono text-[10.5px] text-mist tnum">{utc(String(c.occurredAt))}</span>
                    </div>
                    <div className="mt-1.5 text-[12.5px] text-paper">
                      <span className="text-mist">{STATUS_LABELS[String(c.prevStatus)] ?? String(c.prevStatus)}</span>
                      <span className="mx-1.5 text-mist/60">→</span>
                      <span className="font-medium">{STATUS_LABELS[String(c.newStatus)] ?? String(c.newStatus)}</span>
                    </div>
                    <p className="mt-1 break-words text-[12px] leading-relaxed text-mist2">{String(c.reason)}</p>
                    <div className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1 font-mono text-[10px] text-mist">
                      <span>seq {String(c.seq)}</span>
                      <span>{String(c.operator)}</span>
                      <span>{String(c.mode) === "investigation" ? "INVESTIGATION" : "LEARNING"}</span>
                    </div>
                  </li>
                ))}
              </ol>
            )}
          </Panel>

          <Panel title="Son Bulgular" en="Recent Findings" right={<Link href="/bulgular" className="micro text-cyan hover:underline">Tümü →</Link>}>
            {snap.findings.length === 0 ? (
              <div className="p-4">
                <Empty text="Henüz bulgu kaydedilmedi." hint="Bulgu yalnızca incelenmiş delillere bağlanabilir." />
              </div>
            ) : (
              <ul className="divide-y divide-line/70">
                {[...snap.findings]
                  .reverse()
                  .slice(0, 5)
                  .map((f) => (
                    <li key={f.findingId} className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] text-blue2">{String(f.findingId)}</span>
                        <Pill tone="info">{String(f.confidence)}</Pill>
                      </div>
                      <p className="mt-1.5 text-[13px] font-medium text-paper">{String(f.title)}</p>
                      <p className="mt-1 line-clamp-2 text-[12px] leading-relaxed text-mist2">{String(f.description)}</p>
                    </li>
                  ))}
              </ul>
            )}
          </Panel>

          <Panel title="Denetim Kaydı" en="Audit Log — salt okunur">
            <ul className="max-h-[330px] divide-y divide-line/70 overflow-y-auto">
              {snap.audit.map((a) => (
                <li key={a.id} className="px-4 py-2.5">
                  <div className="flex items-baseline gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-cyan">{String(a.action)}</span>
                    <span className="font-mono text-[10px] text-mist tnum">{utc(String(a.at))}</span>
                  </div>
                  <p className="mt-1 break-words text-[12px] leading-relaxed text-mist2">
                    <span className="text-mist">{String(a.target)}</span> — {String(a.detail)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <div className="border border-amber/40 bg-amber/[0.06] p-4">
            <div className="flex items-center gap-2">
              <ShieldCheck size={15} className="text-amber" />
              <Micro className="text-amber">Yetki ve Kapsam Sınırı</Micro>
            </div>
            <p className="mt-2 text-[12.5px] leading-relaxed text-mist2">
              Bu ortam yalnızca sentetik delillerle çalışır. Gerçek bir inceleme; yazılı yetkilendirme, fiziksel delil
              koruma, doğrulanmış araç ve kesintisiz işlem zinciri gerektirir.
            </p>
            <div className="mt-3">
              <Btn href="/sozluk" tone="amber">
                Teknik Sözlük
              </Btn>
            </div>
          </div>

          <DiagramFlow
            title="Adli Süreç Döngüsü"
            nodes={[
              { label: "Kayıt", sub: "registered" },
              { label: "Edinim", sub: "acquired" },
              { label: "Bütünlük", sub: "hash_verified" },
              { label: "İnceleme", sub: "reviewed" },
              { label: "Rapor", sub: "reported" },
            ]}
            note="Geriye doğru geçiş yoktur. Her geçiş custody defterine yeni bir satır yazar; eski kayıtlar değişmez."
          />

          <div className="flex flex-wrap gap-2">
            <Btn onClick={() => void act("setMode", { mode: "learning" })} tone={mode === "learning" ? "primary" : "default"}>
              Öğrenme Modu
            </Btn>
            <Btn
              onClick={() => void act("setMode", { mode: "investigation" })}
              tone={mode === "investigation" ? "amber" : "default"}
            >
              İnceleme Modu
            </Btn>
          </div>
        </div>
      </div>
    </div>
  );
}
