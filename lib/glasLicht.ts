import type React from 'react';

/**
 * Lichtpunkt auf Liquid Glass (`cc-liquid`, styles/glas.css): setzt `--glas-x` / `--glas-y` am
 * Element auf die Zeigerposition — beim Ueberfahren (Maus) und beim Antippen (Finger). Das CSS laesst
 * den Glanzfleck dorthin gleiten (`@property`, 160 ms).
 *
 * BEWUSST KEIN React-State: Jede Mausbewegung wuerde sonst neu zeichnen. Die Variablen gehen direkt
 * an `style` — nur Stil-Neuberechnung und Malen, kein Layout.
 *
 * Beim Verlassen zurueck auf die Ruhelage oben links (Werte wie `initial-value` in glas.css).
 */
const setzen = (e: React.PointerEvent<HTMLElement>) => {
  const el = e.currentTarget;
  const r = el.getBoundingClientRect();
  if (!r.width || !r.height) return;
  el.style.setProperty('--glas-x', `${Math.round(((e.clientX - r.left) / r.width) * 100)}%`);
  el.style.setProperty('--glas-y', `${Math.round(((e.clientY - r.top) / r.height) * 100)}%`);
};

const zuruecksetzen = (e: React.PointerEvent<HTMLElement>) => {
  e.currentTarget.style.removeProperty('--glas-x');
  e.currentTarget.style.removeProperty('--glas-y');
};

/** Zum Spreizen an ein `cc-liquid`-Element: `<a {...glasLicht} className="cc-liquid …">`. */
export const glasLicht = {
  onPointerMove: setzen,
  onPointerDown: setzen,
  onPointerLeave: zuruecksetzen,
} as const;
