import React from 'react';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { BackdropLayout, FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, PricingGrid, ProcessList, SectionIntro } from '../components/PageBlocks';
import DetailingGallery from '../components/DetailingGallery';
import { carePackages, detailingScopes, detailingSteps, disinfectionServices } from '../data/detailing';

/**
 * Hub-Seite des Aufbereitungs-Strangs.
 *
 * Buendelt alles, was auf der Startseite zur Fahrzeugaufbereitung vorkommt:
 * Aufbereitungsumfang (innen/aussen/Lack), Leasingrueckgabe, Ablauf (wortgleich zu den
 * Prozesskarten in `components/DetailingProcessSection.tsx`), Pflegepakete mit Preisen
 * und Desinfektion. Inhalte liegen in `data/detailing.ts`, damit diese Datei eine
 * Komposition bleibt (700-Zeilen-Regel aus CLAUDE.md).
 */

const leasingChecks = [
  { title: 'Was der Rückgabegutachter bewertet', description: 'Lackschäden, Diverses an Stoßfängern, Dellen, Felgenschäden, Steinschläge in der Scheibe sowie der Zustand des Innenraums fließen in das Rückgabeprotokoll ein.' },
  { title: 'Was sich vorher beheben lässt', description: 'Parkplatzdellen bei intaktem Lack lackfrei entfernen, kleinere Lackschäden per Spot-Repair, Bordsteinschäden an Felgen bis 1 mm Tiefe und Steinschläge in der Scheibe reparieren.' },
  { title: 'Warum das vorab günstiger ist', description: 'Der Leasinggeber rechnet Schäden nach eigenen Sätzen ab. Eine vorherige Instandsetzung im Fachbetrieb reduziert vermeidbare Nachbelastungen.' },
  { title: 'Wann Sie starten sollten', description: 'Planen Sie den Termin einige Wochen vor der Rückgabe. So bleibt Zeit für Reparatur und Aufbereitung, ohne dass es zum Rückgabetermin eng wird.' },
];

const expertPoints = [
  { title: 'Premiumfahrzeuge', description: 'Sorgfältiger Umgang mit hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
  { title: 'Autohäuser', description: 'Planbare Aufbereitung für Präsentation, Übergabe und Fahrzeugbestand.' },
  { title: 'Fuhrparks', description: 'Wiederkehrende Pflege- und Werterhaltungsprozesse für gewerbliche Fahrzeuge.' },
  { title: 'Hohe Qualitätsstandards', description: 'Strukturierte Arbeitsweise, saubere Übergabe und sichtbarer Anspruch an Details.' },
];

const faqs = [
  {
    id: 'dauer',
    question: 'Wie lange dauert eine Fahrzeugaufbereitung?',
    answer: 'Das hängt von Leistung, Zustand und Umfang ab. Eine reine Außenpflege ist deutlich schneller erledigt als die kombinierte Premiumpflege mit Motorreinigung und Versiegelung. CarCare stimmt den Ablauf nach der Anfrage persönlich ab und nennt Ihnen dabei den Zeitrahmen für Ihr Fahrzeug.',
  },
  {
    id: 'preise',
    question: 'Was kostet eine Autoaufbereitung bei CarCare Leipzig?',
    answer: 'Die Brillant Außenpflege kostet 169,00 €, die Intensiv Innenreinigung 199,00 € und die Premiumpflege als Kombination beider Pakete 299,00 €. Die Premiumpflege „exklusiv“ mit SWIZÖL-Wachsen beginnt bei 348,00 €. Alle Preise verstehen sich inklusive gesetzlicher Mehrwertsteuer.',
  },
  {
    id: 'paketwahl',
    question: 'Welches Pflegepaket ist das richtige für mich?',
    answer: 'Geht es um Glanz und Lackschutz von außen, reicht die Brillant Außenpflege. Steht der Innenraum im Vordergrund – etwa Polster, Leder oder Gerüche –, ist die Intensiv Innenreinigung passend. Wer beides braucht, etwa vor Verkauf oder Leasingrückgabe, wählt die Premiumpflege.',
  },
  {
    id: 'unterschied',
    question: 'Was ist der Unterschied zwischen Autowäsche und Aufbereitung?',
    answer: 'Eine Wäsche reinigt die Oberfläche. Die Aufbereitung geht darüber hinaus: Sie entfernt Anhaftungen, die die Wäsche stehen lässt, arbeitet den Lack durch Politur auf, versiegelt ihn anschließend und behandelt den Innenraum materialgerecht bis in die Details.',
  },
  {
    id: 'leasing',
    question: 'Hilft CarCare bei der Leasingrückgabe?',
    answer: 'Ja. Wir begutachten das Fahrzeug vor der Rückgabe, setzen Gebrauchsspuren wie Dellen, Lackschäden oder Felgenschäden fachgerecht instand und bereiten es auf. Das reduziert vermeidbare Nachbelastungen durch den Rückgabegutachter.',
  },
  {
    id: 'tierhaare',
    question: 'Werden auch stark verschmutzte Fahrzeuge angenommen?',
    answer: 'Ja, allerdings mit gesonderter Absprache. Fahrzeuge mit extremen Verschmutzungen – zum Beispiel Tierhaare – bedürfen eines höheren Aufwands und werden deshalb vorab individuell besprochen.',
  },
  {
    id: 'geruch',
    question: 'Was hilft gegen hartnäckige Gerüche im Innenraum?',
    answer: 'Für belastete Innenraumluft bieten wir zwei Verfahren an: die Ozonbehandlung für 45,00 € mit rund 30 Minuten Einwirkzeit sowie die Heißvernebelung mit dem KC-Refresher für 59,00 €, die länger anhaltend gegen Bakterien, behüllte Viren und Schimmelpilze wirkt.',
  },
  {
    id: 'business',
    question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?',
    answer: 'Ja. CarCare arbeitet für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards. Für wiederkehrende Aufbereitung gibt es feste Ansprechpartner und planbare Abläufe.',
  },
];

const VehicleDetailingPage: React.FC = () => (
  // Motiv der Kachel „Fahrzeugaufbereitung" aus der Leistungsuebersicht.
  // `zoom` bewusst nur hier: Das Motiv (1400x1045) ist hochformatiger als die Backdrop-
  // Flaeche; formatfuellend wirkte es zu nah herangeholt und zeigte nur eine glatte
  // Karosseriefläche. `1` = der weiteste Blick, den die Flaeche ohne sichtbare Bildkante
  // zulaesst. Die anderen drei Seiten bleiben formatfuellend, dort passt der Ausschnitt.
  <BackdropLayout image="/assets/kacheln/fahrzeugaufbereitung-leipzig-carcare.webp" zoom={1}>
    <PageMeta
      canonical="/fahrzeugaufbereitung-leipzig"
      title="Fahrzeugaufbereitung Leipzig | Preise ab 169 € | CarCare"
      description="Fahrzeugaufbereitung in Leipzig mit festen Paketpreisen: Außenpflege ab 169 €, Innenreinigung 199 €, Premiumpflege 299 €. Innen, außen, Lack und Leasingrückgabe."
    />
    <PageHero
      eyebrow="Fahrzeugaufbereitung Leipzig"
      title="Professionelle Fahrzeugaufbereitung in Leipzig – mit festen Paketpreisen."
      description="Innenraum, Außenpflege, Lackreinigung, Politur, Versiegelung, Geruchsentfernung und die Vorbereitung auf Verkauf oder Leasingrückgabe. Vier aufeinander aufbauende Pflegepakete ab 169,00 €, ausgeführt im Meisterbetrieb auf 3.000 qm."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Direkt anrufen', href: 'tel:+493412617790' }}
      keywords={['Autoaufbereitung Leipzig', 'Lackpolitur Leipzig', 'Innenreinigung Leipzig', 'Leasingrückgabe Leipzig']}
    />

    {/* Preise bewusst weit oben: Sie sind die haeufigste Frage und der Teil, den
        KI-Antwortsysteme am ehesten zitieren. */}
    <section id="preise" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Pflegepakete & Preise"
          title="Was kostet eine Autoaufbereitung in Leipzig?"
          description="Vier aufeinander aufbauende Pakete – von der Brillant-Außenpflege für 169,00 € bis zur exklusiven Handarbeit mit SWIZÖL-Carnaubawachs ab 348,00 €."
        />
        <PricingGrid
          items={carePackages}
          note="Alle Preise inkl. gesetzlicher Mehrwertsteuer. Der genaue Umfang wird nach Fahrzeugzustand und Wunsch persönlich abgestimmt."
        />
      </div>
    </section>

    {/*
      Layout bewusst UNVERAENDERT gegenueber dem Stand vor 2026-08-09: eine Sektion,
      dreispaltiges Kartenraster, `shadow-sm`. Ein zwischenzeitlicher Umbau auf drei
      volle Bildsektionen wurde zurueckgenommen — er verdreifachte die Malflaeche direkt
      oberhalb der Parallax-Galerie. Weil auf dieser Seite JEDE Sektion transparent ist
      (`.cc-backdrop-content > section`), muessen darunter das Sticky-Foto und seine drei
      Verlaufsebenen pro Scrollframe neu gezeichnet werden; grosse `shadow-lg`-Flaechen
      darauf kosteten sichtbar Frames, und zwar zuerst dort, wo etwas animiert.

      Die beiden Anforderungen aus dem Auftrag sind hier erfuellt, ohne das Layout zu
      aendern: jede Karte traegt eine eigene `id` als Sprungziel und das Foto der
      zugehoerigen Startseiten-Kachel.
    */}
    <section id="umfang" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Aufbereitungsumfang"
          title="Innen, außen und Lack – was jeweils dazugehört."
          description="Die drei Bereiche lassen sich einzeln oder kombiniert beauftragen. Welche Kombination sinnvoll ist, hängt von Zustand und Ziel ab."
        />
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          {detailingScopes.map((scope) => (
            // `scroll-mt-28` haelt das Sprungziel unter der schwebenden Navigation frei.
            <article
              key={scope.title}
              id={scope.id}
              className="flex scroll-mt-28 flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
            >
              <img
                src={scope.image}
                alt={scope.imageAlt}
                width={scope.imageWidth}
                height={scope.imageHeight}
                loading="lazy"
                decoding="async"
                className="mb-5 aspect-[16/10] w-full rounded-xl object-cover"
              />
              <h3 className="text-xl font-bold leading-tight text-gray-950">{scope.title}</h3>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">{scope.intro}</p>
              <ul className="mt-5 flex-grow space-y-2.5">
                {scope.items.map((item) => (
                  <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-gray-600">
                    <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-blue-700" aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
              <a href={scope.href} className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                {scope.hrefLabel} <ArrowRight size={14} />
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>

    <section id="leasingrueckgabe" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Leasingrückgabe"
          title="Fahrzeug vor der Leasingrückgabe vorbereiten."
          description="Bei der Rückgabe bewertet ein Gutachter den Fahrzeugzustand und rechnet Schäden nach den Sätzen des Leasinggebers ab. Vieles davon lässt sich vorher im Fachbetrieb günstiger beheben."
        />
        <FeatureGrid items={leasingChecks} columns="four" />
        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a href="/leasingrueckgabe-leipzig" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Alles zur Leasingrückgabe <ArrowRight size={14} />
          </a>
          <a href="/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Ratgeber Leasingrückgabe <ArrowRight size={14} />
          </a>
          <a href="/dellenentfernung-leipzig" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Dellen lackfrei entfernen <ArrowRight size={14} />
          </a>
          <a href="/smart-repair-leipzig" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
            Smart Repair bei Lackschäden <ArrowRight size={14} />
          </a>
        </div>
      </div>
    </section>

    <DetailingGallery />

    <section id="ablauf" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Ablauf"
          title="So läuft Ihre Autoaufbereitung bei CarCare."
          description="Von der Leistungsauswahl bis zur gepflegten Übergabe – in fünf klaren Schritten, aus einer Hand."
        />
        <ProcessList steps={detailingSteps} />
      </div>
    </section>

    <section id="desinfektion" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Desinfektion & Hygiene"
          title="Innenraum-Desinfektion gegen Keime, Viren und Gerüche."
          description="Für ein hygienisch sauberes Fahrzeug: professionelle Verfahren, die Bakterien, Viren, Schimmelpilze und Gerüche auch in unzugänglichen Bereichen erreichen."
        />
        <PricingGrid
          items={disinfectionServices}
          ctaLabel="Termin anfragen"
          note="Alle Preise inkl. gesetzlicher Mehrwertsteuer. Ideal ergänzend zur Innenaufbereitung – z. B. bei Gerüchen, nach Krankheit oder vor dem Fahrzeugverkauf."
        />
      </div>
    </section>

    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Expertise"
          title="Für Premiumfahrzeuge, Autohäuser, Fuhrparks und hohe Qualitätsstandards."
          description="CarCare arbeitet neutral, professionell und mit dem Anspruch, Fahrzeugzustand und Wert sichtbar zu verbessern."
        />
        <FeatureGrid items={expertPoints} columns="four" />
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Fahrzeugaufbereitung." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>

    <PageCTA
      title="Ihr Fahrzeug soll sichtbar gepflegter wirken?"
      description="Fragen Sie Ihren Aufbereitungstermin in Leipzig an. CarCare empfiehlt die passende Leistung für Zustand und Ziel."
      primaryLabel="Termin anfragen"
      primaryHref="/kontakt#contact-termin"
    />
  </BackdropLayout>
);

export default VehicleDetailingPage;
