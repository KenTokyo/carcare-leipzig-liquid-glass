import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

/**
 * Hub-Seite des Reparatur-Strangs (Unfall, Karosserie, Lack, Rad und Glas).
 *
 * Zeigt die sieben Reparaturleistungen als beschriebene, verlinkte Karten und fuehrt
 * von dort in die jeweiligen Detailseiten. Der Ablauf ist wortgleich zur Schadenreise
 * auf der Startseite (`components/AccidentDamageSection.tsx`) — Mainpage und Hub
 * duerfen den Prozess nicht unterschiedlich beschreiben.
 */

/**
 * Die sieben Karten. Reihenfolge wie vom Betrieb vorgegeben.
 *
 * Bewusst mit eigenen, laengeren Beschreibungen statt der kurzen Katalogtexte aus
 * `data/services.ts`: Hier ist Platz fuer das fachliche „Wann greift was", das die
 * Kachel auf der Startseite nicht hat. Die erste Karte traegt keinen Link — sie
 * beschreibt den Schadenprozess dieser Seite selbst (kein Selbstverweis).
 */
const repairServices = [
  {
    title: 'Unfallinstandsetzung',
    description: 'Der komplette Schadenfall aus einer Hand: Schadenaufnahme, Kalkulation, Karosseriearbeiten, Reparaturlackierung und die Abstimmung mit Versicherung und Gutachter — bis zur dokumentierten Übergabe.',
  },
  {
    title: 'Neu- und Reparaturlackierung',
    description: 'Farbtongenaue Lackierung als Glasurit-Lackpartner. Ziel ist die unsichtbare Reparatur: weder Farbton noch Effektunterschiede zur Originallackierung sollen erkennbar sein. Wo Spot-Repair nicht ausreicht, folgt die Komplettlackierung des Bauteils.',
    href: '/autolackierung-leipzig',
  },
  {
    title: 'Smart Repair',
    description: 'Punktuelle Lackinstandsetzung mit geringem Aufwand. Statt das ganze Bauteil zu lackieren, wird gezielt nur der betroffene Bereich bearbeitet — unsere bevorzugte Methode bei kleineren Lack- und Kunststoffschäden.',
    href: '/smart-repair-leipzig',
  },
  {
    title: 'Dellenentfernung',
    description: 'Lackierfreie Instandsetzung bei Parkplatzdellen und Hageldellen. Voraussetzung ist ein unbeschädigter Lack. Die Methode ist von allen Versicherungen und Gutachtern anerkannt und im Nachhinein nicht nachweisbar — es entsteht keine Wertminderung.',
    href: '/dellenentfernung-leipzig',
  },
  {
    title: 'Hagelschadenreparatur',
    description: 'Strukturierte Hilfe nach Hagelereignissen: Kalkulation über das von Versicherern und Gutachtern anerkannte System Audatex, komplette Abwicklung mit Ihrer Versicherung — ohne Anzahlung. Bei intaktem Lack werden die Dellen lackfrei entfernt.',
    href: '/hagelschadenreparatur-leipzig',
  },
  {
    title: 'Felgenreparatur',
    description: 'TÜV-zertifiziertes Alufelgenreparaturverfahren als Wheel-Doctor-Fachbetrieb. Bordstein- und Korrosionsschäden bis 1 mm Tiefe im Grundmetall lassen sich beheben — auch an glanzgedrehten Felgen. Eingriffe ins Materialgefüge lehnen wir ab.',
    href: '/felgenreparatur-leipzig',
  },
  {
    title: 'Autoglas & Scheibenfolien',
    description: 'Steinschlagreparatur, Neuverglasung für PKW, LKW und Bus sowie Folierungen aller Art. Als WINTEC-Partner mit 30 Jahren Garantie auf die Reparatur und die Dichtigkeit ausgetauschter Scheiben.',
    href: '/autoglas-leipzig',
  },
];

const caseHandling = [
  { title: 'Schadenaufnahme', description: 'Erfassung des Schadens vor Ort oder anhand Ihrer Fotos, inklusive Dokumentation von Umfang und Hergang.' },
  { title: 'Schadenskalkulation', description: 'Nachvollziehbare Kalkulation als Grundlage für Reparatur, Freigabe und weitere Abstimmung.' },
  { title: 'Gutachterservice', description: 'Koordination und Kommunikation mit Gutachtern, sofern das für den Schadenfall sinnvoll ist.' },
  { title: 'Versicherungsabwicklung', description: 'Auf Wunsch übernehmen wir Schriftverkehr und Abstimmung mit Versicherern und Agenturen.' },
  { title: 'Karosseriearbeiten', description: 'Fachgerechte Instandsetzung beschädigter Karosserie- und Anbauteile im eigenen Haus.' },
  { title: 'Ersatzmobilität', description: 'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit ein Werkstattersatzfahrzeug.' },
  { title: 'Dokumentation', description: 'Nachvollziehbare Dokumentation der Schritte und saubere Übergabe nach Abschluss.' },
  { title: 'Alle Marken', description: 'Als markenunabhängiger Meisterbetrieb bearbeiten wir alle Fabrikate.' },
];

/**
 * Wortgleich zur Schadenreise auf der Startseite
 * (`components/AccidentDamageSection.tsx`, mit der Geschaeftsfuehrung abgestimmt).
 */
const steps = [
  { title: 'Schaden melden', description: 'Melden Sie Ihren Unfallschaden online über unser Formular – mit Fahrzeugdaten, Schadenart, Fotos und Angaben zur Versicherung. Telefonisch geht es genauso.' },
  { title: 'Schadenaufnahme', description: 'Wir erfassen den Schaden – vor Ort oder anhand Ihrer Fotos – und dokumentieren Umfang und Hergang für die weitere Bearbeitung.' },
  { title: 'Gutachten & Kalkulation', description: 'Auf Wunsch stimmen wir uns mit einem Gutachter ab und erstellen eine nachvollziehbare Kostenkalkulation für die Reparatur.' },
  { title: 'Versicherungsabwicklung', description: 'Wir übernehmen die Kommunikation mit Ihrer Versicherung und kümmern uns um den Schriftverkehr rund um den Schadenfall.' },
  { title: 'Ersatzwagen nach Verfügbarkeit', description: 'Damit Sie mobil bleiben, organisieren wir nach Verfügbarkeit einen Ersatzwagen für die Dauer der Reparatur.' },
];

const audiences = [
  { title: 'Privatkunden', description: 'Schnelle Orientierung nach einem Unfall und persönliche Betreuung bis zur Übergabe.', href: '/privatkunden' },
  { title: 'Versicherungen & Agenturen', description: 'Strukturierte Schadenaufnahme, Audatex-Kalkulation und klare Kommunikation im Reparaturprozess.', href: '/geschaeftskunden' },
  { title: 'Autohäuser & Fuhrparks', description: 'Planbare Abläufe, kurze Wege und transparente Reparaturkommunikation für Flotten.', href: '/geschaeftskunden' },
];

const AccidentRepairPage: React.FC = () => (
  // Motiv der Kachel „Unfallinstandsetzung" aus der Leistungsuebersicht.
  <BackdropLayout image="/assets/kacheln/versicherung-schadenabwicklung-leipzig-carcare.webp">
    <PageMeta
      canonical="/unfallinstandsetzung-leipzig"
      title="Unfallinstandsetzung Leipzig | Karosserie, Lack & Smart Repair"
      description="Unfallinstandsetzung in Leipzig: Schadenaufnahme, Kalkulation, Karosserie, Lackierung, Smart Repair, Dellen, Hagel, Felgen und Autoglas — inklusive Versicherungsabwicklung."
    />
    <PageHero
      eyebrow="Unfallinstandsetzung Leipzig"
      title="Unfallschaden in Leipzig? Wir reparieren und begleiten Ihren Schadenfall."
      description="Vom ersten Kontakt bis zur Fahrzeugübergabe: Schadenaufnahme, Kalkulation, Karosseriearbeiten und Reparaturlackierung im eigenen Haus — als Meisterbetrieb und Glasurit-Lackpartner, auf Wunsch inklusive kompletter Versicherungsabwicklung."
      primaryCta={{ label: 'Schaden melden', href: '/kontakt#contact-schaden' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Unfallschaden Leipzig', 'Karosseriebau Leipzig', 'Autolackierung Leipzig', 'Schadenabwicklung Leipzig']}
    />

    <section id="reparaturleistungen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Reparaturleistungen"
          title="Welche Reparatur Ihr Fahrzeug braucht – und was dahintersteckt."
          description="Von der kompletten Unfallinstandsetzung bis zur punktuellen Reparatur an Lack, Delle, Felge oder Scheibe. Wir empfehlen grundsätzlich die kleinere Lösung, wo sie fachlich ausreicht."
        />
        <FeatureGrid items={repairServices} columns="four" />
      </div>
    </section>

    <section id="schadenfall" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Leistungen im Schadenfall"
          title="Alles Wichtige für die Reparatur Ihres Unfallschadens."
          description="Wir bündeln technische Reparatur, persönliche Betreuung und strukturierte Abstimmung in einem Prozess."
        />
        <FeatureGrid items={caseHandling} columns="four" />
      </div>
    </section>

    <section id="ablauf" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Ablauf"
          title="So läuft die Unfallinstandsetzung bei uns."
          description="Von der Schadenmeldung bis zum Ersatzwagen – in fünf klaren Schritten, aus einer Hand."
        />
        <ProcessList steps={steps} />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Zielgruppen" title="Für Privatkunden, Versicherungen und gewerbliche Flotten." />
        <FeatureGrid items={audiences} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Unfallinstandsetzung." />
        <PageFAQ route="/unfallinstandsetzung-leipzig" />
      </div>
    </section>

    <PageCTA
      title="Unfallschaden in Leipzig? Wir nehmen den Fall auf."
      description="Senden Sie die wichtigsten Informationen direkt an uns oder rufen Sie an, wenn es schnell gehen muss."
      primaryLabel="Schaden jetzt melden"
      primaryHref="/kontakt#contact-schaden"
    />
  </BackdropLayout>
);

export default AccidentRepairPage;
