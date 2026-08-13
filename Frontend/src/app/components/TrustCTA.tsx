import { useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useParams } from "react-router-dom";
import { motion, type PanInfo, type Variants } from "motion/react";
import { ArrowRight, ChevronLeft, ChevronRight, Quote, Star } from "lucide-react";
// import { getImageUrl } from "../../utils/imageUrl";

/* ═══════════════════════════════════════════════════════════════
   TRUST CTA.TSX — PT Surya Inti Gas Corporate
   Social-proof stack: rotating "drum" testimonials → verified
   achievement stats → a single decisive call to action. Everything
   builds toward the button at the bottom.
══════════════════════════════════════════════════════════════ */

const AUTOPLAY_MS = 5000;
const SWIPE_THRESHOLD = 60;
const ANGLE_STEP = 16; // degrees each step — gentle curve, not a tight tube

interface TestimonialItem {
  quote: string;
  name: string;
  role: string;
  company: string;
  rating: number;
}

const css = `
  /* ── Corporate Variables ── */
  .trust-cta-corporate {
    --navy-dark: #0f172a;
    --navy: #1e293b;
    --blue-dark: #1e3a8a;
    --blue: #1e40af;
    --sky: #3b82f6;
    --sky-light: #60a5fa;
    --gold: #f59e0b;
    --white: #ffffff;
    --slate-200: #e2e8f0;
    --slate-300: #cbd5e1;
    --slate-600: #475569;
    --slate-700: #334155;
    --slate-800: #1e293b;

    --ease: cubic-bezier(0.4, 0, 0.2, 1);
    --ff-display: 'Barlow', system-ui, sans-serif;
    --ff-body: 'DM Sans', system-ui, sans-serif;

    font-family: var(--ff-body);
  }

  /* ── Corporate Section ── */
  .trust-cta-section {
    position: relative;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
    padding: 110px 6vw;
    overflow-x: hidden;
  }

  .trust-cta-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  /* ── Header ── */
  .trust-cta-header {
    text-align: center;
    margin-bottom: 56px;
  }

  .trust-cta-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 24px;
    border-radius: 50px;
    background: rgba(96, 165, 250, 0.12);
    border: 1px solid rgba(96, 165, 250, 0.3);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--sky-light);
    margin-bottom: 22px;
  }

  .trust-cta-title {
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 16px;
  }

  .trust-cta-subtitle {
    font-family: var(--ff-body);
    font-size: clamp(0.9375rem, 1.3vw, 1.0625rem);
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.65);
    max-width: 600px;
    margin: 0 auto;
  }

  /* ── Drum Stage ── */
  .trust-stage {
    position: relative;
    height: 340px;
    perspective: 1400px;
  }

  .trust-card {
    position: absolute;
    inset: 0;
    margin: auto;
    width: clamp(260px, 24vw, 380px);
    height: 300px;
    background: var(--white);
    border-radius: 20px;
    padding: 28px 24px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    will-change: transform, opacity;
  }

  .trust-card.is-active {
    cursor: grab;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(96, 165, 250, 0.25);
  }

  .trust-card.is-active:active {
    cursor: grabbing;
  }

  .trust-card.is-side {
    cursor: pointer;
  }

  .trust-avatar {
    flex-shrink: 0;
    width: 62px;
    height: 62px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--blue) 0%, var(--sky-light) 100%);
    color: var(--white);
    font-family: var(--ff-display);
    font-size: 1.05rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    box-shadow: 0 6px 16px rgba(30, 64, 175, 0.28);
    margin-bottom: 12px;
    pointer-events: none;
    overflow: hidden;
  }

  .trust-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .trust-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 14px;
    pointer-events: none;
  }

  .trust-stars svg {
    color: var(--slate-300);
    fill: var(--slate-300);
  }

  .trust-stars svg.filled {
    color: var(--gold);
    fill: var(--gold);
  }

  .trust-quote-icon {
    color: var(--sky-light);
    opacity: 0.4;
    margin-bottom: 6px;
    pointer-events: none;
  }

  .trust-quote {
    font-family: var(--ff-body);
    font-size: 0.9375rem;
    line-height: 1.55;
    font-weight: 500;
    color: var(--slate-800);
    margin: 0 0 auto;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
    pointer-events: none;
  }

  .trust-name {
    font-family: var(--ff-display);
    font-size: 0.9375rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin-top: 14px;
    pointer-events: none;
  }

  .trust-role {
    font-family: var(--ff-body);
    font-size: 0.8125rem;
    color: var(--slate-600);
    pointer-events: none;
  }

  /* ── Controls ── */
  .trust-controls {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    margin-top: 24px;
  }

  .trust-nav-btn {
    flex-shrink: 0;
    width: 44px;
    height: 44px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.08);
    border: 2px solid rgba(255, 255, 255, 0.18);
    color: var(--white);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.3s var(--ease);
  }

  .trust-nav-btn:hover {
    background: var(--sky);
    border-color: var(--sky);
    transform: scale(1.08);
  }

  .trust-dots {
    display: flex;
    align-items: center;
    gap: 9px;
  }

  .trust-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    border: none;
    padding: 0;
    cursor: pointer;
    transition: all 0.3s var(--ease);
  }

  .trust-dot:hover {
    background: var(--sky-light);
  }

  .trust-dot.active {
    width: 24px;
    border-radius: 5px;
    background: var(--sky-light);
  }

  /* ── Stats Strip ── */
  .trust-stats-row {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    gap: 0;
    margin: 72px auto 0;
    max-width: 880px;
    padding-top: 48px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .trust-stat {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 4px;
    padding: 0 32px;
  }

  .trust-stat-value {
    font-family: var(--ff-display);
    font-size: clamp(1.75rem, 3vw, 2.25rem);
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.01em;
  }

  .trust-stat-value .suffix {
    color: var(--sky-light);
  }

  .trust-stat-label {
    font-family: var(--ff-body);
    font-size: 0.8125rem;
    color: rgba(255, 255, 255, 0.6);
    text-align: center;
  }

  .trust-stat-divider {
    width: 1px;
    height: 44px;
    background: rgba(255, 255, 255, 0.14);
  }

  /* ── CTA Block ── */
  .trust-cta-block {
    text-align: center;
    max-width: 720px;
    margin: 56px auto 0;
  }

  .trust-cta-block h3 {
    font-family: var(--ff-display);
    font-size: clamp(1.5rem, 3vw, 2.125rem);
    font-weight: 700;
    color: var(--white);
    margin: 0 0 18px;
    letter-spacing: -0.01em;
    line-height: 1.25;
  }

  .trust-cta-block p {
    font-family: var(--ff-body);
    font-size: clamp(0.9375rem, 1.4vw, 1.0625rem);
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.68);
    margin: 0 0 32px;
  }

  .trust-cta-button {
    display: inline-flex;
    align-items: center;
    gap: 12px;
    padding: 17px 40px;
    background: linear-gradient(135deg, var(--blue) 0%, var(--sky) 100%);
    color: var(--white) !important;
    border-radius: 50px;
    font-family: var(--ff-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border: none;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    text-decoration: none;
    box-shadow: 0 12px 32px rgba(59, 130, 246, 0.4);
  }

  .trust-cta-button svg {
    color: var(--white) !important;
  }

  .trust-cta-button:hover {
    transform: translateY(-3px);
    box-shadow: 0 18px 44px rgba(59, 130, 246, 0.55);
    background: linear-gradient(135deg, var(--sky) 0%, var(--sky-light) 100%);
  }

  /* ── Responsive Design ── */
  @media (max-width: 900px) {
    .trust-stage {
      height: 300px;
    }

    .trust-card {
      width: clamp(240px, 58vw, 300px);
      height: 280px;
      padding: 24px 20px;
    }

    .trust-stats-row {
      margin-top: 56px;
      padding-top: 36px;
    }
  }

  @media (max-width: 640px) {
    .trust-cta-section {
      padding: 72px 5vw;
    }

    .trust-cta-header {
      margin-bottom: 36px;
    }

    .trust-stage {
      height: 280px;
    }

    .trust-card {
      width: clamp(220px, 74vw, 280px);
      height: 270px;
      padding: 22px 18px;
    }

    .trust-controls {
      gap: 14px;
    }

    .trust-nav-btn {
      width: 38px;
      height: 38px;
    }

    .trust-stats-row {
      gap: 24px 0;
      margin-top: 44px;
      padding-top: 28px;
    }

    .trust-stat {
      padding: 0 18px;
      flex: 0 0 40%;
    }

    .trust-stat-divider {
      display: none;
    }

    .trust-cta-block {
      margin-top: 44px;
    }
  }
`;

/* ── Motion variants ── */
const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

/** Photo per testimonial, keyed by name (names are unchanged across id/en/zh locales). */
// const AVATAR_BY_NAME: Record<string, string> = {
//   Fauzan: "/images/testimoni/profil1.jpe",
//   Misse: "/images/testimoni/profil2.jpe",
//   Esty: "/images/testimoni/profil2.jpe",
//   Ayu: "/images/testimoni/profil2.jpe",
//   Rendy: "/images/testimoni/profil1.jpe",
//   Zafi: "/images/testimoni/profil1.jpe",
//   Tasya: "/images/testimoni/profil2.jpe",
//   Hengky: "/images/testimoni/profil1.jpe",
// };

/** Turns "dr. Siti Rahmawati" into "SR" for the avatar badge. */
function getInitials(name: string) {
  const cleaned = name.replace(/^(bpk\.|ibu|dr\.|mr\.|mrs\.|ms\.)\s*/i, "");
  return cleaned
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((word) => word[0])
    .join("")
    .toUpperCase();
}

/** Shortest signed distance from activeIndex to index around the circular drum. */
function circularOffset(index: number, activeIndex: number, total: number) {
  let offset = index - activeIndex;
  const half = total / 2;
  if (offset > half) offset -= total;
  if (offset < -half) offset += total;
  return offset;
}

/** Places a card on the rotating drum: further-out cards curve back, shrink, and fade. */
function getDrumTransform(offset: number, radius: number) {
  const angle = offset * ANGLE_STEP;
  const rad = (angle * Math.PI) / 180;
  const x = Math.sin(rad) * radius;
  const z = (Math.cos(rad) - 1) * radius;
  const abs = Math.abs(offset);
  const scale = Math.max(0.66, 1 - abs * 0.11);
  const opacity = Math.max(0, 1 - abs * 0.3);
  const zIndex = Math.round(50 - abs * 5);
  return { x, z, rotateY: -angle, scale, opacity, zIndex };
}

export function TrustCTA() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "id";

  const items = t("testimonials.items", { returnObjects: true }) as TestimonialItem[];
  const total = items.length;
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [radius, setRadius] = useState(230);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = stageRef.current;
    if (!node) return;
    const observer = new ResizeObserver(([entry]) => {
      setRadius(Math.min(560, Math.max(120, entry.contentRect.width * 0.4)));
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const goTo = useCallback(
    (index: number) => {
      setActiveIndex(((index % total) + total) % total);
    },
    [total]
  );

  const goNext = useCallback(() => goTo(activeIndex + 1), [activeIndex, goTo]);
  const goPrev = useCallback(() => goTo(activeIndex - 1), [activeIndex, goTo]);

  /* Autoplay: increments functionally, so pausing/resuming never desyncs the timer. */
  useEffect(() => {
    if (isPaused || total <= 1) return;
    const id = setInterval(() => {
      setActiveIndex((i) => (i + 1) % total);
    }, AUTOPLAY_MS);
    return () => clearInterval(id);
  }, [isPaused, total]);

  const handleDragEnd = (_e: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    setIsPaused(false);
    if (info.offset.x < -SWIPE_THRESHOLD) goNext();
    else if (info.offset.x > SWIPE_THRESHOLD) goPrev();
  };

  if (total === 0) return null;

  return (
    <div className="trust-cta-corporate">
      <style>{css}</style>

      <section
        className="trust-cta-section"
        id="testimonials"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div className="trust-cta-container">

          {/* Header */}
          <motion.div
            className="trust-cta-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.h2 className="trust-cta-title" variants={fadeUp}>
              {t("testimonials.title")}
            </motion.h2>
            <motion.p className="trust-cta-subtitle" variants={fadeUp}>
              {t("testimonials.subtitle")}
            </motion.p>
          </motion.div>

          {/* Rotating Drum Stage */}
          <motion.div
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={fadeUp}
          >
            <div className="trust-stage" ref={stageRef}>
              {items.map((item, index) => {
                const offset = circularOffset(index, activeIndex, total);
                const isActive = offset === 0;
                const t3d = getDrumTransform(offset, radius);

                return (
                  <motion.article
                    key={index}
                    className={`trust-card ${isActive ? "is-active" : "is-side"}`}
                    style={{ zIndex: t3d.zIndex }}
                    animate={{
                      x: t3d.x,
                      z: t3d.z,
                      rotateY: t3d.rotateY,
                      scale: t3d.scale,
                      opacity: t3d.opacity,
                    }}
                    transition={{ duration: 0.55, ease: [0.4, 0, 0.2, 1] }}
                    drag={isActive ? "x" : false}
                    dragConstraints={{ left: 0, right: 0 }}
                    dragElastic={0.5}
                    onDragStart={() => setIsPaused(true)}
                    onDragEnd={isActive ? handleDragEnd : undefined}
                    onClick={!isActive ? () => goTo(index) : undefined}
                    aria-hidden={Math.abs(offset) > 2}
                  >
                    {/* <div className="trust-avatar" aria-hidden="true">
                      {AVATAR_BY_NAME[item.name] ? (
                        <img src={getImageUrl(AVATAR_BY_NAME[item.name])} alt="" loading="lazy" />
                      ) : (
                        getInitials(item.name)
                      )}
                    </div> */}
                    <div className="trust-stars" role="img" aria-label={`${item.rating} / 5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} size={13} className={i < item.rating ? "filled" : ""} />
                      ))}
                    </div>
                    <Quote className="trust-quote-icon" size={20} aria-hidden="true" />
                    <p className="trust-quote">&ldquo;{item.quote}&rdquo;</p>
                    <div className="trust-name">{item.name}</div>
                    <div className="trust-role">
                      {item.role} &middot; {item.company}
                    </div>
                  </motion.article>
                );
              })}
            </div>

            {/* Controls */}
            <div className="trust-controls">
              <button
                type="button"
                className="trust-nav-btn"
                onClick={goPrev}
                aria-label={t("hero.previousSlide")}
              >
                <ChevronLeft size={18} />
              </button>

              <div className="trust-dots" role="tablist" aria-label={t("testimonials.title")}>
                {items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    role="tab"
                    aria-selected={index === activeIndex}
                    aria-label={t("hero.goToSlide", { number: index + 1 })}
                    className={`trust-dot ${index === activeIndex ? "active" : ""}`}
                    onClick={() => goTo(index)}
                  />
                ))}
              </div>

              <button
                type="button"
                className="trust-nav-btn"
                onClick={goNext}
                aria-label={t("hero.nextSlide")}
              >
                <ChevronRight size={18} />
              </button>
            </div>
          </motion.div>

          {/* Closing CTA */}
          <motion.div
            className="trust-cta-block"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-80px" }}
            variants={staggerContainer}
          >
            <motion.a
              href={`/${currentLang}/kontak`}
              className="trust-cta-button"
              variants={fadeUp}
            >
              {t("whyChooseUs.cta")}
              <ArrowRight size={16} />
            </motion.a>
          </motion.div>

        </div>
      </section>
    </div>
  );
}
