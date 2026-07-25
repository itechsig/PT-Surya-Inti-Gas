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

  useEffect(() => {
    if (!slug) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.PRODUCT_DETAIL)}/${encodeURIComponent(slug)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: ProductDetailData }) => {
        if (!cancelled) setData(payload.success ? payload.data : null);
      })
      .catch(() => {
        if (!cancelled) setData(null);
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [slug, lang]);

  return { data, isLoading };
}
