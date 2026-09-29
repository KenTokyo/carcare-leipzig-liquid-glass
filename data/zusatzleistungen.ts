/**
 * Zusatzleistungen der Aufbereitung — EINE QUELLE fuer Formular, Preiskacheln, Schema und Mail.
 *
 * STAND 2026-09-28 (Backlog 5.20, Mail von Andre vom selben Tag): Die Platzhalter „Zusatzleistung
 * 1/2“ (1.18, 2.26) sind durch die echte Liste ersetzt. Preise aus der Mail: Felgenintensivreinigung,
 * Cabrio-Verdeckimpraegnierung, Motorreinigung, Keramik-, Nano- und Frontscheibenversiegelung; Ozon
 * und Heissvernebelung standen schon mit Preis auf der Seite.
 *
 * WER LIEST HIER:
 *  - `components/formulare/TerminFelder.tsx` — ein Kaestchen je Eintrag, mit Preis
 *  - `data/detailing.ts` — die Preiskacheln auf `/fahrzeugaufbereitung-leipzig`, Aussen- und Innenseite
 *  - `data/anfrageSchema.ts` — Klartext mit Preis in der Mail; Kollisionspruefung der IDs
 *  - `scripts/check-dummies.mjs` — fuehrt die Datei direkt aus. Deshalb KEINE Laufzeit-Importe hier.
 *
 * TEXTE: Andre liefert noch saubere Beschreibungen der Aufbereitungsleistungen. Bis dahin stehen hier
 * Kacheltexte von OALAB, die nur behaupten, was die Seite schon belegt (Keramik braucht einen gereinigten
 * und polierten Lack, Keramik und Nano sind Alternativen, die Motorreinigung steckt in der Premiumpflege).
 * Keine Haltbarkeitsangaben, keine Produktnamen — die kommen, wenn der Betrieb sie nennt.
 *
 * AUSGRAUEN (`nichtMit`): Wurde im Formular eine Leistung oder Zusatzleistung gewaehlt, mit der diese
 * Zusatzleistung keinen Sinn ergibt, ist ihr Kaestchen gesperrt und nennt den Grund. Eine schon
 * gewaehlte Zusatzleistung wird dabei abgewaehlt. Aktiv sind nur Regeln, die der Seitentext traegt;
 * der Rest folgt mit Andres Beschreibungen — dann ist es je Regel eine Zeile hier.
 *
 * PREISE: Anzeige inkl. Waehrung wie auf den Paketkarten („ab 849,00 €“). Das Schema liest den Betrag
 * daraus ab (`data/detailing.ts`), es gibt keine zweite Schreibweise. Keramik und Nano sind seit dem
 * Meeting vom 2026-09-28 „ab“-Preise (Backlog 6.17, Andre: „auch die Keramik ist ab“).
 *
 * AUCH ALS LEISTUNG (Backlog 6.6, Meeting 2026-09-28): Die drei Versiegelungen sind zusaetzlich im Feld
 * „Gewuenschte Leistung“ waehlbar — mit DERSELBEN ID (`auchAlsLeistung`, eingelesen von
 * `data/leistungsauswahl.ts`). Ist eine davon als Leistung gewaehlt, ist ihr eigenes Kaestchen gesperrt;
 * die Regel Keramik ⟂ Nano greift dann genauso wie zwischen zwei Kaestchen.
 */

export interface Ausschluss {
  /** ID aus `data/leistungsauswahl.ts` (gewaehlte Leistung) oder aus dieser Liste (gewaehlte Zusatzleistung). */
  mit: string;
  /** Sichtbarer Grund am gesperrten Kaestchen. */
  grund: string;
}

export interface Zusatzleistung {
  /** Stabiler Schluessel. Geht so in den Versand und in die Vorauswahl — nicht nachtraeglich umbenennen. */
  id: string;
  /** Name, wie er am Kaestchen, auf der Kachel und in der Mail steht. */
  label: string;
  /** Anzeigepreis inkl. Waehrung, z. B. „849,00 €“. */
  preis: string;
  /** Text der Preiskachel. */
  beschreibung: string;
  /** Wann das Kaestchen gesperrt ist. */
  nichtMit?: Ausschluss[];
  /**
   * Auch als „Gewuenschte Leistung“ waehlbar (Backlog 6.6). Die Kachel waehlt dann die LEISTUNG vor, nicht
   * das Kaestchen (`startwerte` in RequestForm); die Kollisionspruefung in `data/anfrageSchema.ts` laesst
   * genau diese IDs in beiden Listen zu.
   */
  auchAlsLeistung?: boolean;
  /** Platzhalter bis zur Zulieferung — steuert den Hinweis im Formular und `check-dummies`. */
  istDummy?: boolean;
}

const EINE_VERSIEGELUNG = 'Entweder Keramik- oder Nanoversiegelung';

export const zusatzleistungen: Zusatzleistung[] = [
  {
    id: 'keramik',
    label: 'Keramikversiegelung',
    preis: 'ab 849,00 €',
    // Backlog 6.18 (Meeting 2026-09-28): vereinbart ist die EMPFEHLUNG, jaehrlich aufzufrischen — ausdruecklich
    // keine Haltbarkeitsangabe (Andre: sie haelt „maximal ein Jahr“, das soll so nicht auf der Seite stehen).
    beschreibung:
      'Die Keramikversiegelung bildet eine harte, glänzende Schutzschicht auf dem Lack. Wasser perlt ab, Schmutz haftet schlechter, und die Wäsche wird leichter. Voraussetzung ist ein gereinigter und polierter Lack, etwa nach der Brillant Außenpflege. Wir empfehlen, die Versiegelung jährlich auffrischen zu lassen.',
    nichtMit: [{ mit: 'nano', grund: EINE_VERSIEGELUNG }],
    auchAlsLeistung: true,
  },
  {
    id: 'nano',
    label: 'Nanoversiegelung',
    preis: 'ab 299,00 €',
    beschreibung:
      'Die Nanoversiegelung schützt den Lack mit einer hauchdünnen, wasserabweisenden Schicht. Regen perlt ab, Schmutz lässt sich leichter abwaschen, und der Glanz bleibt länger erhalten. Sie ist die preiswertere Alternative zur Keramikversiegelung.',
    nichtMit: [{ mit: 'keramik', grund: EINE_VERSIEGELUNG }],
    auchAlsLeistung: true,
  },
  {
    id: 'frontscheibe',
    label: 'Frontscheibenversiegelung',
    preis: '89,00 €',
    beschreibung:
      'Wir versiegeln die Frontscheibe wasserabweisend. Bei Regen perlt das Wasser während der Fahrt ab, die Sicht bleibt klarer, und Insekten und Schmutz lassen sich leichter entfernen.',
    auchAlsLeistung: true,
  },
  {
    id: 'felgen',
    label: 'Felgenintensivreinigung',
    preis: '95,20 €',
    beschreibung:
      'Gründlicher als die Felgenreinigung der Brillant Außenpflege: Wir lösen festsitzenden Bremsstaub und Ablagerungen, auch in den Zwischenräumen der Felgen.',
  },
  {
    id: 'cabrio',
    label: 'Cabrio-Verdeckimprägnierung',
    preis: '99,00 €',
    beschreibung:
      'Wir imprägnieren das Stoffverdeck Ihres Cabrios. Wasser perlt ab, und das Gewebe ist besser vor Nässe und Verschmutzung geschützt.',
  },
  {
    id: 'motor',
    label: 'Motorreinigung',
    preis: '49,00 €',
    beschreibung:
      'Wir reinigen den Motorraum. In der Premiumpflege ist die Motorreinigung bereits enthalten, zu den übrigen Paketen buchen Sie sie einzeln dazu.',
    // Traegt der Seitentext: Premiumpflege „inklusive Motorreinigung“ (data/detailing.ts, FAQ Innenaufbereitung).
    nichtMit: [{ mit: 'komplett', grund: 'In der Premiumpflege enthalten' }],
  },
  {
    // Wortlaut unveraendert von der Seite uebernommen (vorher `disinfectionServices` in data/detailing.ts).
    id: 'ozon',
    label: 'Ozonbehandlung',
    preis: '45,00 €',
    beschreibung:
      'Ozon ist eines der stärksten Desinfektionsmittel und verteilt sich als Gas gleichmäßig bis in unzugängliche Bereiche. Es zerstört zuverlässig die Zellwände von Mikroorganismen. Ca. 30 Minuten Einwirkzeit, danach etwa 30 Minuten sorgfältiges Ablüften.',
  },
  {
    id: 'heissvernebelung',
    label: 'Heißvernebelung (KC-Refresher)',
    preis: '59,00 €',
    beschreibung:
      'Der KC-Refresher bekämpft Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Die Wirksamkeit gegenüber Bakterien und Schimmel wurde vom Institut für Biochemie der Universität Mannheim bestätigt.',
  },
];

/** Solange Platzhalter dabei sind, zeigt das Formular einen Hinweis darauf. */
export const enthaeltDummies = zusatzleistungen.some((leistung) => leistung.istDummy);

/** Sichtbarer Grund, wenn dieselbe Versiegelung schon als Leistung gewaehlt ist (6.6). */
export const SCHON_ALS_LEISTUNG = 'Bereits als gewünschte Leistung gewählt';

/**
 * Grund, warum eine Zusatzleistung bei dieser Auswahl gesperrt ist — oder `null`, wenn sie waehlbar ist.
 * `gewaehlteLeistung` = Wert des Feldes „Gewuenschte Leistung“, `gewaehlteZusaetze` = angehakte Zusatzleistungen.
 * Zuerst: Ist sie selbst die gewaehlte Leistung (6.6), waere das Kaestchen dieselbe Leistung ein zweites Mal.
 */
export const sperrgrund = (
  leistung: Zusatzleistung,
  gewaehlteLeistung: string,
  gewaehlteZusaetze: string[]
): string | null =>
  leistung.id === gewaehlteLeistung
    ? SCHON_ALS_LEISTUNG
    : leistung.nichtMit?.find((regel) => regel.mit === gewaehlteLeistung || gewaehlteZusaetze.includes(regel.mit))?.grund ?? null;

/**
 * Gewaehlte Zusatzleistungen ohne die, die zur Auswahl nicht (mehr) passen — in Waehlreihenfolge:
 * Was zuerst angehakt war, bleibt. Laeuft beim Wechsel der Leistung und beim Anhaken, damit nie eine
 * gesperrte Zusatzleistung unsichtbar mitgeschickt wird.
 */
export const bereinigteZusaetze = (gewaehlteLeistung: string, gewaehlteZusaetze: string[]): string[] =>
  gewaehlteZusaetze.reduce<string[]>((behalten, id) => {
    const leistung = zusatzleistungen.find((z) => z.id === id);
    if (leistung && !sperrgrund(leistung, gewaehlteLeistung, behalten)) behalten.push(id);
    return behalten;
  }, []);
