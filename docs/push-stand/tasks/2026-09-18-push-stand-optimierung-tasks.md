# Folgepunkte: Push-Stand

**Angelegt:** 2026-09-18
**Planung:** [`2026-09-18-push-stand-tasks.md`](2026-09-18-push-stand-tasks.md)

### ⬜ 1 — Pushes aus Terminal und IDE ebenfalls prüfen — Entscheidung User
**Ziel:** Der Claude-Code-Hook sieht nur Pushes, die Claude ausführt. Ein versionierter
git-`pre-push`-Hook (z. B. `.githooks/pre-push`, ruft `node scripts/push-stand.mjs --pruefen`)
würde auch Pushes von Hand prüfen.
* [ ] Klären, ob das Team das will — jeder Rechner muss ihn einmal aktivieren:
      `git config core.hooksPath .githooks`
* [ ] Wenn ja: Hook anlegen, Aktivierung in `CLAUDE.md` und in der Übersicht erklären

### ⬜ 2 — Hook ohne Git Bash
**Ziel:** Die Einstellung nutzt die Shell `bash` für den Vorfilter. Auf einem Rechner ohne Git
Bash schlägt der Hook fehl und der Push läuft ungeprüft.
* [ ] Falls ein Kollege ohne Git Bash arbeitet: Aufruf ohne Shell (`args`-Form mit `node`),
      dafür kostet jeder Befehl einen Node-Start
