#!/usr/bin/env node
/**
 * Bildinventar der ausgelieferten Website: jede Bildstelle mit fester Nummer (B1, B2 …).
 *
 * Nutzung:
 *   npm run build                    # braucht ein aktuelles dist/ (vite preview startet von selbst)
 *   npm run bilder                   # schreibt docs/bilder/README.md + output/bilder/bilder-uebersicht.html
 *   npm run bilder -- --trotzdem     # auch wenn dist/ aelter ist als Quellcode oder Bilder
 *
 * WOZU: Der Kunde meldet Bildwuensche nach Ort („das Bild bei Smart Repair“). Eine Datei steht
 * aber oft an vielen Stellen, wer sie tauscht, aendert alle. Die Liste nennt je Stelle Ort, Datei
 * und Datum der letzten Aenderung und je Datei alle ihre Stellen.
 *
 * WIE: Rundgang im Browser (scripts/lib/bilder-rundgang.mjs) ueber alle Routen aus
 * scripts/routes.mjs, Desktop (1440) und Smartphone (390). Gemessen wird das DOM, nicht der
 * Quellcode. Der Ort kommt aus den echten Ueberschriften: Seite › Sektion › Gruppe › Karte.
 * Motiv, Herkunft und offene Backlog-Punkte je Datei pflegt der Mensch in docs/bilder/motive.json.
 *
 * FESTE NUMMERN (docs/bilder/nummern.json): Der User nutzt Nummern als Absprache. Eine Stelle
 * behaelt ihre Nummer, wenn das Bild getauscht wird (der Schluessel enthaelt keinen Dateinamen),
 * und auch dann, wenn sich nur ihr Titel aendert, das Bild aber bleibt. Neue Stellen bekommen die
 * naechste freie Nummer. Entfallene Nummern werden nie neu vergeben.
 *
 * ⚠️ WAS DIESE LISTE ZEIGT, OHNE VOLLSTAENDIG ZU SEIN (Pflichtfrage aus CLAUDE.md, siehe
 * docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md):
 *  1. Bilder, die erst nach einer Interaktion ins DOM kommen (Dialog, Klick), sieht der Rundgang
 *     nicht. Gegenprobe: Jeder Bildpfad aus dem Quellcode, den der Rundgang nicht sah, steht in der
 *     Ausgabe unter „Im Code, beim Rundgang nicht gesehen“.
 *  2. Nur zwei Breiten. Ein Motiv nur fuer Tablet (768–1023 px) faellt durch. Sichtbar wird es
 *     ueber dieselbe Gegenprobe, sofern der Pfad im Code steht.
 *  3. Sektionshintergruende, die das Bild der aktiven Karte spiegeln, zeigen beim Rundgang nur die
 *     erste Karte. Sie sind keine eigene Stelle (keine eigene Datei) und stehen als Hinweis da.
 *  4. Ein veraltetes dist/ liefert eine richtige Liste des FALSCHEN Stands. Deshalb Abbruch, wenn
 *     Quellcode oder Bilder juenger sind als dist/index.html.
 *  5. Das Datum stammt aus Git, und zwar fuer den INHALT: erster Commit mit genau diesem Bild, egal
 *     unter welchem Namen. Umbenennen ist keine Anpassung. Neuer, noch nicht committeter Inhalt
 *     hat kein solches Datum und wird als „nicht committet“ ausgewiesen.
 *  6. „0 Bilder“ auf einer Seite ist kein Befund, wenn die Seite nicht gerendert hat. Fehlt die h1
 *     (React-Absturz nach dem Mount), bricht das Skript ab, statt eine leere Seite zu melden.
 *  7. Eine Umbenennung wird nur erkannt, wenn Bild und Rahmen gleich bleiben. Aendern sich Titel
 *     UND Bild zugleich, entsteht eine neue Nummer. Die alte steht dann unter „Entfallene Nummern“
 *     mit ihrem letzten Ort, sichtbar und nicht stillschweigend.
 */
import sharp from 'sharp';
import fs from 'node:fs';
import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { startePreview } from './lib/preview-server.mjs';
import { rundgang } from './lib/bilder-rundgang.mjs';
import { schreibeKontaktbogen } from './lib/bilder-kontaktbogen.mjs';
import { getRoutes } from './routes.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ASSETS = path.join(wurzel, 'public', 'assets');
const DOCS = path.join(wurzel, 'docs', 'bilder');
const DATEI_NUMMERN = path.join(DOCS, 'nummern.json');
const DATEI_MOTIVE = path.join(DOCS, 'motive.json');
const DATEI_MD = path.join(DOCS, 'README.md');
const DATEI_HTML = path.join(wurzel, 'output', 'bilder', 'bilder-uebersicht.html');
const trotzdem = process.argv.includes('--trotzdem');

const ANSICHTEN = [
  { name: 'desktop', label: 'Desktop', width: 1440, height: 900 },
  { name: 'mobil', label: 'Smartphone', width: 390, height: 844 },
];
const WISSEN = '/autoaufbereitung-wissen/';
const SEITENNAMEN = {
  alle: 'Auf allen Seiten',
  '/': 'Startseite',
  '/leistungen': 'Leistungen (Übersicht)',
  '/unfallinstandsetzung-leipzig': 'Unfallinstandsetzung',
  '/fahrzeugaufbereitung-leipzig': 'Fahrzeugaufbereitung',
  '/leasingrueckgabe-leipzig': 'Leasingrückgabe',
  '/aussenaufbereitung-leipzig': 'Außenaufbereitung',
  '/innenaufbereitung-leipzig': 'Innenaufbereitung',
  '/smart-repair-leipzig': 'Smart Repair',
  '/autolackierung-leipzig': 'Neu- und Reparaturlackierung',
  '/dellenentfernung-leipzig': 'Dellenentfernung',
  '/hagelschadenreparatur-leipzig': 'Hagelschadenreparatur',
  '/felgenreparatur-leipzig': 'Felgenreparatur',
  '/fuhrparkservice-leipzig': 'Fuhrparkservice',
  '/autoglas-leipzig': 'Autoglas & Scheibenfolien',
  '/privatkunden': 'Privatkunden',
  '/geschaeftskunden': 'Geschäftskunden',
  '/ueber-uns': 'Über uns',
  '/kontakt': 'Kontakt',
  '/karriere': 'Karriere',
  '/autoaufbereitung-wissen': 'Wissen (Übersicht)',
  '/impressum': 'Impressum',
  '/datenschutz': 'Datenschutz',
};
const LADEBILDSCHIRM = 'Ladebildschirm beim ersten Aufruf der Startseite';

/** Logos, Siegel, Embleme: keine Fotos, eigene Tabelle. */
const istGrafik = (datei) => /^(carcare-center-|partner\/|eu-emblem|carcare-button-gradient)/.test(datei);
const istLokal = (datei) => !/^https?:/.test(datei);
const datumDE = (iso) => (iso ? iso.slice(0, 10).split('-').reverse().join('.') : '—');
/** Kuerzt an der letzten Wortgrenze, damit kein „bis zur Ve…“ mitten im Wort steht. */
const kurz = (s, n = 60) => {
  const t = String(s).replace(/\.$/, '');
  if (t.length <= n) return t;
  const schnitt = t.slice(0, n - 1);
  const leer = schnitt.lastIndexOf(' ');
  return `${(leer > 0 ? schnitt.slice(0, leer) : schnitt).replace(/[\s,–-]+$/, '')} …`;
};
const slug = (s) => String(s).toLowerCase().normalize('NFKD').replace(/[^\w]+/g, '-').replace(/^-|-$/g, '').slice(0, 50);
const zelle = (s) => String(s ?? '').replace(/\|/g, '\\|').replace(/\n/g, ' ');
const git = (...args) => { try { return execFileSync('git', args, { cwd: wurzel, encoding: 'utf8' }).trim(); } catch { return ''; } };
const uhrzeit = (ms) => new Date(ms).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' });
/**
 * Datum in ORTSZEIT als JJJJ-MM-TT. `toISOString()` liefert UTC: Ein Lauf um 00:04 Uhr stand deshalb als
 * „23.09., 00:04" im Kopf, obwohl er am 24.09. lief — Datum in UTC, Uhrzeit in Ortszeit (bis 2026-09-25).
 */
const lokalISO = (ms = Date.now()) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

/* ------------------------------------------------------------------ */
/* 0. Ist dist/ aktuell?                                               */
/* ------------------------------------------------------------------ */
const distIndex = path.join(wurzel, 'dist', 'index.html');
if (!fs.existsSync(distIndex)) {
  console.error('[bilder] dist/ fehlt. Zuerst `npm run build`.');
  process.exit(1);
}
const juengste = (p) => {
  if (!fs.existsSync(p)) return 0;
  const st = fs.statSync(p);
  if (!st.isDirectory()) return st.mtimeMs;
  return Math.max(0, ...fs.readdirSync(p).map((n) => juengste(path.join(p, n))));
};
const QUELLEN = ['components', 'pages', 'data', 'seo', 'styles', 'hooks', 'App.tsx', 'index.html', 'index.css', 'public/assets'];
const distZeit = fs.statSync(distIndex).mtimeMs;
const quellZeit = Math.max(...QUELLEN.map((q) => juengste(path.join(wurzel, q))));
if (quellZeit > distZeit && !trotzdem) {
  console.error(`[bilder] dist/ (${new Date(distZeit).toLocaleString('de-DE')}) ist aelter als Quellcode/Bilder`
    + ` (${new Date(quellZeit).toLocaleString('de-DE')}). Zuerst \`npm run build\`, sonst listet das Skript den alten Stand.`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 1. Rundgang                                                         */
/* ------------------------------------------------------------------ */
const routen = getRoutes().map((r) => r.path);
const { basis, stopp } = await startePreview(4194);
let erg;
try {
  erg = await rundgang({ basis, routen, ansichten: ANSICHTEN, fortschritt: () => process.stdout.write('.') });
} finally {
  stopp();
}
const { ergebnisse, probleme } = erg;
console.log(` ${routen.length} Routen × ${ANSICHTEN.length} Ansichten besucht`);
if (probleme.length) {
  console.error(`[bilder] ABBRUCH:\n  - ${probleme.join('\n  - ')}`);
  process.exit(1);
}

/* ------------------------------------------------------------------ */
/* 2. Funde zu Stellen verdichten                                      */
/* ------------------------------------------------------------------ */
const basisHost = new URL(basis).host;
/** Lokal unter /assets/ -> Pfad darunter („kacheln/x.webp“); andere lokale Pfade behalten ihr „/“; extern -> URL. */
const normalisiere = (u) => {
  if (!u || u.startsWith('data:')) return null;
  const x = new URL(u, basis);
  if (x.host !== basisHost) return u;
  const p = decodeURIComponent(x.pathname);
  return p.startsWith('/assets/') ? p.slice('/assets/'.length) : p;
};
const pfadVon = (datei) => (datei.startsWith('/') ? path.join(wurzel, 'public', datei) : path.join(ASSETS, datei));
const seitenName = (route) => SEITENNAMEN[route]
  ?? (route.startsWith(WISSEN) ? `Wissen: ${ergebnisse[route].desktop.h1}` : ergebnisse[route].desktop.h1);

const stellen = new Map();     // Schluessel -> Stelle
const grafik = new Map();      // Datei -> Map(Ort -> Set(Route))
const spiegel = new Map();     // Route -> Set(Sektionsname)
const standbildZu = new Map(); // Video-Datei -> Standbild-Datei
const kopfNutzung = new Map(); // Art|Feld|URL -> Set(Route)
const gesehen = new Set();

const merkeGrafik = (datei, ort, route) => {
  if (!grafik.has(datei)) grafik.set(datei, new Map());
  const orte = grafik.get(datei);
  if (!orte.has(ort)) orte.set(ort, new Set());
  orte.get(ort).add(route);
};

for (const route of routen) {
  for (const a of ANSICHTEN) {
    const { funde, kopf } = ergebnisse[route][a.name];
    for (const k of kopf) {
      const datei = normalisiere(k.url);
      if (!datei) continue;
      gesehen.add(datei);
      if (k.art === 'favicon') { merkeGrafik(datei, 'Favicon (Browser-Tab)', route); continue; }
      const schluessel = `${k.art === 'jsonld' ? `jsonld|${k.feld}` : 'teilen|'}|${datei}`;
      if (!kopfNutzung.has(schluessel)) kopfNutzung.set(schluessel, new Set());
      kopfNutzung.get(schluessel).add(route);
    }
    const sekKey = (f) => f.sektion.id || slug(f.sektion.titel);
    const kartenDateien = new Map();
    for (const f of funde) {
      if (!f.sektion || !f.karte || !f.url) continue;
      const k = sekKey(f);
      if (!kartenDateien.has(k)) kartenDateien.set(k, new Set());
      kartenDateien.get(k).add(normalisiere(f.url));
    }
    for (const f of funde) {
      const datei = f.art === 'platzhalter' ? '' : normalisiere(f.url);
      if (f.art !== 'platzhalter' && !datei) continue;
      if (datei) gesehen.add(datei);
      if (datei && istGrafik(datei)) {
        const sek = f.sektion ? `„${kurz(f.sektion.titel, 50)}“` : 'Seite';
        const ort = f.zone === 'boot' ? LADEBILDSCHIRM : f.zone === 'fuss' ? 'Fußzeile' : f.zone === 'kopf' ? 'Kopfzeile'
          : datei.startsWith('partner/') ? `${sek}${f.karte ? ` › Karte „${kurz(f.karte, 40)}“` : ''}`
            : f.karte ? 'Logo-Plakette in Karten' : sek;
        // Der Boot-Layer steht in index.html und damit im DOM jeder Seite, laeuft aber nur auf „/“.
        merkeGrafik(datei, ort, f.zone === 'boot' ? '/' : route);
        continue;
      }
      if (f.art === 'video' && f.standbild) standbildZu.set(datei, normalisiere(f.standbild));
      const rolle = f.art;
      const zusatz = rolle === 'video' ? ' › Video' : rolle === 'standbild' ? ' › Standbild des Videos' : '';
      let teile;
      let ort;
      if (f.zone === 'boot') { teile = ['alle', 'ladebildschirm', '', '', rolle]; ort = `${LADEBILDSCHIRM}${zusatz}`; }
      else if (f.zone === 'fuss') { teile = ['alle', 'fusszeile', '', '', rolle]; ort = `Fußzeile › Hintergrundbild${zusatz}`; }
      else if (f.zone === 'kopf') { teile = ['alle', 'kopfzeile', '', '', rolle]; ort = `Kopfzeile${zusatz || ' › Bild'}`; }
      else if (!f.sektion) { teile = [route, 'seite', '', '', rolle]; ort = `Titelbild und Seitenhintergrund (bleibt beim Scrollen stehen)${zusatz}`; }
      else {
        const sek = sekKey(f);
        const sekName = `„${kurz(f.sektion.titel)}“`;
        if (rolle === 'platzhalter') { teile = [route, sek, '', f.label, rolle]; ort = `${sekName} › Platzhalter „${f.label}“ (${f.medium === 'video' ? 'Video' : 'Foto'} fehlt)`; }
        else if (f.karte) { teile = [route, sek, f.gruppe, f.karte, rolle]; ort = `${sekName} › ${f.gruppe ? `„${kurz(f.gruppe)}“ › ` : ''}Karte „${kurz(f.karte)}“${zusatz}`; }
        else if (f.sektion.hero) { teile = [route, sek, '', '', rolle === 'bild' ? 'titelbild' : rolle]; ort = `Titelbild (Hero)${zusatz}`; }
        else if (kartenDateien.get(sek)?.has(datei)) {
          if (!spiegel.has(route)) spiegel.set(route, new Set());
          spiegel.get(route).add(sekName);
          continue;
        } else { teile = [route, sek, '', '', rolle]; ort = `${sekName}${zusatz || ' › Bild'}`; }
      }
      const key = teile.join('|');
      if (!stellen.has(key)) stellen.set(key, { teile, ort, reihenfolge: Infinity, ansichten: {}, medium: f.medium ?? '' });
      const s = stellen.get(key);
      s.reihenfolge = Math.min(s.reihenfolge, f.position + (a.name === 'desktop' ? 0 : 1e7));
      const an = (s.ansichten[a.name] ??= new Map());
      an.set(datei, (an.get(datei) ?? false) || f.sichtbar || f.zone === 'boot');
    }
  }
}

// Kopfdaten: auf allen Routen gleich -> eine Stelle „auf allen Seiten“, sonst je Route.
for (const [schluessel, nutzer] of kopfNutzung) {
  const [art, feld, datei] = schluessel.split('|');
  const ort = art === 'teilen'
    ? 'Vorschaubild beim Teilen (WhatsApp, Facebook, LinkedIn: og:image / twitter:image)'
    : `Strukturierte Daten für Google (${feld}), unsichtbar im Seitenquelltext`;
  const ziele = nutzer.size === routen.length ? ['alle'] : [...nutzer];
  for (const route of ziele) {
    const teile = [route, art === 'teilen' ? 'teilen' : `jsonld-${slug(feld)}`, '', '', 'kopf'];
    const beide = new Map([[datei, true]]);
    stellen.set(teile.join('|'), { teile, ort, reihenfolge: art === 'teilen' ? 5e7 : 6e7, ansichten: { desktop: beide, mobil: beide } });
  }
}

// Ansichten zusammenfuehren: gleiche Datei auf Desktop und Smartphone -> eine Zeile.
const zeilen = [];
for (const [key, s] of stellen) {
  const d = s.ansichten.desktop;
  const m = s.ansichten.mobil;
  const sichtbare = (an) => (an ? [...an].filter(([, v]) => v).map(([k]) => k) : []);
  let dd = sichtbare(d);
  let mm = sichtbare(m);
  const nieSichtbar = !dd.length && !mm.length;
  if (nieSichtbar) { dd = d ? [...d.keys()] : []; mm = m ? [...m.keys()] : []; }
  const gleich = dd.length === mm.length && dd.every((x) => mm.includes(x));
  const varianten = gleich ? [['', dd, '']]
    : dd.length && mm.length ? [['desktop', dd, ' · Desktop'], ['mobil', mm, ' · Smartphone']]
      : [['', dd.length ? dd : mm, dd.length ? ' · nur Desktop' : ' · nur Smartphone']];
  for (const [ansicht, dateien, suffix] of varianten) {
    for (const datei of dateien) {
      zeilen.push({
        key: [key, ansicht, dateien.length > 1 ? datei : ''].join('|'),
        rahmen: [s.teile[0], s.teile[1], s.teile[4], ansicht].join('|'),
        seite: s.teile[0],
        ort: s.ort + suffix + (nieSichtbar ? ' (im DOM, aber nicht sichtbar)' : ''),
        datei,
        reihenfolge: s.reihenfolge + (ansicht === 'mobil' ? 0.5 : 0),
        rolle: s.teile[4],
        medium: s.medium,
      });
    }
  }
}
const seitenFolge = ['alle', ...routen];
zeilen.sort((x, y) => seitenFolge.indexOf(x.seite) - seitenFolge.indexOf(y.seite) || x.reihenfolge - y.reihenfolge);

/* ------------------------------------------------------------------ */
/* 3. Feste Nummern                                                    */
/* ------------------------------------------------------------------ */
const heuteISO = lokalISO();
const register = fs.existsSync(DATEI_NUMMERN)
  ? JSON.parse(fs.readFileSync(DATEI_NUMMERN, 'utf8'))
  : { naechste: 1, stellen: {}, entfallen: {} };
const nummernAlt = Object.values(register.stellen).map((v) => v.nr).concat(Object.values(register.entfallen).map((v) => v.nr));
if (new Set(nummernAlt).size !== nummernAlt.length || nummernAlt.some((n) => n >= register.naechste)) {
  console.error('[bilder] ABBRUCH: nummern.json ist inkonsistent (doppelte Nummer oder Nummer >= naechste). Von Hand geaendert? Nicht ueberschreiben.');
  process.exit(1);
}
const neu = {};
const umbenannt = [];
const offen = [];
for (const z of zeilen) {
  if (register.stellen[z.key]) { z.nr = register.stellen[z.key].nr; neu[z.key] = true; } else offen.push(z);
}
const frei = Object.entries(register.stellen).filter(([k]) => !neu[k]);
// Schluessel ohne Rolle (Teil 5 von route|sektion|gruppe|karte|rolle|ansicht|datei).
const ohneRolle = (key) => key.split('|').map((t, i) => (i === 4 ? '' : t)).join('|');
for (const z of offen) {
  let i = frei.findIndex(([, v]) => v.rahmen === z.rahmen && v.datei === z.datei);
  /*
   * Ein Foto wird zum Video mit Standbild (B11, 2026-09-21), oder ein Videoplatzhalter wird
   * zum gelieferten Video (B113–B118, 2026-09-23): Ort und Karte bleiben, nur die ROLLE
   * wechselt — von „bild“ bzw. „platzhalter“ zu „standbild“. Die Nummer gehoert zum Ort, also
   * bleibt sie beim Standbild; das Video selbst ist eine neue Stelle und bekommt die naechste
   * Nummer. Ohne diese Regel waeren die Nummern still „entfallen“ — gegen die Zusage, dass
   * eine Nummer den Bildtausch uebersteht.
   *
   * ⚠️ Der Platzhalterfall ist der WICHTIGERE der beiden: Genau unter diesen Nummern hat der
   * User die fehlenden Videos bestellt. Waeren sie beim Liefern weitergewandert, haette
   * „B113“ in der naechsten Absprache etwas anderes bedeutet als in der letzten.
   */
  if (i < 0 && z.rolle === 'standbild') {
    i = frei.findIndex(([k]) => ['bild', 'platzhalter'].includes(k.split('|')[4]) && ohneRolle(k) === ohneRolle(z.key));
  }
  if (i >= 0) {
    const [, v] = frei.splice(i, 1)[0];
    z.nr = v.nr;
    umbenannt.push({ nr: v.nr, von: v.ort, zu: z.ort });
  } else if (register.entfallen[z.key]) {
    z.nr = register.entfallen[z.key].nr;
    delete register.entfallen[z.key];
  } else z.nr = register.naechste++;
}
for (const [k, v] of frei) register.entfallen[k] = { nr: v.nr, ort: v.ort, datei: v.datei, seit: heuteISO };
register.stellen = Object.fromEntries(zeilen.map((z) => [z.key, { nr: z.nr, ort: z.ort, datei: z.datei, rahmen: z.rahmen }]));
fs.mkdirSync(DOCS, { recursive: true });
fs.writeFileSync(DATEI_NUMMERN, `${JSON.stringify({
  _hinweis: 'Von `npm run bilder` gepflegt. NICHT von Hand umnummerieren: Die Nummern sind Absprachen mit dem Kunden. Eine Nummer wird nie neu vergeben.',
  naechste: register.naechste, stellen: register.stellen, entfallen: register.entfallen,
}, null, 2)}\n`);

/* ------------------------------------------------------------------ */
/* 4. Dateien: Datum, Masse, Motiv, Gegenprobe                         */
/* ------------------------------------------------------------------ */
const motive = JSON.parse(fs.readFileSync(DATEI_MOTIVE, 'utf8'));
const infoCache = new Map();
const info = async (datei) => {
  if (infoCache.has(datei)) return infoCache.get(datei);
  const i = { datum: '', hinweis: '', masse: '', motiv: motive.dateien[datei] ?? {} };
  if (istLokal(datei)) {
    const abs = pfadVon(datei);
    const rel = path.relative(wurzel, abs).split(path.sep).join('/');
    if (fs.existsSync(abs)) {
      const st = fs.statSync(abs);
      // DATUM DES INHALTS, nicht des Dateinamens: Wird eine Datei nur umbenannt (2026-09-21:
      // `autolackierung-…` → `lackierkabine-…`, weil der alte Name dem neuen Foto gehoert), hat sich
      // das Bild an ihren Stellen nicht geaendert. `git log -- pfad` nennte trotzdem den Tag der
      // Umbenennung. Deshalb: der erste Commit, der GENAU DIESEN Inhalt (Blob) einbrachte — egal
      // unter welchem Namen. Neuer Inhalt hat keinen solchen Commit → „nicht committet“.
      const blob = git('hash-object', '--', rel);
      const erster = blob ? git('log', '--reverse', '--format=%cs', `--find-object=${blob}`).split('\n')[0] : '';
      const status = git('status', '--porcelain', '--', rel);
      i.datum = erster || (status ? '' : git('log', '-1', '--format=%cs', '--', rel));
      if (!i.datum && status) i.hinweis = `nicht committet, Datei geändert am ${datumDE(lokalISO(st.mtimeMs))}`;
      const kb = `${Math.round(st.size / 1024)} KB`;
      if (/\.(webp|png|jpe?g|avif|gif)$/i.test(datei)) {
        const meta = await sharp(abs).metadata();
        i.masse = `${meta.width} × ${meta.height} · ${kb}`;
      } else i.masse = kb;
    }
  } else i.hinweis = 'externes Bild';
  infoCache.set(datei, i);
  return i;
};
for (const z of zeilen) if (z.datei) z.info = await info(z.datei);

// Gegenprobe: Dateisystem und Quellcode gegen den Rundgang.
const alleDateien = (dir, pre = '') => fs.readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory()
  ? (e.name === 'fonts' ? [] : alleDateien(path.join(dir, e.name), `${pre}${e.name}/`)) : [`${pre}${e.name}`]));
const imOrdner = alleDateien(ASSETS);
const QUELLCODE = ['components', 'pages', 'data', 'seo', 'styles', 'hooks', 'App.tsx', 'index.html', 'index.css'];
const quellDateien = QUELLCODE.flatMap((q) => {
  const abs = path.join(wurzel, q);
  if (!fs.existsSync(abs)) return [];
  if (!fs.statSync(abs).isDirectory()) return [abs];
  return alleDateien(abs).filter((f) => /\.(tsx?|css|html)$/.test(f)).map((f) => path.join(abs, f));
});
const imCode = new Map(); // Datei/URL -> Set(Quelldatei)
for (const q of quellDateien) {
  // Kommentare raus: Beispielpfade darin („z. B. /assets/galerie/innenraum.jpg“) sind keine Verwendung.
  // `//` nur nach Leerraum/Trennzeichen, sonst fiele das „//“ in „https://“ mit weg.
  const inhalt = fs.readFileSync(q, 'utf8')
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/\/\*[\s\S]*?\*\//g, '')
    .replace(/(^|[\s;{}(),])\/\/[^\n]*/g, '$1');
  const rel = path.relative(wurzel, q).split(path.sep).join('/');
  const treffer = [
    ...[...inhalt.matchAll(/\/assets\/([\w\-./]+\.(?:webp|png|jpe?g|svg|gif|avif|mp4|webm))/g)].map((m) => m[1]),
    ...[...inhalt.matchAll(/kachel\('([^']+)'\)/g)].map((m) => `kacheln/${m[1]}.webp`),
    ...[...inhalt.matchAll(/https:\/\/images\.unsplash\.com\/[^'"\s)`]+/g)].map((m) => m[0]),
  ];
  for (const t of treffer) {
    if (!imCode.has(t)) imCode.set(t, new Set());
    imCode.get(t).add(rel);
  }
}
// Anerkannte Faelle (motive.json → bekannt) stehen mit Begruendung da; nur NEUE bleiben laut.
// Ein Fall, der jedes Mal als „bitte pruefen“ erscheint, wird irgendwann ueberlesen — samt dem echten daneben.
const bekannt = motive.bekannt ?? {};
const nichtGesehenAlle = [...imCode].filter(([d]) => !gesehen.has(d));
const nichtGesehen = nichtGesehenAlle.filter(([d]) => !bekannt[d]);
const nichtGesehenBekannt = nichtGesehenAlle.filter(([d]) => bekannt[d]);
const unbenutzt = imOrdner.filter((d) => !gesehen.has(d) && !imCode.has(d));
const fehlend = [...gesehen].filter(istLokal).filter((d) => !fs.existsSync(pfadVon(d)));
const ohneMotiv = [...new Set(zeilen.map((z) => z.datei).filter(Boolean))].filter((d) => !motive.dateien[d]);
const verwaisteMotive = Object.keys(motive.dateien).filter((d) => istLokal(d) && !imOrdner.includes(d));

// Vermerke je Stelle (motive.json → stellen), vom User gesetzt: „anzupassen“ oder {status, notiz}.
// Ein Vermerk auf einer Nummer, die es nicht gibt, ist ein Tippfehler und wird laut gemeldet —
// sonst waere der Wunsch des Kunden still verschwunden.
// Seit 2026-09-21 auch die Erledigung: „angepasst“ (in dieser Runde getauscht) und „ok“ (der Kunde
// will die Stelle so behalten). So steht Andrés Liste samt Stand an der Stelle, nicht im Chat.
const VERMERKE = {
  anzupassen: { text: 'Anzupassen', zeichen: '🟠' },
  todo: { text: 'Später einfügen', zeichen: '🕓' },
  angepasst: { text: 'Angepasst', zeichen: '✅' },
  ok: { text: 'In Ordnung', zeichen: '🟢' },
};
const stellenVermerke = motive.stellen ?? {};
const vermerkVon = (nr) => {
  const roh = stellenVermerke[`B${nr}`];
  if (!roh) return null;
  const status = typeof roh === 'string' ? roh : roh.status;
  const art = VERMERKE[status];
  if (!art) return { status, text: status, zeichen: '•', notiz: typeof roh === 'object' ? roh.notiz : '' };
  return { status, ...art, notiz: typeof roh === 'object' ? (roh.notiz ?? '') : '' };
};
for (const z of zeilen) z.vermerk = vermerkVon(z.nr);
const vermerkteNummern = new Set(zeilen.filter((z) => z.vermerk).map((z) => `B${z.nr}`));
const unbekannteVermerke = Object.keys(stellenVermerke).filter((k) => !vermerkteNummern.has(k));

/* ------------------------------------------------------------------ */
/* 5. Ausgabe                                                          */
/* ------------------------------------------------------------------ */
const stempel = `${datumDE(heuteISO)}, ${uhrzeit(Date.now())} Uhr`;
const distStempel = `${datumDE(lokalISO(distZeit))}, ${uhrzeit(distZeit)} Uhr`;
const dateiName = (d) => (istLokal(d) ? d.replace(/^\//, '') : 'Unsplash-Stockfoto (extern)');
const datumZelle = (i) => (i?.hinweis && !i.datum ? i.hinweis : datumDE(i?.datum));
const fotoZeilen = zeilen.filter((z) => z.rolle !== 'platzhalter');
const dateienFoto = [...new Set(fotoZeilen.map((z) => z.datei))];
const platzhalter = zeilen.filter((z) => z.rolle === 'platzhalter');
const seitenMitBild = new Set(zeilen.map((z) => z.seite));
const ohneBild = routen.filter((r) => !seitenMitBild.has(r));
const artikelOhneBild = ohneBild.filter((r) => r.startsWith(WISSEN));
const ohneBildText = [...ohneBild.filter((r) => !r.startsWith(WISSEN)).map(seitenName),
  ...(artikelOhneBild.length ? [`alle ${artikelOhneBild.length} Wissensartikel`] : [])];
const stellenJeDatei = new Map();
for (const z of zeilen) {
  if (!z.datei) continue;
  if (!stellenJeDatei.has(z.datei)) stellenJeDatei.set(z.datei, []);
  stellenJeDatei.get(z.datei).push(z);
}
const woGrafik = (orte) => [...orte].map(([ort, r]) => (ort === LADEBILDSCHIRM ? ort
  : `${ort} (${r.size === routen.length ? 'alle Seiten' : [...r].map(seitenName).join(', ')})`)).join('; ');

const md = [];
md.push('# Bilder der Website: jede Stelle mit fester Nummer', '');
md.push(`> **Erzeugt** von \`npm run bilder\` am ${stempel}, gemessen an \`dist/\` vom ${distStempel} (Branch \`${git('branch', '--show-current')}\`).`
  + ` ${routen.length} Seiten, je Desktop (1440 px) und Smartphone (390 px).`);
md.push('> **Nicht von Hand bearbeiten**, der nächste Lauf überschreibt die Datei. Motiv, Herkunft und offene Punkte stehen in'
  + ' [`motive.json`](motive.json), die Nummern in [`nummern.json`](nummern.json).', '');
md.push('## So benutzt du die Liste', '');
md.push('- **Jede Bildstelle hat eine feste Nummer** (B1, B2 …). Sie bleibt, wenn das Bild getauscht wird, und wird nie neu vergeben. Es genügt: „B14 und B27 tauschen“.');
md.push('- **Eine Datei steht oft an mehreren Stellen.** Wer die Datei ersetzt, ändert alle ihre Stellen. Welche das sind, zeigt [Nach Datei](#nach-datei). Soll nur eine Stelle ein anderes Bild bekommen, braucht sie eine eigene Datei.');
md.push('- **Datum der Anpassung** = seit wann genau dieses Bild im Repository liegt (Git, erster Commit mit diesem Inhalt). Umbenennen zählt nicht als Anpassung. Nach einem Tausch `npm run build` und `npm run bilder`, dann stimmt es wieder.');
md.push('- **Mit Vorschaubildern** zum Durchsehen: `output/bilder/bilder-uebersicht.html` (entsteht beim selben Lauf, nur lokal).', '');
md.push('## Überblick', '');
md.push(`- **${fotoZeilen.length} Bildstellen** aus **${dateienFoto.length} Dateien** auf ${[...seitenMitBild].filter((s) => s !== 'alle').length} Seiten, dazu ${platzhalter.length} Platzhalter ohne Foto oder Video.`);
const mehrfach = [...stellenJeDatei].filter(([, l]) => l.length >= 5).sort((a, b) => b[1].length - a[1].length);
if (mehrfach.length) md.push(`- **Am häufigsten verwendet:** ${mehrfach.slice(0, 5).map(([d, l]) => `\`${dateiName(d)}\` (${l.length}×)`).join(', ')}.`);
if (ohneBildText.length) md.push(`- **Seiten ohne eigene Fotos** (nur die Stellen „auf allen Seiten“): ${ohneBildText.join(' · ')}.`);
for (const [status, art] of Object.entries(VERMERKE)) {
  const treffer = zeilen.filter((z) => z.vermerk?.status === status).sort((a, b) => a.nr - b.nr);
  if (!treffer.length) continue;
  if (status !== 'todo') {
    md.push(`- ${art.zeichen} **${art.text} (${treffer.length}):** ${treffer.map((z) => `B${z.nr}`).join(', ')}`);
    continue;
  }
  // „Später einfügen“ nach Notiz gruppiert: Vorschaubild (R7) und Bereichsvideos (R18) sind
  // verschiedene Zulieferungen. Frueher stand hier die Notiz der ERSTEN Stelle fuer alle.
  const gruppen = new Map();
  for (const z of treffer) {
    const notiz = z.vermerk.notiz || '';
    if (!gruppen.has(notiz)) gruppen.set(notiz, []);
    gruppen.get(notiz).push(`B${z.nr}`);
  }
  md.push(`- ${art.zeichen} **${art.text} (${treffer.length}):** ${[...gruppen].map(([notiz, nrn]) => `${nrn.join(', ')}${notiz ? ` — ${notiz}` : ''}`).join('; ')}`);
}
md.push('');
md.push('## Nach Seite', '');
for (const seite of seitenFolge) {
  const liste = zeilen.filter((z) => z.seite === seite);
  if (!liste.length) continue;
  md.push(`### ${seitenName(seite)}${seite === 'alle' ? '' : ` · \`${seite}\``}`, '');
  if (spiegel.has(seite)) {
    md.push(`> Der große Hintergrund von ${[...spiegel.get(seite)].join(', ')} zeigt am Desktop das Bild der gerade aktiven Karte. Keine eigene Datei, er wechselt mit der Karte.`, '');
  }
  md.push('| Nr. | Vermerk | Ort des Bildes | Dateiname | Datum der Anpassung |', '|---|---|---|---|---|');
  for (const z of liste) {
    const v = z.vermerk ? `${z.vermerk.zeichen} **${z.vermerk.text}**${z.vermerk.notiz ? `<br>${zelle(z.vermerk.notiz)}` : ''}` : '';
    md.push(`| **B${z.nr}** | ${v} | ${zelle(z.ort)} | ${z.datei ? `\`${zelle(dateiName(z.datei))}\`` : '—'} | ${z.datei ? zelle(datumZelle(z.info)) : '—'} |`);
  }
  md.push('');
}
md.push('## Nach Datei', '');
md.push('Wer eine Datei ersetzt, ändert alle ihre Stellen. Herkunft nur mit Beleg: **Für die Fotos und das Video der Lieferung vom 21.09.2026 hat der User bestätigt, dass sie echt sind** (weder KI-generiert noch -bearbeitet). Für alle übrigen steht die Angabe noch aus (Backlog R15); bis dahin tragen sie auf der Seite die Plakette „KI-generiert“.', '');
md.push('| Vorschau | Datei | Motiv | Stellen | Datum der Anpassung | Herkunft laut Repository | Offene Punkte |', '|---|---|---|---|---|---|---|');
const vorschauMd = (d) => {
  const bild = /\.mp4$/.test(d) ? standbildZu.get(d) : d;
  if (!bild) return '';
  return istLokal(bild) ? `<img src="../../public/assets/${bild}" width="96" alt="">` : `<img src="${bild.replace('w=2400', 'w=240')}" width="96" alt="">`;
};
const ersteNr = (l) => Math.min(...l.map((z) => z.nr));
for (const [d, l] of [...stellenJeDatei].sort((a, b) => ersteNr(a[1]) - ersteNr(b[1]))) {
  const i = l[0].info ?? {};
  // Vermerkte Stellen tragen ihr Zeichen mit: Wer die Datei tauscht, sieht sofort, welche ihrer Stellen gemeint sind.
  const nrn = [...l].sort((a, b) => a.nr - b.nr).map((z) => `B${z.nr}${z.vermerk ? ` ${z.vermerk.zeichen}` : ''}`).join(', ');
  md.push(`| ${vorschauMd(d)} | \`${zelle(dateiName(d))}\`${i.masse ? `<br>${i.masse}` : ''} | ${zelle(i.motiv?.motiv ?? '*fehlt in motive.json*')}`
    + ` | **${l.length}×** ${nrn} | ${zelle(datumZelle(i))} | ${zelle(i.motiv?.herkunft ?? '')} | ${zelle(i.motiv?.offen ?? '')} |`);
}
md.push('');
if (platzhalter.length) {
  md.push('## Platzhalter: hier fehlt ein Foto oder Video', '');
  for (const s of [...new Set(platzhalter.map((z) => z.key.split('|')[1]))]) {
    const p = platzhalter.filter((z) => z.key.split('|')[1] === s);
    md.push(`- **${seitenName(p[0].seite)}**, ${p.map((z) => `B${z.nr}`).join(', ')}${motive.platzhalter?.[s] ? `: ${motive.platzhalter[s]}` : ''}`);
  }
  md.push('');
}
md.push('## Grafiken und Logos (keine Fotos)', '');
md.push('| Datei | Wo | Datum der Anpassung |', '|---|---|---|');
for (const [d, orte] of [...grafik].sort()) {
  const i = await info(d);
  md.push(`| \`${zelle(dateiName(d))}\`${i.masse ? `<br>${i.masse}` : ''} | ${zelle(woGrafik(orte))} | ${zelle(datumZelle(i))} |`);
}
md.push('');
md.push('## Gegenprobe', '');
md.push(`- **Routen besucht:** ${routen.length} von ${routen.length} (Quelle \`scripts/routes.mjs\`), jede mit gerenderter h1.`);
md.push(`- **Dateien unter \`public/assets/\`** (ohne Schriften): ${imOrdner.length}. Davon im Rundgang gesehen: ${imOrdner.filter((d) => gesehen.has(d)).length},`
  + ` nur im Code: ${imOrdner.filter((d) => !gesehen.has(d) && imCode.has(d)).length}, unbenutzt: ${unbenutzt.length}.`);
const quellListe = (q) => [...q].map((x) => `\`${x}\``).join(', ');
if (nichtGesehen.length) {
  md.push('- 🟠 **Im Code, beim Rundgang nicht gesehen, bitte prüfen** (Interaktion, Tablet-Breite oder toter Code):');
  for (const [d, q] of nichtGesehen) md.push(`  - \`${zelle(istLokal(d) ? d : 'Unsplash-Stockfoto')}\` in ${quellListe(q)}`);
} else md.push('- **Im Code, beim Rundgang nicht gesehen:** nichts Neues.');
if (nichtGesehenBekannt.length) {
  md.push('- **Bekannt und begründet** (`motive.json` → `bekannt`), deshalb nicht angezeigt:');
  for (const [d, q] of nichtGesehenBekannt) md.push(`  - \`${zelle(istLokal(d) ? d : 'Unsplash-Stockfoto')}\` in ${quellListe(q)}: ${zelle(bekannt[d])}`);
}
if (unbenutzt.length) md.push(`- **Unbenutzt** (weder angezeigt noch im Code, wird trotzdem mit ausgeliefert): ${unbenutzt.map((d) => `\`${d}\``).join(', ')}`);
if (fehlend.length) md.push(`- 🔴 **Angezeigt, aber Datei fehlt:** ${fehlend.map((d) => `\`${d}\``).join(', ')}`);
if (ohneMotiv.length) md.push(`- **Ohne Eintrag in \`motive.json\`:** ${ohneMotiv.map((d) => `\`${dateiName(d)}\``).join(', ')}`);
if (unbekannteVermerke.length) md.push(`- 🔴 **Vermerk auf einer Nummer, die es nicht gibt** (Tippfehler in \`motive.json\` → \`stellen\`): ${unbekannteVermerke.join(', ')}`);
const entfallen = Object.values(register.entfallen).sort((a, b) => a.nr - b.nr);
md.push(`- **Entfallene Nummern:** ${entfallen.length ? entfallen.map((e) => `B${e.nr} (${e.ort}, seit ${datumDE(e.seit)})`).join('; ') : 'keine'}`);
if (umbenannt.length) md.push(`- **In diesem Lauf umbenannt, Nummer behalten:** ${umbenannt.map((u) => `B${u.nr}: ${u.von} → ${u.zu}`).join('; ')}`);
md.push('');
md.push('## Was diese Liste nicht sieht', '');
md.push('- Bilder, die erst nach einem Klick erscheinen (Dialoge), und Motive nur für Tablet-Breiten. Beide fängt die Gegenprobe oben ab, sofern der Pfad im Code steht.');
md.push('- Sektionshintergründe, die das Bild der aktiven Karte spiegeln: keine eigene Stelle, Hinweis steht unter der jeweiligen Seite.');
md.push('- Ob ein Foto KI-generiert oder -bearbeitet ist. Das lässt sich einem Bild nicht ansehen und wird nicht geraten.');
md.push('');
fs.writeFileSync(DATEI_MD, md.join('\n'));

await schreibeKontaktbogen({
  ziel: DATEI_HTML, zeilen, seitenFolge, seitenName, dateiName, datumZelle,
  kopfzeile: `Stand ${stempel} · ${fotoZeilen.length} Bildstellen aus ${dateienFoto.length} Dateien · ${platzhalter.length} Platzhalter · Nummern bleiben fest`,
  vorschauQuelle: (d) => {
    const bild = /\.mp4$/.test(d) ? standbildZu.get(d) : d;
    return bild && istLokal(bild) && /\.(webp|png|jpe?g)$/i.test(bild) && fs.existsSync(pfadVon(bild)) ? pfadVon(bild) : null;
  },
});

console.log(`[bilder] ${fotoZeilen.length} Bildstellen (Nummern bis B${register.naechste - 1}), ${dateienFoto.length} Dateien, ${platzhalter.length} Platzhalter`);
console.log(`[bilder] geschrieben: ${[DATEI_MD, DATEI_HTML, DATEI_NUMMERN].map((p) => path.relative(wurzel, p)).join(' · ')}`);
if (umbenannt.length) console.log(`[bilder] umbenannt (Nummer behalten): ${umbenannt.map((u) => `B${u.nr}`).join(', ')}`);
if (entfallen.length) console.log(`[bilder] entfallene Nummern: ${entfallen.map((e) => `B${e.nr}`).join(', ')}`);
if (nichtGesehen.length) console.log(`[bilder] im Code, nicht gesehen (bitte pruefen): ${nichtGesehen.map(([d]) => (istLokal(d) ? d : 'Unsplash')).join(', ')}`);
const veralteteBekannte = Object.keys(bekannt).filter((d) => !nichtGesehenAlle.some(([x]) => x === d));
if (veralteteBekannte.length) console.log(`[bilder] motive.json → bekannt nennt Faelle, die es nicht mehr gibt: ${veralteteBekannte.join(', ')}`);
if (unbenutzt.length) console.log(`[bilder] unbenutzt: ${unbenutzt.join(', ')}`);
if (ohneMotiv.length) console.log(`[bilder] ohne Motiv in motive.json: ${ohneMotiv.join(', ')}`);
if (verwaisteMotive.length) console.log(`[bilder] motive.json nennt Dateien, die es nicht gibt: ${verwaisteMotive.join(', ')}`);
for (const [status, art] of Object.entries(VERMERKE)) {
  const n = zeilen.filter((z) => z.vermerk?.text === art.text).length;
  if (n) console.log(`[bilder] Vermerk „${art.text}“: ${n} Stellen`);
}
if (unbekannteVermerke.length) {
  console.error(`[bilder] FEHLER: Vermerk auf unbekannter Nummer (Tippfehler in motive.json): ${unbekannteVermerke.join(', ')}`);
  process.exitCode = 1;
}
if (fehlend.length) {
  console.error(`[bilder] FEHLER: angezeigt, aber Datei fehlt: ${fehlend.join(', ')}`);
  process.exit(1);
}
