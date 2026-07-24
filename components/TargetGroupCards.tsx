import React, { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { TargetGroup } from '../types';

/**
 * Standard-Hintergrundbild der Kacheln.
 * Zum Tauschen: entweder diese Konstante aendern (gilt fuer alle Kacheln ohne
 * eigenes Bild) ODER pro Kachel das Feld `backgroundImage` unten setzen.
 * Neue Bilder in `public/assets/` ablegen und den Pfad hier eintragen.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.webp';

/** Animierte CarCare-Marke fuer das Logo-Badge. */
const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';

/**
 * Ausblend-Klassen der Partnerliste, statisch hinterlegt: Tailwind scannt den Quelltext
 * nach vollstaendigen Klassennamen, ein zusammengesetzter String wuerde nicht erzeugt.
 * Greift nur ab `lg` — mobil ist der Kartentext scrollbar, dort muss nichts weichen.
 */
const PARTNER_HIDE_CLASS: Record<760 | 860, string> = {
  760: '[@media(min-width:1024px)_and_(max-height:760px)]:hidden',
  860: '[@media(min-width:1024px)_and_(max-height:860px)]:hidden',
};

/** Reihenfolge im Array = Stapel-Reihenfolge (Index 0 liegt zuunterst). */
const groups: TargetGroup[] = [
  {
    id: 'privatkunden',
    title: 'Privatkunden',
    description: 'Fahrzeugpflege, Smart Repair, Leasingrückgabe und schnelle Hilfe bei Schäden.',
    cta: 'Für Privatkunden',
    iconName: 'User',
    href: '/fahrzeugaufbereitung-leipzig',
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
     * „instand setzen statt tauschen" durch das eigene Leistungsspektrum (Smart Repair,
     * Dellenentfernung, Felgenreparatur), Glasurit-Lackpartnerschaft, Werkstatt-
     * ersatzfahrzeug und strukturierte Ablaeufe. Bewusst keine Zahlen zu Steuerungs-
     * quoten oder Durchlaufzeiten — die liegen hier nicht belegt vor.
     */
    description:
      'Schadenaufnahme, Kalkulation und Instandsetzung aus einer Hand — instand setzen statt tauschen, wo es fachlich vertretbar ist. Farbtongenau als Glasurit-Lackpartner, mit Werkstattersatzfahrzeug, festem Ansprechpartner und strukturierten Abläufen.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    href: '/unfallinstandsetzung-leipzig',
    backgroundImage: '/assets/kacheln/versicherungen-und-agenturen-leipzig-carcare.webp',
    secondaryCta: { label: 'Partnerschaft anfragen', href: '/kontakt#contact-business' },
    partnersLabel: 'Versicherungspartner',
    /**
     * 31 Namen — deshalb greift die Fliesstext-Darstellung (> 8 Partner). Im Raster
     * waeren das ~16 Zeilen und damit rund 350 px, die Kachel bietet auf 1366x768 aber
     * nur 388 px fuer den GESAMTEN Inhalt.
     *
     * Bewusst OHNE Logos: Versicherer-Logos sind geschuetzte Marken, und 31 fremde
     * Wort-Bild-Marken auf einer Werkstattseite waeren weder rechtlich sauber noch
     * gestalterisch beherrschbar. Namensnennung als Referenz ist davon zu unterscheiden.
     */
    /**
     * 860. Ein Versuch mit 760 (die Kachel hat ~112 px mehr Inhalt als die Gewerbe-
     * Kachel) wurde nachgemessen und wieder verworfen: Auf 1366x768 blieben 55 px im
     * Kartenscroll, die auf DESKTOP nicht erreichbar sind — Lenis faengt das Mausrad
     * global ab. Mobil greift die Schwelle ohnehin nicht, dort ist die Liste vollstaendig
     * sichtbar und der Kartentext scrollt.
     */
    partnersHideBelow: 860,
    partners: [
      { name: 'HUK Coburg' },
      { name: 'HUK 24' },
      { name: 'Gothaer Versicherung' },
      { name: 'Debeka' },
      { name: 'VHV Versicherung' },
      { name: 'Dialog' },
      { name: 'Cosmos Direkt' },
      { name: 'vrk+' },
      { name: 'Generali' },
      { name: 'janitos' },
      { name: 'Concordia Versicherung' },
      { name: 'Alte Leipziger' },
      { name: 'Barmenia' },
      { name: 'Continentale' },
      { name: 'Deutsche Post' },
      { name: 'Ecclesia' },
      { name: 'freeyou ag' },
      { name: 'Friday Insurance' },
      { name: 'GVV' },
      { name: 'Helvetia' },
      { name: 'Itzehoer' },
      { name: 'Nexible' },
      { name: 'Nürnberger' },
      { name: 'Provinzial' },
      { name: 'R+V' },
      { name: 'S-direkt' },
      { name: 'Signal Iduna' },
      { name: 'Verti' },
      { name: 'Volkswohl Bund' },
      { name: 'Wefox' },
      { name: 'Württembergische Versicherung' },
    ],
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    /**
     * Partneransprache — ersetzt hier den frueheren generischen Einzeiler
     * („Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern …").
     *
     * BEWUSST EIN Absatz statt Beschreibung + Zusatztext: Die Kachelhoehe haengt am
     * Viewport (`100svh - i x --bar`). Auf 1366x768 bleiben inkl. Titelleiste nur
     * ~276 px fuer den GESAMTEN Kartentext — zwei Absaetze plus Partnerliste plus
     * zwei CTAs passen dort nicht, das `overflow-hidden` der Bildkarte wuerde den
     * Rest hart abschneiden.
     *
     * Inhaltlich konkret statt werblich (SEO-GEO-STANDARDS.md 4.3/4.5): Flaeche,
     * Leistungsumfang, Lackpartnerschaft, Unfallabwicklung — pruefbare Angaben,
     * keine Adjektive.
     */
    description:
      'Lack, Karosserie, Smart Repair und Aufbereitung aus einem Haus — auf 3.000 m², farbtongenau als Glasurit-Lackpartner, inklusive kompletter Unfallabwicklung und festem Ansprechpartner.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    backgroundImage: '/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp',
    partnersHideBelow: 860,
    secondaryCta: { label: 'Partnerschaft anfragen', href: '/kontakt#contact-business' },
    /**
     * Referenzpartner (Stand 2026-07-24, vom Betrieb benannt).
     *
     * ⚠️ LOGOS BEWUSST NICHT HINTERLEGT. Volkswagen, Audi und Porsche sind
     * eingetragene Marken. Ihre Logos duerfen nicht ohne schriftliche Freigabe des
     * jeweiligen Partners eingebunden werden — und ein Herstellerlogo auf einer
     * freien Werkstatt kann den unzutreffenden Eindruck einer autorisierten
     * Vertragspartnerschaft erwecken (Irrefuehrung nach UWG). Die reine NAMENS-
     * nennung als Referenz ist davon zu unterscheiden und hier bewusst gewaehlt.
     *
     * Sobald Freigaben und offizielle monochrome Dateien vorliegen: Dateien unter
     * `/public/assets/partner/` ablegen und hier das Feld `logo` setzen. Das Raster
     * unten zeigt sie dann automatisch ueber dem Namen an — keine Layout-Aenderung
     * noetig. Siehe docs/zielgruppen-partner/tasks/.
     */
    partners: [
      { name: 'Volkswagen Automobile Leipzig' },
      { name: 'Audi Zentrum Leipzig' },
      { name: 'Porsche Zentrum Leipzig' },
      { name: 'Porsche Werk Leipzig' },
      { name: 'Autohaus Otto Grimm' },
    ],
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
          Vier Stellschrauben steuern `top`, Kartenhoehe, Einzug und Titelzeile zugleich:
          `--gap`  = Einzug der weissen Karte im Bild (ringsum gleich).
          `--fuss` = Freiraum UNTER der Karte. Ohne ihn endete die Karte exakt bei `100svh`,
                     also buendig mit der Bildschirmunterkante: Der Bildrand unter der weissen
                     Flaeche lag im letzten Pixelstreifen und war unsichtbar, waehrend er oben
                     und rechts klar zu sehen war — die Kachel wirkte dadurch unten „zu lang".
                     Unterhalb `lg` zusaetzlich gross genug fuer die fixierte MobileStickyCTA
                     (83 px, `lg:hidden`), die sonst den Kartenfuss verdeckt.
          `--bar` = Hoehe der stehenbleibenden Leiste. Enthaelt den Einzug MIT: sichtbar bleibt
                    oben `--gap` Bildrand plus die Titelzeile der weissen Karte. Die Titelzeile
                    ist deshalb `--bar` minus `--gap` hoch. Auf ZWEI Titelzeilen ausgelegt
                    (24 px bzw. 30 px Schrift x 1.25 Zeilenhoehe + Innenabstand), weil der
                    laengste Titel in der schmalen 30-%-Spalte zwangslaeufig umbricht.
          `--nav` = Freiraum fuer die fixierte Navbar. MUSS ihrer Hoehe folgen, sonst parken
                    die Leisten UNTER der Navbar und der Titel ist unsichtbar — genau das
                    passierte mit `top: 0`. Werte gespiegelt von `.solidroad-nav-shell`
                    (`h-[4.85rem] md:h-[6.25rem]`, gemessen 78 px / 100 px) plus 0.5rem Luft.
                    Aendert sich die Navbar-Hoehe, hier nachziehen. */}
      <div
        ref={stapelRef}
        className="[--bar:6rem] [--fuss:6.5rem] [--gap:1.25rem] [--nav:5.35rem] md:[--nav:6.75rem] lg:[--bar:7rem] lg:[--fuss:1.75rem]"
      >
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
              im engen Kasten dreizeilig umbrach. Die Bildseite ist jetzt 70 % breit, also ist
              Platz da. */}
          <div className="max-w-3xl lg:max-w-[min(54vw,40rem)]">
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600 lg:text-blue-200">
              Für wen wir arbeiten
            </span>
            <h2
              id="target-groups-heading"
              className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl lg:text-white lg:drop-shadow-[0_2px_18px_rgb(0_0_0/0.6)]"
            >
              Der richtige Ansprechpartner für Ihr Fahrzeug.
            </h2>
            <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg lg:text-gray-200 lg:drop-shadow-[0_1px_10px_rgb(0_0_0/0.55)]">
              Ob privat, gewerblich oder nach einem Unfall: CarCare verbindet persönliche Beratung mit professionellen Werkstattprozessen.
            </p>
          </div>
        </div>
          {groups.map((group, idx) => (
            <article
              key={group.id}
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

                {/* WEISSE KARTE — schwebt eingerueckt IM Bild, exakt nach dem Muster der
                    Leistungsuebersicht (`ExpandingCardAccordion`: `inset-y-3 left-3`,
                    `rounded-2xl`, weiche Schatten). Hier gespiegelt nach rechts.
                    Durch den Einzug `--gap` bleiben die abgerundeten Ecken sichtbar und es
                    entsteht ringsum ein schmaler Bildrand.
                    Mobil: oben ueber die volle Breite, Hoehe nach Inhalt (kein `bottom`).
                    Ab `lg`: rechte Spalte, 30 % breit (70 % Bild).

                    `bottom` (= Karte auf volle Kartenhoehe strecken) haengt BEWUSST an einer
                    kombinierten Query aus Breite UND Hoehe. Die Kachelhoehe ist
                    `100svh - i x --bar`; auf einem kurzen Viewport bleibt davon so wenig uebrig,
                    dass der Kartentext nicht mehr hineinpasst und vom `overflow-hidden` der
                    Bildkarte abgeschnitten wird (gemessen bei 1024x640: 240 px Kachel, davon
                    92 px Titelleiste — 148 px fuer Text und zwei CTAs). Unter 740 px
                    Viewporthoehe faellt die Karte deshalb auf ihre Inhaltshoehe zurueck,
                    genau wie unterhalb `lg`. Lieber eine kuerzere Karte als abgeschnittener
                    Inhalt. */}
                <div className="absolute left-[var(--gap)] right-[var(--gap)] top-[var(--gap)] z-10 flex max-h-[calc(100%_-_2*var(--gap))] flex-col overflow-hidden rounded-2xl bg-[rgb(255_255_255/0.94)] shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] backdrop-blur-sm [hyphens:auto] [@media(min-width:1024px)_and_(min-height:740px)]:bottom-[var(--gap)] lg:left-auto lg:w-[30%]">
                  {/* Diese Zeile bildet zusammen mit dem oberen Einzug die Leiste:
                      `--bar` = `--gap` + Zeilenhoehe. Deshalb ist die Hoehe hier exakt
                      `--bar` minus `--gap` — sonst waeren Parkposition und sichtbarer
                      Streifen gegeneinander verschoben.

                      Groesse = `text-2xl md:text-3xl`, exakt wie die h3 der Unfall-Sektion
                      (gemessen 24 px / 30 px). In der 30 %-Spalte passt das NICHT mehr auf
                      eine Zeile ("Versicherungen & Agenturen" braucht dort ~394 px, verfuegbar
                      sind ~235–355 px). Deshalb `line-clamp-2` statt `truncate`: der Titel darf
                      zweizeilig umbrechen, wird aber nie laenger — und `--bar` ist auf zwei
                      Zeilen ausgelegt, damit die Leiste ihn immer vollstaendig zeigt.
                      Kurze Titel ("Privatkunden") bleiben einzeilig und sitzen mittig. */}
                  <div className="flex h-[calc(var(--bar)-var(--gap))] shrink-0 items-center border-b border-gray-100 px-5 md:px-6">
                    <h3
                      id={`zielgruppe-${group.id}`}
                      className="line-clamp-2 text-2xl font-bold leading-tight tracking-tight text-gray-950 [hyphens:none] md:text-3xl"
                    >
                      {group.title}
                      {/* Blauer Akzentpunkt — seitenweites Motiv, steht so auch an den Titeln der
                          Leistungsuebersicht (ExpandingCardAccordion). Bewusst INLINE im h3 und
                          nicht als Flex-Geschwister: Als eigenes Element driftete er bei
                          zweizeiligen Titeln weit nach rechts weg und wirkte wie ein Fehler. */}
                      <span aria-hidden="true" className="ml-1.5 inline-block h-2 w-2 rounded-full bg-blue-600 align-top" />
                    </h3>
                  </div>

                  {/* Innenabstand schrumpft auf niedrigen Viewports mit: Die Kachelhoehe
                      haengt am Viewport, unter ~900 px zaehlt jeder Pixel.

                      SCROLLBEREICH: `min-h-0` ist die Voraussetzung — ohne das waechst ein
                      Flex-Kind ueber seinen Container hinaus (`min-height: auto`), und
                      `overflow-y` greift nie. Zusammen mit dem `max-h` der weissen Karte
                      entsteht so mobil eine Scrollleiste, statt dass das `overflow-hidden`
                      der Bildkarte den Rest abschneidet.

                      Auf Desktop passt der Inhalt in die Kachel, dort erscheint die Leiste
                      also gar nicht. Lenis kollidiert hier nicht: Es laeuft mit
                      `syncTouch: false`, auf Touch-Geraeten scrollt also nativ der innere
                      Container und kettet am Ende normal an die Seite weiter. */}
                  <div className="cc-card-scroll flex min-h-0 flex-1 flex-col overflow-y-auto px-5 py-5 [@media(max-height:900px)]:py-3.5 md:px-6 md:py-6">
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
                    <div className="mt-6 flex flex-wrap items-center gap-2 [@media(max-height:700px)]:mt-2.5 [@media(max-height:900px)]:mt-4">
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

                    {/* Referenzpartner. Raster ist logo-fertig: Sobald ein Partner ein `logo`
                        traegt, erscheint es monochrom UEBER dem Namen; ohne Datei steht nur der
                        Name — gleiches Raster, spaeter also ohne Layout-Aenderung nachruestbar.
                        `grayscale` haelt fremde Markenfarben ruhig. Warum die Logos derzeit
                        fehlen: siehe Kommentar an der Partnerliste oben. */}
                    {/* HOEHEN-QUERY, gemessen begruendet: Auf 1366x768 ist die Bildkarte 408 px
                        hoch, davon bleiben nach Einzug und Titelleiste 276 px fuer den Inhalt —
                        Text und zwei CTAs brauchen dort bereits 260 px. Die Partnerliste passt
                        schlicht nicht mehr rein und wuerde vom `overflow-hidden` der Bildkarte
                        angeschnitten (belegt: 94 px Ueberstand). Sie weicht deshalb unter 860 px
                        Viewporthoehe — nach dem dekorativen Badge das naechste entbehrliche
                        Element, waehrend Text und CTAs immer stehen bleiben.
                        Wer die Liste ueberall sehen will, muss Text ODER einen CTA kuerzen —
                        siehe docs/zielgruppen-partner/tasks/. */}
                    {group.partners && group.partners.length > 0 && (
                      <div
                        className={`mt-5 border-t border-gray-100 pt-4 ${PARTNER_HIDE_CLASS[group.partnersHideBelow ?? 860]}`}
                      >
                        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400">
                          {group.partnersLabel ?? 'Partnerbetriebe'}
                        </p>
                        {/* EIN Raster fuer alle Kacheln — gleiche Spalten, Abstaende und
                            Schrift, egal ob 5 oder 31 Partner. Ein frueherer Versuch, viele
                            Namen als Fliesstext zu setzen, war deutlich schlechter lesbar.

                            Das Platzproblem loest stattdessen ein eigener Scrollbereich:
                            Ab `lg` bekommt die Liste eine Maximalhoehe und scrollt in sich —
                            so bleiben Text und CTAs darueber immer sichtbar, waehrend die
                            Liste beliebig lang sein darf.

                            `data-lenis-prevent`: Lenis faengt Wheel-Events global ab, ein
                            innerer Container wuerde sonst am Desktop gar nicht scrollen. Das
                            Attribut gilt bewusst NUR fuer dieses kleine Listenfeld — auf dem
                            gesamten Kartentext haette es das Weiterscrollen der Seite geblockt.

                            Mobil KEINE Maximalhoehe: Dort scrollt bereits der ganze Kartentext,
                            zwei ineinander liegende Scrollbereiche waeren unbedienbar.

                            Logo-Slot bleibt: Sobald ein Partner ein `logo` traegt, erscheint es
                            monochrom UEBER dem Namen; ohne Datei steht nur der Name. */}
                        <ul
                          data-lenis-prevent
                          className="cc-card-scroll mt-2.5 grid grid-cols-2 gap-x-4 gap-y-2 lg:max-h-24 lg:overflow-y-auto lg:pr-2 [@media(min-width:1024px)_and_(min-height:860px)]:max-h-40 [@media(min-width:1024px)_and_(min-height:960px)]:max-h-56"
                        >
                          {group.partners.map((partner) => (
                            <li key={partner.name} className="flex flex-col gap-1">
                              {partner.logo && (
                                <img
                                  src={partner.logo}
                                  alt=""
                                  aria-hidden="true"
                                  loading="lazy"
                                  decoding="async"
                                  className="h-6 w-auto self-start object-contain opacity-60 grayscale"
                                />
                              )}
                              <span className="text-[11px] font-semibold leading-snug text-gray-600 [hyphens:none]">
                                {partner.name}
                              </span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* CarCare-Marke unten RECHTS auf der weissen Karte. Bewusst im Fluss
                        (`mt-auto self-end`) statt absolut positioniert: Ab `lg` ist die weisse
                        Karte bildschirmhoch, `mt-auto` schiebt das Logo dort an den Fuss.
                        Unterhalb `lg` ist sie nur inhaltshoch — absolut positioniert wuerde das
                        Logo dort auf dem CTA-Button liegen, im Fluss setzt es sich sauber
                        darunter. Schatten dezenter als zuvor, weil es jetzt auf Weiss statt
                        auf dem Bild sitzt.

                        HOEHEN-QUERY: Die Kachelhoehe haengt am Viewport (`100svh - i x --bar`),
                        auf 1366x768 bleiben nur ~276 px fuer den gesamten Kartentext. Das Badge
                        ist rein dekorativ — es weicht deshalb als Erstes, statt echten Inhalt
                        (Text, CTAs, Partnerliste) vom `overflow-hidden` der Bildkarte
                        abschneiden zu lassen. Bewusst eine HOEHEN-Query und kein Breiten-
                        Breakpoint: Der Engpass ist die Viewporthoehe, nicht die Breite.
                        Schwelle 1000 px, weil die Gewerbe-Kachel mit Partnerliste und zwei
                        CTAs die dichteste ist — darunter braucht sie jeden Pixel. */}
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
