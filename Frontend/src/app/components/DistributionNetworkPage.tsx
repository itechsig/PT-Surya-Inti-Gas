import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { getDistributionLocations } from "../../data/distribution";
import { motion, type Variants } from "motion/react";

const css = `
  .distribution-corporate {
    --primary: #0F4C81;
    --primary-dark: #0a3861;
    --secondary: #00AEEF;
    --bg: #F8FAFC;
    --accent: #EAF4FF;
    --navy-dark: #0f172a;
    --navy: #1e293b;
    --blue-dark: #1e3a8a;
    --blue: #1e40af;
    --sky: #3b82f6;
    --sky-light: #60a5fa;
    --white: #ffffff;
    --slate-50: #f8fafc;
    --slate-100: #f1f5f9;
    --slate-200: #e2e8f0;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;
    --slate-900: #0f172a;
    
    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ff-display: 'Barlow', system-ui, sans-serif;
    --ff-body: 'DM Sans', system-ui, sans-serif;
    
    font-family: var(--ff-body);
    background: var(--bg);
  }

  .distribution-corporate :focus-visible {
    outline: 3px solid var(--secondary);
    outline-offset: 2px;
  }

  .distribution-hero {
    position: relative;
    min-height: 560px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 140px 6vw;
    text-align: center;
  }

  .distribution-hero-bg {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url('/images/products/20260618_135557.webp');
    background-size: cover;
    background-position: center 65%;
    z-index: 0;
  }

  .distribution-hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .distribution-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.25rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
    text-align: center;
  }

  .distribution-hero-description {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    max-width: 800px;
    margin: 0 auto;
  }

  .distribution-network-section {
    background: transparent;
    padding: 120px 6vw;
  }

  .distribution-network-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .distribution-network-header {
    text-align: center;
    margin-bottom: 48px;
    background: rgba(255, 255, 255, 0.95);
    padding: 40px;
    border-radius: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  }

  .distribution-network-title {
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    color: var(--navy-dark);
    margin: 0 0 16px;
    letter-spacing: -0.02em;
  }

  .distribution-network-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(1rem, 1.5vw, 1.125rem);
    line-height: 1.7;
    color: var(--slate-600);
    max-width: 700px;
    margin: 0 auto;
  }

  .map-container {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 32px;
    border: 1px solid var(--slate-200);
    min-height: 500px;
  }

  /* Tambahan: Pastikan map container bawaan Leaflet tidak menabrak z-index elemen lain */
  .leaflet-container {
    z-index: 1;
    border-radius: 16px;
  }

  .locations-info {
    margin-top: 32px;
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
    gap: 24px;
  }

  .location-card {
    position: relative;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 20px;
    padding: 32px;
    border: 1px solid var(--slate-200);
    overflow: hidden;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .location-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s var(--ease);
  }

  .location-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(15, 76, 129, 0.12);
    border-color: rgba(0, 174, 239, 0.4);
  }

  .location-card:hover::before {
    transform: scaleX(1);
  }

  .location-card-title {
    font-family: var(--ff-display);
    font-size: 1.125rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 12px;
  }

  .location-card-region {
    font-family: var(--ff-body);
    font-size: 0.875rem;
    color: var(--blue);
    font-weight: 600;
    margin: 0 0 8px;
  }

  .location-card-coordinates {
    font-family: var(--ff-body);
    font-size: 0.9rem;
    color: var(--slate-600);
    margin: 0 0 8px;
  }

  .location-card-description {
    font-family: var(--ff-body);
    font-size: 0.9rem;
    color: var(--slate-600);
    margin: 0;
    line-height: 1.5;
  }

  .location-card-link {
    display: inline-block;
    padding: 8px 16px;
    background: var(--blue);
    color: var(--white) !important;
    border-radius: 8px;
    text-decoration: none;
    font-family: var(--ff-body);
    font-size: 0.875rem;
    font-weight: 600;
    transition: all 0.3s var(--ease);
    margin-top: 12px;
  }

  .location-card-link:hover {
    background: var(--blue-dark);
    color: var(--white) !important;
    transform: translateY(-2px);
  }

  @media (max-width: 768px) {
    .distribution-hero,
    .distribution-network-section {
      padding: 80px 6vw;
    }

    .map-container {
      padding: 24px;
      min-height: 400px;
    }
  }
`;

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

// Fix untuk default marker icon di React-Leaflet agar tidak error (menggunakan CDN)
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Komponen pembantu untuk mengatur pergerakan/zoom peta secara dinamis
function MapUpdater({ activeLocations }: { activeLocations: any[] }) {
  const map = useMap();

  if (activeLocations.length > 0) {
    if (activeLocations.length === 1) {
      // Jika hanya 1 lokasi, zoom langsung ke titik tersebut
      map.setView([activeLocations[0].lat, activeLocations[0].lng], 13);
    } else {
      // Jika lebih dari 1 lokasi, buat bounding box yang mencakup semua marker
      const bounds = L.latLngBounds(activeLocations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  return null;
}

interface DistributionNetworkPageProps {
  showHero?: boolean;
}

export function DistributionNetworkPage({ showHero = true }: DistributionNetworkPageProps) {
  const { t } = useTranslation();
  const currentLocations = getDistributionLocations(t);

  return (
    <div className="distribution-corporate">
      <style>{css}</style>

      {/* Corporate Hero Section */}
      {showHero && (
        <motion.section
          className="distribution-hero"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <div className="distribution-hero-bg"></div>
          <div className="distribution-hero-content">
            <motion.h1 className="distribution-hero-title" variants={fadeUp}>
              {t('distribution.page.title')} <span style={{ color: 'var(--white)' }}>{t('distribution.page.titleHighlight')}</span>
            </motion.h1>
            <motion.p className="distribution-hero-description" variants={fadeUp}>
              {t('distribution.page.description')}
            </motion.p>
          </div>
        </motion.section>
      )}

      {/* Distribution Network Section */}
      <section className="distribution-network-section">
        <div className="distribution-network-container">
          {/* Penggantian iframe dengan React-Leaflet */}
          <motion.div
            className="map-container"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={fadeUp}
          >
            <MapContainer 
              center={[-2.5, 118.0]} // Default center (Tengah-tengah Indonesia)
              zoom={5} 
              style={{ width: '100%', height: '500px' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              
              {/* Komponen pembantu untuk animasi kamera peta */}
              <MapUpdater activeLocations={currentLocations} />
              
              {/* Render semua marker yang ada di currentLocations */}
              {currentLocations.map((location) => (
                <Marker 
                  key={location.id} 
                  position={[location.lat, location.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ fontFamily: 'var(--ff-body)' }}>
                      <strong>{location.name}</strong><br />
                      <span style={{ color: 'var(--slate-600)', fontSize: '0.85em' }}>
                        {location.region}
                      </span>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </motion.div>

          {/* Locations Information (Kartu di bawah peta) */}
          <div className="locations-info">
            {currentLocations.map((location) => {
              return (
                <div key={location.id} className="location-card">
                  <h3 className="location-card-title">{location.name}</h3>
                  <p className="location-card-region">
                    {location.region}
                  </p>
                  <p className="location-card-description">
                    {location.description}
                  </p>
                  <a
                    href={location.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-card-link"
                  >
                    {t('distribution.page.viewOnGoogleMaps')}
                  </a>
                </div>
              );
            })}
          </div>
        </div>
      </section>

    </div>
  );
}
