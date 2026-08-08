import { useEffect, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet-async';
import { Search, MapPin, Calendar, ArrowRight, FolderOpen } from 'lucide-react';
import '../../styles/Portfolio.css';
import { PageHero } from './PageHero';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Skeleton } from './ui/skeleton';
import {
  Pagination, PaginationContent, PaginationItem, PaginationLink, PaginationNext, PaginationPrevious,
} from './ui/pagination';
import { usePortfolioCatalog } from '../../hooks/usePortfolioCatalog';
import { useIndustries } from '../../hooks/useIndustries';
import { useServiceTypes } from '../../hooks/useServiceTypes';
import type { PortfolioSummary } from '../../data/portfolio';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

export function PortfolioCard({ item, currentLang }: { item: PortfolioSummary; currentLang: string }) {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="portfolio-card" onClick={() => navigate(`/${currentLang}/portofolio/${item.id}`)}>
      <div className="portfolio-card-image">
        <img
          src={getImageUrl(item.thumbnail)}
          alt={item.title}
          loading="lazy"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
        />
      </div>
      <div className="portfolio-card-content">
        <h3 className="portfolio-card-title">{item.title}</h3>
        <div className="portfolio-card-badges">
          {item.industry && <Badge variant="outline">{item.industry.name}</Badge>}
          {item.serviceType && <Badge variant="outline">{item.serviceType.name}</Badge>}
        </div>
        <p className="portfolio-card-solution">{item.productSolution}</p>
        <div className="portfolio-card-meta">
          <span className="portfolio-card-meta-item"><MapPin size={13} /> {item.location}</span>
          <span className="portfolio-card-meta-item"><Calendar size={13} /> {item.completionDate}</span>
        </div>
        <Button variant="outline" className="portfolio-card-btn">
          {t('portfolio.page.viewDetail')} <ArrowRight size={14} />
        </Button>
      </div>
    </div>
  );
}

function PortfolioCardSkeleton() {
  return (
    <div className="portfolio-card">
      <Skeleton className="portfolio-card-image" />
      <div className="portfolio-card-content">
        <Skeleton className="h-5 w-3/4" />
        <div className="flex gap-2">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-5 w-20" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}

export function Portfolio() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const [searchInput, setSearchInput] = useState(searchParams.get('search') ?? '');
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') ?? '');
  const [industry, setIndustry] = useState(searchParams.get('industry') ?? '');
  const [service, setService] = useState(searchParams.get('service') ?? '');
  const [page, setPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const handle = setTimeout(() => {
      setSearchTerm(searchInput);
      setPage(1);
    }, 350);
    return () => clearTimeout(handle);
  }, [searchInput]);

  useEffect(() => {
    const params: Record<string, string> = {};
    if (industry) params.industry = industry;
    if (service) params.service = service;
    if (searchTerm) params.search = searchTerm;
    if (page > 1) params.page = String(page);
    setSearchParams(params, { replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [industry, service, searchTerm, page]);

  const { industries, localize: localizeIndustry } = useIndustries(currentLang);
  const { serviceTypes, localize: localizeService } = useServiceTypes(currentLang);
  const { portfolios, pagination, isLoading } = usePortfolioCatalog(currentLang, {
    industry: industry || undefined,
    service: service || undefined,
    search: searchTerm || undefined,
    page,
  });

  return (
    <div className="portfolio-corporate">
      <Helmet>
        <title>{t('portfolio.page.title')} | PT Surya Inti Gas</title>
        <meta name="description" content={t('portfolio.page.subtitle')} />
        <meta property="og:title" content={`${t('portfolio.page.title')} | PT Surya Inti Gas`} />
        <meta property="og:description" content={t('portfolio.page.subtitle')} />
        <meta property="og:type" content="website" />
        <link rel="canonical" href={`https://suryaintigas.com/${currentLang}/portofolio`} />
      </Helmet>

      <PageHero
        title={t('portfolio.page.title')}
        subtitle={t('portfolio.page.subtitle')}
        backgroundImage="/images/office/wp.jpg"
        breadcrumbs={[
          // { label: t('header.home'), href: `/${currentLang}` },
          // { label: t('portfolio.page.title') },
        ]}
      />

      <div className="portfolio-container">
        <div className="portfolio-toolbar">
          <div className="portfolio-search-wrap">
            <Search size={16} className="portfolio-search-icon" />
            <input
              type="text"
              className="portfolio-search-input"
              placeholder={t('portfolio.page.searchPlaceholder')}
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              aria-label={t('portfolio.page.searchPlaceholder')}
            />
          </div>

          <div className="portfolio-select-group">
            <Select value={industry || 'all'} onValueChange={(v) => { setIndustry(v === 'all' ? '' : v); setPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('portfolio.page.allIndustries')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('portfolio.page.allIndustries')}</SelectItem>
                {industries.map((ind) => (
                  <SelectItem key={ind.id} value={ind.slug}>{localizeIndustry(ind)}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={service || 'all'} onValueChange={(v) => { setService(v === 'all' ? '' : v); setPage(1); }}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder={t('portfolio.page.allServices')} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{t('portfolio.page.allServices')}</SelectItem>
                {serviceTypes.map((s) => (
                  <SelectItem key={s.id} value={s.slug}>{localizeService(s)}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {isLoading ? (
          <div className="portfolio-grid">
            {Array.from({ length: 6 }).map((_, i) => <PortfolioCardSkeleton key={i} />)}
          </div>
        ) : portfolios.length === 0 ? (
          <div className="portfolio-empty-state">
            <FolderOpen size={40} strokeWidth={1.5} />
            <p>{t('portfolio.page.noResults')}</p>
          </div>
        ) : (
          <div className="portfolio-grid">
            {portfolios.map((item) => (
              <PortfolioCard key={item.id} item={item} currentLang={currentLang} />
            ))}
          </div>
        )}

        {pagination.lastPage > 1 && (
          <div className="portfolio-pagination-wrap">
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page > 1) setPage(page - 1); }}
                    aria-disabled={page <= 1}
                  />
                </PaginationItem>
                {Array.from({ length: pagination.lastPage }, (_, i) => i + 1).map((p) => (
                  <PaginationItem key={p}>
                    <PaginationLink
                      href="#"
                      isActive={p === pagination.currentPage}
                      onClick={(e) => { e.preventDefault(); setPage(p); }}
                    >
                      {p}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => { e.preventDefault(); if (page < pagination.lastPage) setPage(page + 1); }}
                    aria-disabled={page >= pagination.lastPage}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
        
      <div className="portfolio-cta">
        <h2 className="portfolio-cta-title">{t('portfolio.cta.title')}</h2>
        <p className="portfolio-cta-subtitle">{t('portfolio.cta.subtitle')}</p>
        <a href={`/${currentLang}/kontak`} className="portfolio-cta-btn">
          {t('portfolio.cta.contactButton')}
        </a>
      </div>
    </div>
  );
}

export default Portfolio;
