# Notwendig, aber nicht hinreichend — die Woche der grünen Wächter

Stand: 2026-09-03. Gilt für alle künftigen Build-Wächter und Prüfskripte in diesem
Projekt.

---

## Der Befund

Fünf Prüfungen aus dieser Woche waren **notwendig, aber nicht hinreichend**. Alle fünf
haben grün gemeldet — und zwar in genau der Lage, in der sie hätten greifen müssen.

| # | Prüfung | Was sie tatsächlich prüfte | Was sie durchließ | Grün gemeldet |
|---|---|---|---|---|
| 1 | `prerender.mjs`, Warnung statt Abbruch | „Ein Prerender-Fehler soll den Deploy nicht abwürgen" | Einen Deploy, bei dem der Prerender **gar nicht lief** — die Seite ging als leere SPA-Hülle live | Wochenlang, bis jemand die Seite ohne JavaScript ansah |
| 2 | `check-faq-html.mjs` | „Stimmen die gefundenen FAQ-Texte mit der Quelle überein?" | Dass **nichts** gefunden wurde: `ok: 1 Seiten, 0 FAQPage-Texte` | Bei genau dem Totalausfall aus 1 |
| 3 | `npm run smoke` ohne `--seit` | „Antwortet jede Route mit Inhalt, JSON-LD und Marker?" | Einen **alten Stand**, der noch live ist, weil der neue Deploy scheiterte | Bei jedem fehlgeschlagenen Deploy |
| 4 | `--seit` ohne Wert | — | Der Parser übersprang die Prüfung stillschweigend | **Genau dann, wenn jemand sie ausdrücklich anforderte** |
| 5 | `--seit HEAD` | „Ist das Deployment jünger als mein Commit?" | **Jedes fremde Deployment**, das nach dem Commit lief | 2026-09-03, unmittelbar nach dem Push von `main` |

Zu 5, weil es das jüngste und lehrreichste ist: Commit 14:04 UTC, ausgeliefertes
Deployment 14:36 UTC, eigener Stand erst 14:42 UTC live. Der Altersvergleich war
erfüllt, der eigene Code war es nicht. Aufgefallen ist es nur, weil zusätzlich der
Bundle-Hash verglichen wurde — Inhalts-Identität statt Zeitstempel.

---

## Die Frage für jeden neuen Wächter

> **Was besteht diese Prüfung, ohne dass die Sache tatsächlich in Ordnung ist?**

Nicht „prüft sie das Richtige?" — das tun alle fünf oben. Sondern: welche Lage sieht
für diese Prüfung genauso aus wie der Gutfall? Wer die Frage nicht beantworten kann,
hat den Wächter noch nicht verstanden.

### Zwei wiederkehrende Antworten

**„Nichts gefunden" sieht aus wie „nichts zu beanstanden".** Fälle 2 und 4. Ein Wächter
muss zwischen *geprüft und in Ordnung* und *nichts geprüft* unterscheiden — und die
Zahl der geprüften Objekte gegen eine unabhängige Erwartung halten. `check-faq-html.mjs`
vergleicht seit dem Fix gegen `scripts/routes.mjs` und bricht bei `25/25` erwarteten,
aber weniger gefundenen Seiten ab. Der Parser von `--seit` unterscheidet seitdem
„Flag nicht angegeben" von „Flag ohne Wert".

**Ein notwendiges Merkmal wird für ein hinreichendes gehalten.** Fälle 3 und 5. „Die
Seite antwortet" und „das Deployment ist jung" sind beide wahr, wenn alles stimmt — und
eben auch dann, wenn es nicht stimmt. Abhilfe ist jeweils ein Merkmal, das **nur** im
Gutfall zutrifft: eine Identität statt einer Eigenschaft. Der Bundle-Hash ist so eine
Identität, der Zeitstempel nicht.

---

## Zwei verwandte Fälle, andere Form

**Ein Wächter kann nach einem Refactoring erblinden.** `check-faq.mjs` suchte
`<PageFAQ route="…">`. Nach der Einführung von `ServiceLayout` fand er nichts mehr und
schlug Alarm — der harmlose Ausgang. Der gefährliche wäre der bequeme Fix gewesen: den
neuen Komponentennamen fest eintragen. Beim nächsten Layout wäre der Wächter wieder
blind gewesen, dann aber **lautlos**. Er erkennt durchreichende Komponenten jetzt
selbst und schreibt in sein Protokoll, wie viele Routen er auf diesem Weg gefunden hat
— damit die Mechanik widerlegbar ist und nicht nur behauptet.

**Ein Messwerkzeug kann selbstbewusst das Falsche messen.** Beim Kontrast lieferten
drei Messaufbauten hintereinander plausibel aussehende Zahlen, die Artefakte waren:
Kantenglättung, nicht gemalte DOM-Elemente, Abtastung außerhalb der Leinwand. Erkennbar
war es an einem Muster, nicht an einem Fehler — über alle Seiten hinweg identische
Werte. Für Messwerkzeuge lautet die Frage entsprechend: **Welches Ergebnis würde ich
auch dann bekommen, wenn das Werkzeug nichts misst?**

---

## Die Prüfung misst eine Nebeneigenschaft statt der eigentlichen

*Ergänzt am 2026-09-05, aus dem Bau des Zeitstrahls.*

Fünf Punkte sollten auf den Mitten ihrer Spalten sitzen. Geprüft wurde, ob sie
**gleichmäßig verteilt** sind — Abstand 259 px, fünfmal identisch, grün. Tatsächlich saß
jeder Punkt 22 px rechts der Mitte und unter der Achse, weil Framer Motion `transform`
inline schreibt und Tailwinds `-translate-x-1/2` damit überschrieben war.

Der gemeinsame Versatz ist der Kern des Falls: Gleichmäßigkeit ist gegen eine
Verschiebung **aller** Elemente vollkommen unempfindlich. Bei 200 px Versatz hätte
dieselbe Prüfung genauso grün gemeldet. Sie maß eine Eigenschaft, die mit der gesuchten
korreliert, aber nicht dasselbe ist.

> **Misst diese Prüfung die Eigenschaft, die mich interessiert — oder eine, die
> zufällig mitläuft?**

Abhilfe ist immer ein **Bezugspunkt außerhalb der geprüften Menge**. Nicht „die Punkte
zueinander", sondern „jeder Punkt gegen die Mitte seiner Spalte" und „die Punkte gegen
die y-Position der Achse". Nach der Umstellung: 202/461/720/979/1238 gegen Spaltenmitten
202/461/720/979/1238, Punkt-y 566 gegen Achse-y 566.

Verwandt mit „ein notwendiges Merkmal wird für ein hinreichendes gehalten", aber
schärfer: Dort ist das Merkmal wenigstens dasselbe Ding. Hier ist es ein anderes, das
sich im Gutfall genauso verhält.

---

## Der Prüfaufbau schließt den Fehler aus, den er finden soll

*Ergänzt am 2026-09-05, aus demselben Bau.*

Die Punkte des Zeitstrahls blendeten sich per `whileInView` ein. Auf schmalen Schirmen
erschienen sie nie — `initial={{ scale: 0 }}` und der `IntersectionObserver` saßen auf
demselben Element, und ein auf null skaliertes Element hat keine Fläche, an der ein
Schnitt entstehen könnte. Es beobachtete sich selbst weg.

Der erste Prüflauf fand das **nicht**, und zwar aus einem Grund, der im Aufbau steckte:
Um den ganzen Abschnitt aufs Bild zu bekommen, hatte ich den Viewport auf dessen volle
Höhe gesetzt. Damit war alles von Anfang an sichtbar — und genau das Scrollen fiel weg,
das den Fehler auslöst. Der Aufbau hatte die Bedingung entfernt, unter der der Defekt
auftritt.

> **Enthält mein Prüfaufbau noch die Bedingung, unter der der Fehler entsteht?**

Für scroll- und sichtbarkeitsabhängiges Verhalten heißt das konkret: in einem
**normalen** Fenster prüfen und wirklich scrollen. Ein aufgeblasener Viewport ist für
Screenshots bequem und für `whileInView`, `IntersectionObserver`, Lazy-Loading und
`position: sticky` wertlos. Dieselbe Falle in anderer Form: Headless meldet kein
`prefers-reduced-motion`, Windows schon.

**Derselbe Aufbau erzeugt auch falsche Befunde — zweimal an einem Tag.** Beim Prüfen
der Anfrage-Aufrufe meldete der Testlauf zwei Fundstellen als defekt. Beide waren in
Ordnung; der Test hatte danebengegriffen. Einmal traf er den Navigations-Link in einem
zugeklappten Menü statt den im Seiteninhalt, einmal klickte er auf gemessene
Koordinaten, während Lenis noch weiterscrollte — das Element war dort nicht mehr.
Abhilfe: den Klick im DOM auslösen, oder vor dem Messen warten, bis `window.scrollY`
über mehrere Frames stillsteht (Lenis läuft nach dem nativen `scrollTo` weiter).

Ein falscher Befund kostet mehr als ein übersehener: Er schickt jemanden in Code, der
in Ordnung ist. Deshalb gehört zu jedem roten Befund die Gegenfrage: **Habe ich den
Defekt gemessen oder meinen Aufbau?**

---

## Anwendung

Für jeden neuen Wächter, jedes Prüfskript und jeden Smoke-Test in diesem Projekt gilt:

1. Die Frage oben beantworten, **bevor** der Wächter geschrieben wird.
2. Eine Gegenprobe fahren: den Fehlerfall künstlich herstellen, sehen dass es bricht,
   zurücknehmen. Ein Wächter, der nie rot war, ist unbelegt.
3. Die Fehlermeldung benennt **den Fall**, nicht nur die Zahlen. „Ausgeliefertes Bundle
   stammt nicht aus diesem Build" schickt jemanden ins Dashboard; zwei
   gegenübergestellte Hashes schicken ihn in den eigenen Code.

   **Und sie benennt den *richtigen* Fall.** Der Altersvergleich meldete anfangs immer
   „vermutlich ist der letzte Deploy fehlgeschlagen" — auch dann, wenn die Commits
   schlicht noch nicht gepusht waren. Auf einem Arbeitsbranch ist das der Normalfall
   und kein Defekt; die Meldung schickte trotzdem ins Dashboard. Sie unterscheidet die
   beiden Ursachen jetzt über `git merge-base --is-ancestor HEAD origin/main`. Eine
   Meldung, die nur eine von zwei möglichen Ursachen kennt, ist eine halbe Diagnose —
   und kostet beim nächsten Mal genau die Zeit, die der Wächter sparen sollte.
4. Was der Wächter geprüft hat, gehört ins Protokoll — nicht nur, dass er zufrieden war.
5. **Den Bezugspunkt außerhalb der geprüften Menge wählen.** Eine Prüfung, die Elemente
   nur zueinander vergleicht, ist gegen einen gemeinsamen Fehler blind.
6. **Den Prüfaufbau selbst prüfen:** Schließt er die Bedingung aus, unter der der Fehler
   entsteht? Für Scroll- und Sichtbarkeitsverhalten in einem normalen Fenster messen und
   wirklich scrollen, nicht den Viewport aufblasen.
7. **Der Wächter darf bei kaputter Eingabe keine Befunde erfinden.** `check-dummies.mjs`
   meldete nach einem abgebrochenen Prerender zwei Anerkennungen als „verrottet", die es
   nicht waren — das Textnetz hatte schlicht keine Seiten zu lesen. Er hält die Zahl der
   gefundenen Seiten jetzt gegen `scripts/routes.mjs` und überspringt diesen Teil mit
   Begründung, statt zu raten. Ein Wächter, der bei kaputter Eingabe falsche Befunde
   erzeugt, wird nach dem zweiten Mal ignoriert — und dann nützt auch der richtige nichts.
