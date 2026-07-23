import { useNavigate, useSearchParams, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import '../../styles/ProductsAndServices.css';
import { getProductCategories, mainCategoryIds, type Product, type SubCategory, type MainCategory } from "../../data/products";

/* ═══════════════════════════════════════════════════════════════
   PRODUCT.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

// Product Card Component
function ProductCard({ product, onClick }: { product: Product; onClick: (id: string) => void }) {
  const [imageError, setImageError] = useState(false);
  const { t } = useTranslation();

  return (
    <div
      className="products-card"
      onClick={() => onClick(product.id)}
    >
      <div className="products-card-image">
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
            loading="lazy"
            width="400"
            height="300"
            onError={() => setImageError(true)}
          />
        )}
      </div>

      <div className="products-card-content">
        <h3 className="products-card-title">
          {product.title}
        </h3>
        <p className="products-card-description">
          {product.description}
        </p>
      </div>
    </div>
  );
}


export function Product() {
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const productCategories = getProductCategories(t);
  const mainCategories: { id: MainCategory; label: string }[] = mainCategoryIds.map((id) => ({
    id,
    label: t(`products.mainCategories.${id}`),
  }));
  const [searchParams] = useSearchParams();
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('industrial-medical');

  // Handle URL parameters
  useEffect(() => {
    const categoryParam = searchParams.get('category');
    const subcategoryParam = searchParams.get('subcategory');
    
    if (categoryParam && (categoryParam === 'gas' || categoryParam === 'equipment')) {
      setMainCategory(categoryParam);
      if (subcategoryParam) {
        setSubCategory(subcategoryParam);
      } else {
        // Set default subcategory for the main category
        setSubCategory(categoryParam === 'gas' ? 'industrial-medical' : 'color-code');
      }
    }
  }, [searchParams]);

  const handleMainCategoryChange = (category: MainCategory) => {
    if (category === mainCategory) return;
    setMainCategory(category);
    // Set default subcategory for each main category
    const newSubCategory = category === 'gas' ? 'industrial-medical' : 'color-code';
    setSubCategory(newSubCategory);
  };

  const handleSubCategoryChange = (subCatId: string) => {
    if (subCatId === subCategory) return;
    setSubCategory(subCatId);
  };

  const getSubCategories = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    return Object.keys(categories).map(key => ({
      id: key,
      title: categories[key]?.title || ''
    }));
  };

  const getCurrentProducts = () => {
    const categories = productCategories[mainCategory] as Record<string, SubCategory>;
    const subCat = categories[subCategory];
    return subCat?.products || [];
  };

  const handleCardClick = (productId: string) => {
    navigate(`/${currentLang}/produk/detail?id=${productId}`);
  };

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
              {t('products.pageHeader.title')}
            </h2>
            <p className="products-subtitle" style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.5vw, 1.125rem)',
              lineHeight: '1.7',
              color: 'rgba(255, 255, 255, 0.7)',
              maxWidth: '800px',
              margin: '0 auto'
            }}>
              {t('products.pageHeader.subtitle')}
            </p>
          </div>
        </div>

        <div className="products-container">
          {/* Main Category Tabs */}
          <div className="products-tabs">
            {mainCategories.map((category) => (
              <button
                key={category.id}
                className={`products-tab ${mainCategory === category.id ? 'active' : ''}`}
                onClick={() => handleMainCategoryChange(category.id)}
                aria-label={t('common.selectCategoryAria', { category: category.label })}
                aria-pressed={mainCategory === category.id}
              >
                {category.label}
              </button>
            ))}
          </div>

          {/* Sub-Category Navigation */}
          <div className="products-subcategories">
            {getSubCategories().map((subCat) => (
              <button
                key={subCat.id}
                className={`products-subcategory ${subCategory === subCat.id ? 'active' : ''}`}
                onClick={() => handleSubCategoryChange(subCat.id)}
                aria-label={t('common.selectSubcategoryAria', { subcategory: subCat.title })}
                aria-pressed={subCategory === subCat.id}
              >
                {subCat.title}
              </button>
            ))}
          </div>

          {/* Corporate Products Grid */}
          <div className="products-grid">
            {getCurrentProducts().map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onClick={handleCardClick}
              />
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
