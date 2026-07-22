import { ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";

/* ═══════════════════════════════════════════════════════════════
   ABOUT COMPANY.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .about-corporate {
    --navy-dark: #0f172a;
    --navy: #1e293b;
    --blue-dark: #1e3a8a;
    --blue: #1e40af;
    --sky: #3b82f6;
    --sky-light: #60a5fa;
    --white: #ffffff;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ff-display: 'Barlow', system-ui, sans-serif;
    --ff-body: 'DM Sans', system-ui, sans-serif;
    
    font-family: var(--ff-body);
  }

  /* ── Corporate Section ── */
  .about-section {
    position: relative;
    background: rgba(255, 255, 255, 0.95);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .about-section::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-image: url('/gambar about.jpg');
    background-repeat: no-repeat;
    background-position: center;
    background-size: cover;
    opacity: 0.1;
    pointer-events: none;
    z-index: 0;
  }

  .about-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Header ── */
  .about-header {
    text-align: center;
    margin-bottom: 80px;
  }

  .about-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(30, 64, 175, 0.08);
    border: 1px solid rgba(30, 64, 175, 0.15);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--blue);
    margin-bottom: 24px;
  }

  .about-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--navy-dark);
    margin: 0 0 24px;
  }

  .about-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: var(--slate-600);
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Corporate Grid Layout ── */
  .about-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 80px;
    align-items: center;
  }

  /* ── Corporate Image Section ── */
  .about-image-section {
    position: relative;
  }

  .about-main-image {
    position: relative;
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 25px 80px rgba(30, 64, 175, 0.15);
  }

  .about-main-image img {
    width: 100%;
    height: auto;
    display: block;
    transition: transform 0.6s var(--ease);
  }

  .about-main-image:hover img {
    transform: scale(1.05);
  }

  .about-overlay-card {
    position: absolute;
    bottom: -40px;
    right: -40px;
    background: rgba(255, 255, 255, 0.98);
    border-radius: 16px;
    padding: 32px;
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.12);
    max-width: 280px;
    z-index: 10;
  }

  .about-overlay-stat {
    font-family: var(--ff-display);
    font-size: 3rem;
    font-weight: 800;
    color: var(--blue);
    line-height: 1;
    margin-bottom: 8px;
  }

  .about-overlay-label {
    font-family: var(--ff-body);
    font-size: 0.875rem;
    color: var(--slate-600);
    line-height: 1.4;
  }

  /* ── Corporate Content Section ── */
  .about-content-section {
    display: flex;
    flex-direction: column;
    gap: 40px;
    position: relative;
    z-index: 1;
  }

  .about-content-title {
    font-family: var(--ff-display);
    font-size: 2.75rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 20px;
    letter-spacing: -0.01em;
  }

  .about-content-text {
    font-family: var(--ff-body);
    font-size: 1.5rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0 0 32px;
  }

  /* ── Corporate CTA Section ── */
  .about-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 36px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--sky) 100%);
    border: none;
    border-radius: 50px;
    color: var(--white) !important;
    font-family: var(--ff-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    box-shadow: 0 8px 25px rgba(30, 64, 175, 0.4);
    text-decoration: none;
  }
  
  .about-cta svg {
    color: var(--white) !important;
  }

  .about-cta:hover {
    transform: translateY(-3px);
    box-shadow: 0 12px 35px rgba(30, 64, 175, 0.5);
    background: linear-gradient(135deg, var(--blue-dark) 0%, var(--blue) 100%);
    color: var(--white) !important;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .about-grid {
      grid-template-columns: 1fr;
      gap: 60px;
    }

    .about-image-section {
      order: 1;
    }

    .about-content-section {
      order: 2;
    }

    .about-overlay-card {
      right: 20px;
      bottom: -30px;
      max-width: 240px;
    }
  }

  @media (max-width: 768px) {
    .about-section {
      padding: 80px 6vw;
    }

    .about-header {
      margin-bottom: 48px;
    }

    .about-overlay-card {
      position: relative;
      bottom: auto;
      right: auto;
      margin-top: -30px;
      margin-left: auto;
      margin-right: auto;
    }
  }
`;

export function AboutCompany() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "id";

  return (
    <div className="about-corporate" id="about-section">
      <style>{css}</style>

      <section className="about-section">
        <div className="about-container">

          {/* Corporate Header */}
          <div className="about-header">
            <div className="about-badge">
              {t('homeAbout.badge')}
            </div>
            <h2 className="about-title">
              {t('homeAbout.title')}
            </h2>
            <p className="about-subtitle">
              {t('homeAbout.subtitle')}
            </p>
          </div>

          {/* Corporate Grid Layout */}
          <div className="about-grid">

            {/* Corporate Image Section */}
            <div className="about-image-section">
              <div className="about-main-image">
                <img src="/office-optimized.jpg" alt="PT Surya Inti Gas" loading="lazy" width="634" height="476" />
              </div>

              <div className="about-overlay-card">
                <div className="about-overlay-stat">{t('homeAbout.overlayStat')}</div>
                <div className="about-overlay-label">
                  {t('homeAbout.overlayLabel')}
                </div>
              </div>
            </div>

            {/* Corporate Content Section */}
            <div className="about-content-section">

              <div>
                <h3 className="about-content-title">{t('homeAbout.profileTitle')}</h3>
                <p className="about-content-text">
                  {t('homeAbout.profileText')}
                </p>
                <a href={`/${currentLang}/tentang-kami`} className="about-cta">
                  {t('homeAbout.cta')}
                  <ArrowRight size={18} />
                </a>
              </div>

            </div>

          </div>

        </div>
      </section>

    </div>
  );
}