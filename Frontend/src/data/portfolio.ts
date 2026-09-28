export interface PortfolioTaxonomyRef {
  slug: string;
  name: string;
}

export interface PortfolioGalleryImage {
  image: string;
  caption: string | null;
}

export interface PortfolioSummary {
  id: string; // slug
  title: string;
  industry: PortfolioTaxonomyRef | null;
  serviceType: PortfolioTaxonomyRef | null;
  thumbnail: string;
  isFeatured: boolean;
}

export interface PortfolioDetail extends PortfolioSummary {
  summary: string;
  gallery: PortfolioGalleryImage[];
}

export interface PortfolioPagination {
  currentPage: number;
  lastPage: number;
  total: number;
  perPage: number;
}
