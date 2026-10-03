# Optimierung zu 5.28 und 6.7 — Funde aus der Umsetzung vom 02.10.2026

**Bezug:** `docs/backlog/tasks/2026-10-02-stimmen-und-zusatzregeln-tasks.md` (Kommentare je Phase)
**Regel:** Funde, die während der Arbeit auffielen, sofort beheben und hier als ✅ führen; was eine Entscheidung oder eine
Zulieferung braucht, bleibt ⬜ mit Empfehlung.

---

### ✅ O1 — Bildinventar: Ein geliefertes Foto hätte die Nummer seines Platzhalters verloren 🟠
**Fund (beim Lesen der Nummernvergabe in `scripts/bilder-inventar.mjs`):** Ein Platzhalter (`data-bild-platzhalter`) und
das Foto, das ihn später ersetzt, hatten nie denselben Rahmen (Rolle und Datei verschieden). Das Foto bekam eine neue
Nummer, die des Platzhalters „entfiel“. Der User ordnet Andrés Fotos aber genau über diese Nummern zu — betroffen wären
die fünf neuen Porträtplätze und die elf Plätze der Galerie „Einblicke“ (B48 ff.).
* [x] Merkmal `data-bild-ort` (Rundgang liest es als Ort) und Regel `VORGAENGER` (Platzhalter → Foto am selben Ort)
* [x] Porträtplätze und Galerie-Kacheln tragen es; Ablauf im Kopf von `data/stimmen.ts`

### ✅ O2 — Zusatzleistungen fielen beim Wechsel der Leistung still heraus 🟡
**Fund:** Seit 5.20 (28.09.) wählte das Formular unpassende Zusatzleistungen ab, ohne es zu sagen; bei zugeklappter
Liste unbemerkt. Mit Andrés Regeln (6.7) passiert das deutlich öfter (Keramik bei vier von fünf Paketen gesperrt).
* [x] Hinweis über der Liste („Abgewählt: … (Grund).“), Live-Region steht immer im DOM; Anhaken räumt ihn

### ✅ O3 — Server nahm `zusatzleistungen` als Zeichenkette ungeprüft an 🟡
**Fund:** `api/anfrage.ts` prüfte IDs und Regeln nur, wenn das Feld eine Liste war. Eine Zeichenkette („keramik“) ging
ungeprüft in die Mail.
* [x] Seit 6.7 gilt die Prüfung für jede Terminanfrage; was keine Liste ist, zählt als „keine Zusatzleistung“ und fällt weg

### ✅ O4 — Seitentexte widersprachen Andrés Regeln 🟡
**Fund:** Motorreinigung „zu den übrigen Paketen buchen Sie sie einzeln dazu“ (nicht zur „exklusiv“, nicht zur
Leasingrückgabe), Brillant Außenpflege „zugleich die Voraussetzung“ (auch die Lackaufbereitung), Innenseite „zusätzlich
zur gebuchten Innenaufbereitung“ (auch einzeln), Übersicht „die Sie zu Ihrem Paket buchen oder direkt anfragen“.
* [x] Umformuliert; Regeln im Fließtext abgeleitet (`regelSaetze`, Kachelzeile, FAQ), von Hand Formuliertes im Kopf von
      `data/zusatzleistungen.ts` aufgelistet

### ✅ O5 — Vorgangsnummer trug nachts das Datum des Vortags 🟢
**Fund (Mailtest um 00:45 Uhr am 02.10.):** „CC-1001-…“. `toISOString()` liefert UTC, Vercel rechnet in UTC.
* [x] Datum in `Europe/Berlin` (`Intl.DateTimeFormat`), geprüft an 00:45 Uhr, Jahreswechsel und Zeitumstellung

### ✅ O6 — Berufsbezeichnungen brachen bei 320 px mitten im Wort 🟢
* [x] Weiche Trennstellen an der Wortfuge (`anzeigeBeruf`), `text-balance` gegen die volle erste Zeile bei 1440 px

### ✅ O7 — Übersichtstabelle in `schleife-5.md` führte 5.20 noch als offen 🟢
* [x] „Neue Bausteine“ und „Vor dem Livegang zwingend“ auf den Stand gebracht (5.20 am 28.09., 5.28 am 02.10.)

### ✅ O8 — Bildinventar meldete nach dem Mailtest einen veralteten Build 🟢
**Fund:** `npm run bilder` prüft neben `pruefeDistStand` (getrackte Dateien) noch selbst die Ordnerzeiten, auch die der
erzeugten `data/*.js`. `npm run test:email` schreibt sie neu → danach bricht `npm run bilder` mit „dist/ ist aelter“ ab,
obwohl sich am Ausgelieferten nichts geändert hat. `scripts/lib/dist-stand.mjs` schließt genau diese Dateien bewusst aus.
* [x] `juengste` überspringt erzeugte `data/*.js` (Muster `ERZEUGT`, an Windows-Pfaden geprüft), gleiche Ausnahme wie
      `dist-stand.mjs`
* [x] Gegenprobe in der Messkette: `npm run test:email` (schreibt `data/*.js` neu), direkt danach `npm run bilder` → läuft durch

### ⬜ O9 — Rückfragen an André zu 6.7 (umgesetzt ist die wörtliche Fassung) 🟢
1. Motorreinigung zur **Leasingrückgabe** und zur **Premiumpflege „exklusiv“**: nicht genannt, deshalb gesperrt.
2. Keramik-/Nanoversiegelung zur **Premiumpflege** (enthält die Brillant Außenpflege): nicht genannt, deshalb gesperrt.
3. *(neu 2026-10-03)* Keramik/Nano stehen auf Wunsch des Users wieder unter „Gewünschte Leistung“. Das Paket dazu ist
   dann offen: Hinweis im Formular, „Paket offen: …“ in der Mail. Reicht das, oder soll der Kunde das Paket gleich mit
   angeben (Pflichtfeld „Brillant / Lackaufbereitung / Bitte beraten“)? Plan:
   `docs/backlog/tasks/2026-10-03-versiegelungen-als-leistung-tasks.md`
**Empfehlung:** mit dem nächsten „Bitte einmal prüfen“ an André schicken. Jede Antwort ist eine Zeile in
`data/zusatzleistungen.ts` (`buchbar.zu`); Kachelzeilen, Formular, Server und FAQ ziehen von selbst nach.
