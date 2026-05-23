import React, { useRef, useState } from "react";
import { motion, useInView } from "motion/react";
import { ContactForm } from "./ContactForm";
import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Clock,
  ExternalLink,
  ChevronRight,
  MessageSquare,
} from "lucide-react";

// ─── Font injection (Barlow, seragam dengan Header) ──────────
const fontLink = document.createElement("link");
fontLink.rel = "stylesheet";
fontLink.href =
  "https://fonts.googleapis.com/css2?family=Barlow:wght@400;500;600;700;800&family=DM+Sans:opsz,wght@9..40,400;9..40,500;9..40,600&display=swap";
if (!document.head.querySelector('link[href*="Barlow"]')) {
  document.head.appendChild(fontLink);
}

// ─── Types ────────────────────────────────────────────────────
type OfficeData = {
  type: "pusat" | "cabang";
  label: string;
  name: string;
  address: string;
  phones: string[];
  fax?: string;
  email: string;
  maps: string;
  color: string;
  bgAccent: string;
};

// ─── Data Kontak ─────────────────────────────────────────────
const OFFICES: OfficeData[] = [
  {
    type: "pusat",
    label: "Kantor Pusat",
    name: "PT. Surya Inti Gas — Sidoarjo",
    address:
      'Komp. Perg. & Industri "Safe N Lock"\nBlok V1 – 3223, 3225, 3232, 3233\nJl. Lingkar Timur KM. 5.5\nRangkah Kidul, Sidoarjo\nJawa Timur 61232',
    phones: ["+62 31 – 9970 4788", "+62 31 – 9970 4789"],
    fax: "+62 31 – 9970 4778",
    email: "salescounter.sda@suryaintigas.co.id",
    maps: "https://maps.google.com/?q=Komplek+Pergudangan+Safe+N+Lock+Sidoarjo",
    color: "#1d4ed8",
    bgAccent: "#eff6ff",
  },
  {
    type: "cabang",
    label: "Kantor Cabang",
    name: "PT. Surya Inti Gas — Balikpapan",
    address:
      "Jl. AMD Projakal No.27, Batu Ampar\nKec. Balikpapan Utara\nKota Balikpapan\nKalimantan Timur 76127\nIndonesia",
    phones: ["+62 542 – 8531991", "+62 542 – 8532382"],
    email: "salescounter.bpn@suryaintigas.co.id",
    maps: "https://maps.google.com/?q=Jl+AMD+Projakal+Kariangau+Balikpapan",
    color: "#0369a1",
    bgAccent: "#f0f9ff",
  },
];

// ─── Fade-in wrapper ─────────────────────────────────────────
const FadeIn = ({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-60px" });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 28 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

// ─── Office Card ─────────────────────────────────────────────
const OfficeCard = ({ office, delay }: { office: OfficeData; delay: number }) => (
  <FadeIn delay={delay}>
    <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden h-full flex flex-col hover:shadow-xl hover:shadow-slate-200/80 transition-shadow duration-300">
      {/* Card Header */}
      <div
        className="px-7 py-5 flex items-center gap-3"
        style={{ background: `linear-gradient(135deg, ${office.color} 0%, ${office.color}cc 100%)` }}
      >
        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center shrink-0">
          <Building2 size={20} className="text-white" />
        </div>
        <div>
          <span
            className="text-xs font-semibold uppercase tracking-widest text-white/70"
            style={{ fontFamily: "'DM Sans', sans-serif" }}
          >
            {office.label}
          </span>
          <h3
            className="text-white text-base leading-tight mt-0.5"
            style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
          >
            {office.name}
          </h3>
        </div>
      </div>

      {/* Card Body */}
      <div className="px-7 py-6 flex flex-col gap-5 flex-1">
        {/* Alamat */}
        <div className="flex gap-3.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
            style={{ background: office.bgAccent }}
          >
            <MapPin size={15} style={{ color: office.color }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Alamat
            </p>
            <p
              className="text-sm text-slate-700 leading-relaxed whitespace-pre-line"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              {office.address}
            </p>
            <a
              href={office.maps}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 mt-2 text-xs font-semibold transition-colors"
              style={{ color: office.color, fontFamily: "'Barlow', sans-serif" }}
            >
              Lihat di Google Maps <ExternalLink size={11} />
            </a>
          </div>
        </div>

        {/* Telepon */}
        <div className="flex gap-3.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: office.bgAccent }}
          >
            <Phone size={15} style={{ color: office.color }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Telepon
            </p>
            {office.phones.map((phone) => (
              <a
                key={phone}
                href={`tel:${phone.replace(/\D/g, "")}`}
                className="block text-sm text-slate-700 hover:text-blue-700 transition-colors"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                {phone}
              </a>
            ))}
            {office.fax && (
              <p
                className="text-sm text-slate-500 mt-0.5"
                style={{ fontFamily: "'DM Sans', sans-serif" }}
              >
                Fax: {office.fax}
              </p>
            )}
          </div>
        </div>

        {/* Email */}
        <div className="flex gap-3.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: office.bgAccent }}
          >
            <Mail size={15} style={{ color: office.color }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Email
            </p>
            <a
              href={`mailto:${office.email}`}
              className="text-sm transition-colors break-all"
              style={{ color: office.color, fontFamily: "'DM Sans', sans-serif" }}
            >
              {office.email}
            </a>
          </div>
        </div>

        {/* Jam Operasional */}
        <div className="flex gap-3.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
            style={{ background: office.bgAccent }}
          >
            <Clock size={15} style={{ color: office.color }} />
          </div>
          <div>
            <p
              className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Jam Operasional
            </p>
            <p
              className="text-sm text-slate-700"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Senin – Jumat: 08.00 – 16.00 WIB
            </p>
            <p
              className="text-sm text-slate-500"
              style={{ fontFamily: "'DM Sans', sans-serif" }}
            >
              Sabtu: 08.00 – 14.00 WIB
            </p>
          </div>
        </div>
      </div>
    </div>
  </FadeIn>
);

// ─── Main Component ───────────────────────────────────────────
export function Kontak() {
  const [isContactFormOpen, setIsContactFormOpen] = useState(false);

  return (
    <>
      <section
        id="kontak"
        className="relative overflow-hidden"
        style={{ fontFamily: "'DM Sans', sans-serif", background: "#eff6ff" }}
      >
        {/* ── Wave Divider Top ── */}
        <div className="absolute top-0 left-0 w-full leading-none z-10 pointer-events-none">
          <svg
            viewBox="0 0 1440 72"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: "block", width: "100%", height: "72px" }}
          >
            <path
              d="M0,0 C240,72 480,0 720,36 C960,72 1200,0 1440,36 L1440,0 Z"
              fill="#eff6ff"
            />
          </svg>
        </div>

        {/* ── Decorative background ── */}
        <div className="absolute inset-0 pointer-events-none">
          <div
            className="absolute top-0 right-0 w-[600px] h-[600px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #1d4ed8 0%, transparent 70%)",
              transform: "translate(30%, -30%)",
            }}
          />
          <div
            className="absolute bottom-0 left-0 w-[400px] h-[400px] rounded-full opacity-[0.04]"
            style={{
              background: "radial-gradient(circle, #0369a1 0%, transparent 70%)",
              transform: "translate(-30%, 30%)",
            }}
          />
          {/* Grid dots pattern */}
          <svg
            className="absolute inset-0 w-full h-full opacity-[0.025]"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                <circle cx="2" cy="2" r="1.5" fill="#1d4ed8" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#dots)" />
          </svg>
        </div>

        <div className="relative container mx-auto px-4 md:px-10 pt-28 pb-20 md:pt-32 md:pb-28">

          {/* ── Section Header ── */}
          <FadeIn>
            <div className="text-center max-w-2xl mx-auto mb-14">
              <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 text-xs font-semibold uppercase tracking-widest px-4 py-2 rounded-full mb-5 border border-blue-100"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                <MapPin size={12} />
                Lokasi & Kontak
              </div>
              <h2
                className="text-3xl md:text-4xl text-slate-900 leading-tight mb-4"
                style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 800 }}
              >
                Hubungi Kami
              </h2>
              <p className="text-slate-500 text-base leading-relaxed">
                PT Surya Inti Gas siap melayani kebutuhan gas industri & medis Anda.
                Temukan kantor kami di Sidoarjo dan Balikpapan.
              </p>
            </div>
          </FadeIn>

          {/* ── Office Cards ── */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-7 mb-14">
            {OFFICES.map((office, i) => (
              <OfficeCard key={office.name} office={office} delay={0.1 + i * 0.12} />
            ))}
          </div>

          {/* ── General Email Banner ── */}
          <FadeIn delay={0.35}>
            <div className="relative bg-gradient-to-r from-blue-700 to-blue-600 rounded-2xl px-8 py-7 flex flex-col md:flex-row items-center justify-between gap-5 shadow-xl shadow-blue-200/50 overflow-hidden">
              {/* Decorative circle */}
              <div className="absolute right-0 top-0 w-64 h-64 bg-white/5 rounded-full -translate-y-1/2 translate-x-1/4" />
              <div className="absolute right-16 bottom-0 w-32 h-32 bg-white/5 rounded-full translate-y-1/2" />

              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 bg-white/15 rounded-xl flex items-center justify-center shrink-0">
                  <MessageSquare size={22} className="text-white" />
                </div>
                <div>
                  <p
                    className="text-white/75 text-xs font-semibold uppercase tracking-widest mb-0.5"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    Ada Pertanyaan atau Kebutuhan?
                  </p>
                  <p
                    className="text-white text-lg"
                    style={{ fontFamily: "'Barlow', sans-serif", fontWeight: 700 }}
                  >
                    Tim kami siap membantu Anda
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsContactFormOpen(true)}
                className="relative z-10 flex items-center gap-2 bg-white text-blue-700 px-6 py-3 rounded-xl text-sm font-bold hover:bg-blue-50 transition-colors shrink-0 cursor-pointer"
                style={{ fontFamily: "'Barlow', sans-serif" }}
              >
                <Mail size={15} />
                Hubungi Kami
              </button>
            </div>
          </FadeIn>

          {/* ── Maps Section ── */}
          <div className="mt-14 grid grid-cols-1 lg:grid-cols-2 gap-7">
            {/* Map Sidoarjo */}
            <FadeIn delay={0.15}>
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                  <span
                    className="text-sm font-bold text-slate-800"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    Kantor Pusat — Sidoarjo
                  </span>
                </div>
                <div className="h-64">
                  <iframe
                    title="Peta Kantor Pusat Sidoarjo"
                    src="https://maps.google.com/maps?q=-7.4667863,112.7524185&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </FadeIn>

            {/* Map Balikpapan */}
            <FadeIn delay={0.25}>
              <div className="bg-white rounded-2xl shadow-lg shadow-slate-200/60 border border-slate-100 overflow-hidden">
                <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-sky-600" />
                  <span
                    className="text-sm font-bold text-slate-800"
                    style={{ fontFamily: "'Barlow', sans-serif" }}
                  >
                    Kantor Cabang — Balikpapan
                  </span>
                </div>
                <div className="h-64">
                  <iframe
                    title="Peta Kantor Cabang Balikpapan"
                    src="https://maps.google.com/maps?q=-1.187001,116.8517675&z=17&output=embed"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                </div>
              </div>
            </FadeIn>
          </div>

        </div>
      </section>

      {/* ── ContactForm Modal ── */}
      <ContactForm
        isOpen={isContactFormOpen}
        onClose={() => setIsContactFormOpen(false)}
      />
    </>
  );
}


