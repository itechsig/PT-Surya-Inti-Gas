/**
 * Accessibility Utilities
 * Helper functions for WCAG compliance and accessibility improvements
 */

// ─── ARIA Label Generators ─────────────────────────────────

/**
 * Generate ARIA label for navigation links
 */
export function getNavLinkLabel(text: string, active?: boolean): string {
  return active ? `${text} - Current page` : text;
}

/**
 * Generate ARIA label for buttons
 */
export function getButtonLabel(text: string, additional?: string): string {
  return additional ? `${text} - ${additional}` : text;
}

/**
 * Generate ARIA label for close buttons
 */
export function getCloseButtonLabel(context: string): string {
  return `Close ${context}`;
}

// ─── Focus Management ──────────────────────────────────────

/**
 * Trap focus within a container (for modals, dropdowns, etc.)
 */
export function trapFocus(container: HTMLElement) {
  const focusableElements = container.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  const firstFocusable = focusableElements[0] as HTMLElement;
  const lastFocusable = focusableElements[focusableElements.length - 1] as HTMLElement;

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Tab') {
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          lastFocusable.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastFocusable) {
          firstFocusable.focus();
          e.preventDefault();
        }
      }
    }
  };

  container.addEventListener('keydown', handleKeyDown);
  firstFocusable.focus();

  return () => {
    container.removeEventListener('keydown', handleKeyDown);
  };
}

/**
 * Restore focus to previously focused element
 */
export function restoreFocus(element: HTMLElement | null) {
  if (element) {
    element.focus();
  }
}

// ─── Screen Reader Utilities ───────────────────────────────

/**
 * Announce message to screen readers
 */
export function announceToScreenReader(message: string, priority: 'polite' | 'assertive' = 'polite') {
  const announcement = document.createElement('div');
  announcement.setAttribute('role', 'status');
  announcement.setAttribute('aria-live', priority);
  announcement.setAttribute('aria-atomic', 'true');
  announcement.className = 'sr-only';
  announcement.textContent = message;
  
  document.body.appendChild(announcement);
  
  // Remove after announcement
  setTimeout(() => {
    document.body.removeChild(announcement);
  }, 1000);
}

// ─── Keyboard Navigation ───────────────────────────────────

/**
 * Check if keyboard is being used
 */
let isUsingKeyboard = false;

export function detectKeyboardUsage() {
  const handleKeyDown = () => {
    isUsingKeyboard = true;
  };
  
  const handleMouseDown = () => {
    isUsingKeyboard = false;
  };
  
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('mousedown', handleMouseDown);
  
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('mousedown', handleMouseDown);
  };
}

export function getKeyboardNavigationState() {
  return isUsingKeyboard;
}

// ─── Color Contrast Utilities ───────────────────────────────

/**
 * Calculate luminance of a color (for contrast checking)
 */
export function getLuminance(hex: string): number {
  const rgb = hexToRgb(hex);
  if (!rgb) return 0;
  
  const [r, g, b] = rgb.map((v) => {
    v /= 255;
    return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

/**
 * Calculate contrast ratio between two colors
 */
export function getContrastRatio(color1: string, color2: string): number {
  const l1 = getLuminance(color1);
  const l2 = getLuminance(color2);
  
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  
  return (lighter + 0.05) / (darker + 0.05);
}

/**
 * Check if contrast meets WCAG AA standard (4.5:1 for normal text)
 */
export function meetsWCAGAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 4.5;
}

/**
 * Check if contrast meets WCAG AAA standard (7:1 for normal text)
 */
export function meetsWCAGAAA(foreground: string, background: string): boolean {
  return getContrastRatio(foreground, background) >= 7;
}

function hexToRgb(hex: string): [number, number, number] | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : null;
}

// ─── Skip to Main Content Link ─────────────────────────────

/**
 * Create skip to main content link
 */
export function createSkipLink(
  targetId: string = 'main-content',
  label: string = 'Skip to main content'
): HTMLElement {
  const skipLink = document.createElement('a');
  skipLink.href = `#${targetId}`;
  skipLink.textContent = label;
  skipLink.className =
    'sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:rounded-lg focus:px-4 focus:py-2 focus:font-medium focus:bg-[var(--brand-navy,#0C2D5E)] focus:text-white focus:shadow-xl focus:outline focus:outline-2 focus:outline-offset-2 focus:outline-white';

  return skipLink;
}
