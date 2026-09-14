/**
 * Katalog stok regulator aktual untuk halaman detail produk "Regulator"
 * (kategori Peralatan Pendukung Gas Industri). Data ini statis di frontend karena
 * berupa daftar referensi jenis & item stok, bukan produk yang dikelola lewat CMS.
 */

import type { CatalogTypeGroup, CatalogLegendEntry } from "./catalogTypes";

export const REGULATOR_CATEGORIES: CatalogTypeGroup[] = [
  {
    id: "regulator-acetylene",
    name: "Regulator Acetylene",
    description:
      "Regulator tekanan khusus untuk gas acetylene, menurunkan tekanan tinggi tabung acetylene ke tekanan kerja yang aman untuk proses pengelasan/pemotongan (welding & cutting). Dirancang mengikuti batasan tekanan khusus acetylene yang tidak boleh melebihi ambang aman gas ini.",
    items: [
      {
        id: "regulator-acetylene-muraku-refurbished",
        brand: "MURAKU",
        pressure: "0-35psi 0-2.5bar x 0-600psi 0-40bar",
        condition: "Refurbished",
      },
      {
        id: "regulator-acetylene-muraku",
        brand: "MURAKU",
        pressure: "0-35psi 0-2.5bar x 0-600psi 0-40bar",
      },
    ],
  },
  {
    id: "regulator-oxygen",
    name: "Regulator Oxygen",
    description:
      "Regulator tekanan khusus untuk gas oksigen, menurunkan tekanan tinggi tabung oksigen ke tekanan kerja yang stabil untuk proses pengelasan/pemotongan maupun suplai oksigen medis. Menggunakan material dan pelumas yang aman untuk layanan oksigen (oxygen service).",
    items: [
      {
        id: "regulator-oxygen-muraku-refurbished",
        brand: "MURAKU",
        pressure: "0-350psi 0-25bar x 0-3500psi 0-250bar",
        condition: "Refurbished",
      },
      {
        id: "regulator-oxygen-muraku",
        brand: "MURAKU",
        pressure: "0-350psi 0-25bar x 0-3500psi 0-250bar",
      },
      {
        id: "regulator-oxygen-rms",
        label: "Medical Oxygen Regulator",
        brand: "RMS",
      },
    ],
  },
  {
    id: "regulator-udara",
    name: "Air Regulator / Filter Regulator",
    description:
      "Regulator tekanan udara instrumen/pneumatik, sebagian dilengkapi elemen filter untuk menyaring kotoran dan kondensat sebelum udara bertekanan disalurkan ke peralatan pneumatik atau instrumentasi.",
    items: [
      {
        id: "regulator-udara-hpc",
        brand: "HPC",
        model: "AR 2000-02 TAC",
        connection: '1/4" FNPT',
        pressure: "OUTLET 0.5-8.5bar",
      },
      {
        id: "regulator-udara-dpv",
        label: "Filter Regulator Udara",
        brand: "DPV",
        model: "AFR-2000",
        connection: '1/4" FNPT',
        pressure: "OUTLET 1-8bar",
      },
    ],
  },
  {
    id: "cryogenic-regulator",
    name: "Cryogenic Regulator",
    description:
      "Valve pengatur/penurun tekanan yang menjaga tekanan keluaran tangki atau vaporizer cryogenic tetap berada pada rentang yang ditentukan, sehingga pasokan gas ke jalur pipa pelanggan tetap stabil.",
    items: [
      {
        id: "cryogenic-regulator-baitu-dys-15b2",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "DYS-15B2",
        connection: '1/2" FNPT',
        pressure: "SP 30bar · OUTLET 30-35bar · DN 15mm PN 40bar",
      },
      {
        id: "cryogenic-regulator-baitu-tz-25-99-11",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "TZ-25.99.11",
        connection: '1" FNPT',
        pressure: "SP 150psi · OUTLET 3.5-14bar · PN 40bar",
      },
      {
        id: "cryogenic-regulator-baitu-tz-25-99-11-refurbished",
        material: "BR",
        brand: "BAITU CRYOGENIC",
        model: "TZ-25.99.11",
        connection: '1" FNPT',
        pressure: "SP 150psi · OUTLET 3.5-14bar · PN 40bar",
        condition: "Refurbished",
      },
    ],
  },
  {
    id: "regulator-argon",
    name: "Regulator Argon",
    description:
      "Regulator tekanan khusus untuk gas argon, menurunkan tekanan tabung argon ke tekanan kerja yang sesuai untuk proses pengelasan (TIG/MIG) maupun aplikasi inert gas lainnya.",
    items: [
      {
        id: "regulator-argon-stahlwerk",
        material: "ISO 9001",
        brand: "STAHLWERK",
        pressure: "0-3500psi 0-250bar",
      },
    ],
  },
  {
    id: "regulator-co2",
    name: "Regulator CO2",
    description:
      "Regulator tekanan khusus untuk gas karbon dioksida (CO2), menurunkan tekanan tabung CO2 ke tekanan kerja yang sesuai untuk aplikasi pengelasan (MIG/MAG), karbonasi minuman, maupun proses industri lain yang menggunakan CO2.",
    items: [
      {
        id: "regulator-co2-blackbull-w190c",
        brand: "BLACKBULL",
        model: "W190C-110V",
        pressure: "0-5 kgf/cm² (0-70psi)",
      },
      {
        id: "regulator-co2-harris-25gx-10",
        material: "BR (ISO 2503)",
        brand: "HARRIS",
        model: "25GX-10-CO2",
        pressure: "0-870psi/0-60bar x 0-4500psi/0-315bar · INLET 230bar",
      },
      {
        id: "regulator-co2-gce-mr60",
        material: "BR (ISO 7291)",
        brand: "GCE",
        model: "MR60",
        connection: '1/2" MNPT',
        pressure: "INLET 200bar · OUTLET 50bar",
      },
      {
        id: "regulator-co2-stahlwerk",
        material: "ISO 9001",
        brand: "STAHLWERK",
        pressure: "0-3500psi 0-250bar",
      },
      {
        id: "regulator-co2-blackbull-220v",
        brand: "BLACKBULL",
        model: "220V",
        pressure: "0-700kPa 0-100psi",
      },
      {
        id: "regulator-co2-bestflow-mt311",
        brand: "BESTFLOW",
        model: "MT311-220V",
        pressure: "0-25MPa",
      },
    ],
  },
  {
    id: "regulator-lpg",
    name: "Regulator LPG",
    description:
      "Regulator tekanan khusus untuk gas LPG (liquefied petroleum gas), menurunkan tekanan tabung/tangki LPG ke tekanan kerja yang aman untuk kompor industri, burner, maupun peralatan berbahan bakar LPG lainnya.",
    items: [
      {
        id: "regulator-lpg-yamato-yr-76",
        brand: "YAMATO SANGYO",
        model: "YR-76",
        pressure: "0-30 lbs/in² (0-2 kg/cm²) x 0-350 lbs/in² (0-25 kg/cm²)",
      },
    ],
  },
  {
    id: "regulator-nitrogen",
    name: "Regulator Nitrogen",
    description:
      "Regulator tekanan khusus untuk gas nitrogen, menurunkan tekanan tabung nitrogen ke tekanan kerja yang sesuai untuk aplikasi purging, blanketing, maupun pressurizing sistem.",
    items: [
      {
        id: "regulator-nitrogen-harris-h47as-40-n2",
        material: "BR",
        brand: "HARRIS",
        model: "H47AS-40-N2",
        pressure: "INLET 60bar",
      },
    ],
  },
  {
    id: "regulator-propane",
    name: "Regulator Propane",
    description:
      "Regulator tekanan khusus untuk gas propane, menurunkan tekanan tabung/tangki propane ke tekanan kerja yang aman untuk kebutuhan pembakaran maupun proses industri.",
    items: [
      {
        id: "regulator-propane-muraku",
        brand: "MURAKU",
        pressure: "0-40psi 0-3bar x 0-400psi 0-30bar",
      },
    ],
  },
  {
    id: "regulator-single-stage-diaphragm",
    name: "Regulator Single Stage Diaphragm",
    description:
      "Regulator tekanan tipe diafragma satu tahap (single stage) yang menurunkan tekanan gas dari tekanan tabung tinggi langsung ke tekanan kerja yang diinginkan dalam satu tahap penurunan. Umum dipakai pada aplikasi gas khusus/gas murni (high purity) yang membutuhkan respons tekanan output stabil.",
    items: [
      {
        id: "regulator-diaphragm-afklok-r11",
        material: "SS316",
        brand: "AFKLOK",
        model: "R11",
        connection: 'O2 VALVE x 1/4" MNPT',
        pressure: "INLET 0-250bar · OUTLET 0-25bar",
      },
      {
        id: "regulator-diaphragm-afklok-r41",
        material: "SS316",
        brand: "AFKLOK",
        model: "R41",
        connection: 'O2 VALVE x 1/4" MNPT',
        pressure: "INLET 0-250bar · OUTLET 0-40bar",
      },
      {
        id: "regulator-diaphragm-tescom-sg166142-008",
        material: "SS316",
        brand: "TESCOM",
        model: "SG166142-008",
        connection: '5/8" FBSP x 5/8" MBSP',
        pressure: "INLET 0-3000psi · OUTLET 0-150psi",
      },
    ],
  },
  {
    id: "regulator-umum",
    name: "Regulator Tekanan (Multi-Gas / Umum)",
    description:
      "Regulator tekanan serba guna yang dapat digunakan untuk berbagai jenis gas proses sesuai material konstruksi, koneksi, dan seal yang dipilih. Umum dipakai untuk menurunkan tekanan tabung/manifold gas ke tekanan kerja peralatan di jalur distribusi maupun aplikasi industri.",
    items: [
      {
        id: "regulator-umum-concoa",
        brand: "CONCOA",
        model: "67B5502-01-000R",
        connection: '1/2" FNPT',
        pressure: "INLET 1000psi · OUTLET 500psi",
      },
      {
        id: "regulator-umum-generant-4gdr-500b-v-d-500",
        material: "BR",
        brand: "GENERANT",
        model: "4GDR-500B-V-D",
        connection: '1/2" FNPT',
        pressure: "INLET 500psi · OUTLET 225-450psi",
      },
      {
        id: "regulator-umum-smc-ar40-04g",
        brand: "SMC",
        model: "AR40-04G-B-X425",
        connection: '1/2" FNPT',
        pressure: "SP 0-17bar",
      },
      {
        id: "regulator-umum-smc-ar50-10g",
        brand: "SMC",
        model: "AR50-10G-B-X425",
        connection: '1" FNPT',
        pressure: "SP 0-17bar",
      },
      {
        id: "regulator-umum-rego-br-1788de",
        material: "BR",
        brand: "REGO",
        model: "BR-1788DE",
        connection: '1" FNPT',
        pressure: "INLET 500psi · OUTLET 175-275psi",
      },
      {
        id: "regulator-umum-rego-br-1788c-435",
        material: "BR",
        brand: "REGO",
        model: "BR-1788C",
        connection: '1" FNPT',
        pressure: "INLET 435psi · OUTLET 100-200psi",
      },
      {
        id: "regulator-umum-gce-mr400",
        material: "BR (ISO 7291)",
        brand: "GCE",
        model: "MR400",
        connection: '1/2" MNPT',
        pressure: "INLET 300bar · OUTLET 20bar",
      },
      {
        id: "regulator-umum-smc-ar40-04",
        material: "SS",
        brand: "SMC",
        model: "AR40-04",
        connection: '1/2" x 1/2" x 1/4" FNPT',
        pressure: "OUTLET 0.5-8.5bar",
      },
      {
        id: "regulator-umum-smc-ar5000",
        material: "SS",
        brand: "SMC",
        model: "AR5000",
        connection: '1" x 1" x 1/4" FNPT',
        pressure: "OUTLET 0.5-8.5bar",
      },
      {
        id: "regulator-umum-rego-1788c-refurbished",
        material: "BR",
        brand: "REGO",
        model: "1788C",
        connection: '1" FNPT',
        pressure: "INLET 435psi · OUTLET 100-200psi",
        condition: "Refurbished",
      },
      {
        id: "regulator-umum-rego-br-1788c-500",
        material: "BR",
        brand: "REGO",
        model: "BR-1788C",
        connection: '1" FNPT',
        pressure: "INLET 500psi · OUTLET 100-200psi",
      },
      {
        id: "regulator-umum-generant-4gdr-500b-v-c",
        material: "BR",
        brand: "GENERANT",
        model: "4GDR-500B-V-C",
        connection: '1/2" FNPT',
        pressure: "INLET 580psi · OUTLET 125-225psi",
      },
      {
        id: "regulator-umum-generant-4gdr-500b-v-d-580",
        material: "BR",
        brand: "GENERANT",
        model: "4GDR-500B-V-D",
        connection: '1/2" FNPT',
        pressure: "INLET 580psi · OUTLET 225-450psi",
      },
      {
        id: "regulator-umum-rego-1884d-c",
        material: "BR",
        brand: "REGO",
        model: "1884D-C",
        connection: '1/2" FNPT',
        pressure: "INLET 550psi · OUTLET 225-450psi",
      },
      {
        id: "regulator-umum-rego-1884c-c",
        material: "BR",
        brand: "REGO",
        model: "1884C-C",
        connection: '1/2" FNPT',
        pressure: "INLET 550psi · OUTLET 125-225psi",
      },
      {
        id: "regulator-umum-harris-h25z-140",
        material: "BR",
        brand: "HARRIS",
        model: "H25Z-140-?",
        pressure: "INLET 300bar",
      },
    ],
  },
];

/** Singkatan material/standar yang dipakai pada kartu item, ditampilkan sebagai legenda. */
export const MATERIAL_LEGEND: CatalogLegendEntry[] = [
  { code: "BR", label: "Brass (Kuningan)" },
  { code: "SS / SS316", label: "Stainless Steel" },
  { code: "ISO 2503 / 7291 / 9001", label: "Standar acuan desain regulator gas" },
];
