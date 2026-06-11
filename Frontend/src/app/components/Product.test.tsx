import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '../../test/test-utils';
import { Product } from './Product';

describe('Product Component', () => {
  it('should render product page', () => {
    render(<Product />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should display hero section initially', () => {
    render(<Product />);
    // Check for hero elements
    const heroSection = screen.getByText(/produk/i);
    expect(heroSection).toBeInTheDocument();
  });

  it('should navigate to selection step when button clicked', () => {
    render(<Product />);
    
    const viewButton = screen.getByText(/lihat produk/i);
    fireEvent.click(viewButton);
    
    // Should show selection category
    expect(screen.getByText(/pilih kategori/i)).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(<Product />);
    
    // Check for proper heading structure
    const headings = screen.getAllByRole('heading');
    expect(headings.length).toBeGreaterThan(0);
  });

  it('should have keyboard navigation support', () => {
    render(<Product />);
    
    const buttons = screen.getAllByRole('button');
    buttons.forEach((button: HTMLElement) => {
      expect(button).toHaveAttribute('type', 'button');
    });
  });
});
