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
import { mainCategoryIds, type Product, type SubCategory, type MainCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";

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
    },
    equipment: {
      image: '/images/products/Craddle_4x4_fixed.webp',
      title: 'Industrial Gas Equipment',
      description: 'Complete range of gas handling equipment and tools'
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
  const { categories: productCategories } = useProductCatalog(currentLang);
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
  const [subCategory, setSubCategory] = useState<string>('');

  // Handle URL parameters from mega menu
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)) {
      setMainCategory(categoryParam as MainCategory);
      
      // For package category, try to use package sub-categories first
      if (categoryParam === 'package') {
        const packageCategories = productCategories['package'] as Record<string, SubCategory>;
        const packageCategoriesArray = Object.keys(packageCategories || {});
        
        if (packageCategoriesArray.length > 0) {
          const firstSubCategory = packageCategoriesArray[0] || '';
          setSubCategory(subcategoryParam && packageCategories?.[subcategoryParam] ? subcategoryParam : firstSubCategory);
        } else {
          // Fallback: Use equipment sub-categories
          const categories = productCategories['equipment'] as Record<string, SubCategory>;
          const firstSubCategory = Object.keys(categories || {})[0] || '';
          setSubCategory(subcategoryParam && categories?.[subcategoryParam] ? subcategoryParam : firstSubCategory);
        }
      } else {
        const categories = productCategories[categoryParam as MainCategory] as Record<string, SubCategory>;
        const firstSubCategory = Object.keys(categories || {})[0] || '';
        setSubCategory(subcategoryParam && categories?.[subcategoryParam] ? subcategoryParam : firstSubCategory);
      }
    }
  }, [searchParams, productCategories]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    
    // Set default sub-category based on main category
    let categories = productCategories[category] as Record<string, SubCategory>;
    
    // For package category, try to use package sub-categories first
    if (category === 'package') {
      const packageCategories = productCategories['package'] as Record<string, SubCategory>;
      const packageCategoriesArray = Object.keys(packageCategories || {});
      
      if (packageCategoriesArray.length > 0) {
        setSubCategory(packageCategoriesArray[0] || '');
      } else {
        // Fallback: Use equipment sub-categories
        categories = productCategories['equipment'] as Record<string, SubCategory>;
        setSubCategory(Object.keys(categories || {})[0] || '');
      }
    } else {
      setSubCategory(Object.keys(categories || {})[0] || '');
    }
  };

  const handleSubCategoryChange = (subCatId: string) => {
    if (subCatId === subCategory) return;
    setSubCategory(subCatId);
  };

  const getSubCategories = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];
    
    // For package category, try to use package sub-categories first
    if (mainCategory === 'package') {
      const packageCategories = productCategories['package'] as Record<string, SubCategory>;
      const packageCategoriesArray = Object.keys(packageCategories || {});
      
      // If package category has data, use it
      if (packageCategoriesArray.length > 0) {
        return Object.keys(packageCategories).map(key => ({
          id: key,
          title: packageCategories[key]?.title || ''
        }));
      }
      
      // Fallback: Use equipment sub-categories (temporary fix until backend structure is corrected)
      const equipmentCategories = productCategories['equipment'] as Record<string, SubCategory>;
      if (!equipmentCategories) return [];
      
      // Return all equipment sub-categories for now
      return Object.keys(equipmentCategories).map(key => ({
        id: key,
        title: equipmentCategories[key]?.title || ''
      }));
    }
    
    return Object.keys(categories).map(key => ({
      id: key,
      title: categories[key]?.title || ''
    }));
  };

  const getCurrentProducts = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];
    
    // For package category, show specific products only
    if (mainCategory === 'package') {
      // First try to use package category data directly
      const packageCategories = productCategories['package'] as Record<string, SubCategory>;
      const packageCategoriesArray = Object.keys(packageCategories || {});
      
      // If package category has data, use it
      if (packageCategoriesArray.length > 0) {
        // If a specific sub-category is selected, show products from that sub-category
        if (subCategory && packageCategories[subCategory]) {
          return packageCategories[subCategory].products || [];
        }
        
        // Default: show all package items
        const allProducts: Product[] = [];
        Object.values(packageCategories).forEach(subCategory => {
          if (subCategory?.products) {
            allProducts.push(...subCategory.products);
          }
        });
        
        // Filter to only show specific package items
        const allowedPackageIds = [
          'cradle-2x2',              // Cradle 2x2
          'cradle-3x2',              // Cradle 3x2
          'cradle-3x3',              // Cradle 3x3
          'cradle-4x4',              // Cradle 4x4
          'package-high-pressure',  // Cylinder
          'cryogenic-dewars',        // Cryogenic Dewars
          'vessel-gas-liquid',       // Vessel Gas Liquid
          'microbulk-tank',          // Microbulk Tank
          'iso-tank',                // ISO Tank
          'lorry-tank'               // Lorry Tank
        ];
        
        return allProducts.filter(product => allowedPackageIds.includes(product.id));
      }
      
      // Fallback: Use equipment category data for package items (temporary fix until backend structure is corrected)
      const equipmentCategories = productCategories['equipment'] as Record<string, SubCategory>;
      if (!equipmentCategories) return [];
      
      // Get all products from all equipment sub-categories
      const allProducts: Product[] = [];
      Object.values(equipmentCategories).forEach(subCategory => {
        if (subCategory?.products) {
          allProducts.push(...subCategory.products);
        }
      });
      
      // Filter to only show specific package items by product ID
      const allowedPackageIds = [
        'cradle-2x2',              // Cradle 2x2
        'cradle-3x2',              // Cradle 3x2
        'cradle-3x3',              // Cradle 3x3
        'cradle-4x4',              // Cradle 4x4
        'package-high-pressure',  // Cylinder
        'cryogenic-dewars',        // Cryogenic Dewars
        'vessel-gas-liquid',       // Vessel Gas Liquid
        'microbulk-tank',          // Microbulk Tank
        'iso-tank',                // ISO Tank
        'lorry-tank'               // Lorry Tank
      ];
      
      return allProducts.filter(product => allowedPackageIds.includes(product.id));
    }
    
    // For gas and services, use sub-category filtering
    const subCat = categories[subCategory];
    return subCat?.products || [];
  };

  const handleCardClick = (productId: string) => {
    navigate(`/${currentLang}/produk/detail?id=${productId}`);
  };

  return (
    <div className="products-corporate">
      {/* Corporate Header */}
      <motion.div 
        className="products-header"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        style={{
          position: 'relative',
          minHeight: '560px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          padding: '140px 6vw',
          textAlign: 'center',
          marginBottom: '0'
        }}
      >
        <div style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(/images/office/wp/jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          zIndex: 0
        }} />
        <div style={{
          position: 'relative',
          zIndex: 1,
          maxWidth: '900px',
          margin: '0 auto',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}>
          <h2 className="products-title" style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 24px'
          }}>
            {t('products.pageHeader.title')}
          </h2>
          <p className="products-subtitle" style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            lineHeight: '1.75',
            color: 'rgba(255, 255, 255, 0.78)',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            {t('products.pageHeader.subtitle')}
          </p>
        </div>
      </motion.div>

      <section className="products-section" id="products" style={{
        paddingTop: '0'
      }}>
        <div className="products-container" style={{
          padding: '100px 6vw'
        }}>

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

          {/* Sub-Category Navigation - Hide for package category */}
          {mainCategory !== 'package' && getSubCategories().length > 1 && (
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
