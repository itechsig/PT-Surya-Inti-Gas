import React, { useEffect, useRef } from "react";
import { CheckCircle2, Target, BookOpen } from "lucide-react";

/* ── Data ── */
const certs = [
  "Izin Usaha Distribusi Gas Resmi",
  "Standar K3 (Keselamatan & Kesehatan Kerja)",
  "Sertifikasi Produk Gas Industri & Medis",
  "Keanggotaan Asosiasi Distributor Gas Nasional",
];

const milestones = [
  { year: "2004", title: "Pendirian Perusahaan",     desc: "Berdiri di Sidoarjo, Jawa Timur sebagai distributor gas industri & medis." },
  { year: "2008", title: "Ekspansi Lini Produk",    desc: "Menambah specialty gas, mixed gas, dan cryogenic equipment." },
  { year: "2013", title: "Cabang Kalimantan Timur", desc: "Membuka kantor cabang di Balikpapan untuk sektor migas & galangan kapal." },
  { year: "2017", title: "Perluasan Wilayah",       desc: "Distribusi diperluas ke Jawa Tengah dan DIY." },
  { year: "2024", title: "Dua Dekade Pelayanan",    desc: "20 tahun melayani 150+ pelanggan aktif di seluruh wilayah layanan." },
];

const HEADER_OFFSET = 60;

export const About = () => {
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!sectionRef.current) return;
    const update = () => {
      if (!sectionRef.current) return;
      const allFixed = [...document.querySelectorAll("*")].filter((el) => {
        const s = window.getComputedStyle(el);
        return s.position === "fixed" && parseFloat(s.top) <= 0 && el.getBoundingClientRect().bottom > 0;
      });
      const measuredH = allFixed.length
        ? Math.max(...allFixed.map((el) => el.getBoundingClientRect().bottom))
        : HEADER_OFFSET;
      sectionRef.current.style.scrollMarginTop = `${Math.max(measuredH, HEADER_OFFSET)}px`;
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap');

        .about-wrap {
          font-family: 'Inter', sans-serif;
          background: #ffffff;
          color: #1e293b;
          position: relative;
          z-index: 1;
        }

        .inner { max-width: 1180px; margin: 0 auto; padding: 0 32px; }

        .section-eyebrow {
          display: inline-flex; align-items: center; gap: 8px;
          font-size: 11px; font-weight: 700; letter-spacing: 0.18em;
          text-transform: uppercase; color: #0369a1; margin-bottom: 10px;
        }
        .section-eyebrow::before {
          content: ''; display: block; width: 24px; height: 2px;
          background: #0369a1;
        }

        /* Padding atas dikurangi agar konten lebih naik */
        .about-section { padding: 60px 0 40px; }
        
        .content-title {
          font-size: clamp(26px, 3.2vw, 38px); font-weight: 800;
          color: #0f172a; margin-bottom: 16px; letter-spacing: -0.025em; line-height: 1.2;
        }

        /* 1. PROFIL & MILESTONE GRID */
        .profil-container { 
          display: grid; 
          grid-template-columns: 1.15fr 0.85fr; /* Profil sedikit lebih lebar (ke kanan) */
          gap: 40px; /* Jarak antar kolom diperkecil */
          margin-bottom: 40px; /* Margin bawah dipangkas drastis agar Visi Misi naik */
          align-items: start;
        }
        
        .profil-text { font-size: 14px; line-height: 1.7; color: #64748b; text-align: justify; }
        
        .cert-grid { 
          display: grid; 
          grid-template-columns: 1fr 1fr; 
          gap: 12px; 
          margin-top: 20px; 
        }
        .cert-item { display: flex; align-items: center; gap: 8px; font-size: 13px; font-weight: 600; color: #334155; }
        .cert-item svg { color: #0369a1; flex-shrink: 0; }

        /* Milestone Card Styling */
        .timeline-card { 
          background: #f8fafc; 
          border-radius: 24px; 
          padding: 28px 32px; /* Padding dikurangi agar tidak terlalu tinggi */
          border: 1px solid #f1f5f9;
        }
        .tl-item { display: flex; gap: 16px; margin-bottom: 16px; position: relative; }
        .tl-item:last-child { margin-bottom: 0; }
        
        .tl-year { 
          font-size: 11px; font-weight: 800; color: #0369a1; 
          background: #e0f2fe; padding: 4px 10px; border-radius: 6px; 
          height: fit-content; margin-top: 2px;
        }
        .tl-title { font-size: 13px; font-weight: 700; color: #0f172a; margin-bottom: 2px; }
        .tl-desc { font-size: 12px; color: #94a3b8; line-height: 1.5; }

        /* 2. VISI MISI SECTION (Highlighted) */
        .vismis-wrapper { 
          background: #f0f9ff; 
          padding: 40px 0; /* Padding atas bawah dipangkas setengahnya */
          border-radius: 32px; 
        }
        .vismis-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        
        .vm-card { 
          background: #ffffff; 
          padding: 32px; /* Padding dikurangi sedikit */
          border-radius: 20px; 
          box-shadow: 0 10px 25px -5px rgba(3, 105, 161, 0.05);
          height: 100%;
        }
        
        .vm-label { 
          display: flex; align-items: center; gap: 8px; 
          font-weight: 800; text-transform: uppercase; 
          font-size: 11px; letter-spacing: 0.1em; margin-bottom: 16px; 
        }
        .visi-label { color: #0369a1; }
        .misi-label { color: #16a34a; }
        
        .vm-content { font-size: 15px; font-weight: 500; line-height: 1.7; color: #334155; }
        
        .misi-list { list-style: none; padding: 0; margin: 0; }
        .misi-list li { 
          display: flex; gap: 10px; font-size: 13px; 
          color: #475569; line-height: 1.5; margin-bottom: 10px;
        }
        .misi-list li::before { content: '→'; color: #16a34a; font-weight: bold; }
        .misi-list li:last-child { margin-bottom: 0; }

        @media (max-width: 960px) {
          .profil-container, .vismis-grid { grid-template-columns: 1fr; gap: 32px; }
          .vismis-wrapper { border-radius: 0; padding: 32px 0; }
        }
        
        @media (max-width: 640px) {
          .cert-grid { grid-template-columns: 1fr; }
          .about-section { padding: 40px 0; }
        }
      `}</style>

      <div id="about" ref={sectionRef} className="about-wrap">
        <div className="about-section">
          <div className="inner">
            
            {/* Bagian 1: Profil & History */}
            <div className="profil-container">
              <div>
                <div className="section-eyebrow">Profil Perusahaan</div>
                <h2 className="content-title">
                  Dua Dekade Dedikasi Sebagai <span style={{color:'#0369a1'}}>Mitra Gas Industri</span>
                </h2>
                <div className="profil-text">
                  <p style={{marginBottom: 16}}>
                    PT Surya Inti Gas didirikan pada tahun 2004 di Sidoarjo, Jawa Timur, dengan visi menjadi mitra distribusi gas industri yang komprehensif. Bermula dari melayani kebutuhan industri lokal, kami terus berkembang hingga kini memiliki jangkauan distribusi luas mencakup Jawa Timur, Jawa Tengah, DIY, hingga Kalimantan Timur.
                  </p>
                  <p>
                    Kami menyediakan solusi gas industri, medis, specialty gas, hingga cryogenic equipment yang telah memenuhi standar regulasi ketat di Indonesia. Fokus kami adalah memastikan keamanan dan keberlanjutan operasional klien melalui pasokan gas yang presisi.
                  </p>
                </div>
                
                <div className="cert-grid">
                  {certs.map((c, i) => (
                    <div className="cert-item" key={i}>
                      <CheckCircle2 size={16} /> {c}
                    </div>
                  ))}
                </div>
              </div>

              {/* Milestone Card */}
              <div className="timeline-card">
                <div className="section-eyebrow" style={{fontSize:'10px', marginBottom: '16px'}}>History Milestone</div>
                {milestones.map((m, i) => (
                  <div className="tl-item" key={i}>
                    <span className="tl-year">{m.year}</span>
                    <div>
                      <div className="tl-title">{m.title}</div>
                      <div className="tl-desc">{m.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Bagian 2: Visi & Misi */}
          <div className="vismis-wrapper">
            <div className="inner">
              <div className="vismis-grid">
                {/* Visi */}
                <div className="vm-card">
                  <div className="vm-label visi-label">
                    <Target size={16} /> Visi Kami
                  </div>
                  <p className="vm-content">
                    "Menjadi perusahaan distribusi gas industri terkemuka di Indonesia yang mengutamakan kualitas produk, keselamatan operasional, dan kepuasan pelanggan jangka panjang."
                  </p>
                </div>

                {/* Misi */}
                <div className="vm-card">
                  <div className="vm-label misi-label">
                    <BookOpen size={16} /> Misi Kami
                  </div>
                  <ul className="misi-list">
                    <li>Produk dengan standar kemurnian industri tinggi</li>
                    <li>Ketepatan waktu melalui armada distribusi mandiri</li>
                    <li>Layanan konsultasi teknis & after-sales responsif</li>
                    <li>Standar K3 ketat di setiap lini operasional</li>
                    <li>Perluasan jangkauan untuk industri nasional</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
};