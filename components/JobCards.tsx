import React, { useState } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { jobPositions, offeneStellen } from '../data/jobs';
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
 * ALLE BERUFSBILDER, AUCH DIE NICHT AUSGESCHRIEBENEN: Wer sich fuer den Betrieb
 * interessiert, will wissen, welche Gewerke es gibt. Der Ausschreibungsstand steht als
 * Abzeichen auf der Karte; `JobPosting`-Markup bekommen nur die offenen Stellen
 * (siehe `data/jobs.ts`).
 */

/** Ziel der Karten-CTA. Wird mit dem Bewerbungsformular auf `#bewerbung` umgestellt. */
const BEWERBUNGS_ZIEL = '/kontakt';

const alsKarte = (job: (typeof jobPositions)[number]): ExpandingCardItem => {
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
              Die übrigen Berufsbilder gehören zum Betrieb, werden aber gerade nicht neu besetzt —
              eine Initiativbewerbung ist trotzdem willkommen.
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
          items={jobPositions.map(alsKarte)}
          onActiveImageChange={setActiveImage}
          mobileActiveHeight={470}
        />
      </div>
    </section>
  );
};

export default JobCards;
