import { describe, it, expect } from 'vitest';
import { render, screen } from '../../test/test-utils';
import { Header } from './Header';

describe('Header', () => {
  it('should render header component', () => {
    render(<Header />);
    expect(screen.getByRole('banner')).toBeInTheDocument();
  });

  it('should render navigation links', () => {
    render(<Header />);
    
    // Check for common navigation elements
    const nav = screen.getByRole('navigation');
    expect(nav).toBeInTheDocument();
  });

  it('should be accessible with proper ARIA labels', () => {
    render(<Header />);
    
    const header = screen.getByRole('banner');
    expect(header).toHaveAttribute('role', 'banner');
  });
});
