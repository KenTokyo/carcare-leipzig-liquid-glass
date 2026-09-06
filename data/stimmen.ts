/**
 * Mitarbeiterstimmen fuer /karriere — Backlog 3.19 (Inhalte: 1.26).
 *
 * ⚠️ AUSDRUECKLICHE VORGABE AUS DEM REVIEW: **anonymisiert**. Nur Berufsbezeichnung
 * und ein kurzer Kommentar, **keine Namen**. Das ist keine Gestaltungsfrage: Namen von
 * Beschaeftigten auf einer Karriereseite brauchen eine Einwilligung nach Art. 6 DSGVO,
 * die widerrufbar ist — und beim naechsten Personalwechsel steht sie falsch da.
 * Die Berufsbezeichnung allein traegt die Aussage genauso.
 *
 * KEINE LAUFZEIT-IMPORTE: `scripts/check-dummies.mjs` uebersetzt diese Datei einzeln.
 *
 * ⚠️ BEIM NACHLIEFERN: Die Platzhaltertitel stehen in der `ANERKANNT`-Liste von
 * `scripts/check-dummies.mjs`. Sobald `istPlatzhalter` faellt, muss der Eintrag dort
 * mit weg — sonst bricht der Build.
 */

export interface Stimme {
  id: string;
  /** Berufsbezeichnung. Steht anstelle eines Namens. */
  beruf: string;
  /** Wie lange im Betrieb. Optional — erst nennen, wenn belegt. */
  dabeiSeit: string | null;
  /** Der Kommentar selbst, ein bis drei Saetze. */
  aussage: string;
  istPlatzhalter: boolean;
}

export const stimmen: Stimme[] = [
  {
    id: 's1',
    beruf: 'Mitarbeiterstimme 1',
    dabeiSeit: null,
    aussage: 'Platzhalter — wird durch eine echte, anonymisierte Aussage ersetzt (Backlog 1.26).',
    istPlatzhalter: true,
  },
  {
    id: 's2',
    beruf: 'Mitarbeiterstimme 2',
    dabeiSeit: null,
    aussage: 'Platzhalter — wird durch eine echte, anonymisierte Aussage ersetzt (Backlog 1.26).',
    istPlatzhalter: true,
  },
  {
    id: 's3',
    beruf: 'Mitarbeiterstimme 3',
    dabeiSeit: null,
    aussage: 'Platzhalter — wird durch eine echte, anonymisierte Aussage ersetzt (Backlog 1.26).',
    istPlatzhalter: true,
  },
];

/** Zeigt die Sektion ueberhaupt? Ohne echte Stimmen bleibt sie im Review sichtbar. */
export const echteStimmen = stimmen.filter((s) => !s.istPlatzhalter);
