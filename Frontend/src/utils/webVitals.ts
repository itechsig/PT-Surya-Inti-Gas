import { onCLS, onFCP, onLCP, onTTFB, Metric } from 'web-vitals';

/**
 * Web Vitals Reporter
 * Sends Core Web Vitals to analytics/console
 */

interface VitalsReport {
  metric: Metric;
  page: string;
  timestamp: number;
}

function sendToAnalytics(metric: Metric, page: string = window.location.pathname) {
  const report: VitalsReport = {
    metric,
    page,
    timestamp: Date.now(),
  };

  // Log to console in development
  if (import.meta.env.DEV) {
    console.log('[Web Vitals]', {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      page,
    });
  }

  // Send to analytics (Google Analytics, etc.)
  if ((window as any).gtag) {
    (window as any).gtag('event', metric.name, {
      event_category: 'Web Vitals',
      event_label: page,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true,
    });
  }

  // Send to custom analytics endpoint (if configured)
  if (import.meta.env.VITE_ANALYTICS_ENDPOINT) {
    fetch(import.meta.env.VITE_ANALYTICS_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(report),
      keepalive: true,
    }).catch(err => console.error('[Web Vitals] Failed to send:', err));
  }
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals() {
  if (typeof window === 'undefined') return;

  // Core Web Vitals
  onCLS((metric: Metric) => sendToAnalytics(metric));
  onLCP((metric: Metric) => sendToAnalytics(metric));

  // Other useful metrics
  onFCP((metric: Metric) => sendToAnalytics(metric));
  onTTFB((metric: Metric) => sendToAnalytics(metric));
}

/**
 * Get current page name for reporting
 */
export function getPageName(): string {
  const path = window.location.pathname;
  
  // Map routes to page names
  const pageMap: Record<string, string> = {
    '/': 'home',
    '/produk': 'products',
    '/galeri': 'gallery',
    '/karir': 'careers',
    '/admin/dashboard': 'admin-dashboard',
  };

  return pageMap[path] || path.replace(/^\//, '') || 'unknown';
}
