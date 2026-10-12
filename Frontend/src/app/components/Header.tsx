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
import { trackEvent } from "../../utils/eventTracking";

// ─── Corporate Nav Config (Air Liquide & Linde inspired) ───────────────────────────────────────────────
type MegaMenuItem = { nameKey: string; href: string; children?: Array<{ nameKey: string; href: string }> };

type NavItem = {
  nameKey: string;
  href: string;
  isRoute?: boolean;
  isDisabled?: boolean;
  hasMegaMenu?: boolean;
  megaMenuItems?: MegaMenuItem[];
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
    megaMenuItems: [
      {
        nameKey: "header.megaMenu.gasProducts",
        href: "/produk?category=gas",
        children: [
          { nameKey: "header.industrialMedicalSpeciality", href: "/produk?category=gas&subcategory=industrial-medical-speciality" },
          { nameKey: "header.liquid", href: "/produk?category=gas&subcategory=liquid" },
        ]
      },
      {
        nameKey: "header.package",
        href: "/produk?category=package",
        children: [
          { nameKey: "header.megaMenu.packageGas", href: "/produk?category=package&subcategory=package-gas" },
          { nameKey: "header.megaMenu.packageCylinder", href: "/produk?category=package&subcategory=package-cylinder" },
          { nameKey: "header.relatedEquipment", href: "/produk?category=package&subcategory=related-equipment" },
        ]
      },
      {
        nameKey: "header.megaMenu.servicesSolutions",
        href: "/produk?category=services",
        children: [
          { nameKey: "header.services", href: "/produk?category=services" },
        ]
      },
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
  const [activeMobileSubmenu, setActiveMobileSubmenu] = useState<string | null>(null);
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
  // Closing on hover-out is debounced so a mouse crossing the small gap between
  // the trigger and the panel below it doesn't flicker the menu shut.
  const megaMenuCloseTimeoutRef = useRef<number | null>(null);

  // Mobile menu: lock the page behind it, close on Escape, keep Tab inside the
  // panel, and hand focus back to the trigger when it closes.
  useEffect(() => {
    if (!isOpen) return;
    const { body } = document;
    const scrollY = window.scrollY;
    // Removing the scrollbar (via overflow:hidden alone) makes the body a few
    // pixels wider, which shifts fixed-width/centered content and leaves a
    // white gap on the right. Pin the body in place with `position: fixed`
    // instead — this also stops iOS/Android from chaining an overscroll drag
    // through to the page behind once the menu list hits its own scroll end,
    // which was letting the page underneath peek through at the bottom.
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      width: body.style.width,
      overflow: body.style.overflow,
      paddingRight: body.style.paddingRight,
    };
    body.style.position = 'fixed';
    body.style.top = `-${scrollY}px`;
    body.style.width = '100%';
    body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`;
    }

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
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      body.style.paddingRight = prev.paddingRight;
      window.scrollTo(0, scrollY);
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
    setActiveMobileSubmenu(null);
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

  // Hover-to-open for the desktop mega menu: opening cancels any pending close,
  // closing is delayed briefly so moving the pointer from the trigger down into
  // the panel (crossing the small gap between them) doesn't flicker it shut.
  const openMegaMenuOnHover = (name: string) => {
    if (megaMenuCloseTimeoutRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimeoutRef.current);
      megaMenuCloseTimeoutRef.current = null;
    }
    setActiveMegaMenu(name);
  };
  const scheduleMegaMenuClose = () => {
    if (megaMenuCloseTimeoutRef.current !== null) {
      window.clearTimeout(megaMenuCloseTimeoutRef.current);
    }
    megaMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setActiveMegaMenu(null);
      megaMenuCloseTimeoutRef.current = null;
    }, 150);
  };

  useEffect(() => {
    return () => {
      if (megaMenuCloseTimeoutRef.current !== null) window.clearTimeout(megaMenuCloseTimeoutRef.current);
    };
  }, []);

  return (
    <header role="banner">
      {/* ── Corporate Navbar (Linde & Air Liquide inspired) ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isOpen
            // The mobile drawer is a fully opaque panel that completely covers this bar, so
            // `backdrop-blur-xl` here is invisible while it's open — but the browser still has
            // to keep computing that blur every frame underneath the drawer's own slide/stagger
            // animation, which is what was making the open transition feel laggy. Swap to a
            // plain solid background for the duration the drawer is open; nothing visibly changes.
            ? "bg-white shadow-lg shadow-gray-200/50 border-b border-gray-200 py-2.5 lg:py-4"
            : isLight
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
                      onMouseEnter={() => openMegaMenuOnHover(link.nameKey)}
                      onMouseLeave={scheduleMegaMenuClose}
                    >
                      <Link
                        to={toHref(link.href)}
                        aria-expanded={open}
                        aria-haspopup="true"
                        aria-controls={menuId}
                        aria-current={active ? 'page' : undefined}
                        className={`${desktopLinkClass(isLight)} ${active ? activeMarkClass(isLight) : ''}`}
                        style={{ ...desktopLinkStyle(isLight), cursor: 'pointer' }}
                        onFocus={() => openMegaMenuOnHover(link.nameKey)}
                        onClick={() => setActiveMegaMenu(null)}
                      >
                        {t(link.nameKey)}
                        <ChevronDown size={16} aria-hidden="true" className={`ml-1 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
                      </Link>

                      {/* Corporate Mega Menu — Singapore Airlines-style column layout: each
                          top-level entry is its own bold, always-expanded column. */}
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
                            className="absolute top-full left-0 mt-2 grid grid-cols-3 divide-x divide-slate-100 bg-white rounded-xl shadow-2xl border border-slate-100 z-50 w-[42rem]"
                          >
                            {link.megaMenuItems?.map((column, colIdx) => (
                              <div key={colIdx} className="px-5 py-5">
                                <Link
                                  to={toHref(column.href)}
                                  className="block pb-3 mb-1 border-b-2 border-slate-200 text-sm font-extrabold uppercase tracking-wide text-slate-900 hover:text-brand-blue transition-colors"
                                  style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                                  onClick={() => setActiveMegaMenu(null)}
                                >
                                  {t(column.nameKey)}
                                </Link>
                                <div className="flex flex-col">
                                  {column.children?.map((child, childIdx) => (
                                    <Link
                                      key={childIdx}
                                      to={toHref(child.href)}
                                      className="py-2.5 border-b border-slate-100 text-sm font-semibold text-slate-700 hover:text-brand-blue transition-colors"
                                      style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                                      onClick={() => setActiveMegaMenu(null)}
                                    >
                                      {t(child.nameKey)}
                                    </Link>
                                  ))}
                                </div>
                              </div>
                            ))}
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
      {/* Kept deliberately plain: no slide/stagger/height animations, blurs or layered
          shadows, so opening and expanding the menu stays smooth on low-end phones. */}
      {isOpen && (
        <div
          ref={mobilePanelRef}
          role="dialog"
          aria-modal="true"
          aria-label={t('header.menu', 'Menu navigasi')}
          className="fixed inset-0 z-50 lg:hidden bg-white"
        >
          <div className="h-full overflow-y-auto overscroll-contain flex flex-col">
            {/* Header band */}
            <div className="shrink-0 px-4 sm:px-6 py-4 bg-[#0C2D5E]">
              <div className="flex justify-between items-center">
                <Link to={`/${currentLang}`} onClick={() => setIsOpen(false)} className="flex items-center gap-3">
                  <div className="bg-white rounded-lg p-1.5">
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
                  className="p-2.5 rounded-full text-white hover:bg-white/10"
                  onClick={() => setIsOpen(false)}
                  aria-label="Close menu"
                >
                  <X size={22} />
                </button>
              </div>
            </div>

            <div className="flex-1 px-4 py-2 sm:px-6">
              <nav className="flex flex-col divide-y divide-slate-200">
                {NAV_LINKS.map((link) => {
                  const active = isActive(link.href);
                  const Icon = NAV_ICONS[link.nameKey];

                  if (link.isDisabled) {
                    return (
                      <span
                        key={link.nameKey}
                        className="flex items-center gap-3 px-2 py-3.5 text-slate-400 cursor-not-allowed"
                        style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                      >
                        {Icon && <Icon size={18} className="shrink-0" />}
                        {t(link.nameKey)} <span className="text-xs ml-1">({t('header.comingSoon')})</span>
                      </span>
                    );
                  }

                  if (link.hasMegaMenu) {
                    const expanded = activeMobileMegaMenu === link.nameKey;
                    return (
                      <div key={link.nameKey}>
                        {/* Same flow as desktop: tapping the label goes straight to the category
                            page; the chevron next to it still opens the sub-menu. */}
                        <div className={`flex items-center ${expanded || active ? "text-[#1565C0]" : "text-blue-900"}`}>
                          <Link
                            to={toHref(link.href)}
                            aria-current={active ? 'page' : undefined}
                            className="flex-1 flex items-center gap-3 px-2 py-3.5 font-semibold no-underline visited:text-inherit"
                            style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                            onClick={() => {
                              setActiveMobileMegaMenu(null);
                              setActiveMobileSubmenu(null);
                              setIsOpen(false);
                            }}
                          >
                            {Icon && <Icon size={18} className="shrink-0" />}
                            <span>{t(link.nameKey)}</span>
                          </Link>
                          <button
                            type="button"
                            aria-expanded={expanded}
                            aria-label={t(link.nameKey)}
                            className="p-3.5 -mr-1"
                            onClick={() => {
                              setActiveMobileMegaMenu(expanded ? null : link.nameKey);
                              setActiveMobileSubmenu(null);
                            }}
                          >
                            <ChevronDown size={18} className={expanded ? 'rotate-180' : ''} />
                          </button>
                        </div>
                        {expanded && (
                          <div className="mb-2 ml-7 rounded-lg bg-slate-50 divide-y divide-slate-200">
                            {link.megaMenuItems?.map((item, itemIdx) => {
                              const hasChildren = !!item.children?.length;
                              const subExpanded = activeMobileSubmenu === item.nameKey;

                              if (!hasChildren) {
                                return (
                                  <Link
                                    key={itemIdx}
                                    to={toHref(item.href)}
                                    className="block px-3 py-2.5 font-semibold text-sm text-slate-800"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                    onClick={() => {
                                      setActiveMobileMegaMenu(null);
                                      setIsOpen(false);
                                    }}
                                  >
                                    {t(item.nameKey)}
                                  </Link>
                                );
                              }

                              return (
                                <div key={itemIdx}>
                                  <button
                                    type="button"
                                    aria-expanded={subExpanded}
                                    className="w-full flex items-center justify-between px-3 py-2.5 font-semibold text-sm text-slate-800"
                                    style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                    onClick={() => setActiveMobileSubmenu(subExpanded ? null : item.nameKey)}
                                  >
                                    {t(item.nameKey)}
                                    <ChevronDown size={16} className={subExpanded ? 'rotate-180' : ''} />
                                  </button>
                                  {subExpanded && (
                                    <div className="pl-3 pb-1 flex flex-col">
                                      {item.children!.map((child, childIdx) => (
                                        <Link
                                          key={childIdx}
                                          to={toHref(child.href)}
                                          className="block px-3 py-2 font-semibold text-sm text-slate-600"
                                          style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                          onClick={() => {
                                            setActiveMobileMegaMenu(null);
                                            setActiveMobileSubmenu(null);
                                            setIsOpen(false);
                                          }}
                                        >
                                          {t(child.nameKey)}
                                        </Link>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
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
                      className={`flex items-center gap-3 px-2 py-3.5 font-semibold no-underline visited:text-inherit ${
                        active ? "text-[#1565C0]" : "text-blue-900"
                      }`}
                      style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {Icon && <Icon size={18} className="shrink-0" />}
                      <span>{t(link.nameKey)}</span>
                    </Link>
                  );
                })}
              </nav>

              {/* Language switcher — right below the nav list, after Karir */}
              <div className="mt-2 flex items-center justify-between border-t border-slate-200 px-2 py-3">
                <span className="text-sm font-semibold text-slate-700">{t('header.language')}</span>
                <LanguageSwitcher isLight={true} />
              </div>

              {/* WhatsApp CTA */}
              <a
                href={PRIMARY_OFFICE.whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackEvent('whatsapp_click', { label: 'header' })}
                className="mt-3 flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl font-bold text-white bg-[#25D366]"
                style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}
              >
                <MessageCircle size={19} />
                {t('header.chatWhatsapp', 'Chat via WhatsApp')}
              </a>

              <div className="mt-6 pt-5 pb-6 border-t border-slate-200">
                <div className="flex items-center justify-center gap-3">
                  <a
                    href={SOCIAL.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-blue-700"
                    aria-label="Instagram"
                  >
                    <Instagram size={18} strokeWidth={2.5} />
                  </a>
                  <a
                    href={SOCIAL.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-blue-700"
                    aria-label="TikTok"
                  >
                    <TikTokIcon size={18} />
                  </a>
                  <a
                    href={SOCIAL.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center w-10 h-10 rounded-full bg-slate-100 text-blue-700"
                    aria-label="Facebook"
                  >
                    <Facebook size={18} strokeWidth={2.5} />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};