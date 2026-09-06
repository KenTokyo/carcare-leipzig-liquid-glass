import React from 'react';
import { ArrowRight } from 'lucide-react';
import { serviceByHref } from '../data/services';

/**
 * Leistungskarte mit Foto — das durchgaengige Kartenmuster des Projekts.
 *
 * HERKUNFT: Die Form stammt von den Aufbereitungsbereichen auf
 * `/fahrzeugaufbereitung-leipzig` (`#umfang`). Sie wurde am 2026-09-06 zuerst auf
 * `/ueber-uns` uebernommen und am 2026-09-07 auf die uebrigen Seiten gezogen, weil
 * dieselbe Aussage sonst je nach Seite wie ein anderes Bauteil aussah.
 *
 * ⚠️ DAS FOTO STEHT NICHT HIER UND NICHT IN DER SEITE. Es kommt ueber `serviceByHref()`
 * aus `data/services.ts` — demselben Katalog, aus dem Startseiten-Kachel, `/leistungen`
 * und der Seitenhintergrund der Zielseite ihr Motiv beziehen. Ein Motivwechsel im
 * Katalog wirkt damit ueberall zugleich. Wer hier einen Pfad eintraegt, baut genau die
 * Doppelpflege wieder ein, die der Katalog vermeidet.
 *
 * ANKER IM LINK SIND ERLAUBT: `/fahrzeugaufbereitung-leipzig#preise` findet trotzdem
 * sein Motiv — der Anker wird fuer die Suche abgeschnitten, im `href` bleibt er stehen.
 *
 * KARTEN OHNE KATALOGEINTRAG behalten dieselbe Form, nur ohne Bild. Das ist bewusst:
 * Eine Karte ohne Foto ist besser als ein falsches Foto, und die Luecke faellt im
 * Review auf.
 */

export interface LeistungsKarte {
  title: string;
  description: string;
  /** Ziel der Karte. Darf einen Anker tragen. */
  href?: string;
  /**
   * Woher das Foto kommt, wenn die Karte NICHT dorthin verlinkt.
   *
   * Gebraucht fuer die Karte der eigenen Seite: Auf
   * `/unfallinstandsetzung-leipzig` steht „Unfallinstandsetzung" bewusst ohne Link —
   * ein Verweis auf die Seite, auf der man schon ist, hilft niemandem. Ohne dieses Feld
   * bliebe genau diese eine Karte als einzige ohne Bild und riesse die Reihe auf.
   */
  imageHref?: string;
  /** Beschriftung des Textlinks. Default: „Mehr erfahren". */
  linkLabel?: string;
}

/** Schneidet den Anker ab, damit `/seite#abschnitt` seinen Katalogeintrag findet. */
const ohneAnker = (href: string) => href.split('#')[0];

const Karte: React.FC<{ karte: LeistungsKarte }> = ({ karte }) => {
  const bildZiel = karte.imageHref ?? karte.href;
  const eintrag = bildZiel ? serviceByHref(ohneAnker(bildZiel)) : undefined;
  const bild = eintrag?.backgroundImage;

  return (
    <article className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm">
      {bild && (
        <img
          src={bild}
          alt={eintrag?.imageAlt ?? ''}
          width={eintrag?.imageWidth}
          height={eintrag?.imageHeight}
          loading="lazy"
          decoding="async"
          /* `aspect-[16/10]` reserviert die Flaeche vor dem Laden — kein Layout-Sprung
             trotz `loading="lazy"`. */
          className="mb-5 aspect-[16/10] w-full rounded-xl object-cover"
        />
      )}
      <h3 className="text-xl font-bold leading-tight text-gray-950">{karte.title}</h3>
      <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{karte.description}</p>
      {karte.href && (
        <a
          href={karte.href}
          className="mt-6 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600"
        >
          {karte.linkLabel ?? 'Mehr erfahren'} <ArrowRight size={14} />
        </a>
      )}
    </article>
  );
};

const LeistungsKarten: React.FC<{ items: LeistungsKarte[]; columns?: 'three' | 'four' }> = ({
  items,
  columns = 'three',
}) => (
  <div
    className={`grid grid-cols-1 gap-4 md:grid-cols-2 ${
      columns === 'four' ? 'lg:grid-cols-4' : 'lg:grid-cols-3'
    }`}
  >
    {items.map((k) => (
      <Karte key={k.title} karte={k} />
    ))}
  </div>
);

export default LeistungsKarten;
