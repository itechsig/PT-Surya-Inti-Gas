import React, { useEffect, ReactNode } from "react";
import { useTranslation } from "react-i18next";

/* ─────────────────────────────────────────
   COLOR TOKENS  (navy dark theme)
   bg-primary   : #0d1f3c  — background utama
   bg-secondary : #0a1a32  — bottom bar
   border       : #1e3a5f  — garis pemisah
   text-primary : #f0ece4  — putih tulang tegas
   text-body    : #c8daf0  — biru muda terang
   text-muted   : #7ca0c7  — label & copyright
   text-icon    : #5b82a8  — ikon diam
───────────────────────────────────────── */

const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=EB+Garamond:wght@400;500&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";

function injectFont() {
  if (!document.head.querySelector(`link[href="${FONT_HREF}"]`)) {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href = FONT_HREF;
    document.head.appendChild(link);
  }
}

const STYLE_ID = "sig-footer-styles";

function injectStyles() {
  if (document.getElementById(STYLE_ID)) return;
  const style = document.createElement("style");
  style.id = STYLE_ID;
  style.textContent = `
    @keyframes sig-blink {
      0%, 100% { opacity: 1; }
      50%       { opacity: 0.4; }
    }
    .sig-footer-grid {
      display: grid;
      grid-template-columns: 1.2fr 1fr 1fr;
      gap: 3rem;
    }
    @media (max-width: 860px) {
      .sig-footer-grid { grid-template-columns: 1fr 1fr; }
    }
    @media (max-width: 560px) {
      .sig-footer-grid {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
      .sig-footer-bottom {
        flex-direction: column;
        align-items: flex-start !important;
        gap: 6px !important;
      }
      .sig-footer-main { padding: 2rem 1.5rem 2rem !important; }
      .sig-footer-bottom-bar { padding: 1rem 1.5rem !important; }
    }
  `;
  document.head.appendChild(style);
}

/* ── Interfaces ── */
interface ChildrenProps { children: ReactNode; }
interface ContactLinkProps { href: string; icon: ReactNode; children: ReactNode; }
interface SocialBtnProps { href: string; label: string; children: ReactNode; }

/* ── Sub-components ── */

const ColLabel = ({ children }: ChildrenProps) => (
  <div
    style={{
      fontSize: 9,
      textTransform: "uppercase",
      letterSpacing: "0.2em",
      fontWeight: 600,
      color: "#7ca0c7",
      marginBottom: "1.25rem",
      paddingBottom: "1rem",
      borderBottom: "1px solid #1e3a5f",
    }}
  >
    {children}
  </div>
);

const CityName = ({ children }: ChildrenProps) => (
  <div
    style={{
      fontFamily: "'EB Garamond', serif",
      fontSize: 16,
      fontWeight: 500,
      color: "#ffffff",
      letterSpacing: "0.02em",
      marginBottom: 6,
    }}
  >
    {children}
  </div>
);

const Address = ({ children }: ChildrenProps) => (
  <p style={{ fontSize: 12.5, lineHeight: 1.85, color: "#c8daf0", margin: 0 }}>
    {children}
  </p>
);

const ContactLink = ({ href, icon, children }: ContactLinkProps) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: 8,
        fontSize: 12,
        color: hovered ? "#f0ece4" : "#c8daf0",
        textDecoration: "none",
        transition: "color .18s",
        wordBreak: "break-all",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <span style={{ color: hovered ? "#a8c8e8" : "#5b82a8", flexShrink: 0, fontSize: 14 }}>
        {icon}
      </span>
      {children}
    </a>
  );
};

const SocialBtn = ({ href, label, children }: SocialBtnProps) => {
  const [hovered, setHovered] = React.useState(false);
  return (
    <a
      href={href}
      aria-label={label}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      style={{
        width: 34,
        height: 34,
        border: `1px solid ${hovered ? "#4a7aaa" : "#1e3a5f"}`,
        borderRadius: 6,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        color: hovered ? "#f0ece4" : "#5b82a8",
        textDecoration: "none",
        transition: "border-color .2s, color .2s",
        flexShrink: 0,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {children}
    </a>
  );
};

/* ── SVG Icons ── */
const IconPhone = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81a19.79 19.79 0 01-3.07-8.69A2 2 0 012 1h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.91 8.37a16 16 0 006.72 6.72l1.73-1.73a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 16.92z" />
  </svg>
);

const IconMail = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
    <polyline points="22,6 12,13 2,6" />
  </svg>
);

const IconFacebook = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" />
  </svg>
);

const IconInstagram = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

const IconLinkedin = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </svg>
);

const IconWhatsapp = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.48 8.48 0 018 8v.5z" />
  </svg>
);

/* ── Main Footer ── */
export const Footer = () => {
  const { t } = useTranslation();
  useEffect(() => {
    injectFont();
    injectStyles();
  }, []);

  const dm = "'DM Sans', system-ui, sans-serif";
  const garamond = "'EB Garamond', Georgia, serif";

  return (
    <footer
      id="contact"
      style={{ background: "#0d1f3c", color: "#c8daf0", fontFamily: dm }}
    >
      {/* Top border */}
      <div style={{ height: 2, background: "#1e3a5f" }} />

      {/* Main grid */}
      <div
        className="sig-footer-main sig-footer-grid"
        style={{ padding: "3rem 3rem 2.5rem" }}
      >
        {/* Column 1: Brand */}
        <div>
          <div
            style={{
              fontFamily: garamond,
              fontSize: 19,
              fontWeight: 500,
              color: "#ffffff",
              letterSpacing: "0.02em",
              marginBottom: 4,
            }}
          >
            PT Surya Inti Gas
          </div>
          <div
            style={{
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              color: "#7ca0c7",
              marginBottom: "1.25rem",
            }}
          >
            {t('header.distributor')} · Est. 2004
          </div>
          <p
            style={{
              fontSize: 12.5,
              lineHeight: 1.85,
              color: "#c8daf0",
              marginBottom: "1.5rem",
              maxWidth: 280,
            }}
          >
            {t('footer.description')}
                        {t('footer.productsOffered')}
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              fontSize: 12,
              color: "#c8daf0",
              marginBottom: "1.5rem",
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7ca0c7",
                flexShrink: 0,
                animation: "sig-blink 2s ease-in-out infinite",
              }}
            />
            {t('contact.hours.weekdays')} &nbsp;·&nbsp; 08.00 – 17.00 WIB
          </div>
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <SocialBtn href="#" label="Facebook"><IconFacebook /></SocialBtn>
            <SocialBtn href="#" label="Instagram"><IconInstagram /></SocialBtn>
            <SocialBtn href="#" label="LinkedIn"><IconLinkedin /></SocialBtn>
            <SocialBtn href="https://wa.me/62319970478" label="WhatsApp"><IconWhatsapp /></SocialBtn>
          </div>
        </div>

        {/* Column 2: Kantor Pusat */}
        <div>
          <ColLabel>{t('contact.offices.headOffice')}</ColLabel>
          <CityName>Sidoarjo, Jawa Timur</CityName>
          <Address>
            Komp. Pergudangan "Safe N Lock"<br />
            Blok V1 – 3223, 3225, 3232, 3233<br />
            Jl. Lingkar Timur KM. 5.5<br />
            Rangkah Kidul, Sidoarjo 61232
          </Address>
          <div style={{ marginTop: "1.25rem" }}>
            <ContactLink href="tel:+623199704788" icon={<IconPhone />}>
              +62 31 – 9970 4788
            </ContactLink>
            <ContactLink href="mailto:info@suryaintigas.co.id" icon={<IconMail />}>
              info@suryaintigas.co.id
            </ContactLink>
          </div>
        </div>

        {/* Column 3: Kantor Cabang */}
        <div>
          <ColLabel>{t('contact.offices.branchOffice')}</ColLabel>
          <CityName>Balikpapan, Kalimantan Timur</CityName>
          <Address>
            Jl. AMD Projakal No.27, Batu Ampar<br />
            Kec. Balikpapan Utara<br />
            Kota Balikpapan 76127
          </Address>
          <div style={{ marginTop: "1.25rem" }}>
            <ContactLink href="tel:+625428531991" icon={<IconPhone />}>
              +62 542 – 8531991
            </ContactLink>
            <ContactLink href="mailto:salescounter.bpn@suryaintigas.co.id" icon={<IconMail />}>
              salescounter.bpn@suryaintigas.co.id
            </ContactLink>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        className="sig-footer-bottom-bar"
        style={{
          background: "#0a1a32",
          borderTop: "1px solid #1e3a5f",
          padding: "1rem 3rem",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div
          className="sig-footer-bottom"
          style={{
            fontSize: 11,
            color: "#7ca0c7",
            display: "flex",
            alignItems: "center",
            gap: "1rem",
          }}
        >
          <span>© {new Date().getFullYear()} PT Surya Inti Gas. {t('footer.rights')}</span>
          <span style={{ color: "#1e3a5f" }}>|</span>
          <span style={{ fontFamily: dm, fontSize: 10.5 }}>
            {t('footer.tagline')}
          </span>
        </div>
        <div style={{ fontSize: 10.5, color: "#5b82a8", fontFamily: dm }}>
          {t('footer.version')}
        </div>
      </div>
    </footer>
  );
};
