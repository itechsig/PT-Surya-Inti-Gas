import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useTranslation } from 'react-i18next';
import { Link, useParams } from 'react-router-dom';
import { motion, type Variants } from 'motion/react';
import { Seo } from './Seo';
import {
  ChevronRight,
  Building2,
  PackageSearch,
  Eye,
  Compass,
  ShieldCheck,
  Handshake,
  Award,
  ClipboardCheck,
  Heart,
  Gem,
  Lightbulb,
  Users,
  Truck,
  Tag,
  Headset,
  CheckCircle2,
  Calendar,
  X,
  ChevronLeft,
  ArrowRight,
} from 'lucide-react';

/* ═══════════════════════════════════════════════════════════════
   ABOUT US PAGE.TSX — PT Surya Inti Gas Corporate
   Modern, premium, story-driven redesign
══════════════════════════════════════════════════════════════ */

const css = `
  /* ── Corporate Variables ── */
  .about-us-corporate {
    --primary: var(--brand-navy, #0C2D5E);
    --primary-dark: var(--brand-navy-hover, #0a3861);
    --secondary: var(--brand-sky, #00AEEF);
    --bg: #F8FAFC;
    --accent: #EAF4FF;

    --ff-display: var(--font-display, 'Barlow', system-ui, sans-serif);
    --ff-body: var(--font-sans, 'DM Sans', system-ui, sans-serif);

    font-family: var(--ff-body);
    background: var(--bg);
  }

  .about-us-corporate :focus-visible {
    outline: 3px solid var(--secondary);
    outline-offset: 2px;
  }

  /* ── Hero ── */
  .au-hero {
    position: relative;
    min-height: 560px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    padding: 140px 6vw;
    text-align: center;
  }

  .au-hero-bg {
    position: absolute;
    inset: 0;
    background-image: linear-gradient(180deg, rgba(15, 23, 42, 0.75) 0%, rgba(10, 33, 63, 0.88) 55%, rgba(15, 23, 42, 0.97) 100%), url('/images/office/wp.jpg');
    background-size: cover;
    background-position: center 65%;
    z-index: 0;
  }

  .au-hero-content {
    position: relative;
    z-index: 1;
    max-width: 900px;
    margin: 0 auto;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .au-breadcrumb {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 28px;
    font-family: var(--ff-body);
    font-size: 13px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.65);
  }

  .au-breadcrumb a {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: rgba(255, 255, 255, 0.65);
    text-decoration: none;
    transition: color 0.25s var(--ease);
  }

  .au-breadcrumb a:hover {
    color: var(--white);
  }

  .au-breadcrumb-current {
    color: var(--white);
    font-weight: 600;
  }

  .au-hero-badge {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 8px 22px;
    border-radius: 50px;
    background: rgba(0, 174, 239, 0.15);
    border: 1px solid rgba(0, 174, 239, 0.4);
    font-family: var(--ff-display);
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.2em;
    text-transform: uppercase;
    color: var(--white);
    margin-bottom: 28px;
  }

  .au-hero-title {
    font-family: var(--ff-display);
    font-size: clamp(2.25rem, 5vw, 4rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--white);
    margin: 0 0 24px;
    text-align: center;
  }

  .au-hero-title span {
    color: var(--white);
  }

  .au-hero-description {
    font-size: clamp(1rem, 1.4vw, 1.125rem);
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.78);
    max-width: 640px;
    margin: 0 auto;
    text-align: center;
  }

  /* ── Shared section chrome ── */
  .au-section {
    position: relative;
    padding: 100px 6vw;
  }

  .au-section--tint {
    background: var(--accent);
  }

  .au-container {
    max-width: 1400px;
    margin: 0 auto;
  }

  .au-header {
    text-align: center;
    max-width: 760px;
    margin: 0 auto 56px;
  }

  .au-title {
    font-family: var(--ff-display);
    font-size: clamp(1.875rem, 3.6vw, 2.75rem);
    font-weight: 800;
    line-height: 1.15;
    letter-spacing: -0.02em;
    color: var(--slate-800);
    margin: 0 0 18px;
  }

  .au-subtitle {
    font-size: clamp(1rem, 1.3vw, 1.0625rem);
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Intro cards (Who / What / Why) ── */
  .au-intro-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 28px;
  }

  .au-intro-card {
    position: relative;
    background: var(--white);
    border-radius: 20px;
    padding: 40px 32px;
    border: 1px solid var(--slate-200);
    overflow: hidden;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .au-intro-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    background: linear-gradient(90deg, var(--primary), var(--secondary));
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.4s var(--ease);
  }

  .au-intro-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 24px 48px rgba(15, 76, 129, 0.12);
    border-color: rgba(0, 174, 239, 0.4);
  }

  .au-intro-card:hover::before {
    transform: scaleX(1);
  }

  .au-intro-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    border-radius: 16px;
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: var(--white);
    margin-bottom: 24px;
    transition: transform 0.4s var(--ease);
  }

  .au-intro-card:hover .au-intro-icon {
    transform: scale(1.08) rotate(-4deg);
  }

  .au-intro-card-title {
    font-family: var(--ff-display);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0 0 12px;
    letter-spacing: -0.01em;
  }

  .au-intro-card-text {
    font-size: 0.9375rem;
    line-height: 1.75;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Vision / Mission glass cards ── */
  .au-vm-section {
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--primary-dark) 100%);
    padding: 100px 6vw;
    position: relative;
    overflow: hidden;
  }

  .au-vm-section::before {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle at 20% 20%, rgba(0, 174, 239, 0.18), transparent 45%),
      radial-gradient(circle at 80% 80%, rgba(0, 174, 239, 0.12), transparent 45%);
    pointer-events: none;
  }

  .au-vm-section .au-title,
  .au-vm-section .au-subtitle {
    color: var(--white);
  }

  .au-vm-section .au-subtitle {
    color: rgba(255, 255, 255, 0.7);
  }

  .au-vm-grid {
    position: relative;
    z-index: 1;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 32px;
  }

  .au-vm-card {
    background: rgba(255, 255, 255, 0.07);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.16);
    border-radius: 24px;
    padding: 48px;
    transition: transform 0.4s var(--ease), border-color 0.4s var(--ease), background 0.4s var(--ease);
  }

  .au-vm-card:hover {
    transform: translateY(-8px);
    border-color: rgba(0, 174, 239, 0.5);
    background: rgba(255, 255, 255, 0.1);
  }

  .au-vm-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 56px;
    height: 56px;
    border-radius: 16px;
    background: rgba(0, 174, 239, 0.18);
    border: 1px solid rgba(0, 174, 239, 0.4);
    color: var(--secondary);
    margin-bottom: 24px;
  }

  .au-vm-title {
    font-family: var(--ff-display);
    font-size: 1.5rem;
    font-weight: 700;
    color: var(--white);
    margin: 0 0 16px;
    letter-spacing: -0.01em;
  }

  .au-vm-text {
    font-size: 1rem;
    line-height: 1.75;
    color: rgba(255, 255, 255, 0.75);
    margin: 0;
  }

  .au-vm-list {
    margin: 0;
    padding: 0;
    list-style: none;
  }

  .au-vm-list li {
    display: flex;
    align-items: flex-start;
    gap: 12px;
    font-size: 1rem;
    line-height: 1.6;
    color: rgba(255, 255, 255, 0.8);
    margin-bottom: 14px;
  }

  .au-vm-list li:last-child {
    margin-bottom: 0;
  }

  .au-vm-list svg {
    flex-shrink: 0;
    margin-top: 3px;
    color: var(--secondary);
  }

  /* ── Timeline ── */
  .au-timeline {
    position: relative;
    max-width: 980px;
    margin: 0 auto;
    padding-left: 0;
  }

  .au-timeline-line {
    position: absolute;
    left: 50%;
    top: 0;
    bottom: 0;
    width: 3px;
    background: linear-gradient(180deg, var(--secondary), var(--primary));
    transform: translateX(-50%);
    border-radius: 2px;
  }

  .au-timeline-item {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 56px;
    margin-bottom: 56px;
  }

  .au-timeline-item:last-child {
    margin-bottom: 0;
  }

  .au-timeline-dot {
    position: absolute;
    top: 4px;
    left: 50%;
    transform: translateX(-50%);
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background: var(--white);
    border: 4px solid var(--secondary);
    z-index: 2;
    box-shadow: 0 0 0 6px var(--accent);
  }

  .au-timeline-card {
    background: var(--white);
    border: 1px solid var(--slate-200);
    border-radius: 20px;
    padding: 32px;
    box-shadow: 0 12px 32px rgba(15, 76, 129, 0.08);
  }

  .au-timeline-item:nth-child(odd) .au-timeline-card {
    grid-column: 1;
  }

  .au-timeline-item:nth-child(odd) .au-timeline-spacer {
    grid-column: 2;
  }

  .au-timeline-item:nth-child(even) .au-timeline-card {
    grid-column: 2;
  }

  .au-timeline-item:nth-child(even) .au-timeline-spacer {
    grid-column: 1;
  }

  .au-timeline-year {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-family: var(--ff-display);
    font-size: 0.8125rem;
    font-weight: 700;
    letter-spacing: 0.08em;
    color: var(--secondary);
    background: var(--accent);
    padding: 6px 14px;
    border-radius: 50px;
    margin-bottom: 16px;
  }

  .au-timeline-label {
    font-family: var(--ff-display);
    font-size: 1.375rem;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0 0 12px;
    letter-spacing: -0.01em;
  }

  .au-timeline-text {
    font-size: 0.9375rem;
    line-height: 1.7;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Values grid ── */
  .au-values-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .au-value-card {
    position: relative;
    background: var(--white);
    border-radius: 18px;
    padding: 32px 24px;
    border: 1px solid var(--slate-200);
    text-align: center;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .au-value-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(15, 76, 129, 0.12);
    border-color: rgba(0, 174, 239, 0.4);
  }

  .au-value-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 14px;
    background: var(--accent);
    color: var(--primary);
    margin-bottom: 18px;
    transition: transform 0.4s var(--ease), background 0.4s var(--ease), color 0.4s var(--ease);
  }

  .au-value-card:hover .au-value-icon {
    transform: scale(1.12) rotate(6deg);
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: var(--white);
  }

  .au-value-title {
    font-family: var(--ff-display);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0 0 10px;
  }

  .au-value-description {
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Why us advantages ── */
  .au-whyus-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }

  .au-whyus-card {
    display: flex;
    gap: 18px;
    background: var(--white);
    border: 1px solid var(--slate-200);
    border-radius: 18px;
    padding: 28px;
    transition: transform 0.4s var(--ease), box-shadow 0.4s var(--ease), border-color 0.4s var(--ease);
  }

  .au-whyus-card:hover {
    transform: translateY(-6px);
    box-shadow: 0 20px 40px rgba(15, 76, 129, 0.1);
    border-color: rgba(0, 174, 239, 0.4);
  }

  .au-whyus-icon {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 48px;
    height: 48px;
    border-radius: 14px;
    background: var(--accent);
    color: var(--primary);
  }

  .au-whyus-title {
    display: flex;
    align-items: center;
    gap: 8px;
    font-family: var(--ff-display);
    font-size: 1.0625rem;
    font-weight: 700;
    color: var(--slate-800);
    margin: 0 0 8px;
  }

  .au-whyus-title svg {
    color: #16a34a;
    flex-shrink: 0;
  }

  .au-whyus-description {
    font-size: 0.875rem;
    line-height: 1.65;
    color: var(--slate-600);
    margin: 0;
  }

  /* ── Stats ── */
  .au-stats-section {
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--primary-dark) 100%);
    padding: 90px 6vw;
  }

  .au-stats-section .au-header {
    margin-bottom: 48px;
  }

  .au-stats-section .au-title,
  .au-stats-section .au-subtitle {
    color: var(--white);
  }

  .au-stats-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  .au-stat-card {
    text-align: center;
    padding: 20px;
  }

  .au-stat-icon {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 52px;
    height: 52px;
    border-radius: 50%;
    background: rgba(0, 174, 239, 0.15);
    border: 1px solid rgba(0, 174, 239, 0.35);
    color: var(--secondary);
    margin-bottom: 18px;
  }

  .stat-number {
    display: block;
    font-family: var(--ff-display);
    font-size: clamp(2rem, 4vw, 2.75rem);
    font-weight: 800;
    color: var(--white);
    letter-spacing: -0.02em;
    line-height: 1;
    margin-bottom: 10px;
  }

  .au-stat-label {
    font-size: 0.9375rem;
    color: rgba(255, 255, 255, 0.7);
    font-weight: 500;
  }

  /* ── Gallery ── */
  .au-gallery-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 20px;
    margin-bottom: 44px;
  }

  .au-gallery-item {
    position: relative;
    border-radius: 18px;
    overflow: hidden;
    aspect-ratio: 4 / 3;
    cursor: pointer;
    border: none;
    padding: 0;
    background: var(--slate-100);
  }

  .au-gallery-item img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.6s var(--ease);
  }

  .au-gallery-item:hover img {
    transform: scale(1.08);
  }

  .au-gallery-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, transparent 50%, rgba(15, 23, 42, 0.85) 100%);
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    padding: 18px;
    opacity: 0;
    transition: opacity 0.35s var(--ease);
  }

  .au-gallery-item:hover .au-gallery-overlay {
    opacity: 1;
  }

  .au-gallery-title {
    color: var(--white);
    font-family: var(--ff-display);
    font-size: 0.9375rem;
    font-weight: 700;
    margin: 0;
    text-align: left;
  }

  .au-gallery-zoom {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.2);
    color: var(--white);
    flex-shrink: 0;
  }

  .au-gallery-cta-wrap {
    text-align: center;
  }

  /* ── Buttons ── */
  .au-btn {
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 15px 34px;
    border-radius: 50px;
    font-family: var(--ff-display);
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    cursor: pointer;
    transition: all 0.3s var(--ease);
    text-decoration: none;
    border: none;
  }

  .au-btn-primary {
    background: linear-gradient(135deg, var(--primary), var(--secondary));
    color: var(--white) !important;
    box-shadow: 0 10px 28px rgba(15, 76, 129, 0.35);
  }

  .au-btn-primary svg {
    color: var(--white) !important;
  }

  .au-btn-primary:hover {
    transform: translateY(-3px);
    box-shadow: 0 14px 34px rgba(15, 76, 129, 0.45);
  }

  .au-btn-outline {
    background: transparent;
    color: var(--primary) !important;
    border: 2px solid rgba(15, 76, 129, 0.25);
  }

  .au-btn-outline:hover {
    border-color: var(--primary);
    background: rgba(15, 76, 129, 0.05);
    transform: translateY(-3px);
  }

  .au-btn-outline-light {
    background: transparent;
    color: var(--white) !important;
    border: 2px solid rgba(255, 255, 255, 0.35);
  }

  .au-btn-outline-light svg {
    color: var(--white) !important;
  }

  .au-btn-outline-light:hover {
    border-color: var(--white);
    background: rgba(255, 255, 255, 0.1);
    transform: translateY(-3px);
  }

  /* ── CTA ── */
  .au-cta-section {
    position: relative;
    background: linear-gradient(135deg, var(--navy-dark) 0%, var(--primary-dark) 100%);
    padding: 110px 6vw;
    overflow: hidden;
    text-align: center;
  }

  .au-cta-pattern {
    position: absolute;
    inset: 0;
    background-image: radial-gradient(rgba(255, 255, 255, 0.09) 1.5px, transparent 1.5px);
    background-size: 28px 28px;
    opacity: 0.5;
    pointer-events: none;
  }

  .au-cta-content {
    position: relative;
    z-index: 1;
    max-width: 760px;
    margin: 0 auto;
  }

  .au-cta-title {
    font-family: var(--ff-display);
    font-size: clamp(1.875rem, 3.6vw, 2.75rem);
    font-weight: 800;
    color: var(--white);
    margin: 0 0 20px;
    letter-spacing: -0.02em;
    line-height: 1.15;
  }

  .au-cta-subtitle {
    font-size: 1.0625rem;
    line-height: 1.7;
    color: rgba(255, 255, 255, 0.75);
    margin: 0 0 40px;
  }

  .au-cta-buttons {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 20px;
    flex-wrap: wrap;
  }

  /* ── Lightbox ── */
  .au-lightbox {
    position: fixed;
    inset: 0;
    background: rgba(9, 14, 26, 0.92);
    z-index: 1000;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 40px;
  }

  .au-lightbox-image {
    max-width: min(100%, 1100px);
    max-height: 85vh;
    border-radius: 12px;
    box-shadow: 0 30px 80px rgba(0, 0, 0, 0.5);
  }

  .au-lightbox-close,
  .au-lightbox-nav {
    position: absolute;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: var(--white);
    border-radius: 50%;
    cursor: pointer;
    transition: background 0.25s var(--ease);
  }

  .au-lightbox-close {
    top: 24px;
    right: 24px;
    width: 44px;
    height: 44px;
  }

  .au-lightbox-nav {
    top: 50%;
    transform: translateY(-50%);
    width: 52px;
    height: 52px;
  }

  .au-lightbox-prev {
    left: 24px;
  }

  .au-lightbox-next {
    right: 24px;
  }

  .au-lightbox-close:hover,
  .au-lightbox-nav:hover {
    background: rgba(255, 255, 255, 0.22);
  }

  /* ── Responsive ── */
  @media (max-width: 1100px) {
    .au-intro-grid,
    .au-whyus-grid {
      grid-template-columns: 1fr 1fr;
    }

    .au-values-grid {
      grid-template-columns: repeat(3, 1fr);
    }

    .au-stats-grid {
      grid-template-columns: repeat(2, 1fr);
      row-gap: 40px;
    }

    .au-gallery-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }

  @media (max-width: 900px) {
    .au-vm-grid {
      grid-template-columns: 1fr;
    }

    .au-timeline-line {
      left: 20px;
    }

    .au-timeline-item,
    .au-timeline-item:nth-child(odd),
    .au-timeline-item:nth-child(even) {
      grid-template-columns: 1fr;
      padding-left: 52px;
      gap: 0;
    }

    .au-timeline-item:nth-child(odd) .au-timeline-card,
    .au-timeline-item:nth-child(even) .au-timeline-card {
      grid-column: 1;
    }

    .au-timeline-spacer {
      display: none;
    }

    .au-timeline-dot {
      left: 20px;
    }
  }

  @media (max-width: 768px) {
    .au-hero {
      min-height: 460px;
      padding: 120px 6vw;
    }

    .au-section,
    .au-vm-section,
    .au-stats-section,
    .au-cta-section {
      padding: 64px 6vw;
    }

    .au-header {
      margin-bottom: 40px;
    }

    .au-intro-grid,
    .au-whyus-grid {
      grid-template-columns: 1fr;
    }

    .au-values-grid {
      grid-template-columns: 1fr 1fr;
    }

    .au-stats-grid {
      grid-template-columns: 1fr 1fr;
    }

    .au-gallery-grid {
      grid-template-columns: 1fr 1fr;
    }

    .au-cta-buttons {
      flex-direction: column;
      width: 100%;
    }

    .au-cta-buttons .au-btn {
      width: 100%;
      justify-content: center;
    }

    .au-lightbox {
      padding: 20px;
    }

    .au-lightbox-nav {
      width: 42px;
      height: 42px;
    }
  }

  @media (max-width: 480px) {
    .au-values-grid,
    .au-stats-grid,
    .au-gallery-grid {
      grid-template-columns: 1fr;
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .about-us-corporate * {
      transition-duration: 0.01ms !important;
      animation-duration: 0.01ms !important;
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

const fadeScale: Variants = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.5, ease: [0.4, 0, 0.2, 1] } },
};

/* ── Lightbox ── */
interface LightboxImage {
  src: string;
  alt: string;
}

function Lightbox({
  images,
  index,
  onClose,
  onNavigate,
  labels,
}: {
  images: LightboxImage[];
  index: number;
  onClose: () => void;
  onNavigate: (index: number) => void;
  labels: { close: string; prev: string; next: string };
}) {
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const previouslyFocused = document.activeElement as HTMLElement | null;
    const node = dialogRef.current;

    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowRight') onNavigate((index + 1) % images.length);
      if (e.key === 'ArrowLeft') onNavigate((index - 1 + images.length) % images.length);
      if (e.key === 'Tab' && node) {
        // Keep focus inside the lightbox.
        const focusables = node.querySelectorAll<HTMLElement>('button, [href], [tabindex]:not([tabindex="-1"])');
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

    document.addEventListener('keydown', handleKey);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    node?.querySelector<HTMLElement>('.au-lightbox-close')?.focus();

    return () => {
      document.removeEventListener('keydown', handleKey);
      document.body.style.overflow = originalOverflow;
      previouslyFocused?.focus?.();
    };
  }, [index, images.length, onClose, onNavigate]);

  const current = images[index];

  return createPortal(
    <div ref={dialogRef} className="au-lightbox" role="dialog" aria-modal="true" aria-label={current.alt} onClick={onClose}>
      <button type="button" className="au-lightbox-close" onClick={onClose} aria-label={labels.close}>
        <X size={22} aria-hidden="true" />
      </button>
      <button
        type="button"
        className="au-lightbox-nav au-lightbox-prev"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index - 1 + images.length) % images.length);
        }}
        aria-label={labels.prev}
      >
        <ChevronLeft size={26} aria-hidden="true" />
      </button>
      <img src={current.src} alt={current.alt} className="au-lightbox-image" onClick={(e) => e.stopPropagation()} />
      <button
        type="button"
        className="au-lightbox-nav au-lightbox-next"
        onClick={(e) => {
          e.stopPropagation();
          onNavigate((index + 1) % images.length);
        }}
        aria-label={labels.next}
      >
        <ChevronRight size={26} aria-hidden="true" />
      </button>
    </div>,
    document.body
  );
}

/* ── Icon maps ── */
const valueIcons = [ShieldCheck, Handshake, Award, ClipboardCheck, Heart, Gem, Lightbulb, Users];
const whyUsIcons = [Award, Truck, Tag, Users, ShieldCheck, Headset];
const statIcons = [Calendar, Users, Building2, Headset];

const galleryImages = [
  '/images/office/wp.jpg',
  '/images/office/office_view2.webp',
  '/images/office/office_view3.webp',
  '/images/products/Oxygen_Fix.webp',
  '/images/products/Cryogenic_Dewar.webp',
  '/images/products/ISO_Tank.webp',
];

export function AboutUsPage() {
  const { t } = useTranslation();
  const { lang } = useParams<{ lang: string }>();
  const currentLang = lang || 'id';
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const values = t('aboutUsPage.values.items', { returnObjects: true }) as { title: string; description: string }[];
  const whyUsItems = t('aboutUsPage.whyUs.items', { returnObjects: true }) as { title: string; description: string }[];
  const stats = t('aboutUsPage.stats.items', { returnObjects: true }) as { value: string; suffix: string; label: string }[];
  const galleryLabels = t('aboutUsPage.gallery.items', { returnObjects: true }) as { title: string }[];
  const missionItems = t('about.mission.items', { returnObjects: true }) as string[];
  const timelineLabels = t('about.timeline.items', { returnObjects: true }) as { year: string; label: string }[];

  const milestoneYears = ['2003', '2007', '2016', '2017'] as const;
  const timeline = milestoneYears.map((year, index) => ({
    year,
    label: timelineLabels[index]?.label ?? year,
    text: t(`aboutUsPage.milestones.${year}.description`),
  }));

  const galleryItems: LightboxImage[] = galleryImages.map((src, i) => ({
    src,
    alt: galleryLabels[i]?.title ?? '',
  }));

  return (
    <div className="about-us-corporate">
      <Seo title={t('seo.about.title')} description={t('seo.about.description')} segment="tentang-kami" />
      <style>{css}</style>

      {/* ── Hero ── */}
      <section className="au-hero">
        <div className="au-hero-bg" aria-hidden="true" />
        <div className="au-hero-content">

          <motion.div initial="hidden" animate="show" variants={staggerContainer}>

            <motion.h1 className="au-hero-title" variants={fadeUp}>
              {t('aboutUsPage.hero.title')} <span>{t('aboutUsPage.hero.titleHighlight')}</span>
            </motion.h1>
            <motion.p className="au-hero-description" variants={fadeUp}>
              {t('aboutUsPage.hero.description')}
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── Who We Are / What We Do / Why Choose Us ── */}
      <section className="au-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.intro.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.intro.subtitle')}</motion.p>
          </motion.div>

          <motion.div
            className="au-intro-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div className="au-intro-card" variants={fadeUp}>
              <div className="au-intro-icon"><Building2 size={26} /></div>
              <h3 className="au-intro-card-title">{t('aboutUsPage.intro.whoWeAre.title')}</h3>
              <p className="au-intro-card-text">{t('aboutUsPage.intro.whoWeAre.text')}</p>
            </motion.div>
            <motion.div className="au-intro-card" variants={fadeUp}>
              <div className="au-intro-icon"><PackageSearch size={26} /></div>
              <h3 className="au-intro-card-title">{t('aboutUsPage.intro.whatWeDo.title')}</h3>
              <p className="au-intro-card-text">{t('aboutUsPage.intro.whatWeDo.text')}</p>
            </motion.div>
            <motion.div className="au-intro-card" variants={fadeUp}>
              <div className="au-intro-icon"><Award size={26} /></div>
              <h3 className="au-intro-card-title">{t('aboutUsPage.intro.whyChooseUs.title')}</h3>
              <p className="au-intro-card-text">{t('aboutUsPage.intro.whyChooseUs.text')}</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Vision & Mission ── */}
      <section className="au-vm-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.visionMission.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.visionMission.subtitle')}</motion.p>
          </motion.div>

          <motion.div
            className="au-vm-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.div className="au-vm-card" variants={fadeScale}>
              <div className="au-vm-icon"><Eye size={26} /></div>
              <h3 className="au-vm-title">{t('about.vision.title')}</h3>
              <p className="au-vm-text">{t('about.vision.text')}</p>
            </motion.div>
            <motion.div className="au-vm-card" variants={fadeScale}>
              <div className="au-vm-icon"><Compass size={26} /></div>
              <h3 className="au-vm-title">{t('about.mission.title')}</h3>
              <ul className="au-vm-list">
                {missionItems.map((item, index) => (
                  <li key={index}>
                    <CheckCircle2 size={18} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ── Company Story Timeline ── */}
      <section className="au-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.timeline.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.timeline.subtitle')}</motion.p>
          </motion.div>

          <div className="au-timeline">
            <div className="au-timeline-line" aria-hidden="true" />
            {timeline.map((item, index) => (
              <motion.div
                key={item.year}
                className="au-timeline-item"
                initial={{ opacity: 0, x: index % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
              >
                <div className="au-timeline-dot" aria-hidden="true" />
                <div className="au-timeline-card">
                  <span className="au-timeline-year">
                    <Calendar size={14} />
                    {item.year}
                  </span>
                  <h3 className="au-timeline-label">{item.label}</h3>
                  <p className="au-timeline-text">{item.text}</p>
                </div>
                <div className="au-timeline-spacer" aria-hidden="true" />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Values ── */}
      <section className="au-section au-section--tint">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.values.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.values.subtitle')}</motion.p>
          </motion.div>

          <motion.div
            className="au-values-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {values.map((value, index) => {
              const Icon = valueIcons[index % valueIcons.length];
              return (
                <motion.div key={index} className="au-value-card" variants={fadeUp}>
                  <div className="au-value-icon"><Icon size={24} /></div>
                  <h3 className="au-value-title">{value.title}</h3>
                  <p className="au-value-description">{value.description}</p>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Why Choose Us (advantages) ── */}
      <section className="au-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.whyUs.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.whyUs.subtitle')}</motion.p>
          </motion.div>

          <motion.div
            className="au-whyus-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {whyUsItems.map((item, index) => {
              const Icon = whyUsIcons[index % whyUsIcons.length];
              return (
                <motion.div key={index} className="au-whyus-card" variants={fadeUp}>
                  <div className="au-whyus-icon"><Icon size={22} /></div>
                  <div>
                    <h3 className="au-whyus-title">
                      <CheckCircle2 size={18} />
                      {item.title}
                    </h3>
                    <p className="au-whyus-description">{item.description}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="au-stats-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.stats.title')}</motion.h2>
          </motion.div>

          <motion.div
            className="au-stats-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {stats.map((stat, index) => {
              const Icon = statIcons[index % statIcons.length];
              return (
                <motion.div key={index} className="au-stat-card" variants={fadeUp}>
                  <div className="au-stat-icon"><Icon size={24} /></div>
                  <span className="stat-number">{stat.value}{stat.suffix}</span>
                  <span className="au-stat-label">{stat.label}</span>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* ── Gallery ── */}
      <section className="au-section">
        <div className="au-container">
          <motion.div
            className="au-header"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            <motion.h2 className="au-title" variants={fadeUp}>{t('aboutUsPage.gallery.title')}</motion.h2>
            <motion.p className="au-subtitle" variants={fadeUp}>{t('aboutUsPage.gallery.subtitle')}</motion.p>
          </motion.div>

          <motion.div
            className="au-gallery-grid"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: '-80px' }}
            variants={staggerContainer}
          >
            {galleryItems.map((image, index) => (
              <motion.button
                key={image.src}
                type="button"
                className="au-gallery-item"
                variants={fadeUp}
                whileHover={{ y: -4 }}
                onClick={() => setLightboxIndex(index)}
                aria-label={image.alt}
              >
                <img src={image.src} alt={image.alt} loading="lazy" />
                <div className="au-gallery-overlay">
                  <p className="au-gallery-title">{image.alt}</p>
                  <span className="au-gallery-zoom"><Eye size={16} /></span>
                </div>
              </motion.button>
            ))}
          </motion.div>

          <div className="au-gallery-cta-wrap">
            <Link to={`/${currentLang}/galeri`} className="au-btn au-btn-outline">
              {t('aboutUsPage.gallery.viewAll')}
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="au-cta-section">
        <div className="au-cta-pattern" aria-hidden="true" />
        <motion.div
          className="au-cta-content"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          variants={staggerContainer}
        >
          <motion.h2 className="au-cta-title" variants={fadeUp}>{t('aboutUsPage.cta.title')}</motion.h2>
          <motion.p className="au-cta-subtitle" variants={fadeUp}>{t('aboutUsPage.cta.subtitle')}</motion.p>
          <motion.div className="au-cta-buttons" variants={fadeUp}>
            <Link to={`/${currentLang}/kontak`} className="au-btn au-btn-primary">
              {t('aboutUsPage.cta.primaryButton')}
              <ArrowRight size={16} />
            </Link>
            <Link to={`/${currentLang}/produk`} className="au-btn au-btn-outline-light">
              {t('aboutUsPage.cta.secondaryButton')}
              <ArrowRight size={16} />
            </Link>
          </motion.div>
        </motion.div>
      </section>

      {lightboxIndex !== null && (
        <Lightbox
          images={galleryItems}
          index={lightboxIndex}
          onClose={() => setLightboxIndex(null)}
          onNavigate={setLightboxIndex}
          labels={{
            close: t('aboutUsPage.gallery.lightboxClose'),
            prev: t('aboutUsPage.gallery.lightboxPrev'),
            next: t('aboutUsPage.gallery.lightboxNext'),
          }}
        />
      )}
    </div>
  );
}
