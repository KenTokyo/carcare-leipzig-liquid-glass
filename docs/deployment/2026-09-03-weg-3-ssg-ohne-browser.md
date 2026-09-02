# Folgeentscheidung: Prerender ohne Browser (SSG über `react-dom/server`)

Status: **dokumentiert, nicht umgesetzt.** Entscheidung steht aus.
Referenz: `docs/deployment/2026-09-02-divergenz-lokal-vercel.md`

---

## Worum es geht

Der heutige Prerender startet einen echten Headless-Browser, lädt jede der 25 Routen
über einen lokalen Vorschau-Server und speichert das gerenderte DOM. Das funktioniert,
hängt aber an einer Chromium-Binärdatei und damit an den Systembibliotheken der
Build-Umgebung.

Genau daran ist er am 2026-09-02 gescheitert: `libnspr4.so` fehlt im Vercel-Image.
Behoben mit `@sparticuz/chromium` — einem Chromium-Build, der ohne diese Bibliotheken
auskommt. Das ist eine Reparatur an der Symptomstelle, keine Beseitigung der Ursache.

**Weg 3 entfernt den Browser aus dem Build.** `react-dom/server` rendert die React-App
direkt in Node zu HTML. Kein Chromium, keine Systembibliotheken, keine
Versionspaarung zwischen zwei Paketen, kein 8-Sekunden-Download je Build.

## Was dafür spricht

- **Die ganze Fehlerklasse verschwindet.** Ohne Browser gibt es nichts, das an einer
  fehlenden `.so`-Datei scheitern kann.
- **Deutlich schneller.** Aktuell: Chromium bereitstellen, Vorschau-Server starten,
  25 Seiten einzeln laden, je mit Scroll-Durchlauf für die `whileInView`-Reveals.
- **Zwei Abhängigkeiten weniger** — `@sparticuz/chromium` und `puppeteer-core`
  entfielen, samt der exakten Versionspaarung, die beim nächsten Puppeteer-Update
  wieder Handarbeit verlangt.
- **Reproduzierbar.** Dasselbe Ergebnis lokal und auf Vercel, weil nur Node läuft.

## Die bekannten Hürden

Die App ist heute eine reine Client-SPA. Für serverseitiges Rendern muss sie ohne
`window` durchlaufen. Drei Stellen sind vorab bekannt:

| Stelle | Problem | Denkbare Richtung |
|---|---|---|
| **`App.tsx`** | `useState(() => normalizePath(window.location.pathname))` — der Router liest den Pfad direkt aus dem Browser. Auf dem Server gibt es kein `window`. | Pfad als Prop hereingeben; der Client liest ihn weiterhin selbst. Betrifft auch den `popstate`-Listener und den Scroll-Effekt. |
| **Lenis** | Smooth-Scrolling-Bibliothek, greift auf `document` und `requestAnimationFrame` zu. | Nur clientseitig einhängen (`useEffect`), auf dem Server gar nicht instanziieren. |
| **Framer Motion** | `whileInView`-Reveals starten mit `opacity: 0`. Beim Browser-Prerender löst der Scroll-Durchlauf sie aus; ohne Browser bliebe der Inhalt im HTML auf `opacity: 0`. | Der Text stünde weiterhin im DOM — für Crawler also sichtbar. Trotzdem prüfen, wie das gerenderte HTML ohne JS aussieht. |

Dazu kommt, was die Prüfung erst zeigen wird: `useMediaQuery`, `PhotoBackdrop`,
`useScrollProgress` und der Preloader greifen ebenfalls auf Browser-APIs zu. Ob sie
auf Modulebene oder erst im Effekt zugreifen, entscheidet über den Aufwand.

## Aufwandseinschätzung

Ehrlich: **nicht abschätzbar, bevor die Komponenten durchgesehen sind.** Der
Router-Umbau ist überschaubar, die Frage ist die Breite der Browser-Zugriffe im
Komponentenbaum. Die Bandbreite reicht von „ein Nachmittag" bis „eigenes Paket".

## Empfehlung

**Nicht jetzt.** `@sparticuz/chromium` löst das akute Problem, und die beiden
verschärften Wächter sorgen dafür, dass ein erneuter Ausfall nicht mehr unbemerkt
bleibt — der Build bricht dann ab, statt still eine leere Hülle auszuliefern.

Weg 3 wird interessant, sobald einer dieser Punkte eintritt:

- Das nächste Puppeteer-Update bricht die Versionspaarung und macht wieder Handarbeit.
- `@sparticuz/chromium` hinkt hinterher (heute schon: max. Chromium 149 gegen
  Puppeteer-Standard 150).
- Die Build-Zeit stört.
- Die App bekommt ohnehin serverseitige Anteile.

Vor einer Umsetzung gehört eine Bestandsaufnahme aller Browser-Zugriffe im
Komponentenbaum an den Anfang — analog zur Divergenz-Bestandsaufnahme vom 02.09.
