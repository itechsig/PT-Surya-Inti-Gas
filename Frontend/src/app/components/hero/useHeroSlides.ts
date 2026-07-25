import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../../../config/api";
import type { HeroSlide } from "./types";

interface HeroSlidesApiResponse {
  success: boolean;
  data: HeroSlide[];
}

/** Fetches active hero slides localized for the current language, straight from the CMS. */
export function useHeroSlides(lang: string) {
  const [slides, setSlides] = useState<HeroSlide[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.HERO_SLIDES)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: HeroSlidesApiResponse) => {
        if (!cancelled && payload.success) setSlides(payload.data);
      })
      .catch(() => {
        // Keep whatever slides were previously loaded; the hero simply won't update.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { slides, isLoading };
}
