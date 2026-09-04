import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { BEWERBUNGS_ZIEL, ausbildungsberufe, berufsbilder, offeneStellen, type JobPosition } from '../data/jobs';
import ExpandingCardAccordion, { type ExpandingCardItem } from './ExpandingCardAccordion';
import PhotoBackdrop from './PhotoBackdrop';

/**
 * Positionskarten auf `/karriere` (Backlog 1.21).
 *
 * GESTALTUNG BEWUSST IDENTISCH ZU `ServiceGrid`: grosses Hintergrundfoto je Karte,
 * weisse Textbox darueber, Full-Bleed-Sektionshintergrund, der dem aufgeklappten
 * Motiv folgt. Vorgabe des Kunden war ausdruecklich „so wie die Dienstleistungskacheln
 * auf der Startseite". Deshalb dieselbe Komponente (`ExpandingCardAccordion`) statt
 * einer zweiten mit aehnlichem Aussehen — sonst driften die beiden beim naechsten
 * Feinschliff auseinander, wie es zwischen Kachelreihe und Leistungsseite schon
 * einmal passiert ist.
 *
 * DER UNTERSCHIED ZU DEN LEISTUNGSKACHELN sind die Anforderungen: Sie passen nicht in
 * die Kartenhoehe. Statt die Karte zu strecken (dann wird das Foto zur Randleiste)
 * scrollt der Textbereich innerhalb der Box — `details` im Akkordeon.
 *
 * ZWEI REIHEN AUS EINER QUELLE: Berufsbilder oben, Ausbildung darunter, getrennt ueber
 * `art` in `data/jobs.ts`. Sieben Karten in EINER Reihe waeren auf 1440 px rund 90 px
 * je eingeklappter Karte — zu schmal fuer die senkrechten Titel. Inhaltlich sind es
 * ausserdem zwei Zielgruppen mit verschiedenen Fragen.
 *
 * ALLE EINTRAEGE STEHEN, AUCH DIE NICHT AUSGESCHRIEBENEN: Wer sich fuer den Betrieb
 * interessiert, will wissen, welche Gewerke es gibt. Der Ausschreibungsstand steht als
 * Abzeichen, als Schleier und als Satz in der Karte; `JobPosting`-Markup bekommen nur
 * die offenen Stellen (siehe `data/jobs.ts`).
 */

/**
 * Der Satz, der erklaert, warum eine Karte gedaempft ist.
 *
 * Ein grauer Kasten ohne Erklaerung wirkt wie ein Fehler — dieselbe Lehre wie bei der
 * mitten im Wort abgeschnittenen Zeile, bevor der Verlauf dazukam. Die Daempfung ist
 * ausserdem nie der einzige Traeger der Information: Abzeichen, dieser Satz, der
 * geaenderte Handlungsaufruf und die Sektionseinleitung sagen dasselbe in Worten.
 * Farbe allein duerfte es nicht sein (WCAG 1.4.1).
 *
 * BEWUSST KURZ UND OHNE DOPPLUNG: Die erste Fassung wiederholte in drei Zeilen, was das
 * Abzeichen darueber schon sagt („zurzeit nicht ausgeschrieben"), und schob dabei die
 * Anforderungen fast aus der Karte. Der Satz sagt jetzt nur das, was das Abzeichen NICHT
 * sagt — was man trotzdem tun kann.
 */
const HINWEIS_NICHT_SUCHEND = 'Initiativbewerbungen nehmen wir trotzdem gern entgegen.';

const alsKarte = (job: JobPosition): ExpandingCardItem => {
  const offen = job.status === 'suchend';
  return {
    id: job.id,
    title: job.title,
    description: job.description,
    href: BEWERBUNGS_ZIEL,
    cta: offen ? 'Jetzt bewerben' : 'Initiativ bewerben',
    backgroundImage: job.backgroundImage,
    details: job.anforderungen,
    detailsLabel: 'Das bringen Sie mit',
    hinweis: offen ? undefined : HINWEIS_NICHT_SUCHEND,
    gedaempft: !offen,
    // „Ruhig" fuer nicht ausgeschriebene Stellen: Ein blaues Abzeichen an dieser Stelle
    // liest sich wie eine Einladung und widerspraeche dem Text daneben.
    badge: offen
      ? { label: 'Stelle offen', ton: 'aktiv' }
      : { label: 'Zurzeit nicht ausgeschrieben', ton: 'ruhig' },
  };
};

const JobCards: React.FC = () => {
  const [activeImage, setActiveImage] = useState<string | null>(null);
  const anzahl = offeneStellen.length;

  return (
    <section
      id="jobbereiche"
      aria-labelledby="jobs-heading"
      className="relative isolate bg-gray-50/70 px-6 py-20 md:py-28"
    >
      {/* Nur die erste Reihe speist den Sektionshintergrund. Zwei Akkordeons, die
          beide daran ziehen, wuerden sich gegenseitig ueberschreiben — und ein
          entsaettigtes Ausbildungsmotiv hinter der ganzen Sektion waere ohnehin falsch. */}
      <PhotoBackdrop image={activeImage} />

      <div className="container relative mx-auto">
        <div className="mb-12 flex flex-col gap-6 md:mb-16 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Berufsbilder</span>
            <h2 id="jobs-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Vier Gewerke unter einem Dach.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
              {anzahl === 1
                ? 'Aktuell ist eine Stelle ausgeschrieben.'
                : `Aktuell sind ${anzahl} Stellen ausgeschrieben.`}{' '}
              Ausgegraute Karten gehören zum Betrieb, werden aber gerade nicht neu besetzt —
              eine Initiativbewerbung ist dort trotzdem willkommen.
            </p>
          </div>
          <a
            href={BEWERBUNGS_ZIEL}
            className="cc-gradient-button inline-flex w-fit items-center gap-2 rounded-full border px-5 py-3 text-sm font-bold text-white"
          >
            Bewerbung starten
            <ArrowUpRight size={16} />
          </a>
        </div>

        {/* 470 statt 340 px: Die Anforderungsliste braucht mobil sichtbare Zeilen,
            sonst steht ihre Ueberschrift allein ueber dem CTA. */}
        <ExpandingCardAccordion
          items={berufsbilder.map(alsKarte)}
          onActiveImageChange={setActiveImage}
          mobileActiveHeight={470}
        />

        {ausbildungsberufe.length > 0 && (
          <div className="mt-16 md:mt-20">
            <div className="mb-8 max-w-3xl md:mb-10">
              <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Ausbildung</span>
              <h3 className="text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-4xl">
                Ausbildung im Betrieb.
              </h3>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Diese Ausbildungsberufe gibt es bei uns. Ob im kommenden Jahrgang ausgebildet wird,
                stimmen wir gerade ab — melden Sie sich gern jetzt schon, dann kommen Sie auf die Liste.
              </p>
            </div>
            <ExpandingCardAccordion items={ausbildungsberufe.map(alsKarte)} mobileActiveHeight={430} />
          </div>
        )}
      </div>
    </section>
  );
};

export default JobCards;
