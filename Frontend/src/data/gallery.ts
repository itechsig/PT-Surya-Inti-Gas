export interface GalleryItem {
  id: string;
  thumbnail: string;
  fullSize: string;
  alt: string;
  title: string;
  description: string;
  detailedDescription: string;
  category: string;
  year: number;
  size?: "small" | "medium" | "large" | "wide" | "tall";
}

type StructureItem = {
  id: string;
  thumbnail: string;
  fullSize: string;
  category: string;
  year: number;
  size?: GalleryItem["size"];
};

const structure: StructureItem[] = [
  { id: "oxygen", thumbnail: "/images/products/Oxygen-optimized.webp", fullSize: "/images/products/Oxygen-optimized.webp", category: "products", year: 2007, size: "medium" },
  { id: "nitrogen", thumbnail: "/images/products/Nitrogen-optimized.webp", fullSize: "/images/products/Nitrogen-optimized.webp", category: "products", year: 2008, size: "small" },
  { id: "mix-gas", thumbnail: "/images/products/Mix_gas.webp", fullSize: "/images/products/Mix_gas.webp", category: "products", year: 2009, size: "small" },
  { id: "vertical-tank", thumbnail: "/images/products/Vertical_Tank.webp", fullSize: "/images/products/Vertical_Tank.webp", category: "equipment", year: 2010, size: "tall" },
  { id: "acetylene", thumbnail: "/images/products/Acetylene-optimized.webp", fullSize: "/images/products/Acetylene-optimized.webp", category: "products", year: 2011, size: "medium" },
  { id: "iso-tank", thumbnail: "/images/products/ISO_Tank.webp", fullSize: "/images/products/ISO_Tank.webp", category: "equipment", year: 2012, size: "wide" },
  { id: "liquid-filling", thumbnail: "/images/products/Liquid_Filling.webp", fullSize: "/images/products/Liquid_Filling.webp", category: "facility", year: 2013, size: "large" },
  { id: "microbulk", thumbnail: "/images/products/Microbulk.webp", fullSize: "/images/products/Microbulk.webp", category: "equipment", year: 2014, size: "small" },
  { id: "medical-gas", thumbnail: "/images/products/Medical_Gas_Cylinder.webp", fullSize: "/images/products/Medical_Gas_Cylinder.webp", category: "products", year: 2015, size: "medium" },
  { id: "office-view-2", thumbnail: "/images/office/office_view2.webp", fullSize: "/images/office/office_view2.webp", category: "facility", year: 2016, size: "wide" },
  { id: "office-view-3", thumbnail: "/images/office/office_view3.webp", fullSize: "/images/office/office_view3.webp", category: "facility", year: 2017, size: "tall" },
  { id: "gas-cylinder-1", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop", category: "facility", year: 2018, size: "large" },
  { id: "industrial-plant-1", thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop", category: "facility", year: 2019, size: "wide" },
  { id: "welding-1", thumbnail: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop", category: "products", year: 2020, size: "medium" },
  { id: "lab-1", thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=1200&h=800&fit=crop", category: "facility", year: 2021, size: "small" },
  { id: "delivery-1", thumbnail: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&h=800&fit=crop", category: "facility", year: 2022, size: "tall" },
  { id: "tank-1", thumbnail: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=1200&h=800&fit=crop", category: "equipment", year: 2023, size: "large" },
  { id: "valve-1", thumbnail: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1200&h=800&fit=crop", category: "equipment", year: 2024, size: "small" },
  { id: "hospital-1", thumbnail: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&h=800&fit=crop", category: "facility", year: 2025, size: "wide" },
  { id: "quality-1", thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop", category: "facility", year: 2026, size: "medium" },
  { id: "training-1", thumbnail: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=1200&h=800&fit=crop", category: "facility", year: 2007, size: "small" },
  { id: "pressure-gauge-1", thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop", category: "equipment", year: 2009, size: "small" },
  { id: "factory-1", thumbnail: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=1200&h=800&fit=crop", category: "facility", year: 2010, size: "large" },
  { id: "medical-equipment-1", thumbnail: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1579684385127-1ef15d508118?w=1200&h=800&fit=crop", category: "products", year: 2011, size: "medium" },
  { id: "cryogenic-1", thumbnail: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=1200&h=800&fit=crop", category: "equipment", year: 2012, size: "tall" },
  { id: "assembly-1", thumbnail: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=1200&h=800&fit=crop", category: "facility", year: 2013, size: "wide" },
  { id: "fire-safety-1", thumbnail: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=1200&h=800&fit=crop", category: "facility", year: 2014, size: "small" },
  { id: "transport-1", thumbnail: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1601584115197-04ecc0da31d7?w=1200&h=800&fit=crop", category: "facility", year: 2015, size: "large" },
  { id: "laboratory-2", thumbnail: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=1200&h=800&fit=crop", category: "facility", year: 2016, size: "medium" },
  { id: "regulator-1", thumbnail: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&h=250&fit=crop", fullSize: "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=1200&h=800&fit=crop", category: "equipment", year: 2017, size: "small" },
];

type TFunc = (key: string, opts?: Record<string, unknown>) => string;

/** Builds the full gallery list every gallery page expects, sourcing all text from i18n. */
export function getGalleryItems(t: TFunc): GalleryItem[] {
  return structure.map(({ id, thumbnail, fullSize, category, year, size }) => ({
    id,
    thumbnail,
    fullSize,
    category,
    year,
    size,
    alt: t(`gallery.items.${id}.alt`),
    title: t(`gallery.items.${id}.title`),
    description: t(`gallery.items.${id}.description`),
    detailedDescription: t(`gallery.items.${id}.detailedDescription`),
  }));
}
