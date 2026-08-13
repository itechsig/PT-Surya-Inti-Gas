import { motion, type Variants } from "framer-motion";
import { ArrowRight, PhoneCall } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { useTranslation } from "react-i18next";

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
  const navigate = useNavigate();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || "id";
  const { t } = useTranslation();

  // Static content as requested
  const staticContent = {
    subtitle: "Pemasok Gas Industri Terpercaya",
    title: "PT Surya Inti Gas",
    description: "Menyediakan gas industri berkualitas tinggi untuk manufaktur, kesehatan, pengolahan makanan, pengelasan, laboratorium, dan berbagai industri lainnya dengan distribusi yang andal serta layanan yang unggul."
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
        className="mb-4 inline-block text-xs sm:text-sm font-bold uppercase tracking-[0.25em] text-[#00AEEF]"
      >
        {staticContent.subtitle}
      </motion.span>

      <motion.h1
        variants={item}
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
        <button
          type="button"
          onClick={() => navigate(`/${currentLang}/produk`)}
          className="hero-cta-primary"
        >
          {t('hero.viewProducts')}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
        </button>

        <button
          type="button"
          onClick={() => navigate(`/${currentLang}/kontak`)}
          className="hero-cta-secondary"
        >
          <PhoneCall className="h-4 w-4" />
          {t('hero.contactUs')}
        </button>
      </motion.div>
    </motion.div>
  );
}
