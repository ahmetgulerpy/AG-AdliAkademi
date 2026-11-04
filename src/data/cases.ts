export type CaseSeed = {
  caseId: string;
  title: string;
  subject: string;
  status: string;
  openedAt: string;
  scope: string;
  brief: string;
  questions: string[];
  modules: string[];
};

export type EvidenceSeed = {
  evidenceId: string;
  caseId: string;
  type: string;
  sourceDevice: string;
  serialNumber?: string;
  acquisitionMethod: string;
  sizeBytes: number;
  status: string;
  storageLocation: string;
  /** Edinim sonrası hesaplanan SHA-256 (sentetik ama tutarlı). */
  sha256: string;
};

export const CASES: CaseSeed[] = [
  {
    caseId: "AG-DFIR-2026-001",
    title: "Şüpheli Veri Aktarımı",
    subject:
      "FIN-departmanı çalışanının şirket içi gizli belgeleri harici bir USB belleğe aktardığı iddiası.",
    status: "open",
    openedAt: "2026-02-09T08:00:00.000Z",
    scope:
      "WKS-FIN-017 iş istasyonu, USB-VID-001 harici bellek, Windows Security/System olay günlükleri, Chrome kullanıcı profili, NTFS dosya sistemi metadata kayıtları.",
    brief:
      "Bilgi Güvenliği Birimi, 2026-02-06 tarihinde Finans departmanından bir kullanıcının gizlilik dereceli dosyalara eriştiğini ve aynı gün harici bir USB cihazının istasyona bağlandığını raporlamıştır. İnceleme kapsamında yalnızca şirket tarafından yetkilendirilmiş iş istasyonu ve bağlı cihazlar kapsam alınmıştır.",
    questions: [
      "USB cihazı inceleme altındaki sisteme bağlanmış mı? Hangi zaman aralığında?",
      "Bağlanan cihazın kimlik bilgileri (VID/PID, seri no) nedir?",
      "İddia edilen belgeler erişilmiş mi? Hangi MACB zaman damgaları üzerinden?",
      "Dosyaların kopyalandığına dair hangi bulgular var, hangileri yalnızca ihtimal düzeyinde?",
      "Tarayıcı aktiviteleriyle ilişki kurulabiliyor mu?",
      "Olayların zaman sıralaması nedir ve hangi saat diliminde kaydedilmişlerdir?",
      "Hangi sonuçlar doğrulanabilir, hangileri yalnızca destekleyici niteliktedir?",
    ],
    modules: ["A", "B", "C", "D", "E", "F", "G", "H"],
  },
  {
    caseId: "AG-DFIR-2026-002",
    title: "Silinmiş Dosyaların İncelenmesi",
    subject:
      "Belirli belgelerin silindiği ve inceleme öncesinde dosya izlerinin ortadan kaldırılmaya çalışıldığı iddiası.",
    status: "open",
    openedAt: "2026-02-11T08:00:00.000Z",
    scope: "NTFS MFT, $LogFile, $UsnJrnl:$J, $Recycle.Bin, $I/$R dosya çiftleri, unallocated alan.",
    brief:
      "Departman arşivinde bulunması gereken üç dokümanın erişilemez olduğu bildirilmiştir. Sistem yöneticisi, dosyaların silindiğini ve bazı kayıt yapılarının temizlenmiş olabileceğini belirtmiştir.",
    questions: [
      "Hangi dosyalar silinmiş? Silinme sırası belirlenebiliyor mu?",
      "Silinme zamanı hangi kaynaktan tespit edilebilir?",
      "Dosyalar kurtarılabilir mi? Kurtarılan içeriğin bütünlüğü doğrulanabiliyor mu?",
      "Dosyanın eski konumu (path) belirlenebiliyor mu?",
      "Kayıt temizleme girişimi tespit edilebildi mi?",
    ],
    modules: ["A", "B", "C", "G"],
  },
  {
    caseId: "AG-DFIR-2026-003",
    title: "Şüpheli Kullanıcı Oturumu",
    subject: "Mesai saatleri dışında gerçekleştirilen şüpheli kullanıcı oturumlarının incelenmesi.",
    status: "open",
    openedAt: "2026-02-13T08:00:00.000Z",
    scope: "Windows Security.evtx, System.evtx, kullanıcı hesapları, oturum açma türleri, IP adresleri.",
    brief:
      "Gece vardiyası olmayan bir birimde 02:47 ile 03:31 arasında üç başarılı uzak oturum kaydedilmiştir. Oturumların kim tarafından açıldığı belirsizdir.",
    questions: [
      "Hangi hesaplarla oturum açılmış? Oturum açma türleri neler?",
      "Başarısız denemeler var mı ve kaç tanesi ardışık?",
      "Uzak oturumların kaynak IP adresleri nedir?",
      "Günlük temizliği (Event ID 1102) gerçekleşmiş mi?",
      "Oturum sonrası hangi işlemler oluşturulmuş?",
    ],
    modules: ["F", "G"],
  },
  {
    caseId: "AG-DFIR-2026-004",
    title: "Tarayıcı ve İndirme Geçmişi",
    subject: "İş istasyonundan gerçekleştirilen şüpheli indirme işlemlerinin incelenmesi.",
    status: "open",
    openedAt: "2026-02-16T08:00:00.000Z",
    scope: "Chrome History, Downloads, Cookies, Cache, dosya metadata kayıtları.",
    brief:
      "Bir kullanıcının harici bir dosya paylaşım servisine yüklemeden önce araştırma yaptığı iddia edilmektedir. Tarayıcı SQLite veritabanları edinilmiştir.",
    questions: [
      "Hangi URL'ler ziyaret edilmiş? Zaman damgaları nedir?",
      "Hangi dosyalar indirilmiş ve indirme boyutları nedir?",
      "Arama sorguları neleri gösteriyor?",
      "Tarayıcı geçmişinde olmayan bir işlem kesinlikle yapılmamıştır demek mümkün mü?",
      "İndirilen dosyaların disk üzerindeki metadata kayıtları ile örtüşme var mı?",
    ],
    modules: ["D", "B", "G"],
  },
  {
    caseId: "AG-DFIR-2026-005",
    title: "Bellek ve Çalışan Süreç Analizi",
    subject: "Şüpheli bir uygulamanın çalıştırıldığı iddia edilen bilgisayarda bellek incelemesi.",
    status: "open",
    openedAt: "2026-02-18T08:00:00.000Z",
    scope: "Sentetik RAM-001 imajı, süreç listesi, yüklenen modüller, ağ bağlantıları, komut satırı artefaktları.",
    brief:
      "İş istasyonu çevrimdışı iken bellek imajı alınmıştır. İddiaya göre kullanıcı alanındaki bir arşiv dosyası çalıştırılmıştır.",
    questions: [
      "Hangi süreçler bellekte mevcut? Ebeveyn-çocuk ilişkileri nedir?",
      "Beklenmeyen bir modül yüklenmiş mi? İmzası nedir?",
      "Açık ağ bağlantıları hangi süreçlerle ilişkili?",
      "Komut satırı argümanları bellekte iz bırakmış mı?",
      "Hangi bulgular Volatility çıktısıyla doğrulanabilir?",
    ],
    modules: ["A", "B", "G"],
  },
  {
    caseId: "AG-DFIR-2026-006",
    title: "Ağ Adli Bilişimi",
    subject: "Şirket ağında gerçekleştiği iddia edilen şüpheli veri iletişiminin incelenmesi.",
    status: "open",
    openedAt: "2026-02-20T08:00:00.000Z",
    scope: "PCAP yakalama, DNS sorgu/yanıtları, TCP bağlantı tablosu, HTTP başlıkları.",
    brief:
      "Güvenlik duvarı loglarında gece saatlerinde tekrarlayan giden bağlantılar tespit edilmiştir. Yakalama dosyası 18,4 MB boyutundadır.",
    questions: [
      "Hangi hedef IP ve portlara bağlantı kurulmuş?",
      "DNS sorguları hangi alan adlarını gösteriyor?",
      "TCP bağlantıları başarılı mı (SYN/ACK)? Yeniden kurulum var mı?",
      "Şifreli trafik içeriği görülebilir mi? Hangi metadata görülebilir?",
      "Zaman çizelgesindeki sıralama nedir?",
    ],
    modules: ["B", "G"],
  },
  {
    caseId: "AG-DFIR-2026-007",
    title: "Kapsamlı Bitirme Vakası",
    subject:
      "Önceden açıklanmayan, birden fazla delil türü içeren bütüncül bir soruşturma (final case).",
    status: "open",
    openedAt: "2026-03-02T08:00:00.000Z",
    scope: "Çoklu kaynak: disk imajı, USB geçmişi, tarayıcı kayıtları, olay günlükleri, geri dönüştürülmüş bellek izleri.",
    brief:
      "Bu vaka bilgi verilmeden sunulur. İncelemeci; delil ediniminden başlayarak bütünlük doğrulaması, dosya ve sistem kaydı analizi, zaman çizelgesi oluşturması, çoklu delil korelasyonu ve profesyonel rapor hazırlamasını beklenir.",
    questions: [
      "İnceleme kapsamını sen tanımla: hangi deliller öncelikli?",
      "Bütünlük doğrulaması yapılmadan hangi adımlar atılamaz?",
      "Hangi bulgular doğrudan gözlem, hangileri dolaylı?",
      "Çelişkili zaman kayıtlarını nasıl raporlarsın?",
      "Kanaatini hangi doğrulanmış bulgulara dayandırıyorsun?",
      "Sınırlılıklar bölümünde neleri açıkça belirtmelisin?",
    ],
    modules: ["A", "B", "C", "D", "E", "F", "G", "H"],
  },
];

export const EVIDENCE: EvidenceSeed[] = [
  {
    evidenceId: "EV-001",
    caseId: "AG-DFIR-2026-001",
    type: "Disk İmajı (E01)",
    sourceDevice: "WKS-FIN-017 İş İstasyonu / 500 GB SATA HDD",
    serialNumber: "WD-WCC6Y4KLN2TP",
    acquisitionMethod: "Fiziksel edinim, yazma engelleyici ile bit-by-bit",
    sizeBytes: 500107862016,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-A / Yuva 01",
    sha256: "7d1f0d1e9b2a6f0c4b7e3a8d5c9f21b6a0e4d7c8f3b2a1905e6d7c8b9a0f1e23",
  },
  {
    evidenceId: "EV-002",
    caseId: "AG-DFIR-2026-001",
    type: "Harici USB Bellek (RAW/DD)",
    sourceDevice: "USB-VID-001 Kingston DataTraveler 64 GB",
    serialNumber: "08606E215C7B2F113E9A",
    acquisitionMethod: "Fiziksel edinim, yazma engelleyici ile bit-by-bit",
    sizeBytes: 64424509440,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-A / Yuva 02",
    sha256: "b3c9a7f2e5d81c4a6b0f7e9d2c5a8b1f4e7d0a3c6b9f2e5d8c1a4b7e0d3f6a92",
  },
  {
    evidenceId: "EV-003",
    caseId: "AG-DFIR-2026-005",
    type: "Bellek Görüntüsü (RAW)",
    sourceDevice: "RAM-001 / 16 GB DDR4 sentetik bellek imajı",
    serialNumber: "SIM-RAM-16G-0001",
    acquisitionMethod: "Volatil bellek edinimi (simülasyon)",
    sizeBytes: 17179869184,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-B / Yuva 07",
    sha256: "e5a2b8c4d6f0a3e7b1c9d5f8a2e6b0c4d7f1a5e9b3c7d0f4a8e2b6c0d4f8a1e7",
  },
  {
    evidenceId: "EV-004",
    caseId: "AG-DFIR-2026-004",
    type: "Mobil/Yazılım Yedekleme Verisi",
    sourceDevice: "MOB-001 Uygulama profili yedeği (tarayıcı artefaktları dahil)",
    serialNumber: "SIM-APP-2026-004",
    acquisitionMethod: "Mantıksal edinim (uygulama düzeyi)",
    sizeBytes: 2147483648,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-B / Yuva 03",
    sha256: "1c4f7a0d3b6e9c2f5a8d1b4e7c0f3a6d9b2e5c8f1a4d7b0e3c6f9a2d5b8e1c47",
  },
  {
    evidenceId: "EV-005",
    caseId: "AG-DFIR-2026-003",
    type: "Olay Günlüğü Koleksiyonu (EVTX)",
    sourceDevice: "SRV-DC02 / Security.evtx + System.evtx (sentetik koleksiyon)",
    serialNumber: "SIM-EVTX-0002",
    acquisitionMethod: "Mantıksal edinim (günlük dışa aktarımı)",
    sizeBytes: 73400320,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-C / Yuva 01",
    sha256: "9f2e5b8c1a4d7f0e3b6c9a2d5f8e1b4c7a0d3f6e9b2c5a8d1f4e7b0c3a6d9f25",
  },
  {
    evidenceId: "EV-006",
    caseId: "AG-DFIR-2026-006",
    type: "Ağ Yakalama (PCAP)",
    sourceDevice: "CORE-SW-01 SPAN portu / 18,4 MB yakalama",
    serialNumber: "SIM-PCAP-0006",
    acquisitionMethod: "Canlı ağ yakalama (sentetik)",
    sizeBytes: 19293798,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-C / Yuva 05",
    sha256: "4d8c1f6a9e2b5d8c0f3a6e9d2b5c8f1a4e7d0b3c6f9a2e5d8b1c4f7a0e3d6b98",
  },
  {
    evidenceId: "EV-007",
    caseId: "AG-DFIR-2026-002",
    type: "NTFS Bölüm İmajı (RAW/DD)",
    sourceDevice: "WKS-HR-004 / 240 GB SSD mantıksal bölüm imajı",
    serialNumber: "S4XTNW0N604121R",
    acquisitionMethod: "Mantıksal edinim (bölüm düzeyinde)",
    sizeBytes: 240190605312,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-A / Yuva 06",
    sha256: "a6e3d0c9b2f5a8e1d4c7b0f3a6e9d2c5b8f1a4e7d0c3b6f9a2e5d8c1b4f7a0e3",
  },
  {
    evidenceId: "EV-008",
    caseId: "AG-DFIR-2026-007",
    type: "Çoklu Kaynak Delil Seti (Final)",
    sourceDevice: "WKS-OPS-022 / Karma edinim (disk + USB + tarayıcı profili)",
    serialNumber: "SIM-FINAL-0022",
    acquisitionMethod: "Fiziksel + mantıksal kombine edinim (simülasyon)",
    sizeBytes: 128849018880,
    status: "registered",
    storageLocation: "Kilitli delil dolabı / RAF-D / Yuva 01",
    sha256: "f0b3c6a9d2e5f8b1c4a7d0e3f6b9c2a5d8e1f4b7c0a3d6e9f2b5c8a1d4e7f0b3",
  },
];
