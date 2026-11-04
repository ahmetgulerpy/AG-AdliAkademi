import type { Lesson, Level } from "./types";

export const LEVELS: { key: Level; code: string; title: string; titleEn: string; desc: string }[] = [
  {
    key: "beginner",
    code: "LEVEL 1",
    title: "Başlangıç",
    titleEn: "BEGINNER",
    desc: "Dijital adli bilişimin temelleri: delil kavramı, bütünlük, muhafaza zinciri, hash algoritmaları, dosya sistemi ve zaman damgaları.",
  },
  {
    key: "intermediate",
    code: "LEVEL 2",
    title: "Orta Seviye",
    titleEn: "INTERMEDIATE",
    desc: "Edinim, NTFS ve MFT, Registry, olay günlükleri, USB ve tarayıcı artefaktları, silinmiş dosya incelemesi ve zaman çizelgesi.",
  },
  {
    key: "advanced",
    code: "LEVEL 3",
    title: "İleri Seviye",
    titleEn: "ADVANCED",
    desc: "Bellek ve ağ adli bilişimi, gelişmiş Windows artefaktları, günlük analizi, anti-forensics tespiti, olay yeniden oluşturma ve profesyonel raporlama.",
  },
];

export const LESSONS: Lesson[] = [
  /* ========================= LEVEL 1 — BEGINNER ========================= */
  {
    id: "L1-01",
    level: "beginner",
    order: 1,
    title: "Dijital Adli Bilişime Giriş",
    titleEn: "Introduction to Digital Forensics",
    summary:
      "Dijital adli bilişimin tanımı, kapsamı, yasal dayanağı ve NIST SP 800-86 / ISO/IEC 27037 çerçevelerinin sınırları.",
    minutes: 22,
    labModule: "A",
    objectives: [
      "Dijital adli bilişimi (Digital Forensics) bilimsel bir disiplin olarak tanımlayabilmek.",
      "NIST SP 800-86 ve ISO/IEC 27037'nin kapsadığı ve kapsamadığı konuları ayırt edebilmek.",
      "Simülasyon ile gerçek adli edinim arasındaki farkı açıklayabilmek.",
      "Bir incelemenin yetkilendirme gerektirdiğini kavrayabilmek.",
    ],
    definition:
      "Dijital adli bilişim, elektronik cihazlarda bulunan dijital delillerin; kabul edilmiş yöntemlerle edinilmesi, güvenle muhafaza edilmesi, teknik olarak analiz edilmesi ve bulguların denetlenebilir bir biçimde raporlanmasını kapsayan bilim ve uygulama alanıdır. Amaç yalnızca veriye ulaşmak değil, veriye ulaşma şeklinin de sorgulanabilir olmasını sağlamaktır.",
    principle: [
      "NIST SP 800-86 (Guide to Integrating Forensic Techniques into Incident Response), dijital adli süreci dört faaliyete ayırır: koleksiyon (collection), muhafaza (preservation), analiz (analysis) ve raporlama (reporting). Bu dört faaliyetin hepsi geriye dönük denetlenebilir olmalıdır.",
      "ISO/IEC 27037, dijital delillerin tanımlanması, toplanması, kazanılması ve muhafaza edilmesi için role dayalı öneriler sunar (spike, first responder, digital evidence first responder, digital evidence specialist).",
      "İki standart da 'nasıl yapılacağını' tanımlayan teknik spesifikasyon değildir; kurum içi prosedürlerin ve yerel mevzuatın çerçevesini çizer. Somut araç doğrulaması (tool validation) ayrıca yapılmalıdır.",
    ],
    why: [
      "Bir bulgu, elde edilme yöntemi sorgulanabilirse delil niteliğini kaybeder. Mahkemede 'dosyayı açtım' ifadesi değil, 'yazma engelleyici kullanarak bit seviyesinde kopya aldım, SHA-256 şu, eşleşme sağlandı' ifadesi geçerlidir.",
      "Olay müdahale (incident response) ekipleri ilk müdahalede kanıtı yok edebilir. Adli disiplin, müdahalenin kendisini de kayıt altına alır.",
      "Kurumsal denetim ve uyumluluk (ISO 27001, KVKK m.12) süreçleri, kanıtlanabilir yöntem talep eder.",
    ],
    how: [
      "1. Yetkilendirme: İncelemenin yazılı izinle başlatılması ve kapsamın tanımlanması.",
      "2. Bağlamın korunması: Sistem çalışıyorsa volatil veriler (RAM, açık bağlantılar) önce edinilir.",
      "3. Edinim: Kaynak medyanın yazma engelleyici ile bit düzeyinde kopyalanması; orijinal asla incelenmez.",
      "4. Bütünlük doğrulaması: Edinim anında ve sonrasında hash hesaplanıp kayıt altına alınır.",
      "5. Analiz: Kopya üzerinde çalışılır; tüm işlemler günlüklenir.",
      "6. Raporlama: Bulgular, güven düzeyi ve sınırlılıklarla birlikte sunulur.",
    ],
    tools: [
      { name: "FTK Imager", desc: "Bit düzeyinde imaj alma ve hash doğrulama aracı (Windows)." },
      { name: "Guymager", desc: "Linux tabanlı açık kaynak adli imaj alma aracı." },
      { name: "Tableau / WiebeTech", desc: "Donanım tabanlı yazma engelleyici (write blocker) ailesi." },
      { name: "X-Ways Forensics", desc: "Düşük seviyeli disk analiz ve imaj işleme yazılımı." },
    ],
    realWorld: [
      "İç soruşturmalar: çalışanın kurum cihazından veri çıkarımı iddiaları.",
      "Siber olay müdahale: fidye yazılımı sonrası kapsam ve etki analizi.",
      "Dijital delil bilirkişiliği: ticari uyuşmazlıklarda e-posta ve belge metadata incelemesi.",
      "Uyumluluk denetimleri: KVKK ve ISO 27001 kapsamında veri ihlali tespiti.",
    ],
    example: {
      caption: "Adli incelemenin denetlenebilir kayıt zinciri (örnek bir custody girişinin ham satırı)",
      code: `2026-02-09T08:00:00.000Z | operator=S.Gunes | action=Kayıt
  evidence=EV-001 case=AG-DFIR-2026-001
  prev=none -> new=registered
  reason=Delil envanterine kaydedildi; henüz edinim yapılmadı.
  NOTE: status "registered" iken hash alanı NULL olmalıdır.`,
    },
    diagram: {
      title: "Adli süreç döngüsü (NIST SP 800-86 dört faaliyeti)",
      nodes: [
        { label: "Yetkilendirme", sub: "Authorization" },
        { label: "Koleksiyon", sub: "Collection" },
        { label: "Muhafaza", sub: "Preservation" },
        { label: "Analiz", sub: "Analysis" },
        { label: "Raporlama", sub: "Reporting" },
      ],
      note: "Her adım, kendinden önceki adımın kaydına atıfta bulunur. Zincir koparsa sonraki adımın değeri tartışılır.",
    },
    mistakes: [
      { wrong: "Orijinal cihaz üzerinde doğrudan arama yapmak.", why: "Araç, dosya erişim zamanlarını ve günlük kayıtlarını değiştirir; delil üzerinde işlem yapıldığı iddiasıyla bulgu itiraz edilebilir." },
      { wrong: "Hash'i edinimden sonra bir gün hesaplamak.", why: "Edinim anıyla hesaplama arasında geçen süre, kaynağın değiştiği şüphesini doğurmaz ama kanıtlamaz. Hash edinim sırasında alınır." },
      { wrong: "Standartları araç kullanım kılavuzu sanmak.", why: "NIST SP 800-86 ve ISO/IEC 27037 yöntem çerçevesi sunar; hangi aracın hangi sürümünün doğrulandığını ayrı bir çalışma tanımlar." },
    ],
    quiz: [
      {
        q: "NIST SP 800-86'nın dijital adli süreci için tanımladığı dört faaliyet hangisidir?",
        options: [
          "Toplama, şifre çözme, analiz, imha",
          "Koleksiyon, muhafaza, analiz, raporlama",
          "Edinim, kurtarma, sıkıştırma, arşivleme",
          "Tespit, izolasyon, silme, raporlama",
        ],
        answer: 1,
        explain:
          "Doğru cevap Koleksiyon, Muhafaza, Analiz ve Raporlama'dır. 'Şifre çözme' adli süreç değil, araç düzeyinde bir teknik işlemdir; 'imha' ise sürecin tersidir ve delil koruma ilkesiyle çelişir.",
      },
      {
        q: "Bir inceleme ekibi imaj dosyasını aldıktan bir hafta sonra hash hesaplarsa ne olur?",
        options: [
          "Hiçbir sorun olmaz, hash değişmez",
          "Sorun olmaz çünkü imaj salt okunur",
          "Edinim anı ile hesaplama arasındaki dönem kapsanmaz, bütünlük iddiası zayıflar",
          "Hash yalnızca FAT32'de değişir",
        ],
        answer: 2,
        explain:
          "İmaj dosyası edinim anında hash'lenmediyse, edinimden hash hesabına kadar geçen sürede dosyanın değişmediği bağımsız olarak gösterilemez. Salt okunur olmak dosyanın değişmeyeceği anlamına gelmez; dosya sistemi düzeyinde yazma hâlâ mümkündür. Doğru yaklaşım, hash'i edinim anında alıp custody kaydına yazmaktır.",
      },
      {
        q: "ISO/IEC 27037 ile ilgili hangi ifade doğrudur?",
        options: [
          "Hangi adli aracın kullanılacağını zorunlu olarak belirler",
          "Dijital delil tanımlama, toplama, kazanma ve muhafaza için rol ve öneriler sunar",
          "Yalnızca Türk hukukuna uygundur",
          "Bellek analizi için zorunlu bir teknik spesifikasyondur",
        ],
        answer: 1,
        explain:
          "ISO/IEC 27037, rolleri (spike, first responder, digital evidence specialist vb.) ve genel önerileri tanımlar; araç seçimi veya teknik parametre konusunda zorunluluk getirmez, bu nedenle 'zorunlu teknik spesifikasyon' ifadesi yanlıştır.",
      },
    ],
    readings: [
      { title: "NIST SP 800-86 — Guide to Integrating Forensic Techniques into Incident Response", note: "Dört faaliyet ve olay müdahale ile adli süreç entegrasyonunun çerçeve belgesi." },
      { title: "ISO/IEC 27037:2012", note: "Dijital ve elektronik deliller için öneriler; kapsamı tanım ve muhafaza ile sınırlıdır." },
      { title: "SWGDE Best Practices for Computer Forensics", note: "Uygulama düzeyinde pratik öneriler." },
    ],
  },
  {
    id: "L1-02",
    level: "beginner",
    order: 2,
    title: "Dijital Delil ve Delil Türleri",
    titleEn: "Digital Evidence & Evidence Types",
    summary:
      "Dijital delilin nitelikleri, kanıtlanabilirlik dereceleri, birincil ve ikincil kaynak ayrımı ile delil türlerinin sınıflandırılması.",
    minutes: 20,
    labModule: "A",
    objectives: [
      "Dijital delilin ortak niteliklerini (kamuya ulaşabilirlik, oynaklık, yüksek hacim, teknik karmaşıklık) sıralayabilmek.",
      "Birincil (direct) ve ikincil (derived) kaynak ayrımını açıklayabilmek.",
      "Bir delilin neden tek başına kesin sonuç üretmediğini örneklerle gösterebilmek.",
    ],
    definition:
      "Dijital delil, bir olaya ilişkin bilgi taşıyan ve elektronik ortamda var olan, incelemeyle erişilebilen veri parçasıdır. Bir dosyanın kendisi, onun üst verisi (metadata), sistem günlükleri, bellek izleri ve ağ paketleri farklı delil türleridir.",
    principle: [
      "Dijital deliller üç temel nitelik taşır: (1) yaratılışları bakımından kamuya açık değillerdir, yalnızca teknik araçlarla görülürler; (2) değiştirilebilir (volatile) olabilirler; (3) yüksek hacim ve teknik karmaşıklık içerirler.",
      "Birincil kaynak: doğrudan olayın ürünü olan veri (ör. USN Journal kaydı). İkincil kaynak: birincilden türetilen (ör. analistin oluşturduğu CSV dışa aktarımı). İkincil kaynak her zaman birinciline atıf yapmalıdır.",
      "Araç çıktısı delil değildir; birincil kaydın okunmuş hâlidir. Bu nedenle araç sürümü ve ayarları raporda belirtilir.",
    ],
    why: [
      "Delil türü, hangi soruya cevap verebileceğinizi belirler. USB Registry kaydı 'cihaz bağlandı' der; 'dosya kopyalandı' demez.",
      "Türü bilmeden yorum yapmak, doğrulanamayan iddialar üretmeye yol açar.",
    ],
    how: [
      "1. Delil türünü belirle: dosya sistemi / Registry / olay günlüğü / bellek / ağ / uygulama artefaktı.",
      "2. Kaynağın birincil mi ikincil olduğunu işaretle.",
      "3. Neyi kanıtlayabileceğini ve neyi kanıtlayamayacağını yaz.",
      "4. Hangi ikinci kaynakla desteklenebileceğini belirle (korelasyon).",
    ],
    tools: [
      { name: "Autopsy / The Sleuth Kit", desc: "Dosya sistemi ve artefakt inceleme platformu." },
      { name: "Registry Explorer", desc: "Registry hives'ı yapılandırılmış biçimde görüntüleme aracı." },
      { name: "Kape / lime", desc: "Hedefli artefakt toplama (collection) çerçeveleri." },
    ],
    realWorld: [
      "Soruşturma kapsamının tanımlanması: hangi delil türünün hangi soruyu cevaplayacağı.",
      "Bilirkişi raporlarında iddia-kanıt eşleştirmesi.",
    ],
    example: {
      caption: "Aynı olayın üç farklı delil türüyle ifade edilmesi",
      code: `Olay: USB belleğe dosya yazılması

[Dosya Sistemi]   E:\\Q1_Butce_Gizli.xlsx  C=08:31:04 M=08:31:05
                  -> hedef birimde dosya oluştuğunu gösterir
[Registry]        MountPoints2\\{a9f3…} = E:  08:14:24
                  -> cihazın kullanıcıya bağlandığını gösterir
[Olay Günlüğü]    Event 4663 AppendData @ E:  08:30:12
                  -> harici birime yazma işleminin denetlendiğini gösterir

ÜÇÜ BİRLİKTE destekleyici bulgu üretir; tek başına hiçbiri
"k dosya USB'ye kopyalandı" iddiasını tek başına KANITLAMAZ.`,
    },
    diagram: {
      title: "Delil türü → cevaplanabilir soru",
      nodes: [
        { label: "Registry", sub: "Cihaz bağlandı mı?" },
        { label: "MFT / USN", sub: "Dosya oluştu mu, silindi mi?" },
        { label: "Event Log", sub: "Hangi hesap, hangi işlem?" },
        { label: "Browser", sub: "Hangi site, hangi arama?" },
        { label: "Bellek", sub: "O anda hangi süreç çalışıyordu?" },
      ],
      note: "Hiçbir tek kaynak, başka bir kaynağın sorusunu cevaplamaya çalışılmamalıdır.",
    },
    mistakes: [
      { wrong: "USB bağlantısını görüp 'dosyalar kopyalandı' demek.", why: "Bağlantı kaydı yalnızca varlığı gösterir; yazma işlemi için dosya sistemi veya 4663 gibi denetim kayıtları gerekir." },
      { wrong: "İkincil CSV çıktısını tek delil olarak sunmak.", why: "Türetilmiş kaynak, birincil kaynağına ve dışa aktarma ayarlarına atıf yapmadan denetlenemez." },
      { wrong: "Tarayıcı geçmişinde olmayan site için 'ziyaret edilmedi' demek.", why: "Geçmiş silinmiş, profil değiştirilmiş veya farklı tarayıcı kullanılmış olabilir; bu bir 'bulgu' değil, 'kanıt yokluğu' durumudur." },
    ],
    quiz: [
      {
        q: "Bir USB Registry kaydı tek başına hangi iddiayı destekler?",
        options: [
          "Dosyanın USB'ye kopyalandığını",
          "Cihazın sisteme bağlandığını",
          "Kullanıcının dosyayı sildiğini",
          "İnternete veri gönderildiğini",
        ],
        answer: 1,
        explain:
          "Registry (MountPoints2 / USBSTOR) kaydı cihazın sistem tarafından tanındığını ve bağlandığını gösterir. Kopyalama iddiası için dosya sistemi kayıtları (USN Journal, 4663) gerekir; sildiğini söylemek için MFT/Recycle Bin kayıtları gerekir.",
      },
      {
        q: "Araç çıktısı (ör. CSV dışa aktarımı) için doğru ifade hangisidir?",
        options: [
          "Bağımsız bir birincil delildir",
          "İkincil (derived) kaynaktır ve birincil kayda atıf yapmalıdır",
          "Delil niteliği taşımadığı için rapora konulmamalıdır",
          "Yalnızca HTML olarak sunulmalıdır",
        ],
        answer: 1,
        explain:
          "Araç çıktısı, birincil kaydın araç tarafından okunmuş ve dönüştürülmüş hâlidir; bu yüzden ikincil (derived) kaynaktır. 'Delil niteliği taşımaz' ifadesi yanlıştır — raporda yer alabilir, ancak dayanağı olan birincil kayıt ile birlikte sunulmalıdır.",
      },
    ],
    readings: [
      { title: "ISO/IEC 27037 §5 — Digital evidence collection principles", note: "Delil nitelikleri ve role dayalı öneriler." },
      { title: "ACPO Good Practice Guide for Digital Evidence", note: "Dört ilke: kanıt değişmezliği, yetkinlik, denetlenebilirlik, sorumluluk." },
    ],
  },
  {
    id: "L1-03",
    level: "beginner",
    order: 3,
    title: "Delil Bütünlüğü ve Muhafaza Zinciri",
    titleEn: "Evidence Integrity & Chain of Custody",
    summary:
      "Bütünlüğün hash ile kanıtlanması, zincirin append-only (geriye dönük değişmez) yapısı ve durum makinesi mantığı.",
    minutes: 25,
    labModule: "A",
    objectives: [
      "Bütünlük (integrity) ile gizlilik (confidentiality) ayrımını açıklayabilmek.",
      "Append-only custody kaydının neden gerekli olduğunu savunabilmek.",
      "Geçersiz durum geçişlerini (ör. edinimsiz hash doğrulama) tespit edebilmek.",
    ],
    definition:
      "Delil bütünlüğü, delilin edinildiği andan rapor anına kadar değiştirilmediğini gösteren durumdur. Delil muhafaza zinciri (Chain of Custody) ise bu durumu kanıtlayan, her teslim ve işlemi zaman damgalı olarak kaydeden kesintisiz kayıt dizisidir.",
    principle: [
      "Bütünlük kriptografik özet (hash) ile sağlanır: aynı içerik aynı hash'i üretir; içerik değişirse hash değişir.",
      "Zincir kaydı append-only olmalıdır. Bir hata düzeltilecekse eski satır silinmez, üzerine yazmaz; yeni bir 'düzeltme' satırı eklenir ve eski satıra atıf verilir.",
      "Durum makinesi: Kayıt → Edinim → Bütünlük Doğrulama → İnceleme → Bulgular → Raporlama. Ön koşul sağlanmayan geçiş reddedilir.",
    ],
    why: [
      "Zincir koparsa delilin mahkemede veya denetimde kabul edilme ihtimali düşer.",
      "Durum makinesi, rapora edinilmemiş bir delilin 'hash doğrulandı' olarak yansımasını engeller.",
      "Geriye dönük sessiz değişiklik, tüm kaydın güvenilirliğini ortadan kaldırır.",
    ],
    how: [
      "1. Her delile benzersiz Evidence ID ver (EV-001, EV-002…).",
      "2. Her işlemi UTC zaman damgası, operatör, önceki ve yeni durum, neden ile kaydet.",
      "3. Geçişleri durum makinesinden geçir; geçersiz olanı reddet ve nedenini göster.",
      "4. Düzeltmeleri yeni satır olarak ekle (correctedFrom ile eski satıra bağla).",
    ],
    tools: [
      { name: "Schnittstelle / Write-blocker log", desc: "Edinim anındaki donanım kayıtları." },
      { name: "sha256sum / certutil", desc: "Komut satırı özet hesaplama yardımcıları." },
      { name: "AG CYBER LAB Delil Envanteri", desc: "Bu platformdaki durum makinesi ve custody defteri." },
    ],
    realWorld: [
      "Adli laboratuvarlarda delil teslim formu.",
      "SOC olay müdahale görev kayıtları (ticket + audit trail).",
      "KVKK veri ihlali süreçlerinde kanıtlanabilirlik.",
    ],
    example: {
      caption: "İki custody satırı — birincisi kayıt, ikincisi edinim (append-only)",
      code: `seq=1 2026-02-09T08:00:00Z | EV-001
  operator=S.Gunes  prev=none -> new=registered
  action=Kayıt  reason=Envantere alındı

seq=2 2026-02-09T09:14:52Z | EV-001
  operator=S.Gunes  prev=registered -> new=acquired
  action=Edinim  reason=Write-blocker + E01 imaj, SHA-256 üretildi

seq=1 asla silinmez veya düzenlenmez.`,
    },
    diagram: {
      title: "Durum makinesi (state machine)",
      nodes: [
        { label: "Kayıt", sub: "registered" },
        { label: "Edinim", sub: "acquired" },
        { label: "Bütünlük", sub: "hash_verified" },
        { label: "İnceleme", sub: "reviewed" },
        { label: "Bulgular", sub: "findings" },
        { label: "Rapor", sub: "reported" },
      ],
      note: "Geriye doğru geçiş yoktur. 'Bütünlük sorunu' durumu her an üzerine yazılabilir ve incelemeyi durdurur.",
    },
    mistakes: [
      { wrong: "Edinim yapılmadan hash değerini alan olarak doldurmak.", why: "Hash, kaynağı olmayan bir sayıdır; rapora girdiğinde doğrulanamayan bir iddia üretir." },
      { wrong: "Eski custody satırını silip düzeltmek.", why: "Kayıt geçmişinin geriye dönük değiştirilebildiği görülürse tüm zincir güvenilmez kabul edilir." },
      { wrong: "İncelenmemiş delil için bulgu girmek.", why: "Bulgu, inceleme faaliyetinin çıktısıdır; inceleme yoksa çıktının dayanağı da yoktur." },
    ],
    quiz: [
      { q: "Bir custody kaydında hata fark edildiğinde doğru yaklaşım nedir?", options: ["Satırın düzenlenmesi", "Satırın silinip yeniden yazılması", "Yeni bir düzeltme satırı eklenmesi ve eski satıra atıf verilmesi", "Kaydın gizlenmesi"], answer: 2, explain: "Append-only prensipte geçmiş değiştirilemez. Düzeltme, eski satırı koruyan ve ona referans veren (correctedFrom) yeni bir kayıt olmalıdır; aksi hâlde zincirin geriye dönük değiştirilebildiği izlenimi doğar." },
      { q: "Edinilmemiş bir delil için hangi durum doğru değildir?", options: ["'Kayıtlı' durumunda olabilir", "'Henüz edinilmedi' olarak işaretlenebilir", "'Hash doğrulandı' olarak gösterilebilir", "Custody kaydı bulunabilir"], answer: 2, explain: "Edinim yapılmadan kaynak medyanın özeti hesaplanamaz; bu nedenle 'hash doğrulandı' durumu geçersizdir. Kayıt, edinim bekliyor ve custody kaydı durumları mümkündür." },
      { q: "Bütünlük ile gizlilik arasındaki fark nedir?", options: ["İkisi de aynı şeydir", "Bütünlük değiştirilmemeyi, gizlilik yetkisiz erişilmemeyi ifade eder", "Bütünlük şifreleme, gizlilik imzalama demektir", "Gizlilik yalnızca ağ için geçerlidir"], answer: 1, explain: "Bütünlük (integrity) verinin değiştirilmediğini; gizlilik (confidentiality) yalnızca yetkili taraflarca okunabildiğini ifade eder. Hash bütünlüğü kanıtlar, gizliliği değil — hash'li dosya okunabilir durumdadır." },
    ],
    readings: [
      { title: "ISO/IEC 27037 §6–8", note: "Edinim, muhafaza ve kayıt zinciri önerileri." },
      { title: "NIST SP 800-101 Rev. 1", note: "Mobil delil muhafazası için ek çerçeve." },
    ],
  },
  {
    id: "L1-04",
    level: "beginner",
    order: 4,
    title: "Hash Algoritmaları: SHA-256",
    titleEn: "Hash Algorithms — SHA-256",
    summary:
      "Kriptografik özetin çalışma prensibi, sabit çıktı uzunluğu, avalanche effect, çakışma olasılığı ve MD5/SHA-1'in neden terk edildiği.",
    minutes: 28,
    labModule: "B",
    objectives: [
      "SHA-256 girdi ve çıktı yapısını (girdi: değişken, çıktı: 256 bit / 64 onaltılık karakter) açıklayabilmek.",
      "Avalanche effect'i tek bayt değişikliğiyle gözlemleyebilmek.",
      "Hash collision olasılığını ve MD5/SHA-1'in adli bütünlük için neden kullanılmamas gerektiğini sayısal olarak ifade edebilmek.",
      "Hash'in geri döndürülemez (tek yönlü) olduğunu, dolayısıyla şifreleme olmadığını kavrayabilmek.",
    ],
    definition:
      "Hash (kriptografik özet), değişken uzunluktaki herhangi bir girdiyi sabit uzunlukta bir çıktıya dönüştüren tek yönlü matematiksel işlevdir. SHA-256, SHA-2 ailesinden 256 bitlik özet üretir ve çıktı 64 onaltılık karakter olarak yazılır.",
    principle: [
      "Deterministiklik: Aynı girdi her zaman aynı çıktıyı üretir. Bu, iki kopyanın karşılaştırılabilmesini sağlar.",
      "Sabit çıktı uzunluğu: 1 bayt girdi de, 500 GB girdi de 256 bit çıktı üretir.",
      "Avalanche effect (çığ etkisi): Girdideki tek bir bit değişliği çıktının yaklaşık %50'sini değiştirir. Bu, ölçümle doğrulanabilir bir özelliktir.",
      "Çakışma direnci (collision resistance): İki farklı girdinin aynı özeti üretmesi pratikte hesaplanamaz. SHA-256 için 2^128 işlem gerektiren bir doğum günü saldırısı söz konusudur.",
      "Geridönüştürülemezlik: Özetten girdi hesaplanamaz. Bu nedenle hash şifreleme değildir; geri alınabilirliği yoktur.",
    ],
    why: [
      "Adli bilişimde hash, 'bu dosya değişmedi' iddiasının tek teknik dayanağıdır.",
      "MD5 2008'de (Fastcoll) ve SHA-1 2017'de (SHAttered, Google/CWI) pratik çakışma üretimine tabi tutulmuştur; bu nedenle bütünlük doğrulamasında önerilmezler.",
      "NIST SP 800-131A Rev.2, SHA-1'in dijital imza dışında kullanımını kademeli olarak sonlandırmıştır.",
    ],
    how: [
      "1. Girdiyi al (dosya baytları).",
      "2. Girdiyi 512 bitlik bloklara böl; her bloğu 64 tur üzerinden sıkıştır.",
      "3. 8 adet 32 bitlik çalışma değişkenini (a…h) her turda güncelle.",
      "4. Son durumu 8×32 = 256 bit olarak birleştir.",
      "5. Çıktıyı 64 onaltılık karakter olarak yaz ve custody kaydına ekle.",
    ],
    tools: [
      { name: "sha256sum", desc: "Linux/macOS komut satırı özet aracı." },
      { name: "certutil -hashfile <dosya> SHA256", desc: "Windows yerleşik özet aracı." },
      { name: "Web Crypto API (crypto.subtle.digest)", desc: "Tarayıcıda çalışan, gerçek SHA-256 uygulaması — bu laboratuvarda kullanılır." },
      { name: "hashdeep / md5deep", desc: "Rekürsif dizin özetleme ve karşılaştırma." },
    ],
    realWorld: [
      "İmaj dosyasının edinim sonrası doğrulanması.",
      "Dosya değişmezliğinin denetim raporunda kanıtlanması.",
      "Zararlı yazılım örneklerinin IOC olarak paylaşılması.",
    ],
    example: {
      caption: "Avalanche effect — tek bayt değişikliğinin 64 karakterlik özeti nasıl bütünüyle değiştirdiği",
      code: `Girdi A : "AG CYBER LAB - DELIL 001"
SHA-256 : 3f2a…(64 karakter)

Girdi B : "AG CYBER LAB - DELIL 002"   (tek karakter değişti)
SHA-256 : (farklı 64 karakter)

İlk fark edilen bayt:
  A[21] = '1' (0x31)   B[21] = '2' (0x32)
Özet farkı: 64 karakterin ~31'i değişti (%48)`,
    },
    diagram: {
      title: "SHA-256 boru hattı (pipeline)",
      nodes: [
        { label: "Girdi", sub: "değişken uzunluk" },
        { label: "Dolgu", sub: "padding → 512-bit blok" },
        { label: "64 Tur", sub: "MAJ / CH / sigma" },
        { label: "Sıkıştırma", sub: "8 × 32-bit durum" },
        { label: "Çıktı", sub: "256 bit = 64 hex" },
      ],
      note: "Girdi uzunluğu ne olursa olsun çıktı her zaman 64 onaltılık karakterdir.",
    },
    mistakes: [
      { wrong: "Hash'i şifreleme sanmak.", why: "Geri döndürülebilirliği yoktur; dosya hash'inden dosya elde edilemez. Bunu tersine çevirmeyi vaat eden hizmetler yanıltıcıdır." },
      { wrong: "Hash eşitse dosyaların içerikleri de mutlaka aynı demek.", why: "Teorik olarak çakışma mümkündür. SHA-256 için pratikte imkânsıza yakın olsa da, kritik uygulamalarda ikinci bir algoritma (ör. SHA-512) ile çapraz doğrulama yapılır." },
      { wrong: "Hash'i dosya adıyla birlikte saklamayıp sonra yeniden hesaplamak.", why: "Dosya adı, yolu ve zaman damgaları hash'e dahil değildir; özet yalnızca içerik baytlarını kapsar." },
    ],
    quiz: [
      { q: "SHA-256 çıktısının uzunluğu nedir?", options: ["128 bit / 32 hex", "160 bit / 40 hex", "256 bit / 64 hex", "512 bit / 128 hex"], answer: 2, explain: "SHA-256, 256 bitlik özet üretir; bu 64 onaltılık karakter olarak yazılır. 160 bit / 40 hex SHA-1'in, 128 bit / 32 hex MD5'in çıktısıdır." },
      { q: "Girdideki tek bir bit değiştirildiğinde SHA-256 çıktısında ne olur?", options: ["Çıktının yalnızca ilk biti değişir", "Çıktının yaklaşık yarısı değişir (avalanche effect)", "Çıktı hiç değişmez", "Çıktı iki katına çıkar"], answer: 1, explain: "Çığ etkisi (avalanche effect), tek bitlik girdi değişikliğinin çıktıda geniş ve öngörülmez değişim yaratmasıdır. 'Yalnızca ilk bit değişir' ifadesi lineer bir yapıya aittir; iyi özet algoritmaları lineer değildir." },
      { q: "MD5 adli bütünlük doğrulamasında neden tercih edilmez?", options: ["Çok yavaş olduğu için", "Pratik çakışma (collision) üretiminin mümkün hâle geldiği için", "Türkçe karakter desteklemediği için", "512 bitlik çıktı verdiği için"], answer: 1, explain: "MD5'e yönelik pratik çakışma üretim yöntemleri (2008 sonrası) ve ardından gelen ön-eylem (chosen-prefix) saldırıları, farklı içeriklerin aynı özeti üretebilmesini mümkün kılmıştır. Bu nedenle bütünlük iddiası için güvenilir değildir; yavaşlık veya karakter seti ile ilgisi yoktur." },
      { q: "Bir dosyanın SHA-256 değerinden dosyanın içeriği geri elde edilebilir mi?", options: ["Evet, tersine çevrilebilir", "Evet, kısmen geri alınabilir", "Hayır, özet işlevi tek yönlüdür", "Yalnızca PDF dosyalarında mümkündür"], answer: 2, explain: "Hash işlevi geridönüştürülemezdir; 256 bitlik özet, girdideki milyonlarca baytın yerine geçemez. Bu, şifrelemenin değil özetlemenin tanımıdır." },
    ],
    readings: [
      { title: "FIPS PUB 180-4 — Secure Hash Standard (SHS)", note: "SHA-2 ailesinin resmi tanımı." },
      { title: "NIST SP 800-131A Rev. 2", note: "Kriptografik algoritmaların kullanımına ilişkin güncel yönlendirme." },
      { title: "SHAttered — Stevens et al., 2017", note: "SHA-1 için pratik çakışma kanıtı." },
    ],
  },
  {
    id: "L1-05",
    level: "beginner",
    order: 5,
    title: "Dosya Sistemlerinin Temelleri",
    titleEn: "File System Fundamentals",
    summary:
      "NTFS, FAT32 ve exFAT karşılaştırması; bölümleme, cluster yapısı ve dosya kaydının diske nasıl yansıdığı.",
    minutes: 24,
    labModule: "C",
    objectives: [
      "NTFS, FAT32 ve exFAT'in yapısal farklarını tablo hâlinde karşılaştırabilmek.",
      "Cluster boyutunun kayıp alan (slack space) üzerindeki etkisini açıklayabilmek.",
      "Bir dosyanın klasör girdisi, MFT kaydı ve cluster zinciri olarak nerede tutulduğunu gösterebilmek.",
    ],
    definition:
      "Dosya sistemi (File System), depolama alanının bloklara ayrılmasını, dosya adlarının ve konumlarının, izinlerin ve zaman damgalarının organize edilmesini sağlayan yapıdır.",
    principle: [
      "NTFS: Ağaç yapılı kök ($), BOM (Boot Sector), MFT, MFT yedek kopyası, günlük ($LogFile), USN Journal, bit haritası ($Bitmap) ve $Secure gibi yapıları içerir.",
      "FAT32: Basit 32-bit giriş tablosu; 4 GB tek dosya sınırı, uzun dosya adı desteği sınırlı, journaling yoktur.",
      "exFAT: Flaş bellekler için tasarlanmış; büyük dosya ve bölümler desteklenir, NTFS kadar zengin metadata ve journaling sunmaz.",
      "Cluster (blok) boyutu: Dosyanın kapladığı alanın en küçük birimidir. Örn. 4 KB cluster'da 100 baytlık dosya 4096 bayt kaplar; kalan 3996 bayt 'slack space'tir ve önceki dosyanın artıkları içerebilir.",
    ],
    why: [
      "Delilin nerede yaşadığını bilmeden arama yapmak, kayıtları gözden kaçırmaya yol açar.",
      "Farklı dosya sistemleri farklı zaman damgası setleri ve farklı silme davranışları sunar.",
      "Geri dönüşüm ve kurtarma olasılığı doğrudan dosya sistemine bağlıdır.",
    ],
    how: [
      "1. Bölümün dosya sistemini belirle (boot sector / VBR okuması).",
      "2. Yapıyı çöz: kök MFT kayıtları, dizin ağacı, bit haritası.",
      "3. Dosya kayıtlarını (MFT entry) ve cluster haritasını çıkar.",
      "4. Silinmiş işaretli kayıtları ve serbest cluster'ları ayrı değerlendir.",
    ],
    tools: [
      { name: "Autopsy", desc: "Dosya sistemi çözümleme ve zaman çizelgesi arayüzü." },
      { name: "fls / istat (The Sleuth Kit)", desc: "Dosya listeleme ve inode/entry detayları." },
      { name: "mnt / testdisk", desc: "Bölüm tespiti ve yapı onarımı (adli kopya üzerinde)." },
    ],
    realWorld: [
      "USB bellek ve disk imajı incelemeleri.",
      "Bölüm silinmiş sistemlerde kayıp bölüm tespiti.",
    ],
    example: {
      caption: "Dosya sistemleri karşılaştırması",
      code: `Özellik        NTFS            FAT32           exFAT
------------   -------------   -------------   -------------
Journaling     Evet ($LogFile) Hayır           Hayır
Max dosya      16 EB           4 GB            16 EB
Metadata       Zengin (ACL)    Minimal         Orta
Silme davran.  MFT işaret+USN  Dizin girdisi   Dizin girdisi
Bellek görüntü. $MFT tek dosya BPB + FAT        boot sector + FAT
Adli değer      Yüksek          Orta            Orta`,
    },
    diagram: {
      title: "NTFS diskinin katmanları",
      nodes: [
        { label: "Boot Sector", sub: "Bölüm tanımı" },
        { label: "$MFT", sub: "Dosya kayıtları" },
        { label: "$LogFile", sub: "İşlem günlüğü" },
        { label: "$Bitmap", sub: "Cluster haritası" },
        { label: "Data", sub: "İçerik cluster'ları" },
      ],
      note: "$MFT kaydı sabit boyutludur (varsayılan 1024 bayt); bu, kayıt içindeki alanların yerinin öngörülebilir olmasını sağlar.",
    },
    mistakes: [
      { wrong: "Cluster slack'i 'boş alan' sanmak.", why: "Önceki dosyanın artıkları kalabilir; bu alandan içerik elde etmek adli değer taşır." },
      { wrong: "FAT32'de NTFS'e özgü yapılar aramak.", why: "FAT32'de MFT, USN Journal ve $LogFile yoktur; arama sonuçsuz kalır ve yanlış 'iz yok' sonucu üretilir." },
      { wrong: "İmajı açıp doğrudan çalışmak.", why: "İmaj dosyası da bir dosyadır; analiz kopya üzerinde yapılmalı, özet karşılaştırması korunmalıdır." },
    ],
    quiz: [
      { q: "NTFS'te dosya kayıtlarını tutan yapı hangisidir?", options: ["$Bitmap", "$MFT", "$LogFile", "VBR"], answer: 1, explain: "$MFT (Master File Table) her dosya ve klasör için sabit boyutlu kayıt tutar. $Bitmap cluster'ların kullanılıp kullanılmadığını, $LogFile işlem günlüğünü, VBR ise bölümün ilk sektörünü belirtir." },
      { q: "4 KB cluster'lı bir sistemde 100 baytlık dosyanın oluşturduğu slack nedir?", options: ["0 bayt", "100 bayt", "3996 bayt", "4096 bayt"], answer: 2, explain: "Dosya en az bir cluster kaplar: 4096 bayt. Kullanılan 100 bayt çıkarıldığında 3996 bayt kullanılmayan alan kalır (cluster slack). Bu alan daha önce kullanılan verinin artıklarını içerebilir." },
    ],
    readings: [
      { title: "Microsoft Docs — NTFS Architecture Overview", note: "NTFS yapı taşları." },
      { title: "The Sleuth Kit Man Pages (fls, istat)", note: "Komut tabanlı dosya sistemi çözümleme." },
    ],
  },
  {
    id: "L1-06",
    level: "beginner",
    order: 6,
    title: "Metadata ve Zaman Damgaları",
    titleEn: "Metadata & Timestamps",
    summary:
      "MACB zaman damgaları, FILETIME çözünürlüğü, UTC/yerel saat farkı ve zaman damgası manipülasyonunun sınırları.",
    minutes: 24,
    labModule: "C",
    objectives: [
      "MACB (Modified, Accessed, Changed, Birth) dört damgasını ayrı ayrı açıklayabilmek.",
      "FILETIME'ın 100 nanosaniyelik çözünürlüğünü ve epoch'unu bilmek.",
      "UTC ile yerel saatin neden birlikte raporlanması gerektiğini açıklayabilmek.",
      "Saat dilimi olmadan paylaşılan bir zaman çizelgesinin neden yanıltıcı olduğunu gösterebilmek.",
    ],
    definition:
      "Metadata, dosyanın kendisi hakkında tutulan yapısal üst veridir: ad, uzantı, boyut, sahiplik, izinler ve MACB zaman damgaları. Zaman damgası (timestamp) ise bir olayın gerçekleştiği anı işaretleyen sayısal değerdir.",
    principle: [
      "Windows dosya sistemi zaman damgaları FILETIME biçiminde saklanır: 1601-01-01'den beri geçen 100 nanosaniyelik aralıklar (64 bit).",
      "M = Modified: Dosya içeriğinin en son değiştirilme anı.",
      "A = Accessed: En son okunma/erişim anı (dontime / atime güncelleme politikasına göre değişebilir).",
      "C = Changed ($MFT entry değişikliği): MFT kaydındaki herhangi bir alanın (izin, ad, boyut) değişme anı.",
      "B = Birth (Created): Dosyanın oluşturulma anı. Silinmiş dosyalarda MFT kaydı serbest kalsa da alanlar kalabilir.",
    ],
    why: [
      "Sıralama, olay örgüsünün temelidir: erişim → kopyalama → silme zincirinin kurulabilmesi için.",
      "Farklı kaynaklar farklı saat diliminde kayıt tutabilir; UTC'ye çevrilmeyen veriler yanlış sıralama üretir.",
      "Manipülasyon tespiti, gerçek zaman ile bilinen sistem saatini karşılaştırmaya dayanır (ör. Prefetch ile $MFT).",
    ],
    how: [
      "1. Ham değeri kaydet (yerel + UTC + ofset).",
      "2. Kaynağın saat dilimini doğrula ( TimeZoneInformation Registry anahtarı, event UTC alanları).",
      "3. Tüm kayıtları UTC'ye çevir ve tek eksende sırala.",
      "4. Çelişkili damgaları gizleme; 'çelişkili' olarak işaretle ve açıklamasını yaz.",
    ],
    tools: [
      { name: "MFTECmd", desc: "MFT kayıtlarını CSV'ye dönüştürme (Eric Zimmerman)." },
      { name: "Timeline Explorer", desc: "Büyük zaman çizelgesi dosyalarını filtreleme." },
      { name: "TZChanger / Registry: CurrentControlSet\\Control\\TimeZoneInformation", desc: "Sistem saat dilimi tespiti." },
    ],
    realWorld: [
      "Olay sırasının kurulması (sequence of events).",
      "Yedek geri yükleme sonrası zaman sapmalarının tespiti.",
    ],
    example: {
      caption: "FILETIME → UTC dönüşümü",
      code: `Ham FILETIME : 0x01DC8A1F3B4E2000
Epoch        : 1601-01-01T00:00:00Z
Çözünürlük   : 100 ns
UTC          : 2026-02-06 05:31:05.0000000Z
Yerel (TRT)  : 2026-02-06 08:31:05 (UTC+03:00)

KAYIT: Yerel saat raporda her zaman ofset ile birlikte yazılır.
Eşit (7) biçim: "2026-02-06T08:31:05+03:00"`,
    },
    diagram: {
      title: "MACB ve neyi gösterdiği",
      nodes: [
        { label: "Modified", sub: "İçerik değişti" },
        { label: "Accessed", sub: "Okundu/açıldı" },
        { label: "Changed", sub: "MFT kaydı değişti" },
        { label: "Birth", sub: "Oluşturuldu" },
      ],
      note: "Windows NTFS'te 'A' damgası genellikle 'M/C' ile eşlenir ve tek başına güvenilmezdir; M damgası daha güçlüdür.",
    },
    mistakes: [
      { wrong: "Yerel saati UTC sanmak.", why: "3 saatlik kayma, olay sıralamasını baştan sona bozar ve 'önce silme sonra erişim' gibi yanlış kurgular üretir." },
      { wrong: "Tüm kaynaklarda aynı ofseti varsaymak.", why: "Farklı cihazlar farklı saat diliminde kaydedebilir; ofset kaynak bazında saklanmalıdır." },
      { wrong: "Saat damgası değişince dosyanın içeriğinin de değiştiğini düşünmek.", why: "Damga yalnızca kayıttır; içerik değişikliği ayrı bir teknik incelemeyle (hash, içerik analizi) doğrulanır." },
    ],
    quiz: [
      { q: "MACB içinde 'Changed' damgası neyi gösterir?", options: ["Dosyanın içeriğinin değiştiğini", "MFT kaydındaki bir alanın (izin, ad, boyut vb.) değiştiğini", "Dosyanın silindiğini", "Dosyanın kopyalandığını"], answer: 1, explain: "'Changed', MFT kaydının kendisinin güncellendiğini gösterir; içerik değil. İçerik değişikliği 'Modified' damgasını etkiler. İzin değişikliği Modified'ı oynatmadan yalnızca Changed'ı güncelleyebilir." },
      { q: "UTC'ye çevrilmemiş kaynaklardan oluşan zaman çizelgesinde ne olur?", options: ["Sıralama yine doğrudur", "Saat dilimi farkı kadar kayma oluşur ve olay sıralaması bozulabilir", "Kayıtlar otomatik düzeltilir", "Dosyalar silinir"], answer: 1, explain: "Kaynaklar farklı ofsetlerde kayıt tutuyorsa ham değerler doğrudan karşılaştırılamaz. 3 saatlik bir kayma, ardışık olayları ters sıraya sokabilir; bu nedenle tüm kayıtlar UTC'ye çevrilip ofset birlikte saklanır." },
      { q: "FILETIME'ın çözünürlüğü nedir?", options: ["1 saniye", "1 milisaniye", "100 nanosaniye", "1 mikrosaniye"], answer: 2, explain: "Windows FILETIME, 1601-01-01'den bu yana geçen 100 nanosaniyelik aralık sayısını tutan 64 bitlik bir değerdir." },
    ],
    readings: [
      { title: "Microsoft Docs — FILETIME structure", note: "Zaman damgası biçimi ve epoch." },
      { title: "SANS FOR508 — Windows Forensic Analysis (timelining)", note: "Çoklu kaynak zaman çizelgesi metodolojisi." },
    ],
  },

  /* ====================== LEVEL 2 — INTERMEDIATE ======================== */
  {
    id: "L2-01",
    level: "intermediate",
    order: 7,
    title: "Adli İmaj Alma ve Yazma Engelleyici",
    titleEn: "Forensic Imaging & Write Blocking",
    summary:
      "Fiziksel/mantıksal edinim farkı, bit-by-bit kopya, E01 ve RAW/DD formatları, bütünlük hash'inin edinim anında alınması.",
    minutes: 26,
    labModule: "A",
    objectives: [
      "Fiziksel (physical) ve mantıksal (logical) edinimin farkını örneklerle açıklayabilmek.",
      "E01 ile RAW/DD formatlarının avantaj ve dezavantajlarını karşılaştırabilmek.",
      "Yazma engelleyicinin (write blocker) neyi garanti ettiğini ve etmediiğini ayrıştırabilmek.",
      "Edinim simülasyonunu doğru sırayla yürütebilmek.",
    ],
    definition:
      "Adli imaj alma (Forensic Imaging), kaynak medyanın tüm sektörlerinin (kullanılan ya da kullanılmayan) birebir kopyasının alınması işlemidir. Fiziksel edinim tüm diski, mantıksal edinim ise tek bir mantıksal birimi (bölüm, dosya, uygulama verisi) kapsar.",
    principle: [
      "Bit-by-bit kopya: Hedef, kaynakla sektör sektör birebir aynıdır; kullanılmamış alanlar da (unallocated) dahil edilir.",
      "Yazma engelleyici: Kaynağa giden tüm yazma komutlarını engeller. Donanım (Tableau, WiebeTech) veya yazılım tabanlı olabilir.",
      "E01 (EnCase Evidence File): Sektörleri sıkıştırır, her parça için MD5/SHA özetleri ve hata düzeltme (ECC) içerir; başlık alanı metadata taşır.",
      "RAW/DD: Ham sektör akışı. Yapısal olmayan, hızlı, taşınabilir; özet ve yedekleme alanı içermez.",
      "Hash, edinim anında hesaplanır ve imaj dosyasının tamamı için ayrıca tekrarlanır.",
    ],
    why: [
      "Kullanılmamış alanlar silinmiş içerik barındırabilir; yalnızca mantıksal kopya bu alanı kaçırır.",
      "E01'in gömülü özetleri, imaj üzerinde yapılan her okuma ile doğrulanabilir.",
      "Yazma engelleyici kullanılmadan yapılan edinim, 'delil üzerinde işlem yapıldığı' itirazını doğurur.",
    ],
    how: [
      "1. Kaynağı tanımla, serisini ve boyutunu custody kaydına yaz.",
      "2. Yazma engelleyici üzerinden kaynak ve hedefi bağla.",
      "3. İmaj formatını seç (E01 önerilir: gömülü özet + ECC).",
      "4. İmajı al; işlem sırasında kaynak hata sayısını izle.",
      "5. Kaynak ve hedef için SHA-256 hesapla, ikisinin eşleştiğini doğrula.",
      "6. Kayıtları custody'e 'acquired' geçişi olarak işle.",
    ],
    tools: [
      { name: "FTK Imager", desc: "E01/RAW imaj alma, hash doğrulama, içerik önizleme." },
      { name: "Guymager", desc: "Linux açık kaynak imaj alma; E01 ve AFF destekler." },
      { name: "dc3dd / dcfldd", desc: "Doğrudan blok kopya ve gömülü hash çıkarma." },
      { name: "Tableau Forensic Bridge", desc: "Donanım yazma engelleyici." },
    ],
    realWorld: [
      "Olay yerinde disk çıkarma ve laboratuvar imajlaması.",
      "Bulut/uzak sunucu görüntüleri (sanal disk VMDK/VHD).",
      "Mantıksal edinim: uygulama veritabanı, e-posta kutusu.",
    ],
    example: {
      caption: "Edinim simülasyonu çıktısı (bu platformdaki Modül A)",
      code: `[1/6] Kaynak seçildi : EV-001 / WD-WCC6Y4KLN2TP / 500.107.862.016 bayt
[2/6] Yazma engelleyici bağlandı : HID-RO / salt-okunur
[3/6] Format seçildi : E01 (sıkıştırma 6, ECC açık)
[4/6] İmaj alınıyor  : 128/128 blok ... tamamlandı
[5/6] SHA-256 (kaynak)  = 7d1f0d1e9b2a6f0c...
[6/6] SHA-256 (hedef)   = 7d1f0d1e9b2a6f0c...
      SONUÇ: EŞLEŞME SAĞLANDI -> status: acquired -> hash_verified`,
    },
    diagram: {
      title: "Edinim veri yolu",
      nodes: [
        { label: "Kaynak Medya", sub: "salt-okunur" },
        { label: "Write Blocker", sub: "yazma reddi" },
        { label: "İmaj Motoru", sub: "sektör okuma" },
        { label: "E01 Dosyası", sub: "sıkıştırma + ECC" },
        { label: "SHA-256", sub: "çift özet" },
      ],
      note: "Kök anahtarı: yazma engelleyici, kaynağı korumak içindir — imajın doğruluğunu değil, kaynağın değişmezliğini garanti eder.",
    },
    mistakes: [
      { wrong: "Yalnızca dosyaları kopyalayıp 'imaj aldım' demek.", why: "Bu mantıksal edinimdir; silinmiş kayıtlar, slack ve unallocated alan dışarıda kalır. Metodoloji adında belirtilmelidir." },
      { wrong: "Hash'i hemen değil, transfer sonrası hesaplamak.", why: "Transfer sırasında bozulma tespit edilemez; en azından iki tarafın özeti karşılaştırılmalıdır." },
      { wrong: "Yazma engelleyicinin her şeyi engellediğini varsaymak.", why: "Bazı protokoller (ör. bazı SCSI komutları) veya sürücü hataları nedeniyle istisnalar olabilir; cihazın doğrulaması periyodik yapılmalıdır." },
    ],
    quiz: [
      { q: "Hangisi fiziksel edinimin temel özelliğidir?", options: ["Yalnızca dosyaları kopyalar", "Tüm sektörleri (unallocated dahil) kopyalar", "Yalnızca sistem dosyalarını alır", "Sadece Registry'yi dışa aktarır"], answer: 1, explain: "Fiziksel edinim diskteki her sektörü okur; kullanılmamış alan da dahil olduğu için silinmiş içerik için temel oluşturur. Dosya bazlı kopya 'mantıksal edinim'dir." },
      { q: "E01 formatının RAW/DD'ye karşı avantajı nedir?", options: ["Daha büyük dosya üretir", "Gömülü özet, sıkıştırma ve hata düzeltme alanı içerir", "Yazma engelleyici gerektirir", "Sektörleri değiştirir"], answer: 1, explain: "E01, her bölüm için özet bilgisi, ECC ve sıkıştırma taşır; bütünlük doğrulaması dosyanın kendisinden yapılır. RAW ham akıştır, ek yapı sunmaz." },
      { q: "İmaj alma sırasında kaynak ile hedef SHA-256 değerleri farklı çıkarsa ne yapılır?", options: ["Rapora ikisi de yazılır ve devam edilir", "İşlem başarısız sayılır, tekrar edinim yapılır", "Ortalama alınır", "Fark önemsizdir"], answer: 1, explain: "Özet eşleşmiyorsa kopya bütünlüğü sağlanamamıştır; delil edinilmiş sayılmaz. İşlem 'integrity issue' olarak işaretlenir ve doğrulanmış bir kaynaktan yeniden edinim gerekir." },
    ],
    readings: [
      { title: "NIST SP 800-86 §3.1 — Data collection", note: "Edinim teknikleri ve araç doğrulaması." },
      { title: "EnCase Evidence File Format (E01) specification", note: "Format yapısı ve ECC." },
    ],
  },
  {
    id: "L2-02",
    level: "intermediate",
    order: 8,
    title: "NTFS ve Master File Table",
    titleEn: "NTFS & Master File Table",
    summary:
      "MFT kayıt yapısı, 10-attribute (10/30) adlandırması, $STANDARD_INFORMATION ve $FILE_NAME farkı, serbest kayıtlar.",
    minutes: 30,
    labModule: "C",
    objectives: [
      "MFT kayıt (entry) yapısını ve 1024 bayt sabit boyunu açıklayabilmek.",
      "Öznitelik 0x10 ($STANDARD_INFORMATION) ile 0x30 ($FILE_NAME) arasındaki farkı ve adli önemini gösterebilmek.",
      "Silinmiş bir dosyanın MFT'de nasıl işaretlendiğini (in-use baytının 0 olması) açıklayabilmek.",
      "Resident ve non-resident öznitelik ayrımını yapabilmek.",
    ],
    definition:
      "Master File Table (MFT), NTFS'in merkezi veritabanıdır. Her dosya, klasör ve sistem yapısı ($MFT, $Bitmap, $LogFile…) için sabit boyutlu bir kayıt (varsayılan 1024 bayt) ayırır. Kayıtların tamamı $MFT adlı kendi dosyasında saklanır.",
    principle: [
      "Her MFT kaydı: başlık (magic 'FILE', sequence, link count, attribute ofseti, flags) + öznitelikler + son işaretçi (0xFFFFFFFF) içerir.",
      "0x10 $STANDARD_INFORMATION: Oluşturulma, erişim, MFT değişikliği, içerik değişikliği zamanları + izinler. Kullanıcı tarafından doğrudan değiştirilemez.",
      "0x30 $FILE_NAME: Dosya adı, üst dizin indeksi ve ikinci bir zaman damgası seti. Silinmiş dosyalarda ad çoğunlukla burada kalır.",
      "Resident (içerik MFT içinde) vs non-resident (cluster'larda, $DATA runlist ile). Küçük dosyalar resident'tır.",
      "Silinmiş kayıtlarda 0x16 baytındaki 'in use' biti 0'a çekilir; kayıt 'serbest' (free) hâle gelir ve yeniden kullanılabilir.",
    ],
    why: [
      "MFT, silinmiş dosya adlarının ve eski yollarının en güvenilir kaynaklarından biridir.",
      "$FILE_NAME zaman damgaları, kullanıcı araçlarıyla değiştirilemeyen ikinci bir referans sunar.",
      "MFT'de kalmış ancak içeriği overwrite edilmiş dosyalar için 'kurtarılamaz' sonucu ancak böyle çıkarılır.",
    ],
    how: [
      "1. $MFT'yi imaj üzerinde ayır (imajın ilk girdisi genellikle $MFT'dir).",
      "2. Kayıtları MFTECmd / analyzeMFT ile CSV'ye çıkar.",
      "3. Silinmiş işaretli (in-use = 0) kayıtları filtrele.",
      "4. Her kayıt için önceki/sonraki sequence numarasını karşılaştır (yeniden kullanım tespiti).",
      "5. 0x30 kaydındaki eski yolu ve 0x10'daki damgaları eşleştir.",
    ],
    tools: [
      { name: "MFTECmd", desc: "MFT dışa aktarımı ve $I dosyaları çözümleme." },
      { name: "analyzeMFT.py", desc: "Python tabanlı MFT ayrıştırıcı." },
      { name: "NTFS Log Tracker", desc: "$LogFile + $UsnJrnl birlikte çözümleme." },
    ],
    realWorld: [
      "Silinmiş belgelerin adlarının ve yollarının geri kazanılması.",
      "Dosya taşıma/silme olaylarının sıralanması.",
    ],
    example: {
      caption: "Bir MFT kaydının özet çıktısı",
      code: `Record #:     48213
Signature:    FILE           In-Use: No  (serbest / silinmiş)
Sequence #:   3               Link Count: 0
Attribute 0x10 $STANDARD_INFORMATION
   Created:          2025-09-11 16:44:00.123 (UTC)
   File Modified:    2026-02-06 05:35:12.881 (UTC)
   MFT Modified:     2026-02-06 05:35:12.902 (UTC)
Attribute 0x30 $FILE_NAME
   Name:  Eski_Ortak_Sozlesme.pdf
   Parent: 0x0000000000032F1A  (C:\\FIN)
   Created: 2025-09-11 16:44:00 (yerel)
Attribute 0x80 $DATA  [non-resident]
   Runlist: VCN 0x0 → LCN 0x3A12, len 44 cluster`,
    },
    diagram: {
      title: "MFT kaydının katmanları",
      nodes: [
        { label: "Başlık", sub: "FILE / flags" },
        { label: "$SI 0x10", sub: "MACB + izin" },
        { label: "$FN 0x30", sub: "Ad + üst dizin" },
        { label: "$DATA 0x80", sub: "İçerik" },
        { label: "$BITMAP", sub: "Cluster" },
      ],
      note: "Dosya adı kaybolmuş olsa bile 0x10 kaydı kalabilir; tersi de mümkündür. Bu nedenle iki kayıp birlikte okunur.",
    },
    mistakes: [
      { wrong: "İçerik kurtarılabilirse dosyanın kesin kurtarılacağını varsaymak.", why: "Runlist'teki cluster'lar başka dosya tarafından overwrite edilmiş olabilir. Kurtarma 'kosullu'dur ve hash doğrulaması gerekir." },
      { wrong: "0x10 ile 0x30 zaman damgalarını aynı sanmak.", why: "İkisi farklıdır; 0x30'daki ad değiştirildiğinde iki set ayrışır. Bu ayrışma kendisi bir bulgu olabilir." },
      { wrong: "MFT kaydını imaj dışında açmak.", why: "Kayıt diske bit düzeyinde bağlıdır; ayrı ayrı okunmalı, analiz kopyası üzerinde yapılmalıdır." },
    ],
    quiz: [
      { q: "MFT özniteliği 0x30 ($FILE_NAME) neyi içerir?", options: ["Dosyanın izin listesini", "Dosya adını ve ikinci bir zaman damgası setini", "Dosyanın içeriğini", "Disk hata düzeltme bilgisini"], answer: 1, explain: "0x30 kaydı dosya adını, üst dizin indeksini ve bu ada ait ayrıca zaman damgalarını tutar. İçerik 0x80 ($DATA), izinler 0x10 ($SECURITY_DESCRIPTOR) özniteliklerinde bulunur." },
      { q: "Bir MFT kaydında 'In-Use' biti 0 ise ne anlama gelir?", options: ["Dosya salt okunurdur", "Kayıt serbesttir, dosya silinmiş veya kaldırılmış olabilir", "Dosya şifrelenmiştir", "Dosya ağ paylaşımdadır"], answer: 1, explain: "In-use biti kaydın aktif olduğunu gösterir; 0 ise kayıt serbesttir. Bu, silinmiş dosya göstergesidir — ancak içeriğin hâlâ okunabilir olduğu garanti edilmez." },
    ],
    readings: [
      { title: "Microsoft Docs — NTFS Master File Table", note: "Kayıt ve öznitelik yapısı." },
      { title: "MS-FSA — NTFS Protocol Specification", note: "Düşük seviyeli NTFS davranışı." },
    ],
  },
  {
    id: "L2-03",
    level: "intermediate",
    order: 9,
    title: "Windows Olay Günlüğü Analizi",
    titleEn: "Windows Event Log Analysis",
    summary:
      "Security/System/Application günlükleri, önemli Event ID'ler, oturum açma türleri, günlük temizliği ve korelasyon.",
    minutes: 30,
    labModule: "F",
    objectives: [
      "4624, 4625, 4634, 4648, 4688, 1102, 4663 Event ID'lerinin neyi kanıtlayabildiğini ve kanıtlayamadığını ayırt edebilmek.",
      "Logon Type numaralarını (2, 3, 5, 10) yorumlayabilmek.",
      "Ardışık başarısız denemelerin istatistiksel olarak değerlendirilmesini açıklayabilmek.",
      "1102 kaydının neyi gösterip neyi göstermediğini doğru ifade edebilmek.",
    ],
    definition:
      "Windows Event Log, sistem, uygulama ve güvenlik olaylarını XML tabanlı EVTX biçiminde saklayan yapıdır. Her kayıt, sağlayıcı (provider), olay kimliği (Event ID), düzey, bilgisayar, kaynak kullanıcı ve ayrıntı alanlarını taşır.",
    principle: [
      "Security günlüğü denetim ilkeleri (Audit Policy) ile etkinleştirilir; kapalı olan alt sistemlerden kayıt üretilmez.",
      "4624 + Logon Type, oturum türünü belirtir: 2 etkileşimli, 3 ağ, 4 hizmet/planlı iş, 5 sistem, 10 uzak masaüstü.",
      "4625, hata koduyla başarısız denemeyi kaydeder (0xC000006A yanlış parola, 0xC0000064 kullanıcı yok, 0xC0000234 hesap kilitli).",
      "1102, günlüğün temizlendiğini kaydeder; silinen kayıtların kendisini göstermez, ancak temizleme anından itibaren boşluk tespit edilebilir.",
      "4688 işlem oluşturulmasını kaydeder; komut satırı denetimi (command-line auditing) etkin değilse argümanlar görünmez.",
    ],
    why: [
      "Oturum ve işlem kayıtları, 'kim, ne zaman, hangi hesapla' sorusuna en doğrudan cevaptır.",
      "Korelasyon olmadan tek bir Event ID yorumlanamaz; örn. 4624, ardından gelen 4688 ile anlam kazanır.",
      "Günlük temizliği, incelemenin kapsamını sınırlayan bir sınırlılık (limitation) olarak raporda belirtilmelidir.",
    ],
    how: [
      "1. Gereken denetim ilkelerinin etkin olup olmadığını kontrol et.",
      "2. Tarih aralığı ve bilgisayar filtresiyle kayıtları daralt.",
      "3. Event ID bazında sayım ve ardışık analiz yap.",
      "4. Kaynak IP, kullanıcı ve oturum türünü birlikte oku.",
      "5. İlgili System/Application kayıtlarıyla çapraz doğrula.",
    ],
    tools: [
      { name: "Windows Event Viewer", desc: "Yerel görüntüleme ve filtreleme." },
      { name: "Get-WinEvent / wevtutil", desc: "Komut satırı sorgulama ve dışa aktarma." },
      { name: "Hayabusa / EvtxECmd", desc: "Toplu EVTX ayrıştırma ve Normalizasyon." },
      { name: "Sigma", desc: "Kural tabanlı anormallik tespiti." },
    ],
    realWorld: [
      "Kötü niyetli oturum tespiti ve lateral movement analizi.",
      "Denetim politikası denetimleri (nerede log tutulmadığı).",
    ],
    example: {
      caption: "Event Viewer filtre ifadesi — başarısız oturum denemeleri",
      code: `*[System[EventID=4625] and
  System[TimeCreated[timediff(@SystemTime) <= 259200000]]]

Sonuç (sentetik SRV-DC02):
  4625  2026-02-14 02:11:52+03  user=admin  ip=203.0.113.87  1/8
  4625  2026-02-14 02:12:31+03  user=admin  ip=203.0.113.87  2/8
  4625  2026-02-14 02:13:44+03  user=admin  ip=203.0.113.87  3/8
  1102  2026-02-14 03:04:12+03  Günlük temizlendi (Kritik)

DEĞERLENDİRME: Aynı IP + 112 sn içinde 3 deneme = destekleyici bulgu.
Tek başına "brute-force" demek için eşik ve süre penceresi tanımlanmalıdır.`,
    },
    diagram: {
      title: "Oturum yaşam döngüsü kayıtları",
      nodes: [
        { label: "4648 / 4624", sub: "Oturum açma" },
        { label: "4688", sub: "İşlem oluşturma" },
        { label: "4663", sub: "Nesneye erişim" },
        { label: "4634", sub: "Oturum kapatma" },
        { label: "1102", sub: "Günlük temizliği" },
      ],
      note: "1102 mevcutsa, ondan önceki kayıtlar bu günlükte yoktur; boşluk bir bulgu değil, bir sınırlılıktır.",
    },
    mistakes: [
      { wrong: "4625 varlığını 'saldırı' olarak raporlamak.", why: "Yanlış parola girilmiş meşru kullanıcı da 4625 üretir. Yoğunluk, süre ve kaynak IP analizi gerekir." },
      { wrong: "1102'yi 'deliller imha edildi' diye kesinleştirmek.", why: "Günlük temizliği yetkili bir bakım işlemi de olabilir. Bu bir 'doğrudan gözlem'dir; arkasındaki niyet doğrulanmamış iddiadır." },
      { wrong: "Komut satırı denetimi kapalıyken argüman yokluğunu 'çalıştırılmadı' saymak.", why: "Kayıt mevcut değilse kapsam dışıdır; 'kanıt yokluğu, kanıtın yokluğu' durumudur." },
    ],
    quiz: [
      { q: "Event ID 4624 ve Logon Type 10 neyi gösterir?", options: ["Hizmet hesabı oturumu", "Uzak masaüstü yoluyla başarılı oturum", "Ağ paylaşıma erişim", "Başarısız deneme"], answer: 1, explain: "Logon Type 10, RemoteInteractive (RDP) oturumudur. Type 3 ağ erişimi, Type 5 sistem/hizmet oturumudur. 4624 başarılı açmayı, 4625 başarısız denemeyi gösterir." },
      { q: "Günlükte yalnızca 3 dakikalık boşluk varsa ve 1102 kaydı mevcutsa ne denir?", options: ["Kayıtlar doğal olarak silinmiştir", "Günlük temizlenmiş; önceki kayıtlar bu kaynakta mevcut değildir", "Sistem yeniden başlatılmıştır", "Saat dilimi değişmiştir"], answer: 1, explain: "1102, denetim günlüğünün temizlendiğini doğrudan kaydeder. Bu durumda önceki dönem için bu kaynak kullanılamaz; alternatif kaynak (SIEM, yedek günlük) aranmalı ve raporda sınırlılık olarak belirtilmelidir." },
      { q: "4688 kaydında komut satırı bilgisi yoksa bu ne anlama gelir?", options: ["İşlem hiç çalıştırılmamıştır", "Komut satırı denetimi kapalı olabilir; argümanlar kaydedilmemiştir", "İşlem silinmiştir", "Kayıt bozulmuştur"], answer: 1, explain: "Komut satırı denetimi (Include command line in process creation events) etkin değilse argümanlar EVTX'e yazılmaz. Bu bir kapsam sınırıdır; 'işlem çalıştırılmadı' sonucunu desteklemez." },
    ],
    readings: [
      { title: "Microsoft Docs — Security Auditing Overview", note: "Denetim ilkeleri ve olay kaynakları." },
      { title: "Microsoft Docs — Logon Types", note: "Oturum açma türlerinin anlamı." },
    ],
  },
  {
    id: "L2-04",
    level: "intermediate",
    order: 10,
    title: "USB Bağlantı Geçmişi ve Registry",
    titleEn: "USB History & Windows Registry",
    summary:
      "VID/PID, seri numarası, USBSTOR, MountPoints2, Device Configuration Logs ve bağlantı zamanlarının tespiti.",
    minutes: 27,
    labModule: "E",
    objectives: [
      "VID/PID ve seri numarasından cihazı tanımlayabilmek.",
      "USBSTOR, MountedDevices, MountPoints2 ve SetupApi.log kayıtlarını birlikte okuyabilmek.",
      "İlk ve son bağlantı zamanını hangi kaynaktan çıkarabileceğini göstermek.",
      "Bağlantı kaydının dosya kopyalama iddiasını tek başına desteklemediğini ifade edebilmek.",
    ],
    definition:
      "USB cihaz geçmişi, bir sisteme bağlanan USB aygıtlarının Registry, sistem günlükleri ve sürücü kurulum kayıtlarında bıraktığı izler bütünüdür.",
    principle: [
      "VID (Vendor ID) 4 haneli onaltılık üretici kodu, PID (Product ID) ürün kodudur. Kingston = 0951, SanDisk = 0781.",
      "HKLM\\SYSTEM\\CurrentControlSet\\Enum\\USBSTOR — cihaz sınıfı, seri ve üretici bilgisi.",
      "HKCU\\…\\Explorer\\MountPoints2 — cihazın hangi kullanıcı SID'i altında bağlandığını gösterir; silinmez.",
      "HKLM\\SYSTEM\\MountedDevices — \\DosDevices\\X: harfleri ile cihaz seri numarası eşlemesi.",
      "SYSTEM\\CurrentControlSet\\Envmgr\\SetupApi.log ve System PnP olayları (2003/6416) bağlantı anını verir.",
      "Windows 10 1607+ güvenlik güncelleştirmesi sonrası USB device install/reset time alanları da kullanılabilir.",
    ],
    why: [
      "Kurum içi veri çıkarımı iddialarında en sık karşılaşılan delil türüdür.",
      "Bağlantı zamanı, dosya sistemi ve olay günlüğü kayıtlarıyla eşleştirildiğinde güçlü korelasyon üretir.",
      "Cihaz seri numarası, aynı modelin başka bir cihazla karıştırılmasını engeller.",
    ],
    how: [
      "1. USBSTOR Enum anahtarından cihaz listesini çıkar (VID/PID/seri).",
      "2. MountPoints2'den kullanıcı SID'lerini ve ilk bağlanma izini al.",
      "3. SetupApi / PnP olaylarıyla zaman damgalarını doğrula.",
      "4. MountedDevices ile harf eşlemesini çöz.",
      "5. Dosya sistemi ve Event Log ile çapraz kontrol et.",
    ],
    tools: [
      { name: "USB Detective", desc: "USB kayıtlarını bütünleşik görselleştiren ticari araç." },
      { name: "Registry Explorer (Eric Zimmerman)", desc: "Hive çözümleme ve MountPoints2 görünümü." },
      { name: "RegRipper", desc: "Hive'lardan USB plugin'leri ile toplu döküm." },
      { name: "AG CYBER LAB — Modül E", desc: "Sentetik USB cihaz listesi ve bağlantı geçmişi laboratuvarı." },
    ],
    realWorld: [
      "Veri sızıntısı soruşturmaları.",
      "Kurum cihazına yetkisiz bağlanan depolama tespiti.",
      "Oltalama sonrası harici kopyalama analizi.",
    ],
    example: {
      caption: "USB-VID-001 için birleşik kayıt (sentetik)",
      code: `[USBSTOR] disk&ven_kingston&prod_datatraveler_100_g3_g4
         &rev_1.00\\4c530001112019010913&0
   VID_0951  PID_1666  Serial: 08606E215C7B2F113E9A
   Capacity : 64 GB

[MountPoints2] SID S-1-5-21-…-1123 → {a9f3c1d0-…}
   First : 2026-02-06 08:14:24 +03:00
   Last  : 2026-02-06 09:02:55 +03:00

[PnP] Event 2003  @ 2026-02-06 08:14:21 +03:00

SONUÇ (doğrudan gözlem): Cihaz bu sisteme bağlandı.
SONUÇ (destekleyici)   : Aynı pencerede E: birimine yazma izi var.
KANITLANAMAZ           : Hangi dosyanın kopyalandığı (hash gerekir).`,
    },
    diagram: {
      title: "USB iz kaynakları",
      nodes: [
        { label: "USBSTOR", sub: "Seri + VID/PID" },
        { label: "MountPoints2", sub: "Kullanıcı + ilk bağlanma" },
        { label: "MountedDevices", sub: "Harf eşlemesi" },
        { label: "SetupApi / PnP", sub: "Bağlantı anı" },
        { label: "Event Log", sub: "6416 / 2003" },
      ],
      note: "Tek kaynağa dayalı USB tespiti kırılgandır; en az iki bağımsız kayıt eşleştirilmelidir.",
    },
    mistakes: [
      { wrong: "MountPoints2 girdisini silinmeyi sanmak.", why: "Girdi cihaz kaldırıldığında da kalır; silinmesi ancak profil temizliğiyle mümkündür. Kalması 'cihaz bağlandı' izidir." },
      { wrong: "Aynı modelden iki cihazı ayırt etmemek.", why: "VID/PID modeli belirtir, cihazı değil; ayırt edici alan seri numarasıdır." },
      { wrong: "Bağlantı kaydıyla kopyalamayı eşitlemek.", why: "Bağlantı, yazma olasılığını artırır ancak kanıtlamaz; dosya sistemi veya denetim kaydı gerekir." },
    ],
    quiz: [
      { q: "Aynı modelden iki USB'yi ayırt eden alan hangisidir?", options: ["VID", "PID", "Seri numarası", "Sınıf kodu"], answer: 2, explain: "VID üreticiyi, PID modeli/ürünü belirtir; aynı modeldeki tüm cihazlar aynı VID/PID'i paylaşır. Ayırt edici tek alan seri numarasıdır." },
      { q: "MountPoints2 anahtarı neyi gösterir?", options: ["Cihazın içeriğini", "Cihazın hangi kullanıcı SID'i altında bağlandığını", "Cihazın hızını", "Cihazın formatını"], answer: 1, explain: "MountPoints2, HKCU altında her kullanıcı SID'i için bağ noktalarını tutar; cihazın o kullanıcı hesabında tanındığını gösterir. İçerik veya dosya kopyalama bilgisi içermez." },
      { q: "Bağlantı kaydı olan bir cihaz için hangisi kesin söylenebilir?", options: ["Dosyalar kopyalandı", "Cihaz sisteme bağlandı", "Kullanıcı dosyaları sildi", "İnternete yükleme yapıldı"], answer: 1, explain: "Kayıt, cihazın bağlandığını doğrudan gösterir. Kopyalama için hedef birimde dosya oluşumu (MFT/USN) veya 4663 gibi denetim kaydı gerekir." },
    ],
    readings: [
      { title: "Microsoft Docs — USB device installation and removal events", note: "PnP ve denetim olayları." },
      { title: "SANS FOR509 — Corporate Identity and Access Infiltration (USB)", note: "Kurumsal USB analizi." },
    ],
  },
  {
    id: "L2-05",
    level: "intermediate",
    order: 11,
    title: "Tarayıcı Adli Bilişimi ve SQLite",
    titleEn: "Browser Forensics & SQLite",
    summary:
      "History, Downloads, Cookies, Cache, arama sorguları, Chrome zaman damgası epoch'u ve SQLite analiz prensipleri.",
    minutes: 29,
    labModule: "D",
    objectives: [
      "Chrome/Firefox artefakt dosyalarını (History, Places.sqlite, cookies.sqlite) adlandırabilmek.",
      "Chrome mikrosaniye epoch zaman damgasını UNIX zamanına çevirebilmek.",
      "İndirme kaydında 'ateşlenmiş' (fired) ve 'tamamlanmış' durumlarını ayırt edebilmek.",
      "Geçmişte olmayan bir etkinliğin kesin olarak yapılmadığı iddiasının neden geçersiz olduğunu açıklayabilmek.",
    ],
    definition:
      "Tarayıcı adli bilişimi (Browser Forensics), kullanıcı aktivitelerinin tarayıcı profillerinde bıraktığı artefaktların (geçmiş, indirme, çerez, önbellek, arama) incelenmesidir. Çoğu veri SQLite dosyalarında saklanır.",
    principle: [
      "Chrome: %LocalAppData%\\Google\\Chrome\\User Data\\Default\\History (visits + urls), Cookies, Login Data, Current Session.",
      "Firefox: places.sqlite (history + bookmarks), cookies.sqlite, formhistory.sqlite.",
      "Chrome zaman damgası: 1601-01-01 esas alınan mikrosaniye; UNIX'a çevirirken 11644473600 saniye çıkarılır.",
      "Downloads tablosu: target_path, start_time, end_time, received_bytes, total_bytes, state, referrer.",
      "SQLite analizinde WAL/SHM dosyaları ve journal dosyaları göz ardı edilmemelidir; silinmiş satırlar sayfa artıklarında kalabilir.",
      "Cache (HTTP önbelleği) içeriğin yeniden istenmediğini gösterebilir; 'açıldı' yerine 'erişildi' ifadesi daha güvenlidir.",
    ],
    why: [
      "İddia edilen araştırma ve yükleme davranışının zaman damgalı tek kaynağıdır.",
      "Dosya sistemi metadata ile eşleştirildiğinde (indirme ↔ MFT oluşturma) korelasyon güçlenir.",
      "Çerez kayıtları, oturumun o profilde açıldığını destekler.",
    ],
    how: [
      "1. Profili kopyala; yerelden çalıştırma (SQLite kilitlenir ve değişir).",
      "2. History/Downloads tablolarını salt-okunur olarak dışa aktar.",
      "3. Zaman damgalarını UTC'ye çevir ve ofseti yaz.",
      "4. URL ve sorguları sınıflandır (arama, ziyaret, indirme).",
      "5. Dosya sistemi kayıtlarıyla (Downloads klasörü) eşleştir.",
    ],
    tools: [
      { name: "DB Browser for SQLite", desc: "SQLite tablolarını görsel inceleme." },
      { name: "Hindsight / Browser History Exposer", desc: "Tarayıcı profillerinden yapılandırılmış dışa aktarım." },
      { name: "sqlite3 .recover", desc: "Hasarlı veritabanından satır kurtarma." },
    ],
    realWorld: [
      "Sızıntı öncesi araştırma davranışı analizi.",
      "Oltalama ve kimlik avı tıklamalarının tespiti.",
      "İndirilen zararlı yazılım kaynaklarının belirlenmesi.",
    ],
    example: {
      caption: "Downloads tablosu satırı ve zaman damgası dönüşümü",
      code: `SQLite: History
  SELECT target_path, start_time, end_time, total_bytes, state
  FROM downloads ORDER BY start_time;

  target_path : C:\\Users\\s.demir\\Downloads\\musteri_listesi.csv
  start_time  : 13386474739000000  (Chrome epoch, µs)
  UNIX        : 13386474739000000 / 1000000 - 11644473600
              = 2026-02-06 05:52:19 UTC  → 08:52:19 (+03:00)
  state       : 1 (tamamlandı)
  referrer    : http://intranet.agorn.local/raporlar

UYARI: start_time yalnızca indirmenin BAŞLADIĞını gösterir;
end_time ve total_bytes kontrol edilmeden "tamamlandı" denemez.`,
    },
    diagram: {
      title: "Tarayıcı artefakt haritası",
      nodes: [
        { label: "History", sub: "urls + visits" },
        { label: "Downloads", sub: "yol, boyut, durum" },
        { label: "Cookies", sub: "alan + oturum" },
        { label: "Cache", sub: "erişilen içerik" },
        { label: "Sessions", sub: "açık sekmeler" },
      ],
      note: "Silinmiş satırlar sayfa artıklarında kalabilir; 'boş tablo' = 'kayıt yok' demek değildir.",
    },
    mistakes: [
      { wrong: "Geçmişte olmayan site için 'ziyaret edilmedi' demek.", why: "Geçmiş temizlenmiş, profil değiştirilmiş veya başka tarayıcı kullanılmış olabilir. Doğru ifade: 'bu kaynakta kanıt bulunamadı'." },
      { wrong: "start_time'ı indirme tamamlandı diye okumak.", why: "state ve end_time kontrol edilmeden; kesilen indirmeler de start_time üretir." },
      { wrong: "SQLite dosyasını yerinde açmak.", why: "WAL/journal işlenir ve veritabanı değişir; analiz mutlaka kopya üzerinde yapılmalıdır." },
      { wrong: "Chrome epoch'unu UNIX sanmak.", why: "1601 tabanlıdır; doğrudan çevrilirse 1970 öncesine düşen anlamsız tarihler oluşur." },
    ],
    quiz: [
      { q: "Chrome History'deki zaman damgası hangi epoch'u kullanır?", options: ["1970-01-01 UNIX", "1900-01-01", "1601-01-01 (mikrosaniye)", "2001-01-01"], answer: 2, explain: "Chrome, Windows FILETIME türevi olan 1601-01-01 tabanlı mikrosaniye değeri kullanır; UNIX'a çevirmek için bölme ve 11644473600 saniye çıkarma gerekir." },
      { q: "Bir web sitesinin tarayıcı geçmişinde olmaması neyi kanıtlar?", options: ["Siteye kesinlikle girilmediğini", "Bu tarayıcı profilinde bu kaydın bulunmadığını", "Siteye virüs bulaştığını", "Kullanıcının internete çıkmadığını"], answer: 1, explain: "Kayıt yokluğu, o kaynak için kanıt yokluğudur; diğer tarayıcılar, profil temizliği veya farklı cihaz dışarıda bırakılamaz. Bu nedenle kesin 'girilmedi' iddiası kurulamaz." },
      { q: "SQLite incelemesinde WAL dosyası neden önemlidir?", options: ["Yalnızca yedek olduğu için", "Son işlemlerin ve silinmiş satırların bir kısmını barındırabildiği için", "Şifreli olduğu için", "Sıkıştırma yaptığı için"], answer: 1, explain: "Write-Ahead Log, commit edilmiş ancak ana veritabanı dosyasına henüz işlenmemiş veriyi içerir; ayrıca sayfa artıklarında silinmiş satırlar bulunabilir. Göz ardı edilirse eksik analiz yapılır." },
    ],
    readings: [
      { title: "Chromium Docs — History Database schema", note: "urls, visits, downloads tabloları." },
      { title: "SANS FOR585 — Browser Forensics", note: "Tarayıcı artefakt metodolojisi." },
    ],
  },
  {
    id: "L2-06",
    level: "intermediate",
    order: 12,
    title: "Silinmiş Dosya İncelemesi ve Veri Kurtarma",
    titleEn: "Deleted File Recovery & Data Carving",
    summary:
      "MFT serbest kayıtları, Recycle Bin $I/$R çiftleri, USN Journal, unallocated alan ve kurtarma olasılığının sınırları.",
    minutes: 28,
    labModule: "C",
    objectives: [
      "Recycle Bin $I dosyasından orijinal yol ve silinme zamanını okuyabilmek.",
      "Bir dosyanın kurtarılabilirlik derecesini (kesin/kosullu/yok) kriterleriyle belirleyebilmek.",
      "Overwrite sonrası kurtarılamazlığın teknik nedenini açıklayabilmek.",
      "Kurtarılan içeriğin bütünlüğünün nasıl doğrulanacağını göstermek.",
    ],
    definition:
      "Silinmiş dosya incelemesi, dosya sistemi kayıtları ve serbest alan üzerinden silinmiş içeriğin ve izlerinin geri kazanılmasıdır. Veri oyma (data carving), dosya sistemi kaydı olmadan dosya imzalarına dayanarak içerik çıkarma yöntemidir.",
    principle: [
      "NTFS'te silme genellikle içeriği anında silmez: MFT kaydının in-use biti sıfırlanır ve cluster'lar $Bitmap üzerinde serbest işaretlenir.",
      "Recycle Bin: $R<id> içerik dosyası, $I<id> ise orijinal yol, boyut ve silinme zamanını taşıyan yapılandırılmış kayıttır.",
      "USN Journal: FILE_DELETE gibi işlem kayıtları silinme anını ve hedef adını verebilir.",
      "Data carving: Dosya imzası (magic bytes) ve sonlandırma işaretine dayanır; ZIP, PNG, JPEG gibi yapısal sınırı net formatlarda en başarılıdır.",
      "Cluster'lar yeniden kullanıldıysa içerik kısmen veya tamamen overwrite olur; kurtarma garanti edilemez.",
    ],
    why: [
      "Silme, çoğu kullanıcı için 'kayıp' anlamına gelir; adli incelemede tam tersi, çoğunlukla bir iz bırakır.",
      "Kurtarma olasılığının dürüstçe raporlanması, incelemenin güvenilirliği için şarttır.",
    ],
    how: [
      "1. MFT'den in-use = 0 kayıtları listele.",
      "2. $Recycle.Bin altında $I/$R çiftlerini eşleştir; orijinal yolu çöz.",
      "3. $UsnJrnl:$J üzerinden silinme olaylarını sırala.",
      "4. Unallocated alan üzerinden imza taraması yap (carving).",
      "5. Kurtarılan içeriğin hash'ini hesapla; bilinen özete göre karşılaştır.",
    ],
    tools: [
      { name: "Autopsy — Recover Deleted Files", desc: "Dosya sistemi düzeyinde kurtarma." },
      { name: "PhotoRec / TestDisk", desc: "İmza tabanlı veri oyma." },
      { name: "MFTECmd + $I parser", desc: "Geri dönüşüm kasası kayıtlarının çözümü." },
      { name: "bulk_extractor", desc: "Yapısal kayıtların taraması (URL, e-posta, fsmeta)." },
    ],
    realWorld: [
      "Silinmiş sözleşme ve raporların geri kazanılması.",
      "İmha edilmiş içerik iddialarının çürütülmesi.",
    ],
    example: {
      caption: "Kurtarılabilirlik değerlendirmesi (sentetik Modül C)",
      code: `EV-001 / C:\\FIN

[Eski_Ortak_Sozlesme.pdf]  MFT: in-use=0
  Runlist ilk 44 cluster → $Bitmap: İLK 8 KB BOŞ
  DURUM: KOŞULLU — kurtarılabilir, ancak tümü overwrite
  edilmiş olabilir. Hash bilinen özete uymazsa bütünlük YOK.

[$Recycle.Bin\\$R8F2A1.xlsx]  $I girdisi mevcut
  Orijinal yol : C:\\FIN\\Eski_Ortak_Sozlesme.pdf
  Silinme      : 2026-02-06 08:36:44 +03:00
  DURUM: KESİN — $I/$R çifti tam, içerik okunuyor.

[arşiv_2024.part1.rar]         Silinmemiş, parola korumalı
  DURUM: KURTARMA GEREKMEZ — içerik şifreli, inceleme farklı
  yöntem gerektirir.`,
    },
    diagram: {
      title: "Silme sonrası kurtarma yolları",
      nodes: [
        { label: "MFT Kaydı", sub: "ad + yol" },
        { label: "$I / $R", sub: "geri dönüşüm" },
        { label: "USN Journal", sub: "silme olayı" },
        { label: "Unallocated", sub: "serbest alan" },
        { label: "Carving", sub: "imza taraması" },
      ],
      note: "Kurtarılabilirlik bir dizi değil, her dosya için ayrı ayrı verilen bir karardır.",
    },
    mistakes: [
      { wrong: "Her silinmiş dosyanın kurtarılacağını varsaymak.", why: "Overwrite edilmiş cluster'larda içerik yoktur. Bu nedenle her dosya için ayrı 'kesin/kosullu/yok' değerlendirmesi gerekir." },
      { wrong: "Kurtarılan dosyanın bütünlüğünü doğrulamadan sunmak.", why: "Kısmen overwrite olmuş dosya açılabilir ama içeriksiz/bozuk olabilir; hash veya yapısal doğrulama yapılmalıdır." },
      { wrong: "Yalnızca Recycle Bin'e bakıp 'silinmiş dosya yok' demek.", why: "Shift+Del, program içi silme veya komut satırı silmeleri kasaya düşmeyebilir; MFT ve USN kontrol edilmelidir." },
    ],
    quiz: [
      { q: "Bir $I dosyası neyi içerir?", options: ["Dosyanın içeriğini", "Orijinal yol, boyut ve silinme zamanını", "Dosyanın hash'ini", "Dosya izinlerini"], answer: 1, explain: "$I, geri dönüşüm kasasındaki yapılandırılmış kayıttır: orijinal tam yol, silinme zaman damgası ve boyut taşır. İçerik $R dosyasında bulunur; hash veya izin bilgisi içermez." },
      { q: "Cluster'lar yeniden kullanılmış bir dosya için doğru ifade hangisidir?", options: ["Kesinlikle kurtarılır", "Kurtarma koşulludur; içerik bütünlüğü garanti edilemez", "Kurtarılamaz", "Kesinlikle kurtarılamaz"], answer: 1, explain: "Yeniden kullanım, önceki içeriğin kısmen veya tamamen overwrite edildiği anlamına gelir. 'Kesin' veya 'kesinlikle kurtarılamaz' gibi mutlak ifadeler teknik olarak desteklenmez." },
      { q: "Data carving neye dayanır?", options: ["Dosya adına", "Dosya imzası ve sonlandırma işaretine", "Registry kaydına", "Hash'e"], answer: 1, explain: "Carving, dosya sistemi kaydı olmadan magic bytes (örn. %PDF-) ve yapısal bitiş işaretlerini tarar. Dosya adı ve yolu bu yöntemde kayıptır." },
    ],
    readings: [
      { title: "NIST SP 800-86 §3.4 — Deleted data recovery", note: "Kurtarma tekniklerinin çerçevelenmesi." },
      { title: "Microsoft Docs — Recycle Bin and $I file format", note: "Geri dönüşüm kasası kayıt yapısı." },
    ],
  },

  /* ========================= LEVEL 3 — ADVANCED ========================= */
  {
    id: "L3-01",
    level: "advanced",
    order: 13,
    title: "Bellek Adli Bilişimi ve Volatility",
    titleEn: "Memory Forensics & Volatility Framework",
    summary:
      "RAM imajı, süreç ağacı, SSDT/IDT tutarsızlıkları, hollowed process tespiti, yüklenen modüller ve ağ bağlantıları.",
    minutes: 32,
    labModule: "A",
    objectives: [
      "Volatil sıralamayı (RFC 3227 benzeri) uygulayabilmek.",
      "pslist/pstree çıktısındaki anomaliyi (ebeveyn-çocuk ilişkisi ihlali) tespit edebilmek.",
      "İmzasız veya yoldan çıkmış (out-of-path) yüklenen modülleri belirleyebilmek.",
      "Bellek bulgusunun neyi destekleyip neyi desteklemediğini ayrıştırabilmek.",
    ],
    definition:
      "Bellek adli bilişimi (Memory Forensics), çalışan sistemden alınan RAM görüntüsünden süreçlerin, yüklenen modüllerin, ağ bağlantılarının ve şifrelenmiş/çözülmüş içeriklerin incelenmesidir.",
    principle: [
      "Volatilite sırası: kayıt önbelleği → ağ tablosu → bellek → süreçler → disk. Kural: en değişken kaynak önce edinilir.",
      "Volatility Framework, imaj üzerinde profil (OS sürüm + mimari) tanımlayarak eklenti (plugin) tabanlı analiz yapar.",
      "pslist, NTDLL üzerinden yürütülmüş süreç listesini verir; psscan/svcscan gibi yöntemler zincirden çıkarılmış (unlinked) süreçleri de görebilir.",
      "Hollowing: Meşru bir süreç belleğinin serbest bırakılıp başka bir içeriğin yazılması. Tespit: başlangıç adresi, bölüm izinleri (RWX), imza ve diskteki dosya ile uyumsuzluk.",
      "connections/netstat eklentileri, açık soketleri süreç kimliğiyle eşler.",
    ],
    why: [
      "Diskte hiç iz bırakmayan (fileless) aktiviteler yalnızca bellekte görünür.",
      "Şifre çözülmüş içerikler, komut satırı argümanları ve geçici anahtarlar RAM'de bulunabilir.",
      "İmaj, o anın dondurulmuş görüntüsüdür; canlı sistemde erişilemeyen birçok yapı burada kalır.",
    ],
    how: [
      "1. Sistemi hazırla (imaj öncesi ağ kesme kararı belgelenir).",
      "2. Volatil sıraya göre edinim: RAM → açık bağlantılar → disk.",
      "3. İmajın hash'ini al ve custody'e işle.",
      "4. Doğru profili belirle (imageinfo).",
      "5. pslist/pstree → dlllist → handles → netscan → cmdline sırasıyla çalıştır.",
      "6. Anomalileri disk artefaktlarıyla çapraz doğrula.",
    ],
    tools: [
      { name: "Volatility 3", desc: "Python tabanlı bellek analiz çerçevesi." },
      { name: "WinPmem / LiME", desc: "Windows/Linux canlı bellek edinimi." },
      { name: "DumpIt", desc: "Tek dosyalık Windows RAM imaj alma." },
      { name: "YARA", desc: "Bellek ve dosyalarda imza tabanlı tarama." },
    ],
    realWorld: [
      "Fidye yazılımı ve solunum (loader) analizi.",
      "Kimlik bilgisi hırsızlığı (Mimikatz vb.) izlerinin aranması.",
      "Fileless zararlı yazılım tespiti.",
    ],
    example: {
      caption: "Sentetik Volatility çıktısı (EV-003)",
      code: `$ python3 vol.py -f EV-003.raw windows.pstree
  PPID  PID  Name            CreateTime
   664  4128 explorer.exe    2026-02-06 07:58:12
   4128 5984 EXCEL.EXE       2026-02-06 08:22:44
   4128 7312 rundll32.exe    2026-02-06 08:42:03
   7312 7444 svchost.exe     2026-02-06 08:42:07   <-- ANOMALİ

$ python3 vol.py -f EV-003.raw windows.dlllist --pid 7444
  0x00007FF8A12B0000  184320  C:\\Users\\Public\\tmpdrv.dll  [İMZASIZ]

$ python3 vol.py -f EV-003.raw windows.netscan
  10.20.4.117:49811  ->  203.0.113.87:4444  ESTABLISHED  pid=7444

DEĞERLENDİRME:
  Doğrudan gözlem : svchost.exe ebeveyni rundll32.exe (normalde services.exe).
  Destekleyici      : imzasız DLL + 4444 portuna kalıcı bağlantı.
  Doğrulanmamış     : "veri sızdırıldı" — içerik şifreli, kanıt yok.`,
    },
    diagram: {
      title: "Bellek analiz eklenti sırası",
      nodes: [
        { label: "imageinfo", sub: "Profil" },
        { label: "pslist/pstree", sub: "Süreç ağacı" },
        { label: "dlllist", sub: "Modüller" },
        { label: "cmdline/handles", sub: "Argüman" },
        { label: "netscan", sub: "Bağlantı" },
      ],
      note: "Profil yanlış seçilirse eklentiler tutarsız sonuç üretir; bu, analizde ilk doğrulanması gereken adımdır.",
    },
    mistakes: [
      { wrong: "Svchost.exe gördüğünde normal kabul etmek.", why: "Süreç adı taklit edilebilir. Ebeveyn PID, yürütülebilir yolu ve imza kontrol edilmeden ad yorumlanmamalıdır." },
      { wrong: "Bellekte bağlantı bulunca 'veri aktarıldı' demek.", why: "Bağlantı varlığı veri aktarımını kanıtlamaz; içerik ve aktarılan hacim için ağ kayıtları gerekir." },
      { wrong: "İmajı diskten önce almak.", why: "İmaj alma sırasında kaynak dosyalar disk üzerinde değişebilir; volatil kaynaklar önce alınır." },
    ],
    quiz: [
      { q: "Volatilite sırasına göre hangisi önce edinilmelidir?", options: ["Disk imajı", "RAM görüntüsü", "Ağ trafiği kayıtları", "Yedek arşiv"], answer: 1, explain: "En değişken kaynak önce alınır: bellek (ve açık bağlantılar) diskten önce edinilir. Disk imajı en son alınır çünkü en kararlı kaynaktır." },
      { q: "Bir süreçte ebeveyn PID uyuşmazlığı neyi gösterebilir?", options: ["Kesinlikle zararlı yazılım", "Process hollowing veya zincirden çıkarma olasılığı", "Sistemin yeniden başladığını", "RAM'in yetersiz olduğunu"], answer: 1, explain: "Normal yaşam döngüsünde beklenmeyen ebeveyn-çocuk ilişkisi, süreç manipülasyonuna işaret eden destekleyici bir göstergedir. 'Kesin zararlı' sonucu için ek doğrulama (imza, modül, disk artefaktı) gerekir." },
    ],
    readings: [
      { title: "Volatility 3 Documentation", note: "Eklenti referansı ve profil seçimi." },
      { title: "Lightheart, The Art of Memory Forensics", note: "Bellek yapısı ve analiz teknikleri." },
      { title: "RFC 3227 — Guidelines for Evidence Collection", note: "Volatilite sıralamasının kaynağı." },
    ],
  },
  {
    id: "L3-02",
    level: "advanced",
    order: 14,
    title: "Ağ Adli Bilişimi ve PCAP Analizi",
    titleEn: "Network Forensics & PCAP Analysis",
    summary:
      "Paket yakalama, DNS ve TCP kayıtları, HTTP başlıkları, şifreli trafikte görülebilen metadata ve akış sıralaması.",
    minutes: 30,
    labModule: "G",
    objectives: [
      "Bir PCAP'tan akış (flow) tablosu çıkarabilmek.",
      "DNS sorgularından alan adı ve çözüm IP'lerini eşleştirebilmek.",
      "SYN/ACK/RST bayraklarından bağlantı başarısını yorumlayabilmek.",
      "Şifreli trafikte hangi bilgilerin görülebileceğini net biçimde ifade edebilmek.",
    ],
    definition:
      "Ağ adli bilişimi (Network Forensics), ağ trafiğinin pasif olarak yakalanması, kaydedilmesi ve olayların yeniden oluşturulması amacıyla analizidir.",
    principle: [
      "PCAP dosyaları paketleri yakalar; her paket zaman damgası, kaynak/hedef MAC-IP-port, protokol ve yük içerir.",
      "DNS, giden sorgulardan alan adı ve IP çözümlemesini okunabilir biçimde verir (DoH/DoT kapalıysa).",
      "TCP durum makinesi: SYN → SYN/ACK → ACK başarılı bağlantıyı; RST başarısız/kesilen bağlantıyı gösterir.",
      "TLS'te SNI (Server Name Indication) el sıkışmada açık taşınabilir; içerik şifrelidir. Uzun süreli belirli host'a düzenli giden trafik metadata düzeyinde anomali oluşturur.",
      "HTTP ise başlıkları, yol, yöntem ve UA gibi alanları açıkça içerir.",
    ],
    why: [
      "Uç nokta kayıtlarının silinmiş olduğu durumlarda ağ kayıtları bağımsız bir kaynak sağlar.",
      "İçerik görülmese bile kim, nereye, ne sıklıkla soruları cevaplanabilir.",
      "DNS sorgu geçmişi, C2 (command & control) davranışının klasik göstergesidir.",
    ],
    how: [
      "1. Yakalama kapsamını ve SPAN/port konumunu belgele.",
      "2. Protokollere göre filtrele (dns, tcp, tls, http).",
      "3. Conversations/akış tablosunu çıkar; eş zamanlı uç nokta kayıtlarıyla eşleştir.",
      "4. Anormalleri (seyrek alan adı, alışılmadık port, ardışık küçük giden paketler) işaretle.",
      "5. Güven düzeyi yaz: içerik görülmediyse iddiayı sınırla.",
    ],
    tools: [
      { name: "Wireshark", desc: "Görsel paket çözümleme ve akış takibi." },
      { name: "tshark", desc: "Komut satırı tabanlı toplu ayrıştırma." },
      { name: "Zeek (Bro)", desc: "Bağlantı ve protokol kaydı üretimi (conn.log, dns.log)." },
      { name: "NetworkMiner", desc: "Dosya ve kimlik çıkarımı (OSINT)." },
    ],
    realWorld: [
      "Veri sızıntısının ağ düzeyinde doğrulanması.",
      "C2 iletişim kalıplarının tespiti.",
      "DDoS ve yetkisiz erişim analizleri.",
    ],
    example: {
      caption: "Akış tablosu (sentetik EV-006)",
      code: `#  Yerel(+03)          Kaynak           Hedef           Prot   Bayrak  Not
1  2026-02-21 00:14:02 10.20.4.117:49712 203.0.113.87:443 TLS1.3 PSH,ACK SNI=cdn-drop.example.net
3  2026-02-21 00:14:03 10.20.4.117:49713 10.20.0.10:53    DNS    QUERY   cdn-drop.example.net → 203.0.113.87
5  2026-02-21 00:14:05 10.20.4.117:49720 198.51.100.24:80 HTTP   POST    POST /u/1a2b (başlıklar okunabilir)
7  2026-02-21 00:14:09 10.20.4.117:49731 203.0.113.87:4444 TCP    SYN
8  2026-02-21 00:14:09 203.0.113.87:4444 10.20.4.117:49731 TCP    SYN,ACK  Bağlantı kabul

DEĞERLENDİRME:
  Doğrudan gözlem : 4444 portuna başarılı TCP bağlantısı kuruldu.
  Destekleyici     : DNS yanıtının 203.0.113.87 olması.
  Sınırlı          : Paket içeriği şifreli → aktarılan veri TÜRÜ bilinmiyor.`,
    },
    diagram: {
      title: "TLS akışında görünen / görünmeyen",
      nodes: [
        { label: "IP / Port", sub: "görünür" },
        { label: "DNS", sub: "alan adı görünür" },
        { label: "SNI", sub: "host görünür" },
        { label: "Zaman / Boyut", sub: "görünür" },
        { label: "Yük", sub: "ŞİFRELİ" },
      ],
      note: "Şifreli trafikte içerik iddiası kurulamaz; yalnızca davranışsal metadata üzerinden değerlendirme yapılır.",
    },
    mistakes: [
      { wrong: "TLS trafiğinin içeriğini görebildiğini varsaymak.", why: "Anahtar değişimi yapıldıysa yük çözülemez; Anahtar kaydı olmayan sürede yalnızca metadata mevcuttur." },
      { wrong: "Tek DNS sorgusunu 'C2 bağlantısı' saymak.", why: "Normal servisler de sorgu üretir. Sıklık, saat, yanıt IP'si ve uç nokta kaydı birlikte değerlendirilmelidir." },
      { wrong: "Yakalama noktasını belirtmeden 'tüm trafik' demek.", why: "Yakalama yalnızca belli bir link üzerinde yapılmıştır; kapsam dışı segmentlerdeki trafik görünmez." },
    ],
    quiz: [
      { q: "TLS el sıkışmasında hangi bilgi genellikle açık taşınır?", options: ["HTTP gövdesi", "SNI (alan adı)", "Dosya içeriği", "Şifre çözülmüş anahtar"], answer: 1, explain: "SNI, istemcinin bağlandığı alan adını el sıkışma sırasında açık iletir (ESNI/ECH kullanılmadıkça). Bu, hangi host'a gidildiğini gösterir ancak içeriği vermez." },
      { q: "TCP bağlantısında SYN/ACK alınıp hemen ardından RST gelirse ne denir?", options: ["Bağlantı başarıyla kuruldu", "El sıkışma tamamlandı ancak bağlantı kesildi/red edildi", "Paket hiç ulaşmadı", "DNS hatası"], answer: 1, explain: "SYN/ACK, karşı tarafın dinlediğini ve kabul ettiğini gösterir; sonraki RST bağlantının kapatıldığını belirtir. Bu durum 'bağlantı kurulmadı' değil, 'kısa süreli/kapatılmış bağlantı' olarak kaydedilir." },
    ],
    readings: [
      { title: "NIST SP 800-86 §3.3 — Network data collection", note: "Ağ verisi toplama çerçevesi." },
      { title: "Wireshark Display Filter Reference", note: "Filtre sözdizimi." },
    ],
  },
  {
    id: "L3-03",
    level: "advanced",
    order: 15,
    title: "Gelişmiş Windows Artefaktları",
    titleEn: "Advanced Windows Artifacts",
    summary:
      "Prefetch, LNK, Jump Lists, ShellBags, Amcache ve Shimcache — kullanıcı ve sistem niyetini gösteren ikincil kayıtlar.",
    minutes: 30,
    labModule: "C",
    objectives: [
      "Prefetch dosyasından çalıştırma sayısı ve son damgaları okuyabilmek.",
      "LNK hedefindeki harici birim ipucunu tespit edebilmek.",
      "ShellBags'in silinmiş klasör varlığını gösterebildiğini açıklayabilmek.",
      "Amcache ile Shimcache'in kapsam farkını karşılaştırabilmek.",
    ],
    definition:
      "Windows artefaktları, işletim sistemi ve bileşenlerinin performans, ergonomi ve hızlandırma amacıyla oluşturduğu ikincil kayıtlardır. Bunlar çoğu zaman doğrudan olay kaydı olmasa da niyet ve erişim açısından yüksek adli değer taşır.",
    principle: [
      "Prefetch (C:\\Windows\\Prefetch\\*.pf): Windows'un çalıştırılan uygulamalar için tuttuğu önbellek kaydı. Run count, ilk/son çalıştırma zaman damgaları ve yüklenen dosya adlarını içerir (Windows 10+ son 8 çalıştırma).",
      "LNK (kısayol): Hedef yol, hedef dosya boyutu, yerel saat, harici birim seri numarası (volume serial) ve MAC damgaları içerir.",
      "Jump Lists (AutomaticDestinations / CustomDestinations): Kullanıcının uygulama içinde açtığı son öğeler.",
      "ShellBags (NTUSER.DAT\\…\\BagMRU/Bags): Explorer klasör ağaç tercihleri. Klasör silinmiş olsa bile girdi kalabilir.",
      "Amcache.hve: Uygulamaların SHA-1 imzası, ilk/son görüldüğü ve kaynak yolu.",
      "Shimcache (SYSTEM\\CurrentControlSet\\Control\\Session Manager\\AppCompatCache): Uygulama uyumluluk kaydı; Windows 10'da 1024 girdiye kadar silinene kadar tutulur.",
    ],
    why: [
      "Kullanıcının neyi açtığını ve nereye gittiğini gösterir; dosya sistemi kayıtları silinmiş olsa bile bu kayıtlar kalabilir.",
      "Harici birime erişim iddiasını destekleyen en güçlü ikincil kaynaklardan biri LNK ve Jump List kayıtlarıdır.",
      "Prefetch, dosya sistemi dışında bağımsız bir 'çalıştırıldı' göstergesidir.",
    ],
    how: [
      "1. Artefakt konumlarını hedef klasörle eşleştir.",
      "2. Zaman damgalarını UTC'ye çevir, ofseti kaydet.",
      "3. LNK/Jump List'te hedef yol ve seri no alanlarını çöz.",
      "4. Prefetch/Amcache ile dosya sistemi damgalarını eşleştir.",
      "5. Silinmiş olsa bile ShellBags girdilerini değerlendir.",
    ],
    tools: [
      { name: "PECmd / MFTECmd", desc: "Prefetch çözümleme (Eric Zimmerman)." },
      { name: "LECmd / JLECmd", desc: "LNK ve Jump List çözümleme." },
      { name: "ShellBags Explorer (SBECmd)", desc: "ShellBag ağacı çözümleme." },
      { name: "AppCompatProcessor", desc: "Amcache toplu analizi." },
    ],
    realWorld: [
      "Harici birimden dosya alıp almadığının araştırılması.",
      "Silinmiş klasör yapısının yeniden kurulması.",
      "Çalıştırılan yardımcı araçların (silinebilir exe) tespiti.",
    ],
    example: {
      caption: "LNK çözümü — harici birim ipucu (sentetik)",
      code: `LNK: C:\\Users\\Public\\arşiv_2024.part1.rar.lnk
  Hedef yolu      : E:\\Belgeler\\Eski_Ortak_Sozlesme.pdf
  Hedef boyutu    : 0 bayt (dosya silinmiş olabilir)
  Volume serial   : 0x9A3F-11C2  (harici birim)
  Hedef oluşturma : 2025-09-11 16:44:00 +03:00
  LNK oluşturma   : 2026-02-06 08:34:51 +03:00
  LNK erişim      : 2026-02-06 08:34:51 +03:00

DEĞERLENDİRME:
  Doğrudan gözlem : 2026-02-06 08:34:51'de E: birimindeki bir hedefe
                    işaret eden kısayol oluşturuldu.
  Destekleyici     : USB bağlantı penceresi (08:14 – 09:02) ile örtüşüyor.
  Doğrulanmamış    : Dosyanın kopyalanıp kopyalanmadığı — boyut 0,`,
    },
    diagram: {
      title: "Artefaktların kapsadığı sorular",
      nodes: [
        { label: "Prefetch", sub: "Çalıştırıldı mı?" },
        { label: "LNK", sub: "Nereye erişildi?" },
        { label: "Jump List", sub: "Son öğeler" },
        { label: "ShellBags", sub: "Hangi klasör?" },
        { label: "Amcache", sub: "Ne görüldü?" },
      ],
      note: "Bu kayıtlar ikincil niteliktedir; asıl dosya sistemi ve olay günlüğü kayıtlarıyla eşleştirilmeden sonuç üretilmez.",
    },
    mistakes: [
      { wrong: "Prefetch varlığını 'program kesin çalıştırmış' diye mutlak saymak.", why: "Kayıt, uygulamanın sistem tarafından yürütüldüğünü gösterir; ancak silinmiş veya manipüle edilmiş prefetch'ler dikkate alınmalıdır. Corroboration gerekir." },
      { wrong: "ShellBags'te klasör görünce dosyaların var olduğunu sanmak.", why: "ShellBags klasörün erişildiğini gösterir, içeriğini değil." },
      { wrong: "Amcache girdisini zararlı yazılım kanıtı saymak.", why: "Amcache 'görüldü' bilgisidir; imza ve davranış analizi olmadan zararlılık kararı verilemez." },
    ],
    quiz: [
      { q: "LNK dosyasında 'volume serial' alanı neye işaret eder?", options: ["Dosyanın hash'ine", "Hedefin bulunduğu birimin kimliğine (harici birim ipucu)", "Kullanıcı SID'ine", "İşletim sistemi sürümüne"], answer: 1, explain: "Volume serial, hedef dosyanın bulunduğu birimin seri numarasıdır. Bu, harici bir USB birimine erişildiğini destekleyen güçlü bir ikincil göstergedir; dosyanın kendisi değil." },
      { q: "Hangisi silinmiş bir klasörün varlığını gösterebilir?", options: ["Prefetch", "ShellBags", "Amcache", "Jump List"], answer: 1, explain: "ShellBags (BagMRU), kullanıcının Explorer'da açtığı klasör ağaç tercihlerini tutar ve klasör silinmiş olsa bile girdi kalabilir. Prefetch çalıştırılan yürütülebilir dosyaları, Jump List ise uygulama içi son öğeleri gösterir." },
      { q: "Amcache ile Shimcache arasındaki temel fark nedir?", options: ["İkisi aynıdır", "Amcache imza ve kaynak yolu içerir; Shimcache uyumluluk kaydıdır ve sınırlı sayıda girdi tutar", "Shimcache yalnızca 32-bit sistemlerde vardır", "Amcache yalnızca silinmiş dosyaları tutar"], answer: 1, explain: "Amcache.hve, SHA-1 imza, dosya yolu ve görüldüğü zaman bilgilerini tutar; Shimcache ise uygulama uyumluluk (AppCompatCache) kaydıdır ve üst sınırı olan (ör. 1024) bir tampon kullanır." },
    ],
    readings: [
      { title: "Microsoft Docs — Prefetch overview", note: "Prefetch dosyası davranışı." },
      { title: "SANS FOR508 — Super Timeline and Windows Artifacts", note: "Artefakt korelasyonu." },
    ],
  },
  {
    id: "L3-04",
    level: "advanced",
    order: 16,
    title: "$LogFile ve $UsnJrnl Günlük Analizi",
    titleEn: "NTFS Journal Analysis",
    summary:
      "USN Journal kayıt türleri, $LogFile çoklu akış yapısı, değişiklik sırasının çıkarımı ve sınırları.",
    minutes: 27,
    labModule: "C",
    objectives: [
      "USN_RECORD v2 alanlarını (FileReference, ParentReference, Reason, Timestamp) okuyabilmek.",
      "FILE_CREATE, DATA_OVERWRITE, FILE_DELETE, RENAME_OLD_NAME gibi nedenleri yorumlayabilmek.",
      "$LogFile ile $UsnJrnl'nin kapsam farkını açıklayabilmek.",
      "Günlük kayıtlarının neden 'niyet' değil 'olay' gösterdiğini vurgulayabilmek.",
    ],
    definition:
      "NTFS günlük mekanizması, dosya sistemi işlemlerinin sırayla kaydedilmesini sağlar. $UsnJrnl:$J, güncelleme sıra numarası (USN) tabanlı değişiklik kayıtlarını; $LogFile ise NTFS işlem günlük (redo/undo) yapısını tutar.",
    principle: [
      "USN_RECORD: Record Length, Major/Minor Version, File Reference Number, Parent File Reference Number, USN, Time Stamp, Reason, Source Info.",
      "Reason bayrakları bitmask'tir: 0x1 FILE_CREATE, 0x2 FILE_DELETE, 0x10 DATA_OVERWRITE, 0x20 DATA_EXTEND, 0x40 RENAME_OLD_NAME, 0x80 RENAME_NEW_NAME, 0x10000 COMPRESSION_CHANGE.",
      "$UsnJrnl:J, dosya adı yerine çoğunlukla dosya referans numarası (MFT indeksi) verir; çözüm için MFT ile eşleştirme gerekir.",
      "$LogFile, NTFS'in kendi tutarlılık mekanizmasıdır ve değişiklik öncesi/sonrası alan değerlerini içerebilir.",
      "Journal boyutu sınırlıdır; eski kayıtlar döngüsel olarak üzerine yazılır.",
    ],
    why: [
      "Dosya adı ve MFT kaydı silinmiş olsa bile USN Journal kaydı kalabilir.",
      "Sıralı yapı, 'önce A oluşturuldu, sonra B'ye taşındı, sonra silindi' gibi ardışık kurguları kurmaya izin verir.",
      "Kayıt temizleme girişimleri (journal disable/silme) tespit edilebilir.",
    ],
    how: [
      "1. $Extend\\$UsnJrnl:$J dosyasını imajdan ayıkla.",
      "2. USN Record'ları ayrıştır (MFTECmd_USN / usn_journal.txt).",
      "3. FileReference'ları MFT kayıtlarıyla eşleştir (ad ve yol çöz).",
      "4. Reason bayraklarını zaman sırasına göre diz.",
      "5. İlgili dosya sistemi ve olay günlüğü kayıtlarıyla doğrula.",
    ],
    tools: [
      { name: "MFTECmd", desc: "USN Journal ve $I dışa aktarımı." },
      { name: "NTFS Log Tracker", desc: "$LogFile ve USNJournal birlikte çözümleme." },
      { name: "usnjrnl2csv", desc: "Komut satırı dönüşüm aracı." },
    ],
    realWorld: [
      "Silinme ve taşıma olaylarının sıralanması.",
      "Ransomware'in dosya oluşturma/yeniden adlandırma kalıbının çıkarımı.",
    ],
    example: {
      caption: "USN Journal kayıtları (sentetik)",
      code: `USN        Time(+03)          FileRef   Parent    Reason                     Ad
0x0000...  2026-02-06 08:31:04  0x3A112   0x32F1A   FILE_CREATE | DATA_EXTEND  Q1_Butce_Gizli.xlsx
0x0000...  2026-02-06 08:31:05  0x3A112   0x32F1A   DATA_OVERWRITE            Q1_Butce_Gizli.xlsx
0x0000...  2026-02-06 08:34:49  0x3A118   0x32F1A   RENAME_OLD_NAME           (Eski_Ortak)
0x0000...  2026-02-06 08:34:49  0x3A118   0x32F1A   RENAME_NEW_NAME           (Sözleşme_Taslak)
0x0000...  2026-02-06 08:36:44  0x3A118   0x32F1A   FILE_DELETE               Sözleşme_Taslak.pdf

YORUM:
  Doğrudan gözlem : 08:31:04'te hedef birimde dosya oluşturuldu ve yazıldı.
  Destekleyici     : Kaynak dosyanın A damgası ile 2 sn içinde eşleşme.
  Sınırlı          : İçeriğin birebir aynı olduğu HASH ile doğrulanır.`,
    },
    diagram: {
      title: "Günlük katmanları",
      nodes: [
        { label: "$UsnJrnl:$J", sub: "Değişiklik nedeni" },
        { label: "$LogFile", sub: "İşlem öncesi/sonrası" },
        { label: "$MFT", sub: "Kayıt durumu" },
        { label: "$Bitmap", sub: "Cluster durumu" },
        { label: "Event Log", sub: "Denetim kaydı" },
      ],
      note: "USN Journal kendi başına niyet göstermez; yalnızca NTFS'in kaydettiği değişiklik olayıdır.",
    },
    mistakes: [
      { wrong: "Reason alanını tek başına okuyup yol tahmin etmek.", why: "Kayıtta dosya referans numarası vardır; yol MFT ile eşleştirilmeden elde edilmez." },
      { wrong: "Günlükte kayıt olmamasını 'silinmedi' sanmak.", why: "Journal döngüsel yazılır ve temizlenmiş olabilir; bu bir sınırlılıktır." },
      { wrong: "USN kaydını kopyalama kanıtı saymak.", why: "FILE_CREATE, hedefte dosya oluşumunu gösterir; kaynağın hangisi olduğu ayrı eşleştirme gerektirir." },
    ],
    quiz: [
      { q: "USN Reason 0x2 neyi belirtir?", options: ["FILE_DELETE", "FILE_CREATE", "DATA_OVERWRITE", "RENAME"], answer: 0, explain: "USN Reason bayrakları: 0x1 FILE_CREATE, 0x2 FILE_DELETE, 0x10 DATA_OVERWRITE, 0x40/0x80 yeniden adlandırma bayraklarıdır." },
      { q: "USN Journal kaydında dosya yolu neden çoğu zaman doğrudan görünmez?", options: ["Şifrelendiği için", "Yerine MFT dosya referans numarası verildiği için", "Silindiği için", "Sadece ASCII olduğu için"], answer: 1, explain: "USN_RECORD, dosya ve üst dizin referans numaralarını tutar. Yolun elde edilmesi, bu referansların MFT kayıtlarıyla eşleştirilmesini gerektirir." },
    ],
    readings: [
      { title: "Microsoft Docs — USN Journal", note: "Kayıt yapısı ve neden bayrakları." },
      { title: "NTFS Log Tracker — teknik notlar", note: "$LogFile çözümleme yaklaşımı." },
    ],
  },
  {
    id: "L3-05",
    level: "advanced",
    order: 17,
    title: "Anti-Forensics Tekniklerinin Tespiti",
    titleEn: "Anti-Forensics Detection",
    summary:
      "Timestomp, dosya silme izi temizliği, günlük silme, sıkıştırma/şifreleme ve bu tekniklerin kendisinin delil oluşturması.",
    minutes: 26,
    labModule: "G",
    objectives: [
      "Yaygın anti-forensics tekniklerini sınıflandırabilmek.",
      "Timestomp izini çapraz damga karşılaştırmasıyla tespit edebilmek.",
      "Silme/günlük temizleme girişimlerinin tersine delil ürettiğini açıklayabilmek.",
      "Manipülasyon iddiasını 'doğrulanmamış iddia' düzeyinden nasıl çıkaracağını değerlendirebilmek.",
    ],
    definition:
      "Anti-forensics, dijital incelemeyi zorlaştırmayı, bulguları gizlemeyi veya yanlış yönlendirmeyi amaçlayan teknikler bütünüdür. Adli bilişimde asıl önemlisi, bu tekniklerin kendisinin de iz bırakmasıdır.",
    principle: [
      "Sınıflandırma: (1) veri gizleme/şifreleme, (2) imha (silme/overwrite), (3) yapı değiştirme (timestomp), (4) yanlış yönlendirme (canary/trap dosyalar), (5) ortam manipülasyonu (saat değiştirme).",
      "Timestomp: MFT alanlarını istenen değerlere çeker. Ancak MFT, USN Journal, $LogFile, Prefetch ve Windows Event Log aynı olaya ait bağımsız damgalar taşır; uyumsuzluk tespit edilir.",
      "Saat değiştirmek sistem genelinde etkilidir: TimeZoneInformation, Event Log UTC alanları ve NTP senkron kayıtları sapmayı gösterir.",
      "cipher /w, sdelete gibi araçlar serbest cluster'ı sıfırlar; bu işlemin kendisi 4688 kaydı üretebilir.",
      "Günlük temizliği (1102) ve güvenlik ilkesi değişiklikleri denetim kayıtlarında görünür kalır.",
    ],
    why: [
      "Manipülasyon tespiti, incelemenin sonuç bölümündeki güven düzeyini doğrudan etkiler.",
      "Karşı tarafın 'deliller değiştirildi' iddiasına yanıt verebilmek için tutarlı çoklu kaynak gerekir.",
      "Kendi başına tespit edilen manipülasyon, arkasındaki amacı kanıtlamaz; ama sınırlılık olarak raporlanmalıdır.",
    ],
    how: [
      "1. İlgili tüm kaynaklarda aynı olayın damgalarını topla.",
      "2. Damgalar arası tutarsızlıkları ölç (ör. MFT C ≠ Prefetch).",
      "3. Sistem saat dilimi ve NTP kayıtlarını doğrula.",
      "4. Denetim ve günlük temizleme olaylarını tara.",
      "5. Bulguyu 'doğrulanmış' veya 'dolaylı' olarak sınıflandır; niyet için ek kanıt ara.",
    ],
    tools: [
      { name: "MFTECmd + Prefetch çıktılarını karşılaştırma", desc: "Çapraz damga uyumsuzluğu tespiti." },
      { name: "Timestomp (Mace Overflow)", desc: "Test amaçlı zaman damgası değiştirme aracı (laboratuvar)." },
      { name: "Event Log + NTP kayıtları", desc: "Sistem saati manipülasyonu kontrolü." },
    ],
    realWorld: [
      "Kapsam öncesi delil imha girişimi iddiaları.",
      "Fidye yazılımı sonrası zaman damgası değişikliklerinin ayrıştırılması.",
      "Denetim kayıtlarının güvenilirliğinin sorgulanması.",
    ],
    example: {
      caption: "Çapraz damga uyumsuzluğu",
      code: `Dosya: C:\\FIN\\Eski_Ortak_Sozlesme.pdf

[MFT $SI]     C (MFT changed) : 2026-02-06 05:35:12.902Z
[MFT $FN]     Created         : 2025-09-11 16:44:00 +03:00
[USN Journal] FILE_DELETE     : 2026-02-06 05:36:44.001Z
[Event 4663]  Delete işlemi   : 2026-02-06 05:44:12.114Z  <-- 7 dk 28 sn sonra

ANOMALİ: USN kaydı ile denetim kaydı arasındaki fark.
MÜMKÜN AÇIKLAMALAR:
  a) Günlük yazma gecikmesi (kaynak okuyucu kuyruğu)
  b) Farklı cihaz saat senkronu
  c) Manuel zaman manipülasyonu
SONUÇ: Tek başına (c) DOĞRULANMAMIŞ İDDİA'dır; (a) ve (b) elenmeden
       'manipülasyon yapıldı' ifadesi kullanılamaz.`,
    },
    diagram: {
      title: "Manipülasyon tespitinin dayandığı bağımsız kaynaklar",
      nodes: [
        { label: "MFT", sub: "0x10 / 0x30" },
        { label: "USN Journal", sub: "Olay nedeni" },
        { label: "Event Log", sub: "Denetim UTC" },
        { label: "Prefetch", sub: "Çalıştırma" },
        { label: "NTP / TimeZone", sub: "Sistem saati" },
      ],
      note: "Tek kaynağa dayalı manipülasyon iddiası her zaman 'doğrulanmamış iddia' kalır.",
    },
    mistakes: [
      { wrong: "Zaman uyuşmazlığını görür görmez 'timestomp' demek.", why: "Saat senkron farkı, günlük gecikmesi ve saat dilimi hataları aynı tabloyu üretir. Alternatif açıklamalar elenmelidir." },
      { wrong: "Anti-forensics tespitini fail olarak sunmak.", why: "Manipülasyon girişimi kendi başına bir bulgudur; ancak silinen içeriğin varlığını veya amacını kanıtlamaz." },
      { wrong: "Şifreli arşivi 'gizlenen içerik' diye raporlamak.", why: "Şifreleme yasal ve yaygın bir işlemdir; içerik okunamıyorsa bu bir sınırlılıktır, kanıt değildir." },
    ],
    quiz: [
      { q: "Timestomp sonrası hangisi bağımsız olarak farklı kalabilir?", options: ["MFT C damgası", "USN Journal ve Prefetch kayıtları", "Dosya adı", "Boyut alanı"], answer: 1, explain: "Timestomp hedefi MFT alanlarını değiştirir; ancak USN Journal kaydı, Prefetch ve Event Log gibi bağımsız kaynaklar aynı olayın farklı zaman damgalarını taşımaya devam eder. Bu uyumsuzluk tespitin temelidir." },
      { q: "İncelenen sistemde denetim günlüğü silinmişse ne yapılır?", options: ["İnceleme durdurulur", "Diğer kaynaklar (SIEM, yedek, sistem günlükleri) devreye alınır ve sınırlılık raporlanır", "Silinmedi varsayılır", "Sonuç 'suçlu' yazılır"], answer: 1, explain: "Tek bir kaynağın kaybı, incelemeyi imkânsız kılmaz; alternatif kaynaklar aranır. Kayıp, bulgu değil, raporda sınırlılık (limitation) olarak açıkça belirtilir." },
    ],
    readings: [
      { title: "NIST SP 800-86 §4.3 — Handling anti-forensic techniques", note: "Çerçeve seviyesinde yaklaşım." },
      { title: "Carrier & Triga, Safewipe / Timestomp araştırması", note: "İmha tekniklerinin yapısal etkisi." },
    ],
  },
  {
    id: "L3-06",
    level: "advanced",
    order: 18,
    title: "Olay Yeniden Oluşturma ve Profesyonel Raporlama",
    titleEn: "Incident Reconstruction & Professional Reporting",
    summary:
      "Çoklu delil korelasyonu, güven düzeyi sınıflandırması, sınırlılıkların yazımı ve nesnel rapor dili.",
    minutes: 34,
    labModule: "H",
    objectives: [
      "Doğrudan gözlem / teknik doğrulanmış / destekleyici / dolaylı / doğrulanmamış iddia ayrımını uygulayabilmek.",
      "Çoklu kaynak korelasyonu ile ardışık olay dizisi kurabilmek.",
      "Raporda şüphe, gözlem, doğrulanmış bulgu ve yorumu ayrı ayrı yazabilmek.",
      "Sınırlılıklar bölümünde kapsam dışı kalan noktaları dürüstçe listelemek.",
    ],
    definition:
      "Olay yeniden oluşturma (Incident Reconstruction), farklı kaynaklardan elde edilen bulguların zaman ve ilişki ekseninde birleştirilerek olayların ardışık ve tutarlı bir kurgusunun çıkarılmasıdır. Raporlama ise bu kurgunun nesnel, denetlenebilir ve sınırlılıklarıyla birlikte sunulmasıdır.",
    principle: [
      "Korelasyon kuralı: İki veya daha bağımsız kaynak aynı zaman penceresinde aynı eylemi gösteriyorsa güven düzeyi yükselir.",
      "Sınıflandırma: Doğrudan gözlem → Teknik olarak doğrulanmış → Destekleyici bulgu → Dolaylı bulgu → Doğrulanmamış iddia.",
      "Rapor dili nesneldir: 'Erişim tespit edilmiştir' (gözlem) ile 'Kopyalanmıştır' (yorum) aynı cümlede birleştirilmez.",
      "Eksik bilgi uydurulmaz: Edinilmemiş delil envantere edinilmiş olarak yazmaz; hesaplanmamış hash raporda boş bırakılır.",
      "Her tarih tek standartta verilir: ISO 8601 ve ofset (örn. 2026-02-06T08:31:05+03:00 / 05:31:05Z).",
    ],
    why: [
      "Rapor, incelemenin hukuki ve kurumsal tek çıktısıdır; biçimi kadar içeriği de denetlenir.",
      "Aşırı yorum, tek bir itirazla tüm raporun güvenilirliğini düşürür.",
      "Sınırlılıkların açıkça yazılması, bilginin kalan kısmına güveni artırır.",
    ],
    how: [
      "1. Bulguları delil kimliğine ve kaynak kayda bağla.",
      "2. Güven düzeyini her bulgu için ayrı ayrı ata.",
      "3. Zaman çizelgesini tüm kaynaklardan UTC'ye çevirerek birleştir.",
      "4. Çelişkili kayıtları gizleme; ayrı satır olarak 'çelişkili' işaretle.",
      "5. Teknik değerlendirmeyi, kanaati ve sınırlılıkları ayrı bölümler yaz.",
      "6. Rapora yalnızca gerçekten gerçekleştirilmiş işlemleri ekle.",
    ],
    tools: [
      { name: "Timeline Explorer", desc: "Birleştirilmiş zaman çizelgesi incelemesi." },
      { name: "Stix/Maltego (kısmi)", desc: "İlişkilendirme görselleştirmesi." },
      { name: "AG CYBER LAB Rapor Motoru", desc: "Soruşturma veritabanından beslenen, PDF/Markdown/JSON dışa aktarım üreten motor." },
    ],
    realWorld: [
      "İç soruşturma ve hukuki bilirkişi raporları.",
      "Siber olay sonrası yönetim ve denetim raporlaması.",
      "Sigorta ve uyumluluk başvurularında teknik ekler.",
    ],
    example: {
      caption: "Aynı olayın üç farklı rapor diliyle ifadesi",
      code: `[YANLIŞ — yorum gözlemle karıştırılmış]
  "Kullanıcı belgeleri USB'ye kopyalamıştır."

[DOĞRU — gözlem ayrı, değerlendirme ayrı]
  GÖZLEM  : EV-002 cihazı 2026-02-06T05:14:03Z ile 06:02:55Z
            arasında WKS-FIN-017 sistemine bağlanmıştır (Event 2003/6416).
  GÖZLEM  : E: biriminde 05:31:04Z tarihinde 486.912 baytlık dosya
            oluşmuştur (USN FILE_CREATE).
  DEĞERLENDİRME : Bu iki kayıt aynı pencerededir ve destekleyici niteliktedir.
  SINIRLILIK : Dosya içeriğinin birebir eşleştiği, EV-002 üzerinde
            hash doğrulaması yapılmadığı için doğrulanmamıştır.`,
    },
    diagram: {
      title: "Rapor bölüm mimarisi",
      nodes: [
        { label: "Kapsam", sub: "Ne / Ne zaman" },
        { label: "Yöntem", sub: "Nasıl edinildi" },
        { label: "Bulgular", sub: "Güven düzeyi ile" },
        { label: "Korelasyon", sub: "Çoklu kaynak" },
        { label: "Sınırlılık", sub: "Neler doğrulanmadı" },
      ],
      note: "Sonuç ve kanaat bölümü, yalnızca 'doğrudan gözlem' ve 'teknik olarak doğrulanmış' bulgulara dayandırılmalıdır.",
    },
    mistakes: [
      { wrong: "Kanaati tek cümlede kesinleştirmek.", why: "Teknik değerlendirme, kanaat ve sınırlılık ayrı bölümlerde durmalı; aksi hâlde rapor tek bir zayıf noktadan tartışılır." },
      { wrong: "Edinilmemiş delili envantere eklemek.", why: "Eksik bilgi uydurulmamalıdır; envanter yalnızca gerçekten edinilmiş delilleri ve gerçek durumlarını içerir." },
      { wrong: "Çelişkili zaman kaydını sessizce düzeltmek.", why: "Çelişki gizlenmemeli; kayıt korunur, alternatif açıklama ve güven düzeyi belirtilir." },
    ],
    quiz: [
      { q: "'Doğrudan gözlem' seviyesindeki bir bulgu için doğru ifade hangisidir?", options: ["Kullanıcı veriyi çalmıştır", "Kayıtta 08:14:21 itibarıyla USB bağlantısı görünmektedir", "Kullanıcı kesinlikle niyetli davranmıştır", "Dosya imha edilmiştir"], answer: 1, explain: "Doğrudan gözlem, kaydın ne gösterdiğini olduğu gibi aktarır. 'Çalmıştır', 'niyetli davranmıştır' ifadeleri yorum ve niyet atfıdır; 'imha edilmiştir' ise doğrulanması gereken ayrı bir iddiadır." },
      { q: "Rapora yalnızca hangi deliller dahil edilir?", options: ["Tüm envanterdeki deliller", "Gerçekten edinilmiş ve durumu kayıt altına alınmış deliller", "İncelenmesi planlanan deliller", "Kullanıcının seçtikleri"], answer: 1, explain: "Rapor motoru yalnızca gerçekten edinilmiş delilleri; hash sonuçları yalnızca hesaplanmışsa; analiz sonuçları yalnızca gerçekleştirilmişse gösterir. Eksik bilgiler uydurulmaz." },
      { q: "İki bağımsız kaynak aynı olayı gösteriyorsa ne olur?", options: ["Bulgu otomatik olarak kesinleşir", "Güven düzeyi yükselir, ancak yine de ayrı ayrı raporlanır", "Kaynaklardan biri silinir", "Sonuç 'doğrulanmamış' kalır"], answer: 1, explain: "Korelasyon güveni artırır; ancak bulgular kaynaklarıyla birlikte ayrı satırlar olarak korunur. Otomatik olarak 'kesin' sonuca dönüşmez — kesinlik ayrı bir teknik doğrulama gerektirir." },
    ],
    readings: [
      { title: "NIST SP 800-86 §4–5 — Analysis and reporting", note: "Raporlama çerçevesi." },
      { title: "ISO/IEC 27037 §7 — Evidence preservation and reporting", note: "Muhafaza ve belgeleme önerileri." },
      { title: "SWGDE — Report Writing Guidelines", note: "Nesnel rapor dili önerileri." },
    ],
  },
];

export const getLesson = (id: string) => LESSONS.find((l) => l.id === id);
export const lessonsByLevel = (lv: Level) => LESSONS.filter((l) => l.level === lv).sort((a, b) => a.order - b.order);
export const lessonsForLab = (mod: string) => LESSONS.filter((l) => l.labModule === mod);
