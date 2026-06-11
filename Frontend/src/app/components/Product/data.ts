// ─── Product Data ─────────────────────────────────────────────────────

export interface Spec {
  icon: string;
  labelKey: string;
  valueKey: string;
}

export interface Detail {
  colorKey: string;
  pressureKey: string;
  cylinderSizesKey: string;
  applicationsKey: string;
  safetyKey: string;
}

export interface Product {
  id: number;
  titleKey: string;
  descKey: string;
  image: string;
  slug: string;
  specs: Spec[];
  detail: Detail;
}

export interface Service {
  id: number;
  badgeKey: string;
  titleKey: string;
  descKey: string;
  image: string;
  color: string;
  icon: string;
}

export const subProducts: Product[] = [
  {
    id: 1,
    titleKey: "product.categories.highPressure",
    descKey: "product.categories.highPressureDesc",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FzJTIwY3lsaW5kZXJ8ZW58MHx8MHx8fDA%3D",
    slug: "high-pressure-gas",
    specs: [
      { icon: "🔧", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.highPressure.color",
      pressureKey: "product.categoryDetails.highPressure.pressure",
      cylinderSizesKey: "product.categoryDetails.highPressure.cylinderSizes",
      applicationsKey: "product.categoryDetails.highPressure.applications",
      safetyKey: "product.categoryDetails.highPressure.safety",
    },
  },
  {
    id: 2,
    titleKey: "product.categories.regulator",
    descKey: "product.categories.regulatorDesc",
    image: "https://images.unsplash.com/photo-1565043666747-69f6646db940?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    slug: "regulator-valves",
    specs: [
      { icon: "🔧", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.regulator.color",
      pressureKey: "product.categoryDetails.regulator.pressure",
      cylinderSizesKey: "product.categoryDetails.regulator.cylinderSizes",
      applicationsKey: "product.categoryDetails.regulator.applications",
      safetyKey: "product.categoryDetails.regulator.safety",
    },
  },
  {
    id: 3,
    titleKey: "product.categories.industrialMedical",
    descKey: "product.categories.industrialMedicalDesc",
    image: "https://images.unsplash.com/photo-1576086213369-97a306d36557?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8bWVkaWNhbCUyMGdhc3xlbnwwfHwwfHx8MA%3D%3D",
    slug: "industrial-medical-gas",
    specs: [
      { icon: "🏥", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "🏭", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "💧", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.industrialMedical.color",
      pressureKey: "product.categoryDetails.industrialMedical.pressure",
      cylinderSizesKey: "product.categoryDetails.industrialMedical.cylinderSizes",
      applicationsKey: "product.categoryDetails.industrialMedical.applications",
      safetyKey: "product.categoryDetails.industrialMedical.safety",
    },
  },
  {
    id: 4,
    titleKey: "product.categories.specialityMixed",
    descKey: "product.categories.specialityMixedDesc",
    image: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Y2hlbWlzdHJ5fGVufDB8fDB8fHww",
    slug: "speciality-mixed-gas",
    specs: [
      { icon: "🧪", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.specialityMixed.color",
      pressureKey: "product.categoryDetails.specialityMixed.pressure",
      cylinderSizesKey: "product.categoryDetails.specialityMixed.cylinderSizes",
      applicationsKey: "product.categoryDetails.specialityMixed.applications",
      safetyKey: "product.categoryDetails.specialityMixed.safety",
    },
  },
  {
    id: 5,
    titleKey: "product.categories.equipment",
    descKey: "product.categories.equipmentDesc",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8aW5kdXN0cmlhbCUyMGVxdWlwbWVudHxlbnwwfHwwfHx8MA%3D%3D",
    slug: "related-equipment",
    specs: [
      { icon: "🔧", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.equipment.color",
      pressureKey: "product.categoryDetails.equipment.pressure",
      cylinderSizesKey: "product.categoryDetails.equipment.cylinderSizes",
      applicationsKey: "product.categoryDetails.equipment.applications",
      safetyKey: "product.categoryDetails.equipment.safety",
    },
  },
  {
    id: 6,
    titleKey: "product.categories.assistSupply",
    descKey: "product.categories.assistSupplyDesc",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8Z2FzJTIwc3VwcGx5fGVufDB8fDB8fHww",
    slug: "assist-gas-supply",
    specs: [
      { icon: "🔧", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.assistSupply.color",
      pressureKey: "product.categoryDetails.assistSupply.pressure",
      cylinderSizesKey: "product.categoryDetails.assistSupply.cylinderSizes",
      applicationsKey: "product.categoryDetails.assistSupply.applications",
      safetyKey: "product.categoryDetails.assistSupply.safety",
    },
  },
  {
    id: 7,
    titleKey: "product.categories.cyrogenic",
    descKey: "product.categories.cyrogenicDesc",
    image: "https://images.unsplash.com/photo-1589254065878-42c9da997008?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    slug: "cyrogenic-container",
    specs: [
      { icon: "❄️", labelKey: "product.details.usage", valueKey: "product.details.available" },
      { icon: "📦", labelKey: "product.details.availability", valueKey: "product.details.available" },
      { icon: "⚡", labelKey: "product.details.purity", valueKey: "product.details.available" },
    ],
    detail: {
      colorKey: "product.categoryDetails.cyrogenic.color",
      pressureKey: "product.categoryDetails.cyrogenic.pressure",
      cylinderSizesKey: "product.categoryDetails.cyrogenic.cylinderSizes",
      applicationsKey: "product.categoryDetails.cyrogenic.applications",
      safetyKey: "product.categoryDetails.cyrogenic.safety",
    },
  },
];

export const layananList = [
  {
    id: 1,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.distribution.title",
    descKey: "product.services.distribution.description",
    image: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#1d4ed8",
    icon: "🚛",
  },
  {
    id: 2,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.cylinderProvision.title",
    descKey: "product.services.cylinderProvision.description",
    image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#0d7c5f",
    icon: "🗃️",
  },
  {
    id: 3,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.technicalConsultation.title",
    descKey: "product.services.technicalConsultation.description",
    image: "https://images.unsplash.com/photo-1531482615713-2afd69097998?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#5b21b6",
    icon: "👷",
  },
  {
    id: 4,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.scheduledDelivery.title",
    descKey: "product.services.scheduledDelivery.description",
    image: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#92400e",
    icon: "📅",
  },
  {
    id: 5,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.cylinderMaintenance.title",
    descKey: "product.services.cylinderMaintenance.description",
    image: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#0891b2",
    icon: "🔧",
  },
  {
    id: 6,
    badgeKey: "product.services.professionalService",
    titleKey: "product.services.industrialSolutions.title",
    descKey: "product.services.industrialSolutions.description",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0",
    color: "#0ea5e9",
    icon: "🏭",
  },
];


