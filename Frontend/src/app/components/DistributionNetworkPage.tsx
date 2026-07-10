import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const css = `
  .distribution-corporate {
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
  }

  .distribution-hero {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--navy) 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .distribution-hero-content {
    max-width: 1400px;
    margin: 0 auto;
    text-align: center;
    color: var(--white);
  }

  .distribution-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(96, 165, 250, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.3);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 32px;
  }

  .distribution-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.5rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.1;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
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
    background: rgba(255, 255, 255, 0.9);
    border-radius: 16px;
    padding: 24px;
    border: 1px solid var(--slate-200);
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

const locations = [
  {
    id: 'kantor-pusat',
    name: 'Kantor Pusat',
    lat: -7.4669737,
    lng: 112.7497521,
    type: 'kantor-pusat',
    region: 'Jawa Timur'
  },
  {
    id: 'pabrik-balikpapan',
    name: 'Pabrik dan Stasiun Pengisian',
    lat: -1.1870876,
    lng: 116.8489722,
    type: 'pabrik',
    region: 'Kalimantan Timur'
  }
];

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
  const currentLocations = locations;

  return (
    <div className="distribution-corporate">
      <style>{css}</style>

      {/* Corporate Hero Section */}
      {showHero && (
        <section className="distribution-hero">
          <div className="distribution-hero-content">
            <div className="distribution-hero-badge">
              Jaringan Distribusi
            </div>
            <h1 className="distribution-hero-title">
              Lokasi Operasional <span style={{ color: 'var(--white)' }}>PT Surya Inti Gas</span>
            </h1>
            <p className="distribution-hero-description">
              Jaringan distribusi kami tersebar di berbagai lokasi strategis untuk memastikan pasokan gas yang andal dan konsisten ke seluruh Indonesia.
            </p>
          </div>
        </section>
      )}

      {/* Distribution Network Section */}
      <section className="distribution-network-section">
        <div className="distribution-network-container">
          <div className="distribution-network-header">
            <h2 className="distribution-network-title">
              Peta Jaringan Distribusi
            </h2>
            <p className="distribution-network-subtitle">
              Lokasi operasional PT Surya Inti Gas di Indonesia
            </p>
          </div>

          {/* Penggantian iframe dengan React-Leaflet */}
          <div className="map-container">
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
          </div>

          {/* Locations Information (Kartu di bawah peta) */}
          <div className="locations-info">
            {currentLocations.map((location) => {
              const mapsUrl = location.type === 'kantor-pusat'
                ? 'http://google.com/maps/place/PT.+Surya+Inti+Gas/@-7.4669737,112.7497521,16z/data=!3m1!4b1!4m6!3m5!1s0x2dd7e14793b1542f:0xe5456eaac6d0291d!8m2!3d-7.466979!4d112.752327!16s%2Fg%2F11gcm0cz2j?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D'
                : 'https://www.google.com/maps/place/PT.+SURYA+INTI+GAS+(+PT.+SIG+)+BALIKPAPAN/@-1.1870876,116.8489722,17z/data=!3m1!4b1!4m6!3m5!1s0x2df148fc497a3ea1:0xba6abd6e8257b9b4!8m2!3d-1.187093!4d116.8515471!16s%2Fg%2F11g887kpnd?entry=ttu&g_ep=EgoyMDI2MDYxNi4wIKXMDSoASAFQAw%3D%3D';
              return (
                <div key={location.id} className="location-card">
                  <h3 className="location-card-title">{location.name}</h3>
                  <p className="location-card-region">
                    {location.region}
                  </p>
                  <p className="location-card-description">
                    {location.type === 'kantor-pusat' 
                      ? 'Kantor pusat PT Surya Inti Gas berlokasi di Sidoarjo, Jawa Timur.'
                      : 'Pabrik dan stasiun pengisian PT Surya Inti Gas berlokasi di Balikpapan, Kalimantan Timur.'}
                  </p>
                  <a 
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="location-card-link"
                  >
                    Lihat di Google Maps
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
