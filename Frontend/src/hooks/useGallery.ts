import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { GalleryItem } from "../data/gallery";

/** Fetches the published gallery items, localized for the current language. */
export function useGallery(lang: string) {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.GALLERY)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: GalleryItem[] }) => {
        if (!cancelled && payload.success) setItems(payload.data);
      })
      .catch(() => {
        // Keep whatever gallery items were previously loaded.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { items, isLoading };
}
