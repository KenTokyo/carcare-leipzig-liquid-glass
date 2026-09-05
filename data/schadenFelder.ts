/**
 * Felder der Schadenmeldung (Backlog 3.36).
 *
 * ⚠️ STREICHEN IST EIN EINTRAG HIER, KEIN UMBAU. `SchadenFelder.tsx` rendert
 * ausschliesslich aus dieser Liste; im Markup steht kein einziges Feld fest verdrahtet.
 * Wer ein Feld herausnimmt, loescht einen Eintrag — Reihenfolge, Breite, Bedingungen und
 * die Beschriftung in der E-Mail folgen automatisch.
 *
 * Zum Streichen gedacht: `docs/formulare/schadenmeldung-felder-fuer-andre.md`.
 * Andre weiss, welche Frage am Telefon nie beantwortet wird — 12 sichtbare Felder sind
 * viel fuer jemanden, der gerade einen Unfall hatte.
 *
 * DER MASSSTAB DER AUSWAHL: Ein Serviceberater soll OHNE Rueckruf antworten koennen —
 * mit einem Kostenvoranschlagstermin oder direkt mit einem Reparaturtermin. Alles, was
 * diese Schwelle nicht senkt, gehoert nicht ins Formular.
 *
 * DIE GABELUNG IST `kostentraeger`, NICHT DIE FORMULARVARIANTE. Unfallschaden mit
 * Versicherung und Reparatur auf eigene Rechnung sind derselbe Vorgang mit
 * unterschiedlicher Kostenfrage. Ein zweites Formular waere genau das Auseinanderlaufen,
 * das bei der Reparaturformular-Frage abgelehnt wurde — und die Faelle sind beim
 * Einstieg gar nicht trennbar: Wer gerade einen Unfall hatte, weiss oft nicht, ob die
 * Gegenseite zahlt. Deshalb eine Frage, die er beantworten kann, inklusive „noch unklar".
 *
 * FRUEHER STAND HIER „Versicherung vorhanden? ja/nein/unklar". Das war die falsche
 * Frage: Jeder hat eine Versicherung — die Frage ist, wer DIESEN Schaden zahlt.
 */

export type FeldTyp = 'text' | 'tel' | 'email' | 'date' | 'select' | 'textarea';

export interface SchadenFeld {
  /** Feldname. Geht so in die E-Mail und in die Pruefung — nicht nachtraeglich umbenennen. */
  id: string;
  label: string;
  typ: FeldTyp;
  pflicht?: boolean;
  platzhalter?: string;
  /** Eine Zeile unter dem Feld. Fuer alles, was sonst im Freitext landen wuerde. */
  hinweis?: string;
  optionen?: { id: string; label: string }[];
  /** Nur zeigen, wenn `feld` einen dieser Werte hat. Leert sich selbst, wenn es verschwindet. */
  nurWenn?: { feld: string; werte: string[] };
  /** `halb` steht im Zweispalter, `voll` ueber die ganze Breite. */
  breite?: 'halb' | 'voll';
}

/** Werte des Kostentraegers, bei denen die Versicherungsangaben erscheinen. */
export const MIT_VERSICHERUNG = ['haftpflicht', 'kasko'];

export const schadenFelder: SchadenFeld[] = [
  // ------------------------------------------------------------- Kontakt ----
  { id: 'name', label: 'Name', typ: 'text', pflicht: true, platzhalter: 'Max Mustermann', breite: 'halb' },
  { id: 'phone', label: 'Telefon', typ: 'tel', pflicht: true, platzhalter: '0341 - ...', breite: 'halb' },
  { id: 'email', label: 'E-Mail', typ: 'email', pflicht: true, platzhalter: 'name@beispiel.de', breite: 'halb' },

  // ------------------------------------------------------------ Fahrzeug ----
  { id: 'vehicle', label: 'Fahrzeug', typ: 'text', platzhalter: 'Marke / Modell', breite: 'halb' },
  {
    id: 'baujahr',
    label: 'Erstzulassung',
    typ: 'text',
    platzhalter: 'z. B. 2019',
    hinweis: 'Bestimmt Ersatzteilpreise und Lackaufbau.',
    breite: 'halb',
  },
  {
    id: 'kennzeichen',
    label: 'Kennzeichen',
    typ: 'text',
    platzhalter: 'L-CC 1234',
    // Freiwillig und ausdruecklich begruendet: Es ist ein personenbezogenes Datum, und
    // wer es nicht angeben will, soll das Formular trotzdem abschicken koennen.
    hinweis: 'Freiwillig. Hilft uns, das Fahrzeug und einen laufenden Vorgang zuzuordnen.',
    breite: 'halb',
  },

  // -------------------------------------------------------------- Schaden ---
  {
    id: 'incident',
    label: 'Schadenart',
    typ: 'select',
    breite: 'halb',
    optionen: [
      { id: 'unfall', label: 'Unfallschaden' },
      { id: 'hagel', label: 'Hagelschaden' },
      { id: 'lack', label: 'Lackschaden' },
      { id: 'glas', label: 'Glasschaden' },
      // Neu mit 3.36: Bisher fielen Dellen und Felgen unter „Sonstiges", obwohl beide
      // eigene Leistungsseiten haben und von dort verlinkt werden.
      { id: 'delle', label: 'Delle / Beule' },
      { id: 'felge', label: 'Felgenschaden' },
      { id: 'sonstiges', label: 'Sonstiges' },
    ],
  },
  {
    id: 'fahrbereit',
    label: 'Fahrzeug fahrbereit?',
    typ: 'select',
    breite: 'halb',
    hinweis: 'Entscheidet, ob wir abholen müssen.',
    optionen: [
      { id: 'ja', label: 'Ja, uneingeschränkt' },
      { id: 'eingeschraenkt', label: 'Eingeschränkt fahrbar' },
      { id: 'nein', label: 'Nein, nicht fahrbereit' },
    ],
  },

  // ------------------------------------------------- Kostentraeger (Gabel) --
  {
    id: 'kostentraeger',
    label: 'Wer trägt die Kosten?',
    typ: 'select',
    breite: 'halb',
    optionen: [
      { id: 'haftpflicht', label: 'Haftpflicht der Gegenseite' },
      { id: 'kasko', label: 'Meine Kaskoversicherung' },
      { id: 'selbst', label: 'Ich selbst' },
      { id: 'unklar', label: 'Noch unklar' },
    ],
  },
  {
    id: 'versicherung',
    label: 'Versicherung',
    typ: 'text',
    platzhalter: 'Name der Versicherung',
    breite: 'halb',
    nurWenn: { feld: 'kostentraeger', werte: MIT_VERSICHERUNG },
  },
  {
    id: 'schadennummer',
    label: 'Schaden-/Vorgangsnummer',
    typ: 'text',
    platzhalter: 'falls bereits vergeben',
    breite: 'halb',
    nurWenn: { feld: 'kostentraeger', werte: MIT_VERSICHERUNG },
  },
  {
    id: 'schadendatum',
    label: 'Schadendatum',
    typ: 'date',
    breite: 'halb',
    nurWenn: { feld: 'kostentraeger', werte: MIT_VERSICHERUNG },
  },
  {
    id: 'gutachter',
    label: 'Gutachter beauftragt?',
    typ: 'select',
    breite: 'halb',
    nurWenn: { feld: 'kostentraeger', werte: MIT_VERSICHERUNG },
    optionen: [
      { id: 'ja', label: 'Ja' },
      { id: 'nein', label: 'Nein' },
      { id: 'unklar', label: 'Weiß ich nicht' },
    ],
  },

  // --------------------------------------------------------------- Ablauf ---
  {
    id: 'wunsch',
    label: 'Was wünschen Sie?',
    typ: 'select',
    breite: 'halb',
    optionen: [
      { id: 'kostenvoranschlag', label: 'Kostenvoranschlag' },
      { id: 'termin', label: 'Reparaturtermin' },
      { id: 'beratung', label: 'Erst einmal Beratung' },
    ],
  },
  {
    id: 'ersatzfahrzeug',
    label: 'Ersatzfahrzeug gewünscht?',
    typ: 'select',
    breite: 'halb',
    optionen: [
      { id: 'ja', label: 'Ja' },
      { id: 'nein', label: 'Nein' },
      { id: 'unklar', label: 'Noch unklar' },
    ],
  },
  {
    id: 'description',
    label: 'Was ist passiert?',
    typ: 'textarea',
    pflicht: true,
    platzhalter: 'Beschreiben Sie kurz den Schaden und welche Bereiche betroffen sind ...',
    breite: 'voll',
  },
];

/** Sichtbare Felder fuer einen gegebenen Formularstand. */
export const sichtbareFelder = (werte: Record<string, string>): SchadenFeld[] =>
  schadenFelder.filter((feld) => !feld.nurWenn || feld.nurWenn.werte.includes(werte[feld.nurWenn.feld] ?? ''));
