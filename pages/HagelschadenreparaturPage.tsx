import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

const leistungen = [
  { title: 'Kalkulation mit Audatex', description: 'Kalkulation des Schadens mit dem durch Versicherer und Gutachter anerkannten System Audatex.' },
  { title: 'Komplette Schadenabwicklung', description: 'Auf Wunsch sprechen wir mit Ihrem Gutachter bzw. Ihrer Versicherung und wickeln das gesamte Schadensereignis für Sie ab.' },
  { title: 'Keine Anzahlung nötig', description: 'Wir rechnen direkt mit der Versicherung ab – Sie müssen nicht in Vorleistung gehen.' },
  { title: 'Lackfreie Instandsetzung', description: 'Hageldellen werden bei intaktem Lack lackfrei entfernt und in den Originalzustand versetzt.', href: '/dellenentfernung-leipzig' },
];

const usp = [
  { title: 'Komplette Versicherungsabwicklung', description: 'Unfall- und Versicherungsabwicklung inklusive Kostenvoranschlag und Werkstattersatzfahrzeug.' },
  { title: 'Glasurit-Lackpartner', description: 'Wo lackiert werden muss, arbeiten wir als Glasurit-Lackpartner farbtongenau.' },
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung mit Schäden aller Art seit 1998 – Karosserie und Lack aus einer Hand.' },
];

const HagelschadenreparaturPage: React.FC = () => (
  <ServiceLayout
    route="/hagelschadenreparatur-leipzig"
    meta={{
      title: 'Hagelschadenreparatur Leipzig | Audatex | CarCare Center',
      description:
        'Hagelschadenreparatur in Leipzig: Wir versetzen Ihr Fahrzeug in den Originalzustand – Kalkulation mit Audatex, komplette Abwicklung mit Versicherung und Gutachter, keine Anzahlung.',
    }}
    hero={{
      eyebrow: 'Hagelschadenreparatur Leipzig',
      title: 'Hagelschadenreparatur in Leipzig.',
      description:
        'Sie sind mit Ihrem Fahrzeug in einen Hagelschauer gekommen? Kein Problem! Wir helfen Ihnen dabei, dass Ihr Fahrzeug wieder in den Originalzustand versetzt wird – inklusive Kalkulation und Abwicklung mit Ihrer Versicherung.',
      primaryCta: { label: 'Hagelschaden melden', href: '/kontakt#contact-schaden' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Hagelschadenreparatur Leipzig', 'Hagelschaden Auto Leipzig', 'Hageldellen entfernen Leipzig'],
    }}
    /*
      TODO 1.15 – Erklärtext ausstehend, Zulieferung André (Backlog 1.29)

      Zwei bis drei Absätze auf die Frage „Was ist Hagelschadenreparatur?“ — was das
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
      eyebrow: 'Unsere Leistungen für Sie',
      title: 'Von der Kalkulation bis zur Versicherungsabwicklung.',
      items: leistungen,
    }}
    usp={{ title: 'Meisterbetrieb mit kompletter Versicherungsabwicklung.', items: usp }}
    faq={{ title: 'Häufige Fragen zur Hagelschadenreparatur.' }}
    cta={{
      title: 'Hagelschaden in Leipzig? Wir wickeln alles für Sie ab.',
      description:
        'Melden Sie den Schaden mit den wichtigsten Informationen – wir kalkulieren mit Audatex und rechnen direkt mit Ihrer Versicherung ab.',
      primaryLabel: 'Hagelschaden jetzt melden',
      primaryHref: '/kontakt#contact-schaden',
    }}
  />
);

export default HagelschadenreparaturPage;
