import { API_CONFIG } from '../config/api';

/**
 * The backend always returns image fields as absolute URLs already routed through
 * `/api/v1/image/{path}` (ImageController reads the file straight off the `public` disk -
 * see PortfolioController::imageUrl / ProductController::generateImageUrl / etc.). That
 * endpoint exists specifically because Railway's `/storage` symlink is unreliable, so this
 * helper must never rewrite a URL back onto `/storage/...` - it only re-anchors URLs that
 * were baked with a stale/localhost APP_URL onto the current API host.
 */
export function fixImageUrl(url: string | null | undefined): string {
  if (!url) return '';

  // Already a correctly-hosted absolute URL - nothing to do.
  if (url.startsWith('https://') && !url.includes('localhost')) return url;

  // Baked with a dev/stale APP_URL (e.g. http://localhost:8000/api/v1/image/...) - keep the
  // path, just point it at the real API host.
  if (url.startsWith('http://localhost') || url.startsWith('http://127.0.0.1')) {
    const path = url.replace(/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/, '');
    return `${API_CONFIG.BASE_URL}${path}`;
  }

  // Any other absolute URL (http upgraded to https, or an external/CDN URL) - trust it.
  if (url.startsWith('http://')) return url.replace('http://', 'https://');
  if (url.startsWith('https://')) return url;

  // A root-relative path that isn't a storage path is a local static asset served from
  // Frontend/public (e.g. "/images/products/Oxygen_Fix.webp") - leave it as-is.
  if (url.startsWith('/') && !url.startsWith('/storage/')) return url;

  // Legacy/relative storage path (e.g. "products/foo.webp" or "/storage/products/foo.webp") -
  // route it through the same API image endpoint the backend itself uses, not the unreliable
  // storage symlink.
  const relativePath = url.replace(/^\/?storage\//, '');
  return `${API_CONFIG.BASE_URL}/api/v1/image/${encodeURIComponent(relativePath)}`;
}