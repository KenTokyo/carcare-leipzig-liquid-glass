/**
 * Globale Suche — reine Logik: Index laden, Text vergleichbar machen, Treffer gewichten,
 * Ausschnitte bilden. Die Oberflaeche steht in `components/SuchDialog.tsx`.
 *
 * WOHER DER INDEX KOMMT: Er entsteht beim Build im Prerender aus dem GERENDERTEN Inhalt jeder
 * Seite (`scripts/lib/suchindex.mjs`) und liegt als `/suchindex.json` neben der Seite. Er wird
 * erst beim ersten Oeffnen der Suche geladen — wer nie sucht, laedt ihn nie.
 * Warum aus dem gerenderten Inhalt und nicht aus den Datenmodulen: Viele Texte stehen nur in den
 * Seitenkomponenten (Ablaeufe, Einleitungen, Kartentexte). „Alles auf der Seite finden" (Wunsch des
 * Users vom 2026-09-24) geht nur ueber das, was tatsaechlich ausgeliefert wird.
 */

/** Ereignis, mit dem Navbar und Tastenkuerzel den Dialog oeffnen (Muster wie `carcare:navigate`). */
export const SUCHE_EREIGNIS = 'carcare:suche';
export const oeffneSuche = (): void => {
  window.dispatchEvent(new Event(SUCHE_EREIGNIS));
};

// ------------------------------------------------------------------ Index ----

/** Abschnitt einer Seite: Ueberschrift, Anker (falls vorhanden) und Text. */
export interface SuchAbschnitt {
  h: string;
  id: string | null;
  x: string;
}
/** Frage und Antwort aus dem FAQPage-JSON-LD der Seite. */
export interface SuchFrage {
  q: string;
  a: string;
}
export interface SuchSeite {
  /** Pfad, z. B. `/unfallinstandsetzung-leipzig`. */
  u: string;
  /** Seitentitel ohne Markenzusatz. */
  t: string;
  /** Meta-Beschreibung. */
  d: string;
  a: SuchAbschnitt[];
  f: SuchFrage[];
  /** Anker der FAQ-Sektion, falls die Seite eine hat. */
  fid: string | null;
}
export interface SuchIndex {
  v: 1;
  stand: string;
  seiten: SuchSeite[];
}

export type TrefferArt = 'seite' | 'abschnitt' | 'frage';

/** Durchsuchbare Einheit, einmal nach dem Laden vorbereitet. */
interface Einheit {
  art: TrefferArt;
  url: string;
  seite: string;
  titel: string;
  text: string;
  /** Vergleichsformen, vorab berechnet: Titel, Seitentitel, alles zusammen. */
  nTitel: string;
  nSeite: string;
  nAlles: string;
  reihenfolge: number;
}

export interface Treffer {
  art: TrefferArt;
  url: string;
  seite: string;
  titel: string;
  text: string;
  punkte: number;
}

// ---------------------------------------------------------- Vergleichsform ----

/**
 * Vergleichsform: klein, „ß" → „ss", Umlaute ohne Punkte („ä" → „a"), alles ausser Buchstaben und
 * Ziffern → Leerzeichen. Aus „Außenaufbereitung" wird „aussenaufbereitung", aus „Schäden"
 * „schaden".
 */
export const normalisiere = (t: string): string =>
  t
    .toLowerCase()
    .replace(/ß/g, 'ss')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // kombinierende Zeichen (Umlautpunkte nach NFD)
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();

/**
 * Suchwoerter mit Varianten. Wer „schaeden" tippt, meint „Schäden" — die Vergleichsform davon ist
 * „schaden". Deshalb gilt je Wort auch die Fassung mit „ae/oe/ue" → „a/o/u". Beide Varianten
 * zaehlen (ODER); ein Wort wie „quelle" findet sich in seiner Originalform weiter.
 * Woerter unter zwei Zeichen fallen weg — „a" oder „3" traefen fast jede Einheit.
 */
export const suchwoerter = (anfrage: string): string[][] =>
  normalisiere(anfrage)
    .split(' ')
    .filter((w) => w.length >= 2)
    .map((w) => {
      const ohne = w.replace(/ae/g, 'a').replace(/oe/g, 'o').replace(/ue/g, 'u');
      return [...new Set([w, ohne, ...(SYNONYME[w] ?? []), ...(SYNONYME[ohne] ?? [])])];
    });

/**
 * KUNDENWORTE → SEITENWORTE. Die Seite sagt „Ersatzwagen", Kunden suchen „Leihwagen".
 * Gemessen am 2026-09-24 gegen den Index (36 typische Begriffe): diese lieferten 0 Treffer, obwohl
 * die Seite die Sache anbietet. NUR solche Faelle gehoeren hierher — was wir nicht anbieten
 * (Inspektion, Reifen, Oldtimer, Wohnmobil), soll ehrlich „Keine Treffer" zeigen; der Dialog
 * verweist dann aufs Telefon. Schluessel und Werte in Vergleichsform (klein, ohne Umlautpunkte).
 * Die Seitenworte werden in den Treffern mitmarkiert.
 */
const SYNONYME: Record<string, string[]> = {
  leihwagen: ['ersatzwagen', 'ersatzfahrzeug'],
  mietwagen: ['ersatzwagen', 'ersatzfahrzeug'],
  leihauto: ['ersatzwagen', 'ersatzfahrzeug'],
  ersatzauto: ['ersatzwagen', 'ersatzfahrzeug'],
  parkschaden: ['parkplatzrempler', 'rempler'],
  parkrempler: ['parkplatzrempler'],
  azubi: ['ausbildung'],
  lehrstelle: ['ausbildung'],
  beule: ['delle'],
  beulen: ['dellen'],
};

const enthaelt = (heu: string, varianten: string[]) => varianten.some((v) => heu.includes(v));
const amWortanfang = (heu: string, varianten: string[]) => varianten.some((v) => ` ${heu}`.includes(` ${v}`));

// ----------------------------------------------------------------- Laden ----

const vorbereiten = (index: SuchIndex): Einheit[] => {
  const einheiten: Einheit[] = [];
  let n = 0;
  const neu = (art: TrefferArt, url: string, seite: string, titel: string, text: string) => {
    einheiten.push({
      art,
      url,
      seite,
      titel,
      text,
      nTitel: normalisiere(titel),
      nSeite: normalisiere(seite),
      nAlles: normalisiere(`${titel} ${text}`),
      reihenfolge: n++,
    });
  };
  for (const s of index.seiten) {
    neu('seite', s.u, s.t, s.t, s.d);
    for (const a of s.a) neu('abschnitt', a.id ? `${s.u}#${a.id}` : s.u, s.t, a.h, a.x);
    for (const f of s.f) neu('frage', s.fid ? `${s.u}#${s.fid}` : s.u, s.t, f.q, f.a);
  }
  return einheiten;
};

let laden: Promise<Einheit[]> | null = null;

/**
 * Laedt den Index einmal je Seitenbesuch. Schlaegt es fehl (offline, Index fehlt), wird der
 * Versuch vergessen — beim naechsten Oeffnen geht es erneut los, statt fuer immer kaputt zu bleiben.
 */
export const ladeIndex = (): Promise<Einheit[]> => {
  laden ??= fetch('/suchindex.json')
    .then((r) => {
      if (!r.ok) throw new Error(`Suchindex nicht erreichbar (${r.status})`);
      return r.json() as Promise<SuchIndex>;
    })
    .then(vorbereiten)
    .catch((fehler) => {
      laden = null;
      throw fehler;
    });
  return laden;
};

// ---------------------------------------------------------------- Suchen ----

/** Hoechstens so viele Treffer je Seite — sonst verdraengt eine lange Seite alle anderen. */
const JE_SEITE = 3;

/**
 * Alle Suchwoerter muessen vorkommen (UND). Gewichtung, grob nach Aussagekraft:
 * Wort im Titel der Einheit 10, im Seitentitel 4, nur im Text 1; am Wortanfang +3;
 * die ganze Anfrage am Stueck +6. Seiten-Einheiten (Titel + Beschreibung) leicht vorn.
 */
export const suche = (einheiten: Einheit[], anfrage: string, hoechstens = 20): Treffer[] => {
  const woerter = suchwoerter(anfrage);
  if (!woerter.length) return [];
  const ganz = normalisiere(anfrage);
  const bewertet: { e: Einheit; punkte: number }[] = [];
  for (const e of einheiten) {
    if (!woerter.every((w) => enthaelt(e.nAlles, w) || enthaelt(e.nSeite, w))) continue;
    let punkte = 0;
    for (const w of woerter) {
      // KURZE WOERTER (unter sechs Buchstaben) zaehlen im Titel nur am Wortanfang: „rauch" steckt in
      // „braucht", und der Titel „… was Ihr Fahrzeug braucht" stand sonst vor dem echten Treffer
      // („Tier, Rauch, Lebensmittel" — gemessen 2026-09-24). Laengere Woerter duerfen mitten im Wort
      // stehen: Deutsche Komposita brauchen das („versiegelung" in „Keramikversiegelung").
      const kurz = w.every((v) => v.length < 6);
      const passt = kurz ? amWortanfang : enthaelt;
      if (passt(e.nTitel, w)) punkte += 10;
      else if (passt(e.nSeite, w)) punkte += 4;
      else punkte += 1;
      if (amWortanfang(e.nAlles, w)) punkte += 3;
      else if (kurz) punkte -= 3;
    }
    if (ganz.includes(' ') && e.nAlles.includes(ganz)) punkte += 6;
    // Nur Teilwort-Treffer kurzer Woerter (Punkte <= 0) fallen ganz weg. „lack" findet
    // „Autolackierung" trotzdem: Die Seite nennt „Lack" auch als eigenes Wort.
    if (punkte <= 0) continue;
    if (e.art === 'seite') punkte *= 1.15;
    bewertet.push({ e, punkte });
  }
  bewertet.sort((a, b) => b.punkte - a.punkte || a.e.reihenfolge - b.e.reihenfolge);
  const jeSeite = new Map<string, number>();
  // GLEICHNAMIGE ABSCHNITTE nur einmal: Der Expertise-Block am Ende der Unterseiten
  // („Glasurit-Lackpartner und Meisterbetrieb – seit 1998", Kundenvorgabe) traegt ueberall dieselbe
  // Ueberschrift, aber seitenspezifischen Text. Ohne das lieferte „Glasurit" 20 Treffer mit
  // derselben Zeile (gemessen 2026-09-24). Der am besten bewertete bleibt; die uebrigen Seiten
  // sind ueber ihre anderen Abschnitte weiter auffindbar.
  const gezeigteTitel = new Set<string>();
  const treffer: Treffer[] = [];
  for (const { e, punkte } of bewertet) {
    const bisher = jeSeite.get(e.seite) ?? 0;
    if (bisher >= JE_SEITE) continue;
    if (e.art !== 'seite') {
      if (gezeigteTitel.has(e.nTitel)) continue;
      gezeigteTitel.add(e.nTitel);
    }
    jeSeite.set(e.seite, bisher + 1);
    treffer.push({ art: e.art, url: e.url, seite: e.seite, titel: e.titel, text: e.text, punkte });
    if (treffer.length >= hoechstens) break;
  }
  return treffer;
};

// ------------------------------------------------------------- Ausschnitt ----

export interface Stueck {
  text: string;
  treffer: boolean;
}

/**
 * Zerlegt einen Text in Stuecke; Woerter, die ein Suchwort enthalten, sind markiert.
 * WORTWEISE statt zeichengenau: Die Vergleichsform ist nicht gleich lang wie der Text („ß" → „ss"),
 * Zeichenpositionen liessen sich nicht zurueckrechnen. Ein Wort ist immer dasselbe Wort.
 */
export const markiere = (text: string, woerter: string[][]): Stueck[] => {
  const teile = text.split(/(\s+)/);
  return teile.map((t) => ({
    text: t,
    treffer: /\S/.test(t) && woerter.some((w) => enthaelt(normalisiere(t), w)),
  }));
};

/**
 * Textstelle um den ersten Treffer: etwa 10 Woerter davor, 26 danach, mit „…" an geschnittenen
 * Enden. Ohne Treffer im Text (Wort nur im Titel) der Anfang des Textes.
 */
export const ausschnitt = (text: string, woerter: string[][], davor = 10, danach = 26): Stueck[] => {
  const alle = text.split(/\s+/).filter(Boolean);
  const erster = alle.findIndex((w) => woerter.some((v) => enthaelt(normalisiere(w), v)));
  const start = erster > davor ? erster - davor : 0;
  const ende = Math.min(alle.length, (erster < 0 ? 0 : erster) + danach);
  let stueck = alle.slice(start, Math.max(ende, Math.min(alle.length, davor + danach))).join(' ');
  if (start > 0) stueck = `… ${stueck}`;
  if (ende < alle.length) stueck = `${stueck} …`;
  return markiere(stueck, woerter);
};
