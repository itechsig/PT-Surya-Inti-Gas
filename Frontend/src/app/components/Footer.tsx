import { Link, useParams } from "react-router-dom";
import { Instagram, Mail, Phone, MapPin, ChevronRight } from "lucide-react";
import { useTranslation } from 'react-i18next';

// TikTok icon component (SVG)
const TikTok = ({ size = 18, className = "" }: { size?: number; className?: string }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
  </svg>
);

/* ═══════════════════════════════════════════════════════════════
   CORPORATE FOOTER — PT Surya Inti Gas
   Corporate Design inspired by Air Liquide, Linde, Messer
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Footer Variables ── */
  .corporate-footer {
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
    background: var(--navy-dark);
    color: var(--white);
  }

  /* ── Corporate Footer Main ── */
  .corporate-footer-main {
    padding: 80px 0 60px;
    max-width: 1400px;
    margin: 0 auto;
    padding-left: 24px;
    padding-right: 24px;
  }

  .corporate-footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr 1fr 1fr;
    gap: 40px;
  }

  /* ── Corporate Footer Company Section ── */
  .corporate-footer-company {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .corporate-footer-logo {
    display: flex;
    align-items: center;
    gap: 16px;
    text-decoration: none;
  }

  .corporate-footer-logo img {
    height: 48px;
    width: auto;
    object-contain;
  }

  .corporate-footer-logo-text {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .corporate-footer-logo-text .name {
    font-family: var(--ff-display);
    font-size: 16px;
    font-weight: 800;
    letter-spacing: 0.12em;
    color: var(--white);
    line-height: 1.2;
  }

  .corporate-footer-logo-text .tagline {
    font-family: var(--ff-display);
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.24em;
    text-transform: uppercase;
    color: var(--sky-light);
  }

  .corporate-footer-description {
    font-family: var(--ff-body);
    font-size: 0.9375rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 0;
  }

  .corporate-footer-contact {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .corporate-footer-contact-title {
    font-family: var(--ff-display);
    font-size: 0.875rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--sky-light);
    margin-bottom: 8px;
  }

  .corporate-footer-contact-item {
    display: flex;
    align-items: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    font-family: var(--ff-body);
    font-size: 0.875rem;
    transition: all 0.3s var(--ease);
  }

  .corporate-footer-contact-item:hover {
    color: var(--white);
    gap: 16px;
  }

  .corporate-footer-contact-item svg {
    width: 18px;
    height: 18px;
    color: var(--sky-light);
    flex-shrink: 0;
  }

  /* ── Corporate Footer Columns ── */
  .corporate-footer-column {
    display: flex;
    flex-direction: column;
    gap: 24px;
  }

  .corporate-footer-column-title {
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin: 0;
    padding-bottom: 16px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.15);
  }

  .corporate-footer-links {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .corporate-footer-link {
    color: rgba(255, 255, 255, 0.7);
    text-decoration: none;
    font-family: var(--ff-body);
    font-size: 0.9375rem;
    font-weight: 300;
    line-height: 1.5;
    transition: all 0.3s var(--ease);
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .corporate-footer-link:hover {
    color: var(--sky-light);
    gap: 12px;
  }

  .corporate-footer-link svg {
    width: 16px;
    height: 16px;
    opacity: 0.6;
    transition: opacity 0.3s var(--ease);
  }

  .corporate-footer-link:hover svg {
    opacity: 1;
  }

  /* ── Corporate Footer CTA Section ── */
  .corporate-footer-cta {
    background: linear-gradient(135deg, rgba(30, 64, 175, 0.3), rgba(59, 130, 246, 0.2));
    border: 1px solid rgba(59, 130, 246, 0.3);
    border-radius: 16px;
    padding: 24px;
    text-align: center;
  }

  .corporate-footer-cta h4 {
    font-family: var(--ff-display);
    font-size: 1rem;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 12px;
    letter-spacing: 0.02em;
  }

  .corporate-footer-cta p {
    font-family: var(--ff-body);
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.8);
    margin: 0 0 16px;
    line-height: 1.5;
  }

  .corporate-footer-cta-button {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 12px 28px;
    background: var(--white);
    color: var(--blue);
    border: none;
    border-radius: 50px;
    font-family: var(--ff-display);
    font-size: 12px;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    text-decoration: none;
  }

  .corporate-footer-cta-button:hover {
    background: var(--sky-light);
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(59, 130, 246, 0.3);
  }

  /* ── Corporate Footer Social ── */
  .corporate-footer-social {
    display: flex;
    gap: 12px;
    margin-top: 24px;
  }

  .corporate-footer-social-link {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    color: var(--white);
    text-decoration: none;
    transition: all 0.3s var(--ease);
  }

  .corporate-footer-social-link:hover {
    background: var(--blue);
    border-color: var(--blue);
    transform: translateY(-3px);
  }

  .corporate-footer-social-link svg {
    width: 18px;
    height: 18px;
  }

  /* ── Corporate Footer Bottom ── */
  .corporate-footer-bottom {
    background: var(--navy);
    padding: 32px 0;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .corporate-footer-bottom-content {
    max-width: 1400px;
    margin: 0 auto;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 24px;
  }

  .corporate-footer-copyright {
    font-family: var(--ff-body);
    font-size: 0.875rem;
    color: rgba(255, 255, 255, 0.6);
    margin: 0;
  }

  .corporate-footer-legal-links {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }

  .corporate-footer-legal-link {
    color: rgba(255, 255, 255, 0.6);
    text-decoration: none;
    font-family: var(--ff-body);
    font-size: 0.875rem;
    transition: color 0.3s var(--ease);
  }

  .corporate-footer-legal-link:hover {
    color: var(--sky-light);
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .corporate-footer-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 40px;
    }
  }

  @media (max-width: 768px) {
    .corporate-footer-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }
  }

  @media (max-width: 768px) {
    .corporate-footer-main {
      padding: 48px 20px;
    }

    .corporate-footer-grid {
      grid-template-columns: 1fr;
      gap: 32px;
    }

    .corporate-footer-bottom-content {
      flex-direction: column;
      text-align: center;
      gap: 16px;
    }

    .corporate-footer-legal-links {
      justify-content: center;
    }
  }
`;

/* ═══════════════════════════════════════════════════════════════
   CORPORATE FOOTER COMPONENT
══════════════════════════════════════════════════════════════ */
export function Footer() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';

  return (
    <footer className="corporate-footer">
      <style>{css}</style>

      {/* Corporate Footer Main */}
      <div className="corporate-footer-main">
        <div className="corporate-footer-grid">

          {/* Company Info */}
          <div className="corporate-footer-company">
            <a href={`/${currentLang}`} className="corporate-footer-logo">
              <img src="/logo.png" alt="PT Surya Inti Gas Logo" width="200" height="56" />
              <div className="corporate-footer-logo-text">
                <span className="name">SURYA INTI GAS</span>
                <span className="tagline">{t('footer.tagline')}</span>
              </div>
            </a>

            <p className="corporate-footer-description">
              {t('footer.description')}
            </p>

            <div className="corporate-footer-contact">
              <div className="corporate-footer-contact-title">Kantor Pusat</div>
              <a href="tel:+6281233906378" className="corporate-footer-contact-item">
                <Phone />
                +6281233906378
              </a>
              <a href="#" className="corporate-footer-contact-item" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.sda@suryaintigas.com'; }}>
                <Mail />
                salescounter.sda@suryaintigas.com
              </a>
              <div className="corporate-footer-contact-item">
                <MapPin />
                Komp. Perg. & Industri Safe N Lock, Blok V1 - 3223, 3225, 3232, 3233, Jl. Lingkar Timur KM. 5.5, Rangkah Kidul, Sidoarjo, Jawa Timur 61232
              </div>
            </div>



            <div className="corporate-footer-social">
              <a href="https://www.instagram.com/surya.inti.gas?igsh=MXM3czQyOWx5ZjNzYw==" className="corporate-footer-social-link" aria-label={t('footer.social.instagram')} target="_blank" rel="noopener noreferrer">
                <Instagram />
              </a>
              <a href="https://www.tiktok.com/@surya.inti.gas?_r=1&_t=ZS-97WlfSPPexY" className="corporate-footer-social-link" aria-label="TikTok" target="_blank" rel="noopener noreferrer">
                <TikTok />
              </a>
            </div>
          </div>

          {/* Stasiun Pengisian Column */}
          <div className="corporate-footer-column">
            <div className="corporate-footer-contact-title">Stasiun Pengisian</div>
            <div className="corporate-footer-contact">
              <a href="tel:+625428531991" className="corporate-footer-contact-item">
                <Phone />
                +62542 – 8531991, 8532382
              </a>
              <a href="#" className="corporate-footer-contact-item" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.bpn@suryaintigas.com'; }}>
                <Mail />
                salescounter.bpn@suryaintigas.com
              </a>
              <div className="corporate-footer-contact-item">
                <MapPin />
                Jl. AMD Projakal Kariangau Km. 5.5, RT 046, Kelurahan Graha Indah, Kecamatan Balikpapan Utara, Kota Balikpapan, Kalimantan Timur
              </div>
            </div>
          </div>

          {/* About Column */}
          <div className="corporate-footer-column">
            <h5 className="corporate-footer-column-title">{t('footer.about.title')}</h5>
            <nav className="corporate-footer-links">
              <Link to={`/${currentLang}/tentang-kami`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('footer.about.companyProfile')}
              </Link>
              <Link to={`/${currentLang}/jaringan-distribusi`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('footer.about.distribution')}
              </Link>
            </nav>
          </div>

          {/* Products Column */}
          <div className="corporate-footer-column">
            <h5 className="corporate-footer-column-title">{t('footer.product.title')}</h5>
            <nav className="corporate-footer-links">
              <Link to={`/${currentLang}/produk?category=gas`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('products.mainCategories.gas')}
              </Link>
              <Link to={`/${currentLang}/produk?category=package`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('products.mainCategories.package')}
              </Link>
              <Link to={`/${currentLang}/produk?category=services`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('products.mainCategories.services')}
              </Link>
            </nav>
          </div>

          {/* CTA & Other Links */}
          <div className="corporate-footer-column">
            <h5 className="corporate-footer-column-title">{t('footer.quickLinks')}</h5>
            <nav className="corporate-footer-links">
              <Link to={`/${currentLang}/galeri`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('footer.quickLinkItems.gallery')}
              </Link>
              <Link to={`/${currentLang}/kontak`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('footer.quickLinkItems.contactUs')}
              </Link>
              <Link to={`/${currentLang}/karir`} className="corporate-footer-link">
                <ChevronRight size={16} />
                {t('footer.quickLinkItems.career')}
              </Link>
            </nav>
          </div>

        </div>
      </div>

      {/* Corporate Footer Bottom */}
      <div className="corporate-footer-bottom">
        <div className="corporate-footer-bottom-content">
          <p className="corporate-footer-copyright">
            © 2026 PT Surya Inti Gas. {t('footer.rights')}
          </p>

          <div className="corporate-footer-legal-links">
            <Link to="#" className="corporate-footer-legal-link">{t('footer.legal.privacyPolicy')}</Link>
            <Link to="#" className="corporate-footer-legal-link">{t('footer.legal.termsOfService')}</Link>
            <Link to="#" className="corporate-footer-legal-link">{t('footer.legal.cookiePolicy')}</Link>
            <Link to="#" className="corporate-footer-legal-link">{t('footer.legal.accessibility')}</Link>
            <Link to="#" className="corporate-footer-legal-link">{t('footer.legal.sitemap')}</Link>
          </div>
        </div>
      </div>

    </footer>
  );
}