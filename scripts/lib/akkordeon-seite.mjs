// Gemeinsame Seitenhelfer fuer `scripts/check-akkordeon.mjs` und `scripts/lib/akkordeon-maus.mjs`.
//
// KARTEN ERKENNEN (seit 2026-10-19, R33-a): an `data-akk-offen`, nicht mehr an `a[aria-expanded]`. Seit die
// Mitarbeiterstimmen auf /karriere (`components/Stimmen.tsx`) dieselbe Mechanik haben, misst der Pruefer auch sie; das
// sind Zitate in einer Liste, keine Links, und `aria-expanded` erlaubt ARIA an einem Listeneintrag nicht. Beide Akkordeons
// tragen den Zustand deshalb als `data-akk-offen="true|false"`, geschrieben aus dem React-Zustand und nicht aus der Hoehe:
// So faellt weiter auf, wenn eine Karte als offen gilt, aber 64 px hoch bleibt (Ruhelage, `check-akkordeon.mjs`).

/**
 * Im Fenster (per `evaluateOnNewDocument`): `__ccKarten(sel)` liefert die Karten EINES Akkordeons, die Geschwister der
 * ersten Karte in der Sektion. Auf /karriere stehen zwei Akkordeons (Stellen, Ausbildung) in derselben Sektion;
 * zusammengezaehlt waere „genau eine offen“ dort immer falsch. `__ccOffen(karte)` liest den Zustand.
 */
export const KARTEN = `window.__ccKarten = (sel) => {
  const erste = document.querySelector(sel + ' [data-akk-offen]');
  return erste ? [...erste.parentElement.querySelectorAll(':scope > [data-akk-offen]')] : [];
};
window.__ccOffen = (karte) => karte.getAttribute('data-akk-offen') === 'true';`;

/** Freier Bereich zwischen den festen Leisten wie in `lib/freierBereich.ts`, dazu Scrollgrenzen (`window.__ccFrei`). */
export const FREI = `window.__ccFrei = () => {
  let oben = 0;
  let unten = window.innerHeight;
  document.querySelectorAll('[data-feste-leiste]').forEach((leiste) => {
    const r = leiste.getBoundingClientRect();
    if (r.height === 0 || r.bottom <= 0 || r.top >= window.innerHeight) return;
    if (leiste.dataset.festeLeiste === 'oben') oben = Math.max(oben, r.bottom);
    else unten = Math.min(unten, r.top);
  });
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return { oben, unten, amRand: window.scrollY <= 1 || window.scrollY >= max - 1 };
};`;

/**
 * Das Stellen-Pop-up auf /karriere (nach 1,2 s, unten) laege sonst ueber den Karten. Unter Rechnerlast kommt es spaeter;
 * ein fester Zeitpunkt schloss es dann zu frueh, und es fing den gemessenen Tipp ab (2026-10-16). Deshalb: auf das
 * Pop-up warten (nur dort, wo es eins gibt), schliessen, warten bis es weg ist.
 */
export const popupSchliessen = async (seite, route) => {
  if (route !== '/karriere') return;
  await seite.waitForSelector('[role="dialog"]', { timeout: 6000 }).catch(() => {});
  await seite.evaluate(() => document.querySelector('[role="dialog"] button[aria-label*="schließen"]')?.click());
  await seite.waitForFunction(() => !document.querySelector('[role="dialog"]'), { timeout: 4000 }).catch(() => {});
};
