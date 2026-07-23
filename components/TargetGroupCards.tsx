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
    description: 'Zuverlässige Schadenaufnahme, klare Kommunikation und strukturierte Reparaturprozesse.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    href: '/unfallinstandsetzung-leipzig',
    backgroundImage: '/assets/kacheln/versicherungen-und-agenturen-leipzig-carcare.webp',
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    description: 'Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern und planbaren Abläufen.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    backgroundImage: '/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp',
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
                    Ab `lg`: rechte Spalte ueber die volle Kartenhoehe, 30 % breit (70 % Bild). */}
                <div className="absolute left-[var(--gap)] right-[var(--gap)] top-[var(--gap)] z-10 flex flex-col overflow-hidden rounded-2xl bg-[rgb(255_255_255/0.94)] shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] backdrop-blur-sm [hyphens:auto] lg:bottom-[var(--gap)] lg:left-auto lg:w-[30%]">
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

                  <div className="flex flex-1 flex-col px-5 py-5 md:px-6 md:py-6">
                    <p className="text-sm leading-relaxed text-gray-600 md:text-base">{group.description}</p>
                    {/* CTA bewusst DIREKT unter dem Text statt per `mt-auto` am Kartenfuss:
                        Die naechste Karte schiebt sich von unten herauf und verdeckt den
                        Kartenfuss zuerst. Unten angeheftet waere der Button bei Karte 1 und 2
                        nur waehrend eines sehr kurzen Scrollfensters sichtbar. Oben bleibt er
                        stehen, solange die Karte ueberhaupt offen ist — und alle drei Karten
                        verhalten sich dadurch identisch. */}
                    <a
                      href={group.href}
                      className="group mt-6 inline-flex items-center justify-between gap-3 self-start rounded-full border border-gray-200 bg-white py-2 pl-5 pr-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-900 shadow-sm transition-colors hover:border-gray-300 hover:bg-gray-50"
                    >
                      {group.cta}
                      <span className="cc-gradient-fill flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-white transition-transform duration-300 group-hover:rotate-45">
                        <ArrowUpRight size={15} />
                      </span>
                    </a>

                    {/* CarCare-Marke unten RECHTS auf der weissen Karte. Bewusst im Fluss
                        (`mt-auto self-end`) statt absolut positioniert: Ab `lg` ist die weisse
                        Karte bildschirmhoch, `mt-auto` schiebt das Logo dort an den Fuss.
                        Unterhalb `lg` ist sie nur inhaltshoch — absolut positioniert wuerde das
                        Logo dort auf dem CTA-Button liegen, im Fluss setzt es sich sauber
                        darunter. Schatten dezenter als zuvor, weil es jetzt auf Weiss statt
                        auf dem Bild sitzt. */}
                    <span className="mt-auto flex h-11 w-11 shrink-0 items-center justify-center self-end overflow-hidden rounded-xl bg-white p-1.5 shadow-sm ring-1 ring-gray-200 lg:h-14 lg:w-14">
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
