import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type PointerEvent as ReactPointerEvent,
} from "react";
import { createPortal } from "react-dom";
import { useTranslation } from "react-i18next";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useSpring,
  type PanInfo,
  type Variants,
} from "motion/react";
import { ChevronLeft, ChevronRight, Pause, Play, Quote, Star, X } from "lucide-react";
import { getImageUrl } from "../../utils/imageUrl";

/* ═══════════════════════════════════════════════════════════════
   TRUST CTA.TSX — PT Surya Inti Gas Corporate
   Social-proof stack: rotating "drum" testimonials → verified
   achievement stats.
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
    --blue-dark: var(--brand-navy, #0C2D5E);
    --blue: var(--brand-blue, #1565C0);
    --sky: var(--brand-blue, #1565C0);
    --sky-light: #7fb5ee;
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




  @keyframes trust-badge-pulse {
    0% { box-shadow: 0 0 0 0 rgba(127, 181, 238, 0.55); }
    70% { box-shadow: 0 0 0 9px rgba(127, 181, 238, 0); }
    100% { box-shadow: 0 0 0 0 rgba(127, 181, 238, 0); }
  }

  .trust-cta-title {
    position: relative;
    display: inline-block;
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 3rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 16px;
    cursor: default;
    background-image: linear-gradient(
      100deg,
      var(--white) 0%,
      var(--white) 42%,
      var(--sky-light) 50%,
      var(--white) 58%,
      var(--white) 100%
    );
    background-size: 220% 100%;
    background-position: 100% 0;
    background-repeat: no-repeat;
    -webkit-background-clip: text;
    background-clip: text;
    transition: background-position 0.9s var(--ease);
  }

  .trust-cta-title:hover,
  .trust-cta-title:focus-visible,
  .trust-cta-title:active {
    background-position: 0 0;
    -webkit-text-fill-color: transparent;
  }

  .trust-cta-title::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 0;
    height: 3px;
    border-radius: 2px;
    background: linear-gradient(90deg, transparent, var(--sky-light), transparent);
    transform: translateX(-50%);
    transition: width 0.45s var(--ease);
  }

  .trust-cta-title:hover::after,
  .trust-cta-title:focus-visible::after,
  .trust-cta-title:active::after {
    width: min(160px, 45%);
  }

  @media (prefers-reduced-motion: reduce) {
    .trust-cta-title,
    .trust-cta-title::after { transition: none; }
    .trust-quote-icon { animation: none; }
    .trust-card.is-active::before { display: none; }
    .trust-card.is-active:hover .trust-avatar,
    .trust-card.is-active:hover .trust-avatar img {
      transition: none;
      transform: none;
      box-shadow: 0 10px 24px rgba(30, 64, 175, 0.3), 0 0 0 4px rgba(96, 165, 250, 0.18);
    }
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
    height: 380px;
    perspective: 1400px;
  }

  .trust-card {
    position: absolute;
    inset: 0;
    margin: auto;
    width: clamp(260px, 24vw, 380px);
    height: 360px;
    background: var(--white);
    border-radius: 20px;
    padding: 26px 24px;
    box-shadow: 0 30px 70px rgba(0, 0, 0, 0.4);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    transition: box-shadow 0.45s var(--ease);
  }

  /* Holds the card content; carries the pointer-tracking 3D tilt on the active card. */
  .trust-card-inner {
    flex: 1;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .trust-card.is-active {
    cursor: grab;
    overflow: hidden;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(96, 165, 250, 0.25);
  }

  /* Gloss sweep across the active card on hover */
  .trust-card.is-active::before {
    content: "";
    position: absolute;
    top: 0;
    left: -80%;
    width: 55%;
    height: 100%;
    background: linear-gradient(
      115deg,
      transparent 0%,
      rgba(255, 255, 255, 0.55) 50%,
      transparent 100%
    );
    transform: skewX(-16deg);
    opacity: 0;
    pointer-events: none;
    z-index: 2;
  }

  @keyframes trust-card-shine {
    0% { left: -80%; opacity: 0; }
    12% { opacity: 1; }
    100% { left: 135%; opacity: 0; }
  }

  .trust-card.is-active:active {
    cursor: grabbing;
  }

  .trust-card.is-side {
    cursor: pointer;
  }

  /* Hover flourishes only where a real pointer can hover — never sticky on touch. */
  @media (hover: hover) and (pointer: fine) {
    .trust-card.is-active:hover {
      box-shadow: 0 42px 90px rgba(0, 0, 0, 0.55), 0 0 0 1px rgba(96, 165, 250, 0.5),
        0 0 40px rgba(96, 165, 250, 0.25);
    }

    .trust-card.is-active:hover::before {
      animation: trust-card-shine 0.9s var(--ease);
    }

    .trust-card.is-active:hover .trust-avatar {
      transform: scale(1.05);
      box-shadow: 0 14px 30px rgba(30, 64, 175, 0.38), 0 0 0 5px rgba(96, 165, 250, 0.3);
    }

    .trust-card.is-active:hover .trust-avatar img {
      transform: scale(1.06);
    }
  }

  .trust-avatar {
    flex-shrink: 0;
    width: 92px;
    height: 92px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(135deg, var(--blue) 0%, var(--sky-light) 100%);
    color: var(--white);
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 700;
    letter-spacing: 0.02em;
    border: 3px solid var(--white);
    box-shadow: 0 10px 24px rgba(30, 64, 175, 0.3), 0 0 0 4px rgba(96, 165, 250, 0.18);
    margin-bottom: 14px;
    pointer-events: none;
    overflow: hidden;
    transition: transform 0.45s var(--ease), box-shadow 0.45s var(--ease);
  }

  .trust-avatar img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    object-position: center 30%;
    transition: transform 0.6s var(--ease);
  }

  .trust-stars {
    display: flex;
    gap: 2px;
    margin-bottom: 10px;
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

  /* Partial star: a clipped gold star layered over the grey one. */
  .trust-star-part {
    position: relative;
    display: inline-flex;
    flex-shrink: 0;
  }

  .trust-star-part-fill {
    position: absolute;
    inset: 0;
    display: inline-flex;
    overflow: hidden;
  }

  .trust-star-part svg {
    flex-shrink: 0;
  }

  .trust-quote-icon {
    color: var(--sky-light);
    opacity: 0.4;
    margin-bottom: 4px;
    pointer-events: none;
    animation: trust-quote-bob 3.6s var(--ease) infinite;
  }

  @keyframes trust-quote-bob {
    0%, 100% { transform: translateY(0); }
    50% { transform: translateY(-4px); }
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
    font-size: 1rem;
    font-weight: 700;
    color: var(--navy-dark);
    margin-top: 12px;
    pointer-events: none;
  }

  .trust-role {
    font-family: var(--ff-body);
    font-size: 0.8125rem;
    color: var(--slate-600);
    pointer-events: none;
  }

  .trust-quote-more {
    align-self: center;
    margin-top: 8px;
    padding: 4px 10px;
    border: none;
    border-radius: 8px;
    background: transparent;
    font-family: var(--ff-body);
    font-size: 0.8125rem;
    font-weight: 600;
    color: var(--blue);
    cursor: pointer;
    transition: background 0.2s var(--ease);
  }

  .trust-quote-more:hover {
    background: rgba(30, 64, 175, 0.08);
    text-decoration: underline;
  }

  .trust-quote-more:focus-visible {
    outline: 3px solid var(--sky);
    outline-offset: 2px;
  }

  /* ── Full-quote Dialog ── */
  .trust-quote-backdrop {
    position: fixed;
    inset: 0;
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
    background: rgba(15, 23, 42, 0.55);
    backdrop-filter: blur(4px);
    -webkit-backdrop-filter: blur(4px);
  }

  .trust-quote-dialog {
    position: relative;
    width: min(520px, 100%);
    max-height: 85vh;
    overflow-y: auto;
    background: var(--white);
    border-radius: 20px;
    padding: 40px 36px 32px;
    box-shadow: 0 24px 60px rgba(15, 23, 42, 0.3);
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    font-family: var(--ff-body);
  }

  .trust-quote-dialog .trust-stars {
    justify-content: center;
  }

  .trust-quote-dialog .trust-avatar,
  .trust-quote-dialog .trust-stars,
  .trust-quote-dialog .trust-quote-icon {
    pointer-events: none;
  }

  .trust-quote-dialog-quote {
    font-family: var(--ff-body);
    font-size: 1rem;
    line-height: 1.65;
    font-weight: 500;
    color: var(--slate-800);
    margin: 0 0 18px;
    white-space: pre-line;
  }

  .trust-quote-close {
    position: absolute;
    top: 14px;
    right: 14px;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 36px;
    height: 36px;
    border: none;
    border-radius: 50%;
    background: var(--slate-200);
    color: var(--slate-600);
    cursor: pointer;
    transition: background 0.2s var(--ease), color 0.2s var(--ease);
  }

  .trust-quote-close:hover {
    background: var(--slate-300);
    color: var(--navy-dark);
  }

  .trust-quote-close:focus-visible {
    outline: 3px solid var(--sky);
    outline-offset: 2px;
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
    width: 26px;
    height: 26px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.25);
    background-clip: content-box;
    border: none;
    padding: 9px;
    cursor: pointer;
    transition: background 0.3s var(--ease), width 0.3s var(--ease);
  }

  .trust-dot:hover {
    background: var(--sky-light);
    background-clip: content-box;
  }

  .trust-dot.active {
    width: 42px;
    border-radius: 13px;
    background: var(--sky-light);
    background-clip: content-box;
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

  /* ── Responsive Design ── */
  @media (max-width: 900px) {
    .trust-stage {
      height: 360px;
    }

    .trust-card {
      width: clamp(240px, 58vw, 300px);
      height: 348px;
      padding: 24px 20px;
    }

    .trust-avatar {
      width: 82px;
      height: 82px;
      font-size: 1.35rem;
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
      height: 380px;
    }

    .trust-card {
      width: clamp(220px, 74vw, 280px);
      height: 366px;
      padding: 22px 18px;
    }

    .trust-avatar {
      width: 78px;
      height: 78px;
      font-size: 1.3rem;
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
 const AVATAR_BY_NAME: Record<string, string> = {
   Tiara: "/images/testimoni/tiara.webp",
   Fauzan: "/images/testimoni/ojan.webp",
   Tasya: "/images/testimoni/tasya.webp",
   Misse: "/images/testimoni/misse.webp",
   Naufal: "/images/testimoni/naufal.webp",
   Nabila: "/images/testimoni/nabila.webp",
   Ayu: "/images/testimoni/ayu.webp",
   Ika: "/images/testimoni/ika.webp",
   Jordy: "/images/testimoni/jordy.webp",
   Zafi: "/images/testimoni/profil1.webp",
   Esty: "/images/testimoni/profil2.webp",
};

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

/** Photo avatar that falls back to initials if the file is missing (e.g. not yet uploaded). */
function AvatarMedia({ name }: { name: string }) {
  const src = AVATAR_BY_NAME[name];
  const [failed, setFailed] = useState(false);
  if (!src || failed) return <>{getInitials(name)}</>;
  return (
    <img
      src={getImageUrl(src)}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

/** One star at position `i` for a rating that may be fractional (e.g. 4.5 → half). */
function starNode(rating: number, i: number, size = 13) {
  const fill = Math.max(0, Math.min(1, rating - i));
  if (fill >= 1) return <Star size={size} className="filled" />;
  if (fill <= 0) return <Star size={size} />;
  return (
    <span className="trust-star-part" style={{ width: size, height: size }}>
      <Star size={size} />
      <span className="trust-star-part-fill" style={{ width: `${Math.round(fill * 100)}%` }}>
        <Star size={size} className="filled" />
      </span>
    </span>
  );
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

/** Reads the full testimonial when the card clamps it. Same modal pattern as CradleSizeDialog. */
function TestimonialDialog({ item, onClose }: { item: TestimonialItem; onClose: () => void }) {
  const { t } = useTranslation();
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && node) {
        const focusables = node.querySelectorAll<HTMLElement>(
          'button, [href], [tabindex]:not([tabindex="-1"])'
        );
        if (focusables.length === 0) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    document.addEventListener("keydown", handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    node?.querySelector<HTMLElement>(".trust-quote-close")?.focus();

    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [onClose]);

  return createPortal(
    <AnimatePresence>
      {/* Re-declares the component's CSS variables + font — the portal sits outside .trust-cta-corporate. */}
      <motion.div
        className="trust-cta-corporate trust-quote-backdrop"
        onClick={onClose}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        <motion.div
          ref={dialogRef}
          className="trust-quote-dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="trust-quote-dialog-name"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 24, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 24, scale: 0.96 }}
          transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
        >
          <button
            type="button"
            className="trust-quote-close"
            onClick={onClose}
            aria-label={t("common.close")}
          >
            <X size={20} aria-hidden="true" />
          </button>

          <div className="trust-avatar" aria-hidden="true">
            <AvatarMedia name={item.name} />
          </div>
          <div className="trust-stars" role="img" aria-label={`${item.rating} / 5`}>
            {Array.from({ length: 5 }).map((_, i) => (
              <span key={i} style={{ display: "inline-flex" }}>{starNode(item.rating, i)}</span>
            ))}
          </div>
          <Quote className="trust-quote-icon" size={20} aria-hidden="true" />
          <p className="trust-quote-dialog-quote">&ldquo;{item.quote}&rdquo;</p>
          <div className="trust-name" id="trust-quote-dialog-name">
            {item.name}
          </div>
          <div className="trust-role">
            {item.role} &middot; {item.company}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}

export function TrustCTA() {
  const { t } = useTranslation();

  const items = t("testimonials.items", { returnObjects: true }) as TestimonialItem[];
  const total = items.length;
  const prefersReduced = useReducedMotion();
  const [activeIndex, setActiveIndex] = useState(0);
  const [hoverPaused, setHoverPaused] = useState(false);
  const [userPaused, setUserPaused] = useState(false);
  const [radius, setRadius] = useState(230);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [quoteClamped, setQuoteClamped] = useState(false);
  const stageRef = useRef<HTMLDivElement>(null);
  const activeQuoteRef = useRef<HTMLParagraphElement>(null);

  /* Pointer-tracking 3D tilt for the active card. */
  const tiltRX = useMotionValue(0);
  const tiltRY = useMotionValue(0);
  const springRX = useSpring(tiltRX, { stiffness: 170, damping: 18, mass: 0.4 });
  const springRY = useSpring(tiltRY, { stiffness: 170, damping: 18, mass: 0.4 });

  const handleCardTilt = useCallback(
    (e: ReactPointerEvent<HTMLElement>) => {
      if (e.pointerType !== "mouse") return; // no tilt on touch / pen — it sticks
      const r = e.currentTarget.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const px = (e.clientX - r.left) / r.width - 0.5;
      const py = (e.clientY - r.top) / r.height - 0.5;
      tiltRY.set(Math.max(-8, Math.min(8, px * 16)));
      tiltRX.set(Math.max(-8, Math.min(8, -py * 16)));
    },
    [tiltRX, tiltRY]
  );

  const resetCardTilt = useCallback(() => {
    tiltRX.set(0);
    tiltRY.set(0);
  }, [tiltRX, tiltRY]);

  /* Re-centre the tilt whenever the front card changes. */
  useEffect(() => {
    resetCardTilt();
  }, [activeIndex, resetCardTilt]);

  const isPaused =
    hoverPaused || userPaused || openIndex !== null || !!prefersReduced;

  /* The active quote is line-clamped in CSS; expose a "read more" only when it overflows. */
  useLayoutEffect(() => {
    const el = activeQuoteRef.current;
    setQuoteClamped(!!el && el.scrollHeight - el.clientHeight > 2);
  }, [activeIndex, radius, total]);

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
    setHoverPaused(false);
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
        onMouseEnter={() => setHoverPaused(true)}
        onMouseLeave={() => setHoverPaused(false)}
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
            <motion.span
              className="trust-cta-badge"
              variants={fadeUp}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
            >
            </motion.span>
            <motion.h2
              className="trust-cta-title"
              variants={fadeUp}
              whileHover={{ y: -2 }}
              whileTap={{ scale: 0.985 }}
            >
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
                    onDragStart={() => setHoverPaused(true)}
                    onDragEnd={isActive ? handleDragEnd : undefined}
                    onPointerMove={isActive && !prefersReduced ? handleCardTilt : undefined}
                    onPointerLeave={isActive && !prefersReduced ? resetCardTilt : undefined}
                    onClick={!isActive ? () => goTo(index) : undefined}
                    aria-hidden={Math.abs(offset) > 2}
                  >
                   <motion.div
                    className="trust-card-inner"
                    style={
                      isActive && !prefersReduced
                        ? { transformPerspective: 900, rotateX: springRX, rotateY: springRY }
                        : undefined
                    }
                   >
                    <div className="trust-avatar" aria-hidden="true">
                      <AvatarMedia name={item.name} />
                    </div>
                    <motion.div
                      className="trust-stars"
                      role="img"
                      aria-label={`${item.rating} / 5`}
                      key={isActive ? `stars-${activeIndex}` : undefined}
                    >
                      {Array.from({ length: 5 }).map((_, i) => (
                        <motion.span
                          key={i}
                          style={{ display: "inline-flex" }}
                          initial={
                            isActive && !prefersReduced
                              ? { scale: 0, rotate: -45, opacity: 0 }
                              : false
                          }
                          animate={
                            isActive && !prefersReduced
                              ? { scale: 1, rotate: 0, opacity: 1 }
                              : undefined
                          }
                          transition={{
                            delay: 0.15 + i * 0.06,
                            type: "spring",
                            stiffness: 480,
                            damping: 16,
                          }}
                        >
                          {starNode(item.rating, i)}
                        </motion.span>
                      ))}
                    </motion.div>
                    <Quote className="trust-quote-icon" size={20} aria-hidden="true" />
                    <p className="trust-quote" ref={isActive ? activeQuoteRef : undefined}>
                      &ldquo;{item.quote}&rdquo;
                    </p>
                    {isActive && quoteClamped && (
                      <button
                        type="button"
                        className="trust-quote-more"
                        onClick={(e) => {
                          e.stopPropagation();
                          setOpenIndex(index);
                        }}
                      >
                        {t("common.readMore")}
                      </button>
                    )}
                    <div className="trust-name">{item.name}</div>
                    <div className="trust-role">
                      {item.role} &middot; {item.company}
                    </div>
                   </motion.div>
                  </motion.article>
                );
              })}
            </div>

            {/* Controls */}
            <div className="trust-controls">
              {total > 1 && (
                <button
                  type="button"
                  className="trust-nav-btn"
                  onClick={() => setUserPaused((v) => !v)}
                  aria-pressed={userPaused}
                  aria-label={
                    userPaused
                      ? t("hero.play", "Play testimonials")
                      : t("hero.pause", "Pause testimonials")
                  }
                >
                  {userPaused ? <Play size={16} className="translate-x-px" /> : <Pause size={16} />}
                </button>
              )}

              <button
                type="button"
                className="trust-nav-btn"
                onClick={goPrev}
                aria-label={t("hero.previousSlide")}
              >
                <ChevronLeft size={18} aria-hidden="true" />
              </button>

              <div className="trust-dots" role="group" aria-label={t("testimonials.title")}>
                {items.map((_, index) => (
                  <button
                    key={index}
                    type="button"
                    aria-current={index === activeIndex ? "true" : undefined}
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
                <ChevronRight size={18} aria-hidden="true" />
              </button>
            </div>
          </motion.div>

        </div>
      </section>

      {openIndex !== null && items[openIndex] && (
        <TestimonialDialog item={items[openIndex]} onClose={() => setOpenIndex(null)} />
      )}
    </div>
  );
}
