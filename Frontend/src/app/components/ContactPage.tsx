import '../../styles/contact-page.css';
import { Phone, Mail } from 'lucide-react';
import { useTranslation } from 'react-i18next';

export const ContactPage = () => {
  const { t } = useTranslation();
  return (
    <div className="clean-contact-page">

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="clean-container">
          <div className="contact-hero-badge">{t('contactPage.badge')}</div>
          <h1 className="contact-hero-title">{t('contactPage.title')}</h1>
          <p className="contact-hero-subtitle">{t('contactPage.subtitle')}</p>
        </div>
      </div>

      <div className="clean-container contact-content">
        <div className="clean-grid">

          {/* Kolom Kiri: Lokasi & Gambar */}
          <div className="location-column">
            <div className="address-grid">
              <h2 className="section-title text-center full-width location-title">{t('contactPage.locationTitle')}</h2>

              {/* Alamat Sidoarjo */}
              <div className="address-block">
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
              </div>

              {/* Alamat Balikpapan */}
              <div className="address-block">
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
              </div>

              <img src="/office-optimized.jpg" alt={t('contactPage.sidoarjoOffice')} className="office-image full-width" />
            </div>
          </div>

          {/* Kolom Kanan: Form Kontak */}
          <div className="form-column">
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
          </div>

        </div>
      </div>
    </div>
  );
};