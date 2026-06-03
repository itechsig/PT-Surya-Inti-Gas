import React from "react";
import { useTranslation } from "react-i18next";
import { CheckCircle2, Target, BookOpen, Play, X } from "lucide-react";
// Isi
const VIDEO_SRC: string = "https://www.youtube.com/embed/Atf_Af1q_5w?si=zdvFWYZk97fv5Rfl";
const YT_VIDEO_ID: string = "Atf_Af1q_5w";

const fontImport = `
  @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@400;500;600;700&family=Outfit:wght@300;400;500;600&display=swap');

  *, *::before, *::after { box-sizing: border-box; }

  .about-section {
    background: #ffffff;
    min-height: 100vh;
    position: relative;
    overflow: hidden;
  }
  .about-section::before {
    content: '';
    position: fixed;
    top: -100px; right: -100px;
    width: 500px; height: 500px;
    background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }
  .about-section::after {
    content: '';
    position: fixed;
    bottom: -120px; left: -80px;
    width: 450px; height: 450px;
    background: radial-gradient(circle, rgba(59,130,246,0.10) 0%, transparent 70%);
    border-radius: 50%;
    pointer-events: none;
    z-index: 0;
  }

  .about-inner {
    max-width: 1600px;
    margin: 0 auto;
    padding: 100px 40px ;
    display: flex;
    flex-direction: column;
    gap: 72px;
    position: relative;
    z-index: 1;
  }

  .glass-card {
    background: rgba(255,255,255,0.55);
    backdrop-filter: blur(18px);
    -webkit-backdrop-filter: blur(18px);
    border: 1px solid rgba(255,255,255,0.75);
    border-radius: 20px;
    box-shadow: 0 8px 32px rgba(15,23,42,0.06), 0 2px 8px rgba(15,23,42,0.04);
  }
  .glass-card-strong {
    background: rgba(255,255,255,0.72);
    backdrop-filter: blur(24px);
    -webkit-backdrop-filter: blur(24px);
    border: 1px solid rgba(255,255,255,0.85);
    border-radius: 20px;
    box-shadow: 0 12px 40px rgba(15,23,42,0.08);
  }

  .row-intro {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: center;
  }
  .intro-photo-wrap { position: relative; }
  .intro-photo-wrap .deco {
    position: absolute;
    inset: -12px;
    border-radius: 28px;
    background: linear-gradient(135deg, rgba(34,197,94,0.15), rgba(59,130,246,0.10));
    z-index: 0;
  }

  .row-vimis {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 48px;
    align-items: stretch;
  }
  .vimis-photo-wrap { position: relative; }
  .vimis-photo-wrap .deco {
    position: absolute;
    inset: -12px;
    border-radius: 28px;
    background: linear-gradient(225deg, rgba(59,130,246,0.12), rgba(34,197,94,0.08));
    z-index: 0;
  }
  .check-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 16px; border-radius: 10px;
    transition: background 0.2s ease;
    cursor: default;
  }
  .check-item:hover { background: rgba(34,197,94,0.08); }
  .photo-img {
    width: 100%; object-fit: cover;
    border-radius: 20px; display: block;
    position: relative; z-index: 1;
  }
  .misi-list {
    margin: 0; padding: 0;
    list-style: none;
    display: flex; flex-direction: column; gap: 10px;
  }
  .divider-line {
    border: none; height: 1px;
    background: linear-gradient(to right, transparent, rgba(148,163,184,0.4), transparent);
    margin: 0;
  }

  /* ── VIDEO BANNER INLINE (antara intro & visi-misi) ── */
  .vid-banner {
    border-radius: 20px;
    overflow: hidden;
    background: #0f172a;
    display: grid;
    grid-template-columns: 1fr 1fr;
    min-height: 200px;
    box-shadow: 0 16px 48px rgba(15,23,42,0.14);
    animation: bannerFadeIn 0.6s ease both;
  }
  @keyframes bannerFadeIn {
    from { opacity:0; transform: translateY(16px); }
    to   { opacity:1; transform: translateY(0); }
  }
  .vid-banner-thumb {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    min-height: 200px;
  }
  .vid-banner-thumb img {
    width: 100%; height: 100%; object-fit: cover;
    display: block;
    opacity: 0.6;
    transition: opacity 0.3s ease, transform 0.4s ease;
  }
  .vid-banner-thumb:hover img { opacity: 0.8; transform: scale(1.04); }
  .vid-banner-play-overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
  }
  .vid-banner-play-btn {
    width: 56px; height: 56px; border-radius: 50%;
    background: #22c55e;
    display: flex; align-items: center; justify-content: center;
    box-shadow: 0 6px 24px rgba(34,197,94,0.55);
    transition: transform 0.25s cubic-bezier(0.34,1.56,0.64,1), box-shadow 0.25s ease;
    border: 3px solid rgba(255,255,255,0.25);
  }
  .vid-banner-thumb:hover .vid-banner-play-btn {
    transform: scale(1.12);
    box-shadow: 0 10px 32px rgba(34,197,94,0.65);
  }
  .vid-banner-body {
    padding: 32px 28px;
    display: flex; flex-direction: column;
    justify-content: center; gap: 16px;
    position: relative;
  }
  .vid-banner-body::before {
    content: '';
    position: absolute; inset: 0;
    background: linear-gradient(135deg, rgba(34,197,94,0.06) 0%, transparent 60%);
    pointer-events: none;
  }
  .vid-banner-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700; font-size: clamp(1.3rem, 2.5vw, 1.7rem);
    color: #ffffff; margin: 0; line-height: 1.2;
  }
  .vid-banner-desc {
    font-family: 'Outfit', sans-serif;
    font-size: 0.88rem; font-weight: 300;
    color: rgba(148,163,184,0.9); margin: 0; line-height: 1.6;
  }
  .vid-banner-cta {
    display: inline-flex; align-items: center; gap: 8px;
    background: #22c55e;
    border: none; border-radius: 10px;
    padding: 10px 20px; cursor: pointer;
    width: fit-content;
    transition: background 0.2s ease, transform 0.2s ease;
  }
  .vid-banner-cta:hover { background: #16a34a; transform: translateY(-1px); }
  .vid-banner-cta span {
    font-family: 'Outfit', sans-serif;
    font-size: 0.85rem; font-weight: 600;
    color: #ffffff; letter-spacing: 0.02em;
  }
  .vid-banner-dismiss {
    position: absolute; top: 14px; right: 14px;
    width: 28px; height: 28px; border-radius: 8px;
    border: 1px solid rgba(148,163,184,0.2);
    background: rgba(255,255,255,0.07);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; transition: background 0.2s;
  }
  .vid-banner-dismiss:hover { background: rgba(239,68,68,0.2); }

  @media (max-width: 640px) {
    .vid-banner { grid-template-columns: 1fr; }
    .vid-banner-thumb { min-height: 160px; }
    .vid-banner-body { padding: 20px 18px; }
  }

  /* ── MODAL ── */
  .vid-modal-overlay {
    position: fixed; inset: 0;
    background: rgba(15,23,42,0.62);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    animation: overlayIn 0.22s ease;
  }
  @keyframes overlayIn { from { opacity:0; } to { opacity:1; } }
  .vid-modal-box {
    background: rgba(255,255,255,0.97);
    border-radius: 24px;
    box-shadow: 0 32px 80px rgba(15,23,42,0.22);
    width: 100%; max-width: 860px;
    overflow: hidden;
    animation: modalIn 0.3s cubic-bezier(0.34,1.56,0.64,1);
  }
  @keyframes modalIn {
    from { opacity:0; transform: scale(0.92) translateY(16px); }
    to   { opacity:1; transform: scale(1) translateY(0); }
  }
  .vid-modal-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px 24px 16px;
    border-bottom: 1px solid rgba(148,163,184,0.12);
  }
  .vid-modal-title-group { display: flex; align-items: center; gap: 10px; }
  .vid-modal-icon {
    width: 34px; height: 34px;
    border-radius: 10px;
    background: rgba(34,197,94,0.10);
    border: 1px solid rgba(34,197,94,0.18);
    display: flex; align-items: center; justify-content: center;
  }
  .vid-modal-title {
    font-family: 'Cormorant Garamond', serif;
    font-weight: 700; font-size: 1.15rem;
    color: #0f172a; margin: 0;
  }
  .vid-modal-sub {
    font-family: 'Outfit', sans-serif;
    font-size: 0.75rem; color: #94a3b8;
    font-weight: 300; margin: 2px 0 0;
  }
  .vid-modal-close {
    width: 34px; height: 34px;
    border-radius: 10px;
    border: 1px solid rgba(148,163,184,0.20);
    background: rgba(248,250,252,0.8);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s;
  }
  .vid-modal-close:hover { background: rgba(254,226,226,0.7); border-color: rgba(239,68,68,0.25); }
  .vid-modal-player {
    position: relative; aspect-ratio: 16/9; background: #000;
  }
  .vid-modal-player iframe,
  .vid-modal-player video { width: 100%; height: 100%; border: none; display: block; }

  /* ── Timeline ── */
  .timeline-landscape {
    position: relative;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 0;
  }
  .timeline-landscape::before {
    content: '';
    position: absolute;
    top: 27px; left: calc(12.5%); right: calc(12.5%);
    height: 2px;
    background: linear-gradient(to right, #bfdbfe, #7dd3fc, #34d399, #bbf7d0);
    z-index: 0;
  }
  .tl-item {
    display: flex; flex-direction: column;
    align-items: center; text-align: center;
    padding: 0 10px; position: relative;
  }
  .tl-dot { animation: pulseBlue 2.5s infinite; }
  @keyframes pulseBlue {
    0%   { box-shadow: 0 0 0 0 rgba(59,130,246,0.35); }
    70%  { box-shadow: 0 0 0 8px rgba(59,130,246,0); }
    100% { box-shadow: 0 0 0 0 rgba(59,130,246,0); }
  }
  .tl-card {
    margin-top: 20px;
    background: rgba(255,255,255,0.62);
    backdrop-filter: blur(16px);
    border: 1px solid rgba(255,255,255,0.8);
    border-radius: 16px;
    box-shadow: 0 6px 24px rgba(15,23,42,0.07);
    padding: 20px 16px; width: 100%;
    transition: transform 0.25s ease, box-shadow 0.25s ease;
  }
  .tl-card:hover { transform: translateY(-4px); box-shadow: 0 14px 36px rgba(15,23,42,0.12); }

  /* ── Fade-in ── */
  .fade-in-section {
    opacity: 0; transform: translateY(32px);
    transition: opacity 0.7s ease, transform 0.7s ease;
  }
  .fade-in-section.is-visible { opacity: 1; transform: translateY(0); }
  .fade-in-section.delay-1 { transition-delay: 0.1s; }
  .fade-in-section.delay-2 { transition-delay: 0.2s; }
  .fade-in-section.delay-3 { transition-delay: 0.3s; }
  .fade-in-section.delay-4 { transition-delay: 0.4s; }

  /* ════ RESPONSIVE ════ */
  @media (max-width: 900px) {
    .about-inner { padding: 48px 20px; gap: 52px; }
    .row-intro { grid-template-columns: 1fr; gap: 32px; }
    .intro-photo-wrap { order: 2; }
    .intro-text { order: 1; }
    .row-vimis { grid-template-columns: 1fr; gap: 28px; }
    .vimis-photo-wrap { order: 1; min-height: 260px !important; }
    .vimis-cards { order: 2; }
    .intro-photo-wrap .photo-img { height: 300px !important; }
    .timeline-landscape { grid-template-columns: 1fr 1fr; gap: 20px; }
    .timeline-landscape::before { display: none; }
  }

  @media (max-width: 560px) {
    .about-inner { padding: 36px 16px; gap: 40px; }
    .intro-photo-wrap { display: none; }
    .vimis-photo-wrap { display: none; }
    .row-vimis { grid-template-columns: 1fr; }
    .glass-card { padding: 12px 8px !important; }
    .check-item { padding: 8px 12px; gap: 10px; }
    .glass-card-strong { padding: 20px !important; }
    .timeline-landscape { grid-template-columns: 1fr; gap: 16px; }
    .timeline-landscape::before { display: none; }
    .tl-item { flex-direction: row; align-items: flex-start; text-align: left; gap: 16px; padding: 0; }
    .tl-dot { flex-shrink: 0; margin-top: 0; }
    .tl-card { margin-top: 0; flex: 1; padding: 16px 14px; }
    .vid-modal-box { border-radius: 16px; }
    .vid-modal-header { padding: 16px 16px 12px; }
    .vid-popup { right: 16px; bottom: 20px; width: 220px; }
  }
`;

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
      <style>{fontImport}</style>
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
                PT. Surya Inti Gas
              </h1>

              <p style={{
                fontFamily: "'Outfit', sans-serif",
                fontSize: "clamp(0.95rem, 2.5vw, 1.05rem)",
                lineHeight: 1.75, color: "#5a7085", fontWeight: 300, margin: 0,
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
                    <p style={{ fontFamily:"'Outfit', sans-serif", margin:0, color:"#5a7085", fontSize:"0.86rem", lineHeight:1.65, fontWeight:300 }}>{item.text}</p>
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
