import { API_CONFIG } from '../config/api';

/**
 * Shown whenever a backend-provided image path is missing/empty, or fails to load.
 * A real static asset (not a data URI) so it's cacheable and themeable like any other image.
 */
export const IMAGE_PLACEHOLDER = '/images/placeholder.svg';

const DEV_HOST_PATTERN = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i;

/**
 * Resolves whatever the backend/API put in an image field into a URL the browser can load,
 * regardless of environment. The backend always returns image fields as absolute URLs already
 * routed through `/api/v1/image/{path}` (ImageController reads the file straight off the
 * `public` disk - see PortfolioController::imageUrl / ProductController::generateImageUrl /
 * etc.) specifically because Railway's `/storage` symlink is unreliable, so this helper must
 * never route a path onto `/storage/...`. Handles every shape this field has held historically:
 *  - empty/null                              -> placeholder
 *  - a full URL that still says localhost (a stale/misconfigured API response)
 *                                             -> re-anchored to the current API base URL
 *  - any other absolute URL (already-correct backend URL, or an external/CDN URL)
 *                                             -> left untouched
 *  - a local static asset path ("/images/...")
 *                                             -> left untouched
 *  - a `/storage/...` path (legacy - the symlink route this app moved away from)
 *                                             -> re-routed through `/api/v1/image/...`
 *  - a bare relative storage path ("gallery/foo.webp")
 *                                             -> built into "{API base}/api/v1/image/foo.webp"
 */
export const getImageUrl = (path?: string | null): string => {
  if (!path) return IMAGE_PLACEHOLDER;

  if (DEV_HOST_PATTERN.test(path)) {
    return path.replace(DEV_HOST_PATTERN, API_CONFIG.BASE_URL);
  }

  if (/^https?:\/\//i.test(path)) {
    return path;
  }

  if (path.startsWith('/') && !path.startsWith('/storage/')) {
    return path;
  }

  const relativePath = path.replace(/^\/?storage\//, '');
  return `${API_CONFIG.BASE_URL}/api/v1/image/${encodeURIComponent(relativePath)}`;
};
