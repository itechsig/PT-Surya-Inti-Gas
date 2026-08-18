import { useTranslation } from "react-i18next";

interface SliderControlsProps {
  total: number;
  activeIndex: number;
  duration: number;
  isPaused: boolean;
  onSelect: (index: number) => void;
}

export function SliderControls({
  total,
  activeIndex,
  duration,
  isPaused,
  onSelect,
}: SliderControlsProps) {
  const { t } = useTranslation();
  return (
    <>
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
