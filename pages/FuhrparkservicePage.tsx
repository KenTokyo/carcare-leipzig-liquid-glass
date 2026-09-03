import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

const leistungen = [
  { title: 'Regelmäßige Pflege', description: 'Wir übernehmen die laufende Pflege und Aufbereitung Ihrer Fahrzeuge.' },
  { title: 'Aufarbeitung vor Rückgabe oder Verkauf', description: 'Aufbereitung der Fahrzeuge, bevor sie zurückgegeben oder verkauft werden.' },
  { title: 'Im Schadensfall mobil', description: 'Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein.' },
  { title: 'Starke Kooperationspartner', description: 'Profitieren Sie von unseren langjährigen Kooperationspartnern aus der Automobilbranche.' },
];

const usp = [
  { title: 'Full-Service auf über 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
  { title: 'Erfahrung mit Flottenkunden', description: 'Langjährige Erfahrung mit Autohäusern, Firmenfuhrparks und Geschäftskunden.' },
  { title: 'Komplette Versicherungsabwicklung', description: 'Im Schadensfall inklusive Kostenvoranschlag und Werkstattersatzfahrzeug.' },
];

const FuhrparkservicePage: React.FC = () => (
  <ServiceLayout
    route="/fuhrparkservice-leipzig"
    meta={{
      title: 'Fuhrparkservice Leipzig | Firmenflotte | CarCare Center',
      description:
        'Fuhrparkservice in Leipzig: Betreuung Ihres Firmenfuhrparks – von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf. Im Schadensfall halten wir Sie mobil.',
    }}
    hero={{
      eyebrow: 'Fuhrparkservice Leipzig',
      title: 'Fuhrparkservice in Leipzig.',
      description:
        'Gern stehen wir Ihnen in der Betreuung Ihres Firmenfuhrparks zur Seite. Wir übernehmen von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge. Im Schadensfall halten wir Sie mobil und leiten die notwendigen Schritte ein.',
      primaryCta: { label: 'Fuhrparkservice anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Mehr für Geschäftskunden', href: '/geschaeftskunden' },
      keywords: ['Fuhrparkservice Leipzig', 'Firmenfuhrpark Leipzig', 'Flottenservice Leipzig'],
    }}
    /*
      TODO 1.15 – Erklärtext ausstehend, Zulieferung André (Backlog 1.29)

      Zwei bis drei Absätze auf die Frage „Was ist Fuhrparkservice?“ — was das
      Verfahren ist, wann es infrage kommt, wo seine Grenzen liegen. Das ist
      fachliche Aussage über Machbarkeit, keine Textarbeit.

      Die Sektion steht in `ServiceLayout` und sitzt vor der Fachsektion; das Feld
      ist Pflicht, ein Vergessen wäre ein Typfehler. `null` heisst „Text steht noch
      aus“, nicht „wird nicht gebraucht“. BEWUSST KEIN PLATZHALTER: erfundener Text
      sieht im Review wie fertiger Text aus und geht so live — gleiche Regel wie
      beim Exklusivleistungs-Block (1.18).
    */
    erklaerung={null}
    leistung={{
      eyebrow: 'Leistungsumfang',
      title: 'Rundum-Betreuung für Ihren Firmenfuhrpark.',
      description:
        'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf – sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge aus einer Hand.',
      items: leistungen,
    }}
    usp={{ title: 'Full-Service-Partner für Ihren Fuhrpark.', items: usp }}
    faq={{ title: 'Häufige Fragen zum Fuhrparkservice.' }}
    cta={{
      title: 'Planbare Betreuung für Ihren Fuhrpark?',
      description:
        'Sprechen Sie mit uns über die Betreuung Ihrer Fahrzeuge – von der regelmäßigen Pflege bis zur Schadenabwicklung.',
      primaryLabel: 'Fuhrparkservice anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default FuhrparkservicePage;
