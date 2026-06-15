'use client';

import { MapPin, ArrowRight, Mail } from 'lucide-react';
import '../../styles/career.css';

export function Career() {
  const openings = [
    {
      id: 1,
      title: "Sales Executive",
      division: "Sales & Marketing",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Bertanggung jawab atas penjualan produk gas industri ke pelanggan baru dan mempertahankan hubungan dengan pelanggan yang ada."
    },
    {
      id: 2,
      title: "Installation Technician",
      division: "Technical Operations",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Mid-level",
      description: "Melakukan instalasi dan maintenance sistem gas industri, tabung bertekanan tinggi, dan peralatan terkait di lokasi pelanggan."
    },
    {
      id: 3,
      title: "Admin & Finance Staff",
      division: "Finance & Admin",
      location: "Balikpapan",
      type: "Full-time",
      level: "Entry-level",
      description: "Menangani administrasi keuangan dan operasional kantor, termasuk pembukuan, laporan keuangan, dan administrasi HR."
    },
    {
      id: 4,
      title: "Gas Delivery Driver",
      division: "Logistics & Distribution",
      location: "Sidoarjo",
      type: "Full-time",
      level: "Entry-level",
      description: "Bertanggung jawab pengiriman gas industri ke lokasi pelanggan dengan aman dan tepat waktu sesuai jadwal yang ditentukan."
    }
  ];

  const handleApply = (jobTitle: string) => {
    const email = "careers@suryaintigas.com";
    const subject = `Application for ${jobTitle} Position`;
    const body = `Dear Hiring Manager,\n\nI am writing to express my interest in the ${jobTitle} position at PT Surya Inti Gas.\n\nPlease find my resume attached and let me know if you need any additional information.\n\nThank you for considering my application.\n\nBest regards`;
    
    window.location.href = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  };

  return (
    <div className="career-page">
      {/* Job Listings Section */}
      <div className="listings-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Lowongan Pekerjaan</h2>
            <p>Temukan posisi yang sesuai dengan keahlian dan minat Anda</p>
          </div>

          <div className="jobs-grid">
            {openings.map((job) => (
              <div key={job.id} className="job-card">
                <div className="job-header">
                  <div className="job-title">
                    <h3>{job.title}</h3>
                    <div className="job-meta">
                      <span className="job-badge division">{job.division}</span>
                      <span className="job-badge type">{job.type}</span>
                      <span className="job-badge level">{job.level}</span>
                    </div>
                  </div>
                  <span className="job-location">
                    <MapPin size={16} />
                    {job.location}
                  </span>
                </div>
                <div className="job-description">
                  <p>{job.description}</p>
                </div>
                <div className="job-footer">
                  <button onClick={() => handleApply(job.title)} className="apply-button">
                    Apply Now
                    <ArrowRight size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Culture Section */}
      <div className="culture-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Budaya Perusahaan</h2>
            <p>Nilai yang kami junjung dalam setiap aspek bisnis kami</p>
          </div>

          <div className="culture-grid">
            <div className="culture-card">
              <h3>Profesional</h3>
              <p>Kami menghargai profesionalisme dan integritas dalam setiap tindakan dan keputusan bisnis kami.</p>
            </div>
            <div className="culture-card">
              <h3>Inovatif</h3>
              <p>Kami mendorong inovasi dan perbaikan berkelanjutan untuk memberikan layanan terbaik kepada pelanggan.</p>
            </div>
            <div className="culture-card">
              <h3>Kerjasama Tim</h3>
              <p>Kami membangun budaya kerjasama dan saling menghargai antar tim untuk mencapai tujuan bersama.</p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="cta-section">
        <div className="section-container">
          <div className="cta-content">
            <h2>Tertarik untuk Bergabung?</h2>
            <p>Kami selalu mencari talent profesional yang bersemangat untuk membangun tim kami</p>
            <button onClick={() => window.location.href = 'mailto:careers@suryaintigas.com'}>
              Kirim CV Anda
              <Mail size={20} />
            </button>
          </div>
        </div>
      </div>

    </div>
  );
}
