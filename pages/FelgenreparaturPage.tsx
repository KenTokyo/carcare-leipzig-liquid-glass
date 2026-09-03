import React from 'react';
import ServiceLayout from '../components/ServiceLayout';

/**
 * Leistungsseite Felgenreparatur.
 *
 * Zweite Seite auf `ServiceLayout` (Backlog 1.14) und bewusst die LAENGSTE der sieben:
 * 4.428 px auf dem Desktop, 6.752 px mobil, 13 Karten. Sie ist der Pruefstein dafuer,
 * ob die Gliederung ohne den frueheren Wechsel Weiss/Grau noch traegt — bei einer
 * schlanken Seite wie der Dellenentfernung faellt das nicht auf, hier schon.
 */

const scope = [
  { title: 'TÜV-zertifiziertes Verfahren', description: 'Als zertifizierter Wheel-Doctor-Fachbetrieb arbeiten wir nach den strengen gesetzlichen TÜV-Richtlinien.' },
  { title: 'Bis zu 90 % der Schäden', description: 'Bis zu 90 % der Bordstein- und Korrosionsschäden lassen sich kostengünstig beheben.' },
  { title: 'Bis 1 mm Tiefe zulässig', description: 'Beschädigungen bis zu 1 mm Tiefe im Grundmetall der Felge dürfen behoben werden.' },
  { title: 'Keine Eingriffe ins Materialgefüge', description: 'Schweißarbeiten und Rückverformungen sind gesetzlich abzulehnen und werden nicht durchgeführt.' },
  { title: 'Glanzgedrehte Felgen', description: 'Auch glanzgedrehte, im Volksmund polierte Alufelgen lassen wir wieder optisch wie neu erscheinen.' },
  { title: 'Werterhalt statt Neukauf', description: 'Statt der teuren Anschaffung neuer Originalfelgen bleibt der Wert des Fahrzeugs erhalten.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998.' },
  { title: 'Full-Service auf über 3.000 m²', description: 'Felgen, Lackierung, Karosserie, Smart/Spot Repair und Fahrzeugaufbereitung aus einer Hand.' },
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue Lackierung der Felgen für ein Ergebnis optisch wie neu.' },
];

const FelgenreparaturPage: React.FC = () => (
  <ServiceLayout
    route="/felgenreparatur-leipzig"
    meta={{
      title: 'Felgenreparatur Leipzig | TÜV-zertifiziert | CarCare Center',
      description:
        'Felgenreparatur in Leipzig: TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb – bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig behoben.',
    }}
    hero={{
      eyebrow: 'Felgenreparatur Leipzig',
      title: 'Felgenreparatur in Leipzig.',
      description:
        'Einmal versehentlich am Bordstein entlang geschrammt und schon ist die Alufelge beschädigt – nicht nur die Optik leidet, auch der Wert des Fahrzeugs sinkt. Mit unserem TÜV-zertifizierten Alufelgenreparaturverfahren beheben wir bis zu 90 % der Bordstein- und Korrosionsschäden kostengünstig.',
      primaryCta: { label: 'Felgenreparatur anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Felgenreparatur Leipzig', 'Alufelgen reparieren Leipzig', 'Bordsteinschaden Felge Leipzig'],
    }}
    /*
      TODO 1.15 – Erklärtext ausstehend, Zulieferung André (Backlog 1.29)

      Zwei bis drei Absätze auf die Frage „Was ist Felgenreparatur?“ — was das
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
      title: 'Zertifizierte Felgenreparatur als Wheel-Doctor-Fachbetrieb.',
      description:
        'Wir sind einer der zertifizierten Wheel-Doctor-Fachbetriebe und kennen alle gesetzlichen Vorgaben und strengen TÜV-Richtlinien – denn nicht in jedem Fall ist eine Felgenreparatur erlaubt.',
      items: scope,
    }}
    usp={{ title: 'Zertifizierter Meisterbetrieb – Full-Service in Leipzig.', items: usp }}
    faq={{ title: 'Häufige Fragen zur Felgenreparatur.' }}
    cta={{
      title: 'Bordsteinschaden an der Felge? Kommen Sie vorbei.',
      description:
        'Lassen Sie sich vor Ort beraten – wir prüfen, ob der Schaden nach den TÜV-Richtlinien reparabel ist, und beheben ihn kostengünstig.',
      primaryLabel: 'Felgenreparatur anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default FelgenreparaturPage;
