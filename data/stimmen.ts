/**
 * Mitarbeiterstimmen fuer /karriere — Backlog 5.28 (fuehrt 3.19 und den Stimmen-Teil von 1.26 fort).
 *
 * STAND 2026-10-02: Die fuenf Aussagen aus Andres Mail (vom User weitergegeben) ersetzen die drei Platzhalter.
 * Wortlaut unveraendert, nur die Rechtschreibung angeglichen: Satzanfang gross, kein Leerzeichen vor dem Komma,
 * Komma vor „in dem“. Die Berufe stehen in der Schreibweise der Stellenkarten derselben Seite (`data/jobs.ts`),
 * damit Lesende die Stimme der Stelle zuordnen koennen: Andres „Lackiererin“ → Fahrzeuglackiererin,
 * „Aufbereiter“ → Kfz-Aufbereiter, „Karosseriebaumechaniker“ → Karosserie- und Fahrzeugbaumechaniker.
 * Reihenfolge wie in der Mail.
 *
 * STAND 2026-10-03: Fotos und VORNAMEN (User). Die fuenf Porträts kamen per WeTransfer, Vorname und Beruf im
 * Dateinamen („Josie-Lackiererin-…“). Der User: „Es handelt sich hier um echte Mitarbeiter, die ihr Einverständnis zur
 * Nutzung der Bilder gegeben haben.“ Damit ist die fruehere Vorgabe aus dem Review (3.19: „keine Namen“, nur
 * Berufsbezeichnung) auf Wunsch des Users aufgehoben. Die Karte zeigt Vorname, Beruf und Aussage.
 *
 * ⚠️ WIDERRUF IST EINE ZEILE: Namen und Bilder von Beschaeftigten stehen nur mit Einwilligung hier (§ 22 KUG, § 26
 * Abs. 2 BDSG), und die ist jederzeit widerrufbar. Dann `vorname: null` und `foto: null` setzen. Die Karte zeigt
 * wieder nur Beruf, Aussage und das Symbol des Gewerks. Das Foto unter `public/assets/team/` loeschen, sonst bleibt es
 * per Adresse abrufbar. Nach einem Personalwechsel ebenso: Eine Stimme gehoert der Person, nicht der Stelle.
 *
 * SO KOMMT EIN FOTO HINEIN (alle Schritte, sonst bricht der Build absichtlich):
 *  1. Einwilligung der Person liegt vor (schriftlich im Betrieb ablegen).
 *  2. Original NICHT nach `public/`; `npm run fotos` mit einem Eintrag in `scripts/build-fotos.mjs`: 3:4-`ausschnitt`
 *     (gleiche Anteile von Breite und Hoehe), Kopf bis Kinn zwischen rund 14 und 60 % der Hoehe, `breite: 900`. Ziel
 *     `team/stimme-<beruf>-leipzig-carcare.webp`. Warum diese Werte: Kopf von `components/Stimmen.tsx`.
 *  3. Herkunft in `data/bildherkunft.ts` eintragen, nur mit Beleg: „echt“ oder „aufgewertet“ (dann steht „Foto
 *     KI-bearbeitet“ in der Karte). Ohne Eintrag gaelte die Vorgabe „KI-generiert“; an einem echten Porträt waere das
 *     eine Falschangabe, und `components/Stimmen.tsx` bricht deshalb den Prerender ab. Ein erzeugtes Gesicht neben
 *     einer echten Aussage ist nie zulaessig (Taeuschung von Bewerbenden), auch das bricht ab.
 *  4. `foto` unten setzen (Pfad, Masse, Alternativtext, Fokuspunkt), dazu `vorname`, dann `npm run build` und
 *     `npm run bilder`. Die Bildnummer (B142–B146) haengt am Beruf und bleibt.
 *
 * KEINE LAUFZEIT-IMPORTE: `scripts/check-dummies.mjs` uebersetzt diese Datei einzeln (`istPlatzhalter`).
 */

/** Gewerk der Person — bestimmt das Symbol, solange kein Foto da ist. */
export type StimmenBereich = 'lack' | 'karosserie' | 'aufbereitung' | 'service';

export interface StimmenFoto {
  /** Pfad unter `/assets/team/`, 3:4-WebP aus `npm run fotos`. */
  src: string;
  /** Pixelmasse der Datei — gegen Layout-Verschiebung. */
  breite: number;
  hoehe: number;
  /** Was das Foto zeigt. Kurz: Vorname und Beruf stehen darunter in der Karte. */
  alt: string;
  /**
   * Fokuspunkt in Prozent der Bildbreite bzw. -hoehe: x = Gesichtsmitte, y = Augenlinie. Gemessen am Ausschnitt
   * (Raster in 2-%-Schritten, 2026-10-03), nicht geschaetzt. `components/Stimmen.tsx` haelt damit das Gesicht im schmalen Streifen der
   * eingeklappten Karte und mobil im 64-px-Streifen; die aufgeklappte Karte zeigt die Bildhoehe mittig.
   */
  fokus: { x: number; y: number };
}

export interface Stimme {
  id: string;
  /** Berufsbezeichnung wie in den Stellenkarten. */
  beruf: string;
  /**
   * Derselbe Beruf mit weicher Trennstelle (U+00AD) an der Wortfuge — nur fuer die Anzeige in gesperrten Versalien
   * (wie `anzeigeTitel` in `data/jobs.ts`). „FAHRZEUGLACKIERERIN“ brach ohne Trennstelle als „…LACKIERE / RIN“.
   * Inventar und Alternativtext nutzen `beruf`.
   */
  anzeigeBeruf?: string;
  /** Vorname, nur mit Einwilligung (Kopf). `null` = die Karte nennt nur den Beruf. */
  vorname: string | null;
  bereich: StimmenBereich;
  /** Wie lange im Betrieb. Optional — erst nennen, wenn belegt. */
  dabeiSeit: string | null;
  /** Der Kommentar selbst, ein bis drei Saetze. */
  aussage: string;
  /** Porträt, sobald geliefert und freigegeben (Ablauf oben). `null` = Symbol des Gewerks. */
  foto: StimmenFoto | null;
  /** Platzhalter bis zur Zulieferung — sichtbar gestrichelt, `check-dummies` meldet ihn. */
  istPlatzhalter: boolean;
}

export const stimmen: Stimme[] = [
  {
    id: 'lackiererin',
    beruf: 'Fahrzeuglackiererin',
    anzeigeBeruf: 'Fahrzeug\u00ADlackiererin',
    vorname: 'Josie',
    bereich: 'lack',
    dabeiSeit: null,
    aussage: 'Ich mag die Leute und meine Arbeit, ich fühle mich wohl!',
    foto: {
      src: '/assets/team/stimme-fahrzeuglackiererin-leipzig-carcare.webp',
      breite: 900,
      hoehe: 1200,
      alt: 'Josie in der Werkstatt, mit feinem Pinsel und kleiner Dose in der Hand',
      fokus: { x: 42, y: 38 },
    },
    istPlatzhalter: false,
  },
  {
    id: 'serviceberater',
    beruf: 'Serviceberater',
    vorname: 'Marko',
    bereich: 'service',
    dabeiSeit: null,
    aussage: 'Es macht mir Spaß und ich mag die Bude!',
    foto: {
      src: '/assets/team/stimme-serviceberater-leipzig-carcare.webp',
      breite: 900,
      hoehe: 1200,
      alt: 'Marko am Schreibtisch im Büro',
      fokus: { x: 50, y: 37 },
    },
    istPlatzhalter: false,
  },
  {
    id: 'lackierer',
    beruf: 'Fahrzeuglackierer',
    anzeigeBeruf: 'Fahrzeug\u00ADlackierer',
    vorname: 'Michal',
    bereich: 'lack',
    dabeiSeit: null,
    aussage: 'Gute Atmosphäre, schöne Firma, gutes Geld!',
    foto: {
      src: '/assets/team/stimme-fahrzeuglackierer-leipzig-carcare.webp',
      breite: 900,
      hoehe: 1200,
      alt: 'Michal neben einem zum Lackieren abgedeckten Fahrzeug',
      fokus: { x: 32, y: 38 },
    },
    istPlatzhalter: false,
  },
  {
    id: 'aufbereiter',
    beruf: 'Kfz-Aufbereiter',
    vorname: 'Eshan',
    bereich: 'aufbereitung',
    dabeiSeit: null,
    aussage: 'Ich kann mich hier weiterentwickeln und habe ein gutes Team, in dem ich arbeite.',
    foto: {
      src: '/assets/team/stimme-kfz-aufbereiter-leipzig-carcare.webp',
      breite: 900,
      hoehe: 1200,
      alt: 'Eshan in der Halle vor Fahrzeugen mit geöffneten Türen',
      fokus: { x: 50, y: 37 },
    },
    istPlatzhalter: false,
  },
  {
    id: 'karosserie',
    beruf: 'Karosserie- und Fahrzeugbaumechaniker',
    anzeigeBeruf: 'Karosserie- und Fahrzeugbau\u00ADmechaniker',
    vorname: 'Karol',
    bereich: 'karosserie',
    dabeiSeit: null,
    aussage: 'Ich kann hier das machen, was ich liebe!',
    foto: {
      src: '/assets/team/stimme-karosserie-fahrzeugbaumechaniker-leipzig-carcare.webp',
      breite: 900,
      hoehe: 1200,
      alt: 'Karol in der Werkstatthalle neben einem Fahrzeug mit geöffneter Motorhaube',
      fokus: { x: 50, y: 26 },
    },
    istPlatzhalter: false,
  },
];
