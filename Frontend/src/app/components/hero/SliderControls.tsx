import { Pause, Play } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SliderControlsProps {
  total: number;
  activeIndex: number;
  duration: number;
  isPaused: boolean;
  userPaused: boolean;
  onTogglePause: () => void;
  onSelect: (index: number) => void;
}

export function SliderControls({
  total,
  activeIndex,
  duration,
  isPaused,
  userPaused,
  onTogglePause,
  onSelect,
}: SliderControlsProps) {
  const { t } = useTranslation();
  return (
    <div className="absolute inset-x-0 bottom-7 z-20 flex items-center justify-center gap-4 px-6">
      <button
        type="button"
        onClick={onTogglePause}
        aria-pressed={userPaused}
        aria-label={userPaused ? t("hero.play", "Play slideshow") : t("hero.pause", "Pause slideshow")}
        className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20"
      >
        {userPaused ? <Play size={16} className="translate-x-px" aria-hidden="true" /> : <Pause size={16} aria-hidden="true" />}
      </button>

      <div
        className="flex items-center gap-3 sm:gap-4"
        role="group"
        aria-label={t("hero.slideIndicators")}
      >
        {Array.from({ length: total }).map((_, index) => {
          const isActive = index === activeIndex;
          return (
            <button
              key={index}
              type="button"
              aria-label={t("hero.goToSlide", { number: index + 1 })}
              aria-current={isActive ? "true" : undefined}
              onClick={() => onSelect(index)}
              className={`relative h-1.5 rounded-full transition-all duration-500 before:absolute before:left-1/2 before:top-1/2 before:h-6 before:w-6 before:-translate-x-1/2 before:-translate-y-1/2 before:content-[''] ${
                isActive ? "w-8 bg-white/25 sm:w-10" : "w-1.5 bg-white/40 hover:bg-white/60"
              }`}
            >
              {isActive && (
                <span
                  key={activeIndex}
                  className="absolute inset-y-0 left-0 w-full origin-left rounded-full bg-brand-sky"
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
    </div>
  );
}
