import { Link, useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { motion, type Variants } from "motion/react";
import { ChevronRight } from "lucide-react";

const MotionLink = motion.create(Link);
import '../../styles/ProductsAndServices.css';
import { type Product, type ProductVariant, type SubCategory } from "../../data/products";
import { useProductCatalog } from "../../hooks/useProductCatalog";
import { getImageUrl } from "../../utils/imageUrl";
import { CradleSizeDialog } from "./CradleSizeDialog";

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

/** One "Produk Gas" / "Kemasan" / "Layanan" block: a centered title followed by a
 *  compact image+name grid of the products picked for it. Hidden entirely when
 *  the catalog hasn't returned any products for it yet. */
function ProductSection({ title, products, productHref, onVariantClick }: {
  title: string;
  products: Product[];
  productHref: (id: string) => string;
  onVariantClick: (product: Product) => void;
}) {
  if (products.length === 0) return null;

  return (
    <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-80px" }} variants={staggerContainer}>
      <motion.div className="products-flow-heading" variants={fadeUp}>
        <h2>{title}</h2>
      </motion.div>
      <motion.div className="products-grid-compact" variants={gridStagger}>
        {products.map((product) => (
          <CompactProductCard
            key={product.id}
            product={product}
            href={productHref(product.id)}
            onVariantClick={onVariantClick}
          />
        ))}
      </motion.div>
    </motion.div>
  );
}

/** Picks products by slug (id), in the given order, skipping any slug the catalog hasn't
 *  returned yet (e.g. still loading). */
function pickProductsBySlug(products: Product[], slugs: string[]): Product[] {
  const bySlug = new Map(products.map((product) => [product.id, product]));
  return slugs.map((slug) => bySlug.get(slug)).filter((product): product is Product => !!product);
}

export function ProductsAndServices() {
  const { t } = useTranslation();
  const { lang } = useParams();
  const currentLang = lang || 'id';
  const { categories: productCategories } = useProductCatalog(currentLang);
  const navigate = useNavigate();
  const [cradleVariants, setCradleVariants] = useState<ProductVariant[] | null>(null);

  const productHref = (productId: string) => `/${currentLang}/produk/detail?id=${productId}`;
  const onVariantClick = (product: Product) => setCradleVariants(product.variants ?? null);

  // Produk Gas: Oksigen, Hidrogen, Karbondioksida, dan Acetylene dari Gas Industri & Medis.
  const gasCategories = productCategories.gas as Record<string, SubCategory> | undefined;
  const gasProducts: Product[] = pickProductsBySlug(
    gasCategories?.['industrial-medical']?.products ?? [],
    ['oxygen', 'hydrogen', 'karbondioksida', 'acetylene'],
  );

  // Kemasan: High Pressure Cylinder, Vessel Gas Liquid, Microbulk Tank, Vertical Storage Tank.
  const packageCategories = productCategories.package as Record<string, SubCategory> | undefined;
  const packageProducts: Product[] = pickProductsBySlug(
    Object.values(packageCategories ?? {}).flatMap(sub => sub?.products ?? []),
    ['cylinder', 'vessel-gas-liquid', 'microbulk-tank', 'vertical-storage-tank'],
  );

  // Layanan: first 4 services.
  const serviceCategories = productCategories.services as Record<string, SubCategory> | undefined;
  const serviceProducts: Product[] = serviceCategories
    ? Object.values(serviceCategories).flatMap(sub => sub?.products ?? []).slice(0, 4)
    : [];

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

          <ProductSection
            title={t('products.mainCategories.gas')}
            products={gasProducts}
            productHref={productHref}
            onVariantClick={onVariantClick}
          />

          <ProductSection
            title={t('products.mainCategories.package')}
            products={packageProducts}
            productHref={productHref}
            onVariantClick={onVariantClick}
          />

          <ProductSection
            title={t('products.mainCategories.services')}
            products={serviceProducts}
            productHref={productHref}
            onVariantClick={onVariantClick}
          />

          <motion.div
            className="products-cta-buttons"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <Link to={`/${currentLang}/produk`} className="products-cta-button primary">
              {t('products.homeSection.cta')}
              <ChevronRight size={18} aria-hidden="true" />
            </Link>
          </motion.div>

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
