import { Link, useNavigate, useSearchParams, useParams } from "react-router-dom";
import { Fragment, useState } from "react";
import { useTranslation } from "react-i18next";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ChevronRight, Droplets, Package, Wrench, Syringe, Droplet, Cog, Layers } from "lucide-react";
import '../../styles/ProductsAndServices.css';
import { Seo } from "./Seo";
import { mainCategoryIds, type Product, type ProductVariant, type SubCategory, type MainCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { useCategoryPhotos } from "../../hooks/useCategoryPhotos";
import { getImageUrl } from "../../utils/imageUrl";
import { collapseCradleVariants } from "../../utils/cradleVariants";
import { CradleSizeDialog } from "./CradleSizeDialog";
import { RelatedEquipmentExplorer } from "./RelatedEquipmentExplorer";
import { getRelatedEquipmentProducts, isRelatedEquipmentSlug, RELATED_EQUIPMENT_ID } from "../../utils/relatedEquipment";

const MotionLink = motion.create(Link);

/* ═══════════════════════════════════════════════════════════════
   PRODUCT.TSX — PT Surya Inti Gas Corporate

   Flow: pick a main category (Produk Gas / Kemasan / Layanan) → for
   Produk Gas only, pick a sub-category → compact product/service grid.
   The whole flow is driven by the `category`/`subcategory` URL query
   params so the browser back button and the in-page "Kembali" button
   always agree on where the previous step is.
══════════════════════════════════════════════════════════════ */

/** Icons for the 3 main categories. */
const MAIN_CATEGORY_ICONS: Record<MainCategory, any> = {
  gas: Droplets,
  package: Package,
  services: Wrench,
  equipment: Cog,
};

/** Virtual sub-category id: "Gas Industri & Medis" and "Gas Spesial & Campuran" are
 *  merged into a single picker card, which then lists both as separate headed
 *  sections on the grid step below. */
const INDUSTRIAL_SPECIALITY_SUBCATEGORY_ID = 'industrial-medical-speciality';

/** Main categories that need an explicit sub-category pick before the product
 *  grid (Produk Gas and Kemasan). Layanan has only one bucket, so it skips
 *  straight to the grid. */
const CATEGORIES_WITH_SUBCATEGORY_STEP: MainCategory[] = ['gas', 'package'];

/** Kemasan has no CMS sub-categories of its own (every product sits in one flat
 *  "package" bucket), so its product groups — and which products belong to
 *  each — are defined here by product slug, keyed by virtual sub-category id. */
const PACKAGE_SUBCATEGORY_GROUPS: Record<string, string[]> = {
  'package-gas': ['cylinder', 'tabung-medis', 'tabung-asitilin'],
  'package-liquid': ['cryogenic-dewars', 'vessel-gas-liquid', 'microbulk-tank', 'vertical-storage-tank', 'iso-tank', 'rigid-tank'],
  'package-cylinder': ['cradle', 'cradle-2x2', 'cradle-3x2', 'cradle-3x3', 'cradle-4x4'],
};
const PACKAGE_SUBCATEGORY_TITLE_KEYS: Record<string, string> = {
  'package-gas': 'header.megaMenu.packagePureGas',
  'package-liquid': 'header.megaMenu.packageLiquid',
  'package-cylinder': 'header.megaMenu.packageCylinder',
};

/** Virtual sub-category id: "Kemasan Gas Murni" and "Kemasan Gas Cair" are merged
 *  into a single picker card, which then lists both as separate headed sections on
 *  the grid step (same pattern as INDUSTRIAL_SPECIALITY_SUBCATEGORY_ID). */
const PACKAGE_GAS_LIQUID_SUBCATEGORY_ID = 'package-gas-liquid';
const PACKAGE_GAS_LIQUID_SECTIONS = ['package-gas', 'package-liquid'];

/** Kemasan's picker cards, in display order. */
const PACKAGE_PICKER_CARDS: { id: string; titleKey: string; groups: string[] }[] = [
  { id: PACKAGE_GAS_LIQUID_SUBCATEGORY_ID, titleKey: 'header.megaMenu.packageGasLiquid', groups: PACKAGE_GAS_LIQUID_SECTIONS },
  { id: 'package-cylinder', titleKey: 'header.megaMenu.packageCylinder', groups: ['package-cylinder'] },
];

/** Icons for the "Produk Gas" / "Kemasan" sub-categories, keyed by their stable
 *  CMS slug (or virtual id for merged/synthetic sub-categories). */
const SUB_CATEGORY_ICONS: Record<string, any> = {
  [INDUSTRIAL_SPECIALITY_SUBCATEGORY_ID]: Syringe,
  'liquid': Droplet,
  [RELATED_EQUIPMENT_ID]: Cog,
  [PACKAGE_GAS_LIQUID_SUBCATEGORY_ID]: Package,
  'package-cylinder': Layers,
};

/** category_photos lookup keys (see Backend's create_category_photos_table migration) —
 *  admin-uploadable photos shown instead of the icons above whenever one has been set.
 *  The merged Kemasan Gas Murni & Gas Cair card reuses the existing 'sub-package-gas' row. */
const SUB_CATEGORY_PHOTO_KEY_OVERRIDES: Record<string, string> = {
  [PACKAGE_GAS_LIQUID_SUBCATEGORY_ID]: 'sub-package-gas',
};
const mainCategoryPhotoKey = (category: MainCategory) => `main-${category}`;
const subCategoryPhotoKey = (subCategoryId: string) => SUB_CATEGORY_PHOTO_KEY_OVERRIDES[subCategoryId] ?? `sub-${subCategoryId}`;

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

// Picker Card — full-bleed photo with overlaid title (when the admin has uploaded one for
// this category/sub-category) or a plain icon + title card fallback — used for both the main-category hub and the
// Produk Gas/Kemasan sub-category step.
function PickerCard({ label, icon: Icon, image, onClick }: { label: string; icon: any; image?: string | null; onClick: () => void }) {
  const motionProps = {
    type: "button" as const,
    onClick,
    variants: fadeUp,
    whileHover: { y: -4 },
    transition: { duration: 0.25, ease: [0.4, 0, 0.2, 1] as [number, number, number, number] },
  };

  // No white card chrome — the photo is the card, with the title overlaid
  // bottom-left and a chevron bottom-right. Without an uploaded photo, a brand
  // gradient with a large faded icon stands in for it.
  return (
    <motion.button className="picker-card picker-card--photo" aria-label={label} {...motionProps}>
      {image ? (
        <div className="picker-card-photo" style={{ backgroundImage: `url(${getImageUrl(image)})` }} />
      ) : (
        <div className="picker-card-photo picker-card-photo--placeholder">
          <Icon size={72} strokeWidth={1.25} aria-hidden="true" />
        </div>
      )}
      <div className="picker-card-overlay">
        <span className="picker-card-title">{label}</span>
        <ChevronRight size={22} className="picker-card-chevron" aria-hidden="true" />
      </div>
    </motion.button>
  );
}

// Compact Product/Service Card — image + name only, used for the listing grid.
function CompactProductCard({ product, href, onVariantClick }: { product: Product; href: string; onVariantClick: (product: Product) => void }) {
  const isVariantGroup = !!product.variants?.length;

  const inner = (
    <>
      <div 
        className="products-card-compact-image"
        style={{
          backgroundImage: `url(${getImageUrl(product.image)})`
        }}
      />
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


export function Product() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const { categories: productCategories } = useProductCatalog(currentLang);
  const categoryPhotos = useCategoryPhotos();
  const [searchParams] = useSearchParams();
  const [cradleVariants, setCradleVariants] = useState<ProductVariant[] | null>(null);

  const categoryParam = searchParams.get('category');
  const subcategoryParam = searchParams.get('subcategory');

  const mainCategory: MainCategory | null =
    categoryParam && mainCategoryIds.includes(categoryParam as MainCategory)
      ? (categoryParam as MainCategory)
      : null;
  const subCategory = subcategoryParam || '';

  // Produk Gas and Kemasan need an explicit sub-category pick first; Layanan
  // has none, so landing on the main category is enough.
  const step: 'hub' | 'subcategory' | 'grid' =
    !mainCategory ? 'hub' : (CATEGORIES_WITH_SUBCATEGORY_STEP.includes(mainCategory) && !subCategory) ? 'subcategory' : 'grid';

  const mainCategories: { id: MainCategory; label: string; icon: any }[] = [
    { id: 'gas', label: t('products.mainCategories.gas'), icon: MAIN_CATEGORY_ICONS.gas },
    { id: 'package', label: t('products.mainCategories.package'), icon: MAIN_CATEGORY_ICONS.package },
    { id: 'services', label: t('products.mainCategories.services'), icon: MAIN_CATEGORY_ICONS.services },
  ];

  const goToCategory = (category: MainCategory) => {
    navigate(`/${currentLang}/produk?category=${category}`);
  };

  const goToSubCategory = (category: MainCategory, subCatId: string) => {
    navigate(`/${currentLang}/produk?category=${category}&subcategory=${encodeURIComponent(subCatId)}`);
  };

  const goBackToHub = () => navigate(`/${currentLang}/produk`);
  const goBackToSubcategories = () => navigate(`/${currentLang}/produk?category=${mainCategory ?? 'gas'}`);

  const getGasSubCategories = () => {
    const categories = productCategories.gas as Record<string, SubCategory>;
    if (!categories) return [];

    const subs: { id: string; title: string }[] = [];
    let addedIndustrialSpeciality = false;

    Object.keys(categories)
      // "Related Equipment" categories are folded into a single virtual card below.
      .filter(key => !isRelatedEquipmentSlug(key))
      .forEach(key => {
        // "Gas Industri & Medis" and "Gas Spesial & Campuran" are folded into a
        // single virtual card; picking it reveals both as separate sections.
        if (key === 'industrial-medical' || key === 'speciality-mixed') {
          if (!addedIndustrialSpeciality) {
            subs.push({ id: INDUSTRIAL_SPECIALITY_SUBCATEGORY_ID, title: t('products.subCategories.industrialMedicalSpeciality') });
            addedIndustrialSpeciality = true;
          }
          return;
        }
        subs.push({ id: key, title: categories[key]?.title || '' });
      });

    // Gas exposes CMS "equipment" products as a virtual "Related Equipment" sub-category.
    // Hidden for now — uncomment to show the "Peralatan Pendukung Gas Industri" card again.
    // if (getRelatedEquipmentProducts(productCategories).length > 0) {
    //   subs.push({ id: RELATED_EQUIPMENT_ID, title: t('products.subCategories.relatedEquipment') });
    // }

    return subs;
  };

  // Kemasan has no CMS sub-categories of its own — every product sits in one flat
  // "package" bucket — so build the flat, cradle-collapsed product list once and
  // reuse it both to build the sub-category cards below and to filter each
  // group's grid in getCurrentProducts.
  const getAllPackageProducts = (): Product[] => {
    const categories = productCategories.package as Record<string, SubCategory> | undefined;
    if (!categories) return [];
    const allProducts: Product[] = [];
    Object.values(categories).forEach(sub => {
      if (sub?.products) allProducts.push(...sub.products);
    });
    // Collapse the Cradle size variants into a single card (sizes shown on click).
    return collapseCradleVariants(allProducts, t);
  };

  // Products of one Kemasan group, in the slug order defined above.
  const getPackageGroupProducts = (groupId: string, bySlug: Map<string, Product>): Product[] =>
    (PACKAGE_SUBCATEGORY_GROUPS[groupId] ?? []).map(slug => bySlug.get(slug)).filter((p): p is Product => !!p);

  // Kemasan's sub-category cards, hidden individually if the CMS doesn't (yet)
  // have any product matching that card's group slugs.
  const getPackageSubCategories = () => {
    const bySlug = new Map(getAllPackageProducts().map(p => [p.id, p]));
    return PACKAGE_PICKER_CARDS
      .filter(card => card.groups.some(groupId => getPackageGroupProducts(groupId, bySlug).length > 0))
      .map(card => ({ id: card.id, title: t(card.titleKey) }));
  };

  // The merged "Kemasan Gas Murni & Gas Cair" card expands into these two
  // separately headed sections, each hidden if the CMS has no products for it.
  const getPackageGasLiquidGroups = () => {
    const bySlug = new Map(getAllPackageProducts().map(p => [p.id, p]));
    return PACKAGE_GAS_LIQUID_SECTIONS
      .map(id => ({ id, title: t(PACKAGE_SUBCATEGORY_TITLE_KEYS[id]), products: getPackageGroupProducts(id, bySlug) }))
      .filter(group => group.products.length > 0);
  };

  // The merged "Gas Industri, Medis & Spesial" card expands into these two
  // separately headed sections, each hidden if the CMS has no products for it.
  const getIndustrialMedicalSpecialityGroups = () => {
    const categories = productCategories.gas as Record<string, SubCategory> | undefined;
    if (!categories) return [];

    return [
      { id: 'industrial-medical', title: categories['industrial-medical']?.title || '', products: categories['industrial-medical']?.products ?? [] },
      { id: 'speciality-mixed', title: categories['speciality-mixed']?.title || '', products: categories['speciality-mixed']?.products ?? [] },
    ].filter(group => group.products.length > 0);
  };

  const getCurrentProducts = (): Product[] => {
    if (!mainCategory) return [];

    // Kemasan: filtered by the chosen virtual sub-category's product slugs.
    if (mainCategory === 'package') {
      const bySlug = new Map(getAllPackageProducts().map(p => [p.id, p]));
      return getPackageGroupProducts(subCategory, bySlug);
    }

    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    if (!categories) return [];

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

  // Label for the currently open sub-category/grid, used by both the
  // breadcrumb's last crumb and the grid heading.
  const currentListingLabel = (() => {
    if (!mainCategory) return '';
    if (mainCategory === 'gas') {
      if (subCategory === RELATED_EQUIPMENT_ID) return t('products.subCategories.relatedEquipment');
      const pickerLabel = getGasSubCategories().find(s => s.id === subCategory)?.title;
      if (pickerLabel) return pickerLabel;
      // Direct links to the raw 'industrial-medical'/'speciality-mixed' slugs (e.g. a
      // product detail page's "back" button) bypass the merged picker card above.
      const categories = productCategories.gas as Record<string, SubCategory> | undefined;
      return categories?.[subCategory]?.title || t('products.mainCategories.gas');
    }
    if (mainCategory === 'package') {
      const pickerLabel = getPackageSubCategories().find(s => s.id === subCategory)?.title;
      if (pickerLabel) return pickerLabel;
      // Direct links to the raw 'package-gas'/'package-liquid' groups bypass the merged picker card.
      const groupTitleKey = PACKAGE_SUBCATEGORY_TITLE_KEYS[subCategory];
      return groupTitleKey ? t(groupTitleKey) : t('products.mainCategories.package');
    }
    return t(`products.mainCategories.${mainCategory}`);
  })();

  const rootCrumb = { label: t('products.pageHeader.badge'), onClick: goBackToHub };

  // Merged picker cards render their groups as separately headed sections.
  const mergedSections =
    mainCategory === 'gas' && subCategory === INDUSTRIAL_SPECIALITY_SUBCATEGORY_ID ? getIndustrialMedicalSpecialityGroups()
    : mainCategory === 'package' && subCategory === PACKAGE_GAS_LIQUID_SUBCATEGORY_ID ? getPackageGasLiquidGroups()
    : null;

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
                <motion.div className="picker-grid" variants={staggerContainer}>
                  {mainCategories.map((category) => (
                    <PickerCard
                      key={category.id}
                      label={category.label}
                      icon={category.icon}
                      image={categoryPhotos[mainCategoryPhotoKey(category.id)]}
                      onClick={() => goToCategory(category.id)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 2 (Produk Gas and Kemasan): pick a sub-category */}
            {step === 'subcategory' && mainCategory && (
              <motion.div key="subcategory" initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                <motion.div variants={fadeUp}>
                  <Breadcrumb items={[rootCrumb, { label: t(`products.mainCategories.${mainCategory}`) }]} />
                  <button onClick={goBackToHub} className="products-tab" aria-label={t('products.nav.backToCategories')} style={{ marginBottom: '20px' }}>
                    ← {t('products.nav.backToCategories')}
                  </button>
                </motion.div>
                <motion.div className="products-flow-heading" variants={fadeUp}>
                  <h2>{t(`products.mainCategories.${mainCategory}`)}</h2>
                </motion.div>
                <motion.div className="picker-grid picker-grid--sub" variants={staggerContainer}>
                  {(mainCategory === 'package' ? getPackageSubCategories() : getGasSubCategories()).map((subCat) => (
                    <PickerCard
                      key={subCat.id}
                      label={subCat.title}
                      icon={SUB_CATEGORY_ICONS[subCat.id] || Layers}
                      image={categoryPhotos[subCategoryPhotoKey(subCat.id)]}
                      onClick={() => goToSubCategory(mainCategory, subCat.id)}
                    />
                  ))}
                </motion.div>
              </motion.div>
            )}

            {/* Step 3: compact product/service grid */}
            {step === 'grid' && (
              <motion.div key={`grid-${mainCategory}-${subCategory}`} initial="hidden" animate="show" exit={stepExit} variants={staggerContainer}>
                {mainCategory === 'gas' && subCategory === RELATED_EQUIPMENT_ID ? (
                  // Owns its own breadcrumb + back button + heading for every jenis/tipe
                  // level, folding in the crumbs up to here — so there's only ever one
                  // path and one back button, never a second one stacked underneath.
                  <motion.div variants={gridStagger}>
                    <RelatedEquipmentExplorer
                      products={getCurrentProducts()}
                      lang={currentLang}
                      parentCrumbs={[rootCrumb, { label: t('products.mainCategories.gas'), onClick: goBackToSubcategories }]}
                      parentLabel={currentListingLabel}
                      onBack={goBackToSubcategories}
                      backLabel={t('products.nav.backToSubcategories')}
                    />
                  </motion.div>
                ) : mainCategory && mergedSections ? (
                  // A merged card: one breadcrumb + back button, then its groups stacked as
                  // their own headed sections ("Gas Industri & Medis" / "Gas Spesial &
                  // Campuran", or "Kemasan Gas Murni" / "Kemasan Gas Cair").
                  <>
                    <motion.div variants={fadeUp}>
                      <Breadcrumb items={[rootCrumb, { label: t(`products.mainCategories.${mainCategory}`), onClick: goBackToSubcategories }, { label: currentListingLabel }]} />
                      <button
                        onClick={goBackToSubcategories}
                        className="products-tab"
                        aria-label={t('products.nav.backToSubcategories')}
                        style={{ marginBottom: '20px' }}
                      >
                        ← {t('products.nav.backToSubcategories')}
                      </button>
                    </motion.div>
                    {mergedSections.map((group) => (
                      <Fragment key={group.id}>
                        <motion.div className="products-flow-heading" variants={fadeUp} style={{ marginBottom: '24px' }}>
                          <h2>{group.title}</h2>
                        </motion.div>
                        <motion.div className="products-grid-compact" variants={gridStagger}>
                          {group.products.map((product: Product) => (
                            <CompactProductCard
                              key={product.id}
                              product={product}
                              href={productHref(product.id)}
                              onVariantClick={(p) => setCradleVariants(p.variants ?? null)}
                            />
                          ))}
                        </motion.div>
                      </Fragment>
                    ))}
                  </>
                ) : (
                  <>
                    <motion.div variants={fadeUp}>
                      <Breadcrumb
                        items={
                          mainCategory && CATEGORIES_WITH_SUBCATEGORY_STEP.includes(mainCategory)
                            ? [rootCrumb, { label: t(`products.mainCategories.${mainCategory}`), onClick: goBackToSubcategories }, { label: currentListingLabel }]
                            : [rootCrumb, { label: currentListingLabel }]
                        }
                      />
                      <button
                        onClick={mainCategory && CATEGORIES_WITH_SUBCATEGORY_STEP.includes(mainCategory) ? goBackToSubcategories : goBackToHub}
                        className="products-tab"
                        aria-label={mainCategory && CATEGORIES_WITH_SUBCATEGORY_STEP.includes(mainCategory) ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
                        style={{ marginBottom: '20px' }}
                      >
                        ← {mainCategory && CATEGORIES_WITH_SUBCATEGORY_STEP.includes(mainCategory) ? t('products.nav.backToSubcategories') : t('products.nav.backToCategories')}
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
                  </>
                )}
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
