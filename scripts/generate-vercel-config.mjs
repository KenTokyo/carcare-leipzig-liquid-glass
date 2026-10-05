// Erzeugt `vercel.json` aus der zentralen Routenliste (`scripts/routes.mjs`).
//
// WARUM DIESE DATEI ÜBERHAUPT NÖTIG IST
// Der Prerender (`scripts/prerender.mjs`) legt pro Route eine statische
// `dist/<route>/index.html` ab. Solange er läuft, liefert Vercel diese Dateien direkt
// aus und alles ist gut. Er ist aber absichtlich so gebaut, dass er einen Deploy NICHT
// blockiert: Startet Chromium nicht, überspringt er sich mit einer Warnung.
//
// Genau dieser Fall trat auf carcare-center.vercel.app ein — und ohne Fallback-Regel
// war die Folge nicht „eingeschränkte Crawlbarkeit", sondern ein **totaler Ausfall**:
// Nur `/` lieferte 200, ALLE anderen Routen (auch `/kontakt`, `/leistungen`) gaben 404,
// weil es weder eine statische Datei noch eine Rewrite-Regel gab. Gemessen 2026-08-10.
//
// Diese Konfiguration schliesst die Lücke: Findet Vercel keine statische Datei, liefert
// es fuer eine BEKANNTE Route die `index.html` aus; die SPA liest dann
// `window.location.pathname` und rendert die richtige Seite.
//
// WARUM EINE EXPLIZITE LISTE STATT `/(.*)`
// Ein Catch-all wuerde auch Tippfehler-URLs mit HTTP 200 beantworten und dort die
// 404-Seite rendern — ein Soft-404. Das ist laut SEO-GEO-STANDARDS.md §2.4 (korrekte
// Statuscodes) unerwuenscht. Mit der expliziten Liste bleiben unbekannte Pfade echte
// 404er, waehrend jede echte Route zuverlaessig ausgeliefert wird.
//
// REIHENFOLGE BEI VERCEL: Redirects -> Dateisystem -> Rewrites. Die statischen
// Prerender-Dateien gewinnen also weiterhin; die Rewrites greifen nur als Netz.
//
// ⚠️ WICHTIG: `vercel.json` muss EINGECHECKT sein. Vercel liest sie aus dem Repository,
// bevor der Build startet — eine erst im Build erzeugte Datei käme zu spät. Deshalb
// laeuft dieses Skript NICHT im prebuild, sondern wird bei Routenaenderungen von Hand
// aufgerufen (`npm run vercel-config`) und das Ergebnis mitcommittet.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { getRoutes } from './routes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

// `/` braucht keine Regel — dafuer liegt `dist/index.html` immer vor.
const rewrites = getRoutes()
  .map((r) => r.path)
  .filter((p) => p !== '/')
  .map((p) => ({ source: p, destination: '/index.html' }));

// CACHING (2026-10-05, Performance-Analyse, Dauer vom User entschieden).
// Ohne eigene Regeln lieferte Vercel JEDE Datei mit `public, max-age=0, must-revalidate` aus, auch die Vite-Buendel.
// Der Browser fragte damit bei jeder Seitenladung jede Datei neu an (gemessen: 17 Rueckfragen auf /ueber-uns, 12 nach
// dem Logo-Klick), lokal kostenlos, live je eine Netzrunde. HTML bleibt beim Vercel-Standard: Es muss frisch sein.
//  - Vite-Buendel unter /assets/*.js|css tragen den Inhalts-Hash im Namen und aendern ihn bei jeder Aenderung:
//    ein Jahr, unveraenderlich. In `public/assets` liegen keine .js/.css, die Regel trifft nur Buendel.
//  - Bilder, Videos, Schriften behalten ihren Namen, auch wenn der Inhalt getauscht wird (Bildnummern-Praxis):
//    1 Tag frisch, danach bis 7 Tage aus dem Cache mit Aktualisierung im Hintergrund. Ein Bildtausch unter gleichem
//    Namen erreicht wiederkehrende Besucher also spaetestens nach einem Tag.
// Pruefen nach dem Deploy: `curl -sI https://carcare-center.vercel.app/assets/<datei>` → Cache-Control.
const headers = [
  {
    source: '/assets/(.*).(js|css)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
  },
  {
    source: '/assets/(.*).(webp|png|jpg|jpeg|svg|avif|gif|ico|mp4|webm|woff2)',
    headers: [{ key: 'Cache-Control', value: 'public, max-age=86400, stale-while-revalidate=604800' }],
  },
];

const config = {
  $schema: 'https://openapi.vercel.sh/vercel.json',
  headers,
  rewrites,
};

writeFileSync(resolve(root, 'vercel.json'), `${JSON.stringify(config, null, 2)}\n`);
console.log(`vercel.json erzeugt: ${rewrites.length} Rewrite-Regeln (Fallback fuer den Fall, dass der Prerender aussetzt).`);
