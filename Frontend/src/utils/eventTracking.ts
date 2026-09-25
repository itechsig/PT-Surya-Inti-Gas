import { API_ENDPOINTS, getApiUrl } from '../config/api';

export type AnalyticsEventType =
  | 'page_view'
  | 'whatsapp_click'
  | 'phone_click'
  | 'email_click'
  | 'product_view'
  | 'catalog_download';

export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
}

const UTM_STORAGE_KEY = 'sig_utm_params';

/**
 * Captures utm_source/medium/campaign/content from the current URL (if present) and
 * persists them for the rest of the browser session (sessionStorage), so later page
 * views/clicks in the same session still attribute back to the campaign that brought
 * the visitor in. Safe to call on every navigation — only overwrites the stored value
 * when the URL actually carries fresh UTM params.
 */
export function captureUtmParams(search: string): UtmParams {
  const params = new URLSearchParams(search);
  const fresh: UtmParams = {
    utm_source: params.get('utm_source') ?? undefined,
    utm_medium: params.get('utm_medium') ?? undefined,
    utm_campaign: params.get('utm_campaign') ?? undefined,
    utm_content: params.get('utm_content') ?? undefined,
  };

  if (Object.values(fresh).some(Boolean)) {
    try {
      sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(fresh));
    } catch {
      // Private browsing / storage disabled — attribution just won't persist across pages.
    }
    return fresh;
  }

  return readStoredUtmParams();
}

function readStoredUtmParams(): UtmParams {
  try {
    const stored = sessionStorage.getItem(UTM_STORAGE_KEY);
    return stored ? (JSON.parse(stored) as UtmParams) : {};
  } catch {
    return {};
  }
}

/**
 * Fire-and-forget: records a page view or a contact-intent click (WhatsApp/phone/email
 * link, product view, catalog download) for the admin Analytics dashboard. Never throws
 * and never affects the visitor's experience — same pattern as trackProductInteraction.
 */
export function trackEvent(
  type: AnalyticsEventType,
  options: { page?: string; label?: string; sessionId?: string } = {}
): void {
  const utm = readStoredUtmParams();

  fetch(getApiUrl(API_ENDPOINTS.EVENT_TRACK), {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    keepalive: true,
    body: JSON.stringify({
      event_type: type,
      page: options.page ?? window.location.pathname,
      label: options.label,
      session_id: options.sessionId,
      referrer: document.referrer || undefined,
      ...utm,
    }),
  }).catch(() => {
    // Analytics only — a tracking failure should never affect the visitor's experience.
  });
}
