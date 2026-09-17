/**
 * Zusatzleistungen fuer das Aufbereitungsformular (Backlog 1.18).
 *
 * EINE QUELLE, EIN ORT. Wer eine Zusatzleistung ergaenzt, schreibt hier eine Zeile —
 * Formular, Zuruecksetzen und spaeter der Versand lesen alle von hier. Es gibt bewusst
 * keine zweite Liste im Markup: Genau daran ist die Leistungsuebersicht schon einmal
 * auseinandergelaufen (siehe `data/services.ts`).
 *
 * ⚠️ DIE BEIDEN EINTRAEGE SIND PLATZHALTER, keine Angebote. Die echte Liste liefert
 * Andre (Backlog 1.18 / 2.26). Sie sind absichtlich als Dummy erkennbar benannt und
 * tragen `istDummy: true` — daran haengt der sichtbare Hinweis im Formular. Wer die
 * echte Liste einpflegt, entfernt das Feld einfach mit; der Hinweis verschwindet dann
 * von selbst, ohne dass jemand daran denken muss.
 *
 * WARUM MEHRFACHAUSWAHL UND NICHT EIN ZWEITES AUSWAHLFELD: „Zusatzleistungen" sind
 * ihrer Natur nach mehrere. Ein `<select>` erzwaenge eine Entscheidung, die es nicht
 * gibt, und ein Mehrfach-`<select>` bedient sich auf Beruehrgeraeten schlecht.
 *
 * ✅ PREISE ENTSCHIEDEN (Backlog 3.35, 2026-09-16): Zusatzleistungen WERDEN bepreist —
 * mit Festpreis, wo es einen gibt, sonst mit „Preis nach Absprache". Beim Einpflegen der
 * Liste (2.26) und bei der Ausweisung auf der Seite (2.11) also je Eintrag einen Preis
 * oder diesen Wortlaut vorsehen. Schema wie bei den Paketen: ohne Festpreis KEINE
 * Preisfelder (`offerCatalogSchema` in `seo/structuredData.ts`).
 *
 * ⚠️ BEIM EINPFLEGEN DER ECHTEN LISTE ZU KLAEREN: Das Formular hat bereits ein Feld
 * „Gewuenschte Leistung" — seit 2026-09-16 mit den Paketnamen (Backlog 4.21):
 * Intensiv Innenraumreinigung, Brillant Aussenpflege, Premiumpflege, Premiumpflege
 * „exklusiv", Lackaufbereitung, Leasingrueckgabe, Verkaufsaufbereitung. Was davon Paket
 * ist und was Zusatz, muss sauber getrennt werden — sonst steht dieselbe Leistung zweimal
 * zur Auswahl.
 */

export interface Zusatzleistung {
  /** Stabiler Schluessel. Geht spaeter so in den Versand — nicht nachtraeglich umbenennen. */
  id: string;
  /** Beschriftung am Kontrollkaestchen. */
  label: string;
  /** Eine Zeile Erlaeuterung darunter. Leer lassen ist erlaubt. */
  hinweis?: string;
  /** Platzhalter bis zur Zulieferung. Steuert den Hinweistext im Formular. */
  istDummy?: boolean;
}

export const zusatzleistungen: Zusatzleistung[] = [
  {
    id: 'zusatz-1',
    label: 'Zusatzleistung 1',
    hinweis: 'Platzhalter — wird durch die abgestimmte Leistung ersetzt.',
    istDummy: true,
  },
  {
    id: 'zusatz-2',
    label: 'Zusatzleistung 2',
    hinweis: 'Platzhalter — wird durch die abgestimmte Leistung ersetzt.',
    istDummy: true,
  },
];

/** Solange Platzhalter dabei sind, zeigt das Formular einen Hinweis darauf. */
export const enthaeltDummies = zusatzleistungen.some((leistung) => leistung.istDummy);
