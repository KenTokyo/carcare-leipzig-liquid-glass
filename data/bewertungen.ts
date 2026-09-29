/**
 * Google-Bewertungen, STATISCH eingebunden (Backlog 6.22, Meeting 2026-09-28; Andrés Mail: „Bewertungen … analog
 * Google"). Kein Widget, kein kostenpflichtiges Plugin, keine Verbindung zu Google beim Seitenaufruf — nur Text.
 *
 * GESAMTWERTUNG: am Profil abgelesen (Browser, Cookies abgelehnt). Sie veraltet — beim Nachtragen neuer Bewertungen
 * Wert, Anzahl und `stand` mit ablesen. Verteilung am 2026-09-28: 201 × 5, 20 × 4, 2 × 3, 3 × 2, 10 × 1 Stern.
 *
 * AUSWAHL: liefert der User bzw. André (Meeting: „OALAB (Auswahl) · André (ok)"). Bewusst NICHT von uns aus dem
 * Profil abgeschrieben: Die Texte gehören ihren Verfassern, und welche auf der Seite stehen, entscheidet der Betrieb.
 * Solange die Liste leer ist, zeigt die Seite nur Gesamtwertung, Profil-Link und Hinweis — keine Platzhalter.
 *
 * NAME wie bei Google angezeigt, gekürzt auf Vorname und Initial („Thomas K."), dazu Monat und Jahr. Text WÖRTLICH,
 * Kürzungen mit „[…]" kennzeichnen.
 *
 * KEIN `AggregateRating`-SCHEMA: Google wertet Bewertungen, die ein Unternehmen über sich selbst auszeichnet
 * („self-serving reviews"), nicht als Rich Result — und eine abgelesene Zahl im Markup veraltet unbemerkt.
 */
export interface GoogleBewertung {
  /** Wie bei Google angezeigt, gekürzt auf Vorname und Initial. */
  name: string;
  sterne: 1 | 2 | 3 | 4 | 5;
  /** Monat und Jahr, z. B. „August 2026". */
  datum: string;
  /** Wörtlich, Kürzungen mit „[…]". */
  text: string;
}

/** Dauerhafter Link auf das Unternehmensprofil (CID); geprüft am 2026-09-28, führt zu „CarCare-Center". */
export const GOOGLE_PROFIL = 'https://maps.google.com/?cid=685208164420957348';

export const GESAMTWERTUNG = { sterne: 4.7, anzahl: 236, stand: 'September 2026' } as const;

/** Ausgewählte Bewertungen — Auswahl ausstehend (6.22). */
export const bewertungen: GoogleBewertung[] = [];
