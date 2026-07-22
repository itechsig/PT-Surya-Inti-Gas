import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RunningText } from "./components/RunningText";
import { AboutCompany } from "./components/AboutCompany";
import { AboutUsPage } from "./components/AboutUsPage";
import { CompanyProfileVideo } from "./components/CompanyProfileVideo";
import { ProductsAndServices } from "./components/ProductsAndServices";
import { IndustriesServed } from "./components/IndustriesServed";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { ContactPage } from "./components/ContactPage";
import { Product } from "./components/Product";
import { ProductDetail } from "./components/ProductDetail";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { Career } from "./components/Career";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { JobDetail } from "./components/JobDetail";
import { JobApplicationForm } from "./components/JobApplicationForm";

import { DistributionNetworkPage } from "./components/DistributionNetworkPage";
import { DistributionNetworkSection } from "./components/DistributionNetworkSection";
import Gallery from "./components/Gallery";
import GalleryDetail from "./components/GalleryDetail";
import { performanceMonitor } from "../utils/performanceMonitor";
import { AppProvider, ProductProvider } from "../context";
import { createSkipLink } from "../utils/accessibility";
import i18n from "../utils/i18n";

// Page transition styles
const pageTransitionStyles = `
  @keyframes pageFadeIn {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  @keyframes pageSlideIn {
    from {
      opacity: 0;
      transform: translateX(-20px);
    }
    to {
      opacity: 1;
      transform: translateX(0);
    }
  }

  .page-transition {
    animation: pageFadeIn 0.6s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .page-transition-fast {
    animation: pageFadeIn 0.4s cubic-bezier(0.4, 0, 0.2, 1) both;
  }

  .page-transition-slide {
    animation: pageSlideIn 0.5s cubic-bezier(0.4, 0, 0.2, 1) both;
  }
`;

// Inject page transition styles
if (typeof document !== 'undefined') {
  const styleSheet = document.createElement('style');
  styleSheet.textContent = pageTransitionStyles;
  document.head.appendChild(styleSheet);
}

// ─── Page Transition Component ───────────────────────────────
function PageTransition({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'fast' | 'slide' }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const className = variant === 'fast' ? 'page-transition-fast' : 
                    variant === 'slide' ? 'page-transition-slide' : 
                    'page-transition';

  return (
    <div className={className} style={{ opacity: isVisible ? 1 : 0 }}>
      {children}
    </div>
  );
}

// ─── Language Route Component ───────────────────────────────
function LanguageRouteWrapper() {
  const { lang } = useParams<{ lang: string }>();
  const validLanguages = ['en', 'id', 'zh'];

  useEffect(() => {
    if (lang && validLanguages.includes(lang)) {
      i18n.changeLanguage(lang);
    }
  }, [lang]);

  if (!lang || !validLanguages.includes(lang)) {
    return <Navigate to="/id" replace />;
  }

  return null;
}

// ─── Scroll handler: ke atas atau ke section hash ────────────
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      const target = hash.replace("#", "");
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempt < 10) {
          setTimeout(() => tryScroll(attempt + 1), 100);
        }
      };
      tryScroll();
    } else {
      window.scrollTo({ top: 0, behavior: "instant" });
    }
  }, [pathname, hash]);

  return null;
}

// ─── Halaman Utama ────────────────────────────────────────────
function MainPage() {
  return (
    <>
      <Hero />
      <RunningText />
      <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900" style={{ backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.5)), url(/images/office/wp2.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundAttachment: 'fixed' }}>
        <PageTransition variant="default">
          <AboutCompany />
          <CompanyProfileVideo />
          <ProductsAndServices />
          <IndustriesServed />
          <div style={{ height: '80px', background: '#f8fafc' }} />
          <DistributionNetworkSection />
          <WhyChooseUs />
        </PageTransition>
      </div>
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    performanceMonitor.init();

    // Add skip link for accessibility
    const skipLink = createSkipLink('main-content');
    document.body.insertBefore(skipLink, document.body.firstChild);
  }, []);

  return (
    <AppProvider>
      <ProductProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            <Route path="/" element={<Navigate to="/id" replace />} />
            <Route path="/:lang" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <MainPage />
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/produk" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <Product />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/produk/detail" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <ProductDetail />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/galeri/:id" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <GalleryDetail />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/galeri" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <Gallery />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/karir" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <Career />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/karir/:id" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <JobDetail />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/karir/:id/lamar" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <JobApplicationForm />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/kontak" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <ContactPage />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/tentang-kami" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <AboutUsPage />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/jaringan-distribusi" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <DistributionNetworkPage />
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="*" element={<Navigate to="/id" replace />} />
          </Routes>
    </BrowserRouter>
    </ProductProvider>
    </AppProvider>
  );
}

export default App;