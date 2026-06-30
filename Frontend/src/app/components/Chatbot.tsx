import React, { useState, useRef, useEffect, useCallback } from "react";
import { MessageCircle, X, Send, Bot, User } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { getApiUrl, API_ENDPOINTS } from "../../config/api";

// Simple UUID generator for compatibility
const generateUUID = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Comprehensive Knowledge Base
const knowledgeBase = {
  // Company Information
  "tentang perusahaan": "PT Surya Inti Gas adalah perusahaan gas industri terkemuka yang berdedikasi untuk menyediakan solusi gas berkualitas tinggi bagi berbagai sektor industri di Indonesia. Dengan pengalaman lebih dari 20 tahun, kami telah membangun reputasi sebagai mitra terpercaya dalam industri manufaktur, kesehatan, energi, dan infrastruktur.",
  
  "apa itu pt surya inti gas": "PT Surya Inti Gas adalah perusahaan gas industri terkemuka yang berdedikasi untuk menyediakan solusi gas berkualitas tinggi bagi berbagai sektor industri di Indonesia. Dengan pengalaman lebih dari 20 tahun, kami telah membangun reputasi sebagai mitra terpercaya dalam industri manufaktur, kesehatan, energi, dan infrastruktur.",
  
  "siapa": "Saya adalah asisten virtual PT Surya Inti Gas. Saya siap membantu Anda dengan informasi tentang produk gas, layanan, lokasi, karir, dan informasi perusahaan lainnya.",
  
  "kamu": "Saya adalah asisten virtual PT Surya Inti Gas yang dibuat untuk membantu menjawab pertanyaan Anda tentang perusahaan dan produk kami.",
  
  "kalian": "PT Surya Inti Gas adalah perusahaan gas industri terkemuka di Indonesia yang berdiri sejak 2003. Kami menyediakan berbagai produk gas berkualitas tinggi untuk industri, medis, dan aplikasi khusus.",
  
  "sejarah": "PT Surya Inti Gas didirikan pada tahun 2003 sebagai CV. Surya Inti Gas di Jl. KH. Mukmin, Sidoarjo, Jawa Timur. Pada tahun 2007, kami merelokasi operasional ke Komplek Pergudangan dan Industri 'Meiko Abadi' di Gedangan, Sidoarjo. Tahun 2016, kami pindah ke Komplek Pergudangan dan Industri 'Safe N Lock' sebagai Head Office Sidoarjo. Pada tahun 2017, CV. Surya Inti Gas bertransformasi menjadi PT. Surya Inti Gas dan membuka cabang pertama di Balikpapan, Kalimantan Timur.",
  
  "kapan pt surya inti gas didirikan": "PT Surya Inti Gas didirikan pada tahun 2003 sebagai CV. Surya Inti Gas di Jl. KH. Mukmin, Sidoarjo, Jawa Timur.",
  
  "bagaimana sejarah pt surya inti gas": "PT Surya Inti Gas didirikan pada tahun 2003 sebagai CV. Surya Inti Gas di Jl. KH. Mukmin, Sidoarjo, Jawa Timur. Pada tahun 2007, kami merelokasi operasional ke Komplek Pergudangan dan Industri 'Meiko Abadi' di Gedangan, Sidoarjo. Tahun 2016, kami pindah ke Komplek Pergudangan dan Industri 'Safe N Lock' sebagai Head Office Sidoarjo. Pada tahun 2017, CV. Surya Inti Gas bertransformasi menjadi PT. Surya Inti Gas dan membuka cabang pertama di Balikpapan, Kalimantan Timur.",
  
  "visi": "Visi kami adalah menjadi pemimpin pasar dalam industri gas Indonesia yang terpercaya, inovatif, dan berkelanjutan.",
  
  "apa visi pt surya inti gas": "Visi PT Surya Inti Gas adalah menjadi pemimpin pasar dalam industri gas Indonesia yang terpercaya, inovatif, dan berkelanjutan.",
  
  "misi": "Misi kami meliputi: 1) Menyediakan produk gas berkualitas tinggi yang memenuhi standar internasional. 2) Memberikan layanan pelanggan yang unggul dan responsif. 3) Terus berinovasi dalam teknologi dan proses produksi. 4) Menjaga kepatuhan terhadap standar keselamatan dan lingkungan. 5) Mengembangkan jaringan distribusi yang luas di seluruh Indonesia.",
  
  "apa misi pt surya inti gas": "Misi PT Surya Inti Gas meliputi: 1) Menyediakan produk gas berkualitas tinggi yang memenuhi standar internasional. 2) Memberikan layanan pelanggan yang unggul dan responsif. 3) Terus berinovasi dalam teknologi dan proses produksi. 4) Menjaga kepatuhan terhadap standar keselamatan dan lingkungan. 5) Mengembangkan jaringan distribusi yang luas di seluruh Indonesia.",
  
  "apa visi dan misi pt surya inti gas": "Visi PT Surya Inti Gas adalah menjadi pemimpin pasar dalam industri gas Indonesia yang terpercaya, inovatif, dan berkelanjutan. Misi kami meliputi: 1) Menyediakan produk gas berkualitas tinggi yang memenuhi standar internasional. 2) Memberikan layanan pelanggan yang unggul dan responsif. 3) Terus berinovasi dalam teknologi dan proses produksi. 4) Menjaga kepatuhan terhadap standar keselamatan dan lingkungan. 5) Mengembangkan jaringan distribusi yang luas di seluruh Indonesia.",
  
  "nilai": "Nilai-nilai perusahaan kami: Integritas - kami menjunjung tinggi kejujuran dan transparansi dalam semua aspek operasional. Kualitas - kami berkomitmen untuk memberikan produk dan layanan terbaik. Keselamatan - keselamatan adalah prioritas utama dalam semua operasional kami. Inovasi - kami terus berinovasi untuk meningkatkan layanan dan produk. Keberlanjutan - kami berkomitmen untuk menjaga lingkungan dan operasional yang berkelanjutan.",

  "industri": "Kami melayani berbagai industri termasuk: Manufaktur (pengelasan, pemotongan logam, metalurgi), Kesehatan (rumah sakit, klinik, terapi pernapasan), Energi (minyak dan gas, pembangkit listrik), Infrastruktur (konstruksi, proyek engineering), Makanan dan Minuman (pengawetan, pendinginan), Elektronik (semikonduktor, sirkuit), serta industri lain yang membutuhkan gas berkualitas tinggi.",

  "industri yang dilayani": "Kami melayani berbagai industri termasuk: Manufaktur (pengelasan, pemotongan logam, metalurgi), Kesehatan (rumah sakit, klinik, terapi pernapasan), Energi (minyak dan gas, pembangkit listrik), Infrastruktur (konstruksi, proyek engineering), Makanan dan Minuman (pengawetan, pendinginan), Elektronik (semikonduktor, sirkuit), serta industri lain yang membutuhkan gas berkualitas tinggi.",

  "bidang usaha": "Bidang usaha PT Surya Inti Gas meliputi penyediaan gas industri dan medis untuk berbagai sektor: Manufaktur (pengelasan, pemotongan logam, metalurgi), Kesehatan (rumah sakit, klinik, terapi pernapasan), Energi (minyak dan gas, pembangkit listrik), Infrastruktur (konstruksi, proyek engineering), Makanan dan Minuman (pengawetan, pendinginan), dan Elektronik (semikonduktor, sirkuit).",
  
  "apa saja bidang usaha pt surya inti gas": "Bidang usaha PT Surya Inti Gas meliputi penyediaan gas industri dan medis untuk berbagai sektor: Manufaktur (pengelasan, pemotongan logam, metalurgi), Kesehatan (rumah sakit, klinik, terapi pernapasan), Energi (minyak dan gas, pembangkit listrik), Infrastruktur (konstruksi, proyek engineering), Makanan dan Minuman (pengawetan, pendinginan), dan Elektronik (semikonduktor, sirkuit).",

  "cabang": "Ya, PT Surya Inti Gas memiliki cabang di Balikpapan, Kalimantan Timur. Kantor pusat kami berada di Sidoarjo, Jawa Timur, dan kami memiliki pabrik serta stasiun pengisian di Balikpapan.",
  
  "apakah pt surya inti gas memiliki cabang": "Ya, PT Surya Inti Gas memiliki cabang di Balikpapan, Kalimantan Timur. Kantor pusat kami berada di Sidoarjo, Jawa Timur, dan kami memiliki pabrik serta stasiun pengisian di Balikpapan.",

  "lokasi": "Kami memiliki dua lokasi utama: 1) Kantor Pusat di Komplek Pergudangan dan Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. 2) Pabrik dan Stasiun Pengisian di Jl. AMD Projakal Kariangau Km. 5.5, RT 046, Kelurahan Graha Indah, Kecamatan Balikpapan Utara, Kota Balikpapan, Kalimantan Timur.",
  
  "di mana lokasi kantor pusat pt surya inti gas": "Kantor Pusat PT Surya Inti Gas berlokasi di Komplek Pergudangan dan Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232.",

  // Products
  "produk": "Kami menyediakan berbagai produk gas industri dan medis termasuk: Industrial & Medical Gas (Acetylene, Oksigen, Nitrogen, Argon, Hidrogen), Speciality & Mixed Gas (Helium, Sulfur Hexaflouride, Gas Campuran), serta berbagai peralatan gas seperti Color Code High Pressure Gas Supply, Package System, Assist Gas Equipment, Cryogenic Transport, Regulator & Valves, dan Medical Gas Equipment.",
  
  "produk apa saja yang dijual pt surya inti gas": "Kami menyediakan berbagai produk gas industri dan medis termasuk: Industrial & Medical Gas (Acetylene, Oksigen, Nitrogen, Argon, Hidrogen), Speciality & Mixed Gas (Helium, Sulfur Hexaflouride, Gas Campuran), serta berbagai peralatan gas seperti Color Code High Pressure Gas Supply, Package System, Assist Gas Equipment, Cryogenic Transport, Regulator & Valves, dan Medical Gas Equipment.",
  
  "apakah tersedia gas industri": "Ya, kami menyediakan berbagai gas industri termasuk Acetylene, Oksigen, Nitrogen, Argon, Hidrogen, dan gas lainnya untuk kebutuhan industri.",
  
  "apakah tersedia gas medis": "Ya, kami menyediakan gas medis termasuk Oksigen medis dan gas lainnya untuk kebutuhan rumah sakit dan klinik.",
  
  "asetilena": "Asetilena (C2H2) adalah gas hidrokarbon yang sangat mudah terbakar dan digunakan secara luas dalam industri pengelasan dan pemotongan logam. Gas ini memiliki suhu nyala yang sangat tinggi, mencapai 3.100°C, menjadikannya ideal untuk pengelasan oksi-asetilena dan pemotongan logam.",
  
  "oksigen": "Oksigen (O2) adalah gas yang sangat penting dalam berbagai aplikasi industri dan medis. Dalam bidang medis, oksigen digunakan untuk terapi pernapasan, resusitasi, dan sebagai gas pendukung dalam anestesi. Dalam industri, oksigen berperan penting dalam proses metalurgi untuk pembakaran dan pemurnian logam.",
  
  "nitrogen": "Nitrogen (N2) adalah gas inert yang menyusun sekitar 78% dari atmosfer bumi. Dalam industri, nitrogen digunakan secara luas untuk proses inerting, blanketing, dan pendinginan (cryogenic cooling). Nitrogen juga digunakan dalam industri makanan untuk pengawetan.",
  
  "argon": "Argon (Ar) adalah gas inert yang paling sering digunakan dalam pengelasan TIG (Tungsten Inert Gas) dan MIG karena kemampuannya untuk melindungi area las dari kontaminasi atmosfer. Gas ini juga digunakan dalam industri elektronik untuk pembuatan semikonduktor.",
  
  "helium": "Helium (He) adalah gas inert yang paling ringan kedua setelah hidrogen. Gas ini memiliki berbagai aplikasi penting: dalam medis digunakan untuk MRI (Magnetic Resonance Imaging), dalam industri digunakan untuk pengelasan dan leak detection.",
  
  "apakah tersedia helium": "Ya, kami menyediakan Helium (He) untuk berbagai aplikasi industri dan medis termasuk MRI, pengelasan, dan leak detection.",

  "hidrogen": "Hidrogen (H2) adalah gas yang paling ringan dan paling melimpah di alam semesta. Dalam industri, hidrogen digunakan dalam pemurnian minyak bumi, produksi amonia, pembuatan metanol, dan berbagai proses kimia lainnya.",

  "sf6": "Sulfur heksafluorida (SF6) adalah gas dielektrik yang sangat efektif dengan kekuatan isolasi listrik yang tinggi. Gas ini digunakan secara luas dalam industri kelistrikan sebagai medium isolasi untuk switchgear, circuit breaker, dan transformator.",

  "co2": "Ya, kami menyediakan CO2 (Karbon Dioksida) untuk berbagai aplikasi industri termasuk pengelasan, pendinginan, dan proses manufaktur lainnya.",

  "karbon dioksida": "Ya, kami menyediakan Karbon Dioksida (CO2) untuk berbagai aplikasi industri termasuk pengelasan, pendinginan, dan proses manufaktur lainnya.",
  
  "apakah tersedia co2": "Ya, kami menyediakan CO2 (Karbon Dioksida) untuk berbagai aplikasi industri termasuk pengelasan, pendinginan, dan proses manufaktur lainnya.",

  "acetylene": "Ya, kami menyediakan Acetylene (Asetilena/C2H2) untuk pengelasan dan pemotongan logam. Gas ini memiliki suhu nyala yang sangat tinggi, mencapai 3.100°C, menjadikannya ideal untuk pengelasan oksi-asetilena dan pemotongan logam.",
  
  "apakah tersedia acetylene": "Ya, kami menyediakan Acetylene (Asetilena/C2H2) untuk pengelasan dan pemotongan logam. Gas ini memiliki suhu nyala yang sangat tinggi, mencapai 3.100°C, menjadikannya ideal untuk pengelasan oksi-asetilena dan pemotongan logam.",

  "lpg": "Untuk informasi tentang LPG, silakan hubungi tim sales kami. Kami dapat memberikan informasi yang lebih spesifik sesuai kebutuhan Anda.",

  "tabung": "Kami menyediakan berbagai ukuran tabung gas sesuai kebutuhan industri dan medis Anda. Hubungi tim sales kami untuk informasi detail tentang ukuran dan spesifikasi tabung yang tersedia.",

  "ukuran tabung": "Kami menyediakan berbagai ukuran tabung gas industri dan medis. Hubungi tim sales kami di Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991 untuk informasi detail tentang ukuran dan spesifikasi yang tersedia.",

  "perbedaan oksigen nitrogen argon": "Oksigen (O2) adalah gas oksidator yang mendukung pembakaran dan respirasi, digunakan dalam medis (terapi pernapasan, resusitasi) dan metalurgi (pembakaran dan pemurnian logam). Nitrogen (N2) adalah gas inert yang mencegah oksidasi, digunakan untuk inerting, blanketing, dan pendinginan cryogenic, serta industri makanan untuk pengawetan. Argon (Ar) adalah gas inert untuk pengelasan TIG/MIG, aplikasi elektronik presisi (semikonduktor), dan metalurgi untuk perlakuan panas.",
  
  "apa perbedaan oxygen nitrogen dan argon": "Oksigen (O2) adalah gas oksidator yang mendukung pembakaran dan respirasi, digunakan dalam medis (terapi pernapasan, resusitasi) dan metalurgi (pembakaran dan pemurnian logam). Nitrogen (N2) adalah gas inert yang mencegah oksidasi, digunakan untuk inerting, blanketing, dan pendinginan cryogenic, serta industri makanan untuk pengawetan. Argon (Ar) adalah gas inert untuk pengelasan TIG/MIG, aplikasi elektronik presisi (semikonduktor), dan metalurgi untuk perlakuan panas.",

  "gas makanan": "Kami menyediakan gas food grade untuk industri makanan dan minuman dengan standar keamanan pangan yang ketat. Hubungi tim sales kami untuk informasi lebih lanjut.",

  "food grade": "Kami menyediakan gas food grade untuk industri makanan dan minuman dengan standar keamanan pangan yang ketat. Hubungi tim sales kami untuk informasi lebih lanjut.",

  "cara memilih gas": "Untuk memilih gas yang sesuai kebutuhan, silakan konsultasikan dengan tim sales kami. Kami akan membantu Anda menentukan jenis gas yang tepat berdasarkan aplikasi dan kebutuhan spesifik industri Anda.",

  // Distribution Network
  "kontak": "Untuk menghubungi kami: Kantor Sidoarjo - Phone: 081233906378. Kantor Balikpapan - Phone: +62 542 8531991, Fax: +62 542 8532382.",

  "nomor telepon": "Nomor telepon kami: Sidoarjo - 081233906378, Balikpapan - +62 542 8531991. Fax: +62 542 8532382.",

  "whatsapp": "Untuk layanan WhatsApp, silakan hubungi nomor telepon Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991.",

  "email": "Anda dapat mengirim email melalui form kontak di website kami atau hubungi tim sales kami melalui telepon untuk alamat email yang spesifik.",

  "cara menghubungi": "Anda dapat menghubungi kami melalui telepon di Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991, atau mengisi form kontak di website kami.",

  "alamat kantor": "Kantor Pusat kami di Komplek Pergudangan dan Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. Pabrik di Jl. AMD Projakal Kariangau Km. 5.5, Balikpapan, Kalimantan Timur.",

  "cara menuju kantor": "Untuk menuju kantor Sidoarjo, ikuti Jl. Lingkar Timur KM. 5.5 di Rangkah Kidul. Untuk Balikpapan, ikuti Jl. AMD Projakal Kariangau Km. 5.5. Gunakan Google Maps untuk navigasi yang lebih akurat.",

  "distribusi": "Jaringan distribusi kami mencakup wilayah Jawa Timur dan Kalimantan Timur. Kami terus mengembangkan jaringan distribusi untuk melayani pelanggan di seluruh Indonesia dengan layanan pengiriman yang andal dan tepat waktu.",
  
  // Career
  "karir": "Kami membuka berbagai posisi lowongan kerja termasuk Sales Executive, Installation Technician, Admin & Finance Staff, Gas Delivery Driver, Quality Control Engineer, Marketing Specialist, Warehouse Supervisor, HR Manager, dan Safety Officer. Informasi lebih lanjut dapat ditemukan di halaman Karir website kami.",

  "lowongan": "Posisi lowongan yang tersedia meliputi berbagai divisi: Sales & Marketing, Technical Operations, Finance & Admin, dan Logistics & Distribution. Kunjungi halaman Karir untuk detail persyaratan dan cara melamar.",

  "lowongan kerja": "Ya, PT Surya Inti Gas secara rutin membuka lowongan kerja untuk berbagai posisi. Kunjungi halaman Karir pada website kami untuk melihat posisi yang tersedia saat ini.",

  "cara melamar": "Untuk melamar pekerjaan, kunjungi halaman Karir pada website kami, pilih posisi yang diminati, dan isi form aplikasi online dengan CV dan portofolio Anda.",

  "posisi dibutuhkan": "Posisi yang sedang dibutuhkan meliputi Sales Executive, Installation Technician, Admin & Finance Staff, Gas Delivery Driver, Quality Control Engineer, Marketing Specialist, Warehouse Supervisor, HR Manager, dan Safety Officer. Kunjungi halaman Karir untuk detail masing-masing posisi.",

  "proses rekrutmen": "Proses rekrutmen PT Surya Inti Gas meliputi seleksi administrasi, tes kemampuan, interview, dan medical check-up. Kami mengutamakan kandidat yang memiliki kompetensi dan sesuai dengan nilai perusahaan kami.",
  
  // News
  "berita": "Berita terbaru tentang PT Surya Inti Gas mencakup sejarah perkembangan perusahaan dari tahun 2003 hingga sekarang, termasuk pendirian perusahaan, ekspansi operasional, dan pembukaan cabang baru.",
  
  "apa berita terbaru dari pt surya inti gas": "Berita terbaru tentang PT Surya Inti Gas mencakup sejarah perkembangan perusahaan dari tahun 2003 hingga sekarang, termasuk pendirian perusahaan, ekspansi operasional, dan pembukaan cabang baru.",

  "promo": "Untuk informasi promo yang sedang berlangsung, silakan hubungi tim sales kami atau kunjungi website kami secara berkala untuk update terbaru.",

  "artikel": "Anda dapat melihat artikel terbaru tentang PT Surya Inti Gas di halaman Berita pada website kami. Kami secara rutin membagikan informasi tentang industri gas dan update perusahaan.",

  "pameran": "PT Surya Inti Gas terkadang mengikuti pameran dan event industri. Silakan hubungi tim marketing kami untuk informasi tentang partisipasi dalam event yang akan datang.",

  // Gallery
  "galeri": "Galeri kami menampilkan berbagai foto kegiatan perusahaan, fasilitas produksi, tim kami, dan dokumentasi operasional yang mencerminkan komitmen kami terhadap kualitas dan keselamatan.",
  
  // General
  "jam operasional": "Jam operasional kantor kami Senin - Jumat: 08:00 - 17:00 WIB. Untuk keadaan darurat, silakan hubungi nomor telepon yang tersedia.",
  
  "apa jam operasional perusahaan": "Jam operasional kantor kami Senin - Jumat: 08:00 - 17:00 WIB. Untuk keadaan darurat, silakan hubungi nomor telepon yang tersedia.",

  "layanan": "Layanan kami meliputi penyediaan gas industri, pengiriman dan distribusi, instalasi peralatan gas, maintenance dan troubleshooting, konsultasi teknis, dan layanan pelanggan 24/7 untuk keadaan darurat.",
  
  "layanan apa saja yang disediakan pt surya inti gas": "Layanan kami meliputi penyediaan gas industri, pengiriman dan distribusi, instalasi peralatan gas, maintenance dan troubleshooting, konsultasi teknis, dan layanan pelanggan 24/7 untuk keadaan darurat.",

  "pengiriman": "Ya, kami melayani pengiriman gas ke lokasi pelanggan. Jaringan distribusi kami mencakup wilayah Jawa Timur dan Kalimantan Timur dengan layanan pengiriman yang andal dan tepat waktu.",

  "pengiriman luar kota": "Kami melayani pengiriman ke berbagai wilayah di Jawa Timur dan Kalimantan Timur. Untuk wilayah lain, silakan hubungi tim sales kami untuk informasi ketersediaan layanan.",

  "isi ulang": "Ya, kami menyediakan layanan isi ulang tabung gas. Hubungi tim sales kami untuk informasi tentang prosedur dan jadwal isi ulang.",

  "sewa tabung": "Untuk informasi tentang penyewaan tabung gas, silakan hubungi tim sales kami. Kami dapat memberikan opsi sewa yang sesuai dengan kebutuhan bisnis Anda.",

  "proses pemesanan": "Untuk memesan produk, Anda dapat menghubungi tim sales kami melalui telepon di Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991, atau mengisi form kontak di website kami.",

  "estimasi pengiriman": "Estimasi waktu pengiriman bervariasi tergantung lokasi dan jenis produk. Hubungi tim sales kami untuk informasi yang lebih spesifik sesuai lokasi Anda.",
  
  "berapa lama estimasi pengiriman": "Estimasi waktu pengiriman bervariasi tergantung lokasi dan jenis produk. Hubungi tim sales kami untuk informasi yang lebih spesifik sesuai lokasi Anda.",

  "pelanggan perusahaan": "Ya, kami melayani pelanggan perusahaan (B2B) dengan berbagai kebutuhan gas industri. Tim sales kami siap membantu menyediakan solusi yang sesuai untuk bisnis Anda.",

  "pelanggan perorangan": "Kami melayani pelanggan perorangan untuk kebutuhan gas medis dan industri tertentu. Hubungi tim sales kami untuk informasi lebih lanjut.",

  "wilayah distribusi": "Jaringan distribusi kami mencakup wilayah Jawa Timur dan Kalimantan Timur. Kami terus mengembangkan jaringan distribusi untuk melayani pelanggan di seluruh Indonesia.",
  
  "di mana saja wilayah distribusi pt surya inti gas": "Jaringan distribusi kami mencakup wilayah Jawa Timur dan Kalimantan Timur. Kami terus mengembangkan jaringan distribusi untuk melayani pelanggan di seluruh Indonesia.",

  "distributor": "Untuk informasi tentang menjadi distributor PT Surya Inti Gas, silakan hubungi tim sales kami. Kami akan memberikan informasi tentang persyaratan dan proses kerjasama.",
  
  "apakah ada distributor di kota saya": "Untuk informasi tentang distributor di kota Anda, silakan hubungi tim sales kami atau lihat peta jaringan distribusi di halaman Distribusi pada website kami.",
  
  "cara menjadi distributor": "Untuk menjadi distributor, silakan hubungi tim sales kami melalui telepon atau form kontak. Kami akan membahas peluang kerjasama dan persyaratan yang diperlukan.",

  "jawa timur": "Ya, PT Surya Inti Gas melayani seluruh wilayah Jawa Timur dengan kantor pusat di Sidoarjo. Hubungi kami untuk informasi distribusi di area spesifik.",

  "peta distributor": "Anda dapat melihat peta jaringan distribusi kami di halaman Distribusi pada website ini untuk informasi lokasi dan coverage area.",
  
  "bagaimana melihat peta jaringan distributor": "Anda dapat melihat peta jaringan distribusi kami di halaman Distribusi pada website ini untuk informasi lokasi dan coverage area.",

  "cara memesan": "Anda dapat memesan produk dengan menghubungi tim sales kami melalui telepon atau mengisi form kontak di website kami. Tim kami akan segera memproses pesanan Anda.",

  "pemesanan online": "Untuk saat ini, pemesanan dapat dilakukan melalui telepon atau form kontak di website kami. Kami sedang mengembangkan sistem pemesanan online untuk kemudahan Anda.",

  "penawaran harga": "Untuk mendapatkan penawaran harga, silakan hubungi tim sales kami dengan menyebutkan jenis gas dan kuantitas yang Anda butuhkan. Kami akan memberikan penawaran yang kompetitif.",
  
  "bagaimana cara meminta penawaran harga": "Untuk mendapatkan penawaran harga, silakan hubungi tim sales kami dengan menyebutkan jenis gas dan kuantitas yang Anda butuhkan. Kami akan memberikan penawaran yang kompetitif.",

  "minimum pembelian": "Minimum pembelian bervariasi tergantung jenis produk dan lokasi. Hubungi tim sales kami untuk informasi detail tentang minimum order quantity.",

  "metode pembayaran": "Kami menerima berbagai metode pembayaran termasuk transfer bank. Hubungi tim finance kami untuk informasi detail tentang metode pembayaran yang tersedia.",

  "transfer bank": "Ya, kami menerima pembayaran melalui transfer bank. Hubungi tim finance kami untuk informasi rekening bank dan prosedur pembayaran.",

  "status pesanan": "Untuk mengecek status pesanan, silakan hubungi tim sales kami dengan menyebutkan nomor pesanan atau detail pemesanan Anda.",

  "harga": "Harga produk bervariasi tergantung jenis gas, kuantitas, dan lokasi. Hubungi tim sales kami untuk mendapatkan penawaran harga yang spesifik sesuai kebutuhan Anda.",

  "harga oksigen": "Harga oksigen bervariasi tergantung ukuran tabung dan kuantitas. Hubungi tim sales kami untuk penawaran harga yang spesifik.",
  
  "berapa harga tabung oxygen": "Harga tabung Oxygen bervariasi tergantung ukuran tabung dan kuantitas. Hubungi tim sales kami untuk penawaran harga yang spesifik.",

  "harga nitrogen": "Harga nitrogen bervariasi tergantung ukuran tabung dan kuantitas. Hubungi tim sales kami untuk penawaran harga yang spesifik.",
  
  "berapa harga nitrogen": "Harga Nitrogen bervariasi tergantung ukuran tabung dan kuantitas. Hubungi tim sales kami untuk penawaran harga yang spesifik.",

  "biaya isi ulang": "Biaya isi ulang tabung bervariasi tergantung jenis gas dan ukuran tabung. Hubungi tim sales kami untuk informasi harga yang terbaru.",
  
  "berapa biaya isi ulang tabung": "Biaya isi ulang tabung bervariasi tergantung jenis gas dan ukuran tabung. Hubungi tim sales kami untuk informasi harga yang terbaru.",

  "harga wilayah": "Harga dapat berbeda untuk setiap wilayah tergantung biaya transportasi dan logistik. Hubungi tim sales kami di area Anda untuk harga yang akurat.",
  
  "apakah harga berbeda untuk setiap wilayah": "Harga dapat berbeda untuk setiap wilayah tergantung biaya transportasi dan logistik. Hubungi tim sales kami di area Anda untuk harga yang akurat.",

  "daftar harga": "Untuk mendapatkan daftar harga terbaru, silakan hubungi tim sales kami. Kami akan memberikan katalog harga yang lengkap dan terupdate.",
  
  "bagaimana cara mendapatkan daftar harga terbaru": "Untuk mendapatkan daftar harga terbaru, silakan hubungi tim sales kami. Kami akan memberikan katalog harga yang lengkap dan terupdate.",

  "kualitas": "Produk kami memenuhi standar internasional dan telah tersertifikasi. Kami memiliki tim Quality Control yang memastikan semua produk memenuhi spesifikasi yang ditetapkan sebelum dikirim ke pelanggan.",

  "keselamatan": "Keselamatan adalah prioritas utama kami. Kami mematuhi semua standar keselamatan industri dan memiliki tim Safety Officer yang memastikan kepatuhan terhadap prosedur keselamatan di semua lokasi operasional.",

  "menyimpan tabung": "Tabung gas harus disimpan di tempat yang berventilasi baik, jauh dari sumber panas dan api, serta dalam posisi tegak dan terikat dengan aman. Pastikan area penyimpanan bebas dari bahan mudah terbakar.",
  
  "bagaimana cara menyimpan tabung gas dengan aman": "Tabung gas harus disimpan di tempat yang berventilasi baik, jauh dari sumber panas dan api, serta dalam posisi tegak dan terikat dengan aman. Pastikan area penyimpanan bebas dari bahan mudah terbakar.",

  "kebocoran gas": "Jika terjadi kebocoran gas, segera evakuasi area, matikan sumber api, dan hubungi tim keselamatan kami atau emergency contact. Jangan gunakan alat elektronik atau sumber api di area kebocoran.",
  
  "apa yang harus dilakukan jika terjadi kebocoran gas": "Jika terjadi kebocoran gas, segera evakuasi area, matikan sumber api, dan hubungi tim keselamatan kami atau emergency contact. Jangan gunakan alat elektronik atau sumber api di area kebocoran.",

  "menggunakan tabung": "Gunakan tabung gas sesuai prosedur keselamatan: pastikan regulator terpasang dengan benar, periksa kebocoran sebelum penggunaan, dan gunakan di area yang berventilasi baik. Ikuti petunjuk penggunaan dari tim teknis kami.",
  
  "bagaimana cara menggunakan tabung gas dengan benar": "Gunakan tabung gas sesuai prosedur keselamatan: pastikan regulator terpasang dengan benar, periksa kebocoran sebelum penggunaan, dan gunakan di area yang berventilasi baik. Ikuti petunjuk penggunaan dari tim teknis kami.",

  "prosedur keselamatan": "Prosedur keselamatan penggunaan gas industri meliputi: penggunaan APD yang sesuai, pemeriksaan rutin peralatan, pelatihan operator, dan kepatuhan terhadap standar HSE. Tim Safety Officer kami siap membantu dengan pelatihan dan konsultasi.",
  
  "apa saja prosedur keselamatan penggunaan gas industri": "Prosedur keselamatan penggunaan gas industri meliputi: penggunaan APD yang sesuai, pemeriksaan rutin peralatan, pelatihan operator, dan kepatuhan terhadap standar HSE. Tim Safety Officer kami siap membantu dengan pelatihan dan konsultasi.",
  
  // Fallback responses
  "default": "Maaf, saya kurang mengerti pertanyaan Anda. Saya dapat membantu dengan informasi tentang produk gas, layanan, lokasi, karir, dan informasi perusahaan PT Surya Inti Gas. Coba tanyakan tentang produk, lokasi, atau kontak kami. Atau hubungi kami langsung di Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991.",
  
  "greeting": "Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu? Saya dapat memberikan informasi tentang produk gas, layanan, lokasi, karir, dan informasi perusahaan lainnya.",
  
  "help": "Saya dapat membantu Anda dengan informasi tentang: Produk gas industri (Asetilena, Oksigen, Nitrogen, dll), Layanan perusahaan, Lokasi kantor Sidoarjo dan Balikpapan, Informasi karir dan lowongan kerja, Sejarah dan profil perusahaan, serta kontak dan jam operasional.",
  
  // Additional questions from user
  "berapa nomor telepon pt surya inti gas": "Nomor telepon kami: Sidoarjo - 081233906378, Balikpapan - +62 542 8531991. Fax: +62 542 8532382.",
  
  "apakah tersedia layanan whatsapp": "Untuk layanan WhatsApp, silakan hubungi nomor telepon Sidoarjo - 081233906378 atau Balikpapan - +62 542 8531991.",
  
  "bagaimana cara mengirim email": "Anda dapat mengirim email melalui form kontak di website kami atau hubungi tim sales kami melalui telepon untuk alamat email yang spesifik.",
  
  "di mana lokasi kantor pt surya inti gas": "Kantor Pusat kami di Komplek Pergudangan dan Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232. Pabrik di Jl. AMD Projakal Kariangau Km. 5.5, Balikpapan, Kalimantan Timur.",
  
  "bagaimana cara menuju kantor pt surya inti gas": "Untuk menuju kantor Sidoarjo, ikuti Jl. Lingkar Timur KM. 5.5 di Rangkah Kidul. Untuk Balikpapan, ikuti Jl. AMD Projakal Kariangau Km. 5.5. Gunakan Google Maps untuk navigasi yang lebih akurat.",
  
  "apakah ada promo yang sedang berlangsung": "Untuk informasi promo yang sedang berlangsung, silakan hubungi tim sales kami atau kunjungi website kami secara berkala untuk update terbaru.",
  
  "bagaimana cara melihat artikel terbaru": "Anda dapat melihat artikel terbaru tentang PT Surya Inti Gas di halaman Berita pada website kami. Kami secara rutin membagikan informasi tentang industri gas dan update perusahaan.",
  
  "apakah pt surya inti gas mengikuti pameran atau event": "PT Surya Inti Gas terkadang mengikuti pameran dan event industri. Silakan hubungi tim marketing kami untuk informasi tentang partisipasi dalam event yang akan datang.",
  
  "apakah pt surya inti gas sedang membuka lowongan kerja": "Ya, PT Surya Inti Gas secara rutin membuka lowongan kerja untuk berbagai posisi. Kunjungi halaman Karir pada website kami untuk melihat posisi yang tersedia saat ini.",
  
  "bagaimana cara melamar pekerjaan": "Untuk melamar pekerjaan, kunjungi halaman Karir pada website kami, pilih posisi yang diminati, dan isi form aplikasi online dengan CV dan portofolio Anda.",
  
  "apa saja posisi yang sedang dibutuhkan": "Posisi yang sedang dibutuhkan meliputi Sales Executive, Installation Technician, Admin & Finance Staff, Gas Delivery Driver, Quality Control Engineer, Marketing Specialist, Warehouse Supervisor, HR Manager, dan Safety Officer. Kunjungi halaman Karir untuk detail masing-masing posisi.",
  
  "bagaimana proses rekrutmen pt surya inti gas": "Proses rekrutmen PT Surya Inti Gas meliputi seleksi administrasi, tes kemampuan, interview, dan medical check-up. Kami mengutamakan kandidat yang memiliki kompetensi dan sesuai dengan nilai perusahaan kami."
};

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
  source?: "local" | "ai" | "fallback";
}

interface HistoryItem {
  role: "user" | "assistant";
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Halo! Selamat datang di PT Surya Inti Gas. Ada yang bisa saya bantu?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);

  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Local FAQ matcher
  const matchLocalFAQ = (message: string): string | null => {
    // Normalize special characters to regular characters
    const normalizedMessage = message
      .toLowerCase()
      .replace(/₀/g, '0')
      .replace(/₁/g, '1')
      .replace(/₂/g, '2')
      .replace(/₃/g, '3')
      .replace(/₄/g, '4')
      .replace(/₅/g, '5')
      .replace(/₆/g, '6')
      .replace(/₇/g, '7')
      .replace(/₈/g, '8')
      .replace(/₉/g, '9')
      .replace(/⁰/g, '0')
      .replace(/¹/g, '1')
      .replace(/²/g, '2')
      .replace(/³/g, '3')
      .replace(/⁴/g, '4')
      .replace(/⁵/g, '5')
      .replace(/⁶/g, '6')
      .replace(/⁷/g, '7')
      .replace(/⁸/g, '8')
      .replace(/⁹/g, '9');

    const lowerMessage = normalizedMessage;
    
    // Check for personal questions first (highest priority)
    if (lowerMessage.includes('siapa') || lowerMessage.includes('who')) {
      if (lowerMessage.includes('saya') || lowerMessage.includes('aku') || lowerMessage.includes('ku')) {
        return "Saya tidak tahu siapa Anda, tapi saya adalah asisten virtual PT Surya Inti Gas yang siap membantu Anda. Ada yang bisa saya bantu?";
      }
      return knowledgeBase["siapa"];
    }
    
    if (lowerMessage.includes('kamu') || lowerMessage.includes('anda') || lowerMessage.includes('bot')) {
      return knowledgeBase["kamu"];
    }
    
    if (lowerMessage.includes('kalian') || lowerMessage.includes('perusahaan')) {
      return knowledgeBase["kalian"];
    }
    
    // Check for greetings (more comprehensive)
    if (lowerMessage.includes('halo') || lowerMessage.includes('hello') || lowerMessage.includes('hi') || lowerMessage.includes('hai') || lowerMessage.includes('hy') || lowerMessage.includes('selamat') || lowerMessage.includes('pagi') || lowerMessage.includes('siang') || lowerMessage.includes('sore') || lowerMessage.includes('malam') || lowerMessage.includes('assalam') || lowerMessage.includes('salam')) {
      return knowledgeBase["greeting"];
    }
    
    // Check for help requests
    if (lowerMessage.includes('bantu') || lowerMessage.includes('help') || lowerMessage.includes('apa yang bisa') || lowerMessage.includes('informasi apa') || lowerMessage.includes('fitur')) {
      return knowledgeBase["help"];
    }
    
    // Check for thanks
    if (lowerMessage.includes('terima kasih') || lowerMessage.includes('thanks') || lowerMessage.includes('makasih') || lowerMessage.includes('syukur') || lowerMessage.includes('trimakasih') || lowerMessage.includes('tq')) {
      return "Sama-sama! Senang bisa membantu Anda. Ada lagi yang ingin ditanyakan?";
    }
    
    // Check for short messages that might be greetings or unclear
    if (lowerMessage.length <= 3) {
      return "Halo! Saya asisten virtual PT Surya Inti Gas. Ada yang bisa saya bantu?";
    }
    
    // Check for common casual messages
    if (lowerMessage.includes('haus') || lowerMessage.includes('lapar') || lowerMessage.includes('thirsty') || lowerMessage.includes('hungry')) {
      return "Haha, saya asisten virtual jadi tidak bisa kasih minum atau makanan! 😅 Tapi saya bisa bantu Anda dengan informasi tentang produk gas PT Surya Inti Gas. Ada yang ingin ditanyakan?";
    }
    
    if (lowerMessage.includes('capek') || lowerMessage.includes('lelah') || lowerMessage.includes('tired')) {
      return "Semoga Anda tidak terlalu capek! Saya di sini siap membantu dengan informasi apa saja tentang PT Surya Inti Gas agar Anda tidak perlu capek mencari info. Ada yang bisa saya bantu?";
    }
    
    if (lowerMessage.includes('senang') || lowerMessage.includes('happy') || lowerMessage.includes('bahagia')) {
      return "Senang mendengarnya! 😊 Semoga harinya menyenangkan. Ada informasi tentang PT Surya Inti Gas yang bisa saya bantu?";
    }
    
    if (lowerMessage.includes('sedih') || lowerMessage.includes('sad') || lowerMessage.includes('nangis')) {
      return "Jangan sedih ya! 😢 Semoga harinya lebih baik. Saya di sini siap membantu dengan informasi apa saja tentang PT Surya Inti Gas. Mungkin ada yang bisa saya bantu?";
    }
    
    // Check exact matches first
    for (const [key, value] of Object.entries(knowledgeBase)) {
      if (key === 'default' || key === 'greeting' || key === 'help' || key === 'siapa' || key === 'kamu' || key === 'kalian') continue; // Skip these special keys

      // Only match if the key is a significant part of the message (avoid partial matches on short words)
      if (key.length > 4 && (lowerMessage.includes(key) || key.includes(lowerMessage) || lowerMessage.includes(key.replace(/ /g, ' ')))) {
        return value;
      }
    }

    // Special handling for product names that might not match exact keys
    // Handle CO2 with various spellings including subscript characters
    if (lowerMessage.includes('co2') || lowerMessage.includes('karbon dioksida') || lowerMessage.includes('co₂') || lowerMessage.includes('co²') || lowerMessage.includes('carbon dioxide')) {
      return knowledgeBase["co2"];
    }
    if (lowerMessage.includes('asetilena') || lowerMessage.includes('acetylene')) {
      return knowledgeBase["asetilena"];
    }

    // Special handling for "perbedaan" questions - check if it's asking about gas differences
    if (lowerMessage.includes('perbedaan') && (lowerMessage.includes('oksigen') || lowerMessage.includes('nitrogen') || lowerMessage.includes('argon') || lowerMessage.includes('oxygen') || lowerMessage.includes('nitrogen') || lowerMessage.includes('argon'))) {
      return knowledgeBase["perbedaan oksigen nitrogen argon"];
    }
    
    // Special handling for specific question patterns
    if (lowerMessage.includes('apa itu') && lowerMessage.includes('pt surya inti gas')) {
      return knowledgeBase["apa itu pt surya inti gas"];
    }
    
    if (lowerMessage.includes('kapan') && lowerMessage.includes('didirikan')) {
      return knowledgeBase["kapan pt surya inti gas didirikan"];
    }
    
    if (lowerMessage.includes('visi') && lowerMessage.includes('misi')) {
      return knowledgeBase["apa visi dan misi pt surya inti gas"];
    }
    
    if (lowerMessage.includes('bidang usaha')) {
      return knowledgeBase["apa saja bidang usaha pt surya inti gas"];
    }
    
    if (lowerMessage.includes('lokasi kantor pusat')) {
      return knowledgeBase["di mana lokasi kantor pusat pt surya inti gas"];
    }
    
    if (lowerMessage.includes('produk apa saja')) {
      return knowledgeBase["produk apa saja yang dijual pt surya inti gas"];
    }
    
    if (lowerMessage.includes('gas industri') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia gas industri"];
    }
    
    if (lowerMessage.includes('gas medis') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia gas medis"];
    }
    
    if (lowerMessage.includes('co2') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia co2"];
    }
    
    if (lowerMessage.includes('acetylene') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia acetylene"];
    }
    
    if (lowerMessage.includes('helium') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia helium"];
    }
    
    if (lowerMessage.includes('layanan apa saja')) {
      return knowledgeBase["layanan apa saja yang disediakan pt surya inti gas"];
    }
    
    if (lowerMessage.includes('wilayah distribusi')) {
      return knowledgeBase["di mana saja wilayah distribusi pt surya inti gas"];
    }
    
    if (lowerMessage.includes('distributor') && lowerMessage.includes('kota')) {
      return knowledgeBase["apakah ada distributor di kota saya"];
    }
    
    if (lowerMessage.includes('harga') && lowerMessage.includes('oxygen')) {
      return knowledgeBase["berapa harga tabung oxygen"];
    }
    
    if (lowerMessage.includes('harga') && lowerMessage.includes('nitrogen')) {
      return knowledgeBase["berapa harga nitrogen"];
    }
    
    if (lowerMessage.includes('jam operasional')) {
      return knowledgeBase["apa jam operasional perusahaan"];
    }
    
    if (lowerMessage.includes('berita terbaru')) {
      return knowledgeBase["apa berita terbaru dari pt surya inti gas"];
    }
    
    if (lowerMessage.includes('prosedur keselamatan')) {
      return knowledgeBase["apa saja prosedur keselamatan penggunaan gas industri"];
    }
    
    if (lowerMessage.includes('estimasi pengiriman')) {
      return knowledgeBase["berapa lama estimasi pengiriman"];
    }
    
    if (lowerMessage.includes('peta jaringan distributor')) {
      return knowledgeBase["bagaimana melihat peta jaringan distributor"];
    }
    
    if (lowerMessage.includes('penawaran harga')) {
      return knowledgeBase["bagaimana cara meminta penawaran harga"];
    }
    
    if (lowerMessage.includes('biaya isi ulang')) {
      return knowledgeBase["berapa biaya isi ulang tabung"];
    }
    
    if (lowerMessage.includes('harga') && lowerMessage.includes('wilayah')) {
      return knowledgeBase["apakah harga berbeda untuk setiap wilayah"];
    }
    
    if (lowerMessage.includes('daftar harga') && lowerMessage.includes('terbaru')) {
      return knowledgeBase["bagaimana cara mendapatkan daftar harga terbaru"];
    }
    
    if (lowerMessage.includes('menyimpan tabung') && lowerMessage.includes('aman')) {
      return knowledgeBase["bagaimana cara menyimpan tabung gas dengan aman"];
    }
    
    if (lowerMessage.includes('kebocoran gas')) {
      return knowledgeBase["apa yang harus dilakukan jika terjadi kebocoran gas"];
    }
    
    if (lowerMessage.includes('menggunakan tabung') && lowerMessage.includes('benar')) {
      return knowledgeBase["bagaimana cara menggunakan tabung gas dengan benar"];
    }
    
    if (lowerMessage.includes('nomor telepon')) {
      return knowledgeBase["berapa nomor telepon pt surya inti gas"];
    }
    
    if (lowerMessage.includes('whatsapp') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["apakah tersedia layanan whatsapp"];
    }
    
    if (lowerMessage.includes('mengirim email')) {
      return knowledgeBase["bagaimana cara mengirim email"];
    }
    
    if (lowerMessage.includes('lokasi kantor') && !lowerMessage.includes('pusat')) {
      return knowledgeBase["di mana lokasi kantor pt surya inti gas"];
    }
    
    if (lowerMessage.includes('menuju kantor')) {
      return knowledgeBase["bagaimana cara menuju kantor pt surya inti gas"];
    }
    
    if (lowerMessage.includes('promo') && (lowerMessage.includes('sedang') || lowerMessage.includes('berlangsung'))) {
      return knowledgeBase["apakah ada promo yang sedang berlangsung"];
    }
    
    if (lowerMessage.includes('artikel') && lowerMessage.includes('terbaru')) {
      return knowledgeBase["bagaimana cara melihat artikel terbaru"];
    }
    
    if (lowerMessage.includes('pameran') || lowerMessage.includes('event')) {
      return knowledgeBase["apakah pt surya inti gas mengikuti pameran atau event"];
    }
    
    if (lowerMessage.includes('lowongan kerja') && (lowerMessage.includes('sedang') || lowerMessage.includes('buka'))) {
      return knowledgeBase["apakah pt surya inti gas sedang membuka lowongan kerja"];
    }
    
    if (lowerMessage.includes('melamar pekerjaan')) {
      return knowledgeBase["bagaimana cara melamar pekerjaan"];
    }
    
    if (lowerMessage.includes('posisi') && lowerMessage.includes('dibutuhkan')) {
      return knowledgeBase["apa saja posisi yang sedang dibutuhkan"];
    }
    
    if (lowerMessage.includes('proses rekrutmen')) {
      return knowledgeBase["bagaimana proses rekrutmen pt surya inti gas"];
    }
    
    // Additional pattern matching for existing entries
    if (lowerMessage.includes('ukuran tabung') && (lowerMessage.includes('berapa') || lowerMessage.includes('tersedia'))) {
      return knowledgeBase["ukuran tabung"];
    }
    
    if (lowerMessage.includes('gas makanan') || lowerMessage.includes('food grade')) {
      return knowledgeBase["gas makanan"];
    }
    
    if (lowerMessage.includes('lpg') && (lowerMessage.includes('tersedia') || lowerMessage.includes('ada'))) {
      return knowledgeBase["lpg"];
    }
    
    if (lowerMessage.includes('memilih gas') && lowerMessage.includes('sesuai')) {
      return knowledgeBase["cara memilih gas"];
    }
    
    if (lowerMessage.includes('pengiriman') && (lowerMessage.includes('gas') || lowerMessage.includes('melayani'))) {
      return knowledgeBase["pengiriman"];
    }
    
    if (lowerMessage.includes('pengiriman') && lowerMessage.includes('luar kota')) {
      return knowledgeBase["pengiriman luar kota"];
    }
    
    if (lowerMessage.includes('isi ulang') && lowerMessage.includes('tabung')) {
      return knowledgeBase["isi ulang"];
    }
    
    if (lowerMessage.includes('sewa') && lowerMessage.includes('tabung')) {
      return knowledgeBase["sewa tabung"];
    }
    
    if (lowerMessage.includes('proses pemesanan') || (lowerMessage.includes('pemesanan') && lowerMessage.includes('gas'))) {
      return knowledgeBase["proses pemesanan"];
    }
    
    if (lowerMessage.includes('pelanggan perusahaan') || lowerMessage.includes('b2b')) {
      return knowledgeBase["pelanggan perusahaan"];
    }
    
    if (lowerMessage.includes('pelanggan perorangan') || lowerMessage.includes('b2c')) {
      return knowledgeBase["pelanggan perorangan"];
    }
    
    if (lowerMessage.includes('jawa timur') && lowerMessage.includes('melayani')) {
      return knowledgeBase["jawa timur"];
    }
    
    if (lowerMessage.includes('cara memesan') && lowerMessage.includes('produk')) {
      return knowledgeBase["cara memesan"];
    }
    
    if (lowerMessage.includes('pemesanan online') || lowerMessage.includes('online') && lowerMessage.includes('pesan')) {
      return knowledgeBase["pemesanan online"];
    }
    
    if (lowerMessage.includes('minimum pembelian') || lowerMessage.includes('minimum order')) {
      return knowledgeBase["minimum pembelian"];
    }
    
    if (lowerMessage.includes('metode pembayaran') || lowerMessage.includes('cara bayar')) {
      return knowledgeBase["metode pembayaran"];
    }
    
    if (lowerMessage.includes('transfer bank') || lowerMessage.includes('transfer')) {
      return knowledgeBase["transfer bank"];
    }
    
    if (lowerMessage.includes('status pesanan') || lowerMessage.includes('cek pesanan')) {
      return knowledgeBase["status pesanan"];
    }

    // Check for partial matches - but prioritize more specific matches first
    if (lowerMessage.includes('lokasi') || lowerMessage.includes('alamat') || lowerMessage.includes('kantor') || lowerMessage.includes('dimana')) {
      return knowledgeBase["lokasi"];
    }

    if (lowerMessage.includes('kontak') || lowerMessage.includes('hubungi') || lowerMessage.includes('telp') || lowerMessage.includes('phone')) {
      return knowledgeBase["kontak"];
    }

    if (lowerMessage.includes('email') || lowerMessage.includes('surat')) {
      return knowledgeBase["email"];
    }

    if (lowerMessage.includes('distribusi') || lowerMessage.includes('area') || lowerMessage.includes('coverage')) {
      return knowledgeBase["distribusi"];
    }

    if (lowerMessage.includes('karir') || lowerMessage.includes('kerja') || lowerMessage.includes('job')) {
      return knowledgeBase["karir"];
    }

    if (lowerMessage.includes('lowongan') || lowerMessage.includes('vacancy')) {
      return knowledgeBase["lowongan"];
    }

    if (lowerMessage.includes('berita') || lowerMessage.includes('news')) {
      return knowledgeBase["berita"];
    }

    if (lowerMessage.includes('promo') || lowerMessage.includes('diskon') || lowerMessage.includes('promotion')) {
      return knowledgeBase["promo"];
    }

    if (lowerMessage.includes('galeri') || lowerMessage.includes('gallery') || lowerMessage.includes('foto')) {
      return knowledgeBase["galeri"];
    }

    if (lowerMessage.includes('jam') || lowerMessage.includes('buka') || lowerMessage.includes('operasional')) {
      return knowledgeBase["jam operasional"];
    }

    if (lowerMessage.includes('layanan') || lowerMessage.includes('service')) {
      return knowledgeBase["layanan"];
    }

    if (lowerMessage.includes('harga') || lowerMessage.includes('price') || lowerMessage.includes('biaya')) {
      return knowledgeBase["harga"];
    }

    if (lowerMessage.includes('kualitas') || lowerMessage.includes('quality')) {
      return knowledgeBase["kualitas"];
    }

    if (lowerMessage.includes('keselamatan') || lowerMessage.includes('safety')) {
      return knowledgeBase["keselamatan"];
    }

    // If no match found, return null to trigger AI response
    return null;
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: generateUUID(),
      text: inputValue,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);

    const messageToSend = inputValue;

    setInputValue("");
    setIsLoading(true);

    // Check local FAQ first
    const localResponse = matchLocalFAQ(messageToSend);
    if (localResponse) {
      const botMessage: Message = {
        id: generateUUID(),
        text: localResponse,
        sender: "bot",
        timestamp: new Date(),
        source: "local",
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsLoading(false);
      return;
    }

    try {
      // Build history
      const history: HistoryItem[] = messages
        .filter(
          (msg) => msg.sender !== "bot" || msg.source !== "local"
        )
        .map((msg) => ({
          role: msg.sender === "user" ? "user" : "assistant",
          content: msg.text,
        }));

      // Create empty bot message
      const botMessageId = generateUUID();

      const botMessage: Message = {
        id: botMessageId,
        text: "",
        sender: "bot",
        timestamp: new Date(),
        source: "ai",
      };

      setMessages((prev) => [...prev, botMessage]);

      // Fetch SSE stream
      const response = await fetch(
        `${getApiUrl(API_ENDPOINTS.CHAT)}?stream=true`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "text/event-stream",
          },
          body: JSON.stringify({
            message: messageToSend,
            history,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to connect to server");
      }

      // Check if response is JSON (fallback mode) or stream
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        // Fallback to non-streaming response
        const data = await response.json();
        
        setMessages((prev) =>
          prev.map((msg) =>
            msg.id === botMessageId
              ? {
                  ...msg,
                  text: data.data?.message || "Maaf, terjadi kesalahan.",
                  source: data.data?.source || "fallback",
                }
              : msg
          )
        );
        
        setIsLoading(false);
        return;
      }

      if (!response.body) {
        throw new Error("No response body");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder();

      let fullText = "";

      while (true) {
        const { done, value } = await reader.read();

        if (done) break;

        const chunk = decoder.decode(value, {
          stream: true,
        });

        const lines = chunk.split("\n");

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;

          const jsonString = line
            .replace("data: ", "")
            .trim();

          if (!jsonString) continue;

          try {
            const data = JSON.parse(jsonString);

            // Append streamed text
            if (data.chunk) {
              fullText += data.chunk;

              setMessages((prev) =>
                prev.map((msg) =>
                  msg.id === botMessageId
                    ? {
                        ...msg,
                        text: fullText,
                      }
                    : msg
                )
              );
            }

            // Done streaming
            if (data.done) {
              setIsLoading(false);
            }

            // Handle server error
            if (data.error) {
              throw new Error(data.error);
            }
          } catch (err) {
            console.error("Stream parse error:", err);
          }
        }
      }
    } catch (error) {
      console.error(error);

      const errorMessage: Message = {
        id: generateUUID(),
        text: "Maaf, terjadi kesalahan. Silakan coba lagi nanti.",
        sender: "bot",
        timestamp: new Date(),
        source: "fallback",
      };

      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      {/* Chat Button */}
      <motion.button
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-7 right-6 z-50 bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
      >
        {isOpen ? (
          <X size={24} />
        ) : (
          <MessageCircle size={24} />
        )}
      </motion.button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 20,
            }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-[7rem] right-6 z-50 w-96 max-w-[calc(100vw-3rem)] bg-white rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white p-4">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-full">
                  <Bot size={24} />
                </div>

                <div>
                  <h3 className="font-semibold">
                    Asisten Virtual
                  </h3>

                  <p className="text-xs text-blue-100">
                    PT Surya Inti Gas
                  </p>
                </div>
              </div>
            </div>

            {/* Messages */}
            <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${
                    message.sender === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.sender === "bot" && (
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Bot
                        size={16}
                        className="text-blue-600"
                      />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] p-3 rounded-2xl ${
                      message.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-md"
                        : "bg-white text-gray-800 rounded-bl-md shadow-sm"
                    }`}
                  >
                    <p className="text-sm whitespace-pre-wrap">
                      {message.text}
                    </p>

                    <div className="flex items-center gap-2 mt-1">
                      <p
                        className={`text-xs ${
                          message.sender === "user"
                            ? "text-blue-100"
                            : "text-gray-400"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString(
                          "id-ID",
                          {
                            hour: "2-digit",
                            minute: "2-digit",
                          }
                        )}
                      </p>

                      {message.sender === "bot" &&
                        message.source && (
                          <span
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              message.source === "local"
                                ? "bg-green-100 text-green-700"
                                : message.source === "ai"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-gray-100 text-gray-600"
                            }`}
                          >
                            {message.source === "local"
                              ? "FAQ"
                              : message.source === "ai"
                              ? "AI"
                              : "Default"}
                          </span>
                        )}
                    </div>
                  </div>

                  {message.sender === "user" && (
                    <div className="bg-gray-200 p-2 rounded-full flex-shrink-0">
                      <User
                        size={16}
                        className="text-gray-600"
                      />
                    </div>
                  )}
                </motion.div>
              ))}

              {/* Loading */}
              {isLoading &&
                messages[messages.length - 1]?.sender !==
                  "bot" && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex gap-3 justify-start"
                  >
                    <div className="bg-blue-100 p-2 rounded-full flex-shrink-0">
                      <Bot
                        size={16}
                        className="text-blue-600"
                      />
                    </div>

                    <div className="bg-white p-3 rounded-2xl rounded-bl-md shadow-sm">
                      <div className="flex gap-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />

                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{
                            animationDelay: "0.1s",
                          }}
                        />

                        <div
                          className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                          style={{
                            animationDelay: "0.2s",
                          }}
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <div className="p-4 bg-white border-t">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) =>
                    setInputValue(e.target.value)
                  }
                  onKeyDown={handleKeyDown}
                  placeholder="Ketik pesan Anda..."
                  className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  disabled={isLoading}
                />

                <button
                
                  onClick={handleSendMessage}
                  disabled={
                    isLoading || !inputValue.trim()
                  }
                  className="bg-blue-600 text-white p-2 rounded-full hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                >
                  <Send size={20} />
                </button>
              </div>

              <p className="text-xs text-gray-400 mt-2 text-center">
                Tekan Enter untuk mengirim
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}