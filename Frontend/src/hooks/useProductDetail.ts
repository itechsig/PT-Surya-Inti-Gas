import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { Product } from "../data/products";

export interface ProductDetailData {
  product: Product;
  mainCategory: string;
  subCategory: string;
  subCategoryTitle: string;
}

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
          // Use API images directly without custom mapping
          setData(payload.data);
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
