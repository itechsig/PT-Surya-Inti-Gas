import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import '../../styles/ProductsAndServices.css';
import { getProductCategories, mainCategoryIds, type Product, type SubCategory, type MainCategory } from "../../data/products";

/* ═══════════════════════════════════════════════════════════════
   PRODUCTS AND SERVICES.TSX — PT Surya Inti Gas Corporate
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


export function ProductsAndServices() {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const productCategories = getProductCategories(t);
  const mainCategories: { id: MainCategory; label: string }[] = mainCategoryIds.map((id) => ({
    id,
    label: t(`products.mainCategories.${id}`),
  }));
  const [mainCategory, setMainCategory] = useState<MainCategory>('gas');
  const [subCategory, setSubCategory] = useState<string>('industrial-medical');

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
    navigate(`/produk/detail?id=${productId}`);
  };

  return (
    <div className="products-corporate">
      <section className="products-section" id="products">
        <div className="products-container">

          {/* Corporate Header */}
          <div className="products-header">
            <h2 className="products-title">
              {t('products.pageHeader.title')}
            </h2>
            <p className="products-subtitle">
              {t('products.homeSection.subtitle')}
            </p>
          </div>

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