import { API_CONFIG } from '../config/api';

/**
 * Shown whenever a backend-provided image path is missing/empty, or fails to load.
 * A real static asset (not a data URI) so it's cacheable and themeable like any other image.
 */
export const IMAGE_PLACEHOLDER = '/images/placeholder.svg';

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
export const getImageUrl = (path?: string | null, bustCache: boolean = false): string => {
  if (!path) return IMAGE_PLACEHOLDER;

  // Decode if the path is already URL-encoded (handle double-encoding)
  let cleanPath = path;
  try {
    // Check if path contains encoded characters
    if (cleanPath.includes('%')) {
      cleanPath = decodeURIComponent(cleanPath);
    }
  } catch (e) {
    // If decoding fails, use original path
  }

  // Handle URLs with escaped slashes (from JSON responses)
  cleanPath = cleanPath.replace(/\\\//g, '/');

  // Check if path contains localhost or 127.0.0.1 and replace with current API base URL
  if (cleanPath.includes('localhost') || cleanPath.includes('127.0.0.1')) {
    // Extract the path part after the domain
    const pathMatch = cleanPath.match(/https?:\/\/[^\/]+(.+)/);
    if (pathMatch) {
      return `${API_CONFIG.BASE_URL}${pathMatch[1]}`;
    }
    // Fallback: just replace the protocol and domain
    return cleanPath.replace(/https?:\/\/[^\/]+/, API_CONFIG.BASE_URL);
  }

  if (/^https?:\/\//i.test(cleanPath)) {
    return cleanPath;
  }

  if (cleanPath.startsWith('/') && !cleanPath.startsWith('/storage/')) {
    return cleanPath;
  }

  const relativePath = cleanPath.replace(/^\/?storage\//, '');
  // Don't encode at all - just use the path as-is since it should already be safe
  // Only encode spaces if present
  const encodedPath = relativePath.replace(/ /g, '%20');
  let url = `${API_CONFIG.BASE_URL}/api/v1/image/${encodedPath}`;
  
  // Only add cache-busting in development or when explicitly requested
  if (bustCache || !import.meta.env.PROD) {
    url += `?t=${Date.now()}`;
  }
  
  return url;
};
