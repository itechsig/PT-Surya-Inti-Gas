import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { ProductCategories } from "../data/products";

const EMPTY_CATALOG: ProductCategories = { gas: {}, package: {}, services: {} };

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
        if (!cancelled && payload.success) setCategories(payload.data);
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
