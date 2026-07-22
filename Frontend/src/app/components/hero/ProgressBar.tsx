interface ProgressBarProps {
  activeIndex: number;
  duration: number;
  isPaused: boolean;
}

export function ProgressBar({ activeIndex, duration, isPaused }: ProgressBarProps) {
  return (
    <div
      className="h-[3px] w-full overflow-hidden rounded-full bg-white/20"
      role="presentation"
    >
      <div
        key={activeIndex}
        className="h-full rounded-full"
        style={{
          background: "linear-gradient(90deg, #00AEEF, #7fd8ff)",
          animation: `hero-progress ${duration}ms linear forwards`,
          animationPlayState: isPaused ? "paused" : "running",
        }}
      />
    </div>
  );
}
