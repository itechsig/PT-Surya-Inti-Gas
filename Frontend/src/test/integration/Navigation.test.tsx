import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import App from '../../app/App';

// App.tsx already provides its own BrowserRouter/AppProvider/ProductProvider/AuthProvider,
// so these tests render <App/> directly (via plain RTL render) instead of the custom
// test-utils wrapper, which would nest a second <BrowserRouter> and crash with
// "You cannot render a <Router> inside another <Router>".
//
// All public routes are language-prefixed (/:lang/...), and Header's nav links navigate
// to `/${currentLang}${href}` rather than the bare href - see Header.tsx's handleNavigation.
function renderAppAt(route: string) {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
}

describe('Navigation Integration Tests', () => {
  // jsdom doesn't apply Tailwind's responsive "hidden lg:flex"/"hidden md:block" utility
  // classes, so the desktop and mobile nav markup are both present in the DOM at once -
  // hence getAllByText (not getByText) and clicking the first match.

  it('should navigate to product page', () => {
    renderAppAt('/id');

    // "Produk & Layanan" is a mega-menu trigger (click-to-open), not a direct link -
    // open it first, then follow one of its real sub-links to the products page.
    const [megaMenuTrigger] = screen.getAllByText(/produk & layanan/i);
    fireEvent.click(megaMenuTrigger);

    const [productSubLink] = screen.getAllByText(/industrial & medical/i);
    fireEvent.click(productSubLink);

    expect(window.location.pathname).toBe('/id/produk');
  });

  it('should navigate to gallery page', () => {
    renderAppAt('/id');

    const [galleryLink] = screen.getAllByText(/galeri/i);
    fireEvent.click(galleryLink);

    expect(window.location.pathname).toBe('/id/galeri');
  });

  it('should navigate to career page', () => {
    renderAppAt('/id');

    const [careerLink] = screen.getAllByText(/karir/i);
    fireEvent.click(careerLink);

    expect(window.location.pathname).toBe('/id/karir');
  });

  it('should link the logo back to home', () => {
    renderAppAt('/id/produk');

    // The header logo is a plain <a>, not a router Link with a click handler,
    // so we assert its href rather than simulate a click through jsdom.
    const homeLinks = screen.getAllByRole('link', { name: /surya inti gas/i });
    expect(homeLinks.length).toBeGreaterThan(0);
    homeLinks.forEach((link) => {
      expect(link).toHaveAttribute('href', '/id');
    });
  });
});
