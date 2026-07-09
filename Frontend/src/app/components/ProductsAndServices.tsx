import { useNavigate } from "react-router-dom";
import { useState } from "react";
import '../../styles/ProductsAndServices.css';

// Type definitions
type Product = {
  id: string;
  title: string;
  description: string;
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
   PRODUCTS AND SERVICES.TSX — PT Surya Inti Gas Corporate
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
            image: '/images/products/Acetylene-optimized.webp'
          },
          {
            id: 'oxygen',
            title: 'Oksigen (O2)',
            description: 'Gas oksigen untuk medis, metalurgi, dan aplikasi industri',
            image: '/images/products/Oxygen-optimized.webp'
          },
          {
            id: 'nitrogen',
            title: 'Nitrogen (N2)',
            description: 'Gas nitrogen untuk inerting, blanketing, dan pendinginan',
            image: '/images/products/Nitrogen-optimized.webp'
          },
          {
            id: 'argon',
            title: 'Argon (Ar)',
            description: 'Gas argon untuk pengelasan TIG dan aplikasi elektronik',
            image: '/images/products/Argon-optimized.webp'
          },
          {
            id: 'hydrogen',
            title: 'Hidrogen (H2)',
            description: 'Gas hidrogen untuk berbagai aplikasi industri dan energi',
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
            image: '/images/products/Helium-optimized.webp'
          },
          {
            id: 'sulfur-hexaflouride',
            title: 'Sulfur Hexaflouride (SF6)',
            description: 'Gas SF6 untuk isolasi listrik dan aplikasi industri',
            image: '/images/products/Sulfur_Hexaflouride.webp'
          },
          {
            id: 'mixed-gas',
            title: 'Mixed Gas (Gas Campur)',
            description: 'Gas campuran khusus untuk aplikasi industri tertentu',
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
            image: '/images/products/Acetylene.webp'
          },
          {
            id: 'color-code-special',
            title: 'Special Gas Cylinder',
            description: 'Tabung gas khusus dengan color code',
            image: '/images/products/Special_gas_.webp'
          },
          {
            id: 'color-code-medical',
            title: 'Medical Gas Cylinder',
            description: 'Tabung gas medis dengan color code standar kesehatan',
            image: '/images/products/Medical_Gas_Cylinder.webp'
          },
          {
            id: 'color-code-industrial',
            title: 'Industrial Gas Cylinder',
            description: 'Tabung gas industri dengan color code',
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
            image: '/images/products/20260618_134436.webp'
          },
          {
            id: 'cradle-3x2',
            title: 'Cradle (3x2)',
            description: 'Rangka cradle 3x2 untuk penyimpanan tabung gas',
            image: '/images/products/Craddle_3x2.webp'
          },
          {
            id: 'cradle-4x4',
            title: 'Cradle (4x4)',
            description: 'Rangka cradle 4x4 kapasitas besar',
            image: '/images/products/Craddle_4x4_fixed.webp'
          },
          {
            id: 'cryogenic-dewars',
            title: 'Cryogenic Dewars',
            description: 'Dewars kriogenik untuk penyimpanan gas cair',
            image: '/images/products/Cryogenic_Dewar.webp'
          },
          {
            id: 'vessel-gas-liquid',
            title: 'Vessel Gas Liquid',
            description: 'Vessel untuk penyimpanan gas cair',
            image: '/images/products/VGL.webp'
          },
          {
            id: 'microbulk-tank',
            title: 'Microbulk Tank',
            description: 'Tangki microbulk untuk supply gas kontinyu',
            image: '/images/products/Microbulk_.webp'
          },
          {
            id: 'vertical-storage-tank',
            title: 'Vertical Storage Tank',
            description: 'Tangki penyimpanan vertikal',
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
            image: '/images/products/Assist_Gas_Supply.webp'
          },
          {
            id: 'microbulk-gas-supply',
            title: 'Microbulk Gas Supply',
            description: 'Supply gas microbulk untuk aplikasi laser cutting',
            image: '/images/products/Microbulk_Gas_Supply.webp'
          },
          {
            id: 'storage-tank-gas-supply',
            title: 'Storage Tank Gas Supply',
            description: 'Supply gas dari tangki penyimpanan',
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
            image: '/images/products/Liquid_Filling.webp'
          },
          {
            id: 'cryogenic-iso-tank',
            title: 'Cryogenic ISO Tank',
            description: 'Tangki ISO kriogenik untuk transport',
            image: '/images/products/ISO_Tank.webp'
          },
          {
            id: 'cryogenic-road-tank',
            title: 'Cryogenic Road Tank',
            description: 'Tangki jalan kriogenik untuk distribusi',
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
            image: '/images/products/Cryogenic&Valve.webp'
          },
          {
            id: 'gas-regulator-laser',
            title: 'Gas Regulator for Cutting Gas Laser Machine',
            description: 'Regulator gas khusus untuk mesin laser cutting',
            image: '/images/products/Gas_Regulator_For_Cutting.webp'
          },
          {
            id: 'high-pressure-regulator',
            title: 'High Pressure Regulator',
            description: 'Regulator tekanan tinggi untuk aplikasi industri',
            image: '/images/products/High_Pressure_Regulator.webp'
          },
          {
            id: 'high-pressure-gas-valve',
            title: 'High Pressure Gas Valve',
            description: 'Valve gas tekanan tinggi untuk sistem gas',
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

export function ProductsAndServices() {
  const navigate = useNavigate();
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('industrial-medical');

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
      <section className="products-section" id="products">
        <div className="products-container">

          {/* Corporate Header */}
          <div className="products-header">
            <div className="products-badge">
              Produk & Layanan
            </div>
            <h2 className="products-title">
              Solusi Gas <span className="accent">Komprehensif</span>
            </h2>
            <p className="products-subtitle">
              Bisnis utama kami adalah memasok gas industri, termasuk Gas Udara (Oksigen, Nitrogen, dan Argon), Gas Medis, Gas Sintetis, Gas Bahan Bakar, dan sebagainya. Produk-produk Gas tersebut memiliki aplikasi yang sangat luas sehingga kami mampu melayani berbagai kebutuhan industri diantaranya medis, metalurgi, energi, infrastruktur dan barang konsumsi.
            </p>
          </div>

          {/* Main Category Tabs */}
          <div className="products-tabs">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                className={`products-tab ${mainCategory === category.id ? 'active' : ''}`}
                onClick={() => handleMainCategoryChange(category.id)}
                aria-label={`Select ${category.label} category`}
                aria-pressed={mainCategory === category.id}
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
                aria-label={`Select ${subCat.title} subcategory`}
                aria-pressed={subCategory === subCat.id}
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