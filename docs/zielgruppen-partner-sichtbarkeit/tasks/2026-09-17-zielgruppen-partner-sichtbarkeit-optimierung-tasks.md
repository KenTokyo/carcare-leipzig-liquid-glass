# Folgepunkte: Partnerlisten der Zielgruppenkarten

**Angelegt:** 2026-09-17
**Planung:** [`2026-09-17-zielgruppen-partner-sichtbarkeit-tasks.md`](2026-09-17-zielgruppen-partner-sichtbarkeit-tasks.md)
**Messung:** `npm run zielgruppen` (nach `npm run build`)

> Alles, was ohne Entscheidung lösbar war, ist im Paket behoben und dort dokumentiert
> (tsconfig-`exclude`, Scroll-Verlauf, Titelzeile, Kopfkommentar `textschutz.css`,
> `HALTE_SCROLL`, Mausrad auf `/karriere` und im Dialog). Hier steht, was **bewusst** offen ist.

---

### ✅ 0 — Im Paket mitbehoben (Nachweis in der Planung)
* [x] 🔴 `tsconfig.json` ohne `exclude` → Sicherung unter `output/` machte `tsc` rot
* [x] 🟠 Scroll-Verlauf blendete bei 1 px Überlauf eine voll sichtbare Zeile aus
* [x] 🟠 `pruefe_html.py` (Paket 2) brach in Windows-Konsolen an `→` ab — Ausgabe jetzt UTF-8
* [x] 🟠 Mausrad erreichte Karten-Texte auf `/karriere` und den Dialog in niedrigen Fenstern nicht
* [x] 🟡 `text-2xl` brachte 32 px Zeilenhöhe in eine 60-px-Titelzeile
* [x] 🟡 Tote Höhenregel am CTA-Container (überlappende `max-height`-Varianten, seit 2026-07-24)
* [x] 🟡 Halbes Fenster: 32 Versicherer in zwei Spalten auf 856 px — Spalten jetzt automatisch
* [x] 🟢 Kopfkommentar `styles/textschutz.css` nannte den falschen Einbindungsort
* [x] 🟢 `HALTE_SCROLL` mit geteiltem Stopp-Flag (Folgepunkt 3 vom 2026-09-16)

### ✅ 1 — Mobil: Partner erst nach einem Wisch im Kartentext — entschieden: bleibt so
**Befund (gemessen):** Auf 390 × 664 (iPhone mit sichtbaren Browserleisten) und 360 × 640
füllen Titel, Beschreibung und die zwei CTAs die Karte bereits aus. Die Partner sind dort
nur über einen Wisch im Kartentext zu sehen (0 sofort, danach 18 bzw. 12 im ersten Blick,
der Rest beim Weiterwischen). Der Verlauf an der Unterkante und die Anzahl „32" im Titel
zeigen das an. Mit eingeklappten Leisten (390 × 844) stehen 8 sofort da.

**Warum nicht einfach „mehr Platz":** Der mobile Kartenstapel kostet pro Karte eine Leiste
(96 px) plus Navbar und Aktionsleiste (190 px). Auch ohne Leisten wäre die Versicherer-Liste
mit ~400 px länger als die ganze Karte.

**Entscheidung User 2026-09-17: „mobil so lassen" → Option (a).** Nicht neu aufmachen,
solange der Kunde mobil nichts anderes meldet.

**Optionen (zur Einordnung):**
* [x] **(a) So lassen** — Stapel-Effekt bleibt, Partner per Wisch (gewählt)
* [ ] **(b) Mobil ohne Stapel:** Unter `lg` stehen die drei Karten untereinander im normalen
      Fluss, jede so hoch wie ihr Inhalt — alle Partner beim normalen Scrollen sichtbar, kein
      innerer Scrollbereich. Kostet den Stapel-Effekt auf dem Telefon
* [ ] **(c) Mobil flache Stufe:** Stapel bleibt, aber ohne sichtbare Leisten (wie Desktop
      unter 680 px Höhe) — gewinnt 96–192 px je Karte, löst das Grundproblem aber nicht

### ⬜ 2 — `parallax-scroll-kit/`: `allowNestedScroll` nachziehen — Entscheidung User
**Ziel:** Das exportierte Kit (`parallax-scroll-kit/src/hooks/useSmoothScroll.ts`, untracked)
hat dieselbe Lenis-Einrichtung ohne die Option. Es läuft gespiegelt in
`nalbach-und-hinkel-2` (Memory `parallax-scroll-kit-export`) — innere Scrollbereiche sind
dort vermutlich genauso per Mausrad unerreichbar.
* [ ] Option `allowNestedScroll` (Standard `true`) im Kit ergänzen
* [ ] In `nalbach-und-hinkel-2` nur nach Freigabe übernehmen — anderes Projekt

### ⬜ 3 — `ExpandingCardAccordion` auf `.cc-scroll-verlauf` umstellen (klein, optional)
Die Leistungskarten haben einen eigenen, absolut gelegten Verlauf, der immer sichtbar ist —
auch wenn der Text nicht überläuft. `.cc-scroll-verlauf` zeigt ihn nur, solange unten noch
etwas folgt. Vorher `npm run kontrast` und Sichtprüfung auf `/`, `/karriere`.

### ⬜ 4 — Firefox: kein Verlauf (Hinweis, kein Handlungsbedarf)
Scroll-gesteuerte Animationen sind in Firefox (Stand 2026) nicht ohne Flag aktiv. Dort bleibt
der Bereich ohne Verlauf; die schmale Scrollleiste zeigt das Weitergehen trotzdem. Die Anzahl
im Titel gilt überall.

### ⬜ 5 — `npm run zielgruppen` im Review-Ablauf verankern
Läuft rund vier Minuten — zu lang für `prebuild`, wie `kontrast` und `shots`. In
`CLAUDE.md` (Messwerkzeuge) eingetragen.
* [ ] Vor jedem Kunden-Review zusammen mit `npm run kontrast` laufen lassen

---

**Verwandte Dateien**
`components/TargetGroupCards.tsx` · `components/ZielgruppenPartner.tsx` ·
`styles/zielgruppen.css` · `styles/scrollverlauf.css` · `hooks/useSmoothScroll.ts` ·
`scripts/check-zielgruppen.mjs`
