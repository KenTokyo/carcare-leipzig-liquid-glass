# Dev-Server: Worktrees anderer Sessions nicht beobachten

**Anlass (2026-10-19):** Der User testete R33 lokal mit `npm run dev`. Gleichzeitig baute eine Claude-Code-Session in
ihrem Worktree `.claude/worktrees/nav-mobil-menue/` (innerhalb des Projekts). Vite beobachtete diesen Ordner mit
(`.gitignore` gilt für den Beobachter nicht): Der Testtab lud bei jeder vorgerenderten Seite dort neu, zeitweise jede
Sekunde, und eine `tsconfig.json` dort leerte den Cache des Dev-Servers. User: „lass Vite den Ordner .claude/worktrees
ignorieren, als eigenen kleinen Commit, nicht in R33“.

**Branch:** `2026-10-19-vite-worktrees-ignorieren` (von `main`) · **Status:** umgesetzt.

### ✅ Phase 1 — Umsetzung und Messung
**Ziel:** Änderungen unter `.claude/worktrees/` lösen im Dev-Server nichts mehr aus; alles andere wie bisher.
* [x] `vite.config.ts`: `server.watch.ignored` als Funktion gegen den absoluten Pfad `<Projekt>/.claude/worktrees`
      (der Ordner selbst und alles darin). Kein allgemeines Glob-Muster: Ein Dev-Server, der IN einem Worktree läuft,
      beobachtet so weiter seine eigenen Dateien. Funktion statt Glob wegen Klammern in fremden Projektpfaden; `/` statt
      `\` für Windows.
* [x] Messung mit Vites Beobachter (Vite ohne Port, Middleware, ohne HMR-Socket; Probedateien `index.html` und
      `tsconfig.json` unter `.claude/worktrees/vite-probe/` sowie eine normale `vite-probe-normal.html` im Projekt):
      | Konfiguration | Ereignisse unter `.claude/worktrees/` | Ereignisse normale Datei |
      |---|---|---|
      | vorher (`main`) | **5** (Gegenprobe: Problem nachgestellt) | 1 |
      | nachher, zwei Läufe | **0** | 1 |
* [x] `npx tsc --noEmit` sauber; Probe-Build `vite build` sauber, Bundles bytegleich mit `main` (`index-TH6rAPOw.js`):
      Die Änderung wirkt nur auf den Dev-Server, nicht auf die ausgelieferte Website.
**Referenzen:**
`vite.config.ts`

---

## Kommentare
### Phase 1
**Eingehalten:** eigener Commit außerhalb von R33 ✅, Gegenprobe vor der Änderung ✅, kein Dev-Server gestartet (Vite
nur als Beobachter ohne Port) ✅, Build-Ausgabe unverändert belegt ✅.
**Auffälligkeiten:** keine. Gegengeprüft: Den eigenen `dist/` des Projekts ignoriert Vite schon von sich aus
(Probedatei dort: 0 Ereignisse). Gemeldet wurde vorher nur der `dist/` IM Worktree, weil der nicht Vites Ausgabeordner ist.
