import { useEffect, lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route, useLocation, useParams, Navigate } from "react-router-dom";
import { HelmetProvider } from 'react-helmet-async';
import { useTranslation } from "react-i18next";
import { Seo } from "./components/Seo";
import { MotionConfig } from "motion/react";
import { Header } from "./components/Header";
import { Hero } from "./components/Hero";
import { RunningText } from "./components/RunningText";
import { AboutCompany } from "./components/AboutCompany";
// import { CompanyProfileVideo } from "./components/CompanyProfileVideo";
import { ProductsAndServices } from "./components/ProductsAndServices";
import { IndustriesServed } from "./components/IndustriesServed";
import { Footer } from "./components/Footer";
import { Chatbot } from "./components/Chatbot";
import { ScrollToTopButton } from "./components/ScrollToTopButton";
import { RouteProgressBar } from "./components/RouteProgressBar";
import { VisitorTracker } from "./components/VisitorTracker";
import { setRouteLoading } from "../utils/routeProgress";
import { performanceMonitor } from "../utils/performanceMonitor";
import { AppProvider, ProductProvider, AuthProvider } from "../context";
import { ProtectedRoute } from "./admin/ProtectedRoute";
import { createSkipLink } from "../utils/accessibility";
import { useLazyLoad } from "../hooks/useLazyLoad";
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
const Portfolio = lazy(() => import("./components/Portfolio"));
const PortfolioDetail = lazy(() => import("./components/PortfolioDetail"));
const PrivacyPolicyPage = lazy(() => import("./components/LegalPage").then(m => ({ default: m.PrivacyPolicyPage })));
const TermsOfServicePage = lazy(() => import("./components/LegalPage").then(m => ({ default: m.TermsOfServicePage })));

// The entire admin dashboard: public visitors never need any of this, so it's split
// into its own chunk(s) that only load when someone actually visits /admin.
const AdminLayout = lazy(() => import("./admin/AdminLayout").then(m => ({ default: m.AdminLayout })));
const LoginPage = lazy(() => import("./admin/LoginPage").then(m => ({ default: m.LoginPage })));
const DashboardHome = lazy(() => import("./admin/DashboardHome").then(m => ({ default: m.DashboardHome })));
const HeroSlidesPage = lazy(() => import("./admin/heroSlides/HeroSlidesPage").then(m => ({ default: m.HeroSlidesPage })));
const ProductsPage = lazy(() => import("./admin/products/ProductsPage").then(m => ({ default: m.ProductsPage })));
const GalleryPage = lazy(() => import("./admin/gallery/GalleryPage").then(m => ({ default: m.GalleryPage })));
const PortfoliosPage = lazy(() => import("./admin/portfolios/PortfoliosPage").then(m => ({ default: m.PortfoliosPage })));
const JobVacanciesPage = lazy(() => import("./admin/jobVacancies/JobVacanciesPage").then(m => ({ default: m.JobVacanciesPage })));
const CareerApplicationsPage = lazy(() => import("./admin/careerApplications/CareerApplicationsPage").then(m => ({ default: m.CareerApplicationsPage })));
const UsersPage = lazy(() => import("./admin/users/UsersPage").then(m => ({ default: m.UsersPage })));
const RolesPage = lazy(() => import("./admin/roles/RolesPage").then(m => ({ default: m.RolesPage })));
const AuditLogsPage = lazy(() => import("./admin/auditLogs/AuditLogsPage").then(m => ({ default: m.AuditLogsPage })));

// Minimal, non-layout-shifting fallback while a route chunk loads. Signals
// the global RouteProgressBar for the duration it's mounted (i.e. while
// the lazy chunk + its data are still loading).
function RouteFallback() {
  useEffect(() => {
    setRouteLoading(true);
    return () => setRouteLoading(false);
  }, []);

  // Lightweight, non-layout-shifting placeholder: a hero-height band plus a few
  // content bars so a route swap reads as "loading" instead of a blank flash.
  return (
    <div style={{ minHeight: '60vh', padding: '0 0 64px' }} aria-hidden="true">
      <div className="route-skeleton-hero" />
      <div className="route-skeleton-body">
        <span className="route-skeleton-bar" style={{ width: '55%', height: 28 }} />
        <span className="route-skeleton-bar" style={{ width: '80%' }} />
        <span className="route-skeleton-bar" style={{ width: '72%' }} />
        <span className="route-skeleton-bar" style={{ width: '40%' }} />
      </div>
    </div>
  );
}

// ─── Page Transition Component ───────────────────────────────
// Keyframes live in styles/index.css. The `both` fill-mode holds the
// pre-animation state, so no inline opacity gate is needed.
function PageTransition({ children, variant = 'default' }: { children: React.ReactNode; variant?: 'default' | 'fast' | 'slide' }) {
  const className = variant === 'fast' ? 'page-transition-fast' :
                    variant === 'slide' ? 'page-transition-slide' :
                    'page-transition';

  return <div className={className}>{children}</div>;
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
      // Move keyboard/screen-reader focus to the main landmark so users are
      // told the page changed and Tab starts from the top of the new content.
      const main = document.getElementById("main-content");
      if (main) main.focus({ preventScroll: true });
    }
  }, [pathname, hash]);

  return null;
}

// Defers a below-the-fold section until the viewer scrolls near it, so its
// lazy chunk + assets stay off the initial page load. Used for the distribution
// map (~150KB chunk + Leaflet + OpenStreetMap tiles) which sits well below the
// fold on the homepage.
function DeferredSection({ minHeight = 400, children }: { minHeight?: number; children: React.ReactNode }) {
  const [ref, visible] = useLazyLoad(0, '300px');
  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} style={{ minHeight }}>
      {visible && (
        <Suspense fallback={<div style={{ minHeight }} aria-hidden="true" />}>
          {children}
        </Suspense>
      )}
    </div>
  );
}

// ─── Halaman Utama ────────────────────────────────────────────
function MainPage() {
  const { t } = useTranslation();
  return (
    <>
      <Seo title={t('seo.home.title')} description={t('seo.home.description')} segment="" />
      <Hero />
      <RunningText />
      <div className="min-h-screen font-sans selection:bg-blue-100 selection:text-blue-900" style={{ position: 'relative' }}>
        <div style={{
          position: 'fixed',
          inset: 0,
          backgroundImage: 'linear-gradient(rgba(15, 23, 42, 0.5), rgba(15, 23, 42, 0.5)), url(/images/office/wp2.jpg)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          zIndex: -1
        }} />
        <PageTransition variant="default">
          <AboutCompany />
          {/* <CompanyProfileVideo /> */}
          <ProductsAndServices />
          <IndustriesServed />
          <div style={{ height: '80px', background: '#f8fafc' }} />
          <DeferredSection minHeight={400}>
            <DistributionNetworkSection />
          </DeferredSection>
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
    const skipLink = createSkipLink('main-content', i18n.t('common.skipToContent'));
    document.body.insertBefore(skipLink, document.body.firstChild);
    return () => skipLink.remove();
  }, []);

  return (
    <HelmetProvider>
      <MotionConfig reducedMotion="user">
      <RouteProgressBar />
      <AppProvider>
        <ProductProvider>
          <AuthProvider>
          <BrowserRouter>
          <ScrollToTop />
          <VisitorTracker />
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
            <Route path="/:lang/portofolio/:slug" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <Suspense fallback={<RouteFallback />}>
                        <PortfolioDetail />
                      </Suspense>
                    </PageTransition>
                  </main>
                  <Footer />
                  <Chatbot />
                  <ScrollToTopButton />
                </div>
              </>
            } />
            <Route path="/:lang/portofolio" element={
              <>
                <LanguageRouteWrapper />
                <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                  <Header />
                  <main id="main-content" tabIndex={-1}>
                    <PageTransition variant="fast">
                      <Suspense fallback={<RouteFallback />}>
                        <Portfolio />
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
            {[
              { path: 'kebijakan-privasi', el: <PrivacyPolicyPage /> },
              { path: 'ketentuan-layanan', el: <TermsOfServicePage /> },
            ].map(({ path, el }) => (
              <Route key={path} path={`/:lang/${path}`} element={
                <>
                  <LanguageRouteWrapper />
                  <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900">
                    <Header />
                    <main id="main-content" tabIndex={-1}>
                      <PageTransition variant="fast">
                        <Suspense fallback={<RouteFallback />}>
                          {el}
                        </Suspense>
                      </PageTransition>
                    </main>
                    <Footer />
                    <Chatbot />
                    <ScrollToTopButton />
                  </div>
                </>
              } />
            ))}
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
              <Route path="portfolios" element={<PortfoliosPage />} />
              <Route
                path="job-vacancies"
                element={
                  <ProtectedRoute permission="job_vacancies.manage">
                    <JobVacanciesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="career-applications"
                element={
                  <ProtectedRoute permission="career_applications.manage">
                    <CareerApplicationsPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="users"
                element={
                  <ProtectedRoute permission="users.manage">
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="roles"
                element={
                  <ProtectedRoute roles={['super_admin']}>
                    <RolesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="audit-logs"
                element={
                  <ProtectedRoute permission="audit_logs.view">
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
      </MotionConfig>
    </HelmetProvider>
  );
}

export default App;