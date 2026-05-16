import React, { useState, useEffect } from "react";
import { Menu, X, Mail, Phone, ChevronDown, ArrowRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { ContactForm } from "./ContactForm";

// ─── Nav Config ───────────────────────────────────────────────
const NAV_LINKS = [
  { name: "Beranda", href: "#hero" },
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
  { name: "Tentang Kami", href: "#about" },
  { name: "Pelanggan", href: "#customer" },
  { name: "Kontak", href: "#contact" },
];

// ─── Types ────────────────────────────────────────────────────
type NavLink = {
  name: string;
  href: string;
  children?: { name: string; href: string; desc: string }[];
};

// ─── Sub-components ───────────────────────────────────────────
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

  // Close dropdown on outside click
  useEffect(() => {
    const handler = () => setActiveDropdown(null);
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, []);

  const isLight = scrolled; // transparent on top → light when scrolled

  return (
    <>
      {/* ── Top Bar (visible only when NOT scrolled) ─────────── */}
      <AnimatePresence>
        {!scrolled && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed top-0 left-0 w-full z-50 bg-[#050E1C]/80 backdrop-blur-md border-b border-white/8"
          >
            <div className="container mx-auto px-4 md:px-10 flex items-center justify-between h-9">
              <p className="text-[11px] text-slate-400 hidden md:block">
                Distributor Gas Industri, Medical & Speciality Gas — Sidoarjo, Jawa Timur
              </p>
              <div className="flex items-center gap-5 ml-auto">
                <a
                  href="mailto:marketing@suryaintigas.co.id"
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-300 transition-colors"
                >
                  <Mail size={11} />
                  marketing@suryaintigas.co.id
                </a>
                <span className="w-px h-3 bg-white/15" />
                <a
                  href="tel:+62"
                  className="flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <Phone size={11} />
                  Hubungi Kami
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main Navbar ──────────────────────────────────────── */}
      <nav
        className={`fixed left-0 w-full z-40 transition-all duration-300 ${scrolled
          ? "top-0 bg-white/97 backdrop-blur-lg shadow-md shadow-slate-200/50 py-3.5"
          : "top-9 bg-transparent py-4"
          }`}
      >
        <div className="container mx-auto px-4 md:px-10">
          <div className="flex justify-between items-center">

            {/* Logo */}
            <a href="#hero" className="flex items-center gap-3 shrink-0">
              <img
                src="/logo.png"
                alt="Logo PT Surya Inti Gas"
                className={`h-10 w-auto object-contain transition-all ${isLight ? "" : "brightness-0 invert"
                  }`}
              />
              <div>
                <div
                  className={`font-extrabold text-sm leading-tight transition-colors ${isLight ? "text-slate-900" : "text-white"
                    }`}
                >
                  PT SURYA INTI GAS
                </div>
                <div
                  className={`text-[10px] font-medium tracking-wider uppercase transition-colors ${isLight ? "text-slate-400" : "text-white/45"
                    }`}
                >
                  Distribusi Gas Terpercaya
                </div>
              </div>
            </a>

            {/* Desktop Nav */}
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
                    className={`flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${isLight
                      ? "text-slate-600 hover:text-blue-700 hover:bg-blue-50"
                      : "text-white/80 hover:text-white hover:bg-white/8"
                      }`}
                  >
                    {link.name}
                    {link.children && (
                      <ChevronDown
                        size={13}
                        className={`transition-transform duration-200 ${activeDropdown === link.name ? "rotate-180" : ""
                          }`}
                      />
                    )}
                  </a>

                  {/* Dropdown */}
                  <AnimatePresence>
                    {link.children && activeDropdown === link.name && (
                      <DropdownMenu items={link.children} />
                    )}
                  </AnimatePresence>
                </div>
              ))}

              {/* CTA */}
              <button
                onClick={() => setIsContactFormOpen(true)}
                className="ml-3 bg-blue-600 hover:bg-blue-500 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-600/25 hover:shadow-blue-500/35 flex items-center gap-2 cursor-pointer"
              >
                <Mail size={14} />
                Hubungi Kami
              </button>
            </div>

            {/* Mobile Toggle */}
            <button
              className={`lg:hidden p-2 rounded-lg transition-colors ${isLight ? "text-slate-700 hover:bg-slate-100" : "text-white hover:bg-white/10"
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
                          className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 transition-colors"
                        >
                          {link.name}
                          <ChevronDown
                            size={15}
                            className={`text-slate-400 transition-transform duration-200 ${mobileExpanded === link.name ? "rotate-180" : ""
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
                        className="block px-3 py-2.5 rounded-lg text-slate-700 font-semibold text-sm hover:bg-slate-50 hover:text-blue-700 transition-colors"
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
                    className="flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold text-sm w-full transition-colors cursor-pointer"
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
