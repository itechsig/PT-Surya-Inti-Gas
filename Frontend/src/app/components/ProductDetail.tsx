import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "motion/react";
import '../../styles/ProductsAndServices.css';
import { useProductDetail } from "../../hooks/useProductDetail";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import type { Product, SubCategory } from "../../data/products";
import { getImageUrl } from "../../utils/imageUrl";
import { trackProductInteraction } from "../../utils/productTracking";

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 24 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};

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

  const handleBack = () => {
    navigate(`/${currentLang}/produk`);
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
    
    return allProducts;
  };

  const handleContactSales = (productTitle: string) => {
    const whatsappNumber = '6281233906378';
    let message = t('productDetail.contact.whatsappMessage', { title: productTitle });

    // Add selected packaging information if available
    if (selectedPackaging && productData?.mainCategory === 'gas') {
      const packagingLabel = t(`products.items.${selectedPackaging}.title`);
      message += `\n${t('productDetail.contact.selectedPackaging')}: ${packagingLabel}`;
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

  return (
    <div className="products-corporate">
      <section className="products-section" id="products" style={{
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
          <button onClick={handleBack} className="products-tab" style={{ marginBottom: '20px' }} aria-label={t('productDetail.backAria')}>
            ← {t('productDetail.backToList')}
          </button>

          {/* Product Detail */}
          <motion.div
            className="products-detail"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.15, ease: [0.4, 0, 0.2, 1] }}
          >
            <div className="products-detail-image">
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
                {product.fullDescription || product.description}
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

                  {/* Packaging Selection for Gas Products */}
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
