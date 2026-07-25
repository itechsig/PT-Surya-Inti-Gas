import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../styles/ProductsAndServices.css';
import { useProductDetail } from "../../hooks/useProductDetail";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import type { Product, SubCategory } from "../../data/products";

export function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const productSlug = searchParams.get('id');
  const { data: productData, isLoading } = useProductDetail(productSlug, currentLang);
  const { categories: productCategories } = useProductCatalog(currentLang);
  const [imageError, setImageError] = useState(false);
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(null);

  const handleBack = () => {
    navigate(`/${currentLang}/produk`);
  };

  const getPackagingOptions = () => {
    const packageCategory = productCategories.equipment?.package as SubCategory | undefined;
    return packageCategory?.products || [];
  };

  const handleContactSales = (productTitle: string) => {
    const whatsappNumber = '6281233906378';
    let message = t('productDetail.contact.whatsappMessage', { title: productTitle });

    // Add selected packaging information if available
    if (selectedPackaging && productData?.mainCategory === 'gas') {
      const packagingLabel = t(`products.items.${selectedPackaging}.title`);
      message += `\n${t('productDetail.contact.selectedPackaging')}: ${packagingLabel}`;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    if (!productSlug) {
      navigate(`/${currentLang}/produk`);
    }
  }, [productSlug, navigate, currentLang]);

  if (isLoading) {
    return (
      <div className="products-corporate">
        <section className="products-section" id="products">
          <div className="products-container">
            <div className="products-header">
              <h2 className="products-title">{t('common.loading')}</h2>
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
              <h2 className="products-title">{t('productDetail.notFoundTitle')}</h2>
              <button onClick={handleBack} className="products-tab" aria-label={t('productDetail.backAria')}>
                {t('productDetail.backToList')}
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  const { product, category, subCategory } = productData;
  const categoryLabel = t(`products.mainCategories.${category}`);
  const subCategoryLabel = (subCategory && category === 'gas') ? t(`products.categories.${subCategory}`) : null;

  return (
    <div className="products-corporate">
      <section className="products-section" id="products" style={{
        paddingTop: '0'
      }}>

        {/* Corporate Header */}
        <div className="products-header" style={{
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
            <h2 className="products-title" style={{
              fontFamily: 'Barlow, system-ui, sans-serif',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              fontWeight: '800',
              lineHeight: '1.1',
              letterSpacing: '-0.02em',
              color: '#ffffff',
              margin: '0 0 24px'
            }}>
              {product.title}
            </h2>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {subCategoryLabel ? `${categoryLabel} / ${subCategoryLabel}` : categoryLabel}
            </p>
          </div>
        </div>

        <div className="products-container">
          {/* Back Button */}
          <button onClick={handleBack} className="products-tab" style={{ marginBottom: '20px' }} aria-label={t('productDetail.backAria')}>
            ← {t('productDetail.backToList')}
          </button>

          {/* Product Detail */}
          <div className="products-detail">
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
                  src={product.image}
                  alt={product.title}
                  onError={() => setImageError(true)}
                />
              )}
            </div>

            <div className="products-detail-content">
              <p className="products-detail-description">
                {product.fullDescription || product.description}
              </p>

              {/* Product Information and Applications Only for Gas Products */}
              {productData?.mainCategory === 'gas' && (
                <>
                  <div className="products-detail-info">
                    <h3>{t('productDetail.info.title')}</h3>
                    <div className="product-specifications">
                      <div className="spec-item">
                        <span className="spec-label">{t('productDetail.info.productId')}</span>
                        <span className="spec-value">{product.id}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t('productDetail.info.category')}</span>
                        <span className="spec-value">{categoryLabel}</span>
                      </div>
                      {subCategoryLabel && (
                        <div className="spec-item">
                          <span className="spec-label">{t('productDetail.info.subCategory')}</span>
                          <span className="spec-value">{subCategoryLabel}</span>
                        </div>
                      )}
                      <div className="spec-item">
                        <span className="spec-label">{t('productDetail.info.availability')}</span>
                        <span className="spec-value available">{t('productDetail.info.available')}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t('productDetail.info.quality')}</span>
                        <span className="spec-value">{t('productDetail.info.qualityValue')}</span>
                      </div>
                      <div className="spec-item">
                        <span className="spec-label">{t('productDetail.info.shipping')}</span>
                        <span className="spec-value">{t('productDetail.info.shippingValue')}</span>
                      </div>
                    </div>

                    <div className="product-applications">
                      <h4>{t('productDetail.applications.title')}</h4>
                      <ul>
                        {(t('productDetail.applications.items', { returnObjects: true }) as string[]).map((item, i) => (
                          <li key={i}>{item}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Packaging Selection for Gas Products */}
                  <div className="product-packaging">
                    <h4>{t('productDetail.packaging.title')}</h4>
                    <p>{t('productDetail.packaging.description')}</p>
                    <div className="packaging-options">
                      {getPackagingOptions().map((packaging: Product) => (
                        <button
                          key={packaging.id}
                          className={`packaging-option ${selectedPackaging === packaging.id ? 'selected' : ''}`}
                          onClick={() => setSelectedPackaging(selectedPackaging === packaging.id ? null : packaging.id)}
                          aria-label={t('productDetail.packaging.selectAria', { packaging: packaging.title })}
                          aria-pressed={selectedPackaging === packaging.id}
                        >
                          <div className="packaging-option-image">
                            <img
                              src={packaging.image}
                              alt={packaging.title}
                              onError={(e) => {
                                e.currentTarget.style.display = 'none';
                              }}
                            />
                          </div>
                          <span className="packaging-option-title">{packaging.title}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* WhatsApp Contact Button Only for Gas Products */}
                  <div className="product-contact">
                    <h4>{t('productDetail.contact.title')}</h4>
                    <p>{t('productDetail.contact.description')}</p>
                    <button className="contact-button" onClick={() => handleContactSales(product.title)}>
                      {t('productDetail.contact.button')}
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

      </section>
    </div>
  );
}
