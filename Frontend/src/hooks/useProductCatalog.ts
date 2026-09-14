import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { ProductCategories } from "../data/products";

const EMPTY_CATALOG: ProductCategories = { gas: {}, package: {}, services: {}, equipment: {} };

// Matches the backend's Cache-Control max-age (ProductController::index) so the two layers
// go stale together. Keyed by lang, shared across every component instance in the tab so
// navigating between pages (home -> products -> detail -> back) doesn't re-fetch the same
// catalog on every mount.
const CACHE_TTL_MS = 60_000;
const catalogCache = new Map<string, { data: ProductCategories; fetchedAt: number }>();
const inFlightRequests = new Map<string, Promise<ProductCategories>>();

function isFresh(entry: { fetchedAt: number } | undefined): entry is { data: ProductCategories; fetchedAt: number } {
  return !!entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

async function fetchCatalog(lang: string): Promise<ProductCategories> {
  // Only add cache-busting in development
  const timestamp = !import.meta.env.PROD ? `&t=${Date.now()}` : '';
  const res = await fetch(`${getApiUrl(API_ENDPOINTS.PRODUCTS_CATALOG)}?lang=${lang}${timestamp}`);
  const payload: { success: boolean; data: ProductCategories } = await res.json();
  if (!payload.success) {
    throw new Error('Product catalog request did not succeed');
  }
  return payload.data;
}

/** Fetches the published product catalog, grouped by category, localized for the current language. */
export function useProductCatalog(lang: string) {
  const cached = catalogCache.get(lang);
  const [categories, setCategories] = useState<ProductCategories>(cached?.data ?? EMPTY_CATALOG);
  const [isLoading, setIsLoading] = useState(!isFresh(cached));

  useEffect(() => {
    let cancelled = false;
    const current = catalogCache.get(lang);

    if (isFresh(current)) {
      setCategories(current.data);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    // Dedupe concurrent mounts requesting the same language into a single network request.
    let request = inFlightRequests.get(lang);
    if (!request) {
      request = fetchCatalog(lang).finally(() => inFlightRequests.delete(lang));
      inFlightRequests.set(lang, request);
    }

    request
      .then((data) => {
        catalogCache.set(lang, { data, fetchedAt: Date.now() });
        if (!cancelled) setCategories(data);
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
