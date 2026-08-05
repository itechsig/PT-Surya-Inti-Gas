import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";

export interface IndustryOption {
  id: number;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
}

/** Fetches the industry list (for the filter UI), localized for the current language. */
export function useIndustries(lang: string) {
  const [industries, setIndustries] = useState<IndustryOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(getApiUrl(API_ENDPOINTS.INDUSTRIES))
      .then((res) => res.json())
      .then((payload: { success: boolean; data: IndustryOption[] }) => {
        if (!cancelled && payload.success) setIndustries(payload.data);
      })
      .catch(() => {
        // Keep whatever industries were previously loaded.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const localize = (industry: IndustryOption): string => {
    if (lang === 'en') return industry.name_en || industry.name_id;
    if (lang === 'zh') return industry.name_zh || industry.name_id;
    return industry.name_id;
  };

  return { industries, isLoading, localize };
}
