import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Kontak } from "./components/Contact";
import { Product } from "./components/Product";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { Career } from "./components/Career";
import { AdminDashboard } from "./components/Dashboard/AdminDashboard";
import { initVisitorTracking } from "../utils/visitorTracking";


// ─── Scroll handler: ke atas atau ke section hash ────────────
function ScrollToTop() {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (hash) {
      // Ada hash (#kontak, #about, dll) — scroll ke section setelah render
      const target = hash.replace("#", "");
      const tryScroll = (attempt = 0) => {
        const el = document.getElementById(target);
        if (el) {
          el.scrollIntoView({ behavior: "smooth" });
        } else if (attempt < 10) {
          // Coba lagi setiap 100ms sampai element muncul (max 1 detik)
          setTimeout(() => tryScroll(attempt + 1), 100);
        }
      };
      tryScroll();
    } else {
      // Tidak ada hash — scroll ke atas
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
      <About />
      <Kontak />
    </>
  );
}

// ─── App ──────────────────────────────────────────────────────
function App() {
  useEffect(() => {
    // Initialize visitor tracking when app loads
    initVisitorTracking();
  }, []);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/produk" element={<Product />} />
            <Route path="/karir" element={<Career />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
          </Routes>
        </main>
        <Footer />
        <Chatbot />
      </div>
    </BrowserRouter>
  );
}

export default App;
