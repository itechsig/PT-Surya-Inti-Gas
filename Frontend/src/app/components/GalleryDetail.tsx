import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { 
  Calendar, 
  ArrowLeft,
  X,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { createPortal } from 'react-dom';

// Types
type GalleryItem = {
  id: string;
  thumbnail: string;
  fullSize: string;
  alt: string;
  title: string;
  description: string;
  detailedDescription?: string;
  category: string;
  year: number;
  size?: 'small' | 'medium' | 'large' | 'wide' | 'tall';
};

const galleryItems: GalleryItem[] = [
  {
    id: 'oxygen',
    thumbnail: '/images/products/Oxygen-optimized.webp',
    fullSize: '/images/products/Oxygen-optimized.webp',
    alt: 'Oxygen Cylinder',
    title: 'Oksigen (O2)',
    description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
    detailedDescription: 'Oksigen (O2) adalah gas yang sangat penting dalam berbagai aplikasi industri dan medis. PT Surya Inti Gas menyediakan oksigen dengan kemurnian tinggi untuk kebutuhan medis di rumah sakit, proses metalurgi dalam industri manufaktur, serta berbagai aplikasi industri lainnya. Produk kami diproduksi dengan standar kualitas internasional dan tersedia dalam berbagai ukuran tabung sesuai kebutuhan pelanggan.',
    category: 'products',
    year: 2007,
    size: 'medium'
  },
  {
    id: 'nitrogen',
    thumbnail: '/images/products/Nitrogen-optimized.webp',
    fullSize: '/images/products/Nitrogen-optimized.webp',
    alt: 'Nitrogen Cylinder',
    title: 'Nitrogen (N2)',
    description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
    detailedDescription: 'Nitrogen (N2) adalah gas inert yang banyak digunakan untuk proses inerting, blanketing, dan pendinginan dalam berbagai industri. PT Surya Inti Gas menyediakan nitrogen dengan kemurnian tinggi untuk mencegah oksidasi, mempertahankan kualitas produk, dan sebagai media pendingin dalam proses industri. Nitrogen kami tersedia dalam bentuk gas maupun cair sesuai kebutuhan aplikasi.',
    category: 'products',
    year: 2008,
    size: 'small'
  },
  {
    id: 'mix-gas',
    thumbnail: '/images/products/Mix_gas.webp',
    fullSize: '/images/products/Mix_gas.webp',
    alt: 'Mix Gas Cylinder',
    title: 'Mix Gas',
    description: 'Gas mix untuk aplikasi khusus',
    detailedDescription: 'Gas campuran (Mix Gas) dirancang khusus untuk aplikasi yang membutuhkan komposisi gas tertentu. PT Surya Inti Gas dapat menyediakan berbagai kombinasi gas campuran sesuai spesifikasi teknis yang dibutuhkan pelanggan, termasuk untuk kalibrasi instrumen, penelitian laboratorium, dan proses industri khusus. Setiap campuran diproduksi dengan presisi tinggi untuk memastikan konsistensi kualitas.',
    category: 'products',
    year: 2009,
    size: 'small'
  },
  {
    id: 'vertical-tank',
    thumbnail: '/images/products/Vertical_Tank.webp',
    fullSize: '/images/products/Vertical_Tank.webp',
    alt: 'Vertical Tank',
    title: 'Vertical Tank',
    description: 'Tangki vertikal untuk storage gas',
    detailedDescription: 'Tangki vertikal adalah solusi penyimpanan gas yang efisien dengan desain kompak untuk ruang terbatas. Tangki ini cocok untuk penyimpanan gas cair maupun gas bertekanan tinggi. PT Surya Inti Gas menyediakan tangki vertikal dengan berbagai kapasitas, dilengkapi dengan sistem safety terbaik untuk memastikan keamanan dalam penyimpanan dan distribusi gas kepada pelanggan.',
    category: 'equipment',
    year: 2010,
    size: 'tall'
  },
  {
    id: 'acetylene',
    thumbnail: '/images/products/Acetylene-optimized.webp',
    fullSize: '/images/products/Acetylene-optimized.webp',
    alt: 'Acetylene Cylinder',
    title: 'Asetilena (C2H2)',
    description: 'Gas asetilena untuk pengelasan dan pemotongan logam',
    detailedDescription: 'Asetilena (C2H2) adalah gas yang sangat penting dalam industri pengelasan dan pemotongan logam. PT Surya Inti Gas menyediakan asetilena berkualitas tinggi yang menghasilkan api dengan suhu tinggi, ideal untuk welding dan cutting berbagai jenis logam. Produk kami tersedia dalam tabung aman dengan standar keamanan internasional untuk penggunaan di industri konstruksi dan manufaktur.',
    category: 'products',
    year: 2011,
    size: 'medium'
  },
  {
    id: 'iso-tank',
    thumbnail: '/images/products/ISO_Tank.webp',
    fullSize: '/images/products/ISO_Tank.webp',
    alt: 'ISO Tank',
    title: 'ISO Tank',
    description: 'Tangki ISO untuk transportasi gas cair dalam volume besar',
    detailedDescription: 'Tangki ISO adalah solusi transportasi gas cair dalam volume besar dengan standar internasional. PT Surya Inti Gas menggunakan tangki ISO bersertifikasi untuk distribusi gas cair ke seluruh Indonesia. Tangki ini dirancang untuk mempertahankan suhu dan tekanan optimal selama perjalanan, memastikan kualitas gas tetap terjaga hingga sampai ke lokasi pelanggan.',
    category: 'equipment',
    year: 2012,
    size: 'wide'
  },
  {
    id: 'liquid-filling',
    thumbnail: '/images/products/Liquid_Filling.webp',
    fullSize: '/images/products/Liquid_Filling.webp',
    alt: 'Liquid Filling System',
    title: 'Liquid Filling',
    description: 'Sistem pengisian gas cair untuk tabung dan tangki',
    detailedDescription: 'Sistem pengisian gas cair kami menggunakan teknologi canggih untuk mengisi tabung dan tangki gas dengan presisi tinggi. PT Surya Inti Gas memiliki fasilitas filling modern yang dilengkapi dengan sistem kontrol kualitas ketat untuk memastikan setiap pengisian dilakukan dengan akurasi volume dan tekanan yang tepat. Proses ini menjamin keamanan dan kualitas produk yang kami distribusikan ke pelanggan.',
    category: 'facility',
    year: 2013,
    size: 'large'
  },
  {
    id: 'microbulk',
    thumbnail: '/images/products/Microbulk.webp',
    fullSize: '/images/products/Microbulk.webp',
    alt: 'Microbulk Tank',
    title: 'Microbulk',
    description: 'Tangki microbulk untuk supply gas dalam volume menengah',
    detailedDescription: 'Tangki microbulk adalah solusi supply gas untuk kebutuhan volume menengah yang lebih efisien dibandingkan tabung gas konvensional. PT Surya Inti Gas menyediakan sistem microbulk yang mengurangi frekuensi penggantian tabung, menghemat waktu dan biaya operasional. Sistem ini ideal untuk pelanggan dengan konsumsi gas reguler namun tidak membutuhkan tangki penyimpanan besar.',
    category: 'equipment',
    year: 2014,
    size: 'small'
  },
  {
    id: 'medical-gas',
    thumbnail: '/images/products/Medical_Gas_Cylinder.webp',
    fullSize: '/images/products/Medical_Gas_Cylinder.webp',
    alt: 'Medical Gas Cylinder',
    title: 'Tabung Gas Medis',
    description: 'Tabung gas medis untuk rumah sakit dan fasilitas kesehatan',
    detailedDescription: 'Tabung gas medis PT Surya Inti Gas dirancang khusus untuk kebutuhan medis di rumah sakit dan fasilitas kesehatan. Tabung ini memenuhi standar keamanan medis internasional dan tersedia dalam berbagai ukuran sesuai kebutuhan fasilitas kesehatan. Gas medis kami diproduksi dengan kemurnian tinggi dan melalui proses quality control ketat untuk memastikan keamanan pasien.',
    category: 'products',
    year: 2015,
    size: 'medium'
  },
  {
    id: 'office-view-2',
    thumbnail: '/images/office/office_view2.webp',
    fullSize: '/images/office/office_view2.webp',
    alt: 'Office View 2',
    title: 'Ruang Meeting',
    description: 'Ruang meeting untuk diskusi dan kolaborasi',
    detailedDescription: 'Ruang meeting PT Surya Inti Gas dirancang untuk mendukung diskusi produktif dan kolaborasi tim. Ruang ini dilengkapi dengan fasilitas modern untuk presentasi dan pertemuan, menciptakan lingkungan yang kondusif untuk perencanaan strategis dan koordinasi proyek. Desain interior yang profesional mencerminkan komitmen kami terhadap kualitas dan efisiensi.',
    category: 'facility',
    year: 2016,
    size: 'wide'
  },
  {
    id: 'office-view-3',
    thumbnail: '/images/office/office_view3.webp',
    fullSize: '/images/office/office_view3.webp',
    alt: 'Office View 3',
    title: 'Ruang Kerja',
    description: 'Ruang kerja modern dan profesional',
    detailedDescription: 'Ruang kerja PT Surya Inti Gas didesain modern dan profesional untuk mendukung produktivitas karyawan. Layout yang ergonomis dan fasilitas lengkap menciptakan lingkungan kerja yang nyaman dan efisien. Ruang kerja ini mencerminkan budaya perusahaan yang mengutamakan kesejahteraan karyawan dan kualitas kerja.',
    category: 'facility',
    year: 2017,
    size: 'tall'
  },
  {
    id: 'gas-cylinder-1',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    alt: 'Gas Cylinder Storage',
    title: 'Penyimpanan Tabung Gas',
    description: 'Area penyimpanan tabung gas yang aman dan terorganisir',
    detailedDescription: 'Area penyimpanan tabung gas PT Surya Inti Gas dirancang dengan standar keamanan tinggi untuk memastikan penyimpanan yang aman dan terorganisir. Setiap area penyimpanan dilengkapi dengan sistem ventilasi, deteksi kebocoran, dan pemisahan jenis gas untuk mencegah kontaminasi. Layout yang sistematis memudahkan manajemen inventaris dan rotasi stok.',
    category: 'facility',
    year: 2018,
    size: 'large'
  },
  {
    id: 'industrial-plant-1',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
    alt: 'Industrial Plant',
    title: 'Pabrik Industri',
    description: 'Fasilitas produksi gas industri modern',
    detailedDescription: 'Pabrik industri PT Surya Inti Gas dilengkapi dengan fasilitas produksi modern yang memenuhi standar keamanan dan kualitas internasional. Fasilitas ini memiliki kapasitas produksi yang mampu memenuhi kebutuhan gas industri di seluruh Indonesia. Dengan teknologi canggih dan proses quality control ketat, kami memastikan setiap produk gas yang dihasilkan memiliki kualitas yang konsisten dan sesuai spesifikasi.',
    category: 'facility',
    year: 2019,
    size: 'wide'
  },
  {
    id: 'welding-1',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop',
    alt: 'Welding Process',
    title: 'Proses Pengelasan',
    description: 'Aplikasi gas industri untuk pengelasan',
    detailedDescription: 'Proses pengelasan menggunakan gas industri adalah salah satu aplikasi utama produk PT Surya Inti Gas. Gas kami digunakan secara luas dalam industri konstruksi, manufaktur, dan otomotif untuk menghasilkan lasan berkualitas tinggi. Kami menyediakan berbagai jenis gas welding sesuai kebutuhan spesifik proses pengelasan, termasuk asetilena, argon, dan gas campuran lainnya.',
    category: 'products',
    year: 2020,
    size: 'medium'
  },
  {
    id: 'lab-1',
    thumbnail: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop',
    alt: 'Laboratory',
    title: 'Laboratorium Gas',
    description: 'Fasilitas laboratorium untuk analisis gas',
    detailedDescription: 'Laboratorium gas PT Surya Inti Gas dilengkapi dengan peralatan analisis modern untuk memastikan kualitas dan kemurnian setiap produk gas. Tim ahli kami melakukan pengujian rutin untuk memverifikasi komposisi gas, mendeteksi kontaminasi, dan memastikan kepatuhan terhadap standar industri. Fasilitas laboratorium ini merupakan bagian penting dari sistem quality control kami.',
    category: 'facility',
    year: 2021,
    size: 'small'
  },
  {
    id: 'delivery-1',
    thumbnail: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop',
    alt: 'Gas Delivery',
    title: 'Pengiriman Gas',
    description: 'Armada pengiriman gas untuk pelanggan',
    detailedDescription: 'Armada pengiriman gas PT Surya Inti Gas terdiri dari kendaraan khusus yang dirancang untuk transportasi gas dengan aman. Setiap unit dilengkapi dengan sistem keamanan tercanggih dan dioperasikan oleh tim berpengalaman. Jaringan distribusi kami mencakup seluruh Indonesia, memastikan pengiriman gas tepat waktu ke lokasi pelanggan dengan standar keamanan tertinggi.',
    category: 'facility',
    year: 2022,
    size: 'tall'
  },
  {
    id: 'tank-1',
    thumbnail: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=800&fit=crop',
    alt: 'Storage Tank',
    title: 'Tangki Penyimpanan',
    description: 'Tangki penyimpanan gas cair kapasitas besar',
    detailedDescription: 'Tangki penyimpanan gas cair dengan kapasitas besar adalah fasilitas penting dalam operasional PT Surya Inti Gas. Tangki ini dirancang untuk menyimpan gas cair dalam volume besar dengan mempertahankan suhu dan tekanan optimal. Sistem penyimpanan kami dilengkapi dengan fitur keamanan ganda dan pemantauan 24 jam untuk memastikan ketersediaan supply gas yang kontinu kepada pelanggan.',
    category: 'equipment',
    year: 2023,
    size: 'large'
  },
  {
    id: 'valve-1',
    thumbnail: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop',
    alt: 'Gas Valve',
    title: 'Katup Gas',
    description: 'Sistem katup untuk kontrol aliran gas',
    detailedDescription: 'Sistem katup gas PT Surya Inti Gas menggunakan komponen berkualitas tinggi untuk kontrol aliran gas yang presisi. Katup kami dirancang untuk menahan tekanan tinggi dan kondisi operasional yang berat. Setiap unit dilengkapi dengan fitur keamanan otomatis dan rutin diperiksa untuk memastikan performa optimal dalam mengatur aliran gas ke berbagai aplikasi industri.',
    category: 'equipment',
    year: 2024,
    size: 'small'
  },
  {
    id: 'hospital-1',
    thumbnail: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop',
    alt: 'Hospital Gas System',
    title: 'Sistem Gas Rumah Sakit',
    description: 'Instalasi gas medis untuk rumah sakit',
    detailedDescription: 'Sistem gas rumah sakit PT Surya Inti Gas dirancang khusus untuk kebutuhan medis dengan standar keamanan tertinggi. Kami menyediakan instalasi gas medis yang mencakup oksigen, nitrogen, dan gas medis lainnya untuk rumah sakit dan fasilitas kesehatan. Sistem kami memenuhi regulasi kesehatan dan dilengkapi dengan fitur keamanan otomatis untuk kenyamanan pasien dan tenaga medis.',
    category: 'facility',
    year: 2025,
    size: 'wide'
  },
  {
    id: 'quality-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop',
    alt: 'Quality Control',
    title: 'Quality Control',
    description: 'Proses quality control untuk produk gas',
    detailedDescription: 'Proses quality control PT Surya Inti Gas dilakukan secara menyeluruh pada setiap tahap produksi. Mulai dari bahan baku hingga produk jadi, setiap tahap diperiksa untuk memastikan kepatuhan terhadap standar kualitas. Sistem QC kami menggunakan teknologi analisis terbaru dan dijalankan oleh tim bersertifikasi untuk menjamin kualitas produk yang konsisten dan dapat diandalkan.',
    category: 'facility',
    year: 2026,
    size: 'medium'
  },
  {
    id: 'training-1',
    thumbnail: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop',
    alt: 'Safety Training',
    title: 'Pelatihan Keselamatan',
    description: 'Program pelatihan keselamatan kerja',
    detailedDescription: 'Program pelatihan keselamatan kerja PT Surya Inti Gas dirancang untuk memastikan kompetensi karyawan dalam menangani gas secara aman. Pelatihan mencakup penanganan darurat, prosedur keamanan, dan penggunaan peralatan pelindung diri. Setiap karyawan wajib lulus sertifikasi sebelum diperbolehkan bekerja dengan gas, memastikan standar keamanan tertinggi dalam operasional kami.',
    category: 'facility',
    year: 2007,
    size: 'small'
  },
  {
    id: 'pressure-gauge-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop',
    alt: 'Pressure Gauge',
    title: 'Pressure Gauge',
    description: 'Alat pengukur tekanan gas',
    detailedDescription: 'Pressure gauge adalah alat pengukur tekanan yang vital dalam sistem gas PT Surya Inti Gas. Kami menggunakan pressure gauge kalibrasi dengan akurasi tinggi untuk memantau tekanan gas secara real-time. Setiap alat rutin dikalibrasi dan diperiksa untuk memastikan pembacaan yang akurat, mendukung sistem keamanan dan efisiensi operasional dalam distribusi gas.',
    category: 'equipment',
    year: 2009,
    size: 'small'
  },
  {
    id: 'factory-1',
    thumbnail: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop',
    alt: 'Factory Floor',
    title: 'Lantai Pabrik',
    description: 'Area produksi pabrik gas',
    detailedDescription: 'Lantai pabrik PT Surya Inti Gas dirancang dengan sistem workflow yang efisien dan aman. Area produksi dilengkapi dengan sistem ventilasi, deteksi gas, dan prosedur keamanan ketat. Setiap area produksi memiliki zona yang jelas untuk proses berbeda, memastikan aliran produksi yang terorganisir dan meminimalkan risiko kontaminasi antar produk.',
    category: 'facility',
    year: 2010,
    size: 'large'
  },
  {
    id: 'medical-equipment-1',
    thumbnail: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop',
    alt: 'Medical Equipment',
    title: 'Peralatan Medis',
    description: 'Peralatan medis menggunakan gas',
    detailedDescription: 'Peralatan medis yang menggunakan gas dari PT Surya Inti Gas memenuhi standar kesehatan internasional. Kami menyediakan gas untuk berbagai peralatan medis termasuk ventilator, anestesia, dan sistem oksigen rumah sakit. Setiap produk gas medis kami diproduksi dengan kemurnian tinggi dan sertifikasi yang diperlukan untuk penggunaan dalam fasilitas kesehatan.',
    category: 'products',
    year: 2011,
    size: 'medium'
  },
  {
    id: 'cryogenic-1',
    thumbnail: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop',
    alt: 'Cryogenic System',
    title: 'Sistem Kriogenik',
    description: 'Sistem penyimpanan gas cair suhu rendah',
    detailedDescription: 'Sistem kriogenik PT Surya Inti Gas menggunakan teknologi canggih untuk penyimpanan gas cair pada suhu sangat rendah. Sistem ini mempertahankan gas dalam bentuk cair dengan efisiensi maksimal, memungkinkan penyimpanan volume besar dalam ruang kompak. Fasilitas kriogenik kami dilengkapi dengan sistem keamanan ganda dan pemantauan suhu 24 jam untuk keamanan operasional.',
    category: 'equipment',
    year: 2012,
    size: 'tall'
  },
  {
    id: 'assembly-1',
    thumbnail: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop',
    alt: 'Assembly Line',
    title: 'Lini Perakitan',
    description: 'Lini perakitan tabung gas',
    detailedDescription: 'Lini perakitan tabung gas PT Surya Inti Gas menggunakan proses otomatis dan manual untuk memastikan kualitas setiap tabung. Setiap tabung melalui serangkaian tes kualitas termasuk tes tekanan dan kebocoran sebelum disetujui untuk distribusi. Lini perakitan kami dirancang untuk efisiensi produksi tinggi tanpa mengorbankan standar keamanan dan kualitas.',
    category: 'facility',
    year: 2013,
    size: 'wide'
  },
  {
    id: 'fire-safety-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop',
    alt: 'Fire Safety',
    title: 'Keselamatan Kebakaran',
    description: 'Sistem keselamatan kebakaran industri',
    detailedDescription: 'Sistem keselamatan kebakaran PT Surya Inti Gas dirancang sesuai standar keselamatan industri gas. Fasilitas kami dilengkapi dengan sistem deteksi api otomatis, hydrant, dan alat pemadam api yang mudah diakses. Rutin dilakukan simulasi kebakaran dan pelatihan penanganan darurat untuk memastikan kesiapan tim dalam menghadapi situasi darurat dengan cepat dan efektif.',
    category: 'facility',
    year: 2014,
    size: 'small'
  },
  {
    id: 'transport-1',
    thumbnail: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop',
    alt: 'Gas Transport',
    title: 'Transportasi Gas',
    description: 'Kendaraan transportasi gas industri',
    detailedDescription: 'Kendaraan transportasi gas PT Surya Inti Gas dirancang khusus untuk mengangkut berbagai jenis gas dengan aman. Setiap kendaraan dilengkapi dengan sistem GPS, sensor kebocoran, dan kompartemen yang sesuai standar transportasi gas berbahaya. Tim pengemudi kami memiliki sertifikasi khusus dan mengikuti prosedur keamanan ketat dalam setiap pengiriman.',
    category: 'facility',
    year: 2015,
    size: 'large'
  },
  {
    id: 'laboratory-2',
    thumbnail: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop',
    alt: 'Chemistry Lab',
    title: 'Laboratorium Kimia',
    description: 'Laboratorium untuk penelitian gas',
    detailedDescription: 'Laboratorium kimia PT Surya Inti Gas mendukung penelitian dan pengembangan produk gas baru. Fasilitas ini dilengkapi dengan peralatan analisis modern untuk riset komposisi gas, pengembangan formula baru, dan pengujian aplikasi gas. Tim riset kami bekerja secara terus-menerus untuk meningkatkan kualitas produk dan menemukan solusi gas inovatif untuk kebutuhan industri pelanggan.',
    category: 'facility',
    year: 2016,
    size: 'medium'
  },
  {
    id: 'regulator-1',
    thumbnail: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop',
    fullSize: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop',
    alt: 'Gas Regulator',
    title: 'Regulator Gas',
    description: 'Regulator untuk kontrol tekanan gas',
    detailedDescription: 'Regulator gas PT Surya Inti Gas dirancang untuk kontrol tekanan gas yang presisi dan aman. Regulator kami tersedia dalam berbagai kapasitas dan tipe sesuai kebutuhan aplikasi industri. Setiap unit dilengkapi dengan fitur keamanan seperti relief valve dan gauge tekanan untuk memastikan penggunaan gas yang aman dan efisien di lokasi pelanggan.',
    category: 'equipment',
    year: 2017,
    size: 'small'
  }
];

// Styles
const galleryDetailStyles = `
  .gallery-detail-container {
    max-width: 1400px;
    margin: 0 auto;
    padding: 40px 20px;
  }

  .back-button {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    font-family: 'DM Sans, system-ui, sans-serif';
    font-size: 0.9375rem;
    font-weight: 500;
    color: #64748B;
    background: white;
    border: 2px solid #E3F2FD;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease;
    margin-bottom: 32px;
    width: fit-content;
  }

  .back-button:hover {
    background: #EFF6FF;
    border-color: #29ABE2;
    color: #0C2D5E;
  }

  .gallery-detail-header {
    margin-bottom: 32px;
  }

  .gallery-detail-title {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 700;
    color: #0C2D5E;
    margin: 0 0 16px;
    line-height: 1.2;
  }

  .gallery-detail-meta {
    display: flex;
    flex-wrap: wrap;
    gap: 24px;
    padding: 16px;
    background: #f8fafc;
    border-radius: 8px;
    border: 1px solid #e2e8f0;
  }

  .gallery-detail-meta-item {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #64748b;
    font-size: 14px;
  }

  .gallery-detail-category {
    display: flex;
    align-items: center;
    gap: 8px;
    color: #1e40af;
    font-size: 14px;
    font-weight: 600;
    padding: 4px 12px;
    background: #dbeafe;
    border-radius: 20px;
  }

  .gallery-detail-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    align-items: start;
    margin-bottom: 32px;
  }

  .gallery-detail-image-container {
    width: 100%;
    height: 500px;
    border-radius: 12px;
    overflow: hidden;
    position: relative;
  }

  .gallery-detail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .gallery-detail-description {
    font-family: 'DM Sans, system-ui, sans-serif';
    font-size: 1.125rem;
    line-height: 1.8;
    color: #475569;
    margin: 0;
  }

  .gallery-detail-description p {
    word-wrap: break-word;
    overflow-wrap: break-word;
  }

  .lightbox-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    padding: 20px;
  }

  .lightbox-content {
    position: relative;
    max-width: 90vw;
    max-height: 90vh;
  }

  .lightbox-close {
    position: absolute;
    top: -40px;
    right: 0;
    background: white;
    border: none;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0C2D5E;
  }

  .lightbox-image {
    max-width: 100%;
    max-height: 85vh;
    object-fit: contain;
    border-radius: 8px;
  }

  .lightbox-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    background: white;
    border: none;
    border-radius: 50%;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    color: #0C2D5E;
    transition: background 0.3s ease;
  }

  .lightbox-nav:hover {
    background: #E3F2FD;
  }

  .lightbox-nav-prev {
    left: -60px;
  }

  .lightbox-nav-next {
    right: -60px;
  }

  .lightbox-open {
    overflow: hidden;
  }

  .related-gallery {
    margin-top: 48px;
  }

  .related-gallery-title {
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 1.5rem;
    font-weight: 700;
    color: #0C2D5E;
    margin-bottom: 24px;
  }

  .related-gallery-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 16px;
  }

  .related-gallery-item {
    border-radius: 8px;
    overflow: hidden;
    cursor: pointer;
    transition: transform 0.3s ease;
  }

  .related-gallery-item:hover {
    transform: translateY(-4px);
  }

  .related-gallery-item img {
    width: 100%;
    height: 200px;
    object-fit: cover;
  }

  .related-gallery-item-title {
    padding: 12px;
    font-family: 'Barlow, system-ui, sans-serif';
    font-size: 0.9rem;
    font-weight: 600;
    color: #0C2D5E;
    background: white;
  }

  @media (max-width: 768px) {
    .gallery-detail-container {
      padding: 20px 16px;
    }

    .gallery-detail-content {
      grid-template-columns: 1fr;
      gap: 24px;
    }

    .gallery-detail-image-container {
      height: 300px;
    }

    .lightbox-nav-prev {
      left: 10px;
    }

    .lightbox-nav-next {
      right: 10px;
    }

    .related-gallery-grid {
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
    }
  }
`;

// Back Button Component
const BackButton = ({ navigate, currentLang }: { navigate: (path: string) => void; currentLang: string }) => {
  return (
    <button
      onClick={() => navigate(`/${currentLang}/galeri`)}
      className="back-button"
      aria-label="Back to gallery"
    >
      <ArrowLeft size={16} />
      Kembali ke Galeri
    </button>
  );
};

// Main GalleryDetail Component
function GalleryDetail() {
  const { id, lang } = useParams<{ id: string; lang: string }>();
  const navigate = useNavigate();
  const currentLang = lang || 'id';
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const currentItem = galleryItems.find(item => item.id === id);

  // Toggle body scroll when lightbox is open/closed
  useEffect(() => {
    if (isLightboxOpen) {
      document.body.classList.add('lightbox-open');
    } else {
      document.body.classList.remove('lightbox-open');
    }

    return () => {
      document.body.classList.remove('lightbox-open');
    };
  }, [isLightboxOpen]);

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLightboxOpen) return;

      if (e.key === 'Escape') {
        setIsLightboxOpen(false);
      } else if (e.key === 'ArrowLeft') {
        handlePrevious();
      } else if (e.key === 'ArrowRight') {
        handleNext();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen, currentImageIndex]);

  // Set current image index when item changes
  useEffect(() => {
    if (currentItem) {
      const index = galleryItems.findIndex(item => item.id === currentItem.id);
      setCurrentImageIndex(index);
    }
  }, [currentItem]);

  const handleNext = () => {
    setCurrentImageIndex((prev) => (prev + 1) % galleryItems.length);
    const nextItem = galleryItems[(currentImageIndex + 1) % galleryItems.length];
    navigate(`/galeri/${nextItem.id}`);
  };

  const handlePrevious = () => {
    setCurrentImageIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length);
    const prevItem = galleryItems[(currentImageIndex - 1 + galleryItems.length) % galleryItems.length];
    navigate(`/galeri/${prevItem.id}`);
  };

  if (!currentItem) {
    return (
      <div className="products-corporate">
        <style>{galleryDetailStyles}</style>
        
        {/* Header Section */}
        <div className="products-header" style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '120px 6vw 120px 6vw',
          marginBottom: '80px',
          marginLeft: '-6vw',
          marginRight: '-6vw',
          marginTop: '-120px',
          textAlign: 'center',
          overflow: 'hidden'
        }}>
          <div className="products-container">
            <div className="products-badge" style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              padding: '8px 24px',
              borderRadius: '50px',
              background: 'rgba(96, 165, 250, 0.15)',
              border: '1px solid rgba(96, 165, 250, 0.3)',
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: '11px',
              fontWeight: '700',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: 'rgba(255, 255, 255, 0.9)',
              marginBottom: '32px'
            }}>
              Galeri
            </div>
            <h1 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              Dokumentasi Perusahaan
            </h1>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.8)',
              maxWidth: '700px',
              margin: '0 auto'
            }}>
              Jelajahi galeri foto PT Surya Inti Gas yang menampilkan fasilitas operasional, kegiatan perusahaan, dan dokumentasi proyek kami dalam melayani berbagai industri di Indonesia.
            </p>
          </div>
        </div>

        <div className="gallery-detail-container">
          <BackButton navigate={navigate} currentLang={currentLang} />
          <div style={{ textAlign: 'center', padding: '40px' }}>
            <h2 style={{ fontFamily: 'Barlow, system-ui, sans-serif', fontSize: '1.5rem', color: '#0C2D5E' }}>
              Foto tidak ditemukan
            </h2>
            <p style={{ fontFamily: 'DM Sans, system-ui, sans-serif', color: '#64748b', marginTop: '16px' }}>
              Maaf, foto yang Anda cari tidak tersedia.
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Get related items (same category, excluding current item)
  const relatedItems = galleryItems
    .filter(item => item.category === currentItem.category && item.id !== currentItem.id)
    .slice(0, 4);

  return (
    <div className="products-corporate">
      <style>{galleryDetailStyles}</style>
      
      {/* Header Section */}
      <div className="products-header" style={{
        position: 'relative',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        padding: '120px 6vw 120px 6vw',
        marginBottom: '80px',

        textAlign: 'center',
        overflow: 'hidden'
      }}>
        <div className="products-container">
          <div className="products-badge" style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            padding: '8px 24px',
            borderRadius: '50px',
            background: 'rgba(96, 165, 250, 0.15)',
            border: '1px solid rgba(96, 165, 250, 0.3)',
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: '11px',
            fontWeight: '700',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: '32px'
          }}>
            Galeri
          </div>
          <h1 className="products-title" style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: 'clamp(2.5rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 24px'
          }}>
            Dokumentasi Perusahaan
          </h1>
          <p className="products-subtitle" style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
            lineHeight: '1.7',
            color: 'rgba(255, 255, 255, 0.8)',
            maxWidth: '700px',
            margin: '0 auto'
          }}>
            Jelajahi galeri foto PT Surya Inti Gas yang menampilkan fasilitas operasional, kegiatan perusahaan, dan dokumentasi proyek kami dalam melayani berbagai industri di Indonesia.
          </p>
        </div>
      </div>

      <div className="gallery-detail-container">
        <BackButton navigate={navigate} currentLang={currentLang} />

        <div className="gallery-detail-header">
          <h1 className="gallery-detail-title">{currentItem.title}</h1>
          
          <div className="gallery-detail-meta">
            <div className="gallery-detail-meta-item">
              <Calendar size={16} />
              <span>{currentItem.year}</span>
            </div>
            <div className="gallery-detail-category">
              <span>{currentItem.category}</span>
            </div>
          </div>
        </div>

        <div className="gallery-detail-content">
          <div className="gallery-detail-image-container">
            <img
              src={currentItem.fullSize}
              alt={currentItem.alt}
              className="gallery-detail-image"
            />
          </div>

          <div className="gallery-detail-description">
            <p>
              {currentItem.detailedDescription || currentItem.description}
            </p>
          </div>
        </div>

        {relatedItems.length > 0 && (
          <div className="related-gallery">
            <h2 className="related-gallery-title">Foto Terkait</h2>
            <div className="related-gallery-grid">
              {relatedItems.map((item) => (
                <div
                  key={item.id}
                  className="related-gallery-item"
                  onClick={() => navigate(`/galeri/${item.id}`)}
                >
                  <img src={item.thumbnail} alt={item.alt} />
                  <div className="related-gallery-item-title">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {isLightboxOpen && createPortal(
        <div className="lightbox-modal">
          <div className="lightbox-content">
            <button
              className="lightbox-close"
              onClick={() => setIsLightboxOpen(false)}
              aria-label="Close lightbox"
            >
              <X size={24} />
            </button>

            <button
              className="lightbox-nav lightbox-nav-prev"
              onClick={handlePrevious}
              aria-label="Previous image"
            >
              <ChevronLeft size={24} />
            </button>

            <img
              src={galleryItems[currentImageIndex].fullSize}
              alt={galleryItems[currentImageIndex].alt}
              className="lightbox-image"
            />

            <button
              className="lightbox-nav lightbox-nav-next"
              onClick={handleNext}
              aria-label="Next image"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}

export default GalleryDetail;