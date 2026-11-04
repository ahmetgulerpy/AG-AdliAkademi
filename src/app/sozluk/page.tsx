"use client";

import { useMemo, useState } from "react";
import { Search, X } from "lucide-react";
import { GLOSSARY, GLOSSARY_GROUPS } from "@/data/glossary";
import { Empty, Micro, PageHead, Panel, Pill } from "@/components/ui";

export default function GlossaryPage() {
  const [q, setQ] = useState("");
  const [group, setGroup] = useState("Tümü");

  const list = useMemo(() => {
    const term = q.trim().toLocaleLowerCase("tr");
    return GLOSSARY.filter((g) => {
      const okGroup = group === "Tümü" || g.group === group;
      if (!okGroup) return false;
      if (!term) return true;
      return (
        g.en.toLocaleLowerCase("tr").includes(term) ||
        g.tr.toLocaleLowerCase("tr").includes(term) ||
        g.def.toLocaleLowerCase("tr").includes(term)
      );
    });
  }, [q, group]);

  return (
    <div>
      <PageHead
        kicker="Teknik Sözlük · Technical Glossary"
        title="Dil: Türkçe / English"
        en="Bilingual forensic terminology"
        desc="İlk kullanımda İngilizce terim Türkçe karşılığıyla birlikte gösterilir. Teknik standart isimler (SHA-256, NTFS, FAT32, exFAT, MFT, Registry, SQLite, RAM, SSD) çevrilmemiştir. Türkçe ve İngilizce terimlerin ikisiyle de arama yapabilirsin."
        right={
          <div className="flex items-center gap-2 border border-line2 bg-panel px-3 py-2">
            <Search size={14} className="text-mist" />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Terim ara… (hash, delil, event id)"
              className="w-[230px] bg-transparent text-[13px] text-paper outline-none placeholder:text-mist/70"
            />
            {q && (
              <button onClick={() => setQ("")} aria-label="Temizle" className="text-mist hover:text-paper">
                <X size={13} />
              </button>
            )}
          </div>
        }
      />

      <div className="mb-4 flex flex-wrap gap-1.5">
        {["Tümü", ...GLOSSARY_GROUPS].map((g) => (
          <button
            key={g}
            onClick={() => setGroup(g)}
            className={`border px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-[0.12em] transition-colors ${
              group === g ? "border-cyan bg-cyan/15 text-cyan" : "border-line2 text-mist hover:text-paper"
            }`}
          >
            {g}
          </button>
        ))}
        <span className="ml-auto self-center font-mono text-[11px] text-mist tnum">
          {list.length} / {GLOSSARY.length} terim
        </span>
      </div>

      {list.length === 0 ? (
        <Empty text={`"${q}" için terim bulunamadı.`} hint="Farklı bir anahtar kelime veya grup deneyin." />
      ) : (
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {list.map((g) => (
            <article key={g.en} className="group border border-line bg-panel/60 p-4 transition-colors hover:border-line2">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <h3 className="font-mono text-[13.5px] font-medium text-cyan">{g.en}</h3>
                  <div className="mt-1 text-[14px] font-medium text-paper">{g.tr}</div>
                </div>
                <Pill tone="idle">{g.group}</Pill>
              </div>
              <div className="my-3 h-px bg-line" />
              <p className="text-[12.5px] leading-relaxed text-mist2">{g.def}</p>
            </article>
          ))}
        </div>
      )}

      <Panel className="mt-6" title="Kullanım Kuralları" en="Terim Standardı">
        <ul className="grid gap-3 p-4 md:grid-cols-2">
          {[
            "İlk kullanımda İngilizce terim ve Türkçe karşılığı birlikte gösterilir; sonraki kullanımlarda teknik bağlama göre kısa terim kullanılabilir.",
            "Teknik standart isimler çevrilmemiştir: SHA-256, NTFS, FAT32, exFAT, MFT, Registry, SQLite, RAM, SSD.",
            "Eğitim içeriklerinde İngilizce teknik terminoloji ayrıca öğretilir; arayüz, bildirim, rapor ve eğitim metinlerinde Türkçe karakterler eksiksiz desteklenir.",
            "Belirsizlik durumunda İngilizce teknik terim esas alınır, Türkçe karşılığı dipnotta belirtilir.",
          ].map((t, i) => (
            <li key={t} className="flex gap-3 text-[12.5px] leading-relaxed text-mist2">
              <span className="font-mono text-[11px] text-cyan tnum">{String(i + 1).padStart(2, "0")}</span>
              <span>{t}</span>
            </li>
          ))}
        </ul>
        <div className="border-t border-line px-4 py-3">
          <Micro className="text-amber">Not</Micro>
          <p className="mt-1.5 text-[12.5px] leading-relaxed text-mist2">
            NIST SP 800-86 ve ISO/IEC 27037, yöntem çerçevesi sunan standartlardır; hangi aracın hangi sürümünün
            doğrulanacağı ayrı bir çalışma ile tanımlanır.
          </p>
        </div>
      </Panel>
    </div>
  );
}
