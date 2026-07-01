import { useNavigate, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import '../../styles/ProductsAndServices.css';

// Type definitions
type Product = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
};

type SubCategory = {
  title: string;
  products: Product[];
};

type MainCategory = 'gas' | 'equipment';

interface ProductCategories {
  gas: {
    'industrial-medical': SubCategory;
    'speciality-mixed': SubCategory;
  };
  equipment: {
    'color-code': SubCategory;
    'package': SubCategory;
    'assist-gas': SubCategory;
    'cryogenic-transport': SubCategory;
    'regulator-valves': SubCategory;
    'medical-gas-equipment': SubCategory;
  };
}

/* ═══════════════════════════════════════════════════════════════
   PRODUCT.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

// Product Card Component
function ProductCard({ product, onClick }: { product: Product; onClick: (id: string) => void }) {
  const [imageError, setImageError] = useState(false);

  return (
    <div
      className="products-card"
      onClick={() => onClick(product.id)}
    >
      <div className="products-card-image">
        {imageError ? (
          <div style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#f1f5f9',
            color: '#94a3b8',
            fontSize: '14px'
          }}>
            Image not found
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            loading="lazy"
            width="400"
            height="300"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="products-card-content">
        <h3 className="products-card-title">
          {product.title}
        </h3>
        <p className="products-card-description">
          {product.description}
        </p>
      </div>
    </div>
  );
}

// Data moved outside component to prevent recreation on each render
const productCategories: ProductCategories = {
    gas: {
      'industrial-medical': {
        title: 'Industrial & Medical (Gas & Cair)',
        products: [
          {
            id: 'acetylene',
            title: 'Acetylene (C2H2)',
            description: 'Gas asetilena untuk pengelasan dan pemotongan logam',
            fullDescription: 'Asetilena (C2H2) adalah gas hidrokarbon yang sangat mudah terbakar dan digunakan secara luas dalam industri pengelasan dan pemotongan logam. Gas ini memiliki suhu nyala yang sangat tinggi, mencapai 3.100°C, menjadikannya ideal untuk pengelasan oksi-asetilena dan pemotongan logam. Asetilena juga digunakan dalam sintesis kimia untuk memproduksi berbagai bahan kimia seperti plastik, karet sintetis, dan serat. PT Surya Inti Gas menyediakan asetilena berkualitas tinggi yang memenuhi standar industri untuk keamanan dan kinerja optimal.',
            image: '/images/products/Acetylene-optimized.webp'
          },
          {
            id: 'oxygen',
            title: 'Oksigen (O2)',
            description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
            fullDescription: 'Oksigen (O2) adalah gas yang sangat penting dalam berbagai aplikasi industri dan medis. Dalam bidang medis, oksigen digunakan untuk terapi pernapasan, resusitasi, dan sebagai gas pendukung dalam anestesi. Dalam industri, oksigen berperan penting dalam proses metalurgi untuk pembakaran dan pemurnian logam, industri kimia untuk oksidasi, serta dalam pengelasan dan pemotongan logam. Oksigen juga digunakan dalam pengolahan air, pembuatan kertas, dan berbagai proses manufaktur lainnya. PT Surya Inti Gas menyediakan oksigen dengan berbagai tingkat kemurnian sesuai kebutuhan spesifik pelanggan.',
            image: '/images/products/Oxygen-optimized.webp'
          },
          {
            id: 'nitrogen',
            title: 'Nitrogen (N2)',
            description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
            fullDescription: 'Nitrogen (N2) adalah gas inert yang menyusun sekitar 78% dari atmosfer bumi. Dalam industri, nitrogen digunakan secara luas untuk proses inerting (menghilangkan oksigen untuk mencegah korosi dan ledakan), blanketing (melindungi produk cair dan padat dari oksidasi), dan pendinginan (cryogenic cooling). Nitrogen juga digunakan dalam industri makanan untuk pengawetan, dalam elektronik untuk pembuatan semikonduktor, serta dalam metalurgi untuk proses heat treatment. PT Surya Inti Gas menyediakan nitrogen dalam berbagai bentuk dan tingkat kemurnian sesuai kebutuhan aplikasi industri Anda.',
            image: '/images/products/Nitrogen-optimized.webp'
          },
          {
            id: 'argon',
            title: 'Argon (Ar)',
            description: 'Gas argon untuk pengelasan TIG dan aplikasi elektronik',
            fullDescription: 'Argon (Ar) adalah gas inert yang paling sering digunakan dalam pengelasan TIG (Tungsten Inert Gas) dan MIG karena kemampuannya untuk melindungi area las dari kontaminasi atmosfer. Gas ini juga digunakan dalam industri elektronik untuk pembuatan semikonduktor dan panel layar, dalam metalurgi untuk proses perlakuan panas, serta dalam industri kaca untuk produksi kaca berkualitas tinggi. Argon juga digunakan dalam analisis laboratorium sebagai gas pembawa dan dalam perlindungan logam mulia. PT Surya Inti Gas menyediakan argon dengan kemurnian tinggi untuk berbagai aplikasi industri presisi.',
            image: '/images/products/Argon-optimized.webp'
          },
          {
            id: 'hydrogen',
            title: 'Hidrogen (H2)',
            description: 'Gas hidrogen untuk berbagai aplikasi industri dan energi',
            fullDescription: 'Hidrogen (H2) adalah gas yang paling ringan dan paling melimpah di alam semesta. Dalam industri, hidrogen digunakan dalam pemurnian minyak bumi, produksi amonia, pembuatan metanol, dan berbagai proses kimia lainnya. Hidrogen juga digunakan sebagai bahan bakar untuk kendaraan bertenaga fuel cell, dalam industri elektronik untuk pembuatan semikonduktor, serta sebagai gas pembawa dalam analisis gas kromatografi. PT Surya Inti Gas menyediakan hidrogen dengan tingkat kemurnian yang sesuai untuk aplikasi industri dan energi.',
            image: '/images/products/Hidrogen-optimized.webp'
          }
        ]
      },
      'speciality-mixed': {
        title: 'Speciality & Mixed Gas',
        products: [
          {
            id: 'helium',
            title: 'Helium (He)',
            description: 'Gas helium untuk aplikasi medis, industri, dan penelitian',
            fullDescription: 'Helium (He) adalah gas inert yang paling ringan kedua setelah hidrogen. Gas ini memiliki berbagai aplikasi penting: dalam medis digunakan untuk MRI (Magnetic Resonance Imaging), dalam industri digunakan untuk pengelasan dan leak detection, dalam penelitian sains untuk pendinginan superkonduktor, serta untuk pengisian balon dan blimp. Helium juga digunakan dalam industri elektronik untuk pembuatan serat optik dan semikonduktor. PT Surya Inti Gas menyediakan helium dengan kemurnian tinggi untuk berbagai aplikasi medis, industri, dan penelitian.',
            image: '/images/products/Helium.webp'
          },
          {
            id: 'sulfur-hexaflouride',
            title: 'Sulfur Hexaflouride (SF6)',
            description: 'Gas SF6 untuk isolasi listrik dan aplikasi industri',
            fullDescription: 'Sulfur heksafluorida (SF6) adalah gas dielektrik yang sangat efektif dengan kekuatan isolasi listrik yang tinggi. Gas ini digunakan secara luas dalam industri kelistrikan sebagai medium isolasi untuk switchgear, circuit breaker, dan transformator. SF6 juga digunakan dalam aplikasi pelacakan kebocoran, dalam industri magnesium untuk casting, serta dalam proses plasma etching dalam pembuatan semikonduktor. PT Surya Inti Gas menyediakan SF6 dengan kualitas tinggi untuk aplikasi isolasi listrik dan industri lainnya.',
            image: '/images/products/Sulfur_Hexaflouride.webp'
          },
          {
            id: 'mixed-gas',
            title: 'Mixed Gas (Gas Campur)',
            description: 'Gas campuran khusus untuk aplikasi industri tertentu',
            fullDescription: 'Gas campuran (Mixed Gas) adalah kombinasi berbagai gas yang diformulasikan khusus untuk aplikasi industri tertentu. Campuran ini mencakup gas calibrasi untuk instrumen pengukuran, gas proses untuk industri manufaktur, gas shielding untuk pengelasan, dan gas campuran medis untuk aplikasi kesehatan. Setiap campuran dirancang dengan komposisi yang presisi untuk memenuhi kebutuhan spesifik pelanggan. PT Surya Inti Gas menyediakan berbagai jenis gas campuran dengan komposisi yang dapat disesuaikan sesuai kebutuhan aplikasi Anda.',
            image: '/images/products/Mix_gas.webp'
          }
        ]
      }
    },
    equipment: {
      'color-code': {
        title: 'Color Code High Pressure Gas Supply',
        products: [
          {
            id: 'color-code-acetylene',
            title: 'Acetylene',
            description: 'Tabung gas asetilena dengan color code standar',
            fullDescription: 'Tabung gas asetilena dengan color code standar internasional untuk identifikasi gas dan keamanan. Tabung ini dirancang sesuai standar keamanan industri untuk menyimpan asetilena pada tekanan tinggi. Color code membantu dalam identifikasi cepat dan mencegah kesalahan penggunaan. PT Surya Inti Gas menyediakan tabung asetilena dengan spesifikasi material dan safety features yang memenuhi standar internasional.',
            image: '/images/products/Acetylene-optimized.webp'
          },
          {
            id: 'color-code-special',
            title: 'Special Gas Cylinder',
            description: 'Tabung gas khusus dengan color code',
            fullDescription: 'Tabung gas khusus dengan color code untuk gas-gas spesial yang memerlukan penanganan khusus. Tabung ini dirancang untuk menyimpan gas dengan tingkat kemurnian tinggi atau gas yang reaktif. Color code membantu dalam identifikasi jenis gas dan parameter keamanan yang diperlukan. PT Surya Inti Gas menyediakan berbagai tabung gas khusus sesuai kebutuhan aplikasi Anda.',
            image: '/images/products/Special_gas_.webp'
          },
          {
            id: 'color-code-medical',
            title: 'Medical Gas Cylinder',
            description: 'Tabung gas medis dengan color code standar kesehatan',
            fullDescription: 'Tabung gas medis dengan color code standar kesehatan untuk memastikan keamanan dan identifikasi yang tepat dalam aplikasi medis. Tabung ini memenuhi standar medis internasional dan dirancang untuk keamanan maksimal dalam penggunaan rumah sakit dan fasilitas kesehatan. Color code standar kesehatan memudahkan identifikasi jenis gas medis yang tepat untuk setiap aplikasi klinis.',
            image: '/images/products/Medical_Gas_Cylinder.webp'
          },
          {
            id: 'color-code-industrial',
            title: 'Industrial Gas Cylinder',
            description: 'Tabung gas industri dengan color code',
            fullDescription: 'Tabung gas industri dengan color code untuk identifikasi dan keamanan dalam aplikasi industri. Tabung ini dirancang untuk menahan tekanan tinggi dan kondisi operasional industri yang berat. Color code sistem membantu dalam manajemen inventory dan mencegah kesalahan penggunaan gas industri. PT Surya Inti Gas menyediakan berbagai ukuran tabung gas industri sesuai kebutuhan operasional Anda.',
            image: '/images/products/20260618_134406.webp'
          }
        ]
      },
      'package': {
        title: 'Package High Pressure Gas and Liquid Supply',
        products: [
          {
            id: 'package-high-pressure',
            title: 'High Pressure Gas Cylinder',
            description: 'Tabung gas tekanan tinggi untuk industri',
            fullDescription: 'Tabung gas tekanan tinggi dirancang untuk menyimpan dan mendistribusikan gas industri pada tekanan tinggi. Tabung ini dibuat dari material berkualitas tinggi dengan sistem penguncian dan safety features yang memenuhi standar internasional. Tersedia dalam berbagai kapasitas dan tekanan sesuai kebutuhan aplikasi industri. PT Surya Inti Gas menyediakan tabung gas tekanan tinggi dengan sertifikasi keamanan dan maintenance berkala.',
            image: '/images/products/20260618_134436.webp'
          },
          {
            id: 'cradle-3x2',
            title: 'Cradle (3x2)',
            description: 'Rangka cradle 3x2 untuk penyimpanan tabung gas',
            fullDescription: 'Rangka cradle 3x2 adalah sistem penyimpanan tabung gas dengan kapasitas 6 tabung (3 baris x 2 kolom). Cradle ini dirancang untuk efisiensi ruang dan kemudahan handling tabung gas. Cocok untuk fasilitas industri yang membutuhkan supply gas kontinyu dengan kapasitas sedang. PT Surya Inti Gas menyediakan cradle 3x2 dengan sistem penguncian dan safety features.',
            image: '/images/products/Craddle_3x2.webp'
          },
          {
            id: 'cradle-4x4',
            title: 'Cradle (4x4)',
            description: 'Rangka cradle 4x4 kapasitas besar',
            fullDescription: 'Rangka cradle 4x4 adalah sistem penyimpanan tabung gas dengan kapasitas 16 tabung (4 baris x 4 kolom). Cradle ini dirancang untuk fasilitas industri dengan konsumsi gas tinggi. Sistem ini memaksimalkan kapasitas penyimpanan dengan footprint yang efisien. PT Surya Inti Gas menyediakan cradle 4x4 dengan konstruksi kokoh dan sistem keamanan lengkap.',
            image: '/images/products/Craddle_4x4_fixed.webp'
          },
          {
            id: 'cryogenic-dewars',
            title: 'Cryogenic Dewars',
            description: 'Dewars kriogenik untuk penyimpanan gas cair',
            fullDescription: 'Dewars kriogenik adalah wadah isolasi vakum untuk penyimpanan gas cair pada suhu sangat rendah. Dewars ini menggunakan teknologi isolasi vakum untuk mempertahankan suhu kriogenik dan meminimalkan evaporasi. Tersedia dalam berbagai kapasitas untuk kebutuhan laboratorium, industri, dan medis. PT Surya Inti Gas menyediakan dewars kriogenik dengan standar keamanan dan efisiensi termal tinggi.',
            image: '/images/products/Cryogenic_Dewar.webp'
          },
          {
            id: 'vessel-gas-liquid',
            title: 'Vessel Gas Liquid',
            description: 'Vessel untuk penyimpanan gas cair',
            fullDescription: 'Vessel gas cair adalah tangki berkapasitas besar untuk penyimpanan gas cair dalam jangka waktu lama. Vessel ini dirancang dengan sistem isolasi termal dan safety features untuk mencegah evaporasi dan menjaga kualitas gas. Cocok untuk fasilitas industri dengan konsumsi gas besar. PT Surya Inti Gas menyediakan vessel gas cair dengan spesifikasi yang dapat disesuaikan dengan kebutuhan operasional.',
            image: '/images/products/VGL.webp'
          },
          {
            id: 'microbulk-tank',
            title: 'Microbulk Tank',
            description: 'Tangki microbulk untuk supply gas kontinyu',
            fullDescription: 'Tangki microbulk adalah solusi supply gas kontinyu yang efisien untuk fasilitas dengan konsumsi gas menengah. Sistem ini menggabungkan kemudahan cylinder dengan efisiensi bulk supply. Microbulk tank mengurangi frekuensi pengisian dan handling tabung gas. PT Surya Inti Gas menyediakan microbulk tank dengan sistem monitoring dan delivery yang terjadwal.',
            image: '/images/products/Microbulk_.webp'
          },
          {
            id: 'vertical-storage-tank',
            title: 'Vertical Storage Tank',
            description: 'Tangki penyimpanan vertikal',
            fullDescription: 'Tangki penyimpanan vertikal adalah solusi penyimpanan gas cair dengan desain memanjang untuk efisiensi ruang. Tangki ini cocok untuk fasilitas dengan area terbatas dan membutuhkan kapasitas penyimpanan besar. Desain vertikal meminimalkan footprint sambil memberikan kapasitas maksimal. PT Surya Inti Gas menyediakan tangki penyimpanan vertikal dengan standar keamanan industri yang ketat.',
            image: '/images/products/Vertical_Tank.webp'
          }
        ]
      },
      'assist-gas': {
        title: 'Assist Gas for Laser Cutting',
        products: [
          {
            id: 'assist-gas-cradle-4x4',
            title: 'Assist Gas Supply From Cradle Capacity 4x4 Cylinder',
            description: 'Supply gas bantu dari cradle kapasitas 4x4 untuk laser cutting',
            fullDescription: 'Sistem supply gas bantu dari cradle kapasitas 4x4 cylinder untuk aplikasi laser cutting industri. Sistem ini menyediakan supply gas kontinyu (nitrogen, oksigen, atau argon) untuk proses laser cutting dengan kapasitas tinggi. Cradle 4x4 memastikan supply gas yang stabil dan konsisten untuk kualitas pemotongan yang optimal. PT Surya Inti Gas menyediakan sistem ini dengan konfigurasi yang dapat disesuaikan dengan jenis laser dan material yang dipotong.',
            image: '/images/products/Assist_Gas_Supply.webp'
          },
          {
            id: 'microbulk-gas-supply',
            title: 'Microbulk Gas Supply',
            description: 'Supply gas microbulk untuk aplikasi laser cutting',
            fullDescription: 'Sistem supply gas microbulk untuk aplikasi laser cutting dengan efisiensi tinggi. Sistem ini menggantikan multiple cylinder dengan tangki microbulk yang dapat dipantau dan diisi secara otomatis. Microbulk supply mengurangi downtime dan handling costs sambil memberikan supply gas yang konsisten untuk proses laser cutting. PT Surya Inti Gas menyediakan solusi microbulk dengan sistem monitoring dan maintenance yang terintegrasi.',
            image: '/images/products/Microbulk_Gas_Supply.webp'
          },
          {
            id: 'storage-tank-gas-supply',
            title: 'Storage Tank Gas Supply',
            description: 'Supply gas dari tangki penyimpanan',
            fullDescription: 'Sistem supply gas dari tangki penyimpanan untuk aplikasi industri dengan konsumsi gas tinggi. Sistem ini menggunakan tangki penyimpanan kapasitas besar yang memberikan supply gas kontinyu untuk berbagai proses industri. Cocok untuk fasilitas yang membutuhkan supply gas yang stabil dan ekonomis dalam jangka panjang. PT Surya Inti Gas menyediakan solusi tangki penyimpanan dengan desain yang sesuai kebutuhan operasional.',
            image: '/images/products/Storage_Tank_Gas.webp'
          }
        ]
      },
      'cryogenic-transport': {
        title: 'Cryogenic Transport Tank',
        products: [
          {
            id: 'liquid-filling-transfer',
            title: 'Liquid Filling Transfer',
            description: 'Sistem transfer pengisian gas cair',
            fullDescription: 'Sistem transfer pengisian gas cair adalah perangkat untuk memindahkan gas cair dari storage tank ke trailer atau dewars dengan aman dan efisien. Sistem ini dilengkapi dengan valve, hose, dan control panel untuk mengontrol aliran gas cair. Mencegah evaporasi dan kebocoran selama proses transfer. PT Surya Inti Gas menyediakan sistem transfer dengan standar keamanan tinggi untuk berbagai jenis gas cair.',
            image: '/images/products/Liquid_Filling.webp'
          },
          {
            id: 'cryogenic-iso-tank',
            title: 'Cryogenic ISO Tank',
            description: 'Tangki ISO kriogenik untuk transport',
            fullDescription: 'Tangki ISO kriogenik adalah kontainer standar internasional untuk transport gas cair pada suhu sangat rendah. Tangki ini memenuhi standar ISO untuk transport multimoda (darat, laut, udara) dan dilengkapi dengan sistem isolasi vakum canggih. Cocok untuk distribusi gas cair antar negara atau jarak jauh. PT Surya Inti Gas menyediakan ISO tank kriogenik dengan sertifikasi internasional dan sistem monitoring.',
            image: '/images/products/ISO_Tank.webp'
          },
          {
            id: 'cryogenic-road-tank',
            title: 'Cryogenic Road Tank',
            description: 'Tangki jalan kriogenik untuk distribusi',
            fullDescription: 'Tangki jalan kriogenik adalah kendaraan khusus untuk distribusi gas cair melalui jalan raya. Tangki ini dirancang dengan isolasi termal yang efisien untuk mempertahankan suhu kriogenik selama perjalanan. Cocok untuk distribusi gas cair antar fasilitas industri dan lokasi konsumsi. PT Surya Inti Gas menyediakan layanan distribusi gas cair dengan armada road tank yang memenuhi standar keamanan.',
            image: '/images/products/Road_tank.webp'
          }
        ]
      },
      'regulator-valves': {
        title: 'Regulator dan Velves',
        products: [
          {
            id: 'cryogenic-gas-valve',
            title: 'Cryogenic & Gas Valve',
            description: 'Valve kriogenik dan gas untuk berbagai aplikasi',
            fullDescription: 'Valve kriogenik dan gas adalah komponen vital untuk mengontrol aliran gas dalam berbagai aplikasi suhu rendah maupun normal. Valve ini dirancang khusus untuk menahan kondisi suhu ekstrem dan tekanan tinggi. Tersedia dalam berbagai jenis seperti globe valve, ball valve, dan check valve sesuai kebutuhan aplikasi. PT Surya Inti Gas menyediakan valve dengan material berkualitas tinggi dan sertifikasi keamanan.',
            image: '/images/products/Cryogenic&Valve.webp'
          },
          {
            id: 'gas-regulator-laser',
            title: 'Gas Regulator for Cutting Gas Laser Machine',
            description: 'Regulator gas khusus untuk mesin laser cutting',
            fullDescription: 'Regulator gas khusus untuk mesin laser cutting dirancang untuk memberikan kontrol tekanan yang presisi untuk proses pemotongan laser. Regulator ini memastikan supply gas (nitrogen, oksigen, atau argon) yang stabil dan konsisten untuk kualitas pemotongan optimal. Dilengkapi dengan gauge dan adjustment valve untuk presisi tinggi. PT Surya Inti Gas menyediakan regulator laser cutting dengan spesifikasi yang sesuai dengan berbagai jenis mesin laser.',
            image: '/images/products/Gas_Regulator_For_Cutting.webp'
          },
          {
            id: 'high-pressure-regulator',
            title: 'High Pressure Regulator',
            description: 'Regulator tekanan tinggi untuk aplikasi industri',
            fullDescription: 'Regulator tekanan tinggi dirancang untuk mengontrol tekanan gas dari tabung atau manifold dengan tekanan input tinggi. Regulator ini memberikan output tekanan yang stabil dan aman untuk aplikasi industri. Cocok untuk aplikasi pengelasan, cutting, dan proses industri lainnya. PT Surya Inti Gas menyediakan regulator tekanan tinggi dengan berbagai kapasitas dan spesifikasi sesuai kebutuhan.',
            image: '/images/products/High_Pressure_Regulator.webp'
          },
          {
            id: 'high-pressure-gas-valve',
            title: 'High Pressure Gas Valve',
            description: 'Valve gas tekanan tinggi untuk sistem gas',
            fullDescription: 'Valve gas tekanan tinggi adalah komponen keamanan vital untuk sistem gas bertekanan tinggi. Valve ini dirancang untuk menahan tekanan tinggi dan memberikan kontrol aliran yang presisi. Tersedia dalam berbagai jenis dan material sesuai dengan jenis gas dan aplikasi. PT Surya Inti Gas menyediakan valve tekanan tinggi dengan sertifikasi keamanan dan performa yang andal.',
            image: '/images/products/High_Pressure_Gas_Valve.webp'
          }
        ]
      },
      'medical-gas-equipment': {
        title: 'Medical Gas Supply Equipment',
        products: [
          {
            id: 'gdms-systems',
            title: 'GDMS Systems',
            description: 'Sistem manajemen distribusi gas medis terintegrasi',
            fullDescription: 'GDMS (Gas Distribution Management System) adalah sistem terintegrasi untuk manajemen distribusi gas medis di fasilitas kesehatan. Sistem ini mencakup monitoring tekanan, alarm safety, dan control panel untuk memastikan supply gas medis yang kontinyu dan aman. GDMS memudahkan manajemen gas oksigen, nitrogen, nitrous oxide, dan gas medis lainnya di rumah sakit. PT Surya Inti Gas menyediakan GDMS dengan teknologi terkini dan sesuai standar medis internasional.',
            image: '/images/products/GDMS.webp'
          }
        ]
      }
    }
  };

const mainCategories: { id: MainCategory; label: string }[] = [
  { id: 'gas', label: 'Gas Product' },
  { id: 'equipment', label: 'Related Equipment & Accessories' }
];

export function Product() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('industrial-medical');

  // Handle URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');
    
    if (categoryParam && (categoryParam === 'gas' || categoryParam === 'equipment')) {
      setMainCategory(categoryParam);
      if (subcategoryParam) {
        setSubCategory(subcategoryParam);
      } else {
        // Set default subcategory for the main category
        setSubCategory(categoryParam === 'gas' ? 'industrial-medical' : 'color-code');
      }
    }
  }, [searchParams]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    // Set default subcategory for each main category
    const newSubCategory = category === 'gas' ? 'industrial-medical' : 'color-code';
    setSubCategory(newSubCategory);
  };

  const handleSubCategoryChange = (subCatId: string) => {
    if (subCatId === subCategory) return;
    setSubCategory(subCatId);
  };

  const getSubCategories = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    return Object.keys(categories).map(key => ({
      id: key,
      title: categories[key]?.title || ''
    }));
  };

  const getCurrentProducts = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    const subCat = categories[subCategory];
    return subCat?.products || [];
  };

  const handleCardClick = (productId: string) => {
    navigate(`/produk/detail?id=${productId}`);
  };

  return (
    <div className="products-corporate">
      <section className="products-section" id="products" style={{
        paddingTop: '0'
      }}>

        {/* Corporate Header */}
        <div className="products-header" style={{
          position: 'relative',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
          padding: '240px 6vw 120px 6vw',
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
              Produk & Layanan
            </div>
            <h2 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              Solusi Gas <span className="accent" style={{ color: '#ffffff' }}>Komprehensif</span>
            </h2>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              Bisnis utama kami adalah memasok gas industri, termasuk Gas Udara (Oksigen, Nitrogen, dan Argon), Gas Medis, Gas Sintetis, Gas Bahan Bakar, dan sebagainya. Produk-produk Gas tersebut memiliki aplikasi yang sangat luas sehingga kami mampu melayani berbagai kebutuhan industri diantaranya medis, metalurgi, energi, infrastruktur dan barang konsumsi.
            </p>
          </div>
        </div>

        <div className="products-container">
          {/* Main Category Tabs */}
          <div className="products-tabs">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                className={`products-tab ${mainCategory === category.id ? 'active' : ''}`}
                onClick={() => handleMainCategoryChange(category.id)}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sub-Category Navigation */}
          <div className="products-subcategories">
            {getSubCategories().map((subCat) => (
              <button
                key={subCat.id}
                className={`products-subcategory ${subCategory === subCat.id ? 'active' : ''}`}
                onClick={() => handleSubCategoryChange(subCat.id)}
              >
                {subCat.title}
              </button>
            ))}
          </div>

          {/* Corporate Products Grid */}
          <div className="products-grid">
            {getCurrentProducts().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleCardClick}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
