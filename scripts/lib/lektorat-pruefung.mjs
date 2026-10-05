// Mechanische Vorpruefung fuer das Lektorat (`npm run lektorat`). Grundlage: Duden 29. Aufl., amtliches Regelwerk 2024,
// `docs/lektorat/stilblatt.md`, Textregeln 1–7 in `CLAUDE.md`.
//
// ART: K = Korrektur (Regelverstoss, eindeutig am Muster erkennbar) · H = Hinweis (Muster ist verdaechtig, ein Mensch
// entscheidet: langer Satz, Werbewort, moeglicher Kommafehler).
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DER TEXT IN ORDNUNG IST (Pflichtfrage aus CLAUDE.md):
//  1. Sie kennt nur Muster. Grammatik, Bezuege, falsche Woerter, schiefe Bilder und die meisten Kommafehler findet sie
//     nicht. Ein leerer Lauf heisst „keine bekannten Muster“, nicht „fehlerfrei“. Das Lesen ersetzt sie nicht.
//  2. Sie liest nur, was der Auszug liefert. Fehlt dort Text (nicht aufgeklappt, erst nach Absenden sichtbar), fehlt er
//     auch hier. Deshalb meldet der Runner je Route Wortzahl gegen Suchindex und zugeklappt gebliebene Schalter.
//  3. Das Komma bei Infinitivgruppen prueft sie nur nach „um/ohne/statt/anstatt/außer/als … zu“. Alle anderen
//     Infinitivgruppen (seit 2024 ebenfalls Pflicht) bleiben dem Lesen.

const NBSP = '\u00a0';

/** Regeln: `re` mit Flag g; `ausser` prueft das Umfeld (±12 Zeichen) und verwirft Treffer. */
const REGELN = [
  // Typografie
  { art: 'K', regel: 'Gerade Anführungszeichen: „…“ verwenden', re: /"/g },
  { art: 'K', regel: 'Englisches Anführungszeichen: deutsch öffnet „ und schließt “', re: /(^|[\s(])“|”/g },
  { art: 'K', regel: 'Gerader Apostroph: ’ verwenden', re: /(?<=\p{L})'(?=\p{L}|\s|$)/gu },
  { art: 'K', regel: 'Drei Punkte: Auslassungszeichen … verwenden', re: /\.\.\./g },
  { art: 'K', regel: 'Leerzeichen vor Satzzeichen', re: /(?<=\S) [,;:!?](?=\s|$)|(?<=\p{L}) \.(?=\s|$)/gu },
  { art: 'K', regel: 'Leerzeichen nach Satzzeichen fehlt', re: /\p{Ll}[,;](?=\p{L})|\p{Ll}{2}[.!?](?=\p{Lu}\p{Ll})/gu, ausser: /\.(de|com|info|cloud|html)\b|www\./ },
  { art: 'K', regel: 'Bis-Strich: Halbgeviertstrich ohne Leerzeichen („1–2“)', re: /(?<!\d[ .])\b\d{1,4} ?- ?\d{1,4}\b(?![.\d-])/g, ausser: /0341 - 261|\d{3,} ?- ?\d{3,}|ISO|DIN|\d{4}-\d{2}-\d{2}/ },
  { art: 'K', regel: 'Bis-Strich ohne Leerzeichen („8–17 Uhr“)', re: /\d [–‒] \d/g },
  { art: 'K', regel: 'Doppeltes Satzzeichen', re: /[,;:]{2,}|\.,|,\.|!!|\?\?/g },
  // Stilblatt 5: geschuetztes Leerzeichen
  { art: 'K', regel: 'Zahl und Einheit: geschütztes Leerzeichen (Stilblatt 5)', re: /\d (?:m²|€|%|km|Uhr)(?![\p{L}²])/gu },
  { art: 'K', regel: '„z. B.“ mit geschütztem Leerzeichen (Stilblatt 5)', re: /\bz\. B\.|\bz\.B\./g },
  // Stilblatt 1–4, Kfz, E-Mail
  { art: 'K', regel: '„Spot-Repair“ mit Bindestrich (Stilblatt 1)', re: /Spot Repair/g },
  { art: 'K', regel: '„Smart Repair“ allein getrennt, nur in Zusammensetzungen durchgekoppelt (Stilblatt 2)', re: /Smart-Repair(?!-)/g },
  { art: 'K', regel: '„Pkw/Lkw“ (Stilblatt 3)', re: /\b(?:PKW|LKW)s?\b/g },
  { art: 'K', regel: '„Ersatzwagen“ (Stilblatt 4)', re: /Werkstatt-?[Ee]rsatzfahrzeug\w*|\bErsatzfahrzeug\w*/g },
  { art: 'K', regel: '„Kfz“, „E-Mail“', re: /\bKFZ\b|\bEmail\b|\beMail\b|\bE-mail\b/g },
  { art: 'H', regel: '„inkl.“ im Fließtext ausschreiben (in Preis-Hinweisen zulässig)', re: /\binkl\./g },
  { art: 'H', regel: 'Uhrzeit in DIN-Form: im Fließtext „8 Uhr“ (Stilblatt 6)', re: /\b0\d:\d\d\b/g },
  // Textregeln CLAUDE.md
  { art: 'K', regel: 'Betriebsfläche: „über 3.500 m²“ (Textregel 4)', re: /3\.000[ \u00a0]?(?:m²|qm|Quadratmeter)/g },
  { art: 'K', regel: 'Gründung: „seit 1998“ (Textregel 3)', re: /seit 199[36]\b|über 30 Jahre/g },
  { art: 'K', regel: 'Name: „CarCare Center“ (Textregel 1)', re: /\b(?:KCare|Kcare|K-Care|Kare|KKR)\b|CarCare(?![ \u00a0]Center|[ \u00a0]GmbH|-)/g, ausser: /BS CarCare/ },
  { art: 'K', regel: 'Wir-Form: Firmenname nicht als Subjekt in dritter Person (Textregel 2)', re: /CarCare Center(?: Leipzig)? (?:ist|bietet|hat|kümmert|steht|arbeitet|übernimmt|repariert|sorgt|verfügt|setzt|garantiert|legt|gehört|führt|betreut|vereint|liefert|stellt|bereitet|beschäftigt|bildet)\b/g, nurSichtbar: true },
  { art: 'H', regel: 'Ansprache: „Sie“, nicht „du“ (Zitat?)', re: /\b(?:du|dein|deine|deinen|deinem|deiner|dich|dir)\b/g },
  // Grammatik und Zeichensetzung (nur sichere Muster)
  { art: 'K', regel: 'Wortdoppelung', re: /(?<!\p{L})(\p{L}{2,})\s+\1(?!\p{L})/giu, ausser: /\bSie sie\b/ },
  { art: 'K', regel: 'Komma vor „um/ohne/statt … zu“ (Regelwerk 2024)', re: /(?<![,;:(–\s])\s(?:um|ohne|statt|anstatt|außer)\s(?:[^,.;:!?()]{1,80}?\s)?zu\s\p{Ll}+/gu },
  // Ebene 6: sprachliche Risiken (nur Hinweis)
  { art: 'H', regel: 'Werbe- oder Garantieaussage: belegbar? (Ebene 6)', re: /\b(?:beste[nrms]?|einzige[nrms]?|garantiert|kostenlos|gratis|perfekt|makellos|unschlagbar|günstigste[nrms]?)\b/giu },
];

const SATZ_GRENZE = /(?<=[.!?])\s+(?=[„"\p{Lu}\d])/u;

/** Prueft eine Liste von Texten. `eintraege`: [{ ort, text, jsonld? }] → Funde [{ ort, art, regel, ausschnitt }]. */
export function pruefe(eintraege) {
  const funde = [];
  for (const { ort, text, jsonld } of eintraege) {
    if (!text) continue;
    for (const r of REGELN) {
      if (r.nurSichtbar && jsonld) continue; // Textregel 2, Ausnahme 2: JSON-LD darf dritte Person
      r.re.lastIndex = 0;
      for (const m of text.matchAll(r.re)) {
        const umfeld = text.slice(Math.max(0, m.index - 12), m.index + m[0].length + 12);
        if (r.ausser?.test(umfeld)) continue;
        funde.push({ ort, art: r.art, regel: r.regel, ausschnitt: ausschnitt(text, m.index, m[0].length) });
      }
    }
    // Satzlaenge: ab 25 Woertern ein Hinweis (Lesbarkeit, SEO-GEO 4.3)
    for (const satz of text.split(SATZ_GRENZE)) {
      const woerter = satz.split(/\s+/).filter((w) => /\p{L}/u.test(w)).length;
      if (woerter > 25) funde.push({ ort, art: 'H', regel: `Langer Satz (${woerter} Wörter)`, ausschnitt: satz.length > 160 ? `${satz.slice(0, 157)}…` : satz });
    }
  }
  return funde;
}

/** ±45 Zeichen um den Fund; geschuetzte Leerzeichen als „⍽“ sichtbar, damit Leerzeichen-Funde lesbar sind. */
function ausschnitt(text, i, laenge) {
  const a = Math.max(0, i - 45);
  const e = Math.min(text.length, i + laenge + 45);
  return `${a > 0 ? '…' : ''}${text.slice(a, e).replaceAll(NBSP, '⍽').replace(/\n/g, ' ⏎ ')}${e < text.length ? '…' : ''}`;
}

export const ANZAHL_REGELN = REGELN.length + 1;
