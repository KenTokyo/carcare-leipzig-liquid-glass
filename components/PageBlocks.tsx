import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, CheckCircle2, Phone } from 'lucide-react';
import { faqsByRoute } from '../data/faqs';
import SEOHead, { OpenGraphMeta } from './SEOHead';
import PhotoBackdrop from './PhotoBackdrop';
import { ACHSE, ACHSE_DAUER, ACHSE_KURVE, KARTE, PUNKT, SICHTFELD, SPALTEN, punktVerzoegerung } from './ablaufAnimation';

export interface PageHeroProps {
  eyebrow: string;
  title: string;
  description: string;
  primaryCta?: { label: string; href: string };
  secondaryCta?: { label: string; href: string };
  keywords?: string[];
}

/**
 * Seitenlayout mit durchgehendem Foto-Hintergrund.
 *
 * Das Foto haengt per `position: sticky` oben im Viewport und bleibt stehen, waehrend
 * der Inhalt darueber scrollt — es loest sich erst, wenn das Ende des Inhalts erreicht
 * ist. Motiv ist bewusst dasselbe wie auf der zugehoerigen Kachel der Startseite, damit
 * Uebersicht und Unterseite zusammengehoeren.
 *
 * MECHANIK: Der Sticky-Block ist eine Viewporthoehe hoch; der Inhalt wird per
 * `-mt-[100svh]` genau um diese Hoehe wieder hochgezogen und liegt damit darueber.
 * Ohne das Hochziehen begaenne die Seite mit einem leeren Bildschirm.
 *
 * WARUM STICKY UND NICHT FIXED: Der App-Shell (`main`) spannt einen eigenen Containing
 * Block auf — `position: fixed` orientiert sich daran statt am Viewport und ist hier
 * gebrochen. `sticky` greift dagegen nativ.
 *
 * `svh` statt `vh`: Auf Mobile wuerde `100vh` die ein-/ausfahrende Browserleiste
 * mitrechnen; Sticky-Hoehe und negativer Rand liefen dann auseinander.
 *
 * Die Sektionen geben ihren Hintergrund ueber `.cc-backdrop-content` ab (index.css).
 */
export const BackdropLayout: React.FC<{ children: React.ReactNode; image: string; video?: string | null; zoom?: number }> = ({ children, image, video, zoom }) => (
  <div className="relative isolate">
    <div className="pointer-events-none sticky top-0 -z-10 h-[100svh]">
      {/* `video` (Backlog 3.20) ist optional: ohne Quelle bleibt es beim Foto. Weil die
          Flaeche `sticky` steht, laeuft ein Video hier beim Scrollen weiter — genau das
          war die Vorgabe. */}
      <PhotoBackdrop image={image} className="rounded-none" textGuard="wide" zoom={zoom} video={video} />
    </div>
    <div className="cc-backdrop-content -mt-[100svh]">{children}</div>
  </div>
);

export interface FeatureItem {
  title: string;
  description: string;
  href?: string;
}

export interface ProcessItem {
  title: string;
  description: string;
}

export const PageMeta: React.FC<{ canonical?: string; description: string; noindex?: boolean; og?: OpenGraphMeta; title: string }> = (props) => <SEOHead {...props} />;

export const PageHero: React.FC<PageHeroProps> = ({ eyebrow, title, description, primaryCta, secondaryCta, keywords }) => {
  return (
    // Kein `overflow-hidden` mehr: Innerhalb von `BackdropLayout` wuerde es den Sticky-
    // Kontext beschneiden. Der Farbverlauf bleibt fuer Seiten OHNE Foto-Hintergrund
    // stehen; auf Seiten mit `BackdropLayout` nimmt ihn `.cc-backdrop-content` zurueck.
    <section className="relative bg-gradient-to-br from-blue-50 via-white to-white px-6 pb-16 pt-32 md:pb-24 md:pt-40">
      <div className="container relative mx-auto">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-4xl">
          <span className="mb-5 inline-flex rounded-full border border-blue-200 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
            {eyebrow}
          </span>
          {/* `[hyphens:auto]` + `break-words`: Ohne das lief „Fahrzeugaufbereitung" auf
              375 px um 61 px aus dem Kasten und wurde abgeschnitten — lange deutsche
              Komposita passen dort in keine Zeile. `lang="de"` steht am <html>, die
              Trennung folgt also deutschen Regeln. Ab `md` greift es praktisch nie. */}
          <h1 className="text-4xl font-bold leading-[1.04] tracking-tight text-gray-950 [hyphens:auto] break-words md:text-6xl">{title}</h1>
          {/* `gray-700` statt `gray-600` — Reserve, nicht die Reparatur.
              Dieser Absatz ist der einzige laengere Fliesstext, der auf Seiten mit
              `BackdropLayout` ohne Karte direkt auf dem Foto liegt. Behoben ist der
              Kontrast durch den Textschutz selbst (`.cc-guard-wide` in index.css, dort
              stehen die Messwerte); der dunklere Ton hebt den schlechtesten gemessenen
              Wert von 4.99:1 auf 6.78:1 und schafft damit Abstand zur AA-Grenze von
              4.5:1, statt knapp darueber zu liegen.
              Unabhaengig zuruecknehmbar: ohne ihn bleibt die Seite AA-konform. */}
          <p className="mt-6 max-w-3xl text-base leading-relaxed text-gray-700 md:text-xl">{description}</p>
          {(primaryCta || secondaryCta) && (
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
              {primaryCta && (
                <a href={primaryCta.href} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  {primaryCta.label}
                  <ArrowRight size={16} />
                </a>
              )}
              {secondaryCta && (
                <a href={secondaryCta.href} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
                  {secondaryCta.label}
                </a>
              )}
            </div>
          )}
          {keywords && (
            <div className="mt-9 flex flex-wrap gap-2">
              {keywords.map((keyword) => (
                <span key={keyword} className="rounded-full border border-gray-100 bg-white px-4 py-2 text-xs font-semibold text-gray-600 shadow-sm">
                  {keyword}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
};

export const SectionIntro: React.FC<{ eyebrow: string; title: string; description?: string }> = ({ eyebrow, title, description }) => (
  <div className="mb-10 max-w-3xl md:mb-14">
    <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">{eyebrow}</span>
    <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">{title}</h2>
    {description && <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">{description}</p>}
  </div>
);

/**
 * ⚠️ `tone` IST AM 2026-09-14 ENTFALLEN (Backlog 2.1).
 *
 * Die Stuetze hatte zwei Werte: `solid` (weiss) und `translucent`. Damit hing es am
 * Aufrufer, ob eine Karte weiss oder durchscheinend war — und genau daraus entstand die
 * Uneinheitlichkeit, die der Kunde in 2.1 beschreibt: Dieselbe Karte sah auf zwei Seiten
 * verschieden aus, je nachdem, ob jemand die Stuetze gesetzt hatte.
 *
 * Jetzt traegt `.cc-karte` die Flaeche, definiert an einer Stelle in `index.css`. Wer die
 * Transparenz aendern will, aendert dort `--cc-karte-alpha` — nicht hier und nicht an
 * fuenf Aufrufstellen.
 */
export const FeatureGrid: React.FC<{ items: FeatureItem[]; columns?: 'three' | 'four' }> = ({ items, columns = 'three' }) => {
  const gridClass = columns === 'four' ? 'lg:grid-cols-4' : 'lg:grid-cols-3';
  const kartenTon = 'cc-karte';
  return (
    <div className={`grid grid-cols-1 gap-4 sm:grid-cols-2 ${gridClass}`}>
      {items.map((item, idx) => {
        const content = (
          <>
            <div className="mb-5 flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <CheckCircle2 size={20} />
            </div>
            <h3 className="text-lg font-bold leading-tight text-gray-950">{item.title}</h3>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">{item.description}</p>
            {item.href && <span className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">Mehr erfahren <ArrowRight size={14} /></span>}
          </>
        );
        const className = `group rounded-2xl border border-gray-100 ${kartenTon} p-6 transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60`;
        return item.href ? (
          <motion.a key={item.title} href={item.href} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: idx * 0.04 }} className={className}>
            {content}
          </motion.a>
        ) : (
          <motion.article key={item.title} initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: '-40px' }} transition={{ duration: 0.4, delay: idx * 0.04 }} className={className}>
            {content}
          </motion.article>
        );
      })}
    </div>
  );
};

/**
 * Ablauf-Sektionen der Serviceseiten (Backlog 2.3).
 *
 * VORHER EIN STILLES RASTER: `grid-cols-1 md:grid-cols-2 xl:grid-cols-3` mit nummerierten
 * Kaesten, ohne jede Bewegung und ohne sichtbare Verbindung. Bei fuenf Schritten auf drei
 * Spalten brach die Reihenfolge sogar optisch um — Schritt 4 stand unter Schritt 1. Der
 * Kunde verlangt in 2.3 denselben Stil wie auf `/ueber-uns`: eine Achse, die sich
 * zeichnet, und Punkte, die der Linie folgen.
 *
 * GEOMETRIE, ZWEI RICHTUNGEN, EIN MARKUP — wie im Zeitstrahl:
 *   unter `xl`  senkrechte Achse links, Punkt davor, Karte rechts daneben
 *   ab   `xl`   waagerechte Achse oben, Punkte darauf, Karten darunter
 * Kein zweiter Markup-Block, sonst stuende derselbe Text zweimal im HTML.
 *
 * WARUM ALLE KARTEN AUF DIESELBE SEITE und nicht abwechselnd wie im Zeitstrahl:
 * Schritte sind gleichrangig. Ein Wechsel oben/unten behauptet eine Gewichtung, die es
 * bei einem Ablauf nicht gibt — beim Zeitstrahl ist er noetig, weil Meilensteintexte
 * ungleich lang sind.
 *
 * RECHNUNG HINTER DEN ZAHLEN (damit niemand daran „aufraeumt"):
 * Der Punkt ist `h-11` = 2,75rem, seine halbe Hoehe 1,375rem. Ab `xl` sitzt er oben im
 * `<li>`, die Achse liegt deshalb auf `top-[1.375rem]` — genau durch die Punktmitte.
 * Die Karte haengt `mt-9` (2,25rem) darunter, ihre Stichleitung ist `h-9` und trifft
 * damit exakt die Punktunterkante. Unter `xl` steht der Punkt links im Fluss, seine
 * Mitte liegt 1,375rem vom Rand — dort laeuft die senkrechte Achse.
 *
 * `<ol>` STATT `<div>`: Ein Ablauf IST eine geordnete Liste. Vorlesegeraete zaehlen sie
 * dadurch von selbst; die sichtbare Ziffer ist danach eine Dopplung und deshalb
 * `aria-hidden`. Anders als im Zeitstrahl ist der Punkt KEIN Knopf — es gibt nichts
 * hervorzuheben, und sieben Sektionen mal fuenf Knoepfe waeren nur Tab-Stopps ohne Ziel.
 */
export const ProcessList: React.FC<{ steps: ProcessItem[] }> = ({ steps }) => {
  const anzahl = steps.length;

  return (
    <div className="relative max-w-3xl xl:max-w-none">
      {/* ------------------------------------------------------------ Achse ---
          Der beobachtete Traeger behaelt seine Flaeche; nur die Kinder skalieren
          (siehe die Falle in `ablaufAnimation.ts`). `aria-hidden`: Die Abfolge
          steckt in der <ol>. */}
      <motion.div
        aria-hidden="true"
        initial="ruhe"
        whileInView="an"
        viewport={SICHTFELD}
        className="pointer-events-none absolute left-[1.375rem] top-0 h-full w-px xl:left-0 xl:top-[1.375rem] xl:h-px xl:w-full"
      >
        <div className="h-full w-full bg-gray-200" />
        <motion.div
          variants={ACHSE}
          transition={{ duration: ACHSE_DAUER, ease: ACHSE_KURVE }}
          className="absolute inset-0 origin-top bg-blue-600/40 xl:hidden"
        />
        <motion.div
          variants={ACHSE}
          transition={{ duration: ACHSE_DAUER, ease: ACHSE_KURVE }}
          className="absolute inset-0 hidden origin-left bg-blue-600/40 xl:block"
        />
      </motion.div>

      <ol className={`relative grid grid-cols-1 gap-6 xl:gap-4 ${SPALTEN[anzahl] ?? 'xl:grid-cols-5'}`}>
        {steps.map((step, idx) => {
          const verzoegerung = punktVerzoegerung(idx, anzahl);

          return (
            <motion.li
              key={step.title}
              // Beobachtet wird DIESES Element — es hat immer eine Flaeche.
              initial="ruhe"
              whileInView="an"
              viewport={SICHTFELD}
              className="relative flex items-start gap-4 xl:block"
            >
              <motion.div
                aria-hidden="true"
                variants={PUNKT}
                transition={{ delay: verzoegerung, duration: 0.42, ease: [0.34, 1.4, 0.5, 1] }}
                className="relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white text-sm font-bold text-blue-600 ring-1 ring-gray-200 xl:mx-auto"
              >
                {idx + 1}
              </motion.div>

              <motion.div
                variants={KARTE}
                transition={{ delay: verzoegerung + 0.16, duration: 0.45 }}
                className="relative min-w-0 flex-1 xl:mt-9"
              >
                {/* Stichleitung vom Punkt zur Karte — ohne sie schwebt die Karte ab `xl`
                    ohne sichtbaren Bezug unter der Achse. */}
                <span
                  aria-hidden="true"
                  className="absolute bottom-full left-1/2 hidden h-9 w-px bg-gray-200 xl:block"
                />
                <article className="cc-karte hyphens-auto break-words rounded-2xl border border-gray-100 p-6">
                  <h3 className="text-lg font-bold leading-snug text-gray-950">{step.title}</h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">{step.description}</p>
                </article>
              </motion.div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export interface PriceItem {
  id: string;
  title: string;
  /** Anzeigepreis inkl. Waehrung, z. B. "169,00 €" oder "ab 348,00 €". */
  price: string;
  description: string;
}

/**
 * Preisraster fuer Pakete und Einzelleistungen.
 *
 * Ersetzt zwei markup-identische Inline-Raster, die bis 2026-08-03 in
 * `pages/VehicleDetailingPage.tsx` nebeneinander standen (Pflegepakete + Desinfektion).
 * `note` nimmt den Pflichthinweis zur Mehrwertsteuer auf.
 */
export const PricingGrid: React.FC<{
  ctaHref?: string;
  ctaLabel?: string;
  items: PriceItem[];
  note?: string;
}> = ({ ctaHref = '/kontakt#contact-termin', ctaLabel = 'Paket anfragen', items, note }) => (
  <>
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
      {items.map((item, idx) => (
        <motion.article
          key={item.id}
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.4, delay: idx * 0.05 }}
          className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
        >
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-lg font-bold leading-tight text-gray-950">{item.title}</h3>
            <span className="shrink-0 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold tracking-wide text-white">{item.price}</span>
          </div>
          <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{item.description}</p>
          <a href={ctaHref} className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-600">
            {ctaLabel} <ArrowRight size={14} />
          </a>
        </motion.article>
      ))}
    </div>
    {note && <p className="mt-6 text-xs leading-relaxed text-gray-600">{note}</p>}
  </>
);

/**
 * Sichtbarer FAQ-Block. Nimmt bewusst die ROUTE und keine FAQ-Liste: die Inhalte
 * kommen ausschliesslich aus `data/faqs.ts`, damit der sichtbare Text und das
 * `FAQPage`-Markup in `seo/pageSchemas.ts` nicht auseinanderlaufen koennen.
 * Waere hier ein `faqs`-Array uebergebbar, waere die Doppelpflege sofort zurueck.
 */
export const PageFAQ: React.FC<{ route: string }> = ({ route }) => (
  <div className="space-y-3">
    {(faqsByRoute[route] ?? []).map((faq) => (
      <article key={faq.id} className="cc-karte rounded-2xl border border-gray-100 p-6">
        <h3 className="text-lg font-bold leading-tight text-gray-950">{faq.question}</h3>
        <p className="mt-3 text-sm leading-relaxed text-gray-600 md:text-base">{faq.answer}</p>
      </article>
    ))}
  </div>
);

export const PageCTA: React.FC<{ title: string; description: string; primaryLabel?: string; primaryHref?: string }> = ({
  title,
  description,
  primaryLabel = 'Anfrage starten',
  primaryHref = '/kontakt',
}) => (
  <section className="bg-white px-6 py-16 md:py-24">
    <div className="container mx-auto">
      <div className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 md:p-10 lg:p-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-8">
            <h2 className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">{title}</h2>
            <p className="mt-5 max-w-2xl text-base leading-relaxed text-gray-600 md:text-lg">{description}</p>
          </div>
          <div className="flex flex-col gap-3 lg:col-span-4 lg:items-end">
            <a href={primaryHref} className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              {primaryLabel}
              <ArrowRight size={16} />
            </a>
            <a href="tel:+493412617790" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              <Phone size={16} />
              0341 - 261 77 90
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
);
