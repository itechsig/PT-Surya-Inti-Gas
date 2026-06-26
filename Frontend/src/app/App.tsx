import { useEffect } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
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
import { AdminDashboardIntegrated } from "./components/Dashboard/AdminDashboardIntegrated";
import { DistributionNetworkPage } from "./components/DistributionNetworkPage";
import { LeadershipPage } from "./components/LeadershipPage";
import { ValuesPage } from "./components/ValuesPage";
import { FacilitiesPage } from "./components/FacilitiesPage";
import Gallery from "./components/Gallery";
import News from "./components/News";
import { initVisitorTracking } from "../utils/visitorTracking";
import { performanceMonitor } from "../utils/performanceMonitor";
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
  return (
    <>
      <Hero />
      <AboutCompany />
      <CompanyProfileVideo />
      <ProductsAndServices />
      <IndustriesServed />
      <div style={{ height: '80px', background: '#f8fafc' }} />
      <DistributionNetworkPage showHero={false} />
      <WhyChooseUs />
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
          <Routes>
            <Route path="/" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <MainPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
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
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/produk/detail" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <ProductDetail />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
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
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/berita" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <News />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
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
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/karir/:id" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <JobDetail />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/karir/:id/lamar" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <JobApplicationForm />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/kontak" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <ContactPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/tentang-kami" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <AboutUsPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/jaringan-distribusi" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <DistributionNetworkPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/kepemimpinan" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <LeadershipPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/nilai-nilai" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <ValuesPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/fasilitas" element={
          <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
            <Header />
            <main id="main-content" tabIndex={-1}>
              <FacilitiesPage />
            </main>
            <Footer />
            <Chatbot />
            <ScrollToTopButton />
          </div>
        } />
        <Route path="/admin/dashboard" element={<AdminDashboardIntegrated />} />
      </Routes>
    </BrowserRouter>
    </ProductProvider>
    </AppProvider>
  );
}

export default App;