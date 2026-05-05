import React, { useState } from "react";
import { ImageWithFallback } from "./figma/ImageWithFallback";
import { ExternalLink, MapPin, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export const Portfolio = () => {
  const [filter, setFilter] = useState("All");

  const categories = ["All", "Gedung", "Infrastruktur", "Renovasi"];

  const projects = [
    {
      id: 1,
      name: "Menara Mandiri Central",
      category: "Gedung",
      location: "Jakarta Selatan",
      year: "2023",
      image: "https://images.unsplash.com/photo-1762584345845-f1cf77e1f28c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBza3lzY3JhcGVyJTIwY29uc3RydWN0aW9uJTIwc2l0ZXxlbnwxfHx8fDE3NzA2MTY3NDN8MA&ixlib=rb-4.1.0&q=80&w=1080",
      desc: "Pembangunan gedung perkantoran 45 lantai dengan sertifikasi Green Building."
    },
    {
      id: 2,
      name: "Jembatan Layang Nusantara",
      category: "Infrastruktur",
      location: "Surabaya",
      year: "2022",
      image: "https://images.unsplash.com/photo-1708358131308-c2dad0046a73?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxicmlkZ2UlMjBpbmZyYXN0cnVjdHVyZSUyMHByb2plY3R8ZW58MXx8fHwxNzcwNjQwNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      desc: "Konstruksi jembatan layang sepanjang 2.5 km untuk mengurai kemacetan kota."
    },
    {
      id: 3,
      name: "Modernization Industrial Park",
      category: "Renovasi",
      location: "Bekasi",
      year: "2024",
      image: "https://images.unsplash.com/photo-1768321903661-87da7d2962b0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyZW5vdmF0aW9uJTIwYnVpbGRpbmclMjBpbnRlcmlvciUyMHdvcmt8ZW58MXx8fHwxNzcwNjQwNzI4fDA&ixlib=rb-4.1.0&q=80&w=1080",
      desc: "Renovasi menyeluruh sistem mekanikal dan elektrikal pabrik otomotif."
    },
    {
      id: 4,
      name: "Sudirman Suites Plaza",
      category: "Gedung",
      location: "Jakarta Pusat",
      year: "2021",
      image: "https://images.unsplash.com/photo-1766866771433-c3042a3ce7a3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBjb3Jwb3JhdGUlMjBidWlsZGluZyUyMGV4dGVyaW9yJTIwZmFjYWRlfGVufDF8fHx8MTc3MDY0MDcyOHww",
      desc: "Proyek mixed-use development yang mencakup hunian dan area komersial."
    }
  ];

  const filteredProjects = filter === "All" ? projects : projects.filter(p => p.category === filter);

  return (
    <section id="portfolio" className="py-24 bg-white">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-4">Showcase Proyek</h4>
          <h2 className="text-slate-900 text-3xl md:text-5xl font-extrabold mb-8">Portofolio Pekerjaan Kami</h2>
          
          {/* Filters */}
          <div className="flex flex-wrap justify-center gap-4 mt-8">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`px-8 py-2 rounded-full font-bold transition-all text-sm ${
                  filter === cat
                    ? "bg-blue-600 text-white shadow-lg"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => (
              <motion.div
                layout
                key={project.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-slate-50 rounded-lg overflow-hidden border border-slate-100 shadow-sm hover:shadow-2xl transition-all"
              >
                <div className="relative h-[400px] overflow-hidden">
                  <ImageWithFallback
                    src={project.image}
                    alt={project.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute top-6 left-6 bg-blue-600 text-white text-xs font-bold px-4 py-2 rounded-sm shadow-md">
                    {project.category.toUpperCase()}
                  </div>
                </div>
                
                <div className="p-8">
                  <div className="flex justify-between items-start mb-4">
                    <h3 className="text-2xl font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors">
                      {project.name}
                    </h3>
                    <button className="text-slate-400 hover:text-blue-600">
                      <ExternalLink size={20} />
                    </button>
                  </div>
                  
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {project.desc}
                  </p>
                  
                  <div className="flex flex-wrap gap-6 pt-6 border-t border-slate-200">
                    <div className="flex items-center text-slate-500 text-sm">
                      <MapPin size={16} className="text-blue-600 mr-2" />
                      {project.location}
                    </div>
                    <div className="flex items-center text-slate-500 text-sm">
                      <Calendar size={16} className="text-blue-600 mr-2" />
                      Tahun: {project.year}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <div className="mt-20 text-center">
          <button className="bg-slate-900 text-white px-10 py-4 rounded-sm font-bold hover:bg-slate-800 transition-all shadow-xl">
            Lihat Semua Proyek
          </button>
        </div>
      </div>
    </section>
  );
};
