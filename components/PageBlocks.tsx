import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { FAQItem } from '../types';
import SEOHead, { OpenGraphMeta } from './SEOHead';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  keywords?: string[];
}

export interface FeatureItem {
  title: string;
  description: string;
  href?: string;
}

export interface ProcessItem {
  title: string;
  description: string;
}

export const PageMeta: React.FC<{ canonical?: string; description: string; noindex?: boolean; og?: OpenGraphMeta; title: string }> = (props) => <SEOHead {...props} />;

export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, primaryCta, secondaryCta, keywords }) => {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-white px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="container mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl">
          <span className="mb-5 inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-700">
            {eyebrow}
          </span>
          <h1 className="text-4xl font-bold leading-[1.04] tracking-tight text-gray-950 md:text-6xl">{title}</h1>
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-600 md:text-xl">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primaryCta && (
                <a href={primaryCta.href} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  {primaryCta.label}
                  <ArrowRight size={16} />
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
          {keywords && (
            <div className="mt-9 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export const SectionIntro: React.FC<{ eyebrow: string; title: string; description?: string }> = ({ eyebrow, title, description }) => (
  <div className="mb-10 max-w-3xl md:mb-14">
    <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">{eyebrow}</span>
    <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">{title}</h2>
    {description && <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">{description}</p>}
  </div>
);

export const FeatureGrid: React.FC<{ items: FeatureItem[]; columns?: 'three' | 'four' }> = ({ items, columns = 'three' }) => {
  const gridClass = columns === 'four' ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridClass}`}>
      {items.map((item, idx) => {
        const content = (
          <>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-lg font-bold leading-tight text-gray-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
            {item.href && <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">Mehr erfahren <ArrowRight size={14} /></span>}
          </>
        );
        const className = 'group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60';
        return item.href ? (
          <motion.a key={item.title} href={item.href} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: idx * 0.04 }} className={className}>
            {content}
          </motion.a>
        ) : (
          <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: idx * 0.04 }} className={className}>
            {content}
          </motion.article>
        );
      })}
    </div>
  );
};

export const ProcessList: React.FC<{ steps: ProcessItem[] }> = ({ steps }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
    {steps.map((step, idx) => (
      <article key={step.title} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
        <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-white text-base font-bold text-blue-700 shadow-sm ring-1 ring-gray-100">
          {idx + 1}
        </div>
        <h3 className="text-lg font-bold text-gray-950">{step.title}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
      </article>
    ))}
  </div>
);

export const PageFAQ: React.FC<{ faqs: FAQItem[] }> = ({ faqs }) => (
  <div className="space-y-3">
    {faqs.map((faq) => (
      <article key={faq.id} className="rounded-2xl border border-gray-100 bg-white p-6">
        <h3 className="text-lg font-bold leading-tight text-gray-950">{faq.question}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">{faq.answer}</p>
      </article>
    ))}
  </div>
);

export const PageCTA: React.FC<{ title: string; description: string; primaryLabel?: string; primaryHref?: string }> = ({
  title,
  description,
  primaryLabel = 'Anfrage starten',
  primaryHref = '/kontakt',
}) => (
  <section className="bg-white px-6 py-16 md:py-24">
    <div className="container mx-auto">
      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{description}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <a href={primaryHref} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              {primaryLabel}
              <ArrowRight size={16} />
            </a>
            <a href="tel:+493412617790" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              <Phone size={16} />
              0341 - 261 77 90
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
