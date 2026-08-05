import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";

export interface ServiceTypeOption {
  id: number;
  slug: string;
  name_id: string;
  name_en: string | null;
  name_zh: string | null;
}

/** Fetches the service type list (for the filter UI), localized for the current language. */
export function useServiceTypes(lang: string) {
  const [serviceTypes, setServiceTypes] = useState<ServiceTypeOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(getApiUrl(API_ENDPOINTS.SERVICE_TYPES))
      .then((res) => res.json())
      .then((payload: { success: boolean; data: ServiceTypeOption[] }) => {
        if (!cancelled && payload.success) setServiceTypes(payload.data);
      })
      .catch(() => {
        // Keep whatever service types were previously loaded.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  const localize = (serviceType: ServiceTypeOption): string => {
    if (lang === 'en') return serviceType.name_en || serviceType.name_id;
    if (lang === 'zh') return serviceType.name_zh || serviceType.name_id;
    return serviceType.name_id;
  };

  return { serviceTypes, isLoading, localize };
}
