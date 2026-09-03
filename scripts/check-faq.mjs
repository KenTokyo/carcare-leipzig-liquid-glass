/**
 * Build-Waechter fuer FAQ-Inhalte.
 *
 * Eine gemeinsame Quelle (`data/faqs.ts`) verhindert, dass sichtbarer Text und
 * `FAQPage`-Markup AUSEINANDERLAUFEN. Sie verhindert aber nicht, dass ein
 * Eintrag ausgezeichnet wird, den gar keine Seite rendert — genau das war der
 * Zustand des Wissensbereichs bis 2026-09-01: drei Fragen nur im JSON-LD,
 * kein sichtbarer Block. Google verlangt fuer `FAQPage` sichtbaren
 * Seiteninhalt; ein Verstoss kostet die Rich Results der Seite.
 *
 * Dieses Skript laeuft in `prebuild` und bricht den Build ab, wenn:
 *   1. eine Route in `faqsByRoute` von keiner Seite gerendert wird,
 *   2. `pageSchemas` ein `faqSchema` fuer eine Route ausgibt, die es in
 *      `faqsByRoute` nicht gibt,
 *   3. ein `faqSchema` aus einer anderen Quelle als `faqsByRoute` oder
 *      `article.faqs` gespeist wird (Rueckfall in die Doppelpflege),
 *   4. ein Artikel in `knowledgeArticles.ts` FAQs fuehrt, ohne dass die
 *      Artikelseite sie rendert.
 *
 * Bewusst textuell statt per Import: das Skript laeuft vor dem Build, ohne
 * TypeScript-Transpilation, und soll auch dann greifen, wenn der Code nicht
 * kompiliert.
 */
import fs from 'node:fs';
import path from 'node:path';

const lies = (p) => fs.readFileSync(p, 'utf8');
const fehler = [];
const hinweise = [];

// ---------- Quelle ----------
const faqsSrc = lies('data/faqs.ts');
const quellRouten = [...faqsSrc.matchAll(/^ {2}'(\/[^']*)':/gm)].map((m) => m[1]);
if (!quellRouten.length) fehler.push('data/faqs.ts: keine Routen gefunden — Format geaendert?');

// ---------- Wer rendert sichtbar? ----------
const tsxDateien = [];
for (const wurzel of ['pages', 'components']) {
  (function w(d) {
    for (const f of fs.readdirSync(d, { withFileTypes: true })) {
      const p = path.join(d, f.name);
      f.isDirectory() ? w(p) : /\.tsx$/.test(f.name) && tsxDateien.push(p);
    }
  })(wurzel);
}
/**
 * DURCHREICHENDE KOMPONENTEN — warum es diesen Schritt gibt.
 *
 * Der Waechter suchte urspruenglich nur nach `<PageFAQ route="…">`. Sobald eine
 * Layout-Komponente dazwischentritt und die Route weitergibt, findet er nichts mehr
 * und meldet lauter Waisen — genau das passierte am 2026-09-03 beim ersten Umzug auf
 * `ServiceLayout` (Backlog 1.14). Der bequeme Ausweg waere gewesen, den Komponenten-
 * namen hier fest einzutragen. Dann waere der Waechter beim naechsten Layout wieder
 * blind, diesmal aber lautlos: kein Abbruch, sondern eine Waise, die durchrutscht.
 *
 * Stattdessen wird die Durchreichung ERKANNT: Jede .tsx, die `PageFAQ` eine Route als
 * Ausdruck uebergibt (`route={…}`), gilt als Durchreicher. Deren eigene Verwendungen
 * mit literaler Route zaehlen dann ebenfalls als „sichtbar gerendert".
 */
const durchreicher = new Set();
for (const datei of tsxDateien) {
  if (/<PageFAQ\s+route=\{/.test(lies(datei))) durchreicher.add(path.basename(datei, '.tsx'));
}

/**
 * Text der OEFFNENDEN JSX-Tags einer Komponente, inklusive aller Props.
 *
 * Kein simples `<Name[^>]*>`: Ein `>` kann in einem Ausdrucks-Prop stehen
 * (`items={xs.map((x) => x)}`) und wuerde das Tag zu frueh beenden. Deshalb Klammern
 * mitzaehlen und Zeichenketten ueberspringen.
 */
function oeffnendeTags(quelle, name) {
  const treffer = [];
  const start = new RegExp(`<${name}\\b`, 'g');
  let m;
  while ((m = start.exec(quelle))) {
    let tiefe = 0;
    let i = m.index + m[0].length;
    for (; i < quelle.length; i++) {
      const c = quelle[i];
      if (c === '{') tiefe += 1;
      else if (c === '}') tiefe -= 1;
      else if (c === '"' || c === "'" || c === '`') {
        const ende = quelle.indexOf(c, i + 1);
        i = ende === -1 ? quelle.length : ende;
      } else if (c === '>' && tiefe === 0) break;
    }
    treffer.push(quelle.slice(m.index, i));
  }
  return treffer;
}

const gerendert = new Set();
const ueberDurchreicher = new Set();
for (const datei of tsxDateien) {
  const s = lies(datei);
  for (const m of s.matchAll(/<PageFAQ\s+route="([^"]+)"/g)) gerendert.add(m[1]);
  // FAQSection ohne `faqs`-Prop rendert die Startseite aus der Quelle
  for (const m of s.matchAll(/faqsByRoute\['(\/[^']*)'\]/g)) gerendert.add(m[1]);
  for (const name of durchreicher) {
    for (const tag of oeffnendeTags(s, name)) {
      const r = /\broute="([^"]+)"/.exec(tag);
      if (r) {
        gerendert.add(r[1]);
        ueberDurchreicher.add(r[1]);
      }
    }
  }
}

for (const route of quellRouten) {
  if (!gerendert.has(route)) {
    fehler.push(
      `Waise: '${route}' steht in data/faqs.ts, wird aber von keiner Seite gerendert.\n` +
      `        Entweder <PageFAQ route="${route}" /> auf der Seite einbinden (oder eine\n` +
      `        Layout-Komponente wie <ServiceLayout route="${route}" …>) oder den Eintrag entfernen.`
    );
  }
}

// ---------- Schema ----------
const schemaSrc = lies('seo/pageSchemas.ts');
const schemaAufrufe = [...schemaSrc.matchAll(/faqSchema\(([^)]*)\)/g)].map((m) => m[1].trim());
for (const arg of schemaAufrufe) {
  const ausQuelle = /^faqsByRoute\['(\/[^']*)'\]$/.exec(arg);
  if (ausQuelle) {
    if (!quellRouten.includes(ausQuelle[1])) {
      fehler.push(`seo/pageSchemas.ts: faqSchema fuer '${ausQuelle[1]}', diese Route fehlt in data/faqs.ts.`);
    }
    continue;
  }
  if (arg === 'article.faqs') continue; // Artikel-Variante, unten geprueft
  fehler.push(
    `seo/pageSchemas.ts: faqSchema(${arg}) speist sich weder aus faqsByRoute noch aus article.faqs.\n` +
    `        Das ist der Rueckfall in die Doppelpflege — Inhalte gehoeren nach data/faqs.ts.`
  );
}

// ---------- Artikel-Variante ----------
const artikelSrc = lies('data/knowledgeArticles.ts');
const artikelPfade = [...artikelSrc.matchAll(/path:\s*'([^']+)'/g)].map((m) => m[1]);
const artikelMitFaq = (artikelSrc.match(/^\s*faqs:\s*\[/gm) ?? []).length;
const layoutSrc = lies('components/ArticleLayout.tsx');
if (artikelMitFaq > 0 && !/faqs=\{article\.faqs\}/.test(layoutSrc)) {
  fehler.push(
    'components/ArticleLayout.tsx rendert article.faqs nicht, obwohl Artikel FAQs fuehren.\n' +
    '        Die Artikelseiten zeichnen dann FAQPage-Inhalte aus, die niemand sieht.'
  );
}
if (artikelMitFaq && artikelMitFaq !== artikelPfade.length) {
  hinweise.push(
    `${artikelPfade.length} Artikel, davon ${artikelMitFaq} mit FAQ-Block. ` +
    'Artikel ohne FAQs erzeugen kein FAQPage-Markup — das ist zulaessig.'
  );
}

// ---------- Ergebnis ----------
if (hinweise.length) for (const h of hinweise) console.log(`[check-faq] Hinweis: ${h}`);
if (fehler.length) {
  console.error('\n[check-faq] BUILD ABGEBROCHEN — FAQ-Markup und sichtbarer Inhalt passen nicht zusammen:\n');
  for (const f of fehler) console.error('  - ' + f);
  console.error('');
  process.exit(1);
}
console.log(
  `[check-faq] ok: ${quellRouten.length} Routen aus data/faqs.ts, alle sichtbar gerendert; ` +
  `${schemaAufrufe.length} faqSchema-Aufrufe, alle aus der Quelle gespeist.`
);
// Die Durchreichung sichtbar machen: Ein Waechter, der ueber einen Mechanismus prueft,
// den niemand im Log sieht, ist schwer zu widerlegen, wenn er einmal falsch liegt.
if (durchreicher.size) {
  console.log(
    `[check-faq] davon ${ueberDurchreicher.size} ueber Layout-Komponente ` +
    `(${[...durchreicher].sort().join(', ')}).`
  );
}
