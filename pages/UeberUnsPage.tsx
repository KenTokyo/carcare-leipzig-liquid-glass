import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

/**
 * Unternehmensseite „Ueber uns" — stellt die BS CarCare GmbH vor.
 *
 * AUFTRAG (User, 2026-08-09): Ziel der Karte „Schadenpartner kennenlernen" aus der
 * Zielgruppen-Sektion. Soll den Betrieb als grossen, leistungsfaehigen Karosserie- und
 * Lackierbetrieb in Leipzig zeigen und gleichzeitig auf DREI Zielgruppen einzahlen:
 * neue Mitarbeiter, Geschaeftspartner und Neukunden. Daher je ein eigener Abschnitt.
 *
 * TEXTQUELLE: `components/About.tsx` (verwaiste Komponente, aber echte Kundentexte) —
 * uebernommen und um die im Projekt belegten Betriebsfakten ergaenzt. Die Komponente
 * bleibt unangetastet im Repo.
 *
 * ⚠️ FORMULIERUNG „groesster und bester": Der User hat diese Positionierung beauftragt.
 * Eine unbelegte Alleinstellungsbehauptung ist nach UWG §5 abmahnfaehig, deshalb steht
 * hier die belegbare Variante („einer der groessten") plus die harten Fakten, die die
 * Aussage selbst tragen. Umstellung auf den harten Superlativ ist eine Einzeilaenderung,
 * sobald die Belegbarkeit bestaetigt ist. Siehe docs/subpages-verlinkung/tasks/.
 *
 * ⚠️ NICHT uebernommen: die Angabe „10 Standorte" aus `About.tsx`. Sie ist nirgends
 * belegt und widerspricht dem Ein-Standort-`LocalBusiness`-Schema. Nachtragen ist eine
 * Einzeilaenderung, sobald der User sie bestaetigt.
 */

const facts = [
  { title: 'Seit 1998 am Markt', description: 'Erfahrung im Kfz-Lackier- und Karosseriehandwerk seit 1998 — gewachsen mit den Fahrzeugen, Materialien und Reparaturverfahren, die heute Standard sind.' },
  { title: 'Über 3.000 m² Betriebsfläche', description: 'Lackierung, Karosserie, Smart Repair, Felgen, Glas und Aufbereitung liegen unter einem Dach. Fahrzeuge werden zwischen den Arbeitsschritten nicht an Fremdbetriebe weitergereicht.' },
  { title: 'Über 50 Mitarbeiter', description: 'Eingespielte Teams mit klaren Abläufen. Die Betriebsgröße erlaubt es, mehrere Fahrzeuge parallel zu bearbeiten — auch bei größeren Aufträgen aus Fuhrparks und Autohäusern.' },
  { title: 'Alle Fabrikate', description: 'Markenunabhängiger Meisterbetrieb des Kfz-Lackierhandwerks — vom Kleinwagen bis zum Premiumfahrzeug, ohne Bindung an eine Vertragswerkstatt.' },
];

const qualifications = [
  { title: 'Meisterbetrieb des Kfz-Lackierhandwerks', description: 'Handwerkliche Qualifikation als Grundlage jeder Reparatur — mit Ausbildung im eigenen Betrieb und fachlicher Verantwortung für das Ergebnis.' },
  { title: 'Glasurit-Lackpartner', description: 'Zugang zur Farbtontechnologie von Glasurit. Ziel jeder Lackreparatur ist, dass weder Farbton noch Effektunterschiede zur Originallackierung für das Auge erkennbar sind — mit umweltschonenden Wasserbasislacken.' },
  { title: 'WINTEC-Partner für Autoglas', description: 'Scheibentausch und Steinschlagreparatur nach ISO 9001, TÜV-zertifiziert, mit 30 Jahren Garantie auf die Verglasung.' },
  { title: 'TÜV-zertifizierte Felgenreparatur', description: 'Bordstein- und Korrosionsschäden bis 1 mm Tiefe werden im geprüften Verfahren instand gesetzt — auch an glanzgedrehten Felgen.' },
  { title: 'Audatex-Kalkulation', description: 'Schadenkalkulation mit dem von Versicherern und Gutachtern anerkannten System. Das macht Aufwand und Kosten für alle Beteiligten nachvollziehbar.' },
  { title: 'Komplette Unfall- und Versicherungsabwicklung', description: 'Von der Schadenaufnahme über Kostenvoranschlag und Abstimmung mit Versicherern und Gutachtern bis zur Freigabe — auf Wunsch inklusive Werkstattersatzfahrzeug.' },
];

const spectrum = [
  { title: 'Karosserie & Unfallinstandsetzung', description: 'Instandsetzung nach Unfallschäden, von der Schadenaufnahme bis zur fertigen Übergabe.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Neu- und Reparaturlackierung', description: 'Farbtongenaue Lackierung als Glasurit-Lackpartner, mit dem Ziel der unsichtbaren Reparatur.', href: '/autolackierung-leipzig' },
  { title: 'Smart Repair & Dellenentfernung', description: 'Punktgenaue Lackinstandsetzung und lackfreies Ausdrücken von Dellen — instand setzen statt tauschen.', href: '/smart-repair-leipzig' },
  { title: 'Hagelschadenreparatur', description: 'Audatex-Kalkulation und direkte Abrechnung mit der Versicherung, ohne Anzahlung.', href: '/hagelschadenreparatur-leipzig' },
  { title: 'Felgen & Autoglas', description: 'Felgenreparatur im TÜV-zertifizierten Verfahren, Scheibentausch und Steinschlagreparatur als WINTEC-Partner.', href: '/felgenreparatur-leipzig' },
  { title: 'Fahrzeugaufbereitung', description: 'Innen, außen und Lack mit festen Paketpreisen ab 169,00 € — bis zur Premiumpflege mit SWIZÖL-Wachsen.', href: '/fahrzeugaufbereitung-leipzig' },
];

const customers = [
  { title: 'Werksniederlassungen und Autohäuser', description: 'Wir betreuen Werksniederlassungen deutscher Premiumhersteller sowie Autohäuser — mit planbaren Abläufen für Präsentation, Übergabe und Fahrzeugbestand.', href: '/geschaeftskunden' },
  { title: 'Firmenfuhrparks', description: 'Wiederkehrende Pflege, Instandsetzung und Werterhaltung für gewerbliche Flotten, mit festem Ansprechpartner statt wechselnder Zuständigkeiten.', href: '/fuhrparkservice-leipzig' },
  { title: 'Versicherungen und Agenturen', description: 'Schadenaufnahme, Audatex-Kalkulation und Instandsetzung aus einer Hand — instand setzen statt tauschen, wo es fachlich vertretbar ist.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Anspruchsvolle Privatkunden', description: 'Vom Parkplatzrempler bis zur Premiumpflege: ein Ansprechpartner für Pflege, Reparatur und Lackierung.', href: '/privatkunden' },
];

const employer = [
  { title: 'Handwerk mit sichtbarem Ergebnis', description: 'Am Ende jedes Auftrags steht ein Fahrzeug, dem man die Arbeit ansieht — oder bei einer gelungenen Lackreparatur eben gerade nicht.' },
  { title: 'Vier Berufsbilder unter einem Dach', description: 'Kfz-Aufbereiter, Fahrzeuglackierer, Karosserie- und Fahrzeugbaumechaniker sowie Serviceberater arbeiten am selben Standort zusammen.' },
  { title: 'Moderne Technik und Materialien', description: 'Arbeit mit Glasurit-Wasserbasislacken, TÜV-zertifizierten Reparaturverfahren und Audatex — Technik, die im Handwerk aktuell ist.' },
  { title: 'Beständigkeit', description: 'Wir bestehen seit 1998 und beschäftigen über 50 Menschen — das bietet ein anderes Maß an Planbarkeit als ein junger Kleinbetrieb.' },
];

const history = [
  { title: '1998 — Gründung', description: 'Start als Betrieb des Kfz-Lackierhandwerks in Leipzig. Der Meisterbrief ist von Anfang an die fachliche Grundlage.' },
  { title: 'Ausbau zum Full-Service-Betrieb', description: 'Karosserie, Smart Repair, Dellenentfernung, Felgen und Autoglas kommen zur Lackierung hinzu — damit ein Fahrzeug den Betrieb für keinen Arbeitsschritt verlassen muss.' },
  { title: 'Aufbereitung als eigener Bereich', description: 'Die Fahrzeugaufbereitung wächst vom Zusatz zur eigenständigen Leistung mit festen Paketen, Desinfektionsverfahren und Leasingrückgabe-Vorbereitung.' },
  { title: 'Heute — über 3.000 m² in Leipzig', description: 'Über 50 Mitarbeiter betreuen Privatkunden, Autohäuser, Fuhrparks, Versicherungen und Werksniederlassungen deutscher Premiumhersteller.' },
];


const UeberUnsPage: React.FC = () => (
  // Werkstattmotiv statt Kachelbild: Diese Seite zeigt den Betrieb selbst, nicht eine
  // einzelne Leistung. `carcare-hero-workshop.webp` ist mit 2400x1800 hoch genug
  // aufgeloest, dass die Backdrop-Flaeche ohne `zoom` auskommt.
  <BackdropLayout image="/assets/carcare-hero-workshop.webp">
    <PageMeta
      canonical="/ueber-uns"
      title="Über uns | Karosserie & Lack Leipzig | CarCare Center"
      description="BS CarCare GmbH in Leipzig: Meisterbetrieb seit 1998, Glasurit-Lackpartner, über 50 Mitarbeiter auf über 3.000 m² – Karosserie, Lack und Aufbereitung im Haus."
    />
    <PageHero
      eyebrow="Über uns"
      title="Einer der größten Karosserie- und Lackierbetriebe in Leipzig."
      description="Seit 1998 sind wir Meisterbetrieb des Kfz-Lackierhandwerks. Auf über 3.000 m² bearbeiten über 50 Mitarbeiter Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung — für Privatkunden, Autohäuser, Fuhrparks, Versicherungen und Werksniederlassungen deutscher Premiumhersteller."
      primaryCta={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Karosseriebetrieb Leipzig', 'Lackiererei Leipzig', 'Meisterbetrieb Leipzig', 'Glasurit-Lackpartner']}
    />

    {/* Antwort-zuerst (SEO-GEO §4.3): Die pruefbaren Kennzahlen stehen vor jeder
        Selbstbeschreibung — sie tragen die Positionierung, nicht Adjektive. */}
    <section id="zahlen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Der Betrieb in Zahlen"
          title="Was uns zu einem der größten Betriebe der Region macht."
          description="Nicht die Selbstbeschreibung, sondern Fläche, Belegschaft, Betriebsdauer und Leistungstiefe. Diese vier Punkte sind der Unterschied zum spezialisierten Kleinbetrieb."
        />
        <FeatureGrid items={facts} columns="four" />
      </div>
    </section>

    <section id="leistungsspektrum" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Leistungsspektrum"
          title="Alles im eigenen Haus – vom Kratzer bis zum Totalschaden."
          description="Als Full-Service-Dienstleister decken wir die gesamte Kette ab. Für Sie heißt das: ein Ansprechpartner, ein Termin, keine Übergaben zwischen Fremdbetrieben."
        />
        <FeatureGrid items={spectrum} columns="three" />
      </div>
    </section>

    <section id="qualifikationen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Qualifikation & Partnerschaften"
          title="Woran sich die Arbeitsqualität festmachen lässt."
          description="Zertifizierungen und Herstellerpartnerschaften sind überprüfbar — anders als Qualitätsversprechen. Diese sechs stehen hinter jeder Reparatur."
        />
        <FeatureGrid items={qualifications} columns="three" />
      </div>
    </section>

    <section id="geschichte" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Entwicklung"
          title="Von der Lackiererei zum Full-Service-Betrieb."
          description="Entwicklung seit 1998 — jeder Schritt kam dazu, weil Kunden ihn gebraucht haben."
        />
        <ProcessList steps={history} />
      </div>
    </section>

    <section id="kunden" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Für wen wir arbeiten"
          title="Premiumhersteller, Fuhrparks, Versicherer – und Ihr Auto."
          description="Wir verstehen uns als Premium-Anbieter mit Fokus auf Dienstleistung auf qualitativ höchstem Niveau. Nicht ohne Grund betreuen wir vor allem Werksniederlassungen der deutschen Premiumhersteller."
        />
        <FeatureGrid items={customers} columns="four" />
      </div>
    </section>

    <section id="karriere" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Arbeiten im CarCare Center"
          title="Warum Handwerker hier anfangen – und bleiben."
          description="Ein Betrieb dieser Größe bietet, was der Kleinbetrieb nicht kann: Spezialisierung, moderne Technik und Kollegen, die dasselbe Handwerk beherrschen."
        />
        <FeatureGrid items={employer} columns="four" />
        <div className="mt-8">
          <a href="/karriere" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            Offene Stellen und Initiativbewerbung
          </a>
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zum Unternehmen." />
        <PageFAQ route="/ueber-uns" />
      </div>
    </section>

    <PageCTA
      title="Lernen Sie den Betrieb kennen."
      description="Ob als Kunde, Partnerbetrieb oder künftiger Kollege: Rufen Sie an oder schreiben Sie uns — wir zeigen Ihnen gern, wie hier gearbeitet wird."
      primaryLabel="Kontakt aufnehmen"
      primaryHref="/kontakt"
    />
  </BackdropLayout>
);

export default UeberUnsPage;
