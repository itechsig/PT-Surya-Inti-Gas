import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  .hero-root {
    --navy  : #0C2D5E;
    --blue  : #1565C0;
    --sky   : #29ABE2;
    --aqua  : #38BDF8;
    --ice   : #EFF6FF;
    --muted : #64748B;
    --white : #FFFFFF;
    --ease  : cubic-bezier(0.22, 1, 0.36, 1);
    --ff-d  : 'Barlow', system-ui, sans-serif;
    --ff-b  : 'DM Sans', system-ui, sans-serif;
    font-family: var(--ff-b);
  }

  @keyframes hero-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes hero-lineGrow {
    from { width: 0; opacity: 0; }
    to   { width: 64px; opacity: 1; }
  }
  @keyframes hero-gradFlow {
    0%,100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  @keyframes hero-pulse {
    0%,100% { opacity: 1; transform: scale(1); }
    50%      { opacity: 0.5; transform: scale(0.75); }
  }
  @keyframes hero-waPop {
    from { opacity: 0; transform: scale(0.5) translateY(8px); }
    to   { opacity: 1; transform: scale(1) translateY(0); }
  }
  @keyframes hero-waPulse {
    0%   { box-shadow: 0 0 0 0 rgba(37,211,102,0.55); }
    70%  { box-shadow: 0 0 0 14px rgba(37,211,102,0); }
    100% { box-shadow: 0 0 0 0 rgba(37,211,102,0); }
  }
  @keyframes hero-waTooltip {
    from { opacity: 0; transform: translateY(6px) scale(0.96); }
    to   { opacity: 1; transform: translateY(0) scale(1); }
  }

  .hero-progress {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    height: 3px; background: rgba(255,255,255,0.08); pointer-events: none;
  }
  .hero-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sky), var(--aqua));
    transition: width 0.08s linear;
    border-radius: 0 2px 2px 0;
  }

  .hero-section {
    position: relative; min-height: 100svh;
    display: flex; flex-direction: column; overflow: hidden;
  }

  .hero-video-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .hero-video {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
  }

  .hero-bg-fallback {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0C2D5E 0%, #1565C0 45%, #29ABE2 100%);
    background-size: 300% 300%;
    animation: hero-gradFlow 9s ease infinite;
  }

  .hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(
      to top,
      rgba(0, 0, 0, 0.82) 0%,
      rgba(0, 0, 0, 0.55) 40%,
      rgba(0, 0, 0, 0.30) 70%,
      rgba(0, 0, 0, 0.15) 100%
    );
  }
  .hero-overlay-top {
    position: absolute; top: 0; left: 0; right: 0;
    height: 140px;
    background: linear-gradient(to bottom, rgba(0,0,0,0.45), transparent);
  }
  .hero-overlay-bottom {
    position: absolute; bottom: 0; left: 0; right: 0;
    height: 200px;
    background: linear-gradient(to top, rgba(0,0,0,0.70), transparent);
  }

  .hero-content {
    position: relative; z-index: 2;
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    text-align: center; padding: 100px 5vw 72px;
  }

  .hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 6px 18px; border-radius: 50px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(8px);
    font-family: var(--ff-d);
    font-size: 11px; font-weight: 600; letter-spacing: 0.18em;
    text-transform: uppercase; color: rgba(255,255,255,0.92);
    margin-bottom: 30px;
    animation: hero-fadeUp 0.7s var(--ease) 0.1s both;
  }
  .hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%; background: var(--aqua);
    animation: hero-pulse 2.2s ease-in-out infinite;
    flex-shrink: 0;
  }

  .hero-h1 {
    font-family: var(--ff-d);
    font-size: clamp(3.6rem, 9vw, 7rem);
    font-weight: 800; line-height: 1.0;
    letter-spacing: -0.02em; color: white;
    text-shadow: 0 2px 28px rgba(0,0,0,0.5);
    max-width: 820px;
    animation: hero-fadeUp 0.8s var(--ease) 0.25s both;
  }
  .hero-h1 em {
    font-style: italic; font-weight: 400;
    color: var(--aqua);
  }

  .hero-line {
    height: 3px; border-radius: 9999px;
    background: var(--aqua);
    margin: 20px auto 20px;
    animation: hero-lineGrow 0.9s var(--ease) 0.52s both;
  }

  .hero-tagline {
    font-family: var(--ff-d);
    font-size: clamp(1rem, 2vw, 1.3rem);
    font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.90);
    text-shadow: 0 1px 16px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6);
    letter-spacing: 0.02em;
    margin-top: 0;
    animation: hero-fadeUp 0.8s var(--ease) 0.38s both;
  }

  .hero-desc {
    font-size: clamp(0.88rem, 1.2vw, 1rem);
    line-height: 1.8; font-weight: 300;
    color: rgba(255,255,255,0.60);
    text-shadow: 0 1px 8px rgba(0,0,0,0.45);
    max-width: 500px;
    margin-top: 16px;
    animation: hero-fadeUp 0.8s var(--ease) 0.62s both;
  }

  .hero-stats {
    position: relative; z-index: 2;
    display: flex; align-items: stretch; flex-wrap: wrap;
    background: rgba(10,22,40,0.65);
    backdrop-filter: blur(20px);
    border-top: 1px solid rgba(255,255,255,0.08);
    animation: hero-fadeUp 0.8s var(--ease) 1s both;
  }
  .hero-stat {
    flex: 1 1 120px; padding: 22px 12px;
    display: flex; flex-direction: column; align-items: center;
    border-right: 1px solid rgba(255,255,255,0.07);
    transition: background 0.25s;
  }
  .hero-stat:last-child { border-right: none; }
  .hero-stat:hover { background: rgba(255,255,255,0.04); }
  .hero-stat-num {
    font-family: var(--ff-d);
    font-size: clamp(1.7rem, 2.8vw, 2.2rem);
    font-weight: 800; color: white; line-height: 1;
    letter-spacing: -0.01em;
  }
  .hero-stat-num .accent { color: var(--aqua); font-size: 0.65em; font-weight: 600; }
  .hero-stat-label {
    font-family: var(--ff-d);
    font-size: 10.5px; font-weight: 600; letter-spacing: 0.15em;
    text-transform: uppercase; color: rgba(255,255,255,0.72);
    margin-top: 5px; text-align: center;
  }

  /* ── WhatsApp float ── */
  .hero-wa-wrap {
    position: fixed; bottom: 28px; right: 28px; z-index: 600;
    display: flex; flex-direction: column; align-items: flex-end; gap: 10px;
  }
  .hero-wa-tooltip {
    background: white; border-radius: 12px 12px 4px 12px;
    padding: 12px 16px; width: 260px; max-width: calc(100vw - 56px);
    box-shadow: 0 8px 32px rgba(0,0,0,0.13);
    animation: hero-waTooltip 0.3s var(--ease) both;
    font-family: var(--ff-b); box-sizing: border-box;
    position: relative;
  }
  .hero-wa-tooltip::after {
    content: ''; position: absolute;
    bottom: -8px; right: 18px;
    border-left: 8px solid transparent;
    border-right: 8px solid transparent;
    border-top: 8px solid white;
  }
  .hero-wa-tooltip-header {
    display: flex; align-items: center; gap: 8px; margin-bottom: 8px;
  }
  .hero-wa-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: #25D366;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0;
  }
  .hero-wa-avatar svg { width: 17px; height: 17px; fill: white; }
  .hero-wa-name { font-size: 13px; font-weight: 700; color: #111; }
  .hero-wa-online { font-size: 11px; color: #25D366; }
  .hero-wa-msg {
    font-size: 13px; color: #444; line-height: 1.5; margin: 0 0 10px;
    word-break: break-word;
  }
  .hero-wa-start {
    width: 100%; background: #25D366; color: white;
    border: none; border-radius: 6px; padding: 8px;
    font-size: 12px; font-weight: 700; cursor: pointer;
    font-family: var(--ff-b); letter-spacing: 0.06em;
    transition: background 0.2s;
  }
  .hero-wa-start:hover { background: #1EB258; }

  .hero-wa-btn {
    width: 56px; height: 56px; border-radius: 50%;
    background: #25D366; border: none; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    animation: hero-waPop 0.25s var(--ease) 1s both, hero-waPulse 2.6s ease-in-out 1.5s infinite;
    box-shadow: 0 6px 24px rgba(37,211,102,0.48);
    transition: transform 0.2s;
  }
  .hero-wa-btn:hover { transform: scale(1.1); }
  .hero-wa-btn svg { width: 27px; height: 27px; fill: white; }

  @media (max-width: 768px) {
    .hero-stat { flex: 1 1 50%; }
    .hero-stat:nth-child(2) { border-right: none; }
  }
`;

const WaIcon = () => (
  <svg viewBox="0 0 32 32" xmlns="http://www.w3.org/2000/svg">
    <path d="M16.003 2.667C8.636 2.667 2.667 8.636 2.667 16c0 2.37.627 4.59 1.72 6.512L2.667 29.333l6.987-1.693A13.28 13.28 0 0016.003 29.333C23.37 29.333 29.333 23.364 29.333 16S23.37 2.667 16.003 2.667zm6.003 18.077c-.33-.166-1.944-.96-2.245-1.07-.302-.109-.52-.166-.74.166-.22.33-.847 1.07-1.04 1.29-.19.22-.384.248-.714.083-.33-.166-1.394-.514-2.655-1.637-.981-.875-1.644-1.956-1.837-2.286-.192-.33-.02-.508.145-.672.148-.148.33-.385.494-.578.165-.192.22-.33.33-.55.11-.22.055-.413-.027-.578-.083-.165-.74-1.786-1.014-2.444-.267-.64-.537-.553-.74-.564-.19-.01-.412-.012-.633-.012s-.578.083-.88.413c-.303.33-1.155 1.129-1.155 2.752s1.183 3.19 1.348 3.412c.165.22 2.327 3.556 5.64 4.99.788.34 1.403.543 1.883.695.79.25 1.51.215 2.079.13.634-.093 1.944-.795 2.218-1.562.275-.768.275-1.426.193-1.563-.082-.137-.302-.22-.632-.385z" />
  </svg>
);

export function Hero() {
  const { t } = useTranslation();
  const [scrollPct, setScrollPct] = useState(0);
  const [waVisible, setWaVisible] = useState(false);
  const [waOpen, setWaOpen]       = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const sy  = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (sy / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t1 = setTimeout(() => setWaVisible(true), 1000);
    return () => clearTimeout(t1);
  }, []);

  const handleWaClick = () => {
    const msg = encodeURIComponent(t('hero.description'));
    window.open(`https://wa.me/6281234567890?text=${msg}`, "_blank");
  };

  return (
    <div className="hero-root">
      <style>{css}</style>

      <div className="hero-progress">
        <div className="hero-progress-fill" style={{ width: `${scrollPct}%` }} />
      </div>

      <section id="hero" className="hero-section">

        <div className="hero-video-wrap">
          <video
            className="hero-video"
            autoPlay muted loop playsInline
            poster="/hero-poster.jpg"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        <div className="hero-overlay" />
        <div className="hero-overlay-top" />
        <div className="hero-overlay-bottom" />

        <div className="hero-content">

          <div className="hero-badge">
            <span className="hero-badge-dot" />
            {t('hero.badge')}
          </div>

          <h1 className="hero-h1">
            Surya Inti <em>Gas</em>
          </h1>

          <div className="hero-line" style={{ width: 64 }} />

          <div className="hero-tagline">
            {t('hero.tagline')}
          </div>

          <p className="hero-desc">
            Distributor gas industri & medis terpercaya di Indonesia —<br />
            Oksigen, Nitrogen, dan gas khusus untuk manufaktur, medis, dan energi.
          </p>

        </div>
      </section>

      {waVisible && (
        <div className="hero-wa-wrap">
          {waOpen && (
            <div className="hero-wa-tooltip">
              <div className="hero-wa-tooltip-header">
                <div className="hero-wa-avatar"><WaIcon /></div>
                <div>
                  <div className="hero-wa-name">Surya Inti Gas</div>
                  <div className="hero-wa-online">● Online sekarang</div>
                </div>
              </div>
              <p className="hero-wa-msg">
                {t('hero.description')}
              </p>
              <button className="hero-wa-start" onClick={handleWaClick}>
                {t('common.submit')} →
              </button>
            </div>
          )}
          <button
            className="hero-wa-btn"
            aria-label="Chat WhatsApp"
            onClick={() => setWaOpen((p) => !p)}
          >
            <WaIcon />
          </button>
        </div>
      )}
    </div>
  );
}
