import React, { useState, useEffect } from "react";
import { Menu, X, Mail } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "./ContactForm";
import { Link, useLocation } from "react-router-dom";

// ─── Import Barlow font ─────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
document.head.appendChild(fontLink);

// ─── Nav Config ───────────────────────────────────────────────
type NavItem = { name: string; href: string; isRoute?: boolean; isDisabled?: boolean };

const NAV_LINKS: NavItem[] = [
  { name: "Beranda", href: "/", isRoute: true },
  { name: "Tentang Kami", href: "/#about" },
  { name: "Produk & Layanan", href: "/produk", isRoute: true },
  { name: "Kontak", href: "/#kontak" },
  { name: "Karir", href: "/karir", isRoute: true},
];

// ─── Shared class builders ────────────────────────────────────
const desktopLinkClass = (isLight: boolean) =>
  `flex items-center gap-1 px-5 py-2 rounded-lg text-sm transition-colors ${
    isLight
      ? "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
      : "text-white/85 hover:text-white hover:bg-white/10"
  }`;

const mobileLinkClass =
  "block px-3 py-3 rounded-lg text-slate-700 text-sm hover:bg-slate-50 hover:text-blue-700 transition-colors";

const desktopLinkStyle = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 600,
} as React.CSSProperties;

const mobileLinkStyle = {
  fontFamily: "'Barlow', system-ui, sans-serif",
  fontWeight: 700,
} as React.CSSProperties;

// ─── Main Component ───────────────────────────────────────────
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const { pathname } = useLocation();
  const isHomePage = pathname === "/";
  const isLight = !isHomePage || scrolled;

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          isLight
            ? "bg-white/95 backdrop-blur-lg shadow-md shadow-slate-200/50 py-3.5"
            : "bg-transparent py-4"
        }`}
      >
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo.png"
                alt="Logo PT Surya Inti Gas"
                className={`h-10 w-auto object-contain transition-all ${
                  isLight ? "" : "brightness-0 invert"
                }`}
              />
              <div>
                <div
                  className={`text-sm leading-tight transition-colors ${
                    isLight ? "text-slate-900" : "text-white"
                  }`}
                  style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 800 }}
                >
                  PT SURYA INTI GAS
                </div>
                <div
                  className={`text-[10px] tracking-wider uppercase transition-colors ${
                    isLight ? "text-slate-400" : "text-white/60"
                  }`}
                  style={{ fontFamily: "'DM Sans', system-ui, sans-serif", fontWeight: 500 }}
                >
                  Distributor Gas
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => {
                // 1. Disabled — tampil abu-abu, tidak bisa diklik
                if (link.isDisabled) return (
                  <span
                    key={link.name}
                    title="Segera hadir"
                    className="flex items-center px-5 py-2 rounded-lg text-sm cursor-not-allowed select-none"
                    style={{
                      ...desktopLinkStyle,
                      color: isLight ? "#cbd5e1" : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {link.name}
                  </span>
                );

                // 2. React Router Link
                if (link.isRoute) return (
                  <Link
                    key={link.name}
                    to={link.href}
                    className={desktopLinkClass(isLight)}
                    style={desktopLinkStyle}
                  >
                    {link.name}
                  </Link>
                );

                // 3. Anchor biasa (hash link)
                return (
                  <a
                    key={link.name}
                    href={link.href}
                    className={desktopLinkClass(isLight)}
                    style={desktopLinkStyle}
                  >
                    {link.name}
                  </a>
                );
              })}
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
                {NAV_LINKS.map((link) => {
                  // 1. Disabled
                  if (link.isDisabled) return (
                    <span
                      key={link.name}
                      className="block px-3 py-3 rounded-lg text-sm cursor-not-allowed select-none text-slate-300"
                      style={mobileLinkStyle}
                    >
                      {link.name}
                      <span className="ml-2 text-xs text-slate-300">(Segera hadir)</span>
                    </span>
                  );

                  // 2. React Router Link
                  if (link.isRoute) return (
                    <Link
                      key={link.name}
                      to={link.href}
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass}
                      style={mobileLinkStyle}
                    >
                      {link.name}
                    </Link>
                  );

                  // 3. Anchor biasa
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsOpen(false)}
                      className={mobileLinkClass}
                      style={mobileLinkStyle}
                    >
                      {link.name}
                    </a>
                  );
                })}

                {/* Mobile CTA */}
                <div className="pt-4 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setIsContactFormOpen(true);
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

      {/* Contact Form Modal */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  );
};
