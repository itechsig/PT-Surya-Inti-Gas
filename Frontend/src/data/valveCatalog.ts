/**
 * Katalog stok valve aktual untuk halaman detail produk "Valve"
 * (kategori Peralatan Pendukung Gas Industri). Data ini statis di frontend karena
 * berupa daftar referensi jenis & item stok, bukan produk yang dikelola lewat CMS.
 */

import type { CatalogStockItem, CatalogTypeGroup, CatalogLegendEntry } from "./catalogTypes";

export type ValveStockItem = CatalogStockItem;
export type ValveTypeGroup = CatalogTypeGroup;

export const VALVE_CATEGORIES: ValveTypeGroup[] = [
  {
    id: "ball-valve",
    name: "Ball Valve",
    description:
      "Valve buka-tutup cepat (on/off) menggunakan bola berlubang yang diputar 90°, memberikan aliran penuh saat terbuka dan penyekatan rapat saat tertutup. Umum dipakai sebagai valve isolasi pada jalur gas maupun liquid bertekanan.",
    items: [
      { id: "ball-valve-baltur", material: "BR", brand: "BALTUR", connection: '1/2" FNPT', pressure: "MWP 600psi" },
      { id: "ball-valve-glt", material: "SS316", brand: "GLT", connection: '1/2" FNPT', pressure: "MWP 2000psi" },
      { id: "ball-valve-parker", material: "SS316", brand: "PARKER", connection: '1/2" FNPT', pressure: "MWP 2000psi" },
      { id: "ball-valve-mini-lever", label: "Mini Lever Ball Valve", material: "SS", connection: '1/2" MNPT' },
    ],
  },
  {
    id: "needle-valve",
    name: "Needle Valve",
    description:
      "Valve dengan elemen penutup berbentuk jarum runcing yang memungkinkan pengaturan aliran secara presisi dalam jumlah kecil (fine flow control). Biasa dipakai pada jalur instrumentasi, sampling, dan kalibrasi tekanan.",
    items: [
      { id: "needle-valve-onda", material: "BR", brand: "ONDA", connection: '1/4" FNPT', pressure: "MWP 200psi" },
      { id: "needle-valve-lokal", material: "SS", brand: "LOKAL", connection: '1/4" MNPT x 1/4" FNPT' },
      {
        id: "needle-valve-fd-lok",
        material: "SS316",
        brand: "FD-LOK",
        model: "SS-V4-F8-5",
        connection: '1/2" FNPT',
        pressure: "MWP 6000psi",
      },
    ],
  },
  {
    id: "pneumatic-actuation-valve",
    name: "Pneumatic Actuation Valve",
    description:
      "Valve yang dioperasikan menggunakan aktuator pneumatik (udara/gas bertekanan) untuk membuka/menutup secara otomatis dari jarak jauh. Dipakai pada sistem kontrol proses yang membutuhkan respons cepat tanpa operator manual.",
    items: [
      { id: "pneumatic-actuation-vti", brand: "VTI", model: "K85-50-25E", pressure: "MWP 200bar" },
    ],
  },
  {
    id: "cryogenic-globe-valve",
    name: "Cryogenic Globe Valve",
    description:
      "Valve serba guna untuk membuka/menutup dan mengatur aliran liquid cryogenic (LOX, LIN, LAR, LCO2, LNG). Menggunakan bonnet yang diperpanjang (extended bonnet) agar packing/seal tetap berada jauh dari suhu ekstrem dingin, sehingga aman dioperasikan pada jalur pipa tangki penyimpanan, vaporizer, dan stasiun pengisian.",
    items: [
      {
        id: "cryogenic-globe-baitu-dj-25al",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "DJ-25AL",
        connection: '1" BW PIPE',
        pressure: "DN 25mm PN 63bar",
      },
      {
        id: "cryogenic-globe-baitu-dj-25yl",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "DJ-25YL",
        connection: '1" SW PIPE',
        pressure: "DN 25mm PN 63bar",
      },
      {
        id: "cryogenic-globe-baitu-dj-15p6",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "DJ-15P6",
        connection: '1/2" SW PIPE SS',
        pressure: "DN 15mm PN 40bar",
      },
      {
        id: "cryogenic-globe-baitu-dj-10p0203",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "DJ-10P.02.03",
        connection: '1/2" FNPT',
        pressure: "DN 10mm PN 40bar",
      },
      {
        id: "cryogenic-globe-herose-01315-1400-7026",
        material: "BZ (EN 1626)",
        brand: "HEROSE",
        model: "01315.1400.7026",
        connection: '1 1/2" FNPT',
        pressure: "DN 40mm PN 50bar",
      },
      {
        id: "cryogenic-globe-herose-01315-1000-7026",
        material: "BZ (EN 1626)",
        brand: "HEROSE",
        model: "01315.1000.7026",
        connection: '1" FNPT',
        pressure: "DN 25mm PN 50bar",
      },
      {
        id: "cryogenic-globe-herose-01311-4048-0017",
        material: "BZ (EN 1626)",
        brand: "HEROSE",
        model: "01311.4048.0017",
        connection: '1 1/2" SS STUBS',
        pressure: "DN 40mm PN 50bar",
      },
      {
        id: "cryogenic-globe-herose-01311-2533-7027",
        material: "BZ (EN 1626)",
        brand: "HEROSE",
        model: "01311.2533.7027",
        connection: '1" SS STUBS',
        pressure: "DN 25mm PN 50bar",
      },
      {
        id: "cryogenic-globe-rego-bk8408t",
        material: "BZ",
        brand: "REGO",
        model: "BK8408T",
        connection: '1" FNPT',
        pressure: "MWP 600psi",
      },
    ],
  },
  {
    id: "globe-valve",
    name: "Globe Valve",
    description:
      "Valve dengan bentuk bodi menyerupai bola (globe) yang cocok untuk throttling maupun on/off pada aliran gas/liquid non-cryogenic bertekanan sedang, memberikan kontrol aliran yang lebih presisi dibanding ball valve.",
    items: [
      { id: "globe-valve-lokal-half", material: "SS316", brand: "LOKAL", connection: '1/2" FNPT', pressure: "MWP 200psi" },
      { id: "globe-valve-lokal-1-half", material: "SS316", brand: "LOKAL", connection: '1 1/2" FNPT', pressure: "MWP 200psi" },
      {
        id: "globe-valve-rego-t9452",
        material: "BR",
        brand: "REGO",
        model: "T9452",
        connection: '1/4" FNPT',
        pressure: "MWP 42bar",
        condition: "Refurbished",
      },
    ],
  },
  {
    id: "high-pressure-gas-control-valve",
    name: "High Pressure Gas Control Valve",
    description:
      "Valve yang dirancang khusus untuk mengendalikan aliran gas bertekanan sangat tinggi. Dipakai pada sistem tabung gas bertekanan tinggi (high-pressure cylinder) dan jalur pengisian/pengaturan gas industri maupun gas khusus.",
    items: [
      {
        id: "high-pressure-gas-control-generant-mv-4f-c",
        material: "BR",
        brand: "GENERANT",
        model: "MV-4F-C",
        connection: '1/2" FNPT',
        pressure: "MWP 5500psi",
      },
    ],
  },
];

/** Singkatan material yang dipakai pada kartu item, ditampilkan sebagai legenda. */
export const MATERIAL_LEGEND: CatalogLegendEntry[] = [
  { code: "BR", label: "Brass (Kuningan)" },
  { code: "SS / SS316", label: "Stainless Steel" },
  { code: "BZ", label: "Bronze (Perunggu)" },
];
