# Optimierung — Karten-Vignette und schwebende Aktionen

**Bezug:** `2026-09-24-karten-vignette-schwebende-aktionen-tasks.md` (Kommentarsektion).
Die dort behobenen Punkte 1–6 stehen hier nicht mehr; hier nur, was danach offen blieb oder
beim Arbeiten als Verbesserung auffiel.

| Nr. | Schwere | Befund | Stand |
|---|---|---|---|
| O1 | 🟠 Hoch | **Die Ueberdeckungspruefung war ein Wegwerfskript.** Die schwebenden Knoepfe stehen auf jeder Seite; jede kuenftige Layoutaenderung kann Inhalt dauerhaft unter sie schieben, und niemand merkt es — die erste Fassung haette ohne den Zielgruppen-Waechter niemand bemerkt. | ✅ **fixed 2026-09-24:** `npm run schwebend` (`scripts/check-schwebend.mjs`, seit der zweiten Runde `npm run aussparung`), in der Messwerkzeug-Tabelle von `CLAUDE.md`. Vorher die Pflichtfrage beantwortet (Kopf des Skripts, fuenf Punkte) — die wichtigste: **gruen durch Verstecken**. Wer ueberall `data-aktionen-ausweichen` setzt, bekommt 0 Befunde; deshalb meldet das Skript je Route, an welchem Anteil der Positionen die Knoepfe ueberhaupt sichtbar sind |
| O2 | 🟢 Niedrig | **Ab `xl` stehen „Anrufen" und „Schaden melden" doppelt** — als Kreise in der Navbar und schwebend unten rechts. DESIGN.md nennt den Telefonknopf als Teil der Navbar. | ✅ **entschieden 2026-09-24 (User):** aus der Navbar genommen, beide stehen in der Aussparung oben rechts |
| O3 | 🟢 Niedrig | ✅ **erledigt 2026-09-24** (Hinweis mit Nummer unter dem Telefonknopf der Aussparung). **Am Desktop fuehrt `tel:` oft ins Leere** — ohne verknuepfte Telefon-App passiert beim Klick nichts. Die Nummer steht nur im Tooltip (`title`) und in der Ansage. | Vorschlag: beim Aufklappen die Nummer statt „Anrufen" zeigen („0341 - 261 77 90"). Nicht umgesetzt, weil die Navbar-Knoepfe dasselbe Wort tragen — beides zusammen entscheiden |
| O4 | 🟢 Niedrig | **Zwei verschiedene Hoehenregeln fuer „vor dem Footer ausblenden"** waeren kuenftig leicht wieder moeglich. | ✅ **fixed 2026-09-24:** eine Quelle, `hooks/useNaheSeitenende.ts`, genutzt von `MobileStickyCTA` und `SchwebendeAktionen` |
