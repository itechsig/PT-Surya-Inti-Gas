/**
 * Katalog jenis & tipe Cryogenic Valve untuk halaman detail produk "Valve"
 * (kategori Peralatan Pendukung Gas Industri). Data ini statis di frontend karena
 * berupa daftar referensi tipe/model, bukan produk yang dikelola lewat CMS.
 */

export interface ValveEntry {
  /** Slug unik untuk key React & state aktif. */
  id: string;
  /** Nama jenis valve, ditampilkan di daftar. */
  name: string;
  /** Penjelasan umum tentang fungsi & aplikasi jenis valve ini. */
  description: string;
  /** Daftar kode tipe/model, satu baris sesuai pengelompokan pada katalog. */
  models: string[];
}

/** 8 jenis valve utama yang langsung menampilkan daftar tipe saat diklik. */
export const VALVE_CATEGORIES: ValveEntry[] = [
  {
    id: "cryogenic-globe-valve",
    name: "Cryogenic Globe Valve",
    description:
      "Valve serba guna untuk membuka/menutup dan mengatur aliran liquid cryogenic (LOX, LIN, LAR, LCO2, LNG). Menggunakan bonnet yang diperpanjang (extended bonnet) agar packing/seal tetap berada jauh dari suhu ekstrem dingin, sehingga aman dioperasikan dengan handwheel manual maupun aktuator pneumatik. Umum dipasang pada jalur pipa tangki penyimpanan, vaporizer, dan stasiun pengisian.",
    models: [
      "DJ-10~DJ-50 / DJ-15P~DJ-25P / DJ-10(G)~DJ-50(G)",
      "DJ-10A~DJ-50A / DJ-15K~DJ-50K",
      "DJ-10AL~DJ-50KL",
      "DJ-10(NPT)~DJ-40(NPT)",
      "DJ-10G~DJ-50G / DJ-10GY~DJ-50GY",
      "DJ-10GA~DJ-50GA / DJ-15GK~DJ-50GK",
      "DJ-10NPT~DJ-40NPT",
      "DJ-65A1~DJ-100C1",
      "DJ-65B1~DJ-100B1",
      "DJ-65G1~DJ-100GC1",
      "DJ-10.99.xxx~DJ-50.99.xxx",
      "DJ-10P.01.01~DJ-10P.01.03",
      "DJ-10P.02.01~DJ-10P.02.03",
    ],
  },
  {
    id: "cryogenic-check-valve",
    name: "Cryogenic Check Valve",
    description:
      "Valve satu arah (non-return) yang mencegah aliran balik liquid cryogenic. Dipasang pada jalur keluar pompa dan vaporizer untuk melindungi pompa/kompresor dari kerusakan akibat aliran balik serta menjaga tekanan sistem tetap stabil.",
    models: [
      "DH-10~DH-50 / DH-10Y~DH-50Y",
      "DH-10A~DH-50A / DH-15K~DH-50K",
      "DH-10NPT~DH-20NPT",
      "DHX-10~DHX-40",
      "DH-65~DH-100C",
      "DH-65B~DH-100B",
      "H1501",
      "DH-10.99.xx~DH-50.99.xx",
    ],
  },
  {
    id: "emergency-shut-off-valve",
    name: "Emergency Shut-off Valve",
    description:
      "Valve penutup darurat (fail-safe) yang dapat menutup aliran cryogenic secara cepat, baik dipicu manual maupun otomatis (misalnya oleh sensor suhu/benturan). Dipasang pada tangki penyimpanan, mobil tangki, dan stasiun pengisian untuk menghentikan aliran seketika saat terjadi kebocoran, kebakaran, atau benturan, sehingga menjadi salah satu perangkat keselamatan utama pada sistem gas cair.",
    models: [
      "DJQ-15B2~DJQ-50B2 / DJQ-15Y2~DJQ-50Y2",
      "DJQ-15A2~DJQ-50A2 / DJQ-15K2~DJQ-50K2",
      "DJQ-65B2~DJQ-100B2",
      "DJQ-65C2~DDJQ-100C2",
      "DJQ-25GE~DJQ-50GE",
      "DJQC-15~DJQC-25",
    ],
  },
  {
    id: "cryogenic-regulator",
    name: "Cryogenic Regulator",
    description:
      "Valve pengatur/penurun tekanan yang menjaga tekanan keluaran tangki atau vaporizer tetap berada pada rentang yang ditentukan, sehingga pasokan gas ke jalur pipa pelanggan tetap stabil. Dipakai pada jalur pressure-building maupun jalur pemakaian (use pressure) tangki cryogenic.",
    models: [
      "DYS-15B~DYS-15B2",
      "DYS-20~DYS-20A1",
      "DYZ-20A~DYZ-20A1",
      "DYS-25~DYS-25A2",
      "DYS-40~DYS-40A4",
      "DYS-50~DYS-50A",
      "DYS-50C~DYS-50C1",
      "TZ-15.99.01~TZ-15.99.03",
      "TZ-25.99.01~TZ-25.99.03",
    ],
  },
  {
    id: "cryogenic-diverter-valve",
    name: "Cryogenic Diverter Valve",
    description:
      "Valve 3-arah yang mengalihkan aliran liquid/gas cryogenic secara selektif ke salah satu dari dua jalur keluaran (misalnya berpindah antar bank vaporizer atau jalur pengisian) tanpa perlu menghentikan aliran utama.",
    models: [
      "DQS-15~DQS-15F",
      "DQS-25",
      "DQS-25C13",
      "DQS-25S2",
      "DQS-40.001",
      "DQS-40A",
    ],
  },
  {
    id: "cryogenic-economizer",
    name: "Cryogenic Economizer",
    description:
      "Valve otomatis yang menjaga tekanan internal tangki dengan mengalirkan sebagian liquid/vapor melalui coil economizer saat tekanan tangki turun di bawah setpoint. Fungsinya menjaga tekanan tetap cukup untuk penarikan liquid sekaligus meminimalkan kerugian akibat venting/pembuangan gas berlebih.",
    models: [
      "DYJ-15~DJQ-DYJ-15A4",
      "DYJ-25~DYJ-25A1",
      "DYJ-40~DYJ-50A",
      "TJ-10~TJ-10A1",
    ],
  },
  {
    id: "safety-valve",
    name: "Safety Valve",
    description:
      "Valve pelepas tekanan (pressure relief valve) berpegas yang membuka secara otomatis ketika tekanan sistem melebihi batas yang ditetapkan, untuk melindungi tangki, vaporizer, pipa, dan bejana tekan dari risiko overpressure. Perangkat ini wajib terpasang pada setiap bejana/tangki cryogenic sesuai standar keselamatan bejana tekan.",
    models: [
      "DA-08F~DA-08F5",
      "DA-10~DA-10C2",
      "DA-15~DA-15A3",
      "DA-25~DA-25A4",
      "DA22F-40P(15B)~DA22F-40P(25B2)",
      "DA22F-40P(10C)~DA22F-40P(25C2)",
      "DA22F-40P(15M)~DA22F-40P(25M2)",
      "DA22F-40P(32C)~DA22F-40P(32C2)",
      "DA22Y-40P(40)~DA22Y-40P(40A)",
      "DA22Y-40P(50)~DA22Y-40P(50A)",
      "DGA-10.A01~DGA-10.A03",
      "DGA-15.A01~DGA-15.A03",
      "DGA-20.A01~DGA-20.A03",
      "DA22F-40P(M20E.030)~DA22F-40P(M20E1.030)",
    ],
  },
  {
    id: "cryogenic-strainer",
    name: "Cryogenic Strainer",
    description:
      "Saringan (strainer) tipe Y yang dipasang sebelum valve, pompa, regulator, atau flow meter untuk menyaring kotoran/serpihan pada aliran cryogenic, sehingga melindungi komponen presisi di sisi hilir dari kerusakan atau penyumbatan.",
    models: [
      "DGF-10~DGF-50 / DGF-10Y~DGF-50Y",
      "DGF-10A~DGF-50A / DGF-15K~DGF-50K",
      "DGF-10NPT~DGF-25NPT",
      "DGF-15B~DGF-25B",
      "DGF-65~DGF-100",
      "DGF-65B~DGF-100B",
      "DGF-10.99.xx~DGF-50.99.xx",
    ],
  },
];

/** Slug khusus untuk item "Other Valves" pada daftar utama. */
export const OTHER_VALVES_ID = "other-valves";

export const OTHER_VALVES_LABEL = "Other Valves";

/** 7 sub-jenis yang tampil ketika "Other Valves" diklik. */
export const OTHER_VALVE_CATEGORIES: ValveEntry[] = [
  {
    id: "vacuum-jacketed-valve",
    name: "Vacuum Jacketed Valve",
    description:
      "Valve cryogenic yang dibungkus jaket vakum (vacuum jacket) sendiri, menyatu dengan sistem pemipaan vacuum jacketed (VJ pipe). Insulasi vakum ini meminimalkan heat leak dan mencegah pembentukan bunga es pada badan valve, sehingga cocok dipasang di titik-titik sambungan pada jalur transfer cryogenic yang sepenuhnya vacuum jacketed.",
    models: [
      "DZJ-15~DZJ-50",
      "DZJ-65",
      "DZH-15C1~DZH-50C",
      "DZH-40JS",
      "DZQ-15C~DZQ-50C",
      "DZQ-65~DZQ-65B2",
    ],
  },
  {
    id: "high-pressure-valve",
    name: "High Pressure Valve",
    description:
      "Valve dengan rating tekanan kerja lebih tinggi dibanding valve liquid cryogenic standar. Digunakan pada jalur pengisian tabung gas bertekanan tinggi, keluaran pompa bertekanan tinggi, dan keluaran vaporizer bertekanan tinggi.",
    models: [
      "GDF-15~GDF-20",
      "DGJ-08~DGJ-25",
      "DGJ-15G~DGJ-25G",
      "DGH-10~DGH-25",
      "DGQ-10~DGQ-25",
    ],
  },
  {
    id: "fueling-nozzle",
    name: "Fueling Nozzle",
    description:
      "Nozzle pengisian bahan bakar cryogenic (mis. LNG/L-CNG) yang menghubungkan selang dispenser ke receptacle tangki kendaraan, dilengkapi sambungan quick-connect kedap cryogenic bertipe dry-break agar tidak terjadi tumpahan saat dilepas.",
    models: ["DCJ-25~DCJ-25B"],
  },
  {
    id: "venting-nozzle",
    name: "Venting Nozzle",
    description:
      "Nozzle/sambungan khusus untuk membuang gas boil-off secara aman dari tangki kendaraan atau sistem penyimpanan cryogenic ke atmosfer/vent stack selama proses pengisian atau pelepasan tekanan.",
    models: ["DHJ-10A~DHJ-10A4"],
  },
  {
    id: "filling-device",
    name: "Filling Device",
    description:
      "Perangkat sambungan quick-connect/quick-disconnect yang digunakan untuk menghubungkan selang pengisian ke inlet tangki atau tabung cryogenic saat proses transfer/pengisian liquid.",
    models: ["DJC-40~DJC-40C", "DXK-40", "DCK-40"],
  },
  {
    id: "breakaway-coupling",
    name: "Breakaway Coupling",
    description:
      "Kopling pengaman yang dipasang pada selang transfer dan akan otomatis terlepas serta menutup rapat kedua sisinya (self-sealing) apabila selang tertarik melebihi batas aman (misalnya kendaraan bergerak saat masih terhubung), sehingga mencegah tumpahan liquid dan kerusakan selang.",
    models: ["LDQ-25B~LDQ-25B2", "LDQ-50"],
  },
  {
    id: "flame-arrester",
    name: "Flame Arrester",
    description:
      "Perangkat keselamatan yang dipasang pada jalur vent/outlet ventilasi tangki untuk mencegah rambatan api dari luar masuk kembali ke dalam tangki atau pemipaan vent, dengan cara meredam api melalui elemen mesh, sehingga melindungi sistem venting gas yang mudah terbakar.",
    models: ["DGZ-25~DGZ-50", "DGZ-50B"],
  },
];
