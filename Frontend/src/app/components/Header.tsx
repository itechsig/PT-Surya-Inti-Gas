import React, { useState, useEffect } from "react";
import { Menu, X, Mail, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "./ContactForm";

// ─── Import Barlow font (seragam dengan Hero) ─────────────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href = "https://fonts.googleapis.com/css2?family=Barlow:wght@500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
document.head.appendChild(fontLink);

// ─── Nav Config ───────────────────────────────────────────────
const NAV_LINKS = [
  { name: "Beranda", href: "#hero" },
  { name: "Tentang Kami", href: "#about" },
  { name: "Layanan", href: "#services" },
  {
    name: "Produk",
    href: "#produk",
    children: [
      { name: "Gas Industri & Medis", href: "#produk-gas", desc: "O₂, N₂, Ar, C₂H₂, He, Mixed Gas" },
      { name: "Cryogenic Equipment", href: "#produk-cryo", desc: "Cylinder, Tank, Isotank" },
      { name: "Regulators & Valves", href: "#produk-valve", desc: "High Pressure & Cryogenic" },
      { name: "Assist Gas Supply", href: "#produk-assist", desc: "Laser Cutting Support" },
    ],
  },
  { name: "Kontak", href: "#contact" },
];

// ─── Types ────────────────────────────────────────────────────
type NavLink = {
  name: string;
  href: string;
  children?: { name: string; href: string; desc: string }[];
};

// ─── Dropdown Menu ────────────────────────────────────────────
const DropdownMenu = ({ items }: { items: NonNullable<NavLink["children"]> }) => (
  <motion.div
    initial={{ opacity: 0, y: 8, scale: 0.97 }}
    animate={{ opacity: 1, y: 0, scale: 1 }}
    exit={{ opacity: 0, y: 8, scale: 0.97 }}
    transition={{ duration: 0.18, ease: "easeOut" }}
    className="absolute top-full left-1/2 -translate-x-1/2 mt-3 w-72 bg-white rounded-xl shadow-2xl shadow-slate-200/60 border border-slate-100 overflow-hidden z-50"
  >
    <div className="p-2">
      {items.map((item) => (
        <a
          key={item.name}
          href={item.href}
          className="flex items-start gap-3 px-3 py-3 rounded-lg hover:bg-blue-50 group transition-colors"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-2 shrink-0 group-hover:bg-blue-600 transition-colors" />
          <div>
            <div className="text-sm font-semibold text-slate-800 group-hover:text-blue-700 transition-colors leading-tight">
              {item.name}
            </div>
            <div className="text-xs text-slate-400 mt-0.5">{item.desc}</div>
          </div>
        </a>
      ))}
    </div>
    <div className="border-t border-slate-100 px-4 py-3 bg-slate-50">
      <a
        href="#produk"
        className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors"
      >
        Lihat semua produk <ArrowRight size={11} />
      </a>
    </div>
  </motion.div>
);

// ─── Main Component ───────────────────────────────────────────
export const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [mobileExpanded, setMobileExpanded] = useState<string | null>(null);
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const isLight = scrolled;

  return (
    <>
      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed top-0 left-0 w-full z-40 transition-all duration-300 ${
          scrolled
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
                {/* FIX: pakai font Barlow seragam dengan Hero */}
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

            {/* Desktop Nav + CTA */}
            <div className="hidden lg:flex items-center gap-1">
              {NAV_LINKS.map((link) => (
                <div
                  key={link.name}
                  className="relative"
                  onClick={(e) => e.stopPropagation()}
                  onMouseEnter={() => link.children && setActiveDropdown(link.name)}
                  onMouseLeave={() => setActiveDropdown(null)}
                >
                  <a
                    href={link.href}
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm transition-colors ${
                      isLight
                        ? "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                        : "text-white/85 hover:text-white hover:bg-white/10"
                    }`}
                    style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 600 }}
                  >
                    {link.name}
                    {link.children && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${
                          activeDropdown === link.name ? "rotate-180" : ""
                        }`}
                      />
                    )}
                  </a>

                  <AnimatePresence>
                    {link.children && activeDropdown === link.name && (
                      <DropdownMenu items={link.children} />
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* CTA — FIX: selalu biru solid, bukan transparan saat belum scroll */}
              <button
                onClick={() => setIsContactFormOpen(true)}
                className={`flex items-center gap-2 ml-3 px-4 py-2 rounded-lg text-sm transition-colors cursor-pointer ${
                  isLight
                    ? "bg-blue-600 hover:bg-blue-700 text-white"
                    : "bg-blue-600 hover:bg-blue-500 text-white"
                }`}
                style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 700 }}
              >
                <Mail size={14} />
                Hubungi Kami
              </button>
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
                {NAV_LINKS.map((link) => (
                  <div key={link.name}>
                    {link.children ? (
                      <>
                        <button
                          onClick={() =>
                            setMobileExpanded(
                              mobileExpanded === link.name ? null : link.name
                            )
                          }
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 text-sm hover:bg-slate-50 transition-colors"
                          style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 700 }}
                        >
                          {link.name}
                          <ChevronDown
                            size={15}
                            className={`text-slate-400 transition-transform duration-200 ${
                              mobileExpanded === link.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <AnimatePresence>
                          {mobileExpanded === link.name && (
                            <motion.div
                              initial={{ opacity: 0, height: 0 }}
                              animate={{ opacity: 1, height: "auto" }}
                              exit={{ opacity: 0, height: 0 }}
                              transition={{ duration: 0.2 }}
                              className="overflow-hidden"
                            >
                              <div className="pl-4 py-1 space-y-0.5">
                                {link.children.map((child) => (
                                  <a
                                    key={child.name}
                                    href={child.href}
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-start gap-2.5 px-3 py-2.5 rounded-lg hover:bg-blue-50 group transition-colors"
                                  >
                                    <div className="w-1 h-1 rounded-full bg-blue-400 mt-2 shrink-0" />
                                    <div>
                                      <div className="text-sm font-medium text-slate-700 group-hover:text-blue-700">
                                        {child.name}
                                      </div>
                                      <div className="text-xs text-slate-400">{child.desc}</div>
                                    </div>
                                  </a>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </>
                    ) : (
                      <a
                        href={link.href}
                        onClick={() => setIsOpen(false)}
                        className="block px-3 py-2.5 rounded-lg text-slate-700 text-sm hover:bg-slate-50 hover:text-blue-700 transition-colors"
                        style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 700 }}
                      >
                        {link.name}
                      </a>
                    )}
                  </div>
                ))}

                {/* Mobile CTA */}
                <div className="pt-3 border-t border-slate-100 space-y-2">
                  <button
                    onClick={() => {
                      setIsContactFormOpen(true);
                      setIsOpen(false);
                    }}
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg text-sm w-full transition-colors cursor-pointer"
                    style={{ fontFamily: "'Barlow', system-ui, sans-serif", fontWeight: 700 }}
                  >
                    <Mail size={15} />
                    Hubungi Kami
                  </button>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400 py-1">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Siap melayani — Sidoarjo, Jawa Timur
                  </div>
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
