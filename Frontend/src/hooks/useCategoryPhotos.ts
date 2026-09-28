import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";

/** key -> resolved image URL (absent/null key means "no photo uploaded, use the icon"). */
export type CategoryPhotoMap = Record<string, string | null>;

// Matches the backend's Cache-Control max-age (CategoryPhotoController::index) and mirrors
// useProductCatalog's module-scope cache so every Product.tsx mount doesn't re-fetch this.
const CACHE_TTL_MS = 60_000;
let cache: { data: CategoryPhotoMap; fetchedAt: number } | null = null;
let inFlight: Promise<CategoryPhotoMap> | null = null;

function isFresh(entry: typeof cache): entry is { data: CategoryPhotoMap; fetchedAt: number } {
  return !!entry && Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

async function fetchCategoryPhotos(): Promise<CategoryPhotoMap> {
  const res = await fetch(getApiUrl(API_ENDPOINTS.CATEGORY_PHOTOS));
  const payload: { success: boolean; data: CategoryPhotoMap } = await res.json();
  if (!payload.success) {
    throw new Error('Category photos request did not succeed');
  }
  return payload.data;
}

/** Fetches the category/sub-category picker-card photos that replace the lucide icons. */
export function useCategoryPhotos(): CategoryPhotoMap {
  const [photos, setPhotos] = useState<CategoryPhotoMap>(cache?.data ?? {});

  useEffect(() => {
    let cancelled = false;

    if (isFresh(cache)) {
      setPhotos(cache.data);
      return;
    }

    if (!inFlight) {
      inFlight = fetchCategoryPhotos().finally(() => { inFlight = null; });
    }

    inFlight
      .then((data) => {
        cache = { data, fetchedAt: Date.now() };
        if (!cancelled) setPhotos(data);
      })
      .catch(() => {
        // Keep whatever was previously loaded; icons remain a safe fallback.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return photos;
}
