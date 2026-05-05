import React from "react";
import { Shield, Target, Clock, Award } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

export const About = () => {
  const values = [
    {
      icon: <Shield className="text-blue-600" size={32} />,
      title: "Keselamatan Kerja",
      desc: "Menerapkan standar K3 ketat untuk menjamin keamanan setiap personel di lokasi proyek.",
    },
    {
      icon: <Award className="text-blue-600" size={32} />,
      title: "Kualitas Premium",
      desc: "Menggunakan material terbaik dan teknik konstruksi mutakhir untuk hasil yang tahan lama.",
    },
    {
      icon: <Clock className="text-blue-600" size={32} />,
      title: "Ketepatan Waktu",
      desc: "Komitmen tinggi pada jadwal penyelesaian proyek sesuai kesepakatan kontrak.",
    },
    {
      icon: <Target className="text-blue-600" size={32} />,
      title: "Efisiensi Biaya",
      desc: "Optimasi sumber daya untuk memberikan nilai terbaik bagi investasi klien kami.",
    },
  ];

  return (
    <section id="about" className="py-24 bg-white overflow-hidden">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Text Content */}
          <div className="order-2 lg:order-1">
            <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Profil Perusahaan</h4>
            <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold mb-8 leading-tight">
              Membangun Kepercayaan Melalui Keunggulan Teknik
            </h2>
            <div className="space-y-6 text-slate-600 text-lg leading-relaxed">
              <p>
                Didirikan dengan visi untuk menjadi pemimpin dalam industri konstruksi di Indonesia, **PT Konstruksi Mandiri** telah tumbuh menjadi perusahaan yang dikenal karena integritas dan kapabilitasnya.
              </p>
              <p>
                Kami percaya bahwa setiap struktur yang kami bangun adalah warisan. Sejak awal berdirinya, kami telah menangani berbagai proyek kompleks mulai dari gedung perkantoran, infrastruktur jalan, hingga renovasi fasilitas industri berskala besar.
              </p>
            </div>

            <div className="mt-12 grid grid-cols-2 gap-8 p-8 bg-slate-50 rounded-lg border border-slate-100">
              <div>
                <h3 className="text-slate-900 font-bold text-xl mb-3 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 mr-3"></div>
                  Visi
                </h3>
                <p className="text-slate-600 text-sm italic">
                  "Menjadi mitra konstruksi terdepan di Indonesia yang mengutamakan inovasi, keberlanjutan, dan kualitas tanpa kompromi."
                </p>
              </div>
              <div>
                <h3 className="text-slate-900 font-bold text-xl mb-3 flex items-center">
                  <div className="w-2 h-6 bg-blue-600 mr-3"></div>
                  Misi
                </h3>
                <p className="text-slate-600 text-sm">
                  Menyediakan solusi teknik inovatif dan layanan profesional yang melampaui ekspektasi klien serta memberikan dampak positif bagi masyarakat.
                </p>
              </div>
            </div>
          </div>

          {/* Image Side */}
          <div className="relative order-1 lg:order-2">
            <div className="relative z-10 rounded-lg overflow-hidden shadow-2xl">
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1766866771433-c3042a3ce7a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwZmFjYWRlfGVufDF8fHx8MTc3MDY0MDcyOHww"
                alt="Construction Management"
                className="w-full h-[600px] object-cover"
              />
            </div>
            {/* Decorative boxes */}
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-blue-900 -z-10 rounded-sm"></div>
            <div className="absolute top-10 -right-5 w-24 h-48 bg-slate-200 -z-10 rounded-sm"></div>
            
            {/* Experience Card */}
            <div className="absolute bottom-10 right-10 bg-white p-8 shadow-xl rounded-sm border-l-4 border-blue-600">
              <div className="text-5xl font-black text-blue-600 mb-1">15+</div>
              <div className="text-slate-900 font-bold uppercase tracking-tighter text-sm">Tahun Melayani <br />Indonesia</div>
            </div>
          </div>
        </div>

        {/* Values Grid */}
        <div className="mt-32">
          <div className="text-center mb-16">
            <h2 className="text-slate-900 text-3xl font-extrabold mb-4">Nilai-Nilai Inti Kami</h2>
            <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div
                key={index}
                className="p-8 bg-slate-50 border border-slate-100 rounded-sm hover:shadow-xl transition-all hover:-translate-y-1"
              >
                <div className="mb-6 bg-white w-16 h-16 flex items-center justify-center rounded-sm shadow-sm">
                  {value.icon}
                </div>
                <h3 className="text-slate-900 font-bold text-xl mb-4">{value.title}</h3>
                <p className="text-slate-600 text-sm leading-relaxed">{value.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
