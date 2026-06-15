import React, { useState } from "react";
import { Menu, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useScrolledPast } from "../../hooks/useScrollProgress";

// ─── Nav Config ───────────────────────────────────────────────
type NavItem = { nameKey: string; href: string; isRoute?: boolean; isDisabled?: boolean; hasDropdown?: boolean; dropdownItems?: Array<{ nameKey: string; href: string; isRoute?: boolean }> };

const NAV_LINKS: NavItem[] = [
  { nameKey: "header.home", href: "/", isRoute: true },
  {
    nameKey: "header.productsServices",
    href: "/produk",

    isRoute: true,
    dropdownItems: [
      { nameKey: "header.products", href: "/produk?step=produk", isRoute: true },
      { nameKey: "header.services", href: "/produk?step=layanan", isRoute: true }
    ]
  },
  { nameKey: "header.gallery", href: "/galeri", isRoute: true },
  { nameKey: "header.contact", href: "/kontak", isRoute: true },
  { nameKey: "header.career", href: "/karir", isRoute: true },
];

// ─── Shared class builders ────────────────────────────────────
const desktopLinkClass = (isLight: boolean) => {
  return `flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors font-semibold ${
    isLight
      ? "!text-slate-600 hover:!text-blue-700 hover:bg-blue-50"
      : "!text-white/85 hover:!text-white hover:bg-white/10"
  }`;
};

const mobileLinkClass = (isActive: boolean) =>
  `block px-3 py-3 rounded-lg text-sm transition-colors no-underline visited:text-inherit hover:text-inherit ${
    isActive
      ? "text-blue-700 bg-blue-50 font-semibold"
      : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
  }`;

const desktopLinkStyle = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 600,
} as React.CSSProperties;

const mobileLinkStyle = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 700,
  color: 'inherit',
  textDecoration: 'none',
} as React.CSSProperties;

// ─── Main Component ───────────────────────────────────────────
export const Header = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);


  const [hoverDropdown, setHoverDropdown] = useState(false);
  const scrolled = useScrolledPast(24);



  const { pathname, hash } = useLocation();
  const isHomePage = pathname === "/";
  const isLight = !isHomePage || scrolled;

  // Helper: cek apakah link ini aktif
  const isActive = (href: string) => {
    const [hrefPath, hrefHash] = href.split("#");
    // Hash link (misal /#kontak) — aktif kalau hash cocok
    if (hrefHash) return pathname === hrefPath && hash === `#${hrefHash}`;
    // Beranda "/" — aktif HANYA kalau di "/" dan TIDAK ada hash aktif
    if (hrefPath === "/") return pathname === "/" && hash === "";
    // Route biasa — aktif kalau pathname dimulai dengan path tersebut
    return pathname.startsWith(hrefPath) && hrefPath !== "/";
  };

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isLight
            ? "bg-white/95 backdrop-blur-lg shadow-md shadow-slate-200/50 py-4"
            : "bg-transparent py-5"
        }`}
      >
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <a href="/" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo.png"
                alt="Logo PT Surya Inti Gas"
                className={`h-12 w-auto object-contain transition-all ${
                  isLight ? "" : "brightness-0 invert"
                }`}
              />
              <div>
                {/* Nama perusahaan — lebih besar */}
                <div
                  className={`leading-tight transition-colors ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontWeight: 700,
                    fontSize: "15px",
                    letterSpacing: "0.16em",
                  }}
                >
                  SURYA INTI GAS
                </div>

                {/* Garis aksen gradient */}
                <div
                  className="w-full my-0.5"
                  style={{
                    height: "2px",
                    background: isLight
                      ? "linear-gradient(90deg, #1e3a5f 0%, transparent 100%)"
                      : "linear-gradient(90deg, rgba(255,255,255,0.5) 0%, transparent 100%)",
                  }}
                />

                {/* Subtitle Corporate */}
                <div
                  style={{
                    fontFamily: "'Cormorant Garamond', Georgia, serif",
                    fontWeight: 600,
                    fontSize: "11px",
                    letterSpacing: "0.28em",
                    textTransform: "uppercase" as const,
                    color: isLight ? "#4a7fa5" : "rgba(180,210,235,0.85)",
                  }}
                >
                  Corporate
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);

                // 1. Disabled
                if (link.isDisabled) return (
                  <span
                    key={link.nameKey}
                    title={t('header.comingSoon')}
                    className="flex items-center px-4 py-2.5 rounded-lg text-sm cursor-not-allowed select-none"
                    style={{
                      ...desktopLinkStyle,
                      color: isLight ? "#cbd5e1" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {t(link.nameKey)}
                  </span>
                );

                // 2. Dropdown
                if (link.hasDropdown) {
                  return (
                    <div key={link.nameKey} className="relative"
                      onMouseEnter={() => setHoverDropdown(true)}
                      onMouseLeave={() => setHoverDropdown(false)}
                    >
                      <Link
                        to={link.href}
                        className={`${desktopLinkClass(isLight)} ${active ? 'bg-blue-50/20' : ''}`}
                        style={{ ...desktopLinkStyle }}
                      >
                        {t(link.nameKey)}

                      </Link>
                      <AnimatePresence>
                        {hoverDropdown && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-0 mt-2 bg-white rounded-lg shadow-xl border border-slate-100 min-w-[180px] z-50"
                          >
                            {link.dropdownItems?.map((item) => (
                              <Link
                                key={item.nameKey}
                                to={item.href}

                                className="block px-4 py-3 text-sm text-slate-700 hover:text-blue-700 hover:bg-blue-50 transition-colors first:rounded-t-lg last:rounded-b-lg"
                                style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                              >
                                {t(item.nameKey)}
                              </Link>
                            ))}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }


                // 3. React Router Link
                if (link.isRoute) return (
                  <Link
                    key={link.nameKey}
                    to={link.href}
                    className={`${desktopLinkClass(isLight)} ${active ? 'bg-blue-50/20' : ''}`}
                  >
                    {t(link.nameKey)}
                  </Link>
                );


                return (
                  <a
                    key={link.nameKey}
                    href={link.href}
                    className={`${desktopLinkClass(isLight)} ${active ? 'bg-blue-50/20' : ''}`}
                  >
                    {t(link.nameKey)}
                  </a>
                );
              })}
              <div className="flex-grow"></div>
              <LanguageSwitcher isLight={isLight} />
            </div>

            {/* Mobile Toggle */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${
                isLight
                  ? "text-slate-700 hover:bg-slate-100"
                  : "text-white hover:bg-white/10"
              }`}
              onClick={() => setIsOpen(!isOpen)}
              aria-label="Toggle menu"
            >
              <AnimatePresence mode="wait">
                {isOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <X size={24} />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <Menu size={24} />
                  </motion.div>
                )}
              </AnimatePresence>
            </button>
          </div>
        </div>

        {/* ── Mobile Menu ──────────────────────────────────── */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25, ease: "easeInOut" }}
              className="lg:hidden bg-white border-t border-slate-100 overflow-hidden shadow-xl"
            >
              <div className="px-5 py-4 space-y-1">
                <div className="pb-3">
                  <LanguageSwitcher isLight={true} />
                </div>
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);

                  // 1. Disabled
                  if (link.isDisabled) return (
                    <span
                      key={link.nameKey}
                      className="block px-3 py-3 rounded-lg text-sm cursor-not-allowed select-none text-slate-300"
                      style={mobileLinkStyle}
                    >
                      {t(link.nameKey)}
                      <span className="ml-2 text-xs text-slate-300">({t('header.comingSoon')})</span>
                    </span>
                  );

                  // 2. Dropdown
                  if (link.hasDropdown) {
                    return (
                      <>
                        <div
                          key={link.nameKey}
                          className={mobileLinkClass(active)}
                          style={{ ...mobileLinkStyle, cursor: 'default' }}
                        >
                          {t(link.nameKey)}
                        </div>
                        <div className="ml-4 space-y-1">
                          {link.dropdownItems?.map((item) => (
                            <Link
                              key={item.nameKey}
                              to={item.href}
                              onClick={() => setIsOpen(false)}
                              className="block px-3 py-2 rounded-lg text-sm text-slate-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                              style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                            >
                              {t(item.nameKey)}
                            </Link>
                          ))}
                        </div>
                      </>
                    );
                  }


                  // 3. React Router Link
                  if (link.isRoute) return (
                    <Link
                      key={link.nameKey}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass(active)}
                      style={mobileLinkStyle}
                    >
                      {t(link.nameKey)}
                    </Link>
                  );

  
                  return (
                    <a
                      key={link.nameKey}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass(active)}
                      style={mobileLinkStyle}
                    >
                      {t(link.nameKey)}
                    </a>
                  );
                })}

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-slate-100">

                  <button
                    onClick={() => {
                      navigate("/kontak");
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm w-full transition-colors"
                    style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 700 }}
                  >
                    <Mail size={15} />
                    Hubungi Kami
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>






    </>
  );
};
