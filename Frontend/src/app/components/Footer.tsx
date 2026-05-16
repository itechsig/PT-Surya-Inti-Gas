import React from "react";
import { Phone, Mail, MapPin, MessageSquare, Facebook, Twitter, Instagram, Linkedin, Send } from "lucide-react";

export const Footer = () => {
  return (
    <footer id="contact" className="bg-slate-900 text-white pt-24 pb-12">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid lg:grid-cols-4 gap-12 mb-20">
          {/* Company Info */}
          <div className="col-span-1 lg:col-span-1">
            <div className="flex items-center space-x-2 mb-8">
              <div className="w-10 h-10 bg-blue-600 flex items-center justify-center rounded-sm">
                <span className="text-white font-bold text-xl">KM</span>
              </div>
              <h2 className="font-bold text-lg leading-tight">
                PT KONSTRUKSI<br />MANDIRI
              </h2>
            </div>
            <p className="text-slate-400 mb-8 leading-relaxed">
              Membangun negeri dengan integritas, inovasi, dan komitmen terhadap kualitas infrastruktur masa depan.
            </p>
            <div className="flex space-x-4">
              {[Facebook, Twitter, Instagram, Linkedin].map((Icon, i) => (
                <a key={i} href="#" className="w-10 h-10 border border-slate-700 flex items-center justify-center rounded-sm hover:bg-blue-600 hover:border-blue-600 transition-all">
                  <Icon size={18} />
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3"></span>
              Tautan Cepat
            </h3>
            <ul className="space-y-4">
              {["Beranda", "Tentang Kami", "Layanan", "Proyek", "Tim Manajemen", "Hubungi Kami"].map((link) => (
                <li key={link}>
                  <a href={`#${link.toLowerCase().replace(" ", "")}`} className="text-slate-400 hover:text-white hover:translate-x-2 inline-block transition-all">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3"></span>
              Kontak Kami
            </h3>
            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <MapPin className="text-blue-500 shrink-0 mt-1" size={20} />
                <p className="text-slate-400">
                  Jl. Jenderal Sudirman No. 123, <br />
                  SCBD Kav. 52-53, Jakarta Selatan, <br />
                  DKI Jakarta 12190
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <Phone className="text-blue-500 shrink-0" size={20} />
                <p className="text-slate-400">+62 21 5550 8888</p>
              </div>
              <div className="flex items-center space-x-4">
                <Mail className="text-blue-500 shrink-0" size={20} />
                <p className="text-slate-400">info@konstruksimandiri.id</p>
              </div>
              <a
                href="https://wa.me/6281234567890"
                target="_blank"
                rel="noreferrer"
                className="bg-green-600 hover:bg-green-700 text-white flex items-center justify-center py-3 rounded-sm font-bold transition-colors w-full"
              >
                <MessageSquare className="mr-2" size={18} />
                WhatsApp Chat
              </a>
            </div>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-xl font-bold mb-8 flex items-center">
              <span className="w-2 h-6 bg-blue-600 mr-3"></span>
              Berlangganan
            </h3>
            <p className="text-slate-400 mb-6">
              Dapatkan pembaruan proyek dan info industri konstruksi terbaru.
            </p>
            <div className="relative">
              <input
                type="email"
                placeholder="Alamat Email"
                className="w-full bg-slate-800 border border-slate-700 rounded-sm py-4 px-6 text-white focus:outline-none focus:border-blue-500"
              />
              <button className="absolute right-2 top-2 bg-blue-600 p-2 rounded-sm hover:bg-blue-700 transition-colors">
                <Send size={20} />
              </button>
            </div>
          </div>
        </div>

        <div className="pt-12 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-slate-500 text-sm">
            © 2026 PT Konstruksi Mandiri. Hak Cipta Dilindungi Undang-Undang.
          </p>
          <div className="flex space-x-8 text-sm text-slate-500">
            <a href="#" className="hover:text-white">Kebijakan Privasi</a>
            <a href="#" className="hover:text-white">Syarat & Ketentuan</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
