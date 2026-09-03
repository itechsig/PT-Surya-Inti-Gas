import { motion, type Variants } from "motion/react";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Link, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

const MotionLink = motion.create(Link);

const container: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.1 },
  },
};

const item: Variants = {
  hidden: { opacity: 0, y: 36 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] },
  },
};

export function SlideContent() {
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "id";
  const { t } = useTranslation();

  // Fixed hero copy, localized via the shared hero.slides.company entry.
  const staticContent = {
    subtitle: t('hero.slides.company.subtitle'),
    title: t('hero.slides.company.title'),
    description: t('hero.slides.company.description'),
  };

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="mx-auto flex max-w-2xl flex-col items-center"
    >
      <motion.span
        variants={item}
        className="mb-4 inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-brand-sky"
      >
        {staticContent.subtitle}
      </motion.span>

      {/* The hero <h1> is the LCP element. It renders at its final state
          immediately (initial={false}) instead of fading in from opacity:0,
          so Lighthouse counts it as painted the moment React mounts rather
          than after the entrance animation. The rest of the block still
          staggers in. */}
      <motion.h1
        initial={false}
        animate={{ opacity: 1, y: 0 }}
        className="mb-5 font-[Barlow,system-ui,sans-serif] text-4xl font-extrabold leading-[1.05] tracking-tight text-white drop-shadow-[0_4px_24px_rgba(0,0,0,0.45)] sm:text-5xl md:text-6xl lg:text-7xl"
      >
        {staticContent.title}
      </motion.h1>

      <motion.p
        variants={item}
        className="mx-auto mb-8 max-w-xl text-base font-light leading-relaxed text-white/85 sm:text-lg"
      >
        {staticContent.description}
      </motion.p>

      <motion.div variants={item} className="flex flex-wrap items-center justify-center gap-4">
        <MotionLink
          to={`/${currentLang}/produk`}
          className="hero-cta-primary group"
        >
          {t('hero.viewProducts')}
          <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" aria-hidden="true" />
        </MotionLink>

        <MotionLink
          to={`/${currentLang}/kontak`}
          className="hero-cta-secondary"
        >
          <PhoneCall className="h-4 w-4" aria-hidden="true" />
          {t('hero.contactUs')}
        </MotionLink>
      </motion.div>
    </motion.div>
  );
}
