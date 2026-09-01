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
const gerendert = new Set();
for (const datei of tsxDateien) {
  const s = lies(datei);
  for (const m of s.matchAll(/<PageFAQ\s+route="([^"]+)"/g)) gerendert.add(m[1]);
  // FAQSection ohne `faqs`-Prop rendert die Startseite aus der Quelle
  for (const m of s.matchAll(/faqsByRoute\['(\/[^']*)'\]/g)) gerendert.add(m[1]);
}

for (const route of quellRouten) {
  if (!gerendert.has(route)) {
    fehler.push(
      `Waise: '${route}' steht in data/faqs.ts, wird aber von keiner Seite gerendert.\n` +
      `        Entweder <PageFAQ route="${route}" /> auf der Seite einbinden oder den Eintrag entfernen.`
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
