import { Link } from "react-router-dom";

const css = `
  .coming-soon-page {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    padding: 20px;
  }

  .coming-soon-content {
    text-align: center;
    color: white;
    max-width: 600px;
  }

  .coming-soon-badge {
    display: inline-block;
    padding: 8px 24px;
    background: rgba(96, 165, 250, 0.15);
    border: 1px solid rgba(96, 165, 250, 0.3);
    border-radius: 50px;
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: rgba(255, 255, 255, 0.9);
    margin-bottom: 24px;
  }

  .coming-soon-title {
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    margin: 0 0 16px;
    line-height: 1.1;
  }

  .coming-soon-description {
    font-size: 1.125rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.7);
    margin: 0 0 32px;
  }

  .back-link {
    display: inline-block;
    padding: 12px 32px;
    background: #3b82f6;
    color: white;
    text-decoration: none;
    border-radius: 50px;
    font-weight: 600;
    transition: all 0.3s ease;
  }

  .back-link:hover {
    background: #60a5fa;
    transform: translateY(-2px);
  }
`;

export function FacilitiesPage() {
  return (
    <div className="coming-soon-page">
      <style>{css}</style>
      <div className="coming-soon-content">
        <div className="coming-soon-badge">Coming Soon</div>
        <h1 className="coming-soon-title">Fasilitas Operasional</h1>
        <p className="coming-soon-description">
          Halaman ini sedang dalam pengembangan. Kami akan segera menampilkan pabrik dan fasilitas operasional PT Surya Inti Gas.
        </p>
        <Link to="/tentang-kami" className="back-link">
          Kembali ke Profil Perusahaan
        </Link>
      </div>
    </div>
  );
}
