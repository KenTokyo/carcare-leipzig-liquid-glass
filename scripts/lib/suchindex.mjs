// Suchindex der globalen Suche (`components/SuchDialog.tsx`, `lib/suche.ts`).
//
// ENTSTEHT IM PRERENDER (`scripts/prerender.mjs`): Dort ist jede Route ohnehin in einem echten
// Browser geladen und durchgescrollt — inklusive des erprobten Sonderwegs fuer Chromium auf
// Vercel. Ein eigenes Skript haette einen zweiten Browserstart und eine zweite Kopie dieser
// Vercel-Logik gebraucht (deren Versionspaarung ist exakt, siehe dort).
//
// WAS HINEINKOMMT, je Route:
//   Titel (ohne Markenzusatz) und Meta-Beschreibung · je Sektion Ueberschrift, Anker und Text ·
//   die FAQ als Frage/Antwort aus dem FAQPage-JSON-LD der Seite (dieselbe Quelle, die
//   `check-faq-html` gegen den sichtbaren Text prueft).
// WAS NICHT: Navigation, Kopf und Fuss (stehen auf jeder Seite, liegen ausserhalb von <main>), alles mit `aria-hidden`
//   (z. B. die senkrechten Kartentitel — sie doppeln den Text der Textbox), Platzhalter,
//   was per `display: none` nicht gerendert ist (Mobil-/Desktop-Doppelungen), und der Text der
//   FAQ-Sektion selbst (sonst stuende jede Frage zweimal im Index).
//
// ⚠️ WAS DIE PRUEFUNG UNTEN BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST:
//  1. Sie prueft Menge, nicht Sinn: Jede Seite braucht einen Titel und mindestens 200 Zeichen
//     Text. Ein Auszug, der nur Knopfbeschriftungen einsammelt, kaeme bei langen Seiten durch.
//  2. Sie prueft nicht, ob gefunden wird, was man sucht — dafuer gibt es die Stichproben in der
//     Planung (`docs/startseite-karten-aktionen/tasks/2026-09-24-aussparung-oben-rechts-und-suche-tasks.md`).
//  3. Anker: Eine Sektion ohne `id` bekommt keinen Anker, der Treffer springt dann an den
//     Seitenanfang. Das ist gewollt (kein Fehler), aber unpraezise.

/**
 * Laeuft IM BROWSER (`page.evaluate`). Keine Bezuege nach aussen — die Funktion wird als Text
 * uebertragen.
 */
export const SUCH_AUSZUG = () => {
  // `header`/`footer` NICHT: Durchsucht wird nur innerhalb der Sektionen von <main>, Seitenkopf
  // und -fuss liegen ausserhalb. Innerhalb einer Sektion traegt ein <header> oft die Einleitung.
  // `nav` schon: Innerhalb von <main> sind das Brotkrumen und Inhaltsverzeichnisse.
  const AUSSCHLUSS = [
    'nav', 'script', 'style', 'noscript', 'svg', 'video',
    '[aria-hidden="true"]', '[data-platzhalter-label]', '[data-bild-platzhalter]', '[data-videoplatz]',
    '[data-suche="aus"]',
    // Handlungsknoepfe („Smart Repair anfragen", „Direkt anrufen") — Beschriftung, kein Inhalt.
    // Sie standen sonst in jedem zweiten Trefferausschnitt (gesehen 2026-09-24 bei „Smart Repair").
    '.cc-gradient-button',
    // Kennzeichnung KI-erzeugter Bilder am Bild („KI-generiert", `KiMarke`) — Pflichtangabe zum
    // Bild, kein Seitentext. Stand sonst am Ende von Trefferausschnitten (gesehen 2026-09-24).
    '.cc-ki-marke',
  ].join(',');
  const eng = (t) => t.replace(/\s+/g, ' ').trim();

  const textVon = (wurzel, ohne) => {
    const teile = [];
    const gehe = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT);
    while (gehe.nextNode()) {
      const knoten = gehe.currentNode;
      const el = knoten.parentElement;
      if (!el || !knoten.textContent.trim()) continue;
      if (el.closest(AUSSCHLUSS)) continue;
      if (ohne && ohne.some((o) => o.contains(el))) continue;
      // `display: none` (auch geerbt) — Mobil-/Desktop-Fassungen desselben Textes. Deckkraft
      // zaehlt bewusst NICHT: Einblend-Animationen und eingeklappte Karten sind Inhalt.
      if (el.checkVisibility && !el.checkVisibility()) continue;
      teile.push(knoten.textContent);
    }
    return eng(teile.join(' '));
  };

  const titelRoh = eng(document.title || '');
  const t = titelRoh.replace(/\s*[|–—-]\s*CarCare Center.*$/i, '').trim() || titelRoh;
  const d = eng(document.querySelector('meta[name="description"]')?.getAttribute('content') ?? '');

  // FAQ aus dem JSON-LD (FAQPage kann einzeln, in einer Liste oder in @graph stehen).
  const fragen = [];
  const sammle = (o) => {
    if (Array.isArray(o)) return o.forEach(sammle);
    if (!o || typeof o !== 'object') return;
    const typ = [].concat(o['@type'] ?? []);
    if (typ.includes('FAQPage')) {
      for (const q of [].concat(o.mainEntity ?? [])) {
        const frage = eng(q?.name ?? '');
        const antwort = eng(q?.acceptedAnswer?.text ?? '');
        if (frage && antwort) fragen.push({ q: frage, a: antwort });
      }
    }
    if (o['@graph']) sammle(o['@graph']);
  };
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try {
      sammle(JSON.parse(s.textContent));
    } catch {
      /* kaputtes JSON-LD meldet check-faq-html */
    }
  }

  // Die Sektion, in der die FAQ sichtbar steht: dort, wo die erste Frage als Text vorkommt.
  let faqSektion = null;
  if (fragen.length) {
    const erste = fragen[0].q;
    const kandidat = [...document.querySelectorAll('main button, main summary, main h3, main dt')]
      .find((el) => eng(el.textContent).includes(erste));
    faqSektion = kandidat?.closest('section') ?? null;
  }

  const main = document.querySelector('main');
  const sektionen = main
    ? [...main.querySelectorAll('section')].filter((s) => !s.parentElement?.closest('section'))
    : [];
  const a = [];
  for (const s of sektionen) {
    if (s === faqSektion) continue;
    const kopf = s.querySelector('h1, h2');
    const h = kopf ? eng(kopf.textContent) : t;
    const x = textVon(s, kopf ? [kopf] : null).slice(0, 4000);
    if (x.length < 40) continue;
    a.push({ h, id: s.id || kopf?.id || null, x });
  }
  // Seite ohne Sektionen (sollte nicht vorkommen): der ganze Inhalt als ein Abschnitt.
  if (!a.length && main) {
    const x = textVon(main, faqSektion ? [faqSektion] : null).slice(0, 4000);
    if (x.length >= 40) a.push({ h: t, id: null, x });
  }

  return { u: location.pathname, t, d, a, f: fragen, fid: faqSektion?.id || null };
};

/**
 * Prueft die gesammelten Seiten und liefert eine Fehlerliste (leer = in Ordnung).
 * Ein Index, der still Seiten oder Inhalt verliert, waere „gruen, aber kaputt": Die Suche fande
 * dann schlicht nichts, und niemand wuerde es merken.
 */
export function pruefeSuchindex(seiten, erwarteteRouten) {
  const fehler = [];
  const vorhanden = new Map(seiten.map((s) => [s.u, s]));
  for (const route of erwarteteRouten) {
    const s = vorhanden.get(route);
    if (!s) {
      fehler.push(`${route}: fehlt im Suchindex`);
      continue;
    }
    if (!s.t) fehler.push(`${route}: kein Seitentitel`);
    const textlaenge = s.a.reduce((n, x) => n + x.x.length, 0);
    if (textlaenge < 200) fehler.push(`${route}: nur ${textlaenge} Zeichen Text im Index (mindestens 200)`);
  }
  return fehler;
}

/**
 * Entfernt Abschnitte und Fragen, die auf einer frueheren Seite schon wortgleich stehen.
 *
 * WARUM: Der Expertise-Block am Ende der Unterseiten („Glasurit-Lackpartner und Meisterbetrieb …",
 * Kundenvorgabe, siehe CLAUDE.md) steht auf fast jeder Seite gleich. Ohne das lieferte „Glasurit"
 * zwanzig identische Treffer (gemessen 2026-09-24). Behalten wird das erste Vorkommen in der
 * Routenreihenfolge — der Treffer fuehrt auf eine Seite, auf der der Block steht.
 * Laeuft NACH `pruefeSuchindex`: Die Pruefung soll den Auszug bewerten, nicht die Entdopplung.
 */
export function entdopple(seiten) {
  const gesehen = new Set();
  const schluessel = (kopf, text) => `${kopf}|${text.slice(0, 300)}`.toLowerCase();
  let weg = 0;
  const ergebnis = seiten.map((s) => {
    const a = s.a.filter((x) => {
      const k = schluessel(x.h, x.x);
      if (gesehen.has(k)) { weg++; return false; }
      gesehen.add(k);
      return true;
    });
    const f = s.f.filter((x) => {
      const k = schluessel(`faq:${x.q}`, x.a);
      if (gesehen.has(k)) { weg++; return false; }
      gesehen.add(k);
      return true;
    });
    return { ...s, a, f };
  });
  return { seiten: ergebnis, weg };
}
