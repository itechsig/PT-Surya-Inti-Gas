import React from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { Linkedin, Mail } from "lucide-react";

export const Team = () => {
  const members = [
    {
      name: "Ir. Bambang Wijaya, M.T.",
      role: "Chief Executive Officer",
      experience: "25+ Tahun Pengalaman",
      image: "https://images.unsplash.com/photo-1722876720000-f39b65b7d4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0JTIwbWFuYWdlciUyMG1hbGV8ZW58MXx8fHwxNzcwNjQwNzI4fDA",
    },
    {
      name: "Siska Pratama, S.T., PMP",
      role: "Operations Director",
      experience: "18+ Tahun Pengalaman",
      image: "https://images.unsplash.com/photo-1693329060952-f01740ffa301?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBlbmdpbmVlciUyMGZlbWFsZSUyMHByb2Zlc3Npb25hbHxlbnwxfHx8fDE3NzA2NDA3Mjh8MA",
    },
    {
      name: "Rendy Kurniawan, B.Eng",
      role: "Technical Lead",
      experience: "15+ Tahun Pengalaman",
      image: "https://images.unsplash.com/photo-1722876720000-f39b65b7d4a1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb25zdHJ1Y3Rpb24lMjBwcm9qZWN0JTIwbWFuYWdlciUyMG1hbGV8ZW58MXx8fHwxNzcwNjQwNzI4fDA",
    },
  ];

  return (
    <section id="team" className="py-24 bg-slate-50">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Manajemen Kami</h4>
          <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold mb-4">Pakar Dibalik Kesuksesan Kami</h2>
          <p className="text-slate-600 max-w-2xl mx-auto">
            Dipimpin oleh para profesional berpengalaman yang berdedikasi tinggi untuk memberikan standar konstruksi terbaik di setiap proyek.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-10">
          {members.map((member, index) => (
            <div key={index} className="group bg-white p-6 rounded-sm shadow-sm hover:shadow-xl transition-all border border-slate-100">
              <div className="relative mb-6 overflow-hidden rounded-sm grayscale group-hover:grayscale-0 transition-all duration-500">
                <ImageWithFallback
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover"
                />
                <div className="absolute bottom-4 right-4 flex flex-col gap-2">
                  <a href="#" className="w-10 h-10 bg-blue-600 text-white flex items-center justify-center rounded-sm hover:bg-blue-700 transition-colors">
                    <Linkedin size={18} />
                  </a>
                  <a href="#" className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center rounded-sm hover:bg-slate-800 transition-colors">
                    <Mail size={18} />
                  </a>
                </div>
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-1">{member.name}</h3>
              <p className="text-blue-600 font-bold text-sm uppercase tracking-wider mb-4">{member.role}</p>
              <div className="pt-4 border-t border-slate-100 text-slate-500 text-sm italic">
                {member.experience}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
