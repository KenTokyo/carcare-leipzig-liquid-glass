# „Aufbereitung anfragen“ oben rechts und Aufbereitungsformular neu

**Auftrag (User, 2026-09-28):**
1. In der Aktions-Aussparung oben rechts (Desktop) die Anruf-Pille durch **„Aufbereitung anfragen“** ersetzen. Der Anruf
   steht weiter in den Seiten; für André ist wichtiger, dass man auf jeder Seite einen Termin anfragen kann.
2. Aufbereitungsformular: **„Verkaufsaufbereitung“ raus** (= Backlog 5.19); **Pflicht:** gewünschte Leistung, Name und
   **Telefon oder E-Mail** — der Wunschtermin nicht.
3. **Marke und Modell** als zwei getrennte Auswahllisten (gängigste Marken in Europa, Modelle je Marke) statt Freitext.

**Branch:** `2026-09-27-schleife-5-paket-1` (Pakete 1 und 2 sind noch nicht committet)

---

### ✅ Phase 1 — Platz für die längere Beschriftung messen, bevor etwas geändert wird
**Ziel:** Die Lücke zwischen Navbar-Reiter und Aussparung bleibt an allen 23 Prüfbreiten ≥ 20 px, die Links ≥ 12 px im Reiter.
* [x] Simulation am Build (Text im DOM getauscht): Pillen 158–178 → **198 px**, Lücke an **14 von 23 Breiten unter 20 px**,
      bei 1280–1400 negativ (bis −20 px = Überdeckung). Einfach austauschen ging nicht
* [x] Spielraum der Links gemessen: links nur **17 px** bis zum Reiterrand bei 1280 (Regel ≥ 12) — der Reiter allein kann
      die 40 px nicht abgeben; außerdem ist er zentriert (1 px schmaler = 0,5 px mehr Lücke)
* [x] Vier Varianten per eingespieltem CSS an 23 Breiten durchgemessen; gewählt Variante 4:
      schlankere Pillen (Plakette 24 px, Schrift 12,5 px, Innenrand 12 px) · Reiter 1024–1279 `100vw − 600px` (min 424),
      1280–1535 `100vw − 566px` (714–830) mit Einzug 96 statt 106, ab 1536 `100vw − 608px` (min 928) · von 1280 bis 1439
      kompakte Pillen (Plakette 20, Schrift 12, knappere Aussparungsränder)
* [x] Ergebnis: **Lücke 22,1–498 px, Linkrand ≥ 14 px** — überall mit rund 2 px Reserve gegen andere Schriftwiedergabe
**Lösungswege:** (a) Beschriftung kürzen — vom User ausdrücklich so benannt · (b) zweizeilige Pille — unruhig neben der
einzeiligen „Schaden melden“ · (c) nur den Reiter verschmälern — Links passen bei 1280 nicht mehr · (d) ✔ Platz aufteilen:
Pillen schlanker, Reiter etwas schmaler, im engsten Bereich kompakt
**Referenzen:**
`styles/aussparung.css`

### ✅ Phase 2 — Pille umbauen
* [x] `AktionsAussparung.tsx`: Knopf „Aufbereitung anfragen“ mit Kalender-Plakette (wie „Termin“ in der mobilen Leiste),
      Hinweis beim Zeigen „Formular für Ihren Wunschtermin“, Ansage enthält den sichtbaren Text (WCAG 2.5.3)
* [x] Knopf statt Link auf `#contact-termin`: Der Dialog leitet solche Links auf Reparaturseiten zur Schadenmeldung um
      (R8) — `oeffnen('termin')` meint überall die Aufbereitung (geprüft auf `/unfallinstandsetzung-leipzig`)
* [x] Mobil unverändert: keine Aussparung, „Anrufen“ in der Leiste; der Live-Punkt geöffnet/geschlossen lebt dort weiter
* [x] Stylesheet: Telefon-Regeln (Klingeln, Status-Hinweis) auf „Aufbereitung“ umgestellt, Kalender-Hopser statt Klingeln
**Referenzen:**
`components/AktionsAussparung.tsx`
`styles/aussparung.css`

### ✅ Phase 3 — Formular: Verkaufsaufbereitung, Pflichtfelder, Marke und Modell
* [x] Verkaufsaufbereitung aus der Auswahl (5.19); Kontaktseite „… oder die Vorbereitung auf die Leasingrückgabe“;
      Wissenskategorie „Aufbereitung vor dem Verkauf“ statt des Leistungsnamens — das Thema bleibt, die nicht
      angebotene Leistung verschwindet (5.19: „bewusst entscheiden, nicht einfach mitstreichen“)
* [x] Pflicht: Name, Leistung; **Telefon oder E-Mail** über `required` am jeweils leeren Gegenstück (ohne Skriptlogik,
      Browsermeldung, Vorlesegeräte hören „Pflichtfeld“, solange es eins ist); Wunschtermin „(freiwillig)“; Hinweiszeile
      „Pflichtangaben: …“ (WCAG 3.3.2)
* [x] Server (`api/anfrage.ts` + `data/anfrageSchema.ts`): `PFLICHT_EINS_VON`, E-Mail nur prüfen, wenn vorhanden,
      Antwortadresse nur mit E-Mail, unbekannte Leistung (auch die gestrichene) → 400; Mail: „Zurückrufen“-Knopf, wenn
      keine E-Mail da ist, statt eines leeren `mailto:`
* [x] Marke/Modell: `data/fahrzeugmarken.ts` (41 Marken, Modelle je Marke, natürlich sortiert); Modell gesperrt bis zur
      Marke; „Andere Marke“ → Freitext „Marke und Modell“, „Anderes Modell“ → Freitext; Markenwechsel setzt Modell zurück
**Referenzen:**
`components/formulare/TerminFelder.tsx`
`api/anfrage.ts`
`data/fahrzeugmarken.ts`

### ✅ Phase 4 — Prüfen
* [x] `tsc`, Build mit allen Wächtern grün (29/29)
* [x] `npm run aussparung`: ✓ keine dauerhafte Überdeckung (29 Routen × 3 Fenster), Geometrie an 23 Breiten — Lücken
      genau wie simuliert, kleinste 22,1 px
* [x] Funktionstest im Browser **18/18**: Pillen an 1280/1366/1440/1920, kein `tel:` oben rechts, Klick öffnet den Dialog
      mit „Aufbereitungstermin“ (auch auf einer Reparaturseite), mobil Leiste unverändert, Pflichtlogik (nur E-Mail gültig,
      nur Telefon gültig, beides leer ungültig), keine Verkaufsaufbereitung, Marke/Modell samt Freitext und Zurücksetzen
* [x] Versandtest mit abgefangener Mail **10/10** (u. a. Bewerbung braucht weiter E-Mail)
* [x] `npm run kontrast`: **0 unter AA** (5.446 Textstellen; 3 Positionen nach 1 s nachgemessen — die Einblendungen, Falle 9) · `npm run meta`: 0/29 außerhalb
* [x] `npm run aussparung -- --gegenprobe`: **alle 4 eingespielten Fehler erkannt** (z-Index, Reiter zu breit, Beschriftung abgeschnitten, Links am Rand) — die Prüfung ist mit der neuen Pille nicht blind geworden
* [x] Backlog 5.19 ✅, offen gezählt 53 → **52**; CLAUDE.md-Messtabelle auf „Aufbereitung anfragen“ fortgeschrieben

---

## Kommentare

### Phasen 1–4
**Eingehalten**: erst gemessen, dann geändert (Simulation + 4 Varianten an 23 Breiten) ✅, Beschriftung bleibt sichtbar
und wie vom User benannt ✅, Regeln des Wächters nicht aufgeweicht (Lücke ≥ 20, Linkrand ≥ 12) ✅, Mobile-First (mobile
Leiste unverändert, Formular einspaltig) ✅, Server prüft dieselbe Pflichtregel wie das Formular ✅, keine Sackgasse bei
Marke/Modell ✅, Dateien unter 700 Zeilen ✅, kein `npm run dev` ✅, UTF-8 ✅

**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch — „Direkt antworten“ in der Anfrage-Mail hätte ohne E-Mail `mailto:undefined` geöffnet.** Mit der neuen
   Regel „Telefon oder E-Mail“ wäre das der Normalfall bei Telefonkunden geworden. ✅ **fixed** (Rückruf-Knopf).
2. 🟡 **Mittel — Reparaturseiten hätten „Aufbereitung anfragen“ zur Schadenmeldung umgeleitet** (R8 greift auf jeden
   Link mit `#contact-termin`). ✅ **fixed** (Knopf mit `oeffnen('termin')`).
3. 🟢 **Niedrig — Logo und Links stehen von 1280 bis 1535 rund 10 px enger** (Einzug 96 statt 106). Sichtprüfung ok;
   wer dort mehr Luft will, muss an die Linkbreiten (Laufweite, Abstände) — dokumentiert in `styles/aussparung.css`.
4. 🟢 **Niedrig — Wer nur eine Zusatzleistung will (z. B. Ozon), muss jetzt eine Leistung wählen** — „Sonstiges“ passt.
   Falls André eine eigene Option „Nur Zusatzleistung“ möchte: eine Zeile in `data/leistungsauswahl.ts`.
