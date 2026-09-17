# Offene Folgepunkte aus 2.1 / 2.3 / 4.2

**Angelegt:** 2026-09-14
**Planung:** [`2026-09-14-karten-ablauf-flaeche-tasks.md`](2026-09-14-karten-ablauf-flaeche-tasks.md)

> Die Befunde aus den fünf Phasen sind **in derselben Sitzung behoben** und dort als
> behoben dokumentiert. Was hier steht, sind die vier Punkte, die **bewusst nicht** in
> diesem Paket erledigt wurden — jeweils mit dem Grund. Keiner davon hält etwas auf.

---

### ⬜ 1 — Wächter für die Kartenfläche: geprüft und **bewusst zurückgestellt**
**Ziel:** Verhindern, dass 2.1 wieder auseinanderläuft, weil jemand eine neue Karte mit
`bg-white` baut.

**Warum hier kein Wächter steht.** `CLAUDE.md` verlangt vor jedem neuen Prüfskript die
Frage: *Was besteht diese Prüfung, ohne dass die Sache tatsächlich in Ordnung ist?*
Die ehrliche Antwort für den naheliegenden Wächter (Quelltext nach `bg-white` in
Kartendateien durchsuchen) ist unangenehm lang:

* eine **neue** Kartenkomponente in einer Datei, die der Wächter nicht kennt
* `bg-[#fff]`, `bg-white/95`, ein Inline-`style`, eine Klasse aus einer Variablen
* eine Karte, die gar keine Fläche setzt und dadurch auf dem Foto unlesbar ist —
  der Fehler, den 2.1 eigentlich meint, wäre für diesen Wächter grün

Ein Wächter, der das Naheliegende prüft und das Gemeinte verfehlt, ist genau der Fall aus
`docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`. **Der bestehende Schutz ist
besser:** Die Fläche kommt aus **einer** Klasse, `FeatureGrid` hat keine Stütze mehr, mit
der man sie umschalten könnte, und `npm run kontrast` misst das **ausgelieferte** Ergebnis
— also die Sache selbst, nicht ihre Schreibweise.

* [ ] Erst dann bauen, wenn ein Rückfall **tatsächlich** vorkommt — und dann gegen das
      ausgelieferte CSS, nicht gegen den Quelltext

---

### ⬜ 2 — Sektionshintergründe: zweite Fundstelle derselben Zahl
**Ziel:** `bg-gray-50/70` steht weiterhin an rund sechs Stellen als **Sektions**-Hintergrund
(`PrivatkundenPage`, `BusinessCustomersPage`, `VehicleDetailingPage`,
`AussenaufbereitungPage`, `JobCards`, Vorgabewert in `FAQSection`).

**Nicht Teil von 2.1.** Der Kunde spricht von „Karten-Styling". Ein Sektionston ist etwas
anderes als eine Kartenfläche, und beide in dasselbe Token zu ziehen, würde sie aneinander
fesseln: Wer künftig die Karten transparenter will, bekäme ungefragt hellere Sektionen.

* [ ] Eigenes Token `--cc-sektion-ton` erwägen, **wenn** der Kunde die Sektionstöne
      anspricht — nicht vorher

---

### ⬜ 3 — `ScrollPinnedProcess` bleibt das dritte Muster
**Ziel:** 2.3 sagt „**alle** Zeitstrahl- und Prozessdarstellungen einheitlich".
Umgestellt sind `Timeline` und `ProcessList`. Die scroll-gepinnte Darstellung auf der
Startseite und `/fahrzeugaufbereitung-leipzig` folgt weiter ihrem eigenen Muster.

**Absicht, kein Rest.** Der Kunde hat dieses Verhalten in **3.1** ausdrücklich abgenommen:
*„Scroll-/Sticky-Effekt (5 Kacheln): Verhalten ist gewollt"* — beanstandet war nur die
Flüssigkeit, und die ist am 2026-09-06 behoben. Es auf die Achse umzustellen hieße, eine
abgenommene Entscheidung zurückzubauen.

* [ ] Beim nächsten Review mit André zeigen und bestätigen lassen, dass 3.1 und 2.3
      nebeneinander bestehen bleiben

**⚠️ Seine Kartenfläche ist ebenfalls Absicht und darf nicht „vereinheitlicht" werden.**
`ScrollPinnedProcess.tsx:119` nutzt `bg-[rgb(255_255_255/0.92)]` **plus** `backdrop-blur-sm`
— deutlich deckender als `.cc-karte`. Grund: Diese Karte liegt **direkt** auf dem Foto,
ohne den Textschutz, den `BackdropLayout` den Sektionen gibt. Auf `.cc-karte` (0,72)
umgestellt, stünde der Text auf blankem Bild. Wer hier vereinheitlicht, bricht 2.18 weiter
auf statt es zu lösen.

---

### ✅ 4 — Rückwirkung des Aufnahmefehlers geprüft
**Ziel:** `npm run shots` wartete bis 2026-09-14 nur 550 ms und hat damit **jede** Aufnahme
des Zeitstrahls seit dem 2026-09-04 halb gezeichnet abgelegt.

* [x] Gegengeprüft: In die Entscheidungen vom 2026-09-11 sind **keine** halben Bilder
      eingeflossen. Die Begründung im Kopf von `Timeline.tsx` nennt durchgehend im DOM
      gemessene Pixelwerte — „133px nach oben", „139px nach unten", „bei 1024px je über
      220px" — und ausdrücklich *„Kein Build und kein Waechter sieht das."* Das ist eine
      Messung, kein Sichteindruck.
* [x] Nach der Korrektur nachgestellt: `/ueber-uns` bei 1440px nimmt den Zeitstrahl jetzt
      **vollständig** auf — alle sechs Punkte, Karten abwechselnd über und unter der Achse.

---

**Verwandte Dateien**
`docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`
`docs/backlog/schleife-2.md` · `docs/backlog/schleife-3.md` · `docs/backlog/schleife-4.md`
