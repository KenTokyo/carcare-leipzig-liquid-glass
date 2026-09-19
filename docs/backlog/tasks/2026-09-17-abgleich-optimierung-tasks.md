# Offene Folgepunkte aus dem Abgleich vom 2026-09-17

**Angelegt:** 2026-09-17
**Planung:** [`2026-09-17-abgleich-offene-punkte-tasks.md`](2026-09-17-abgleich-offene-punkte-tasks.md)

> Was ohne Entscheidung lösbar war, ist im Abgleich behoben (Phase 3 dort). Hier steht, was eine
> Antwort des Kunden oder des Users braucht — mit dem Grund.

---

### ⬜ 1 — WINTEC: 18 Nennungen hängen an einer offenen Kundenfrage (3.30, 3.13)
**Ziel:** Die Seite nennt den Autoglas-Partner längst, der Kunde fragt noch, ob sie das darf.
Fundstellen: `pages/AutoglasPage.tsx` (5, darunter Title und Meta-Description), `data/faqs.ts` (2),
`data/services.ts` (2), `seo/pageSchemas.ts` (2), `pages/UeberUnsPage.tsx` (2), je 1 in
`AccidentRepairPage`, `PrivatkundenPage`, `BusinessCustomersPage`, `LeasingrueckgabePage`.
* [ ] André fragen: Ist „Vintech" = WINTEC? Darf der Name stehen (Altseite nennt ihn)?
* [ ] Zugleich 3.13: Neuverglasung für **LKW und Bus** — bieten wir das selbst oder über den Partner an?
* [ ] Bei „nicht nennen": alle 18 Stellen **zugleich** ändern, danach `npm run build` und `npm run meta`
      (der Title von `/autoglas-leipzig` trägt den Namen)

### ⬜ 2 — WCAG 2.2.2: fünf Videostellen statt drei
**Ziel:** Ein Weg zum Anhalten für alles, was automatisch und länger als 5 s läuft.
* [ ] Filme (3.18/3.20/3.21): mit **4.14** lösen — ganzer Film als Klick-Video mit Steuerung
* [ ] Hintergrundvideo auf `/ueber-uns` (`PhotoBackdrop`, `pointer-events: none`): eigener
      Anhalte-Knopf außerhalb der Ebene
* [ ] Animiertes Logo (Navigation, Zielgruppenkarten, Footer): entscheiden — einmal abspielen
      und stehen bleiben, oder über denselben Schalter anhalten. **Nicht** über
      `prefers-reduced-motion` allein: Für die Filme hat der Kunde das am 2026-09-07 zurückgenommen

### ⬜ 3 — Zwei Übersichten, die auseinanderlaufen
**Ziel:** Eine gültige Liste der offenen Punkte.
`docs/schleife-2-4-karten-ablauf-flaeche/kategorien-fotos-texte-logos-pricing.md` ist bewusst auf
dem Stand 14.09. und meldete deshalb 2.18 als erledigt (behoben). Jede weitere Kundenentscheidung
lässt sie weiter altern.
* [ ] User entscheiden lassen: Kategorien-Übersicht einfrieren (Kopf „historisch") **oder** bei der
      nächsten Fotoanforderung neu schneiden. Empfehlung: einfrieren; die aktuelle Liste steht im
      jeweils letzten Abgleich (Verweis im `README.md`)

### ⬜ 4 — Rückfragen an André in einem Zug
**Ziel:** Eine Nachricht statt vieler, im Klartext statt über Nummern.
* [ ] Jahr für Meilenstein 3 (4.19) · Ist Priorität 1 die höchste? (Schleife 4)
* [ ] Ausbildung: kommender Jahrgang, Industriekaufmann/-frau, Eckdaten (3.32/R4)
* [ ] Slogan-Wortlaut (3.36) · Was war mit „bildtechnisch noch was ändern" gemeint? (3.37)
* [ ] WINTEC nennen? LKW/Bus? (3.30/3.13, siehe Punkt 1)
* [ ] Bleibt es bei reparatur.info? Dann das eigene Schadenformular zurückbauen und R12 schließen
* [ ] Zur Abnahme zeigen: 2.13, 3.9, 3.1 neben 2.3, 4.3/4.8, 4.21, Porsche Zentrum nur als Link

### ✅ 5 — Im Abgleich behoben
* [x] Kategorien-Übersicht: 2.18 fälschlich als umgesetzt geführt
* [x] `schleife-1.md`: R1, R5, R9, R10, R12 auf den Stand des Codes
* [x] Drei erledigte, aber offen markierte Kästchen in fremden Plänen (Push, `npm install`, Umbenennung)

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-3.md` · `docs/backlog/offene-punkte-konsolidiert.md` ·
`docs/betriebsvideo/tasks/2026-09-07-betriebsvideo-tasks.md`
