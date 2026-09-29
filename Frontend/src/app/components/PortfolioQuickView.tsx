import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import * as DialogPrimitive from '@radix-ui/react-dialog';
import useEmblaCarousel from 'embla-carousel-react';
import { ArrowRight, ChevronLeft, ChevronRight, ImageOff, X } from 'lucide-react';
import { usePortfolioDetail } from '../../hooks/usePortfolioDetail';
import type { PortfolioGalleryImage, PortfolioSummary } from '../../data/portfolio';
import { getImageUrl, IMAGE_PLACEHOLDER } from '../../utils/imageUrl';

/**
 * Mobile/tablet quick view for a portfolio card: a centered photo viewer over a dimmed,
 * blurred backdrop so the project photos get full attention. The summary list has no
 * gallery, so the detail is fetched only while the viewer is open.
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
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="portfolio-quickview-overlay" />
        <DialogPrimitive.Content
          className="portfolio-quickview"
          onOpenAutoFocus={(e) => e.preventDefault()}
        >
          {item && (
            <>
              <DialogPrimitive.Close
                className="portfolio-quickview-close"
                aria-label={t('portfolio.quickView.close', 'Tutup')}
              >
                <X size={22} strokeWidth={2.5} />
              </DialogPrimitive.Close>

              {isLoading ? (
                <div className="portfolio-quickview-stage portfolio-quickview-loading">
                  <span className="portfolio-quickview-spinner" aria-hidden="true" />
                </div>
              ) : (
                <GallerySlider key={item.id} images={gallery} fallbackAlt={item.title} />
              )}

              <div className="portfolio-quickview-info">
                <DialogPrimitive.Title className="portfolio-quickview-title">{item.title}</DialogPrimitive.Title>
                <DialogPrimitive.Description className="sr-only">
                  {t('portfolio.quickView.description', 'Galeri foto proyek')}
                </DialogPrimitive.Description>
                {(item.industry || item.serviceType) && (
                  <div className="portfolio-quickview-tags">
                    {item.industry && <span>{item.industry.name}</span>}
                    {item.serviceType && <span>{item.serviceType.name}</span>}
                  </div>
                )}
                {!isLoading && !hasGallery && (
                  <p className="portfolio-quickview-empty">
                    <ImageOff size={14} /> {t('portfolio.quickView.noGallery', 'Belum ada foto galeri untuk proyek ini.')}
                  </p>
                )}
              </div>

              <Link
                to={`/${currentLang}/portofolio/${item.id}`}
                className="portfolio-quickview-cta"
                onClick={() => onOpenChange(false)}
              >
                {t('portfolio.quickView.viewFullDetail', 'Lihat Detail Proyek')} <ArrowRight size={16} />
              </Link>
            </>
          )}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
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

  // Arrow keys flip photos (useful on tablets with a keyboard).
  useEffect(() => {
    if (!emblaApi) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') emblaApi.scrollPrev();
      if (e.key === 'ArrowRight') emblaApi.scrollNext();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [emblaApi]);

  // Keep the active thumbnail visible in the (scrollable) thumbnail strip.
  const thumbsRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const strip = thumbsRef.current;
    const thumb = strip?.children[selected] as HTMLElement | undefined;
    if (!strip || !thumb) return;
    strip.scrollTo({ left: thumb.offsetLeft - (strip.clientWidth - thumb.offsetWidth) / 2, behavior: 'smooth' });
  }, [selected]);

  const multiple = images.length > 1;
  const caption = images[selected]?.caption;

  return (
    <div className="portfolio-quickview-gallery">
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
              <ChevronLeft size={22} />
            </button>
            <button
              type="button"
              className="portfolio-quickview-arrow portfolio-quickview-arrow-next"
              onClick={() => emblaApi?.scrollNext()}
              aria-label={t('portfolio.page.next', 'Berikutnya')}
            >
              <ChevronRight size={22} />
            </button>
          </>
        )}
      </div>

      {caption && <p className="portfolio-quickview-caption">{caption}</p>}

      {multiple && (
        <div className="portfolio-quickview-thumbs" ref={thumbsRef}>
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
