import { useEffect, useState } from 'react';

/**
 * `true`, sobald das Seitenende naeher ist als `anteil` Bildschirmhoehen. Dort schiebt sich der
 * Inhalt nach oben weg und gibt den fixierten Footer frei (Reveal-Footer, `Footer.tsx`).
 *
 * Genutzt von `MobileStickyCTA` (Leiste am unteren Rand, unter `lg`): Sie blendet dort aus, sonst
 * laege sie ueber dem Footer — und der nennt Telefon und Adresse ohnehin selbst.
 * Am 2026-09-24 aus der Komponente herausgeloest, als kurzzeitig auch schwebende Knoepfe unten
 * rechts sie brauchten (seitdem ersetzt durch die Aussparung oben rechts, die immer steht).
 * Dabei behoben: Nach einem Seitenwechsel per Navbar rechnete die Leiste erst beim naechsten
 * Scrollen neu.
 */
export const useNaheSeitenende = (anteil = 0.7): boolean => {
  const [nahe, setNahe] = useState(false);

  useEffect(() => {
    const pruefe = () => {
      const unterkante = window.scrollY + window.innerHeight;
      const schwelle = document.documentElement.scrollHeight - window.innerHeight * anteil;
      setNahe(unterkante >= schwelle);
    };
    pruefe();
    // Seitenwechsel per Navbar (`pushState` + `carcare:navigate`) oder Browser-Zurueck: Die neue
    // Seite hat eine andere Hoehe, ohne dass zwingend gescrollt wird — steht man schon oben,
    // kommt kein Scroll-Ereignis, und der alte Wert bliebe stehen (gefunden 2026-09-24 im
    // Scroll-Durchlauf). Kurz warten, bis React die neue Seite gerendert hat.
    let zeitgeber = 0;
    const nachWechsel = () => {
      window.clearTimeout(zeitgeber);
      zeitgeber = window.setTimeout(pruefe, 80);
    };
    window.addEventListener('scroll', pruefe, { passive: true });
    window.addEventListener('resize', pruefe);
    window.addEventListener('carcare:navigate', nachWechsel);
    window.addEventListener('popstate', nachWechsel);
    return () => {
      window.clearTimeout(zeitgeber);
      window.removeEventListener('scroll', pruefe);
      window.removeEventListener('resize', pruefe);
      window.removeEventListener('carcare:navigate', nachWechsel);
      window.removeEventListener('popstate', nachWechsel);
    };
  }, [anteil]);

  return nahe;
};
