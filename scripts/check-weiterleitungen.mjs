// Prueft die Weiterleitungen der alten Website (Backlog R22).
//
//     npm run weiterleitungen                      # Liste und Dateien pruefen (laeuft im prebuild)
//     npm run weiterleitungen -- --gegenprobe      # spielt Fehler ein; jeder muss gemeldet werden
//     npm run weiterleitungen -- --live            # Deployment pruefen (Standard: carcare-center.vercel.app)
//     npm run weiterleitungen -- --live https://www.carcare-center.de
//
// WAS GEPRUEFT WIRD (ohne Netz, im prebuild)
//  - Jedes Ziel ist eine Route aus `scripts/routes.mjs`.
//  - Keine Quelle ist selbst eine Route: Bei Vercel greifen Redirects vor dem Dateisystem, sie wuerde die Seite verdecken.
//  - Keine Dubletten, keine Ketten (Ziel einer Regel ist Quelle einer anderen).
//  - Jede Adresse aus dem Inventar der Altseite (`docs/weiterleitungen-altseite/altseite-inventar.json`, `npm run
//    altseite`) hat eine Regel, eine weiter ausgelieferte Datei oder eine begruendete Ausnahme.
//  - Weiter ausgelieferte Dateien liegen wirklich in `public/`.
//  - `vercel.json` und die Uebergabe-Dateien fuer Apache und nginx sind synchron mit der Liste. Vercel liest
//    vercel.json aus dem Repository, bevor der Build startet: Eine vergessene Neuerzeugung waere sonst unsichtbar.
//
// WAS `--live` PRUEFT (nach einem Deploy)
//  Jede alte Adresse antwortet mit 301 und zeigt auf das richtige Ziel, jedes Ziel antwortet mit 200, die behaltenen
//  Dateien mit 200 und ihrem Dateityp, die Ausnahmen mit 200.
//
// ⚠️ WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST
// (Pflichtfrage aus CLAUDE.md, siehe docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md)
//  1. Ein falsches, aber existierendes Ziel (Lederreparatur → Startseite) besteht jede Pruefung. Ob das Ziel
//     inhaltlich passt, steht nur in der Begruendung der Planung und im Review.
//  2. Das Inventar kennt nur Adressen, die die Altseite selbst verlinkt hat. Aeltere Pfade, die nur Google oder fremde
//     Seiten kennen, fehlen darin; sie zeigt erst der Search-Console-Bericht „Nicht gefunden (404)“ nach dem Livegang.
//  3. Ohne Netz ist bewiesen, dass die Konfiguration stimmt, nicht, dass der Server sie so ausfuehrt. Erst `--live`
//     gegen das Deployment belegt das Verhalten.
//  4. `--live` gegen die Vorschau sagt nichts ueber die echte Domain. Laeuft die Seite nach der Umstellung bei KUPPER
//     IT, gilt vercel.json dort gar nicht; dann muessen die Uebergabe-Dateien eingespielt sein, und erst
//     `--live https://www.carcare-center.de` beweist es.
//  5. Gross-/Kleinschreibvarianten (/Kontakt.html) sind nicht abgedeckt; Vercel vergleicht die Quelle exakt.

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getRoutes } from './routes.mjs';
import { AUSNAHMEN, BEHALTEN, STATUS, UEBERGABE, WEITERLEITUNGEN, fuerApache, fuerNginx, fuerVercel } from './lib/weiterleitungen.mjs';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const INVENTAR = path.join(wurzel, 'docs/weiterleitungen-altseite/altseite-inventar.json');
const STANDARD_URL = 'https://carcare-center.vercel.app';
const UNGUELTIG = /[\s:*?()+{}\[\]!"'<>\\]/; // Sonderzeichen von path-to-regexp (Vercel) und Leerraum

/**
 * Reine Pruefung ohne Dateizugriff, damit die Gegenprobe sie mit eingespielten Fehlern aufrufen kann.
 * @returns {{ art: string, text: string }[]}
 */
export function pruefe({ liste, behalten, ausnahmen, routen, inventar, vercelRedirects, uebergabe, erwartet, dateiDa }) {
  const befunde = [];
  const melde = (art, text) => befunde.push({ art, text });
  const routenSet = new Set(routen);
  const quellen = new Map();

  for (const { von, nach } of liste) {
    if (!von.startsWith('/') || UNGUELTIG.test(von)) melde('quelle-ungueltig', `${von}: Quelle muss mit / beginnen und darf keine Sonderzeichen enthalten`);
    if (routenSet.has(von)) melde('quelle-ist-route', `${von}: ist eine Route der neuen Seite und wuerde sie verdecken`);
    if (!routenSet.has(nach)) melde('ziel-keine-route', `${von} → ${nach}: Ziel ist keine Route der neuen Seite`);
    quellen.set(von, (quellen.get(von) ?? 0) + 1);
  }
  for (const pfad of [...behalten.map((b) => b.pfad), ...ausnahmen.map((a) => a.pfad)]) quellen.set(pfad, (quellen.get(pfad) ?? 0) + 1);
  for (const [von, anzahl] of quellen) if (anzahl > 1) melde('doppelt', `${von}: ${anzahl}-mal vergeben (Liste, BEHALTEN, AUSNAHMEN)`);
  for (const { von, nach } of liste) if (quellen.has(nach)) melde('kette', `${von} → ${nach}: Ziel ist selbst eine alte Adresse (Kette)`);

  for (const { pfad } of behalten) if (!dateiDa(pfad)) melde('behalten-fehlt', `${pfad}: soll weiter ausgeliefert werden, fehlt aber in public/`);
  for (const { pfad, grund } of ausnahmen) if (!grund?.trim()) melde('ausnahme-ohne-grund', `${pfad}: Ausnahme ohne Begruendung`);

  for (const pfad of [...inventar.seiten.map((s) => s.pfad), ...inventar.dokumente.map((d) => d.pfad)]) {
    if (!quellen.has(pfad)) melde('inventar-fehlt', `${pfad}: Adresse der Altseite ohne Regel, Datei oder Ausnahme (nach dem Livegang 404)`);
  }

  if (JSON.stringify(vercelRedirects) !== JSON.stringify(erwartet.vercel)) {
    melde('vercel-veraltet', `vercel.json: ${vercelRedirects.length} Weiterleitungen statt ${erwartet.vercel.length} bzw. abweichend von der Liste`);
  }
  for (const [art, inhalt] of Object.entries(uebergabe)) {
    if (inhalt !== erwartet[art]) melde('uebergabe-veraltet', `${UEBERGABE[art]}: weicht von der Liste ab oder fehlt`);
  }
  return befunde;
}

// Zeilenenden vereinheitlichen: Mit `core.autocrlf=true` (Windows-Rechner im Team) kommen die Uebergabe-Dateien nach
// einem Checkout mit CRLF an, der Generator schreibt LF. Ohne Angleich braeche der prebuild dort grundlos.
const lies = (datei) => (fs.existsSync(datei) ? fs.readFileSync(datei, 'utf8').replace(/\r\n/g, '\n') : null);

function eingabenAusDateien() {
  const vercel = JSON.parse(lies(path.join(wurzel, 'vercel.json')) ?? '{}');
  return {
    liste: WEITERLEITUNGEN,
    behalten: BEHALTEN,
    ausnahmen: AUSNAHMEN,
    routen: getRoutes().map((r) => r.path),
    inventar: JSON.parse(lies(INVENTAR) ?? '{"seiten":[],"dokumente":[]}'),
    vercelRedirects: vercel.redirects ?? [],
    uebergabe: { apache: lies(path.join(wurzel, UEBERGABE.apache)), nginx: lies(path.join(wurzel, UEBERGABE.nginx)) },
    erwartet: { vercel: fuerVercel(), apache: fuerApache(), nginx: fuerNginx() },
    dateiDa: (pfad) => fs.existsSync(path.join(wurzel, 'public', pfad)),
  };
}

function gegenprobe() {
  const basis = eingabenAusDateien();
  const [erste, ...rest] = basis.liste;
  const faelle = [
    ['ziel-keine-route', { liste: [{ ...erste, nach: '/gibt-es-nicht' }, ...rest] }],
    ['quelle-ist-route', { liste: [...basis.liste, { von: '/kontakt', nach: '/', alt: '' }] }],
    ['quelle-ungueltig', { liste: [...basis.liste, { von: '/alt seite.html', nach: '/', alt: '' }] }],
    ['doppelt', { liste: [...basis.liste, erste] }],
    ['kette', { liste: [...basis.liste, { von: '/kette.html', nach: erste.von, alt: '' }] }],
    ['inventar-fehlt', { liste: rest }],
    ['behalten-fehlt', { dateiDa: () => false }],
    ['ausnahme-ohne-grund', { ausnahmen: basis.ausnahmen.map((a) => ({ ...a, grund: ' ' })) }],
    ['vercel-veraltet', { vercelRedirects: basis.vercelRedirects.slice(1) }],
    ['uebergabe-veraltet', { uebergabe: { ...basis.uebergabe, nginx: `${basis.uebergabe.nginx}# von Hand geaendert\n` } }],
  ];
  // Die Liste aendert sich in einigen Faellen; die erwarteten Dateien bleiben die des echten Stands, damit die
  // Sync-Pruefung dort nicht zufaellig mitzaehlt, sondern nur der eingespielte Fehler.
  let gescheitert = 0;
  for (const [art, aenderung] of faelle) {
    const befunde = pruefe({ ...basis, ...aenderung });
    const getroffen = befunde.some((b) => b.art === art);
    if (!getroffen) gescheitert++;
    console.log(`  ${getroffen ? '✓' : '✗'} ${art.padEnd(22)} ${getroffen ? 'gemeldet' : 'NICHT gemeldet'}`);
  }
  const sauber = pruefe(basis);
  console.log(`  ${sauber.length === 0 ? '✓' : '✗'} ${'echter Stand'.padEnd(22)} ${sauber.length} Befund(e)`);
  if (gescheitert || sauber.length) {
    console.error(`\n[weiterleitungen] GEGENPROBE GESCHEITERT: ${gescheitert} eingespielte(r) Fehler nicht gemeldet, ${sauber.length} Befund(e) am echten Stand.`);
    process.exit(1);
  }
  console.log(`\n[weiterleitungen] Gegenprobe ok: ${faelle.length} eingespielte Fehler, alle gemeldet; echter Stand sauber.`);
}

async function live(basisUrl) {
  const basis = basisUrl.replace(/\/$/, '');
  const fehler = [];
  const holen = (pfad, art = 'GET') => fetch(basis + encodeURI(pfad), { method: art, redirect: 'manual', headers: { 'User-Agent': 'OALAB-Weiterleitungspruefung/1.0' } });
  console.log(`[weiterleitungen] live gegen ${basis}: ${WEITERLEITUNGEN.length} Weiterleitungen, ${BEHALTEN.length} Datei(en), ${AUSNAHMEN.length} Ausnahme(n)\n`);

  for (const { von, nach } of WEITERLEITUNGEN) {
    try {
      const res = await holen(von, 'HEAD');
      const ort = res.headers.get('location');
      const zielPfad = ort ? decodeURI(new URL(ort, basis).pathname) : null;
      if (res.status !== STATUS || zielPfad !== nach) fehler.push(`${von}: erwartet ${STATUS} → ${nach}, erhalten ${res.status}${ort ? ` → ${ort}` : ''}`);
    } catch (err) {
      fehler.push(`${von}: nicht erreichbar (${err.message})`);
    }
  }
  for (const ziel of [...new Set(WEITERLEITUNGEN.map((w) => w.nach))]) {
    const res = await holen(ziel).catch((err) => ({ status: err.message }));
    if (res.status !== 200) fehler.push(`Ziel ${ziel}: HTTP ${res.status} statt 200`);
  }
  for (const { pfad } of BEHALTEN) {
    const res = await holen(pfad, 'HEAD').catch((err) => ({ status: err.message, headers: new Headers() }));
    const typ = res.headers.get('content-type') ?? '';
    if (res.status !== 200 || (pfad.endsWith('.pdf') && !typ.includes('pdf'))) fehler.push(`${pfad}: HTTP ${res.status}, Typ „${typ}“ (erwartet 200, PDF)`);
  }
  for (const { pfad } of AUSNAHMEN) {
    const res = await holen(pfad, 'HEAD').catch((err) => ({ status: err.message }));
    if (res.status !== 200) fehler.push(`${pfad}: HTTP ${res.status} statt 200`);
  }

  if (fehler.length) {
    console.error(`[weiterleitungen] LIVE FEHLGESCHLAGEN — ${fehler.length} Befund(e):\n`);
    for (const f of fehler) console.error(`  - ${f}`);
    console.error('');
    process.exit(1);
  }
  console.log(`[weiterleitungen] live ok: alle ${WEITERLEITUNGEN.length} alten Adressen → ${STATUS} aufs richtige Ziel, Ziele 200, Dateien und Ausnahmen 200.`);
}

const argv = process.argv.slice(2);
if (argv.includes('--gegenprobe')) {
  gegenprobe();
} else if (argv.includes('--live')) {
  await live(argv.find((a) => a.startsWith('http')) ?? process.env.SMOKE_URL ?? STANDARD_URL);
} else {
  const eingaben = eingabenAusDateien();
  const befunde = pruefe(eingaben);
  if (befunde.length) {
    console.error(`\n[check-weiterleitungen] BUILD ABGEBROCHEN — ${befunde.length} Befund(e) bei den Weiterleitungen der Altseite:\n`);
    for (const b of befunde) console.error(`  - [${b.art}] ${b.text}`);
    console.error('\n  Liste: scripts/lib/weiterleitungen.mjs · danach: npm run vercel-config (und mitcommitten).\n');
    process.exit(1);
  }
  const imInventar = new Set([...eingaben.inventar.seiten, ...eingaben.inventar.dokumente].map((e) => e.pfad));
  const zusaetzlich = WEITERLEITUNGEN.filter((w) => !imInventar.has(w.von));
  console.log(
    `[check-weiterleitungen] ok: ${WEITERLEITUNGEN.length} Weiterleitungen (${STATUS}), ${BEHALTEN.length} behaltene Datei(en), ` +
      `${AUSNAHMEN.length} Ausnahme(n); alle ${imInventar.size} Adressen des Altseiten-Inventars abgedeckt, vercel.json und Uebergabe synchron.` +
      (zusaetzlich.length ? ` Hinweis: ${zusaetzlich.length} Regel(n) ohne Inventareintrag.` : ''),
  );
}
