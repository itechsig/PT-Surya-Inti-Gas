import React from "react";
import { Building2, HardHat, Hammer, Ruler, Briefcase, Settings } from "lucide-react";

export const Services = () => {
  const services = [
    {
      title: "Konstruksi Gedung",
      desc: "Layanan pembangunan gedung perkantoran, apartemen, hotel, dan fasilitas publik dengan standar kualitas tinggi.",
      icon: <Building2 className="w-10 h-10 text-white" />,
      features: ["Gedung Bertingkat", "Fasilitas Komersial", "Pusat Perbelanjaan"],
      color: "bg-blue-900",
    },
    {
      title: "Infrastruktur",
      desc: "Pembangunan sarana transportasi dan fasilitas publik seperti jalan raya, jembatan, dan sistem drainase perkotaan.",
      icon: <Settings className="w-10 h-10 text-white" />,
      features: ["Jalan & Jembatan", "Pekerjaan Tanah", "Saluran Irigasi"],
      color: "bg-slate-800",
    },
    {
      title: "Renovasi & Maintenance",
      desc: "Layanan peremajaan struktur dan pemeliharaan rutin untuk memastikan gedung tetap berfungsi optimal dan aman.",
      icon: <Hammer className="w-10 h-10 text-white" />,
      features: ["Retrofitting Struktur", "Interior Fit-out", "Pemeliharaan Gedung"],
      color: "bg-blue-600",
    },
  ];

  return (
    <section id="services" className="py-24 bg-slate-900 text-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <h4 className="text-blue-400 font-bold uppercase tracking-widest text-sm mb-4">Layanan Unggulan</h4>
            <h2 className="text-white text-4xl md:text-5xl font-extrabold leading-tight">
              Solusi Konstruksi Menyeluruh Untuk Kebutuhan Anda
            </h2>
          </div>
          <p className="text-slate-400 max-w-md mb-2">
            Kami mengintegrasikan teknologi terkini dengan keahlian teknik mendalam untuk setiap kategori pekerjaan konstruksi.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group relative bg-slate-800 p-10 rounded-sm border border-slate-700 hover:border-blue-500/50 transition-all duration-300"
            >
              <div className={`w-20 h-20 ${service.color} flex items-center justify-center rounded-sm mb-8 group-hover:scale-110 transition-transform duration-300`}>
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{service.title}</h3>
              <p className="text-slate-400 mb-8 leading-relaxed">{service.desc}</p>
              
              <ul className="space-y-3">
                {service.features.map((feature, idx) => (
                  <li key={idx} className="flex items-center text-sm text-slate-300">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    {feature}
                  </li>
                ))}
              </ul>

              <div className="mt-10 pt-8 border-t border-slate-700">
                <button className="flex items-center text-blue-400 font-bold hover:text-blue-300 transition-colors uppercase tracking-widest text-xs">
                  Selengkapnya <Briefcase size={14} className="ml-2" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Professionalism banner */}
        <div className="mt-20 p-12 bg-blue-600 rounded-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            <HardHat size={60} className="text-white/30" />
            <div>
              <h3 className="text-2xl font-bold mb-1">Siap Memulai Proyek Besar?</h3>
              <p className="text-blue-100">Konsultasikan rencana pembangunan Anda dengan tim ahli kami.</p>
            </div>
          </div>
          <button className="bg-white text-blue-900 px-10 py-4 rounded-sm font-bold hover:bg-slate-100 transition-colors shadow-lg">
            Minta Penawaran Gratis
          </button>
        </div>
      </div>
    </section>
  );
};
