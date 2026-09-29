import { execFileSync } from 'node:child_process';
import { statSync, writeSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/**
 * Welcher Build wird gemessen, und ist er noch der aktuelle Stand?
 *
 * ANLASS (2026-09-28): Der Kontrastlauf fuer Schleife 6 war gruen, hatte aber den Build von
 * 17:05 gemessen. Um 17:15 kam ein neuer Build mit geaenderten Privatkunden-Kacheln, und das
 * Protokoll sah genauso aus wie eines vom richtigen Stand. Seitdem nennt jede Messung, die
 * `startePreview` benutzt, den Zeitpunkt des Builds. Ist eine getrackte Quelldatei neuer als
 * `dist/index.html` (das der Prerender als Letztes schreibt), bricht sie ab.
 *
 * WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DER STAND STIMMT (Waechter-Regel in CLAUDE.md):
 * - Aenderungen an nicht getrackten Dateien, die in den Build eingehen: `.env` mit VITE_-Werten,
 *   die von `build-email.mjs` erzeugten `data/*.js`. Bewusst so, denn genau diese Dateien
 *   schreiben Build und Mailtest selbst neu; mit ihnen gaebe es nach jedem Mailtest Fehlalarm.
 * - Dateien mit altem Zeitstempel trotz neuem Inhalt (entpackt, `cp -p`) und geloeschte Dateien.
 * - Eine Messung, die zu ihrem Zeitpunkt stimmte und erst danach durch eine Aenderung veraltet
 *   ist. Das war der Anlass selbst. Dagegen hilft nur der Zeitpunkt in der Ausgabe: Ergebnisse
 *   in der Doku mit dem Build belegen, nach jeder Korrektur alle Werkzeuge gegen den neuen Build.
 */
const BUILD_QUELLEN = [
  'components', 'pages', 'data', 'hooks', 'styles', 'seo', 'lib', 'public',
  'App.tsx', 'index.tsx', 'index.html', 'index.css', 'types.ts',
  'vite.config.ts', 'tailwind.config.js', 'postcss.config.mjs', 'tsconfig.json',
  // Build-Skripte, die ausgeliefertes HTML, Suchindex und Sitemap schreiben
  'scripts/prerender.mjs', 'scripts/routes.mjs', 'scripts/lib/suchindex.mjs', 'scripts/generate-sitemap.mjs',
];

export const SCHALTER_ALTER_STAND = 'CC_ALTEN_STAND_MESSEN';

/* Synchron auf stderr: Auf Windows schreibt die Konsole asynchron, und `process.exit` direkt
   nach `console.error` kann die Meldung abschneiden. */
const abbrechen = (text) => {
  writeSync(2, `${text}\n`);
  process.exit(2);
};

/** Nennt den gemessenen Build; beendet den Prozess mit Code 2, wenn `dist/` fehlt oder veraltet ist. */
export function pruefeDistStand() {
  let gebaut;
  try {
    gebaut = statSync(path.join(wurzel, 'dist', 'index.html')).mtimeMs;
  } catch {
    abbrechen('[dist] dist/index.html fehlt. Erst `npm run build`, dann messen.');
  }
  const zeit = new Date(gebaut).toLocaleString('de-DE');
  let dateien;
  try {
    dateien = execFileSync('git', ['ls-files', '-z', '--', ...BUILD_QUELLEN], { cwd: wurzel, encoding: 'utf8' })
      .split('\0')
      .filter(Boolean);
  } catch {
    console.log(`[dist] Build vom ${zeit} (ohne git nicht gegen die Quellen geprueft)`);
    return;
  }
  const neuer = dateien.filter((datei) => {
    try { return statSync(path.join(wurzel, datei)).mtimeMs > gebaut; } catch { return false; }
  });
  if (!neuer.length) {
    console.log(`[dist] Build vom ${zeit}, keine Quelldatei neuer`);
    return;
  }
  const liste = neuer.slice(0, 5).join(', ') + (neuer.length > 5 ? ` und ${neuer.length - 5} weitere` : '');
  const befund = `[dist] Build vom ${zeit} ist aelter als ${neuer.length} Quelldatei(en): ${liste}`;
  if (process.env[SCHALTER_ALTER_STAND] === '1') {
    console.log(`${befund}\n[dist] ${SCHALTER_ALTER_STAND}=1: gemessen wird absichtlich der alte Stand.`);
    return;
  }
  abbrechen(`${befund}\n[dist] Gemessen wuerde der alte Stand. Erst \`npm run build\`, dann messen.`
    + `\n[dist] Absichtlich den alten Stand messen: ${SCHALTER_ALTER_STAND}=1 setzen.`);
}
