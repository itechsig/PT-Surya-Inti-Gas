/**
 * SkipLink Component
 * Allows keyboard users to skip navigation and go directly to main content
 * WCAG 2.1 Success Criterion 2.4.1 (Bypass Blocks)
 */

import { useEffect, useRef } from 'react';

interface SkipLinkProps {
  targetId?: string;
  label?: string;
}

export function SkipLink({ targetId = 'main-content', label = 'Skip to main content' }: SkipLinkProps) {
  const skipLinkRef = useRef<HTMLAnchorElement>(null);

  return (
    <a
      ref={skipLinkRef}
      href={`#${targetId}`}
      className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-900 focus:text-white focus:rounded-lg focus:shadow-xl focus:font-medium"
    >
      {label}
    </a>
  );
}
