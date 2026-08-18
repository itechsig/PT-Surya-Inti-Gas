import { ArrowRight, Award } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { motion, type Variants } from "motion/react";

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
    grid-template-columns: 1.15fr 1fr;
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
    min-height: 560px;
  }

  .about-main-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
    transition: transform 0.6s var(--ease);
  }

  .about-main-image:hover img {
    transform: scale(1.05);
  }

  .about-overlay-card {
    position: absolute;
    bottom: 20px;
    left: 20px;
    display: flex;
    align-items: center;
    gap: 14px;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(14px) saturate(160%);
    -webkit-backdrop-filter: blur(14px) saturate(160%);
    border: 1px solid rgba(255, 255, 255, 0.18);
    border-radius: 16px;
    padding: 14px 20px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25);
    max-width: calc(100% - 40px);
    z-index: 10;
    transition: transform 0.35s var(--ease), background 0.35s var(--ease);
  }

  .about-overlay-card:hover {
    transform: translateY(-3px);
    background: rgba(15, 23, 42, 0.68);
  }

  .about-overlay-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--sky) 0%, var(--sky-light) 100%);
    color: var(--white);
    transition: transform 0.35s var(--ease);
  }

  .about-overlay-card:hover .about-overlay-icon {
    transform: scale(1.08) rotate(-4deg);
  }

  .about-overlay-text {
    display: flex;
    flex-direction: column;
    gap: 2px;
  }

  .about-overlay-stat {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 800;
    color: var(--white);
    line-height: 1.1;
    letter-spacing: -0.01em;
  }

  .about-overlay-label {
    font-family: var(--ff-body);
    font-size: 0.75rem;
    color: rgba(255, 255, 255, 0.85);
    line-height: 1.3;
    max-width: 170px;
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
    position: relative;
    overflow: hidden;
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

  .about-cta::before {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.25), transparent);
    transition: left 0.5s ease;
  }

  .about-cta:hover::before {
    left: 100%;
  }

  .about-cta svg {
    color: var(--white) !important;
    transition: transform 0.3s var(--ease);
  }

  .about-cta:hover svg {
    transform: translateX(3px);
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

    .about-main-image {
      min-height: 420px;
    }
  }

  @media (max-width: 768px) {
    .about-section {
      padding: 80px 6vw;
    }

    .about-header {
      margin-bottom: 48px;
    }

    .about-main-image {
      min-height: 320px;
    }

    .about-overlay-card {
      left: 14px;
      bottom: 14px;
      padding: 10px 16px;
      gap: 10px;
    }

    .about-overlay-icon {
      width: 32px;
      height: 32px;
    }

    .about-overlay-stat {
      font-size: 1.25rem;
    }

    .about-overlay-label {
      font-size: 0.7rem;
      max-width: 140px;
    }
  }
`;

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

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
          <motion.div
            className="about-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="about-title" variants={fadeUp}>
              {t('homeAbout.title')}
            </motion.h2>
            <motion.p className="about-subtitle" variants={fadeUp}>
              {t('homeAbout.subtitle')}
            </motion.p>
          </motion.div>

          {/* Corporate Grid Layout */}
          <motion.div
            className="about-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {/* Corporate Image Section */}
            <motion.div className="about-image-section" variants={fadeUp}>
              <div className="about-main-image">
                <img src="/office-optimized.jpg" alt="PT Surya Inti Gas" loading="lazy" width="634" height="476" />
              </div>

              <motion.div className="about-overlay-card" variants={fadeUp}>
                <div className="about-overlay-icon">
                  <Award size={18} />
                </div>
                <div className="about-overlay-text">
                  <div className="about-overlay-stat">{t('homeAbout.overlayStat')}</div>
                  <div className="about-overlay-label">
                    {t('homeAbout.overlayLabel')}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Corporate Content Section */}
            <motion.div className="about-content-section" variants={fadeUp}>
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
            </motion.div>
          </motion.div>

        </div>
      </section>

    </div>
  );
}