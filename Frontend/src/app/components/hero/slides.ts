export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaLabel: string;
  ctaTo: (lang: string) => string;
}

export const heroSlides: HeroSlide[] = [
  {
    id: "company",
    image: "/images/products/20260618_134247.webp",
    title: "PT Surya Inti Gas",
    subtitle: "Trusted Industrial Gas Supplier",
    description:
      "Providing high-quality industrial gases for manufacturing, healthcare, food processing, welding, laboratories, and many other industries with reliable distribution and excellent service.",
    ctaLabel: "Lihat Produk",
    ctaTo: (lang) => `/${lang}/produk`,
  },
  {
    id: "oxygen",
    image: "/images/products/Oxygen-optimized.webp",
    title: "Oxygen (O₂)",
    subtitle: "High Purity Oxygen",
    description:
      "Supports hospitals, laboratories, metal fabrication, welding, and industrial manufacturing processes with high purity and consistent quality.",
    ctaLabel: "Lihat Produk",
    ctaTo: (lang) => `/${lang}/produk/detail?id=oxygen`,
  },
  {
    id: "nitrogen",
    image: "/images/products/Nitrogen-optimized.webp",
    title: "Nitrogen (N₂)",
    subtitle: "Reliable Nitrogen Supply",
    description:
      "Ideal for food preservation, electronics, laboratories, pharmaceuticals, and industrial production requiring stable nitrogen gas.",
    ctaLabel: "Lihat Produk",
    ctaTo: (lang) => `/${lang}/produk/detail?id=nitrogen`,
  },
  {
    id: "co2",
    image: "/images/products/Storage_Tank_Gas.webp",
    title: "Carbon Dioxide (CO₂)",
    subtitle: "Food Grade & Industrial",
    description:
      "Suitable for beverage industries, food processing, fire suppression systems, welding, and industrial applications.",
    ctaLabel: "Lihat Produk",
    ctaTo: (lang) => `/${lang}/produk`,
  },
  {
    id: "argon",
    image: "/images/products/Argon-optimized.webp",
    title: "Argon & Specialty Gas",
    subtitle: "Precision Gas Solution",
    description:
      "Providing Argon and specialty gases for welding, laboratories, semiconductor manufacturing, calibration, and precision industries.",
    ctaLabel: "Lihat Produk",
    ctaTo: (lang) => `/${lang}/produk/detail?id=argon`,
  },
];

export const SLIDE_DURATION_MS = 5000;
