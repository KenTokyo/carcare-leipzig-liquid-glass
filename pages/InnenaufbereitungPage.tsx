import React from 'react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, PricingGrid, ProcessList, SectionIntro } from '../components/PageBlocks';
import { bereichVon } from '../data/services';
import KiMarke from '../components/KiMarke';
import GanzwortTitel from '../components/GanzwortTitel';
import { AUFPREIS_SATZ, angeboteInnen, aufbereitungKacheln, paketPreis, zusatzPreis } from '../data/detailing';

/** Bilder der Exklusivleistungen (Backlog 6.2), erzeugt von `npm run fotos` aus der Lieferung vom 20.08.2026. */
const EXKLUSIV_BILDER = {
  vergleich: '/assets/kacheln/alcantara-lenkrad-vorher-nachher-leipzig-carcare.webp',
  schaum: '/assets/kacheln/alcantara-schaumreinigung-leipzig-carcare.webp',
};

/**
 * Innenaufbereitung als eigene Leistungsseite (Backlog 1.9).
 *
 * Die Inhalte stammen aus `data/detailing.ts` (`detailingScopes`), wo sie mit der
 * Geschaeftsfuehrung abgestimmt sind. Auf `/fahrzeugaufbereitung-leipzig` steht
 * dazu nur noch ein eigenstaendig formulierter Teaser — nicht derselbe Text
 * (Dublettenvermeidung, SEO-GEO-STANDARDS.md §4.5).
 *
 * Abgrenzung zum Ratgeber `/autoaufbereitung-wissen/innenaufbereitung`: der
 * erklaert das Thema (informational), diese Seite verkauft die Leistung
 * (kommerziell). Beide verlinken wechselseitig, SEO-GEO §4.1.
 *
 * PREISKACHELN (User, 2026-09-28): dieselben Kacheln wie auf der Uebersicht, direkt anfragbar, aber
 * NUR die dieser Seite zugeordneten — Intensiv Innenraumreinigung, Ozon, Heissvernebelung.
 * Zuordnung an einer Stelle: `angeboteInnen` in `data/detailing.ts`.
 */

const innenLeistungen = [
  // Backlog 4.6: Teppichreinigung ergaenzt — in dieser Karte statt als sechste, damit das Raster bleibt.
  // Backlog 6.24 (Mail Andre 2026-09-28): „Reinigung aller Ablagen und Fächer, Dachhimmelreinigung".
  { title: 'Innenraum komplett', description: 'Intensive Reinigung des gesamten Innenraumes inklusive Cockpit, Oberflächen, aller Ablagen und Fächer sowie der Teppiche.' },
  { title: 'Dachhimmel', description: 'Wir reinigen auch den Dachhimmel über den Sitzen.' },
  { title: 'Polster oder Leder', description: 'Polstershampoonierung oder alternativ materialgerechte Lederpflege.' },
  { title: 'Scheiben', description: 'Scheibenreinigung innen und außen.' },
  { title: 'Geruch und Luft', description: 'Geruchsentfernung und Behandlung belasteter Innenraumluft.' },
  // Seit 2026-09-28 einzeln buchbar (Mail Andre); Preis aus data/zusatzleistungen.ts.
  { title: 'Motorreinigung', description: `Auf Wunsch für ${zusatzPreis('motor')} dazu, in der Premiumpflege bereits enthalten.` },
];

const usp = [
  { title: 'Meisterbetrieb seit 1998', description: 'Erfahrung im Kfz-Handwerk seit 1998. Aufbereitung, Karosserie und Lack aus einer Hand.' },
  { title: 'Full-Service auf über 3.500 m²', description: 'Aufbereitung, Lackierung, Karosserie, Smart/Spot Repair und Felgen an einem Standort.' },
  { title: 'Privat-, Geschäfts- und Flottenkunden', description: 'Vom Privatfahrzeug bis zum vielgenutzten Poolwagen aus dem Firmenfuhrpark.' },
];

const InnenaufbereitungPage: React.FC = () => (
  // Stehendes Foto wie auf `/fahrzeugaufbereitung-leipzig` (User-Vorgabe 2026-09-02).
  // Motiv aus `aufbereitungKacheln`. Kein `zoom`: das Innenraum-Motiv (2400x1340) ist
  // querformatig und fuellt die Backdrop-Flaeche ohne sichtbare Bildkante.
  <BackdropLayout image={aufbereitungKacheln.innen}>
    <PageMeta
      canonical="/innenaufbereitung-leipzig"
      title="Innenaufbereitung Leipzig | Polster & Leder | CarCare Center"
      description="Innenaufbereitung Leipzig: Cockpit, Polster oder Leder, Scheiben und Geruchsentfernung. Intensiv Innenraumreinigung ab 199,00 € im Meisterbetrieb."
    />
    <PageHero
      eyebrow="Innenaufbereitung Leipzig"
      bereich={bereichVon('/innenaufbereitung-leipzig')}
      title="Innenaufbereitung in Leipzig."
      description="Die Innenaufbereitung reinigt und pflegt den kompletten Fahrzeuginnenraum, vom Cockpit über Polster und Leder bis in die Bereiche, die bei der normalen Wäsche ausgelassen werden. Auf Wunsch mit Geruchsentfernung und Behandlung belasteter Innenraumluft."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Innenaufbereitung Leipzig', 'Autoinnenreinigung Leipzig', 'Polsterreinigung Auto Leipzig', 'Geruchsentfernung Auto Leipzig']}
    />

    {/* Preis weit oben wie auf der Uebersicht: die haeufigste Frage (SEO-GEO §4.3, Antwort zuerst). */}
    <section id="preise" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Paket & Preis"
          title="Was kostet eine Innenaufbereitung in Leipzig?"
          description={`Die Intensiv Innenraumreinigung kostet ${paketPreis('p2')}. Gegen Gerüche buchen Sie Ozonbehandlung oder Heißvernebelung dazu, beide weiter unten mit Festpreis.`}
        />
        <PricingGrid
          items={angeboteInnen.pakete}
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
          eyebrow="Innenaufbereitung"
          title="Was zur Innenaufbereitung gehört."
          description={`Die Intensiv Innenraumreinigung kostet ab 199,00 € inklusive gesetzlicher Mehrwertsteuer und enthält die folgenden Schritte. ${AUFPREIS_SATZ}`}
        />
        <ProcessList steps={innenLeistungen} />
      </div>
    </section>

    {/*
      Backlog 1.11: Ozon und Heissvernebelung sind hier als OPTIONAL BUCHBAR
      hinterlegt, nicht nur auf der Aufbereitungs-Bestandsseite. Wer gezielt die
      Innenaufbereitung sucht, ist genau die Zielgruppe fuer Geruchsbehandlung.
      Preise und Beschreibungen kommen aus `data/zusatzleistungen.ts` (ueber `angeboteInnen`) — dieselbe
      Quelle wie Uebersicht und Formular. Seit 2026-09-28 hakt der Anfrage-Link die Leistung im Formular an.
    */}
    <section id="optional" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Optional buchbar"
          title="Geruchsbehandlung zur Innenaufbereitung dazu."
          // 6.7 (Andre: „buchbar allein oder zu allen Programmen“): auch einzeln, nicht nur zur Innenaufbereitung.
          description="Sitzt der Geruch tiefer, als eine Reinigung erreicht, buchen Sie eines dieser beiden Verfahren zur Innenaufbereitung dazu. Beide gibt es auch einzeln."
        />
        <PricingGrid
          items={angeboteInnen.zusatz}
          ctaLabel="Termin anfragen"
          note="Alle Preise inkl. gesetzlicher Mehrwertsteuer."
        />
      </div>
    </section>

    {/*
      EXKLUSIVLEISTUNGEN MIT BILDERN (Backlog 6.1 und 6.2, Meeting und User 2026-09-28).

      6.1: „Ausbauen" steht nicht mehr im Namen (André: „dezent weglassen"). Das Foto eines ausgebauten
      Lenkrads darf bleiben („das ist nicht schlimm").
      6.2: Vorher/Nachher als EIN Bild aus zwei Aufnahmen desselben Lenkrads vom selben Tag, nur zugeschnitten
      (`npm run fotos`, Art „Vergleich"). Die Beschriftung steht als HTML über dem Bild: scharf, vorlesbar und
      ohne eingebrannte Schrift. Das Schaumfoto stammt aus derselben Serie (zwischen Vorher und Nachher).
      Breiten 3/5 zu 2/5: Bei 16:10 links und 1:1 rechts sind beide Bilder etwa gleich hoch (gerechnet:
      Unterschied 2 px bei 1024, 9 px bei 1440 Fensterbreite).

      TODO 1.18: Die BESCHREIBUNGSTEXTE der beiden Leistungen liefert weiter André. Die Bildunterschriften
      beschreiben nur, was auf den Fotos zu sehen ist — bewusst kein erfundener Leistungstext.
    */}
    <section id="exklusivleistungen" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Exklusivleistungen" title="Alcantara-Lenkrad und Schaum-/Tornador-Verfahren." />
        <div className="mt-8 grid grid-cols-1 gap-4 md:grid-cols-5">
          <article className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm md:col-span-3">
            <figure>
              <div className="relative">
                <img
                  src={EXKLUSIV_BILDER.vergleich}
                  alt="Alcantara-Lenkrad im Vergleich: links vor der Aufbereitung mit verdichtetem, speckig glänzendem Flor im Griffbereich, rechts nach der Aufbereitung mit gleichmäßig aufgerichtetem Flor"
                  width={2000}
                  height={1245}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[2000/1245] w-full rounded-xl object-cover"
                />
                {/* Beschriftung je Hälfte. Weiß deckend mit dunkler Schrift: trägt auf dem roten Heckleuchten-
                    Anschnitt links wie auf dem weißen Fahrzeug rechts. `aria-hidden`, weil der Alternativtext
                    „links vorher, rechts nachher" schon sagt. */}
                <span aria-hidden="true" className="absolute left-3 top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-950 shadow-sm">
                  Vorher
                </span>
                <span aria-hidden="true" className="absolute left-[calc(50%+0.75rem)] top-3 rounded-full bg-white px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-950 shadow-sm">
                  Nachher
                </span>
                <KiMarke quelle={EXKLUSIV_BILDER.vergleich} className="bottom-2 right-2" />
              </div>
              <figcaption className="mt-5">
                <GanzwortTitel text="Alcantara-Lenkrad aufarbeiten" className="font-bold leading-tight text-gray-950 [--titel-max:1.25rem]" />
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Dasselbe Lenkrad am selben Tag: vorher verdichtet und speckig im Griffbereich, nachher mit wieder
                  aufgerichtetem, gleichmäßigem Flor.
                </p>
              </figcaption>
            </figure>
          </article>
          <article className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm md:col-span-2">
            <figure>
              <div className="relative">
                <img
                  src={EXKLUSIV_BILDER.schaum}
                  alt="Mitarbeiter arbeitet mit einer Bürste Reinigungsschaum in den Alcantara-Kranz eines ausgebauten Lenkrads ein, die Mitte ist mit Klebeband abgedeckt"
                  width={1200}
                  height={1200}
                  loading="lazy"
                  decoding="async"
                  className="aspect-square w-full rounded-xl object-cover"
                />
                <KiMarke quelle={EXKLUSIV_BILDER.schaum} className="bottom-2 right-2" />
              </div>
              <figcaption className="mt-5">
                <GanzwortTitel text="Schaum-/Tornador-Verfahren" className="font-bold leading-tight text-gray-950 [--titel-max:1.25rem]" />
                <p className="mt-3 text-sm leading-relaxed text-gray-600">
                  Der Reinigungsschaum wird mit der Bürste in den Flor eingearbeitet, die Mitte des Lenkrads ist dabei
                  abgeklebt.
                </p>
              </figcaption>
            </figure>
          </article>
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Warum CarCare Center Leipzig" title="Aufbereitung im Meisterbetrieb, nicht in der Waschstraße." />
        <FeatureGrid items={usp} />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Innenaufbereitung." />
        <PageFAQ route="/innenaufbereitung-leipzig" />
      </div>
    </section>

    <section className="bg-white px-6 py-16 md:py-20">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Zum Weiterlesen"
          title="Fachlich eingeordnet im Wissensbereich."
          description="Wie eine Innenaufbereitung abläuft, welche Kostenfaktoren es gibt und worauf bei Polstern und Leder zu achten ist, erklärt der Ratgeber unabhängig von der Beauftragung."
        />
        <div className="mt-6 flex flex-wrap gap-4">
          <a href="/autoaufbereitung-wissen/innenaufbereitung" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Ratgeber Innenaufbereitung
          </a>
          <a href="/aussenaufbereitung-leipzig" className="inline-flex font-bold text-blue-600 hover:text-blue-800">
            Außenaufbereitung ansehen
          </a>
        </div>
      </div>
    </section>

    <PageCTA
      title="Innenraum stark genutzt, verschmutzt oder riecht?"
      description="Beschreiben Sie uns den Zustand. Wir sagen Ihnen, ob die Intensiv Innenraumreinigung reicht oder ob eine Geruchsbehandlung sinnvoll dazukommt."
      primaryLabel="Aufbereitungstermin anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default InnenaufbereitungPage;
