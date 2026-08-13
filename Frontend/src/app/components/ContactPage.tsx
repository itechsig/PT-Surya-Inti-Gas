import '../../styles/contact-page.css';
import { Mail, MapPin, Building2, TrendingUp, Network, Award } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
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
                <div className="stat-label">{t('contactPage.stats.years')}</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Building2 size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">2</div>
                <div className="stat-label">{t('contactPage.stats.branches')}</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Network size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{t('contactPage.stats.distributionValue')}</div>
                <div className="stat-label">{t('contactPage.stats.distribution')}</div>
              </div>
            </motion.div>
            <motion.div className="stat-card" variants={fadeUp}>
              <div className="stat-icon">
                <Award size={32} />
              </div>
              <div className="stat-content">
                <div className="stat-number">{t('contactPage.stats.trustedValue')}</div>
                <div className="stat-label">{t('contactPage.stats.trusted')}</div>
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
                <div className="office-badge">{t('contactPage.sidoarjo.badge')}</div>
                <div className="office-location-icon">
                  <MapPin size={24} />
                </div>
              </div>
              <div className="office-card-body">
                <h3 className="office-card-title">{t('contactPage.sidoarjo.title')}</h3>
                <p className="office-card-address">
                  {t('contactPage.sidoarjo.address')}
                </p>
                <div className="office-card-contact">
                  <a href="https://wa.me/6281233906378" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <FaWhatsapp size={18} />
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
                  <span className="hours-label">{t('contactPage.hours.label')}:</span>
                  <div className="hours-value">
                    <div>{t('contactPage.hours.weekday')}: {t('contactPage.hours.weekdayTimesidoarjo')}</div>
                    <div>{t('contactPage.hours.saturday')}: {t('contactPage.hours.saturdayTimesidoarjo')}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Balikpapan Office Card */}
            <motion.div className="premium-office-card" variants={fadeUp}>
              <div className="office-card-header">
                <div className="office-badge secondary">{t('contactPage.balikpapan.badge')}</div>
                <div className="office-location-icon">
                  <MapPin size={24} />
                </div>
              </div>
              <div className="office-card-body">
                <h3 className="office-card-title">{t('contactPage.balikpapan.title')}</h3>
                <p className="office-card-address">
                  {t('contactPage.balikpapan.address')}
                </p>
                <div className="office-card-contact">
                  <a href="https://wa.me/6285157118879" target="_blank" rel="noopener noreferrer" className="contact-link">
                    <FaWhatsapp size={18} />
                    <span>+6285157118879</span>
                  </a>
                  <a href="#" className="contact-link" onClick={(e) => { e.preventDefault(); window.location.href = 'mailto:salescounter.bpn@suryaintigas.com'; }}>
                    <Mail size={18} />
                    <span>salescounter.bpn@suryaintigas.com</span>
                  </a>
                </div>
              </div>
              <div className="office-card-footer">
                <div className="office-hours">
                  <span className="hours-label">{t('contactPage.hours.label')}:</span>
                  <div className="hours-value">
                    <div>{t('contactPage.hours.weekday')}: {t('contactPage.hours.weekdayTimebalikpapan')}</div>
                    <div>{t('contactPage.hours.saturday')}: {t('contactPage.hours.saturdayTimebalikpapan')}</div>
                  </div>
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
          <img src="/office-optimized.jpg" alt={t('contactPage.imageAlt')} className="office-image" />
        </motion.div>
      </motion.section>

    </div>
  );
};