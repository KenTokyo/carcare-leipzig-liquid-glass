# Optimierungstasks nach Solidroad Hero Shell

**Erstellt:** 2026-06-03  
**Referenzplanung:** `docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`  
**Status:** Offen

## Ziel
Die nach der Umsetzung verbliebene technische Auffaelligkeit sauber planen, ohne die aktuelle Hero-/Navbar-Implementierung zu blockieren.

## Findings nach Schwere

### Mittel -- Tailwind CDN im Produktionsbuild
**Befund:** Playwright meldet weiterhin die bestehende Warnung, dass `cdn.tailwindcss.com` nicht fuer Produktion empfohlen ist.  
**Risiko:** Unnoetige Runtime-Abhaengigkeit, schlechtere Performance-Kontrolle, potenziell instabile Klassengenerierung bei komplexeren Arbitrary-Werten.  
**Plan:**
* [ ] Tailwind als lokale Build-Dependency einrichten.
* [ ] `tailwind.config` aus aktueller CDN-Konfiguration in `index.html` uebernehmen.
* [ ] `index.css` um Tailwind-Directives erweitern und Vite/PostCSS anbinden.
* [ ] CDN-Script aus `index.html` entfernen.
* [ ] `npx tsc --noEmit`, `npm run build` und Playwright-Visual-Check wiederholen.

## Bereits gefixt
* [x] Fehlender Favicon-Request durch `link rel="icon"` auf `/assets/carcare-center-logo.webp` behoben.
