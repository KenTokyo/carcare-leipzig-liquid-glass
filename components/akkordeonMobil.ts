import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { KARTEN_UEBERGANG } from './akkordeonKarten';
import { getLenis } from '../hooks/useSmoothScroll';

/**
 * Mobiles Aufklappen der `ExpandingCardAccordion`-Karten OHNE Layout pro Bild (2026-10-16, Galaxy A56 des Users:
 * „nicht so schön weich“). Plan und Messwerte: docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-tasks.md.
 *
 * WARUM: Bis hierher animierte Framer die `height` zweier Karten. Jedes Bild änderte damit das Layout, danach rechnete
 * der Browser Stil, Malen und Ebenenaufbau der ganzen Seite neu (gemessen: 16–18 ms je Bild bei 4-fach gedrosselter CPU,
 * die Startseite wurde 52-mal in 800 ms komplett neu gemalt). Das Gerät hat 120 Hz, also 8,3 ms je Bild.
 *
 * WIE: Die Höhe springt EINMAL (Ruhelage per React), sichtbar bewegt wird danach nur `transform` über die Web
 * Animations API. Das läuft auf dem Compositor: kein Layout und kein Malen pro Bild.
 *  - Nachbarkarten, deren Lage sich ändert, gleiten von der alten an die neue Stelle (FLIP).
 *  - Die Größe ändert sich über ein FENSTER mit festem INHALT (beide so hoch wie die offene Karte): Das Fenster
 *    (`overflow: hidden`) steht um `sichtbar − Höhe` nach oben verschoben, der Inhalt darin um denselben Betrag nach
 *    unten. Der Inhalt bleibt dadurch an der Kartenoberkante stehen, nur die Unterkante des Fensters wandert.
 *    Beide laufen mit derselben Kurve, die Summe bleibt in jedem Bild null.
 *  - Die BILDEBENE steht eingeklappt um die halbe Differenz höher, der Streifen zeigt also die Bildmitte, und gleitet
 *    beim Aufklappen mit. Das Bild steht dabei immer im Format der offenen Karte; der Streifen zeigt es deshalb etwas
 *    näher als früher (`object-cover` auf 64 px), bei 3:2 rund 1,5-fach.
 *
 * DIE GETIPPTE KARTE BLEIBT STEHEN (seit 2026-10-16 abends, Rückmeldung des Users vom A56): Liegt die offene Karte
 * OBERHALB der getippten (beim Herunterscrollen durch die Leistungen der Normalfall), schrumpft sie im Layout um die
 * Höhendifferenz, und alles darunter rückt hoch. Früher glich Chromes Scroll-Verankerung das in jedem Bild aus; bei
 * laufenden Transform-Animationen setzt sie aber aus. Gemessen: Die getippte Karte wuchs nach OBEN aus dem Bild
 * (Oberkante 268 → −8 px). Jetzt wird die Scrollposition im selben Bild um genau diesen Versatz verschoben (über Lenis,
 * `immediate`), danach gleitet nur, was sich auf dem Bildschirm wirklich bewegt: Die getippte Karte geht an ihrer
 * Stelle nach unten auf und schiebt die Karten darunter weg. Gemessen wird deshalb in FENSTERKOORDINATEN.
 *
 * UNTERBRECHBAR: Ein Tipp während der Animation misst die Karten so, wie sie gerade zu sehen sind
 * (`getBoundingClientRect` enthält die laufenden Transforms), bricht die Animationen ab und startet von dort.
 *
 * Bewusst NICHT an prefers-reduced-motion gekoppelt (Projektentscheidung, siehe `akkordeonKarten.tsx`).
 */

/** Höhe des eingeklappten Streifens mobil in Pixeln. */
export const STREIFEN = 64;

/** Die drei beweglichen Teile einer Karte, markiert per `data-akk`. */
type Teil = 'fenster' | 'inhalt' | 'bild';
const TEILE: Teil[] = ['fenster', 'inhalt', 'bild'];

/** Ruhelage der drei Teile bei `sichtbar` Pixeln sichtbarer Höhe (Karte offen: `sichtbar === hoehe`, alles 0). */
export const mobilLage = (sichtbar: number, hoehe: number): Record<Teil, string> => ({
  fenster: `translateY(${sichtbar - hoehe}px)`,
  inhalt: `translateY(${hoehe - sichtbar}px)`,
  bild: `translateY(${(sichtbar - hoehe) / 2}px)`,
});

const TIMING: KeyframeAnimationOptions = {
  duration: KARTEN_UEBERGANG.duration * 1000,
  easing: `cubic-bezier(${KARTEN_UEBERGANG.ease.join(', ')})`,
};

interface Lage {
  /** Oberkante im Fenster, wie gerade zu sehen. */
  oben: number;
  /** Sichtbare Höhe, wie gerade zu sehen. */
  sichtbar: number;
}

interface Vorher {
  /** Index der Karte, die aufgehen soll: Sie bleibt auf dem Bildschirm stehen. */
  ziel: number;
  lagen: Lage[];
}

/**
 * Scrollposition sofort um `dy` verschieben. Über Lenis, sonst liefe dessen Zustand dem Fenster hinterher (dieselbe
 * Lehre wie bei „Ablauf überspringen“ in `ScrollPinnedProcess`); `force`, damit es auch bei gestopptem Lenis greift.
 */
const scrollenUm = (dy: number) => {
  const ziel = window.scrollY + dy;
  const lenis = getLenis();
  if (lenis) lenis.scrollTo(ziel, { immediate: true, force: true });
  else window.scrollTo({ top: ziel, behavior: 'instant' });
};

/**
 * @param aktiv    nur mobil (`!isDesktop`); am Desktop tut der Hook nichts
 * @param hoehe    Höhe der offenen Karte (`mobileActiveHeight`)
 * @param offen    Index der offenen Karte
 */
export const useMobilAkkordeon = (aktiv: boolean, hoehe: number, offen: number) => {
  const karten = useRef<(HTMLElement | null)[]>([]);
  const vorher = useRef<Vorher | null>(null);
  const laufend = useRef<Animation[]>([]);

  const anhalten = () => {
    laufend.current.forEach((animation) => animation.cancel());
    laufend.current = [];
  };

  /** Vor dem Wechsel aufrufen (im Ereignis, bevor der Zustand gesetzt wird), mit der Karte, die aufgehen soll. */
  const messen = useCallback(
    (ziel: number) => {
      if (!aktiv) return;
      vorher.current = {
        ziel,
        lagen: karten.current.map((karte) => {
          if (!karte) return { oben: 0, sichtbar: STREIFEN };
          const rahmen = karte.getBoundingClientRect();
          const fenster = karte.querySelector<HTMLElement>('[data-akk="fenster"]')?.getBoundingClientRect();
          return { oben: rahmen.top, sichtbar: fenster ? fenster.bottom - rahmen.top : rahmen.height };
        }),
      };
    },
    [aktiv]
  );

  // Nach dem Wechsel, vor dem nächsten Bild: von der gemessenen Lage in die neue Ruhelage gleiten.
  useLayoutEffect(() => {
    const alt = vorher.current;
    vorher.current = null;
    if (!aktiv || !alt) return;
    anhalten();
    // 1. Getippte Karte an ihrer Stelle halten (siehe Kopf: eigene Verankerung). Ohne laufende Animationen gemessen.
    const zielKarte = karten.current[alt.ziel];
    const versatz = zielKarte && alt.lagen[alt.ziel] ? zielKarte.getBoundingClientRect().top - alt.lagen[alt.ziel].oben : 0;
    if (Math.abs(versatz) > 0.5) scrollenUm(versatz);
    // 2. FLIP in Fensterkoordinaten: Was nach dem Ausgleich woanders steht als vorher, gleitet von dort.
    karten.current.forEach((karte, i) => {
      if (!karte || !alt.lagen[i]) return;
      const dy = alt.lagen[i].oben - karte.getBoundingClientRect().top;
      if (Math.abs(dy) > 0.5) {
        laufend.current.push(karte.animate([{ transform: `translateY(${dy}px)` }, { transform: 'translateY(0)' }], TIMING));
      }
      const ziel = i === offen ? hoehe : STREIFEN;
      if (Math.abs(alt.lagen[i].sichtbar - ziel) <= 0.5) return;
      const von = mobilLage(alt.lagen[i].sichtbar, hoehe);
      const nach = mobilLage(ziel, hoehe);
      for (const teil of TEILE) {
        const el = karte.querySelector<HTMLElement>(`[data-akk="${teil}"]`);
        if (el) laufend.current.push(el.animate([{ transform: von[teil] }, { transform: nach[teil] }], TIMING));
      }
    });
  }, [offen, aktiv, hoehe]);

  // Wechsel auf Desktop oder Abbau: nichts weiterlaufen lassen.
  useEffect(() => {
    if (!aktiv) anhalten();
    return anhalten;
  }, [aktiv]);

  return { karten, messen };
};
