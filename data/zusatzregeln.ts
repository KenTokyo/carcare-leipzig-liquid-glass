/**
 * Buchungsregeln der Zusatzleistungen (Backlog 6.7) — die EINE Auswertung fuer Formular, Server, Kacheln und FAQ.
 *
 * Die Regeln selbst stehen als Daten in `data/zusatzleistungen.ts` (`buchbar`, `nichtMit`), dort mit Andres Wortlaut.
 * Diese Datei wertet sie aus und formuliert die sichtbaren Saetze. Sie liegt getrennt, weil sie die Paketnamen aus
 * `data/leistungsauswahl.ts` braucht und `zusatzleistungen.ts` keine Laufzeit-Importe haben darf (`check-dummies`).
 *
 * WER LIEST HIER:
 *  - `components/formulare/TerminFelder.tsx` — Sperre mit Grund, Hinweis vor der Wahl
 *  - `components/RequestForm.tsx` — was beim Wechsel der Leistung herausfaellt, und warum
 *  - `api/anfrage.ts` — verbindlich dieselbe Regel; ein umgangenes Formular schickt sonst Unvereinbares
 *  - `data/anfrageSchema.ts` — „Paket offen: …“ hinter einer Versiegelung als Leistung in der Mail (`paketOffen`)
 *  - `data/detailing.ts` — Zeile „… buchbar.“ auf den Kacheln · `data/faqs.ts` — FAQ „einzeln buchen“, Aussen-FAQ „keramik“
 *  - `pages/VehicleDetailingPage.tsx`, `pages/AussenaufbereitungPage.tsx` — Einleitung der Zusatzleistungen (`regelSaetze`)
 *
 * VIER ZUSTAENDE EINES KAESTCHENS:
 *  1. Noch keine Leistung gewaehlt: waehlbar; eingeschraenkte Zusatzleistungen nennen ihre Bedingung als Hinweis.
 *     Gesperrt waere hier falsch: Welches Paket passt, entscheidet der Kunde noch.
 *  2. Leistung passt: waehlbar, ohne Hinweis.
 *  3. Leistung passt nicht: gesperrt, derselbe Satz als Grund. Eine schon gewaehlte faellt heraus.
 *  4. Als Leistung gewaehlt (Keramik, Nano; 6.6, seit 2026-10-03): fest angehakt, nicht abwaehlbar. Andres Regel bleibt:
 *     Das Paket dazu (Brillant oder Lack) ist offen, `paketHinweis` sagt es unter der Auswahl und `paketOffen` in der
 *     Mail. Weitere Zusatzleistungen sind erlaubt, wenn sie zu JEDEM dieser Pakete passen, denn welches es wird, legt
 *     erst die Werkstatt fest. Wechselt der Kunde danach auf das Paket, bleibt die Versiegelung angehakt.
 *
 * ⚠️ PRUEFUNG BEIM LADEN: Unbekannte IDs in `zu` oder `nichtMit`, etwas anderes als ein Paket in `zu` und eine ID, die
 * ohne `auchAlsLeistung` zugleich Leistung und Zusatzleistung ist, werfen hier. Das Modul laeuft im Prerender, also
 * bricht der Build. Eine Regel mit Tippfehler saehe sonst aus wie eine gewollte Sperre — und niemand wuerde sie suchen.
 * WAS DIESE PRUEFUNG NICHT SIEHT (Pflichtfrage aus CLAUDE.md): ob die Regeln Andres Mail entsprechen. Das belegt nur
 * der Abgleich mit seiner Tabelle (`docs/backlog/tasks/2026-10-02-stimmen-und-zusatzregeln-tasks.md`) und der
 * Funktionstest, der jede Zusatzleistung gegen jede Leistung im Browser prueft.
 */
import { NUR_ZUSATZ, terminLeistungen } from './leistungsauswahl.js';
import { zusatzleistungen, type Zusatzleistung } from './zusatzleistungen.js';

const leistungsName = new Map(terminLeistungen.map((l) => [l.id, l.label]));
const OHNE_PAKET = new Set(terminLeistungen.filter((l) => l.ohnePaket).map((l) => l.id));
/** Leistungen, die eine Zusatzleistung mit derselben ID sind (Keramik, Nano — `auchAlsLeistung`). */
const ALS_LEISTUNG = new Set(terminLeistungen.filter((l) => l.zusatzleistung).map((l) => l.id));
/** Die Pakete: weder „ohne Paket“ noch eine Zusatzleistung als Leistung. */
const PAKETE = terminLeistungen.filter((l) => !l.ohnePaket && !l.zusatzleistung).map((l) => l.id);

/** Ist diese Leistung eine Zusatzleistung (Keramik, Nano)? Dann klappt das Formular die Liste auf. */
export const istZusatzAlsLeistung = (leistung: string): boolean => ALS_LEISTUNG.has(leistung);

/** Zustand 4 (Kopf): Die Zusatzleistung ist selbst die gewaehlte Leistung — fest angehakt. */
export const festAngehakt = (z: Zusatzleistung, leistung: string): boolean => z.id === leistung && ALS_LEISTUNG.has(leistung);

/** Die Zusatzleistung, die `leistung` selbst ist, oder `undefined`. */
const alsZusatz = (leistung: string): Zusatzleistung | undefined =>
  ALS_LEISTUNG.has(leistung) ? zusatzleistungen.find((z) => z.id === leistung) : undefined;

/** „A, B oder C“ bzw. „A, B und C“. */
const aufzaehlung = (teile: string[], bindewort: 'oder' | 'und') =>
  teile.length < 2 ? teile.join('') : `${teile.slice(0, -1).join(', ')} ${bindewort} ${teile[teile.length - 1]}`;

/**
 * Die Einschraenkung als Satzteil — oder `null`, wenn die Zusatzleistung zu allem passt. Derselbe Wortlaut steht als
 * Grund am gesperrten Kaestchen, als Hinweis vor der Wahl und (mit „buchbar“) auf der Kachel. Die Paketnamen kommen
 * aus der Auswahlliste, damit Formular und Grund dieselben Woerter benutzen.
 */
export const regelText = (z: Zusatzleistung): string | null => {
  const { einzeln, zu } = z.buchbar;
  if (zu === 'alle') return einzeln ? null : 'Nur zusammen mit einem Paket';
  const pakete = aufzaehlung(zu.map((id) => leistungsName.get(id) ?? id), 'oder');
  return einzeln ? `Nur einzeln oder zusammen mit ${pakete}` : `Nur zusammen mit ${pakete}`;
};

/** Zeile auf der Preiskachel, z. B. „Einzeln oder zu jedem Paket buchbar.“ */
export const buchbarText = (z: Zusatzleistung): string => {
  const regel = regelText(z);
  return regel ? `${regel} buchbar.` : 'Einzeln oder zu jedem Paket buchbar.';
};

/**
 * Grund, warum eine Zusatzleistung bei dieser Auswahl gesperrt ist — oder `null`, wenn sie waehlbar ist.
 * `leistung` = Wert des Feldes „Gewuenschte Leistung“ ('' = noch keine), `zusaetze` = angehakte Zusatzleistungen.
 * Zuerst die Ausschluesse mit eigenem Grund („In der Premiumpflege enthalten“), dann die Buchbarkeit.
 */
export const sperrgrund = (z: Zusatzleistung, leistung: string, zusaetze: string[]): string | null => {
  if (festAngehakt(z, leistung)) return null;
  const ausschluss = z.nichtMit?.find((regel) => regel.mit === leistung || zusaetze.includes(regel.mit));
  if (ausschluss) return ausschluss.grund;
  if (!leistung) return null;
  return passtZu(z, leistung) ? null : regelText(z);
};

/**
 * Ist `z` zu dieser Leistung buchbar? Zu einem Paket laut `zu`, ohne Paket nur mit `einzeln`. Zu einer Zusatzleistung
 * als Leistung (Zustand 4) zu JEDEM Paket, das fuer sie infrage kommt — und allein, falls sie auch allein geht.
 */
const passtZu = (z: Zusatzleistung, leistung: string): boolean => {
  const { einzeln, zu } = z.buchbar;
  const zumPaket = (paket: string) => zu === 'alle' || zu.includes(paket);
  const versiegelung = alsZusatz(leistung);
  if (versiegelung) {
    const { einzeln: auchAllein, zu: ihrePakete } = versiegelung.buchbar;
    return (!auchAllein || einzeln) && (ihrePakete === 'alle' ? PAKETE : ihrePakete).every(zumPaket);
  }
  return OHNE_PAKET.has(leistung) ? einzeln : zumPaket(leistung);
};

/** Hinweis an einem noch waehlbaren Kaestchen, solange keine Leistung gewaehlt ist (Zustand 1 oben). */
export const hinweisVorDerWahl = (z: Zusatzleistung, leistung: string): string | null => (leistung ? null : regelText(z));

/**
 * Gewaehlte Zusatzleistungen ohne die, die zur Auswahl nicht (mehr) passen — in Waehlreihenfolge:
 * Was zuerst angehakt war, bleibt. Laeuft beim Wechsel der Leistung, beim Anhaken und auf dem Server,
 * damit nie eine gesperrte Zusatzleistung unsichtbar mitgeschickt wird.
 * Ist die Leistung selbst eine Zusatzleistung (Zustand 4), steht sie vorn: Sie ist immer dabei (Wunsch des Users,
 * 2026-10-03) und geht damit auch dem Ausschluss Keramik ⟂ Nano vor — die andere Versiegelung faellt heraus.
 */
export const bereinigteZusaetze = (leistung: string, zusaetze: string[]): string[] => {
  const reihenfolge = ALS_LEISTUNG.has(leistung) ? [leistung, ...zusaetze.filter((id) => id !== leistung)] : zusaetze;
  return reihenfolge.reduce<string[]>((behalten, id) => {
    const z = zusatzleistungen.find((eintrag) => eintrag.id === id);
    if (z && !sperrgrund(z, leistung, behalten)) behalten.push(id);
    return behalten;
  }, []);
};

/** Was beim Wechsel auf `leistung` aus `vorher` herausfaellt, mit Name und Grund — fuer den Hinweis im Formular. */
export const abgewaehlteZusaetze = (leistung: string, vorher: string[]): { id: string; label: string; grund: string }[] => {
  const nachher = bereinigteZusaetze(leistung, vorher);
  return vorher.flatMap((id) => {
    const z = zusatzleistungen.find((eintrag) => eintrag.id === id);
    if (!z || nachher.includes(id)) return [];
    return [{ id, label: z.label, grund: sperrgrund(z, leistung, nachher) ?? '' }];
  });
};

/** Meldung, wenn „Nur Zusatzleistungen“ ohne (passende) Zusatzleistung abgeschickt wird — Formular und Server. */
export const FEHLT_ZUSATZLEISTUNG = 'Bitte wählen Sie mindestens eine Zusatzleistung.';

/** „Nur Zusatzleistungen“ gewaehlt, aber keine Zusatzleistung, die dazu buchbar ist? */
export const fehltZusatzleistung = (leistung: string, zusaetze: string[]): boolean =>
  leistung === NUR_ZUSATZ && bereinigteZusaetze(leistung, zusaetze).length === 0;

/**
 * Saetze „{Namen} buchen Sie {Regel}.“, nach gleicher Regel gruppiert, die freiesten zuerst. „Die“ vor einer
 * einzelnen Zusatzleistung: Alle Namen sind weiblich (…ung), die Pruefung unten haelt das fest.
 * `subjekt` (z. B. „Beide“) ersetzt die Namen, wenn alle in EINE Gruppe fallen — fuer Einleitungen, die sie im Satz
 * davor schon genannt haben. Fallen sie auseinander (Andre aendert eine Regel), stehen wieder die Namen da.
 */
const regelSaetzeVon = (liste: Zusatzleistung[], subjekt?: string): string[] => {
  const gruppen = new Map<string, Zusatzleistung[]>();
  for (const z of liste) {
    const regel = regelText(z) ?? '';
    gruppen.set(regel, [...(gruppen.get(regel) ?? []), z]);
  }
  const rang = (gruppe: Zusatzleistung[]) => (gruppe[0].buchbar.einzeln ? 0 : 2) + (gruppe[0].buchbar.zu === 'alle' ? 0 : 1);
  return [...gruppen]
    .sort(([, a], [, b]) => rang(a) - rang(b))
    .map(([regel, gruppe]) => {
      const namen = aufzaehlung(gruppe.map((z) => z.label), 'und');
      const wer = subjekt && gruppen.size === 1 ? subjekt : gruppe.length === 1 ? `Die ${namen}` : namen;
      return `${wer} buchen Sie ${regel ? regel.replace(/^Nur /, 'nur ') : 'einzeln oder zu jedem Paket'}.`;
    });
};

/**
 * Dieselben Saetze fuer ausgewaehlte Zusatzleistungen — fuer Einleitungen und FAQ, die eine Regel im Fliesstext nennen
 * (z. B. Keramik und Nano auf der Uebersicht und der Aussenseite). Abgeleitet statt abgeschrieben: Aendert Andre eine
 * Regel, aendert sich der Satz mit. Eine unbekannte ID wirft (Tippfehler im Seitentext).
 */
export const regelSaetze = (ids: string[], subjekt?: string): string =>
  regelSaetzeVon(
    ids.map((id) => {
      const z = zusatzleistungen.find((eintrag) => eintrag.id === id);
      if (!z) throw new Error(`data/zusatzregeln.ts: regelSaetze kennt „${id}“ nicht`);
      return z;
    }),
    subjekt
  ).join(' ');

/**
 * Antwort der FAQ „Kann ich Zusatzleistungen auch einzeln buchen?“ (`/fahrzeugaufbereitung-leipzig`), aus den Regeln
 * statt abgeschrieben: Aendert Andre eine Regel, aendert sich die Antwort mit (und das `FAQPage`-Markup ebenso).
 */
export const zusatzFaqAntwort = (): string => {
  const nichtEinzeln = zusatzleistungen.filter((z) => !z.buchbar.einzeln).map((z) => z.label);
  const auftakt = nichtEinzeln.length ? `Ja, außer ${aufzaehlung(nichtEinzeln, 'und')}.` : 'Ja.';
  const formular = `Für Zusatzleistungen ohne Paket wählen Sie im Anfrageformular „${leistungsName.get(NUR_ZUSATZ)}“.`;
  return [auftakt, ...regelSaetzeVon(zusatzleistungen), formular].join(' ');
};

/**
 * Hinweis unter „Gewuenschte Leistung“, wenn dort eine Versiegelung steht (Zustand 4) — sonst `null`. Der erste Satz
 * kommt aus der Regel (`regelSaetze`) und lautet wie auf Kachel und FAQ: So bleibt Andres Regel sichtbar, obwohl die
 * Versiegelung als Leistung allein in der Liste steht. Der Kunde erfaehrt hier vom Paket, nicht erst am Telefon.
 */
export const paketHinweis = (leistung: string): string | null => {
  const z = alsZusatz(leistung);
  if (!z || z.buchbar.einzeln) return null;
  return `${regelSaetze([z.id])} Welches Paket Ihr Fahrzeug braucht, klären wir mit Ihnen. Wenn Sie es schon wissen, wählen Sie es hier als Leistung. Die ${z.label} bleibt dann angehakt.`;
};

/** Vermerk hinter einer Versiegelung als Leistung in der Mail: „Paket offen: Brillant Außenpflege oder …“ — oder `null`. */
export const paketOffen = (leistung: string): string | null => {
  const z = alsZusatz(leistung);
  if (!z || z.buchbar.einzeln) return null;
  const { zu } = z.buchbar;
  return zu === 'alle' ? 'Paket offen' : `Paket offen: ${aufzaehlung(zu.map((id) => leistungsName.get(id) ?? id), 'oder')}`;
};

// ------------------------------------------------------------ Pruefung beim Laden (siehe Kopf) ----
const leistungsIds = new Set(terminLeistungen.map((l) => l.id));
const zusatzIds = new Set(zusatzleistungen.map((z) => z.id));
const fehler: string[] = [];
for (const z of zusatzleistungen) {
  // Bis 2026-10-02 in data/anfrageSchema.ts. Leistung und Zusatzleistung teilen sich EINEN Vorauswahlwert (Preiskachel →
  // `startwerte`). Dieselbe ID in beiden Listen ist deshalb nur mit `auchAlsLeistung` erlaubt (6.6, seit 2026-10-03):
  // Dann IST die Leistung diese Zusatzleistung, und die Vorauswahl ergibt beides. Ohne das Merkmal waere sie mehrdeutig.
  if (leistungsIds.has(z.id) && !ALS_LEISTUNG.has(z.id)) fehler.push(`„${z.id}“ ist zugleich Leistung und Zusatzleistung, ohne auchAlsLeistung`);
  if (z.auchAlsLeistung && !ALS_LEISTUNG.has(z.id)) fehler.push(`${z.id}: auchAlsLeistung, aber keine Option in data/leistungsauswahl.ts`);
  if (z.buchbar.zu !== 'alle') {
    for (const id of z.buchbar.zu) {
      if (!leistungsIds.has(id)) fehler.push(`${z.id}: unbekannte Leistung „${id}“ in buchbar.zu`);
      else if (OHNE_PAKET.has(id)) fehler.push(`${z.id}: „${id}“ ist kein Paket, dafuer gibt es buchbar.einzeln`);
      else if (!PAKETE.includes(id)) fehler.push(`${z.id}: „${id}“ in buchbar.zu ist eine Zusatzleistung, kein Paket`);
    }
  }
  for (const regel of z.nichtMit ?? []) {
    if (!leistungsIds.has(regel.mit) && !zusatzIds.has(regel.mit)) fehler.push(`${z.id}: nichtMit „${regel.mit}“ ist unbekannt`);
  }
  if (!/ung( \(.+\))?$/.test(z.label)) fehler.push(`${z.id}: „${z.label}“ endet nicht auf -ung, zusatzFaqAntwort setzt aber „die“ davor`);
}
for (const id of ALS_LEISTUNG) if (!zusatzIds.has(id)) fehler.push(`Leistung „${id}“ ist als Zusatzleistung markiert, die es nicht gibt`);
if (!leistungsIds.has(NUR_ZUSATZ)) fehler.push(`Option „${NUR_ZUSATZ}“ fehlt in data/leistungsauswahl.ts`);
if (fehler.length) throw new Error(`data/zusatzregeln.ts: ${fehler.join(' · ')}`);
