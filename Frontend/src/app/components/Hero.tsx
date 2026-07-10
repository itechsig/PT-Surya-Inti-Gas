import { useState, useEffect, useRef } from "react";
import { ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   HERO.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Air Liquide, Linde, Messer
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .hero-corporate {
    --navy-dark  : #0f172a;
    --navy       : #1e293b;
    --blue-dark  : #1e3a8a;
    --blue       : #1e40af;
    --sky        : #3b82f6;
    --sky-light  : #60a5fa;
    --white      : #ffffff;
    --slate-50   : #f8fafc;
    --slate-100  : #f1f5f9;
    --slate-200  : #e2e8f0;
    --slate-600  : #475569;
    --slate-700  : #334155;
    --slate-800  : #1e293b;
    --slate-900  : #0f172a;
    
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ff-display: 'Barlow', system-ui, sans-serif;
    --ff-body: 'DM Sans', system-ui, sans-serif;
    
    font-family: var(--ff-body);
  }

  /* ── Corporate Keyframes ── */
  @keyframes corporate-fadeUp {
    from { opacity: 0; transform: translateY(40px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes corporate-fadeIn {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  
  @keyframes corporate-scale {
    from { opacity: 0; transform: scale(0.95); }
    to   { opacity: 1; transform: scale(1); }
  }
  
  @keyframes corporate-slideIn {
    from { opacity: 0; transform: translateX(-30px); }
    to   { opacity: 1; transform: translateX(0); }
  }
  
  @keyframes corporate-gradient {
    0%, 100% { background-position: 0% 50%; }
    50%      { background-position: 100% 50%; }
  }
  
  @keyframes corporate-pulse {
    0%, 100% { transform: scale(1); opacity: 1; }
    50%      { transform: scale(1.05); opacity: 0.8; }
  }

  /* Enhanced entrance animations */
  @keyframes corporate-staggerFadeUp {
    0% { opacity: 0; transform: translateY(60px); }
    100% { opacity: 1; transform: translateY(0); }
  }

  @keyframes corporate-reveal {
    0% { opacity: 0; transform: translateY(20px) scale(0.98); }
    100% { opacity: 1; transform: translateY(0) scale(1); }
  }

  @keyframes corporate-textReveal {
    0% { opacity: 0; transform: translateY(30px); filter: blur(10px); }
    100% { opacity: 1; transform: translateY(0); filter: blur(0); }
  }

  @keyframes corporate-heroEntrance {
    0% { 
      opacity: 0; 
      transform: scale(1.1) translateY(20px);
      filter: brightness(0.8);
    }
    100% { 
      opacity: 1; 
      transform: scale(1) translateY(0);
      filter: brightness(1);
    }
  }

  /* ── Corporate Scroll Progress ── */
  .corporate-progress {
    position: fixed; top: 0; left: 0; right: 0; z-index: 9999;
    height: 3px; background: rgba(255,255,255,0.1); pointer-events: none;
  }
  .corporate-progress-fill {
    height: 100%;
    background: linear-gradient(90deg, var(--sky), var(--sky-light), var(--sky));
    background-size: 200% 100%;
    animation: corporate-gradient 3s ease infinite;
    transition: width 0.1s linear;
  }

  /* ── Corporate Hero Section ── */
  .corporate-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    animation: corporate-heroEntrance 1.8s var(--ease) both;
    position: relative;
    z-index: 1;
  }
  
  .corporate-hero::before {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    z-index: -1;
  }

  /* ── Video Background ── */
  .corporate-video-wrap {
    position: absolute;
    inset: 0;
    z-index: 0;
    overflow: hidden;
    animation: corporate-fadeIn 2s var(--ease) 0.3s both;
  }
  
  .corporate-video {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center;
    opacity: 0.4;
  }

  /* ── Corporate Overlay ── */
  .corporate-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to top,
      rgba(15, 23, 42, 0.95) 0%,
      rgba(15, 23, 42, 0.8) 30%,
      rgba(30, 41, 59, 0.6) 60%,
      rgba(30, 41, 59, 0.4) 85%,
      rgba(30, 41, 59, 0.3) 100%
    );
    z-index: 1;
    animation: corporate-fadeIn 1.5s var(--ease) 0.5s both;
  }
  
  .corporate-overlay-top {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 150px;
    background: linear-gradient(to bottom, rgba(15, 23, 42, 0.8), transparent);
    z-index: 1;
    animation: corporate-fadeIn 1.2s var(--ease) 0.6s both;
  }

  /* ── Corporate Content ── */
  .corporate-content {
    position: relative;
    z-index: 2;
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    text-align: center;
    padding: 140px 6vw 100px;
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Badge ── */
  .corporate-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(59, 130, 246, 0.15);
    border: 1px solid rgba(59, 130, 246, 0.3);
    backdrop-filter: blur(12px);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.95);
    margin-bottom: 40px;
    animation: corporate-reveal 0.8s var(--ease) 0.1s both;
  }
  
  .corporate-badge-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #60a5fa;
    animation: corporate-pulse 2s ease-in-out infinite;
    flex-shrink: 0;
    box-shadow: 0 0 10px rgba(59, 130, 246, 0.5);
  }

  /* ── Corporate Headline ── */
  .corporate-h1 {
    font-family: var(--ff-display);
    font-size: clamp(3.5rem, 8vw, 6.5rem);
    font-weight: 800;
    line-height: 0.95;
    letter-spacing: -0.03em;
    color: var(--white);
    text-shadow: 0 4px 30px rgba(0, 0, 0, 0.5);
    max-width: 1200px;
    margin: 0 0 30px 0;
    animation: corporate-textReveal 1.4s var(--ease) 0.25s both;
  }
  
  .corporate-h1 em {
    font-style: normal;
    font-weight: 800;
    color: var(--white);
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
  }

  /* ── Corporate Tagline ── */
  .corporate-tagline {
    font-family: var(--ff-display);
    font-size: clamp(1.25rem, 2.5vw, 1.75rem);
    font-weight: 400;
    font-style: italic;
    color: rgba(255, 255, 255, 0.9);
    text-shadow: 0 2px 20px rgba(0, 0, 0, 0.5);
    letter-spacing: 0.02em;
    max-width: 900px;
    margin: 0 0 25px 0;
    animation: corporate-staggerFadeUp 1.2s var(--ease) 0.4s both;
  }

  /* ── Corporate Description ── */
  .corporate-description {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.15rem);
    font-weight: 300;
    line-height: 1.8;
    color: rgba(255, 255, 255, 0.8);
    max-width: 700px;
    margin: 0 auto 40px;
    animation: corporate-staggerFadeUp 1.1s var(--ease) 0.55s both;
  }

  /* ── Corporate Stats Bar ── */
  .corporate-stats {
    position: relative;
    z-index: 2;
    display: flex;
    align-items: stretch;
    flex-wrap: wrap;
    background: rgba(15, 23, 42, 0.85);
    backdrop-filter: blur(30px);
    border-top: 1px solid rgba(59, 130, 246, 0.2);
    animation: corporate-fadeUp 1.2s var(--ease) 0.8s both;
  }
  
  .corporate-stat {
    flex: 1 1 180px;
    padding: 40px 24px;
    display: flex;
    flex-direction: column;
    align-items: center;
    border-right: 1px solid rgba(255, 255, 255, 0.1);
    transition: all 0.4s var(--ease);
    position: relative;
    overflow: hidden;
  }
  
  .corporate-stat::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), transparent);
    opacity: 0;
    transition: opacity 0.4s var(--ease);
  }
  
  .corporate-stat:last-child {
    border-right: none;
  }
  
  .corporate-stat:hover {
    background: rgba(255, 255, 255, 0.05);
    transform: translateY(-5px);
  }
  
  .corporate-stat:hover::before {
    opacity: 1;
  }
  
  .corporate-stat-icon {
    width: 48px;
    height: 48px;
    color: #60a5fa;
    margin-bottom: 16px;
  }
  
  .corporate-stat-num {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 4vw, 3.5rem);
    font-weight: 800;
    color: var(--white);
    line-height: 1;
    letter-spacing: -0.02em;
    text-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
    position: relative;
    z-index: 1;
  }
  
  .corporate-stat-num .accent {
    color: #60a5fa;
    font-size: 0.5em;
    font-weight: 700;
  }
  
  .corporate-stat-label {
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.18em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.8);
    margin-top: 12px;
    text-align: center;
    position: relative;
    z-index: 1;
  }

  /* ── Corporate Scroll Indicator ── */
  .corporate-scroll {
    position: absolute;
    bottom: 30px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 2;
    animation: corporate-pulse 2s ease-in-out infinite;
  }
  
  .corporate-scroll-icon {
    width: 40px;
    height: 40px;
    color: rgba(255, 255, 255, 0.5);
    border: 2px solid rgba(255, 255, 255, 0.3);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.3s var(--ease);
  }
  
  .corporate-scroll-icon:hover {
    color: rgba(255, 255, 255, 0.8);
    border-color: rgba(255, 255, 255, 0.5);
  }

  /* ── Responsive ── */
  @media (max-width: 1024px) {
    .corporate-stat {
      flex: 1 1 50%;
      padding: 32px 20px;
    }
    
    .corporate-stat:nth-child(2) {
      border-right: none;
    }
    
    .corporate-stat:nth-child(4) {
      border-right: none;
    }
  }

  @media (max-width: 768px) {
    .corporate-stat {
      flex: 1 1 100%;
      border-right: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    }
    
    .corporate-stat:last-child {
      border-bottom: none;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   CORPORATE HERO COMPONENT
══════════════════════════════════════════════════════════════ */
export function Hero() {
  const [scrollPct, setScrollPct] = useState(0);
  const [videoError, setVideoError] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  /* Scroll listener */
  useEffect(() => {
    const onScroll = () => {
      const sy = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (sy / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleVideoError = () => {
    console.error('Video failed to load, using fallback background');
    setVideoError(true);
  };

  return (
    <div className="hero-corporate">
      <style>{css}</style>

      {/* Corporate Scroll Progress */}
      <div className="corporate-progress">
        <div className="corporate-progress-fill" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* Corporate Hero Section */}
      <section className="corporate-hero">

        {/* Video Background */}
        <div className="corporate-video-wrap" style={{
          background: videoError ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)' : undefined
        }}>
          {!videoError && (
            <video
              ref={videoRef}
              className="corporate-video"
              autoPlay
              muted
              loop
              playsInline
              preload="auto"
              onError={handleVideoError}
              onCanPlay={() => {
                if (videoRef.current) {
                  videoRef.current.play().catch(err => {
                    console.log('Autoplay prevented:', err);
                  });
                }
              }}
            >
              <source src="/hero-video.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>

        {/* Corporate Overlay */}
        <div className="corporate-overlay" />
        <div className="corporate-overlay-top" />

        {/* Corporate Content */}
        <div className="corporate-content">

          {/* Corporate Badge */}
          <div className="corporate-badge">
            <span className="corporate-badge-dot" />
            Solusi Industri Gas Terpercaya
          </div>

          {/* Corporate Headline */}
          <h1 className="corporate-h1">
            Surya Inti <em>Gas</em>
          </h1>

          {/* Corporate Tagline */}
          <div className="corporate-tagline">
            Solusi Gas Inovatif dan Berkelanjutan Untuk Masa Depan Industri Indonesia
          </div>

          {/* Corporate Description */}
          <p className="corporate-description">
            Sejak 2003, Surya Inti Gas menghadirkan solusi gas berkualitas dengan layanan profesional dan distribusi yang andal.
          </p>

        </div>

        {/* Corporate Scroll Indicator */}
        <div className="corporate-scroll">
          <div className="corporate-scroll-icon">
            <ArrowRight size={20} style={{ transform: 'rotate(90deg)' }} />
          </div>
        </div>

      </section>

    </div>
  );
}