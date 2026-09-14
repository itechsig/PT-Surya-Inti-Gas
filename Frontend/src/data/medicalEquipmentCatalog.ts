/**
 * Katalog stok instrumen medis aktual untuk halaman detail produk "Medical Instrumen"
 * (kategori Peralatan Pendukung Gas Industri). Data ini statis di frontend karena
 * berupa daftar referensi jenis & item stok, bukan produk yang dikelola lewat CMS.
 */

import type { CatalogTypeGroup, CatalogLegendEntry } from "./catalogTypes";

export const MEDICAL_EQUIPMENT_CATEGORIES: CatalogTypeGroup[] = [
  {
    id: "outlet-parts",
    name: "Bagian & Aksesori Medical Gas Outlet",
    description:
      "Komponen individual (front part, back part, box, bracket, cover) yang membentuk satu unit outlet gas medis pada dinding fasilitas kesehatan. Dipakai sebagai suku cadang untuk instalasi baru maupun penggantian/perbaikan outlet yang sudah terpasang, dan harus sesuai dengan standar konektor (CIG-Australia, JIS, OHMEDA, DISS) serta jenis gas yang dilayani agar tetap gas-specific dan mencegah kesalahan sambung.",
    items: [
      {
        id: "outlet-part-back-cig-australia",
        label: "Back Part Medical Gas Outlet",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
        connection: "6mm",
      },
      {
        id: "outlet-part-box-jis",
        label: "Box Medical Gas Outlet",
        material: "JIS",
        brand: "STARMED",
        connection: "10mm",
      },
      {
        id: "outlet-part-bracket-jis",
        label: "Bracket Medical Gas Outlet",
        material: "JIS",
        brand: "STARMED",
      },
      {
        id: "outlet-part-cover-ohmeda",
        label: "Cover Medical Gas Outlet",
        material: "OHMEDA",
        brand: "LOKAL",
      },
      {
        id: "outlet-part-front-oxygen-cig-heisz",
        label: "Front Part Medical Gas Outlet Oxygen",
        material: "CIG-AUSTRALIA",
        brand: "HEISZ",
      },
      {
        id: "outlet-part-front-oxygen-cig-lokal",
        label: "Front Part Medical Gas Outlet Oxygen",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
      },
      {
        id: "outlet-part-front-oxygen-diss-gentec",
        label: "Front Part Medical Gas Outlet Oxygen",
        material: "DISS",
        brand: "GENTEC",
      },
    ],
  },
  {
    id: "medical-gas-outlet",
    name: "Medical Gas Outlet (Single Point)",
    description:
      "Unit outlet gas medis titik tunggal yang dipasang pada dinding kamar rawat, ruang operasi, atau ICU sebagai titik pengambilan gas medis (oksigen, medical air, nitrous oxide) maupun jalur vakum/suction. Setiap outlet dirancang gas-specific mengikuti standar konektor tertentu (CIG-Australia, JIS, OHMEDA) sehingga hanya bisa disambung dengan probe/flowmeter yang sesuai, sebagai bagian dari sistem keselamatan sentral gas medis.",
    items: [
      {
        id: "outlet-air-cig-lokal",
        label: "Medical Gas Outlet Air",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
      },
      {
        id: "outlet-medical-air-ohmeda-pahsco",
        label: "Medical Gas Outlet Medical Air",
        material: "OHMEDA",
        brand: "PAHSCO",
        model: "10403003 & 10404003",
      },
      {
        id: "outlet-nitrous-oxide-cig-lokal",
        label: "Medical Gas Outlet Nitrous Oxide",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
      },
      {
        id: "outlet-oxygen-ohmeda-lokal",
        label: "Medical Gas Outlet Oxygen",
        material: "OHMEDA",
        brand: "LOKAL",
      },
      {
        id: "outlet-oxygen-cig-lokal",
        label: "Medical Gas Outlet Oxygen",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
      },
      {
        id: "outlet-oxygen-jis-heisz",
        label: "Medical Gas Outlet Oxygen",
        material: "JIS",
        brand: "HEISZ",
      },
      {
        id: "outlet-oxygen-ohmeda-heisz",
        label: "Medical Gas Outlet Oxygen",
        material: "OHMEDA",
        brand: "HEISZ",
      },
      {
        id: "outlet-oxygen-ohmeda-pahsco",
        label: "Medical Gas Outlet Oxygen",
        material: "OHMEDA",
        brand: "PAHSCO",
        model: "10403001 & 10404001",
      },
      {
        id: "outlet-suction-cig-lokal",
        label: "Medical Gas Outlet Suction",
        material: "CIG-AUSTRALIA",
        brand: "LOKAL",
      },
      {
        id: "outlet-vacuum-ohmeda-pahsco",
        label: "Medical Gas Outlet Vacuum",
        material: "OHMEDA",
        brand: "PAHSCO",
        model: "10403004 & 10404075",
      },
    ],
  },
  {
    id: "multipoint-terminal-wall-outlet",
    name: "Multipoint Terminal Wall Outlet",
    description:
      "Modul outlet dinding dengan 3 titik untuk satu jenis gas/vakum yang sama, dipasang pada area dengan kebutuhan akses gas medis lebih dari satu titik dalam satu modul, seperti ruang operasi atau ruang perawatan intensif.",
    items: [
      {
        id: "multipoint-suction-comweld",
        label: "Multipoint 3 Direct Suction Terminal Wall Outlet",
        brand: "COMWELD",
        model: "553043",
      },
      {
        id: "multipoint-medical-air-comweld",
        label: "Multipoint 3 Medical Air Terminal Wall Outlet",
        brand: "COMWELD",
        model: "553041",
      },
      {
        id: "multipoint-nitrous-oxide-comweld",
        label: "Multipoint 3 Nitrous Oxide Terminal Wall Outlet",
        brand: "COMWELD",
        model: "553042",
      },
      {
        id: "multipoint-oxygen-comweld",
        label: "Multipoint 3 Oxygen Terminal Wall Outlet",
        brand: "COMWELD",
        model: "553040",
      },
    ],
  },
  {
    id: "flowmeter-oksigen",
    name: "Flowmeter Oksigen",
    description:
      "Alat ukur & pengatur laju alir oksigen (liter per menit) yang disambungkan ke outlet oksigen medis untuk memberikan aliran oksigen sesuai kebutuhan terapi pasien.",
    items: [
      {
        id: "flowmeter-o2-comweld",
        brand: "COMWELD (EZI-FLOW)",
        model: "515817-10-795",
        pressure: "0-15 LPM 400kPa",
      },
      {
        id: "flowmeter-o2-heisz",
        brand: "HEISZ",
        model: "HG-IG-F001-HEISZ-202107-1837",
        pressure: "0-15 LPM 400kPa",
      },
    ],
  },
  {
    id: "regulator-oksigen-medis",
    name: "Regulator Oksigen Medis",
    description:
      "Regulator tekanan yang menurunkan tekanan tinggi tabung oksigen medis ke tekanan kerja yang aman sebelum disalurkan ke flowmeter/peralatan terapi oksigen pasien.",
    items: [
      {
        id: "regulator-oxygen-comweld",
        brand: "COMWELD",
        model: "518800",
        pressure: "INLET 2900psi",
      },
    ],
  },
  {
    id: "humidifier-oksigen-medis",
    name: "Humidifier Oksigen Medis",
    description:
      "Perangkat pelembap yang melembapkan aliran oksigen dari flowmeter sebelum dihirup pasien, menggunakan botol berisi air steril, untuk mencegah iritasi/kekeringan saluran napas pada terapi oksigen jangka panjang.",
    items: [
      {
        id: "humidifier-flowmeter-rms",
        label: "Medical Oxygen Flowmeter Humidifier",
        brand: "RMS",
        pressure: "OUTLET 3-5bar",
      },
      {
        id: "humidifier-bottle-comweld",
        label: "Medical Oxygen Humidifier Bottle",
        brand: "COMWELD",
        model: "TM11",
        connection: '1/4" FBSP x 5mm HOSE',
      },
    ],
  },
  {
    id: "inhalator-oksigen-medis",
    name: "Inhalator Oksigen Medis",
    description:
      "Perangkat set inhalasi oksigen yang menyalurkan oksigen langsung ke pasien melalui masker/nasal kanul, umum dipakai pada layanan gawat darurat maupun perawatan pasien dengan kebutuhan terapi oksigen.",
    items: [
      { id: "inhalator-gea-yr-86-1", brand: "GEA", model: "YR-86-1" },
      { id: "inhalator-gea-yr-86-9", brand: "GEA", model: "YR-86-9" },
    ],
  },
];

/** Standar konektor gas medis yang dipakai pada badge item, ditampilkan sebagai legenda. */
export const STANDARD_LEGEND: CatalogLegendEntry[] = [
  { code: "CIG-AUSTRALIA", label: "Standar konektor gas medis Australia" },
  { code: "JIS", label: "Standar konektor gas medis Jepang" },
  { code: "OHMEDA", label: "Standar konektor gas medis Ohmeda/Ohio" },
  { code: "DISS", label: "Diameter Index Safety System (standar AS)" },
];
