# CLAUDE.md

> Führende Regel- und Konfigurationsdatei für Claude Code in diesem Projekt.
> Ersetzt die frühere `AGENTS.md` (diese verweist jetzt nur noch hierher).

## Verbindliche Standards

Für alle SEO-/GEO-/Meta-/Content-Aufgaben gilt verbindlich:
@SEO-GEO-STANDARDS.md

Design/Verhalten gemäß:
@DESIGN.md

## Arbeitsweise & Workflow

Phasenweises Vorgehen und Stopp-Punkte gemäß:
@phasenweise-oder-stopps-implementieren.md

## Code- & UI-Regeln

- **Mobile-First** entwickeln.
- **Maximal 700 Zeilen pro Datei.**

## Dev-Server

- **NIEMALS automatisch `npm run dev` oder `pnpm dev` starten.**
- Der Dev-Server läuft oft bereits im Hintergrund.
- Automatisches Starten verursacht Port-Konflikte (`EADDRINUSE`).
