// Kontaktbogen fuer `npm run bilder`: dieselben Zeilen wie docs/bilder/README.md, aber mit
// Vorschaubild je Stelle und Suchfeld. Eigenstaendige HTML-Datei (Bilder eingebettet), damit sie
// sich ohne Server oeffnen und weitergeben laesst. Liegt unter output/ und wird nicht versioniert.
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';

const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/**
 * @param {object} k
 * @param {string} k.ziel                 Zieldatei
 * @param {object[]} k.zeilen             Stellen (nr, seite, ort, datei, rolle, info)
 * @param {string[]} k.seitenFolge        Reihenfolge der Seiten ('alle' zuerst)
 * @param {(route: string) => string} k.seitenName
 * @param {(datei: string) => string} k.dateiName
 * @param {(info: object) => string} k.datumZelle
 * @param {(datei: string) => string|null} k.vorschauQuelle   lokale Bilddatei fuer die Vorschau oder null
 * @param {string} k.kopfzeile            Stand und Zahlen fuer den Seitenkopf
 */
export async function schreibeKontaktbogen(k) {
  // Jedes Vorschaubild steht nur EINMAL im Dokument (als CSS-Klasse), egal wie oft die Datei vorkommt.
  const klassen = new Map();
  const regeln = [];
  for (const d of new Set(k.zeilen.map((z) => z.datei).filter(Boolean))) {
    const quelle = k.vorschauQuelle(d);
    if (!quelle) continue;
    const puffer = await sharp(quelle).resize({ width: 360, withoutEnlargement: true })
      .flatten({ background: '#9ca3af' }).jpeg({ quality: 68 }).toBuffer();
    const klasse = `v${klassen.size}`;
    klassen.set(d, klasse);
    regeln.push(`.${klasse}{background-image:url(data:image/jpeg;base64,${puffer.toString('base64')})}`);
  }

  const abschnitte = k.seitenFolge.filter((s) => k.zeilen.some((z) => z.seite === s)).map((seite) => {
    const reihen = k.zeilen.filter((z) => z.seite === seite).map((z) => {
      const i = z.info ?? {};
      const m = i.motiv ?? {};
      const vermerk = z.vermerk ? `${z.vermerk.zeichen} ${z.vermerk.text}${z.vermerk.notiz ? `: ${z.vermerk.notiz}` : ''}` : '';
      const suche = `b${z.nr} ${k.seitenName(seite)} ${z.ort} ${z.datei} ${m.motiv ?? ''} ${m.offen ?? ''} ${vermerk}`.toLowerCase();
      const klasse = klassen.get(z.datei);
      const ersatz = z.rolle === 'platzhalter' ? (z.medium === 'video' ? 'Video fehlt' : 'Foto fehlt') : 'extern';
      // Erledigte Vermerke (angepasst, in Ordnung) gruen, offene orange — der Stand ist beim Durchscrollen lesbar.
      const erledigt = ['angepasst', 'ok'].includes(z.vermerk?.status);
      return `<article data-suche="${esc(suche)}"${z.vermerk ? ` class="vermerkt${erledigt ? ' erledigt' : ''}"` : ''}><div class="nr">B${z.nr}</div>`
        + `<div class="bild ${klasse ?? 'leer'}">${klasse ? '' : esc(ersatz)}</div>`
        + `<div class="text">${vermerk ? `<div class="vermerk">${esc(vermerk)}</div>` : ''}<div class="ort">${esc(z.ort)}</div>`
        + `<div class="datei">${esc(z.datei ? k.dateiName(z.datei) : '—')} · <span class="datum">${esc(z.datei ? k.datumZelle(i) : '—')}</span></div>`
        + `${m.motiv ? `<div class="motiv">${esc(m.motiv)}</div>` : ''}`
        + `${m.offen ? `<div class="offen">Offen: ${esc(m.offen)}</div>` : ''}</div></article>`;
    }).join('\n');
    const pfad = seite === 'alle' ? '' : ` <span>${esc(seite)}</span>`;
    return `<section><h2>${esc(k.seitenName(seite))}${pfad}</h2>${reihen}</section>`;
  }).join('\n');

  fs.mkdirSync(path.dirname(k.ziel), { recursive: true });
  fs.writeFileSync(k.ziel, `<!doctype html>
<html lang="de"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>Bilder der Website · CarCare Center</title>
<style>
:root{--grund:#f6f7f9;--karte:#fff;--text:#111827;--leise:#4b5563;--linie:#e5e7eb;--akzent:#1d4ed8;--warn:#92400e}
*{box-sizing:border-box}body{margin:0;background:var(--grund);color:var(--text);font:15px/1.45 system-ui,-apple-system,"Segoe UI",sans-serif}
header{position:sticky;top:0;z-index:2;background:var(--karte);border-bottom:1px solid var(--linie);padding:14px 16px}
h1{margin:0 0 4px;font-size:20px}header p{margin:0 0 10px;color:var(--leise);font-size:13px}
input{width:100%;max-width:520px;padding:9px 12px;border:1px solid var(--linie);border-radius:8px;font:inherit}
main{max-width:1100px;margin:0 auto;padding:8px 16px 48px}section{margin-top:28px}
h2{font-size:17px;margin:0 0 10px}h2 span{font:13px ui-monospace,monospace;color:var(--leise);font-weight:400}
article{display:grid;grid-template-columns:64px 168px 1fr;gap:14px;align-items:center;background:var(--karte);border:1px solid var(--linie);border-radius:10px;padding:10px;margin-bottom:8px}
.nr{font-weight:700;font-size:18px;color:var(--akzent)}.bild{width:168px;height:100px;border-radius:6px;background:#d1d5db center/cover no-repeat}
.bild.leer{display:flex;align-items:center;justify-content:center;color:var(--leise);font-size:12px;background:repeating-linear-gradient(45deg,#e5e7eb 0 8px,#f3f4f6 8px 16px)}
.ort{font-weight:600}.datei{font:12.5px ui-monospace,monospace;color:var(--leise);margin-top:2px;overflow-wrap:anywhere}
.datum{white-space:nowrap}.motiv{font-size:13px;margin-top:4px}.offen{font-size:12.5px;color:var(--warn);margin-top:3px}
article.vermerkt{border-color:#f59e0b;box-shadow:inset 3px 0 0 #f59e0b}
.vermerk{display:inline-block;margin-bottom:4px;padding:2px 8px;border-radius:999px;background:#fef3c7;color:#92400e;font-size:12px;font-weight:700}
article.erledigt{border-color:#16a34a;box-shadow:inset 3px 0 0 #16a34a}article.erledigt .vermerk{background:#dcfce7;color:#166534}
@media (max-width:640px){article{grid-template-columns:48px 1fr;align-items:start}.bild{grid-column:1/-1;width:100%;height:160px;order:-1}}
${regeln.join('\n')}
</style></head><body>
<header><h1>Bilder der Website · CarCare Center</h1>
<p>${esc(k.kopfzeile)}</p>
<input type="search" placeholder="Suchen: B12, Karriere, Ferrari, smart-repair …" aria-label="Bildstellen durchsuchen"></header>
<main>${abschnitte}</main>
<script>
const feld=document.querySelector('input');feld.addEventListener('input',()=>{const q=feld.value.trim().toLowerCase();
document.querySelectorAll('article').forEach(a=>{a.hidden=q&&!a.dataset.suche.includes(q)});
document.querySelectorAll('section').forEach(s=>{s.hidden=![...s.querySelectorAll('article')].some(a=>!a.hidden)})});
</script></body></html>
`);
}
