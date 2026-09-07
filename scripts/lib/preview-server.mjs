import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const VITE = path.join(wurzel, 'node_modules', 'vite', 'bin', 'vite.js');

/**
 * Startet `vite preview` gegen `dist/` und liefert Basis-URL plus Stopp-Funktion.
 *
 * WARUM NICHT `npm run dev`: CLAUDE.md verbietet das ausdruecklich — der Dev-Server
 * laeuft oft schon und der Start erzeugt Port-Konflikte. `preview` bedient ausserdem
 * genau das, was ausgeliefert wird, und nicht die Entwicklerfassung.
 *
 * WARUM NICHT `spawn('npx', ...)`: Auf Windows gibt es keine ausfuehrbare Datei `npx` —
 * nur `npx.cmd`. Ohne `shell: true` bricht `spawn` mit `ENOENT` ab, und zwar als
 * unbehandeltes `error`-Ereignis, also mit Stapelspur statt mit einer Meldung. Vom
 * 2026-09-06 bis 2026-09-07 liefen `npm run kontrast` und `npm run shots` deshalb auf
 * Windows GAR NICHT — beide standen in `package.json` und galten damit als vorhanden.
 * `shell: true` wuerde es auch loesen, handelt sich aber Anfuehrungszeichen-Fragen ein.
 * Der Aufruf laeuft deshalb direkt ueber `node` und die Binaerdatei im Projekt: kein
 * Shell, kein PATH, keine Plattformabhaengigkeit.
 */
export async function startePreview(port = 4183) {
  const kind = spawn(process.execPath, [VITE, 'preview', '--port', String(port), '--strictPort'], {
    stdio: ['ignore', 'pipe', 'pipe'],
  });
  const basis = `http://localhost:${port}`;
  await new Promise((auf, ab) => {
    const frist = setTimeout(() => ab(new Error('vite preview startet nicht (30 s)')), 30000);
    const pruefe = (d) => {
      if (String(d).includes(String(port))) { clearTimeout(frist); setTimeout(auf, 500); }
    };
    kind.stdout.on('data', pruefe);
    kind.stderr.on('data', pruefe);
    kind.on('exit', (c) => { clearTimeout(frist); ab(new Error(`vite preview beendet mit ${c}`)); });
  });
  return { basis, stopp: () => kind.kill('SIGTERM') };
}

/** Haelt die Scrollposition gegen Lenis fest, bis die Aufnahme steht. */
export const HALTE_SCROLL = `
  window.__ccHalte = (y) => {
    window.__ccStop = false;
    const halten = () => {
      if (window.__ccStop) return;
      if (Math.abs(window.scrollY - y) > 0.5) window.scrollTo(0, y);
      requestAnimationFrame(halten);
    };
    halten();
  };
  window.__ccLoslassen = () => { window.__ccStop = true; };
`;
