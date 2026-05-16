import React from "react";
import { CheckCircle2, ShieldCheck, FileCheck } from "lucide-react";

export const Certifications = () => {
  const certs = [
    {
      title: "ISO 9001:2015",
      desc: "Sistem Manajemen Mutu Internasional",
      icon: <CheckCircle2 className="text-blue-600" size={40} />,
    },
    {
      title: "ISO 45001:2018",
      desc: "Manajemen Kesehatan & Keselamatan Kerja",
      icon: <ShieldCheck className="text-blue-600" size={40} />,
    },
    {
      title: "Sertifikasi KADIN",
      desc: "Lisensi Kontraktor Nasional Kelas A",
      icon: <FileCheck className="text-blue-600" size={40} />,
    },
    {
      title: "LPJK Grade 7",
      desc: "Kualifikasi Tertinggi Pelaksana Konstruksi",
      icon: <CheckCircle2 className="text-blue-600" size={40} />,
    },
  ];

  return (
    <section className="py-20 bg-white border-y border-slate-100">
      <div className="container mx-auto px-4 md:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          <div className="lg:max-w-md">
            <h2 className="text-slate-900 text-3xl font-extrabold mb-4 leading-tight">Terakreditasi & Legal</h2>
            <p className="text-slate-600">
              Kami menjamin standar kepatuhan regulasi dan kualitas internasional melalui berbagai sertifikasi resmi dari lembaga berwenang.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 w-full lg:w-auto">
            {certs.map((cert, index) => (
              <div key={index} className="flex flex-col items-center text-center p-6 bg-slate-50 rounded-sm border border-slate-100">
                <div className="mb-4">{cert.icon}</div>
                <h4 className="text-slate-900 font-bold text-lg mb-1">{cert.title}</h4>
                <p className="text-slate-500 text-xs uppercase tracking-wider leading-relaxed">{cert.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
