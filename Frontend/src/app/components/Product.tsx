'use client';

import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { subProducts, layananList } from './Product/data';
import type { Product } from './Product/data';
import '../../styles/product.css';

type StepType = 'produk' | 'layanan';
type ProductType = Product;
type LayananType = typeof layananList[0];

export function Product() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState<StepType>('produk');
  const [selectedProduct, setSelectedProduct] = useState<ProductType | null>(null);
  const [selectedService, setSelectedService] = useState<LayananType | null>(null);
  const location = useLocation();

  // Get step from URL query
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const step = params.get('step') as StepType;
    if (step === 'produk' || step === 'layanan') {
      setActiveStep(step);
    }
  }, [location.search]);

  const handleStepChange = (step: StepType) => {
    setActiveStep(step);
    navigate('/produk?step=' + step);
  };

  const handleProductClick = (product: ProductType) => {
    setSelectedProduct(product);
  };

  const handleServiceClick = (service: LayananType) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedProduct(null);
    setSelectedService(null);
  };

  return (
    <div className="product-page">
      {/* Industry Categories Section */}
      <div className="categories-section">
        <div className="section-container">
          <div className="section-header">
            <h2>Solusi untuk Berbagai Industri</h2>
            <p>Kami menyediakan solusi gas khusus untuk berbagai sektor industri di Indonesia</p>
          </div>

          <div className="categories-grid">
            <div className="category-card">
              <h3>Manufacturing</h3>
              <p>Solusi gas untuk industri manufaktur dan produksi</p>
            </div>
            <div className="category-card">
              <h3>Kesehatan</h3>
              <p>Gas medis dengan standar internasional</p>
            </div>
            <div className="category-card">
              <h3>Laboratorium</h3>
              <p>Gas khusus untuk penelitian dan analisis</p>
            </div>
            <div className="category-card">
              <h3>Logistik</h3>
              <p>Pengiriman terintegrasi dengan armada mandiri</p>
            </div>
            <div className="category-card">
              <h3>Konstruksi</h3>
              <p>Gas untuk las dan aplikasi konstruksi</p>
            </div>
            <div className="category-card">
              <h3>Elektronik</h3>
              <p>Gas high purity untuk industri elektronik</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="tabs-section">
        <div className="section-container">
          <div className="tabs-nav">
            <button
              className={`tab-button ${activeStep === 'produk' ? 'active' : ''}`}
              onClick={() => handleStepChange('produk')}
            >
              Produk
            </button>
            <button
              className={`tab-button ${activeStep === 'layanan' ? 'active' : ''}`}
              onClick={() => handleStepChange('layanan')}
            >
              Layanan
            </button>
          </div>
        </div>
      </div>

      {/* Products Section */}
      {activeStep === 'produk' && (
        <div className="products-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Kategori Produk Unggulan</h2>
              <p>Solusi gas industri berkualitas tinggi untuk berbagai kebutuhan bisnis</p>
            </div>

            <div className="products-grid">
              {subProducts.slice(0, 6).map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                >
                  <div className="product-image">
                    <img src={product.image} alt={t(product.titleKey)} />
                    <div className="product-overlay">
                      <div className="product-overlay-content">
                        <span className="view-details">Lihat Detail</span>
                        <ArrowRight size={20} />
                      </div>
                    </div>
                  </div>
                  <div className="product-info">
                    <h3>{t(product.titleKey)}</h3>
                    <p>{t(product.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-cta">
              <button onClick={() => navigate('/kontak')}>
                Hubungi Kami untuk Konsultasi
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Services Section */}
      {activeStep === 'layanan' && (
        <div className="services-section">
          <div className="section-container">
            <div className="section-header">
              <h2>Layanan Profesional</h2>
              <p>Layanan komprehensif untuk memastikan kebutuhan gas industri Anda terpenuhi dengan optimal</p>
            </div>

            <div className="services-grid">
              {layananList.map((service) => (
                <div
                  key={service.id}
                  className="service-card"
                  onClick={() => handleServiceClick(service)}
                  style={{ borderColor: service.color + '30' }}
                >
                  <div className="service-image">
                    <img src={service.image} alt={t(service.titleKey)} />
                  </div>
                  <div className="service-badge" style={{ backgroundColor: service.color + '15', color: service.color }}>
                    {t(service.badgeKey)}
                  </div>
                  <div className="service-content">
                    <h3>{t(service.titleKey)}</h3>
                    <p>{t(service.descKey)}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="section-cta">
              <button onClick={() => navigate('/kontak')}>
                Konsultasi Layanan
                <ArrowRight size={20} />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2>{t(selectedProduct.titleKey)}</h2>
              <p>{t(selectedProduct.descKey)}</p>
            </div>
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedProduct.image} alt={t(selectedProduct.titleKey)} />
              </div>
              <div className="modal-details">
                <h3>Spesifikasi Produk</h3>
                {selectedProduct.specs.map((spec, idx) => (
                  <div key={idx} className="detail-item">
                    <span className="detail-label">{t(spec.labelKey)}</span>
                    <span className="detail-value">{spec.valueKey}</span>
                  </div>
                ))}
                <a
                  href={`https://wa.me/628123456789?text=${encodeURIComponent(`Halo, saya ingin bertanya lebih lanjut tentang produk ${t(selectedProduct.titleKey)}. Apakah bisa memberikan informasi lebih detail?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button"
                >
                  Tanya Lebih Lanjut
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="modal-close" onClick={closeModal}>×</button>
            <div className="modal-header">
              <h2>{t(selectedService.titleKey)}</h2>
              <p>{t(selectedService.descKey)}</p>
            </div>
            <div className="modal-body">
              <div className="modal-image">
                <img src={selectedService.image} alt={t(selectedService.titleKey)} />
              </div>
              <div className="modal-details">
                <a
                  href={`https://wa.me/628123456789?text=${encodeURIComponent(`Halo, saya ingin bertanya lebih lanjut tentang layanan ${t(selectedService.titleKey)}. Apakah bisa memberikan informasi lebih detail?`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="whatsapp-button"
                >
                  Tanya Lebih Lanjut
                  <ArrowRight size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
