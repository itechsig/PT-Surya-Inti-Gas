export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaTo: (lang: string) => string;
}

type StructureItem = { id: string; image: string; ctaTo: (lang: string) => string };

const structure: StructureItem[] = [
  { id: "company", image: "/images/products/20260618_134247.webp", ctaTo: (lang) => `/${lang}/produk` },
  { id: "oxygen", image: "/images/products/Oxygen-optimized.webp", ctaTo: (lang) => `/${lang}/produk/detail?id=oxygen` },
  { id: "nitrogen", image: "/images/products/Nitrogen-optimized.webp", ctaTo: (lang) => `/${lang}/produk/detail?id=nitrogen` },
  { id: "hidrogen", image: "/images/products/Hidrogen-optimized.webp", ctaTo: (lang) => `/${lang}/produk/detail?id=hidrogen` },
  { id: "argon", image: "/images/products/Argon-optimized.webp", ctaTo: (lang) => `/${lang}/produk/detail?id=argon` },
];

type TFunc = (key: string) => string;

/** Builds the 5 hero slides, sourcing title/subtitle/description from i18n. */
export function getHeroSlides(t: TFunc): HeroSlide[] {
  return structure.map(({ id, image, ctaTo }) => ({
    id,
    image,
    ctaTo,
    title: t(`hero.slides.${id}.title`),
    subtitle: t(`hero.slides.${id}.subtitle`),
    description: t(`hero.slides.${id}.description`),
  }));
}

export const SLIDE_DURATION_MS = 5000;
