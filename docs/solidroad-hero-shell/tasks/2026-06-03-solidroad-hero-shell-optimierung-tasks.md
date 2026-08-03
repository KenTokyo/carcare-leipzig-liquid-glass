# Optimierungstasks nach Solidroad Hero Shell

**Erstellt:** 2026-06-03  
**Referenzplanung:** `docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md`  
**Status:** Offen

## Ziel
Die nach der Umsetzung verbliebene technische Auffaelligkeit sauber planen, ohne die aktuelle Hero-/Navbar-Implementierung zu blockieren.

## Findings nach Schwere

### ✅ Mittel -- Tailwind CDN im Produktionsbuild *(erledigt am 2026-07-08, nachgetragen 2026-08-03)*
**Befund:** Playwright meldet weiterhin die bestehende Warnung, dass `cdn.tailwindcss.com` nicht fuer Produktion empfohlen ist.  
**Risiko:** Unnoetige Runtime-Abhaengigkeit, schlechtere Performance-Kontrolle, potenziell instabile Klassengenerierung bei komplexeren Arbitrary-Werten.  
**Plan:**
* [x] Tailwind als lokale Build-Dependency einrichten.
* [x] `tailwind.config` aus aktueller CDN-Konfiguration in `index.html` uebernehmen.
* [x] `index.css` um Tailwind-Directives erweitern und Vite/PostCSS anbinden.
* [x] CDN-Script aus `index.html` entfernen.
* [x] `npx tsc --noEmit`, `npm run build` und Playwright-Visual-Check wiederholen.

> **Status-Korrektur 2026-08-03 (keine Code-Aenderung):** Erledigt wurde das nicht hier, sondern in
> der eigenen Migration `docs/tailwind-build-migration/tasks/2026-07-08-cdn-*`. Verifiziert: kein
> `cdn.tailwindcss.com` mehr im Repo, Tailwind 3.4 laeuft build-time ueber Vite/PostCSS mit
> `tailwind.config.js`. Diese Liste stand nur noch faelschlich als offen.

## Bereits gefixt
* [x] Fehlender Favicon-Request durch `link rel="icon"` auf `/assets/carcare-center-logo.webp` behoben.
