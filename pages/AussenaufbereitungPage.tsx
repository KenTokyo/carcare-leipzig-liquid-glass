import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, PricingGrid, ProcessList, SectionIntro } from '../components/PageBlocks';
import { bereichVon } from '../data/services';
import { AUFPREIS_SATZ, angeboteAussen, aufbereitungKacheln, paketPreis, zusatzPreis } from '../data/detailing';
import { regelSaetze } from '../data/zusatzregeln';

/**
 * Aussenaufbereitung als eigene Leistungsseite (Backlog 1.8).
 *
 * Traegt bewusst AUCH die Lackaufbereitung ausfuehrlich: Der Kunde hat im Review
 * festgelegt, dass die Lackaufbereitung keine eigene Kachel mehr bekommt (1.7),
 * sondern hier vollstaendig aufgeht. Deshalb zwei fachliche Sektionen statt einer.
 *
 * Die Inhalte stammen aus `data/detailing.ts` (`detailingScopes`), wo sie mit der
 * Geschaeftsfuehrung abgestimmt sind. Auf `/fahrzeugaufbereitung-leipzig` steht
 * dazu nur noch ein eigenstaendig formulierter Teaser — nicht derselbe Text
 * (Dublettenvermeidung, SEO-GEO-STANDARDS.md §4.5).
 *
 * PREISKACHELN (User, 2026-09-28): dieselben Kacheln wie auf der Uebersicht, direkt anfragbar, aber
 * NUR die dieser Seite zugeordneten — Brillant Außenpflege, Lackaufbereitung, Versiegelungen und die
 * Pflege-Extras. Zuordnung an einer Stelle: `angeboteAussen` in `data/detailing.ts`.
 */

// Backlog 4.3 (2026-09-16): „Lackreinigung" entfaellt insgesamt — aus beiden Listen entfernt.
// Damit trennen sich die Bereiche sauber (4.8): aussen = reinigen, Lack = Politur und Versiegelung.
const aussenLeistungen = [
  // Backlog 6.24 (Mail Andre 2026-09-28): „Intensive Vorreinigung inkl. Entfernung von Ablagerungen".
  { title: 'Vorreinigung und Felgen', description: 'Intensive Vorreinigung inklusive Entfernung von Ablagerungen, dazu die Felgenreinigung.' },
  { title: 'Insektenentfernung', description: 'Insektenrückstände werden vor der Oberwäsche gelöst.' },
  // Backlog 4.5: Wortlaut wie im Paket Brillant Außenpflege. Andre, 2026-10-05 (Nachtrag 6.24): „intensive“ statt
  // „schonende“, und „der Punkt Hochglanzpolitur sollte noch ergänzt werden“. Reihenfolge aus seinem Paket-Text:
  // Wäsche als Grundlage, dann Politur, die Scheiben „innen-außen“ zum Schluss.
  { title: 'Intensive Handoberwäsche', description: 'Intensive Oberwäsche von Hand.' },
  { title: 'Hochglanzpolitur', description: 'Auf der gereinigten Oberfläche holt die Politur den Glanz des Lackes zurück.' },
  { title: 'Scheibenreinigung', description: 'Innen und außen, für klaren Durchblick.' },
];

// Backlog 5.33 (Meeting 2026-09-25): Die Lackaufbereitung geht tiefer als die Aussenpflege. Swissvax-Wachse
// gehoeren zur Premiumpflege „exklusiv" (FAQ „wachs" sagt das) und stehen hier nicht mehr; dafuer die
// Keramik- und Nanoversiegelung, die Andre staerker herausstellen moechte.
// Backlog 6.24 (Mail Andre 2026-09-28): die Schritte in Andres Begriffen — Lacktiefenpolitur,
// Oberflaechenkratzerentfernung, Antihologrammbearbeitung, „nach Absprache erweiterbar mit Wachs, Nano oder Keramik".
const lackLeistungen = [
  { title: 'Lacktiefenpolitur', description: 'Spezielle, abrasive Polituren arbeiten in die Tiefe des Lackes, abgestimmt auf seinen Zustand.' },
  { title: 'Oberflächenkratzer entfernen', description: 'Wir arbeiten Oberflächenkratzer, Anhaftungen und matte Stellen aus dem Lack heraus.' },
  { title: 'Antihologramm-Bearbeitung', description: 'Wir entfernen Hologramme, also schimmernde Polierspuren im Lack, und bringen ihn auf Hochglanz.' },
  // Andre, 2026-10-05: Punkt 4 heißt „Hochglanzpolitur oder Versiegelung nach Wunsch“, der Text bleibt.
  { title: 'Hochglanzpolitur oder Versiegelung nach Wunsch', description: 'Nach Absprache erweitern wir die Lackaufbereitung um eine Wachs-, Nano- oder Keramikversiegelung.' },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Das Lackwissen aus der Reparatur kommt der Pflege zugute.' },
  { title: 'Full-Service auf über 3.500 m²', description: 'Aufbereitung, Lackierung, Karosserie, Smart Repair und Felgen aus einer Hand.' },
  { title: 'Privat-, Geschäfts- und Flottenkunden', description: 'Einzelfahrzeuge ebenso wie ganze Flotten von Autohäusern und Firmenfuhrparks.' },
];

const AussenaufbereitungPage: React.FC = () => (
  // Stehendes Foto wie auf `/fahrzeugaufbereitung-leipzig` (User-Vorgabe 2026-09-02).
  // Motiv aus `aufbereitungKacheln` — dieselbe Quelle wie die Startseiten-Kachel, damit
  // Kachel und Seite dasselbe Bild zeigen.
  // `zoom={1}`: Das Motiv (1400x1045) ist hochformatiger als die Backdrop-Flaeche;
  // formatfuellend wirkte es zu nah herangeholt. Gleiche Begruendung wie dort.
  <BackdropLayout image={aufbereitungKacheln.aussen} zoom={1}>
    <PageMeta
      canonical="/aussenaufbereitung-leipzig"
      title="Außenaufbereitung Leipzig | Politur & Lack | CarCare Center"
      description="Außenaufbereitung in Leipzig: Vorreinigung, Handoberwäsche, Felgen, Hochglanzpolitur und Versiegelung. Brillant Außenpflege ab 169 € im Meisterbetrieb."
    />
    <PageHero
      eyebrow="Außenaufbereitung Leipzig"
      bereich={bereichVon('/aussenaufbereitung-leipzig')}
      title="Außen- und Lackaufbereitung in Leipzig."
      // Andre, 2026-10-05: Intro im Wortlaut, nur „ihrem“ als Anrede groß.
      description="Die Außenaufbereitung entfernt Verschmutzungen, die eine gewöhnliche Fahrzeugwäsche stehen lässt. Sie reinigt und gibt Ihrem Lack die gewünschte Frische zurück. Die Lackaufbereitung arbeitet die Lackierung selbst auf und dringt auch in tiefere Schichten. Beides lässt sich einzeln beauftragen oder perfekt kombinieren."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Außenaufbereitung Leipzig', 'Lackaufbereitung Leipzig', 'Autopolitur Leipzig', 'Lackversiegelung Leipzig']}
    />

    {/* Preise weit oben wie auf der Uebersicht: Sie sind die haeufigste Frage (SEO-GEO §4.3, Antwort zuerst). */}
    <section id="preise" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Pakete & Preise"
          title="Was kostet eine Außenaufbereitung in Leipzig?"
          description={`Die Brillant Außenpflege kostet ${paketPreis('p1')}, die Lackaufbereitung berechnen wir nach Aufwand. Beide fragen Sie direkt über die Karte an.`}
        />
        <PricingGrid
          items={angeboteAussen.pakete}
          fussnote={AUFPREIS_SATZ}
          note="Alle Preise inkl. gesetzlicher Mehrwertsteuer. Der genaue Umfang wird nach Fahrzeugzustand und Wunsch persönlich abgestimmt."
        />
        <p className="mt-6 text-sm leading-relaxed text-gray-700">
          Innen und außen zusammen:{' '}
          <a href="/fahrzeugaufbereitung-leipzig#preise" className="font-bold text-blue-600 underline-offset-4 hover:underline">
            Premiumpflege und Premiumpflege „exklusiv“ ansehen
          </a>
        </p>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Außenaufbereitung"
          title="Was zur Außenaufbereitung gehört."
          // Seit 2026-10-05 steht die Hochglanzpolitur im Ablauf, die Lackversiegelung ist nicht mehr im Paket (Andre).
          description={`Die Brillant Außenpflege kostet ab 169 € inklusive gesetzlicher Mehrwertsteuer und enthält die folgenden Schritte. ${AUFPREIS_SATZ}`}
        />
        <ProcessList steps={aussenLeistungen} />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Lackaufbereitung"
          title="Wie wir die Lackoberfläche aufarbeiten."
          description="Die Lackaufbereitung geht mit speziellen und abrasiven Polituren in die Tiefe des Lackes, abgestimmt auf den Zustand Ihres Fahrzeuglackes. Wir berechnen sie nach Aufwand."
        />
        <ProcessList steps={lackLeistungen} />
      </div>
    </section>

    {/*
      EXKLUSIVLEISTUNGEN ALS PREISKACHELN (User 2026-09-28, Preise aus Andres Mail vom selben Tag).
      Bis dahin standen hier nur drei Namen ohne Text (Backlog 1.8). „Lackbausteine“ ist entfallen:
      Seit Schleife 1 gibt es dazu weder Beschreibung noch Preis, und Andres Liste nennt sie nicht —
      Rueckfrage in docs/aufbereitung-zusatzleistungen/tasks/2026-09-28-zusatzleistungen-kacheln-tasks.md.
      Name, Preis, Text und Vorauswahl kommen aus `data/zusatzleistungen.ts`, derselben Liste wie im Formular.
    */}
    <section id="exklusivleistungen" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Exklusiv- und Zusatzleistungen"
          // Seit 6.17 (2026-09-28) haben Keramik und Nano „ab“-Preise — „zum Festpreis“ stimmte damit nicht mehr.
          title="Was kosten Versiegelungen und Zusatzleistungen?"
          // 6.7: Regel fuer Keramik und Nano aus data/zusatzregeln.ts (Andre: nur zur Brillant Außenpflege oder Lackaufbereitung).
          description={`Die Keramikversiegelung kostet ${zusatzPreis('keramik')}, die Nanoversiegelung ${zusatzPreis('nano')}. ${regelSaetze(['keramik', 'nano'], 'Beide')} Dazu kommen die Frontscheibenversiegelung und Pflege-Extras für Felgen, Cabrioverdeck und Motorraum.`}
        />
        <PricingGrid items={angeboteAussen.zusatz} ctaLabel="Termin anfragen" note="Alle Preise inkl. gesetzlicher Mehrwertsteuer." />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Center Leipzig" title="Aufbereitung im Meisterbetrieb, nicht in der Waschstraße." />
        <FeatureGrid items={usp} />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Außen- und Lackaufbereitung." />
        <PageFAQ route="/aussenaufbereitung-leipzig" />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-16 md:py-20">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Zum Weiterlesen"
          title="Fachlich eingeordnet im Wissensbereich."
          description="Wie Lackaufbereitung im Detail funktioniert, wo ihre Grenzen liegen und was sie kostet, erklärt der Ratgeber unabhängig von der Beauftragung."
        />
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="/autoaufbereitung-wissen/lackaufbereitung" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Ratgeber Lackaufbereitung
          </a>
          <a href="/innenaufbereitung-leipzig" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Innenaufbereitung ansehen
          </a>
        </div>
      </div>
    </section>

    <PageCTA
      title="Lack matt, stumpf oder verschmutzt?"
      description="Sagen Sie uns, in welchem Zustand das Fahrzeug ist und was Sie erreichen wollen. Wir empfehlen den passenden Umfang zwischen Außenpflege und vollständiger Lackaufbereitung."
      primaryLabel="Aufbereitungstermin anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default AussenaufbereitungPage;
