import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../../../config/api";
import type { HeroSlide } from "./types";

interface HeroSlidesApiResponse {
  success: boolean;
  data: HeroSlide[];
}

// Custom image mapping for hero slides (using numeric IDs from API)
const HERO_IMAGE_MAPPING: Record<number, string> = {
  1: '/images/products/Suasana_BPP.webp',     // Pemasok Gas Industri Terpercaya
  2: '/images/products/Oxygen_Fix.webp',      // Oksigen
  3: '/images/products/Nitrogen_Fix.webp',    // Nitrogen
  4: '/images/products/CO2_Fix.webp', // Karbondioksida
  5: '/images/products/Argon_Fix.webp'        // Argon
};

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
        if (!cancelled && payload.success) {
          // Apply custom image mapping if needed
          const mappedSlides = applyImageMapping(payload.data);
          setSlides(mappedSlides);
        }
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

function applyImageMapping(slides: HeroSlide[]): HeroSlide[] {
  const mappedSlides = JSON.parse(JSON.stringify(slides)) as HeroSlide[];
  
  mappedSlides.forEach(slide => {
    if (HERO_IMAGE_MAPPING[slide.id]) {
      slide.image = HERO_IMAGE_MAPPING[slide.id];
    }
  });
  
  return mappedSlides;
}
