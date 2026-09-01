import React, { useState, useEffect, useRef } from "react";
import { Menu, X, ChevronDown, Instagram } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Custom TikTok Icon (since lucide-react doesn't have one)
const TikTokIcon = ({ size = 18, className }: { size?: number; className?: string }) => (
  <svg 
    className={className}
    width={size}
    height={size}
    viewBox="0 0 24 24" 
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
  </svg>
);

import { Link, useLocation, useParams } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useScrolledPast } from "../../hooks/useScrollProgress";
import { SOCIAL } from "../../data/contact";

// ─── Corporate Nav Config (Air Liquide & Linde inspired) ───────────────────────────────────────────────
type NavItem = { 
  nameKey: string; 
  href: string; 
  isRoute?: boolean; 
  isDisabled?: boolean; 
  hasMegaMenu?: boolean;
  megaMenuSections?: Array<{ titleKey: string; items: Array<{ nameKey: string; href: string; descriptionKey?: string }> }>;
};

const NAV_LINKS: NavItem[] = [
  { nameKey: "header.home", href: "/", isRoute: true },
  { nameKey: "header.about", href: "/tentang-kami", isRoute: true },
  { nameKey: "header.distribution", href: "/jaringan-distribusi", isRoute: true },
  {
    nameKey: "header.productsServices",
    href: "/produk",
    isRoute: true,
    hasMegaMenu: true,
    megaMenuSections: [
      {
        titleKey: "header.megaMenu.gasProducts",
        items: [
          { nameKey: "header.industrialMedical", href: "/produk?category=gas&subcategory=industrial-medical", descriptionKey: "header.megaMenu.industrialMedicalDesc" },
          { nameKey: "header.specialityMixed", href: "/produk?category=gas&subcategory=speciality-mixed", descriptionKey: "header.megaMenu.specialityMixedDesc" },
        ]
      },
      {
        titleKey: "header.megaMenu.packageServices",
        items: [
          { nameKey: "header.package", href: "/produk?category=package", descriptionKey: "header.megaMenu.packageDesc" },
          { nameKey: "header.services", href: "/produk?category=services", descriptionKey: "header.megaMenu.servicesDesc" },
        ]
      }
    ]
  },
  { nameKey: "header.gallery", href: "/galeri", isRoute: true },
  { nameKey: "header.portfolio", href: "/portofolio", isRoute: true },
  { nameKey: "header.contact", href: "/kontak", isRoute: true },
  { nameKey: "header.career", href: "/karir", isRoute: true },
];

// ─── Corporate Shared class builders (Air Liquide inspired) ────────────────────────────────────
const desktopLinkClass = (isLight: boolean) => {
  return `flex items-center gap-2 px-4 py-3 text-sm transition-all duration-200 font-semibold relative group ${isLight ? 'text-gray-800 hover:text-black' : 'text-white hover:text-gray-200'}`;
};

// Non-colour affordance for the current page: a solid underline bar. Colour
// alone (gray-800 vs gray-900) is invisible, so screen readers get aria-current
// and sighted users get this.
const activeMarkClass = (isLight: boolean) =>
  `after:content-[''] after:absolute after:left-3 after:right-3 after:bottom-1 after:h-[2px] after:rounded-full ${
    isLight ? 'after:bg-[var(--brand-blue)] text-gray-900' : 'after:bg-white text-white'
  }`;

const mobileLinkClass = (isActive: boolean) =>
  `block px-4 py-4 text-sm transition-all duration-200 no-underline visited:text-inherit hover:text-inherit border-b border-blue-100 ${
    isActive
      ? "text-blue-600 bg-blue-50 font-semibold border-l-4 border-l-blue-600"
      : "text-blue-700 hover:bg-blue-50 hover:text-blue-600"
  }`;

const desktopLinkStyle = (isLight: boolean) => ({
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: isLight ? '#0C2D5E' : '#ffffff',
} as React.CSSProperties);

const mobileLinkStyle = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 600,
  color: 'inherit',
  textDecoration: 'none',
} as React.CSSProperties;

// ─── Corporate Main Component ───────────────────────────────────────────
export const Header = () => {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const [isOpen, setIsOpen] = useState(false);

  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeMobileMegaMenu, setActiveMobileMegaMenu] = useState<string | null>(null);
  const scrolled = useScrolledPast(50);

  const { pathname, hash } = useLocation();
  const currentLang = lang || 'id';
  // Every route opens with a full-bleed dark hero band behind the nav (the home
  // slider, or the dark gradient PageHero on interior pages), so the nav is
  // transparent at the top everywhere and turns solid once the user scrolls
  // past it — one consistent behaviour across the whole site.
  const isHome = /^\/(en|id|zh)\/?$/.test(pathname) || pathname === '/';
  const isLight = scrolled;

  const megaMenuRef = useRef<HTMLDivElement | null>(null);
  const mobilePanelRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  // Mobile menu: lock the page behind it, close on Escape, keep Tab inside the
  // panel, and hand focus back to the trigger when it closes.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const prevOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    const panel = mobilePanelRef.current;
    const focusables = () =>
      Array.from(
        panel?.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])'
        ) ?? []
      ).filter((el) => el.offsetParent !== null);

    focusables()[0]?.focus();

    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        return;
      }
      if (e.key !== 'Tab') return;
      const items = focusables();
      if (items.length === 0) return;
      const first = items[0];
      const last = items[items.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('keydown', onKey);
      body.style.overflow = prevOverflow;
      menuButtonRef.current?.focus();
    };
  }, [isOpen]);

  // Prefix an internal href with the active language segment.
  const toHref = (href: string) => {
    if (!href.startsWith('/')) return href;
    if (href === '/') return `/${currentLang}`;
    return href.startsWith(`/${currentLang}/`) ? href : `/${currentLang}${href}`;
  };

  // Close the mega menu on Escape and on outside click / focus. On Escape,
  // focus returns to the trigger button so keyboard users aren't dropped.
  useEffect(() => {
    if (!activeMegaMenu) return;
    const trigger = document.activeElement as HTMLElement | null;
    // Move focus to the first link inside the panel once it renders.
    const raf = requestAnimationFrame(() => {
      megaMenuRef.current?.querySelector<HTMLElement>('a[href]')?.focus();
    });
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveMegaMenu(null);
        trigger?.focus();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (megaMenuRef.current && !megaMenuRef.current.contains(e.target as Node)) {
        setActiveMegaMenu(null);
      }
    };
    document.addEventListener('keydown', onKey);
    document.addEventListener('pointerdown', onPointer);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('pointerdown', onPointer);
    };
  }, [activeMegaMenu]);

  // Any navigation dismisses both menus.
  useEffect(() => {
    setActiveMegaMenu(null);
    setActiveMobileMegaMenu(null);
    setIsOpen(false);
  }, [pathname]);

  // Helper: cek apakah link ini aktif
  const isActive = (href: string) => {
    const [hrefPath, hrefHash] = href.split("#");
    if (hrefHash) return pathname === hrefPath && hash === `#${hrefHash}`;
    if (hrefPath === "/") return isHome;
    return pathname.startsWith(toHref(hrefPath));
  };

  const handleMegaMenuLeave = () => {
    setActiveMegaMenu(null);
  };

  return (
    <header role="banner">
      {/* ── Corporate Navbar (Linde & Air Liquide inspired) ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isLight
            ? "bg-white/98 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-200 py-2.5 lg:py-4"
            : "bg-transparent backdrop-blur-none shadow-none border-none py-3 lg:py-5"
        }`}
      >
        <div className="w-full">
          <div className="flex justify-between items-center px-6 lg:px-12">

            {/* Corporate Logo */}
            <Link to={`/${currentLang}`} aria-label="PT Surya Inti Gas — Beranda" className="flex items-center gap-3 lg:gap-4 shrink-0 lg:-ml-4">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Logo PT Surya Inti Gas"
                  className="h-10 lg:h-14 w-auto object-contain transition-all duration-300"
                  width="200"
                  height="56"
                />
              </div>
              <div className="hidden md:block">
                <div
                  className="leading-tight transition-colors"
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontWeight: 800,
                    fontSize: "16px",
                    letterSpacing: "0.12em",
                    color: isLight ? '#0C2D5E' : '#ffffff',
                  }}
                >
                  SURYA INTI GAS
                </div>

                <div
                  className="w-16 h-0.5 my-1"
                  style={{
                    background: isLight ? "linear-gradient(90deg, #1565C0 0%, #00AEEF 100%)" : "linear-gradient(90deg, #ffffff 0%, #d1d5db 100%)",
                  }}
                />

                <div
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase" as const,
                    color: isLight ? '#475569' : "#ffffff",
                  }}
                >
                  {t('header.corporate')}
                </div>
              </div>
            </Link>

            {/* Corporate Desktop Nav with Mega Menu */}
            <div className="hidden lg:flex items-center gap-1 ml-auto pr-8">
              {NAV_LINKS.map((link) => {
                const active = isActive(link.href);

                if (link.isDisabled) return (
                  <span
                    key={link.nameKey}
                    title={t('header.comingSoon')}
                    className="flex items-center px-4 py-3 text-sm cursor-not-allowed select-none text-slate-400"
                    style={{ ...desktopLinkStyle(isLight) }}
                  >
                    {t(link.nameKey)}
                  </span>
                );

                // Mega Menu
                if (link.hasMegaMenu) {
                  const menuId = `megamenu-${link.nameKey.replace(/\W/g, '-')}`;
                  const open = activeMegaMenu === link.nameKey;
                  return (
                    <div
                      key={link.nameKey}
                      className="relative"
                      ref={megaMenuRef}
                    >
                      <button
                        type="button"
                        aria-expanded={open}
                        aria-haspopup="true"
                        aria-controls={menuId}
                        className={`${desktopLinkClass(isLight)} ${active ? activeMarkClass(isLight) : ''}`}
                        style={{ ...desktopLinkStyle(isLight), cursor: 'pointer', background: 'transparent', border: 'none' }}
                        onClick={() => setActiveMegaMenu(open ? null : link.nameKey)}
                      >
                        {t(link.nameKey)}
                        <ChevronDown size={16} aria-hidden="true" className={`ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                      </button>

                      {/* Corporate Mega Menu */}
                      <AnimatePresence>
                        {open && (
                          <motion.div
                            id={menuId}
                            role="region"
                            aria-label={t(link.nameKey)}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] max-w-[calc(100vw-2rem)] bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
                          >
                            <div className="p-8 grid grid-cols-2 gap-8">
                              {link.megaMenuSections?.map((section, sectionIdx) => (
                                <div key={sectionIdx}>
                                  <h4 className="text-xs font-bold text-gray-600 uppercase tracking-wider mb-4" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>
                                    {t(section.titleKey)}
                                  </h4>
                                  <div className="space-y-3">
                                    {section.items.map((item, itemIdx) => (
                                      <Link
                                        key={itemIdx}
                                        to={toHref(item.href)}
                                        className="block group rounded-md p-2 -m-2 hover:bg-slate-50 transition-colors"
                                        onClick={() => setActiveMegaMenu(null)}
                                      >
                                        <div className="text-sm font-semibold text-slate-800 group-hover:text-brand-blue transition-colors mb-1" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>
                                          {t(item.nameKey)}
                                        </div>
                                        {item.descriptionKey && (
                                          <div className="text-xs text-slate-500 group-hover:text-slate-600 transition-colors" style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}>
                                            {t(item.descriptionKey)}
                                          </div>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                }

                // Regular link
                return (
                  <Link
                    key={link.nameKey}
                    to={toHref(link.href)}
                    aria-current={active ? 'page' : undefined}
                    className={`${desktopLinkClass(isLight)} ${active ? activeMarkClass(isLight) : ''}`}
                    style={{ ...desktopLinkStyle(isLight) }}
                    onClick={() => setActiveMegaMenu(null)}
                  >
                    {t(link.nameKey)}
                  </Link>
                );
              })}
            </div>

            {/* Corporate Right Actions */}
            <div className="flex items-center gap-3">
              {/* Social Media Icons */}
              <div className="hidden lg:flex items-center gap-2">
                <a
                  href={SOCIAL.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${isLight ? 'text-gray-800 hover:text-black' : 'text-white hover:text-gray-200'}`}
                  aria-label="Instagram"
                  style={{ color: isLight ? '#6b7280' : '#ffffff' }}
                >
                  <Instagram size={18} strokeWidth={2.5} />
                </a>
                <a
                  href={SOCIAL.tiktok}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${isLight ? 'text-gray-800 hover:text-black' : 'text-white hover:text-gray-200'}`}
                  aria-label="TikTok"
                  style={{ color: isLight ? '#6b7280' : '#ffffff' }}
                >
                  <TikTokIcon size={18} />
                </a>
              </div>

              {/* Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher isLight={isLight} />
              </div>

              {/* Mobile Menu Button */}
              <button
                ref={menuButtonRef}
                className={`lg:hidden p-2 rounded-lg transition-colors ${isLight ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label={isOpen ? t('header.closeMenu', 'Tutup menu') : t('header.openMenu', 'Buka menu')}
                aria-expanded={isOpen}
                aria-haspopup="dialog"
              >
                {isOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </div>

        {/* Corporate Mega Menu Overlay */}
        <AnimatePresence>
          {activeMegaMenu && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/20 z-40 lg:hidden"
              onClick={handleMegaMenuLeave}
            />
          )}
        </AnimatePresence>
      </nav>

      {/* ── Corporate Mobile Menu ──────────────────────────────────────── */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label={t('header.menu', 'Menu navigasi')}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-white/98 backdrop-blur-xl" />
            <div className="relative h-full overflow-y-auto">
              <div className="w-full px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <Link to={`/${currentLang}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <img
                      src="/logo.png"
                      alt="Logo PT Surya Inti Gas"
                      className="h-10 sm:h-12 w-auto object-contain"
                      width="200"
                      height="56"
                    />
                    <div>
                      <div
                        className="leading-tight text-blue-900"
                        style={{
                          fontFamily: "'Barlow', system-ui, sans-serif",
                          fontWeight: 800,
                          fontSize: "14px",
                          letterSpacing: "0.12em",
                        }}
                      >
                        SURYA INTI GAS
                      </div>
                      <div className="text-[10px] sm:text-xs text-blue-600 font-semibold tracking-wider uppercase">
                        {t('header.corporate')}
                      </div>
                    </div>
                  </Link>
                  <button
                    className="p-3 sm:p-2 rounded-full hover:bg-slate-100 transition-colors"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={24} className="sm:hidden" />
                    <X size={22} className="hidden sm:block" />
                  </button>
                </div>

                <div className="flex flex-col gap-1">
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);

                    if (link.isDisabled) {
                      return (
                        <span
                          key={link.nameKey}
                          className="px-4 py-4 sm:py-4 text-blue-400 cursor-not-allowed"
                          style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                        >
                          {t(link.nameKey)} <span className="text-xs ml-2">({t('header.comingSoon')})</span>
                        </span>
                      );
                    }

                    if (link.hasMegaMenu) {
                      return (
                        <div key={link.nameKey}>
                          <div
                            className="flex items-center justify-between px-4 py-4 sm:py-4 text-blue-700 font-semibold cursor-pointer border-b border-slate-100"
                            style={{ ...mobileLinkStyle }}
                            onClick={() => setActiveMobileMegaMenu(activeMobileMegaMenu === link.nameKey ? null : link.nameKey)}
                          >
                            {t(link.nameKey)}
                            <ChevronDown size={18} className={`transition-transform duration-200 ${activeMobileMegaMenu === link.nameKey ? 'rotate-180' : ''}`} />
                          </div>
                          {activeMobileMegaMenu === link.nameKey && (
                            <div className="bg-slate-50 border-l-4 border-blue-600">
                              {link.megaMenuSections?.map((section, sectionIdx) => (
                                <div key={sectionIdx} className="py-4 px-4 border-b border-slate-200 last:border-0">
                                  <h4 className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-3" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>
                                    {t(section.titleKey)}
                                  </h4>
                                  <div className="space-y-3">
                                    {section.items.map((item, itemIdx) => (
                                      <Link
                                        key={itemIdx}
                                        to={toHref(item.href)}
                                        className="block text-sm text-slate-700 hover:text-blue-600 py-2 transition-colors"
                                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                        onClick={() => {
                                          setActiveMobileMegaMenu(null);
                                          setIsOpen(false);
                                        }}
                                      >
                                        <div className="font-semibold">{t(item.nameKey)}</div>
                                        {item.descriptionKey && (
                                          <div className="text-xs text-slate-500 mt-1">{t(item.descriptionKey)}</div>
                                        )}
                                      </Link>
                                    ))}
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    }

                    return (
                      <Link
                        key={link.nameKey}
                        to={toHref(link.href)}
                        aria-current={active ? 'page' : undefined}
                        className={mobileLinkClass(active)}
                        style={{ ...mobileLinkStyle }}
                        onClick={() => setIsOpen(false)}
                      >
                        {t(link.nameKey)}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-semibold text-slate-700">{t('header.language')}</span>
                    <LanguageSwitcher isLight={true} />
                  </div>
                  <div className="flex items-center gap-3">
                    <a
                      href={SOCIAL.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-blue-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="Instagram"
                    >
                      <Instagram size={20} strokeWidth={3} />
                    </a>
                    <a
                      href={SOCIAL.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2 rounded-lg text-blue-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                      aria-label="TikTok"
                    >
                      <TikTokIcon size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};