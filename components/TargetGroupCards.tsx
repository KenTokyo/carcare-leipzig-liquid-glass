import React, { Fragment, useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TargetGroup } from '../types';
import { claimsPartners, dealerPartners, insurancePartners } from '../data/partners';
import ZielgruppenPartner from './ZielgruppenPartner';
import KiMarke from './KiMarke';

/**
 * Standard-Hintergrundbild der Kacheln.
 * Zum Tauschen: entweder diese Konstante aendern (gilt fuer alle Kacheln ohne
 * eigenes Bild) ODER pro Kachel das Feld `backgroundImage` unten setzen.
 * Neue Bilder in `public/assets/` ablegen und den Pfad hier eintragen.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.webp';

/** Animierte CarCare-Marke fuer das Logo-Badge. */
const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';

/** Reihenfolge im Array = Stapel-Reihenfolge (Index 0 liegt zuunterst). */
const groups: TargetGroup[] = [
  {
    id: 'privatkunden',
    title: 'Privatkunden',
    description: 'Fahrzeugpflege, Smart Repair, Leasingrückgabe und schnelle Hilfe bei Schäden.',
    cta: 'Für Privatkunden',
    iconName: 'User',
    // Zeigte bis 2026-08-09 auf `/fahrzeugaufbereitung-leipzig` — ein Zeiger aus der Zeit
    // vor `/privatkunden` (Seite kam erst mit 78c3893). Dadurch war die Privatkundenseite
    // von der Startseite aus nur ueber das Navbar-Menue erreichbar.
    href: '/privatkunden',
    backgroundImage: '/assets/kacheln/privatkunden-leipzig-carcare.webp',
  },
  {
    id: 'versicherungen',
    title: 'Versicherungen & Agenturen',
    /**
     * Ansprache an Versicherer und Schadensteuerer — beantwortet das „Warum diese
     * Werkstatt". Ersetzt den frueheren allgemeinen Einzeiler.
     *
     * Alle Aussagen sind durch Bestehendes gedeckt (CLAUDE.md / SEO-GEO-STANDARDS.md):
     * „Instandsetzung statt Tauschen" (Wortlaut seit Backlog 4.12) durch das eigene Leistungsspektrum (Smart Repair,
     * Dellenentfernung, Felgenreparatur), Glasurit-Lackpartnerschaft, Werkstatt-
     * ersatzfahrzeug und strukturierte Ablaeufe. Bewusst keine Zahlen zu Steuerungs-
     * quoten oder Durchlaufzeiten — die liegen hier nicht belegt vor.
     */
    description:
      'Schadenaufnahme, Kalkulation und Instandsetzung aus einer Hand — Instandsetzung statt Tauschen, wo es fachlich vertretbar ist. Farbtongenau als Glasurit-Lackpartner, mit Werkstattersatzfahrzeug, festem Ansprechpartner und strukturierten Abläufen.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    // Zeigte bis 2026-08-09 auf `/unfallinstandsetzung-leipzig`. Auf Wunsch des Users
    // fuehrt „kennenlernen" jetzt auf die Unternehmensseite: Versicherer und Steuerer
    // wollen an dieser Stelle wissen, WER der Betrieb ist, nicht wie repariert wird.
    // Die Leistungsseite bleibt ueber den Text der Karte und `/leistungen` erreichbar.
    href: '/ueber-uns',
    backgroundImage: '/assets/kacheln/versicherungen-und-agenturen-leipzig-carcare.webp',
    secondaryCta: { label: 'Partnerschaft anfragen', href: '/kontakt#contact-business' },
    // Seit 2026-09-16 mit dem Schadensteuerer riparo — daher nicht mehr „Versicherungspartner".
    partnersLabel: 'Versicherer & Schadensteuerer',
    /**
     * 31 Versicherer plus Schadensteuerer. Die Liste nimmt den Platz, der in der Kachel frei
     * bleibt, und scrollt darin (`ZielgruppenPartner`) — auf Full HD stehen alle 32 ohne
     * Scrollen in drei Spalten.
     *
     * Logos NUR mit Freigabe (2026-09-16: riparo). Versicherer-Logos sind geschuetzte Marken;
     * ohne Freigabe bleibt es bei der Namensnennung als Referenz. Freigegebene Partner stehen
     * vorn, damit die Logos nicht zwischen 31 Namen verschwinden.
     */
    partners: [...claimsPartners, ...insurancePartners],
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    /**
     * Partneransprache — ersetzt hier den frueheren generischen Einzeiler
     * („Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern …").
     *
     * BEWUSST EIN Absatz statt Beschreibung + Zusatztext: Die Kachelhoehe haengt am
     * Viewport (`100svh - i x --bar`). Auf einem Laptop (1366 x 657 Fensterinhalt) bleibt
     * fuer Text, zwei CTAs und Partnerliste zusammen nur rund ein halber Bildschirm —
     * ein zweiter Absatz ginge von der Partnerliste ab. Nachmessen: `npm run zielgruppen`.
     *
     * Inhaltlich konkret statt werblich (SEO-GEO-STANDARDS.md 4.3/4.5): Flaeche,
     * Leistungsumfang, Lackpartnerschaft, Unfallabwicklung — pruefbare Angaben,
     * keine Adjektive.
     */
    description:
      'Lack, Karosserie, Smart Repair und Aufbereitung aus einem Haus — auf über 3.500 m², farbtongenau als Glasurit-Lackpartner, inklusive kompletter Unfallabwicklung und festem Ansprechpartner.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    backgroundImage: '/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp',
    secondaryCta: { label: 'Partnerschaft anfragen', href: '/kontakt#contact-business' },
    partners: dealerPartners,
  },
];

/**
 * Sticky Stacking Cards.
 *
 * MECHANIK (bewusst rein CSS, kein Scroll-JS):
 * Jede Karte ist `position: sticky` mit gestaffeltem `top`. Karte i parkt bei
 * `i x --bar`, Karte i+1 parkt eine Leistenhoehe tiefer und schiebt sich beim
 * Scrollen darueber — von der geparkten Karte bleibt exakt die oberste
 * Leistenhoehe stehen, in der ihr Titel sitzt. `z-index` steigt mit dem Index,
 * damit spaetere Karten ueber frueheren liegen.
 *
 * Karte i ist `100svh - i x --bar` hoch: Ihr unterer Rand schliesst dadurch
 * buendig mit dem Viewport ab, egal wie viele Leisten schon darueber stapeln.
 * `svh` statt `vh`/`dvh`, weil die mobile Adressleiste `dvh` waehrend des
 * Scrollens veraendert -> das wuerde die geparkten Karten springen lassen.
 *
 * WARUM NATIV STATT FRAMER: Sticky laeuft im Compositor, ist damit
 * frame-genau und immun gegen rAF-Lag. Ein JS-getriebener Transform hinkt pro
 * Frame nach — genau daran ist der Pin der Unfall-Sektion zuvor gescheitert
 * (siehe docs/accident-scrollytelling/.../2026-07-19-pin-jitter-fix-tasks.md).
 *
 * VORAUSSETZUNG (schon erfuellt, nicht kaputt machen): Kein Vorfahr darf ein
 * Scroll-Container sein. `<main class="site-main-shell">` traegt deshalb
 * `overflow: clip` statt `overflow-x: hidden` — Letzteres erzwingt computed
 * `overflow-y: auto` und wuerde Sticky site-weit toeten.
 */
const TargetGroupCards: React.FC = () => {
  const stapelRef = useRef<HTMLDivElement>(null);

  /**
   * Schreibt den Index der aktuell offenen Karte als CSS-Variable `--aktiv` auf den
   * Stapel. Die Ueberschrift rechnet daraus ihre Stufe (`top`) und wandert so pro
   * Karte eine Leistenhoehe nach unten, statt oben kleben zu bleiben.
   *
   * Warum ueberhaupt JS: `position: sticky` kennt nur EIN festes `top`. Ein Wert, der
   * sich pro Karte aendert, ist in reinem CSS nicht ausdrueckbar.
   *
   * Warum das unkritisch ist: `--aktiv` ist eine STUFENFUNKTION — sie aendert sich genau
   * zweimal ueber den ganzen Stapel. Zwischen den Stufen passiert nichts, es gibt also
   * kein Nachlaufen wie bei einem pro Frame interpolierten Transform (der Fehler, an dem
   * der Unfall-Pin frueher scheiterte). Bewusst OHNE React-State: direkt auf den DOM-Knoten
   * geschrieben, damit kein Re-Render im Scroll-Pfad haengt.
   */
  useEffect(() => {
    const stapel = stapelRef.current;
    if (!stapel) return;

    let raf = 0;
    let zuletzt = -1;

    const messen = () => {
      raf = 0;
      const karten = stapel.querySelectorAll('article');
      let index = 0;
      karten.forEach((karte, i) => {
        // Karte gilt als offen, sobald sie ihre Parkposition erreicht hat.
        const parkTop = parseFloat(getComputedStyle(karte).top);
        if (karte.getBoundingClientRect().top <= parkTop + 1) index = i;
      });
      if (index !== zuletzt) {
        zuletzt = index;
        stapel.style.setProperty('--aktiv', String(index));
      }
    };

    const anstossen = () => {
      if (!raf) raf = requestAnimationFrame(messen);
    };

    messen();
    window.addEventListener('scroll', anstossen, { passive: true });
    window.addEventListener('resize', anstossen);
    return () => {
      window.removeEventListener('scroll', anstossen);
      window.removeEventListener('resize', anstossen);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    // `px-6` bewusst NICHT auf der Sektion: Der Kartenstapel soll randlos bis an die
    // Shell-Kante laufen (wie die Hero-Sektion). Der Shell selbst haelt bereits
    // `margin: var(--cc-shell-gap)` Abstand zur Fensterkante — mehr braucht es nicht.
    // Der Ueberschriftenblock behaelt sein Padding ueber den inneren Wrapper.
    <section id="zielgruppen" aria-labelledby="target-groups-heading" className="bg-white py-20 md:py-28">
      {/* Stapel bewusst OHNE `container mx-auto px-6` — nur so laeuft er randlos bis an die
          Shell-Kante (gemessen: 14 px Rand bei 1440, identisch zur Hero-Sektion).
          Die Stellschrauben (`--gap`, `--bar`, `--kopf`, `--fuss`, `--nav`, `--verweil`,
          `--karte-b`, `--liste-min`) und ihre drei Hoehenstufen stehen in
          `styles/zielgruppen.css` an `.zielgruppen-stapel` — mit Begruendung je Wert.
          ⚠️ Nicht zusaetzlich als `[--bar:…]`-Klassen hier setzen: Utilities kommen zuletzt
          und wuerden die Hoehenstufen still ueberschreiben. */}
      <div ref={stapelRef} className="zielgruppen-stapel">
        {/* Ueberschrift. Ab `lg` ein Sticky-OVERLAY links oben auf dem Bild (`z-20` ueber allen
            Karten). Position, Hoehe und Stufen-Uebergang stehen in `.zielgruppen-titel`
            (index.css) — sie brauchen `--aktiv` und eine Media-Query, beides geht nicht als
            Inline-Style. Unterhalb `lg` bleibt es ein normaler Block ueber dem Stapel:
            Dort liegt die weisse Textflaeche der Karte oben, weisse Schrift waere unlesbar.
            `pointer-events-none`, damit das Overlay keine Klicks abfaengt. */}
        {/* ⚠️ KEIN `mb-*`/`lg:mb-*` hier: Der Abstand steht komplett in `.zielgruppen-titel`.
            Tailwind-Utilities werden in index.css bewusst ZULETZT eingebunden und schlagen damit
            Custom-Klassen gleicher Spezifitaet — ein `lg:mb-0` setzte den dort noetigen negativen
            Rand still auf 0, wodurch Karte 1 um die volle Ueberschriftshoehe nach unten rutschte
            und die Ueberschrift allein auf Weiss erschien, bevor das Motiv kam. */}
        <div className="zielgruppen-titel px-6 md:px-10 lg:pointer-events-none lg:sticky lg:z-20">
          {/* Breiter als zuvor (`min(42vw,30rem)` = 480 px bei 1440): Die Ueberschrift ist mit
              48 px zwar exakt so gross wie die der Unfall-Sektion, wirkte aber kleiner, weil sie
              im engen Kasten dreizeilig umbrach.
              Dritte Grenze seit 2026-09-17: Fensterbreite minus weisse Karte minus 8rem Luft.
              Die Karte ist jetzt breiter (`--karte-b`); auf 1024 px laege die Ueberschrift
              sonst ueber ihr — und als `pointer-events-none` saehe das kein Treffertest. */}
          <div className="max-w-3xl lg:max-w-[min(54vw,40rem,calc(100vw_-_var(--karte-b)_-_8rem))]">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600 lg:text-blue-200">
              Für wen wir arbeiten
            </span>
            {/*
              `text-shadow` statt `drop-shadow` (geaendert 2026-08-10) — gleicher Look,
              anderer Preis. Dieser Block ist `lg:sticky` UND wandert waehrend des Scrollens
              (die Stufe kommt aus `--aktiv`). `drop-shadow` ist ein `filter`: Es spannt einen
              eigenen Stacking-Context auf und erzwingt pro Frame einen separaten Renderpass,
              dessen Ergebnis beim Verschieben im kompositierten `.site-main-shell` neu
              gerastert werden muss — sichtbar als Schlieren und Flimmern.
              `text-shadow` wird direkt mit der Schrift gezeichnet, ohne Filterpass.
              Bei reinem Text ist das Ergebnis optisch nicht zu unterscheiden.
            */}
            <h2
              id="target-groups-heading"
              className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl lg:text-white lg:[text-shadow:0_2px_18px_rgb(0_0_0/0.6)]"
            >
              Der richtige Ansprechpartner für Ihr Fahrzeug.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg lg:text-gray-200 lg:[text-shadow:0_1px_10px_rgb(0_0_0/0.55)]">
              Ob privat, gewerblich oder nach einem Unfall: Wir verbinden persönliche Beratung mit professionellen Werkstattprozessen.
            </p>
          </div>
        </div>
          {groups.map((group, idx) => (
            <Fragment key={group.id}>
            <article
              aria-labelledby={`zielgruppe-${group.id}`}
              className="sticky"
              style={{
                top: `calc(var(--nav) + var(--bar) * ${idx})`,
                height: `calc(100svh - var(--nav) - var(--fuss) - var(--bar) * ${idx})`,
                zIndex: idx + 1,
              }}
            >
              {/* `shadow` nach OBEN: macht sichtbar, dass sich diese Karte ueber die
                  darunter geparkte legt. Ohne das wirken die Leisten angeklebt. */}
              {/* Kein Flex mehr noetig: Bild, Verlauf, Badge und weisse Karte liegen alle absolut.
                  Radius 2.25rem = 36 px ist KEIN Zufallswert: Damit der Bildrand um die weisse
                  Karte ueberall gleich breit wirkt — an den Kanten UND in den Ecken — muss gelten
                  `Radius aussen - Einzug = Radius innen`. Hier 36 - 20 (`--gap`) = 16 = der
                  `rounded-2xl` der weissen Karte. Vorher stand hier 24 px, wodurch der Abstand in
                  den Ecken sichtbar groesser war als an den Kanten.
                  Wird `--gap` geaendert, diesen Radius mit anpassen. */}
              <div className="relative h-full overflow-hidden rounded-[2.25rem] bg-gray-950 shadow-[0_-16px_44px_-20px_rgb(var(--cc-carbon-rgb)/0.45)]">
                <img
                  src={group.backgroundImage ?? DEFAULT_CARD_BG}
                  alt=""
                  aria-hidden="true"
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-left"
                />
                {/* ZWEI blaue Verlaeufe im CI-Blau, ueberlagern sich additiv:
                    (1) oben links — Rueckhalt fuer das weisse Ueberschriften-Overlay ab `lg`
                        (sonst dort unlesbar, da Foto jetzt linksbuendig/hell).
                    (2) rechts — Uebergang des linksbuendigen Fotos in die weisse Karte.
                    Definitionen in index.css: `.cc-radial-veil-graphite` (Zentrum 0% 0%) /
                    `.cc-radial-veil-graphite-right` (Zentrum 100% 50%). */}
                <div aria-hidden="true" className="cc-radial-veil-graphite absolute inset-0" />
                <div aria-hidden="true" className="cc-radial-veil-graphite-right absolute inset-0" />
                {/* Vignette ringsum im selben Ton (seit 2026-09-24, Wunsch des Users: „fuer alle
                    Karten auf der Seite"). Diese Karten sind die Farbvorlage, hatten aber nur die
                    beiden Verlaeufe oben links und rechts — keine Kante unten und links. Im Stapel,
                    wo sich die naechste Karte ueber die vorige schiebt, macht der Rand sichtbar, wo
                    eine Karte endet. Definition: `.cc-karten-vignette` in index.css. */}
                <div aria-hidden="true" className="cc-karten-vignette absolute inset-0" />
                {/* Kennzeichnung des Kartenmotivs. Unten links: Das Foto steht linksbuendig,
                    die weisse Karte liegt rechts; oben links sitzt ab `lg` die Ueberschrift. */}
                <KiMarke quelle={group.backgroundImage ?? DEFAULT_CARD_BG} className="bottom-4 left-4 hidden lg:block" />

                {/* WEISSE KARTE — schwebt eingerueckt IM Bild, exakt nach dem Muster der
                    Leistungsuebersicht (`ExpandingCardAccordion`: `inset-y-3 left-3`,
                    `rounded-2xl`, weiche Schatten). Hier gespiegelt nach rechts.
                    Durch den Einzug `--gap` bleiben die abgerundeten Ecken sichtbar und es
                    entsteht ringsum ein schmaler Bildrand.
                    Mobil: oben ueber die volle Breite, Hoehe nach Inhalt (kein `bottom`).
                    Ab `lg`: rechte Spalte, `--karte-b` breit (35vw, 25–38rem). Bis 2026-09-17
                    feste 30 % — auf 1366 px brachen darin beide CTAs und die Titel um.

                    `bottom` (= Karte auf volle Kartenhoehe strecken) haengt BEWUSST an einer
                    kombinierten Query aus Breite UND Hoehe. Die Kachelhoehe ist
                    `100svh - i x --bar`; auf einem kurzen Viewport bleibt davon so wenig uebrig,
                    dass der Kartentext nicht mehr hineinpasst und vom `overflow-hidden` der
                    Bildkarte abgeschnitten wird (gemessen bei 1024x640: 240 px Kachel, davon
                    92 px Titelleiste — 148 px fuer Text und zwei CTAs). Unter 740 px
                    Viewporthoehe faellt die Karte deshalb auf ihre Inhaltshoehe zurueck,
                    genau wie unterhalb `lg`. Lieber eine kuerzere Karte als abgeschnittener
                    Inhalt. */}
                {/*
                  KEIN `backdrop-blur` hier (entfernt 2026-08-10). Die Karte ist mit
                  `rgb(255 255 255 / 0.94)` bereits zu 94 % deckend — ein Blur dahinter
                  ist praktisch unsichtbar, kostet aber teuer: `backdrop-filter` auf einem
                  `position: sticky`-Element muss seinen Hintergrund in JEDEM Frame neu
                  abtasten, waehrend sich das Element relativ dazu verschiebt. Innerhalb
                  des zusaetzlich per `transform: translateZ(0)` kompositierten
                  `.site-main-shell` ist das eine bekannte Ursache fuer Flimmern und
                  Schlieren beim Scrollen. Wer den Blur zurueckholt, holt das Risiko mit.
                */}
                <div data-karte="weiss" className="absolute left-[var(--gap)] right-[var(--gap)] top-[var(--gap)] z-10 flex max-h-[calc(100%_-_2*var(--gap))] flex-col overflow-hidden rounded-2xl bg-[rgb(255_255_255/0.94)] shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] [hyphens:auto] [@media(min-width:1024px)_and_(min-height:740px)]:bottom-[var(--gap)] lg:left-auto lg:w-[var(--karte-b)]">
                  {/* Diese Zeile bildet zusammen mit dem oberen Einzug die Leiste:
                      `--bar` = `--gap` + Zeilenhoehe. Deshalb ist die Hoehe hier `--kopf`
                      (= `--bar` minus `--gap`) — sonst waeren Parkposition und sichtbarer
                      Streifen gegeneinander verschoben. In der flachen Hoehenstufe ist `--bar`
                      0, `--kopf` dann ein eigener Wert (styles/zielgruppen.css).

                      Groesse = `text-2xl md:text-3xl`, exakt wie die h3 der Unfall-Sektion
                      (gemessen 24 px / 30 px). 30 px passen nicht in jede Spaltenbreite
                      ("Versicherungen & Agenturen" braucht ~394 px). Deshalb `line-clamp-2`
                      statt `truncate`: der Titel darf zweizeilig umbrechen, wird aber nie
                      laenger — die normale Stufe ist auf zwei Zeilen ausgelegt. Unter 860 px
                      Fensterhoehe ist die Zeile nur 60 px hoch: dort 24 px, das passt ab 1024 px
                      Breite einzeilig (`--karte-b` mindestens 25rem).
                      Kurze Titel ("Privatkunden") bleiben einzeilig und sitzen mittig. */}
                  <div className="flex h-[var(--kopf)] shrink-0 items-center gap-3 border-b border-gray-100 px-5 md:px-6">
                    <h3
                      id={`zielgruppe-${group.id}`}
                      className="line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-gray-950 [hyphens:none] md:text-3xl [@media(min-width:1024px)_and_(max-height:859px)]:text-2xl [@media(min-width:1024px)_and_(max-height:859px)]:leading-tight"
                    >
                      {group.title}
                      {/* Blauer Akzentpunkt — seitenweites Motiv, steht so auch an den Titeln der
                          Leistungsuebersicht (ExpandingCardAccordion). Bewusst INLINE im h3 und
                          nicht als Flex-Geschwister: Als eigenes Element driftete er bei
                          zweizeiligen Titeln weit nach rechts weg und wirkte wie ein Fehler. */}
                      <span aria-hidden="true" className="ml-1.5 inline-block h-2 w-2 rounded-full bg-blue-600 align-top" />
                    </h3>
                    {/* Unterhalb `lg` deckt diese Karte das Foto bis auf einen 20-px-Rahmen ab —
                        eine Plakette auf dem Bild laege dort auf der Partnerliste. Deshalb hier,
                        in derselben Kachel, mit Vorsatz „Foto:“: Neben einer Ueberschrift waere
                        „KI-generiert“ sonst auf die Leistung zu beziehen statt auf das Motiv. */}
                    <KiMarke quelle={group.backgroundImage ?? DEFAULT_CARD_BG} statisch praefix="Foto: " className="ml-auto shrink-0 lg:hidden" />
                  </div>

                  {/* Innenabstand schrumpft auf niedrigen Viewports mit: Die Kachelhoehe
                      haengt am Viewport, unter ~900 px zaehlt jeder Pixel.

                      SCROLLBEREICH: `min-h-0` ist die Voraussetzung — ohne das waechst ein
                      Flex-Kind ueber seinen Container hinaus (`min-height: auto`), und
                      `overflow-y` greift nie. Zusammen mit dem `max-h` der weissen Karte
                      entsteht so mobil eine Scrollleiste, statt dass das `overflow-hidden`
                      der Bildkarte den Rest abschneidet.

                      Auf Desktop passt der Inhalt normalerweise in die Kachel — die
                      Partnerliste nimmt nur den Rest und scrollt selbst. Reicht selbst ihre
                      Mindesthoehe nicht, scrollt dieser Bereich: per Touch nativ, per Mausrad
                      dank `allowNestedScroll` (hooks/useSmoothScroll.ts). Vorher fing Lenis das
                      Rad hier ab — im halb angedockten Fenster (960 px, Maus) waren 8 der 32
                      Versicherer dadurch unerreichbar. `.cc-scroll-verlauf` blendet die
                      Unterkante aus, solange unten noch etwas folgt. */}
                  <div data-karte="inhalt" className="cc-card-scroll cc-scroll-verlauf flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 [@media(max-height:900px)]:py-3.5 md:px-6 md:py-6">
                    {/* Auf sehr niedrigen Viewports schrumpft der Text mit, statt abgeschnitten
                        zu werden: `text-xs` bringt mehr Zeichen pro Zeile und spart damit Zeilen.
                        Bewusst KEIN `line-clamp` — das wuerde Inhalt unterschlagen; kleiner
                        gesetzt bleibt alles lesbar. */}
                    <p className="text-sm leading-relaxed text-gray-600 [@media(max-height:760px)]:text-xs md:text-base">
                      {group.description}
                    </p>
                    {/* CTA bewusst DIREKT unter dem Text statt per `mt-auto` am Kartenfuss:
                        Die naechste Karte schiebt sich von unten herauf und verdeckt den
                        Kartenfuss zuerst. Unten angeheftet waere der Button bei Karte 1 und 2
                        nur waehrend eines sehr kurzen Scrollfensters sichtbar. Oben bleibt er
                        stehen, solange die Karte ueberhaupt offen ist — und alle drei Karten
                        verhalten sich dadurch identisch. */}
                    {/* Beide CTAs in EINEM Wrap-Container: Auf breiten Kacheln stehen sie
                        nebeneinander, sonst untereinander — ohne feste Umbruchpunkte, die
                        bei der viewportabhaengigen Kachelbreite ohnehin nicht stimmen. */}
                    {/* Hoehenbereiche UEBERSCHNEIDUNGSFREI (seit 2026-09-17): Vorher standen
                        `max-height:700px` und `max-height:900px` nebeneinander. Tailwind gibt die
                        900er-Regel im CSS spaeter aus — unter 700 px gewann sie, `mt-2.5` war nie
                        wirksam. */}
                    <div data-karte="ctas" className="mt-6 flex flex-wrap items-center gap-2 [@media(max-height:700px)]:mt-2.5 [@media(min-height:701px)_and_(max-height:900px)]:mt-4">
                      <a
                        href={group.href}
                        className="group inline-flex items-center justify-between gap-3 rounded-full border border-gray-200 bg-white py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-900 shadow-sm [@media(max-height:700px)]:py-1 [@media(max-height:700px)]:pl-4 transition-colors hover:border-gray-300 hover:bg-gray-50"
                      >
                        {group.cta}
                        <span className="cc-gradient-fill flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                          <ArrowUpRight size={15} />
                        </span>
                      </a>
                      {/* Sekundaer: gleiche Form, aber ohne gefuellten Pfeil-Kreis. Das haelt
                          die Hierarchie klar und spart die Hoehe, die der Kreis erzwingen wuerde. */}
                      {group.secondaryCta && (
                        <a
                          href={group.secondaryCta.href}
                          /* Blauer CI-Verlauf — dieselbe Fuellung wie „Termin oder Beratung
                             anfragen" in der Leistungsuebersicht (`.cc-gradient-button`).
                             Bewusst OHNE den gefuellten Pfeil-Kreis des ersten Buttons: Der
                             Kreis erzwingt 32 px Hoehe, und in dieser Kachel ist jeder Pixel
                             gebucht — der Pfeil steht deshalb direkt im Text. */
                          className="cc-gradient-button group inline-flex items-center gap-2 rounded-full border px-5 py-2.5 text-[11px] font-bold uppercase tracking-[0.16em] text-white [@media(max-height:700px)]:px-4 [@media(max-height:700px)]:py-1.5"
                        >
                          {group.secondaryCta.label}
                          <ArrowUpRight size={14} className="transition-transform duration-300 group-hover:rotate-45" />
                        </a>
                      )}
                    </div>

                    {/* Referenzpartner — Platz, Scrollen und Spalten: `ZielgruppenPartner`.
                        Bis 2026-09-17 wich die Liste unter 860 px Fensterhoehe ganz; auf einem
                        Full-HD-Bildschirm mit Lesezeichenleiste und Zoom war sie damit weg.
                        Jetzt steht sie auf jeder Hoehe (Messung: `npm run zielgruppen`). */}
                    {group.partners && group.partners.length > 0 && (
                      <ZielgruppenPartner partner={group.partners} titel={group.partnersLabel ?? 'Partnerbetriebe'} />
                    )}

                    {/* CarCare-Marke unten RECHTS auf der weissen Karte. Bewusst im Fluss
                        (`mt-auto self-end`) statt absolut positioniert: Ab `lg` ist die weisse
                        Karte bildschirmhoch, `mt-auto` schiebt das Logo dort an den Fuss.
                        Unterhalb `lg` ist sie nur inhaltshoch — absolut positioniert wuerde das
                        Logo dort auf dem CTA-Button liegen, im Fluss setzt es sich sauber
                        darunter. Schatten dezenter als zuvor, weil es jetzt auf Weiss statt
                        auf dem Bild sitzt.

                        HOEHEN-QUERY: Die Kachelhoehe haengt am Viewport (`100svh - i x --bar`).
                        Das Badge ist rein dekorativ — es weicht unter 1000 px Fensterhoehe,
                        damit der Platz der Partnerliste zugutekommt. Bewusst eine HOEHEN-Query und kein Breiten-
                        Breakpoint: Der Engpass ist die Viewporthoehe, nicht die Breite.
                        Schwelle 1000 px, weil die Versicherungs-Kachel mit 32 Partnern darunter
                        jeden Pixel fuer die Liste braucht. */}
                    <span className="mt-auto flex h-11 w-11 shrink-0 items-center justify-center self-end overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-gray-200 [@media(min-width:1024px)_and_(max-height:1000px)]:hidden lg:h-14 lg:w-14">
                      <video
                        src={logoMarkVideoSrc}
                        className="h-full w-full object-contain"
                        autoPlay
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        aria-hidden="true"
                      />
                    </span>
                  </div>
                </div>
              </div>
            </article>
            {/* Verweilstrecke: Die Karte bleibt `--verweil` lang vollstaendig stehen, bevor die
                naechste aufzieht. Als eigenes Element und NICHT als `margin-bottom` der Karte:
                Sticky begrenzt ueber die Margin-Box — die Karte loeste sonst um diesen Betrag
                frueher als die letzte, und die Leisten fielen am Stapelende auseinander.
                Unsichtbar: Er liegt hinter der geparkten Karte. */}
            {idx < groups.length - 1 && <div aria-hidden="true" className="h-[var(--verweil)]" />}
            </Fragment>
          ))}

          {/* Nachlauf: Ohne ihn loest die letzte Karte sofort wieder, sobald sie parkt —
              sie waere nie in Ruhe zu sehen. Der Puffer liegt HINTER der stehenden
              Karte, erzeugt also keine sichtbare Luecke, nur Scrollweg. */}
          <div aria-hidden="true" className="h-[45svh]" />
      </div>
    </section>
  );
};
export default TargetGroupCards;
