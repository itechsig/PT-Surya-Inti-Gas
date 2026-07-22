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

export type MainCategory = "gas" | "equipment";

export interface ProductCategories {
  gas: {
    "industrial-medical": SubCategory;
    "speciality-mixed": SubCategory;
  };
  equipment: {
    "color-code": SubCategory;
    package: SubCategory;
    "assist-gas": SubCategory;
    "cryogenic-transport": SubCategory;
    "regulator-valves": SubCategory;
    "medical-gas-equipment": SubCategory;
  };
}

type StructureItem = { id: string; image: string };

const structure: {
  gas: Record<"industrial-medical" | "speciality-mixed", StructureItem[]>;
  equipment: Record<
    "color-code" | "package" | "assist-gas" | "cryogenic-transport" | "regulator-valves" | "medical-gas-equipment",
    StructureItem[]
  >;
} = {
  gas: {
    "industrial-medical": [
      { id: "acetylene", image: "/images/products/Acetylene-optimized.webp" },
      { id: "oxygen", image: "/images/products/Oxygen-optimized.webp" },
      { id: "nitrogen", image: "/images/products/Nitrogen-optimized.webp" },
      { id: "argon", image: "/images/products/Argon-optimized.webp" },
      { id: "hydrogen", image: "/images/products/Hidrogen-optimized.webp" },
    ],
    "speciality-mixed": [
      { id: "helium", image: "/images/products/Helium-optimized.webp" },
      { id: "sulfur-hexaflouride", image: "/images/products/Sulfur_Hexaflouride.webp" },
      { id: "mixed-gas", image: "/images/products/Mix_gas.webp" },
    ],
  },
  equipment: {
    "color-code": [
      { id: "color-code-acetylene", image: "/images/products/Acetylene-optimized.webp" },
      { id: "color-code-special", image: "/images/products/Special_gas_.webp" },
      { id: "color-code-medical", image: "/images/products/Medical_Gas_Cylinder.webp" },
      { id: "color-code-industrial", image: "/images/products/20260618_134406.webp" },
    ],
    package: [
      { id: "package-high-pressure", image: "/images/products/20260618_134436.webp" },
      { id: "cradle-3x2", image: "/images/products/Craddle_3x2.webp" },
      { id: "cradle-4x4", image: "/images/products/Craddle_4x4_fixed.webp" },
      { id: "cryogenic-dewars", image: "/images/products/Cryogenic_Dewar.webp" },
      { id: "vessel-gas-liquid", image: "/images/products/VGL.webp" },
      { id: "microbulk-tank", image: "/images/products/Microbulk_.webp" },
      { id: "vertical-storage-tank", image: "/images/products/Vertical_Tank.webp" },
    ],
    "assist-gas": [
      { id: "assist-gas-cradle-4x4", image: "/images/products/Assist_Gas_Supply.webp" },
      { id: "microbulk-gas-supply", image: "/images/products/Microbulk_Gas_Supply.webp" },
      { id: "storage-tank-gas-supply", image: "/images/products/Storage_Tank_Gas.webp" },
    ],
    "cryogenic-transport": [
      { id: "liquid-filling-transfer", image: "/images/products/Liquid_Filling.webp" },
      { id: "cryogenic-iso-tank", image: "/images/products/ISO_Tank.webp" },
      { id: "cryogenic-road-tank", image: "/images/products/Road_tank.webp" },
    ],
    "regulator-valves": [
      { id: "cryogenic-gas-valve", image: "/images/products/Cryogenic&Valve.webp" },
      { id: "gas-regulator-laser", image: "/images/products/Gas_Regulator_For_Cutting.webp" },
      { id: "high-pressure-regulator", image: "/images/products/High_Pressure_Regulator.webp" },
      { id: "high-pressure-gas-valve", image: "/images/products/High_Pressure_Gas_Valve.webp" },
    ],
    "medical-gas-equipment": [{ id: "gdms-systems", image: "/images/products/GDMS.webp" }],
  },
};

export const mainCategoryIds: MainCategory[] = ["gas", "equipment"];

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

  return {
    gas: {
      "industrial-medical": build("industrial-medical", structure.gas["industrial-medical"]),
      "speciality-mixed": build("speciality-mixed", structure.gas["speciality-mixed"]),
    },
    equipment: {
      "color-code": build("color-code", structure.equipment["color-code"]),
      package: build("package", structure.equipment.package),
      "assist-gas": build("assist-gas", structure.equipment["assist-gas"]),
      "cryogenic-transport": build("cryogenic-transport", structure.equipment["cryogenic-transport"]),
      "regulator-valves": build("regulator-valves", structure.equipment["regulator-valves"]),
      "medical-gas-equipment": build("medical-gas-equipment", structure.equipment["medical-gas-equipment"]),
    },
  };
}
