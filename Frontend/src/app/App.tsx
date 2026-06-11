import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Kontak } from "./components/Contact";
import { Product } from "./components/Product";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { Career } from "./components/Career";
import { Gallery } from "./components/Gallery";
import { AdminDashboardIntegrated } from "./components/Dashboard/AdminDashboardIntegrated";
import { initVisitorTracking } from "../utils/visitorTracking";
import { performanceMonitor } from "../utils/performanceMonitor";
// import { initWebVitals } from "../utils/webVitals";
import { HeroProduct } from "./components/Hero_Product";
import { ErrorBoundary } from "./components/ErrorBoundary";
import { AppProvider, ProductProvider } from "../context";
import { createSkipLink } from "../utils/accessibility";


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
  const navigate = useNavigate();

  const handleViewAll = () => {
    navigate("/produk?step=produk");
  };

  return (
    <>
      <Hero />
      <About />
      <HeroProduct
        onViewAll={handleViewAll}
      />
      <Kontak />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    initVisitorTracking();
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
          <ErrorBoundary>
            <Routes>
            <Route path="/" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <MainPage />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/produk" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <Product />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/galeri" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <Gallery />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/karir" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <Career />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/admin/dashboard" element={<AdminDashboardIntegrated />} />
      </Routes>
      </ErrorBoundary>
    </BrowserRouter>
      </ProductProvider>
    </AppProvider>
  );
}

export default App;