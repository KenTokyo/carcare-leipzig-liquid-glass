---
title: Solidroad Global HUD Shell Nachbesserung
description: Globalen Card-/Aperture-Effekt und fluidere Navbar-Anbindung nach Solidroad-Referenz umgesetzt.
date: 2026-06-04
status: success
effort: M
files:
  - App.tsx
  - components/Navbar.tsx
  - components/HeroSection.tsx
  - components/Footer.tsx
  - index.css
  - docs/solidroad-hero-shell/tasks/2026-06-03-solidroad-hero-shell.md
tags: [feature, ui, docs, playwright]
---

## Zusammenfassung
Der Solidroad-Effekt wurde von einer Hero-/Navbar-Anpassung zu einer globalen HUD-Shell erweitert. Root/Main/Footer nutzen nun einen hellen Canvas mit gerundeter Card-Wirkung, der Footer bleibt als inset/rounded Reveal-Karte sichtbar, und die Navbar ist als top-flush fixed HUD-Ausschnitt statt separater Box gestaltet. Farben, Texte und Inhaltsstruktur blieben unveraendert.

## Nachbesserung
Die Navbar-Raender wurden zusaetzlich nachgezogen: linke/rechte Kante und Unterkante nutzen nun eine sichtbare, aber subtile Border in derselben Linienfamilie wie der globale Frame. Ein Connector-Ansatz mit separaten Kurven wurde verworfen, weil er nicht zusammenhaengend genug wirkte.

## Validierung
`npx tsc --noEmit` und `npm run build` waren erfolgreich. Playwright CLI verglich Solidroad live sowie CarCare Top-, Mid-, Footer-, Navbar-Edge- und Mobile-Zustaende ueber die Build-Preview auf `127.0.0.1:4173`. Es gab keine Console-Errors; die bestehende Tailwind-CDN-Warnung bleibt unveraendert.
