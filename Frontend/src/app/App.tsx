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
import { AdminDashboardIntegrated } from "./components/Dashboard/AdminDashboardIntegrated";
import { initVisitorTracking } from "../utils/visitorTracking";
import { HeroProduct} from "./components/Hero_Product";


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
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main>
              <MainPage />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/produk" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main>
              <Product />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/karir" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main>
              <Career />
            </main>
            <Footer />
            <Chatbot />
          </div>
        } />
        <Route path="/admin/dashboard" element={<AdminDashboardIntegrated />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;