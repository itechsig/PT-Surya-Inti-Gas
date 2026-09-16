import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";

const MotionLink = motion.create(Link);
import '../../styles/ProductsAndServices.css';
import { mainCategoryIds, type Product, type ProductVariant, type SubCategory, type MainCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { getImageUrl } from "../../utils/imageUrl";
import { collapseCradleVariants } from "../../utils/cradleVariants";
import { CradleSizeDialog } from "./CradleSizeDialog";
import { getRelatedEquipmentProducts, isRelatedEquipmentSlug, RELATED_EQUIPMENT_ID } from "../../utils/relatedEquipment";

/* Static hero images for the 3 main categories — same assets already used
   across the site, just reused here as plain picker-card thumbnails. */
const MAIN_CATEGORY_IMAGES: Record<MainCategory, string> = {
  gas: '/images/products/bg_produk_gas.jpg',
  package: '/images/products/Cryogenic_Dewar.webp',
  services: '/images/services/bg_layanan.png',
  equipment: '/images/products/Craddle_4x4_fixed.webp',
};

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

// Breadcrumb trail — click any earlier crumb to jump back to that step.
function Breadcrumb({ items }: { items: { label: string; onClick?: () => void }[] }) {
  return (
    <nav className="products-breadcrumb" aria-label="breadcrumb">
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <span key={i} className="products-breadcrumb-item">
            {item.onClick ? (
              <button type="button" onClick={item.onClick} className="products-breadcrumb-link">{item.label}</button>
            ) : (
              <span className="products-breadcrumb-current">{item.label}</span>
            )}
            {!isLast && <ChevronRight size={13} className="products-breadcrumb-sep" aria-hidden="true" />}
          </span>
        );
      })}
    </nav>
  );
}

// Picker Card — plain image + title, used for both the main-category hub
// and the Produk Gas sub-category step. Same visual language as the
// compact product cards below, just a bit larger.
function PickerCard({ label, imageSrc, onClick }: { label: string; imageSrc?: string; onClick: () => void }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  return (
    <motion.button
      type="button"
      className="picker-card"
      onClick={onClick}
      variants={fadeUp}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
    >
      <div className="picker-card-image">
        {!imageSrc || imageError ? (
          <div className="picker-card-fallback">{t('common.imageNotFound')}</div>
        ) : (
          <img
            src={imageSrc}
            alt={label}
            loading="lazy"
            decoding="async"
            onError={() => setImageError(true)}
          />
        )}
      </div>
      <div className="picker-card-title">{label}</div>
    </motion.button>
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


export function ProductsAndServices() {
  const [searchParams] = useSearchParams();
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'id';
  const { categories: productCategories } = useProductCatalog(currentLang);
  const navigate = useNavigate();
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

  const mainCategories: { id: MainCategory; label: string; image: string }[] = [
    { id: 'gas', label: t('products.mainCategories.gas'), image: MAIN_CATEGORY_IMAGES.gas },
    { id: 'package', label: t('products.mainCategories.package'), image: MAIN_CATEGORY_IMAGES.package },
    { id: 'services', label: t('products.mainCategories.services'), image: MAIN_CATEGORY_IMAGES.services },
  ];

  const goToCategory = (category: MainCategory) => {
    navigate(`/${currentLang}?category=${category}#products`);
  };

  const goToSubCategory = (subCatId: string) => {
    navigate(`/${currentLang}?category=gas&subcategory=${encodeURIComponent(subCatId)}#products`);
  };

  const goBackToHub = () => navigate(`/${currentLang}#products`);
  const goBackToSubcategories = () => navigate(`/${currentLang}?category=gas#products`);

  const getGasSubCategories = () => {
    const categories = productCategories.gas as Record<string, SubCategory>;
    if (!categories) return [];

    const subs = Object.keys(categories)
      // "Related Equipment" categories are folded into a single virtual card below.
      .filter(key => !isRelatedEquipmentSlug(key))
      .map(key => ({
        id: key,
        title: categories[key]?.title || '',
        // Representative thumbnail: the first product's own image, so the
        // card never needs a hand-picked or dummy asset.
        image: categories[key]?.products?.[0]?.image
      }));

    // Gas exposes CMS "equipment" products as a virtual "Related Equipment" sub-category.
    const equipmentProducts = getRelatedEquipmentProducts(productCategories);
    if (equipmentProducts.length > 0) {
      subs.push({
        id: RELATED_EQUIPMENT_ID,
        title: t('products.subCategories.relatedEquipment'),
        image: equipmentProducts[0]?.image
      });
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

  const productHref = (productId: string) =>
    `/${currentLang}/produk/detail?id=${productId}`;

  // Label for the currently open sub-category/grid, used by both the
  // breadcrumb's last crumb and the grid heading.
  const currentListingLabel = (() => {
    if (!mainCategory) return '';
    if (mainCategory === 'gas') {
      if (subCategory === RELATED_EQUIPMENT_ID) return t('products.subCategories.relatedEquipment');
      return getGasSubCategories().find(s => s.id === subCategory)?.title || t('products.mainCategories.gas');
    }
    return t(`products.mainCategories.${mainCategory}`);
  })();

  const rootCrumb = { label: t('products.pageHeader.badge'), onClick: goBackToHub };

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

          <AnimatePresence mode="wait">

            {/* Step 1: pick a main category */}
            {step === 'hub' && (
              <motion.div key="hub" initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div className="picker-grid" variants={staggerContainer}>
                  {mainCategories.map((category) => (
                    <PickerCard
                      key={category.id}
                      label={category.label}
                      imageSrc={category.image}
                      onClick={() => goToCategory(category.id)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 2 (Produk Gas only): pick a sub-category */}
            {step === 'subcategory' && (
              <motion.div key="subcategory" initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div variants={fadeUp}>
                  <Breadcrumb items={[rootCrumb, { label: t('products.mainCategories.gas') }]} />
                  <button onClick={goBackToHub} className="products-tab" aria-label={t('products.nav.backToCategories')} style={{ marginBottom: '20px' }}>
                    ← {t('products.nav.backToCategories')}
                  </button>
                </motion.div>
                <motion.div className="picker-grid picker-grid--sub" variants={staggerContainer}>
                  {getGasSubCategories().map((subCat) => (
                    <PickerCard
                      key={subCat.id}
                      label={subCat.title}
                      imageSrc={subCat.image ? getImageUrl(subCat.image) : undefined}
                      onClick={() => goToSubCategory(subCat.id)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: compact product/service grid */}
            {step === 'grid' && (
              <motion.div key={`grid-${mainCategory}-${subCategory}`} initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div variants={fadeUp}>
                  <Breadcrumb
                    items={
                      mainCategory === 'gas'
                        ? [rootCrumb, { label: t('products.mainCategories.gas'), onClick: goBackToSubcategories }, { label: currentListingLabel }]
                        : [rootCrumb, { label: currentListingLabel }]
                    }
                  />
                  <button
                    onClick={mainCategory === 'gas' ? goBackToSubcategories : goBackToHub}
                    className="products-tab"
                    aria-label={mainCategory === 'gas' ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
                    style={{ marginBottom: '20px' }}
                  >
                    ← {mainCategory === 'gas' ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
                  </button>
                </motion.div>
                <motion.div className="products-flow-heading" variants={fadeUp} style={{ marginBottom: '24px' }}>
                  <h2>{currentListingLabel}</h2>
                </motion.div>
                <motion.div className="products-grid-compact" variants={gridStagger}>
                  {getCurrentProducts().map((product) => (
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
            const base = productHref(variant.id);
            navigate(variant.size ? `${base}&size=${encodeURIComponent(variant.size)}` : base);
          }}
          onClose={() => setCradleVariants(null)}
        />
      )}
    </div>
  );
}
