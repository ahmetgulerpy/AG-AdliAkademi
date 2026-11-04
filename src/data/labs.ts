export type LabStep = { id: string; label: string; hint: string; detail: string };

export type LabModule = {
  code: string;
  key: string;
  title: string;
  titleEn: string;
  lessonId: string;
  summary: string;
  caseIds: string[];
  tools: string[];
  steps: LabStep[];
  warn: string;
};

export const LAB_MODULES: LabModule[] = [
  {
    code: "MODÜL A",
    key: "A",
    title: "Delil Edinimi",
    titleEn: "Evidence Acquisition",
    lessonId: "L1-01",
    summary:
      "Sentetik disk/USB seçimi, delil kimliği oluşturma, edinim simülasyonu, SHA-256 üretimi ve edinim günlüğü.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-005", "AG-DFIR-2026-007"],
    tools: ["FTK Imager (simülasyon)", "Write Blocker (simülasyon)", "SHA-256 (Web Crypto)"],
    steps: [
      { id: "select", label: "Kaynak medyayı seç", hint: "Kaynağın serisini ve boyutunu not edin.", detail: "Kaynak seçilmeden edinim başlatılamaz. Seri numarası, sonraki tüm kayıtlarda kimliği taşır." },
      { id: "blocker", label: "Yazma engelleyiciyi bağla", hint: "Write Blocker durumu salt-okunur olmalıdır.", detail: "Yazma engelleyici olmadan edinim, delil üzerinde işlem yapıldığı itirazını doğurur." },
      { id: "acquire", label: "İmajı al (bit-by-bit)", hint: "E01 formatı özet ve ECC içerir.", detail: "Sektörler sırayla okunur; bu adımdan sonra delil durumu 'acquired' olur." },
      { id: "hash", label: "SHA-256 hesapla ve karşılaştır", hint: "Kaynak ve hedef özetleri eşleşmelidir.", detail: "Özet eşleşmiyorsa edinim başarısız sayılır; delil 'integrity issue' işaretlenir." },
      { id: "log", label: "Edinim günlüğüne işle", hint: "Custody kaydı append-only'dir.", detail: "Durum geçişi ve nedeni custody defterine yeni satır olarak yazılır; eski kayıtlar değişmez." },
    ],
    warn: "Bu modülde edinim yalnızca sentetik bir simülasyondur. Gerçek disk, USB veya bellek üzerinde hiçbir işlem yapılmaz.",
  },
  {
    code: "MODÜL B",
    key: "B",
    title: "Hash Doğrulama",
    titleEn: "Hash Verification",
    lessonId: "L1-04",
    summary:
      "Orijinal dosya ve çalışma kopyası üzerinde gerçek SHA-256 hesabı, tek bayt değişikliği ve çığ etkisinin gözlenmesi.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-004", "AG-DFIR-2026-006"],
    tools: ["Web Crypto API (crypto.subtle.digest)", "Karakter/karşılaştırma motoru"],
    steps: [
      { id: "load", label: "Orijinal delili yükle", hint: "Kayıt edinilmemişse hash alanı boş kalmalıdır.", detail: "Orijinal dosyanın özeti yalnızca edinilmiş deliller için hesaplanır." },
      { id: "copy", label: "Çalışma kopyası oluştur", hint: "Kopya, orijinalden bağımsızdır.", detail: "Çalışma kopyası üzerinde yapılan hiçbir değişiklik orijinal delile yansımaz." },
      { id: "mutate", label: "Çalışma kopyasında değişiklik yap", hint: "Tek karakter bile yeterlidir.", detail: "Değişiklik yapıldığında çığ etkisi nedeniyle özetin yaklaşık yarısı değişir." },
      { id: "compare", label: "Hash değerlerini karşılaştır", hint: "Farklılık nibble düzeyinde gösterilir.", detail: "Eşleşme varsa bütünlük doğrulanmış; farklılık varsa içerik değişmiştir." },
      { id: "interpret", label: "Sonucu yorumla ve bulgu kaydet", hint: "Sonuç tek başına niyeti göstermez.", detail: "Bütünlük sonucu, değişikliğin varlığını gösterir; ne amaçla yapıldığını göstermez." },
    ],
    warn: "Hash hesabı tarayıcıda gerçek SHA-256 algoritmasıyla (Web Crypto API) yapılır; sonuçlar şifreli değildir.",
  },
  {
    code: "MODÜL C",
    key: "C",
    title: "Dosya Sistemi Analizi",
    titleEn: "File System Analysis",
    lessonId: "L2-02",
    summary:
      "Sentetik NTFS gezgini, MACB zaman damgaları, silinmiş kayıtlar, kurtarılabilirlik dereceleri ve içerik önizleme.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-002"],
    tools: ["Autopsy (simülasyon)", "MFTECmd (simülasyon)", "İmza tarayıcı"],
    steps: [
      { id: "browse", label: "Klasör yapısını incele", hint: "Klasör düzeyinde MFT değişikliklerine bakın.", detail: "Klasörün kendi C damgası, içindeki içerik değiştiğinde güncellenir." },
      { id: "inspect", label: "Dosya özelliklerini aç", hint: "MACB dört damgasını ayrı ayrı okuyun.", detail: "A damgası NTFS'te çoğunlukla C ile eşleşir; tek başına güvenilir değildir." },
      { id: "deleted", label: "Silinmiş kayıtları filtrele", hint: "In-use biti 0 olan kayıtlar.", detail: "Silinmiş kayıt, dosyanın var olduğu anlamına gelir; içerik durumu ayrıca değerlendirilir." },
      { id: "recover", label: "Kurtarma simülasyonu çalıştır", hint: "Her dosya için ayrı derece verilir.", detail: "Kesin / koşullu / yok dereceleri ayrı ayrı hesaplanır; genel varsayım yapılmaz." },
      { id: "flag", label: "Şüpheli dosyaları işaretlemek için bulgu oluştur", hint: "Bulgu, güven düzeyi ile kaydedilir.", detail: "İşaretlenen satır, bulgu yönetimine kaynak kayıt olarak bağlanır." },
    ],
    warn: "Kurtarma sonuçları sentetik veri üzerinde tahmin edilmez; her dosyanın durumu kendi cluster haritasından hesaplanır.",
  },
  {
    code: "MODÜL D",
    key: "D",
    title: "Tarayıcı Adli Bilişimi",
    titleEn: "Browser Forensics",
    lessonId: "L2-05",
    summary:
      "Sentetik Chrome geçmişi, indirmeler, arama sorguları, çerezler ve zaman damgası karşılaştırması.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-004"],
    tools: ["History (SQLite)", "Downloads", "Cookies", "Zaman damgası dönüştürücü"],
    steps: [
      { id: "history", label: "Geçmişi incele", hint: "URL ve arama sorgularını ayırın.", detail: "Arama satırları 'urls' içinde gerçekleşir; ayrıştırma için arama deseni kullanılmalıdır." },
      { id: "downloads", label: "İndirmeleri listele", hint: "start_time ≠ tamamlanma.", detail: "state ve end_time kontrol edilmeden 'tamamlandı' denemez." },
      { id: "cookies", label: "Çerez analizi yap", hint: "Oturumun o profilde açıldığını destekler.", detail: "Çerez, alan adı ve süre bilgisi verir; içeriği taşımaz." },
      { id: "correlate", label: "Dosya sistemiyle zaman karşılaştırması yap", hint: "İndirme ↔ MFT oluşturma eşleşmesi.", detail: "İki bağımsız kaynak örtüşürse güven düzeyi yükselir." },
      { id: "limit", label: "Kanıt yokluğunu sınırlılık olarak yaz", hint: "Geçmişte olmayan ≠ yapılmadı.", detail: "Kayıt yokluğu, başka kaynaklarda bulunmama ihtimalini dışlamaz." },
    ],
    warn: "Tarayıcı kayıtları eksiksiz değildir; silinmiş geçmiş, farklı profil veya farklı tarayıcı kullanımı dışlanamaz.",
  },
  {
    code: "MODÜL E",
    key: "E",
    title: "USB Aygıt Adli Bilişimi",
    titleEn: "USB Forensics",
    lessonId: "L2-04",
    summary:
      "VID/PID, seri numarası, MountPoints2, bağlantı zamanları ve Registry kayıtlarının birlikte okunması.",
    caseIds: ["AG-DFIR-2026-001"],
    tools: ["USBSTOR Enum", "MountPoints2", "SetupApi / PnP olayları"],
    steps: [
      { id: "list", label: "Cihaz listesini çıkar", hint: "VID/PID üretici ve modeli verir.", detail: "Model aynı olsa da cihazı ayırt eden alan seri numarasıdır." },
      { id: "history", label: "Bağlantı geçmişini incele", hint: "İlk ve son bağlanma zamanları.", detail: "MountPoints2 silinmez; cihaz kaldırılsa da girdi kalır." },
      { id: "registry", label: "Registry kayıtlarını çöz", hint: "MountedDevices ile harf eşlemesi.", detail: "\\DosDevices\\E: eşlemesi, hangi seri numarasının hangi harfte olduğunu gösterir." },
      { id: "correlate", label: "Dosya sistemi kayıtlarıyla eşleştir", hint: "E: biriminde dosya oluşumu.", detail: "Bağlantı + dosya oluşumu birlikte destekleyici bulgu üretir." },
      { id: "finding", label: "Bulgu oluştur", hint: "Bağlantı ≠ kopyalama.", detail: "Bulgu başlığı, kopyalama iddiasını değil gözlemi içermelidir." },
    ],
    warn: "Bu modül yalnızca sentetik Registry ve olay kayıtları üzerinde çalışır; gerçek sistem Registry'sine erişim yoktur.",
  },
  {
    code: "MODÜL F",
    key: "F",
    title: "Windows Olay Günlüğü Analizi",
    titleEn: "Windows Event Log Analysis",
    lessonId: "L2-03",
    summary:
      "Event ID, kullanıcı ve tarih filtreleriyle sentetik EVTX görüntüleyici; 4624/4625/1102 analizi ve korelasyon.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-002", "AG-DFIR-2026-003"],
    tools: ["Event Viewer (simülasyon)", "Event ID sözlüğü", "Filtre motoru"],
    steps: [
      { id: "filter", label: "Event ID ile filtrele", hint: "Örn. 4624, 4625, 1102.", detail: "Filtre, kaynak üzerinde değil kopya üzerinde uygulanır." },
      { id: "user", label: "Kullanıcı ve IP bazında grupla", hint: "Ardışık deneme analizi.", detail: "Aynı IP'den ardışık 4625 kayıtları istatistiksel destek üretir." },
      { id: "types", label: "Oturum açma türlerini çöz", hint: "2 / 3 / 5 / 10.", detail: "Logon Type, oturumun nasıl açıldığını belirtir; kim tarafından açıldığını değil." },
      { id: "correlate", label: "Olayları ilişkilendir", hint: "4624 → 4688 → 4663 zinciri.", detail: "Zincir, oturumun ardından yapılan işlemleri birleştirir." },
      { id: "mark", label: "Şüpheli aktiviteleri işaretle", hint: "Her işaret için güven düzeyi.", detail: "İşaret, bulgu olarak sınıflandırılır ve kaynak olay kimliğine bağlanır." },
    ],
    warn: "Her Event ID'nin neyi kanıtlayıp kanıtlayamadığı sözlük alanında verilmiştir; tek başına sonuç üretilmez.",
  },
  {
    code: "MODÜL G",
    key: "G",
    title: "Zaman Çizelgesi Analizi",
    titleEn: "Timeline Analysis",
    lessonId: "L3-06",
    summary:
      "Farklı modül kayıtlarını tek zaman ekseninde birleştirme, saat dilimi normalizasyonu ve çelişki işaretleme.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-003", "AG-DFIR-2026-006"],
    tools: ["Kaynak birleştirici", "UTC dönüştürücü", "Güven düzeyi filtresi"],
    steps: [
      { id: "collect", label: "Kaynakları topla", hint: "Dosya sistemi, tarayıcı, USB, Event Log, Registry.", detail: "Her kayıt kendi kaynak kimliğiyle korunur; birleştirme kopya üzerindedir." },
      { id: "normalize", label: "UTC'ye normalize et", hint: "Yerel saat ofsetiyle saklanır.", detail: "Ofset olmadan sıralama yanıltıcıdır; TRT +03:00 kayıtları UTC'ye çevrilir." },
      { id: "order", label: "Olay sıralamasını oluştur", hint: "Aynı saniyede olanlar için çapraz kontrol.", detail: "Sıralama, ardışık kurgunun temelidir." },
      { id: "conflict", label: "Çelişkili kayıtları işaretle", hint: "Çelişki gizlenmez.", detail: "Çelişen kayıt silinmez; alternatif açıklama alanı doldurulur." },
      { id: "export", label: "Çizelgeyi rapora ekle", hint: "Yalnızca gerçek kayıtlar.", detail: "Rapora yalnızca kaynak kayıtlarla eşleşen satırlar taşınır." },
    ],
    warn: "Zaman çizelgesi kayıtları kaynak verilerle eşleşmek zorundadır; tahmini satır üretilmez.",
  },
  {
    code: "MODÜL H",
    key: "H",
    title: "Adli Bilişim Raporu",
    titleEn: "Forensic Report",
    lessonId: "L3-06",
    summary:
      "18 bölümlü, gerçek işlem kayıtlarından beslenen rapor üretimi; PDF / Markdown / JSON dışa aktarım.",
    caseIds: ["AG-DFIR-2026-001", "AG-DFIR-2026-007"],
    tools: ["Rapor motoru", "pdfmake (gömülü Türkçe font)", "Markdown / JSON dışa aktarım"],
    steps: [
      { id: "scope", label: "Kapsam ve yetkilendirmeyi gözden geçir", hint: "Yetki kaydı yoksa rapor üretilmez.", detail: "Kapsam, inceleme talebi ile birlikte raporda açılan ilk bölümdür." },
      { id: "evidence", label: "Delil envanterini doğrula", hint: "Yalnızca edinilmiş deliller.", detail: "Edinilmemiş delil envanterde 'Edinilmedi' durumuyla görünür, rapora alınmaz." },
      { id: "hash", label: "Hash doğrulama bölümünü doldur", hint: "Yalnızca hesaplanmış özetler.", detail: "Hash alanı boş olan delilin satırı raporda 'hesaplanmadı' olarak belirtilir." },
      { id: "findings", label: "Bulguları güven düzeyiyle yerleştir", hint: "Gözlem ile yorum ayrı satır.", detail: "Sonuç ve kanaat yalnızca doğrudan gözlem ve teknik doğrulanmış bulgulara dayanır." },
      { id: "export", label: "Raporu oluştur ve dışa aktar", hint: "PDF, Markdown, JSON.", detail: "PDF gerçek metin katmanı içerir; ekran görüntüsü değildir." },
    ],
    warn: "Sistem otomatik olarak suç isnadı veya kesin hukuki hüküm üretmez; dil nesnel ve sınırlılıklar açıkça belirtilir.",
  },
];

export const getLab = (key: string) => LAB_MODULES.find((m) => m.key === key);
