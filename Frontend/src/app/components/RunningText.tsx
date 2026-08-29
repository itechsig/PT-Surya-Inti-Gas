import { useTranslation } from "react-i18next";

const css = `
  .running-text-container {
    position: relative;
    width: 100%;
    overflow: hidden;
    background: linear-gradient(135deg, var(--brand-navy, #1e40af) 0%, var(--brand-blue, #3b82f6) 100%);
    padding: 16px 0;
  }

  .running-text-wrapper {
    display: flex;
    width: 100%;
    overflow: hidden;
  }

  .running-text-content {
    display: flex;
    animation: scroll 30s linear infinite;
    white-space: nowrap;
  }

  /* Pause the ticker when the pointer or keyboard focus is on it. */
  .running-text-container:hover .running-text-content,
  .running-text-container:focus-within .running-text-content {
    animation-play-state: paused;
  }

  .running-text-item {
    display: flex;
    align-items: center;
    padding: 0 40px;
    font-family: 'Barlow', system-ui, sans-serif;
    font-size: 1.25rem;
    font-weight: 600;
    color: #ffffff;
    letter-spacing: 0.05em;
  }

  .running-text-item::after {
    content: '•';
    margin-left: 40px;
    color: #60a5fa;
    font-size: 1.5rem;
  }

  .running-text-item:last-child::after {
    content: '';
  }

  @keyframes scroll {
    0% {
      transform: translateX(0);
    }
    100% {
      transform: translateX(-50%);
    }
  }

  /* Reduced motion: hold the ticker still at its start instead of
     freezing it mid-scroll (which would clip half the messages). */
  @media (prefers-reduced-motion: reduce) {
    .running-text-content {
      animation: none;
      transform: translateX(0);
    }
  }

  @media (max-width: 768px) {
    .running-text-item {
      font-size: 1rem;
      padding: 0 24px;
    }

    .running-text-item::after {
      margin-left: 24px;
      font-size: 1.25rem;
    }
  }
`;

export function RunningText() {
  const { t } = useTranslation();
  const textItems = t('runningText.items', { returnObjects: true }) as string[];

  return (
    <div className="running-text-container">
      <style>{css}</style>
      <div className="running-text-wrapper">
        <div className="running-text-content" data-marquee>
          {textItems.map((item, index) => (
            <div key={index} className="running-text-item">
              {item}
            </div>
          ))}
          {/* Duplicate for seamless loop — hidden from assistive tech */}
          {textItems.map((item, index) => (
            <div key={`duplicate-${index}`} className="running-text-item" aria-hidden="true">
              {item}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
