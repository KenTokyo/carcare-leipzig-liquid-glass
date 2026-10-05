# Ausbildungskarte Bürokaufmann/-frau: echtes Foto (Backlog 6.16)

**Angelegt:** 2026-10-05
**Auftrag des Users:** Foto einer echten Auszubildenden zur Bürokauffrau (Chat-Anhang) sauber benennen, mit denselben
Metadaten wie die übrigen Fotos ins Projekt nehmen und auf der Ausbildungskarte einsetzen. „Nur austauschen, sonst
erstmal keine Checks.“

### ✅ Phase 1 — Foto aufbereiten und einsetzen
* [x] Original außerhalb des Repositorys abgelegt (wie die Stimmen-Fotos): `C:/Users/Moham/Downloads/carcare-buero-fotos-2026-10-05/buerokauffrau-ausbildung-carcare-leipzig.jpeg` (Ordner in Phase 2 umbenannt) (1448 × 1086, schon 4:3, ohne Aufnahmedatum im EXIF).
* [x] Eintrag in `scripts/build-fotos.mjs` (heute `ORDNER_BUERO_OKT26`), `npm run fotos -- --nur buerokauffrau` → `public/assets/kacheln/karriere-buerokauffrau-leipzig-carcare.webp`, 1448 × 1086, 46 KB, XMP mit Titel, Beschreibung, Urheber, Rechtevermerk, Ort, Stichwörtern und `digitalCapture`. Kein Zuschnitt, keine Vergrößerung.
* [x] Ausbildungskarte in `data/jobs.ts` zeigt die neue Datei. `kalkulation-leipzig-carcare.webp` bleibt: Sie steht auch im Unfallbereich (`components/AccidentDamageSection.tsx`).
* [x] Herkunft „echt“ in `data/bildherkunft.ts` (keine Plakette), Motiv und Herkunft in `docs/bilder/motive.json`, Vermerk B109 „angepasst“, Backlog 6.16 erledigt.
**Referenzen:**
`scripts/build-fotos.mjs`
`data/jobs.ts`
`docs/bilder/motive.json`

### ✅ Phase 2 — Karte „Serviceberater“ (B106), gleicher Ablauf
**Auftrag des Users (05.10.):** „Nun exakt das Gleiche für den Bereich Serviceberater mit dem Foto im Anhang.“
* [x] Original neben dem ersten abgelegt; der Ordner heißt jetzt allgemein `C:/Users/Moham/Downloads/carcare-buero-fotos-2026-10-05/` (Konstante `ORDNER_BUERO_OKT26`), Datei `serviceberatung-laptop-carcare-leipzig.jpeg` (1086 × 1448, Hochformat, ohne Aufnahmedatum).
* [x] `npm run fotos -- --nur karriere-serviceberater` (nicht `--nur serviceberater`: das träfe auch das Stimmen-Porträt) → `public/assets/kacheln/karriere-serviceberater-leipzig-carcare.webp`, 1086 × 815, 76 KB, gleiche XMP-Metadaten mit `digitalCapture`. 4:3-Ausschnitt mit `oben: 0.19`, im Prüfbogen angesehen: Haaransatz mit Luft, Bildschirm mit unserer Startseite, Hände und Tastatur im Bild.
* [x] Karte „Serviceberater“ in `data/jobs.ts` zeigt die neue Datei. `autohaus-fuhrpark-service-leipzig-carcare.webp` bleibt: Sie steht noch an B18, B73 und B137.
* [x] Herkunft „echt“ in `data/bildherkunft.ts`, Motiv in `docs/bilder/motive.json`, Vermerk B106 „angepasst“. Die Nummer B106 bleibt beim nächsten `npm run bilder`: Der Kartentitel ist unverändert, nur die Datei wechselt.
**Referenzen:**
`scripts/build-fotos.mjs`
`data/jobs.ts`
`docs/bilder/motive.json`

---

## Kommentare

### Phase 1
**Eingehalten:** Bildtausch nur an der gemeinten Stelle (Mehrfachnutzung geprüft) ✅, sprechender Dateiname nach dem Muster `karriere-…-leipzig-carcare.webp` ✅, Metadaten wie bei allen echten Fotos ✅, Herkunft nur mit Aussage des Users ✅, keine Prüfläufe (Wunsch des Users) ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (offen):** Bildnummer B109. Seit dem letzten `npm run bilder` (03.10.) haben an dieser Karte Titel (04.10., Bürokaufmann) UND Datei gewechselt. `bilder-inventar.mjs` behält eine Nummer nur, wenn eins von beiden gleich bleibt. Der nächste Lauf führt B109 deshalb als entfallen und gibt der Karte eine neue Nummer. Vermeiden ließe es sich nur mit einem Lauf gegen den Build vor dem Bildtausch; nicht gemacht, weil der User keine Prüfläufe wollte.
2. 🟢 **Niedrig (Annahme):** Die Einwilligung der Auszubildenden zur Veröffentlichung wird wie bei den Stimmen-Fotos vorausgesetzt; die Datenschutzerklärung nennt KI-Bearbeitung, dieses Foto ist unbearbeitet.
