import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion } from "motion/react";
import { 
  ChevronRight,
  Wrench,
  Cpu,
  Droplets
} from "lucide-react";
import '../../styles/ProductsAndServices.css';
import { getProductCategories, mainCategoryIds, type Product, type SubCategory, type MainCategory } from "../../data/products";

/* ═══════════════════════════════════════════════════════════════
   PRODUCT.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

// Product Card Component
function ProductCard({ product, onClick, mainCategory }: { product: Product; onClick: (id: string) => void; mainCategory: MainCategory }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  const getCategoryBadge = () => {
    return t(`products.mainCategories.${mainCategory}`);
  };

  return (
    <motion.div
      className="products-card"
      onClick={() => onClick(product.id)}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3 }}
    >
      <div className="products-card-image">
        {imageError ? (
          <div className="products-card-fallback">
            {t('common.imageNotFound')}
          </div>
        ) : (
          <img
            src={product.image}
            alt={product.title}
            onError={() => setImageError(true)}
          />
        )}
        <div className="products-card-overlay" />
      </div>

      <div className="products-card-content">
        <div className="products-card-badge">
          {getCategoryBadge()}
        </div>
        <h3 className="products-card-title">
          {product.title}
        </h3>
        <p className="products-card-description">
          {product.description}
        </p>
        <div className="products-card-arrow">
          <ChevronRight size={20} />
        </div>
      </div>
    </motion.div>
  );
}


// Category Card Component
function CategoryCard({ 
  label, 
  isActive, 
  onClick, 
  icon: Icon,
  description 
}: { 
  label: string; 
  isActive: boolean; 
  onClick: () => void;
  icon: any;
  description: string;
}) {
  return (
    <motion.button
      className={`category-card ${isActive ? 'active' : ''}`}
      onClick={onClick}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3 }}
    >
      <div className="category-card-icon">
        <Icon size={40} />
      </div>
      <div className="category-card-content">
        <h3 className="category-card-title">{label}</h3>
        <p className="category-card-description">{description}</p>
      </div>
      <div className="category-card-arrow">
        <ChevronRight size={24} />
      </div>
      {isActive && <div className="category-card-glow" />}
    </motion.button>
  );
}


// Featured Banner Component
function FeaturedBanner({ category, t }: { category: MainCategory; t: (key: string) => string }) {
  const bannerContent = {
    gas: {
      image: '/images/products/Oxygen-optimized.webp',
      title: t('products.featured.gas.title'),
      description: t('products.featured.gas.description')
    },
    package: {
      image: '/images/products/Cryogenic_Dewar.webp',
      title: t('products.featured.package.title'),
      description: t('products.featured.package.description')
    },
    services: {
      image: '/images/services/Installation.webp',
      title: t('products.featured.services.title'),
      description: t('products.featured.services.description')
    }
  };

  const content = bannerContent[category];

  return (
    <motion.div
      className="featured-banner"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="featured-banner-image">
        <img src={content.image} alt={content.title} />
        <div className="featured-banner-overlay" />
      </div>
      <div className="featured-banner-content">
        <h2 className="featured-banner-title">{content.title}</h2>
        <p className="featured-banner-description">{content.description}</p>
      </div>
    </motion.div>
  );
}


export function Product() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const productCategories = getProductCategories(t);
  const mainCategories: { id: MainCategory; label: string; icon: any; description: string }[] = [
    {
      id: 'gas',
      label: t('products.mainCategories.gas'),
      icon: Droplets,
      description: t('products.featured.gas.shortDescription')
    },
    {
      id: 'package',
      label: t('products.mainCategories.package'),
      icon: Cpu,
      description: t('products.featured.package.shortDescription')
    },
    {
      id: 'services',
      label: t('products.mainCategories.services'),
      icon: Wrench,
      description: t('products.featured.services.shortDescription')
    }
  ];
  const [searchParams] = useSearchParams();
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('industrial-medical');

  // Handle URL parameters from mega menu
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)) {
      setMainCategory(categoryParam as MainCategory);
      if (subcategoryParam && categoryParam === 'gas') {
        setSubCategory(subcategoryParam);
      } else if (categoryParam === 'gas') {
        setSubCategory('industrial-medical');
      } else {
        setSubCategory('');
      }
    }
  }, [searchParams]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    // Set default subcategory for each main category
    let newSubCategory: string;
    if (category === 'gas') {
      newSubCategory = 'industrial-medical';
    } else if (category === 'package' || category === 'services') {
      // For package and services, no subcategory needed
      newSubCategory = '';
    } else {
      newSubCategory = 'industrial-medical';
    }
    setSubCategory(newSubCategory);
  };

  const handleSubCategoryChange = (subCatId: string) => {
    if (subCatId === subCategory) return;
    setSubCategory(subCatId);
  };

  const getSubCategories = () => {
    // Package and services don't have subcategories
    if (mainCategory === 'package' || mainCategory === 'services') {
      return [];
    }
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    return Object.keys(categories).map(key => ({
      id: key,
      title: categories[key]?.title || ''
    }));
  };

  const getCurrentProducts = () => {
    // For package and services, get products directly
    if (mainCategory === 'package' || mainCategory === 'services') {
      const category = productCategories[mainCategory] as SubCategory;
      return category?.products || [];
    }
    // For gas, get from subcategory
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    const subCat = categories[subCategory];
    return subCat?.products || [];
  };

  const handleCardClick = (productId: string) => {
    navigate(`/${currentLang}/produk/detail?id=${productId}`);
  };

  return (
    <div className="products-corporate">
      <section className="products-section" id="products">

        {/* Corporate Header */}
        <motion.div 
          className="products-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          style={{
            position: 'relative',
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
            padding: '100px 6vw 120px 6vw',
            width: '100vw',
            marginLeft: 'calc(-50vw + 50%)',
            marginRight: 'calc(-50vw + 50%)',
            marginTop: '-120px',
            overflow: 'hidden'
          }}
        >
          <div style={{
            maxWidth: '1400px',
            margin: '0 auto',
            textAlign: 'center',
            color: '#ffffff',
            paddingTop: '30px'
          }}>
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
              {t('products.pageHeader.badge')}
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
              {t('products.pageHeader.title')}
            </h2>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {t('products.pageHeader.subtitle')}
            </p>
          </div>
        </motion.div>

        <div className="products-container">

          {/* Category Cards */}
          <motion.div 
            className="category-cards"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {mainCategories.map((category) => (
              <CategoryCard
                key={category.id}
                label={category.label}
                isActive={mainCategory === category.id}
                onClick={() => handleMainCategoryChange(category.id)}
                icon={category.icon}
                description={category.description}
              />
            ))}
          </motion.div>

          {/* Featured Banner */}
          <motion.div
            className="featured-banner-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FeaturedBanner category={mainCategory} t={t} />
          </motion.div>

          {/* Sub-Category Navigation - only for gas category */}
          {getSubCategories().length > 0 && (
            <motion.div 
              className="products-subcategories"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.4 }}
              style={{ marginTop: '50px' }}
            >
              {getSubCategories().map((subCat) => (
                <button
                  key={subCat.id}
                  className={`products-subcategory ${subCategory === subCat.id ? 'active' : ''}`}
                  onClick={() => handleSubCategoryChange(subCat.id)}
                  aria-label={t('common.selectSubcategoryAria', { subcategory: subCat.title })}
                  aria-pressed={subCategory === subCat.id}
                >
                  <span>{subCat.title}</span>
                </button>
              ))}
            </motion.div>
          )}

          {/* Products Grid */}
          <motion.div 
            className="products-grid"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {getCurrentProducts().map((product: Product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleCardClick}
                mainCategory={mainCategory}
              />
            ))}
          </motion.div>

        </div>
      </section>

    </div>
  );
}
