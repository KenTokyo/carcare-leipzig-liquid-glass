import React from 'react';
import {
  BackdropLayout,
  FeatureGrid,
  FeatureItem,
  PageCTA,
  PageFAQ,
  PageHero,
  PageHeroProps,
  PageMeta,
  SectionIntro,
} from './PageBlocks';
import { serviceByHref } from '../data/services';

/**
 * Gemeinsames Layout der Leistungs-Unterseiten (Backlog 1.14).
 *
 * WARUM ES DIESE KOMPONENTE GIBT
 * Sieben Leistungsseiten trugen bis 2026-09-03 dasselbe Geruest je einzeln im Code:
 * `PageMeta` → `PageHero` → drei `<section>` mit `SectionIntro` → `PageCTA`. Nicht
 * aehnlich, sondern Zeichen fuer Zeichen gleich — inklusive der Klassenketten
 * `bg-white px-6 py-20 md:py-28` und `container mx-auto`. Es gab dort nichts zu
 * vereinheitlichen: die Struktur WAR einheitlich, sie stand nur siebenmal da. Jede
 * Layoutaenderung war damit sieben Aenderungen, und jede vergessene Datei eine Seite,
 * die anders aussieht als die uebrigen sechs.
 *
 * Die Seiten selbst behalten, was sie unterscheidet — Texte, Karten, Reihenfolge der
 * Argumente. Sie geben es als Daten herein statt als Markup.
 *
 * WAS DIE KOMPONENTE AUS DER ROUTE ABLEITET, statt es sich geben zu lassen
 *  - `canonical` — stand siebenmal von Hand da. Keines war falsch, aber es gibt keinen
 *    Grund, dieselbe Zeichenkette zweimal zu pflegen, wenn sie ohnehin danebensteht.
 *  - `PageFAQ`-Route — dito; die FAQ-Inhalte kommen aus `data/faqs.ts`.
 *  - Der SEITENHINTERGRUND aus `data/services.ts`. Jede der sieben Leistungen hat dort
 *    bereits ein Kachelmotiv. Damit zeigt die Unterseite zwangslaeufig dasselbe Foto
 *    wie ihre Kachel auf `/leistungen` — Uebersicht und Zielseite gehoeren sichtbar
 *    zusammen, ohne dass jemand die Zuordnung ein zweites Mal pflegt.
 *  - Die beiden festen Eyebrows („Warum CarCare Center Leipzig", „FAQ"). Sie standen
 *    auf allen sieben Seiten woertlich gleich.
 *  - Die Spaltenzahl des ersten Rasters, siehe `spaltenFuer()`.
 *
 * WARUM DIE SEKTIONEN KEINE HINTERGRUNDKLASSE TRAGEN
 * `BackdropLayout` neutralisiert den Hintergrund jeder direkten `<section>`
 * (`.cc-backdrop-content > section` in index.css), damit das stehende Foto ueber die
 * ganze Seite sichtbar bleibt. Ein `bg-white` oder `bg-gray-50/70` waere hier also
 * eine Klasse, die die Stylesheet-Regel garantiert wieder zuruecknimmt — sie stuende
 * nur da, um den naechsten Leser in die Irre zu fuehren. Der frueher sichtbare
 * Wechsel Weiss/Grau uebernimmt keine Aufgabe mehr; die Gliederung leistet das Foto.
 */

/**
 * Eigenstaendige Erklaerung der Leistung (Backlog 1.15).
 *
 * Zwei bis vier Saetze nach dem Antwort-zuerst-Prinzip (SEO-GEO-STANDARDS §4.3): was
 * ist das, wann kommt es infrage, wo sind die Grenzen. Der Absatz muss auch aus dem
 * Zusammenhang geloest verstaendlich bleiben — genau so zitieren KI-Antwortsysteme.
 */
export interface ServiceErklaerung {
  /** Die Frage, die der Absatz beantwortet, z. B. „Was ist Smart Repair?". */
  title: string;
  /** Die Antwort. Erster Satz traegt die Kernaussage. */
  text: string;
}

export interface ServiceLayoutProps {
  /** Pfad der Seite. Quelle fuer canonical, FAQ-Route und Seitenhintergrund. */
  route: string;
  meta: { title: string; description: string };
  hero: PageHeroProps;
  /**
   * PFLICHTFELD, ABER BEWUSST LEERBAR.
   *
   * `null` heisst: „Fuer diese Seite ist noch kein Erklaertext geschrieben" — nicht
   * „diese Seite braucht keinen". Weil das Feld verpflichtend ist, kann keine neue
   * Leistungsseite entstehen, ohne dass jemand die Entscheidung trifft; ein Vergessen
   * ist ein Typfehler, kein stiller Ausfall.
   *
   * Bei `null` wird NICHTS gerendert. Kein Platzhaltertext, keine leere Sektion mit
   * Innenabstand. Erfundener Fuelltext auf einer Kundenseite geht erfahrungsgemaess
   * live, weil er beim Review wie fertiger Text aussieht.
   */
  erklaerung: ServiceErklaerung | null;
  /** Die fachliche Sektion: was diese Leistung umfasst bzw. was sie bringt. */
  leistung: {
    eyebrow: string;
    title: string;
    description?: string;
    items: FeatureItem[];
    /** Nur setzen, wenn die Ableitung aus der Kartenzahl nicht passt. */
    columns?: 'three' | 'four';
  };
  /** Vertrauenssektion. Eyebrow ist fest, nur die Ueberschrift ist seitenspezifisch. */
  usp: { title: string; items: FeatureItem[] };
  faq: { title: string };
  cta: { title: string; description: string; primaryLabel?: string; primaryHref?: string };
  /** Bildausschnitt des Hintergrundmotivs, siehe `PhotoBackdrop`. */
  zoom?: number;
  /**
   * Zusaetzliche Sektionen einer einzelnen Seite. Sie stehen zwischen der
   * Vertrauenssektion und dem FAQ — FAQ und CTA bleiben am Ende, weil das FAQ die
   * Seite maschinenlesbar zusammenfasst und der CTA sie abschliesst.
   *
   * Ohne diesen Ausweg wird die Komponente beim ersten Sonderwunsch aufgebohrt oder
   * umgangen; beides endet wieder bei sieben Einzelseiten.
   */
  children?: React.ReactNode;
}

/** Innenabstaende aller Sektionen. Einmal, nicht siebenmal. */
const SEKTION = 'px-6 py-20 md:py-28';

/**
 * Vier Karten stehen in vier Spalten, alles andere in dreien.
 *
 * Das war schon vor der Migration die gelebte Regel, nur ungeschrieben: Genau die vier
 * Seiten mit vier Karten setzten `columns="four"`, die drei mit fuenf oder sechs Karten
 * liessen es weg. Es ist auch die richtige Regel — vier Karten in drei Spalten lassen
 * eine einzelne Karte allein in der zweiten Reihe stehen.
 */
const spaltenFuer = (anzahl: number): 'three' | 'four' => (anzahl === 4 ? 'four' : 'three');

const ServiceLayout: React.FC<ServiceLayoutProps> = ({
  route,
  meta,
  hero,
  erklaerung,
  leistung,
  usp,
  faq,
  cta,
  zoom,
  children,
}) => {
  const katalogEintrag = serviceByHref(route);
  if (!katalogEintrag?.backgroundImage) {
    // Bewusst laut: Der Prerender rendert die Route dann nicht, `scripts/prerender.mjs`
    // meldet sie als fehlgeschlagen und bricht den Build auf Vercel ab. Ein stiller
    // Rueckfall auf „Seite ohne Hintergrund" waere die schlechtere Variante — er wuerde
    // erst auffallen, wenn jemand die Seite zufaellig ansieht.
    throw new Error(
      `[ServiceLayout] Kein Kachelmotiv fuer "${route}" gefunden. Jede Leistungsseite ` +
        'bezieht ihren Seitenhintergrund aus dem Katalogeintrag in data/services.ts — ' +
        'entweder fehlt dort der Eintrag zu dieser Route oder sein `backgroundImage`.'
    );
  }

  return (
    <BackdropLayout image={katalogEintrag.backgroundImage} zoom={zoom}>
      <PageMeta canonical={route} title={meta.title} description={meta.description} />
      <PageHero {...hero} />

      {/* Erklaerung vor der Fachsektion: erst „was ist das", dann „was bieten wir dabei
          an". Wer ueber „Smart Repair Leipzig" hier landet und den Begriff nicht kennt,
          braucht die Definition vor den Vorteilen. */}
      {erklaerung && (
        <section className={SEKTION}>
          <div className="container mx-auto">
            <SectionIntro eyebrow="Kurz erklärt" title={erklaerung.title} description={erklaerung.text} />
          </div>
        </section>
      )}

      <section className={SEKTION}>
        <div className="container mx-auto">
          <SectionIntro eyebrow={leistung.eyebrow} title={leistung.title} description={leistung.description} />
          <FeatureGrid
            items={leistung.items}
            columns={leistung.columns ?? spaltenFuer(leistung.items.length)}
            tone="translucent"
          />
        </div>
      </section>

      <section className={SEKTION}>
        <div className="container mx-auto">
          <SectionIntro eyebrow="Warum CarCare Center Leipzig" title={usp.title} />
          {/* `translucent`, weil weisse Karten das stehende Foto zudecken wuerden —
              dieselbe Wahl wie auf /fahrzeugaufbereitung-leipzig. Die Komponente setzt
              den Ton selbst, damit ihn niemand je Seite vergisst. */}
          <FeatureGrid items={usp.items} tone="translucent" />
        </div>
      </section>

      {children}

      <section className={SEKTION}>
        <div className="container mx-auto">
          <SectionIntro eyebrow="FAQ" title={faq.title} />
          <PageFAQ route={route} />
        </div>
      </section>

      <PageCTA {...cta} />
    </BackdropLayout>
  );
};

export default ServiceLayout;
