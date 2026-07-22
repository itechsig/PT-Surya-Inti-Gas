import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useTranslation } from "react-i18next";
import { getDistributionLocations } from "../../data/distribution";

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
    .distribution-network-section {
      padding: 80px 6vw;
    }

    .map-container {
      padding: 24px;
      min-height: 400px;
    }
  }
`;

const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

function MapUpdater({ activeLocations }: { activeLocations: any[] }) {
  const map = useMap();

  if (activeLocations.length > 0) {
    if (activeLocations.length === 1) {
      map.setView([activeLocations[0].lat, activeLocations[0].lng], 13);
    } else {
      const bounds = L.latLngBounds(activeLocations.map(loc => [loc.lat, loc.lng]));
      map.fitBounds(bounds, { padding: [50, 50] });
    }
  }
  return null;
}

export function DistributionNetworkSection() {
  const { t } = useTranslation();
  const currentLocations = getDistributionLocations(t);

  return (
    <div className="distribution-corporate">
      <style>{css}</style>

      <section className="distribution-network-section">
        <div className="distribution-network-container">
          <div className="map-container">
            <MapContainer 
              center={[-2.5, 118.0]}
              zoom={5} 
              style={{ width: '100%', height: '500px' }}
              scrollWheelZoom={false}
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {currentLocations.map((location) => (
                <Marker 
                  key={location.id} 
                  position={[location.lat, location.lng]}
                  icon={customIcon}
                >
                  <Popup>
                    <div style={{ fontFamily: 'system-ui, sans-serif' }}>
                      <strong>{location.name}</strong><br />
                      <span style={{ color: '#1e40af', fontWeight: 600 }}>{location.region}</span><br />
                      Lat: {location.lat}, Lng: {location.lng}
                    </div>
                  </Popup>
                </Marker>
              ))}
              <MapUpdater activeLocations={currentLocations} />
            </MapContainer>
          </div>

          <div className="locations-info">
            {currentLocations.map((location) => (
              <div key={location.id} className="location-card">
                <h3 className="location-card-title">{location.name}</h3>
                <div className="location-card-region">{location.region}</div>
                <div className="location-card-coordinates">
                  Lat: {location.lat}, Lng: {location.lng}
                </div>
                <p className="location-card-description">
                  {location.shortDescription}
                </p>
                <a
                  href={`https://www.google.com/maps?q=${location.lat},${location.lng}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="location-card-link"
                >
                  {t('distribution.page.viewOnGoogleMaps')}
                </a>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
