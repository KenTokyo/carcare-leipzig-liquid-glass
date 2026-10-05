import React from 'react';
import ServiceLayout from '../components/ServiceLayout';
import { videoPlatz } from '../data/videos';

/**
 * LEISTUNGSUMFANG ALS ZUSAMMENHAENGENDER TEXT (Backlog 6.11, Meeting 2026-09-28).
 *
 * Bis dahin sechs Textkarten (Spot-Repair, Komplettlackierung, Stossfaenger, Motorhaube, Radlauf, farbtongenaue
 * Angleichung). Ali im Meeting: Die Karten braeuchten keine eigenen Bilder, Lackierbilder und -videos gebe es genug —
 * der Inhalt solle als saubere, zusammenhaengende Leistungsbeschreibung stehen. André hat nicht widersprochen.
 * INHALT UNVERAENDERT, nur verbunden. Neu ist allein „Motorradteile": Gegenstand bleibt das Fahrzeug, dazu
 * Motorradteile — andere Objekte bewusst nicht („Trödel, der kommt so schon zur Tür rein").
 *
 * ANDRES TEXTE VOM 2026-10-05 (Nachtrag 6.11, vom User weitergegeben): Motorradteile wieder gestrichen („Motorrad
 * lassen wir gekonnt weg!“). Typische Faelle und farbliche Angleichung in seinem Wortlaut, nur grammatisch gefasst
 * („Front/Heck-Stoßfänger“ → „Front- und Heckstoßfänger“, „Eine notwendige … Angleichung entscheidet …“ → „Über eine
 * notwendige … Angleichung entscheidet …“). Im dritten Absatz „und einer digitalen Farbtonanalyse“ ergaenzt.
 *
 * PREIS (6.25, Mail André 2026-09-28): „Einheitliche Angabe — Preis nach Aufwand" fuer Neu- und
 * Reparaturlackierung. Sichtbar unter dem Text und als FAQ (das FAQ-Schema zieht daraus mit).
 */
const leistungsbeschreibung = [
  'Wir übernehmen Neu- und Reparaturlackierungen an Fahrzeugen aller Marken. Bevorzugt arbeiten wir mit Spot-Repair, der möglichst perfekten Lackinstandsetzung mit geringem Aufwand: Dabei bearbeiten wir nur die beschädigte Stelle statt des ganzen Bauteils.',
  'Reicht Spot-Repair nicht aus, lackieren wir das komplette Bauteil unter modernen Bedingungen mit bestmöglichem Ergebnis. Typische Fälle sind Front- und Heckstoßfänger nach Anfahrbeschädigungen, Frontklappen mit Steinschlägen, verkratzte Seitenwände, Radläufe und Außenspiegel. Über eine notwendige farbliche Angleichung entscheidet der jeweilige Auslesewert des Farbtones. Sie erfolgt nach Absprache.',
  'Maßstab jeder Lackierung ist die farbtongenaue Angleichung: Weder Farbton noch Effekt sollen sich für das Auge von der Originallackierung unterscheiden. Dafür arbeiten wir als Glasurit-Lackpartner mit umweltschonenden Wasserbasislacken und einer digitalen Farbtonanalyse.',
];

const usp = [
  { title: 'Glasurit-Lackpartner', description: 'Farbtongenaue, makellose Reparaturen mit langlebigem Premium-Finish und umweltschonenden Wasserbasislacken.' },
  { title: 'Meisterbetrieb seit 1998', description: 'Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk, seit 1998 am Markt. Lackierung ist unser Kernhandwerk.' },
  { title: 'Full-Service auf über 3.500 m²', description: 'Reicht Spot-Repair nicht aus, folgt die Komplettlackierung in derselben Halle, ohne Ortswechsel.' },
];

/** Seitenhintergrund als Video (Backlog 6.12): derselbe Film wie auf der Startseitenkarte, eigener Querschnitt. */
const hintergrund = videoPlatz('lackierung-hintergrund');

const AutolackierungPage: React.FC = () => (
  <ServiceLayout
    route="/autolackierung-leipzig"
    meta={{
      title: 'Neu- & Reparaturlackierung Leipzig | CarCare Center',
      description:
        'Neu- und Reparaturlackierung in Leipzig: Ziel ist die unsichtbare Reparatur ohne Farbton- oder Effektunterschied zur Originallackierung. Glasurit-Lackpartner.',
    }}
    hero={{
      eyebrow: 'Neu- und Reparaturlackierung Leipzig',
      title: 'Neu- und Reparaturlackierung in Leipzig.',
      description:
        'Zu einer fachgerechten Lackierung gehört, dass weder Farbton noch Effektunterschiede zur Originallackierung für das menschliche Auge zu erkennen sind. Unser Ziel ist die unsichtbare Reparatur Ihres Fahrzeuges.',
      primaryCta: { label: 'Lackierung anfragen', href: '/kontakt#contact-termin' },
      secondaryCta: { label: 'Direkt anrufen', href: 'tel:+493412617790' },
      keywords: ['Autolackierung Leipzig', 'Reparaturlackierung Leipzig', 'Spot-Repair Leipzig'],
    }}
    hintergrundVideo={hintergrund.quelle && hintergrund.poster ? { quelle: hintergrund.quelle, standbild: hintergrund.poster } : null}
    /*
      TODO 1.15 – Erklärtext ausstehend, Zulieferung André (Backlog R3)

      Zwei bis drei Absätze auf die Frage „Was ist Neu- und Reparaturlackierung?“ — was das
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
      title: 'Von Spot-Repair bis zur Komplettlackierung.',
      fliesstext: {
        absaetze: leistungsbeschreibung,
        preis: {
          wert: 'Preis nach Aufwand',
          hinweis: 'Den Preis nennen wir Ihnen nach der Besichtigung im Kostenvoranschlag. Im Versicherungsfall stimmen wir uns auf Wunsch mit Versicherung und Gutachter ab.',
        },
      },
    }}
    usp={{ title: 'Glasurit-Lackpartner und Meisterbetrieb seit 1998.', items: usp }}
    faq={{ title: 'Häufige Fragen zur Lackierung.' }}
    cta={{
      title: 'Lackschaden in Leipzig? Wir beraten Sie zur unsichtbaren Reparatur.',
      description:
        'Beschreiben Sie Ihr Anliegen oder senden Sie Fotos. Wir prüfen, ob Spot-Repair ausreicht oder eine Komplettlackierung sinnvoll ist.',
      primaryLabel: 'Lackierung anfragen',
      primaryHref: '/kontakt#contact-termin',
    }}
  />
);

export default AutolackierungPage;
