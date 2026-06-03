import React, { useEffect } from 'react';

export interface OpenGraphMeta {
  description?: string;
  image?: string;
  title?: string;
  type?: string;
}

export interface SEOHeadProps {
  canonical?: string;
  description: string;
  noindex?: boolean;
  og?: OpenGraphMeta;
  title: string;
}

const setMeta = (selector: string, attr: 'content' | 'href', value: string) => {
  const element = document.querySelector<HTMLMetaElement | HTMLLinkElement>(selector);
  if (element) {
    element.setAttribute(attr, value);
  }
};

const ensureCanonical = (href: string) => {
  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement('link');
    canonical.rel = 'canonical';
    document.head.appendChild(canonical);
  }
  canonical.href = href;
};

const SEOHead: React.FC<SEOHeadProps> = ({ canonical, description, noindex, og, title }) => {
  useEffect(() => {
    const origin = 'https://www.carcare-center.de';
    const absoluteCanonical = canonical?.startsWith('http') ? canonical : `${origin}${canonical ?? window.location.pathname}`;
    const ogTitle = og?.title ?? title;
    const ogDescription = og?.description ?? description;
    const ogImage = og?.image ?? 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2400&auto=format&fit=crop';

    document.title = title;
    ensureCanonical(absoluteCanonical);
    setMeta('meta[name="description"]', 'content', description);
    setMeta('meta[name="robots"]', 'content', noindex ? 'noindex, nofollow' : 'index, follow');
    setMeta('meta[property="og:title"]', 'content', ogTitle);
    setMeta('meta[property="og:description"]', 'content', ogDescription);
    setMeta('meta[property="og:url"]', 'content', absoluteCanonical);
    setMeta('meta[property="og:type"]', 'content', og?.type ?? 'website');
    setMeta('meta[property="og:image"]', 'content', ogImage);
    setMeta('meta[name="twitter:title"]', 'content', ogTitle);
    setMeta('meta[name="twitter:description"]', 'content', ogDescription);
    setMeta('meta[name="twitter:image"]', 'content', ogImage);
  }, [canonical, description, noindex, og, title]);

  return null;
};

export default SEOHead;
