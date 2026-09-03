import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

/**
 * Leistungsseite Dellenentfernung.
 *
 * Erste Seite auf `ServiceLayout` (Backlog 1.14, 2026-09-03). Sie enthaelt seitdem nur
 * noch das, was sie von den uebrigen Leistungsseiten unterscheidet: ihre Texte und ihre
 * Karten. Geruest, Abstaende, Sektionsreihenfolge, Kartenton und der Seitenhintergrund
 * kommen aus der Komponente.
 */

const vorteile = [
  { title: 'Kosten- und Zeitersparnis', description: 'Gegenüber herkömmlichen Reparaturverfahren wie Spachteln und Lackieren.' },
  { title: 'Keine Wertminderung', description: 'Die Methode ist schonend für den Lack und im Nachhinein nicht sicht- bzw. nachweisbar.' },
  { title: 'Keine Farbunterschiede', description: 'Da nicht lackiert wird, entstehen keine Farbunterschiede zum übrigen Fahrzeug.' },
  { title: 'Keine Belastung der Umwelt', description: 'Ein umweltschonendes Verfahren ohne Spachtel- und Lackieraufwand.' },
  { title: 'Von Versicherungen anerkannt', description: 'Anerkannt von allen Versicherungen und Gutachtern.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung im Kfz-Handwerk seit 1998 – Karosserie und Lack aus einer Hand.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Lackierung, Karosserie, Smart/Spot Repair, Felgen und Fahrzeugaufbereitung aus einer Hand.' },
  { title: 'Privat-, Geschäfts- und Flottenkunden', description: 'Erfahrung mit Privatkunden, Autohäusern und Firmenfuhrparks.' },
];

const DellenentfernungPage: React.FC = () => (
  <ServiceLayout
    route="/dellenentfernung-leipzig"
    meta={{
      title: 'Dellenentfernung Leipzig | ohne Lackieren | CarCare Center',
      description:
        'Dellenentfernung ohne Lackieren in Leipzig: lackierfreie Methode bei Parkplatzdellen und Hagelschäden – keine Wertminderung, keine Farbunterschiede, von Versicherungen anerkannt.',
    }}
    hero={{
      eyebrow: 'Dellenentfernung Leipzig',
      title: 'Dellenentfernung (ohne lackieren) in Leipzig.',
      description:
        'Die lackierfreie Reparaturmethode der Dellenentfernung gilt heute als Standard bei Parkplatzdellen oder Hagelschäden. Voraussetzung ist, dass der Lack keine Beschädigungen aufweist. Durch eigens entwickelte Druck- bzw. Ziehtechniken wird das Fahrzeugteil mit speziellen Werkzeugen bearbeitet, bis der Originalzustand wieder hergestellt ist.',
      primaryCta: { label: 'Dellenentfernung anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Dellenentfernung Leipzig', 'lackfreie Dellenentfernung Leipzig', 'Parkdelle reparieren Leipzig'],
    }}
    // TODO 1.15 — eigenstaendige Erklaerung der Leistung. Text steht noch aus; bis dahin
    // bleibt das Feld ausdruecklich leer statt mit Platzhaltertext gefuellt.
    erklaerung={null}
    leistung={{
      eyebrow: 'Der Vorteil dieser Methode',
      title: 'Warum die lackfreie Dellenentfernung überzeugt.',
      items: vorteile,
    }}
    usp={{ title: 'Erfahrener Meisterbetrieb – Full-Service in Leipzig.', items: usp }}
    faq={{ title: 'Häufige Fragen zur Dellenentfernung.' }}
    cta={{
      title: 'Delle am Fahrzeug? Wir prüfen die lackfreie Instandsetzung.',
      description:
        'Zeigen Sie uns die Delle oder senden Sie Fotos – wir schätzen ein, ob der Lack intakt ist und der Originalzustand lackfrei hergestellt werden kann.',
      primaryLabel: 'Dellenentfernung anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default DellenentfernungPage;
