import { ArrowRight } from "lucide-react";

/* ═══════════════════════════════════════════════════════════════
   WHY CHOOSE US.TSX — PT Surya Inti Gas Corporate
   Corporate Design inspired by Samator, Linde, Air Products
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .why-corporate {
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

  /* ── Corporate Why Section ── */
  .why-section {
    position: relative;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    padding: 120px 6vw;
    overflow: hidden;
  }

  .why-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Corporate Content Section ── */
  .why-content {
    background: rgba(255, 255, 255, 0.95);
    border-radius: 24px;
    padding: 60px;
    border: 1px solid var(--slate-200);
    text-align: center;
  }

  .why-content h2 {
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 2.5rem);
    font-weight: 700;
    color: var(--navy-dark);
    margin: 0 0 24px;
    letter-spacing: -0.02em;
    line-height: 1.2;
  }

  .why-content h2 .highlight {
    color: #000000;
  }

  .why-content p {
    font-family: var(--ff-body);
    font-size: clamp(1.125rem, 2vw, 1.25rem);
    line-height: 1.8;
    color: var(--slate-600);
    max-width: 900px;
    margin: 0 auto 32px;
  }

  .why-content-cta {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 16px 32px;
    background: var(--blue);
    color: var(--white) !important;
    border-radius: 50px;
    font-family: var(--ff-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    text-decoration: none;
  }
  
  .why-content-cta svg {
    color: var(--white) !important;
  }

  .why-content-cta:hover {
    background: var(--sky);
    color: var(--white);
    transform: translateY(-2px);
    box-shadow: 0 10px 25px rgba(30, 64, 175, 0.3);
  }

  /* ── Responsive Design ── */
  @media (max-width: 1024px) {
    .why-content {
      padding: 40px 32px;
    }
  }

  @media (max-width: 768px) {
    .why-section {
      padding: 80px 6vw;
    }

    .why-content {
      padding: 32px 24px;
    }
  }
`;

export function WhyChooseUs() {
  return (
    <div className="why-corporate">
      <style>{css}</style>

      <section className="why-section" id="why-choose-us">
        <div className="why-container">

          {/* Corporate Content Section */}
          <div className="why-content">
            <h2>
              Kami Siap <span className="highlight">Melayani</span> Kebutuhan Gas Anda
            </h2>
            <p>
              Kami siap memenuhi keinginan dan kebutuhan Anda akan produk gas. Kami siap berdiskusi dengan Anda, 
              agar keinginan dan kebutuhan Anda akan produk gas bisa kami support dengan baik 
              (stok, jenis dan type produk, jadwal pengiriman, maintenance, dll).
            </p>

            <a href="/kontak" className="why-content-cta">
              Mulai Diskusi Sekarang
              <ArrowRight size={16} />
            </a>
          </div>

        </div>
      </section>

    </div>
  );
}