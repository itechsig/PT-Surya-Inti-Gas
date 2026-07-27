import { useEffect, useState } from "react";
import { API_ENDPOINTS, getApiUrl } from "../config/api";
import type { Job } from "../data/jobs";

/** Fetches the active job vacancies, localized for the current language. */
export function useJobVacancies(lang: string) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    fetch(`${getApiUrl(API_ENDPOINTS.JOB_VACANCIES)}?lang=${lang}`)
      .then((res) => res.json())
      .then((payload: { success: boolean; data: Job[] }) => {
        if (!cancelled && payload.success) setJobs(payload.data);
      })
      .catch(() => {
        // Keep whatever jobs were previously loaded.
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [lang]);

  return { jobs, isLoading };
}
