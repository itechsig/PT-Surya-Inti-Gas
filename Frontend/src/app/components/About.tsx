import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Target, BookOpen, Play, X } from "lucide-react";
// Isi
const VIDEO_SRC: string = "https://www.youtube.com/embed/Atf_Af1q_5w?si=zdvFWYZk97fv5Rfl";
const YT_VIDEO_ID: string = "Atf_Af1q_5w";

import "../../styles/about.css";


const PhotoBlock: React.FC<{
  src: string;
  style?: React.CSSProperties;
  className?: string;
}> = ({ src, style, className }) => (
  <img
    src={src}
    alt="PT Surya Inti Gas"
    className={`photo-img${className ? ` ${className}` : ""}`}
    style={{ backgroundColor: "#d1fae5", ...style }}
  />
);

export function About() {
  const { t } = useTranslation();
  const [bannerDismissed, setBannerDismissed] = React.useState(false);
  const [open, setOpen] = React.useState(false);

  const timelineData = [
    {
      year: "2003", label: t('about.timeline.items.0.label'),
      text: t('about.timeline.items.0.text'),
      color: "#3b82f6", bg: "rgba(59,130,246,0.10)", accent: "rgba(59,130,246,0.15)",
    },
    {
      year: "2007", label: t('about.timeline.items.1.label'),
      text: t('about.timeline.items.1.text'),
      color: "#0891b2", bg: "rgba(8,145,178,0.10)", accent: "rgba(8,145,178,0.15)",
    },
    {
      year: "2016", label: t('about.timeline.items.2.label'),
      text: t('about.timeline.items.2.text'),
      color: "#16a34a", bg: "rgba(22,163,74,0.10)", accent: "rgba(22,163,74,0.15)",
    },
    {
      year: "2017", label: t('about.timeline.items.3.label'),
      text: t('about.timeline.items.3.text'),
      color: "#22c55e", bg: "rgba(34,197,94,0.10)", accent: "rgba(34,197,94,0.15)",
    },
  ];
  React.useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {  
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    document.querySelectorAll(".fade-in-section").forEach(el => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="about-section" id="about" style={{ fontFamily:"'Outfit', sans-serif" }}>
        <div className="about-inner">

          {/* ══ BARIS 1 ══ */}
          <div className="row-intro">
            {/* Teks kiri */}
            <div className="intro-text fade-in-section" style={{ display: "flex", flexDirection: "column", gap: "28px" }}>
              {/* Eyebrow */}
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "36px", height: "2px", background: "#22c55e" }} />
                <span style={{
                  fontFamily: "'Outfit', sans-serif", fontSize: "0.78rem",
                  fontWeight: 600, letterSpacing: "0.18em",
                  textTransform: "uppercase", color: "#16a34a",
                }}>
                  {t('about.title')}
                </span>
              </div>
              <h1 style={{ fontFamily:"'Cormorant Garamond', serif", fontSize:"clamp(2rem, 5vw, 3.4rem)", fontWeight:700, lineHeight:1.12, color:"#0f172a", margin:0, letterSpacing:"-0.01em" }}>
                Surya Inti Gas
              </h1>

              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                lineHeight: 1.75, color: "#5a7085", fontWeight: 300, margin: 0,
                textAlign: "justify",
              }}>
                {t('about.intro')}

              </p>
              <div className="glass-card" style={{ padding:"20px 16px", display:"flex", flexDirection:"column", gap:"4px" }}>
                {[
                  t('about.highlights.industrialGas'),
                  t('about.highlights.delivery'),
                  t('about.highlights.customers'),
                  t('about.highlights.offices'),
                ].map((item, i) => (
                  <div key={i} className="check-item">
                    <CheckCircle2 color="#22c55e" size={18} strokeWidth={2.5} />
                    <span style={{ fontFamily:"'Outfit', sans-serif", fontWeight:500, fontSize:"0.95rem", color:"#1e293b" }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="intro-photo-wrap fade-in-section delay-2">
              <div className="deco" />
              <PhotoBlock src="https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=800" style={{ height:"420px" }} />
            </div>
          </div>

          {/* ══ BARIS 2: Visi Misi ══ */}
          <div className="row-vimis">
            <div className="vimis-photo-wrap fade-in-section">
              <div className="deco" />
              <PhotoBlock src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800" style={{ height:"100%", minHeight:"380px" }} />
            </div>
            <div className="vimis-cards fade-in-section delay-2" style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
              <div className="glass-card-strong" style={{ padding:"28px", flex:1 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(3,105,161,0.08)", borderRadius:"8px", padding:"6px 14px", marginBottom:"16px" }}>
                  <Target size={18} color="#0369a1" strokeWidth={2.2} />
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                    fontSize: "1.15rem", color: "#0369a1", letterSpacing: "0.02em",
                  }}>
                    {t('about.vision.title')}
                  </span>
                </div>
                <p style={{
                  fontFamily: "'Outfit', sans-serif",
                  lineHeight: 1.75, color: "#475569",
                  margin: 0, fontSize: "0.97rem", fontWeight: 300,
                }}>
                  {t('about.vision.text')}

                </p>
              </div>
              <div className="glass-card-strong" style={{ padding:"28px", flex:1 }}>
                <div style={{ display:"inline-flex", alignItems:"center", gap:"8px", background:"rgba(22,163,74,0.08)", borderRadius:"8px", padding:"6px 14px", marginBottom:"16px" }}>
                  <BookOpen size={18} color="#16a34a" strokeWidth={2.2} />
                  <span style={{
                    fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
                    fontSize: "1.15rem", color: "#16a34a", letterSpacing: "0.02em",
                  }}>
                    {t('about.mission.title')}
                  </span>
                </div>
                <ul className="misi-list">
                  {[
                    t('about.mission.items.0'),
                    t('about.mission.items.1'),
                    t('about.mission.items.2'),
                    t('about.mission.items.3'),
                  ].map((item, i) => (
                    <li key={i} style={{ display:"flex", alignItems:"flex-start", gap:"10px", fontFamily:"'Outfit', sans-serif", fontSize:"0.95rem", color:"#475569", fontWeight:300, lineHeight:1.6 }}>
                      <span style={{ width:"6px", height:"6px", borderRadius:"50%", background:"#22c55e", marginTop:"8px", flexShrink:0 }} />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          {/* ══ BARIS 3: Timeline ══ */}
          <div>
            {/* Section header */}
            <div className="fade-in-section" style={{ textAlign: "center", marginBottom: "48px" }}>
              <div style={{
                display: "flex", alignItems: "center",
                justifyContent: "center", gap: "10px", marginBottom: "10px",
              }}>
                <div style={{ width: "36px", height: "1.5px", background: "#94a3b8" }} />
                <span style={{
                  fontSize: "0.72rem", fontWeight: 600,
                  letterSpacing: "0.18em", textTransform: "uppercase",
                  color: "#94a3b8", fontFamily: "'Outfit', sans-serif",
                }}>
                  {t('about.timeline.title')}
                </span>
                <div style={{ width: "36px", height: "1.5px", background: "#94a3b8" }} />
              </div>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "clamp(1.7rem, 4vw, 2.2rem)",
                fontWeight: 700, color: "#0f172a",
                margin: 0, letterSpacing: "-0.01em",
              }}>
                {t('about.timeline.subtitle')}
              </h2>
            </div>
            <div className="timeline-landscape">
              {timelineData.map((item, i) => (
                <div key={i} className={`tl-item fade-in-section delay-${i+1}`}>
                  <div className="tl-dot" style={{ width:"56px", height:"56px", borderRadius:"50%", background:item.bg, border:`2px solid ${item.color}`, display:"flex", alignItems:"center", justifyContent:"center", fontFamily:"'Outfit', sans-serif", fontWeight:700, fontSize:"0.8rem", color:item.color, zIndex:1, flexShrink:0 }}>
                    {String(i+1).padStart(2,"0")}
                  </div>
                  <div className="tl-card">
                    <div style={{ display:"inline-block", background:item.accent, borderRadius:"6px", padding:"3px 10px", marginBottom:"8px" }}>
                      <span style={{ fontFamily:"'Cormorant Garamond', serif", fontWeight:700, fontSize:"1.35rem", color:item.color }}>{item.year}</span>
                    </div>
                    <p style={{ fontFamily:"'Outfit', sans-serif", fontWeight:600, fontSize:"0.78rem", letterSpacing:"0.1em", textTransform:"uppercase", color:item.color, margin:"0 0 8px" }}>{item.label}</p>
                    <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, color:"#5a7085", fontSize:"0.85rem", lineHeight:1.6, fontWeight:300, flex:1, textAlign:"justify", overflow:"auto", scrollbarWidth:"none", msOverflowStyle:"none", maxHeight:"100%" }}>{item.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

{/* ══ VIDEO BANNER — setelah visi misi ══ */}
          {!bannerDismissed && (
            <div className="vid-banner fade-in-section delay-1">
              <div className="vid-banner-thumb" onClick={() => { setOpen(true); }}>
                <img
                  src={`https://img.youtube.com/vi/${YT_VIDEO_ID}/maxresdefault.jpg`}
                  alt="Thumbnail video company profile PT Surya Inti Gas"
                />
                <div className="vid-banner-play-overlay">
                  <div className="vid-banner-play-btn">
                    <Play size={22} color="#fff" fill="#fff" style={{ marginLeft: 3 }} />
                  </div>
                </div>
              </div>
              <div className="vid-banner-body">
                <button className="vid-banner-dismiss" onClick={() => setBannerDismissed(true)} aria-label="Tutup banner">
                  <X size={14} color="#94a3b8" strokeWidth={2} />
                </button>
                <p className="vid-banner-title">Kenali Kami Lebih Dekat</p>
                <p className="vid-banner-desc">
                  Lebih dari 20 tahun melayani industri Indonesia. Saksikan perjalanan dan komitmen kami dalam video profil perusahaan.
                </p>
                <button className="vid-banner-cta" onClick={() => { setOpen(true); }}>
                  <Play size={14} color="#fff" fill="#fff" style={{ marginLeft: 1 }} />
                  <span>Tonton Sekarang</span>
                </button>
              </div>
            </div>
          )}

          <hr className="divider-line fade-in-section" />
          
        </div>
      </div>

      {/* Modal video fullsize */}
      {open && (
        <div className="vid-modal-overlay" onClick={e => e.target === e.currentTarget && setOpen(false)}>
          <div className="vid-modal-box">
            <div className="vid-modal-header">
              <div className="vid-modal-title-group">
                <div className="vid-modal-icon">
                  <Play size={14} color="#22c55e" fill="#22c55e" style={{ marginLeft:2 }} />
                </div>
                <div>
                  <p className="vid-modal-title">PT. Surya Inti Gas</p>
                  <p className="vid-modal-sub">Company Profile — Video Pengenalan</p>
                </div>
              </div>
              <button className="vid-modal-close" onClick={() => setOpen(false)} aria-label="Tutup">
                <X size={16} color="#64748b" strokeWidth={2.2} />
              </button>
            </div>
            <div className="vid-modal-player">
              {true
                ? <iframe src={`${VIDEO_SRC}?autoplay=1&rel=0`} title="Company Profile PT Surya Inti Gas" allow="accelerometer;autoplay;clipboard-write;encrypted-media;gyroscope;picture-in-picture" allowFullScreen />
                : <video src={VIDEO_SRC} controls autoPlay />
              }
            </div>
          </div>
        </div>
      )}
    </>
  );
}
