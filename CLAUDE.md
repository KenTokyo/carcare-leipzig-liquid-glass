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

## Kunde

CarCare Center, Leipzig. Kfz-Meisterbetrieb mit Lackierhandwerk.
Zwei Hauptgeschäftsbereiche: **Fahrzeugaufbereitung** und **Unfallinstandsetzung**.
Ansprechpartner beim Kunden: André Bosse.

## Verbindliche Textregeln

Gelten für alle Seiten, auch für neu erstellte. Ergänzend zu @SEO-GEO-STANDARDS.md.

1. **Namensschreibweise:** „CarCare Center", ohne Bindestrich.
   „CarCare" darf nicht allein stehen – entweder „CarCare Center" oder „wir".
   Falsch und zu ersetzen: „Kcare", „KCare", „K-Care", „Kare", „KKR".
2. **Ansprache:** Alle Texte stehen in der ersten Person Plural. Sätze in der
   dritten Person werden **umformuliert, nicht wortweise ersetzt** – das
   betrifft Verbform, Possessivpronomen und ggf. den Satzbau.
   Falsch: „CarCare Center kümmert sich um Ihr Fahrzeug."
   Falsch: „Wir kümmert sich um Ihr Fahrzeug." (reine Ersetzung)
   Richtig: „Wir kümmern uns um Ihr Fahrzeug."
   Ebenso: „In seinem Betrieb …" → „In unserem Betrieb …",
   „Das Unternehmen bietet …" → „Wir bieten …".
   Die Kundenansprache bleibt beim „Sie".
   Ausnahme 1 – Firmenname: Wo er aus SEO-Gründen bewusst stehen soll
   (Hero, strukturierte Daten), bleibt er erhalten. Faustregel für den
   Fließtext: **Der Name darf stehen, aber nie als Subjekt eines Verbs in
   der dritten Person.** „Warum CarCare Center Leipzig" ist richtig,
   „CarCare Center kümmert sich" ist falsch.
   Ausnahme 2 – strukturierte Daten: In JSON-LD-Beschreibungen
   (`description` in `seo/structuredData.ts` und `seo/pageSchemas.ts`, z. B.
   `AutoRepair` und `aboutPageSchema`) bleibt auch die **dritte Person**
   erhalten. Das sind Maschinen-Metadaten über die Entität, nicht die
   Selbstbeschreibung im Fließtext; dort ist die dritte Person die
   konventionelle Form. Sichtbarer Seitentext fällt nicht darunter.
   Entschieden am 2026-09-02, nicht neu aufmachen.
3. **Gründungsjahr:** „seit 1998". Nicht 1993, nicht 1996.
4. **Betriebsfläche:** „über 3.500 m²" bzw. „über 3.500 Quadratmeter".
   **Geändert am 2026-09-14** von 3.000 auf 3.500. André nennt die Zahl in Schleife 4
   zweimal unabhängig (4.2 für die Aufbereitungsseite, 4.18 für den Zeitstrahl); der
   User hat sie bestätigt. Gemessen nach der Umstellung: **33 Fundstellen in 20 Dateien**
   unter `components/`, `pages/`, `data/`, `seo/` — sichtbarer Text, FAQ und strukturierte
   Daten — dazu die USP-Bausteine in `SEO-GEO-STANDARDS.md`. Alle zugleich umgestellt.
   Die frühere Angabe 3.000 gilt nicht mehr und ist auch nicht als Alternative zulässig.
   ⚠️ **Falle beim Nachziehen:** Nicht global auf „3.000" ersetzen.
   `pages/DatenschutzPage.tsx` nennt „23.000 Zeichen" — eine Textlänge, keine Fläche.
   Nur die Muster „3.000 m²" und „3.000 Quadratmeter" treffen.
5. **Meisterbetrieb:** Der Begriff bleibt auch im Aufbereitungsbereich erhalten
   (SEO-relevant), obwohl Aufbereitung kein Meisterhandwerk ist.

## Inhaltliche SEO-Vorgaben des Kunden

Vom Kunden abgenommen, nicht wegoptimieren:

- FAQ-Block pro Subseite bleibt: dient als maschinenlesbare Zusammenfassung
  für KI-Suchmaschinen, die Karteninhalte nicht auslesen können.
- Ablauf-/Prozess-Sektionen bleiben: werden von KI-Suchmaschinen bevorzugt.
- Expertise-/Über-uns-Block am Ende jeder Subseite bleibt: hebt das Ranking
  der Subseite, nicht der Hauptseite.
- Technische Fachbegriffe sind Auffindbarkeitspotenzial und werden
  perspektivisch mit Wissensbeiträgen unterfüttert.

## Umsetzungsprinzipien

- CSS-native Lösungen vor JavaScript, wo Performance relevant ist
  (z. B. `position: sticky` mit gestaffelten Offsets statt Scroll-Listener).
- Sticky- und Scroll-Verhalten früh auf Tablet und Smartphone prüfen,
  nicht erst am Ende.
- **Vor jedem neuen Build-Wächter oder Prüfskript die Frage beantworten:**
  *Was besteht diese Prüfung, ohne dass die Sache tatsächlich in Ordnung ist?*
  Fünf Wächter haben 2026-09-03 grün gemeldet, während sie hätten greifen müssen.
  Begründung, Fälle und Anwendung:
  `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`

## Globale Suche

Suchdialog in der Navbar (rechts neben „Kontakt", Strg/⌘ + K, „/"). Der **Index entsteht beim Build
im Prerender** aus dem gerenderten Inhalt jeder Route (`scripts/lib/suchindex.mjs` →
`dist/suchindex.json`): neue Seiten und Texte sind also automatisch auffindbar. Der Build bricht, wenn
eine Route fehlt oder unter 200 Zeichen Text liefert.
- Text von der Suche ausnehmen: `data-suche="aus"` am Element (Platzhalter, `aria-hidden`,
  CTA-Knöpfe `.cc-gradient-button` und KI-Plaketten `.cc-ki-marke` sind es schon).
- Kundenworte, die auf der Seite anders heißen („Leihwagen" → „Ersatzwagen"): `SYNONYME` in
  `lib/suche.ts` — nur für Dinge, die wir wirklich anbieten.

## Messwerkzeuge

Vor jeder Aussage über Kontrast, Meta-Längen oder Layout: **messen, nicht schätzen.**

| Befehl | Was er misst | Wann |
|---|---|---|
| `npm run kontrast` | WCAG-AA-Kontrast im ausgelieferten HTML, je Route/Breite/Textstelle | nach jeder Farb-, Verlaufs- oder Transparenzänderung |
| `npm run meta` | Title- und Description-Länge gegen 50–60 / 140–160 Zeichen | nach jeder Meta-Änderung |
| `npm run shots` | Bildschirmfotos je Sektionsgrenze, Desktop + mobil | vor jedem Review mit dem Kunden |
| `npm run zielgruppen` | Zielgruppenkarten der Startseite über 15 reale Fenstergrößen: Partner sichtbar (Treffertest), Mausrad erreicht Liste und Kartentext (echtes Rad), Scrollweg bis zur Überdeckung | nach jeder Änderung an `TargetGroupCards`, `ZielgruppenPartner`, `styles/zielgruppen.css` oder Lenis |
| `npm run aussparung` | Aktions-Aussparung oben rechts („Anrufen"/„Schaden melden", ab 1024 px): liegt irgendwo Text oder ein Bedienelement **dauerhaft** darunter (z. B. etwas, das höher als die Navbar gepinnt ist)? 29 Routen × 3 Fenster; dazu je Route, an wie viel Prozent der Positionen die Aussparung sichtbar ist (muss 100 % sein) | nach jeder Änderung an gepinnten Flächen (`position: sticky`), an `AktionsAussparung` oder an der Navbar-Höhe |
| `npm run nummern` | Backlog-Nummern gegen die Kundenräume | läuft im `prebuild` mit |
| `npm run bilder` | Jede Bildstelle der ausgelieferten Seite mit **fester Nummer B<n>**, Ort (Seite › Sektion › Karte), Datei, Git-Datum; je Datei alle Stellen; Platzhalter; Gegenprobe gegen Ordner und Code. Schreibt `docs/bilder/README.md` + Kontaktbogen `output/bilder/bilder-uebersicht.html` | nach jedem Bildtausch und bevor der User Bildwünsche des Kunden durchgibt |

Alle brauchen ein aktuelles `dist/` (`npm run build`). Sie starten `vite preview`
selbst — **niemals** `npm run dev` dafür starten.

**„Full HD" heißt nicht 1080 px Seitenhöhe.** Ein maximierter Browser auf 1920 × 1080 gibt der
Seite etwa 913–945 px, mit 110 % Zoom 830 px. An genau dieser Lücke waren die Partnerlisten
2026-09-17 unsichtbar (Ausblendung unter 860 px). Höhenabhängige Layouts an den Fenstern aus
`scripts/check-zielgruppen.mjs` messen, nicht an der Bildschirmauflösung.

**Der Kontrastmesser hat 2026-09-03 gefunden, was drei Sichtprüfungen nicht fanden.**
Die sechs Fallen seines Aufbaus stehen im Kopf von `scripts/check-kontrast.mjs`;
wer daran etwas ändert, liest sie zuerst.

## Push-Stand (vor JEDEM Push)

Kollegen an anderen Standorten gleichen ihre Pulls mit `docs/push-stand/README.md` ab:
Branches lokal ↔ GitHub, Commits des Pushs, was nach dem Pull zu tun ist (`npm install`?),
was nur lokal liegt, was inhaltlich offen ist. Früheres steht in `docs/push-stand/verlauf.md`.
**Wunsch des Users vom 2026-09-18: bei jedem Push, nicht nur einmal.**

1. Commits fertig, Branches gemergt
2. `npm run push-stand` — erzeugt beide Dateien aus git und dem Backlog, nichts von Hand
3. `git add docs/push-stand && git commit -m "Docs: Push-Stand <Datum>"`
4. pushen

Ein Hook in `.claude/settings.json` sperrt `git push`, solange die **committete** Übersicht einen
Commit nicht nennt, der mit dem Push auf GitHub käme. Pushes aus Terminal oder IDE prüft er nicht —
dort gilt dieselbe Reihenfolge von Hand. Prüfen ohne Push: `npm run push-stand -- --pruefen`.
Was die Sperre nicht abdeckt, steht im Kopf von `scripts/push-stand.mjs`.

## Backlog

**Einstiegspunkt für alle Kundenaufgaben:** `docs/backlog/README.md`

Dort liegen alle vier Review-Schleifen mit 124 Aufgaben, die Auswertung „was ist
wirklich offen", und die vom Kunden gelieferten Quelllisten.

| Datei | Nummernraum |
|---|---|
| `docs/backlog/schleife-1.md` | 1.1 – 1.26 (abgeschlossen) |
| `docs/backlog/schleife-2.md` | 2.1 – 2.27 |
| `docs/backlog/schleife-3.md` | 3.1 – 3.37 |
| `docs/backlog/schleife-4.md` | 4.1 – 4.21 (Originalnummern aus Andrés Liste) |
| `docs/backlog/nicht-relevant.md` | ohne Nummer |
| `docs/backlog/offene-punkte-konsolidiert.md` | Auswertung, gegen den Code geprüft |

Aufgaben werden über ihre Nummer referenziert (z. B. „setze 1.7 und 1.8 um").
Ein Arbeitspaket = ein Branch = eine Session.
Stopp-Punkte innerhalb eines Pakets gemäß @phasenweise-oder-stopps-implementieren.md.

**⚠️ Nummern nicht selbst vergeben.** Die Räume gehören dem Kunden. Eigene Befunde
bekommen das Kürzel `R<n>` („Repo-Befund"), niemals eine freie `x.y`-Nummer. Grund:
R4–R12 wurden einmal repo-lokal vergeben und kollidieren seitdem mit fünf echten
Kundenpunkten — darunter beide Livegang-Blocker. Auflösung:
`docs/backlog/tasks/2026-09-06-nummernkonflikt-optimierung-tasks.md`

**Bildnummern `B<n>`** (seit 2026-09-18) sind ebenfalls Absprachen: Der User nennt damit
die Bildwünsche des Kunden („B14 und B27 tauschen“). Vergeben und gehalten werden sie
ausschließlich von `npm run bilder` über `docs/bilder/nummern.json` — nie von Hand
umnummerieren, entfallene Nummern nie neu vergeben. Wird ein Bild getauscht, bleibt die
Nummer; eine Datei kann an vielen Stellen stehen (siehe „Nach Datei“ in
`docs/bilder/README.md`), also vor jedem Tausch prüfen, ob nur **eine** Stelle gemeint ist.
