# Optimierung zu „Karte mittig, kein Schleier, FAQ als Akkordeon“ (Befunde aus den Phasen)

**Angelegt:** 2026-10-17 · **Bezug:** `docs/mobil-akkordeon-faq/tasks/2026-10-17-mobil-akkordeon-faq-tasks.md`
**Nummern:** Repo-Befunde `R<n>` (CLAUDE.md, Abschnitt Backlog). Höchste vorher: R29 (`docs/mobil-startseite/tasks/`).

| Nr. | Schwere | Befund | Messung | Stand |
|---|---|---|---|---|
| O1 | 🔴 | **Schatten unsichtbarer Fenster** (Technik vom 16.10.): Jede eingeklappte Karte trug ein 340 px hohes, 276 px nach oben ragendes Fenster MIT Schlagschatten. Zehn gestapelte Schatten dunkelten den Rand neben der Spalte ab, die Spalte wirkte wie ein „weißes Rechteck“ bis zur Überschrift | Pixel neben der Spalte (x = 28 / 365 / 378): mit Fensterschatten 144 / 176 / 202, ohne Karten 179 / 223 / 224 | ✅ behoben (eigene Schattenebene mit Deckkraft = Öffnungsgrad; Kriterium „Schatten außerhalb der Karte“ in `npm run akkordeon`, Gegenprobe 3/3) |
| O2 | 🟠 | **Textschutz am Kopf lief hinter die erste Karte** (`.cc-kopfschutz`, Weiß 88 % bis 96 px unter den Kopf) | Leistungen: Schutz bis 503 px, erste Karte ab 455 px | ✅ behoben (entfernt; Foto mobil erst 48 px über den Karten, Kopf auf reinem Weiß) |
| O3 | 🟠 | **`npm run akkordeon` zählte rAF-Rückrufe als Bilder.** Seit die Seite beim Tipp mitgleitet, rufen Scroll-Horcher bis zu sechs Rückrufe je Bild ab. Eine echte Höhen-Animation (Layout in 29 von 29 Bildern) galt als 24 % und blieb unter der Grenze von 60 % | Gegenprobe vorher 0 von 3, danach 3 von 3 | ✅ behoben (`bilderIn`: Rückrufe ohne Lücke über 2 ms = ein Bild; Pflichtfrage im Kopf ergänzt) |
| O4 | 🟡 | Linearer 48-px-Auslauf an der Oberkante des Fotos zeigte eine Kante, dazu die runden Ecken des Fotorahmens als Kastenkante | 255 → 163 in 48 px, Knick am Ende | ✅ behoben (Kosinus-Verlauf `.cc-auslauf-*`, mobil `rounded-none`) |
| O5 | 🟡 | FAQ-Nachgleiten bei langen Antworten hastig: feste 0,36 s für bis zu 463 px | Spitze 5,2 px/ms (/fahrzeugaufbereitung-leipzig) | ✅ behoben (Dauer nach Weg, `gleitDauer`: Spitze 3,7 px/ms) |
| O8 | 🟠 | **Gleiten auch beim Darüberfahren:** Unter 1024 px öffnen Karten auf Geräten mit Maus beim Hover; die erste Fassung glitt dann ebenfalls zur Mitte, die nächste Karte rutschte unter den Zeiger, eine Kette ohne Zutun | Fehler kurz eingebaut: Karte unter dem Zeiger 380 → 238 px | ✅ behoben (Gleiten nur im Tipp-Pfad, `mittig`), neuer Test HOVER OHNE GLEITEN in `npm run akkordeon` |
| O9 | 🟡 | **`npm run nav` seit 07.10. rot, unbemerkt:** Das Lektorat (L01) benannte „Autoglas / Scheibenfolien“ in „Autoglas & Scheibenfolien“ um; die von Hand getippte Erwartung im Prüfer blieb. Der Check läuft nicht im Build mit | 15/16, reproduzierbar | ✅ behoben (Erwartung nachgezogen, 16/16). Lehre: Prüfer außerhalb des Builds bei jeder Textänderung mitlaufen lassen, die Namen aus dem Katalog berührt |
| O6 | 🟢 | Kopfloses Chrome mit 4-fach gedrosselter CPU zeichnet nach dem Tipp bis zu 1,6 s lang die geöffnete Karte und das Hintergrundfoto nicht (Raster- und Dekodier-Rückstand). Geometrie stimmt, ohne Drossel pixelgleich nach 1,6 und 4,1 s | Bildschirmfotos Scratchpad `raster-*.png` | ⬜ Hinweis, nur am Gerät beurteilbar (Sichtabnahme A56/iPhone) |
| O7 | 🟢 | FAQ-Höhe läuft weiter mit Layout je Bild (`grid-template-rows`) | 1,3 ms Hauptthread je Bild bei 4× | ⬜ bewusst so: Nur-Transform hieße, alles unter der FAQ (auch Folgesektionen) als große Ebenen mitzuschieben, mit Rastern beim Start |
| **R30** | 🟡 | **Weißer Textschutz in den gepinnten Abläufen** („Unfallschaden? …“, „Wie läuft eine Autoaufbereitung ab?“): mobil `.cc-guard-mobil` (oben Weiß 78–82 %, Ausläufe). Kein Akkordeon, deshalb hier nicht angefasst; der User wollte den Schleier „vor allem bei den Akkordeons“ weg | Kopf steht dort über dem Foto, ohne Schutz unter AA (schwarzes Foto: 3,8 : 1) | ✅ erledigt 2026-10-18 (User: „so wie bei den Karten“): Kopf deckend weiß (`.cc-ablauf-kopf`), Foto erst ab der Schrittkarte, `.cc-guard-mobil` entfernt. Plan Phase 7 |
| R25 | 🟠 | (aus der Vorgängerplanung, unverändert) Mitarbeiterstimmen auf /karriere animieren mobil die Höhe | – | ⬜ offen |
| R26 | 🟡 | (aus der Vorgängerplanung, unverändert) Lenis-Schleife läuft dauerhaft | – | ⬜ offen |

## Kommentare
**Eingehalten:** Ursache vor der Lösung gemessen (Ablation mit Pixelwerten, Bahn je Bild) ✅, Gegenprobe für jedes neue
Kriterium ✅, Prüferfehler an der Ursache behoben statt Grenze gesenkt (O3) ✅, unter 700 Zeilen ✅, keine Kundennummern
vergeben ✅.
**Lehre aus O3:** Ein Anteil ist nur so gut wie sein Nenner. Was als „Bild“ zählt, hing an einer Zählweise des Browsers,
die sich mit einer anderen Änderung (Mitgleiten der Seite) still verschob.
