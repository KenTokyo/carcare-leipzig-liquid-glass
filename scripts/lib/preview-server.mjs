import { spawn } from 'node:child_process';

/**
 * Startet `vite preview` gegen `dist/` und liefert Basis-URL plus Stopp-Funktion.
 *
 * WARUM NICHT `npm run dev`: CLAUDE.md verbietet das ausdruecklich — der Dev-Server
 * laeuft oft schon und der Start erzeugt Port-Konflikte. `preview` bedient ausserdem
 * genau das, was ausgeliefert wird, und nicht die Entwicklerfassung.
 */
export async function startePreview(port = 4183) {
  const kind = spawn('npx', ['vite', 'preview', '--port', String(port), '--strictPort'], {
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
