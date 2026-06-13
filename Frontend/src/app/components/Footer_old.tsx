import React, { useEffect, ReactNode } from "react";
import { Link } from "react-router-dom";
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
      grid-template-columns: 1.3fr 0.7fr 1.4fr 1.2fr;
      gap: 2.5rem;
    }
    @media (max-width: 1024px) {
      .sig-footer-grid { grid-template-columns: 1fr 1fr; gap: 2rem; }
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
    .sig-cta-btn:hover {
      background: #1e3a5f !important;
      border-color: #4a7aaa !important;
    }
    .sig-cta-wa:hover {
      background: #1a7a4a !important;
    }
  `;
  document.head.appendChild(style);
}

interface ChildrenProps { children: ReactNode; }
interface SocialBtnProps { href: string; label: string; children: ReactNode; }

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



const IconChevronRight = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

/* ── Nav links config ── */
const NAV_LINKS = [
  { name: "Beranda", href: "/", isRoute: true },
  { name: "Galeri", href: "/galeri", isRoute: true },


  { name: "Kontak", href: "/#kontak", isRoute: false },
  { name: "Karir", href: "/karir", isRoute: true },

];

/* ── Solusi dropdown items ── */
const SOLUTIONS_ITEMS = [
  { name: "Produk" },
  { name: "Layanan" },
];

/* ── Kategori Produk & Layanan ── */
const CATEGORIES = [
  {
    label: "Gas Industri & Medis",
    title: "Produk",
    sub: "Gas & Tabung",
    href: "/produk?step=produk",
    image: "https://images.unsplash.com/photo-1664396113489-e50bddd4a777?q=80&w=600&auto=format&fit=crop",
  },
  {
    label: "Instalasi Profesional",
    title: "Layanan",
    sub: "Instalasi Gas",
    href: "/produk?step=layanan",
    image: "https://plus.unsplash.com/premium_photo-1664298589198-b15ff5382648?q=80&w=600&auto=format&fit=crop",
  },
];

/* ── Kolom 3: Produk & Layanan ── */
const SolutionsColumn = () => (
  <div>
    <ColLabel>Solusi</ColLabel>
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
      {SOLUTIONS_ITEMS.map((item) => (
        <Link
          key={item.name}
          to={cat.href}
          style={{ textDecoration: "none" }}
        >
          <div
            className="sig-product-item"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "10px 12px",
              borderRadius: 8,
              border: "1px solid #1e3a5f",
              background: "#0a1a32",
              transition: "border-color .2s, background .2s",
              cursor: "pointer",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#4a7aaa";
              (e.currentTarget as HTMLDivElement).style.background = "#0f2444";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLDivElement).style.borderColor = "#1e3a5f";
              (e.currentTarget as HTMLDivElement).style.background = "#0a1a32";
            }}
          >
            {/* Thumbnail foto kecil */}
            <div
              style={{
                width: 48,
                height: 48,
                borderRadius: 6,
                overflow: "hidden",
                flexShrink: 0,
                position: "relative",
              }}
            >
              <img
                src={cat.image}
                alt={cat.title}
                style={{ width: "100%", height: "100%", objectFit: "cover" }}
              />
              <div style={{
                position: "absolute", inset: 0,
                background: "rgba(13,31,60,0.35)",
              }} />
            </div>

            {/* Teks */}
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontSize: 9,
                textTransform: "uppercase",
                letterSpacing: "0.15em",
                color: "#5b82a8",
                marginBottom: 2,
              }}>
                {cat.label}
              </div>
              <div style={{
                fontSize: 13,
                fontWeight: 600,
                color: "#ffffff",
                letterSpacing: "0.01em",
              }}>
                {cat.title}
              </div>
              <div style={{
                fontSize: 11,
                color: "#7ca0c7",
                marginTop: 1,
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}>
                {cat.sub}
              </div>
            </div>

            {/* Arrow */}
            <span style={{ color: "#5b82a8", flexShrink: 0 }}>
              <IconChevronRight />
            </span>
          </div>
        </Link>
      ))}
    </div>
  </div>
);

/* ── Kolom 4: Kontak Cepat ── */
const ContactColumn = () => (
  <div>
    <ColLabel>Hubungi Kami</ColLabel>

    <p style={{ fontSize: 12, lineHeight: 1.8, color: "#c8daf0", marginBottom: "1.25rem" }}>
      Butuh penawaran atau informasi produk? Tim kami siap membantu Anda.
    </p>

    {/* WhatsApp CTA */}
    <a
      href="https://wa.me/62319970478"
      target="_blank"
      rel="noreferrer"
      className="sig-cta-wa"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "9px 0",
        borderRadius: 6,
        background: "#166534",
        color: "#ffffff",
        fontSize: 12.5,
        fontWeight: 600,
        textDecoration: "none",
        marginBottom: 8,
        transition: "background .2s",
        letterSpacing: "0.01em",
      }}
    >
      <IconWhatsapp />
      Chat WhatsApp
    </a>

    {/* Telepon */}
    <a
      href="tel:+6231997047888"
      className="sig-cta-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "9px 0",
        borderRadius: 6,
        background: "transparent",
        border: "1px solid #1e3a5f",
        color: "#c8daf0",
        fontSize: 12.5,
        textDecoration: "none",
        marginBottom: 8,
        transition: "background .2s, border-color .2s",
        letterSpacing: "0.01em",
      }}
    >
      <IconPhone />
      +62 31 – 9970 4788
    </a>

    {/* Email inquiry */}
    <a
      href="mailto:marketing@suryaintigas.co.id"
      className="sig-cta-btn"
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        gap: 8,
        width: "100%",
        padding: "9px 0",
        borderRadius: 6,
        background: "transparent",
        border: "1px solid #1e3a5f",
        color: "#c8daf0",
        fontSize: 12.5,
        textDecoration: "none",
        transition: "background .2s, border-color .2s",
        letterSpacing: "0.01em",
      }}
    >
      <IconMail />
      Kirim Email
    </a>
  </div>
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

      {/* Main grid — 4 kolom */}
      <div
        className="sig-footer-main sig-footer-grid"
        style={{ padding: "3rem 3rem 2.5rem" }}
      >
        {/* ── Kolom 1: Brand ── */}
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
            Surya Inti Gas
          </div>

          <div
            style={{
              fontFamily: garamond,
              fontSize: 13,
              fontStyle: "italic",
              color: "#38bdf8",
              marginBottom: "1.25rem",
            }}
          >
            Energi yang Andal, Masa Depan yang Cerah
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
              alignItems: "flex-start",
              gap: 8,
              fontSize: 12,
              color: "#c8daf0",
              marginBottom: "1.5rem",
              lineHeight: 1.8,
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "#7ca0c7",
                flexShrink: 0,
                marginTop: 6,

              }}
            />
            <span>
              Senin – Jum'at &nbsp;·&nbsp; 08.00 – 16.00 WIB<br />
              Sabtu &nbsp;·&nbsp; 08.00 – 14.00 WIB
            </span>
          </div>

          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            <SocialBtn href="#" label="Facebook"><IconFacebook /></SocialBtn>
            <SocialBtn href="#" label="Instagram"><IconInstagram /></SocialBtn>
            <SocialBtn href="#" label="LinkedIn"><IconLinkedin /></SocialBtn>
            <SocialBtn href="https://wa.me/62319970478" label="WhatsApp"><IconWhatsapp /></SocialBtn>
          </div>
        </div>

        {/* ── Kolom 2: Navigasi ── */}
        <div>
          <ColLabel>Navigasi</ColLabel>
          <nav style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {NAV_LINKS.map((link) =>
              link.isRoute ? (
                <Link
                  key={link.name}
                  to={link.href}
                  style={{
                    fontSize: 13,
                    color: "#c8daf0",
                    textDecoration: "none",
                    padding: "5px 0",
                    transition: "color .18s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ece4")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#c8daf0")}
                >
                  {link.name}
                </Link>
              ) : (
                <a
                  key={link.name}
                  href={link.href}
                  style={{
                    fontSize: 13,
                    color: "#c8daf0",
                    textDecoration: "none",
                    padding: "5px 0",
                    transition: "color .18s",
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ece4")}
                  onMouseLeave={(e) => (e.currentTarget.style.color = "#c8daf0")}
                >
                  {link.name}
                </a>
              )
            )}
          </nav>
        </div>

        {/* ── Kolom 3: Produk Unggulan ── */}
        <SolutionsColumn />

        {/* ── Kolom 4: Kontak Cepat ── */}
        <ContactColumn />
      </div>

      {/* ── Bottom bar ── */}
      <div style={{ borderTop: "1px solid #1e3a5f", background: "#0a1a32" }}>
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
          <span style={{ fontSize: 11.5, color: "#7ca0c7", letterSpacing: "0.01em" }}>
            © 2026 Surya Inti Gas. Hak Cipta Dilindungi Undang-Undang.
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap" }}>
            <span style={{ color: "#1e3a5f", fontSize: 11 }}>|</span>
            <a
              href="mailto:marketing@suryaintigas.co.id"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11.5,
                color: "#7ca0c7",
                textDecoration: "none",
                transition: "color .18s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.color = "#f0ece4")}
              onMouseLeave={(e) => (e.currentTarget.style.color = "#7ca0c7")}
            >
              <IconMail />
              marketing@suryaintigas.co.id
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
