// Zentrale Routenliste — Single Source of Truth für Sitemap UND Prerender.
// Statische Top-Level-Routen sind hier gepflegt (Quelle: App.tsx); Wissens-Artikel
// werden automatisch aus data/knowledgeArticles.ts abgeleitet, damit neue Artikel
// ohne Handarbeit in Sitemap + Prerender landen.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const staticRoutes = [
  { path: '/', changefreq: 'weekly', priority: '1.0' },
  { path: '/leistungen', changefreq: 'monthly', priority: '0.9' },
  { path: '/unfallinstandsetzung-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/fahrzeugaufbereitung-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/smart-repair-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/autolackierung-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/dellenentfernung-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/hagelschadenreparatur-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/felgenreparatur-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/fuhrparkservice-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/autoglas-leipzig', changefreq: 'monthly', priority: '0.9' },
  { path: '/geschaeftskunden', changefreq: 'monthly', priority: '0.9' },
  { path: '/kontakt', changefreq: 'yearly', priority: '0.8' },
  { path: '/karriere', changefreq: 'monthly', priority: '0.7' },
  { path: '/autoaufbereitung-wissen', changefreq: 'weekly', priority: '0.7' },
];

// Alle Routen (statisch + Artikel) inkl. Sitemap-Metadaten.
export function getRoutes() {
  const src = readFileSync(resolve(root, 'data/knowledgeArticles.ts'), 'utf8');
  const articleRoutes = [...src.matchAll(/path:\s*'(\/autoaufbereitung-wissen\/[^']+)'/g)]
    .map((m) => m[1])
    .filter((path, i, arr) => arr.indexOf(path) === i) // Duplikate entfernen
    .map((path) => ({ path, changefreq: 'monthly', priority: '0.6' }));
  return [...staticRoutes, ...articleRoutes];
}
