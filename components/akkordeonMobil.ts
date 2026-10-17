import { useCallback, useEffect, useLayoutEffect, useRef } from 'react';
import { getLenis } from '../hooks/useSmoothScroll';
import { gleitenUm, mittigeOberkante } from '../lib/freierBereich';

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

/** Ruhelage der Teile bei `sichtbar` Pixeln sichtbarer Höhe (Karte offen: `sichtbar === hoehe`, alles 0). */
export const mobilLage = (sichtbar: number, hoehe: number): Record<Teil, string> => ({
  fenster: `translateY(${sichtbar - hoehe}px)`,
  inhalt: `translateY(${hoehe - sichtbar}px)`,
  bild: `translateY(${(sichtbar - hoehe) / 2}px)`,
  schatten: `translateY(${sichtbar - hoehe}px)`,
});

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
  /** Index der Karte, die aufgehen soll: Im ersten Bild steht sie, wo sie war (Verankerung). */
  ziel: number;
  lagen: Lage[];
  /**
   * Danach mittig gleiten? NUR NACH EINEM TIPP. Unter 1024 px gibt es auch Geräte mit Maus (schmales Desktopfenster,
   * iPad mit Trackpad); dort öffnen Karten schon beim Darüberfahren. Gliche die Seite dann nach, rutschte die nächste
   * Karte unter den Zeiger, ginge auf, und die Seite glitte weiter: eine Kette ohne Zutun.
   */
  mittig: boolean;
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

  /**
   * Vor dem Wechsel aufrufen (im Ereignis, bevor der Zustand gesetzt wird), mit der Karte, die aufgehen soll, und ob danach
   * mittig geglitten wird (`mittig`, nur nach einem Tipp, siehe `Vorher`).
   */
  const messen = useCallback(
    (ziel: number, mittig: boolean) => {
      if (!aktiv) return;
      vorher.current = {
        ziel,
        mittig,
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
    // 3. Nach einem Tipp mittig in den freien Bereich gleiten (siehe Kopf), gleichzeitig mit dem Aufgehen.
    if (zielKarte && alt.mittig) gleitenUm(zielKarte.getBoundingClientRect().top - mittigeOberkante(hoehe), MOBIL_BEWEGUNG.dauer, MOBIL_BEWEGUNG.kurve);
  }, [offen, aktiv, hoehe]);

  // Wechsel auf Desktop oder Abbau: nichts weiterlaufen lassen.
  useEffect(() => {
    if (!aktiv) anhalten();
    return anhalten;
  }, [aktiv]);

  return { karten, messen };
};
