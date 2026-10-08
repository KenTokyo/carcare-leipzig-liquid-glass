// Browserteil des Lektorats-Auszugs (`scripts/lektorat-auszug.mjs`, `npm run lektorat`).
//
// `sammleImBrowser` laeuft per `page.evaluate` IM BROWSER und wird als Text uebertragen: keine Bezuege nach aussen.
// Mehrere Aufrufe auf derselben Seite ergaenzen einander (Zustand in `window.__lk`): erst die Seite, dann je
// aufgeklapptem Akkordeon das Neue, eingereiht direkt hinter dem Schalter, der es geoeffnet hat.
//
// WAS EIN BLOCK IST: das naechste Element um einen Textknoten, das entweder ein Textelement ist (Ueberschrift, Absatz,
// Listenpunkt, Knopf …) oder nicht `display: inline` laeuft. So wird ein Link im Satz Teil des Satzes, ein als Knopf
// gestalteter Link (`inline-flex`) und eine Preisplakette (`inline-block`) aber eine eigene Zeile. Der Text eines Blocks
// besteht NUR aus seinen eigenen Textknoten; verschachtelte Bloecke stehen als eigene Zeilen (kein doppelter Text).
//
// WAS FEHLEN KANN (Waechterfrage aus CLAUDE.md): Text, der nur nach einer Handlung erscheint, die hier nicht ausgeloest
// wird (Formularmeldungen nach dem Absenden, Tooltips, Hover-Zustaende ohne `aria-expanded`). Dafuer liest der Runner
// den Quelltext der Browser-Komponenten (Abschnitt „Erst nach einer Handlung“) und meldet je Route die Wortzahl gegen
// den Suchindex.

export async function sammleImBrowser(opt) {
  const S = (window.__lk ??= {
    n: 0, reihe: [], bloecke: {}, bilder: [], vorlese: [], felder: [],
    geklickt: 0, uebrig: 0, navigiert: false,
  });
  const pfadStart = location.pathname;
  const warte = (ms) => new Promise((r) => setTimeout(r, ms));
  const TEXT_TAGS = new Set(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'P', 'LI', 'DT', 'DD', 'BLOCKQUOTE', 'FIGCAPTION',
    'TD', 'TH', 'LABEL', 'LEGEND', 'SUMMARY', 'BUTTON', 'CAPTION', 'OPTION']);
  const AUS = 'script,style,noscript,template,svg,[data-lektorat="aus"]';
  const sichtbar = (el) => (el.checkVisibility
    ? el.checkVisibility({ visibilityProperty: true, contentVisibilityAuto: true })
    : el.getClientRects().length > 0);
  const norm = (t) => t.replace(/[\u200b\u00ad]/g, '').replace(/[ \t\r\n\f]+/g, ' ').replace(/ ?\u2028 ?/g, '\n').trim();

  const gruppeVon = (el) => {
    if (el.closest('[role="dialog"]')) return 'Dialog';
    if (el.closest('main')) return 'Inhalt';
    return 'Global';
  };
  const blockVon = (el) => {
    let e = el;
    while (e && e !== document.body) {
      if (TEXT_TAGS.has(e.tagName)) return e;
      const d = getComputedStyle(e).display;
      if (d !== 'inline' && d !== 'contents') return e;
      e = e.parentElement;
    }
    return document.body;
  };
  const artVon = (b) => {
    const t = b.tagName;
    if (/^H[1-6]$/.test(t)) return t;
    if (t === 'A') return 'Link';
    if (t === 'BUTTON' || b.getAttribute('role') === 'button') return 'Knopf';
    if (t === 'LI') return 'Liste';
    if (t === 'LABEL' || t === 'LEGEND') return 'Feld';
    if (t === 'TD' || t === 'TH') return 'Tabelle';
    if (t === 'BLOCKQUOTE') return 'Zitat';
    if (t === 'OPTION') return 'Auswahl';
    return 'Text';
  };

  /** Sammelt alle neuen Bloecke unter den Wurzeln; reiht sie hinter `anker` ein (sonst ans Ende). */
  const sammle = (wurzeln, anker) => {
    const neu = [];
    const texte = new Map();
    for (const wurzel of wurzeln) {
      const lauf = document.createTreeWalker(wurzel, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT);
      for (let k = lauf.currentNode; k; k = lauf.nextNode()) {
        if (k.nodeType === 1) {
          if (k.tagName === 'BR') {
            const b = blockVon(k.parentElement);
            if (texte.has(b)) texte.get(b).push('\u2028'); // Zeilenumbruch, uebersteht das Zusammenfassen der Leerzeichen
          }
          continue;
        }
        if (!k.data.trim()) {
          // Leerraum zwischen zwei Inline-Elementen gehoert zum Satz.
          const b = k.parentElement && blockVon(k.parentElement);
          if (b && texte.has(b)) texte.get(b).push(' ');
          continue;
        }
        const el = k.parentElement;
        if (!el || el.closest(AUS) || !sichtbar(el)) continue;
        if (opt.bereich === 'global' && el.closest('main')) continue;
        const b = blockVon(el);
        if (!texte.has(b)) texte.set(b, []);
        texte.get(b).push(k.data);
      }
    }
    for (const [b, teile] of texte) {
      const text = norm(teile.join(''));
      if (!text) continue;
      if (!b.dataset.lkId) b.dataset.lkId = String(++S.n);
      const id = b.dataset.lkId;
      const versteckt = !!b.closest('[aria-hidden="true"]');
      const vorher = S.bloecke[id];
      if (vorher?.text === text) {
        // Einmal offen gesehen (z. B. aufgeklappte FAQ-Antwort) zaehlt: nicht mehr „ausgeblendet“.
        vorher.versteckt = vorher.versteckt && versteckt;
        continue;
      }
      const cs = getComputedStyle(b);
      S.bloecke[id] = {
        id, text, art: artVon(b), gruppe: gruppeVon(b),
        // Listenpunkt oder Absatz, der nur aus einem Link besteht: Ziel mitschreiben (Fusszeile, Menues).
        href: b.tagName === 'A' ? b.getAttribute('href')
          : (b.querySelectorAll('a').length === 1 && norm(b.querySelector('a').textContent) === norm(b.textContent)
            ? b.querySelector('a').getAttribute('href') : null),
        versteckt: vorher ? vorher.versteckt && versteckt : versteckt,
        // `sr-only`: absolut positioniert, 1 px gross, abgeschnitten. Sichtbar nur fuer Vorlesegeraete.
        nurVorlese: cs.position === 'absolute' && parseFloat(cs.width) <= 1 && cs.overflow === 'hidden',
      };
      if (!vorher) neu.push(id);
    }
    const pos = anker ? S.reihe.lastIndexOf(anker) : -1;
    if (pos >= 0) {
      // Hinter dem Anker und hinter dem, was derselbe Anker schon eingereiht hat.
      let ziel = pos + 1;
      while (ziel < S.reihe.length && S.bloecke[S.reihe[ziel]]?.anker === anker) ziel += 1;
      for (const id of neu) S.bloecke[id].anker = anker;
      S.reihe.splice(ziel, 0, ...neu);
    } else {
      S.reihe.push(...neu);
    }

    // Bilder, Vorlesetexte, Formularfelder: je Element einmal.
    for (const wurzel of wurzeln) {
      for (const el of wurzel.querySelectorAll('img, [aria-label], [title], input, textarea, select, video')) {
        if (opt.bereich === 'global' && el.closest('main')) continue;
        if (el.closest(AUS) || el.dataset.lkAttr) continue;
        const gruppe = gruppeVon(el);
        if (el.tagName === 'IMG') {
          if (!sichtbar(el) && !el.closest('[aria-hidden="true"]')) continue;
          el.dataset.lkAttr = '1';
          const datei = (el.currentSrc || el.getAttribute('src') || '').split('/').pop().split('?')[0];
          S.bilder.push({ gruppe, alt: el.getAttribute('alt'), datei });
          continue;
        }
        if (el.tagName === 'SELECT') {
          el.dataset.lkAttr = '1';
          const name = el.labels?.[0]?.textContent?.trim() || el.name;
          S.felder.push({ gruppe, art: 'Auswahl', name, text: [...el.options].map((o) => o.text.trim()).filter(Boolean).join(' · ') });
          continue;
        }
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.dataset.lkAttr = '1';
          const ph = el.getAttribute('placeholder');
          if (ph) S.felder.push({ gruppe, art: 'Platzhalter', name: el.labels?.[0]?.textContent?.trim() || el.name, text: ph });
          if (el.type === 'submit' || el.type === 'button') S.felder.push({ gruppe, art: 'Knopf', name: '', text: el.value });
          continue;
        }
        const label = el.getAttribute('aria-label');
        const titel = el.getAttribute('title');
        const eigen = norm(el.innerText || '');
        el.dataset.lkAttr = '1';
        if (label && norm(label) !== eigen) S.vorlese.push({ gruppe, art: 'aria-label', bei: el.tagName.toLowerCase(), text: norm(label), sichtbar: eigen.slice(0, 80) });
        if (titel && norm(titel) !== eigen && titel !== label) S.vorlese.push({ gruppe, art: 'title', bei: el.tagName.toLowerCase(), text: norm(titel), sichtbar: eigen.slice(0, 80) });
      }
    }
    return neu.length;
  };

  const wurzelnFuer = (bereich) => {
    if (opt.wurzel) return [...document.querySelectorAll(opt.wurzel)];
    if (bereich === 'main') return [document.querySelector('main'), ...document.querySelectorAll('[role="dialog"]')].filter(Boolean);
    if (bereich === 'dialog') return [...document.querySelectorAll('[role="dialog"]')];
    return [document.body];
  };

  // Seite einmal durchscrollen: Inhalte, die erst in Sichtweite einhaengen, sollen da sein.
  if (opt.scrollen) {
    const hoehe = document.documentElement.scrollHeight;
    for (let y = 0; y < hoehe; y += 700) { window.scrollTo(0, y); await warte(70); }
    window.scrollTo(0, 0);
    await warte(300);
  }

  const wurzeln = wurzelnFuer(opt.bereich);
  sammle(wurzeln, opt.anker ?? null);

  // Aufklappen: Knoepfe per Klick, Links per Fokus (am Desktop oeffnet der Fokus die Karte, ein Klick wuerde
  // navigieren). Nur Schalter mit `aria-expanded="false"`, jeder einmal.
  if (opt.aufklappen) {
    const bereichFilter = (el) => (opt.bereich === 'global' ? !el.closest('main') : !!el.closest('main, [role="dialog"]'));
    for (let runde = 0; runde < 80; runde += 1) {
      const schalter = [...document.querySelectorAll('[aria-expanded="false"]')]
        .find((el) => !el.dataset.lkGeklickt && bereichFilter(el) && sichtbar(el));
      if (!schalter) break;
      schalter.dataset.lkGeklickt = '1';
      const ankerBlock = blockVon(schalter);
      if (!ankerBlock.dataset.lkId) sammle([ankerBlock.parentElement ?? ankerBlock], null);
      if (schalter.tagName === 'A') schalter.focus(); else schalter.click();
      S.geklickt += 1;
      await warte(500);
      if (location.pathname !== pfadStart) { S.navigiert = true; break; }
      sammle(wurzelnFuer(opt.bereich), ankerBlock.dataset.lkId ?? null);
    }
    S.uebrig = [...document.querySelectorAll('[aria-expanded="false"]')]
      .filter((el) => !el.dataset.lkGeklickt && bereichFilter(el)).length;
  }

  const kopf = {};
  if (opt.mitKopf) {
    kopf.titel = document.title;
    for (const m of document.querySelectorAll('meta[name="description"], meta[property^="og:"], meta[name^="twitter:"]')) {
      const k = m.getAttribute('name') || m.getAttribute('property');
      if (/description|title|image:alt/.test(k)) kopf[k] = m.getAttribute('content');
    }
    kopf.jsonld = [];
    const FELDER = ['name', 'description', 'headline', 'alternativeHeadline', 'slogan', 'title', 'disambiguatingDescription', 'educationRequirements', 'experienceRequirements', 'responsibilities', 'qualifications'];
    const lauf = (o, pfad) => {
      if (Array.isArray(o)) { o.forEach((x) => lauf(x, pfad)); return; }
      if (!o || typeof o !== 'object') return;
      const typ = o['@type'] ? `${pfad} › ${[].concat(o['@type']).join('/')}` : pfad;
      if (/FAQPage|Question|Answer/.test(typ)) return; // = sichtbare FAQ, geprueft von check-faq-html
      for (const f of FELDER) if (typeof o[f] === 'string' && /\s/.test(o[f])) kopf.jsonld.push({ typ, feld: f, text: o[f] });
      for (const [k, v] of Object.entries(o)) if (typeof v === 'object' && k !== '@context') lauf(v, typ);
    };
    for (const s of document.querySelectorAll('script[type="application/ld+json"]')) {
      try { lauf(JSON.parse(s.textContent), 'JSON-LD'); } catch { /* defektes JSON-LD meldet check-faq-html */ }
    }
  }

  return {
    bloecke: S.reihe.map((id) => S.bloecke[id]),
    bilder: S.bilder, vorlese: S.vorlese, felder: S.felder, kopf,
    geklickt: S.geklickt, uebrig: S.uebrig, navigiert: S.navigiert,
  };
}
