import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Instagram,
  Facebook,
  Home,
  Building2,
  Share2,
  Package,
  Images,
  Briefcase,
  PhoneCall,
  UsersRound,
  MessageCircle,
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

// Custom TikTok Icon (since lucide-react esn't have one)
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
import { SOCIAL, PRIMARY_OFFICE } from "../../data/contact";

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
          { nameKey: "header.liquid", href: "/produk?category=gas&subcategory=liquid", descriptionKey: "header.megaMenu.liquidDesc" },
          { nameKey: "header.relatedEquipment", href: "/produk?category=gas&subcategory=related-equipment", descriptionKey: "header.megaMenu.relatedEquipmentDesc" },
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

// Icon per top-level nav item, used only in the mobile drawer.
const NAV_ICONS: Record<string, React.ComponentType<import("lucide-react").LucideProps>> = {
  "header.home": Home,
  "header.about": Building2,
  "header.distribution": Share2,
  "header.productsServices": Package,
  "header.gallery": Images,
  "header.portfolio": Briefcase,
  "header.contact": PhoneCall,
  "header.career": UsersRound,
};

// Staggered reveal for the mobile drawer's nav items.
const mobileListVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.045, delayChildren: 0.12 } },
};
const mobileItemVariants = {
  hidden: { opacity: 0, x: 24 },
  visible: { opacity: 1, x: 0, transition: { duration: 0.35, ease: [0.4, 0, 0.2, 1] as const } },
};

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

const desktopLinkStyle = (isLight: boolean) => ({
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 600,
  letterSpacing: "0.02em",
  color: isLight ? '#0C2D5E' : '#ffffff',
} as React.CSSProperties);

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
                <a
                  href={SOCIAL.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`p-2 rounded-lg transition-colors ${isLight ? 'text-gray-800 hover:text-black' : 'text-white hover:text-gray-200'}`}
                  aria-label="Facebook"
                  style={{ color: isLight ? '#6b7280' : '#ffffff' }}
                >
                  <Facebook size={18} strokeWidth={2.5} />
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
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-slate-50" />
            {/* Decorative glow — echoes the brand gradient without competing with the content */}
            <div className="absolute -top-24 -right-24 w-72 h-72 rounded-full bg-gradient-to-br from-blue-400/20 to-cyan-300/10 blur-3xl pointer-events-none" />
            <div className="absolute top-1/3 -left-20 w-56 h-56 rounded-full bg-blue-200/30 blur-3xl pointer-events-none" />

            <div className="relative h-full overflow-y-auto flex flex-col">
              {/* Header band */}
              <div
                className="relative shrink-0 px-4 sm:px-6 pt-5 pb-6 sm:pb-7"
                style={{ background: "linear-gradient(135deg, #0C2D5E 0%, #1565C0 60%, #00AEEF 130%)" }}
              >
                <div className="flex justify-between items-center">
                  <Link to={`/${currentLang}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                    <div className="bg-white/95 rounded-xl p-1.5 shadow-md">
                      <img
                        src="/logo.png"
                        alt="Logo PT Surya Inti Gas"
                        className="h-8 sm:h-10 w-auto object-contain"
                        width="200"
                        height="56"
                      />
                    </div>
                    <div>
                      <div
                        className="leading-tight text-white"
                        style={{
                          fontFamily: "'Barlow', system-ui, sans-serif",
                          fontWeight: 800,
                          fontSize: "14px",
                          letterSpacing: "0.12em",
                        }}
                      >
                        SURYA INTI GAS
                      </div>
                      <div className="text-[10px] sm:text-xs text-blue-100 font-semibold tracking-wider uppercase">
                        {t('header.corporate')}
                      </div>
                    </div>
                  </Link>
                  <button
                    className="p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                    onClick={() => setIsOpen(false)}
                    aria-label="Close menu"
                  >
                    <X size={22} />
                  </button>
                </div>
              </div>

              <div className="relative flex-1 px-4 py-5 sm:px-6 sm:py-6">
                <motion.nav
                  variants={mobileListVariants}
                  initial="hidden"
                  animate="visible"
                  className="flex flex-col gap-2"
                >
                  {NAV_LINKS.map((link) => {
                    const active = isActive(link.href);
                    const Icon = NAV_ICONS[link.nameKey];

                    if (link.isDisabled) {
                      return (
                        <motion.span
                          key={link.nameKey}
                          variants={mobileItemVariants}
                          className="flex items-center gap-3 px-4 py-4 rounded-2xl bg-white/60 text-blue-300 cursor-not-allowed"
                          style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                        >
                          {Icon && (
                            <span className="flex items-center justify-center w-9 h-9 rounded-xl bg-slate-100 text-slate-300 shrink-0">
                              <Icon size={18} />
                            </span>
                          )}
                          {t(link.nameKey)} <span className="text-xs ml-1">({t('header.comingSoon')})</span>
                        </motion.span>
                      );
                    }

                    if (link.hasMegaMenu) {
                      const expanded = activeMobileMegaMenu === link.nameKey;
                      return (
                        <motion.div key={link.nameKey} variants={mobileItemVariants} className="overflow-hidden">
                          <button
                            type="button"
                            aria-expanded={expanded}
                            className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold transition-all duration-200 ${
                              expanded || active
                                ? "bg-gradient-to-r from-[#0C2D5E] to-[#1565C0] text-white shadow-lg shadow-blue-900/20"
                                : "bg-white text-blue-900 shadow-sm shadow-slate-200/60 hover:bg-blue-50"
                            }`}
                            style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                            onClick={() => setActiveMobileMegaMenu(expanded ? null : link.nameKey)}
                          >
                            {Icon && (
                              <span
                                className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors ${
                                  expanded || active ? "bg-white/15 text-white" : "bg-blue-50 text-blue-600"
                                }`}
                              >
                                <Icon size={18} />
                              </span>
                            )}
                            <span className="flex-1 text-left">{t(link.nameKey)}</span>
                            <ChevronDown
                              size={18}
                              className={`transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
                            />
                          </button>
                          <AnimatePresence initial={false}>
                            {expanded && (
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                className="overflow-hidden"
                              >
                                <div className="mt-2 mb-1 mx-1 rounded-2xl bg-white shadow-sm shadow-slate-200/60 divide-y divide-slate-100">
                                  {link.megaMenuSections?.map((section, sectionIdx) => (
                                    <div key={sectionIdx} className="py-3.5 px-4">
                                      <h4 className="text-[11px] font-bold text-blue-500 uppercase tracking-wider mb-2.5" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>
                                        {t(section.titleKey)}
                                      </h4>
                                      <div className="flex flex-col">
                                        {section.items.map((item, itemIdx) => (
                                          <Link
                                            key={itemIdx}
                                            to={toHref(item.href)}
                                            className="block rounded-xl px-2.5 py-2 -mx-2.5 hover:bg-blue-50 transition-colors"
                                            style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                            onClick={() => {
                                              setActiveMobileMegaMenu(null);
                                              setIsOpen(false);
                                            }}
                                          >
                                            <div className="font-semibold text-sm text-slate-800">{t(item.nameKey)}</div>
                                            {item.descriptionKey && (
                                              <div className="text-xs text-slate-500 mt-0.5">{t(item.descriptionKey)}</div>
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
                        </motion.div>
                      );
                    }

                    return (
                      <motion.div key={link.nameKey} variants={mobileItemVariants}>
                        <Link
                          to={toHref(link.href)}
                          aria-current={active ? 'page' : undefined}
                          className={`flex items-center gap-3 px-4 py-3.5 rounded-2xl font-semibold no-underline visited:text-inherit transition-all duration-200 ${
                            active
                              ? "bg-gradient-to-r from-[#0C2D5E] to-[#1565C0] text-white shadow-lg shadow-blue-900/20"
                              : "bg-white text-blue-900 shadow-sm shadow-slate-200/60 hover:bg-blue-50"
                          }`}
                          style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                          onClick={() => setIsOpen(false)}
                        >
                          {Icon && (
                            <span
                              className={`flex items-center justify-center w-9 h-9 rounded-xl shrink-0 transition-colors ${
                                active ? "bg-white/15 text-white" : "bg-blue-50 text-blue-600"
                              }`}
                            >
                              <Icon size={18} />
                            </span>
                          )}
                          <span>{t(link.nameKey)}</span>
                        </Link>
                      </motion.div>
                    );
                  })}
                </motion.nav>

                {/* Language switcher — right below the nav list, after Karir */}
                <motion.div
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  className="mt-2 flex items-center justify-between bg-white rounded-2xl px-4 py-3 shadow-sm shadow-slate-200/60"
                >
                  <span className="text-sm font-semibold text-slate-700">{t('header.language')}</span>
                  <LanguageSwitcher isLight={true} />
                </motion.div>

                {/* WhatsApp CTA */}
                <motion.a
                  variants={mobileItemVariants}
                  initial="hidden"
                  animate="visible"
                  href={PRIMARY_OFFICE.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-3 flex items-center justify-center gap-2 px-4 py-3.5 rounded-2xl font-bold text-white shadow-lg shadow-green-900/15 transition-transform active:scale-[0.98]"
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)",
                  }}
                >
                  <MessageCircle size={19} />
                  {t('header.chatWhatsapp', 'Chat via WhatsApp')}
                </motion.a>

                <div className="mt-6 pt-5 border-t border-slate-200/80">
                  <div className="flex items-center justify-center gap-3">
                    <a
                      href={SOCIAL.instagram}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-700 shadow-sm shadow-slate-200/60 hover:text-white hover:bg-gradient-to-br hover:from-[#1565C0] hover:to-[#00AEEF] transition-all"
                      aria-label="Instagram"
                    >
                      <Instagram size={18} strokeWidth={2.5} />
                    </a>
                    <a
                      href={SOCIAL.tiktok}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-700 shadow-sm shadow-slate-200/60 hover:text-white hover:bg-gradient-to-br hover:from-[#1565C0] hover:to-[#00AEEF] transition-all"
                      aria-label="TikTok"
                    >
                      <TikTokIcon size={18} />
                    </a>
                    <a
                      href={SOCIAL.facebook}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center w-10 h-10 rounded-full bg-white text-blue-700 shadow-sm shadow-slate-200/60 hover:text-white hover:bg-gradient-to-br hover:from-[#1565C0] hover:to-[#00AEEF] transition-all"
                      aria-label="Facebook"
                    >
                      <Facebook size={18} strokeWidth={2.5} />
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