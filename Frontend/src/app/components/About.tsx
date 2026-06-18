import { useTranslation } from "react-i18next";
import { ChevronRight } from "lucide-react";
import { useState } from 'react';

import "../../styles/about.css";

export function About() {
  const { t } = useTranslation();
  const [activeYear, setActiveYear] = useState(0);

  const timelineData = [
    {
      year: "2003",
      label: t('about.timeline.items.0.label'),
      text: t('about.timeline.items.0.text'),
      image: "/images/products/sig-office.jpg",
      fullDescription: "PT Surya Inti Gas didirikan dengan visi untuk menjadi penyedia gas industri terkemuka di Indonesia. Memulai operasional dengan fokus pada penyediaan gas berkualitas tinggi untuk sektor industri."
    },
    {
      year: "2007",
      label: t('about.timeline.items.1.label'),
      text: t('about.timeline.items.1.text'),
      image: "/images/products/sig-office.jpg",
      fullDescription: "Ekspansi bisnis dengan pembukaan cabang baru di beberapa kota strategis. Meningkatkan kapasitas produksi dan distribusi untuk memenuhi permintaan pasar yang terus berkembang."
    },
    {
      year: "2016",
      label: t('about.timeline.items.2.label'),
      text: t('about.timeline.items.2.text'),
      image: "/images/products/sig-office.jpg",
      fullDescription: "Pencapaian penting dengan sertifikasi standar kualitas internasional. Investasi dalam teknologi terbaru untuk meningkatkan efisiensi operasional dan kualitas produk."
    },
    {
      year: "2017",
      label: t('about.timeline.items.3.label'),
      text: t('about.timeline.items.3.text'),
      image: "/images/products/sig-office.jpg",
      fullDescription: "Transformasi digital dan modernisasi sistem manajemen. Penetrasi pasar baru dengan layanan yang lebih komprehensif dan teknologi yang mutakhir."
    }
  ];

  const handleYearClick = (index: number) => {
    setActiveYear(index);
  };

  return (
    <div className="about-section" id="about">
      {/* Overview Section - White */}
      <div className="overview-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Tentang PT Surya Inti Gas</h2>
            <p>Perusahaan penyedia gas industri yang berkomitmen pada kualitas dan inovasi</p>
          </div>
          
          <div className="overview-grid">
            <div className="overview-text">
              <p className="lead">
                PT Surya Inti Gas adalah perusahaan penyedia gas industri yang berfokus pada penyediaan gas berkualitas untuk berbagai sektor industri di Indonesia. Dengan pengalaman lebih dari 20 tahun, kami berkomitmen untuk menjadi mitra terpercaya dalam industri gas.
              </p>
              <p>
                Kami menyediakan berbagai jenis gas industri termasuk gas tekanan tinggi, gas medis, gas campuran khusus, dan peralatan terkait untuk memenuhi kebutuhan pelanggan di sektor manufaktur, kesehatan, dan industri lainnya.
              </p>
            </div>
            
            <div className="overview-image">
              <img src="/images/products/sig-office.jpg" alt="PT Surya Inti Gas Office" />
            </div>
          </div>
        </div>
      </div>

      {/* Company Profile Video Section */}
      <div className="video-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Company Profile</h2>
            <p>Saksikan video profil perusahaan kami untuk mengenal lebih dekat PT Surya Inti Gas</p>
          </div>
          <div className="video-wrapper">
            <iframe
              width="100%"
              height="600"
              src="https://www.youtube.com/embed/5ghynNU2m3A?si=TM_RWKu3FtCa0QzP"
              title="PT Surya Inti Gas Company Profile"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      </div>

      {/* Vision Mission - Light Blue */}
      <div className="vm-section">
        <div className="section-container">
          <div className="vm-grid">
            <div className="vm-card">
              <h3>{t('about.vision.title')}</h3>
              <p>{t('about.vision.text')}</p>
            </div>
            <div className="vm-card">
              <h3>{t('about.mission.title')}</h3>
              <ul>
                {[
                  t('about.mission.items.0'),
                  t('about.mission.items.1'),
                  t('about.mission.items.2'),
                  t('about.mission.items.3'),
                ].map((item, i) => (
                  <li key={i}>
                    <ChevronRight size={16} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Interactive Timeline Section */}
      <div className="timeline-section">
        <div className="section-container">
          <div className="section-header">
            <h2>{t('about.timeline.title')}</h2>
            <p>{t('about.timeline.subtitle')}</p>
          </div>
          
          <div className="interactive-timeline">
            <div className="timeline-display">
              <div className="timeline-image-container">
                <div className="timeline-image-wrapper">
                  <img 
                    src={timelineData[activeYear].image} 
                    alt={`Timeline ${timelineData[activeYear].year}`}
                    className="timeline-image"
                  />
                </div>
                <div className="timeline-year-badge">
                  {timelineData[activeYear].year}
                </div>
              </div>
              
              <div className="timeline-info">
                <h3>{timelineData[activeYear].label}</h3>
                <p className="timeline-description">{timelineData[activeYear].fullDescription}</p>
              </div>
            </div>
            
            <div className="timeline-navigation">
              {timelineData.map((item, index) => (
                <div 
                  key={index}
                  className={`timeline-nav-item ${activeYear === index ? 'active' : ''}`}
                  onClick={() => handleYearClick(index)}
                >
                  <div className="timeline-circle">
                    <span className="timeline-nav-year">{item.year}</span>
                  </div>
                  <div className="timeline-connector" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}