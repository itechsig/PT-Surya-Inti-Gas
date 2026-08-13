/**
 * Performance Monitoring Utility
 * Track Core Web Vitals and custom metrics
 */

// ─── Core Web Vitals Tracking ───────────────────────────────

interface PerformanceMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
}

export class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];

  /**
   * Track Largest Contentful Paint (LCP)
   * Measures loading performance
   */
  trackLCP() {
    if (!window.performance) return;

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as PerformanceEntry;
      
      const metric: PerformanceMetric = {
        name: 'LCP',
        value: lastEntry.startTime,
        rating: this.getRating('LCP', lastEntry.startTime),
      };

      this.metrics.push(metric);
      console.log('[Performance]', metric);
    }).observe({ entryTypes: ['largest-contentful-paint'] });
  }

  /**
   * Track First Input Delay (FID)
   * Measures interactivity
   */
  trackFID() {
    if (!window.performance) return;

    new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const firstEntry = entries[0] as PerformanceEntry;
      
      const metric: PerformanceMetric = {
        name: 'FID',
        value: firstEntry.startTime,
        rating: this.getRating('FID', firstEntry.startTime),
      };

      this.metrics.push(metric);
      console.log('[Performance]', metric);
    }).observe({ entryTypes: ['first-input'] });
  }

  /**
   * Track Cumulative Layout Shift (CLS)
   * Measures visual stability
   */
  trackCLS() {
    if (!window.performance) return;

    let clsValue = 0;

    new PerformanceObserver((list) => {
      for (const entry of list.getEntries() as any[]) {
        if (!entry.hadRecentInput) {
          clsValue += entry.value;
        }
      }
      
      const metric: PerformanceMetric = {
        name: 'CLS',
        value: clsValue,
        rating: this.getRating('CLS', clsValue),
      };

      this.metrics.push(metric);
      console.log('[Performance]', metric);
    }).observe({ entryTypes: ['layout-shift'] });
  }

  /**
   * Track Time to First Byte (TTFB)
   * Measures server response time
   */
  trackTTFB() {
    if (!window.performance || !window.performance.timing) return;

    const timing = window.performance.timing;
    const ttfb = timing.responseStart - timing.navigationStart;
    
    const metric: PerformanceMetric = {
      name: 'TTFB',
      value: ttfb,
      rating: this.getRating('TTFB', ttfb),
    };

    this.metrics.push(metric);
    console.log('[Performance]', metric);
  }

  /**
   * Get rating based on metric thresholds
   */
  private getRating(metric: string, value: number): 'good' | 'needs-improvement' | 'poor' {
    const thresholds: Record<string, { good: number; poor: number }> = {
      LCP: { good: 2500, poor: 4000 },
      FID: { good: 100, poor: 300 },
      CLS: { good: 0.1, poor: 0.25 },
      TTFB: { good: 800, poor: 1800 },
    };

    const threshold = thresholds[metric];
    if (!threshold) return 'needs-improvement';

    if (value <= threshold.good) return 'good';
    if (value <= threshold.poor) return 'needs-improvement';
    return 'poor';
  }

  /**
   * Get all collected metrics
   */
  getMetrics(): PerformanceMetric[] {
    return this.metrics;
  }

  /**
   * Initialize all performance tracking
   */
  init() {
    if (typeof window === 'undefined') return;

    // Track Core Web Vitals
    this.trackLCP();
    this.trackFID();
    this.trackCLS();
    
    // Track TTFB after page load
    if (document.readyState === 'complete') {
      this.trackTTFB();
    } else {
      window.addEventListener('load', () => this.trackTTFB());
    }

    // Log navigation timing
    if (window.performance && window.performance.timing) {
      const timing = window.performance.timing;
      console.log('[Performance] Navigation Timing:', {
        dns: timing.domainLookupEnd - timing.domainLookupStart,
        tcp: timing.connectEnd - timing.connectStart,
        ttfb: timing.responseStart - timing.navigationStart,
        domLoad: timing.domContentLoadedEventEnd - timing.navigationStart,
        load: timing.loadEventEnd - timing.navigationStart,
      });
    }
  }
}

// ─── Custom Page Load Tracking ───────────────────────────────

export function trackPageLoad(pageName: string) {
  if (typeof window === 'undefined' || !window.performance) return;

  const timing = window.performance.timing;
  const loadTime = timing.loadEventEnd - timing.navigationStart;

  console.log('[Page Load]', {
    page: pageName,
    loadTime: `${loadTime}ms`,
    timestamp: new Date().toISOString(),
  });

  // Send to analytics (if available)
  if ((window as any).gtag) {
    (window as any).gtag('event', 'page_load_time', {
      page_name: pageName,
      load_time: loadTime,
    });
  }
}

// ─── Memory Usage Tracking ───────────────────────────────────

export function trackMemoryUsage() {
  if (typeof window === 'undefined' || !(performance as any).memory) {
    console.warn('[Performance] Memory API not supported');
    return;
  }

  const memory = (performance as any).memory;
  const usedMB = Math.round(memory.usedJSHeapSize / 1048576);
  const totalMB = Math.round(memory.totalJSHeapSize / 1048576);
  const limitMB = Math.round(memory.jsHeapSizeLimit / 1048576);

  console.log('[Memory]', {
    used: `${usedMB} MB`,
    total: `${totalMB} MB`,
    limit: `${limitMB} MB`,
    percentage: `${((usedMB / limitMB) * 100).toFixed(1)}%`,
  });

  return { usedMB, totalMB, limitMB };
}

// ─── Initialize Performance Monitor ─────────────────────────

export const performanceMonitor = new PerformanceMonitor();
