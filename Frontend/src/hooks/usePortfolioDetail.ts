import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { PortfolioDetail } from "../data/portfolio";

/** Fetches a single published portfolio by its slug, with gallery, localized. */
export function usePortfolioDetail(slug: string | null, lang: string) {
  const [data, setData] = useState<PortfolioDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!slug) {
      setData(null);
      setIsLoading(false);
      return;
    }

    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.PORTFOLIO_DETAIL)}/${encodeURIComponent(slug)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: PortfolioDetail }) => {
        if (!cancelled && payload.success) {
          setData(payload.data);
        } else if (!cancelled) {
          setData(null);
        }
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
