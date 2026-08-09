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

/**
 * Unternehmensseite auszeichnen.
 *
 * Nur Angaben, die auf `/ueber-uns` auch sichtbar stehen (SEO-GEO-STANDARDS.md §5):
 * Gruendungsjahr 1993, ueber 50 Mitarbeiter, Meisterbetrieb, Glasurit-Lackpartner.
 * `foundingDate` und `numberOfEmployees` sind die Angaben, die KI-Antwortsysteme bei
 * „wie gross/alt ist der Betrieb" am ehesten uebernehmen.
 */
export const aboutPageSchema = (path: string, description: string) => ({
  '@context': 'https://schema.org',
  '@type': 'AboutPage',
  url: absoluteUrl(path),
  name: 'Über uns — BS CarCare GmbH',
  description,
  mainEntity: {
    '@type': 'AutoRepair',
    name: 'CarCare Center Leipzig',
    legalName: 'BS CarCare GmbH',
    url: siteUrl,
    telephone: '+49 341 261 77 90',
    email: 'info@carcare-center.de',
    address: localBusiness.address,
    geo: localBusiness.geo,
    areaServed: localBusiness.areaServed,
    foundingDate: '1993',
    numberOfEmployees: { '@type': 'QuantitativeValue', minValue: 50 },
    knowsAbout: [
      'Karosserieinstandsetzung',
      'Fahrzeuglackierung',
      'Smart Repair',
      'Dellenentfernung',
      'Hagelschadenreparatur',
      'Felgenreparatur',
      'Autoglas',
      'Fahrzeugaufbereitung',
      'Leasingrückgabe-Vorbereitung',
    ],
  },
});

export const serviceSchema = (name: string, description: string, path: string) => ({
  '@context': 'https://schema.org',
  '@type': 'Service',
  name,
  description,
  url: absoluteUrl(path),
  areaServed: { '@type': 'City', name: 'Leipzig' },
  provider: { '@type': 'AutoRepair', name: 'CarCare Center Leipzig', url: siteUrl },
});

/**
 * Preise maschinenlesbar auszeichnen.
 *
 * WARUM: Konkrete Preise sind der Teil einer Leistungsseite, den KI-Antwortsysteme am
 * ehesten uebernehmen — sie zitieren Zahlen, keine Werbeadjektive. Die Pakete stehen
 * sichtbar auf der Seite; Schema bildet nur ab, was dort auch steht (§5).
 *
 * `price` erwartet einen reinen Zahlenwert als String ("169.00"). Pakete mit „ab"-Preis
 * werden ueber `minPrice` als `PriceSpecification` ausgezeichnet, nicht als Fixpreis —
 * sonst behauptet das Markup einen Endpreis, den es nicht gibt.
 */
export const offerCatalogSchema = (
  name: string,
  path: string,
  offers: Array<{ description: string; from?: boolean; name: string; price: string }>
) => ({
  '@context': 'https://schema.org',
  '@type': 'OfferCatalog',
  name,
  url: absoluteUrl(path),
  itemListElement: offers.map((offer, index) => ({
    '@type': 'Offer',
    position: index + 1,
    name: offer.name,
    description: offer.description,
    priceCurrency: 'EUR',
    ...(offer.from
      ? { priceSpecification: { '@type': 'PriceSpecification', minPrice: offer.price, priceCurrency: 'EUR', valueAddedTaxIncluded: true } }
      : { price: offer.price }),
    availability: 'https://schema.org/InStock',
    seller: { '@type': 'AutoRepair', name: 'CarCare Center Leipzig', url: siteUrl },
    areaServed: { '@type': 'City', name: 'Leipzig' },
  })),
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
