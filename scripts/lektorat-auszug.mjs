// Lektorats-Auszug: der Text jeder Route so, wie ein Besucher ihn sieht, mit mechanischer Vorpruefung.
// Planung: `docs/lektorat/tasks/2026-10-06-lektorat-seitenweise-tasks.md` · Stilblatt: `docs/lektorat/stilblatt.md`
//
// AUFRUF
//   npm run lektorat                    alle Routen und die globalen Bausteine
//   npm run lektorat -- karriere kontakt nur diese Routen (ohne fuehrenden Schraegstrich, Git Bash schreibt
//                                        „/route“ sonst zu einem Pfad um); „start“ = Startseite
//   npm run lektorat -- --global        nur die globalen Bausteine
//
// AUSGABE (output/ ist nicht versioniert)
//   output/lektorat/auszuege/<route>.md  Kopf, Inhalt in Lesereihenfolge (nummerierte Zeilen Z1 …), nur mobil,
//                                        Dialoge, Bilder, Vorlesetexte, Formularfelder, JSON-LD, Vorpruefung
//   output/lektorat/auszuege/00-global.md Navigation, Fusszeile, Leisten, Anfrage-Dialog, Suche, 404, dazu Texte,
//                                        die erst nach einer Handlung erscheinen (aus dem Quelltext)
//   output/lektorat/uebersicht.md        je Route: Woerter gegen Suchindex, Schalter, Funde
//   output/lektorat/funde.json           alle Funde maschinenlesbar
//
// WIE: `vite preview` gegen `dist/` (bricht ab, wenn `dist/` aelter ist als die Quellen), Puppeteer, Desktop 1440 × 900
// und mobil 390 × 844. Der Browserteil steht in `lib/lektorat-dom.mjs`, die Regeln in `lib/lektorat-pruefung.mjs`.
//
// ⚠️ WAS DIESER AUSZUG BESTEHT, OHNE VOLLSTAENDIG ZU SEIN (Pflichtfrage aus CLAUDE.md):
//  1. Text hinter Handlungen ohne `aria-expanded` (Hover-Tooltips, Reiter, Meldungen nach dem Absenden) fehlt im
//     gerenderten Teil. Gegenmittel: Quelltext-Abschnitt in 00-global.md und der Wortzahlvergleich mit dem Suchindex
//     (Spalte „Index“ in der Uebersicht; deutlich weniger Woerter als der Index heisst: hier fehlt etwas).
//  2. Ein Schalter, der beim Oeffnen einen anderen schliesst, wird trotzdem erfasst (Zwischenstand nach jedem Klick),
//     aber ein Schalter, der erst nach einem anderen erscheint UND nach 80 Runden noch zu ist, nicht: Spalte „übrig“.
//  3. Die Vorpruefung findet nur Muster (siehe Kopf von `lib/lektorat-pruefung.mjs`). Gelesen wird trotzdem alles.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import puppeteer from 'puppeteer';
import { getRoutes } from './routes.mjs';
import { startePreview } from './lib/preview-server.mjs';
import { sammleImBrowser } from './lib/lektorat-dom.mjs';
import { pruefe } from './lib/lektorat-pruefung.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const AUSGABE = path.join(wurzel, 'output', 'lektorat');
const AUSZUEGE = path.join(AUSGABE, 'auszuege');
const DESKTOP = { width: 1440, height: 900, deviceScaleFactor: 1 };
const MOBIL = { width: 390, height: 844, deviceScaleFactor: 1, isMobile: true, hasTouch: true };
const PARALLEL = 3;

const args = process.argv.slice(2);
const nurGlobal = args.includes('--global');
const filter = args.filter((a) => !a.startsWith('--')).map((a) => (a === 'start' || a === '/' ? '/' : `/${a.replace(/^\/+/, '')}`));
const alleRouten = getRoutes().map((r) => r.path);
const routen = nurGlobal ? [] : (filter.length ? filter : alleRouten);
const unbekannt = routen.filter((r) => !alleRouten.includes(r));
if (unbekannt.length) {
  console.error(`[lektorat] Unbekannte Route(n): ${unbekannt.join(', ')}`);
  process.exit(1);
}
const mitGlobal = nurGlobal || !filter.length;

const slug = (r) => (r === '/' ? 'startseite' : r.slice(1).replaceAll('/', '_'));
const woerter = (t) => (t || '').split(/\s+/).filter((w) => /[\p{L}\d]/u.test(w)).length;
const zelle = (t) => String(t ?? '').replaceAll('|', '\\|').replace(/\n/g, ' ⏎ ');
const zeile = (b) => {
  const ziel = b.href ? ` → \`${b.href}\`` : '';
  const art = /^H\d$/.test(b.art) ? `**${b.art}**` : b.art === 'Link' ? `Link${ziel}` : b.art === 'Text' ? (ziel ? `Link${ziel}` : '') : `${b.art}${ziel}`;
  return `${art ? `${art} · ` : ''}${b.text.replace(/\n/g, ' ⏎ ')}${b.versteckt ? ' *(für Vorlesegeräte ausgeblendet)*' : ''}${b.nurVorlese ? ' *(nur für Vorlesegeräte)*' : ''}`;
};

/** Woerter je Route laut Suchindex (Inhalt + FAQ, ohne Kopf und Fuss) als Vergleich fuer die Vollstaendigkeit. */
const indexWoerter = (() => {
  try {
    const s = JSON.parse(fs.readFileSync(path.join(wurzel, 'dist', 'suchindex.json'), 'utf8'));
    return Object.fromEntries(s.seiten.map((e) => [e.u, woerter(e.t) + woerter(e.d)
      + (e.a ?? []).reduce((n, a) => n + woerter(a.h) + woerter(a.x), 0)
      + (e.f ?? []).reduce((n, q) => n + woerter(q.q ?? q.f) + woerter(q.a), 0)]));
  } catch { return {}; }
})();

async function neueSeite(browser, ansicht) {
  const seite = await browser.newPage();
  await seite.setViewport(ansicht);
  await seite.evaluateOnNewDocument('window.__CC_NO_PRELOADER__ = true;');
  return seite;
}

async function laden(seite, url) {
  await seite.goto(url, { waitUntil: 'networkidle0', timeout: 60000 });
  await new Promise((r) => setTimeout(r, 600));
}

/** Eine Route an einer Ansicht: Seite, aufgeklappte Inhalte, Kopf. */
async function auszugRoute(browser, basis, route, ansicht) {
  const seite = await neueSeite(browser, ansicht);
  try {
    await laden(seite, basis + route);
    return await seite.evaluate(sammleImBrowser, { bereich: 'main', aufklappen: true, scrollen: true, mitKopf: true });
  } finally {
    await seite.close();
  }
}

function pruefEintraege(route, erg, mobilNeu) {
  const e = [];
  const nr = new Map(erg.bloecke.map((b, i) => [b, i + 1]));
  for (const b of erg.bloecke) e.push({ ort: `Z${nr.get(b)}`, text: b.text });
  mobilNeu.forEach((b, i) => e.push({ ort: `M${i + 1}`, text: b.text }));
  for (const [k, v] of Object.entries(erg.kopf)) if (typeof v === 'string') e.push({ ort: `Kopf: ${k}`, text: v });
  for (const j of erg.kopf.jsonld ?? []) e.push({ ort: `JSON-LD ${j.typ} › ${j.feld}`, text: j.text, jsonld: true });
  for (const b of erg.bilder) if (b.alt) e.push({ ort: `Bild ${b.datei}`, text: b.alt });
  for (const v of erg.vorlese) e.push({ ort: `${v.art} (${v.bei})`, text: v.text });
  for (const f of erg.felder) e.push({ ort: `${f.art} ${f.name ?? ''}`.trim(), text: f.text });
  return pruefe(e).map((f) => ({ route, ...f }));
}

function schreibeRoute(route, desk, mobil, stand) {
  const desktopTexte = new Set(desk.bloecke.map((b) => b.text));
  const mobilNeu = mobil.bloecke.filter((b) => !desktopTexte.has(b.text) && !b.versteckt);
  // Ausgeblendete Doppelungen (z. B. senkrechte Kartentitel „Fahrzeugaufbereitung“ neben „Fahrzeugaufbereitung•“) nur
  // zeigen, wenn ihr Wortlaut sonst nirgends steht, und dann nur einmal (Plaketten „Care“/„Repair“ an jeder Karte).
  const schluessel = (t) => t.replace(/[^\p{L}\p{N}]+/gu, ' ').trim().toLowerCase();
  const sichtbareTexte = new Set(desk.bloecke.filter((b) => !b.versteckt).map((b) => schluessel(b.text)));
  const schonGezeigt = new Set();
  const bloecke = desk.bloecke.filter((b) => {
    if (!b.versteckt) return true;
    const s = schluessel(b.text);
    if (sichtbareTexte.has(s) || schonGezeigt.has(s)) return false;
    schonGezeigt.add(s);
    return true;
  });
  const erg = { ...desk, bloecke };
  const funde = pruefEintraege(route, erg, mobilNeu);
  const inhalt = bloecke.filter((b) => b.gruppe !== 'Dialog');
  const dialoge = bloecke.filter((b) => b.gruppe === 'Dialog');
  const nInhalt = inhalt.reduce((n, b) => n + woerter(b.text), 0);
  const md = [
    `# Auszug: \`${route}\``, '',
    `${stand} · Desktop 1440 × 900 und mobil 390 × 844 · aufgeklappt: ${desk.geklickt} Schalter, übrig: ${desk.uebrig}${desk.navigiert ? ' · ⚠️ ein Schalter hat die Seite gewechselt' : ''}`,
    `Wörter im Inhalt: **${nInhalt}** (Suchindex: ${indexWoerter[route] ?? '–'}) · Vorprüfung: **${funde.filter((f) => f.art === 'K').length} K**, ${funde.filter((f) => f.art === 'H').length} H`, '',
    '## Kopf', '', '| Feld | Zeichen | Text |', '|---|---|---|',
    ...Object.entries(desk.kopf).filter(([, v]) => typeof v === 'string').map(([k, v]) => `| ${k} | ${v.length} | ${zelle(v)} |`), '',
    '## Inhalt (Desktop, Lesereihenfolge)', '',
  ];
  bloecke.forEach((b, i) => { if (b.gruppe !== 'Dialog') md.push(`- **Z${i + 1}** ${zeile(b)}`); });
  if (mobilNeu.length) { md.push('', '## Nur mobil (steht so nicht am Desktop)', ''); mobilNeu.forEach((b, i) => md.push(`- **M${i + 1}** ${zeile(b)}`)); }
  if (dialoge.length) { md.push('', '## Dialoge (öffnen sich auf dieser Seite selbst)', ''); bloecke.forEach((b, i) => { if (b.gruppe === 'Dialog') md.push(`- **Z${i + 1}** ${zeile(b)}`); }); }
  if (desk.bilder.length) {
    md.push('', '## Bilder', '', '| Datei | alt |', '|---|---|');
    for (const b of desk.bilder) md.push(`| ${zelle(b.datei)} | ${b.alt === null ? '*(ohne alt)*' : b.alt === '' ? '*(dekorativ)*' : zelle(b.alt)} |`);
  }
  if (desk.vorlese.length) {
    md.push('', '## Vorlesetexte (`aria-label`, `title`), wenn sie vom sichtbaren Text abweichen', '', '| Art | Element | Vorlesetext | sichtbar |', '|---|---|---|---|');
    for (const v of desk.vorlese) md.push(`| ${v.art} | ${v.bei} | ${zelle(v.text)} | ${zelle(v.sichtbar)} |`);
  }
  if (desk.felder.length) {
    md.push('', '## Formularfelder', '', '| Art | Feld | Text |', '|---|---|---|');
    for (const f of desk.felder) md.push(`| ${f.art} | ${zelle(f.name)} | ${zelle(f.text)} |`);
  }
  if (desk.kopf.jsonld?.length) {
    md.push('', '## Strukturierte Daten (JSON-LD, ohne FAQ)', '', '| Typ | Feld | Text |', '|---|---|---|');
    for (const j of desk.kopf.jsonld) md.push(`| ${zelle(j.typ)} | ${j.feld} | ${zelle(j.text)} |`);
  }
  md.push('', '## Vorprüfung', '');
  if (!funde.length) md.push('Keine bekannten Muster gefunden. Das heißt nicht „fehlerfrei“ (siehe Kopf von `scripts/lib/lektorat-pruefung.mjs`).');
  else {
    md.push('| # | Ort | Art | Regel | Ausschnitt |', '|---|---|---|---|---|');
    funde.forEach((f, i) => md.push(`| ${i + 1} | ${zelle(f.ort)} | ${f.art} | ${zelle(f.regel)} | ${zelle(f.ausschnitt)} |`));
  }
  fs.writeFileSync(path.join(AUSZUEGE, `${slug(route)}.md`), `${md.join('\n')}\n`, 'utf8');
  return { route, woerter: nInhalt, index: indexWoerter[route], geklickt: desk.geklickt, uebrig: desk.uebrig, navigiert: desk.navigiert, funde };
}

/** Texte aus dem Quelltext der Komponenten, deren Text erst nach einer Handlung erscheint. */
function quelltextTexte() {
  const dateien = [
    'components/RequestForm.tsx', 'components/AnfrageDialog.tsx', 'components/JobPopup.tsx', 'components/SuchDialog.tsx',
    'data/anfrageSchema.ts',
    ...fs.readdirSync(path.join(wurzel, 'components', 'formulare')).filter((d) => d.endsWith('.tsx')).map((d) => `components/formulare/${d}`),
  ];
  const klassenartig = (t) => /^[!-]?[a-z0-9]+(?:[:\-/[\].][\w[\]/.%#()-]*)+$/.test(t) || /^[a-z]+$/.test(t);
  const liste = [];
  for (const rel of dateien) {
    const zeilen = fs.readFileSync(path.join(wurzel, rel), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, (m) => m.replace(/[^\n]/g, ' '))
      .split(/\r?\n/).map((z) => z.replace(/(^|\s)\/\/.*$/, '$1'));
    zeilen.forEach((z, i) => {
      const kandidaten = [
        ...[...z.matchAll(/>([^<>{}]*\p{L}{3}[^<>{}]*)</gu)].map((m) => m[1]),
        ...[...z.matchAll(/'([^'\n]{3,})'|"([^"\n]{3,})"|`([^`\n]{3,})`/g)].map((m) => m[1] ?? m[2] ?? m[3]),
      ];
      for (const k of kandidaten) {
        const t = k.trim();
        const tokens = t.split(/\s+/);
        if (!/\p{Lu}\p{Ll}|[äöüß]/u.test(t) || /^[./@,}]|\.(tsx?|mjs|js)$|^https?:/.test(t)) continue;
        // Code statt Text: Tastennamen, Bezeichner in camelCase, Ausdruecke mit Operatoren
        if (/^(Escape|Tab|Enter|ArrowUp|ArrowDown|ArrowLeft|ArrowRight)$/.test(t) || /^[a-z]+[A-Z]\w*$/.test(t) || /=>|===|\?\.|&&/.test(t)) continue;
        if (tokens.filter(klassenartig).length / tokens.length >= 0.5) continue;
        liste.push({ ort: `${rel}:${i + 1}`, text: t.replace(/\$\{[^}]*\}/g, '…') });
      }
    });
  }
  return liste;
}

async function auszugGlobal(browser, basis, stand) {
  const md = ['# Auszug: globale Bausteine', '', `${stand} · Navigation, Fußzeile, Leisten, Dialoge, Suche, 404`, ''];
  const pruef = [];
  const abschnitt = (titel, erg, gruppe, praefix) => {
    const bl = erg.bloecke.filter((b) => !gruppe || b.gruppe === gruppe);
    md.push(`## ${titel}`, '');
    bl.forEach((b, i) => { md.push(`- **${praefix}${i + 1}** ${zeile(b)}`); if (!b.versteckt) pruef.push({ ort: `${praefix}${i + 1}`, text: b.text }); });
    if (!bl.length) md.push('*(nichts erfasst)*');
    md.push('');
  };
  // Desktop: Kopf, Mega-Menü, Fusszeile, Aussparung
  let seite = await neueSeite(browser, DESKTOP);
  await laden(seite, `${basis}/`);
  let erg = await seite.evaluate(sammleImBrowser, { bereich: 'global', aufklappen: true, scrollen: true });
  abschnitt('Desktop: Navigation, Mega-Menü, Aktions-Pillen, Fußzeile', erg, 'Global', 'G');
  for (const v of erg.vorlese) pruef.push({ ort: `G ${v.art}`, text: v.text });
  for (const b of erg.bilder) if (b.alt) pruef.push({ ort: `G Bild ${b.datei}`, text: b.alt });
  const vorleseD = erg.vorlese;
  // Anfrage-Dialog: die Auswahl „Worum geht es?“ (alle Wege fuehren in dieselbe Auswahl, nur die Vorauswahl wechselt)
  await seite.evaluate(() => { window.__lk = undefined; });
  await seite.evaluate(() => [...document.querySelectorAll('button')].find((b) => /Aufbereitung anfragen/.test(b.textContent))?.click());
  await new Promise((r) => setTimeout(r, 900));
  erg = await seite.evaluate(sammleImBrowser, { bereich: 'dialog', aufklappen: false });
  abschnitt('Anfrage-Dialog: Auswahl (Pille „Aufbereitung anfragen“)', erg, null, 'D');
  await seite.keyboard.press('Escape');
  await new Promise((r) => setTimeout(r, 600));
  // Die Formulare selbst: auf /kontakt stehen sie als Seiteninhalt, der Reiter folgt dem Sprungziel.
  const formulare = [['Formular Aufbereitungstermin', 'contact-termin', 'FT'], ['Formular Geschäftskunden', 'contact-business', 'FB']];
  for (const [titel, ziel, praefix] of formulare) {
    const fs2 = await neueSeite(browser, DESKTOP);
    await laden(fs2, `${basis}/kontakt#${ziel}`);
    const f = await fs2.evaluate(sammleImBrowser, { bereich: 'main', wurzel: '#contact-form', aufklappen: true });
    abschnitt(`${titel} (\`/kontakt#${ziel}\`)`, f, null, praefix);
    md.push('| Art | Feld | Text |', '|---|---|---|', ...f.felder.map((x) => `| ${x.art} | ${zelle(x.name)} | ${zelle(x.text)} |`), '');
    for (const x of f.felder) pruef.push({ ort: `${praefix} ${x.art} ${x.name ?? ''}`, text: x.text });
    await fs2.close();
  }
  // Suche: leer und ohne Treffer
  await seite.evaluate(() => { window.__lk = undefined; });
  await seite.keyboard.down('Control'); await seite.keyboard.press('k'); await seite.keyboard.up('Control');
  await new Promise((r) => setTimeout(r, 900));
  erg = await seite.evaluate(sammleImBrowser, { bereich: 'dialog', aufklappen: false });
  abschnitt('Suchdialog: geöffnet', erg, null, 'S');
  await seite.keyboard.type('xqzvw');
  await new Promise((r) => setTimeout(r, 1200));
  await seite.evaluate(() => { window.__lk = undefined; });
  erg = await seite.evaluate(sammleImBrowser, { bereich: 'dialog', aufklappen: false });
  abschnitt('Suchdialog: keine Treffer', erg, null, 'SK');
  await seite.close();

  // Mobil: Kopf mit Menue, Aktionsleiste, Fusszeile
  seite = await neueSeite(browser, MOBIL);
  await laden(seite, `${basis}/`);
  erg = await seite.evaluate(sammleImBrowser, { bereich: 'global', aufklappen: true, scrollen: true });
  abschnitt('Mobil: Menü, Aktionsleiste, Fußzeile', erg, null, 'GM');
  for (const v of erg.vorlese) if (!vorleseD.some((x) => x.text === v.text)) pruef.push({ ort: `GM ${v.art}`, text: v.text });
  await seite.close();

  // 404
  seite = await neueSeite(browser, DESKTOP);
  await laden(seite, `${basis}/lektorat-gibt-es-nicht`);
  erg = await seite.evaluate(sammleImBrowser, { bereich: 'main', aufklappen: false, mitKopf: true });
  abschnitt('404-Seite', erg, null, 'N');
  pruef.push({ ort: 'N Titel', text: erg.kopf.titel });
  await seite.close();

  // Vorlesetexte global
  if (vorleseD.length) {
    md.push('## Vorlesetexte global (Desktop)', '', '| Art | Element | Vorlesetext | sichtbar |', '|---|---|---|---|');
    for (const v of vorleseD) md.push(`| ${v.art} | ${v.bei} | ${zelle(v.text)} | ${zelle(v.sichtbar)} |`);
    md.push('');
  }
  // Quelltext
  const quelle = quelltextTexte();
  md.push('## Erst nach einer Handlung (aus dem Quelltext, ohne Kommentare)', '', '| Ort | Text |', '|---|---|');
  for (const q of quelle) { md.push(`| \`${q.ort}\` | ${zelle(q.text)} |`); pruef.push({ ort: q.ort, text: q.text }); }
  const funde = pruefe(pruef).map((f) => ({ route: 'global', ...f }));
  md.push('', '## Vorprüfung', '', '| # | Ort | Art | Regel | Ausschnitt |', '|---|---|---|---|---|');
  funde.forEach((f, i) => md.push(`| ${i + 1} | ${zelle(f.ort)} | ${f.art} | ${zelle(f.regel)} | ${zelle(f.ausschnitt)} |`));
  fs.writeFileSync(path.join(AUSZUEGE, '00-global.md'), `${md.join('\n')}\n`, 'utf8');
  return { route: '(global)', woerter: pruef.reduce((n, p) => n + woerter(p.text), 0), funde };
}

const { basis, stopp } = await startePreview(4185);
const stand = `Build vom ${new Date(fs.statSync(path.join(wurzel, 'dist', 'index.html')).mtimeMs).toLocaleString('de-DE')}`;
fs.mkdirSync(AUSZUEGE, { recursive: true });
const browser = await puppeteer.launch({ headless: 'new', args: ['--force-prefers-no-reduced-motion'] });
const ergebnisse = [];
try {
  if (mitGlobal) {
    ergebnisse.push(await auszugGlobal(browser, basis, stand));
    console.log('[lektorat] global fertig');
  }
  const offen = [...routen];
  const arbeiter = async () => {
    for (let r = offen.shift(); r; r = offen.shift()) {
      const desk = await auszugRoute(browser, basis, r, DESKTOP);
      const mobil = await auszugRoute(browser, basis, r, MOBIL);
      ergebnisse.push(schreibeRoute(r, desk, mobil, stand));
      console.log(`[lektorat] ${r}: ${desk.bloecke.length} Blöcke, ${desk.geklickt} aufgeklappt`);
    }
  };
  await Promise.all(Array.from({ length: PARALLEL }, arbeiter));
} finally {
  await browser.close();
  stopp();
}

// Uebersicht
const reihe = ['(global)', ...alleRouten];
ergebnisse.sort((a, b) => reihe.indexOf(a.route) - reihe.indexOf(b.route));
const ueb = ['# Lektorat: Übersicht der Auszüge', '', `${stand} · Auszüge in \`output/lektorat/auszuege/\``, '',
  '| Route | Wörter | Index | Schalter | übrig | K | H |', '|---|---|---|---|---|---|---|'];
for (const e of ergebnisse) {
  const knapp = e.index && e.woerter < e.index * 0.9 ? ' ⚠️' : '';
  ueb.push(`| \`${e.route}\` | ${e.woerter}${knapp} | ${e.index ?? '–'} | ${e.geklickt ?? '–'} | ${e.uebrig ?? '–'}${e.navigiert ? ' ⚠️' : ''} | ${e.funde.filter((f) => f.art === 'K').length} | ${e.funde.filter((f) => f.art === 'H').length} |`);
}
ueb.push('', '⚠️ bei „Wörter“: weniger als 90 % der Wörter des Suchindex, im Auszug fehlt vermutlich Text.');
fs.writeFileSync(path.join(AUSGABE, 'uebersicht.md'), `${ueb.join('\n')}\n`, 'utf8');
fs.writeFileSync(path.join(AUSGABE, 'funde.json'), JSON.stringify(ergebnisse.flatMap((e) => e.funde), null, 1), 'utf8');
const k = ergebnisse.reduce((n, e) => n + e.funde.filter((f) => f.art === 'K').length, 0);
const h = ergebnisse.reduce((n, e) => n + e.funde.filter((f) => f.art === 'H').length, 0);
console.log(`[lektorat] ${ergebnisse.length} Auszüge, Vorprüfung: ${k} K, ${h} H · output/lektorat/uebersicht.md`);
