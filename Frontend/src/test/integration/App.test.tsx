import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import App from '../../app/App';

// App.tsx already provides its own BrowserRouter/AppProvider/ProductProvider/AuthProvider,
// so render it directly via plain RTL render instead of the custom test-utils wrapper,
// which would nest a second <BrowserRouter> and crash with
// "You cannot render a <Router> inside another <Router>".

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
