import { useCallback, useEffect, useLayoutEffect, useRef, type MutableRefObject } from 'react';
import { getLenis } from '../hooks/useSmoothScroll';
import { freierBereich, gleitenUm, mittigeOberkante } from '../lib/freierBereich';

/**
 * Mobiles Aufklappen der `ExpandingCardAccordion`-Karten OHNE Layout pro Bild (2026-10-16, Galaxy A56 des Users:
 * „nicht so schön weich“). Plan und Messwerte: docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-tasks.md.
 * Seit 2026-10-19 auch die Mitarbeiterstimmen auf /karriere (`Stimmen.tsx`, R33-a), mit eigener Bildlage im Streifen
 * (`BildZu` unten). Das Gerüst aus Schatten, Fenster und Inhalt teilen beide über `KartenFenster` (akkordeonKarten.tsx).
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
 * KEIN SPRUNG BEIM TIPP (seit 2026-10-16 abends, Rückmeldung des Users vom A56): Liegt die offene Karte OBERHALB der
 * getippten (beim Herunterscrollen durch die Leistungen der Normalfall), schrumpft sie im Layout um die Höhendifferenz,
 * und alles darunter rückt hoch. Früher glich Chromes Scroll-Verankerung das in jedem Bild aus; bei laufenden
 * Transform-Animationen setzt sie aber aus. Gemessen: Die getippte Karte wuchs nach OBEN aus dem Bild (Oberkante
 * 268 → −8 px). Jetzt wird die Scrollposition im selben Bild um genau diesen Versatz verschoben (über Lenis,
 * `immediate`), danach gleitet nur, was sich auf dem Bildschirm wirklich bewegt. Gemessen wird deshalb in
 * FENSTERKOORDINATEN.
 *
 * DIE OFFENE KARTE STEHT MITTIG (seit 2026-10-17, User: „dass diese Karte quasi zentriert auf dem Bildschirm geöffnet
 * wird. Dass ich nicht erstmal nochmal runterscrollen muss“). Bis dahin blieb die getippte Karte an ihrer Stelle und ging
 * nach unten auf; bei 60 % Fensterhöhe getippt, lagen danach 83 px unter der Knopfleiste. Jetzt beginnt sie im ersten Bild
 * dort, wo der Finger lag (Verankerung oben), und gleitet, während sie aufgeht, mittig in den freien Bereich zwischen
 * Navbar und Knopfleiste (`lib/freierBereich.ts`): Die Seite scrollt mit derselben Dauer und Kurve wie die Karte, beide
 * Bewegungen addieren sich zu einer. Passt die Karte nicht, steht ihre Oberkante 12 px unter der Navbar.
 *
 * AUCH MIT DER MAUS (seit 2026-10-19, R33, User: „dass wenn ich mit der Maus drüber hover, das zentriert angezeigt wird“).
 * Bis dahin glitt nur ein Tipp mittig; beim Darüberfahren blieb die Oberkante stehen, die Karte ging nach unten auf (bei
 * 78 % Fensterhöhe 217 px unter der Knopfleiste), und alles darüber rückte um 276 px nach unten. Jetzt gleitet jede
 * Karte, die unter 1024 px aufgeht, mittig: Tipp, Klick, Tastatur und Darüberfahren. Für die Maus gilt dabei die
 * Zeigerabsicht (`useZeigerAbsicht` unten), sonst liefe die Kette von O8 (17.10.) wieder.
 *
 * UNTERBRECHBAR: Ein Tipp während der Animation misst die Karten so, wie sie gerade zu sehen sind
 * (`getBoundingClientRect` enthält die laufenden Transforms), bricht die Animationen ab und startet von dort.
 *
 * Bewusst NICHT an prefers-reduced-motion gekoppelt (Projektentscheidung, siehe `akkordeonKarten.tsx`).
 */

/** Höhe des eingeklappten Streifens mobil in Pixeln. */
export const STREIFEN = 64;

/**
 * Die beweglichen Teile einer Karte, markiert per `data-akk`.
 *
 * SCHATTEN ALS EIGENE EBENE (2026-10-17, User: „ein weißes Rechteck, das bis zur Überschrift hin quasi vergeht“): Bis
 * dahin trug das FENSTER den Schlagschatten. Das Fenster ist aber auch eingeklappt 340 px hoch und steht 276 px über dem
 * Streifen, unsichtbar, nur sein Schatten nicht. Zehn gestapelte Schatten dunkelten alles NEBEN der Kartenspalte ab, die
 * Spalte selbst blieb hell: ein helles Rechteck mit harten Kanten, bis in die Überschrift (gemessen 144 statt 179 bei
 * x = 28 px, Ablation in docs/mobil-akkordeon-faq/tasks/). Jetzt gleitet eine eigene Schattenebene mit dem Fenster und
 * blendet mit dem Öffnungsgrad ein und aus (`mobilSchatten`): offen voll, eingeklappt unsichtbar. Ein 64-px-Streifen warf
 * mit diesem Schatten (−32 px Ausdehnung) auch vor dem 16.10. praktisch keinen.
 */
type Teil = 'fenster' | 'inhalt' | 'bild' | 'schatten';
const TEILE: Teil[] = ['fenster', 'inhalt', 'bild', 'schatten'];
export type MobilLage = Record<Teil, string>;

/**
 * BILDEBENE IM STREIFEN als Abbildung gegenüber der offenen Karte: erst um `massstab` skalieren (Ursprung oben links,
 * `origin-top-left` an der Bildebene), dann um `x`/`y` Pixel verschieben. Zwischen Streifen und offener Karte gleitet
 * jeder Wert linear mit dem Öffnungsgrad, also mit derselben Kurve wie das Fenster. Ohne Angabe steht die Bildmitte im
 * Streifen (Leistungskarten, Kopf). Die Stimmen rechnen sie je Foto und Kartenbreite (`bildGeometrie` in `Stimmen.tsx`):
 * Dort läge in der Bildmitte Mund und Kinn, der Streifen zeigt Augen und Stirn.
 */
export interface BildZu {
  x: number;
  y: number;
  massstab: number;
}

/** Ruhelage der Teile bei `sichtbar` Pixeln sichtbarer Höhe (Karte offen: `sichtbar === hoehe`, alles 0). */
export const mobilLage = (sichtbar: number, hoehe: number, bildZu?: BildZu): MobilLage => {
  // Anteil „eingeklappt“: 1 beim Streifen, 0 bei offener Karte.
  const zu = hoehe > STREIFEN ? (hoehe - sichtbar) / (hoehe - STREIFEN) : 0;
  return {
    fenster: `translateY(${sichtbar - hoehe}px)`,
    inhalt: `translateY(${hoehe - sichtbar}px)`,
    bild: bildZu
      ? `translate(${bildZu.x * zu}px, ${bildZu.y * zu}px) scale(${1 + (bildZu.massstab - 1) * zu})`
      : `translateY(${(sichtbar - hoehe) / 2}px)`,
    schatten: `translateY(${sichtbar - hoehe}px)`,
  };
};

/** Deckkraft der Schattenebene = Öffnungsgrad: 0 beim Streifen, 1 bei offener Karte. */
export const mobilSchatten = (sichtbar: number, hoehe: number): number =>
  hoehe > STREIFEN ? Math.min(1, Math.max(0, (sichtbar - STREIFEN) / (hoehe - STREIFEN))) : 1;

/**
 * DAUER UND KURVE MOBIL (seit 2026-10-18, Rückmeldung vom Handy: „viel zu bouncy und unflüssig … weniger bouncy, aber
 * dafür flüssiger“). Bis dahin galt hier die Desktop-Kurve `KARTEN_UEBERGANG` ([0.22, 1, 0.36, 1], 0,6 s): Sie legt in den
 * ersten 10 % der Zeit 40 % des Weges zurück (Start mit 4,5-fachem Mitteltempo) und kriecht dann; gemessen schnellte die
 * Karte in 60 ms um 44 % ihres Weges los. Weil Aufklappen und Mitgleiten gleichzeitig so losschnellten und dann langsam
 * ausliefen, las sich das als Federn.
 * Jetzt die gleichmäßige S-Kurve `ease` ([0.25, 0.1, 0.25, 1]): weicher Anfang (0,45-faches Mitteltempo), Spitze 2,8-fach
 * bei gut einem Viertel der Zeit, sanftes Ende ohne Kriechen. 0,65 s. Gilt für Aufklappen UND Mitgleiten, damit beide eine
 * Bewegung bleiben; am Desktop unverändert `KARTEN_UEBERGANG` (Breite per `flexGrow`). Vergleich weiterer Kurven:
 * docs/mobil-akkordeon-faq/tasks/ (Phase 8).
 */
export const MOBIL_BEWEGUNG = { dauer: 0.65, kurve: [0.25, 0.1, 0.25, 1] as [number, number, number, number] };

const TIMING: KeyframeAnimationOptions = {
  duration: MOBIL_BEWEGUNG.dauer * 1000,
  easing: `cubic-bezier(${MOBIL_BEWEGUNG.kurve.join(', ')})`,
};

interface Lage {
  /** Oberkante im Fenster, wie gerade zu sehen. */
  oben: number;
  /** Sichtbare Höhe, wie gerade zu sehen. */
  sichtbar: number;
}

interface Vorher {
  /** Index der Karte, die aufgehen soll: Im ersten Bild steht sie, wo sie war (Verankerung), danach gleitet sie mittig. */
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
 * Bewegt sich gerade etwas? Eine Kartenanimation dieses Akkordeons (Web Animations, nicht die CSS-Übergänge von
 * Schleier und Kachel) oder Lenis scrollt. Dann steht der Inhalt nicht dort, wo er gleich stehen wird.
 * `nativ`: auch natives Scrollen zählt. Lenis meldet es bis 400 ms nach dem letzten Scroll-Ereignis (`isScrolling:
 * 'native'`). Für die Zeigerabsicht nötig (der Inhalt ist unter dem ruhenden Zeiger weitergerückt), für einen Klick nicht:
 * Nach dem Wischen steht die Seite, nur Lenis' eigenes Gleiten (`'smooth'`) ändert die Lage noch (O5 in
 * `2026-10-19-stimmen-mobil-mechanik-optimierung-tasks.md`: ein Tipp kurz nach dem Wischen tat sonst nichts).
 */
const bewegtSich = (karten: (HTMLElement | null)[], nativ = true): boolean => {
  const scrollt = getLenis()?.isScrolling;
  return (
    (nativ ? !!scrollt : scrollt === 'smooth') ||
    karten.some((k) => k?.getAnimations({ subtree: true }).some((x) => x.playState === 'running' && x.constructor === Animation))
  );
};

/** Sichtbarer Fokus (Tastatur)? Browser ohne `:focus-visible` gelten als ja, damit die Tastatur dort weiter aufklappt. */
export const fokusSichtbar = (el: Element): boolean => {
  try {
    return el.matches(':focus-visible');
  } catch {
    return true;
  }
};

/**
 * @param aktiv    nur mobil (`!isDesktop`); am Desktop tut der Hook nichts
 * @param hoehe    Höhe der offenen Karte (`mobileActiveHeight`)
 * @param offen    Index der offenen Karte
 * @param bildZu   Bildlage im Streifen je Karte (`BildZu`); ohne Angabe die Bildmitte
 */
export const useMobilAkkordeon = (aktiv: boolean, hoehe: number, offen: number, bildZu?: (idx: number) => BildZu) => {
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
      const von = mobilLage(alt.lagen[i].sichtbar, hoehe, bildZu?.(i));
      const nach = mobilLage(ziel, hoehe, bildZu?.(i));
      for (const teil of TEILE) {
        const el = karte.querySelector<HTMLElement>(`[data-akk="${teil}"]`);
        if (!el) continue;
        const start: Keyframe = { transform: von[teil] };
        const ende: Keyframe = { transform: nach[teil] };
        if (teil === 'schatten') {
          start.opacity = mobilSchatten(alt.lagen[i].sichtbar, hoehe);
          ende.opacity = mobilSchatten(ziel, hoehe);
        }
        laufend.current.push(el.animate([start, ende], TIMING));
      }
    });
    // 3. Mittig in den freien Bereich gleiten (siehe Kopf), gleichzeitig mit dem Aufgehen.
    if (zielKarte) gleitenUm(zielKarte.getBoundingClientRect().top - mittigeOberkante(hoehe), MOBIL_BEWEGUNG.dauer, MOBIL_BEWEGUNG.kurve);
  }, [offen, aktiv, hoehe]);

  // Wechsel auf Desktop oder Abbau: nichts weiterlaufen lassen.
  useEffect(() => {
    if (!aktiv) anhalten();
    return anhalten;
  }, [aktiv]);

  /**
   * Offene Karte ganz ins Bild holen (zweiter Klick auf eine Stimme, 2026-10-19, R33-a): Steht sie nicht ganz im freien
   * Bereich, gleitet die Seite sie mittig, wie beim Aufgehen. Steht sie ganz darin oder bewegt sich gerade etwas (dann
   * stimmt ihre Lage noch nicht), passiert nichts.
   */
  const zeigen = useCallback(
    (idx: number) => {
      const karte = karten.current[idx];
      if (!aktiv || !karte || bewegtSich(karten.current, false)) return;
      const r = karte.getBoundingClientRect();
      const frei = freierBereich();
      if (r.top >= frei.oben - 0.5 && r.bottom <= frei.unten + 0.5) return;
      gleitenUm(r.top - mittigeOberkante(hoehe, frei), MOBIL_BEWEGUNG.dauer, MOBIL_BEWEGUNG.kurve);
    },
    [aktiv, hoehe]
  );

  return { karten, messen, zeigen };
};

/** Ruhe des Zeigers, bevor eine Karte beim Darüberfahren aufgeht (schmales Fenster mit Maus oder Trackpad), in ms. */
export const ZEIGER_RUHE_MS = 120;
/** So lange nach einem Scrollen zählt keine Zeigerbewegung (WebKits Ersatzbewegungen, siehe `useZeigerAbsicht`), in ms. */
const SCROLL_STILLE_MS = 250;

/**
 * ZEIGERABSICHT beim Darüberfahren unter 1024 px (seit 2026-10-19, R33). Dort gleitet jede Karte, die aufgeht, mittig;
 * mit der Maus ergäbe das ohne Schutz die Kette von O8: Seite gleitet, eine andere Karte liegt unter dem ruhenden
 * Zeiger, geht auf, die Seite gleitet weiter. Drei Regeln verhindern das:
 *  1. NUR ECHTE BEWEGUNG zählt: `pointermove` mit anderen Bildschirmkoordinaten als das vorige (im GANZEN Fenster
 *     verglichen, nicht nur über den Karten) und nicht während oder bis SCROLL_STILLE_MS nach einem Scrollen. Bewegt sich
 *     der Inhalt unter einer ruhenden Maus (Mitgleiten, Mausrad, Trackpad), meldet Chrome `pointerenter`/`mouseenter` und
 *     kein `pointermove`; WebKit (Safari) meldet nach dem Scrollen Ersatzbewegungen als `pointermove`, meist mit denselben
 *     Koordinaten, im automatisierten WebKit nach dem Mausrad aber auch an anderer Stelle (663,474 → 450,409; Karte 7 ging
 *     auf, gemessen 19.10.). Darum zählt kurz nach einem Scrollen gar keine Bewegung: Echte Mausbewegung kommt als Strom
 *     und setzt danach sofort wieder ein. Über `mouseenter` lief die alte Kette; es wird unter 1024 px nicht mehr genutzt.
 *  2. RUHE: Erst wenn der Zeiger ZEIGER_RUHE_MS ruht (Zittern unter 4 px zählt nicht), geht die Karte unter ihm auf.
 *     Wer nach dem Gleiten zur jetzt mittigen Karte fährt, überquert Streifen; die öffnen dabei nicht.
 *  3. NICHT WÄHREND DES GLEITENS: Läuft eine Kartenbewegung oder gleitet Lenis, verfällt die Absicht. Der Inhalt hat sich
 *     unter dem Zeiger verschoben; erst die nächste echte Bewegung zählt.
 * Welche Karte aufgeht, entscheidet ein Treffertest an der Zeigerstelle beim Ablauf der Ruhe. Liegt dort keine Karte
 * dieses Akkordeons, passiert nichts; jedes Akkordeon der Seite prüft nur seine eigenen Karten.
 */
export const useZeigerAbsicht = (aktiv: boolean, karten: MutableRefObject<(HTMLElement | null)[]>, oeffnen: (idx: number) => void) => {
  // Immer die zuletzt GERENDERTE Fassung aufrufen (sie kennt die offene Karte); erst nach dem Festschreiben, nicht im Rendern.
  const oeffnenAktuell = useRef(oeffnen);
  useLayoutEffect(() => {
    oeffnenAktuell.current = oeffnen;
  });

  useEffect(() => {
    if (!aktiv) return;
    let letzte: { sx: number; sy: number; cx: number; cy: number } | null = null;
    let anker: { sx: number; sy: number } | null = null;
    let zeit = 0;
    let gescrollt = 0;
    const scrollt = () => {
      gescrollt = performance.now();
    };
    const bewegt = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      const vorher = letzte;
      letzte = { sx: e.screenX, sy: e.screenY, cx: e.clientX, cy: e.clientY };
      if (vorher && vorher.sx === e.screenX && vorher.sy === e.screenY) return; // Regel 1: keine Bewegung
      if (performance.now() - gescrollt < SCROLL_STILLE_MS) return; // Regel 1: Ersatzbewegung nach dem Scrollen
      if (anker && Math.hypot(e.screenX - anker.sx, e.screenY - anker.sy) < 4) return; // Zittern
      anker = { sx: e.screenX, sy: e.screenY };
      window.clearTimeout(zeit);
      zeit = window.setTimeout(() => {
        anker = null;
        const p = letzte;
        if (!p) return;
        if (bewegtSich(karten.current)) return; // Regel 3
        const unter = document.elementFromPoint(p.cx, p.cy);
        const idx = unter ? karten.current.findIndex((k) => !!k && k.contains(unter)) : -1;
        if (idx >= 0) oeffnenAktuell.current(idx);
      }, ZEIGER_RUHE_MS);
    };
    window.addEventListener('pointermove', bewegt, { passive: true });
    window.addEventListener('scroll', scrollt, { passive: true });
    return () => {
      window.removeEventListener('pointermove', bewegt);
      window.removeEventListener('scroll', scrollt);
      window.clearTimeout(zeit);
    };
  }, [aktiv, karten]);
};
