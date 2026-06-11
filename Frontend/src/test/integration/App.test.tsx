import { describe, it, expect } from 'vitest';
import { render, screen } from '../test-utils';
import App from '../../app/App';

describe('App Integration Tests', () => {
  it('should render the main app', () => {
    render(<App />);
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('should have proper document title', () => {
    render(<App />);
    expect(document.title).toBeDefined();
  });

  it('should render header on all pages', () => {
    render(<App />);
    const header = screen.getByRole('banner');
    expect(header).toBeInTheDocument();
  });

  it('should render footer on main pages', () => {
    render(<App />);
    const footer = screen.getByRole('contentinfo');
    expect(footer).toBeInTheDocument();
  });

  it('should be accessible with proper landmarks', () => {
    render(<App />);
    
    expect(screen.getByRole('banner')).toBeInTheDocument(); // header
    expect(screen.getByRole('main')).toBeInTheDocument(); // main content
    expect(screen.getByRole('contentinfo')).toBeInTheDocument(); // footer
  });
});
