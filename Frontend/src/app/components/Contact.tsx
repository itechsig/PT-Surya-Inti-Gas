import { useRef, useEffect } from "react";

import {
  MapPin,
  Phone,
  Mail,
  Building2,
  Clock,
  ExternalLink,
  Headset,
} from "lucide-react";

import "../../styles/contact.css";

// ─── Types ────────────────────────────────────────────────────
type OfficeData = {
  type: "pusat" | "cabang";
  label: string;
  name: string;
  address: string;
  phones: string[];
  fax?: string;
  email: string;
  maps: string;
};

// ─── Data Kontak ─────────────────────────────────────────────
const OFFICES: OfficeData[] = [
  {
    type: "pusat",
    label: "Kantor Pusat",
    name: "PT. Surya Inti Gas — Sidoarjo",
    address:
      'Komp. Perg. & Industri "Safe N Lock"\nBlok V1 – 3223, 3225, 3232, 3233\nJl. Lingkar Timur KM. 5.5\nRangkah Kidul, Sidoarjo\nJawa Timur 61232',
    phones: ["+62 31 – 9970 4788", "+62 31 – 9970 4789"],
    fax: "+62 31 – 9970 4778",
    email: "salescounter.sda@suryaintigas.co.id",
    maps: "https://maps.google.com/?q=Komplek+Pergudangan+Safe+N+Lock+Sidoarjo",
  },
  {
    type: "cabang",
    label: "Kantor Cabang",
    name: "PT. Surya Inti Gas — Balikpapan",
    address:
      "Jl. AMD Projakal No.27, Batu Ampar\nKec. Balikpapan Utara\nKota Balikpapan\nKalimantan Timur 76127\nIndonesia",
    phones: ["+62 542 – 8531991", "+62 542 – 8532382"],
    email: "salescounter.bpn@suryaintigas.co.id",
    maps: "https://maps.google.com/?q=Jl+AMD+Projakal+Kariangau+Balikpapan",
  },
];

// ─── Office Card Component ─────────────────────────────────────
const OfficeCard = ({ office }: { office: OfficeData }) => (
  <div className="office-card">
    <div className="office-header">
      <Building2 className="office-icon" />
      <div>
        <span className="office-label">{office.label}</span>
        <h3>{office.name}</h3>
      </div>
    </div>

    <div className="office-body">
      <div className="office-info">
        <MapPin className="info-icon" />
        <div className="info-content">
          <h4>Alamat</h4>
          <p>{office.address}</p>
          <a href={office.maps} target="_blank" rel="noopener noreferrer">
            Lihat Peta <ExternalLink size={14} />
          </a>
        </div>
      </div>

      <div className="office-info">
        <Phone className="info-icon" />
        <div className="info-content">
          <h4>Telepon</h4>
          {office.phones.map((phone) => (
            <a key={phone} href={`tel:${phone.replace(/\D/g, "")}`}>
              {phone}
            </a>
          ))}
          {office.fax && <span>Fax: {office.fax}</span>}
        </div>
      </div>

      <div className="office-info">
        <Mail className="info-icon" />
        <div className="info-content">
          <h4>Email</h4>
          <a href={`mailto:${office.email}`}>
            {office.email}
          </a>
        </div>
      </div>

      <div className="office-info">
        <Clock className="info-icon" />
        <div className="info-content">
          <h4>Jam Operasional</h4>
          <p>Senin - Jumat: 08.00 - 17.00</p>
          <p>Sabtu: 08.00 - 13.00</p>
        </div>
      </div>
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────
export function Kontak() {
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.1 }
    );

    document.querySelectorAll(".fade-in-section").forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <section ref={sectionRef} id="kontak" className="contact-section">
      {/* Hero Section - Blue Theme Matching Hero.tsx */}
      <div className="contact-hero">
        <div className="hero-background" />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1>Hubungi Kami</h1>
          <p>Tim kami siap membantu Anda dengan solusi gas industri terbaik untuk kebutuhan bisnis Anda di seluruh Indonesia</p>
        </div>
      </div>

      {/* Contact Methods Section */}
      <div className="contact-methods">
        <div className="section-container">
          <div className="section-header">
            <h2>Cara Menghubungi Kami</h2>
            <p>Pilih saluran komunikasi yang paling nyaman untuk Anda</p>
          </div>
          
          <div className="methods-grid">
            <div className="method-card">
              <div className="method-icon">
                <Phone className="icon" />
              </div>
              <h3>Telepon</h3>
              <p>Konsultasi langsung dengan tim sales kami</p>
              <a href="tel:+623199704788" className="method-link">
                +62 31 – 9970 4788
              </a>
            </div>
            <div className="method-card">
              <div className="method-icon">
                <Mail className="icon" />
              </div>
              <h3>Email</h3>
              <p>Kirim pertanyaan via email</p>
              <a href="mailto:salescounter.sda@suryaintigas.co.id" className="method-link">
                salescounter.sda@suryaintigas.co.id
              </a>
            </div>
            <div className="method-card">
              <div className="method-icon">
                <Headset className="icon" />
              </div>
              <h3>Layanan Pelanggan</h3>
              <p>Support 24/7 untuk kebutuhan mendesak</p>
              <a href="tel:+623199704788" className="method-link">
                Hubungi Support
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Offices Section */}
      <div className="offices-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Lokasi Kantor Kami</h2>
            <p>Kunjungi kantor kami untuk konsultasi langsung atau hubungi melalui kontak yang tersedia</p>
          </div>
          
          <div className="offices-grid">
            {OFFICES.map((office) => (
              <OfficeCard key={office.name} office={office} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
