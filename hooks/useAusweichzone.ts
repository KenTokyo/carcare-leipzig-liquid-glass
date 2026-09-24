import { useEffect, useState } from 'react';

/** Attribut, mit dem eine Flaeche die schwebenden Knoepfe zum Ausweichen bringt. */
export const AUSWEICHEN_ATTRIBUT = 'data-aktionen-ausweichen';

/**
 * `true`, solange eine Flaeche mit `data-aktionen-ausweichen` den Streifen am unteren
 * Fensterrand beruehrt, in dem die schwebenden Knoepfe sitzen (`SchwebendeAktionen`).
 *
 * WOZU (gemessen 2026-09-24): Die Seite hat bildschirmhohe Flaechen, deren Inhalt die rechte
 * untere Ecke DAUERHAFT belegt — die Vertrauensleiste am Fuss des Heros (bei 1280 × 800 lagen
 * die Knoepfe auf „Standort Leipzig"), der gepinnte Zielgruppenstapel (bei 1024 × 700 auf
 * „Porsche Werk Leipzig", `npm run zielgruppen` meldete es). Beide bieten dieselben Aktionen
 * selbst an. Was nur durchscrollt, weicht NICHT aus — das deckt jeder schwebende Knopf kurz ab,
 * und staendiges Ein- und Ausblenden waere genau die Unruhe, die der User beanstandet hat.
 *
 * WARUM `IntersectionObserver` UND KEIN SCROLL-LISTENER: Der Browser meldet nur das Betreten
 * und Verlassen, es wird nichts je Bild gerechnet. Die Wurzel ist das Fenster mit einem
 * negativen oberen Rand — beobachtet wird damit nur der untere Streifen der Hoehe `streifen`.
 *
 * WARUM `MutationObserver` AUF `<main>`: Die Navbar wechselt Seiten per `pushState`, ohne
 * Neuladen. Die markierten Flaechen der neuen Seite muessen dann neu angemeldet werden; die
 * Seiten stehen als direkte Kinder in `<main>`, `childList` genuegt.
 */
export const useAusweichzone = (streifen = 120): boolean => {
  const [aktiv, setAktiv] = useState(false);

  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    let beobachter: IntersectionObserver | null = null;
    const beruehrt = new Set<Element>();

    const anmelden = () => {
      beobachter?.disconnect();
      beruehrt.clear();
      const oben = Math.max(0, window.innerHeight - streifen);
      beobachter = new IntersectionObserver(
        (eintraege) => {
          for (const e of eintraege) {
            if (e.isIntersecting) beruehrt.add(e.target);
            else beruehrt.delete(e.target);
          }
          setAktiv(beruehrt.size > 0);
        },
        { rootMargin: `-${oben}px 0px 0px 0px` }
      );
      document.querySelectorAll(`[${AUSWEICHEN_ATTRIBUT}]`).forEach((el) => beobachter!.observe(el));
      // Nach einem Seitenwechsel kann die neue Seite keine markierte Flaeche haben — dann muss
      // der alte Zustand weg, sonst blieben die Knoepfe versteckt.
      setAktiv(false);
    };

    anmelden();
    const main = document.querySelector('main');
    const seitenwechsel = main ? new MutationObserver(anmelden) : null;
    if (main) seitenwechsel!.observe(main, { childList: true });
    window.addEventListener('resize', anmelden);
    return () => {
      beobachter?.disconnect();
      seitenwechsel?.disconnect();
      window.removeEventListener('resize', anmelden);
    };
  }, [streifen]);

  return aktiv;
};
