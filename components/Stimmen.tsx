import React, { useLayoutEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Headset, Sparkles, SprayCan, Wrench, type LucideIcon } from 'lucide-react';
import { stimmen, type Stimme, type StimmenBereich, type StimmenFoto } from '../data/stimmen';
import { HERKUNFT_TEXT, herkunftVon, istGeklaert } from '../data/bildherkunft';
import { KARTEN_RAHMEN, KARTEN_UEBERGANG, KartenFenster, KartenLogo, KartenSchleier, useAkkordeonGeraet } from './akkordeonKarten';
import { STREIFEN, fokusSichtbar, mobilLage, mobilSchatten, useMobilAkkordeon, useZeigerAbsicht, type BildZu } from './akkordeonMobil';

/**
 * Mitarbeiterstimmen auf `/karriere` — Backlog 5.28. Aussagen aus Andres Mail (2026-10-02), Fotos und Vornamen seit
 * 2026-10-03 (User; Einwilligung und Widerruf im Kopf von `data/stimmen.ts`).
 *
 * GESTALTUNG WIE DIE LEISTUNGSKARTEN DER STARTSEITE (User, 2026-10-03): dasselbe Akkordeon, am Desktop waagerecht, mobil
 * senkrecht, mit derselben Mechanik und Gestaltung (`akkordeonKarten.tsx`). Eingeklappt sind nur Beruf und
 * Bildvorschau zu sehen. Aufgeklappt zeigt die Karte Aussage, Vorname, Beruf und das ganze Bild. Am Desktop klappen Maus
 * darüber, Tastaturfokus und Klick auf; unter 1024 px siehe unten.
 *
 * MOBIL DIESELBE MECHANIK WIE DIE LEISTUNGSKARTEN (seit 2026-10-19, R33-a, deckt R25 ab; Plan und Messwerte:
 * docs/mobil-akkordeon-faq/tasks/2026-10-19-stimmen-mobil-mechanik-tasks.md). Bis dahin animierte Framer unter 1024 px
 * die Höhe (Layout in 27 von 30 Bildern bei 4-fach gedrosselter CPU), die Stimme glitt nie mittig, wuchs je nach Lage
 * nach oben oder unten (bei halber Fensterhöhe getippt mit dem Kopf 109 px unter die Navbar), und `mouseenter` öffnete
 * auch, wenn der Inhalt unter einer ruhenden Maus vorbeiscrollte. Jetzt wie in `akkordeonMobil.ts`: Die Höhe springt
 * einmal, sichtbar bewegt sich nur `transform` (Fenster, Inhalt, Bildebene, Schatten, Nachbarn per FLIP), jede
 * aufgehende Stimme gleitet mittig zwischen Navbar und Knopfleiste. Tipp, Klick und Tabulator klappen auf, die Maus nur
 * nach echter Bewegung und kurzer Ruhe (`useZeigerAbsicht`). EIN ZWEITER KLICK auf die offene Stimme holt sie ganz ins
 * Bild, falls sie angeschnitten ist (`zeigen`); zuklappen kann er nicht, es ist immer genau eine Stimme offen.
 *
 * DREI ABWEICHUNGEN VON DER STARTSEITE, alle vom Auftrag oder vom Inhalt her:
 *  1. Die Textkachel steht im UNTEREN DRITTEL, nicht links (User: „dieses mal das Textfeld nicht links orientiert,
 *     sondern im unteren Drittel der Karte“), und die Gesichter bleiben frei (User: „nicht überdeckt“).
 *     - Geometrie: volle Containerbreite wie die Expertise-Karten der Startseite (User, 2026-10-03: „auf die normale
 *       Breite“; vorher `max-w-6xl`). `flexGrow` 3 zu 1. Die Höhe ist 520 px, ab 1536 px (Container 1536) 600 px. Die
 *       offene Karte ist dann rund 389 × 520 (1024 px), 528 × 520 (1280 bis 1535 px) und 638 × 600 (ab 1536 px), also nie
 *       breiter als 1,07 × ihre Höhe. Von einem 3:4-Porträt bleiben so mindestens 70 % der Höhe sichtbar. Mobil ist die
 *       offene Karte 500 px hoch und zeigt die volle Höhe.
 *     - Bildlage am Desktop: 30 % statt mittig. Das Fenster rückt nach oben, damit über dem Kopf Luft bleibt und das Kinn
 *       trotzdem über der Kachel endet. Gerechnet für das längste Gesicht (Karol mit Bart, 12,5 bis 61 % der Höhe).
 *     - Bilder: Jedes Porträt ist so zugeschnitten, dass Kopf bis Kinn zwischen rund 14 und 60 % der Höhe liegen
 *       (`scripts/build-fotos.mjs`). Damit endet das Gesicht in jedem Fenster über zwei Dritteln der Kartenhöhe.
 *     - Kachel: höchstens ein Drittel der Kartenhöhe. Die Texte sind darauf bemessen, die längste Aussage braucht bei
 *       1024 px drei Zeilen.
 *     ⚠️ Wer Höhe, Verhältnis oder Breite ändert, rechnet das Fenster neu und misst nach (Skript in der Planung
 *     `docs/backlog/tasks/2026-10-03-stimmen-karten-fotos-tasks.md`). Mit 520 px auch ab 1536 px wäre die offene Karte
 *     638 × 520 groß: Vom Hochformat blieben 61 %, und Karols Kopf oder Bart läge außerhalb. Mit 6 zu 1 wie auf der
 *     Startseite wäre sie bei 1440 px rund 830 × 460 groß.
 *  2. Keine Links: Eine Stimme hat kein Ziel. Jede Karte ist ein fokussierbarer Listeneintrag (Fokus klappt auf wie die
 *     Maus, unter 1024 px nur der sichtbare Fokus der Tastatur), benannt nach ihrer Bildunterschrift. Die Aussage steht
 *     als `figure` mit `blockquote` und `figcaption` im DOM, auch eingeklappt: Vorlesegeräte lesen alle fünf.
 *     Eingeklappte Kacheln sind unsichtbar (`opacity-0`), aber nicht `aria-hidden`. Den Zustand trägt `data-akk-offen`
 *     (für `npm run akkordeon`); `aria-expanded` erlaubt ARIA an einem Listeneintrag nicht, und zu verbergen gibt es nichts.
 *  3. Der senkrechte Beruf der eingeklappten Streifen steht unten statt mittig und bricht nach 40 % der Höhe um.
 *     Mittig läge er auf dem Gesicht. Mobil steht er oben im Streifen, das Bild darunter in eigener Lage (`bildGeometrie`).
 *
 * HERKUNFT IST PFLICHT: `data/bildherkunft.ts` behandelt alles Ungeklärte als „KI-generiert“. An einem echten
 * Mitarbeiterfoto wäre das eine Falschangabe, ein tatsächlich erzeugtes Gesicht neben einer echten Aussage eine
 * Täuschung von Bewerbenden. Beides bricht deshalb den Prerender ab, statt still ausgeliefert zu werden.
 *
 * BILDNUMMERN: Der Platz heißt im Inventar „Porträt <Beruf>“ (`data-bild-ort`, ohne Foto `data-bild-platzhalter`).
 * So behalten B142–B146 ihre Nummern vom Platzhalter zum Foto. Nicht umbenennen.
 */

const SYMBOL: Record<StimmenBereich, LucideIcon> = {
  lack: SprayCan,
  karosserie: Wrench,
  aufbereitung: Sparkles,
  service: Headset,
};

/**
 * Name des Bildplatzes im Inventar, z. B. „Porträt Fahrzeuglackiererin“. Gleiche Berufe werden gezählt („… 2“),
 * sonst fielen zwei Plätze unter eine Nummer. Hängt an der Reihenfolge in `data/stimmen.ts`.
 */
const ortNamen = stimmen.map((s) => {
  const gleiche = stimmen.filter((t) => t.beruf === s.beruf);
  return `Porträt ${s.beruf}${gleiche.length > 1 ? ` ${gleiche.indexOf(s) + 1}` : ''}`;
});

/** Herkunft eines Mitarbeiterfotos: nur bestätigt und nie erzeugt (siehe Kopf). Wirft im Prerender. */
const herkunftDesFotos = (stimme: Stimme): 'echt' | 'aufgewertet' => {
  const quelle = stimme.foto!.src;
  const wo = `components/Stimmen.tsx: Foto der Stimme „${stimme.id}“ (${quelle})`;
  if (!quelle.startsWith('/assets/team/')) throw new Error(`${wo}: Porträts liegen unter /assets/team/ (npm run fotos).`);
  if (!istGeklaert(quelle)) {
    throw new Error(`${wo}: Herkunft in data/bildherkunft.ts eintragen („echt“ oder „aufgewertet“), nur mit Beleg. Ohne Eintrag trüge ein echtes Porträt die Vorgabe „KI-generiert“.`);
  }
  const herkunft = herkunftVon(quelle);
  if (herkunft === 'generiert') throw new Error(`${wo}: Ein KI-generiertes Gesicht neben einer echten Aussage täuscht Bewerbende. Nur echte Fotos der Person.`);
  return herkunft;
};

/** Höhe der offenen Karte auf dem Smartphone (Kopf, Punkt 1); eingeklappt `STREIFEN` (64 px) wie auf der Startseite. */
const MOBIL_OFFEN = 500;
/** Zoom des eingeklappten Bildes (am Desktop die Klasse `scale-105`, mobil Teil von `bildGeometrie`). */
const ZOOM_ZU = 1.05;
/** Senkrechte Bildlage der offenen Karte (Kopf, Punkt 1: 30 %, als `object-position`). */
const LAGE_OFFEN = 0.3;
/** Platzhalter ohne Foto und Stand vor der ersten Messung: Der Streifen zeigt den oberen Rand der Bildebene. */
const OHNE_ABBILDUNG: BildZu = { x: 0, y: 0, massstab: 1 };

/**
 * BILDLAGE IM 64-PX-STREIFEN (mobil eingeklappt). Der Streifen zeigt Augen und Nase in seiner unteren Hälfte, der Beruf
 * steht darüber (Kopf, Punkt 3). Bis 2026-10-19 stand das Bild dafür in Streifenhöhe: `object-cover` auf 64 px,
 * `object-position` x % (y − 6) %, Zoom 1,05 um die Streifenmitte. `fokus.y − 6` legt die Augenlinie bei 320 bis 430 px
 * Breite 41 bis 50 px unter die Oberkante, unter den Beruf (8 bis 24 px).
 * SEIT R33-a steht das Bild immer im Format der offenen Karte (`akkordeonMobil.ts`: nur das Fenster schneidet zu). Die
 * Abbildung `zu` bringt es im Streifen auf genau den alten Ausschnitt: erst skalieren (Ursprung oben links), dann
 * verschieben. Gerechnet für einen Punkt (u, v) des Fotos: waagerecht offen bei u·S − fx·(bw·S − b), früher bei
 * u·s − fx·(bw·s − b), gezoomt um die Streifenmitte; senkrecht ebenso mit 30 % bzw. (y − 6) % (S, s: Maßstab von
 * `object-cover` in der offenen Karte bzw. im Streifen, b: Kartenbreite, bw × bh: Fotomaße). Daraus Maßstab Z·s/S und die
 * Verschiebung unten.
 * FESTE BILDGRÖSSE STATT `object-cover` (`masse`): so groß und so verschoben, wie `object-cover` mit x % 30 % das Foto in
 * der offenen Karte zeigt, offen also pixelgleich. Mit `object-cover` endete das Bild links und rechts am Rand seines
 * Kastens; verkleinert im Streifen blieben dort graue Ränder (gemessen bei 360 px: 8 bis 13 % der Streifenpixel). In
 * fester Größe reicht es über den Kasten hinaus, zugeschnitten wird nur vom Fenster.
 * Geprüft per Pixelvergleich alter gegen neuen Build bei 360, 390, 430 und 768 px (Plan, Phase 3). Dauerhaft prüft
 * `npm run akkordeon` (BILDLAGE) Bedeckung, Augenlinie und Gesichtsmitte, unabhängig von dieser Rechnung nachgerechnet.
 */
const bildGeometrie = (foto: StimmenFoto, breite: number): { zu: BildZu; masse: React.CSSProperties } => {
  const { breite: bw, hoehe: bh, fokus } = foto;
  const S = Math.max(breite / bw, MOBIL_OFFEN / bh);
  const s = Math.max(breite / bw, STREIFEN / bh);
  const fx = fokus.x / 100;
  const fy = Math.max(0, fokus.y - 6) / 100;
  return {
    zu: {
      massstab: (ZOOM_ZU * s) / S,
      x: (breite / 2) * (1 - ZOOM_ZU) + ZOOM_ZU * fx * breite * (1 - s / S),
      y: (STREIFEN / 2) * (1 - ZOOM_ZU) + ZOOM_ZU * ((s / S) * LAGE_OFFEN * (bh * S - MOBIL_OFFEN) - fy * (bh * s - STREIFEN)),
    },
    // `maxWidth`: `index.css` begrenzt jedes Bild auf die Breite seines Kastens.
    masse: { width: bw * S, height: bh * S, left: -fx * (bw * S - breite), top: -LAGE_OFFEN * (bh * S - MOBIL_OFFEN), maxWidth: 'none' },
  };
};

const Stimmen: React.FC = () => {
  // Wie auf der Startseite ist immer genau eine Karte offen, zu Beginn die erste.
  const [aktiv, setAktiv] = useState(0);
  const { isDesktop, hoverCapable } = useAkkordeonGeraet();
  // Kartenbreite unter 1024 px (alle Karten gleich breit), für die Bildlage im Streifen. Im Layout-Effekt gemessen, also
  // vor dem ersten Bild; danach bei jeder Größenänderung. Mit Nachkommastellen (`getBoundingClientRect`, nicht
  // `clientWidth`): Bei Browser-Zoom ist die Karte nicht ganzzahlig breit (O6).
  const liste = useRef<HTMLUListElement>(null);
  const [breite, setBreite] = useState(0);
  useLayoutEffect(() => {
    const ul = liste.current;
    if (isDesktop || !ul) return;
    const messen = () => setBreite(ul.getBoundingClientRect().width);
    messen();
    const beobachter = new ResizeObserver(messen);
    beobachter.observe(ul);
    return () => beobachter.disconnect();
  }, [isDesktop]);
  // Mobil gemessen: Bildgeometrie je Stimme (`bildGeometrie`); ohne Foto oder vor der ersten Messung `null`.
  const geometrie = stimmen.map((st) => (!isDesktop && st.foto && breite > 0 ? bildGeometrie(st.foto, breite) : null));
  const bildZu = (idx: number): BildZu => geometrie[idx]?.zu ?? OHNE_ABBILDUNG;
  // Mobil: Höhe springt, sichtbar bewegt sich nur `transform`, die Stimme gleitet mittig (akkordeonMobil.ts). Am Desktop
  // tut der Hook nichts.
  const { karten, messen, zeigen } = useMobilAkkordeon(!isDesktop, MOBIL_OFFEN, aktiv, bildZu);
  /** Stimme öffnen. Mobil vorher die sichtbare Lage messen, damit die Bewegung dort beginnt. */
  const oeffnen = (idx: number) => {
    if (idx === aktiv) return;
    messen(idx);
    setAktiv(idx);
  };
  // Maus oder Trackpad unter 1024 px: aufklappen nur nach echter Bewegung und kurzer Ruhe (Kette von O8, akkordeonMobil.ts).
  useZeigerAbsicht(!isDesktop && hoverCapable, karten, oeffnen);
  return (
    <motion.ul
      ref={liste}
      role="list"
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className="flex flex-col gap-2.5 lg:h-[520px] lg:flex-row lg:gap-3 2xl:h-[600px]"
    >
      {stimmen.map((s, idx) => {
        const offen = aktiv === idx;
        const herkunft = s.foto ? herkunftDesFotos(s) : null;
        const beruf = s.anzeigeBeruf ?? s.beruf;
        const fokus = s.foto?.fokus ?? { x: 50, y: 50 };
        // Bildlage 30 % (Kopf, Punkt 1: Luft über dem Kopf, Kinn über der Kachel). Mobil aufgeklappt ist das Bild bis
        // 375 px Kartenbreite ohnehin ganz hoch sichtbar; dort steht es in fester Größe mit derselben Lage, und den Streifen
        // rückt die Bildebene zurecht (`bildGeometrie`), statt wie bis R33-a `object-position` (lief nicht auf dem Compositor).
        const bildLage = `${fokus.x}% ${LAGE_OFFEN * 100}%`;
        const mobilZu = !offen && !isDesktop;
        // Mobile Ruhelage von Schatten, Fenster, Inhalt und Bildebene (akkordeonMobil.ts); am Desktop keine Inline-Transforms.
        const lage = isDesktop ? null : mobilLage(offen ? MOBIL_OFFEN : STREIFEN, MOBIL_OFFEN, bildZu(idx));
        const Symbol = SYMBOL[s.bereich];
        const unterschrift = `stimme-${s.id}`;
        return (
          <motion.li
            key={s.id}
            ref={(el: HTMLLIElement | null) => {
              karten.current[idx] = el;
            }}
            tabIndex={0}
            aria-labelledby={unterschrift}
            data-akk-offen={offen}
            // Desktop: Darüberfahren klappt sofort auf. Unter 1024 px nicht `mouseenter` (feuert auch, wenn sich der Inhalt
            // unter einer ruhenden Maus bewegt), dort gilt die Zeigerabsicht.
            onMouseEnter={hoverCapable && isDesktop ? () => oeffnen(idx) : undefined}
            // Tastatur: Fokus klappt auf. Unter 1024 px nur der sichtbare Fokus; den Fokus beim Tipp oder Mausklick übernimmt
            // dort der Klick (sonst ginge die Stimme schon beim Drücken auf und glitte unter dem Finger weg).
            onFocus={(event) => {
              if (isDesktop || fokusSichtbar(event.currentTarget)) oeffnen(idx);
            }}
            // Zugeklappt: aufklappen. Offen: unter 1024 px ganz ins Bild holen, falls angeschnitten (Kopf); am Desktop nichts.
            onClick={() => (offen ? zeigen(idx) : oeffnen(idx))}
            initial={false}
            // Framer bewegt nur am Desktop etwas (Breite per `flexGrow`); mobil springt die Höhe über `style`, `flexGrow` steht
            // fest auf 1. Immer gesetzt, sonst blieben die Stimmen nach dem Wechsel auf den Desktop 0 px breit (R33-e, wie
            // `ExpandingCardAccordion`).
            animate={{ flexGrow: isDesktop && offen ? 3 : 1 }}
            style={isDesktop ? undefined : { height: offen ? MOBIL_OFFEN : STREIFEN }}
            transition={KARTEN_UEBERGANG}
            className={KARTEN_RAHMEN}
          >
            <KartenFenster lage={lage} hoehe={MOBIL_OFFEN} schatten={mobilSchatten(offen ? MOBIL_OFFEN : STREIFEN, MOBIL_OFFEN)}>
              {s.foto ? (
                <span data-bild-ort={ortNamen[idx]} data-akk="bild" style={lage ? { transform: lage.bild } : undefined} className="absolute inset-0 origin-top-left">
                  <img
                    src={s.foto.src}
                    alt={s.foto.alt}
                    width={s.foto.breite}
                    height={s.foto.hoehe}
                    loading="lazy"
                    decoding="async"
                    style={geometrie[idx]?.masse ?? { objectPosition: bildLage }}
                    className={`absolute inset-0 h-full w-full object-cover lg:transition-transform lg:duration-700 lg:ease-out ${offen ? 'lg:scale-100' : 'lg:scale-105'}`}
                  />
                </span>
              ) : (
                // Ohne Foto (Widerruf, `data/stimmen.ts`): Symbol des Gewerks auf dunklem Grund. Dunkel, weil der weiße
                // Beruf des eingeklappten Streifens darauf lesbar bleiben muss.
                <span
                  data-bild-platzhalter={ortNamen[idx]}
                  data-akk="bild"
                  aria-hidden="true"
                  style={lage ? { transform: lage.bild } : undefined}
                  className="absolute inset-0 flex origin-top-left items-start justify-center bg-gray-800 pt-[18%]"
                >
                  <Symbol className="h-12 w-12 text-white/60" strokeWidth={1.5} />
                </span>
              )}
              {/* Verlauf und Vignette (`akkordeonKarten.tsx`). ZWEI FASSUNGEN MOBIL wie auf der Startseite: Der Inhalt ist
                  so hoch wie die offene Karte, sein Schleier säße eingeklappt unter dem Streifen. Der 64 px hohe Streifen
                  trägt deshalb einen eigenen (eingeklappt sichtbar), der große blendet beim Aufklappen ein. Desktop: nur
                  der große, immer. Ebenso der gestrichelte Rand eines Platzhalters. */}
              <div aria-hidden="true" className={`absolute inset-0 rounded-[1.5rem] transition-opacity duration-300 ${offen ? '' : 'max-lg:opacity-0'}`}>
                <KartenSchleier />
              </div>
              <div aria-hidden="true" className={`absolute inset-x-0 top-0 h-16 rounded-[1.5rem] transition-opacity duration-300 lg:hidden ${offen ? 'opacity-0' : ''}`}>
                <KartenSchleier />
              </div>
              {s.istPlatzhalter && (
                <>
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-0 rounded-[1.5rem] border-2 border-dashed border-white/70 transition-opacity duration-300 ${offen ? '' : 'max-lg:opacity-0'}`} />
                  <span aria-hidden="true" className={`pointer-events-none absolute inset-x-0 top-0 h-16 rounded-[1.5rem] border-2 border-dashed border-white/70 transition-opacity duration-300 lg:hidden ${offen ? 'opacity-0' : ''}`} />
                </>
              )}
              {/* Eingeklappt: der Beruf, nie auf Augen, Nase oder Mund.
                  - Desktop: senkrecht wie auf der Startseite, aber unten statt mittig, denn mittig läge er auf dem Gesicht.
                    `justify-start` und `pt-6` wirken durch die Drehung um 180° unten. Der innere Teil bricht nach 40 % der
                    Höhe in eine weitere Spalte um („Karosserie- und / Fahrzeugbau- / mechaniker“).
                  - Mobil: OBEN im 64-px-Streifen, über Haar und Stirn, Augen und Nase darunter (`bildGeometrie`). Auf der
                    Startseite steht er unten. Hier läge er dort auf dem Mund (Bildschirmfoto 390 px, 03.10.). Damit er auf
                    heller Stirn und blondem Haar lesbar bleibt, liegt ein Verlauf von oben darunter, nur mobil und nur
                    eingeklappt. */}
              <div
                aria-hidden="true"
                className={`pointer-events-none absolute inset-x-0 top-0 h-11 bg-gradient-to-b from-[rgb(var(--cc-cta-blue-rgb)/0.6)] to-transparent transition-opacity duration-300 lg:hidden ${mobilZu ? 'opacity-100' : 'opacity-0'}`}
              />
              <span
                aria-hidden="true"
                className={`pointer-events-none absolute inset-0 flex items-start justify-center px-4 pt-2 text-center text-[13px] font-bold uppercase leading-tight tracking-wide text-white [text-shadow:0_1px_10px_rgb(var(--cc-carbon-rgb)/0.85)] transition-opacity duration-300 lg:rotate-180 lg:items-center lg:justify-start lg:px-0 lg:pb-0 lg:pt-6 lg:text-[15px] lg:leading-normal lg:[writing-mode:vertical-rl] ${offen ? 'opacity-0' : 'opacity-100'}`}
              >
                <span className="hyphens-manual lg:max-h-[40%]">{beruf}</span>
              </span>

              {/* Aufgeklappt: weiße Kachel im unteren Drittel (Kopf, Punkt 1), Gestaltung wie die Kachel der Startseite.
                  `max-h`: Sie wächst nie über das Drittel ins Gesicht. Reicht der Platz einmal nicht, scrollt sie. */}
              <figure
                className={`cc-card-scroll absolute inset-x-3 bottom-3 z-10 max-h-[calc(33.333%-0.75rem)] overflow-y-auto rounded-2xl bg-[rgb(255_255_255/0.92)] p-4 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] transition duration-300 md:p-5 ${
                  offen ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-2 opacity-0'
                }`}
              >
                <blockquote>
                  <p className="text-base font-semibold leading-snug tracking-tight text-gray-950 md:text-lg">„{s.aussage}“</p>
                </blockquote>
                {/* Der blaue Punkt nach dem Vornamen wie hinter den Kartentiteln der Startseite. Für Vorlesegeräte
                    trennt ein Komma Name und Beruf (der Punkt ist `aria-hidden`). */}
                <figcaption id={unterschrift} className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                  {s.vorname && (
                    <span className="text-sm font-bold text-gray-950">
                      {s.vorname}
                      <span aria-hidden="true" className="ml-[0.06em] text-blue-600">•</span>
                      <span className="sr-only">,</span>
                    </span>
                  )}
                  <span className="hyphens-manual break-words text-[10px] font-bold uppercase tracking-[0.2em] text-gray-700">{beruf}</span>
                  {herkunft === 'aufgewertet' && <span className="basis-full text-[10px] text-gray-600">Foto {HERKUNFT_TEXT.aufgewertet}</span>}
                </figcaption>
              </figure>

              {/* Logo wie auf der Startseite, nur an der offenen Karte. Oben rechts statt unten: Unten steht die Kachel,
                  und in der oberen rechten Ecke steht in keinem der fünf Ausschnitte ein Gesicht. */}
              <KartenLogo sichtbar={offen} lage="right-3 top-3" />
            </KartenFenster>
          </motion.li>
        );
      })}
    </motion.ul>
  );
};

export default Stimmen;
