# Rechtsseiten: Impressum und Datenschutz

**Branch:** `rechtsseiten/impressum-datenschutz`
**Angelegt:** 2026-09-04
**Auslöser:** Befund aus der Paket-D-Session — die Footer-Links „Impressum" und
„Datenschutz" standen auf `href="#"`, es gab weder Route noch Seite noch Inhalt.

## Ausgangslage (gemessen, nicht angenommen)

| Prüfung | Ergebnis |
|---|---|
| `components/Footer.tsx:221–222` | beide `href="#"` |
| Route in `App.tsx` | keine, fällt in `default: NotFoundPage` |
| `scripts/routes.mjs`, `vercel.json` | kein Eintrag |
| Produktion `/impressum`, `/datenschutz` | HTTP 404 |
| `components/RequestForm.tsx` | verweist auf eine „Datenschutzerklärung", die es nicht gibt |
| Footer-Datenschutzsatz | behauptete Matomo — **es gibt kein Matomo** |

Auf der Altseite `www.carcare-center.de` existieren beide Seiten mit Inhalt:
`kontakt/impressum.html` und `kontakt/datenschutzerklaerung.html` (rund 23.000
Zeichen, Stand 2020, mit Matomo-Abschnitt).

## Entscheidungen des Users (2026-09-04)

1. Matomo-Satz **sofort** raus, eigener Commit, unabhängig vom Rest.
2. Impressum **bauen** mit den belegten Daten der Altseite. Was nicht belegt ist,
   bleibt als TODO-Kommentar **leer, nicht geraten** — gleiche Regel wie 1.18/1.29.
3. E-Mail **unmittelbar sichtbar**, nicht per JavaScript wie auf der Altseite.
4. Datenschutz: Route und Gerüst, **den Text von 2020 NICHT übernehmen**. Er
   beschreibt einen anderen Hoster, nennt Matomo und kennt unsere vier Formulare
   nicht. Ihn zu verlinken wiederholte genau den Fehler des Matomo-Satzes.
5. Formularverweis zeigt auf die neue Route.
6. Technisches Faktenblatt für Andrés Datenschutzbeauftragten.
7. Backlog: beides als Zulieferung André, Vermerk „vor dem Livegang".

---

### ✅ Phase 1 — Falsche Matomo-Aussage entfernt
**Ziel:** Eine unrichtige Angabe über die eigene Datenverarbeitung steht live auf
25 Seiten. Das wiegt schwerer als eine fehlende Seite, deshalb vorgezogen.

* [x] Vor dem Ersetzen geprüft, was der Ersatzsatz behaupten darf:
  `Set-Cookie` auf `/`, `/karriere`, `/kontakt` — **keine**; Tracking-Scripte in
  HTML und Bundle — **keine**; Elemente, die von Fremdhosts laden — **0**.
* [x] Satz ersetzt durch „Diese Website nutzt keine Analyse- oder Tracking-Dienste
  und setzt keine Cookies."
* [x] Aufsichtsbehörde mit entfernt — gehört in die Datenschutzerklärung, nicht in
  den Footer, und die genannte Form war nicht geprüft.
* [x] Gegenprobe am Build: „Matomo" in `dist/` **nirgends**, neuer Satz auf allen Seiten.
* [x] Eigener Commit `0469b07`, nach `main` gemerged und gepusht.

**Referenzen:**
`components/Footer.tsx`

---

### ✅ Phase 2 — Impressum: Seite, Route, Mechanik
**Ziel:** Eine vollständige Seite aus belegten Daten. Lücken sichtbar leer, nicht
gefüllt mit Vermutungen.

* [x] `pages/ImpressumPage.tsx` — belegte Angaben aus der Altseite: Firma,
  Anschrift, Geschäftsführung André Bosse, Amtsgericht Leipzig HRB 23667,
  USt-IdNr. DE 257 851 313, Fax, Haftungshinweis.
* [x] E-Mail als sichtbarer `mailto:`-Link, **nicht** JavaScript-verborgen.
* [x] Vier Leerstellen bleiben **leer, ohne sichtbaren Platzhalter** — nur TODO-Kommentar
  im Code, Regel wie 1.18/1.29: Telefonnummer, Handwerkskammer,
  Berufsbezeichnung/Verleihungsstaat, Verbraucherstreitbeilegung.
  Dass die Lücken damit unsichtbar sind, trägt Backlog 3.33 — deshalb steht dort
  ausdrücklich „vor dem Livegang".
* [x] Route in `App.tsx`, `scripts/routes.mjs` (Sitemap-Priorität 0.3), damit
  automatisch in Prerender, `vercel.json` und beiden Wächtern.
* [x] Footer-Link von `href="#"` auf `/impressum`.

**Referenzen:**
`pages/ImpressumPage.tsx`
`scripts/routes.mjs`
`components/Footer.tsx`

---

### ✅ Phase 3 — Datenschutz: Route und Gerüst ohne Text
**Ziel:** Kein Link zeigt mehr ins Leere, und es steht nichts auf der Seite, das
niemand geprüft hat.

* [x] `pages/DatenschutzPage.tsx` — Gerüst mit den Abschnitten, die die fertige
  Erklärung führen wird, jeder sichtbar als „in Vorbereitung" markiert.
* [x] Belegte Angabe übernommen: Verantwortliche Stelle (steht schon im Footer).
* [x] Der Text von 2020 wird **nicht** übernommen und **nicht** verlinkt.
* [x] `noindex` und **nicht in der Sitemap** — ein Platzhalter gehört nicht in den
  Index. Dafür `sitemap: false` in `scripts/routes.mjs` ergänzt.
* [x] `components/RequestForm.tsx`: Datenschutzverweis zeigt auf `/datenschutz`.
* [x] Footer-Link von `href="#"` auf `/datenschutz`.

**Referenzen:**
`pages/DatenschutzPage.tsx`
`scripts/routes.mjs`
`components/RequestForm.tsx`

---

### ✅ Phase 4 — Technisches Faktenblatt
**Ziel:** Der Datenschutzbeauftragte soll die Erklärung schreiben können, ohne den
Code zu lesen. Alle Angaben gemessen, mit Fundstelle.

* [x] `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`
* [x] Hosting Vercel mit US-Bezug, Server-Logs, keine eigene Datenbank.
* [x] Alle vier Formularvarianten mit Feldliste und Versandweg.
* [x] Zwei `sessionStorage`-Schlüssel als rein funktional eingeordnet.
* [x] Keine Analytics, keine Cookies, keine eingebettete Karte, Schriften self-hosted.
* [x] Drei Punkte, die auffielen und nicht auf der Liste standen — siehe Kommentare.

**Referenzen:**
`docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`

---

### ✅ Phase 5 — Backlog, Verifikation, Merge
**Ziel:** Die Zulieferung ist notiert, der Stand ist gemessen.

* [x] Backlog 3.33 (Impressumsangaben) und 3.34 (Datenschutzerklärung) angelegt,
  beide mit dem Vermerk „muss vor dem Livegang stehen".
* [x] Build mit beiden Wächtern, Prerender 27/27.
* [x] Smoke gegen Produktion nach dem Merge.

**Referenzen:**
`docs/backlog/schleife-1.md`

---

## Kommentare

### Phase 1
**Eingehalten:** Ersatzsatz vor dem Schreiben gegen den ausgelieferten Stand geprüft ✅,
Begründung im Code statt nur im Commit ✅, eigener Commit wie verlangt ✅,
Gegenprobe am Build ✅, kein Mojibake ✅.

**Auffälligkeiten (nach Schwere):**

1. 🔴 **Kritisch (behoben):** Der Footer behauptete auf allen 25 Seiten eine
   Webanalyse, die es nicht gibt. Der Satz stammt aus der Datenschutzerklärung der
   Altseite — und schon dort steht seit 25.05.2018, dass kein Tracking stattfindet.
   Er war also bereits bei der Übernahme falsch und ist seitdem mitgelaufen.
   **Lehre:** Übernommene Rechtstexte sind Aussagen über das eigene System, keine
   Dekoration. Sie müssen gegen das System geprüft werden, nicht gegen die Quelle.
2. 🟠 **Hoch (offen, Zulieferung):** `og:image` und das JSON-LD-`image` aller Seiten
   zeigen auf ein generisches Unsplash-Stockfoto
   (`photo-1619642751034-765dfdf7c58e`). Datenschutzrechtlich harmlos — der Browser
   des Besuchers ruft es nicht ab, es sind reine Metadaten. Aber: Das ist das Bild,
   das Google in Rich Results und jede Plattform beim Teilen anzeigt. Ein
   Leipziger Meisterbetrieb wirbt damit mit einem Stockfoto.
   → Backlog 3.35.
3. 🟡 **Mittel (dokumentiert):** `components/Hero.tsx` enthält ein `<img>` mit
   ebendieser Unsplash-URL, wird aber nirgends importiert — `HomePage` nutzt
   `HeroSection`. Bestätigt den bekannten Verwaisungsbefund. Die Datei bleibt auf
   Wunsch des Users unangetastet.

### Phase 2
**Eingehalten:** nur belegte Daten ✅, Lücken sichtbar leer statt geraten ✅,
E-Mail unmittelbar erreichbar ✅, Route über die zentrale Quelle ✅, unter 700 Zeilen ✅.

**Auffälligkeiten (nach Schwere):**

1. 🟠 **Hoch (Zulieferung):** Die Altseite nennt **zwei** Telefonnummern
   (`0341 - 222 96 20` und `0341 - 261 77 90`), das Projekt führt nur die zweite.
   Nicht entscheidbar ohne André. → Backlog 3.33.
2. 🟠 **Hoch (Zulieferung):** Handwerkskammer, Berufsbezeichnung, Verleihungsstaat
   und die berufsrechtliche Regelung fehlen **auch auf der Altseite**. Übernehmen
   allein löst das nicht. Für einen Betrieb, der auf jeder Seite „Meisterbetrieb"
   schreibt, ist das die auffälligste Lücke. → Backlog 3.33.
3. 🟡 **Mittel (zu prüfen):** §18 Abs. 2 MStV — bei journalistisch-redaktionellen
   Angeboten ist ein Verantwortlicher zu benennen. Ob der Wissensbereich darunter
   fällt, ist eine Rechtsfrage, keine technische. Als Frage im Faktenblatt notiert,
   nicht selbst entschieden.

### Phase 3
**Eingehalten:** kein ungeprüfter Text übernommen ✅, Platzhalter als solcher
erkennbar ✅, `noindex` und aus der Sitemap ✅, Formularverweis nachgezogen ✅.

**Auffälligkeiten (nach Schwere):**

1. 🟠 **Hoch (offen, Zulieferung):** Der Datenschutzhinweis über dem Absenden-Button
   („Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß
   Datenschutzerklärung zu") steht in allen vier Formularvarianten. Er zeigt jetzt
   auf eine Route, aber die Erklärung dahinter ist leer. Solange der Versand
   inaktiv ist (1.17), entsteht kein Schaden — beides muss aber **gemeinsam** scharf
   gestellt werden. → im Backlog bei 3.34 vermerkt.
2. 🟡 **Mittel (gelöst):** `getRoutes()` speist fünf Verbraucher gleichzeitig
   (Sitemap, `vercel.json`, Prerender, `check-faq-html`, `check-deployment`). Eine
   Route, die vorgerendert, aber nicht indexiert werden soll, war bisher nicht
   vorgesehen. Statt die Route an der Sitemap vorbeizuschmuggeln wurde ein
   ausdrückliches Feld `sitemap: false` ergänzt — sichtbar an der Quelle, statt als
   Sonderfall in einem der fünf Skripte.

### Phase 4
**Eingehalten:** jede Angabe gemessen statt angenommen ✅, Fundstellen genannt ✅,
keine Rechtsauslegung ✅ — das Blatt beschreibt Technik und stellt Fragen.

**Auffälligkeiten:** siehe die drei Punkte im Faktenblatt unter „Was mir dabei
aufgefallen ist".

### Phase 5
**Eingehalten:** Backlog fortgeschrieben ✅, Build und beide Wächter grün ✅,
Smoke gegen Produktion ✅.
