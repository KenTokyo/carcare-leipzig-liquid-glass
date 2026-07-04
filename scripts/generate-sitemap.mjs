// Sitemap-Generator — erzeugt public/sitemap.xml automatisch beim Build (prebuild).
// Routen kommen aus scripts/routes.mjs (gemeinsame Quelle mit dem Prerender).
// NICHT public/sitemap.xml manuell editieren – wird bei jedem Build überschrieben.

import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { getRoutes } from './routes.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const SITE = 'https://www.carcare-center.de';

const routes = getRoutes();
const today = new Date().toISOString().slice(0, 10);

const body = routes
  .map(
    (r) => `  <url>
    <loc>${SITE}${r.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${r.changefreq}</changefreq>
    <priority>${r.priority}</priority>
  </url>`
  )
  .join('\n');

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- Auto-generiert von scripts/generate-sitemap.mjs — nicht manuell editieren -->
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${body}
</urlset>
`;

writeFileSync(resolve(root, 'public/sitemap.xml'), xml);
const articleCount = routes.filter((r) => r.path.startsWith('/autoaufbereitung-wissen/')).length;
console.log(`sitemap.xml erzeugt: ${routes.length} URLs (${articleCount} Artikel, ${routes.length - articleCount} statische Seiten).`);
