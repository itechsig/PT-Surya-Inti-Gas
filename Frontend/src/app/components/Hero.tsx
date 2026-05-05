import React, { useEffect, useState, useRef } from "react";
import { motion, useInView, useMotionValue, useSpring } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, ShieldCheck, Award, Phone } from "lucide-react";

// ─── Data ───────────────────────────────────────────────────────────────────

const PRODUCTS = [
  { icon: "🫧", name: "Oksigen (O₂)", sub: "Industrial & Medical Grade", color: "#3b82f6" },
  { icon: "❄️", name: "Nitrogen (N₂)", sub: "Gas & Cair (Liquid)", color: "#06b6d4" },
  { icon: "🔵", name: "Argon (Ar)", sub: "Welding & Industrial", color: "#6366f1" },
  { icon: "🔥", name: "Acetylene (C₂H₂)", sub: "Cutting & Welding Gas", color: "#f97316" },
  { icon: "🎈", name: "Helium (He)", sub: "Speciality Gas", color: "#a855f7" },
  { icon: "⚗️", name: "Mixed Gas", sub: "Custom Gas Campur", color: "#10b981" },
];

const STATS = [
  { label: "Pelanggan Industri", value: 500, suffix: "+" },
  { label: "Tahun Pengalaman", value: 20, suffix: "+" },
  { label: "Jenis Produk Gas", value: 9, suffix: "+" },
  { label: "Kepuasan Pelanggan", value: 99, suffix: "%" },
];

const SECTORS = [
  "Rumah Sakit & Medis",
  "Farmasi",
  "Galangan Kapal",
  "Food & Beverage",
  "Metal Sheet",
  "Laser Cutting",
];

// ─── Floating Particle ───────────────────────────────────────────────────────

function Particle({ x, y, size, duration, delay, opacity }: {
  x: number; y: number; size: number; duration: number; delay: number; opacity: number;
}) {
  return (
    <motion.div
      className="absolute rounded-full pointer-events-none"
      style={{
        left: `${x}%`,
        top: `${y}%`,
        width: size,
        height: size,
        background: `radial-gradient(circle, rgba(96,165,250,${opacity}) 0%, transparent 70%)`,
      }}
      animate={{
        y: [0, -60, 0],
        x: [0, Math.random() > 0.5 ? 20 : -20, 0],
        opacity: [0, opacity, 0],
        scale: [0.6, 1.2, 0.6],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
}

// ─── Molecule SVG Background ─────────────────────────────────────────────────

function MoleculeBackground() {
  return (
    <motion.svg
      className="absolute right-0 top-0 w-[55%] h-full opacity-[0.045] pointer-events-none"
      viewBox="0 0 600 700"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.045 }}
      transition={{ delay: 0.8, duration: 1.5 }}
    >
      {/* Atom nodes */}
      {[
        [300, 200, 28], [180, 340, 22], [420, 340, 22],
        [260, 480, 18], [360, 480, 18], [130, 210, 16],
        [470, 210, 16], [300, 90, 14], [190, 570, 14],
        [410, 570, 14], [80, 400, 12], [520, 400, 12],
      ].map(([cx, cy, r], i) => (
        <motion.circle
          key={i}
          cx={cx} cy={cy} r={r}
          fill="rgba(96,165,250,0.9)"
          animate={{ r: [r, r * 1.15, r], opacity: [0.7, 1, 0.7] }}
          transition={{ duration: 2.5 + i * 0.3, repeat: Infinity, ease: "easeInOut", delay: i * 0.2 }}
        />
      ))}
      {/* Bonds */}
      {[
        [300,200,180,340],[300,200,420,340],[180,340,260,480],
        [420,340,360,480],[260,480,360,480],[130,210,180,340],
        [470,210,420,340],[300,90,300,200],[180,340,190,570],
        [420,340,410,570],[80,400,180,340],[520,400,420,340],
        [130,210,300,90],[470,210,300,90],
      ].map(([x1,y1,x2,y2], i) => (
        <motion.line
          key={i}
          x1={x1} y1={y1} x2={x2} y2={y2}
          stroke="rgba(96,165,250,0.6)"
          strokeWidth="1.5"
          animate={{ opacity: [0.4, 0.8, 0.4] }}
          transition={{ duration: 2 + i * 0.2, repeat: Infinity, ease: "easeInOut", delay: i * 0.15 }}
        />
      ))}
    </motion.svg>
  );
}

// ─── Animated Counter ────────────────────────────────────────────────────────

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionVal = useMotionValue(0);
  const spring = useSpring(motionVal, { duration: 2000, bounce: 0 });
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    if (isInView) motionVal.set(value);
  }, [isInView, value, motionVal]);

  useEffect(() => {
    return spring.on("change", (v) => setDisplay(Math.round(v)));
  }, [spring]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}{suffix}
    </span>
  );
}

// ─── Main Hero ───────────────────────────────────────────────────────────────

export const Hero = () => {
  const [activeProduct, setActiveProduct] = useState(0);
  const [activeSector, setActiveSector] = useState(0);

  // Generate stable particles
  const particles = useRef(
    Array.from({ length: 22 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: 4 + Math.random() * 14,
      duration: 5 + Math.random() * 7,
      delay: Math.random() * 5,
      opacity: 0.12 + Math.random() * 0.25,
    }))
  ).current;

  useEffect(() => {
    const i = setInterval(() => setActiveProduct((p) => (p + 1) % PRODUCTS.length), 2200);
    return () => clearInterval(i);
  }, []);

  useEffect(() => {
    const i = setInterval(() => setActiveSector((p) => (p + 1) % SECTORS.length), 1800);
    return () => clearInterval(i);
  }, []);

  return (
    <section id="hero" className="relative min-h-screen w-full flex items-center overflow-hidden">

      {/* ── Background ── */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1585771724684-38269d6639fd?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=1280"
          alt="Industrial Gas Facility"
          className="w-full h-full object-cover scale-105"
          style={{ filter: "brightness(0.35) saturate(0.7)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#050E1C]/98 via-[#071628]/88 to-[#0a1e40]/55" />

        {/* Glow blobs */}
        <div className="absolute bottom-0 left-0 w-[700px] h-[400px] bg-blue-700/12 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-10 right-10 w-[400px] h-[400px] bg-blue-500/7 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute top-1/2 left-1/3 w-[300px] h-[300px] bg-cyan-500/5 blur-[120px] rounded-full pointer-events-none" />

        {/* Floating particles */}
        {particles.map((p) => (
          <Particle key={p.id} {...p} />
        ))}

        {/* Molecule SVG */}
        <MoleculeBackground />
      </div>

      {/* ── Main Content ── */}
      <div className="container mx-auto px-4 md:px-10 relative z-10 pt-28 pb-44">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

          {/* ── Left: Copy ── */}
          <motion.div
            initial={{ opacity: 0, y: 36 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, ease: "easeOut" }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, x: -16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.55 }}
              className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/25 rounded-full px-4 py-1.5 mb-6"
            >
              <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-blue-300 text-xs font-semibold uppercase tracking-widest">
                Distributor Gas Industri Terpercaya
              </span>
            </motion.div>

            {/* Headline */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.7 }}
              className="text-white text-5xl md:text-6xl xl:text-[4.2rem] font-extrabold leading-[1.06] mb-5 tracking-tight"
            >
              Solusi Gas Industri{" "}
              <br className="hidden sm:block" />
              <span className="text-blue-400">Andal & Lengkap</span>
              <br className="hidden sm:block" />
              untuk Indonesia.
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.45, duration: 0.7 }}
              className="text-slate-300/75 text-base md:text-lg leading-relaxed mb-6 max-w-xl"
            >
              Sejak 2003, PT Surya Inti Gas melayani kebutuhan gas industri,
              medical gas, speciality gas, dan cryogenic equipment untuk
              150+ pelanggan di Jawa Timur, Jawa Tengah, DIY, dan Kalimantan Timur.
            </motion.p>

            {/* Sector ticker */}
            <div className="flex items-center gap-3 mb-8">
              <span className="text-slate-500 text-sm shrink-0">Melayani:</span>
              <div className="relative overflow-hidden h-6 flex-1">
                {SECTORS.map((s, i) => (
                  <motion.span
                    key={s}
                    animate={{ opacity: activeSector === i ? 1 : 0, y: activeSector === i ? 0 : 10 }}
                    transition={{ duration: 0.35 }}
                    className="absolute left-0 text-sm font-semibold text-blue-300 whitespace-nowrap"
                  >
                    {s}
                  </motion.span>
                ))}
              </div>
            </div>

            {/* Trust chips */}
            <div className="flex flex-wrap gap-2.5 mb-9">
              {[
                { icon: <ShieldCheck size={12} />, label: "Bersertifikat Resmi" },
                { icon: <Award size={12} />, label: "Berdiri Sejak 2003" },
              ].map((chip) => (
                <span
                  key={chip.label}
                  className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 text-slate-300 text-xs font-medium px-3 py-1.5 rounded-full"
                >
                  <span className="text-blue-400">{chip.icon}</span>
                  {chip.label}
                </span>
              ))}
            </div>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3"
            >
              <motion.a
                href="#produk"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-blue-700/30 hover:shadow-blue-500/40"
              >
                Lihat Produk Kami
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </motion.a>

              {/* WhatsApp CTA */}
              <motion.a
                href="https://wa.me/6281234567890?text=Halo%20PT%20Surya%20Inti%20Gas%2C%20saya%20ingin%20mengetahui%20informasi%20produk%20gas."
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden bg-green-600 hover:bg-green-500 text-white px-8 py-4 rounded-lg font-bold text-sm flex items-center justify-center gap-2 transition-all shadow-xl shadow-green-700/25 hover:shadow-green-500/35"
              >
                {/* shimmer */}
                <motion.span
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12"
                  animate={{ x: ["-100%", "200%"] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 1.5, ease: "easeInOut" }}
                />
                {/* WhatsApp icon */}
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4 shrink-0">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 2.126.554 4.122 1.526 5.856L.057 23.882l6.174-1.62A11.945 11.945 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.017-1.376l-.36-.213-3.664.962.979-3.576-.234-.374A9.818 9.818 0 012.182 12C2.182 6.58 6.58 2.182 12 2.182S21.818 6.58 21.818 12 17.42 21.818 12 21.818z" />
                </svg>
                Hubungi via WhatsApp
              </motion.a>
            </motion.div>
          </motion.div>

          {/* ── Right: Product Card ── */}
          <motion.div
            initial={{ opacity: 0, y: 44 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.85, ease: "easeOut" }}
            className="hidden lg:flex justify-end"
          >
            <div className="w-[355px] bg-white/[0.04] border border-white/10 rounded-2xl p-6 backdrop-blur-xl shadow-2xl">
              {/* Card header */}
              <div className="flex items-center justify-between mb-5">
                <span className="text-white/45 text-[11px] font-semibold uppercase tracking-widest">
                  Produk Gas Kami
                </span>
                <span className="inline-flex items-center gap-1.5 bg-green-500/10 border border-green-400/20 rounded-full px-3 py-1 text-green-300 text-[11px] font-medium">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                  Stok Tersedia
                </span>
              </div>

              {/* Product list */}
              <div className="flex flex-col gap-2.5">
                {PRODUCTS.map((product, i) => (
                  <motion.div
                    key={i}
                    animate={{
                      background: activeProduct === i ? "rgba(37,99,235,0.16)" : "rgba(255,255,255,0.03)",
                      borderColor: activeProduct === i ? "rgba(96,165,250,0.32)" : "rgba(255,255,255,0.07)",
                    }}
                    transition={{ duration: 0.38 }}
                    onMouseEnter={() => setActiveProduct(i)}
                    className="flex items-center justify-between border rounded-xl px-4 py-3 cursor-default"
                  >
                    <div className="flex items-center gap-3">
                      <motion.div
                        animate={{
                          backgroundColor: activeProduct === i
                            ? `${product.color}33`
                            : "rgba(37,99,235,0.12)",
                        }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-base shrink-0"
                      >
                        {product.icon}
                      </motion.div>
                      <div>
                        <div className="text-white text-sm font-semibold leading-tight">{product.name}</div>
                        <div className="text-slate-400 text-[11px] mt-0.5">{product.sub}</div>
                      </div>
                    </div>
                    <motion.div
                      animate={{ opacity: activeProduct === i ? 1 : 0, scale: activeProduct === i ? 1 : 0.85 }}
                      transition={{ duration: 0.22 }}
                    >
                      <ArrowRight size={14} className="text-blue-400" />
                    </motion.div>
                  </motion.div>
                ))}
              </div>

              {/* Card footer */}
              <div className="border-t border-white/8 mt-5 pt-4 flex items-center justify-between">
                <span className="text-slate-400 text-xs">+ Cryogenic Equipment & Accessories</span>
                <a href="#produk" className="text-blue-400 hover:text-blue-300 text-xs font-semibold flex items-center gap-1 transition-colors">
                  Lihat semua <ArrowRight size={10} />
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Stats Bar dengan Counter Animation ── */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/[0.04] backdrop-blur-md border-t border-white/10 hidden md:block z-10">
        <div className="container mx-auto px-8 py-7">
          <div className="grid grid-cols-4">
            {STATS.map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.65 + i * 0.1, duration: 0.5 }}
                className="text-center border-r border-white/10 last:border-0 px-4 group"
              >
                <motion.div
                  className="text-3xl font-extrabold text-white mb-1 tracking-tight"
                  whileHover={{ scale: 1.05, color: "#60a5fa" }}
                  transition={{ duration: 0.2 }}
                >
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </motion.div>
                <div className="text-[11px] text-slate-400 font-medium uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
