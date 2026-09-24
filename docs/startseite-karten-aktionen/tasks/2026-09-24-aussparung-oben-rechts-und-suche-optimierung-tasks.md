# Optimierung — Aktions-Aussparung und globale Suche

**Bezug:** `2026-09-24-aussparung-oben-rechts-und-suche-tasks.md` (Kommentarsektion). Die dort
behobenen Punkte 1–8 stehen hier nicht mehr.

| Nr. | Schwere | Befund | Stand |
|---|---|---|---|
| O1 | 🟢 Niedrig | **Treffer zeigten die langen SEO-Titel** („Hagelschadenreparatur Leipzig \| Audatex"). | ✅ **fixed 2026-09-24:** Anzeige nur mit dem ersten Teil; gesucht wird weiter ueber den vollen Titel, „Audatex" findet die Seite also trotzdem (`kurztitel` in `SuchDialog.tsx`) |
| O2 | 🟡 Mittel | **Welche Suchen ohne Treffer bleiben, weiss niemand.** Genau das waeren die Inhaltsluecken — die Synonymliste entstand aus 36 geratenen Begriffen, nicht aus echten Anfragen. | offen — **Vorschlag, braucht Entscheidung User** (Datenschutz): nur leere Anfragen zaehlen, ohne Nutzerbezug, z. B. ueber das vorhandene Webanalyse-Werkzeug, sofern eines eingesetzt wird; Eintrag in die Datenschutzerklaerung (R6) |
| O3 | 🟢 Niedrig | **Synonyme sind handgepflegt** (`SYNONYME` in `lib/suche.ts`). Neue Leistungsnamen oder Kundenworte kommen nicht von selbst hinein. | offen — mit O2 zusammen nachziehen |
| O4 | 🟢 Niedrig | **Unter 1024 px keine Aussparung** — oben rechts sitzt das Menue, die Aktionen stehen in der Leiste unten. So gewollt (Daumenreichweite), aber ein Unterschied zur Desktop-Fassung. | Rueckfrage an den User im Abschluss |
