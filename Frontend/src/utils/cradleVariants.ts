import type { Product, ProductVariant } from "../data/products";

const LEGACY_PREFIX = "cradle-";
const CRADLE_SLUG = "cradle";
const CRADLE_SIZES = ["2x2", "3x2", "3x3", "4x4"];

type Translate = (key: string) => string;

/**
 * Makes the "Cradle" catalog card size-agnostic: it shows a single card (no size in the
 * title or description) and carries the sizes as `variants` so the card opens a size
 * picker instead of navigating straight to a detail page.
 *
 * Handles both catalog shapes:
 *  - current production data: one consolidated `cradle` product — sizes are picker-only
 *    and each choice opens `?id=cradle&size=<size>`;
 *  - legacy data: separate `cradle-2x2` … `cradle-4x4` products — each choice opens its
 *    own detail page.
 */
export function collapseCradleVariants(products: Product[], t: Translate): Product[] {
  const groupTitle = t("products.subCategories.cradle");
  const groupDescription = t("products.cradleGroup.description");

  const legacy = products.filter((p) => p.id.startsWith(LEGACY_PREFIX));
  if (legacy.length >= 2) {
    const grouped: Product = {
      ...legacy[0],
      id: CRADLE_SLUG,
      title: groupTitle,
      description: groupDescription,
      variants: legacy.map((v) => ({ id: v.id, label: v.id.slice(LEGACY_PREFIX.length) })),
    };
    let inserted = false;
    const out: Product[] = [];
    for (const product of products) {
      if (product.id.startsWith(LEGACY_PREFIX)) {
        if (!inserted) {
          out.push(grouped);
          inserted = true;
        }
        continue;
      }
      out.push(product);
    }
    return out;
  }

  const single = products.find((p) => p.id === CRADLE_SLUG);
  if (single && !single.variants) {
    const variants: ProductVariant[] = CRADLE_SIZES.map((size) => ({
      id: CRADLE_SLUG,
      label: size,
      size,
    }));
    const grouped: Product = {
      ...single,
      title: groupTitle,
      description: groupDescription,
      variants,
    };
    return products.map((product) => (product.id === CRADLE_SLUG ? grouped : product));
  }

  return products;
}
