# Optimierung — Liquid Glass (Pilot „Anrufen" → mobile Sticky-Buttons)

**Bezug:** `2026-09-24-liquid-glass-anrufen-tasks.md` (Kommentarsektion). Behobenes steht dort; hier,
was offen ist oder vom Urteil des Users abhaengt. Stand 2026-09-25: Glas NUR an den vier Knoepfen der
mobilen Leiste (`MobileStickyCTA`), Desktop oben rechts wieder Eisblau.

| Nr. | Schwere | Befund | Stand |
|---|---|---|---|
| L1 | 🟡 Mittel | **Eisblau-Regeln der Telefon-Pille blieben waehrend des Piloten in `styles/aussparung.css` stehen** und wurden von `cc-liquid` nur ueberstimmt — bis auf den Hover, der spezifischer war und die Glaspille blau faerbte (Bild, 2026-09-25). | ✅ **erledigt:** Hover-Konflikt im Glas behoben (`.cc-liquid:hover` setzt Hintergrund, Rand, Schatten selbst); seit der Entscheidung „nur mobil" sind die Eisblau-Regeln wieder das Desktop-Design — nichts mehr zu loeschen |
| L2 | 🟡 Mittel | **Vier `backdrop-filter`-Flaechen auf der festen mobilen Leiste** ueber dem kompositierten `.site-main-shell` (vorher eine). Hier nicht messbar, ob schwache Android-Geraete beim Scrollen ruckeln (2026-08-10 wurde `backdrop-filter` an zwei Stellen wegen Flimmern entfernt — dort allerdings sticky/Parallax INNERHALB von `<main>`). | offen — **an einem echten Mittelklasse-Android pruefen.** Rueckfallebene: `blur(20px)` → `blur(10px)` in `glas.css`, eine Zeile |
| L3 | 🟢 Niedrig | **Echte Lichtbrechung am Rand** (SVG `feDisplacementMap` als `backdrop-filter: url()`) fehlt bewusst: nur Chromium, auf iPhones gar nicht. | Angebot an den User — Aufwertung fuer Chrome/Android |
| L4 | 🟢 Niedrig | **Zwei Glas-Klassen im Projekt**: `.cc-glass-button` (dunkles Glas, Hero-Knoepfe am Desktop, index.css) und `cc-liquid` (helles, neutrales Glas, mobile Leiste). | bewusst getrennt, solange der User Glas nur mobil will; bei einer Ausweitung zusammenfuehren |
| L5 | 🟢 Niedrig | **Auf der weissen Aussparung zeigt sich kein Blur** — dahinter liegt nur Weiss. | ✅ **entschieden (User, 2026-09-25):** Desktop ohne Glas |
| L6 | 🟢 Niedrig | **Differenzprobe sieht nur die beiden Uebergaenge** der Aussparung. Andere Ueberdeckungen einer Pille misst derzeit KEINE Pruefung (die Routenpruefung misst, was UNTER der Aussparung liegt). | bewusst — aufgetreten ist bisher nur dieser eine Fall |
| L7 | 🟢 Niedrig | **Die zwei Knoepfe im Route-Fenster** („Apple Karten", „Google Maps") tragen noch den dunklen CTA-Verlauf, waehrend die Leiste darunter jetzt Glas ist. Das Fenster selbst ist schon eine helle, verwischte Flaeche (`bg-white/95 backdrop-blur-xl`). | **Rueckfrage an den User:** mit auf Glas oder dunkel lassen (Kontrast zur Leiste als „Auswahl")? |
