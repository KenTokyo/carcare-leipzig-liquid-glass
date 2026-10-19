# Optimierung zu R33-a (Mitarbeiterstimmen mit der Mechanik der Leistungskarten)

**Bezug:** `docs/mobil-akkordeon-faq/tasks/2026-10-19-stimmen-mobil-mechanik-tasks.md`
**Stand:** 2026-10-19. Nummern sind Repo-Befunde (Unterpunkte von R33), keine Kundennummern. `R33-e` steht zusätzlich im
Optimierungsplan von R33 (`2026-10-19-akkordeon-mittig-maus-optimierung-tasks.md`), weil er Leistungs- und Stellenkarten
betrifft.

| Nr. | Schwere | Befund | Beleg | Stand |
|---|---|---|---|---|
| **R33-e** | 🟠 | **Karten nach dem Drehen 0 px breit** (iPad hoch → quer, Fenster aufziehen): Leistungs- und Stellenkarten seit 16.10., die Stimmen nach dem ersten Umbau ebenso. Framer übernahm ein erst beim Wechsel auf den Desktop gesetztes `animate` nie | Plan Phase 4b | ✅ behoben: `animate` immer gesetzt, mobil `flexGrow` fest 1, Desktop-Höhe per `lg:h-full`; Wächter DREHEN in `npm run akkordeon` |
| O1 | 🟡 | **Graue Ränder im Streifen** (erste Fassung): `object-cover` schnitt das Foto am Kasten der Bildebene ab, verkleinert im Streifen reichte es nicht bis zum Rand (360 px: 8 bis 13 % der Streifenpixel) | Pixelvergleich, Phase 3 | ✅ behoben (feste Bildgröße mobil) und als BILDLAGE in `npm run akkordeon` geprüft, mit Gegenprobe |
| O2 | 🟡 | **Prüfer: Mausrad-Schritt (d) für die Stimmen wirkungslos.** Mit festen 260 px lag der Zeiger danach unter der letzten Stimme statt auf einem Streifen; auch die alte Kette hätte bestanden | Ist-Messung Phase 1 | ✅ behoben: Rad dreht bis zum nächsten Streifen, sonst Messfehler |
| O3 | 🟡 | **Prüfer: Darüberfahren nach dem Rad (f) ohne Bewegung.** Nach dem genau dosierten Rad fuhr (f) auf die Stelle, an der der Zeiger schon stand | erster Lauf Phase 4 | ✅ behoben: andere Karte oder andere Stelle |
| O4 | 🟡 | **Prüfer: „frei im Bild“ zu streng** (20 px Rand). Neben der 500 px hohen offenen Stimme bleiben in 900 × 800 oben und unten je 58 px | erster Lauf Phase 4 | ✅ behoben: Treffertest und 4 px Rand |
| O5 | 🟢 | **Zweiter Klick nach dem Wischen ignoriert:** `zeigen` prüfte `bewegtSich`, und Lenis meldet nach nativem Scrollen noch 400 ms `isScrolling: 'native'`. Ein Tipp kurz nach dem Wischen auf die angeschnittene Stimme tat nichts. Für einen Klick ist nur Lenis' eigenes Gleiten ein Grund zu warten (dann ändert sich die Lage noch); nach nativem Scrollen steht sie | Code-Durchsicht nach Phase 4 | ✅ behoben: `zeigen` wartet nur auf `'smooth'` und laufende Kartenanimationen; die Zeigerabsicht prüft weiter auch `'native'` |
| O6 | 🟢 | **Kartenbreite gerundet gemessen** (`clientWidth`). Bei Browser-Zoom oder krummer Pixeldichte ist die Karte nicht ganzzahlig breit; die Bildlage im Streifen hätte um Bruchteile eines Pixels daneben gelegen | Code-Durchsicht | ✅ behoben: `getBoundingClientRect().width` |
| O7 | 🟢 | **Kachel wird während des Aufgehens von der Fensterkante aufgedeckt** (Zwischenbild 50 %: Text unten angeschnitten). Vorher wuchs sie mit der Karte mit, war dabei aber auf ein Drittel der jeweiligen Höhe begrenzt und scrollte. Wie auf der Startseite, dort steht die Kachel über die ganze Höhe | Zwischenbilder Phase 3 | ⬜ Sichtprüfung am Telefon (A56, iPhone); falls störend: Kachel erst gegen Ende einblenden (Verzögerung ~300 ms) |
| O8 | 🟢 | **FLIP auch für Stimmen außerhalb des Fensters** (wie R31 bei den Leistungskarten): Bei 5 Stimmen vernachlässigbar, gemessen 1,0 bis 1,7 ms Hauptthread je Bild | Spur Phase 3 | ⬜ mit R31 gemeinsam lösen (gemeinsamer Hook `useMobilAkkordeon`) |
| O9 | 🟢 | **`npm run akkordeon` dauert länger** (ein Ziel und zwei Mausläufe mehr, rund 1:35 → 2:30 min) | Läufe Phase 4/5 | ⬜ Hinweis; bei Bedarf Maus-Teil der Stimmen nur in 393 × 851 |
| O10 | 🟡 | **Feste Ports kollidieren zwischen parallelen Worktrees:** Prerender (4319) und jedes Messwerkzeug (4183 bis 4211) starten `vite preview` mit festem Port und `--strictPort`. Baut oder misst eine zweite Sitzung gleichzeitig, bricht der Build ab (`check-faq-html`: 1 von 29 Seiten vorgerendert, `dist/index.html` nur 12 KB) oder das Werkzeug. Am 19.10. zweimal (Build gegen `nav-mobil-menue`, deren `vite preview` auf 4193) | Phase 5 | ⬜ Vorschlag: Port je Worktree versetzen (z. B. `CC_PORT` oder freier Port über `--port 0` und Rückmeldung), danach alle Werkzeuge und den Prerender umstellen. Bis dahin hier: Läufe warten auf freie Ports und wiederholen bei Konflikt |

## Kommentare
**Eingehalten:** Ursache vor der Lösung gemessen (Spur, Lage je Fall, Inline-Stile nach dem Drehen) ✅, Gegenprobe für jede neue
Prüfung ✅, Prüferfehler an der Ursache behoben statt Grenzen gesenkt ✅, alt gegen neu am selben Rechner ✅, unter 700 Zeilen ✅,
keine Kundennummern vergeben ✅.
**Lehre aus R33-e:** Ein Werkzeug, das nur eine Gerätelage misst, sieht nicht, was beim Wechsel der Lage passiert. Kein Prüfer
drehte das Gerät; gefunden hat es eine Handprobe mit `setViewport` mitten im Lauf. Seitdem eigener Schritt in
`npm run akkordeon` (`scripts/lib/akkordeon-drehen.mjs`), gegen den echten Fehler geprüft (Fix kurz zurückgenommen).
