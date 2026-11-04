"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { useStore } from "@/components/Store";
import { Btn, Empty, Micro, PageHead, Panel, Pill, Table, Td, Tr } from "@/components/ui";
import { CASES, EVIDENCE } from "@/data/cases";
import { CONFIDENCE_LABELS } from "@/lib/report-shared";
import { utc } from "@/lib/format";

const TONE: Record<string, string> = {
  direct: "ok",
  verified: "cyan",
  supporting: "info",
  circumstantial: "wait",
  unverified: "warn",
};

const LEVEL_DESC: Record<string, string> = {
  direct: "Kaydın doğrudan gösterdiği olgu. Yorum içermez.",
  verified: "Bağımsız bir teknik doğrulama ile teyit edilmiş (ör. hash eşleşmesi).",
  supporting: "Diğer bulguları güçlendiren, tek başına sonuç üretmeyen kayıt.",
  circumstantial: "Sonucu destekleyen, ancak alternatif açıklamaları dışlamayan çıkarım.",
  unverified: "İddia düzeyinde; doğrulanmış kanıt henüz mevcut değil.",
};

export default function FindingsPage() {
  const { snap, act } = useStore();
  const active = snap?.profile?.activeCaseId ?? "AG-DFIR-2026-001";
  const [caseId, setCaseId] = useState(active);
  const [open, setOpen] = useState(false);

  const [form, setForm] = useState({
    evidenceId: "",
    title: "",
    description: "",
    sourceRecord: "",
    occurredAt: new Date().toISOString(),
    method: "Sentetik kayıt incelemesi",
    reviewerNote: "",
    confidence: "direct",
    supporting: "",
    contradicting: "",
    alternatives: "",
  });

  const list = (snap?.findings ?? []).filter((f) => f.caseId === caseId);

  const submit = async () => {
    const r = await act("createFinding", {
      caseId,
      evidenceId: form.evidenceId || null,
      title: form.title,
      description: form.description,
      sourceRecord: form.sourceRecord || "—",
      occurredAt: form.occurredAt,
      method: form.method,
      reviewerNote: form.reviewerNote,
      confidence: form.confidence,
      supporting: form.supporting.split("\n").map((s) => s.trim()).filter(Boolean),
      contradicting: form.contradicting.split("\n").map((s) => s.trim()).filter(Boolean),
      alternatives: form.alternatives.split("\n").map((s) => s.trim()).filter(Boolean),
    });
    if (r.ok) {
      setOpen(false);
      setForm({ ...form, title: "", description: "", sourceRecord: "", reviewerNote: "", supporting: "", contradicting: "", alternatives: "" });
    }
  };

  const field = "mt-1.5 w-full border border-line2 bg-[#0d1015] px-3 py-2 text-[13px] text-paper outline-none focus:border-cyan";

  return (
    <div>
      <PageHead
        kicker="Bulgu Yönetimi · Findings"
        title="Bulgular ve Güven Düzeyleri"
        en="Findings & confidence grading"
        desc="Her bulgu bir delil kimliğine ve kaynak kayda bağlanır. Sistem bir bulguyu otomatik olarak kesin sonuca dönüştürmez; sınıflandırma incelemecinin sorumluluğundadır."
        right={
          <div className="flex items-center gap-3">
            <select
              value={caseId}
              onChange={(e) => setCaseId(e.target.value)}
              className="border border-line2 bg-[#0d1015] px-3 py-2 font-mono text-[12px] text-paper outline-none focus:border-cyan"
            >
              {CASES.map((c) => (
                <option key={c.caseId} value={c.caseId}>
                  {c.caseId}
                </option>
              ))}
            </select>
            <Btn onClick={() => setOpen((o) => !o)} tone={open ? "default" : "primary"}>
              <Plus size={13} /> Bulgu Ekle
            </Btn>
          </div>
        }
      />

      <div className="mb-5 grid gap-2.5 sm:grid-cols-2 xl:grid-cols-5">
        {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => (
          <div key={k} className="border border-line bg-panel/60 p-3">
            <Pill tone={TONE[k]}>{v}</Pill>
            <p className="mt-2 text-[12px] leading-relaxed text-mist2">{LEVEL_DESC[k]}</p>
            <div className="mt-2 font-mono text-[11px] text-mist tnum">
              {list.filter((f) => f.confidence === k).length} bulgu
            </div>
          </div>
        ))}
      </div>

      {open && (
        <Panel title="Yeni Bulgu" en="New finding" className="mb-5 border-blue/50">
          <div className="grid gap-4 p-4 lg:grid-cols-2">
            <label className="block lg:col-span-2">
              <Micro>Bulgu Başlığı *</Micro>
              <input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="ör. EV-002 cihazı incelenen istasyona bağlanmıştır"
                className={field}
              />
            </label>
            <label className="block lg:col-span-2">
              <Micro>Teknik Açıklama *</Micro>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Kaydın ne gösterdiği, hangi zaman penceresinde olduğu ve kapsamı."
                className={`${field} resize-none font-mono text-[12.5px]`}
              />
            </label>
            <label className="block">
              <Micro>İlişkili Delil</Micro>
              <select
                value={form.evidenceId}
                onChange={(e) => setForm({ ...form, evidenceId: e.target.value })}
                className={field}
              >
                <option value="">— delil seçilmedi —</option>
                {EVIDENCE.filter((e) => e.caseId === caseId).map((e) => (
                  <option key={e.evidenceId} value={e.evidenceId}>
                    {e.evidenceId} · {e.type}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <Micro>Güven Düzeyi</Micro>
              <select
                value={form.confidence}
                onChange={(e) => setForm({ ...form, confidence: e.target.value })}
                className={field}
              >
                {Object.entries(CONFIDENCE_LABELS).map(([k, v]) => (
                  <option key={k} value={k}>
                    {v}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <Micro>Kaynak Kayıt</Micro>
              <input
                value={form.sourceRecord}
                onChange={(e) => setForm({ ...form, sourceRecord: e.target.value })}
                placeholder="ör. Event 2003 / USBSTOR Enum / MFT entry 48213"
                className={field}
              />
            </label>
            <label className="block">
              <Micro>Olay Zamanı (ISO-8601)</Micro>
              <input
                value={form.occurredAt}
                onChange={(e) => setForm({ ...form, occurredAt: e.target.value })}
                className={`${field} font-mono`}
              />
            </label>
            <label className="block">
              <Micro>Elde Edilme Yöntemi</Micro>
              <input value={form.method} onChange={(e) => setForm({ ...form, method: e.target.value })} className={field} />
            </label>
            <label className="block">
              <Micro>İncelemeci Notu</Micro>
              <input
                value={form.reviewerNote}
                onChange={(e) => setForm({ ...form, reviewerNote: e.target.value })}
                className={field}
              />
            </label>
            <label className="block">
              <Micro>Destekleyen Deliller (her satır bir kayıt)</Micro>
              <textarea
                value={form.supporting}
                onChange={(e) => setForm({ ...form, supporting: e.target.value })}
                rows={3}
                className={`${field} resize-none font-mono text-[12.5px]`}
              />
            </label>
            <label className="block">
              <Micro>Çelişen Deliller</Micro>
              <textarea
                value={form.contradicting}
                onChange={(e) => setForm({ ...form, contradicting: e.target.value })}
                rows={3}
                className={`${field} resize-none font-mono text-[12.5px]`}
              />
            </label>
            <label className="block lg:col-span-2">
              <Micro>Alternatif Açıklamalar</Micro>
              <textarea
                value={form.alternatives}
                onChange={(e) => setForm({ ...form, alternatives: e.target.value })}
                rows={2}
                placeholder="ör. Yetkili IT bakım işlemi; saat senkron kayması; başka bir kullanıcı hesabı."
                className={`${field} resize-none`}
              />
            </label>
          </div>
          <div className="flex flex-wrap gap-2 border-t border-line px-4 py-3">
            <Btn onClick={() => void submit()} tone="primary" disabled={!form.title.trim() || !form.description.trim()}>
              Bulgu Kaydet
            </Btn>
            <Btn onClick={() => setOpen(false)} tone="default">
              Vazgeç
            </Btn>
            <span className="ml-auto self-center text-[12px] text-mist">
              Bulgu, ilgili delil incelenmemişse delil durumunu değiştirmez.
            </span>
          </div>
        </Panel>
      )}

      <Panel title={`Bulgular — ${caseId}`} en="Findings register">
        {list.length === 0 ? (
          <div className="p-4">
            <Empty
              text="Bu dosyada henüz bulgu yok."
              hint="İnceleme moduna geçip laboratuvar modüllerinde kaynakları inceledikten sonra bulgu ekleyin."
            />
          </div>
        ) : (
          <div className="space-y-4 p-4">
            {list.map((f) => {
              const sup = JSON.parse(String(f.supporting || "[]")) as string[];
              const con = JSON.parse(String(f.contradicting || "[]")) as string[];
              const alt = JSON.parse(String(f.alternatives || "[]")) as string[];
              return (
                <article key={String(f.findingId)} className="border border-line bg-charcoal">
                  <header className="flex flex-wrap items-center gap-2.5 border-b border-line px-4 py-3">
                    <span className="font-mono text-[12.5px] text-blue2">{String(f.findingId)}</span>
                    <Pill tone={TONE[String(f.confidence)] ?? "idle"}>
                      {CONFIDENCE_LABELS[String(f.confidence)] ?? String(f.confidence)}
                    </Pill>
                    {!!f.evidenceId && <Pill tone="cyan">{String(f.evidenceId)}</Pill>}
                    <Pill tone="idle">{String(f.mode) === "investigation" ? "INVESTIGATION" : "LEARNING"}</Pill>
                    <span className="ml-auto flex items-center gap-3">
                      <span className="font-mono text-[11px] text-mist tnum">{utc(String(f.occurredAt))}</span>
                      <button
                        onClick={() => void act("deleteFinding", { findingId: String(f.findingId) })}
                        className="text-mist transition-colors hover:text-bad"
                        title="Bulguyu sil"
                      >
                        <Trash2 size={14} />
                      </button>
                    </span>
                  </header>
                  <div className="space-y-3 px-4 py-3.5">
                    <h3 className="text-[15px] font-medium leading-snug text-paper">{String(f.title)}</h3>
                    <p className="text-[13.5px] leading-relaxed text-mist2">{String(f.description)}</p>
                    <dl className="grid gap-3 md:grid-cols-3">
                      {[
                        ["Kaynak Kayıt", String(f.sourceRecord)],
                        ["Yöntem", String(f.method)],
                        ["İncelemeci Notu", String(f.reviewerNote || "—")],
                      ].map(([k, v]) => (
                        <div key={k} className="border border-line bg-[#0d1015] p-2.5">
                          <Micro className="text-[9px]">{k}</Micro>
                          <p className="mt-1 text-[12.5px] leading-relaxed text-mist2">{v}</p>
                        </div>
                      ))}
                    </dl>
                    <div className="grid gap-3 md:grid-cols-3">
                      <div className="border border-good/35 bg-good/[0.05] p-2.5">
                        <Micro className="text-good">Destekleyen</Micro>
                        <ul className="mt-1.5 space-y-1 text-[12.5px] text-mist2">
                          {sup.length ? sup.map((s) => <li key={s}>• {s}</li>) : <li>—</li>}
                        </ul>
                      </div>
                      <div className="border border-bad/35 bg-bad/[0.05] p-2.5">
                        <Micro className="text-bad">Çelişen</Micro>
                        <ul className="mt-1.5 space-y-1 text-[12.5px] text-mist2">
                          {con.length ? con.map((s) => <li key={s}>• {s}</li>) : <li>—</li>}
                        </ul>
                      </div>
                      <div className="border border-amber/40 bg-amber/[0.05] p-2.5">
                        <Micro className="text-amber">Alternatif Açıklama</Micro>
                        <ul className="mt-1.5 space-y-1 text-[12.5px] text-mist2">
                          {alt.length ? alt.map((s) => <li key={s}>• {s}</li>) : <li>—</li>}
                        </ul>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </Panel>

      <Panel className="mt-5" title="Örnek: Doğru / Yanlış İfade" en="Wording discipline">
        <Table head={["Yanlış (kesinleştirme)", "Doğru (sınıflandırılmış)", "Neden"]}>
          <Tr>
            <Td className="text-bad">“Kullanıcı belgeleri USB’ye kopyalamıştır.”</Td>
            <Td className="text-good">
              “EV-002 cihazı 08:14–09:02 arasında sisteme bağlanmıştır; aynı pencerede hedef birimde dosya oluşumu
              tespit edilmiştir (destekleyici).”
            </Td>
            <Td className="text-mist2">
              Bağlantı kaydı yazma işlemini kanıtlamaz; içerik eşleşmesi için hash doğrulaması gerekir.
            </Td>
          </Tr>
          <Tr>
            <Td className="text-bad">“Tarayıcı geçmişinde yok, demek ki girilmedi.”</Td>
            <Td className="text-good">“Bu kaynakta ilgili ziyaret kaydı bulunamadı (kanıt yokluğu).”</Td>
            <Td className="text-mist2">Kayıt yokluğu, başka kaynaklarda bulunmama ihtimalini dışlamaz.</Td>
          </Tr>
        </Table>
      </Panel>
    </div>
  );
}
