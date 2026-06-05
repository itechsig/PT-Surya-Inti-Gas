import { getApiUrl, API_ENDPOINTS } from '../config/api';

interface VisitorTrackingData {
  session_id?: string;
  current_page?: string;
  referrer?: string;
  time_on_page?: number;
}

class VisitorTracking {
  private sessionId: string;
  private currentPage: string;
  private startTime: number;
  private trackingInterval: number | null = null;

  constructor() {
    this.sessionId = this.getOrCreateSessionId();
    this.currentPage = window.location.pathname;
    this.startTime = Date.now();
    this.initTracking();
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem('visitor_session_id');
    if (!sessionId) {
      sessionId = this.generateSessionId();
      sessionStorage.setItem('visitor_session_id', sessionId);
    }
    return sessionId;
  }

  private generateSessionId(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  private async initTracking() {
    // Track initial visitor
    await this.trackVisitor({
      session_id: this.sessionId,
      current_page: this.currentPage,
      referrer: document.referrer || '',
      time_on_page: 0,
    });

    // Setup page change tracking
    this.trackPageChanges();
    
    // Setup periodic page view tracking (every 30 seconds)
    this.setupPeriodicTracking();
  }

  private async trackVisitor(data: VisitorTrackingData) {
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.VISITOR_TRACK), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.data.session_id) {
          this.sessionId = result.data.session_id;
          sessionStorage.setItem('visitor_session_id', this.sessionId);
        }
      } else if (response.status === 403) {
        // Handle blocked user
        const result = await response.json();
        console.error('Access denied:', result.message);
        this.showBlockedMessage(result.message);
        // Stop further tracking for blocked users
        this.stopTracking();
      }
    } catch (error) {
      console.error('Error tracking visitor:', error);
    }
  }

  private showBlockedMessage(message: string) {
    // Create a blocked user overlay
    const blockedOverlay = document.createElement('div');
    blockedOverlay.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.9);
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999999;
      color: white;
      text-align: center;
      padding: 20px;
    `;
    blockedOverlay.innerHTML = `
      <div style="max-width: 600px;">
        <div style="font-size: 64px; margin-bottom: 20px;">🚫</div>
        <h1 style="font-size: 32px; margin-bottom: 16px; color: #ff6b6b;">Access Denied</h1>
        <p style="font-size: 18px; margin-bottom: 20px; color: #ccc;">${message}</p>
        <p style="font-size: 14px; color: #888;">If you believe this is an error, please contact the administrator.</p>
      </div>
    `;
    document.body.appendChild(blockedOverlay);
    
    // Prevent any further interaction
    document.body.style.overflow = 'hidden';
  }

  private stopTracking() {
    // Clear any tracking intervals
    if (this.trackingInterval) {
      clearInterval(this.trackingInterval);
    }
  }

  private async trackPageView() {
    const timeOnPage = Math.floor((Date.now() - this.startTime) / 1000);
    
    try {
      const response = await fetch(getApiUrl(API_ENDPOINTS.VISITOR_PAGEVIEW), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          session_id: this.sessionId,
          current_page: this.currentPage,
          time_on_page: timeOnPage,
        }),
      });

      if (response.ok) {
        // Reset start time for next page view
        this.startTime = Date.now();
      }
    } catch (error) {
      console.error('Error tracking page view:', error);
    }
  }

  private setupPeriodicTracking() {
    // Track page view every 30 seconds
    this.trackingInterval = setInterval(() => {
      this.trackPageView();
    }, 30000);
  }

  private trackPageChanges() {
    // Track page changes using History API
    const originalPushState = history.pushState;
    const originalReplaceState = history.replaceState;
    
    history.pushState = (...args) => {
      originalPushState.apply(history, args);
      this.handlePageChange();
    };
    
    history.replaceState = (...args) => {
      originalReplaceState.apply(history, args);
      this.handlePageChange();
    };

    // Track back/forward navigation
    window.addEventListener('popstate', () => {
      this.handlePageChange();
    });
  }

  private handlePageChange() {
    const newPage = window.location.pathname;
    
    if (newPage !== this.currentPage) {
      // Track the previous page before changing
      this.trackPageView();
      
      // Update current page and reset timer
      this.currentPage = newPage;
      this.startTime = Date.now();
    }
  }

  // Public method to manually track page view (for SPA navigation)
  public trackCurrentPage() {
    this.currentPage = window.location.pathname;
    this.trackPageView();
  }

  // Get current session ID
  public getSessionId(): string {
    return this.sessionId;
  }
}

// Create singleton instance
let visitorTrackingInstance: VisitorTracking | null = null;

export const initVisitorTracking = () => {
  if (!visitorTrackingInstance && typeof window !== 'undefined') {
    visitorTrackingInstance = new VisitorTracking();
  }
  return visitorTrackingInstance;
};

export const getVisitorTracking = () => {
  return visitorTrackingInstance;
};
