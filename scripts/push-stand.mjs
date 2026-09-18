// Push-Stand: Uebersicht fuer Pulls an anderen Standorten — bei JEDEM Push neu erzeugt.
//
// AUFRUF:
//   npm run push-stand                    Uebersicht erzeugen (holt vorher den Remote-Stand)
//   npm run push-stand -- --seit <ref>    zusaetzlich alle Commits ab <ref> aufnehmen
//                                         (rueckwirkend, z. B. fuer einen schon erfolgten Push)
//   npm run push-stand -- --pruefen       nur pruefen: nennt die committete Uebersicht alle
//                                         Commits, die auf GitHub noch fehlen? Exit 1 wenn nicht
//   node scripts/push-stand.mjs --hook    PreToolUse-Hook von Claude Code (Eingabe per stdin)
//
// ABLAUF BEI JEDEM PUSH (Regel in CLAUDE.md, Abschnitt „Push-Stand"):
//   1. Commits fertig, Branches gemergt
//   2. npm run push-stand
//   3. git add docs/push-stand && git commit -m "Docs: Push-Stand <Datum>"
//   4. git push …
//   Der Hook in .claude/settings.json sperrt Schritt 4, solange die COMMITTETE Uebersicht einen
//   Commit nicht nennt, der mit dem Push auf GitHub kaeme.
//
// WAS DIESE PRUEFUNG BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage CLAUDE.md):
//  1. Pushes ausserhalb von Claude Code (Terminal, IDE, GitHub Desktop) sieht der Hook nicht.
//     → Regel in CLAUDE.md; ein git-pre-push-Hook je Rechner waere moeglich, ist aber nicht aktiv.
//  2. Der Remote-Stand ist so alt wie das letzte `git fetch` — der Hook holt ihn nicht neu (zu
//     langsam fuer jeden Befehl). Er meldet dadurch hoechstens zu viel, nie zu wenig.
//  3. Die Uebersicht nennt den Hash, die Zeile dazu koennte trotzdem falsch sein. → Alle Zeilen
//     erzeugt dieses Skript aus git; von Hand wird nichts eingetragen.
//  4. „Inhaltlich offen" ist so aktuell wie der Backlog. Das prueft niemand — der Backlog ist
//     die gepflegte Quelle (CLAUDE.md), die Uebersicht liest nur ab.
//  5. Uebersicht erzeugt, aber nicht committet → Push ohne sie. → Der Hook liest die committete
//     Fassung (HEAD) und sperrt auch bei uncommitteten Aenderungen an ihr.
//  6. Ein Fehler in diesem Skript sperrt keinen Push — sonst legte ein Werkzeugfehler das Team
//     lahm. Er erscheint als Warnung, der Push laeuft dann UNGEPRUEFT.

import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DATEI = 'docs/push-stand/README.md';
const VERLAUF = 'docs/push-stand/verlauf.md';
/** Commits, die NUR diese Dateien aendern, sind Uebersichts-Commits — sie stehen nicht in sich selbst. */
const UEBERSICHT = new Set([DATEI, VERLAUF]);
const KONFIG = ['tsconfig.json', 'vite.config.ts', 'tailwind.config.js', 'postcss.config.mjs', 'vercel.json', '.env.example', '.gitignore', '.npmrc', '.nvmrc', '.puppeteerrc.cjs', '.claude/settings.json'];

const git = (...args) => execFileSync('git', args, { cwd: wurzel, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 * 1024 * 1024 }).trimEnd();
const gitOder = (fallback, ...args) => {
  try {
    return git(...args);
  } catch {
    return fallback;
  }
};
const zeilen = (text) => text.split('\n').map((z) => z.trim()).filter(Boolean);
/** `git status --porcelain`: NICHT trimmen — das fuehrende Leerzeichen gehoert zum Statuscode (" M pfad"). */
const porcelain = (...args) =>
  git('status', '--porcelain', ...args)
    .split('\n')
    .filter((z) => z.length > 3)
    .map((z) => ({ code: z.slice(0, 2), pfad: z.slice(3) }));
const kurz = (hash) => hash.slice(0, 7);
const zeit = (datum) =>
  new Intl.DateTimeFormat('de-DE', { timeZone: 'Europe/Berlin', dateStyle: 'medium', timeStyle: 'short' }).format(datum);
const zelle = (text) => String(text).replace(/\|/g, '\\|').replace(/\s+/g, ' ').trim();
const kuerzen = (text, max) => (text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text);

const REMOTE = zeilen(gitOder('origin', 'remote'))[0] ?? 'origin';
const HAUPT = gitOder(`${REMOTE}/main`, 'symbolic-ref', '--short', `refs/remotes/${REMOTE}/HEAD`).replace(`${REMOTE}/`, '');

/** Geaenderte Dateien eines Commits; bei Merges gegen den ersten Elternteil, beim ersten Commit alle. */
function dateienVon(hash) {
  const eltern = git('rev-list', '--parents', '-n', '1', hash).split(' ').slice(1);
  const aus = eltern.length ? git('diff', '--name-status', eltern[0], hash) : git('show', '--name-status', '--format=', hash);
  return zeilen(aus).map((z) => {
    const [status, ...pfade] = z.split('\t');
    return { status: status[0], pfad: pfade[pfade.length - 1] };
  });
}

const istUebersichtsCommit = (hash) => {
  const d = dateienVon(hash);
  return d.length > 0 && d.every((x) => UEBERSICHT.has(x.pfad));
};

/** Commits, die ein Push der Refs auf GitHub braechte (aelteste zuerst). */
function fehlendAufGitHub(refs) {
  const args = refs === 'alle' ? ['--branches'] : refs;
  if (!args.length) return [];
  return zeilen(git('rev-list', '--reverse', '--topo-order', ...args, '--not', `--remotes=${REMOTE}`));
}

// ─── Pruefen (Hook und --pruefen) ─────────────────────────────────────────────────────────

/** Findet `git … push …`-Aufrufe in einer Befehlszeile (Bash oder PowerShell). */
function pushAufrufe(befehl) {
  const ohneQuotes = (t) => t.replace(/^["']|["']$/g, '');
  const aufrufe = [];
  for (const teil of befehl.split(/&&|\|\||[;|\n]/)) {
    const tokens = (teil.trim().match(/"[^"]*"|'[^']*'|\S+/g) ?? []).map(ohneQuotes);
    let i = tokens.findIndex((t) => /(^|[\\/])git(\.exe)?$/i.test(t));
    if (i < 0) continue;
    i += 1;
    while (i < tokens.length && tokens[i].startsWith('-')) i += tokens[i] === '-C' || tokens[i] === '-c' ? 2 : 1;
    if (tokens[i] === 'push') aufrufe.push(tokens.slice(i + 1));
  }
  return aufrufe;
}

/** Welche lokalen Refs schiebt ein `git push` mit diesen Argumenten? 'alle', Liste, oder null (nichts). */
function refsVonPush(args) {
  if (args.some((a) => a === '--dry-run' || a === '-n' || a === '--delete' || a === '-d')) return null;
  if (args.some((a) => a === '--all' || a === '--mirror')) return 'alle';
  const positionen = [];
  for (let i = 0; i < args.length; i += 1) {
    if (args[i] === '-o' || args[i] === '--push-option' || args[i] === '--repo' || args[i] === '--receive-pack') i += 1;
    else if (!args[i].startsWith('-')) positionen.push(args[i]);
  }
  const refspecs = positionen.slice(1);
  if (!refspecs.length) return ['HEAD'];
  return refspecs
    .map((r) => r.replace(/^\+/, '').split(':')[0])
    .filter((r) => r && r !== '--tags');
}

function pruefe(refs) {
  const fehlend = fehlendAufGitHub(refs).filter((h) => !istUebersichtsCommit(h));
  const uebersicht = gitOder('', 'show', `HEAD:${DATEI}`);
  const ungenannt = fehlend.filter((h) => !uebersicht.includes(kurz(h)));
  const uncommittet = porcelain('--', DATEI, VERLAUF).filter((z) => z.code !== '??').map((z) => z.pfad);
  return { ungenannt, uncommittet };
}

function meldung({ ungenannt, uncommittet }) {
  const teile = [];
  if (ungenannt.length) {
    teile.push(
      `docs/push-stand/README.md nennt ${ungenannt.length} Commit(s) nicht, die mit diesem Push auf GitHub kaemen:`,
      ...ungenannt.map((h) => `  ${kurz(h)} ${gitOder('', 'log', '-1', '--format=%s', h)}`),
    );
  }
  if (uncommittet.length) teile.push('Die Uebersicht ist geaendert, aber nicht committet: ' + uncommittet.join(', '));
  teile.push(
    '',
    'Vor jedem Push (CLAUDE.md, „Push-Stand"):',
    '  npm run push-stand',
    '  git add docs/push-stand && git commit -m "Docs: Push-Stand <Datum>"',
    '  danach erneut pushen',
  );
  return teile.join('\n');
}

async function hook() {
  let eingabe = '';
  for await (const stueck of process.stdin) eingabe += stueck;
  const { tool_name: werkzeug, tool_input: tool } = JSON.parse(eingabe || '{}');
  if (!['Bash', 'PowerShell'].includes(werkzeug) || typeof tool?.command !== 'string') return 0;
  const aufrufe = pushAufrufe(tool.command);
  if (!aufrufe.length) return 0;
  for (const args of aufrufe) {
    const refs = refsVonPush(args);
    if (!refs) continue;
    const ergebnis = pruefe(refs);
    if (ergebnis.ungenannt.length || ergebnis.uncommittet.length) {
      process.stderr.write(`Push gesperrt (Push-Stand fehlt).\n${meldung(ergebnis)}\n`);
      return 2;
    }
  }
  return 0;
}

// ─── Erzeugen ─────────────────────────────────────────────────────────────────────────────

function holeRemote() {
  try {
    execFileSync('git', ['fetch', '--prune', REMOTE], { cwd: wurzel, stdio: 'ignore', timeout: 45000 });
    return `${zeit(new Date())} (\`git fetch\`)`;
  } catch {
    return 'NICHT aktualisiert — `git fetch` schlug fehl (offline?). Remote-Angaben sind so alt wie der letzte Abruf.';
  }
}

function branchTabelle(dokumentiert) {
  const lokal = zeilen(git('for-each-ref', '--format=%(refname:short)\t%(objectname)', 'refs/heads')).map((z) => z.split('\t'));
  const remote = new Map(
    zeilen(git('for-each-ref', '--format=%(refname:short)\t%(objectname)', `refs/remotes/${REMOTE}`))
      .map((z) => z.split('\t'))
      .filter(([n]) => n !== `${REMOTE}/HEAD` && n !== REMOTE)
      .map(([n, h]) => [n.slice(REMOTE.length + 1), h]),
  );
  const aktuell = gitOder('', 'rev-parse', '--abbrev-ref', 'HEAD');
  const inHaupt = (ref) => gitOder(null, 'merge-base', '--is-ancestor', ref, `${REMOTE}/${HAUPT}`) !== null;
  const beruehrt = new Set(dokumentiert.flatMap((c) => c.branches));
  const zeilenOut = [];
  const nurLokal = [];
  for (const [name, hash] of lokal) {
    const r = remote.get(name);
    let stand;
    if (r) {
      const [vor, hinter] = git('rev-list', '--left-right', '--count', `${name}...${REMOTE}/${name}`).split(/\s+/).map(Number);
      stand = !vor && !hinter ? 'gleich' : [vor && `${vor} vor GitHub (kommt mit dem Push)`, hinter && `${hinter} hinter GitHub (erst pullen)`].filter(Boolean).join(', ');
    } else {
      const neu = fehlendAufGitHub([name]).length;
      if (!neu) {
        nurLokal.push(name);
        continue;
      }
      stand = `neu, ${neu} Commit(s) noch nicht auf GitHub`;
    }
    const wichtig = name === HAUPT || name === aktuell || !r || stand !== 'gleich' || beruehrt.has(name);
    if (wichtig) zeilenOut.push({ name, lokal: kurz(hash), gh: r ? kurz(r) : '—', stand, haupt: name === HAUPT });
    remote.delete(name);
  }
  zeilenOut.sort((a, b) => Number(b.haupt) - Number(a.haupt));
  const nurGitHub = [...remote.keys()];
  const nichtInHaupt = nurGitHub.filter((n) => !inHaupt(`${REMOTE}/${n}`));
  const ruhig = lokal.length - nurLokal.length - zeilenOut.length;
  return { zeilenOut, nurLokal, nurGitHub, nichtInHaupt, ruhig };
}

function commitDaten(hash, vorher) {
  const [datum, autor, titel] = git('log', '-1', '--format=%cI%x09%an%x09%s', hash).split('\t');
  const dateien = dateienVon(hash);
  const branches = zeilen(gitOder('', 'branch', '--contains', hash, '--format=%(refname:short)'));
  const schonOben = vorher.has(hash);
  return {
    hash,
    datum: zeit(new Date(datum)),
    autor,
    titel,
    anzahl: dateien.length,
    neu: dateien.filter((d) => d.status === 'A').length,
    abh: dateien.filter((d) => d.pfad === 'package.json' || d.pfad === 'package-lock.json').map((d) => d.pfad),
    konfig: dateien.filter((d) => KONFIG.includes(d.pfad)).map((d) => d.pfad),
    dateien,
    branches,
    schonOben,
  };
}

const jsonBei = (ref, datei) => {
  try {
    return JSON.parse(git('show', `${ref}:${datei}`));
  } catch {
    return null;
  }
};

/** Abhaengigkeiten, Lockfile-Versionen und npm-Skripte zwischen zwei Staenden. */
function abhaengigkeiten(von, bis) {
  const a = jsonBei(von, 'package.json') ?? {};
  const b = jsonBei(bis, 'package.json') ?? {};
  const deps = [];
  for (const feld of ['dependencies', 'devDependencies']) {
    const alt = a[feld] ?? {};
    const neu = b[feld] ?? {};
    for (const n of new Set([...Object.keys(alt), ...Object.keys(neu)])) {
      if (alt[n] !== neu[n]) deps.push(`${n} ${alt[n] ?? '—'} → ${neu[n] ?? 'entfernt'}`);
    }
  }
  const skripteNeu = Object.keys(b.scripts ?? {}).filter((s) => !(s in (a.scripts ?? {})));
  const skripteWeg = Object.keys(a.scripts ?? {}).filter((s) => !(s in (b.scripts ?? {})));
  const la = jsonBei(von, 'package-lock.json')?.packages ?? {};
  const lb = jsonBei(bis, 'package-lock.json')?.packages ?? {};
  const aenderungen = [];
  for (const p of new Set([...Object.keys(la), ...Object.keys(lb)])) {
    if (!p.startsWith('node_modules/') || p.slice(13).includes('node_modules/')) continue;
    if (la[p]?.version !== lb[p]?.version) aenderungen.push({ name: p.slice(13), alt: la[p]?.version ?? '—', neu: lb[p]?.version ?? 'entfernt' });
  }
  // Lesbar statt vollstaendig: direkte Abhaengigkeiten zuerst (fett); drei und mehr Pakete eines Scopes
  // mit gleicher Versionsaenderung (z. B. die Plattform-Binaerdateien von sharp) als eine Zeile.
  const direkt = new Set([...Object.keys(b.dependencies ?? {}), ...Object.keys(b.devDependencies ?? {})]);
  const gruppen = new Map();
  for (const a of aenderungen) {
    const scope = a.name.startsWith('@') && !direkt.has(a.name) ? a.name.split('/')[0] : null;
    const schluessel = scope ? `${scope}|${a.alt}|${a.neu}` : `einzeln|${a.name}`;
    gruppen.set(schluessel, [...(gruppen.get(schluessel) ?? []), a]);
  }
  const lock = [];
  for (const [schluessel, liste] of gruppen) {
    const art = schluessel.split('|')[0];
    if (art !== 'einzeln' && liste.length >= 3) lock.push({ text: `${art}/* (${liste.length} Pakete) ${liste[0].alt} → ${liste[0].neu}`, direkt: false });
    else for (const a of liste) lock.push({ text: `${a.name} ${a.alt} → ${a.neu}`, direkt: direkt.has(a.name) });
  }
  lock.sort((x, y) => Number(y.direkt) - Number(x.direkt));
  return { deps, lock: lock.map((l) => (l.direkt ? `**${l.text}**` : l.text)), anzahlLock: aenderungen.length, skripteNeu, skripteWeg };
}

/** Bereinigt eine Markdown-Tabellenzelle zu Fliesstext. */
const sauber = (text) =>
  text
    .replace(/~~[^~]*~~/g, '')
    .replace(/\[([^\]]*)\]\([^)]*\)/g, '$1')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/&shy;/g, '')
    .replace(/\*+/g, '')
    .replace(/\s+/g, ' ')
    .trim();

/** Offene Zeilen aus den Backlog-Tabellen (Spalten „Nr" und „Status"). */
function backlogOffen() {
  const quellen = [
    { datei: 'docs/backlog/schleife-2.md', titel: 'Schleife 2' },
    { datei: 'docs/backlog/schleife-3.md', titel: 'Schleife 3' },
    { datei: 'docs/backlog/schleife-4.md', titel: 'Schleife 4' },
    // Kundennummern 2.x–4.x stehen in ihren Schleifen-Dateien; hier nur R-Befunde, 1.x und Querschnitt.
    { datei: 'docs/backlog/offene-punkte-konsolidiert.md', titel: 'Repo-Befunde, Schleife 1 und Querschnitt', auslassen: /^[234]\./ },
  ];
  const gruppen = [];
  for (const q of quellen) {
    const pfad = path.join(wurzel, q.datei);
    if (!fs.existsSync(pfad)) continue;
    const text = fs.readFileSync(pfad, 'utf8').split(/\r?\n/);
    const eintraege = [];
    for (let i = 0; i < text.length; i += 1) {
      if (!text[i].startsWith('|') || !/^\|\s*:?-{3}/.test(text[i + 1] ?? '')) continue;
      const kopf = text[i].split(/(?<!\\)\|/).slice(1, -1).map((c) => sauber(c));
      const sp = (...namen) => kopf.findIndex((k) => namen.includes(k));
      // Die Tabellen heissen nicht ueberall gleich: Klaerungspunkte fuehren „Frage" statt „Aufgabe",
      // Schleife 4 hat „Bereich / Seite" (vorangestellt) und keinen Verantwortlichen.
      const [iNr, iStatus, iAufgabe, iBereich, iWer] = [
        sp('Nr', 'Nr.'),
        sp('Status'),
        sp('Aufgabe', 'Frage', 'Punkt', 'Thema'),
        sp('Bereich / Seite'),
        sp('Verantw.', 'Verantwortlich'),
      ];
      if (iNr < 0 || iStatus < 0) continue;
      for (i += 2; i < text.length && text[i].startsWith('|'); i += 1) {
        const z = text[i].split(/(?<!\\)\|/).slice(1, -1);
        if (z.length < kopf.length) continue;
        const nr = sauber(z[iNr]);
        const status = sauber(z[iStatus]);
        if (/^✅/.test(status) || /^(erledigt|umgesetzt|abgenommen|erfüllt)\b/i.test(status)) continue;
        if (/^(Prinzip|vereinbart|terminiert)\b/i.test(status)) continue;
        if (q.auslassen?.test(nr)) continue;
        eintraege.push({
          nr: nr === '(ohne Nr.)' ? '–' : nr,
          aufgabe: kuerzen([iBereich >= 0 ? sauber(z[iBereich]) : '', iAufgabe >= 0 ? sauber(z[iAufgabe]) : ''].filter(Boolean).join(': '), 110),
          status: kuerzen(status, 60),
          wer: iWer >= 0 ? kuerzen(sauber(z[iWer]), 30) || '—' : '—',
        });
      }
    }
    gruppen.push({ ...q, eintraege });
  }
  return gruppen;
}

/** Offene Folgepunkte (`### ⬜ …`) aus Planungsdateien, die die dokumentierten Commits beruehren. */
function folgepunkte(dokumentiert) {
  const dateien = new Set(dokumentiert.flatMap((c) => c.dateien.map((d) => d.pfad)).filter((p) => /^docs\/.*\/tasks\/.*\.md$/.test(p)));
  const out = [];
  for (const datei of [...dateien].sort()) {
    const pfad = path.join(wurzel, datei);
    if (!fs.existsSync(pfad)) continue;
    for (const z of fs.readFileSync(pfad, 'utf8').split(/\r?\n/)) {
      const m = z.match(/^###\s+⬜\s*(.+)$/);
      if (m) out.push({ punkt: kuerzen(sauber(m[1]), 110), datei });
    }
  }
  return out;
}

function nurLokalDaten() {
  // Die Uebersicht selbst zaehlt nicht: Sie wird direkt nach dem Erzeugen committet.
  const status = porcelain('--untracked-files=normal').filter((z) => !UEBERSICHT.has(z.pfad));
  const unversioniert = status.filter((z) => z.code === '??').map((z) => z.pfad);
  const geaendert = status.filter((z) => z.code !== '??').map((z) => z.pfad);
  const worktrees = git('worktree', 'list', '--porcelain').split('\n').filter((z) => z.startsWith('worktree ')).length - 1;
  const stash = zeilen(gitOder('', 'stash', 'list')).length;
  return { unversioniert, geaendert, worktrees, stash };
}

function erzeuge(seit) {
  const remoteStand = holeRemote();
  const vorherOben = new Set(zeilen(gitOder('', 'rev-list', `--remotes=${REMOTE}`)));
  const liste = fehlendAufGitHub('alle');
  if (seit) {
    for (const h of zeilen(git('rev-list', '--reverse', '--topo-order', `${seit}..HEAD`))) if (!liste.includes(h)) liste.push(h);
  }
  const reihenfolge = zeilen(git('rev-list', '--topo-order', '--reverse', '--all'));
  liste.sort((a, b) => reihenfolge.indexOf(a) - reihenfolge.indexOf(b));
  const dokumentiert = liste.filter((h) => !istUebersichtsCommit(h)).map((h) => commitDaten(h, vorherOben));
  const neu = dokumentiert.filter((c) => !c.schonOben);

  const b = branchTabelle(dokumentiert);
  // „Dieser Push" und „frueher gepusht" (nur mit --seit) getrennt auswerten: Wer den vorigen Stand
  // schon hat, braucht nur die Hinweise zum neuen Teil — sonst stuende „npm install" bei jedem
  // Push, sobald irgendwann im rueckwirkenden Bereich die Lockfile geaendert wurde.
  const schonOben = dokumentiert.filter((c) => c.schonOben);
  const bereich = (liste) =>
    liste.length
      ? {
          abh: abhaengigkeiten(gitOder(liste[0].hash, 'rev-parse', `${liste[0].hash}^`), liste[liste.length - 1].hash),
          konfig: [...new Set(liste.flatMap((c) => c.konfig))],
        }
      : { abh: { deps: [], lock: [], anzahlLock: 0, skripteNeu: [], skripteWeg: [] }, konfig: [] };
  const diesmal = bereich(neu);
  const frueher = bereich(schonOben);
  const npmNoetig = (x) => x.abh.deps.length > 0 || x.abh.lock.length > 0;
  const hinweise = (x) => {
    const out = [];
    if (npmNoetig(x)) {
      const liste = [...x.abh.deps, ...x.abh.lock.slice(0, 10)].join(' · ');
      out.push(['**`npm install`**', `${zelle(liste)}${x.abh.lock.length > 10 ? ' · …' : ''} — Lockfile: ${x.abh.anzahlLock} Paket(e) geändert`]);
    }
    const skripte = [...x.abh.skripteNeu.map((s) => `neu: \`npm run ${s}\``), ...x.abh.skripteWeg.map((s) => `entfernt: \`${s}\``)];
    if (skripte.length) out.push(['npm-Skripte', skripte.join(', ')]);
    if (x.konfig.length) out.push(['Konfiguration geändert', x.konfig.map((k) => `\`${k}\``).join(', ')]);
    return out;
  };
  const lokal = nurLokalDaten();
  const folge = folgepunkte(dokumentiert);
  const backlog = backlogOffen();
  const repo = gitOder('', 'remote', 'get-url', REMOTE).replace(/^.*github\.com[/:]/, '').replace(/\.git$/, '');
  const jetzt = zeit(new Date());

  const md = [];
  md.push('# Push-Stand', '');
  md.push(
    `> **Automatisch erzeugt** mit \`npm run push-stand\` am ${jetzt}, vor dem Push — nicht von Hand bearbeiten.`,
    '> Wird bei jedem Push neu erzeugt und mitcommittet (Regel: `CLAUDE.md`, Abschnitt „Push-Stand").',
    '> Der oberste Commit eines Pushs ist diese Übersicht selbst („Docs: Push-Stand …"). Frühere Pushes: [verlauf.md](verlauf.md).',
    '',
    `Repository \`${repo}\` · Hauptbranch \`${HAUPT}\` · Remote-Stand: ${remoteStand}`,
    '',
  );

  md.push('## 1. Branches: lokal und GitHub', '', '| Branch | Lokal | GitHub | Stand |', '|---|---|---|---|');
  for (const z of b.zeilenOut) md.push(`| \`${z.name}\` | \`${z.lokal}\` | ${z.gh === '—' ? '—' : `\`${z.gh}\``} | ${zelle(z.stand)} |`);
  if (b.ruhig > 0) md.push(`| ${b.ruhig} weitere lokale Branches | – | – | gleich mit GitHub |`);
  const inHauptOben = b.nurGitHub.filter((n) => !b.nichtInHaupt.includes(n));
  if (inHauptOben.length) md.push(`| ${inHauptOben.length} weitere Branches nur auf GitHub | – | – | alle in \`${HAUPT}\` enthalten |`);
  for (const n of b.nichtInHaupt) md.push(`| \`${n}\` (nur auf GitHub) | – | \`${kurz(git('rev-parse', `${REMOTE}/${n}`))}\` | **nicht in \`${HAUPT}\`** |`);
  md.push('');

  md.push('## 2. Commits in diesem Push', '');
  if (!dokumentiert.length) md.push('Keine — mit diesem Push kommt nur diese Übersicht.', '');
  else {
    md.push('| Commit | Datum | Autor | Inhalt | Dateien | Abhängigkeiten | Auf GitHub |', '|---|---|---|---|---|---|---|');
    for (const c of dokumentiert) {
      const dateien = `${c.anzahl}${c.neu ? ` (${c.neu} neu)` : ''}`;
      md.push(`| \`${kurz(c.hash)}\` | ${c.datum} | ${zelle(c.autor)} | ${zelle(c.titel)} | ${dateien} | ${c.abh.length ? c.abh.join(', ') : '—'} | ${c.schonOben ? 'war schon oben' : '**kommt mit diesem Push**'} |`);
    }
    md.push('', 'Dazu als oberster Commit: diese Übersicht.', '');
  }

  md.push('## 3. Nach dem Pull an anderen Standorten', '', '| Schritt | Warum |', '|---|---|');
  md.push(`| \`git fetch --prune\`, \`git checkout ${HAUPT}\`, \`git pull\` | holt den Stand; ohne eigene lokale Änderungen reines Vorspulen |`);
  if (!npmNoetig(diesmal)) md.push('| kein `npm install` nötig | Abhängigkeiten und Lockfile ändern sich mit diesem Push nicht |');
  for (const [schritt, warum] of hinweise(diesmal)) md.push(`| ${schritt} | ${warum} |`);
  const frueherHinweise = hinweise(frueher);
  if (schonOben.length && frueherHinweise.length) {
    md.push(`| Nur wer noch vor \`${kurz(schonOben[0].hash)}\` steht (Commits „war schon oben") | ${frueherHinweise.map(([s, w]) => `${s}: ${w}`).join(' · ')} |`);
  }
  if (dokumentiert.length) {
    const erwartet = [...dokumentiert].reverse().slice(0, 8).map((c) => `\`${kurz(c.hash)}\``).join(', ');
    md.push(`| Kontrolle | \`git log --oneline -${Math.min(dokumentiert.length, 8) + 1} ${HAUPT}\`: oben „Docs: Push-Stand …", darunter ${erwartet} |`);
  }
  md.push('');

  md.push('## 4. Nur auf dem Rechner, von dem gepusht wurde', '', '| Was | Stand |', '|---|---|');
  md.push(`| Unversioniert | ${lokal.unversioniert.length ? lokal.unversioniert.map((p) => `\`${p}\``).join(', ') : 'nichts'} |`);
  md.push(`| Uncommittete Änderungen | ${lokal.geaendert.length ? `${lokal.geaendert.length} Datei(en): ${lokal.geaendert.slice(0, 8).map((p) => `\`${p}\``).join(', ')}` : 'keine'} |`);
  if (b.nurLokal.length) md.push(`| Lokale Branches ohne GitHub-Gegenstück | ${b.nurLokal.length}, alle Commits schon auf GitHub: ${b.nurLokal.map((n) => `\`${n}\``).join(', ')} |`);
  md.push(`| Weitere Worktrees | ${Math.max(0, lokal.worktrees)} |`, `| Stash-Einträge | ${lokal.stash} |`, '');

  md.push('## 5. Inhaltlich offen', '');
  md.push('### Folgepunkte aus den Planungen dieses Pushs', '');
  if (!folge.length) md.push('Keine offenen Folgepunkte in den berührten Planungsdateien.', '');
  else {
    md.push('| Punkt | Planung |', '|---|---|');
    for (const f of folge) md.push(`| ${zelle(f.punkt)} | \`${f.datei}\` |`);
    md.push('');
  }
  const summe = backlog.reduce((s, g) => s + g.eintraege.length, 0);
  md.push(`### Backlog gesamt: ${summe} offene Punkte`, '', 'Automatisch aus `docs/backlog/` — dort gepflegt, hier nur abgelesen.', '');
  for (const g of backlog) {
    md.push('<details>', `<summary>${g.titel}: ${g.eintraege.length} offen</summary>`, '');
    if (g.eintraege.length) {
      md.push('| Nr | Aufgabe | Status | Wer |', '|---|---|---|---|');
      for (const e of g.eintraege) md.push(`| ${zelle(e.nr)} | ${zelle(e.aufgabe)} | ${zelle(e.status)} | ${zelle(e.wer)} |`);
    }
    md.push('', `Quelle: \`${g.datei}\``, '', '</details>', '');
  }

  fs.mkdirSync(path.join(wurzel, 'docs/push-stand'), { recursive: true });
  fs.writeFileSync(path.join(wurzel, DATEI), md.join('\n'), 'utf8');

  // Verlauf: je Push eine Zeile, neueste oben; erneuter Lauf fuer denselben Stand ersetzt die Zeile.
  const verlaufPfad = path.join(wurzel, VERLAUF);
  const kopf = [
    '# Push-Verlauf',
    '',
    '> Je Push eine Zeile, neueste oben. Erzeugt von `npm run push-stand`; aktuelle Übersicht: [README.md](README.md).',
    '> Wer lange nicht gepullt hat: den eigenen letzten Commit suchen, alles darüber ist neu.',
    '',
    '| Erzeugt | Branches | Neu auf GitHub | npm install | Hinweise |',
    '|---|---|---|---|---|',
  ];
  const alt = fs.existsSync(verlaufPfad) ? fs.readFileSync(verlaufPfad, 'utf8').split(/\r?\n/) : kopf;
  const zeilenAlt = alt.slice(alt.findIndex((z) => z.startsWith('|---')) + 1).filter((z) => z.startsWith('|'));
  const neuHashes = neu.map((c) => `\`${kurz(c.hash)}\``).join(' ');
  const branchesPush = [...new Set(neu.flatMap((c) => c.branches))].map((n) => `\`${n}\``).join(', ') || '—';
  const verlaufHinweise =
    [
      diesmal.konfig.length && `Konfiguration: ${diesmal.konfig.join(', ')}`,
      diesmal.abh.skripteNeu.length && `neue Skripte: ${diesmal.abh.skripteNeu.join(', ')}`,
    ]
      .filter(Boolean)
      .join('; ') || '—';
  const zeileNeu = `| ${jetzt} | ${branchesPush} | ${neuHashes || 'nur Übersicht'} ${neu.length ? `(${neu.length})` : ''} | ${npmNoetig(diesmal) ? '**ja**' : 'nein'} | ${zelle(verlaufHinweise)} |`;
  const gleicherStand = zeilenAlt[0] && neuHashes && zeilenAlt[0].includes(neuHashes);
  const zeilenNeu = [zeileNeu, ...(gleicherStand ? zeilenAlt.slice(1) : zeilenAlt)];
  fs.writeFileSync(verlaufPfad, [...kopf, ...zeilenNeu, ''].join('\n'), 'utf8');

  console.log(`[push-stand] ${DATEI} und ${VERLAUF} geschrieben.`);
  console.log(`[push-stand] ${dokumentiert.length} Commit(s) dokumentiert, davon ${neu.length} neu auf GitHub; npm install für diesen Push nötig: ${npmNoetig(diesmal) ? 'ja' : 'nein'}.`);
  console.log(`[push-stand] Backlog: ${summe} offene Punkte. Remote-Stand: ${remoteStand}`);
  console.log('[push-stand] Jetzt: git add docs/push-stand && git commit -m "Docs: Push-Stand …" && git push …');
}

// ─── Einstieg ─────────────────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
try {
  if (args.includes('--hook')) process.exitCode = await hook();
  else if (args.includes('--pruefen')) {
    const ergebnis = pruefe('alle');
    if (ergebnis.ungenannt.length || ergebnis.uncommittet.length) {
      console.error(meldung(ergebnis));
      process.exitCode = 1;
    } else console.log('[push-stand] ok: Die committete Übersicht nennt alle Commits, die auf GitHub fehlen.');
  } else {
    const i = args.indexOf('--seit');
    erzeuge(i >= 0 ? args[i + 1] : null);
  }
} catch (fehler) {
  // Punkt 6 im Kopf: Ein Werkzeugfehler sperrt keinen Push. Exit 1 = Warnung, kein Block.
  process.stderr.write(`[push-stand] Pruefung/Erzeugung fehlgeschlagen: ${fehler.message}\n`);
  process.exitCode = 1;
}
