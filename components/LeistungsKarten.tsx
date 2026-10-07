import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, Pause, Play } from 'lucide-react';
import { bereichVon, serviceByHref } from '../data/services';
import { videoPlatz } from '../data/videos';
import KiMarke from './KiMarke';
import BereichsPlakette from './BereichsPlakette';
import GanzwortTitel from './GanzwortTitel';

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

/**
 * VIDEO STATT FOTO (seit 2026-10-03), wo der Katalog eines nennt: die Neu- und Reparaturlackierung zeigt ueberall das
 * Lackiervideo (User). Verhalten wie auf der Startseite (`KartenVideo` in ExpandingCardAccordion): `preload="none"`,
 * Standbild bis die Karte zu einem Viertel im Bild ist, dann stumm in Schleife; ausserhalb des Bildes angehalten.
 *
 * WCAG 2.2.2: Bewegung, die von selbst startet und laenger als 5 s laeuft, braucht ein Bedienelement zum Anhalten. Auf
 * der Startseite haelt das Aufklappen einer anderen Karte das Video an; hier gibt es das nicht, deshalb der kleine Knopf
 * unten links. Die Karte selbst ist kein Link (nur der Textlink darunter), ein Knopf im Bild ist also zulaessig.
 */
const KartenVideo: React.FC<{ quelle: string; standbild: string; titel: string }> = ({ quelle, standbild, titel }) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [imBild, setImBild] = useState(false);
  const [angehalten, setAngehalten] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const beobachter = new IntersectionObserver(([eintrag]) => setImBild(eintrag.isIntersecting), { threshold: 0.25 });
    beobachter.observe(el);
    return () => beobachter.disconnect();
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (imBild && !angehalten) {
      // Als Eigenschaft: React schreibt `muted` nicht zuverlaessig ins DOM, und nur stumme Videos laufen ohne Klick an.
      el.muted = true;
      el.play().catch(() => {
        /* z. B. Energiesparmodus unter iOS: Dann bleibt das Standbild stehen, kein Fehlerfall. */
      });
    } else {
      el.pause();
    }
  }, [imBild, angehalten]);

  return (
    <>
      <video
        ref={ref}
        src={quelle}
        poster={standbild}
        muted
        loop
        playsInline
        preload="none"
        aria-hidden="true"
        className="aspect-[16/10] w-full rounded-xl object-cover"
      />
      <button
        type="button"
        onClick={() => setAngehalten((wert) => !wert)}
        aria-label={angehalten ? `Video „${titel}“ abspielen` : `Video „${titel}“ anhalten`}
        className="absolute bottom-2 left-2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-black/55 text-white transition-colors hover:bg-black/70 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
      >
        {angehalten ? <Play size={14} aria-hidden="true" /> : <Pause size={14} aria-hidden="true" />}
      </button>
    </>
  );
};

const Karte: React.FC<{ karte: LeistungsKarte }> = ({ karte }) => {
  const bildZiel = karte.imageHref ?? karte.href;
  const eintrag = bildZiel ? serviceByHref(ohneAnker(bildZiel)) : undefined;
  const bild = eintrag?.backgroundImage;
  // Video statt Foto, wo der Katalog eines nennt und es geliefert ist (sonst bleibt das Foto).
  const platz = eintrag?.video ? videoPlatz(eintrag.video) : null;
  const video = platz?.quelle && platz.poster ? { quelle: platz.quelle, standbild: platz.poster } : null;
  // Care und/oder Repair (Backlog 6.8) aus demselben Katalogeintrag wie das Foto.
  const bereich = bereichVon(bildZiel);

  return (
    <article className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm">
      {(bild || video) && (
        /* Der Rahmen traegt den Abstand nach unten und den Bezugspunkt fuer die
           KI-Plakette; das Bild selbst bleibt unveraendert. Care/Repair oben links,
           die KI-Plakette unten rechts — sie kommen sich nicht in die Quere. */
        <div className="relative mb-5">
          {video ? (
            <KartenVideo quelle={video.quelle} standbild={video.standbild} titel={karte.title} />
          ) : (
            <img
              src={bild}
              alt={eintrag?.imageAlt ?? ''}
              width={eintrag?.imageWidth}
              height={eintrag?.imageHeight}
              loading="lazy"
              decoding="async"
              /* `aspect-[16/10]` reserviert die Flaeche vor dem Laden — kein Layout-Sprung
                 trotz `loading="lazy"`. */
              className="aspect-[16/10] w-full rounded-xl object-cover"
            />
          )}
          <BereichsPlakette bereich={bereich} className="absolute left-2 top-2" />
          <KiMarke quelle={video ? video.quelle : bild} className="bottom-2 right-2" />
        </div>
      )}
      {!bild && !video && <BereichsPlakette bereich={bereich} className="mb-3" />}
      {/* Ohne Silbentrennung (User, 2026-10-03), siehe `GanzwortTitel`. */}
      <GanzwortTitel text={karte.title} className="font-bold leading-tight text-gray-950 [--titel-max:1.25rem]" />
      <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{karte.description}</p>
      {karte.href && (
        <a
          href={karte.href}
          // Lektorat L02-10: Ohne eigenen Linktext steht „Mehr erfahren“ oft mehrfach auf der Seite.
          aria-label={karte.linkLabel ? undefined : `Mehr erfahren: ${karte.title}`}
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
