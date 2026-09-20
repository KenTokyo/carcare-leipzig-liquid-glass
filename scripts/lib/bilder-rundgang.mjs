// Rundgang fuer `npm run bilder` (scripts/bilder-inventar.mjs): besucht jede Route in jeder
// Ansicht und liefert jede Bildverwendung mit ihrem Ort im DOM. Keine Auswertung hier — nur messen.
import puppeteer from 'puppeteer';

/**
 * Laeuft IM Browser (Puppeteer serialisiert die Funktion) — deshalb keine Bezuege nach aussen.
 *
 * Ort = Sektion (erste h1/h2) › Gruppe › Karte (h3). Eine Karte ist der erste Vorfahr mit
 * Ueberschrift, sofern darin genau EIN Titel steht; eine Gruppe die letzte Ueberschrift vor der
 * Karte, die nicht zur eigenen Kartenreihe gehoert (z. B. „Ausbildung im Betrieb“ auf /karriere).
 */
export function sammleImBrowser() {
  const text = (el) => (el?.textContent ?? '').replace(/\s+/g, ' ').trim();
  const alle = [...document.querySelectorAll('*')];
  const position = new Map(alle.map((el, i) => [el, i]));
  const ueberschriften = (el) => [...el.querySelectorAll('h1, h2, h3')];
  const zone = (el) => (el.closest('#cc-boot') ? 'boot' : el.closest('footer') ? 'fuss' : el.closest('header, nav') ? 'kopf' : 'inhalt');
  const karteVon = (el, sektion) => {
    for (let a = el.parentElement; a && a !== sektion && a !== document.body; a = a.parentElement) {
      const hs = ueberschriften(a);
      if (!hs.length) continue;
      return new Set(hs.map(text)).size === 1 && hs[0].tagName !== 'H1' ? { el: a, titel: text(hs[0]) } : null;
    }
    return null;
  };
  const gruppeVon = (karte, sektion) => {
    let reihe = karte.el.parentElement;
    while (reihe && reihe !== sektion && new Set(ueberschriften(reihe).map(text)).size < 2) reihe = reihe.parentElement;
    let gruppe = '';
    for (const h of sektion.querySelectorAll('h2, h3')) {
      if (reihe && reihe.contains(h)) continue;
      if (h.compareDocumentPosition(karte.el) & Node.DOCUMENT_POSITION_FOLLOWING) gruppe = text(h);
    }
    return gruppe;
  };
  // Tatsaechlich gewaehlte Quelle; bei noch nicht geladenem <picture> die passende <source>.
  const quelle = (img) => {
    if (img.currentSrc) return img.currentSrc;
    const bild = img.parentElement?.tagName === 'PICTURE' ? img.parentElement : null;
    for (const s of bild ? bild.querySelectorAll('source') : []) {
      if (!s.media || matchMedia(s.media).matches) return (s.getAttribute('srcset') || '').trim().split(/\s+/)[0];
    }
    return img.getAttribute('src');
  };
  const funde = [];
  const melde = (el, art, url, extra = {}) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    const sektion = el.closest('section');
    const titel = sektion ? text(sektion.querySelector('h1, h2')) || sektion.getAttribute('aria-label') || sektion.id : '';
    const karte = sektion ? karteVon(el, sektion) : null;
    const gruppe = karte ? gruppeVon(karte, sektion) : '';
    funde.push({
      art, url, zone: zone(el), position: position.get(el),
      sichtbar: r.width > 1 && r.height > 1 && cs.display !== 'none' && cs.visibility !== 'hidden',
      sektion: sektion ? { id: sektion.id || '', titel, hero: !!sektion.querySelector('h1') } : null,
      karte: karte && karte.titel !== titel ? karte.titel : '',
      gruppe: gruppe !== titel ? gruppe : '',
      ...extra,
    });
  };
  for (const el of alle) {
    if (el.tagName === 'IMG') { const u = quelle(el); if (u) melde(el, 'bild', u); }
    if (el.tagName === 'VIDEO') {
      const poster = el.getAttribute('poster');
      const src = el.currentSrc || el.getAttribute('src') || el.querySelector('source[src]')?.getAttribute('src');
      if (poster) melde(el, 'standbild', poster);
      if (src) melde(el, 'video', src, { standbild: poster || '' });
    }
    for (const pseudo of [null, '::before', '::after']) {
      const bg = getComputedStyle(el, pseudo).backgroundImage;
      if (bg && bg !== 'none') for (const m of bg.matchAll(/url\(["']?([^"')]+)["']?\)/g)) melde(el, 'bild', m[1]);
    }
    if (el.hasAttribute('data-bild-platzhalter')) melde(el, 'platzhalter', null, { label: el.getAttribute('data-bild-platzhalter') });
  }
  const kopf = [];
  for (const m of document.querySelectorAll('meta[property="og:image"], meta[name="twitter:image"]')) {
    kopf.push({ art: m.getAttribute('property') || m.getAttribute('name'), url: m.getAttribute('content') });
  }
  for (const l of document.querySelectorAll('link[rel~="icon"], link[rel="apple-touch-icon"]')) kopf.push({ art: 'favicon', url: l.getAttribute('href') });
  const lauf = (o, typ) => {
    if (Array.isArray(o)) { o.forEach((x) => lauf(x, typ)); return; }
    if (!o || typeof o !== 'object') return;
    const t = o['@type'] ? [].concat(o['@type']).join('/') : typ;
    for (const [k, v] of Object.entries(o)) {
      const werte = [].concat(v).map((x) => (typeof x === 'string' ? x : x?.url)).filter((x) => typeof x === 'string');
      if ((k === 'image' || k === 'logo') && werte.length) werte.forEach((url) => kopf.push({ art: 'jsonld', feld: `${t}.${k}`, url }));
      else if (typeof v === 'object') lauf(v, t);
    }
  };
  for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
    try { lauf(JSON.parse(s.textContent), ''); } catch { /* ungueltiges JSON-LD meldet check-faq-html */ }
  }
  return { funde, kopf, h1: text(document.querySelector('h1')) };
}

/**
 * Besucht jede Route in jeder Ansicht. `--force-prefers-no-reduced-motion`, weil Headless
 * sonst reduzierte Bewegung meldet (Projektgedaechtnis) und die Seite anders rendert, als die
 * meisten Besucher sie sehen.
 */
export async function rundgang({ basis, routen, ansichten, fortschritt = () => {} }) {
  const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
  const ergebnisse = {};
  const probleme = [];
  try {
    for (const route of routen) {
      ergebnisse[route] = {};
      for (const a of ansichten) {
        const seite = await browser.newPage();
        // Preloader ueberspringen: Er deckt die Seite ab. Sein Boot-Layer bleibt im DOM und wird mitgemessen.
        await seite.evaluateOnNewDocument(() => { try { sessionStorage.setItem('cc-preloader-v1', '1'); } catch { /* egal */ } });
        const klein = a.width < 768;
        await seite.setViewport({ width: a.width, height: a.height, deviceScaleFactor: 1, isMobile: klein, hasTouch: klein });
        await seite.goto(basis + route, { waitUntil: 'networkidle0', timeout: 60000 });
        await new Promise((r) => setTimeout(r, 800));
        const erg = await seite.evaluate(sammleImBrowser);
        if (!erg.h1) probleme.push(`${route} @${a.name}: keine h1 — Seite hat nicht gerendert (React-Absturz?)`);
        ergebnisse[route][a.name] = erg;
        await seite.close();
      }
      fortschritt(route);
    }
  } finally {
    await browser.close();
  }
  return { ergebnisse, probleme };
}
