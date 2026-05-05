import React from "react";
import { motion } from "motion/react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ArrowRight, ChevronRight } from "lucide-react";

export const Hero = () => {
  return (
    <section id="hero" className="relative h-screen w-full flex items-center overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <ImageWithFallback
          src="https://images.unsplash.com/photo-1762584345845-f1cf77e1f28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NzA2MTY3NDN8MA&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Modern Construction Site"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/60 to-transparent"></div>
      </div>

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">
              Membangun Masa Depan Indonesia
            </h2>
            <h1 className="text-white text-5xl md:text-7xl font-extrabold leading-tight mb-6">
              Konstruksi Kokoh, <br />
              <span className="text-blue-500">Hasil Terpercaya.</span>
            </h1>
            <p className="text-slate-300 text-lg md:text-xl mb-10 max-w-2xl leading-relaxed">
              PT Konstruksi Mandiri hadir sebagai mitra strategis dalam mewujudkan infrastruktur berkualitas dengan standar keamanan tertinggi dan ketepatan waktu yang teruji.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <a
                href="#portfolio"
                className="group bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-sm font-bold flex items-center justify-center transition-all shadow-xl hover:shadow-blue-500/30"
              >
                Lihat Proyek Kami
                <ArrowRight className="ml-2 group-hover:translate-x-1 transition-transform" size={20} />
              </a>
              <a
                href="#about"
                className="bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/30 text-white px-8 py-4 rounded-sm font-bold flex items-center justify-center transition-all"
              >
                Tentang Kami
              </a>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Statistics Overlay */}
      <div className="absolute bottom-0 right-0 left-0 bg-white/5 backdrop-blur-md border-t border-white/10 hidden md:block">
        <div className="container mx-auto px-8 py-10">
          <div className="grid grid-cols-4 gap-8">
            {[
              { label: "Proyek Selesai", value: "250+" },
              { label: "Tahun Pengalaman", value: "15+" },
              { label: "Tenaga Ahli", value: "120+" },
              { label: "Klien Puas", value: "98%" },
            ].map((stat, i) => (
              <div key={i} className="text-center border-r border-white/10 last:border-0">
                <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                <div className="text-sm text-slate-400 font-medium uppercase tracking-wider">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
