/**
 * Zusatzleistungen der Aufbereitung — EINE QUELLE fuer Formular, Preiskacheln, Schema und Mail.
 *
 * STAND 2026-09-28 (Backlog 5.20, Mail von Andre vom selben Tag): Die Platzhalter „Zusatzleistung
 * 1/2“ (1.18, 2.26) sind durch die echte Liste ersetzt. Preise aus der Mail: Felgenintensivreinigung,
 * Cabrio-Verdeckimpraegnierung, Motorreinigung, Keramik-, Nano- und Frontscheibenversiegelung; Ozon
 * und Heissvernebelung standen schon mit Preis auf der Seite.
 *
 * WER LIEST HIER:
 *  - `data/zusatzregeln.ts` — wertet `buchbar` und `nichtMit` aus: Sperren und Gruende fuer Formular, Server, Kacheln, FAQ
 *  - `components/formulare/TerminFelder.tsx` — ein Kaestchen je Eintrag, mit Preis
 *  - `data/detailing.ts` — die Preiskacheln auf `/fahrzeugaufbereitung-leipzig`, Aussen- und Innenseite
 *  - `data/anfrageSchema.ts` — Klartext mit Preis in der Mail
 *  - `scripts/check-dummies.mjs` — fuehrt die Datei direkt aus. Deshalb KEINE Laufzeit-Importe hier.
 *
 * TEXTE: Andre liefert noch saubere Beschreibungen der Aufbereitungsleistungen. Bis dahin stehen hier
 * Kacheltexte von OALAB, die nur behaupten, was die Seite schon belegt (Keramik braucht einen gereinigten
 * und polierten Lack, Keramik und Nano sind Alternativen, die Motorreinigung steckt in der Premiumpflege).
 * Keine Haltbarkeitsangaben, keine Produktnamen — die kommen, wenn der Betrieb sie nennt. Wozu eine Zusatzleistung
 * buchbar ist, steht NICHT im Kacheltext: Die Zeile „… buchbar.“ darunter kommt aus `buchbar` (`data/zusatzregeln.ts`).
 *
 * BUCHBAR (Backlog 6.7, Andres Mail, vom User am 2026-10-02 weitergegeben): Andres Tabelle als Daten, je Eintrag
 * `einzeln` (auch ohne Paket, im Formular „Nur Zusatzleistungen“) und `zu` (Leistungen aus `data/leistungsauswahl.ts`,
 * zu denen sie passt, oder 'alle'). Andres Wortlaut steht am Eintrag. Ausgewertet wird in `data/zusatzregeln.ts`, weil
 * die sichtbaren Gruende die Paketnamen brauchen — und die darf diese Datei nicht importieren.
 *
 * AUSSCHLUESSE (`nichtMit`): gegenseitige Sperren und Sonderfaelle mit eigenem Grund. Sie gehen `buchbar` vor:
 * „In der Premiumpflege enthalten“ sagt dem Kunden mehr als die allgemeine Einschraenkung.
 *
 * Ist eine Zusatzleistung bei der gewaehlten Leistung nicht buchbar, ist ihr Kaestchen gesperrt und nennt den Grund;
 * eine schon gewaehlte faellt dabei heraus, und das Formular sagt, welche (`RequestForm`).
 *
 * ⚠️ VON HAND FORMULIERT — bei einer Regelaenderung hier mitpruefen: Brillant Außenpflege in `data/detailing.ts`
 * (Keramik/Nano „zu diesem Paket oder zur Lackaufbereitung“), FAQ der Innenaufbereitung „motorreinigung“ und „geruch“
 * in `data/faqs.ts`, Abschnitt `#optional` auf `/innenaufbereitung-leipzig`. Kachelzeilen, die FAQ „einzeln buchen“
 * und die Einleitungen zu Keramik/Nano leitet `data/zusatzregeln.ts` ab, die passen sich von selbst an.
 *
 * PREISE: Anzeige inkl. Waehrung wie auf den Paketkarten („ab 849,00 €“). Das Schema liest den Betrag
 * daraus ab (`data/detailing.ts`), es gibt keine zweite Schreibweise. Keramik und Nano sind seit dem
 * Meeting vom 2026-09-28 „ab“-Preise (Backlog 6.17, Andre: „auch die Keramik ist ab“).
 *
 * AUCH ALS „GEWUENSCHTE LEISTUNG“ (`auchAlsLeistung`, Backlog 6.6): Keramik-, Nano- und Frontscheibenversiegelung
 * waren vom 28.09. bis 02.10. auch als Leistung waehlbar, ihr Kaestchen war dann gesperrt. Mit Andres Regeln (6.7) fiel
 * das weg. Seit 2026-10-03 sind Keramik und Nano wieder Leistungen (User: „Immer wenn einer der Beiden ausgewaehlt
 * wird, muss es auch automatisch in der Box der Zusatzleistungen ausgewaehlt sein“). Ihr Kaestchen ist jetzt FEST
 * ANGEHAKT. Andres Regel gilt weiter: Das Paket dazu (Brillant oder Lack) klaert die Werkstatt, Formular und Mail
 * sagen das (`data/zusatzregeln.ts`). Die Frontscheibenversiegelung bleibt nur Zusatzleistung („Nur Zusatzleistungen“).
 */

export interface Ausschluss {
  /** ID aus `data/leistungsauswahl.ts` (gewaehlte Leistung) oder aus dieser Liste (gewaehlte Zusatzleistung). */
  mit: string;
  /** Sichtbarer Grund am gesperrten Kaestchen. */
  grund: string;
}

export interface Buchbarkeit {
  /** Auch ohne Paket buchbar („allein“ in Andres Liste): Leistung „Nur Zusatzleistungen“ oder „Sonstiges“. */
  einzeln: boolean;
  /** Leistungen (IDs aus `data/leistungsauswahl.ts`), zu denen sie gebucht werden kann, oder 'alle'. */
  zu: 'alle' | string[];
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
  /** Wozu buchbar (6.7). */
  buchbar: Buchbarkeit;
  /** Wann das Kaestchen zusaetzlich gesperrt ist, mit eigenem Grund. */
  nichtMit?: Ausschluss[];
  /**
   * Steht mit derselben ID auch unter „Gewuenschte Leistung“ (6.6, seit 2026-10-03 Keramik und Nano). Als Leistung
   * gewaehlt, ist ihr Kaestchen fest angehakt. Die Option baut `data/leistungsauswahl.ts` aus diesem Eintrag.
   */
  auchAlsLeistung?: boolean;
  /** Platzhalter bis zur Zulieferung — steuert den Hinweis im Formular und `check-dummies`. */
  istDummy?: boolean;
}

const EINE_VERSIEGELUNG = 'Entweder Keramik- oder Nanoversiegelung';
/** „buchbar allein oder zu allen Programmen/Paketen“ */
const UEBERALL: Buchbarkeit = { einzeln: true, zu: 'alle' };
/** „buchbar nur in Kombination mit Brillant oder Lackaufbereitung“ */
const NUR_ZU_BRILLANT_ODER_LACK: Buchbarkeit = { einzeln: false, zu: ['aussen', 'lack'] };

export const zusatzleistungen: Zusatzleistung[] = [
  {
    id: 'keramik',
    label: 'Keramikversiegelung',
    preis: 'ab 849,00 €',
    // Backlog 6.18 (Meeting 2026-09-28): vereinbart ist die EMPFEHLUNG, jaehrlich aufzufrischen — ausdruecklich
    // keine Haltbarkeitsangabe (Andre: sie haelt „maximal ein Jahr“, das soll so nicht auf der Seite stehen).
    // „etwa nach der Brillant Außenpflege“ am 2026-10-02 entfallen: Seit 6.7 nennt die Zeile „… buchbar.“ beide Pakete.
    beschreibung:
      'Die Keramikversiegelung bildet eine harte, glänzende Schutzschicht auf dem Lack. Wasser perlt ab, Schmutz haftet schlechter, und die Wäsche wird leichter. Voraussetzung ist ein gereinigter und polierter Lack. Wir empfehlen, die Versiegelung jährlich auffrischen zu lassen.',
    // Andre: „Buchbar nur in Kombination mit Brillant oder Lackaufbereitung“
    buchbar: NUR_ZU_BRILLANT_ODER_LACK,
    nichtMit: [{ mit: 'nano', grund: EINE_VERSIEGELUNG }],
    auchAlsLeistung: true,
  },
  {
    id: 'nano',
    label: 'Nanoversiegelung',
    preis: 'ab 299,00 €',
    beschreibung:
      'Die Nanoversiegelung schützt den Lack mit einer hauchdünnen, wasserabweisenden Schicht. Regen perlt ab, Schmutz lässt sich leichter abwaschen, und der Glanz bleibt länger erhalten. Sie ist die preiswertere Alternative zur Keramikversiegelung.',
    // Andre: „buchbar nur in Verbindung mit Brillant oder Lackaufbereitung“
    buchbar: NUR_ZU_BRILLANT_ODER_LACK,
    nichtMit: [{ mit: 'keramik', grund: EINE_VERSIEGELUNG }],
    auchAlsLeistung: true,
  },
  {
    id: 'frontscheibe',
    label: 'Frontscheibenversiegelung',
    preis: '89,00 €',
    // Andre, 2026-10-05: „Eis haftet weniger an“ ergaenzt.
    beschreibung:
      'Wir versiegeln die Frontscheibe wasserabweisend. Bei Regen perlt das Wasser während der Fahrt ab und die Sicht bleibt klarer. Eis haftet weniger an, und Insekten und Schmutz lassen sich leichter entfernen.',
    // Andre: „buchbar allein oder zu allen Paketen“
    buchbar: UEBERALL,
  },
  {
    id: 'felgen',
    label: 'Felgenintensivreinigung',
    preis: '95,20 €',
    beschreibung:
      'Gründlicher als die Felgenreinigung der Brillant Außenpflege: Wir lösen festsitzenden Bremsstaub und Ablagerungen, auch in den Zwischenräumen der Felgen.',
    // Andre: „buchbar allein oder zu allen Paketen“ — auch zur Premiumpflege. Im Meeting (6.7) klang es anders
    // („wuerdest du dir an der Stelle eigentlich auch nicht waehlen“); die Mail ist neuer und ausdruecklich.
    buchbar: UEBERALL,
  },
  {
    id: 'cabrio',
    label: 'Cabrio-Verdeckimprägnierung',
    preis: '99,00 €',
    beschreibung:
      'Wir imprägnieren das Stoffverdeck Ihres Cabrios. Wasser perlt ab, und das Gewebe ist besser vor Nässe und Verschmutzung geschützt.',
    // Andre: „buchbar allein oder zu allen Programmen“
    buchbar: UEBERALL,
  },
  {
    id: 'motor',
    label: 'Motorreinigung',
    preis: '49,00 €',
    // Bis 2026-10-02: „…, zu den übrigen Paketen buchen Sie sie einzeln dazu.“ Das stimmt seit 6.7 nicht mehr
    // (nicht zur Premiumpflege „exklusiv“ und zur Leasingrückgabe), die Zeile „… buchbar.“ sagt es jetzt genau.
    // Andre, 2026-10-05: „Wir reinigen den Motorraum und versiegeln diesen mit einer wasserlöslichen Schutzschicht“.
    beschreibung:
      'Wir reinigen den Motorraum und versiegeln ihn mit einer wasserlöslichen Schutzschicht. In der Premiumpflege ist die Motorreinigung bereits enthalten.',
    // Andre: „buchbar allein oder mit Intensiv Innenraumreinigung/Brillant Außenpflege/Lackaufbereitung“.
    // Premiumpflege „exklusiv“ und Leasingrueckgabe nennt er nicht → gesperrt, Rueckfrage an Andre (6.7).
    buchbar: { einzeln: true, zu: ['innen', 'aussen', 'lack'] },
    // Traegt der Seitentext: Premiumpflege „inklusive Motorreinigung“ (data/detailing.ts, FAQ Innenaufbereitung).
    nichtMit: [{ mit: 'komplett', grund: 'In der Premiumpflege enthalten' }],
  },
  {
    // Wortlaut unveraendert von der Seite uebernommen (vorher `disinfectionServices` in data/detailing.ts).
    id: 'ozon',
    label: 'Ozonbehandlung',
    preis: '45,00 €',
    beschreibung:
      'Ozon ist eines der stärksten Desinfektionsmittel und verteilt sich als Gas gleichmäßig bis in unzugängliche Bereiche. Es zerstört zuverlässig die Zellwände von Mikroorganismen. Rund 30 Minuten Einwirkzeit, danach etwa 30 Minuten sorgfältiges Ablüften.',
    // Andre: „buchbar allein oder zu allen Programmen“
    buchbar: UEBERALL,
  },
  {
    id: 'heissvernebelung',
    label: 'Heißvernebelung (KC-Refresher)',
    preis: '59,00 €',
    beschreibung:
      'Der KC-Refresher bekämpft Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Laut Hersteller Koch-Chemie hat das Institut für Biochemie der Universität Mannheim die Wirksamkeit gegenüber Bakterien und Schimmel bestätigt.',
    // Andre: „buchbar allein oder zu allen Programmen“
    buchbar: UEBERALL,
  },
];

/** Solange Platzhalter dabei sind, zeigt das Formular einen Hinweis darauf. */
export const enthaeltDummies = zusatzleistungen.some((leistung) => leistung.istDummy);
