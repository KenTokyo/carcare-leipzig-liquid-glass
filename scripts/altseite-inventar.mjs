// Inventar der ALTEN Website (www.carcare-center.de): alle Seitenadressen und verlinkten Dokumente.
//
// WOZU
// Beim Livegang zieht die neue Seite auf dieselbe Domain. Jede Adresse der Altseite, die dann ins Leere laeuft, kostet
// Rankings, Lesezeichen und Fremdlinks (Backlog R22). Dieses Inventar ist die Messlatte fuer
// `scripts/check-weiterleitungen.mjs`: Jede Adresse darin braucht eine Weiterleitung, eine weiter ausgelieferte Datei
// oder eine begruendete Ausnahme. Nach der DNS-Umstellung ist die Altseite weg, das Inventar bleibt.
//
//     npm run altseite        # crawlt die Altseite neu und schreibt docs/weiterleitungen-altseite/altseite-inventar.json
//
// WIE
// Breitensuche ab /index.html, nur Links der eigenen Domain. Gefolgt wird nur HTML-Seiten (`.html`); Dokumente (PDF,
// Office) werden mit Fundstelle erfasst, Bilder, Skripte und Videos nur gezaehlt (sie laufen bewusst aus, siehe Planung).
//
// ⚠️ WAS DIESES INVENTAR NICHT ENTHAELT (Pflichtfrage aus CLAUDE.md)
//  1. Adressen, die die Altseite selbst nicht (mehr) verlinkt: aeltere Joomla-Pfade, die nur Google oder fremde Seiten
//     kennen. Die sieht man erst nach dem Livegang im Bericht „Nicht gefunden (404)“ der Search Console.
//  2. Laeuft der Crawl NACH der DNS-Umstellung, traefe er die NEUE Seite und wuerde das Inventar mit ihren Adressen
//     ueberschreiben. Deshalb bricht er ab, wenn die Startseite nicht mehr wie die Altseite aussieht (Joomla-Pfad
//     `/media/jui/` oder Titelpraefix „CarCare - Leipzig -“). Das Inventar im Repository bleibt dann unveraendert.
//  3. Groß-/Kleinschreibvarianten (/Kontakt.html): Die Altseite verlinkt durchgehend klein.

import { writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(wurzel, 'docs/weiterleitungen-altseite/altseite-inventar.json');
const BASIS = 'https://www.carcare-center.de';
const HOSTS = new Set(['www.carcare-center.de', 'carcare-center.de']);
const MAX_SEITEN = 300;
const DOKUMENT = /\.(pdf|docx?|xlsx?|pptx?)$/i;

const holen = async (pfad) => {
  try {
    const res = await fetch(BASIS + encodeURI(pfad), {
      redirect: 'manual',
      headers: { 'User-Agent': 'OALAB-Altseiten-Inventar/1.0 (Relaunch CarCare Center, Weiterleitungen)' },
    });
    const istHtml = (res.headers.get('content-type') ?? '').includes('text/html');
    return { status: res.status, ziel: res.headers.get('location'), text: res.status === 200 && istHtml ? await res.text() : '' };
  } catch (err) {
    return { status: `Fehler: ${err.message}`, ziel: null, text: '' };
  }
};

const start = await holen('/index.html');
if (!/\/media\/jui\/|<title>\s*CarCare - Leipzig -/i.test(start.text)) {
  console.error('[altseite] ABGEBROCHEN: Die Startseite sieht nicht mehr wie die alte Website aus (kein Joomla-Pfad,');
  console.error('           kein Titel „CarCare - Leipzig -“). Vermutlich laeuft unter der Domain schon die neue Seite.');
  console.error(`           Das Inventar bleibt unveraendert: ${path.relative(wurzel, ZIEL)}`);
  process.exit(1);
}

const seiten = new Map(); // pfad -> { status, titel, ziel, gefundenAuf: Set }
const dokumente = new Map(); // pfad -> Set(gefundenAuf)
const uebrige = new Map(); // endung -> Set(pfad)
const warteschlange = ['/index.html'];
const vorgemerkt = new Set(warteschlange);

while (warteschlange.length && seiten.size < MAX_SEITEN) {
  const pfad = warteschlange.shift();
  const antwort = pfad === '/index.html' ? start : await holen(pfad);
  const titel = (antwort.text.match(/<title[^>]*>([\s\S]*?)<\/title>/i)?.[1] ?? '')
    .replace(/&amp;/g, '&').replace(/\s+/g, ' ').trim();
  const eintrag = seiten.get(pfad) ?? { gefundenAuf: new Set() };
  Object.assign(eintrag, { status: antwort.status, titel, ziel: antwort.ziel });
  seiten.set(pfad, eintrag);

  const basis = new URL(BASIS + pfad);
  for (const m of antwort.text.matchAll(/(?:href|src)\s*=\s*["']([^"'#]+)/gi)) {
    if (/^(mailto:|tel:|javascript:|data:)/i.test(m[1].trim())) continue;
    let url;
    try { url = new URL(m[1].trim(), basis); } catch { continue; }
    if (!HOSTS.has(url.hostname)) continue;
    const ziel = decodeURI(url.pathname);
    if (ziel.endsWith('.html')) {
      const z = seiten.get(ziel) ?? { gefundenAuf: new Set() };
      z.gefundenAuf.add(pfad);
      seiten.set(ziel, z);
      if (!vorgemerkt.has(ziel)) { vorgemerkt.add(ziel); warteschlange.push(ziel); }
    } else if (DOKUMENT.test(ziel)) {
      if (!dokumente.has(ziel)) dokumente.set(ziel, new Set());
      dokumente.get(ziel).add(pfad);
    } else if (ziel !== '/') {
      // Gezaehlt werden verschiedene Dateien, nicht Fundstellen (ein Stylesheet steht auf jeder Seite).
      const endung = (ziel.match(/\.([a-z0-9]{2,5})(?:%3F.*)?$/i)?.[1] ?? 'ohne').toLowerCase();
      if (!uebrige.has(endung)) uebrige.set(endung, new Set());
      uebrige.get(endung).add(ziel);
    }
  }
}

const sortiert = (map) => [...map].sort(([a], [b]) => a.localeCompare(b));
const inventar = {
  quelle: BASIS,
  erfasst: new Date().toISOString().slice(0, 10),
  hinweis: 'Erzeugt mit npm run altseite (scripts/altseite-inventar.mjs). Nicht von Hand bearbeiten.',
  seiten: sortiert(seiten).map(([pfad, s]) => ({
    pfad,
    status: s.status,
    titel: s.titel ?? '',
    ...(s.ziel ? { ziel: s.ziel } : {}),
    gefundenAuf: [...s.gefundenAuf].sort().slice(0, 3),
  })),
  dokumente: sortiert(dokumente).map(([pfad, auf]) => ({ pfad, gefundenAuf: [...auf].sort().slice(0, 3) })),
  nichtErfasst: Object.fromEntries(sortiert(uebrige).map(([endung, pfade]) => [endung, pfade.size])),
};

writeFileSync(ZIEL, `${JSON.stringify(inventar, null, 2)}\n`);
const fehlerhaft = inventar.seiten.filter((s) => s.status !== 200);
console.log(`[altseite] ${inventar.seiten.length} Seiten, ${inventar.dokumente.length} Dokumente → ${path.relative(wurzel, ZIEL)}`);
if (fehlerhaft.length) console.log(`[altseite] davon ohne 200: ${fehlerhaft.map((s) => `${s.pfad} (${s.status})`).join(', ')}`);
console.log(`[altseite] nicht erfasst (laufen aus): ${Object.entries(inventar.nichtErfasst).map(([e, n]) => `${n} × ${e}`).join(', ')}`);
