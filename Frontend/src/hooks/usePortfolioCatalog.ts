import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { PortfolioPagination, PortfolioSummary } from "../data/portfolio";

export interface PortfolioFilters {
  industry?: string;
  service?: string;
  search?: string;
  page?: number;
}

interface RawPaginatedResponse {
  data: PortfolioSummary[];
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

const EMPTY_PAGINATION: PortfolioPagination = { currentPage: 1, lastPage: 1, total: 0, perPage: 9 };

/** Fetches the published, filtered, paginated portfolio catalog, localized for the current language. */
export function usePortfolioCatalog(lang: string, filters: PortfolioFilters) {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [pagination, setPagination] = useState<PortfolioPagination>(EMPTY_PAGINATION);
  const [isLoading, setIsLoading] = useState(true);

  const { industry, service, search, page } = filters;

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    const params = new URLSearchParams({ lang });
    if (industry) params.set('industry', industry);
    if (service) params.set('service', service);
    if (search) params.set('search', search);
    if (page) params.set('page', String(page));

    fetch(`${getApiUrl(API_ENDPOINTS.PORTFOLIOS)}?${params.toString()}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: RawPaginatedResponse }) => {
        if (!cancelled && payload.success) {
          setPortfolios(payload.data.data);
          setPagination({
            currentPage: payload.data.current_page,
            lastPage: payload.data.last_page,
            total: payload.data.total,
            perPage: payload.data.per_page,
          });
        }
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
  }, [lang, industry, service, search, page]);

  return { portfolios, pagination, isLoading };
}
