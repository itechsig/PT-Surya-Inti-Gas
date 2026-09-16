import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "motion/react";
import '../../styles/ProductsAndServices.css';
import { useProductDetail } from "../../hooks/useProductDetail";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import type { Product, SubCategory } from "../../data/products";
import { getImageUrl, IMAGE_PLACEHOLDER } from "../../utils/imageUrl";
import { trackProductInteraction } from "../../utils/productTracking";
import { collapseCradleVariants } from "../../utils/cradleVariants";
import { RELATED_EQUIPMENT_ID } from "../../utils/relatedEquipment";
import { Seo } from "./Seo";
import { EQUIPMENT_CATALOGS } from "../../data/equipmentCatalogs";
import { catalogItemTitle } from "../../data/catalogTypes";

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

/** Liquid gas (Gas Cair) products only ship in packaging suited for liquefied gas. */
const LIQUID_PACKAGING_IDS = ['cryogenic-dewars', 'vessel-gas-liquid', 'microbulk-tank', 'vertical-storage-tank'];
const LIQUID_SUBCATEGORY_SLUG = 'liquid';

/** Industrial & Medical / Speciality & Mixed gases only ship in cylinders or cradles. */
const STANDARD_PACKAGING_IDS = ['cylinder', 'cradle'];
const STANDARD_SUBCATEGORY_SLUGS = ['industrial-medical', 'speciality-mixed'];

export function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const productSlug = searchParams.get('id');
  const selectedSize = searchParams.get('size');
  const { data: productData, isLoading } = useProductDetail(productSlug, currentLang);
  const { categories: productCategories } = useProductCatalog(currentLang);
  const [imageError, setImageError] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // Valve/Regulator/Instrumen Medis: the jenis + tipe were already picked in the grid
  // (RelatedEquipmentExplorer) before navigating here, so the selection is just read
  // back from the URL instead of tracked in local state.
  const catalogEntry = productData && productData.mainCategory === 'equipment'
    ? EQUIPMENT_CATALOGS[productData.product.id]
    : null;
  const isCatalogEquipment = !!catalogEntry;
  const resolvedJenis = catalogEntry?.categories.find((c) => c.id === searchParams.get('jenis')) || null;
  const resolvedTipe = resolvedJenis?.items.find((i) => i.id === searchParams.get('tipe')) || null;

  const handleBack = () => {
    if (!productData) {
      navigate(`/${currentLang}/produk`);
      return;
    }

    const { mainCategory, subCategory } = productData;

    // Equipment products are surfaced as a virtual "Related Equipment" sub-tab under Gas.
    // Valve/Regulator/Instrumen Medis carry the jenis picked back along, so the grid
    // reopens straight at the tipe list instead of the top-level equipment picker.
    if (mainCategory === 'equipment') {
      const back = isCatalogEquipment && resolvedJenis
        ? `/${currentLang}/produk?category=gas&subcategory=${RELATED_EQUIPMENT_ID}&equipment=${productData.product.id}&jenis=${resolvedJenis.id}`
        : `/${currentLang}/produk?category=gas&subcategory=${RELATED_EQUIPMENT_ID}`;
      navigate(back);
      return;
    }

    // Package has no sub-category tabs, so just land back on the package tab.
    if (mainCategory === 'package' || !subCategory) {
      navigate(`/${currentLang}/produk?category=${mainCategory}`);
      return;
    }

    navigate(`/${currentLang}/produk?category=${mainCategory}&subcategory=${encodeURIComponent(subCategory)}`);
  };

  const getPackagingOptions = () => {
    const packageCategories = productCategories.package as Record<string, SubCategory> | undefined;
    const allProducts: Product[] = [];
    
    // Get all products from the main Package category (same as Product.tsx)
    if (packageCategories) {
      Object.values(packageCategories).forEach(subCategory => {
        if (subCategory?.products) {
          allProducts.push(...subCategory.products);
        }
      });
    }

    // Collapse the Cradle size variants into a single "Cradle" option (same as Product.tsx).
    const collapsed = collapseCradleVariants(allProducts, t);

    // Match by the category's stable slug, not its (admin-editable, per-language) display
    // title — comparing against a translated title silently breaks the moment anyone
    // renames the category in the CMS.
    // Gas Cair (liquid gas) only ships in packaging suited for liquefied gas.
    if (productData?.subCategory === LIQUID_SUBCATEGORY_SLUG) {
      return collapsed.filter(p => LIQUID_PACKAGING_IDS.includes(p.id));
    }

    // Industrial & Medical / Speciality & Mixed gases only ship in cylinders or cradles.
    if (productData?.subCategory && STANDARD_SUBCATEGORY_SLUGS.includes(productData.subCategory)) {
      return collapsed.filter(p => STANDARD_PACKAGING_IDS.includes(p.id));
    }

    return collapsed;
  };

  const handleContactSales = (productTitle: string) => {
    const whatsappNumber = '6281233906378';
    let message = t('productDetail.contact.whatsappMessage', { title: productTitle });

    // Add selected packaging information if available
    if (selectedPackaging && productData?.mainCategory === 'gas') {
      const packagingLabel = t(`products.items.${selectedPackaging}.title`);
      message += `\n${t('productDetail.contact.selectedPackaging')}: ${packagingLabel}`;
    }

    // Add the jenis + tipe picked before navigating here (Valve/Regulator/Instrumen Medis).
    if (resolvedJenis && resolvedTipe) {
      message += `\n${t('productDetail.contact.selectedType')}: ${resolvedJenis.name}`;
      message += `\n${t('productDetail.contact.selectedItem')}: ${catalogItemTitle(resolvedTipe)}`;
    }

    // Add the cradle size the visitor picked from the size picker.
    if (selectedSize) {
      message += `\n${t('productDetail.selectedSize')}: ${selectedSize}`;
    }

    if (productData?.product.id) {
      trackProductInteraction(productData.product.id, 'whatsapp_click');
    }

    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (!productSlug) {
      navigate(`/${currentLang}/produk`);
    }
  }, [productSlug, navigate, currentLang]);

  useEffect(() => {
    if (productData?.product.id) {
      trackProductInteraction(productData.product.id, 'view');
    }
  }, [productData?.product.id]);

  useEffect(() => {
    setCurrentSlide(0);
    setImageError(false);
  }, [productData?.product.id]);

  // Valve/Regulator/Instrumen Medis are only reachable this way with a jenis + tipe
  // already picked in the grid — a direct/stale link without both just bounces back
  // to the Related Equipment grid to pick again.
  useEffect(() => {
    if (isCatalogEquipment && !(resolvedJenis && resolvedTipe)) {
      navigate(`/${currentLang}/produk?category=gas&subcategory=${RELATED_EQUIPMENT_ID}`);
    }
  }, [isCatalogEquipment, resolvedJenis, resolvedTipe, navigate, currentLang]);

  if (isLoading) {
    return (
      <div className="products-corporate">
        <section className="products-section" id="products">
          <div className="products-container">
            <div className="products-header">
              <h1 className="products-title">{t('common.loading')}</h1>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!productData) {
    return (
      <div className="products-corporate">
        <section className="products-section" id="products">
          <div className="products-container">
            <div className="products-header">
              <h1 className="products-title">{t('productDetail.notFoundTitle')}</h1>
              <button onClick={handleBack} className="products-tab" aria-label={t('productDetail.backAria')}>
                {t('productDetail.backToList')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { product, mainCategory, subCategoryTitle } = productData;
  const categoryLabel = t(`products.mainCategories.${mainCategory}`);
  const subCategoryLabel = subCategoryTitle || null;

  // Only the delivery service gets a photo slider — every other product keeps a single image.
  const isDeliveryService = product.id === 'delivery';
  const deliveryPhotos = isDeliveryService
    ? Array.from(new Set([product.image, ...(product.gallery || [])].filter(Boolean)))
    : [];
  const hasDeliverySlider = isDeliveryService && deliveryPhotos.length > 1;

  return (
    <div className="products-corporate">
      <Seo
        title={t('seo.productDetail.title', { name: product.title })}
        description={t('seo.productDetail.description', { name: product.title })}
        segment="produk/detail"
        query={productSlug ? `?id=${productSlug}` : ''}
        image={getImageUrl(product.image) || '/office-optimized.jpg'}
        type="article"
      />
      <section className="products-section products-section--detail" id="products" style={{
        paddingTop: '0'
      }}>

        {/* Corporate Header */}
        <motion.div
          className="products-header"
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
          style={{
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
            <h1 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              {product.title}
            </h1>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {subCategoryLabel ? `${categoryLabel} / ${subCategoryLabel}` : categoryLabel}
              {selectedSize ? ` · ${selectedSize}` : ''}
            </p>
          </div>
        </motion.div>

        <div className="products-container">
          {/* Back Button */}
          <button
            onClick={handleBack}
            className="products-tab"
            style={{ marginBottom: '20px' }}
            aria-label={isCatalogEquipment ? t('productDetail.backToTipeAria') : t('productDetail.backAria')}
          >
            ← {isCatalogEquipment ? t('productDetail.backToTipeList') : t('productDetail.backToList')}
          </button>

          {/* Product Detail */}
          <motion.div
            className="products-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="products-detail-image">
              {hasDeliverySlider ? (
                <div className="product-image-slider">
                  <div
                    className="product-image-slider-track"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                  >
                    {deliveryPhotos.map((photo, i) => (
                      <div className="product-image-slider-slide" key={photo + i}>
                        <img
                          src={getImageUrl(photo)}
                          alt={`${product.title} ${i + 1}`}
                          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                        />
                      </div>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="product-image-slider-arrow product-image-slider-arrow--prev"
                    onClick={() => setCurrentSlide((prev) => (prev - 1 + deliveryPhotos.length) % deliveryPhotos.length)}
                    aria-label={t('productDetail.gallery.prevAria')}
                  >
                    ‹
                  </button>
                  <button
                    type="button"
                    className="product-image-slider-arrow product-image-slider-arrow--next"
                    onClick={() => setCurrentSlide((prev) => (prev + 1) % deliveryPhotos.length)}
                    aria-label={t('productDetail.gallery.nextAria')}
                  >
                    ›
                  </button>

                  <div className="product-image-slider-dots">
                    {deliveryPhotos.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        className={`product-image-slider-dot ${i === currentSlide ? 'active' : ''}`}
                        onClick={() => setCurrentSlide(i)}
                        aria-label={t('productDetail.gallery.goToAria', { index: i + 1 })}
                      />
                    ))}
                  </div>
                </div>
              ) : imageError ? (
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
                  {t('common.imageNotFound')}
                </div>
              ) : (
                <img
                  src={getImageUrl(product.image)}
                  alt={product.title}
                  onError={() => setImageError(true)}
                  style={{ width: '100%', height: 'auto', objectFit: 'contain' }}
                />
              )}
            </div>

            <motion.div
              className="products-detail-content"
              initial="hidden"
              animate="show"
              variants={staggerContainer}
            >
              <motion.p className="products-detail-description" variants={fadeUp}>
                {isCatalogEquipment ? resolvedJenis?.description : (product.fullDescription || product.description)}
              </motion.p>

              {/* Size chosen from the Cradle size picker */}
              {selectedSize && (
                <motion.div className="products-detail-size" variants={fadeUp}>
                  <span className="products-detail-size-label">{t('productDetail.selectedSize')}</span>
                  <span className="products-detail-size-value">{selectedSize}</span>
                </motion.div>
              )}

              {selectedSize && (
                <motion.div className="product-contact" variants={fadeUp}>
                  <h3>{t('productDetail.contact.title')}</h3>
                  <p>{t('productDetail.contact.description')}</p>
                  <button className="contact-button" onClick={() => handleContactSales(product.title)}>
                    {t('productDetail.contact.button')}
                  </button>
                </motion.div>
              )}

              {/* Tipe specs, for Valve/Regulator/Instrumen Medis — jenis + tipe were already
                  picked in the Related Equipment grid before landing on this page. */}
              {isCatalogEquipment && resolvedJenis && resolvedTipe && (
                <motion.div className="products-detail-info" variants={fadeUp}>
                  <h3>Spesifikasi</h3>
                  <div className="product-specifications">
                    {resolvedTipe.brand && (
                      <div className="spec-item">
                        <span className="spec-label">Merek</span>
                        <span className="spec-value">{resolvedTipe.brand}</span>
                      </div>
                    )}
                    {resolvedTipe.model && (
                      <div className="spec-item">
                        <span className="spec-label">Model</span>
                        <span className="spec-value">{resolvedTipe.model}</span>
                      </div>
                    )}
                    {resolvedTipe.connection && (
                      <div className="spec-item">
                        <span className="spec-label">Koneksi</span>
                        <span className="spec-value">{resolvedTipe.connection}</span>
                      </div>
                    )}
                    {resolvedTipe.pressure && (
                      <div className="spec-item">
                        <span className="spec-label">Tekanan Kerja</span>
                        <span className="spec-value">{resolvedTipe.pressure}</span>
                      </div>
                    )}
                    {resolvedTipe.material && (
                      <div className="spec-item">
                        <span className="spec-label">Material</span>
                        <span className="spec-value">{resolvedTipe.material}</span>
                      </div>
                    )}
                    {resolvedTipe.condition && (
                      <div className="spec-item">
                        <span className="spec-label">Kondisi</span>
                        <span className="spec-value">{resolvedTipe.condition}</span>
                      </div>
                    )}
                  </div>
                  {catalogEntry?.legend && catalogEntry.legend.length > 0 && (
                    <p className="catalog-explorer-legend">
                      {catalogEntry.legend.map((entry) => `${entry.code}: ${entry.label}`).join(" · ")}
                    </p>
                  )}
                </motion.div>
              )}

              {/* WhatsApp Contact Button for equipment products (Valve/Regulator/Instrumen
                  Medis included — by the time this page renders, a tipe is always picked). */}
              {productData?.mainCategory === 'equipment' && (
                <motion.div className="product-contact" variants={fadeUp}>
                  <h3>{t('productDetail.contact.title')}</h3>
                  <p>{t('productDetail.contact.description')}</p>
                  <button className="contact-button" onClick={() => handleContactSales(product.title)}>
                    {t('productDetail.contact.button')}
                  </button>
                </motion.div>
              )}

              {/* Product Information and Applications Only for Gas Products */}
              {productData?.mainCategory === 'gas' && (
                <>
                  <motion.div className="products-detail-info" variants={fadeUp}>
                    <h2>{t('productDetail.info.title')}</h2>
                    <motion.div className="product-specifications" variants={staggerContainer}>
                      <motion.div className="spec-item" variants={fadeUp}>
                        <span className="spec-label">{t('productDetail.info.productId')}</span>
                        <span className="spec-value">{product.id}</span>
                      </motion.div>
                      <motion.div className="spec-item" variants={fadeUp}>
                        <span className="spec-label">{t('productDetail.info.category')}</span>
                        <span className="spec-value">{categoryLabel}</span>
                      </motion.div>
                      {subCategoryLabel && (
                        <motion.div className="spec-item" variants={fadeUp}>
                          <span className="spec-label">{t('productDetail.info.subCategory')}</span>
                          <span className="spec-value">{subCategoryLabel}</span>
                        </motion.div>
                      )}
                      <motion.div className="spec-item" variants={fadeUp}>
                        <span className="spec-label">{t('productDetail.info.availability')}</span>
                        <span className="spec-value available">{t('productDetail.info.available')}</span>
                      </motion.div>
                      <motion.div className="spec-item" variants={fadeUp}>
                        <span className="spec-label">{t('productDetail.info.quality')}</span>
                        <span className="spec-value">{t('productDetail.info.qualityValue')}</span>
                      </motion.div>
                      <motion.div className="spec-item" variants={fadeUp}>
                        <span className="spec-label">{t('productDetail.info.shipping')}</span>
                        <span className="spec-value">{t('productDetail.info.shippingValue')}</span>
                      </motion.div>
                    </motion.div>

                    <div className="product-applications">
                      <h3>{t('productDetail.applications.title')}</h3>
                      <motion.ul variants={staggerContainer} initial="hidden" whileInView="show" viewport={{ once: true, margin: "-40px" }}>
                        {(t('productDetail.applications.items', { returnObjects: true }) as string[]).map((item, i) => (
                          <motion.li key={i} variants={fadeUp}>{item}</motion.li>
                        ))}
                      </motion.ul>
                    </div>
                  </motion.div>

                  {/* Packaging Selection for Gas Products (Gas Cair only offers liquid-suited packaging) */}
                  <motion.div className="product-packaging" variants={fadeUp}>
                    <h3>{t('productDetail.packaging.title')}</h3>
                    <p>{t('productDetail.packaging.description')}</p>
                    <motion.div
                      className="packaging-options"
                      variants={staggerContainer}
                      initial="hidden"
                      whileInView="show"
                      viewport={{ once: true, margin: "-40px" }}
                    >
                      {getPackagingOptions().map((packaging: Product) => (
                        <motion.button
                          key={packaging.id}
                          className={`packaging-option ${selectedPackaging === packaging.id ? 'selected' : ''}`}
                          onClick={() => setSelectedPackaging(selectedPackaging === packaging.id ? null : packaging.id)}
                          aria-label={t('productDetail.packaging.selectAria', { packaging: packaging.title })}
                          aria-pressed={selectedPackaging === packaging.id}
                          variants={fadeUp}
                          whileHover={{ y: -2 }}
                          whileTap={{ scale: 0.97 }}
                        >
                          <div className="packaging-option-image">
                            <img
                              src={getImageUrl(packaging.image)}
                              alt={packaging.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="packaging-option-title">{packaging.title}</span>
                        </motion.button>
                      ))}
                    </motion.div>
                  </motion.div>

                  {/* WhatsApp Contact Button Only for Gas Products */}
                  <motion.div className="product-contact" variants={fadeUp}>
                    <h3>{t('productDetail.contact.title')}</h3>
                    <p>{t('productDetail.contact.description')}</p>
                    <button className="contact-button" onClick={() => handleContactSales(product.title)}>
                      {t('productDetail.contact.button')}
                    </button>
                  </motion.div>
                </>
              )}
            </motion.div>
          </motion.div>
        </div>

      </section>
    </div>
  );
}
