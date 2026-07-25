import '../../styles/contact-page.css';
import { Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
          <motion.h1 className="contact-hero-title" variants={fadeUp}>{t('contactPage.title')}</motion.h1>
          <motion.p className="contact-hero-subtitle" variants={fadeUp}>{t('contactPage.subtitle')}</motion.p>
        </div>
      </motion.section>

      <motion.div 
        className="clean-container contact-content"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        variants={staggerContainer}
      >
        <div className="clean-grid">

          {/* Kolom Kiri: Lokasi & Gambar */}
          <motion.div className="location-column" variants={fadeUp}>
            <div className="address-grid">
              <motion.h2 className="section-title text-center full-width location-title" variants={fadeUp}>{t('contactPage.locationTitle')}</motion.h2>

              {/* Alamat Sidoarjo */}
              <motion.div className="address-block" variants={fadeUp}>
                <h3>{t('contactPage.sidoarjoOffice')}</h3>
                <p>
                  Komp. Perg. & Industri Safe N" Lock,<br />
                  Blok V1 - 3223, 3225, 3232, 3233<br />
                  Jl. Lingkar Timur KM. 5.5<br />
                  Rangkah Kidul, Sidoarjo<br />
                  Jawa Timur 61232
                </p>
                <a href="tel:+6281233906378" className="contact-info" style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', textDecoration: 'none', color: 'inherit' }}>
                  <Phone size={16} style={{ marginRight: '8px', color: '#1e40af' }} />
                  +6281233906378
                </a>
                <a href="#" className="contact-info" style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', textDecoration: 'none', color: 'inherit' }} onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.sda@suryaintigas.com'; }}>
                  <Mail size={16} style={{ marginRight: '8px', color: '#1e40af' }} />
                  salescounter.sda@suryaintigas.com
                </a>
              </motion.div>

              {/* Alamat Balikpapan */}
              <motion.div className="address-block" variants={fadeUp}>
                <h3>{t('contactPage.balikpapanOffice')}</h3>
                <p>
                  Jl. AMD Projakal Kariangau Km. 5.5,<br />
                  RT 046, Kelurahan Graha Indah,<br />
                  Kecamatan Balikpapan Utara,<br />
                  Kota Balikpapan, Kalimantan Timur
                </p>
                <a href="tel:+625428531991" className="contact-info" style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', textDecoration: 'none', color: 'inherit' }}>
                  <Phone size={16} style={{ marginRight: '8px', color: '#1e40af' }} />
                  +62 542 8531991
                </a>
                <a href="#" className="contact-info" style={{ display: 'flex', alignItems: 'center', fontSize: '1rem', textDecoration: 'none', color: 'inherit' }} onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.bpn@suryaintigas.com'; }}>
                  <Mail size={16} style={{ marginRight: '8px', color: '#1e40af' }} />
                  salescounter.bpn@suryaintigas.com
                </a>
              </motion.div>

              <motion.img src="/office-optimized.jpg" alt={t('contactPage.sidoarjoOffice')} className="office-image full-width" variants={fadeUp} />
            </div>
          </motion.div>

          {/* Kolom Kanan: Form Kontak */}
          <motion.div className="form-column" variants={fadeUp}>
            <h2 className="section-title text-center">{t('contactPage.sendMessage')}</h2>
            <p className="form-intro">{t('contactPage.formIntro')}</p>

            <form className="contact-form">
              <input type="text" placeholder={t('contactPage.placeholders.name')} required />
              <input type="email" placeholder={t('contactPage.placeholders.email')} required />
              <input type="text" placeholder={t('contactPage.placeholders.company')} />
              <input type="text" placeholder={t('contactPage.placeholders.subject')} required />
              <textarea placeholder={t('contactPage.placeholders.message')} rows={6} required></textarea>

              <button type="submit" className="submit-button">{t('contactPage.send')}</button>
            </form>
          </motion.div>

        </div>
      </motion.div>
    </div>
  );
};