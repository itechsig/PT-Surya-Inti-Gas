import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type Variants } from "motion/react";
import {
  ChevronRight,
  Wrench,
  Cpu,
  Droplets,
  Droplet,
  Syringe,
  FlaskConical,
  Cog,
  Layers
} from "lucide-react";
import '../../styles/ProductsAndServices.css';
import { Seo } from "./Seo";
import { mainCategoryIds, type Product, type ProductVariant, type SubCategory, type MainCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { getImageUrl } from "../../utils/imageUrl";
import { collapseCradleVariants } from "../../utils/cradleVariants";
import { CradleSizeDialog } from "./CradleSizeDialog";
import { getRelatedEquipmentProducts, isRelatedEquipmentSlug, RELATED_EQUIPMENT_ID } from "../../utils/relatedEquipment";

const MotionLink = motion.create(Link);

/* ═══════════════════════════════════════════════════════════════
   PRODUCT.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde

   Flow: pick a main category (Produk Gas / Kemasan / Layanan) → for
   Produk Gas only, pick a sub-category → compact product/service grid.
   The whole flow is driven by the `category`/`subcategory` URL query
   params so the browser back button and the in-page "Kembali" button
   always agree on where the previous step is.
══════════════════════════════════════════════════════════════ */

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
  show: { transition: { staggerChildren: 0.04 } },
};

const stepExit = { opacity: 0, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] } };

/** Icons for the 4 "Produk Gas" sub-categories, keyed by their stable CMS slug. */
const subCategoryIcons: Record<string, any> = {
  'industrial-medical': Syringe,
  'speciality-mixed': FlaskConical,
  'liquid': Droplet,
  [RELATED_EQUIPMENT_ID]: Cog,
};

// Featured Banner — kept only for the "pick a sub-category" step, giving it
// context without eating into the compact grid's viewport space.
function FeaturedBanner({ t }: { t: (key: string) => string }) {
  return (
    <motion.div
      className="featured-banner"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <div className="featured-banner-image">
        <img src="/images/products/bg_produk_gas.jpg" alt={t('products.featured.gas.title')} loading="lazy" decoding="async" />
        <div className="featured-banner-overlay" />
      </div>
      <div className="featured-banner-content">
        <h2 className="featured-banner-title">{t('products.featured.gas.title')}</h2>
        <p className="featured-banner-description">{t('products.featured.gas.description')}</p>
      </div>
    </motion.div>
  );
}

// Compact Product/Service Card — image + name only, used for the listing grid.
function CompactProductCard({ product, href, onVariantClick }: { product: Product; href: string; onVariantClick: (product: Product) => void }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();
  const isVariantGroup = !!product.variants?.length;

  const inner = (
    <>
      <div className="products-card-compact-image">
        {imageError ? (
          <div className="products-card-compact-fallback">{t('common.imageNotFound')}</div>
        ) : (
          <img
            src={getImageUrl(product.image)}
            alt={product.title}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="products-card-compact-title">{product.title}</div>
    </>
  );

  const sharedProps = {
    className: "products-card-compact",
    "aria-label": product.title,
    variants: fadeUp,
    whileHover: { y: -4 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  };

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


// Category / Sub-category Card Component
function CategoryCard({
  label,
  onClick,
  icon: Icon,
  description
}: {
  label: string;
  onClick: () => void;
  icon: any;
  description?: string;
}) {
  return (
    <motion.button
      className="category-card"
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
        {description && <p className="category-card-description">{description}</p>}
      </div>
      <div className="category-card-arrow">
        <ChevronRight size={24} />
      </div>
    </motion.button>
  );
}


export function Product() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const { categories: productCategories } = useProductCatalog(currentLang);
  const [searchParams] = useSearchParams();
  const [cradleVariants, setCradleVariants] = useState<ProductVariant[] | null>(null);

  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');

  const mainCategory: MainCategory | null =
    categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)
      ? (categoryParam as MainCategory)
      : null;
  const subCategory = subcategoryParam || '';

  // Produk Gas always needs an explicit sub-category pick first; Kemasan and
  // Layanan have none, so landing on the main category is enough.
  const step: 'hub' | 'subcategory' | 'grid' =
    !mainCategory ? 'hub' : (mainCategory === 'gas' && !subCategory) ? 'subcategory' : 'grid';

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

  const goToCategory = (category: MainCategory) => {
    navigate(`/${currentLang}/produk?category=${category}`);
  };

  const goToSubCategory = (subCatId: string) => {
    navigate(`/${currentLang}/produk?category=gas&subcategory=${encodeURIComponent(subCatId)}`);
  };

  const goBackToHub = () => navigate(`/${currentLang}/produk`);
  const goBackToSubcategories = () => navigate(`/${currentLang}/produk?category=gas`);

  const getGasSubCategories = () => {
    const categories = productCategories.gas as Record<string, SubCategory>;
    if (!categories) return [];

    const subs = Object.keys(categories)
      // "Related Equipment" categories are folded into a single virtual card below.
      .filter(key => !isRelatedEquipmentSlug(key))
      .map(key => ({
        id: key,
        title: categories[key]?.title || ''
      }));

    // Gas exposes CMS "equipment" products as a virtual "Related Equipment" sub-category.
    if (getRelatedEquipmentProducts(productCategories).length > 0) {
      subs.push({ id: RELATED_EQUIPMENT_ID, title: t('products.subCategories.relatedEquipment') });
    }

    return subs;
  };

  const getCurrentProducts = (): Product[] => {
    if (!mainCategory) return [];
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];

    // Kemasan has no sub-categories — show every product across its buckets.
    if (mainCategory === 'package') {
      const allProducts: Product[] = [];
      Object.values(categories).forEach(sub => {
        if (sub?.products) allProducts.push(...sub.products);
      });

      // Collapse the Cradle size variants into a single card (sizes shown on click).
      return collapseCradleVariants(allProducts, t);
    }

    // Virtual "Related Equipment" sub-category in the gas category.
    if (mainCategory === 'gas' && subCategory === RELATED_EQUIPMENT_ID) {
      return getRelatedEquipmentProducts(productCategories);
    }

    // Gas: filtered by the chosen sub-category. Services: only one bucket, so
    // falling back to the first key shows it without needing a sub-category pick.
    const effectiveSubCategory = subCategory || Object.keys(categories)[0] || '';
    return categories[effectiveSubCategory]?.products || [];
  };

  const productHref = (productId: string) => `/${currentLang}/produk/detail?id=${productId}`;

  // Small heading above the grid so users always know which category/sub-category they're viewing.
  const currentListingLabel = (() => {
    if (!mainCategory) return '';
    if (mainCategory === 'gas') {
      if (subCategory === RELATED_EQUIPMENT_ID) return t('products.subCategories.relatedEquipment');
      return getGasSubCategories().find(s => s.id === subCategory)?.title || t('products.mainCategories.gas');
    }
    return t(`products.mainCategories.${mainCategory}`);
  })();

  return (
    <div className="products-corporate">
      <Seo title={t('seo.products.title')} description={t('seo.products.description')} segment="produk" />
      {/* Corporate Header */}
      <motion.div
        className="products-header"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        variants={staggerContainer}
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
          backgroundImage: 'linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(/images/office/wp.jpg)',
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
          <motion.h1 className="products-title" variants={fadeUp} style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: '0 0 24px'
          }}>
            {t('products.pageHeader.title')}
          </motion.h1>
          <motion.p className="products-subtitle" variants={fadeUp} style={{
            fontFamily: 'DM Sans, system-ui, sans-serif',
            fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
            lineHeight: '1.75',
            color: 'rgba(255, 255, 255, 0.78)',
            maxWidth: '640px',
            margin: '0 auto'
          }}>
            {t('products.pageHeader.subtitle')}
          </motion.p>
        </div>
      </motion.div>

      <section className="products-section" id="products">
        <div className="products-container">
          <AnimatePresence mode="wait">

            {/* Step 1: pick a main category */}
            {step === 'hub' && (
              <motion.div key="hub" initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div className="products-flow-heading" variants={fadeUp}>
                  <p>{t('products.nav.chooseCategory')}</p>
                </motion.div>
                <motion.div className="category-cards" variants={staggerContainer}>
                  {mainCategories.map((category) => (
                    <CategoryCard
                      key={category.id}
                      label={category.label}
                      onClick={() => goToCategory(category.id)}
                      icon={category.icon}
                      description={category.description}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 2 (Produk Gas only): pick a sub-category */}
            {step === 'subcategory' && (
              <motion.div key="subcategory" initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div className="products-flow-back" variants={fadeUp}>
                  <button onClick={goBackToHub} className="products-tab" aria-label={t('products.nav.backToCategories')}>
                    ← {t('products.nav.backToCategories')}
                  </button>
                </motion.div>
                <motion.div className="products-flow-heading" variants={fadeUp}>
                  <h2>{t('products.mainCategories.gas')}</h2>
                  <p>{t('products.nav.chooseSubcategory')}</p>
                </motion.div>
                <motion.div className="featured-banner-container" variants={fadeUp}>
                  <FeaturedBanner t={t} />
                </motion.div>
                <motion.div className="category-cards category-cards--sub" variants={staggerContainer}>
                  {getGasSubCategories().map((subCat) => (
                    <CategoryCard
                      key={subCat.id}
                      label={subCat.title}
                      onClick={() => goToSubCategory(subCat.id)}
                      icon={subCategoryIcons[subCat.id] || Layers}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: compact product/service grid */}
            {step === 'grid' && (
              <motion.div key={`grid-${mainCategory}-${subCategory}`} initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div className="products-flow-back" variants={fadeUp}>
                  <button
                    onClick={mainCategory === 'gas' ? goBackToSubcategories : goBackToHub}
                    className="products-tab"
                    aria-label={mainCategory === 'gas' ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
                  >
                    ← {mainCategory === 'gas' ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
                  </button>
                </motion.div>
                <motion.div className="products-flow-heading" variants={fadeUp} style={{ marginBottom: '24px' }}>
                  <h2>{currentListingLabel}</h2>
                </motion.div>
                <motion.div className="products-grid-compact" variants={gridStagger}>
                  {getCurrentProducts().map((product: Product) => (
                    <CompactProductCard
                      key={product.id}
                      product={product}
                      href={productHref(product.id)}
                      onVariantClick={(p) => setCradleVariants(p.variants ?? null)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </section>

      {cradleVariants && (
        <CradleSizeDialog
          variants={cradleVariants}
          onSelect={(variant) => {
            setCradleVariants(null);
            const base = `/${currentLang}/produk/detail?id=${variant.id}`;
            navigate(variant.size ? `${base}&size=${encodeURIComponent(variant.size)}` : base);
          }}
          onClose={() => setCradleVariants(null)}
        />
      )}
    </div>
  );
}
