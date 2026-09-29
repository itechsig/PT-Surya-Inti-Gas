import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import { Drawer, DrawerClose, DrawerContent, DrawerDescription, DrawerTitle } from './ui/drawer';
import { Badge } from './ui/badge';
import { Skeleton } from './ui/skeleton';
import { usePortfolioDetail } from '../../hooks/usePortfolioDetail';
import type { PortfolioGalleryImage, PortfolioSummary } from '../../data/portfolio';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

/**
 * Mobile/tablet quick view for a portfolio card: a bottom sheet with a swipeable
 * slider of the project's gallery. The summary list has no gallery, so the detail
 * is fetched only while the sheet is open.
 */
export function PortfolioQuickView({
  item,
  open,
  onOpenChange,
  currentLang,
}: {
  item: PortfolioSummary | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentLang: string;
}) {
  const { t } = useTranslation();
  const { data: detail, isLoading } = usePortfolioDetail(open && item ? item.id : null, currentLang);

  const gallery: PortfolioGalleryImage[] = detail?.gallery.length
    ? detail.gallery
    : item
      ? [{ image: item.thumbnail, caption: null }]
      : [];
  const hasGallery = Boolean(detail?.gallery.length);

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="portfolio-quickview mx-auto w-full max-w-2xl data-[vaul-drawer-direction=bottom]:max-h-[92vh]">
        {item && (
          <div className="portfolio-quickview-body">
            <div className="portfolio-quickview-header">
              <div className="min-w-0">
                <DrawerTitle className="portfolio-quickview-title">{item.title}</DrawerTitle>
                <DrawerDescription className="sr-only">
                  {t('portfolio.quickView.description', 'Galeri foto proyek')}
                </DrawerDescription>
                <div className="portfolio-card-badges">
                  {item.industry && <Badge variant="outline">{item.industry.name}</Badge>}
                  {item.serviceType && <Badge variant="outline">{item.serviceType.name}</Badge>}
                </div>
              </div>
              <DrawerClose className="portfolio-quickview-close" aria-label={t('portfolio.quickView.close', 'Tutup')}>
                <X size={18} />
              </DrawerClose>
            </div>

            {isLoading ? (
              <Skeleton className="portfolio-quickview-skeleton" />
            ) : (
              <GallerySlider key={item.id} images={gallery} fallbackAlt={item.title} />
            )}

            {!isLoading && !hasGallery && (
              <p className="portfolio-quickview-empty">
                <ImageOff size={14} /> {t('portfolio.quickView.noGallery', 'Belum ada foto galeri untuk proyek ini.')}
              </p>
            )}

            <Link
              to={`/${currentLang}/portofolio/${item.id}`}
              className="portfolio-quickview-cta"
              onClick={() => onOpenChange(false)}
            >
              {t('portfolio.quickView.viewFullDetail', 'Lihat Detail Proyek')} <ArrowRight size={16} />
            </Link>
          </div>
        )}
      </DrawerContent>
    </Drawer>
  );
}

function GallerySlider({ images, fallbackAlt }: { images: PortfolioGalleryImage[]; fallbackAlt: string }) {
  const { t } = useTranslation();
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: images.length > 1 });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect();
    emblaApi.on('select', onSelect);
    emblaApi.on('reInit', onSelect);
    return () => {
      emblaApi.off('select', onSelect);
      emblaApi.off('reInit', onSelect);
    };
  }, [emblaApi, onSelect]);

  const multiple = images.length > 1;
  const caption = images[selected]?.caption;

  return (
    // data-vaul-no-drag: horizontal swipes belong to the slider, not the sheet.
    <div className="portfolio-quickview-gallery" data-vaul-no-drag>
      <div className="portfolio-quickview-stage">
        <div className="portfolio-quickview-viewport" ref={emblaRef}>
          <div className="portfolio-quickview-track">
            {images.map((img, i) => (
              <div className="portfolio-quickview-slide" key={`${img.image}-${i}`}>
                <img
                  src={getImageUrl(img.image)}
                  alt={img.caption || fallbackAlt}
                  loading={i === 0 ? 'eager' : 'lazy'}
                  draggable={false}
                  onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
                />
              </div>
            ))}
          </div>
        </div>

        {multiple && (
          <>
            <span className="portfolio-quickview-counter" aria-live="polite">
              {selected + 1} / {images.length}
            </span>
            <button
              type="button"
              className="portfolio-quickview-arrow portfolio-quickview-arrow-prev"
              onClick={() => emblaApi?.scrollPrev()}
              aria-label={t('portfolio.page.prev', 'Sebelumnya')}
            >
              <ChevronLeft size={20} />
            </button>
            <button
              type="button"
              className="portfolio-quickview-arrow portfolio-quickview-arrow-next"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t('portfolio.page.next', 'Berikutnya')}
            >
              <ChevronRight size={20} />
            </button>
          </>
        )}
      </div>

      {caption && <p className="portfolio-quickview-caption">{caption}</p>}

      {multiple && (
        <div className="portfolio-quickview-thumbs">
          {images.map((img, i) => (
            <button
              type="button"
              key={`${img.image}-thumb-${i}`}
              className={`portfolio-quickview-thumb${i === selected ? ' is-active' : ''}`}
              onClick={() => emblaApi?.scrollTo(i)}
              aria-label={`${t('portfolio.quickView.photo', 'Foto')} ${i + 1}`}
              aria-current={i === selected}
            >
              <img
                src={getImageUrl(img.image)}
                alt=""
                loading="lazy"
                draggable={false}
                onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = IMAGE_PLACEHOLDER; }}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export default PortfolioQuickView;
