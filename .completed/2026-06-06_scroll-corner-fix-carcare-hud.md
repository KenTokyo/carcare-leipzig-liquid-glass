---
title: CarCare HUD Scroll-Corner Fix
description: Linke obere Shell-Ecke bleibt beim Scrollen rund und Footer-Cutout schaltet nur im Footer-Zustand.
date: 2026-06-06
status: success
effort: S
files:
  - components/Navbar.tsx
  - index.css
  - docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md
tags: [bugfix, ui, docs, playwright]
---

## Zusammenfassung
Die Cutout-Absenkung der Navbar ist nun an echte Footer-Sichtbarkeit gebunden, nicht mehr an jeden Scrollzustand. Zusaetzlich zeichnet die fixed Header-Rail die aeusseren oberen Shell-Ecken selbst per radialer Maske, damit die linke obere Rundung beim Hero-Scroll nicht spitz wird, sobald die echte Main-Rundung aus dem Viewport gescrollt ist.

## Validierung
`npx tsc --noEmit` und `npm run build` waren erfolgreich. Playwright erzeugte `output/playwright/phase26-hero-scroll-left-corner.png`, `output/playwright/phase26-hero-scroll.png` und `output/playwright/phase26-footer-end.png`; im Hero-Scroll bleibt der Cutout bei `y=12`, im Footer-Endzustand bei `y=26` mit `is-footer`.
