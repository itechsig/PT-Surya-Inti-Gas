import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type Variants } from "motion/react";

const MotionLink = motion.create(Link);
import {
  ChevronRight,
  Wrench,
  Cpu,
  Droplets
} from "lucide-react";
import '../../styles/ProductsAndServices.css';
import { mainCategoryIds, type Product, type ProductVariant, type SubCategory, type MainCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { getImageUrl } from "../../utils/imageUrl";
import { collapseCradleVariants } from "../../utils/cradleVariants";
import { CradleSizeDialog } from "./CradleSizeDialog";
import { getRelatedEquipmentProducts, isRelatedEquipmentSlug, RELATED_EQUIPMENT_ID } from "../../utils/relatedEquipment";

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

const gridStagger: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};


// Product Card Component
function ProductCard({ product, href, mainCategory, onVariantClick }: { product: Product; href: string; mainCategory: MainCategory; onVariantClick: (product: Product) => void }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  const getCategoryBadge = () => {
    return t(`products.mainCategories.${mainCategory}`);
  };

  const isVariantGroup = !!product.variants?.length;
  const sharedProps = {
    className: "products-card",
    "aria-label": product.title,
    variants: fadeUp,
    whileHover: { y: -6 },
    transition: { duration: 0.3, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  };

  const inner = (
    <>
      <div className="products-card-image">
        {imageError ? (
          <div className="products-card-fallback">
            {t('common.imageNotFound')}
          </div>
        ) : (
          <img
            src={getImageUrl(product.image)}
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
          <ChevronRight size={20} aria-hidden="true" />
        </div>
      </div>
    </>
  );

  if (isVariantGroup) {
    return (
      <motion.button type="button" onClick={() => onVariantClick(product)} {...sharedProps}>
        {inner}
      </motion.button>
    );
  }

  return (
    <MotionLink to={href} {...sharedProps}>
      {inner}
    </MotionLink>
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
      variants={fadeUp}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
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
      image: '/images/products/Oxygen_Fix.webp',
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
  const [cradleVariants, setCradleVariants] = useState<ProductVariant[] | null>(null);
  const navigate = useNavigate();

  // Initialize default sub-category when data is loaded
  useEffect(() => {
    if (mainCategory !== 'package' && !subCategory) {
      const categories = productCategories[mainCategory] as Record<string, SubCategory>;
      const firstSubCategory = Object.keys(categories || {})[0] || '';
      if (firstSubCategory) {
        setSubCategory(firstSubCategory);
      }
    }
  }, [productCategories, mainCategory, subCategory]);

  // Handle URL parameters from mega menu
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');

    if (categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)) {
      setMainCategory(categoryParam as MainCategory);
      
      // For package category, no subcategories needed
      if (categoryParam === 'package') {
        setSubCategory('');
      } else {
        const categories = productCategories[categoryParam as MainCategory] as Record<string, SubCategory>;
        const firstSubCategory = Object.keys(categories || {})[0] || '';
        const isRelatedEquipment =
          categoryParam === 'gas' &&
          subcategoryParam === RELATED_EQUIPMENT_ID &&
          getRelatedEquipmentProducts(productCategories).length > 0;
        setSubCategory(
          isRelatedEquipment || (subcategoryParam && categories?.[subcategoryParam])
            ? (subcategoryParam as string)
            : firstSubCategory
        );
      }
    }
  }, [searchParams, productCategories]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    
    // Set default sub-category based on main category
    let categories = productCategories[category] as Record<string, SubCategory>;
    
    // For package category, no subcategories needed
    if (category === 'package') {
      setSubCategory('');
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
    
    // Package category has no subcategories - return empty
    if (mainCategory === 'package') {
      return [];
    }
    
    const subs = Object.keys(categories)
      // "Related Equipment" categories are folded into a single virtual pill below.
      .filter(key => !(mainCategory === 'gas' && isRelatedEquipmentSlug(key)))
      .map(key => ({
        id: key,
        title: categories[key]?.title || ''
      }));

    // Gas tab exposes CMS "equipment" products as a virtual "Related Equipment" sub-category.
    if (mainCategory === 'gas' && getRelatedEquipmentProducts(productCategories).length > 0) {
      subs.push({ id: RELATED_EQUIPMENT_ID, title: t('products.subCategories.relatedEquipment') });
    }

    return subs;
  };

  const getCurrentProducts = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];
    
    // For package category, show all products directly (no subcategories)
    if (mainCategory === 'package') {
      const packageCategories = productCategories['package'] as Record<string, SubCategory>;
      const packageCategoriesArray = Object.keys(packageCategories || {});
      
      // If package category has data, show all products
      if (packageCategoriesArray.length > 0) {
        // Show all products from the package category
        const allProducts: Product[] = [];
        Object.values(packageCategories).forEach(subCategory => {
          if (subCategory?.products) {
            allProducts.push(...subCategory.products);
          }
        });
        
        // Collapse the Cradle size variants into a single card (sizes shown on click).
        return collapseCradleVariants(allProducts, t);
      }

      return [];
    }
    
    // Virtual "Related Equipment" sub-category in the gas tab.
    if (mainCategory === 'gas' && subCategory === RELATED_EQUIPMENT_ID) {
      return getRelatedEquipmentProducts(productCategories);
    }

    // For gas and services, use sub-category filtering
    // If no subcategory selected, use the first available one
    const effectiveSubCategory = subCategory || Object.keys(categories || {})[0] || '';
    const subCat = categories[effectiveSubCategory];
    return subCat?.products || [];
  };

  const productHref = (productId: string) =>
    `/${lang || 'id'}/produk/detail?id=${productId}`;

  return (
    <div className="products-corporate">
      <section className="products-section" id="products">
        <div className="products-container">

          {/* Corporate Header */}
          <motion.div
            className="products-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="products-title" variants={fadeUp}>
              {t('products.pageHeader.title')}
            </motion.h2>
            <motion.p className="products-subtitle" variants={fadeUp}>
              {t('products.homeSection.subtitle')}
            </motion.p>
          </motion.div>

          {/* Premium Category Cards */}
          <motion.div
            className="category-cards"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
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
            <AnimatePresence mode="wait">
              <FeaturedBanner key={mainCategory} category={mainCategory} t={t} />
            </AnimatePresence>
          </motion.div>

          {/* Sub-Category Navigation (Premium Pill Buttons) */}
          <AnimatePresence mode="wait">
            {getSubCategories().length >= 1 && (
              <motion.div
                key={mainCategory}
                className="products-subcategories"
                initial="hidden"
                animate="show"
                exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                variants={staggerContainer}
              >
                {getSubCategories().map((subCat) => (
                  <motion.button
                    key={subCat.id}
                    className={`products-subcategory ${subCategory === subCat.id ? 'active' : ''}`}
                    onClick={() => handleSubCategoryChange(subCat.id)}
                    aria-label={t('common.selectSubcategoryAria', { subcategory: subCat.title })}
                    aria-pressed={subCategory === subCat.id}
                    variants={fadeUp}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                  >
                    <span>{subCat.title}</span>
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Premium Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`${mainCategory}-${subCategory}`}
              className="products-grid"
              initial="hidden"
              animate="show"
              exit={{ opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
              variants={gridStagger}
            >
              {getCurrentProducts().map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  href={productHref(product.id)}
                  mainCategory={subCategory === RELATED_EQUIPMENT_ID ? 'equipment' : mainCategory}
                  onVariantClick={(p) => setCradleVariants(p.variants ?? null)}
                />
              ))}
            </motion.div>
          </AnimatePresence>

        </div>
      </section>

      {cradleVariants && (
        <CradleSizeDialog
          variants={cradleVariants}
          onSelect={(variant) => {
            setCradleVariants(null);
            const base = productHref(variant.id);
            navigate(variant.size ? `${base}&size=${encodeURIComponent(variant.size)}` : base);
          }}
          onClose={() => setCradleVariants(null)}
        />
      )}
    </div>
  );
}