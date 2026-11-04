/* ============================================================================
   Sentetik artefakt veri setleri — AG CYBER LAB
   Bütün kayıtlar kurgusaldır. Yerel saat dilimi: Europe/Istanbul (UTC+03:00).
   ==========================================================================*/

export const TZ = { local: "UTC+03:00", name: "Europe/Istanbul (TRT)" };

export const fmtLocal = (iso: string) => iso.replace("T", " ").replace(".000Z", "");

/* ------------------------------- WINDOWS EVENT LOGS --------------------- */
export type EventRow = {
  id: string;
  caseId: string;
  utc: string;
  local: string;
  eventId: number;
  channel: "Security" | "System" | "Application";
  provider: string;
  level: "Bilgi" | "Uyarı" | "Hata" | "Kritik";
  computer: string;
  user: string;
  ip: string;
  logonType: string;
  message: string;
  suspicion: boolean;
};

export const EVENT_LOGS: EventRow[] = [
  { id: "E-1001", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:14:19.000Z", local: "2026-02-06 08:14:19", eventId: 4648, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\m.kaya", ip: "10.20.4.117", logonType: "3", message: "Açık (explicit) kimlik bilgileri kullanılarak oturum açma girişimi. Hedef: WKS-FIN-017", suspicion: false },
  { id: "E-1002", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:14:03.000Z", local: "2026-02-06 08:14:03", eventId: 6416, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "—", ip: "—", logonType: "—", message: "Yeni bir dış cihaz sınıfı tanımlandı: USBSTOR\\Disk&Ven_Kingston&Prod_DataTraveler_100_G3/G4", suspicion: true },
  { id: "E-1003", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:14:21.000Z", local: "2026-02-06 08:14:21", eventId: 2003, channel: "System", provider: "Microsoft-Windows-DriverFrameworks-UserMode", level: "Bilgi", computer: "WKS-FIN-017", user: "—", ip: "—", logonType: "—", message: "USB aygıtı takıldı ve çalışır duruma geldi. VID_0951&PID_1666, seri no 08606E215C7B2F113E9A", suspicion: true },
  { id: "E-1004", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:14:40.000Z", local: "2026-02-06 08:14:40", eventId: 4624, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\s.demir", ip: "10.20.4.117", logonType: "2 (Etkileşimli)", message: "Başarılı oturum açma. Hesap: s.demir, GUID {a1f3…}", suspicion: false },
  { id: "E-1005", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:22:47.000Z", local: "2026-02-06 08:22:47", eventId: 4663, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\s.demir", ip: "—", logonType: "—", message: "Dosya nesnesine erişim: C:\\FIN\\Q1_Butce_Gizli.xlsx (İşlem: ReadData)", suspicion: true },
  { id: "E-1006", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:30:12.000Z", local: "2026-02-06 08:30:12", eventId: 4663, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\s.demir", ip: "—", logonType: "—", message: "Dosya nesnesine yazma: E:\\Q1_Butce_Gizli.xlsx (İşlem: AppendData / hedef harici birim)", suspicion: true },
  { id: "E-1007", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T05:47:10.000Z", local: "2026-02-06 08:47:10", eventId: 5156, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\s.demir", ip: "10.20.4.117", logonType: "—", message: "Windows Filtering Platform bağlantı izni verildi: chrome.exe → 198.51.100.24:443 (filesend.example.com)", suspicion: true },
  { id: "E-1008", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T06:02:55.000Z", local: "2026-02-06 09:02:55", eventId: 6416, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "—", ip: "—", logonType: "—", message: "USB aygıtının dış sınıf kaydı güncellendi (son bağlantı sona erdi).", suspicion: true },
  { id: "E-1009", caseId: "AG-DFIR-2026-001", utc: "2026-02-06T07:12:04.000Z", local: "2026-02-06 10:12:04", eventId: 4634, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-FIN-017", user: "AGSISTEM\\s.demir", ip: "—", logonType: "2", message: "Oturum kapatıldı. Süre: 01:57:24", suspicion: false },

  { id: "E-2001", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T22:47:03.000Z", local: "2026-02-14 01:47:03", eventId: 4624, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "SRV-DC02", user: "AGSISTEM\\a.yildiz", ip: "10.20.9.44", logonType: "10 (Uzak Masaüstü)", message: "Başarılı uzak oturum açma (RDP). Hesap: a.yildiz", suspicion: true },
  { id: "E-2002", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T23:11:52.000Z", local: "2026-02-14 02:11:52", eventId: 4625, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Uyarı", computer: "SRV-DC02", user: "AGSISTEM\\admin", ip: "203.0.113.87", logonType: "3", message: "Başarısız oturum açma denemesi. Hata: 0xC000006A (yanlış parola). Ardışık deneme: 1/8", suspicion: true },
  { id: "E-2003", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T23:12:31.000Z", local: "2026-02-14 02:12:31", eventId: 4625, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Uyarı", computer: "SRV-DC02", user: "AGSISTEM\\admin", ip: "203.0.113.87", logonType: "3", message: "Başarısız oturum açma denemesi. Ardışık deneme: 2/8", suspicion: true },
  { id: "E-2004", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T23:13:44.000Z", local: "2026-02-14 02:13:44", eventId: 4625, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Uyarı", computer: "SRV-DC02", user: "AGSISTEM\\admin", ip: "203.0.113.87", logonType: "3", message: "Başarısız oturum açma denemesi. Ardışık deneme: 3/8", suspicion: true },
  { id: "E-2005", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T23:31:07.000Z", local: "2026-02-14 02:31:07", eventId: 4624, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "SRV-DC02", user: "AGSISTEM\\svc.backup", ip: "10.20.9.12", logonType: "5 (Hizmet)", message: "Başarılı oturum açma. Zamanlanmış iş hesabı.", suspicion: false },
  { id: "E-2006", caseId: "AG-DFIR-2026-003", utc: "2026-02-13T23:47:59.000Z", local: "2026-02-14 02:47:59", eventId: 4688, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "SRV-DC02", user: "AGSISTEM\\a.yildiz", ip: "—", logonType: "—", message: "Yeni işlem oluşturuldu: C:\\Windows\\System32\\rundll32.exe (Komut satırı denetimi etkin değil)", suspicion: true },
  { id: "E-2007", caseId: "AG-DFIR-2026-003", utc: "2026-02-14T00:04:12.000Z", local: "2026-02-14 03:04:12", eventId: 1102, channel: "Security", provider: "Microsoft-Windows-Audit-Security", level: "Kritik", computer: "SRV-DC02", user: "AGSISTEM\\a.yildiz", ip: "—", logonType: "—", message: "Güvenlik denetim günlüğü temizlendi. Kayıt: {c5b2…}. Olay sonrasında eski kayıtlar bu günlükte mevcut değildir.", suspicion: true },
  { id: "E-2008", caseId: "AG-DFIR-2026-003", utc: "2026-02-14T00:31:18.000Z", local: "2026-02-14 03:31:18", eventId: 4634, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "SRV-DC02", user: "AGSISTEM\\a.yildiz", ip: "—", logonType: "10", message: "Uzak oturum kapatıldı. Süre: 00:44:15", suspicion: true },
  { id: "E-2009", caseId: "AG-DFIR-2026-002", utc: "2026-02-11T07:20:00.000Z", local: "2026-02-11 10:20:00", eventId: 4624, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-HR-004", user: "AGSISTEM\\e.arslan", ip: "10.20.4.52", logonType: "2", message: "Başarılı etkileşimli oturum açma.", suspicion: false },
  { id: "E-2010", caseId: "AG-DFIR-2026-002", utc: "2026-02-11T07:44:12.000Z", local: "2026-02-11 10:44:12", eventId: 4663, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-HR-004", user: "AGSISTEM\\e.arslan", ip: "—", logonType: "—", message: "Dosya nesnesine Delete işlemi: C:\\HR\\Sözleşme_2024_Taslak.pdf", suspicion: true },
  { id: "E-2011", caseId: "AG-DFIR-2026-002", utc: "2026-02-11T07:51:30.000Z", local: "2026-02-11 10:51:30", eventId: 4688, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-HR-004", user: "AGSISTEM\\e.arslan", ip: "—", logonType: "—", message: "Yeni işlem oluşturuldu: C:\\Windows\\System32\\cipher.exe /w:C:\\Unallocated", suspicion: true },
  { id: "E-2012", caseId: "AG-DFIR-2026-004", utc: "2026-02-16T09:31:04.000Z", local: "2026-02-16 12:31:04", eventId: 4624, channel: "Security", provider: "Microsoft-Windows-Security-Auditing", level: "Bilgi", computer: "WKS-MKT-031", user: "AGSISTEM\\b.ozkan", ip: "10.20.4.88", logonType: "2", message: "Başarılı etkileşimli oturum açma.", suspicion: false },
];

export const EVENT_ID_DEFS: { id: number; name: string; proves: string; doesNotProve: string }[] = [
  { id: 4624, name: "Başarılı oturum açma", proves: "Belirli bir hesabın, belirtilen türde bir oturumun belirtilen kaynaktan başarıyla açıldığını gösterir.", doesNotProve: "Oturumu açanın gerçekten o kişi olduğunu kanıtlamaz; yetkisiz erişim veya kimlik bilgisi paylaşımı ihtimalini dışlamaz." },
  { id: 4625, name: "Başarısız oturum açma", proves: "Belirli bir hedefe başarısız deneme yapıldığını ve hata kodunu gösterir.", doesNotProve: "Denemeyi yapanın kimliğini göstermez; brute-force olduğunu tek başına kanıtlaz (istatistiksel ardışıklık gerekir)." },
  { id: 4634, name: "Oturum kapatma", proves: "Belirli bir oturumun sona erdiğini ve süresini gösterir.", doesNotProve: "Kapatmayı yapan kullanıcının niyetini ya da oturum sırasındaki işlemleri açıklamaz." },
  { id: 4648, name: "Açık kimlik bilgisiyle oturum açma", proves: "Bir oturumun başka kimlik bilgileri açıkça girilerek açıldığını gösterir (runas, ağ kaynakları).", doesNotProve: "Kimlik bilgilerinin zorla alındığını ya da kötü niyet kullanıldığını kanıtlaz." },
  { id: 4688, name: "Yeni işlem oluşturulması", proves: "İlgili denetim yapılandırması etkinse hangi işlemin hangi komut satırıyla oluştuğunu gösterir.", doesNotProve: "Komut satırı denetimi kapalıysa argümanlar görünmez; işlemin kullanıcı niyetini açıklamaz." },
  { id: 1102, name: "Denetim günlüğünün temizlenmesi", proves: "Güvenlik günlüğünün silindiğini ve silme anını kaydeder (kendi kaydı kalır).", doesNotProve: "Neyin silindiğini göstermez; silme yetkili bir yönetim işlemi de olabilir." },
  { id: 4663, name: "Nesneye erişim", proves: "Belirli bir nesnenin (dosya/klasör) hangi işleminin denetlendiğini gösterir.", doesNotProve: "İçeriğin kopyalanıp kopyalanmadığını; yalnızca erişim türünden çıkarım yapılabilir." },
];

/* ---------------------------------- USB ---------------------------------- */
export type UsbDevice = {
  deviceId: string;
  caseId: string;
  vid: string;
  pid: string;
  vendor: string;
  product: string;
  serial: string;
  capacity: string;
  firstSeen: string;
  lastSeen: string;
  friendlyName: string;
  connections: { utc: string; local: string; event: string; detail: string; registry: string }[];
};

export const USB_DEVICES: UsbDevice[] = [
  {
    deviceId: "USB-VID-001",
    caseId: "AG-DFIR-2026-001",
    vid: "0951",
    pid: "1666",
    vendor: "Kingston Technology",
    product: "DataTraveler 100 G3/G4 (64 GB)",
    serial: "08606E215C7B2F113E9A",
    capacity: "64 GB",
    firstSeen: "2026-02-06 08:14:03",
    lastSeen: "2026-02-06 09:02:55",
    friendlyName: "KingstonDataTraveler3.0",
    connections: [
      { utc: "2026-02-06T05:14:03.000Z", local: "2026-02-06 08:14:03", event: "Bağlantı kuruldu", detail: "SYSTEM\\CurrentControlSet\\Enum\\USBSTOR\\disk&ven_kingston&prod_datatraveler_100_g3_g4&rev_1.00\\4c530001112019010913&0", registry: "HKLM\\SYSTEM\\MountedDevices: \\DosDevices\\E:" },
      { utc: "2026-02-06T05:14:21.000Z", local: "2026-02-06 08:14:21", event: "Sürücü yüklenmesi", detail: "Event 2003 — VID_0951&PID_1666 seri 08606E215C7B2F113E9A", registry: "HKLM\\SYSTEM\\CurrentControlSet\\Services\\disk\\Enum" },
      { utc: "2026-02-06T05:14:24.000Z", local: "2026-02-06 08:14:24", event: "Bağlantı noktası", detail: "Kullanıcı SID S-1-5-21-…-1123 altında MountPoints2 girdisi oluştu", registry: "HKCU\\…\\Explorer\\MountPoints2\\{a9f3c1d0-…}" },
      { utc: "2026-02-06T05:31:05.000Z", local: "2026-02-06 08:31:05", event: "Dosya yazma izi", detail: "E: birimine NTFS USN Journal kaydı: FILE_CREATE + DATA_OVERWRITE", registry: "HKCU\\…\\Explorer\\RecentDocs\\\\.xlsx" },
      { utc: "2026-02-06T06:02:55.000Z", local: "2026-02-06 09:02:55", event: "Bağlantı sona erdi", detail: "Cihaz kaldırıldı; Device Removal Event kaydedildi", registry: "HKCU\\…\\Explorer\\MountPoints2 (girdi kalır)" },
    ],
  },
  {
    deviceId: "USB-VID-002",
    caseId: "AG-DFIR-2026-001",
    vid: "0781",
    pid: "5581",
    vendor: "SanDisk Corp.",
    product: "Ultra Flair (32 GB)",
    serial: "4C530001112019010913",
    capacity: "32 GB",
    firstSeen: "2026-01-19 11:02:44",
    lastSeen: "2026-01-19 11:48:10",
    friendlyName: "SanDisk Ultra Flair",
    connections: [
      { utc: "2026-01-19T08:02:44.000Z", local: "2026-01-19 11:02:44", event: "Bağlantı kuruldu", detail: "IT departmanı tarafından yazma denemesi (Yetkili)", registry: "HKCU\\…\\Explorer\\MountPoints2\\{7d1a…}" },
      { utc: "2026-01-19T08:48:10.000Z", local: "2026-01-19 11:48:10", event: "Bağlantı sona erdi", detail: "Sorunsuz kaldırma", registry: "—" },
    ],
  },
];

/* -------------------------------- BROWSER -------------------------------- */
export type BrowserRow = { id: string; utc: string; local: string; type: string; target: string; detail: string; title: string };

export const BROWSER_HISTORY: BrowserRow[] = [
  { id: "H-01", utc: "2026-02-06T05:28:41.000Z", local: "2026-02-06 08:28:41", type: "Arama", target: "google.com/search?q=xlsx+şirket+dışına+aktarma", detail: "Sorgu: xlsx şirket dışına aktarma", title: "Arama sonucu sayfası" },
  { id: "H-02", utc: "2026-02-06T05:29:57.000Z", local: "2026-02-06 08:29:57", type: "Ziyaret", target: "support.example.org/kb/usb-transfer-policy", detail: "Kalış süresi: 41 sn", title: "Kurum içi USB aktarım politikası" },
  { id: "H-03", utc: "2026-02-06T05:33:41.000Z", local: "2026-02-06 08:33:41", type: "Arama", target: "bing.com/search?q=gizli+belge+bulut+servisine+yükleme", detail: "Sorgu: gizli belge bulut servisine yükleme", title: "Arama sonucu sayfası" },
  { id: "H-04", utc: "2026-02-06T05:47:02.000Z", local: "2026-02-06 08:47:02", type: "Ziyaret", target: "filesend.example.com/upload", detail: "Kalış süresi: 6 dk 12 sn", title: "Dosya paylaşım portalı — Yükleme" },
  { id: "H-05", utc: "2026-02-06T05:49:20.000Z", local: "2026-02-06 08:49:20", type: "Ziyaret", target: "filesend.example.com/pricing", detail: "Kalış süresi: 1 dk 03 sn", title: "Planlar ve fiyatlar" },
  { id: "H-06", utc: "2026-02-06T06:05:33.000Z", local: "2026-02-06 09:05:33", type: "Ziyaret", target: "intranet.agorn.local/bordro", detail: "Kalış süresi: 3 dk 40 sn", title: "Kurum içi bordro sayfası" },
  { id: "H-07", utc: "2026-02-05T13:10:02.000Z", local: "2026-02-05 16:10:02", type: "Ziyaret", target: "news.example.net/technology", detail: "Kalış süresi: 2 dk 11 sn", title: "Teknoloji haberleri" },
];

export const BROWSER_DOWNLOADS: BrowserRow[] = [
  { id: "D-01", utc: "2026-02-06T05:36:12.000Z", local: "2026-02-06 08:36:12", type: "İndirme", target: "C:\\Users\\s.demir\\Downloads\\butce_sablon_2026.xlsx", detail: "Kaynak: intranet.agorn.local • 248 KB • tamamlandı", title: "butce_sablon_2026.xlsx" },
  { id: "D-02", utc: "2026-02-06T05:52:19.000Z", local: "2026-02-06 08:52:19", type: "İndirme", target: "C:\\Users\\s.demir\\Downloads\\musteri_listesi.csv", detail: "Kaynak: intranet.agorn.local • 1,2 MB • tamamlandı", title: "musteri_listesi.csv" },
  { id: "D-03", utc: "2026-02-04T10:04:00.000Z", local: "2026-02-04 13:04:00", type: "İndirme", target: "C:\\Users\\s.demir\\Downloads\\adobe_reader_setup.exe", detail: "Kaynak: get.adobe.example • 64,8 MB • tamamlandı", title: "adobe_reader_setup.exe" },
];

export const BROWSER_COOKIES = [
  { name: "FSEND_SESSION", domain: "filesend.example.com", expires: "2026-03-08", created: "2026-02-06 08:47:04", note: "Oturum çerezi — portal oturumu açıldığını gösterir" },
  { name: "AG_INTRANET", domain: "intranet.agorn.local", expires: "2026-02-07", created: "2026-02-06 07:58:44", note: "Kurum içi oturum" },
  { name: "_ga", domain: "news.example.net", expires: "2027-01-01", created: "2026-02-05 16:10:05", note: "Analitik çerezi" },
];

/* ------------------------------ FILE SYSTEM ------------------------------ */
export type FileRow = {
  id: string;
  path: string;
  name: string;
  size: number;
  type: string;
  created: string;
  modified: string;
  accessed: string;
  mftChanged: string;
  deleted: boolean;
  recoverable: "kesin" | "kosullu" | "yok";
  contentPreview?: string;
  note: string;
  suspicious?: boolean;
};

export const FILE_SYSTEM: FileRow[] = [
  { id: "F-01", path: "C:\\FIN", name: "FIN", size: 0, type: "Klasör", created: "2025-11-02 09:14:00", modified: "2026-02-06 08:22:47", accessed: "2026-02-06 08:22:47", mftChanged: "2026-02-06 08:22:47", deleted: false, recoverable: "yok", note: "Departman klasörü. En son MFT değişikliği iddia edilen erişim anıyla eşleşiyor." },
  { id: "F-02", path: "C:\\FIN\\Q1_Butce_Gizli.xlsx", name: "Q1_Butce_Gizli.xlsx", size: 486912, type: "Excel Çalışma Kitabı", created: "2026-01-08 14:02:11", modified: "2026-02-05 17:41:09", accessed: "2026-02-06 08:22:47", mftChanged: "2026-02-06 08:22:47", deleted: false, recoverable: "yok", contentPreview: "Sheet1: 'Q1 Bütçe — GİZLİ' | Sütunlar: Kalem, Birim, Tutar, Onay", note: "A erişim zamanı dosyanın o an açıldığını gösterir.", suspicious: true },
  { id: "F-03", path: "C:\\FIN\\Satinalma_Sozlesmeleri_2026.pdf", name: "Satinalma_Sozlesmeleri_2026.pdf", size: 2214880, type: "PDF Belgesi", created: "2026-01-27 11:30:00", modified: "2026-02-02 15:10:44", accessed: "2026-02-06 08:23:19", mftChanged: "2026-02-06 08:23:19", deleted: false, recoverable: "yok", contentPreview: "%PDF-1.7 / 42 sayfa / Gömülü ek: imza_sayfasi.png", note: "İkinci belge erişimi; MFT changed damgası 32 sn sonra.", suspicious: true },
  { id: "F-04", path: "C:\\Users\\s.demir\\Desktop\\notlar.txt", name: "notlar.txt", size: 1284, type: "Metin", created: "2026-02-06 08:19:02", modified: "2026-02-06 08:20:55", accessed: "2026-02-06 08:20:55", mftChanged: "2026-02-06 08:20:55", deleted: false, recoverable: "yok", contentPreview: "q1 butce – e: ye at\nsözleşmeler de\npanelden bakılacak", note: "Kullanıcı notu. Kopyalama niyetine işaret eden destekleyici (dolaylı) bir bulgudur; tek başına kopyalamayı kanıtlamaz.", suspicious: true },
  { id: "F-05", path: "E:\\Q1_Butce_Gizli.xlsx", name: "Q1_Butce_Gizli.xlsx", size: 486912, type: "Excel Çalışma Kitabı (harici birim)", created: "2026-02-06 08:31:04", modified: "2026-02-06 08:31:05", accessed: "2026-02-06 08:31:05", mftChanged: "2026-02-06 08:31:05", deleted: false, recoverable: "yok", contentPreview: "Aynı boyut: 486912 bayt", note: "Kaynak dosya ile birebir boyut eşleşmesi. Delil EV-002 üzerinde ayrıca hash doğrulaması gerekir.", suspicious: true },
  { id: "F-06", path: "C:\\Users\\s.demir\\Documents\\Aday_Arac_Talebi.docx", name: "Aday_Arac_Talebi.docx", size: 33290, type: "Word Belgesi", created: "2025-12-14 10:03:00", modified: "2026-01-06 09:22:11", accessed: "2026-01-22 14:09:00", mftChanged: "2026-01-22 14:09:00", deleted: false, recoverable: "yok", note: "İlgisiz belge — kontrol amaçlı dahil edildi." },
  { id: "F-07", path: "C:\\Users\\s.demir\\AppData\\Local\\Temp\\~tmpA91.docx", name: "~tmpA91.docx", size: 40960, type: "Geçici dosya", created: "2026-02-06 08:24:02", modified: "2026-02-06 08:24:40", accessed: "2026-02-06 08:24:40", mftChanged: "2026-02-06 08:24:40", deleted: false, recoverable: "yok", note: "Word geçici kopyası. Kaynak belgenin açık kaldığını gösterir." },
  { id: "F-08", path: "C:\\FIN\\Eski_Ortak_Sozlesme.pdf", name: "Eski_Ortak_Sozlesme.pdf", size: 0, type: "PDF Belgesi (silinmiş)", created: "2025-09-11 16:44:00", modified: "2026-02-06 08:35:12", accessed: "2026-02-06 08:35:12", mftChanged: "2026-02-06 08:35:12", deleted: true, recoverable: "kosullu", contentPreview: "MFT kaydı: 0x01 (in use = 0) • $Bitmap ilk 8 KB boş", note: "MFT kaydı serbest, ilk cluster bloğu overwrite edilmemiş. Kurtarma olası ancak içerik bütünlüğü hash ile doğrulanamaz.", suspicious: true },
  { id: "F-09", path: "C:\\FIN\\\\$Recycle.Bin\\S-1-5-21…-1123\\$R8F2A1.xlsx", name: "$R8F2A1.xlsx", size: 486912, type: "Geri dönüşüm (silinmiş)", created: "2026-02-06 08:36:44", modified: "2026-02-06 08:36:44", accessed: "2026-02-06 08:36:44", mftChanged: "2026-02-06 08:36:44", deleted: true, recoverable: "kesin", contentPreview: "$I girdisi: orijinal yol C:\\FIN\\Eski_Ortak_Sozlesme.pdf", note: "Geri dönüşüm kasasında $I/$R çifti tam. Orijinal yol ve silinme zamanı okunabilir.", suspicious: true },
  { id: "F-10", path: "C:\\Users\\Public\\arşiv_2024.part1.rar", name: "arşiv_2024.part1.rar", size: 73400320, type: "RAR arşivi", created: "2026-02-06 08:41:19", modified: "2026-02-06 08:41:19", accessed: "2026-02-06 08:41:19", mftChanged: "2026-02-06 08:41:19", deleted: false, recoverable: "yok", contentPreview: "Rar!\\x1a\\x07\\x01\\x00 — parola korumalı (RAR5)", note: "Klasörde beklenmedik arşiv dosyası. İçerik parola korumalıdır; adli açılış için ek araç gerekir.", suspicious: true },
  { id: "F-11", path: "C:\\Windows\\Prefetch\\EXCEL.EXE-8F3A2B1C.pf", name: "EXCEL.EXE-8F3A2B1C.pf", size: 18432, type: "Prefetch", created: "2026-02-06 08:22:44", modified: "2026-02-06 08:36:50", accessed: "2026-02-06 08:36:50", mftChanged: "2026-02-06 08:36:50", deleted: false, recoverable: "yok", contentPreview: "Run count: 47 • Son 3 çalıştırma: 08:22:44, 08:36:49, 09:05:31", note: "Excel'in o sabah çalıştırıldığını bağımsız olarak doğrular.", suspicious: false },
];

/* --------------------------------- MEMORY -------------------------------- */
export const MEMORY_PROCESSES = [
  { pid: 4128, ppid: 664, name: "explorer.exe", user: "AGSISTEM\\s.demir", cmd: "C:\\Windows\\explorer.exe", start: "2026-02-06 07:58:12", verdict: "normal" },
  { pid: 5984, ppid: 4128, name: "EXCEL.EXE", user: "AGSISTEM\\s.demir", cmd: "EXCEL.EXE /x \"C:\\FIN\\Q1_Butce_Gizli.xlsx\"", start: "2026-02-06 08:22:44", verdict: "normal" },
  { pid: 7312, ppid: 4128, name: "rundll32.exe", user: "AGSISTEM\\s.demir", cmd: "rundll32.exe C:\\Users\\Public\\arşiv_2024.part1.rar,RunDLL", start: "2026-02-06 08:42:03", verdict: "şüpheli" },
  { pid: 7444, ppid: 7312, name: "svchost.exe", user: "AGSISTEM\\s.demir", cmd: "svchost.exe -k netsvcs -p", start: "2026-02-06 08:42:07", verdict: "şüpheli" },
  { pid: 9012, ppid: 664, name: "chrome.exe", user: "AGSISTEM\\s.demir", cmd: "chrome.exe --type=browser", start: "2026-02-06 07:58:41", verdict: "normal" },
  { pid: 1180, ppid: 664, name: "services.exe", user: "SYSTEM", cmd: "C:\\Windows\\System32\\services.exe", start: "2026-02-06 07:51:00", verdict: "normal" },
];

export const MEMORY_MODULES = [
  { pid: 7444, base: "0x00007FF8A12B0000", size: 184320, path: "C:\\Users\\Public\\tmpdrv.dll", sha1: "b71f…9c02", verdict: "İmzasız / bilinmeyen" },
  { pid: 7444, base: "0x00007FF89F000000", size: 1048576, path: "C:\\Windows\\System32\\ntdll.dll", sha1: "4a11…7d5e", verdict: "Doğal" },
  { pid: 7312, base: "0x00007FF6C0120000", size: 524288, path: "C:\\Windows\\System32\\rundll32.exe", sha1: "e9c4…1b83", verdict: "Doğal" },
  { pid: 9012, base: "0x00007FF6D4000000", size: 6291456, path: "C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe", sha1: "22fa…8e41", verdict: "Doğal" },
];

export const MEMORY_NETSTAT = [
  { pid: 9012, proto: "TCP", laddr: "10.20.4.117:51422", raddr: "198.51.100.24:443", state: "ESTABLISHED", process: "chrome.exe" },
  { pid: 7444, proto: "TCP", laddr: "10.20.4.117:49811", raddr: "203.0.113.87:4444", state: "ESTABLISHED", process: "svchost.exe" },
  { pid: 4128, proto: "UDP", laddr: "10.20.4.117:5353", raddr: "0.0.0.0:0", state: "-", process: "explorer.exe" },
];

/* ---------------------------------- PCAP --------------------------------- */
export const PCAP_FLOWS = [
  { no: 1, utc: "2026-02-20T21:14:02.118Z", local: "2026-02-21 00:14:02", src: "10.20.4.117", sport: 49712, dst: "203.0.113.87", dport: 443, proto: "TLSv1.3", len: 517, sni: "cdn-drop.example.net", flags: "PSH,ACK", note: "SNI açık; içerik şifreli." },
  { no: 2, utc: "2026-02-20T21:14:02.141Z", local: "2026-02-21 00:14:02", src: "203.0.113.87", sport: 443, dst: "10.20.4.117", dport: 49712, proto: "TLSv1.3", len: 1448, sni: "—", flags: "PSH,ACK", note: "Sunucu yanıtı." },
  { no: 3, utc: "2026-02-20T21:14:03.006Z", local: "2026-02-21 00:14:03", src: "10.20.4.117", sport: 49713, dst: "10.20.0.10", dport: 53, proto: "DNS", len: 78, sni: "cdn-drop.example.net", flags: "QUERY", note: "A sorgusu — yanıt 203.0.113.87." },
  { no: 4, utc: "2026-02-20T21:14:03.219Z", local: "2026-02-21 00:14:03", src: "10.20.4.117", sport: 49714, dst: "10.20.0.10", dport: 53, proto: "DNS", len: 82, sni: "mail-agg.example.org", flags: "QUERY", note: "A sorgusu." },
  { no: 5, utc: "2026-02-20T21:14:05.882Z", local: "2026-02-21 00:14:05", src: "10.20.4.117", sport: 49720, dst: "198.51.100.24", dport: 80, proto: "HTTP", len: 641, sni: "—", flags: "PSH,ACK", note: "POST /u/1a2b — istek başlıkları okunabilir (şifresiz)." },
  { no: 6, utc: "2026-02-20T21:14:06.014Z", local: "2026-02-21 00:14:06", src: "198.51.100.24", sport: 80, dst: "10.20.4.117", dport: 49720, proto: "HTTP", len: 221, sni: "—", flags: "PSH,ACK", note: "HTTP/1.1 200 OK" },
  { no: 7, utc: "2026-02-20T21:14:09.447Z", local: "2026-02-21 00:14:09", src: "10.20.4.117", sport: 49731, dst: "203.0.113.87", dport: 4444, proto: "TCP", len: 60, sni: "—", flags: "SYN", note: "El sıkışma başladı — hedef port 4444." },
  { no: 8, utc: "2026-02-20T21:14:09.502Z", local: "2026-02-21 00:14:09", src: "203.0.113.87", sport: 4444, dst: "10.20.4.117", dport: 49731, proto: "TCP", len: 60, sni: "—", flags: "SYN,ACK", note: "Bağlantı kabul edildi." },
  { no: 9, utc: "2026-02-20T21:14:09.558Z", local: "2026-02-21 00:14:09", src: "10.20.4.117", sport: 49731, dst: "203.0.113.87", dport: 4444, proto: "TCP", len: 54, sni: "—", flags: "ACK", note: "Bağlantı kuruldu." },
  { no: 10, utc: "2026-02-20T21:14:11.903Z", local: "2026-02-21 00:14:11", src: "10.20.4.117", sport: 49731, dst: "203.0.113.87", dport: 4444, proto: "TCP", len: 1182, sni: "—", flags: "PSH,ACK", note: "Giden veri — içerik şifreli/ağır, salt okunamaz." },
  { no: 11, utc: "2026-02-20T21:19:44.071Z", local: "2026-02-21 00:19:44", src: "10.20.4.117", sport: 49740, dst: "10.20.0.10", dport: 53, proto: "DNS", len: 84, sni: "update.sync-cache.example", flags: "QUERY", note: "Nadir görülen alan adı — 7 günlük pencerede 3 kez." },
  { no: 12, utc: "2026-02-20T21:19:44.288Z", local: "2026-02-21 00:19:44", src: "10.20.0.10", sport: 53, dst: "10.20.4.117", dport: 49741, proto: "DNS", len: 94, sni: "—", flags: "RESPONSE", note: "Yanıt: 203.0.113.87 (aynı IP bloğu)." },
];
