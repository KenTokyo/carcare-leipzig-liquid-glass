import { FAQItem } from '../types';

export const siteUrl = 'https://www.carcare-center.de';

export const absoluteUrl = (path = '/') => {
  if (path.startsWith('http')) return path;
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

const organization = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'BS CarCare GmbH',
  url: siteUrl,
  telephone: '+49 341 261 77 90',
  email: 'info@carcare-center.de',
};

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'CarCare Center Leipzig',
  legalName: 'BS CarCare GmbH',
  url: siteUrl,
  telephone: '+49 341 261 77 90',
  email: 'info@carcare-center.de',
  image: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?q=80&w=2400&auto=format&fit=crop',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'An den Tierkliniken 42',
    postalCode: '04103',
    addressLocality: 'Leipzig',
    addressRegion: 'Sachsen',
    addressCountry: 'DE',
  },
  geo: {
    '@type': 'GeoCoordinates',
    latitude: 51.3303,
    longitude: 12.4087,
  },
  openingHoursSpecification: [
    {
      '@type': 'OpeningHoursSpecification',
      dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
      opens: '07:00',
      closes: '18:00',
    },
  ],
  areaServed: {
    '@type': 'City',
    name: 'Leipzig',
  },
  priceRange: '€€',
};

const autoRepair = {
  ...localBusiness,
  '@context': 'https://schema.org',
  '@type': 'AutoRepair',
  description:
    'CarCare Center Leipzig ist Ansprechpartner für Unfallinstandsetzung, Autoreparatur, Fahrzeugaufbereitung, Lackierung, Smart Repair und Schadenabwicklung in Leipzig.',
};

export const baseOrganizationSchemas = [organization, localBusiness, autoRepair];

export const serviceSchema = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: absoluteUrl(path),
  areaServed: { '@type': 'City', name: 'Leipzig' },
  provider: { '@type': 'AutoRepair', name: 'CarCare Center Leipzig', url: siteUrl },
});

export const faqSchema = (faqs: FAQItem[]) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((faq) => ({
    '@type': 'Question',
    name: faq.question,
    acceptedAnswer: {
      '@type': 'Answer',
      text: faq.answer,
    },
  })),
});

export const breadcrumbSchema = (items: Array<{ name: string; path: string }>) => ({
  '@context': 'https://schema.org',
  '@type': 'BreadcrumbList',
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    name: item.name,
    item: absoluteUrl(item.path),
  })),
});

export const jobPostingSchema = (title: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'JobPosting',
  title,
  description,
  hiringOrganization: {
    '@type': 'Organization',
    name: 'BS CarCare GmbH',
    sameAs: siteUrl,
  },
  jobLocation: {
    '@type': 'Place',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Leipzig',
      addressRegion: 'Sachsen',
      addressCountry: 'DE',
    },
  },
  employmentType: 'FULL_TIME',
});

export const articleSchema = (article: { category: string; description: string; path: string; title: string }) => ({
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: article.title,
  description: article.description,
  url: absoluteUrl(article.path),
  inLanguage: 'de-DE',
  about: article.category,
  author: {
    '@type': 'Organization',
    name: 'BS CarCare GmbH',
    url: siteUrl,
  },
  publisher: {
    '@type': 'Organization',
    name: 'BS CarCare GmbH',
    url: siteUrl,
  },
});

export const itemListSchema = (
  name: string,
  description: string,
  items: Array<{ description: string; name: string; path: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  name,
  description,
  itemListElement: items.map((item, index) => ({
    '@type': 'ListItem',
    position: index + 1,
    item: {
      '@type': 'Article',
      name: item.name,
      description: item.description,
      url: absoluteUrl(item.path),
    },
  })),
});

export const homeServiceListSchema = () => ({
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    serviceSchema('Unfallinstandsetzung Leipzig', 'Unfallschaden, Schadenskalkulation und Reparaturbegleitung in Leipzig.', '/unfallinstandsetzung-leipzig'),
    serviceSchema('Fahrzeugaufbereitung Leipzig', 'Professionelle Innen- und Außenaufbereitung, Lackpflege und Werterhalt.', '/fahrzeugaufbereitung-leipzig'),
    serviceSchema('Fuhrparkservice Leipzig', 'Planbare Fahrzeugdienstleistungen für gewerbliche Flotten.', '/geschaeftskunden'),
  ].map((item, index) => ({ '@type': 'ListItem', position: index + 1, item })),
});
