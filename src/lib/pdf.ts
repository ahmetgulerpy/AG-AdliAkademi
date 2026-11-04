import type { ReportPayload } from "./report-shared";

/* pdfmake tipleri bu senaryoda aşırı kısıtlıdır; doküman tanımı any ile taşınır. */
type Content = any;
type TableCell = any;
type TDocumentDefinitions = any;

const C = {
  navy: "#0B1220",
  blue: "#2F6BFF",
  cyan: "#1E9AA8",
  amber: "#B4801A",
  grey: "#5A6472",
  line: "#C7CDD6",
  light: "#EEF1F5",
};

const H1: any = { fontSize: 15, bold: true, color: C.navy, margin: [0, 18, 0, 7], pageBreak: "before" };
const H2: any = { fontSize: 11.5, bold: true, color: C.navy, margin: [0, 12, 0, 5] };
const P: any = { fontSize: 9.6, color: "#20262F", lineHeight: 1.45, margin: [0, 0, 0, 6] };
const NOTE: any = { fontSize: 8.8, color: C.grey, italics: true, margin: [0, 0, 0, 6] };
const TH: TableCell = {
  text: "",
  bold: true,
  color: "#FFFFFF",
  fillColor: C.navy,
  fontSize: 8.4,
  margin: [4, 4, 4, 4],
};
const TD: TableCell = { fontSize: 8.4, color: "#20262F", margin: [4, 3.5, 4, 3.5] };

const th = (t: string): TableCell => ({ ...TH, text: t });
const td = (t: string, opts: Partial<TableCell> = {}): TableCell => ({ ...TD, text: t, ...opts });

function table(head: string[], rows: (string | TableCell)[][], widths: (string | number)[] = []): Content {
  return {
    table: {
      headerRows: 1,
      widths: widths.length ? widths : head.map(() => "auto"),
      body: [[...head.map(th)], ...rows.map((r) => r.map((c) => (typeof c === "string" ? td(c) : c)))],
      layout: {
        hLineColor: () => C.line,
        vLineColor: () => C.line,
        hLineWidth: () => 0.5,
        vLineWidth: () => 0.5,
        paddingLeft: () => 0,
        paddingRight: () => 0,
        paddingTop: () => 0,
        paddingBottom: () => 0,
      },
    },
    margin: [0, 2, 0, 10],
  };
}

export function buildPdfDoc(p: ReportPayload): TDocumentDefinitions {
  const cover: Content = [
    {
      canvas: [{ type: "rect", x: 0, y: 0, w: 515, h: 4, fillColor: C.blue }],
      margin: [0, 0, 0, 40],
    },
    { text: "AG CYBER LAB", fontSize: 30, bold: true, color: C.navy, margin: [0, 40, 0, 4] },
    {
      text: "DIGITAL FORENSICS ACADEMY & INVESTIGATION ENVIRONMENT",
      fontSize: 9.5,
      color: C.blue,
      characterSpacing: 1.6,
      margin: [0, 0, 0, 26],
    },
    {
      text: "DİJİTAL ADLİ BİLİŞİM İNCELEME RAPORU",
      fontSize: 17,
      bold: true,
      color: C.navy,
      margin: [0, 0, 0, 6],
    },
    { text: "Digital Forensic Examination Report", fontSize: 10.5, color: C.grey, margin: [0, 0, 0, 30] },
    table(
      ["Alan", "Değer"],
      [
        [td("Rapor Numarası", { bold: true }), p.reportNo],
        [td("Dosya Numarası (Case ID)", { bold: true }), p.caseId],
        [td("İnceleme Konusu", { bold: true }), p.caseTitle],
        [td("Rapor Tarihi (UTC)", { bold: true }), p.createdAt.replace("T", " ").replace(".000Z", "Z")],
        [td("Hazırlayan", { bold: true }), `${p.author} — ${p.role}`],
        [td("Çalışma Modu", { bold: true }), p.mode === "investigation" ? "Investigation (İnceleme)" : "Learning (Öğrenme)"],
        [td("Saat Dilimi Standardı", { bold: true }), "UTC / ISO 8601 — yerel kayıtlar +03:00 (TRT) ofsetiyle"],
      ],
      [150, 365],
    ),
    {
      text: "Bu rapor nesnel teknik değerlendirme niteliğindedir; suç isnadı veya kesin hukuki hüküm içermez. Bütün veriler sentetik (kurgusal) olarak üretilmiştir.",
      fontSize: 9,
      color: C.amber,
      fillColor: "#FBF4E4",
      margin: [0, 18, 0, 8],
      padding: [8, 8, 8, 8],
    },
    { text: `Bölüm sayısı: ${p.sections.length} · Delil: ${p.counts.evidence} · Bulgu: ${p.counts.findings} · Zaman kaydı: ${p.counts.timeline}`, style: "note" },
  ];

  const toc: Content = [
    { text: "İçindekiler", fontSize: 15, bold: true, color: C.navy, margin: [0, 0, 0, 10] },
    ...p.sections.map((s) => ({
      columns: [
        { text: `${String(s.no).padStart(2, "0")}  ${s.title}`, fontSize: 9.6, color: "#20262F" },
        { text: "", fontSize: 9.6 },
      ],
      margin: [0, 2, 0, 2] as [number, number, number, number],
      border: [false, false, false, true],
      borderColor: [undefined, undefined, undefined, C.line] as any,
      paddingBottom: 3,
    })),
    { text: "", pageBreak: "after" },
  ];

  const body: Content[] = [];

  body.push({ text: "1. Kapak Sayfası", ...H1, pageBreak: "after" });
  body.push({ text: p.caseTitle, fontSize: 13, bold: true, color: C.navy, margin: [0, 0, 0, 4] });
  body.push({ text: p.subject, ...P });
  body.push({ text: `Dosya: ${p.caseId} · Rapor: ${p.reportNo}`, style: "note" } as Content);

  body.push({ text: "2. Dosya Bilgileri", ...H1 });
  body.push(
    table(
      ["Alan", "Değer"],
      [
        ["Case ID", p.caseId],
        ["Başlık", p.caseTitle],
        ["İnceleme tarihi (UTC)", p.createdAt.replace("T", " ").replace(".000Z", "Z")],
        ["İncelemeci", `${p.author} — ${p.role}`],
        ["Yetkilendirme", "Yazılı — Bilgi Güvenliği Yetkilisi"],
        ["Kapsamdaki delil", `${p.counts.evidence} (edilmiş)`],
        ["Hash doğrulanmış", `${p.counts.verified}`],
        ["Bulgu", `${p.counts.findings}`],
        ["Zaman kaydı", `${p.counts.timeline}`],
      ],
      [150, 365],
    ),
  );

  body.push({ text: "3. İnceleme Talebi ve Kapsamı", ...H1 });
  body.push({ text: p.brief, ...P });
  body.push({ text: "Kapsam", ...H2 });
  body.push({ text: p.scope, ...P });

  body.push({ text: "4. Yetkilendirme", ...H1 });
  body.push({ text: p.authorization, ...P });
  body.push({ text: "Sınır: Bu inceleme yalnızca sentetik delil seti üzerinde yürütülmüştür; gerçek kullanıcı veya cihaz verisine erişilmemiştir.", ...NOTE } as Content);

  body.push({ text: "5. İnceleme Yöntemi", ...H1 });
  p.methods.forEach((m) => {
    body.push({ text: `• ${m}`, ...P });
  });

  body.push({ text: "6. Kullanılan Teknik Araçlar", ...H1 });
  p.tools.forEach((t) => {
    body.push({ text: `• ${t}`, ...P });
  });

  body.push({ text: "7. Delil Envanteri", ...H1 });
  body.push({
    text: "Yalnızca gerçekten edinilmiş deliller listelenir. Edinilmemiş kayıtlar bu tabloya dahil edilmez.",
    ...NOTE,
  } as Content);
  if (p.evidence.length === 0) {
    body.push({ text: "Kapsamda edinilmiş delil bulunmamaktadır.", ...NOTE } as Content);
  } else {
    body.push(
      table(
        ["Delil", "Tür", "Kaynak Cihaz", "Seri", "Boyut", "Durum"],
        p.evidence.map((e) => [e.evidenceId, e.type, e.sourceDevice, e.serial, e.size, e.statusLabel]),
        [48, 92, 160, 96, 60, 59],
      ),
    );
  }

  body.push({ text: "8. Delil Edinim Kayıtları", ...H1 });
  body.push(
    table(
      ["Delil", "Yöntem", "Edinim (yerel +03)", "Edinim yapan"],
      p.evidence.map((e) => [e.evidenceId, e.method, e.acquiredAt, e.acquiredBy]),
      [48, 220, 145, 102],
    ),
  );

  body.push({ text: "9. Hash Doğrulama", ...H1 });
  body.push({ text: "SHA-256 özeti yalnızca hesaplanmışsa belirtilir; hesaplanan satırlar bilerek boş bırakılmıştır.", ...NOTE } as Content);
  if (p.evidence.length === 0) body.push({ text: "Kayıt yok.", ...NOTE } as Content);
  else
    body.push(
      table(
        ["Delil", "SHA-256", "Durum"],
        p.evidence.map((e) => [
          e.evidenceId,
          { text: e.sha256 || "— hesaplanmadı —", fontSize: 7.4, font: "Courier", color: e.sha256 ? "#1E9AA8" : "#8A919C" } as TableCell,
          e.hashState,
        ]),
        [48, 340, 127],
      ),
    );

  body.push({ text: "10. Teknik Analizler", ...H1 });
  body.push({
    text: "Analizler, delil muhafaza zinciri ve durum makinesi ön koşulları sağlandıktan sonra gerçekleştirilmiştir. Aşağıdaki bulgu kayıtları, ilgili kaynak kayıtlarla ilişkilendirilmiştir.",
    ...P,
  });
  body.push(
    table(
      ["Kaynak", "Adet"],
      [
        ["Delil kaydı", String(p.counts.evidence)],
        ["Bütünlüğü doğrulanmış delil", String(p.counts.verified)],
        ["Custody işlemi", String(p.custody.length)],
        ["Zaman çizelgesi kaydı", String(p.counts.timeline)],
      ],
      [300, 215],
    ),
  );

  body.push({ text: "11. Bulgular", ...H1 });
  body.push({ text: "Her bulgu güven düzeyiyle birlikte sunulur. Doğrudan gözlem ile yorum ayrı satırlarda tutulur.", ...NOTE } as Content);
  if (p.findings.length === 0) body.push({ text: "Bu dosya için kayıtlı bulgu bulunmamaktadır.", ...P });
  else
    p.findings.forEach((f) => {
      body.push({ text: `${f.id} — ${f.title}`, ...H2 });
      body.push({ text: `Güven düzeyi: ${f.confidenceLabel}`, fontSize: 9, bold: true, color: C.blue, margin: [0, 0, 0, 4] });
      body.push({ text: f.desc, ...P });
      body.push(
        table(
          ["Alan", "Değer"],
          [
            ["İlişkili delil", f.evidenceId],
            ["Kaynak kayıt", f.source],
            ["Olay zamanı", f.occurredAt],
            ["Elde etme yöntemi", f.method],
            ["İncelemeci notu", f.note || "—"],
            ["Destekleyen", f.supporting.length ? f.supporting.join(" • ") : "—"],
            ["Çelişen", f.contradicting.length ? f.contradicting.join(" • ") : "—"],
            ["Alternatif açıklama", f.alternatives.length ? f.alternatives.join(" • ") : "—"],
          ],
          [130, 385],
        ),
      );
    });

  body.push({ text: "12. Zaman Çizelgesi", ...H1 });
  body.push({ text: "Tüm kayıtlar UTC'ye çevrilmiştir; yerel saat ofset ile birlikte verilir (+03:00).", ...NOTE } as Content);
  if (p.timeline.length === 0) body.push({ text: "Aktarılmış zaman çizelgesi kaydı yok.", ...P });
  else
    body.push(
      table(
        ["UTC", "Yerel", "Ofset", "Kaynak", "Delil", "Açıklama"],
        p.timeline.map((t) => [t.utc, t.local, t.offset, t.source, t.evidenceId, t.description]),
        [90, 90, 40, 90, 45, 160],
      ),
    );

  body.push({ text: "13. Deliller Arası İlişkilendirme", ...H1 });
  body.push({
    text: "İlişkilendirme, farklı kaynakların aynı zaman penceresinde aynı eylemi göstermesine dayanır. Her kaynak kendi kimliğiyle korunur; birleştirme analiz kopyaları üzerinde yapılır.",
    ...P,
  });
  body.push(
    table(
      ["Kaynak A", "Kaynak B", "İlişki", "Güven etkisi"],
      [
        ["USB Registry (bağlantı)", "Dosya sistemi (MFT)", "Aynı zaman penceresi", "Destekleyici → güçlenir"],
        ["Windows Event 4663", "Tarayıcı indirme", "Ardışık olay", "Destekleyici"],
        ["USN Journal", "Event Log", "Zaman uyumu", "Destekleyici"],
        ["Hash doğrulaması", "Edinim kaydı", "Bütünlük", "Teknik doğrulanmış"],
      ],
      [130, 130, 130, 125],
    ),
  );

  body.push({ text: "14. Teknik Değerlendirme", ...H1 });
  body.push({
    text: "Doğrudan gözlem ve teknik olarak doğrulanmış bulgular, değerlendirmenin temelini oluşturur. Destekleyici ve dolaylı bulgular tek başına sonuç üretmez; alternatif açıklamalar elenmeden değerlendirme kapanmaz.",
    ...P,
  });

  body.push({ text: "15. Sonuç ve Kanaat", ...H1 });
  body.push({
    text: `Bu rapor kapsamında ${p.counts.evidence} adet delil edinilmiş, ${p.counts.verified} adet delilin bütünlüğü doğrulanmış ve ${p.counts.findings} adet bulgu kaydedilmiştir. Kanaat, yalnızca doğrudan gözlem ve teknik olarak doğrulanmış bulgulara dayandırılmıştır. Şüphe, gözlem, doğrulanmış bulgu ve yorum birbirinden ayrı tutulmuştur.`,
    ...P,
  });
  body.push({
    text: "Bu belge hukuki kanaat, suç isnadı veya kesin hüküm içermez.",
    fontSize: 9.6,
    bold: true,
    color: C.amber,
    fillColor: "#FBF4E4",
    margin: [0, 4, 0, 10],
  });

  body.push({ text: "16. Sınırlılıklar", ...H1 });
  p.limitations.forEach((l) => {
    body.push({ text: `• ${l}`, ...P });
  });

  body.push({ text: "17. Ekler", ...H1 });
  body.push(
    table(
      ["Ek", "İçerik"],
      [
        ["Ek-A", "Delil envanteri ve edinim kayıtları"],
        ["Ek-B", "Hash doğrulama tablosu"],
        ["Ek-C", "Bulgu formları (kaynak kayıt referanslarıyla)"],
        ["Ek-D", "Birleştirilmiş zaman çizelgesi"],
        ["Ek-E", "Delil muhafaza zinciri defteri"],
      ],
      [80, 435],
    ),
  );

  body.push({ text: "18. Delil Muhafaza Zinciri", ...H1 });
  body.push({ text: "Kayıtlar salt-eklemelidir; geriye dönük değişiklik yapılmamıştır.", ...NOTE } as Content);
  if (p.custody.length === 0) body.push({ text: "Custody kaydı bulunmuyor.", ...P });
  else
    body.push(
      table(
        ["Seq", "Delil", "Tarih/Saat", "İşlemci", "Geçiş", "İşlem", "Neden"],
        p.custody.map((c) => [String(c.seq), c.evidenceId, c.at, c.operator, `${c.prev} → ${c.next}`, c.action, c.reason]),
        [26, 46, 96, 74, 96, 70, 107],
      ),
    );

  return {
    info: {
      title: `${p.reportNo} — AG CYBER LAB İnceleme Raporu`,
      author: p.author,
      subject: `${p.caseId} · ${p.caseTitle}`,
      keywords: "digital forensics, adli bilişim, AG CYBER LAB",
      creator: "AG CYBER LAB Rapor Motoru",
    },
    pageSize: "A4",
    pageMargins: [46, 56, 46, 54],
    defaultStyle: { font: "Roboto", fontSize: 9.6, color: "#20262F" },
    footer: (currentPage: number, pageCount: number) => ({
      columns: [
        { text: `${p.reportNo} · ${p.caseId}`, fontSize: 7.6, color: C.grey, margin: [46, 0, 0, 0] },
        { text: "AG CYBER LAB — SENTETİK İNCELEME · Simülasyon", fontSize: 7.6, color: C.amber, alignment: "center" },
        { text: `Sayfa ${currentPage} / ${pageCount}`, fontSize: 7.6, color: C.grey, alignment: "right", margin: [0, 0, 46, 0] },
      ],
      margin: [0, 12, 0, 0] as [number, number, number, number],
    }),
    header: (currentPage: number) =>
      currentPage === 1
        ? {}
        : {
            columns: [
              { text: "AG CYBER LAB", fontSize: 8, bold: true, color: C.navy, characterSpacing: 1 },
              { text: "DİJİTAL ADLİ BİLİŞİM İNCELEME RAPORU", fontSize: 7.6, color: C.grey, alignment: "right" },
            ],
            margin: [46, 22, 46, 0] as [number, number, number, number],
            canvas: [{ type: "line", x1: 0, y1: 8, x2: 503, y2: 8, lineWidth: 0.6, lineColor: C.line }],
          },
    content: [cover, toc, ...body],
    styles: { note: NOTE },
  };
}

export function buildMarkdown(p: ReportPayload): string {
  const L: string[] = [];
  L.push(`# AG CYBER LAB — DİJİTAL ADLİ BİLİŞİM İNCELEME RAPORU`, "");
  L.push(`**Rapor No:** ${p.reportNo}  `);
  L.push(`**Dosya No:** ${p.caseId}  `);
  L.push(`**Konu:** ${p.caseTitle}  `);
  L.push(`**Tarih (UTC):** ${p.createdAt}  `);
  L.push(`**Hazırlayan:** ${p.author} — ${p.role}`, "");
  L.push(`> ${p.limitations[6] ?? "Bu rapor hukuki kanaat içermez."}`, "");
  p.sections.forEach((s) => {
    L.push(`## ${s.no}. ${s.title}`, "");
    switch (s.no) {
      case 3:
        L.push(p.brief, "", `**Kapsam:** ${p.scope}`, "");
        break;
      case 4:
        L.push(p.authorization, "");
        break;
      case 5:
        p.methods.forEach((m) => L.push(`- ${m}`));
        L.push("");
        break;
      case 6:
        p.tools.forEach((t) => L.push(`- ${t}`));
        L.push("");
        break;
      case 7:
        L.push(`| Delil | Tür | Kaynak | Durum | Boyut |`, `| --- | --- | --- | --- | --- |`);
        p.evidence.forEach((e) => L.push(`| ${e.evidenceId} | ${e.type} | ${e.sourceDevice} | ${e.statusLabel} | ${e.size} |`));
        L.push("");
        break;
      case 9:
        L.push(`| Delil | SHA-256 | Durum |`, `| --- | --- | --- |`);
        p.evidence.forEach((e) => L.push(`| ${e.evidenceId} | \`${e.sha256 || "hesaplanmadı"}\` | ${e.hashState} |`));
        L.push("");
        break;
      case 11:
        p.findings.forEach((f) => {
          L.push(`### ${f.id} — ${f.title}`, `**Güven düzeyi:** ${f.confidenceLabel}`, "", f.desc, "", `- Kaynak: ${f.source}`, `- Zaman: ${f.occurredAt}`, `- Delil: ${f.evidenceId}`, "");
        });
        if (!p.findings.length) L.push("_Kayıtlı bulgu yok._", "");
        break;
      case 12:
        L.push(`| UTC | Yerel | Kaynak | Açıklama |`, `| --- | --- | --- | --- |`);
        p.timeline.forEach((t) => L.push(`| ${t.utc} | ${t.local} | ${t.source} | ${t.description.replace(/\|/g, "/")} |`));
        L.push("");
        break;
      case 16:
        p.limitations.forEach((l) => L.push(`- ${l}`));
        L.push("");
        break;
      case 18:
        L.push(`| Seq | Delil | Zaman | Geçiş | İşlem |`, `| --- | --- | --- | --- | --- |`);
        p.custody.forEach((c) => L.push(`| ${c.seq} | ${c.evidenceId} | ${c.at} | ${c.prev} → ${c.next} | ${c.action} |`));
        L.push("");
        break;
      default:
        break;
    }
  });
  return L.join("\n");
}
