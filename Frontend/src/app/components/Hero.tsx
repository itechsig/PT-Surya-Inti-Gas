import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────────
   HERO.TSX — PT Surya Inti Gas
   Tema   : Minimalis, Biru & Putih
   Video  : Ganti src di <video> tag dengan file
            video kamu (MP4 recommended).
───────────────────────────────────────────── */

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Barlow:ital,wght@0,400;0,500;0,600;0,700;0,800;1,300;1,400&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600&display=swap');

  /* ── Variables ── */
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

  /* ── Keyframes ── */
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

  /* ── Scroll progress bar ── */
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

  /* ── Hero section ── */
  .hero-section {
    position: relative; min-height: 100svh;
    display: flex; flex-direction: column; overflow: hidden;
  }

  /* Video background */
  .hero-video-wrap { position: absolute; inset: 0; z-index: 0; overflow: hidden; }
  .hero-video {
    width: 100%; height: 100%;
    object-fit: cover; object-position: center;
  }

  /* Fallback gradient */
  .hero-bg-fallback {
    position: absolute; inset: 0;
    background: linear-gradient(135deg, #0C2D5E 0%, #1565C0 45%, #29ABE2 100%);
    background-size: 300% 300%;
    animation: hero-gradFlow 9s ease infinite;
  }

  /* Overlay — gradient dari bawah ke atas agar foto lebih hidup di bagian atas */
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
  /* Overlay tambahan dari atas untuk navbar area tetap terbaca */
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

  /* ── Main content ── */
  .hero-content {
    position: relative; z-index: 2;
    flex: 1; display: flex; flex-direction: column;
    justify-content: center; align-items: center;
    text-align: center; padding: 100px 5vw 72px;
  }

  /* Badge / eyebrow */
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

  /* ── OPSI A: Headline — lebih besar & dominan ── */
  .hero-h1 {
    font-family: var(--ff-d);
    /* Dinaikkan dari 5.6rem → 7rem agar nama jauh lebih dominan */
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

  /* ── OPSI A: Divider biru — solid, bukan fade ── */
  .hero-line {
    height: 3px; border-radius: 9999px;
    /* Warna solid penuh agar lebih tegas sebagai pemisah */
    background: var(--aqua);
    margin: 20px auto 20px;
    animation: hero-lineGrow 0.9s var(--ease) 0.52s both;
  }

  /* ── OPSI A: Tagline — medium italic, lebih kecil dari nama ── */
  .hero-tagline {
    font-family: var(--ff-d);
    /* Dikecilkan dari 1.6rem → 1.3rem agar kontras dengan nama */
    font-size: clamp(1rem, 2vw, 1.3rem);
    font-weight: 300; font-style: italic;
    color: rgba(255,255,255,0.90);
    text-shadow: 0 1px 16px rgba(0,0,0,0.75), 0 2px 6px rgba(0,0,0,0.6);
    letter-spacing: 0.02em;
    margin-top: 0;
    animation: hero-fadeUp 0.8s var(--ease) 0.38s both;
  }

  /* ── OPSI A: Body copy — singkat 2 baris, warna muted ── */
  .hero-desc {
    font-size: clamp(0.88rem, 1.2vw, 1rem);
    line-height: 1.8; font-weight: 300;
    /* Lebih muted agar tidak bersaing dengan tagline */
    color: rgba(255,255,255,0.60);
    text-shadow: 0 1px 8px rgba(0,0,0,0.45);
    max-width: 500px;
    margin-top: 16px;
    animation: hero-fadeUp 0.8s var(--ease) 0.62s both;
  }

  /* ── Stats bar ── */
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

  /* ── Responsive ── */
  @media (max-width: 768px) {
    .hero-stat { flex: 1 1 50%; }
    .hero-stat:nth-child(2) { border-right: none; }
  }
`;

/* ══════════════════════════════════════════════
   MAIN HERO COMPONENT
══════════════════════════════════════════════ */
export function Hero() {
  const { t } = useTranslation();
  const [scrollPct, setScrollPct] = useState(0);

  /* ── Scroll listener ── */
  useEffect(() => {
    const onScroll = () => {
      const sy  = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setScrollPct(max > 0 ? (sy / max) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="hero-root">
      <style>{css}</style>

      {/* ── Scroll progress ── */}
      <div className="hero-progress">
        <div className="hero-progress-fill" style={{ width: `${scrollPct}%` }} />
      </div>

      {/* ══ HERO SECTION ══ */}
      <section id="hero" className="hero-section">

        {/* ── Video Background ── */}
        <div className="hero-video-wrap">
          <video
            className="hero-video"
            autoPlay muted loop playsInline
            poster="/hero-poster.jpg"
          >
            <source src="/hero-video.mp4" type="video/mp4" />
          </video>
        </div>

        {/* Overlay */}
        <div className="hero-overlay" />
        <div className="hero-overlay-top" />
        <div className="hero-overlay-bottom" />

        {/* ── Content ── */}
        <div className="hero-content">

          {/* Eyebrow badge */}
          <div className="hero-badge">
            <span className="hero-badge-dot" />
            {t('hero.badge')}
          </div>

          {/* OPSI A: Nama perusahaan — sangat besar & dominan */}
          <h1 className="hero-h1">
            Surya Inti <em>Gas</em>
          </h1>

          {/* OPSI A: Divider biru solid sebagai pemisah */}
          <div className="hero-line" style={{ width: 64 }} />

          {/* OPSI A: Tagline — ukuran menengah, italic, berbeda dari nama */}
          <div className="hero-tagline">
            {t('hero.tagline')}
          </div>

          {/* OPSI A: Body copy singkat 2 baris, warna muted */}
          <p className="hero-desc">
            Distributor gas industri & medis terpercaya di Indonesia —<br />
            Oksigen, Nitrogen, dan gas khusus untuk manufaktur, medis, dan energi.
          </p>

        </div>
      </section>

    </div>
  );
}
