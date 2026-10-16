# Optimierung zu „Startseite mobil“ (Befunde aus den Phasen)

**Angelegt:** 2026-10-16 · **Bezug:** `docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-tasks.md`
**Nummern:** Repo-Befunde `R<n>` (CLAUDE.md, Abschnitt Backlog). Höchste vorher: R24.

| Nr. | Schwere | Befund | Messung | Stand |
|---|---|---|---|---|
| O1 | 🔴 | Lenis' Anker-Handler ignorierte `defaultPrevented`: erster Tipp auf eine Stellenkarte (/karriere) scrollte rund 7.000 px zum Formular | `npm run akkordeon` (neues Kriterium „getippte Karte im Bild“) | ✅ behoben (`hooks/useSmoothScroll.ts`) |
| O2 | 🟠 | Zwei Kopien der drei Foto-Ebenen (`AutoDetailingExpertiseSection`, `ScrollPinnedProcess`) neben `PhotoBackdrop`, gleiche Werte inline | Codevergleich | ✅ behoben (beide nutzen `PhotoBackdrop`) |
| O3 | 🟡 | Mobil animierte Framer `flexGrow` mit, ohne sichtbare Wirkung, aber mit Layout in jedem Bild | Trace | ✅ behoben (Framer nur am Desktop) |
| O4 | 🟡 | Kontrastmesser traf die mobilen Fotoflächen nur zufällig (vier feste Stellen je Route) | Gegenprobe mit 10 % Schutz: ohne `--sektionen` nicht sicher | ✅ behoben (`--sektionen`) |
| O5 | 🟢 | `React.memo` je Karte geprüft | A/B 9 Tipps: 32,8 gegen 33,7 ms | ✅ verworfen, Messung im Kommentar an `Karte` |
| O6 | 🔴 | Getippte Karte wuchs nach OBEN aus dem Bild, wenn die offene Karte oberhalb des Fensters lag (Scroll-Verankerung setzt bei Transforms aus) | Bahn je Bild: 268 → −8 px | ✅ behoben (eigene Verankerung in `akkordeonMobil.ts`, Kriterium in `npm run akkordeon`) |
| O7 | 🟠 | Tipp-Hervorhebung (Signalblau 18 %, `index.css`) über dem sofort 340 px hohen Link-Kasten → „nächste Karte blitzt weiß auf“ | Kopflos nicht zeichenbar; Eigenschaft geprüft | ✅ behoben (`transparent` an den Karten, Kriterium im Werkzeug) |
| O8 | 🟠 | Textschutz am stehenden Foto stand beim Durchscrollen hinter den Karten | Bildschirmfotos, User | ✅ behoben (`.cc-kopfschutz`, `.cc-guard-mobil-licht`) |
| O9 | 🟡 | Fotowechsel vor dem Dekodieren: kurz nur der Schleier der neuen Ebene sichtbar | Ableitung, Gerät langsamer als Messrechner | ✅ behoben (`useDekodiert`) |
| O10 | 🟡 | Unterbrechungstest tippte ins Leere (festes Ziel außerhalb des Fensters) | Fehlersuche im Werkzeug | ✅ behoben (Ziel im laufenden Bild) |
| O11 | 🟢 | Erster Tipp nach dem Laden: 104–117 ms Bildlücke im GPU-Prozess (Kopflos, Dawn/SwiftShader) | Ablation: bleibt ohne Foto und mit `will-change` | ⬜ Hinweis; nur auf dem Gerät beurteilbar |
| **R25** | 🟠 | **Mitarbeiterstimmen** auf /karriere („Aus dem Team“, `Stimmen.tsx`) animieren mobil weiter die Höhe (Framer `height`), also Layout pro Bild wie vorher die Startseitenkarten | gleicher Mechanismus wie vor Phase 1 (16–18 ms je Bild bei 4×) | ⬜ offen, eigener Schritt: Fenster/Inhalt wie `akkordeonMobil.ts`; Kachel sitzt dort UNTEN, Bildebene und Kachel brauchen eigene Ruhelagen; danach `npm run akkordeon` um /karriere #stimmen erweitern |
| **R26** | 🟡 | **Lenis-Schleife läuft dauerhaft** (`requestAnimationFrame` in jedem Bild, auch ohne Scrollen). Dadurch rechnet Chrome auch Compositor-Animationen in jedem Bild auf dem Hauptthread nach (Stil der animierten Teilbäume, gemessen rund 125 Elemente und 0,9 ms je Bild ungedrosselt) | Trace der Akkordeon-Animation: Stil 70–230 ms je Tipp bei 4× trotz 0 Layout | ⬜ offen: Schleife nur bei Bewegung laufen lassen (Rad, Touch, Taste, `scrollTo`, Anker), Risiko: Anker und programmatisches Scrollen; danach `npm run akkordeon`, `npm run zielgruppen`, `npm run nav` |
| **R27** | 🟢 | **FAQ** animiert die Höhe (`height: auto`, 0,24 s): Layout pro Bild | 8–24 Layouts je Tipp, rund 4–5 ms je Bild bei 4× (wenig Seite darunter) | ⬜ offen, niedrig: erst angehen, wenn der User dort Ruckeln sieht |

## Kommentare
**Eingehalten:** gemessen statt geschätzt ✅, Ursache vor der Lösung bewiesen ✅, gewählte Lösung gegen vier Alternativen
geprüft ✅, Gegenproben (Kontrast, Akkordeon) ✅, unter 700 Zeilen ✅, keine Kundennummern vergeben ✅, Encoding ✅.
