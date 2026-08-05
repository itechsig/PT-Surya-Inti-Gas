import { Link } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import {
  Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbPage, BreadcrumbSeparator,
} from './ui/breadcrumb';

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.4, 0, 0.2, 1] } },
};

const staggerContainer: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12 } },
};

export interface PageHeroBreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  breadcrumbs: PageHeroBreadcrumbItem[];
}

/**
 * Shared dark navy-gradient hero band used on every internal page (Products, Gallery,
 * About Us, Portfolio, ...). Extracted so the gradient/typography treatment stays a
 * single source of truth instead of being copy-pasted per page.
 */
export function PageHero({ title, subtitle, backgroundImage, breadcrumbs }: PageHeroProps) {
  return (
    <motion.section
      style={{
        position: 'relative',
        minHeight: '480px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        padding: '140px 6vw 100px',
        textAlign: 'center',
      }}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: '-80px' }}
      variants={staggerContainer}
    >
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center 65%',
          zIndex: 0,
        }}
      />
      <motion.div
        style={{
          position: 'relative', zIndex: 1, maxWidth: '900px', margin: '0 auto', width: '100%',
          display: 'flex', flexDirection: 'column', alignItems: 'center',
        }}
        variants={fadeUp}
      >
        <motion.div variants={fadeUp} style={{ marginBottom: '20px' }}>
          <Breadcrumb>
            <BreadcrumbList className="justify-center text-white/60">
              {breadcrumbs.map((item, index) => (
                <span key={index} className="contents">
                  <BreadcrumbItem>
                    {item.href ? (
                      <BreadcrumbLink asChild className="text-white/60 hover:text-white">
                        <Link to={item.href}>{item.label}</Link>
                      </BreadcrumbLink>
                    ) : (
                      <BreadcrumbPage className="font-semibold text-white">{item.label}</BreadcrumbPage>
                    )}
                  </BreadcrumbItem>
                  {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="text-white/40" />}
                </span>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </motion.div>
        <motion.h1
          variants={fadeUp}
          style={{
            fontFamily: 'Barlow, system-ui, sans-serif',
            fontSize: 'clamp(2.25rem, 5vw, 4rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.02em',
            color: '#ffffff',
            margin: subtitle ? '0 0 24px' : '0',
          }}
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            variants={fadeUp}
            style={{
              fontFamily: 'DM Sans, system-ui, sans-serif',
              fontSize: 'clamp(1rem, 1.4vw, 1.125rem)',
              lineHeight: 1.75,
              color: 'rgba(255, 255, 255, 0.78)',
              maxWidth: '680px',
              margin: '0 auto',
            }}
          >
            {subtitle}
          </motion.p>
        )}
      </motion.div>
    </motion.section>
  );
}
