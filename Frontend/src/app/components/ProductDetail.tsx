import { useSearchParams, useNavigate, useLocation, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../styles/ProductsAndServices.css';
import { getProductCategories, type Product, type SubCategory } from "../../data/products";

function findProductById(
  productCategories: ReturnType<typeof getProductCategories>,
  id: string
): { product: Product; category: string; subCategory: string } | null {
  for (const [mainCat, subCats] of Object.entries(productCategories)) {
    // Check if this is a direct SubCategory (package, services) or Record (gas)
    if (subCats && typeof subCats === 'object' && 'products' in subCats) {
      // Direct SubCategory (package, services)
      const product = (subCats as SubCategory).products.find((p: Product) => p.id === id);
      if (product) {
        return { product, category: mainCat, subCategory: mainCat };
      }
    } else {
      // Record with subcategories (gas)
      for (const [subCat, data] of Object.entries(subCats as Record<string, SubCategory>)) {
        const product = data.products.find((p: Product) => p.id === id);
        if (product) {
          return { product, category: mainCat, subCategory: subCat };
        }
      }
    }
  }
  return null;
}

export function ProductDetail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const productCategories = getProductCategories(t);
  const [productData, setProductData] = useState<{ product: Product; category: string; subCategory: string } | null>(null);
  const [imageError, setImageError] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedPackaging, setSelectedPackaging] = useState<string | null>(null);

  useEffect(() => {
    const productId = searchParams.get('id');
    if (productId) {
      const data = findProductById(productCategories, productId);
      setProductData(data);
    } else {
      setProductData(null);
    }
    setIsLoading(false);
  }, [location.search, lang]);

  const handleBack = () => {
    navigate(`/${currentLang}/produk`);
  };

  const getPackagingOptions = () => {
    const packageCategory = productCategories.package as SubCategory;
    return packageCategory?.products || [];
  };

  const handleContactSales = (productTitle: string) => {
    const whatsappNumber = '6281233906378';
    let message = t('productDetail.contact.whatsappMessage', { title: productTitle });
    
    // Add selected packaging information if available
    if (selectedPackaging && productData?.category === 'gas') {
      const packagingLabel = t(`products.items.${selectedPackaging}.title`);
      message += `\n${t('productDetail.contact.selectedPackaging')}: ${packagingLabel}`;
    }
    
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  useEffect(() => {
    const productId = searchParams.get('id');
    if (!productId) {
      navigate(`/${currentLang}/produk`);
    }
  }, [searchParams, navigate, currentLang]);

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
              {t('common.details')}
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
              {productData?.category === 'gas' && (
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
