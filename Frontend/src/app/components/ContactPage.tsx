import '../../styles/contact-page.css';
import { Phone, Mail, MapPin, Building2, TrendingUp, Network, Award } from 'lucide-react';
import { motion, type Variants } from 'motion/react';

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export const ContactPage = () => {
  return (
    <div className="clean-contact-page">

      {/* Hero Section */}
      <motion.section
        className="contact-hero"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <div className="contact-hero-bg"></div>
        <div className="clean-container">
          <motion.h1 className="contact-hero-title" variants={fadeUp}>Hubungi Kami</motion.h1>
          <motion.p className="contact-hero-subtitle" variants={fadeUp}>Kami siap membantu kebutuhan gas industri Anda dengan layanan profesional dan terpercaya</motion.p>
        </div>
      </motion.section>

      {/* Company Statistics Section */}
      <motion.section 
        className="statistics-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <div className="clean-container">
          <motion.div className="statistics-grid" variants={staggerContainer}>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <TrendingUp size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">20+</div>
                <div className="stat-label">Tahun Pengalaman</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Building2 size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">2</div>
                <div className="stat-label">Kantor Cabang</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Network size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">Nasional</div>
                <div className="stat-label">Distribusi Luas</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">Terpercaya</div>
                <div className="stat-label">Mitra Industri</div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </motion.section>

      {/* Premium Office Cards Section */}
      <motion.section 
        className="office-cards-section"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <div className="clean-container">
          <div className="office-cards-grid">
            {/* Sidoarjo Office Card */}
            <motion.div className="premium-office-card" variants={fadeUp}>
              <div className="office-card-header">
                <div className="office-badge">Head Office</div>
                <div className="office-location-icon">
                  <MapPin size={24} />
                </div>
              </div>
              <div className="office-card-body">
                <h3 className="office-card-title">Sidoarjo</h3>
                <p className="office-card-address">
                  Komp. Perg. & Industri Safe N" Lock,<br />
                  Blok V1 - 3223, 3225, 3232, 3233<br />
                  Jl. Lingkar Timur KM. 5.5<br />
                  Rangkah Kidul, Sidoarjo<br />
                  Jawa Timur 61232
                </p>
                <div className="office-card-contact">
                  <a href="https://wa.me/6281233906378" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <Phone size={18} />
                    <span>+6281233906378</span>
                  </a>
                  <a href="#" className="contact-link" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.sda@suryaintigas.com'; }}>
                    <Mail size={18} />
                    <span>salescounter.sda@suryaintigas.com</span>
                  </a>
                </div>
              </div>
              <div className="office-card-footer">
                <div className="office-hours">
                  <span className="hours-label">Jam Operasional:</span>
                  <span className="hours-value">Senin - Jumat, 08:00 - 17:00</span>
                </div>
              </div>
            </motion.div>

            {/* Balikpapan Office Card */}
            <motion.div className="premium-office-card" variants={fadeUp}>
              <div className="office-card-header">
                <div className="office-badge secondary">Branch Office</div>
                <div className="office-location-icon">
                  <MapPin size={24} />
                </div>
              </div>
              <div className="office-card-body">
                <h3 className="office-card-title">Balikpapan</h3>
                <p className="office-card-address">
                  Jl. AMD Projakal Kariangau Km. 5.5,<br />
                  RT 046, Kelurahan Graha Indah,<br />
                  Kecamatan Balikpapan Utara,<br />
                  Kota Balikpapan, Kalimantan Timur
                </p>
                <div className="office-card-contact">
                  <a href="tel:+625428531991" className="contact-link">
                    <Phone size={18} />
                    <span>+62 542 8531991</span>
                  </a>
                  <a href="#" className="contact-link" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.bpn@suryaintigas.com'; }}>
                    <Mail size={18} />
                    <span>salescounter.bpn@suryaintigas.com</span>
                  </a>
                </div>
              </div>
              <div className="office-card-footer">
                <div className="office-hours">
                  <span className="hours-label">Jam Operasional:</span>
                  <span className="hours-value">Senin - Jumat, 08:00 - 17:00</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
        
        <motion.div 
          className="office-image-container"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={fadeUp}
        >
          <img src="/office-optimized.jpg" alt="Kantor PT Surya Inti Gas" className="office-image" />
        </motion.div>
      </motion.section>

    </div>
  );
};