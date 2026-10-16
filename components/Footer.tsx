import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from 'framer-motion';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { OEFFNUNG_ANZEIGE } from '../data/oeffnungszeiten';
import { GOOGLE_MAPS_ROUTE } from '../data/anfahrt';
import { ExternMarke, externAttribute } from './ExternerLink';
import KiMarke from './KiMarke';

const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';
/**
 * WEISSE Wortmarke fuer den dunklen Footer (2026-07-23). Bewusst PNG statt WebP: Die Datei hat
 * einen Alphakanal und harte Kanten — unsere WebP-Konvertierung laeuft verlustbehaftet (q82) und
 * wuerde dort Artefakte erzeugen. Der transparente Rand des Originals wurde weggeschnitten,
 * dadurch identisches Seitenverhaeltnis (3.08) wie die dunkle Wortmarke -> direkter Ersatz.
 */
const logoWordmarkWhiteSrc = '/assets/carcare-center-wordmark-weiss.png';
/** Hintergrundfoto des Footers (2026-07-23, Kundenmotiv). 2400x900, 36 KB. */
const footerBgSrc = '/assets/footer-leipzig-carcare.webp';

// Hilfsfunktion: erzeugt y/opacity-MotionValues für eine Spalte mit eigener Progress-Slice.
// Muss als Hook (useTransform) auf Top-Level der Komponente aufgerufen werden, daher kein Loop — explizite Aufrufe unten.
function useReveal(progress: MotionValue<number>, start: number, end: number, lift = 48) {
  const y = useTransform(progress, [start, end], [lift, 0]);
  const opacity = useTransform(progress, [start, (start + end) / 2, end], [0, 0.65, 1]);
  return { y, opacity };
}

/**
 * FIXIERT NUR, WENN SIE INS FENSTER PASST (2026-10-14, Mobile-Check). Die Fusszeile ist `fixed` am unteren Rand und wird
 * beim Scrollen hinter dem Inhalt freigelegt. Ist sie hoeher als das Fenster, ragt ihr oberer Teil dauerhaft hinaus und
 * ist nie erreichbar: gemessen 1117–1160 px Fusszeile auf 640–932 px hohen Smartphones (oben 193–528 px weg, Logo und
 * Kontakt), 782 px bei 1024 × 700. Dann steht sie im Seitenfluss, ohne Freilegen. `npm run mobil` prueft das.
 * RESERVE 24 px: Der Inhalt beginnt erst nach dem oberen Innenabstand (64/80 px), der die Navbar-Zone schon abdeckt.
 */
const PASST_RESERVE = 24;

/**
 * BACKLOG 5.21 (Meeting 2026-09-25, umgesetzt im Mobile-Check 2026-10-15): „auf das Wesentliche reduziert“.
 * Vorher 1117 px bei 390 und 761 px bei 1440 (dort rutschte „Anfragen“ als siebte Spalte allein in eine zweite Zeile).
 * ENTFALLEN, weil doppelt: die Spalte „Bereiche“ alter Art (Startseite, Ueber uns, Leistungen, Wissen, Jobangebote stehen
 * vorgerendert in der Navbar), „Anfragen“ (Navbar-Pillen und mobile Leiste), „Verantwortliche Stelle“ (= Kontakt darueber).
 * GEBLIEBEN die fuenf Saeulenseiten: Im vorgerenderten HTML ist die Fusszeile ihr EINZIGER seitenweiter Link, denn die
 * Untermenues der Navbar entstehen erst im Browser (gezaehlt auf /kontakt: je ein Link, und der steht hier). Wer hier
 * kuerzt, nimmt diesen Seiten die interne Verlinkung (SEO-GEO-STANDARDS 4.4).
 */
const BEREICHE = [
  { href: '/unfallinstandsetzung-leipzig', label: 'Unfall & Schaden' },
  { href: '/fahrzeugaufbereitung-leipzig', label: 'Autoaufbereitung' },
  { href: '/leasingrueckgabe-leipzig', label: 'Leasingrückgabe' },
  { href: '/privatkunden', label: 'Privatkunden' },
  { href: '/geschaeftskunden', label: 'Geschäftskunden' },
];

/**
 * Symbole in Eisblau 60 %: Bis 2026-10-15 standen sie in `text-gray-400` (Graphit 42 %) auf Graphit, Kontrast 1,00 : 1,
 * also unsichtbar (konsolidierter Backlog, Querschnitt; mit 5.21 entschieden). Jetzt gemessen 5,35 bis 9,45 : 1
 * (Bildschirmfoto auf /kontakt, 390 und 1440 px, hellster Strichpixel gegen den Grund daneben, 2026-10-15), also ueber
 * den 3 : 1 fuer Grafiken, und eine Stufe leiser als der Text daneben.
 */
const SYMBOL = 'shrink-0 text-blue-300/60';

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState<number>(720);
  const [fixiert, setFixiert] = useState(true);
  const prefersReducedMotion = useReducedMotion();
  // Freilegen nur im fixierten Zustand; im Seitenfluss steht der Inhalt sofort ganz da.
  const bewegt = fixiert && !prefersReducedMotion;

  // Footerhöhe live messen → Spacer hält genau diese Höhe als Reveal-Reserve im Scroll-Flow.
  // Rundung auf ganze px verhindert Sub-Pixel-Layout-Jitter.
  useEffect(() => {
    if (!footerRef.current) return;
    const node = footerRef.current;
    let raf = 0;
    const measure = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const h = Math.round(node.getBoundingClientRect().height);
        if (h > 0) {
          setFooterHeight((prev) => (prev === h ? prev : h));
          const passt = h <= window.innerHeight - PASST_RESERVE;
          setFixiert((prev) => (prev === passt ? prev : passt));
        }
      });
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(node);
    window.addEventListener('resize', measure);
    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  // Reveal-Progress: 0 = Main steht noch oben drauf, 1 = Main ist komplett weggescrollt.
  const { scrollYProgress } = useScroll({
    target: spacerRef,
    offset: ['start end', 'end end'],
  });

  // Spring-Smoothing: kein 1:1-Frame-Hakeln.
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 140,
    damping: 28,
    mass: 0.35,
    restDelta: 0.0005,
  });

  // Globaler Hover-/Float-Lift: bleibt bestehen (User-Wunsch).
  const contentY = useTransform(smoothProgress, [0, 1], [90, 0]);
  const contentOpacity = useTransform(smoothProgress, [0, 0.35, 1], [0.25, 0.85, 1]);
  const contentScale = useTransform(smoothProgress, [0, 1], [0.985, 1]);

  // Pro-Spalten-Reveal: jede Section hat eine eigene Scroll-Slice → Inhalt baut sich gestaffelt auf,
  // während die Mainpage darüber weghovert.
  const brand = useReveal(smoothProgress, 0.0, 0.32, 56);
  const contact = useReveal(smoothProgress, 0.08, 0.4, 52);
  const hours = useReveal(smoothProgress, 0.14, 0.46, 48);
  const areas = useReveal(smoothProgress, 0.2, 0.52, 44);
  const legal = useReveal(smoothProgress, 0.5, 0.9, 30);

  // OHNE FREILEGEN AUSDRUECKLICH DIE ENDWERTE, nicht `undefined`: Der erste Render ist immer fixiert (Prerender, vor der
  // Messung) und setzt Deckkraft 0 und Versatz. Entfaellt danach das `style`, laesst Framer Motion diese Werte einfach
  // stehen. So war die Fusszeile im Seitenfluss am 2026-10-15 komplett leer (Aufnahme 390 px, `npm run mobil` meldet
  // das seitdem als „Fußzeile unsichtbar“).
  const reveal = (m: { y: MotionValue<number>; opacity: MotionValue<number> }) =>
    bewegt ? { y: m.y, opacity: m.opacity, willChange: 'transform, opacity' as const } : { y: 0, opacity: 1 };

  return (
    <>
      {/* Spacer reserviert vertikalen Scroll-Raum, damit der fixed-Footer beim Scrollen freigelegt wird.
          Im Seitenfluss (passt nicht ins Fenster) entfaellt er. */}
      <div ref={spacerRef} aria-hidden style={{ height: fixiert ? footerHeight : 0 }} />

      <motion.footer
        ref={footerRef}
        id="contact"
        // fixed + z-0: liegt hinter dem Main-Content (relative z-10 bg-white). Reveal entsteht, sobald Main nach oben weggescrollt ist.
        // translateZ(0) + will-change zwingt eigene Composite-Layer → kein Repaint pro Scrollframe.
        // Kein Extra-Abstand unten fuer die mobile Aktionsleiste: Sie blendet sich am Seitenende selbst aus
        // (`useNaheSeitenende`). Die „verdeckt“-Befunde vom 2026-10-14 kamen von der Navbar ueber der zu hohen fixierten
        // Fusszeile, nicht von der Leiste.
        className={`site-footer-shell ${fixiert ? 'fixed' : 'site-footer-shell--im-fluss relative'} z-0 bg-gray-900 text-gray-200 px-6 pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden`}
        style={{ transform: 'translate3d(0,0,0)', willChange: 'transform', backfaceVisibility: 'hidden' }}
      >
        {/* Hintergrundfoto (2026-07-23). Liegt als UNTERSTE Ebene, damit die bestehenden
            Brand-Lichter und der Content unveraendert darueber bleiben. Reines Add-on:
            Reveal-Mechanik (Spacer, useScroll, Springs, Spalten-Reveals) bleibt unberuehrt.
            Der dunkle Schleier haelt den Textkontrast auf dem bisherigen Niveau — ohne ihn
            waeren die hellen Bildpartien rechts zu hell fuer die kleine graue Schrift. */}
        <div aria-hidden="true" className="pointer-events-none absolute inset-0">
          <img
            src={footerBgSrc}
            alt=""
            loading="lazy"
            decoding="async"
            className="h-full w-full object-cover object-center"
          />
          {/* 80 % und nicht weniger: gemessen. Bei 70 % hellte das helle Fahrzeug im rechten
              Bildteil den Grund auf rgb(62,67,74) auf — der graue Navigationstext landete damit
              bei Kontrast 3.93 und damit UNTER WCAG-AA (4.5). Mit 80 % liegt er wieder bei ~4.9.
              Wer hier aufhellt, muss den Kontrast neu messen. */}
          <div className="absolute inset-0 bg-gray-900/80" />
        </div>
        {/* Kennzeichnung des Fusszeilen-Motivs. Ausserhalb der `aria-hidden`-Bildebene, damit
            Vorlesegeraete sie mitlesen; oben rechts im Innenabstand, dort beginnt der Inhalt erst
            bei 64 px. */}
        <KiMarke quelle={footerBgSrc} className="right-5 top-5" />

        {/* dezente Brand-Lichter im Hintergrund */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-20 w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 w-[36rem] h-[36rem] rounded-full bg-white/5 blur-[120px]" />
        </div>

        <motion.div
          style={
            bewegt
              ? { y: contentY, opacity: contentOpacity, scale: contentScale, willChange: 'transform, opacity' }
              : { y: 0, opacity: 1, scale: 1 }
          }
          className="relative container mx-auto"
        >
          {/* Raster ohne Waisenzeile (5.21): mobil Marke, Kontakt, dann Oeffnungszeiten neben Bereichen; ab md drei
              Spalten unter der Marke; ab lg eine Zeile 4-3-2-3 auf zwoelf Spalten. */}
          <div className="mb-10 grid grid-cols-2 gap-x-6 gap-y-9 md:mb-14 md:grid-cols-3 md:gap-10 lg:grid-cols-12 lg:gap-8">

            {/* Brand */}
            <motion.div style={reveal(brand)} className="col-span-2 space-y-5 md:col-span-3 lg:col-span-4">
              <div className="inline-flex items-center gap-3">
                {/* Animiertes Markenzeichen behaelt bewusst sein weisses Badge: Das MP4 hat
                    KEINEN Alphakanal (H.264 kann das nicht), sein weisser Hintergrund waere auf
                    dem dunklen Footer sonst als Kasten sichtbar. Gleiche Loesung wie in den
                    Karten-Sektionen (TargetGroupCards, ExpandingCardAccordion). */}
                <span className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 ring-1 ring-white/20">
                  <video
                    src={logoMarkVideoSrc}
                    className="h-full w-full object-contain object-center"
                    autoPlay
                    loop
                    muted
                    playsInline
                    preload="metadata"
                    aria-hidden="true"
                  />
                </span>
                {/* Weisse Wortmarke direkt auf dem dunklen Footer — der frueher noetige weisse
                    Kasten um die dunkle Wortmarke entfaellt dadurch. */}
                <img
                  src={logoWordmarkWhiteSrc}
                  alt="CarCare Center"
                  className="h-10 w-auto object-contain"
                  decoding="async"
                  loading="lazy"
                />
              </div>
              {/* Backlog 5.31 (Meeting 2026-09-25): Wortlaut von André. Bis dahin „… Fahrzeugaufbereitung
                  und -pflege" — die Unfallinstandsetzung, der zweite Hauptbereich, fehlte hier ganz. */}
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                BS CarCare GmbH<br />
                Ihr Premium-Partner für Fahrzeugaufbereitung und Unfallinstandsetzung in Leipzig.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div style={reveal(contact)} className="col-span-2 space-y-4 md:col-span-1 lg:col-span-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Kontakt</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className={`mt-0.5 ${SYMBOL}`} />
                  <div>
                    <p className="leading-snug">An den Tierkliniken 42<br />04103 Leipzig</p>
                    {/* Backlog 6.23: Routenlink an der Adresse — ein gewoehnlicher Link, bis zum Klick keine Verbindung
                        zu Google (data/anfahrt.ts). `py-3 -my-2` gibt der kleinen Zeile die volle Trefferhoehe. */}
                    <a
                      href={GOOGLE_MAPS_ROUTE}
                      {...externAttribute(GOOGLE_MAPS_ROUTE)}
                      className="-my-2 inline-flex items-center gap-1 py-3 text-xs font-semibold text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                    >
                      Route mit Google Maps
                      <ExternMarke href={GOOGLE_MAPS_ROUTE} groesse={12} />
                    </a>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className={SYMBOL} />
                  <a href="tel:+493412617790" className="hover:text-white transition-colors">0341 - 261 77 90</a>
                </div>
                {/* Backlog 5.30 (2026-09-25): Die Faxnummer 0341 - 962 74 87 ist entfallen — André:
                    „braucht ja heute sowieso kein Mensch mehr", die Telefonnummer reicht. */}
                <div className="flex items-center gap-3">
                  <Mail size={16} className={SYMBOL} />
                  {/* `tracking-tight` haelt die Adresse in der schmalen 1/6-Footerspalte auf EINER
                      Zeile: Space Grotesk laeuft breiter als das fruehere Inter und kippte sie ab
                      ~1440px in einen Umbruch mitten in der Domain ("carcare-" / "center.de").
                      Bewusst das Letterspacing statt der Schriftgroesse: haelt 14px konsistent zur
                      Telefonnummer daneben und faellt bei einem technischen String nicht auf. */}
                  <a href="mailto:info@carcare-center.de" className="tracking-tight hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">info@carcare-center.de</a>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div style={reveal(hours)} className="space-y-4 lg:col-span-2">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Öffnungszeiten</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <Clock size={16} className={`mt-0.5 ${SYMBOL}`} />
                  <div className="leading-snug">
                    <p><span className="font-semibold text-white">{OEFFNUNG_ANZEIGE.werktage}:</span> {OEFFNUNG_ANZEIGE.zeit} Uhr</p>
                    <p><span className="font-semibold text-white">Sa:</span> {OEFFNUNG_ANZEIGE.samstag}</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Bereiche: die fuenf Saeulenseiten (Begruendung bei `BEREICHE`). Bis 5.21 hiess die Liste am Desktop
                „Sitemap“ und fehlte mobil ganz (`hidden lg:block`); jetzt steht sie ueberall. */}
            <motion.div style={reveal(areas)} className="space-y-4 lg:col-span-3">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Bereiche</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                {BEREICHE.map((b) => (
                  <li key={b.href}><a href={b.href} className="hover:text-white transition-colors">{b.label}</a></li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* Legal Bottom */}
          <motion.div style={reveal(legal)} className="border-t border-white/10 pt-6 md:pt-8">
            {/* EU-Foerderhinweis — foerderrechtliche Pflichtangabe, keine Gestaltungsfreiheit.
                Emblem: /assets/eu-emblem.svg, erzeugt von scripts/build-eu-emblem.mjs exakt
                nach amtlicher Geometrie (Verhaeltnis 3:2, Sternenkreis H/3, Stern-Umkreis
                H/18, Reflex Blue #003399 / Yellow #FFCC00). Der weisse Rand (1/25 der Hoehe)
                ist auf diesem dunklen Footer-Foto vorgeschrieben, nicht optional.
                Der Hinweistext steht NEBEN dem Emblem und ueberschneidet es nicht. */}
            <div className="mb-6 flex items-center gap-4 md:mb-8">
              <img
                src="/assets/eu-emblem.svg"
                alt="Flagge der Europäischen Union"
                width={948}
                height={648}
                decoding="async"
                className="h-12 w-auto shrink-0 md:h-14"
              />
              {/* Schriftart bewusst NICHT Space Grotesk: Die Publizitaetsvorgaben nennen als
                  zulaessige Schriften Arial, Auto, Calibri, Garamond, Tahoma, Trebuchet und
                  Ubuntu — Space Grotesk ist nicht darunter. Ebenfalls unzulaessig sind
                  Kursivschrift, Unterstreichungen und Schrifteffekte, deshalb hier auch kein
                  drop-shadow wie an anderen Stellen des Footers. `text-white` fuer maximalen
                  Kontrast auf dem Hintergrundfoto. */}
              <div>
                <p
                  className="text-sm leading-snug text-white md:text-base"
                  style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
                >
                  Kofinanziert von der Europäischen Union.
                </p>
                {/* 2026-10-16: Vorhabensbeschreibung nach Art. 50 VO (EU) 2021/1060, unveraendert von der Altseite
                    uebernommen (`public/images/EU_POS.pdf`, gleiche Adresse wie dort; `BEHALTEN` in
                    scripts/lib/weiterleitungen.mjs). Eigenes Element NEBEN dem Pflichtsatz: Fuer den Satz selbst sind
                    Unterstreichungen unzulaessig, fuer diesen Link sind sie die uebliche Kennzeichnung im Footer. */}
                <a
                  href="/images/EU_POS.pdf"
                  className="inline-flex min-h-6 items-center text-xs text-gray-300 underline decoration-white/20 underline-offset-4 transition-colors hover:text-white"
                >
                  Unser Digitalisierungsvorhaben (PDF)
                </a>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-3 lg:gap-6">
              {/* 2026-07-23: von gray-500 auf gray-300 aufgehellt. Auf dem neuen Hintergrundfoto
                  lag gray-500 bei Kontrast 2.77 und damit klar unter WCAG-AA — die Zeilen waren
                  praktisch unlesbar. gray-300 entspricht den uebrigen Footer-Texten.
                  5.21: Impressum und Datenschutz stehen seitdem hier neben dem Copyright statt in der alten
                  Spalte „Bereiche“, auf jeder Seite und mit 24 px Trefferhoehe (`min-h-6`). */}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-xs text-gray-300">
                <p>© {new Date().getFullYear()} BS CarCare GmbH.</p>
                <a href="/impressum" className="inline-flex min-h-6 items-center underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">Impressum</a>
                <a href="/datenschutz" className="inline-flex min-h-6 items-center underline decoration-white/20 underline-offset-4 transition-colors hover:text-white">Datenschutz</a>
              </div>
              {/* 5.21: „Verantwortliche Stelle“ entfallen, sie stand als Kontakt zwei Bloecke darueber und steht im
                  Impressum. 12 statt 10 px: Der Satz ist die einzige Feinschrift, die bleibt. */}
              <div className="max-w-2xl text-xs text-gray-300 leading-relaxed">
                {/*
                  2026-09-04 KORRIGIERT. Hier stand: „Anonymisierte Webanalyse via Matomo,
                  gemäß DSGVO. Aufsichtsbehörde: Der Sächsische Datenschutzbeauftragte, Dresden."

                  DAS WAR FALSCH. Es gibt kein Matomo — kein Script, kein `_paq`, kein Piwik,
                  keine Analytics irgendeiner Art, weder im Quellcode noch im ausgelieferten
                  HTML. Der Satz stammt aus der Datenschutzerklärung der alten Kundenseite,
                  und schon dort steht seit dem 25.05.2018, dass kein Tracking mehr stattfindet.
                  Eine unrichtige Angabe über die eigene Datenverarbeitung wiegt schwerer als
                  eine fehlende — deshalb raus, unabhängig vom Rest der Rechtsseiten.

                  DIE AUFSICHTSBEHÖRDE IST MIT RAUS: Sie gehört in die Datenschutzerklärung,
                  nicht in den Footer, und die dort genannte Form war nicht geprüft. Sie neben
                  einer gerade wegen fehlender Prüfung entfernten Aussage stehen zu lassen,
                  wäre derselbe Fehler eine Zeile tiefer.

                  DER ERSATZSATZ IST GEGEN DEN AUSGELIEFERTEN STAND GEPRÜFT, nicht angenommen:
                    - `Set-Cookie` auf /, /karriere, /kontakt: keine
                    - Analyse-/Tracking-Scripte im HTML und im Bundle: keine
                    - Elemente, die von Fremdhosts laden (img/link/script/source): 0
                      (Unsplash steht nur in `og:image` und JSON-LD — Metadaten, die der
                      Browser des Besuchers nicht abruft. Siehe Faktenblatt.)
                    - Schriften self-hosted, keine eingebettete Karte, nur ausgehende Links
                  Wer den Satz ändert, prüft diese vier Punkte neu.
                */}
                <p><span className="font-semibold text-gray-300">Datenschutz:</span> Diese Website nutzt keine Analyse- oder Tracking-Dienste und setzt keine Cookies.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.footer>
    </>
  );
};

export default Footer;
