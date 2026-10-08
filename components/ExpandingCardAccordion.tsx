import React, { useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import KiMarke from './KiMarke';
import BereichsPlakette from './BereichsPlakette';
import GanzwortTitel from './GanzwortTitel';
import { KARTEN_RAHMEN, KARTEN_UEBERGANG, KartenLogo, KartenSchleier, useAkkordeonGeraet } from './akkordeonKarten';
import type { BereichsAngabe } from '../data/services';

/**
 * Ein Item des ExpandOnHover-Akkordeons. Bewusst minimal, damit sowohl
 * Leistungskarten (`OverviewService`) als auch Wissens-/Expertise-Karten
 * darauf gemappt werden koennen.
 */
export interface ExpandingCardItem {
  id: string;
  title: string;
  description: string;
  href: string;
  /** Kurzer CTA-Text der aufgeklappten Karte (Fallback: "Mehr ansehen"). */
  cta?: string;
  /** Hintergrundbild der Karte (Pfad in /public/assets). Pro Karte austauschbar. */
  backgroundImage?: string;
  /**
   * Video statt Foto (Pfad in /public/assets). `backgroundImage` ist dann sein Standbild — es
   * steht in der eingeklappten Karte und im Sektionshintergrund.
   *
   * SPARSAM MIT DATENVOLUMEN (Wunsch des Users 2026-09-21, Karte B11 der Startseite): Der
   * Browser laedt zunaechst nur das Standbild. Das Video startet erst, wenn die Karte
   * AUFGEKLAPPT ist und im Bild steht, und haelt an, sobald eine andere Karte aufgeht. Wer die
   * Karte nie oeffnet, laedt das Video nie. Siehe `KartenVideo` unten.
   */
  backgroundVideo?: string;
  /**
   * Zusaetzliche Punkte unter der Beschreibung, z. B. Stellenanforderungen.
   * Sie wachsen der Karte ueber den Kopf — deshalb scrollt der Textbereich,
   * statt die Karte zu strecken. Ohne Angabe aendert sich am Layout nichts.
   */
  details?: string[];
  /** Ueberschrift ueber der Detailliste, z. B. „Das bringen Sie mit". */
  detailsLabel?: string;
  /**
   * Kleines Abzeichen ueber dem Titel, z. B. ein Ausschreibungsstand.
   * `ton: 'ruhig'` fuer Zustaende, die KEINE Handlung nahelegen (nicht suchend) —
   * ein blaues Abzeichen an dieser Stelle liest sich wie eine Einladung.
   */
  badge?: { label: string; ton?: 'aktiv' | 'ruhig' };
  /** „Care" oder „Repair" ueber dem Titel (Backlog 6.8) — `ServiceGrid` leitet es aus der Katalog-Gruppe ab. */
  bereich?: BereichsAngabe;
  /**
   * Kurzer Hinweis ueber der Beschreibung, z. B. warum die Karte gedaempft ist.
   * Traegt die Erklaerung dorthin, wo die Daempfung auffaellt.
   */
  hinweis?: string;
  /**
   * Gedaempfte Darstellung: Foto in Graustufen und abgedunkelt, Textbox leicht
   * eingegraut. Fuer Zustaende, die es gibt, auf die man aber gerade nicht handeln kann.
   *
   * ⚠️ DIE STAERKEN SIND GEMESSEN, NICHT GESCHAETZT — nicht ohne Nachrechnen aendern.
   * Die Textbox ist `weiss @ 92 %` ueber dem Foto; im schlechtesten Fall (schwarzes
   * Fotopixel) liegt `gray-600` darauf bei 6,33:1. Ein Schleier darueber senkt das:
   *
   *   Schleier 0,15 → 5,30:1     0,20 → 4,95:1     0,26 → 4,50:1 (Grenze)
   *   Schleier 0,30 → 3,90:1  ✗  0,45 → 3,2:1   ✗
   *
   * Deshalb ZWEI Staerken statt einer: 0,45 auf dem Foto, wo kein Text liegt, und nur
   * 0,15 auf der Textbox. Ein einziger Wert ueber allem muesste unter 0,26 bleiben und
   * waere dann kaum zu sehen — visuell gegengeprueft am 2026-09-03.
   *
   * Der weisse Titel der EINGEKLAPPTEN Karte gewinnt dabei: 3,95:1 → 8,69:1, weil das
   * Foto dunkler wird.
   */
  gedaempft?: boolean;
}

/**
 * Standard-Hintergrundbild der Karten. Pro Karte via `backgroundImage`
 * ueberschreibbar (neue Bilder in /public/assets ablegen und Pfad eintragen).
 * Der ExpandOnHover-Effekt (skiper52/53) wirkt am staerksten mit UNTERSCHIEDLICHEN
 * Bildern je Karte.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.webp';

/**
 * Kartenvideo: laeuft nur, solange die Karte aufgeklappt ist UND im Bild steht.
 *
 * WARUM NICHT `autoPlay`: Damit startete (und laedt) das Video sofort — auch im eingeklappten,
 * rund 82 px schmalen Streifen, in dem niemand etwas davon sieht, und auch dann, wenn die
 * Sektion noch drei Bildschirme tiefer liegt. `preload="none"` plus Start per Code haelt die
 * Seite so leicht wie mit dem Foto.
 *
 * WCAG 2.2.2 (Anhalten): Die Bewegung endet, sobald eine andere Karte aufgeht — am Desktop per
 * Maus oder Tabulator, am Smartphone per Tipp. Ein eigener Pause-Knopf ginge hier nicht: Die
 * ganze Karte ist ein Link, und Bedienelemente in einem Link sind unzulaessiges HTML.
 * Ein `<video>` OHNE `controls` ist dagegen kein interaktives Element und darf darin stehen.
 */
const KartenVideo: React.FC<{ quelle: string; standbild: string; aktiv: boolean; className: string }> = ({
  quelle,
  standbild,
  aktiv,
  className,
}) => {
  const ref = useRef<HTMLVideoElement>(null);
  const [imBild, setImBild] = useState(false);

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
    if (aktiv && imBild) {
      // Als Eigenschaft setzen: React schreibt `muted` nicht zuverlaessig ins DOM, und Browser
      // lassen ein Video nur stumm ohne Klick anlaufen.
      el.muted = true;
      el.play().catch(() => {
        /* z. B. Energiesparmodus unter iOS: Dann bleibt das Standbild stehen — kein Fehlerfall. */
      });
    } else {
      el.pause();
    }
  }, [aktiv, imBild]);

  return (
    <video
      ref={ref}
      src={quelle}
      poster={standbild}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      className={className}
    />
  );
};

interface ExpandingCardAccordionProps {
  items: ExpandingCardItem[];
  /** Optionales aria-Label-Suffix pro Karte (Default: item.cta bzw. "Mehr ansehen"). */
  className?: string;
  /**
   * Optionaler Callback: meldet das aufgeloeste Bild der aktuell **aufgeklappten** Karte
   * (nicht nur beim Hovern, sondern solange die Karte offen ist — auf Desktop ist immer
   * genau eine offen). Damit kann die umgebende Sektion einen Full-Bleed-Hintergrund
   * einblenden, der bestehen bleibt (siehe ServiceGrid). Auf Mobile `null` (kein Hover-
   * getriebener Section-Hintergrund).
   */
  onActiveImageChange?: (image: string | null) => void;
  /**
   * Hoehe der aufgeklappten Karte auf Mobile, in Pixeln. Default 340.
   *
   * Braucht Anhebung, sobald `details` gesetzt sind: Bei 340 px blieb auf 390 px Breite
   * nach Beschreibung und Zwischenueberschrift kein Platz mehr fuer die Liste — die
   * Ueberschrift „Das bringen Sie mit" stand ohne Inhalt ueber dem CTA und sah aus wie
   * ein Fehler. Der Scrollbereich braucht sichtbare Zeilen, sonst kann niemand ahnen,
   * dass es etwas zu scrollen gibt. Desktop ist nicht betroffen (feste Sektionshoehe).
   */
  mobileActiveHeight?: number;
}

/**
 * ExpandOnHover-Akkordeon (skiper52 Desktop horizontal / skiper53 Mobile vertikal).
 * Kollabierte Karten zeigen nur den Titel; eine Karte expandiert und blendet eine
 * weiße Textbox (Titel + blauer Punkt + Beschreibung + CTA/Pfeil-Badge) + Logo-Badge ein.
 * Geteilt von Leistungsuebersicht (`ServiceGrid`) und Autoaufbereitungs-Expertise.
 */
const ExpandingCardAccordion: React.FC<ExpandingCardAccordionProps> = ({ items, className, onActiveImageChange, mobileActiveHeight = 340 }) => {
  // Aktiv (aufgeklappt): Desktop = horizontales Akkordeon (skiper52),
  // Mobile = vertikales Akkordeon (skiper53).
  const [active, setActive] = useState(0);
  // Glas-Plaketten erst nach der Einblendung des Akkordeons (2026-10-05, `sichtbar` in BereichsPlakette).
  const [eingeblendet, setEingeblendet] = useState(false);

  // Geraet, Uebergang, Rahmen, Schleier und Logo teilen sich seit 2026-10-03 beide Akkordeons
  // (`akkordeonKarten.tsx`, dort die Begruendungen fuer Framer statt CSS und gegen reduced-motion).
  // Hover-faehig (Desktop) vs. Touch: auf Touch expandiert der erste Tap, erst der
  // zweite folgt dem Link. Hover/Focus setzen `active` nur auf Hover-Geraeten,
  // damit der Tap-Handler nicht durch ein vorab gefeuertes Focus-Event ausgehebelt wird.
  const { isDesktop, hoverCapable } = useAkkordeonGeraet();

  // Section-Hintergrund folgt der AKTIVEN (aufgeklappten) Karte — nicht dem Hover.
  // Auf Desktop ist immer genau eine Karte offen, der Hintergrund bleibt also stehen,
  // auch wenn die Maus den Strip verlaesst. Auf Mobile bewusst `null` (kein Full-Bleed-
  // Hintergrund hinter dem vertikalen Stapel). Deckt Mount (active=0) + jeden Wechsel ab.
  useEffect(() => {
    onActiveImageChange?.(isDesktop ? items[active]?.backgroundImage ?? DEFAULT_CARD_BG : null);
  }, [active, isDesktop, items, onActiveImageChange]);

  return (
    // Akkordeon: Mobile vertikal (Hoehe animiert, skiper53), Desktop horizontal
    // (flex-grow animiert, skiper52). Kein horizontales Scrollen.
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      onAnimationComplete={() => setEingeblendet(true)}
      className={`flex flex-col gap-2.5 lg:h-[460px] lg:flex-row lg:gap-3 ${className ?? ''}`}
    >
      {items.map((item, idx) => {
        const isActive = active === idx;
        // Exakt das sichtbare Kartenbild — damit der Section-Hintergrund 1:1 dem Hover entspricht.
        const cardImage = item.backgroundImage ?? DEFAULT_CARD_BG;
        // Gilt fuer Foto und Video gleich: Zoom beim Aufklappen, Graustufen bei gedaempften Karten.
        const bildKlasse = `absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out ${isActive ? 'scale-100' : 'scale-105'} ${item.gedaempft ? 'grayscale contrast-[0.92]' : ''}`;
        return (
          <motion.a
            key={item.id}
            href={item.href}
            aria-label={`${item.title.replace(/\u00AD/g, '')}: ${item.cta ?? 'Mehr ansehen'}`}
            aria-expanded={isActive}
            onMouseEnter={hoverCapable ? () => setActive(idx) : undefined}
            onFocus={hoverCapable ? () => setActive(idx) : undefined}
            onClick={(event) => {
              // Touch: erster Tap klappt auf, zweiter folgt dem Link.
              if (!hoverCapable && !isActive) {
                event.preventDefault();
                setActive(idx);
              }
            }}
            initial={false}
            animate={{
              flexGrow: isActive ? 6 : 1,
              height: isDesktop ? '100%' : isActive ? mobileActiveHeight : 64,
            }}
            transition={KARTEN_UEBERGANG}
            className={KARTEN_RAHMEN}
          >
            {/* Layer 1 – Hintergrundbild (pro Karte austauschbar), wahlweise als Video */}
            {item.backgroundVideo ? (
              <KartenVideo quelle={item.backgroundVideo} standbild={cardImage} aktiv={isActive} className={bildKlasse} />
            ) : (
              <img src={cardImage} alt="" aria-hidden="true" loading="lazy" decoding="async" className={bildKlasse} />
            )}
            {/* Verlauf von unten und Vignette ringsum, Schwarzblau (Begruendung in `akkordeonKarten.tsx`). */}
            <KartenSchleier />
            {/* Kennzeichnung des Kartenmotivs. Am Desktop NUR auf der aufgeklappten Karte:
                Die eingeklappten Streifen sind rund 82 px breit, die Plakette wuerde dort
                angeschnitten. Mobil ist jede Karte volle Breite, dort steht sie immer.
                Auf dem 64 px hohen mobilen Streifen 4 px hoeher (`top-2`) und der Titel unten
                (siehe dort): Mittig gesetzt lag er bei 360–430 px auf 11 von 96 Streifen unter der
                Plakette (gemessen 2026-09-27, z. B. „Autoglas / Scheibenfolien", „Industriekaufmann/-frau"). */}
            {(isActive || !isDesktop) && <KiMarke quelle={cardImage} className={isActive ? 'right-3 top-3' : 'right-3 top-2'} />}
            {/* Schleier NUR ueber dem Foto: liegt vor Bild und Verlauf, aber hinter dem
                eingeklappten Titel (gleicher Stapel, spaeter im DOM) und hinter der
                Textbox (z-10). Deshalb kein z-Index — die DOM-Reihenfolge genuegt. */}
            {item.gedaempft && (
              <div aria-hidden="true" className="absolute inset-0 bg-[rgb(var(--cc-carbon-rgb)/0.45)]" />
            )}

            {/* Kollabiert: Kartenname – horizontal (Mobile) bzw. vertikal (Desktop),
                faded bei aktiv aus. Mobil am UNTEREN Rand des Streifens statt mittig: Oben rechts
                steht die KI-Plakette, und unten liegt der dunklere Teil des Verlaufs. */}
            <span
              aria-hidden="true"
              className={`pointer-events-none absolute inset-0 flex items-end justify-center px-4 pb-2.5 text-center text-[13px] font-bold uppercase leading-tight tracking-wide text-white lg:items-center lg:pb-0 lg:leading-normal [text-shadow:0_1px_10px_rgb(var(--cc-carbon-rgb)/0.85)] transition-opacity duration-300 lg:rotate-180 lg:text-[15px] lg:[writing-mode:vertical-rl] ${isActive ? 'opacity-0' : 'opacity-100'}`}
            >
              {item.title}
            </span>

            {/* Aktiv: weiße Textbox im TargetGroupCards-Design */}
            <div
              // Der zweite, schwaechere Schleier liegt als INSET-Schatten in derselben
              // `box-shadow`-Angabe wie der Schlagschatten — zwei Klassen wuerden sich
              // gegenseitig ueberschreiben, box-shadow stapelt nicht ueber Klassen hinweg.
              className={`absolute inset-y-3 left-3 z-10 flex w-[78%] flex-col rounded-2xl bg-[rgb(255_255_255/0.92)] p-6 transition duration-300 sm:w-[62%] lg:w-[300px] ${
                item.gedaempft
                  ? 'shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5),inset_0_0_0_9999px_rgb(var(--cc-carbon-rgb)/0.15)]'
                  : 'shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)]'
              } ${isActive ? 'translate-x-0 opacity-100' : 'pointer-events-none -translate-x-2 opacity-0'}`}
            >
              {/* Care/Repair steht seit 28.09. abends NICHT mehr hier, sondern als eigene Ebene vor der Kachel (unten). */}
              {item.badge && (
                <div className="mb-3 flex flex-wrap items-center gap-2">
                  {item.badge && (
                    <span
                      className={`inline-flex w-fit items-center gap-1.5 rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] ${
                        item.badge.ton === 'ruhig'
                          ? 'bg-gray-100 text-gray-700'
                          : 'bg-blue-50 text-blue-600'
                      }`}
                    >
                      <span
                        aria-hidden="true"
                        className={`h-1.5 w-1.5 rounded-full ${item.badge.ton === 'ruhig' ? 'bg-gray-400' : 'bg-blue-600'}`}
                      />
                      {item.badge.label}
                    </span>
                  )}
                </div>
              )}
              {/* TITEL OHNE SILBENTRENNUNG (User, 2026-10-03: „keine Bindestriche für die Trennung von Wörtern“).
                  `GanzwortTitel` bricht nur an Leerzeichen um, jedes Wort bleibt ganz, und ist das längste Wort zu breit,
                  wird die Schrift für diesen Titel so weit kleiner, dass es passt (20 px mobil, 24 px ab `md` als
                  Obergrenze). Bis dahin trennte der Browser nach Silbenregel (Backlog 5.25, „Fahrzeugbaumechaniker/in“
                  lief bei 24 px über den Kasten) — „Hagelschaden-reparatur“, „Reparatur-lackierung“.
                  Der blaue Punkt ist ein Schriftzeichen im selben `nowrap`-Teil wie das letzte Wort und rutscht nie
                  allein in eine Zeile. `-mr-3`: Der Titel darf 12 px in den rechten Innenrand der Kachel ragen. */}
              <GanzwortTitel
                text={item.title}
                punkt
                laufweite={-0.025}
                huelle="-mr-3"
                className="font-bold leading-tight tracking-tight text-gray-950 [--titel-max:1.25rem] md:[--titel-max:1.5rem]"
              />
              {/* Scrollbarer Textbereich. `min-h-0` ist hier nicht kosmetisch: Ohne das
                  bekommt ein Flex-Kind die Mindesthoehe seines Inhalts und laeuft aus der
                  Karte heraus, statt zu scrollen. `.cc-card-scroll` liefert die schmale
                  Leiste in Kartenfarbe (index.css, aus TargetGroupCards uebernommen). */}
              {/* KEIN WEISSER VERLAUF MEHR (entfernt 2026-09-24, Wunsch des Users: „Weissuebergang
                  weg"). Bis dahin lag hier ein weisser Verlauf (weiss 92 %) UEBER dem Textbereich,
                  als Hinweis „es geht weiter". Die Textbox ist selbst weiss 92 % — die zweite
                  Schicht machte das Feld unten sichtbar heller, ein Band direkt ueber dem CTA.
                  Und er stand IMMER, auch wenn nichts scrollt: Gemessen am 2026-09-24 laeuft auf
                  der Startseite keine der 14 Karten ueber, in keinem Fenster (1920, 1440, 390).
                  Jetzt `.cc-scroll-verlauf` (styles/scrollverlauf.css, seit 2026-09-17 in den
                  Zielgruppenkarten): blendet den INHALT aus statt Weiss darueberzulegen, und nur,
                  solange der Bereich tatsaechlich weiterscrollt. Wo der Text passt, ist nichts
                  zu sehen; wo er ueberlaeuft (Stellenkarten mit Anforderungsliste), bleibt der
                  Hinweis — ohne Band. */}
              <div className="mt-3 flex min-h-0 flex-1 flex-col">
                <div className="cc-card-scroll cc-scroll-verlauf min-h-0 flex-1 overflow-y-auto pr-1">
                {item.hinweis && (
                  <p className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-xs leading-relaxed text-gray-700">
                    {item.hinweis}
                  </p>
                )}
                <p className="text-sm leading-relaxed text-gray-600">{item.description}</p>
                {item.details && item.details.length > 0 && (
                  <>
                    <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-gray-700">
                      {item.detailsLabel ?? 'Das bringen Sie mit'}
                    </p>
                    <ul className="mt-2 space-y-1.5">
                      {item.details.map((punkt) => (
                        <li key={punkt} className="flex gap-2 text-sm leading-relaxed text-gray-600">
                          <span aria-hidden="true" className="mt-2 h-1 w-1 shrink-0 rounded-full bg-blue-600" />
                          {punkt}
                        </li>
                      ))}
                    </ul>
                  </>
                )}
                </div>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3 pt-4">
                <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{item.cta ?? 'Mehr ansehen'}</span>
                <span className="cc-gradient-fill flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                  <ArrowUpRight size={16} />
                </span>
              </div>
            </div>

            {/* CARE/REPAIR VOR DER TEXTKACHEL (6.8, Seitendurchgang mit dem User).
                Bis 2026-09-28 stand die Plakette IN der weissen Kachel; der User wollte sie davor („vor der
                Textkachel"). Jetzt eine eigene Ebene ueber der Kachel (z-20, Kachel z-10), als Reiter auf ihrer
                Oberkante, buendig mit dem Kacheltext, in Liquid Glass (`BereichsPlakette`).
                NUR AN DER OFFENEN KARTE (User, 2026-09-29: „in einer eingeklappten Karte sollte das Care- und
                Repair-Label nicht gesehen werden"). Einen Abend lang stand sie auch auf den eingeklappten Streifen,
                am Desktop senkrecht; das ist zurueckgenommen. Sie blendet mit der Kachel ein und aus (300 ms).
                Nur Karten mit `bereich` (Startseite); die Stellenkarten der Karriereseite tragen keinen. */}
            {/* Die Deckkraft steht seit 2026-10-05 an der Plakette, nicht an diesem Halter: Ein ein- oder ausblendender
                Vorfahr schaltet ihr Glas ab (Sprung am Ende des Uebergangs). */}
            {item.bereich && (
              <span aria-hidden="true" className="pointer-events-none absolute left-9 top-3 z-20 -translate-y-1/2">
                <BereichsPlakette bereich={item.bereich} sichtbar={isActive && eingeblendet} />
              </span>
            )}

            {/* Logo-Badge unten rechts – nur auf der aufgeklappten Karte
                (kollabierte Streifen sind zu schmal/niedrig) */}
            <KartenLogo sichtbar={isActive} lage="bottom-3 right-3" />
          </motion.a>
        );
      })}
    </motion.div>
  );
};

export default ExpandingCardAccordion;
