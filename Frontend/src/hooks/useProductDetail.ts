import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { Product } from "../data/products";

export interface ProductDetailData {
  product: Product;
  mainCategory: string;
  subCategory: string;
  subCategoryTitle: string;
}

// Custom image mapping for specific products (fallback only)
const PRODUCT_IMAGE_MAPPING: Record<string, string> = {
  'acetylene': '/images/products/Acetylene_fix.webp',
  'oxygen': '/images/products/Oxygen_Fix.webp',
  'nitrogen': '/images/products/Nitrogen_Fix.webp',
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
  'default': '/images/products/Oxygen_Fix.webp'
};

/** Fetches a single published product by its slug (the legacy "id" query param), localized. */
export function useProductDetail(slug: string | null, lang: string) {
  const [data, setData] = useState<ProductDetailData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setIsLoading(false);
      setError(null);
      return;
    }

    let cancelled = false;
    setIsLoading(true);
    setError(null);

    fetch(`${getApiUrl(API_ENDPOINTS.PRODUCT_DETAIL)}/${encodeURIComponent(slug)}?lang=${lang}`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Server error: ${res.status}`);
        }
        return res.json();
      })
      .then((payload: { success: boolean; data: ProductDetailData }) => {
        if (!cancelled && payload.success) {
          // Apply custom image mapping
          const mappedData = applyImageMapping(payload.data);
          setData(mappedData);
        } else if (!cancelled) {
          setError('Product not found');
          setData(null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          console.error('Failed to fetch product detail:', err);
          setError('Failed to load product details. Please try again later.');
          setData(null);
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  return { data, isLoading, error };
}

function applyImageMapping(data: ProductDetailData): ProductDetailData {
  const mappedData = JSON.parse(JSON.stringify(data)) as ProductDetailData;
  
  // Always apply custom image mapping since Railway storage is failing
  if (PRODUCT_IMAGE_MAPPING[mappedData.product.id]) {
    mappedData.product.image = PRODUCT_IMAGE_MAPPING[mappedData.product.id];
  } else {
    // Use default fallback if no specific mapping exists
    mappedData.product.image = PRODUCT_IMAGE_MAPPING['default'];
  }
  
  // Also check gallery images
  if (mappedData.product.gallery && Array.isArray(mappedData.product.gallery)) {
    mappedData.product.gallery = mappedData.product.gallery.map(() => {
      // Use the same fallback for gallery images
      return PRODUCT_IMAGE_MAPPING[mappedData.product.id] || PRODUCT_IMAGE_MAPPING['default'];
    });
  }
  
  return mappedData;
}
