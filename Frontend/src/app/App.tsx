import { useEffect, useState, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RunningText } from "./components/RunningText";
import { AboutCompany } from "./components/AboutCompany";
import { CompanyProfileVideo } from "./components/CompanyProfileVideo";
import { ProductsAndServices } from "./components/ProductsAndServices";
import { IndustriesServed } from "./components/IndustriesServed";
import { WhyChooseUs } from "./components/WhyChooseUs";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { performanceMonitor } from "../utils/performanceMonitor";
import { AppProvider, ProductProvider, AuthProvider } from "../context";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { createSkipLink } from "../utils/accessibility";
import i18n from "../utils/i18n";

// Route-level code splitting: these are only needed on their specific route (or, for
// DistributionNetworkSection, pull in the ~460KB leaflet library) rather than on every
// page view. Each becomes its own chunk fetched on demand instead of bloating the main bundle.
const AboutUsPage = lazy(() => import("./components/AboutUsPage").then(m => ({ default: m.AboutUsPage })));
const ContactPage = lazy(() => import("./components/ContactPage").then(m => ({ default: m.ContactPage })));
const Product = lazy(() => import("./components/Product").then(m => ({ default: m.Product })));
const ProductDetail = lazy(() => import("./components/ProductDetail").then(m => ({ default: m.ProductDetail })));
const Career = lazy(() => import("./components/Career").then(m => ({ default: m.Career })));
const JobDetail = lazy(() => import("./components/JobDetail").then(m => ({ default: m.JobDetail })));
const JobApplicationForm = lazy(() => import("./components/JobApplicationForm").then(m => ({ default: m.JobApplicationForm })));
const DistributionNetworkPage = lazy(() => import("./components/DistributionNetworkPage").then(m => ({ default: m.DistributionNetworkPage })));
const DistributionNetworkSection = lazy(() => import("./components/DistributionNetworkSection").then(m => ({ default: m.DistributionNetworkSection })));
const Gallery = lazy(() => import("./components/Gallery"));
const GalleryDetail = lazy(() => import("./components/GalleryDetail"));

// The entire admin dashboard: public visitors never need any of this, so it's split
// into its own chunk(s) that only load when someone actually visits /admin.
const AdminLayout = lazy(() => import("./admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import("./admin/LoginPage").then(m => ({ default: m.LoginPage })));
const DashboardHome = lazy(() => import("./admin/DashboardHome").then(m => ({ default: m.DashboardHome })));
const HeroSlidesPage = lazy(() => import("./admin/heroSlides/HeroSlidesPage").then(m => ({ default: m.HeroSlidesPage })));
const ProductsPage = lazy(() => import("./admin/products/ProductsPage").then(m => ({ default: m.ProductsPage })));
const GalleryPage = lazy(() => import("./admin/gallery/GalleryPage").then(m => ({ default: m.GalleryPage })));
const JobVacanciesPage = lazy(() => import("./admin/jobVacancies/JobVacanciesPage").then(m => ({ default: m.JobVacanciesPage })));
const CareerApplicationsPage = lazy(() => import("./admin/careerApplications/CareerApplicationsPage").then(m => ({ default: m.CareerApplicationsPage })));
const UsersPage = lazy(() => import("./admin/users/UsersPage").then(m => ({ default: m.UsersPage })));
const AuditLogsPage = lazy(() => import("./admin/auditLogs/AuditLogsPage").then(m => ({ default: m.AuditLogsPage })));

// Minimal, non-layout-shifting fallback while a route chunk loads.
function RouteFallback() {
  return <div style={{ minHeight: '60vh' }} aria-hidden="true" />;
}

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
          <Suspense fallback={<div style={{ minHeight: '400px' }} aria-hidden="true" />}>
            <DistributionNetworkSection />
          </Suspense>
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
    <HelmetProvider>
      <AppProvider>
        <ProductProvider>
          <AuthProvider>
          <BrowserRouter>
          <ScrollToTop />
          <Suspense fallback={<RouteFallback />}>
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
                      <Suspense fallback={<RouteFallback />}>
                        <Product />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <ProductDetail />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <GalleryDetail />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <Gallery />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <Career />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <JobDetail />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <JobApplicationForm />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <ContactPage />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <AboutUsPage />
                      </Suspense>
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
                      <Suspense fallback={<RouteFallback />}>
                        <DistributionNetworkPage />
                      </Suspense>
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/admin/login" element={<LoginPage />} />
            <Route
              path="/admin"
              element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }
            >
              <Route index element={<DashboardHome />} />
              <Route path="hero-slides" element={<HeroSlidesPage />} />
              <Route path="products" element={<ProductsPage />} />
              <Route path="gallery" element={<GalleryPage />} />
              <Route
                path="job-vacancies"
                element={
                  <ProtectedRoute roles={['super_admin', 'admin', 'hr']}>
                    <JobVacanciesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="career-applications"
                element={
                  <ProtectedRoute roles={['super_admin', 'admin', 'hr']}>
                    <CareerApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute roles={['super_admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute roles={['super_admin']}>
                    <AuditLogsPage />
                  </ProtectedRoute>
                }
              />
            </Route>
            <Route path="*" element={<Navigate to="/id" replace />} />
          </Routes>
          </Suspense>
        </BrowserRouter>
        </AuthProvider>
      </ProductProvider>
    </AppProvider>
    </HelmetProvider>
  );
}

export default App;