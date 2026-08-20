import { useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import { API_ENDPOINTS, getApiUrl } from "../../config/api";

const SESSION_STORAGE_KEY = "sig_visitor_session";

function getOrCreateSessionId(): string {
  let id = sessionStorage.getItem(SESSION_STORAGE_KEY);
  if (!id) {
    id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    sessionStorage.setItem(SESSION_STORAGE_KEY, id);
  }
  return id;
}

function post(endpoint: string, body: Record<string, unknown>) {
  fetch(getApiUrl(endpoint), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
    keepalive: true,
  }).catch(() => {
    // Analytics only — a tracking failure should never affect the visitor's experience.
  });
}

/**
 * Fire-and-forget visitor/pageview tracking for the public site. Mount once near the router
 * root. Skips /admin routes so internal staff usage never pollutes public traffic analytics.
 */
export function VisitorTracker() {
  const { pathname } = useLocation();
  const hasTrackedVisit = useRef(false);
  const lastPageEnteredAt = useRef(Date.now());

  useEffect(() => {
    if (pathname.startsWith("/admin")) return;

    const sessionId = getOrCreateSessionId();

    if (!hasTrackedVisit.current) {
      hasTrackedVisit.current = true;
      lastPageEnteredAt.current = Date.now();
      post(API_ENDPOINTS.VISITOR_TRACK, {
        session_id: sessionId,
        referrer: document.referrer || null,
        current_page: pathname,
      });
      return;
    }

    const timeOnPage = Math.round((Date.now() - lastPageEnteredAt.current) / 1000);
    lastPageEnteredAt.current = Date.now();
    post(API_ENDPOINTS.VISITOR_PAGEVIEW, {
      session_id: sessionId,
      current_page: pathname,
      time_on_page: timeOnPage,
    });
  }, [pathname]);

  return null;
}
