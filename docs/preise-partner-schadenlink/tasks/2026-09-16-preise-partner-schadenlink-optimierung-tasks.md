# Offene Folgepunkte aus den Kundenentscheidungen vom 2026-09-16

**Angelegt:** 2026-09-16
**Planung:** [`2026-09-16-preise-partner-schadenlink-tasks.md`](2026-09-16-preise-partner-schadenlink-tasks.md)
**Prüfung:** `../pruefung/pruefe_html.py` (37 Prüfungen gegen `dist/`, Ergebnis daneben) —
nach dem Merge einmal gegen den gemergten Build laufen lassen:
`python docs/preise-partner-schadenlink/pruefung/pruefe_html.py` (aus dem Projektverzeichnis,
nach `npm run build`).

> Alle Befunde, die ohne Kundenantwort lösbar waren, sind im Paket behoben und dort
> dokumentiert. Hier steht, was **bewusst** noch offen ist — mit dem Grund.

---

### ✅ 1 — Commit in zwei Schritten — erledigt 2026-09-17 (Befehl des Users: „alles mergen und committen")
**Ziel:** Paket 1 (2026-09-14, Karten/Ablauf/Fläche) und Paket 2 (2026-09-16, dazu der
Sichtprüfungs-Befund R14 vom 2026-09-17) lagen unkommittiert im selben Arbeitsbaum.
Paket 1 umfasst 44 Dateien, davon hat Paket 2 **20** weiter verändert; **5** sind neu.

**⚠️ Nicht über `git stash`** — nach dem Commit von Paket 1 lägen dessen 5 neue Dateien schon
im Baum, `git stash pop` bräche mit „already exists" ab. Gewählt: ein Weg, der den
Arbeitsbaum nie anfasst (der Dev-Server auf 3007 bedient ihn).

* [x] Upstream von `2026-09-14-karten-ablauf-flaeche` stand auf
      `origin/2026-09-10-schleife-4-sofortpaket` — ein `git push` hätte dorthin geschrieben.
      `git branch --unset-upstream`
* [x] Worktree **im Scratchpad** statt `../p1-commit` (kein Ordner neben dem Projekt), die 44
      gesicherten Dateien hinein: Änderungsliste identisch mit `dateiliste.txt` (39 geändert,
      5 neu), `--numstat` ohne Ganzdatei-Diffs durch Zeilenenden, `--check` sauber
* [x] **Paket 1 isoliert gebaut:** `node_modules` als Junction, `tsc --noEmit` sauber,
      `vite build` in ein Verzeichnis außerhalb. Das CSS enthält `.cc-karte` und den
      Textschutz, aber weder `.zielgruppen-stapel` noch `allowNestedScroll` — also wirklich
      der Paket-1-Stand. Junction danach als Verweis gelöscht (nicht rekursiv),
      `node_modules` des Projekts geprüft intakt
* [x] Commit **P1 = `ed3bd69`** auf `2026-09-14-karten-ablauf-flaeche`, Worktree entfernt
* [x] Im Hauptbaum `git reset --soft ed3bd69`, dann **`git add -A -- . ':!parallax-scroll-kit'`**
      statt `git add -A`: Das Kit bleibt bewusst unversioniert (Memory
      `parallax-scroll-kit-export`). Commit **P2** auf `2026-09-16-preise-partner-schadenlink`
* [x] Gegenprobe: `git diff 2026-09-14-karten-ablauf-flaeche --stat` = nur Paket-2-Dateien;
      Arbeitsbaum danach sauber bis auf das Kit
* [x] Nach `main` in der Reihenfolge `2026-09-10-schleife-4-sofortpaket` →
      `2026-09-14-karten-ablauf-flaeche` → `2026-09-16-preise-partner-schadenlink`, jeweils
      **Fast-Forward**: Die Historie ist linear, alle übrigen lokalen und entfernten Branches
      waren bereits in `33b6f5d` enthalten (`git branch --no-merged` leer). Gemergt in einem
      temporären Worktree, damit der Arbeitsbaum des Dev-Servers nicht hin- und herspringt
* [x] Kein `npm install` nötig: `node_modules` ist aktuell, Build und alle Messwerkzeuge liefen
      am 2026-09-17 auf genau diesem Stand (`docs/zielgruppen-partner-sichtbarkeit/`)
* [ ] **Push** — nicht Teil des Befehls („mergen und committen"); wartet auf den User

### ⬜ 2 — Eigenes Schadenformular entfernen — erst nach Kundenbestätigung
**Ziel:** Hinter `SCHADENMELDUNG_EXTERN = true` ist das eigene Formular unerreichbar, aber noch
vollständig im Code: `RequestForm` (Zweig `schaden`), `components/formulare/SchadenFelder.tsx`,
`data/schadenFelder.ts`, der `schaden`-Zweig in `api/anfrage.ts` und im Mail-Template, dazu
`TERMIN_UEBERSCHREIBUNG` mit den Schadenarten.

**Warum nicht jetzt:** Das Formular ist gebaut, getestet und am Versand angeschlossen; der
Kunde hatte den eigenen Weg am 2026-09-06 ausdrücklich gewählt. Ein Schalter ist reversibel,
ein Löschen nicht ohne Aufwand. **R12** (Feldliste durchgehen) ruht so lange.

* [ ] Im nächsten Review fragen: bleibt es bei reparatur.info?
* [ ] Wenn ja: Formularzweig, Felder, API-Zweig, Mail-Zweig und Schalter entfernen; R12 schließen

### ✅ 3 — `HALTE_SCROLL` robuster machen — erledigt 2026-09-17
**Ziel:** `scripts/lib/preview-server.mjs` stoppt alle Halteschleifen über **ein** gemeinsames
Flag. Wer im selben Frame neu hält, setzt das Flag zurück, bevor die alte Schleife es sieht —
dann kämpfen zwei Schleifen um die Scrollposition. Beim Bau der Sichtprüfungs-Aufnahmen am
2026-09-16 so passiert. `npm run shots` und `npm run kontrast` sind nicht betroffen (sie
lassen zwischen den Schritten Zeit), die Hilfe ist aber eine Falle für das nächste Skript.

* [x] Jede Schleife bekommt eine eigene Kennung; `__ccHalte` beendet die vorige über die
      Kennung statt über ein geteiltes Flag (`scripts/lib/preview-server.mjs`). `shots`,
      `kontrast` und `zielgruppen` nutzen nur `__ccHalte`/`__ccLoslassen` — kompatibel
* [x] Pflichtfrage beantwortet: Eine Aufnahme an der falschen Stelle sieht aus wie eine
      richtige — deshalb beendet jetzt JEDER neue Aufruf die vorige Schleife, nicht erst ein
      Flag, das der nächste Aufruf wieder zurücksetzt

### ⬜ 4 — reparatur.info: Datenschutz- und Impressumslink, AV-Vertrag
**Ziel:** Die Schadenseite zeigt auf der Startansicht keinen der beiden Links; die App
unterstützt beides je Betrieb. Seit 2026-09-16 ist sie der Hauptweg für Schadenmeldungen.

* [ ] André bzw. PDR.cloud: Datenschutz- und Impressums-Adresse von BS CarCare hinterlegen
      (nach dem Livegang die Adressen der neuen Seite)
* [ ] AV-Vertrag mit der PDR.cloud GmbH prüfen (Faktenblatt, Abschnitt 3a und 6)
* [ ] Mit R6 (zum Schluss): Abschnitt „Schadenmeldung über reparatur.info" schreiben

### ⬜ 5 — Porsche-Logo: nur mit Datei und Nutzungsrecht
* [ ] Beim Porsche Zentrum Leipzig eine freigegebene Logodatei anfragen, samt Bestätigung,
      dass die Nutzung für eine Referenzliste erlaubt ist — Vorgehen `docs/partnerlogos/README.md`

### ⬜ 6 — Im Review mit André bestätigen lassen
* [ ] **4.8** — Abgrenzung außen = reinigen, Lack = Politur/Versiegelung/Wachs
* [ ] **4.21** — Seiten und Navigation behalten „Innen-/Außenaufbereitung", nur Pakete heißen neu
* [ ] **Wissensartikel** — „Lackreinigung" bleibt dort als Fachbegriff (4 Stellen)
* [ ] **Porsche Zentrum Leipzig** — Link ohne Logo, Begründung Markenrecht
* [ ] Schriftliche Freigaben riparo / Porsche Zentrum ablegen (bei OALAB oder André)

---

**Verwandte Dateien**
`docs/partnerlogos/README.md` · `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md` ·
`docs/backlog/schleife-4.md` · `docs/backlog/offene-punkte-konsolidiert.md`
