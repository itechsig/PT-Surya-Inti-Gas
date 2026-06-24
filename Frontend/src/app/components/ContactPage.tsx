import '../../styles/contact-page.css';

export const ContactPage = () => {
  return (
    <div className="clean-contact-page">

      {/* Hero Section */}
      <div className="contact-hero">
        <div className="clean-container">
          <div className="contact-hero-badge">Kontak</div>
          <h1 className="contact-hero-title">Hubungi Kami</h1>
          <p className="contact-hero-subtitle">Kami siap membantu Anda dengan solusi gas industri terbaik</p>
        </div>
      </div>

      <div className="clean-container contact-content">
        <div className="clean-grid">
          
          {/* Kolom Kiri: Lokasi & Gambar */}
          <div className="location-column">
            <h2 className="section-title">Lokasi Kami</h2>
            
            <div className="address-grid">
              {/* Alamat Sidoarjo */}
              <div className="address-block">
                <h3>Kantor Sidoarjo</h3>
                <p>
                  Komp. Perg. & Industri Safe N" Lock,<br />
                  Blok V1 - 3223, 3225, 3232, 3233<br />
                  Jl. Lingkar Timur KM. 5.5<br />
                  Rangkah Kidul, Sidoarjo<br />
                  Jawa Timur 61232
                </p>
                <p className="contact-info">
                  Phone 081233906378
                </p>
              </div>

              {/* Alamat Balikpapan */}
              <div className="address-block">
                <h3>Kantor Balikpapan</h3>
                <p>
                  Jl. AMD Projakal Kariangau Km. 5.5,<br />
                  RT 046, Kelurahan Graha Indah,<br />
                  Kecamatan Balikpapan Utara,<br />
                  Kota Balikpapan, Kalimantan Timur
                </p>
                <p className="contact-info">
                  Phone +62 542 8531991<br />
                  Fax +62 542 8532382
                </p>
              </div>
            </div>
          </div>

          {/* Kolom Kanan: Form Kontak */}
          <div className="form-column">
            <h2 className="section-title text-center">Kirim Pesan</h2>
            <p className="form-intro">Isi formulir di bawah ini dan tim kami akan segera menghubungi Anda</p>
            
            <form className="contact-form">
              <input type="text" placeholder="Your Name" required />
              <input type="email" placeholder="Your Email" required />
              <input type="text" placeholder="Company Name" />
              <input type="text" placeholder="Subject" required />
              <textarea placeholder="Message" rows={6} required></textarea>
              
              <button type="submit" className="submit-button">SEND</button>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
};