import { ContactForm } from "./ContactForm";
import { ArrowRight, MessageCircle } from "lucide-react";
import '../../styles/contact-page.css';

export const ContactPage = () => {
  const whatsappNumber = "628123456789"; // Ganti dengan nomor WhatsApp resmi

  return (
    <div className="contact-page">
      {/* Contact Form Section */}
      <div className="form-section">
        <div className="section-container">
          <div className="form-grid">
            <div className="form-content">
              <div className="section-header">
                <h2>Kirim Pesan</h2>
                <p>Isi formulir di bawah ini untuk mengirim pesan kepada tim kami</p>
              </div>
              <ContactForm />
              
              {/* WhatsApp Alternative */}
              <div className="whatsapp-alternative">
                <p>Atau hubungi kami langsung via WhatsApp:</p>
                <a
                  href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('Halo, saya ingin bertanya tentang layanan gas industri PT Surya Inti Gas.')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button"
                >
                  <MessageCircle size={24} />
                  <span>Chat WhatsApp</span>
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>

            {/* Maps Section */}
            <div className="maps-content">
              <div className="section-header">
                <h2>Lokasi Kantor</h2>
                <p>Kunjungi kantor kami di lokasi strategis</p>
              </div>
              
              <div className="maps-grid">
                <div className="map-card">
                  <div className="map-header">
                    <div className="map-indicator"></div>
                    <span>Kantor Pusat - Sidoarjo</span>
                  </div>
                  <div className="map-iframe">
                    <iframe
                      title="Kantor Pusat - Sidoarjo"
                      src="https://www.google.com/maps?q=PT+Surya+Inti+Gas+Sidoarjo&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>

                <div className="map-card">
                  <div className="map-header">
                    <div className="map-indicator secondary"></div>
                    <span>Kantor Cabang - Balikpapan</span>
                  </div>
                  <div className="map-iframe">
                    <iframe
                      title="Kantor Cabang - Balikpapan"
                      src="https://www.google.com/maps?q=PT+Surya+Inti+Gas+Balikpapan&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
