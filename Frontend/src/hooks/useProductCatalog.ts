import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { ProductCategories, SubCategory, Product } from "../data/products";

const EMPTY_CATALOG: ProductCategories = { gas: {}, package: {}, services: {}, equipment: {} };

// Custom image mapping for specific products
const PRODUCT_IMAGE_MAPPING: Record<string, string> = {
  'acetylene': '/images/products/Acetylene_fix.webp',
  'oxygen': '/images/products/Oxygen_Fix.webp',
  'nitrogen': '/images/products/Nitrogen_Fix.webp',
  'carbon-dioxide': '/images/products/CO2_Fix.webp',
  'hydrogen': '/images/products/Hidrogen_Fix.webp',
  'helium': '/images/products/Helium_Fix.webp',
  'argon': '/images/products/Argon_Fix.webp',
  'sulfur-hexaflouride': '/images/products/SF6_Fix.webp',
  'mixed-gas': '/images/products/Mixed_Gas_Fix.webp',
  'cryogenic-dewars': '/images/products/Cryogenic_Dewar.webp',
  'microbulk-tank': '/images/products/Microbulk_.webp',
  'vessel-gas-liquid': '/images/products/VGL.webp',
  'cryogenic-road-tank': '/images/office/wp2.jpg',
  'cryogenic-iso-tank': '/images/office/wp.jpg',
  'iso-tank': '/images/office/wp.jpg',
  'lorry-tank': '/images/office/wp2.jpg',
  'package-high-pressure': '/images/products/20260618_134436.webp',
  'cradle-2x2': '/images/products/Craddle_3x2.webp',
  'cradle-3x2': '/images/products/Craddle_3x2.webp',
  'cradle-3x3': '/images/products/Craddle_4x4_fixed.webp',
  'cradle-4x4': '/images/products/Craddle_4x4_fixed.webp',
  // Default fallback for any unmapped products
  'default': '/images/products/Oxygen_Fix.webp'
};

/** Fetches the published product catalog, grouped by category, localized for the current language. */
export function useProductCatalog(lang: string) {
  const [categories, setCategories] = useState<ProductCategories>(EMPTY_CATALOG);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.PRODUCTS_CATALOG)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: ProductCategories }) => {
        if (!cancelled && payload.success) {
          // Apply custom image mapping
          const mappedData = applyImageMapping(payload.data);
          setCategories(mappedData);
        }
      })
      .catch(() => {
        // Keep whatever catalog was previously loaded.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { categories, isLoading };
}

function applyImageMapping(data: ProductCategories): ProductCategories {
  const mappedData = JSON.parse(JSON.stringify(data)) as ProductCategories;
  
  // Helper function to map images for a category
  const mapCategoryImages = (category: Record<string, SubCategory>) => {
    Object.values(category).forEach(subCategory => {
      if (subCategory.products) {
        subCategory.products.forEach((product: Product) => {
          // Always use custom mapping since Railway storage is failing
          if (PRODUCT_IMAGE_MAPPING[product.id]) {
            product.image = PRODUCT_IMAGE_MAPPING[product.id];
          } else {
            // Use default fallback if no specific mapping exists
            product.image = PRODUCT_IMAGE_MAPPING['default'];
          }
        });
      }
    });
  };
  
  // Map images for all categories
  if (mappedData.gas) mapCategoryImages(mappedData.gas);
  if (mappedData.package) mapCategoryImages(mappedData.package);
  if (mappedData.services) mapCategoryImages(mappedData.services);
  if (mappedData.equipment) mapCategoryImages(mappedData.equipment);
  
  return mappedData;
}
