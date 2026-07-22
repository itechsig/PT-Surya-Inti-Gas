import { useState } from 'react';
import { useTranslation } from 'react-i18next';

/* ═══════════════════════════════════════════════════════════════
   COMPANY PROFILE VIDEO.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Linde, Samator, Yingde
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .video-corporate {
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

  /* ── Corporate Video Section ── */
  .video-section {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .video-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Video Header ── */
  .video-header {
    text-align: center;
    margin-bottom: 60px;
  }

  .video-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(96, 165, 250, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.3);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 24px;
  }

  .video-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
  }

  .video-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    max-width: 700px;
    margin: 0 auto;
  }

  /* ── Corporate Video Wrapper ── */
  .video-wrapper {
    position: relative;
    max-width: 1200px;
    margin: 0 auto;
    border-radius: 24px;
    overflow: hidden;
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.4);
    background: var(--navy-dark);
  }

  .video-thumbnail {
    position: relative;
    width: 100%;
    padding-top: 56.25%; /* 16:9 aspect ratio */
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    cursor: pointer;
    overflow: hidden;
  }

  .video-thumbnail-image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
    transition: opacity 0.6s var(--ease);
  }

  .video-thumbnail:hover .video-thumbnail-image {
    opacity: 0.8;
  }

  .video-play-button {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100px;
    height: 100px;
    background: rgba(255, 255, 255, 0.95);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--blue);
    transition: all 0.4s var(--ease);
    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
    z-index: 10;
  }

  .video-play-button svg {
    width: 40px;
    height: 40px;
    margin-left: 4px;
  }

  .video-thumbnail:hover .video-play-button {
    transform: translate(-50%, -50%) scale(1.1);
    background: var(--white);
    box-shadow: 0 25px 70px rgba(30, 64, 175, 0.4);
  }

  .video-thumbnail-text {
    position: absolute;
    bottom: 40px;
    left: 0;
    right: 0;
    text-align: center;
    font-family: var(--ff-display);
    font-size: 1.25rem;
    font-weight: 700;
    color: var(--white);
    letter-spacing: 0.05em;
    z-index: 5;
  }

  /* ── Corporate Modal ── */
  .video-modal {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.95);
    z-index: 9999;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
    opacity: 0;
    visibility: hidden;
    transition: all 0.4s var(--ease);
  }

  .video-modal.active {
    opacity: 1;
    visibility: visible;
  }

  .video-modal-content {
    position: relative;
    max-width: 1200px;
    width: 100%;
    aspect-ratio: 16/9;
    background: var(--navy-dark);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.5);
  }

  .video-modal-close {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 50px;
    height: 50px;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    cursor: pointer;
    transition: all 0.3s var(--ease);
    z-index: 100;
  }

  .video-modal-close:hover {
    background: rgba(255, 255, 255, 0.2);
    border-color: rgba(255, 255, 255, 0.4);
    transform: rotate(90deg);
  }

  .video-modal-video {
    width: 100%;
    height: 100%;
    object-fit: contain;
    background: var(--navy-dark);
  }

  .video-wrapper iframe {
    width: 100%;
    height: 100%;
    aspect-ratio: 16/9;
    border: none;
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .video-section {
      padding: 80px 6vw;
    }

    .video-modal {
      padding: 20px;
    }

    .video-play-button {
      width: 80px;
      height: 80px;
    }

    .video-play-button svg {
      width: 32px;
      height: 32px;
    }
  }

  @media (max-width: 768px) {
    .video-section {
      padding: 60px 6vw;
    }

    .video-modal {
      padding: 10px;
    }

    .video-play-button {
      width: 70px;
      height: 70px;
    }

    .video-play-button svg {
      width: 28px;
      height: 28px;
    }

    .video-thumbnail-text {
      font-size: 1rem;
      bottom: 30px;
    }
  }
`;

export function CompanyProfileVideo() {
  const { t } = useTranslation();
  const [isVideoLoaded, setIsVideoLoaded] = useState(false);

  const handleThumbnailClick = () => {
    setIsVideoLoaded(true);
  };

  return (
    <div className="video-corporate">
      <style>{css}</style>

      <section className="video-section">
        <div className="video-container">
          
          {/* Corporate Video Header */}
          <div className="video-header">
            <div className="video-badge">
              {t('companyProfileVideo.badge')}
            </div>
            <h2 className="video-title">
              {t('companyProfileVideo.title')}
            </h2>
            <p className="video-subtitle">
              {t('companyProfileVideo.subtitle')}
            </p>
          </div>

          {/* Corporate Video Wrapper */}
          <div className="video-wrapper">
            {!isVideoLoaded ? (
              <div 
                className="video-thumbnail" 
                onClick={handleThumbnailClick}
                role="button"
                tabIndex={0}
                aria-label={t('companyProfileVideo.playAria')}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleThumbnailClick();
                  }
                }}
              >
                <img
                  src="https://img.youtube.com/vi/Hxg5_L_vj-w/maxresdefault.jpg"
                  alt={t('companyProfileVideo.thumbnailAlt')}
                  width="634"
                  height="357"
                  loading="lazy"
                  className="video-thumbnail-image"
                />
                <div className="video-play-button">
                  <svg viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
                <div className="video-thumbnail-text">
                  {t('companyProfileVideo.clickToPlay')}
                </div>
              </div>
            ) : (
              <iframe
                className="video-modal-video"
                src="https://www.youtube.com/embed/Hxg5_L_vj-w?autoplay=1&rel=0"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={t('companyProfileVideo.iframeTitle')}
                loading="lazy"
              />
            )}
          </div>

        </div>
      </section>

    </div>
  );
}