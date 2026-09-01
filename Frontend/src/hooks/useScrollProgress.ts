import { useState, useEffect } from 'react';

/**
 * Custom hook untuk tracking scroll progress percentage
 * @returns percentage scroll dari 0-100
 */
export function useScrollProgress() {
  const [scrollPct, setScrollPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (sy / max) * 100 : 0);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollPct;
}

/**
 * Custom hook untuk tracking scroll position (Y offset)
 * @returns scroll Y position dalam pixels
 */
export function useScrollY() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      setScrollY(window.scrollY);
    };
    
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return scrollY;
}

/**
 * Custom hook untuk cek apakah user sudah scroll melewati threshold tertentu
 * @param threshold - pixel threshold (default: 24)
 * @returns boolean apakah sudah scroll melewati threshold
 */
export function useScrolledPast(threshold: number = 24) {
  const [scrolled, setScrolled] = useState(
    () => typeof window !== "undefined" && window.scrollY > threshold
  );

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    // Sync once on mount in case the page loaded already scrolled (deep link,
    // refresh, browser scroll restoration).
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [threshold]);

  return scrolled;
}
