import { useCallback, useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { ChevronDown } from "lucide-react";
import { useHeroSlides } from "./useHeroSlides";
import { DEFAULT_SLIDE_DURATION_MS } from "./types";
import { getImageUrl } from "../../../utils/imageUrl";
import { SlideContent } from "./SlideContent";
import { SliderControls } from "./SliderControls";

const css = `
  @keyframes hero-progress {
    from { width: 0%; }
    to   { width: 100%; }
  }

  @keyframes hero-particle-float {
    0%   { transform: translate3d(0, 0, 0); opacity: 0; }
    10%  { opacity: 0.5; }
    90%  { opacity: 0.3; }
    100% { transform: translate3d(0, -120px, 0); opacity: 0; }
  }

  @keyframes hero-scroll-bounce {
    0%, 100% { transform: translateY(0); opacity: 0.6; }
    50%      { transform: translateY(8px); opacity: 1; }
  }

  .hero-particle {
    position: absolute;
    bottom: 0;
    border-radius: 50%;
    background: rgba(0, 174, 239, 0.5);
    animation-name: hero-particle-float;
    animation-timing-function: ease-in;
    animation-iteration-count: infinite;
    pointer-events: none;
  }

  .hero-cta-primary,
  .hero-cta-secondary {
    position: relative;
    overflow: hidden;
  }

  .hero-cta-primary::before,
  .hero-cta-secondary::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
    transition: left 0.5s ease;
  }

  .hero-cta-primary:hover::before,
  .hero-cta-secondary:hover::before {
    left: 100%;
  }

  .hero-cta-primary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 30px;
    border-radius: 999px;
    background: #0F4C81;
    color: #ffffff;
    font-weight: 700;
    font-size: 15px;
    letter-spacing: 0.01em;
    box-shadow: 0 8px 30px rgba(15, 76, 129, 0.45);
    transition: transform 0.35s cubic-bezier(0.4,0,0.2,1), box-shadow 0.35s cubic-bezier(0.4,0,0.2,1), background 0.35s;
  }
  .hero-cta-primary:hover {
    background: #00AEEF;
    transform: translateY(-3px);
    box-shadow: 0 12px 36px rgba(0, 174, 239, 0.5);
  }

  .hero-cta-secondary {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 14px 30px;
    border-radius: 999px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.35);
    backdrop-filter: blur(10px);
    color: #ffffff;
    font-weight: 600;
    font-size: 15px;
    transition: all 0.35s cubic-bezier(0.4,0,0.2,1);
  }
  .hero-cta-secondary:hover {
    background: rgba(255,255,255,0.18);
    border-color: rgba(255,255,255,0.6);
    transform: translateY(-3px);
  }

  @media (prefers-reduced-motion: reduce) {
    .hero-particle { animation: none; display: none; }
  }
`;

const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  id: i,
  left: `${(i * 7.3) % 100}%`,
  size: 2 + ((i * 5) % 5),
  duration: 10 + ((i * 3) % 10),
  delay: -(i * 1.7),
}));

export function Slider() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const { slides: heroSlides, isLoading } = useHeroSlides(lang || "id");
  const total = heroSlides.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [parallax, setParallax] = useState({ x: 0, y: 0 });
  const [preloadedNext, setPreloadedNext] = useState(1);

  const sectionRef = useRef<HTMLElement>(null);
  const touchStartX = useRef<number | null>(null);
  const inViewRef = useRef(true);
  const rafRef = useRef<number | null>(null);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* Autoplay */
  useEffect(() => {
    if (isPaused || total === 0) return;
    const duration = heroSlides[activeIndex]?.durationMs ?? DEFAULT_SLIDE_DURATION_MS;
    const timer = setTimeout(() => goTo(activeIndex + 1), duration);
    return () => clearTimeout(timer);
  }, [activeIndex, isPaused, goTo, total, heroSlides]);

  /* Preload the upcoming background image so the crossfade never pops */
  useEffect(() => {
    if (total === 0) return;
    setPreloadedNext((activeIndex + 1) % total);
  }, [activeIndex, total]);

  /* Only respond to arrow keys while the hero is actually in view */
  useEffect(() => {
    const node = sectionRef.current;
    if (!node) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        inViewRef.current = entry.isIntersecting;
      },
      { threshold: 0.5 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!inViewRef.current) return;
      const target = e.target as HTMLElement;
      if (["INPUT", "TEXTAREA"].includes(target.tagName) || target.isContentEditable) return;

      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [goNext, goPrev]);

  const handleMouseMove = (e: React.MouseEvent<HTMLElement>) => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    const { clientX, clientY, currentTarget } = e;
    rafRef.current = requestAnimationFrame(() => {
      const rect = currentTarget.getBoundingClientRect();
      const x = (clientX - rect.left) / rect.width - 0.5;
      const y = (clientY - rect.top) / rect.height - 0.5;
      setParallax({ x, y });
    });
  };

  const handleMouseLeave = () => {
    setIsPaused(false);
    setParallax({ x: 0, y: 0 });
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    if (Math.abs(deltaX) > 50) {
      if (deltaX < 0) goNext();
      else goPrev();
    }
    touchStartX.current = null;
  };

  const slide = heroSlides[activeIndex];

  if (isLoading || total === 0 || !slide) {
    return <section className="h-[100svh] min-h-[560px] w-full bg-[#0F4C81]" aria-busy="true" />;
  }

  return (
    <section
      ref={sectionRef}
      className="relative h-[100svh] min-h-[560px] w-full overflow-hidden bg-[#0F4C81]"
      onMouseEnter={() => setIsPaused(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      aria-roledescription="carousel"
      aria-label={t('hero.ariaLabel')}
    >
      <style>{css}</style>

      {/* Preload the next background image invisibly */}
      <img
        src={getImageUrl(heroSlides[preloadedNext].image)}
        alt=""
        aria-hidden="true"
        className="absolute h-px w-px opacity-0"
        loading="eager"
      />

      {/* Background layer: mouse parallax (translate) wraps Ken Burns (scale/opacity) */}
      <div
        className="absolute inset-0 transition-transform duration-300 ease-out"
        style={{
          transform: `translate3d(${parallax.x * -24}px, ${parallax.y * -24}px, 0) scale(1.06)`,
        }}
      >
        <AnimatePresence mode="sync">
          <motion.img
            key={slide.id}
            src={getImageUrl(slide.image)}
            alt=""
            aria-hidden="true"
            loading={activeIndex === 0 ? "eager" : "lazy"}
            className="absolute inset-0 h-full w-full object-cover"
            onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.style.display = 'none'; }}
            initial={{ opacity: 0, scale: 1 }}
            animate={{ opacity: 1, scale: 1.08 }}
            exit={{ opacity: 0 }}
            transition={{
              opacity: { duration: 1.1, ease: "easeOut" },
              scale: {
                duration: (slide.durationMs + 1200) / 1000,
                ease: "linear",
              },
            }}
          />
        </AnimatePresence>
      </div>

      {/* Dark overlay for legibility */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,23,42,0.55) 0%, rgba(15,23,42,0.5) 40%, rgba(15,23,42,0.75) 100%)",
        }}
      />
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "linear-gradient(90deg, rgba(15,23,42,0.6) 0%, rgba(15,23,42,0.15) 55%, rgba(15,23,42,0.1) 100%)",
        }}
      />

      {/* Floating particles */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {PARTICLES.map((p) => (
          <span
            key={p.id}
            className="hero-particle"
            style={{
              left: p.left,
              width: p.size,
              height: p.size,
              animationDuration: `${p.duration}s`,
              animationDelay: `${p.delay}s`,
            }}
          />
        ))}
      </div>

      {/* Trusted by industry badge */}
      {/* <div className="absolute right-4 top-24 z-10 hidden items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold text-white backdrop-blur-md sm:top-28 md:flex">
        <ShieldCheck className="h-4 w-4 text-[#00AEEF]" />
        Trusted by Industry Since 2003
      </div> */}

      {/* Main content */}
      <div
        className="relative z-10 flex h-full w-full flex-col items-center justify-center px-6 pb-28 pt-24 text-center sm:px-10 md:px-16 lg:px-24"
        style={{
          transform: `translate3d(${parallax.x * 6}px, ${parallax.y * 6}px, 0)`,
          transition: "transform 0.4s ease-out",
        }}
      >
        {/* <div className="mb-6 inline-flex w-fit items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-white backdrop-blur-md">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#00AEEF]" />
          Industrial Gas Solution
        </div> */}

        <SlideContent />
      </div>

      {/* Live region for screen readers */}
      <p className="sr-only" role="status" aria-live="polite">
        {t('hero.liveRegion', { current: activeIndex + 1, total, title: 'PT Surya Inti Gas' })}
      </p>

      <SliderControls
        total={total}
        activeIndex={activeIndex}
        duration={slide.durationMs}
        isPaused={isPaused}
        onSelect={goTo}
      />

      {/* Bottom bar: slide counter + progress */}
      {/* <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-3 px-6 pb-5 sm:px-10 md:px-16 lg:px-24">
        <div className="flex items-center justify-between text-xs font-semibold tracking-wider text-white/70">
          <span>
            <span className="text-white">{String(activeIndex + 1).padStart(2, "0")}</span>
            {" / "}
            {String(total).padStart(2, "0")}
          </span>
          <span className="hidden sm:inline">Scroll to explore</span>
        </div>
        <ProgressBar activeIndex={activeIndex} duration={SLIDE_DURATION_MS} isPaused={isPaused} />
      </div> */}

      {/* Scroll indicator */}
      <div
        className="absolute bottom-16 left-1/2 z-10 hidden -translate-x-1/2 sm:block"
        style={{ animation: "hero-scroll-bounce 2s ease-in-out infinite" }}
      >
        <ChevronDown className="h-6 w-6 text-white/60" />
      </div>
    </section>
  );
}