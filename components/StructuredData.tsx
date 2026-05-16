import React from 'react';

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': ['LocalBusiness', 'AutoRepair', 'AutoBodyShop'],
  name: 'CarCare Leipzig',
  legalName: 'BS CarCare GmbH',
  description:
    'Premium-Partner für Fahrzeugaufbereitung, Unfallinstandsetzung, Lackpflege und Schadenabwicklung in Leipzig.',
  url: 'https://www.carcare-center.de/',
  telephone: '+49 341 261 77 90',
  faxNumber: '+49 341 962 74 87',
  email: 'info@carcare-center.de',
  image: 'https://images.unsplash.com/photo-1601362840469-51e4d8d58785?q=80&w=2500&auto=format&fit=crop',
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

const services = {
  '@context': 'https://schema.org',
  '@type': 'ItemList',
  itemListElement: [
    { '@type': 'Service', name: 'Fahrzeugaufbereitung', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
    { '@type': 'Service', name: 'Unfallinstandsetzung', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
    { '@type': 'Service', name: 'Lackpflege & Politur', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
    { '@type': 'Service', name: 'Hagelschadenreparatur', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
    { '@type': 'Service', name: 'Leasingrückgabe-Aufbereitung', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
    { '@type': 'Service', name: 'Fahrzeugdesinfektion', provider: { '@type': 'LocalBusiness', name: 'CarCare Leipzig' } },
  ].map((s, idx) => ({ '@type': 'ListItem', position: idx + 1, item: s })),
};

const faqPage = {
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: [
    {
      '@type': 'Question',
      name: 'Was bietet CarCare Leipzig an?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CarCare Leipzig bietet Fahrzeugaufbereitung, Unfallinstandsetzung, Lackpflege, Hagelschaden- und Schadenabwicklung für Privat- und Geschäftskunden.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wo befindet sich CarCare?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'CarCare ist zentral in Leipzig, An den Tierkliniken 42, 04103 Leipzig.',
      },
    },
    {
      '@type': 'Question',
      name: 'Übernimmt CarCare die Schadenabwicklung mit der Versicherung?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, CarCare unterstützt bei der direkten Schadenabwicklung mit Versicherungen und Agenturen.',
      },
    },
    {
      '@type': 'Question',
      name: 'Können Geschäftskunden Rahmenverträge abschließen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Ja, für Autohäuser, Fuhrparks und Versicherungsagenturen sind Rahmenverträge und strukturierte Prozesse möglich.',
      },
    },
    {
      '@type': 'Question',
      name: 'Wie kann ich einen Termin anfragen?',
      acceptedAnswer: {
        '@type': 'Answer',
        text: 'Termine können telefonisch unter 0341 - 261 77 90 oder über das Kontaktformular auf carcare-center.de angefragt werden.',
      },
    },
  ],
};

const StructuredData: React.FC = () => {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusiness) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(services) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }} />
    </>
  );
};

export default StructuredData;
