import { API_ENDPOINTS, getApiUrl } from '../config/api';

export type ProductInteractionType = 'view' | 'whatsapp_click';

/** Fire-and-forget: records a product view or WhatsApp-order click for admin analytics. Never throws. */
export function trackProductInteraction(slug: string, type: ProductInteractionType): void {
  fetch(`${getApiUrl(API_ENDPOINTS.PRODUCT_TRACK)}/${encodeURIComponent(slug)}/track`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ type }),
  }).catch(() => {
    // Analytics only — a tracking failure should never affect the visitor's experience.
  });
}
