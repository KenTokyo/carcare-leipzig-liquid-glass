# Bild-Tags je Nummer (KI-Kennzeichnung) — Vorbereitung und Eintrag

**Auftrag (User, 2026-09-28):** „Gib mir nun die Bildliste aus, ich möchte dir dann immer per Nummer die Information
über das Tag geben.“ Dazu: Vorschlag „eine Seite je Stelle“ auf die Nice-to-have-Liste.
**Bezug:** Backlog **R15** (Herkunft jedes Fotos bestätigen, `offene-punkte-konsolidiert.md`) und **5.9** (Herkunft aus
dem Meeting eintragen, `schleife-5.md`, Tabelle „Herkunft laut Meeting“).
**Tag** = KI-Kennzeichnung am Bild: `echt` (keine Plakette) · `KI-bearbeitet` · `KI-generiert` (Art. 50 KI-VO).

---

### ✅ Phase 1 — Nice-to-have-Liste
**Ziel:** Geparkte eigene Vorschläge an einer Stelle, nicht gezählt.
* [x] `docs/backlog/nice-to-have.md` angelegt (gab es noch nicht); erster Eintrag **R19**: eine Seite je offener Stelle mit
      genau einem `JobPosting` (Google verlangt das Markup auf der Einzelseite, nicht auf der Sammelseite `/karriere`)
* [x] Nummer nach Repo-Regel `R<n>` (höchste bisher R18); `check-nummernraeume` grün; `push-stand` liest die Datei nicht
* [x] Verweise: Backlog-README, Backlog-Tabelle in `CLAUDE.md`; Session-Chip zum Sofort-Umsetzen zurückgezogen
**Referenzen:**
`docs/backlog/nice-to-have.md`
`docs/backlog/README.md`

### ✅ Phase 2 — Tag-Spalte im Bildinventar
**Ziel:** Die Nummernliste zeigt dauerhaft, welcher Tag gerade auf der Seite steht — nach jeder Änderung per `npm run bilder`.
* [x] Lösungswege: (a) Tag in `motive.json` von Hand pflegen — zweite Quelle, läuft auseinander · (b) Plakette im DOM
      auslesen — Zuordnung Plakette ↔ Bild nur heuristisch · (c) ✔ `data/bildherkunft.ts` direkt importieren (Node 24 liest
      TypeScript mit reinen Typangaben), dieselbe Quelle wie die Plakette
* [x] `istGeklaert()` in `data/bildherkunft.ts`: unterscheidet „Vorgabe, ungeklärt“ von bestätigt. Bestätigtes „generiert“
      wird künftig ebenfalls in `AUSNAHMEN` eingetragen (ändert an der Plakette nichts)
* [x] `scripts/bilder-inventar.mjs`: Spalte **Tag** in „Nach Seite“ und „Nach Datei“, Überblick mit Tag je Datei und allen
      ungeklärten Nummern, Hinweis „Tag gilt je Datei“; Kontaktbogen mit Tag-Plakette (ungeklärt orange, echt grün), suchbar
* [x] `tsc`, Build (29/29) und `npm run bilder` grün: 126 Stellen, Nummern unverändert; **Tag je Datei: 18 „Vorgabe,
      ungeklärt“ (63 Stellen) · 27 echt · 1 Stockfoto**; Kontaktbogen mit 126 Tag-Plaketten, Sichtprüfung am Bildschirmfoto
**Referenzen:**
`scripts/bilder-inventar.mjs`
`scripts/lib/bilder-kontaktbogen.mjs`
`data/bildherkunft.ts`

### ✅ Phase 3 — Liste für den User
* [x] Gruppiert nach dem, was zu tun ist: **A** offen (Tag nötig) · **B** im Meeting geklärt, auf der Seite noch nicht
      umgestellt · **C** bestätigt; dazu die Stellen ohne Tag (Videos, Standbilder, Stockfoto)
* [x] Je Datei alle Nummern — der User nennt irgendeine davon

### ⬜ Phase 4 — Tags des Users eintragen (wartet auf Zuruf)
* [ ] Je genannter Nummer: Datei ermitteln (alle Stellen derselben Datei bekommen den Tag), in `AUSNAHMEN` von
      `data/bildherkunft.ts` eintragen — mit Beleg im Kommentar („bestätigt vom User am …“)
* [ ] `docs/bilder/motive.json` → `herkunft` je Datei mit demselben Beleg
* [ ] Widerspruch zwischen zwei Nummern derselben Datei → zurückfragen, nicht raten
* [ ] 5.9 und R15 fortschreiben; KI-Plaketten-Befund O4 aus Paket 1 schließen
* [ ] Build, `npm run bilder` (Tag-Spalte zeigt den neuen Stand), Kontrast, Sichtprüfung an zwei, drei Stellen

---

## Kommentare

### Phasen 1–3
**Eingehalten**: keine neue Nummer im Kundenraum (R19) ✅, eine Quelle für den Tag (kein Nachbau der Regel) ✅, Inventar
unter 700 Zeilen (647) ✅, kein Tag nach Augenschein geändert ✅, UTF-8 ✅

**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel — Die Meeting-Tabelle zu 5.9 nennt veraltete Stellenlisten**: Seit `/leistungen` Bildkarten hat (5.44),
   steht jede Leistungsdatei an einer Stelle mehr (z. B. Fahrzeugaufbereitung auch B126). Harmlos, weil der Tag je Datei
   gilt; die Tag-Liste nennt die vollständigen Nummern.
2. 🟢 **Niedrig — Hinweis auf B30 in derselben Tabelle** war überholt („fällt evtl. weg“) → ✅ **fixed** („seit 27.09. entfallen“).
