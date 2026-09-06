# Paket G — Block A und B abarbeiten

**Angelegt:** 2026-09-06
**Auftrag (User):** Block A komplett **außer 3.22** (Wissensdatenbank neu gestalten —
großer Aufwand, erst nach dem offiziellen Deployment relevant). Block B komplett.
Block C wird später betrachtet. Beim Hero-Text (2.4) ausdrücklich **SEO- und
marketingoptimiert für Karosserie- und Lackierbetriebe** formulieren, nicht nur kürzen.
**Abschluss:** Rückmeldung, wie viele To-dos danach noch offen sind.

**Reihenfolge begründet:** Erst die Umbenennung (sie fasst alle Dokumente an, alles
Spätere soll schon die richtigen Nummern tragen), dann die Messwerkzeuge (sie sind
Voraussetzung für belastbare Aussagen bei den Meta-Texten), dann der Rest.

---

### ✅ Phase 1 — R-Umbenennung (Block B)
* [x] 12 repo-lokale Nummern auf `R1`–`R12` umstellen
* [x] Nur repo-lokale Nennungen anfassen — `schleife-1/2/3.md` führen **echte** Nummern
* [x] Querverweise ergänzen, wo ein R-Befund einen Kundenpunkt doppelt
* [x] Wächter gegen Rückfall in `scripts/`

### ✅ Phase 2 — Messwerkzeuge ins Repo (Block B)
* [x] `npm run kontrast` — misst WCAG-Kontrast im ausgelieferten HTML
* [x] `npm run shots` — Bildschirmfotos je Route und Breite

### ✅ Phase 3 — Meta-Descriptions und Titles (Block B)
* [x] Ist-Stand messen, dann korrigieren: Description 140–160, Title 50–60

### ✅ Phase 4 — 2.4 Hero-Text (Block A)
* [x] Kürzen **und** auf Karosserie/Lack ausrichten, SEO + Marketing

### ✅ Phase 5 — 2.24 Geschäftskunden-Empfänger (Block A)
* [x] Zweite Empfängeradresse vorbereiten

### ✅ Phase 6 — 3.19 Mitarbeiterstimmen (Block A)
* [x] Struktur anonymisiert bauen, Inhalte als Platzhalter

### ✅ Phase 7 — 3.12 BVAT (Block A)
* [x] Hinweis zur Mitgliedschaft, Logoplatz vorbereiten

### ✅ Phase 8 — 2.12 Prüfauftrag (Block A)
* [x] Messen und Empfehlung geben

### ✅ Phase 9 — 3.1 Scroll-/Sticky-Effekt (Block A)
* [x] Auf Tablet und Handy prüfen, Ablauf glätten

### ✅ Phase 10 — 3.9 USP-Karten differenzieren (Block B)
* [x] Rund 20 Kartentexte je Seite eigenständig formulieren

### ✅ Phase 11 — Verwaiste Komponenten (Block B)
* [x] 5 Komponenten ohne Importe. `Hero.tsx` bleibt (Vorgabe), `Jobs.tsx` bleibt (geparkt)

### ✅ Phase 12 — Bauen, prüfen, ausliefern
* [x] Build grün, Browserprüfung, Commit, Push
* [x] Offene To-dos zählen und zurückmelden

---

## Kommentare

### Phasen 1–12
**Eingehalten:** Kundennummern unangetastet ✅, Wächter vor dem Bau gegen die Pflichtfrage
geprüft ✅, Messwerkzeuge gegen bekannte Werte verifiziert ✅, kein Text ungeprüft
gelöscht ✅, `Hero.tsx` und `Jobs.tsx` unangetastet ✅, unter 700 Zeilen je Datei ✅,
Mobile-First ✅, kein Mojibake ✅, Dev-Server nicht gestartet ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🔴 **Kritisch, behoben: `schleife-1.md` trug drei repo-lokale Nummern.** Ich hatte die
   Datei als „Tabu" ausgenommen, um die Kundennummern 1.1–1.26 zu schützen — sie enthielt
   aber auch 1.27–1.29, die eigene Befunde waren. Aufgefallen ist es erst, weil der neue
   Wächter die Obergrenze aus der Datei ableitet und dadurch **1.29 statt 1.26** meldete.
   *Ein Wächter, der seine Grenzen aus den Daten zieht, findet Fehler in den Daten.*

2. 🟠 **Hoch: Der erste Wächter meldete zu 87 % Fehlalarm.** 15 Befunde, davon 13
   Fehltreffer: Kontrastwerte (`3.93`), `strokeWidth={1.75}`, Seitenverhältnisse
   (`2.33:1`), Skalierungen. Auf `docs/backlog/*.md` und Tabellenzellen eingegrenzt,
   danach 0 Fehlalarme — und der eingebaute Testverstoß wird weiterhin gefangen.
   Genau das Muster aus `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`.

3. 🟠 **Hoch: `package-lock.json` hätte die Umbenennung zerstört.** Dort stehen
   `sucrase-3.35.1` und `>=1.28.0` — mit einem globalen Suchen-und-Ersetzen wären daraus
   `sucrase-R7.1` und `>=R2.0` geworden. Vorher ausgeschlossen, weil ich die zweifelhaften
   Treffer einzeln im Kontext gelesen habe statt sie zu zählen.

4. 🟠 **Hoch: `About.tsx` enthielt eine falsche Betriebsangabe.** „50 Mitarbeitern an
   **10 Standorten**" — der Betrieb hat einen Standort. Die Komponente hatte 0 Importe,
   der Satz stand also nie auf der Seite. Beim Löschen geprüft: Es geht kein Text
   verloren, der irgendwo sonst fehlen würde. Hätte man sie „zur Sicherheit" behalten und
   später wieder eingebunden, wäre eine unwahre Angabe live gegangen.

5. 🟡 **Mittel: Meine 3.9-Schätzung war um Faktor 2 daneben.** Ich hatte „rund 20
   Kartentexte" angekündigt; gemessen waren es **4 wortgleiche Karten auf 11
   Seiten-Instanzen**. Die übrigen waren bereits differenziert. *Schätzen ersetzt kein
   Auszählen — auch nicht bei der eigenen Aufwandsangabe.*

6. 🟡 **Mittel: 3.1 hatte eine konkrete, benannte Ursache.** Track und Bühne rechneten in
   `vh`. Auf dem Telefon ändert die ein-/ausfahrende Browserleiste genau diesen Wert, die
   Trackhöhe springt also mitten im Scrollen. Dieselbe Lehre war für `BackdropLayout`
   bereits gezogen und dort auf `svh` umgestellt — hier war sie nie nachgezogen worden.

7. 🔵 **Niedrig: 3.12 bleibt halb offen.** Der Hinweis auf die BVAT-Mitgliedschaft steht;
   das **Logo** braucht eine Datei vom Kunden und dieselbe Freigabefrage wie die
   Partnerlogos (3.31). Die Langform des Verbandsnamens ist im Projekt nirgends belegt und
   wurde deshalb bewusst nicht ausgeschrieben.

8. 🔵 **Niedrig: Zwei Meta-Texte kamen doppelt vor.** 36 Ersetzungen bei 34 Texten — zwei
   Strings stehen an zwei Stellen (Seiten-Meta und `og:`-Angabe). Kein Fehler, aber der
   Grund, warum die Zahlen nicht aufgehen.

9. 🔴 **Kritisch, eigener Plan: Der neue Kontrastmesser hat 23 Stellen unter AA gefunden.**
   Erster Gesamtlauf: **4.538 Textstellen auf 29 Routen**, davon 23 unter WCAG AA.
   Sortiert nach gemessenem Hintergrund zeigt sich: **21 davon liegen über dem stehenden
   Foto** — der weiße Textschutz reicht an einzelnen Scrollpositionen nicht, vor allem
   mobil. **Das ist derselbe Fehler wie in Paket C**, der dort nur an den vier gemessenen
   Seiten behoben wurde, nicht an der Ursache. Zwei Treffer hatte ich selbst verursacht
   (`Stimmen.tsx`, `text-gray-500` bei 10 px) — **behoben und nachgemessen**.
   Die übrigen 21 brauchen eine gestalterische Abwägung (Foto gegen Lesbarkeit) und
   damit einen eigenen Durchgang:
   `docs/kontrast-backdrop/tasks/2026-09-06-kontrast-befunde-tasks.md`

   *Das ist genau der Zweck des Werkzeugs: Es hat beim ersten Lauf gefunden, was seit
   Paket C unbemerkt auf zwölf weiteren Seiten stand — und sofort auch meinen eigenen
   frischen Fehler.*

**Optimierungsplan:** `docs/kontrast-backdrop/tasks/2026-09-06-kontrast-befunde-tasks.md`
für Finding 9. Die übrigen: 1–6 behoben, 7 ist eine Zulieferung, 8 eine Erklärung.
