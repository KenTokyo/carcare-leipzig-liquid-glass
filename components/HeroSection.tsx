import React, { useRef } from 'react';
import { motion, useTransform } from 'framer-motion';
import { AlertTriangle, Award, CalendarClock, MapPin, PaintBucket, Users } from 'lucide-react';
import { useScrollProgress } from '../hooks/useScrollProgress';
import { useMediaQuery } from '../hooks/useMediaQuery';

/**
 * Parallax-Reise in % der EBENENHOEHE. Herleitung (Ebene 120 %, `-top` -10 %):
 * Die Ebene ragt oben wie unten 10 % der Rahmenhoehe ueber. Damit an beiden Extremen
 * kein grauer Rand entsteht, muss die Reise <= 10 % der Rahmenhoehe bleiben; mit dem
 * projektueblichen 2-%-Deckungspuffer je Seite bleiben ±8 % der Rahmenhoehe
 * = 8/120 = ±6.67 % der Ebenenhoehe.
 * Aendern? Ebenenhoehe, `-top` UND diesen Wert immer gemeinsam neu herleiten.
 */
const PARALLAX_REISE_PROZENT = 6.67;

/**
 * Vertrauensmerkmale an der Hero-Unterkante. Uebernommen aus der frueher eigenstaendigen
 * `TrustBar`-Sektion, die dafuer am 2026-07-22 aufgeloest wurde (User-Vorgabe, Referenz-Layout:
 * Logo-Leiste am Fuss des Heros). Ausschliesslich harte Fakten (SEO-GEO §4.3), Wortlaut aus den
 * Projekt-USP-Bausteinen. Nach dem Hero startet die Seite direkt mit der Leistungsuebersicht.
 */
const trustFacts = [
  { icon: <Award size={18} />, label: 'Meisterbetrieb', sub: 'Kfz-Lackierhandwerk, seit 1993' },
  { icon: <PaintBucket size={18} />, label: 'Glasurit-Lackpartner', sub: 'farbtongenaue Reparaturlackierung' },
  { icon: <Users size={18} />, label: 'Über 50 Mitarbeiter', sub: 'eingespielte Teams, klare Abläufe' },
  { icon: <MapPin size={18} />, label: 'Standort Leipzig', sub: 'An den Tierkliniken 42' },
];

const HeroSection: React.FC = () => {
  const sectionRef = useRef<HTMLElement>(null);

  // Vertikaler Bild-Parallax (skiper29 / „Siena"): das ueberformatige Bild zieht
  // langsamer als die Seite durch den overflow-hidden-Rahmen. Fortschritt robust
  // ueber die eigene Sektionshoehe gemessen (siehe useScrollProgress).
  //
  // ⚠️ STAERKE BEWUSST REDUZIERT (2026-07-20): Die Ebene war urspruenglich `h-[147%]`
  // (Reise ±14.6 %), nachgebaut nach der skiper29-Referenz. Preis war ein brutaler
  // Bildanschnitt, weil `object-cover` auf die hohe Ebene skaliert: Desktop nur 52 %
  // der Bildbreite sichtbar, mobil 33 % — und mobil zusaetzlich 0.52x Pixeldichte
  // (= sichtbar weichgezeichnet auf Retina). Jetzt `md:h-[120%]` → 64 % sichtbar.
  // Der Referenz-Look wich damit bewusst der Bildaussage. Messwerte + verworfene
  // Alternativen: docs/hero-bild-verlauf/tasks/2026-07-20-hero-bildausschnitt-optimierung-tasks.md
  //
  // MOBIL GANZ AUS: Dort ist der Rahmen extrem hochkant (AR ~0.36 gegen Bild-AR 0.75),
  // jede Ueberhoehung der Ebene kostet ueberproportional Bildbreite UND Schaerfe. Ebene
  // = Rahmenhoehe, Reise 0 → kein Ueberhang, kein Zuschnittverlust. Die Bewegung fehlt
  // auf kleinen Displays kaum, der Schaerfegewinn ist dagegen deutlich (0.52x → 0.76x).
  //
  // BEWUSST NICHT auf prefers-reduced-motion gegated: Windows meldet bei
  // deaktivierten „Animationseffekten" reduced-motion systemweit an alle Browser —
  // ein Gate toetet die Marken-Animation daher auch bei Nutzern ohne vestibulaeren
  // Bedarf. Die uebrige Site animiert konsistent ungegated (whileInView-Reveals,
  // ExpandingCardAccordion). Siehe mobile-accordion-animation-tasks.md, Phase 5.
  const progress = useScrollProgress(sectionRef);
  // 768px = Tailwinds `md` — deckungsgleich mit den `md:`-Klassen der Bild-Ebene unten.
  const istDesktop = useMediaQuery('(min-width: 768px)');
  const reise = istDesktop ? PARALLAX_REISE_PROZENT : 0;
  const parallaxY = useTransform(progress, [0, 1], [`${-reise}%`, `${reise}%`]);

  return (
    <section
      ref={sectionRef}
      id="home"
      aria-labelledby="home-heading"
      className="relative overflow-hidden bg-transparent"
    >
      <div className="hero-card-shell relative min-h-[92svh] overflow-hidden rounded-[1.45rem] bg-gray-950 md:min-h-[calc(100svh-2rem)] md:rounded-[1.75rem]">
      <div className="absolute inset-0">
        {/* Bild-Ebene. MOBIL: exakt Rahmenhoehe (`top-0 h-full`), keine Reise → kein
            Ueberhang, maximale Bildbreite und Schaerfe. AB `md`: 120 % Hoehe, vertikal
            zentriert (-10 %), sodass die Reise (±6.67 % der Ebene = ±8 % der Rahmenhoehe)
            an beiden Extremen den Rahmen voll deckt (~2 % Reserve je Seite).
            Die Verlaufs-Ebene darunter bleibt statisch. */}
        <motion.div
          style={{ y: parallaxY }}
          className="absolute inset-x-0 top-0 h-full will-change-transform md:-top-[10%] md:h-[120%]"
        >
          {/* Art Direction statt einem Bild fuer alles: Beide Quellen zeigen dasselbe Motiv
              (blauer Taycan nach der Aufbereitung + roter Unfallwagen), aber in eigenem Zuschnitt —
              Desktop als 21:9-Panorama (2400x1029), Mobile als Hochkant-Fassung (1744x2336).
              Ohne den Hochkant-Zuschnitt wuerde `object-cover` das Panorama im hochkanten
              Hero-Rahmen auf einen schmalen, stark gezoomten Streifen reduzieren.
              Weil beide dasselbe Motiv zeigen, gilt der `alt` unten fuer beide Quellen.
              Breakpoint 767px = Tailwinds `md`, passend zu den `md:`-Klassen der Sektion. */}
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/assets/hero-leipzig-carcare-mobile.webp"
              width={1744}
              height={2336}
            />
            <img
              src="/assets/hero-leipzig-carcare-desktop.webp"
              alt="Zwei Porsche Taycan in der Werkstatt des CarCare Center Leipzig: ein blauer Wagen nach der Aufbereitung, dahinter ein roter Wagen mit demontierter Front in der Unfallinstandsetzung"
              width={2400}
              height={1029}
              fetchPriority="high"
              className="h-full w-full object-cover object-center"
            />
          </picture>
        </motion.div>
        {/* EINZIGE Verdunkelungs-Ebene (User-Vorgabe 2026-07-20): radialer Schwarzverlauf mit
            Zentrum in der Ecke oben links — 94 % dort, 45 % in der Bildmitte, 0 % unten rechts.
            Ersetzt die frueheren zwei Ebenen (seitlicher `hero-copy-veil` + vertikaler
            `bg-gradient-to-t`). Definition inkl. Herleitung `circle` vs `ellipse` in index.css. */}
        <div className="hero-radial-veil absolute inset-0" />
        {/* Dezentes Scrim von unten (2026-07-22, User-Vorgabe): gibt der Vertrauensleiste am
            Hero-Fuss Halt, ohne das Motiv insgesamt abzudunkeln. Bewusst nur das untere Drittel
            und mit weichem Auslauf — oben greift bereits das radiale Veil. */}
        <div
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-[36%] bg-gradient-to-t from-[rgb(var(--cc-carbon-rgb)/0.72)] via-[rgb(var(--cc-carbon-rgb)/0.3)] to-transparent"
        />
      </div>

      {/* Zwei Zonen: Kopfblock (vertikal zentriert, `flex-1`) und Vertrauensleiste an der
          Unterkante. Ab `md` ist der Kopfblock zusaetzlich HORIZONTAL zentriert (User-Vorgabe
          2026-07-22 nach Referenz-Layout). Auf Mobile bewusst linksbuendig: die H1 bricht dort
          auf ~5 Zeilen um, zentriert wirkt das unruhig und kostet Lesbarkeit.
          `min-h` statt fixer Hoehe -> die Sektion darf wachsen, wenn Inhalt + Leiste mehr
          Platz brauchen (wichtig auf kleinen Displays). */}
      {/* `pb-28` unterhalb `lg`: Die fixierte MobileStickyCTA (~83 px, `lg:hidden`) wuerde die
          Vertrauensleiste sonst anschneiden — genau das passierte im ersten Entwurf. Ab `lg`
          faellt die Leiste weg, dort reicht `pb-10`. */}
      <div className="container relative z-10 mx-auto flex min-h-[92svh] flex-col px-5 pb-28 pt-28 md:min-h-[calc(100svh-2rem)] md:px-8 md:pt-32 lg:pb-10 xl:px-10">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, ease: 'easeOut' }}
          className="flex flex-1 flex-col justify-center py-6 md:items-center md:justify-start md:py-0 md:text-center"
        >
          {/* Bewusst OHNE Badges/Chips (2026-07-22, User-Vorgabe „komplett minimal"):
              Der Hero traegt nur H1, Subline, die zwei CTAs und die Vertrauensleiste unten. */}
          <h1
            id="home-heading"
            className="max-w-4xl text-4xl font-bold leading-[1.03] tracking-tight text-white drop-shadow-[0_2px_24px_rgb(0_0_0/0.55)] sm:text-5xl md:text-6xl lg:text-7xl"
          >
            Unfallschaden, Reparatur oder Autoaufbereitung in Leipzig? CarCare kümmert sich.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-relaxed text-gray-200 drop-shadow-[0_1px_12px_rgb(0_0_0/0.5)] md:text-xl">
            Professionelle Fahrzeugaufbereitung, Unfallinstandsetzung, Lackierung, Smart Repair und Schadenabwicklung für Privatkunden, Versicherungen, Autohäuser und Fuhrparks.
          </p>

          {/* CTAs erst ab `lg` — bewusst der Gegenpart zur `MobileStickyCTA`, die `lg:hidden` ist.
              Unterhalb 1024 px bietet die fixierte Bottom-Leiste dieselben zwei Ziele
              (`#contact-schaden`, `#contact-termin`) PLUS „Anrufen", ist ab Sekunde null sichtbar
              und liegt in der Daumenzone. Beides gleichzeitig hiesse: dieselbe Aktion doppelt im
              Blickfeld (fuenf CTAs auf einem Screen) und ~176 px verschenkte Hoehe.
              ⚠️ Die beiden Breakpoints gehoeren zusammen: Aendert sich `lg:hidden` in
              MobileStickyCTA, muss dieses `lg:flex` mitwandern — sonst entsteht entweder erneut
              die Dopplung oder ein Bereich ganz ohne CTA.
              `hidden` statt Entfernen: die `<a href>` bleiben im HTML und damit crawlbar
              (SEO-GEO §4.4 interne Verlinkung), die Sticky-Bar nutzt dagegen JS-`<button>`. */}
          <div className="mt-9 hidden flex-col gap-3 sm:flex-row sm:flex-wrap lg:flex lg:justify-center">
            <a
              href="/kontakt#contact-schaden"
              className="cc-glass-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
            >
              <AlertTriangle size={18} />
              Schaden melden
            </a>
            <a
              href="/kontakt#contact-termin"
              className="cc-glass-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
            >
              <CalendarClock size={18} />
              Termin für Aufbereitung anfragen
            </a>
          </div>
        </motion.div>

        {/* Vertrauensleiste am Hero-Fuss (ersetzt die frueher eigenstaendige TrustBar-Sektion).
            Weisse Schrift liegt auf dem Foto -> `drop-shadow` je Zeile + duenne Trennlinie
            als optischer Halt. Mobile 2x2, ab `md` eine zentrierte Reihe. */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.25, ease: 'easeOut' }}
          className="mt-8 border-t border-white/15 pt-6"
        >
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-white/70 drop-shadow-[0_1px_8px_rgb(0_0_0/0.65)]">
            Dafür steht CarCare Leipzig
          </p>
          {/* Zweite Trennlinie UNTER dem Label — das Label steht damit zwischen zwei Strichen
              (User-Vorgabe 2026-07-22); der obere Strich ist das `border-t` dieses Blocks. */}
          <div aria-hidden="true" className="mt-6 border-t border-white/15" />
          <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-5 md:flex md:flex-wrap md:items-center md:justify-center md:gap-x-10 md:gap-y-4 lg:gap-x-14">
            {trustFacts.map((fakt) => (
              <li key={fakt.label} className="flex items-center gap-2.5">
                <span className="shrink-0 text-blue-300 drop-shadow-[0_1px_8px_rgb(0_0_0/0.65)]">{fakt.icon}</span>
                <span>
                  <span className="block text-sm font-bold leading-tight text-white drop-shadow-[0_1px_8px_rgb(0_0_0/0.65)]">
                    {fakt.label}
                  </span>
                  {/* Unterzeile erst ab `sm`: auf 390 px brach sie in der 2-Spalten-Leiste auf
                      drei Zeilen um und wirkte unruhig. Dort tragen die vier Kernbegriffe allein
                      — naeher am Referenz-Stil (dort stehen unten nur Wortmarken). */}
                  <span className="mt-0.5 hidden text-[10px] uppercase leading-tight tracking-[0.12em] text-white/65 drop-shadow-[0_1px_8px_rgb(0_0_0/0.65)] sm:block">
                    {fakt.sub}
                  </span>
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
      </div>
    </section>
  );
};

export default HeroSection;
