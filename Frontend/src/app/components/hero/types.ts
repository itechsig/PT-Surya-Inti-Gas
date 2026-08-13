export interface HeroSlide {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  ctaPath: string | null;
  durationMs: number;
}

export const DEFAULT_SLIDE_DURATION_MS = 5000;
