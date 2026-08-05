import { useNavigate, useParams, useSearchParams } from "react-router-dom";
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


export function ProductsAndServices() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { lang } = useParams();
  const { categories: productCategories } = useProductCatalog(lang || 'id');
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
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('');

  // Handle URL parameters from mega menu
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)) {
      setMainCategory(categoryParam as MainCategory);
      
      // For package category, use equipment sub-categories
      let categories = productCategories[categoryParam as MainCategory] as Record<string, SubCategory>;
      if (categoryParam === 'package') {
        categories = productCategories['equipment'] as Record<string, SubCategory>;
      }
      
      const firstSubCategory = Object.keys(categories || {})[0] || '';
      setSubCategory(subcategoryParam && categories?.[subcategoryParam] ? subcategoryParam : firstSubCategory);
    }
  }, [searchParams, productCategories]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    
    // Set default sub-category based on main category
    let categories = productCategories[category] as Record<string, SubCategory>;
    // For package category, use equipment sub-categories
    if (category === 'package') {
      categories = productCategories['equipment'] as Record<string, SubCategory>;
    }
    setSubCategory(Object.keys(categories || {})[0] || '');
  };

  const handleSubCategoryChange = (subCatId: string) => {
    if (subCatId === subCategory) return;
    setSubCategory(subCatId);
  };

  const getSubCategories = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];
    
    // For package category, use equipment sub-categories (temporary fix until backend structure is corrected)
    if (mainCategory === 'package') {
      const equipmentCategories = productCategories['equipment'] as Record<string, SubCategory>;
      if (!equipmentCategories) return [];
      
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
      // Use equipment category data for package items (temporary fix until backend structure is corrected)
      const equipmentCategories = productCategories['equipment'] as Record<string, SubCategory>;
      if (!equipmentCategories) return [];
      
      // If a specific sub-category is selected, show products from that sub-category
      if (subCategory && equipmentCategories[subCategory]) {
        return equipmentCategories[subCategory].products || [];
      }
      
      // Default: show all package items from all equipment sub-categories
      const allProducts: Product[] = [];
      
      // Get all products from equipment category
      Object.values(equipmentCategories).forEach(subCategory => {
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
    
    // For gas and services, use sub-category filtering
    const subCat = categories[subCategory];
    return subCat?.products || [];
  };

  const handleCardClick = (productId: string) => {
    navigate(`/${lang || 'id'}/produk/detail?id=${productId}`);
  };

  return (
    <div className="products-corporate">
      <section className="products-section" id="products">
        <div className="products-container">

          {/* Corporate Header */}
          <motion.div 
            className="products-header"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="products-title">
              {t('products.pageHeader.title')}
            </h2>
            <p className="products-subtitle">
              {t('products.homeSection.subtitle')}
            </p>
          </motion.div>

          {/* Premium Category Cards */}
          <motion.div 
            className="category-cards"
            initial={{ opacity: 0, y: 30 }}
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

          {/* Featured Category Banner */}
          <motion.div
            className="featured-banner-container"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <FeaturedBanner category={mainCategory} t={t} />
          </motion.div>

          {/* Sub-Category Navigation (Premium Pill Buttons) - Hide for package category */}
          {mainCategory !== 'package' && getSubCategories().length > 1 && (
            <motion.div 
              className="products-subcategories"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {getSubCategories().map((subCat, index) => (
                <motion.button
                  key={subCat.id}
                  className={`products-subcategory ${subCategory === subCat.id ? 'active' : ''}`}
                  onClick={() => handleSubCategoryChange(subCat.id)}
                  aria-label={t('common.selectSubcategoryAria', { subcategory: subCat.title })}
                  aria-pressed={subCategory === subCat.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ duration: 0.2, delay: 0.4 + index * 0.1 }}
                >
                  <span>{subCat.title}</span>
                </motion.button>
              ))}
            </motion.div>
          )}

          {/* Premium Products Grid */}
          <motion.div 
            className="products-grid"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            {getCurrentProducts().map((product) => (
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