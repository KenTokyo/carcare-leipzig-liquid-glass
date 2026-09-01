import React from 'react';
import { ArrowRight } from 'lucide-react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';
import { dealerPartners, insurancePartners } from '../data/partners';

/**
 * Zielgruppenseite Geschaeftskunden.
 *
 * Schwerpunkt laut Auftrag: die **Zusammenarbeit** mit bestehenden Unternehmen in den
 * Vordergrund ruecken, die auf der Mainpage genannten Betriebe auffuehren, Leasingrueckgabe
 * und Fuhrparkservice hervorheben und **Schadensteuerer + Versicherungen** ausdruecklich
 * als Geschaeftskunden benennen.
 *
 * ⚠️ FORMULIERUNG BEACHTEN: Die Partnernamen stehen als **Referenz** — nicht als
 * autorisierte Vertragspartnerschaft. Ein Herstellerlogo oder eine Formulierung wie
 * „Vertragswerkstatt" waere irrefuehrend (UWG). Deshalb durchgaengig „arbeitet fuer" /
 * „wickelt Schadenfaelle ab" statt „Partner von". Logos bewusst nicht eingebunden,
 * Begruendung in `data/partners.ts`.
 */

const audiences = [
  { title: 'Autohäuser', description: 'Aufbereitung für Bestand und Präsentation, Instandsetzung vor Übergabe und verlässliche Rückmeldung zum Fahrzeugstatus.' },
  { title: 'Fuhrparks & Flotten', description: 'Wiederkehrende Pflege, Reparatur und Werterhalt für gewerbliche Fahrzeuge — mit planbaren Abläufen statt Einzelfallorganisation.' },
  { title: 'Versicherungen & Schadensteuerer', description: 'Schadenaufnahme, Audatex-Kalkulation und Instandsetzung aus einer Hand — instand setzen statt tauschen, wo es fachlich vertretbar ist.' },
  { title: 'Versicherungsagenturen', description: 'Persönliche Zusammenarbeit bei Schadenaufnahme und Kundenkommunikation, mit festem Ansprechpartner vor Ort.' },
];

/** Die zwei vom Betrieb hervorgehobenen Angebote. */
const highlights = [
  {
    title: 'Leasingrückgabe',
    href: '/leasingrueckgabe-leipzig',
    intro: 'Fahrzeuge vor der Rückgabe begutachten und instand setzen, bevor der Rückgabegutachter sie nach den Sätzen des Leasinggebers bewertet.',
    items: [
      'Begutachtung von Lack, Dellen, Felgen, Verglasung und Innenraum',
      'Lackfreie Dellenentfernung und Spot-Repair, wo fachlich ausreichend',
      'Felgeninstandsetzung bei Bordsteinschäden bis 1 mm Tiefe',
      'Aufbereitung innen und außen vor der Übergabe',
    ],
  },
  {
    title: 'Fuhrparkservice',
    href: '/fuhrparkservice-leipzig',
    intro: 'Von der regelmäßigen Pflege bis zur Aufarbeitung vor Rückgabe oder Verkauf — sämtliche anfallenden Arbeiten rund um Ihre Fahrzeuge.',
    items: [
      'Wiederkehrende Pflege- und Reparaturprozesse nach vereinbartem Ablauf',
      'Im Schadensfall halten wir Sie mobil und leiten die Schritte ein',
      'Aufarbeitung vor Rückgabe, Verkauf oder Weitervermietung',
      'Zusammenarbeit mit langjährigen Kooperationspartnern der Automobilbranche',
    ],
  },
];

const offerings = [
  { title: 'Unfallinstandsetzung', description: 'Kompletter Schadenfall inklusive Karosserie, Lack und Abstimmung mit Versicherung und Gutachter.', href: '/unfallinstandsetzung-leipzig' },
  { title: 'Neu- und Reparaturlackierung', description: 'Farbtongenaue Lackierung als Glasurit-Lackpartner, auf Wunsch für ganze Fahrzeugserien.', href: '/autolackierung-leipzig' },
  { title: 'Smart Repair', description: 'Punktuelle Instandsetzung kleinerer Schäden — bei Flotten und Rückläufern der wirtschaftlichste Weg.', href: '/smart-repair-leipzig' },
  { title: 'Dellenentfernung', description: 'Lackfreie Instandsetzung ohne Wertminderung, von Versicherungen und Gutachtern anerkannt.', href: '/dellenentfernung-leipzig' },
  { title: 'Hagelschadenreparatur', description: 'Audatex-Kalkulation und komplette Versicherungsabwicklung — auch bei mehreren Fahrzeugen gleichzeitig.', href: '/hagelschadenreparatur-leipzig' },
  { title: 'Felgenreparatur', description: 'TÜV-zertifiziertes Verfahren als Wheel-Doctor-Fachbetrieb statt Neubeschaffung von Originalfelgen.', href: '/felgenreparatur-leipzig' },
  { title: 'Autoglas & Scheibenfolien', description: 'Steinschlagreparatur und Neuverglasung für PKW, LKW und Bus — als WINTEC-Partner mit 30 Jahren Garantie.', href: '/autoglas-leipzig' },
  { title: 'Fahrzeugaufbereitung', description: 'Aufbereitung für Präsentation, Übergabe und Werterhalt — auch als wiederkehrender Prozess.', href: '/fahrzeugaufbereitung-leipzig' },
];

const collaboration = [
  { title: 'Fester Ansprechpartner', description: 'Kurze Wege und klare Zuständigkeit statt wechselnder Kontakte — Sie wissen, mit wem Sie sprechen.' },
  { title: 'Alles im eigenen Haus', description: 'Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung auf über 3.000 m². Keine Weitergabe an Fremdbetriebe, keine zusätzliche Schnittstelle.' },
  { title: 'Instand setzen statt tauschen', description: 'Wo es fachlich vertretbar ist, wird repariert statt ersetzt. Das senkt Schadenhöhe und Durchlaufzeit.' },
  { title: 'Nachvollziehbare Kalkulation', description: 'Kalkulation über das von Versicherern und Gutachtern anerkannte System Audatex.' },
  { title: 'Dokumentierte Prozesse', description: 'Nachvollziehbare Schritte, saubere Übergaben und Endabnahme gehören zum Ablauf.' },
  { title: 'Erfahrung mit Premiumfahrzeugen', description: 'Sorgfältiger Umgang mit hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
  { title: 'Ersatzmobilität', description: 'Werkstattersatzfahrzeug nach Verfügbarkeit — damit Fahrzeugausfall nicht zum Betriebsausfall wird.' },
  { title: 'Flexible Zusammenarbeit', description: 'Einzelauftrag, laufende Betreuung oder perspektivische Rahmenprozesse — je nach Bedarf.' },
];

const steps = [
  { title: 'Kontakt aufnehmen', description: 'Unternehmen, Ansprechpartner und Bedarf übermitteln — telefonisch oder über das Geschäftskundenformular.' },
  { title: 'Abläufe klären', description: 'Wir besprechen Umfang, Frequenz, Ansprechpartner, Kommunikationswege und die Übergabelogistik.' },
  { title: 'Prozess starten', description: 'Fahrzeuge oder Schadenfälle werden nach dem vereinbarten Ablauf bearbeitet.' },
  { title: 'Qualität sichern', description: 'Dokumentation, Endabnahme und transparente Rückmeldung gehören zum Prozess.' },
];

const faqs = [
  {
    id: 'rahmen',
    question: 'Sind feste Abläufe für Geschäftskunden möglich?',
    answer: 'Ja. Wir strukturieren wiederkehrende Prozesse für Autohäuser, Fuhrparks, Versicherungen und Agenturen — mit festem Ansprechpartner, vereinbarter Frequenz und definierten Kommunikationswegen.',
  },
  {
    id: 'schadensteuerung',
    question: 'Arbeitet das CarCare Center mit Versicherungen und Schadensteuerern zusammen?',
    answer: 'Ja. Versicherer und Schadensteuerer gehören zu unseren Geschäftskunden. Wir übernehmen Schadenaufnahme, Kalkulation über das anerkannte System Audatex und die Instandsetzung aus einer Hand — inklusive Schriftverkehr und Abstimmung mit dem Gutachter.',
  },
  {
    id: 'partner',
    question: 'Für welche Unternehmen arbeitet das CarCare Center bereits?',
    answer: 'Zu den Betrieben, für die wir arbeiten, zählen unter anderem Volkswagen Automobile Leipzig, das Audi Zentrum Leipzig, das Porsche Zentrum Leipzig, das Porsche Werk Leipzig und das Autohaus Otto Grimm. Im Schadenbereich wickeln wir Fälle mit über 30 Versicherern ab, darunter HUK Coburg, Gothaer, VHV, Generali, R+V und Signal Iduna.',
  },
  {
    id: 'flotte',
    question: 'Können mehrere Fahrzeuge gleichzeitig bearbeitet werden?',
    answer: 'Ja. Auf über 3.000 m² mit über 50 Mitarbeitern lassen sich auch mehrere Fahrzeuge parallel bearbeiten — etwa bei Hagelereignissen oder wiederkehrender Flottenpflege. Umfang und Zeitfenster werden vorab abgestimmt.',
  },
  {
    id: 'einhaus',
    question: 'Werden Arbeiten an Fremdbetriebe weitergegeben?',
    answer: 'Nein. Karosserie, Lackierung, Smart Repair, Felgeninstandsetzung, Autoglas und Aufbereitung finden im eigenen Haus statt. Das spart eine Schnittstelle und hält die Verantwortung an einer Stelle.',
  },
  {
    id: 'premium',
    question: 'Hat das CarCare Center Erfahrung mit Premiumfahrzeugen?',
    answer: 'Ja. Wir arbeiten als Glasurit-Lackpartner farbtongenau und mit sorgfältigem Umgang bei hochwertigen Fahrzeugen und sensiblen Oberflächen.',
  },
  {
    id: 'digital',
    question: 'Gibt es digitale Schadenübermittlung?',
    answer: 'Eine digitale Schadenübermittlung ist perspektivisch vorgesehen und kann in der Zusammenarbeit berücksichtigt werden. Aktuell erfolgt die Übermittlung telefonisch, per E-Mail oder über das Formular.',
  },
];

/** Namensliste als kompakter Block — bewusst ohne Logos, Begruendung in `data/partners.ts`. */
const PartnerNames: React.FC<{ names: string[] }> = ({ names }) => (
  <ul className="mt-5 flex flex-wrap gap-x-3 gap-y-2">
    {names.map((name) => (
      <li key={name} className="rounded-full border border-gray-100 bg-white px-3.5 py-1.5 text-xs font-semibold text-gray-600 shadow-sm [hyphens:none]">
        {name}
      </li>
    ))}
  </ul>
);

const BusinessCustomersPage: React.FC = () => (
  // Motiv der Kachel „Autohaeuser & Fuhrparks" aus „Fuer wen wir arbeiten" (Startseite).
  <BackdropLayout image="/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp">
    <PageMeta
      canonical="/geschaeftskunden"
      title="Geschäftskunden Leipzig | Autohäuser, Flotten & Versicherer"
      description="CarCare Center Leipzig für Autohäuser, Fuhrparks, Versicherungen und Schadensteuerer: Leasingrückgabe, Fuhrparkservice, Unfallinstandsetzung und Aufbereitung aus einer Hand."
    />
    <PageHero
      eyebrow="Geschäftskunden"
      title="Fahrzeugdienstleistungen für Autohäuser, Flotten und Versicherer."
      description="CarCare Center Leipzig arbeitet für Leipziger Autohäuser, gewerbliche Fuhrparks, Versicherungen, Schadensteuerer und Agenturen — mit festem Ansprechpartner, dokumentierten Abläufen und dem gesamten Leistungsspektrum auf über 3.000 m² im eigenen Haus."
      primaryCta={{ label: 'Geschäftskundenanfrage stellen', href: '/kontakt#contact-business' }}
      secondaryCta={{ label: 'Leistungen ansehen', href: '/leistungen' }}
      keywords={['Fuhrparkservice Leipzig', 'Autohäuser Leipzig', 'Schadensteuerung Leipzig', 'Leasingrückgabe Leipzig']}
    />

    <section id="zielgruppen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Wen wir betreuen"
          title="Vier Arten von Geschäftskunden – mit unterschiedlichen Anforderungen."
          description="Autohäuser brauchen Präsentationsqualität, Flotten brauchen Planbarkeit, Versicherer und Schadensteuerer brauchen nachvollziehbare Kalkulation. Wir bedienen alle drei Logiken."
        />
        <FeatureGrid items={audiences} columns="four" />
      </div>
    </section>

    <section id="schwerpunkte" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Schwerpunkte"
          title="Leasingrückgabe und Fuhrparkservice im Detail."
          description="Zwei Angebote, die für gewerbliche Kunden den größten Unterschied machen — weil sie wiederkehrend anfallen und direkt auf die Kosten durchschlagen."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {highlights.map((highlight) => (
            <article key={highlight.title} className="flex flex-col rounded-2xl border border-blue-100 bg-white p-6 shadow-sm md:p-8">
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-950">{highlight.title}</h3>
              <p className="mt-4 text-sm leading-relaxed text-gray-600 md:text-base">{highlight.intro}</p>
              <ul className="mt-6 flex-grow list-disc space-y-2 pl-5 marker:text-blue-700">
                {highlight.items.map((item) => (
                  <li key={item} className="text-sm leading-relaxed text-gray-600">{item}</li>
                ))}
              </ul>
              <a href={highlight.href} className="mt-7 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Mehr dazu <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="angebote" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Angebote im Überblick"
          title="Das komplette Spektrum – auch für gewerbliche Auftraggeber."
          description="Jede Leistung lässt sich einzeln beauftragen oder in einen wiederkehrenden Ablauf einbinden."
        />
        <FeatureGrid items={offerings} columns="four" />
      </div>
    </section>

    <section id="zusammenarbeit" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Zusammenarbeit"
          title="Wie die Zusammenarbeit mit uns aussieht."
          description="Gewerbliche Auftraggeber bewerten nicht das einzelne Ergebnis, sondern die Verlässlichkeit über viele Fahrzeuge hinweg. Genau darauf ist der Ablauf ausgelegt."
        />
        <FeatureGrid items={collaboration} columns="four" />
      </div>
    </section>

    <section id="referenzen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Bestehende Zusammenarbeit"
          title="Für diese Unternehmen arbeiten wir bereits."
          description="Namensnennung als Referenz – wir sind ein markenunabhängiger freier Meisterbetrieb und keine autorisierte Vertragswerkstatt der genannten Hersteller."
        />
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Autohäuser & Werke</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Leipziger Autohäuser und Werke, für die wir Aufbereitung, Instandsetzung und Lackarbeiten übernehmen.
            </p>
            <PartnerNames names={dealerPartners.map((partner) => partner.name)} />
          </div>
          <div className="lg:col-span-7">
            <h3 className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">Versicherer & Schadensteuerer</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Mit diesen {insurancePartners.length} Versicherern wickeln wir Schadenfälle ab — von der Schadenaufnahme über die
              Audatex-Kalkulation bis zur Freigabe.
            </p>
            <PartnerNames names={insurancePartners.map((partner) => partner.name)} />
          </div>
        </div>
      </div>
    </section>

    <section id="ablauf" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So startet die Zusammenarbeit mit uns." />
        <ProcessList steps={steps} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen für Geschäftskunden." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>

    <PageCTA
      title="Sie betreuen Fahrzeuge gewerblich?"
      description="Sprechen Sie mit uns über feste Ansprechpartner, wiederkehrende Abläufe und passende Prozesse."
      primaryLabel="Partneranfrage stellen"
      primaryHref="/kontakt#contact-business"
    />
  </BackdropLayout>
);

export default BusinessCustomersPage;
