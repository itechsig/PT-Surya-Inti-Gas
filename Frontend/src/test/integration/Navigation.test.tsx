import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../test-utils';
import App from '../../app/App';

describe('Navigation Integration Tests', () => {
  it('should navigate to product page', () => {
    render(<App />, { route: '/' });
    
    const productLink = screen.getByText(/produk/i);
    fireEvent.click(productLink);
    
    // Should navigate to product page
    expect(window.location.pathname).toBe('/produk');
  });

  it('should navigate to gallery page', () => {
    render(<App />, { route: '/' });
    
    const galleryLink = screen.getByText(/galeri/i);
    fireEvent.click(galleryLink);
    
    expect(window.location.pathname).toBe('/galeri');
  });

  it('should navigate to career page', () => {
    render(<App />, { route: '/' });
    
    const careerLink = screen.getByText(/karir/i);
    fireEvent.click(careerLink);
    
    expect(window.location.pathname).toBe('/karir');
  });

  it('should navigate back to home', () => {
    render(<App />, { route: '/produk' });
    
    const homeLink = screen.getByText(/beranda/i);
    fireEvent.click(homeLink);
    
    expect(window.location.pathname).toBe('/');
  });
});
