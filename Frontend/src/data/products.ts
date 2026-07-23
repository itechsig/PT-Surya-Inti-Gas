export type Product = {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  image: string;
};

export type SubCategory = {
  title: string;
  products: Product[];
};

export type MainCategory = "gas" | "package" | "services";

export interface ProductCategories {
  gas: {
    "industrial-medical": SubCategory;
    "speciality-mixed": SubCategory;
  };
  package: SubCategory;
  services: SubCategory;
}

type StructureItem = { id: string; image: string };

const structure: {
  gas: Record<"industrial-medical" | "speciality-mixed", StructureItem[]>;
  package: StructureItem[];
  services: StructureItem[];
} = {
  gas: {
    "industrial-medical": [
      { id: "acetylene", image: "/images/products/Acetylene-optimized.webp" },
      { id: "oxygen", image: "/images/products/Oxygen-optimized.webp" },
      { id: "argon", image: "/images/products/Argon-optimized.webp" },
      { id: "carbon-dioxide", image: "/images/products/CO2-optimized.webp" },
      { id: "nitrogen", image: "/images/products/Nitrogen-optimized.webp" },
      { id: "hydrogen", image: "/images/products/Hidrogen-optimized.webp" },
      { id: "helium", image: "/images/products/Helium-optimized.webp" },
    ],
    "speciality-mixed": [
      { id: "sulfur-hexaflouride", image: "/images/products/Sulfur_Hexaflouride.webp" },
      { id: "mixed-gas", image: "/images/products/Mix_gas.webp" },
    ],
  },
  package: [
    { id: "cradle-2x2", image: "/images/products/Craddle_2x2.webp" },
    { id: "cradle-3x2", image: "/images/products/Craddle_3x2.webp" },
    { id: "cradle-3x3", image: "/images/products/Craddle_3x3.webp" },
    { id: "cradle-4x4", image: "/images/products/Craddle_4x4_fixed.webp" },
    { id: "cylinder", image: "/images/products/Cylinder.webp" },
    { id: "cryogenic-dewars", image: "/images/products/Cryogenic_Dewar.webp" },
    { id: "vessel-gas-liquid", image: "/images/products/VGL.webp" },
    { id: "microbulk-tank", image: "/images/products/Microbulk_.webp" },
    { id: "vertical-storage-tank", image: "/images/products/Vertical_Tank.webp" },
    { id: "iso-tank", image: "/images/products/ISO_Tank.webp" },
    { id: "lorry-tank", image: "/images/products/Road_tank.webp" },
  ],
  services: [
    { id: "installation", image: "/images/services/Installation.webp" },
    { id: "delivery", image: "/images/services/Delivery.webp" },
    { id: "refilling", image: "/images/services/Refilling.webp" },
  ],
};

export const mainCategoryIds: MainCategory[] = ["gas", "package", "services"];

/** Builds the same nested shape every Product page expects, sourcing all text from i18n. */
export function getProductCategories(t: (key: string) => string): ProductCategories {
  const build = (subcatKey: string, items: StructureItem[]): SubCategory => ({
    title: t(`products.categories.${subcatKey}`),
    products: items.map(({ id, image }) => ({
      id,
      image,
      title: t(`products.items.${id}.title`),
      description: t(`products.items.${id}.description`),
      fullDescription: t(`products.items.${id}.fullDescription`),
    })),
  });

  const buildDirect = (categoryKey: string, items: StructureItem[]): SubCategory => ({
    title: t(`products.mainCategories.${categoryKey}`),
    products: items.map(({ id, image }) => ({
      id,
      image,
      title: t(`products.items.${id}.title`),
      description: t(`products.items.${id}.description`),
      fullDescription: t(`products.items.${id}.fullDescription`),
    })),
  });

  return {
    gas: {
      "industrial-medical": build("industrial-medical", structure.gas["industrial-medical"]),
      "speciality-mixed": build("speciality-mixed", structure.gas["speciality-mixed"]),
    },
    package: buildDirect("package", structure.package),
    services: buildDirect("services", structure.services),
  };
}
