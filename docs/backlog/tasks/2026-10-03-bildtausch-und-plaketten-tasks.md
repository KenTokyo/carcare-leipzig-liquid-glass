# Bildtausch, Lackiervideo überall, Leasingrückgabe mit Care und Repair

**Auftrag (User, 2026-10-03):** Leasingrückgabe bekommt beide Plaketten (Care und Repair), überall wo sie steht · das
Lackiervideo überall bei der Neu- und Reparaturlackierung · das Standfoto der Lackierung überall bei Smart Repair, das
bisherige Smart-Repair-Bild ins Archiv · angehängtes Foto global für Hagelschaden, das alte Hagelbild ganz raus ·
angehängtes Foto „Dellenentfernung-leipzig-carcare-center“ überall für Dellenentfernung · nur auf der Startseite unter
„Autohäuser & Fuhrparks“ das Anhängerfoto, Unterseiten unverändert · alle Bilder echt, keine KI-Plakette.
**Ausdrücklich:** keine lange Prüfung jetzt; der User prüft am Ende selbst sauber.
**Backlog:** 5.6, 5.7, 5.10, 5.14, 5.15 (`docs/backlog/schleife-5.md`) · **Branch:** `2026-10-02-stimmen-zusatzregeln`

### ✅ Phase 1 — Fotos aus den Originalen
* [x] Originale im Lieferordner statt der Chat-Anhänge: „Hagelschaden-carcare-center-leipzig.jpeg“ (5712 × 4284,
      19.08.2026), „Dellenentfernung-leipzig-carcare-center.jpeg“ (1600 × 1200), „Autohaueser und Geschaeftskunden
      Haenger.jpeg“ (gesichtete Fotos Aug 26_0, 27.07.2026); Zuordnung über Größe und Kontaktbogen
* [x] `scripts/build-fotos.mjs`: Eintrag je Ziel, neu `ordner` je Eintrag (zweiter Lieferordner); Smart Repair aus dem
      Lackierfoto mit eigenem Namen und eigenem Hintergrundausschnitt (Pistole sonst unter dem Textschutz); Hagel 4:3 ab
      10 % der Höhe; Dellen ohne Ausschnitt, **Kundenkennzeichen „DZ JL 7…“ weichgezeichnet**; Anhänger ohne Eingriff
      (Macan ohne vorderes Kennzeichen, Fahrer von hinten, „L CC 300“ ist unser Transporter)
* [x] Abgelöste Dateien nach `docs/bilder/archiv/` (README dort): Smart Repair alt, Hagel alt (aus `public/` entfernt),
      Dellen alt
* [x] Herkunft „echt“ für alle neuen Dateien (`data/bildherkunft.ts`), Motive und Stellenstatus in `docs/bilder/motive.json`
**Referenzen:**
`scripts/build-fotos.mjs`
`docs/bilder/archiv/README.md`

### ✅ Phase 2 — Katalog, Karten, Plaketten
* [x] `data/services.ts`: Smart Repair (Bild, Alt-Text, Maße, `pageImage`), Dellen (Alt-Text, 1600 × 1200), Hagel (neue
      Datei, Alt-Text), Lackierung `video: 'startseite-lackierung'`, Leasingrückgabe `bereiche: ['care', 'repair']`;
      neu `BereichsAngabe`, `bereichDesEintrags`; `bereichDerGruppe` entfällt (nur ServiceGrid nutzte es)
* [x] `BereichsPlakette`: eine oder mehrere Plaketten nebeneinander (Care vor Repair), `plaketteClassName` für die Größe
      je Plakette (Seitenkopf `py-1.5`)
* [x] `LeistungsKarten`: Video statt Foto, wo der Katalog eines nennt; lädt erst im Bild (`preload="none"`), läuft stumm
      in Schleife, **Pause-Knopf** unten links (WCAG 2.2.2: Bewegung über 5 s braucht ein Bedienelement)
* [x] `ServiceGrid`: Video und Plaketten aus dem Katalog statt eigener Liste; `TargetGroupCards`: Anhängerfoto nur für
      „Autohäuser & Fuhrparks“ auf der Startseite
**Lösungswege Smart-Repair-Bild:** (a) im Katalog auf `autolackierung-…` zeigen — Dateiname passte nicht zur Leistung ·
(b) ✔ aus demselben Original als `smart-repair-…` erzeugen (Name, Metadaten, eigener Hintergrundausschnitt)
**Referenzen:**
`data/services.ts`
`components/LeistungsKarten.tsx`
`components/BereichsPlakette.tsx`

### ✅ Phase 3 — Kurzprüfung (bewusst kein Messlauf, Wunsch des Users)
* [x] `tsc` grün; Build 03.10., 00:37:29 grün (Prerender 29/29, FAQ, Dummies, Gedankenstriche 0)
* [x] Kurzprüfung im Browser (`dist/`): `/leistungen` Video an der Lackierkarte läuft und hält per Knopf an, Smart Repair,
      Dellen und Hagel mit neuen Bildern ohne KI-Plakette, Leasing mit Care + Repair; `/leasingrueckgabe-leipzig` Seitenkopf
      Care + Repair (Desktop, mobil), Lackkarte mit Video, Spot-Repair-Karte mit neuem Bild; Startseite: Anhängerfoto
      nur an der Autohaus-Karte, Leasing-Kachel mit beiden Plaketten; Seitenhintergründe Smart Repair, Hagel, Dellen
* [x] `npm run bilder` nachgezogen (Phase 4, gegen den Build 03.10., 01:29:09): Nummern gehalten, siehe dort
* [ ] **Steht aus, beim abschließenden Prüflauf des Users:** `npm run kontrast`, `npm run aussparung`, `npm run zielgruppen`,
      `npm run meta`, `npm run shots`

### ✅ Phase 4 — Herkunft aller Fotos (R15, 5.9)
**Ziel:** Die Angabe des Users zum Herkunftsbogen eintragen. Der User hat seine Angabe am 03.10. „final“ genannt.
„Echt: Bild 1,2,3,4,7,16 · Der Rest braucht den Batch KI-aufgewertet.“ Die Nummern stammen aus
dem Bogen „Herkunft offen“ (Nr. 1–16, frisch aus `npm run bilder` gegen den Build 03.10., 00:37:29). Nr. 17–50
standen schon als echt im Code und waren im Bogen nur zur Kontrolle; ohne Einwand bleiben sie so.
* [x] `data/bildherkunft.ts`: 6 × `echt` (Startbild desktop/mobil, Footer, Fahrzeugaufbereitung, Leasingrückgabe,
      Lackierkabine), 10 × `aufgewertet` (Felge, Autoglas, Fuhrparkservice, Schaden melden, Schadenaufnahme,
      Kalkulation, Versicherungsabwicklung, Privatkunden, Versicherungen und Agenturen, Fahrzeugabgabe); je Zeile die
      Nr. aus dem Bogen, Wortlaut des Users und die Abweichung zum Meeting im Kommentar darüber. Kopf und `STANDARD`
      erklären, dass die Vorgabe „KI-generiert“ nur noch neue Bilder ohne Eintrag trifft
* [x] `docs/bilder/motive.json`: Herkunft je Datei mit Beleg (User, 03.10., Nr. im Bogen), bisherige Angabe als „Vorher“
      erhalten, Abgleich mit dem Meeting je Datei
* [x] Code-Kommentare nachgezogen: `components/AccidentDamageSection.tsx` (Schritt 02, B20) sagte noch „gilt bis zur
      Klärung als KI-generiert“
* [x] Backlog: 5.9 ✅ (`schleife-5.md`, Tabelle „Herkunft laut Meeting“ mit Stand 03.10.), R15 ✅
      (`offene-punkte-konsolidiert.md`, „Wartet auf André“ 6 → 5, „Summe echt offen“ 18 → 17); `README.md`: Schleife 5
      18 → 17, Repo-Befunde 17 → 16, zusammen **51 → 49** (nachgezählt mit den Regeln von `npm run push-stand`)
* [x] `tsc` grün; **Build 03.10., 01:29:09** grün (Prerender 29/29, FAQ 29/29, Dummies, Gedankenstriche 0)
* [x] Kurzprüfung im ausgelieferten HTML: **0 × „KI-generiert“**, 26 × „KI-bearbeitet“ (davon 2 × „Foto: KI-bearbeitet“
      an den Zielgruppenkacheln) auf 11 von 29 Seiten; Startseite ohne Plakette am Startbild, die Karriereseite trägt nur
      noch die zwei Plaketten von Serviceberater (Fuhrparkfoto) und Kalkulation, die Lackierkabine keine mehr
      (gegengeprüft im Dev-Server auf Port 3007: Startseite 8 × „KI-bearbeitet“, keine am Startbild)
* [x] `npm run bilder` gegen den Build 01:29:09: 135 Bildstellen (Nummern bis B152, keine neue), 50 Dateien,
      16 Platzhalter; **Tag je Datei: echt 39 · echt (Stockfoto) 1 · KI-bearbeitet 10 · ungeklärt 0**
* [x] Danach nur ein Kommentar in `data/bildherkunft.ts` geglättet (doppeltes „genannt“). Die Messwerkzeuge melden
      `dist/` deshalb als älter; der abschließende Prüflauf beginnt ohnehin mit `npm run build`
**Referenzen:**
`data/bildherkunft.ts`
`docs/bilder/motive.json`
`docs/backlog/schleife-5.md` (5.9, Tabelle „Herkunft laut Meeting“)

---

## Kommentare
### Phasen 1–3
**Eingehalten**: Originale statt Chat-Anhängen ✅, fremdes Kennzeichen unkenntlich ✅, eine Quelle je Motiv (Katalog) ✅,
nur die Startseitenkarte getauscht, Unterseiten unverändert ✅, abgelöste Bilder archiviert statt gelöscht ✅, unter 700
Zeilen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — das Lackierfoto als Seitenhintergrund**: Pistole im linken Drittel läge unter dem Textschutz → eigener
   Ausschnitt `smart-repair-hintergrund-…` (dieselben Werte wie bei der Lackierseite).
2. 🟡 **Mittel — Video in statischen Karten ohne Anhalten** wäre ein WCAG-2.2.2-Verstoß → Pause-Knopf.
3. 🟢 **Niedrig — Leasingseite trägt weiter „KI-generiert“**: Das Hintergrundbild der Leasingrückgabe (grauer Audi) war
   nicht Teil dieses Bildtauschs; Herkunft weiter ungeklärt (R15). ✅ **Fixed in Phase 4**: laut User echt, keine Plakette.

### Phase 4
**Eingehalten**: Herkunft nur mit Angabe des Users, nichts nach Augenschein ✅, je Datei eine Zeile in einer Quelle ✅,
   Beleg und Abweichung dokumentiert statt still überschrieben ✅, kein Messlauf (Wunsch des Users) ✅, unter 700 Zeilen ✅
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Angabe weicht vom Meeting am 25.09. ab**: Die Felge hieß dort „echt“ (Andrés Cupra-Felge). Schaden
   melden, Privatkunden und Fahrzeugabgabe hießen „KI-generiert (bestätigt)“, Autoglas am 28.09. „KI-generiert“.
   Eingetragen ist die spätere Angabe des Users, der die Bilder selbst aufbereitet hat. Die Abweichung steht im Code, in
   `motive.json` und unter 5.9, und der User ist im Chat darauf hingewiesen. Ändert sich eine Angabe, ist das je eine Zeile.
2. 🟢 **Niedrig — Wortlaut der Plakette**: Der User nennt die Kategorie „KI-aufgewertet“, die Plakette heißt seit 21.09.
   „KI-bearbeitet“ (`HERKUNFT_TEXT`). Beibehalten, weil „aufgewertet“ nach bloßer Bildverbesserung klingt; bei mehreren
   Motiven sind Personen hinzugefügt (Meeting 18:03, 18:25), und Art. 50 Abs. 4 KI-VO verlangt den Hinweis „künstlich
   erzeugt oder manipuliert“. Auf Wunsch eine Zeile; im Chat angeboten.
3. 🟢 **Niedrig — maschinenlesbare Herkunft fehlt in den 16 älteren Dateien** (IPTC `DigitalSourceType`, offen seit
   `docs/bilder/tasks/2026-09-21-ki-kennzeichnung-tasks.md`). Bewusst nicht nachgetragen: Für die zehn bearbeiteten
   Motive ist nicht belegt, WAS verändert wurde (Personen ergänzt → `compositeWithTrainedAlgorithmicMedia`, nur
   verbessert → anderer Wert). Einen Wert zu raten wäre derselbe Fehler wie eine Plakette nach Augenschein. Pflicht ist
   für uns als Betreiber die sichtbare Kennzeichnung, und die steht.
