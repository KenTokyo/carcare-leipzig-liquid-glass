import React, { useEffect, useRef, useState } from 'react';
import { motion, useScroll, useTransform, useSpring, useReducedMotion, MotionValue } from 'framer-motion';
import { MapPin, Phone, Mail, Clock, Printer } from 'lucide-react';

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

const Footer: React.FC = () => {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const [footerHeight, setFooterHeight] = useState<number>(720);
  const prefersReducedMotion = useReducedMotion();

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
        if (h > 0) setFooterHeight((prev) => (prev === h ? prev : h));
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
  const sitemap = useReveal(smoothProgress, 0.26, 0.58, 44);
  const requests = useReveal(smoothProgress, 0.32, 0.64, 40);
  const legal = useReveal(smoothProgress, 0.55, 0.92, 30);

  const reveal = (m: { y: MotionValue<number>; opacity: MotionValue<number> }) =>
    prefersReducedMotion ? undefined : { y: m.y, opacity: m.opacity, willChange: 'transform, opacity' as const };

  return (
    <>
      {/* Spacer reserviert vertikalen Scroll-Raum, damit der fixed-Footer beim Scrollen freigelegt wird */}
      <div ref={spacerRef} aria-hidden style={{ height: footerHeight }} />

      <motion.footer
        ref={footerRef}
        id="contact"
        // fixed + z-0: liegt hinter dem Main-Content (relative z-10 bg-white). Reveal entsteht, sobald Main nach oben weggescrollt ist.
        // translateZ(0) + will-change zwingt eigene Composite-Layer → kein Repaint pro Scrollframe.
        className="site-footer-shell fixed z-0 bg-gray-900 text-gray-200 px-6 pt-16 pb-8 md:pt-20 md:pb-10 overflow-hidden"
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

        {/* dezente Brand-Lichter im Hintergrund */}
        <div className="pointer-events-none absolute inset-0 opacity-60">
          <div className="absolute -top-32 -left-20 w-[40rem] h-[40rem] rounded-full bg-blue-600/10 blur-[120px]" />
          <div className="absolute -bottom-40 -right-20 w-[36rem] h-[36rem] rounded-full bg-white/5 blur-[120px]" />
        </div>

        <motion.div
          style={
            prefersReducedMotion
              ? undefined
              : { y: contentY, opacity: contentOpacity, scale: contentScale, willChange: 'transform, opacity' }
          }
          className="relative container mx-auto"
        >
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-6 gap-8 md:gap-10 lg:gap-8 mb-10 md:mb-16">

            {/* Brand */}
            <motion.div style={reveal(brand)} className="col-span-2 lg:col-span-2 space-y-5">
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
              <p className="text-gray-300 text-sm leading-relaxed max-w-sm">
                BS CarCare GmbH<br />
                Ihr Premium-Partner für Fahrzeugaufbereitung und -pflege in Leipzig.
              </p>
            </motion.div>

            {/* Contact */}
            <motion.div style={reveal(contact)} className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Kontakt</h4>
              <div className="space-y-3 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <MapPin size={16} className="mt-1 shrink-0 text-gray-400" />
                  <p className="leading-snug">An den Tierkliniken 42<br />04103 Leipzig</p>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400 shrink-0" />
                  <a href="tel:03412617790" className="hover:text-white transition-colors">0341 - 261 77 90</a>
                </div>
                <div className="flex items-center gap-3">
                  <Printer size={16} className="text-gray-400 shrink-0" />
                  <p>0341 - 962 74 87</p>
                </div>
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 shrink-0" />
                  {/* `tracking-tight` haelt die Adresse in der schmalen 1/6-Footerspalte auf EINER
                      Zeile: Space Grotesk laeuft breiter als das fruehere Inter und kippte sie ab
                      ~1440px in einen Umbruch mitten in der Domain ("carcare-" / "center.de").
                      Bewusst das Letterspacing statt der Schriftgroesse: haelt 14px konsistent zu
                      Telefon/Fax daneben und faellt bei einem technischen String nicht auf. */}
                  <a href="mailto:info@carcare-center.de" className="tracking-tight hover:text-white underline decoration-white/20 underline-offset-4 transition-colors">info@carcare-center.de</a>
                </div>
              </div>
            </motion.div>

            {/* Hours */}
            <motion.div style={reveal(hours)} className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Öffnungszeiten</h4>
              <div className="space-y-2 text-sm text-gray-300">
                <div className="flex items-start gap-3">
                  <Clock size={16} className="mt-1 shrink-0 text-gray-400" />
                  <div className="leading-snug">
                    <p><span className="font-semibold text-white">Mo – Fr:</span> 07:00 – 18:00</p>
                    <p><span className="font-semibold text-white">Sa:</span> n. Vereinbarung</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Navigation */}
            <motion.div style={reveal(areas)} className="space-y-4">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Bereiche</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/" className="hover:text-white transition-colors">Startseite</a></li>
                <li><a href="/leistungen" className="hover:text-white transition-colors">Leistungen</a></li>
                <li><a href="/autoaufbereitung-wissen" className="hover:text-white transition-colors">Autoaufbereitung Wissen</a></li>
                <li><a href="/karriere" className="hover:text-white transition-colors">Jobangebote</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Impressum</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Datenschutz</a></li>
              </ul>
            </motion.div>

            {/* Sitemap — Leistungen */}
            <motion.div style={reveal(sitemap)} className="space-y-4 hidden lg:block">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Sitemap</h4>
              <ul className="space-y-2 text-sm text-gray-300">
                <li><a href="/leistungen" className="hover:text-white transition-colors">Leistungen</a></li>
                <li><a href="/unfallinstandsetzung-leipzig" className="hover:text-white transition-colors">Unfall & Schaden</a></li>
                <li><a href="/fahrzeugaufbereitung-leipzig" className="hover:text-white transition-colors">Autoaufbereitung</a></li>
                <li><a href="/autoaufbereitung-wissen" className="hover:text-white transition-colors">Wissensbereich</a></li>
                <li><a href="/geschaeftskunden" className="hover:text-white transition-colors">Geschäftskunden</a></li>
                <li><a href="/kontakt" className="hover:text-white transition-colors">Kontakt</a></li>
              </ul>
            </motion.div>

            {/* Anfragen */}
            <motion.div style={reveal(requests)} className="space-y-4 col-span-2 md:col-span-1">
              <h4 className="font-bold text-white text-sm uppercase tracking-[0.15em]">Anfragen</h4>
              <ul className="grid grid-cols-2 md:grid-cols-1 gap-y-2 gap-x-4 text-sm text-gray-300">
                <li><a href="/kontakt#contact-schaden" className="hover:text-white transition-colors">Schaden melden</a></li>
                <li><a href="/kontakt#contact-termin" className="hover:text-white transition-colors">Termin anfragen</a></li>
                <li><a href="/kontakt#contact-business" className="hover:text-white transition-colors">Geschäftskunden</a></li>
                <li><a href="/geschaeftskunden" className="hover:text-white transition-colors">B2B-Bereich</a></li>
                <li><a href="/#zielgruppen" className="hover:text-white transition-colors">Zielgruppen</a></li>
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
              <p
                className="text-sm leading-snug text-white md:text-base"
                style={{ fontFamily: 'Arial, Helvetica, sans-serif' }}
              >
                Kofinanziert von der Europäischen Union.
              </p>
            </div>

            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 lg:gap-6">
              {/* 2026-07-23: von gray-500 auf gray-300 aufgehellt. Auf dem neuen Hintergrundfoto
                  lag gray-500 bei Kontrast 2.77 und damit klar unter WCAG-AA — die Zeilen waren
                  praktisch unlesbar. gray-300 entspricht den uebrigen Footer-Texten. */}
              <p className="text-xs text-gray-300">
                © {new Date().getFullYear()} BS CarCare GmbH.
              </p>
              <div className="max-w-2xl text-[10px] text-gray-300 leading-relaxed space-y-2">
                <p><span className="font-semibold text-gray-300">Verantwortliche Stelle:</span> BS CarCare GmbH, An den Tierkliniken 42, 04103 Leipzig.</p>
                <p><span className="font-semibold text-gray-300">Datenschutz:</span> Anonymisierte Webanalyse via Matomo, gemäß DSGVO. Aufsichtsbehörde: Der Sächsische Datenschutzbeauftragte, Dresden.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </motion.footer>
    </>
  );
};

export default Footer;
