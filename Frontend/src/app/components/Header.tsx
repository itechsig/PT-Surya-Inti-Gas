import React, { useState } from "react";
import { Menu, X, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useTranslation } from "react-i18next";
import { useScrolledPast } from "../../hooks/useScrollProgress";

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
        titleKey: "header.megaMenu.equipmentAccessories",
        items: [
          { nameKey: "header.colorCode", href: "/produk?category=equipment&subcategory=color-code", descriptionKey: "header.megaMenu.colorCodeDesc" },
          { nameKey: "header.package", href: "/produk?category=equipment&subcategory=package", descriptionKey: "header.megaMenu.packageDesc" },
          { nameKey: "header.assistGas", href: "/produk?category=equipment&subcategory=assist-gas", descriptionKey: "header.megaMenu.assistGasDesc" },
          { nameKey: "header.cryogenicTransport", href: "/produk?category=equipment&subcategory=cryogenic-transport", descriptionKey: "header.megaMenu.cryogenicTransportDesc" },
          { nameKey: "header.regulatorValves", href: "/produk?category=equipment&subcategory=regulator-valves", descriptionKey: "header.megaMenu.regulatorValvesDesc" },
          { nameKey: "header.medicalGasEquipment", href: "/produk?category=equipment&subcategory=medical-gas-equipment", descriptionKey: "header.megaMenu.medicalGasEquipmentDesc" },
        ]
      }
    ]
  },
  { nameKey: "header.news", href: "/berita", isRoute: true },
  { nameKey: "header.gallery", href: "/galeri", isRoute: true },
  { nameKey: "header.contact", href: "/kontak", isRoute: true },
  { nameKey: "header.career", href: "/karir", isRoute: true },
];

// ─── Corporate Shared class builders (Air Liquide inspired) ────────────────────────────────────
const desktopLinkClass = (isLight: boolean) => {
  return `flex items-center gap-2 px-4 py-3 text-sm transition-all duration-200 font-semibold relative group ${isLight ? 'text-gray-800 hover:text-black' : 'text-white hover:text-gray-200'}`;
};

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
  color: isLight ? '#6b7280' : '#ffffff',
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
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  const [activeMegaMenu, setActiveMegaMenu] = useState<string | null>(null);
  const [activeMobileMegaMenu, setActiveMobileMegaMenu] = useState<string | null>(null);
  const scrolled = useScrolledPast(50);

  const { pathname, hash } = useLocation();
  const isHomePage = pathname === "/";
  const isLight = scrolled;

  // Debug logging
  console.log('Header debug:', { pathname, isHomePage, scrolled, isLight });

  // Helper: cek apakah link ini aktif
  const isActive = (href: string) => {
    const [hrefPath, hrefHash] = href.split("#");
    if (hrefHash) return pathname === hrefPath && hash === `#${hrefHash}`;
    if (hrefPath === "/") return pathname === "/" && hash === "";
    return pathname.startsWith(hrefPath) && hrefPath !== "/";
  };

  const handleMegaMenuEnter = (nameKey: string) => {
    setActiveMegaMenu(nameKey);
  };

  const handleMegaMenuLeave = () => {
    setActiveMegaMenu(null);
  };

  const handleNavigation = (href: string, e?: React.MouseEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (href.startsWith('#')) {
      // Hash navigation
      if (window.location.pathname === '/') {
        const target = document.getElementById(href.substring(1));
        if (target) {
          target.scrollIntoView({ behavior: 'smooth' });
        }
      } else {
        navigate('/');
        setTimeout(() => {
          const target = document.getElementById(href.substring(1));
          if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
          }
        }, 100);
      }
    } else {
      navigate(href);
    }
    setActiveMegaMenu(null);
  };

  return (
    <>
      {/* ── Corporate Navbar (Linde & Air Liquide inspired) ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
          isLight
            ? "bg-white/98 backdrop-blur-xl shadow-lg shadow-gray-200/50 border-b border-gray-200 py-4"
            : "bg-transparent backdrop-blur-none shadow-none border-none py-5"
        }`}
      >
        <div className="w-full">
          <div className="flex justify-between items-center px-6 lg:px-12">

            {/* Corporate Logo */}
            <a href="/" className="flex items-center gap-4 shrink-0 -ml-2 lg:-ml-4">
              <div className="relative">
                <img
                  src="/logo.png"
                  alt="Logo PT Surya Inti Gas"
                  className="h-14 w-auto object-contain transition-all duration-300"
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
                    color: isLight ? '#6b7280' : '#ffffff',
                  }}
                >
                  SURYA INTI GAS
                </div>

                <div
                  className="w-16 h-0.5 my-1"
                  style={{
                    background: isLight ? "linear-gradient(90deg, #6b7280 0%, #9ca3af 100%)" : "linear-gradient(90deg, #ffffff 0%, #d1d5db 100%)",
                  }}
                />

                <div
                  style={{
                    fontFamily: "'Barlow', system-ui, sans-serif",
                    fontWeight: 600,
                    fontSize: "10px",
                    letterSpacing: "0.24em",
                    textTransform: "uppercase" as const,
                    color: isLight ? '#6b7280' : "#ffffff",
                  }}
                >
                  {t('header.corporate')}
                </div>
              </div>
            </a>

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
                  return (
                    <div
                      key={link.nameKey}
                      className="relative"
                    >
                      <div
                        className={`${desktopLinkClass(isLight)} ${active ? (isLight ? 'text-gray-900' : 'text-white') : ''}`}
                        style={{ ...desktopLinkStyle(isLight), cursor: 'pointer' }}
                        onClick={() => activeMegaMenu === link.nameKey ? handleMegaMenuLeave() : handleMegaMenuEnter(link.nameKey)}
                      >
                        {t(link.nameKey)}
                        <ChevronDown size={16} className={`ml-1 transition-transform duration-200 ${activeMegaMenu === link.nameKey ? 'rotate-180' : ''}`} />
                      </div>

                      {/* Corporate Mega Menu */}
                      <AnimatePresence>
                        {activeMegaMenu === link.nameKey && (
                          <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[800px] bg-white rounded-xl shadow-2xl border border-slate-100 z-50 overflow-hidden"
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
                                        to={item.href}
                                        className="block group"
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleNavigation(item.href, e);
                                        }}
                                      >
                                        <div className="text-sm font-semibold text-slate-800 group-hover:text-gray-600 transition-colors mb-1" style={{ fontFamily: "'Barlow', system-ui, sans-serif" }}>
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
                    to={link.href}
                    className={`${desktopLinkClass(isLight)} ${active ? (isLight ? 'text-gray-900' : 'text-white') : ''}`}
                    style={{ ...desktopLinkStyle(isLight) }}
                    onClick={(e) => {
                      e.preventDefault();
                      handleNavigation(link.href, e);
                    }}
                  >
                    {t(link.nameKey)}
                  </Link>
                );
              })}
            </div>

            {/* Corporate Right Actions */}
            <div className="flex items-center gap-3">
              {/* Language Switcher */}
              <div className="hidden lg:block">
                <LanguageSwitcher isLight={isLight} />
              </div>

              {/* Mobile Menu Button */}
              <button
                className={`lg:hidden p-2 rounded-lg transition-colors ${isLight ? 'text-gray-800 hover:bg-gray-100' : 'text-white hover:bg-white/10'}`}
                onClick={() => setIsOpen(!isOpen)}
                aria-label="Toggle menu"
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
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 lg:hidden"
          >
            <div className="absolute inset-0 bg-white/98 backdrop-blur-xl" />
            <div className="relative h-full overflow-y-auto">
              <div className="w-full px-4 py-4 sm:px-6 sm:py-6">
                <div className="flex justify-between items-center mb-6 sm:mb-8">
                  <a href="/" className="flex items-center gap-3">
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
                          fontSize: "12px sm:14px",
                          letterSpacing: "0.12em",
                        }}
                      >
                        SURYA INTI GAS
                      </div>
                      <div className="text-[10px] sm:text-xs text-blue-600 font-semibold tracking-wider uppercase">
                        {t('header.corporate')}
                      </div>
                    </div>
                  </a>
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
                                        to={item.href}
                                        className="block text-sm text-slate-700 hover:text-blue-600 py-2 transition-colors"
                                        style={{ fontFamily: "'DM Sans', system-ui, sans-serif" }}
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleNavigation(item.href, e);
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
                        to={link.href}
                        className={mobileLinkClass(active)}
                        style={{ ...mobileLinkStyle }}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavigation(link.href, e);
                          setIsOpen(false);
                        }}
                      >
                        {t(link.nameKey)}
                      </Link>
                    );
                  })}
                </div>

                <div className="mt-8 pt-6 border-t border-slate-200">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-700">{t('header.language')}</span>
                    <LanguageSwitcher isLight={true} />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};