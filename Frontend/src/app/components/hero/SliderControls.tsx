import { ChevronLeft, ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SliderControlsProps {
  total: number;
  activeIndex: number;
  duration: number;
  isPaused: boolean;
  onPrev: () => void;
  onNext: () => void;
  onSelect: (index: number) => void;
}

export function SliderControls({
  total,
  activeIndex,
  duration,
  isPaused,
  onPrev,
  onNext,
  onSelect,
}: SliderControlsProps) {
  const { t } = useTranslation();
  return (
    <>
      <button
        type="button"
        onClick={onPrev}
        aria-label={t('hero.previousSlide')}
        className="group absolute left-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/50 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#00AEEF] sm:left-6 sm:h-12 sm:w-12"
      >
        <ChevronLeft className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={2.5} />
      </button>

      <button
        type="button"
        onClick={onNext}
        aria-label={t('hero.nextSlide')}
        className="group absolute right-3 top-1/2 z-20 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full border border-white/25 bg-white/10 text-white backdrop-blur-md transition-all duration-300 hover:scale-110 hover:border-white/50 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-[#00AEEF] sm:right-6 sm:h-12 sm:w-12"
      >
        <ChevronRight className="h-4 w-4 sm:h-6 sm:w-6" strokeWidth={2.5} />
      </button>

      <div
        className="flex items-center gap-2 sm:gap-3"
        role="tablist"
        aria-label={t('hero.slideIndicators')}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              role="tab"
              aria-selected={isActive}
              aria-label={t('hero.goToSlide', { number: index + 1 })}
              onClick={() => onSelect(index)}
              className={`relative h-1.5 overflow-hidden rounded-full transition-all duration-500 ${
                isActive ? "w-8 bg-white/25 sm:w-10" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            >
              {isActive && (
                <span
                  key={activeIndex}
                  className="absolute inset-y-0 left-0 rounded-full bg-[#00AEEF]"
                  style={{
                    animation: `hero-progress ${duration}ms linear forwards`,
                    animationPlayState: isPaused ? "paused" : "running",
                  }}
                />
              )}
            </button>
          );
        })}
      </div>
    </>
  );
}
