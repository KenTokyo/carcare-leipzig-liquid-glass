# Startseite mobil: Karte mittig öffnen, kein weißer Schleier, FAQ überall als ruckelfreies Akkordeon

**Angelegt:** 2026-10-17 · **Branch:** `2026-10-17-mobil-akkordeon-faq` (von `main`, Stand `5021291`)
**Vorgänger:** `docs/mobil-startseite/tasks/2026-10-16-mobil-startseite-tasks.md` (Phasen 1–13, Galaxy A56, iPhone)
**Optimierungsplan:** `2026-10-17-mobil-akkordeon-faq-optimierung-tasks.md` (gleicher Ordner)

**Status:** Phasen 1–6 gepusht (`e945ddb`, 18.10. 00:42). Phase 7 (R30, Abläufe ohne Schleier) und Phase 8 (ruhigere
Bewegung nach Rückmeldung vom Handy) umgesetzt, alle Messwerkzeuge gegen Build 18.10.2026, 01:12:37 grün. Offen:
Sichtabnahme am Telefon.

**Auftrag des Users (gekürzt, 2026-10-17):**
1. „Jedes Mal, wenn ich auf ein Akkordeon klicke, wird es nach unten geöffnet … bei dem Bildschirm auf 60 % Höhe die
   obere Kante und für die untere Kante muss man nach unten scrollen.“ Gewünscht: Die getippte Karte öffnet sich
   **zentriert auf dem Bildschirm**, ohne Nachscrollen. („Das habe ich dir schon mal erzählt.“)
2. „Hinter den nicht aufgeklappten Akkordeonkarten … ein weißer Schleier bzw. ein weißes Rechteck, das bis zur
   Überschrift hin quasi vergeht.“ Soll **komplett raus**, „vor allem bei den Akkordeons bitte immer weg“, auch wenn es
   wegen des Kontrastwächters drin ist.
3. FAQ: Auf der Startseite klappt eine Frage per Tipp auf, auf den Unterseiten stehen alle Antworten offen.
   **Vereinheitlichen wie auf der Startseite**, und „achte darauf, dass es nicht ruckelt“: Auf der Startseite ruckelt
   es beim Öffnen.

**Planungsvalidierung:** Punkt 1 widerspricht Phase 6 der Vorgängerplanung („getippte Karte bleibt stehen“) und ist dort
nicht enthalten. Punkt 2 galt dort als erledigt (Phase 7), die Ursache war aber nur zum Teil gefunden. Punkt 3 steht dort
nur als R27 („FAQ animiert die Höhe … erst angehen, wenn der User dort Ruckeln sieht“). Planung deshalb hier erweitert.

---

## Analyse (gemessen, Build 17.10.2026 23:07:50, 393 × 851, Touch)

Skripte im Scratchpad dieser Sitzung (`ist-zustand.mjs`, `schleier-ablation.mjs`, `faq-messung.mjs`).

| Befund | Messung |
|---|---|
| **Karte geht nach unten auf und endet unter der Knopfleiste** | Tipp auf eine Karte bei 60 % Fensterhöhe (Leistungen Karte 5, Autoaufbereitung Karte 3): offen bei 511 → 851 px. Die feste Leiste (`MobileStickyCTA`) beginnt bei 768 px, also liegen 83 px der Karte darunter. Ursache: Phase 6 vom 16.10. hält die getippte Karte bewusst an ihrer Stelle fest |
| **„Weißes Rechteck“, Ursache 1: Schatten unsichtbarer Fenster** | Seit dem 16.10. hat jede Karte mobil ein 340 px hohes Fenster (`data-akk="fenster"`), eingeklappt um 276 px nach oben verschoben, MIT Schlagschatten. Zehn solcher Kästen stapeln ihre Schatten neben der Kartenspalte: Der Rand neben den Karten wird dunkler, die Spalte selbst bleibt hell und wirkt wie ein helles Rechteck mit harten senkrechten Kanten, das bis 276 px über die oberste eingeklappte Karte reicht, also bis in die Überschrift. **Ablation (Pixel bei x = 28 / 365 / 378, y = 625):** mit Fensterschatten 144 / 176 / 202, ohne 179 / 223 / 224, ohne Karten 179 / 223 / 224. Der Fensterschatten allein erklärt den Unterschied |
| **„Weißes Rechteck“, Ursache 2: Textschutz am Kopf** | `.cc-kopfschutz::before`: Weiß 88 % von der Sektionsoberkante bis 96 px unter den Kopf (Leistungen: Kopf 80–407 px, Schutz bis 503 px, erste Karte ab 455 px). Läuft also 48 px hinter die erste Karte aus |
| **FAQ-Ruckeln: Die getippte Frage springt weg** | Startseite, Frage 1 offen, Tipp auf Frage 3: Die getippte Frage wandert in 300 ms von 446 auf 309 px (−137 px) nach oben, weil sich die offene Antwort darüber gleichzeitig schließt. Der Finger liegt danach auf etwas anderem |
| FAQ-Rechenlast ist NICHT die Ursache | 4× gedrosselt: 16 Layouts in 700 ms, Layout 4 ms, Stil 13 ms, Malen 31 ms gesamt, keine Aufgabe über 16 ms. Rund 1,3 ms Hauptthread je Bild |
| FAQ auf Unterseiten | `PageFAQ` (`components/PageBlocks.tsx`) rendert alle Antworten offen untereinander; 14 Seiten nutzen es, dazu `ServiceLayout` (7 Leistungsseiten). Startseite und Artikelseiten nutzen `FAQSection` |

**Recherche (2026-10-17):**
- `interpolate-size: allow-keywords` (Höhe nach `auto` per CSS) gibt es nur in Chrome/Edge ab 129, nicht in Safari und
  Firefox ([Chrome-Doku](https://developer.chrome.com/docs/css-ui/animate-to-height-auto)). Für iPhones nicht tragfähig.
- Scroll-Verankerung (`overflow-anchor`) ist in Safari lange nicht oder nur uneinheitlich umgesetzt (WebKit-Bug 298514,
  „Enable scroll anchoring“, 09/2025). Wer die Lage einer Frage halten will, darf sich nicht darauf verlassen.
- `grid-template-rows: 0fr → 1fr` ist der verbreitete CSS-Weg zur Höhe ohne Messen per Skript (Layout je Bild, aber
  ohne Skript). Bei der FAQ ist Layout je Bild gemessen billig (siehe oben).
- Mehrere offene Abschnitte statt Auto-Schließen: Empfehlung gängiger Design-Systeme, weil Auto-Schließen Inhalte
  verschiebt und Vergleichen verhindert (u. a. UXcel „Accordion best practices“, Visa Design System).

**Lösungswege verglichen:**
- *Karte mittig:* (a) Karte stehen lassen, danach Seite nachscrollen (zwei Bewegungen nacheinander, langsam) ·
  (b) Scrollziel sofort setzen und den Versatz per FLIP in alle Karten legen (nur Compositor, aber Kopf und Nachbarsektion
  springen) · **(c) gewählt:** Karte wächst wie bisher per Transform, gleichzeitig gleitet die Seite (Lenis, gleiche
  Dauer und Kurve wie die Karte) so, dass die offene Karte mittig im FREIEN Bereich steht (zwischen Navbar und
  Knopfleiste, beide live gemessen). Unterbrechbar durch Finger und neuen Tipp.
- *Schatten:* Schatten am 340-px-Fenster lassen und nur eingeklappt abschalten (Schatten springt) · Schatten am Link
  (ist sofort 340 px hoch, Schatten stünde vor dem Aufgehen über den Nachbarkarten) · **gewählt:** eigene Schattenebene
  `data-akk="schatten"`, folgt dem Fenster per Transform und blendet mit dem Öffnungsgrad ein (Deckkraft, Compositor).
  Eingeklappte Streifen werfen wie vor dem 16.10. keinen Schatten (64 px Höhe, −32 px Ausdehnung).
- *Kopfschutz:* Schleier schwächer (bleibt ein Schleier) · Schrift mit Lichthof (wirkt billig) · **gewählt:** Das Foto
  beginnt mobil erst knapp über der ersten Karte; Kopf steht auf reinem Weiß, also braucht er keinen Schutz. Umgesetzt
  CSS-nativ: Die Sektion wird unter 1024 px ein Raster, das Foto (absolut positioniert) liegt in Zeile 2. Desktop
  unverändert.
- *FAQ:* Framer-Höhe behalten und nur die Lage verankern (Safari ohne Verankerung, Messen per Skript) ·
  `interpolate-size` (nur Chrome) · FLIP mit Transform (alles unter der FAQ, auch Folgesektionen, müsste mitgleiten:
  große Ebenen, Rastern beim Start) · **gewählt:** eine gemeinsame Liste für alle Seiten, jede Frage öffnet für sich
  (nichts darüber schließt, die getippte Frage bleibt stehen), Höhe per `grid-template-rows` als CSS-Übergang, Antwort
  bleibt im HTML. Ragt die Antwort mobil unter die Knopfleiste, gleitet die Seite sanft nach, ohne die Frage oben aus dem
  Bild zu schieben.

---

### ✅ Phase 1 — Schatten nur noch an der offenen Karte (Ursache 1 des „Rechtecks“)
**Ziel:** Keine Schatten unsichtbarer Fenster; die Kartenspalte steht ohne Rechteck vor dem Foto.
* [x] `ExpandingCardAccordion`: Schatten vom Fenster (`max-lg:shadow-…`) an eine eigene Ebene `data-akk="schatten"` (nur
  mobil, vor dem Fenster, gleiche Höhe und Ruhelage wie das Fenster), Deckkraft = Öffnungsgrad.
* [x] `akkordeonMobil.ts`: vierter Teil `schatten` (gleitet mit dem Fenster), `mobilSchatten()` (0 beim Streifen, 1 offen),
  im FLIP Transform UND Deckkraft (beides Compositor).
* [x] **Gemessen (Build 17.10. 23:37:34, gleiche Stelle wie die Ablation, Pixel x/y):**

  | Stelle | vorher normal | vorher ohne Karten | nachher normal | nachher ohne Karten | Gegenprobe (Fensterschatten eingespielt) |
  |---|---|---|---|---|---|
  | 28 / 625 | 144 | 179 | 194 | 199 | 156 |
  | 365 / 625 | 176 | 223 | 232 | 238 | 188 |
  | 378 / 625 | 202 | 224 | 247 | 249 | 225 |
  | 200 / 700 | 170 | 208 | 219 | 219 | 182 |

  Nachher liegt „normal“ höchstens 6 Stufen neben „ohne Karten“ (Rest: Schatten der offenen Karte). Die Werte vorher und
  nachher sind nicht direkt vergleichbar (das Foto beginnt seit Phase 2 an anderer Stelle), der Vergleich gilt je Spalte.
**Referenzen:**
`components/ExpandingCardAccordion.tsx`
`components/akkordeonMobil.ts`

### ✅ Phase 2 — Kein Textschutz am Kopf, Foto mobil erst über den Karten (Ursache 2)
**Ziel:** Kein weißer Schleier hinter oder über den Karten; Kopf ohne Foto, also ohne Schutz lesbar.
* [x] `ServiceGrid`, `AutoDetailingExpertiseSection`: Kopf und Karten in zwei Container, Sektion `max-lg:grid`,
  `PhotoBackdrop` mit `FOTO_UEBER_KARTEN` (`max-lg:row-start-2 max-lg:-top-12 max-lg:rounded-none`): Ein absolut
  positioniertes Kind eines Rasters nimmt seine Rasterfläche als Bezug, ganz ohne Messen per Skript. Autoaufbereitung:
  Abstand `mt-12` vom Akkordeon an den Kopf (`mb-12`), damit er zu Zeile 1 gehört. Desktop unverändert (Blockfluss, die
  Abstände fallen wie vorher durch die Container).
* [x] `PhotoBackdrop` (`stehend`): Auslauf oben 96 → 48 px (nur der Abstand über der ersten Karte), unten 160 → 80 px
  bzw. ab 768 px 112 px (nur der Innenabstand unter der letzten). Verlauf nicht mehr linear (zeigte auf 48 px eine Kante,
  255 → 163 mit Knick), sondern Kosinus (`.cc-auslauf-oben/-unten` in `styles/textschutz.css`).
* [x] `.cc-kopfschutz` aus `styles/textschutz.css` und beiden Sektionen entfernt; Kommentar hält fest, was ein Foto
  hinter dem Kopf wieder bräuchte (schwarzes Foto unter 60 % Schleier: `gray-600` nur 3,8 : 1).
* [x] **Gemessen (Build 23:37:34, 393 × 851, Sektion oben im Fenster):** Leistungen: Kopf bis 455 px, Foto ab 407 px
  (= 48 px über der ersten Karte bei 455), bis zum Sektionsende 1541. Autoaufbereitung: Kopf bis 524, Foto ab 476, erste
  Karte 524. Sektion mobil `display: grid`. Kontrast: siehe Phase 6.
**Referenzen:**
`components/PhotoBackdrop.tsx`
`components/ServiceGrid.tsx`
`styles/textschutz.css`

### ✅ Phase 3 — Getippte Karte öffnet mittig im freien Bereich
**Ziel:** Nach dem Tipp steht die offene Karte ganz und mittig zwischen Navbar und Knopfleiste, ohne Sprung.
* [x] `lib/freierBereich.ts` (neu, 64 Zeilen): `freierBereich()` misst die Leisten mit `data-feste-leiste` bei jedem
  Aufruf (Navbar-Kopf in `Layout.tsx` = oben, `MobileStickyCTA` = unten; ausgeblendete zählen nicht),
  `mittigeOberkante()`, `gleitenUm()` (Lenis, `force`, Kurve per `cubicBezier` aus framer-motion).
* [x] `akkordeonMobil.ts`: Schritt 3 nach Verankerung und FLIP: Die Seite gleitet mit Dauer und Kurve der Karte
  (0,6 s, `[0.22, 1, 0.36, 1]`) so, dass die offene Karte mittig steht. Beide Bewegungen addieren sich; ein Finger auf dem
  Bildschirm bricht das Gleiten ab (Lenis), ein neuer Tipp ersetzt es.
* [x] **Gemessen (Build 23:41:53, 393 × 851, DPR 2,75, CPU 4×, Bahn der getippten Karte je Bild):**

  | Fall | vorher | erstes Bild nach Tipp | Ende (Soll 253–593, freier Bereich 78–768) | schnellster Schritt |
  |---|---|---|---|---|
  | Leistungen, offene Karte oberhalb des Fensters, Tipp Karte 7 | 491 | 435 | 253–593, Abweichung 0 | 48 px |
  | Leistungen, Nutzerfall (Karte 5 bei 60 %) | 491 | 434 | 253–593, 0 | 47 px |
  | Leistungen, offene Karte unterhalb, Tipp Karte 3 oben | 102 | 138 | 253–593, 0 | 30 px |
  | Autoaufbereitung, Karte 3 bei 60 % | 490 | 433 | 253–593, 0 | 47 px |
  | /karriere Stellen, Karte 2 bei 60 % (470 px hoch) | 490 | 417 | 187–657, −1 | 60 px |

  Vorher (Build 23:07:50) im Nutzerfall: Karte offen bei 511–851, 83 px unter der Knopfleiste (ab 768).

  **Weitere Fenster (Build 18.10. 00:11:45, Endstand, ohne Drossel, Nutzerfall Karte 5 bei 60 %):**

  | Fenster | freier Bereich | Karte vorher → nachher | Soll-Oberkante |
  |---|---|---|---|
  | 375 × 548 (iPhone SE in Safari) | 78–465 | 309 → 101–441 | 101 |
  | 360 × 640 (kleines Android) | 78–557 | 364 → 147–487 | 147 |
  | 393 × 659 (iPhone 14 Pro in Safari) | 78–576 | 376 → 157–497 | 157 |
  | 430 × 932 (großes Telefon) | 78–849 | 539 → 293–633 | 293 |
  | 768 × 1024 (Tablet hochkant) | 100–941 | 594 → 350–690 | 351 |

  Überall ganz sichtbar und mittig (höchstens 1 px daneben).
  Schritte im Kopflosen bei rund 15 Bildern/s (4× gedrosselt); auf einem 120-Hz-Gerät entsprechend kleiner.
* [x] **Nur nach einem Tipp gleiten (beim Durchsehen des Diffs gefunden, O8):** Unter 1024 px gibt es auch Geräte mit
  Maus (schmales Desktopfenster, Tablet mit Trackpad); dort öffnen Karten schon beim Darüberfahren. Mit Gleiten liefe
  eine Kette: Seite gleitet, nächste Karte unter dem Zeiger, geht auf, Seite gleitet weiter. Jetzt `oeffnen(idx, { mittig:
  true })` nur im Tipp-Pfad, `messen(ziel, mittig)`, Gleiten nur bei `mittig`. **Beweis am eingespielten Fehler:**
  Gleiten auch beim Darüberfahren → Karte unter dem Zeiger 380 → 238 px, gemeldet; korrigiert 380 → 380 px.
* [x] Bildschirmfotos (Scratchpad `fotos/mitte2-*.png`): offene Karte jeweils mittig, nichts verdeckt. Eine Aufnahme mit
  leerer Kartenfläche 1,6 s nach dem Tipp war Raster-Rückstand des gedrosselten Kopflosen (ohne Drossel pixelgleich nach
  1,6 und 4,1 s, Geometrie in beiden Fällen richtig), siehe Optimierungsplan O6.
**Referenzen:**
`components/akkordeonMobil.ts`
`lib/freierBereich.ts`
`components/MobileStickyCTA.tsx`

### ✅ Phase 4 — FAQ überall als Akkordeon, ruckelfrei
**Ziel:** Startseite, Artikelseiten und alle Unterseiten zeigen dieselbe aufklappbare FAQ; die getippte Frage springt nie.
* [x] `components/FaqListe.tsx` (neu, 157 Zeilen): Frage als Knopf in `h3` (Text per `GanzwortTitel`, ohne
  Silbentrennung), Antwort immer im DOM, geschlossen `inert` + `aria-hidden`, Fragen UNABHÄNGIG (nichts darüber klappt zu),
  erste offen; Zustandswechsel bei anderen Fragen während des Renderns (Schlüssel aus den ids, `PageFAQ` übergibt ohne
  Einträge jedes Mal ein neues `[]`).
* [x] Höhe per `grid-template-rows: 0fr → 1fr` (`styles/faq.css`, per `@import` in `index.css`), Text blendet beim Öffnen
  verzögert ein und beim Schließen sofort aus; Dauer 0,36 s und Kurve inline aus `FaqListe` (eine Quelle).
* [x] Mobil: Endet die Antwort unter der Knopfleiste, gleitet die Seite gleichzeitig nach, höchstens bis die Frage 12 px
  unter der Navbar steht. Dauer nach Weg (`gleitDauer`, 1,14 ms je px, 0,36 bis 0,9 s): feste 0,36 s ergaben bei 463 px
  eine Spitze von 5,2 px/ms, jetzt 3,7.
* [x] `FAQSection` (Startseite, Ratgeber) und `PageFAQ` (14 Seiten + 7 Leistungsseiten über `ServiceLayout`) nutzen die
  Liste; API von `PageFAQ` unverändert, `check-faq` grün (19 Routen, 20 `faqSchema`-Aufrufe).
* [x] `GanzwortTitel`: `huelleAls="span"` (ein `div` im `button` wäre ungültiges HTML).
* [x] **Gemessen (Build 23:48:49, 393 × 851, CPU 4×, Frage 1 offen, Tipp auf Frage 3):**

  | Seite | vorher (Build 23:07:50) | nachher |
  |---|---|---|
  | Startseite | Frage rutscht 446 → 309 px (−137), Frage 1 klappt zu | **470 → 470 px**, Frage 1 bleibt offen, Antwort 469–669 ganz sichtbar |
  | /fahrzeugaufbereitung-leipzig | alle 9 Antworten offen untereinander | Akkordeon, Frage 467 → 465 px (2 px Nachgleiten), ganz sichtbar |
  | Startseite, Frage 4 bei 680 px | – | gleitet 624 → 534 px, Ende 533–756 (Knopfleiste ab 768) |
  | /unfallinstandsetzung-leipzig, Frage 2 bei 700 px | – | gleitet 681 → 511 px, Ende 510–756 |

  Hauptthread je Bild unverändert niedrig (keine Aufgabe über 16 ms). `check-faq-html`: 29/29 Seiten, 242 FAQPage-Texte
  im HTML; Suchindex unverändert 134 Abschnitte, 121 FAQ.
**Referenzen:**
`components/FaqListe.tsx`
`styles/faq.css`
`components/PageBlocks.tsx`

### ✅ Phase 5 — Prüfwerkzeuge
* [x] `npm run akkordeon`: „getippte Karte bleibt stehen“ ersetzt durch SPRUNG (höchstens 6 px/ms zwischen zwei Bildern;
  der Fehler vom 16.10. waren 276 px in einem Bild) und MITTE (Oberkante ±3 px neben der Mitte des freien Bereichs, Karte
  ganz darin); neu SCHATTEN (kein sichtbarer `box-shadow` über die Karte hinaus). Gegenprobe um Fensterschatten und
  abgeschaltetes `window.scrollTo` erweitert.
* [x] **Gefunden dabei (O3):** Der Prüfer zählte jeden rAF-Rückruf als Bild. Seit die Seite beim Tipp mitgleitet, kamen bis
  zu sechs je Bild; die eingespielte Höhen-Animation galt mit 29 Layouts in 29 Bildern als 24 % (Gegenprobe 0 von 3).
  Jetzt bilden Rückrufe ohne Lücke über 2 ms ein Bild. **Gegenprobe danach: 3/3 Höhen-Animationen, 3/3
  Hervorhebungen, 3/3 Fensterschatten, 3/3 abgeschaltete Scrollbewegungen.**
* [x] `npm run faq-mobil` (neu, `scripts/check-faq-mobil.mjs`): alle Routen, je Route mit FAQ Akkordeon-Aufbau, Antworten im
  DOM, Start nur Frage 1, zwei echte Tipps (45 % und 85 % der Fensterhöhe): Nachbarn unverändert, kein Sprung, danach ganz
  im freien Bereich; FAQPage-Markup ohne Akkordeon ist ein Befund. **Ergebnis (Build 23:48:49): 26 Routen mit FAQ, 0
  Befunde. Gegenprobe (Auto-Schließen und abgeschaltetes Nachscrollen getrennt eingespielt): 2/2 und 2/2 gemeldet**; im
  Lauf mit Auto-Schließen rutschte die getippte Frage auf der Startseite wieder 366 → 205 px.
* [x] `npm run akkordeon`, neuer Teil HOVER OHNE GLEITEN: 900 × 800 mit Maus, Zeiger waagerecht auf Karte 5; sie muss
  stehen bleiben und die offene sein. Gegenprobe von Hand (Fehler kurz eingebaut, siehe Phase 3): gemeldet.
* [x] Pflichtfrage beantwortet: Kopf beider Skripte (`check-akkordeon` Punkte 6, 9 und 10, `check-faq-mobil` Punkte 1–6).
**Referenzen:**
`scripts/check-akkordeon.mjs`
`scripts/check-faq-mobil.mjs`

### ✅ Phase 6 — Build, alle Messwerkzeuge, Doku
**Ziel:** Endstand gegen alle Werkzeuge belegt (Regel aus CLAUDE.md: nach jeder Korrektur alle gegen den neuen Build).
* [x] **Endstand = Build 18.10.2026, 00:11:45** (nach der Korrektur O8). `tsc` ohne Fehler, Build grün: 29/29 Routen,
  `check-faq` 19 Routen, `check-faq-html` 29/29 Seiten mit 242 FAQPage-Texten im HTML, Suchindex 134 Abschnitte und
  121 FAQ (unverändert), 0 Gedankenstriche, Nummernräume und Weiterleitungen in Ordnung.
* [x] Messwerkzeuge gegen diesen Build:

  | Werkzeug | Ergebnis |
  |---|---|
  | `npm run kontrast` | 6.301 Textstellen auf 29 Routen, 0 unter AA |
  | `npm run kontrast -- / --sektionen` | 1.026 Stellen (Sektionsköpfe, Ablaufschritte), 0 unter AA |
  | `npm run mobil` | 29 Routen × 3 Fenster, 0 harte Befunde, 257 Hinweise „Schrift unter 12 px“ (wie vor der Änderung) |
  | `npm run cls` | 29 Routen × 4 Fenster, CPU 4×: 0 harte Befunde, 0 Hinweise |
  | `npm run aussparung` | 29 Routen × 3 Fenster ohne dauerhafte Überdeckung, Geometrie an 23 Breiten in Ordnung |
  | `npm run zielgruppen` | alle Karten auf allen Fenstern in Ordnung |
  | `npm run akkordeon` | 0 Befunde: späte Layouts 2/19, 4/30, 2/28 Bilder; 0 Animationen abseits des Compositors; Mitte +0,1 / +0,4 / −0,5 px; 0 Schatten außerhalb; Maus 900 × 800: Karte 380 → 380 px |
  | `npm run akkordeon -- --gegenprobe` | 3/3 Höhen-Animationen, 3/3 Hervorhebungen, 3/3 Fensterschatten, 3/3 abgeschaltete Scrollbewegungen gemeldet |
  | `npm run faq-mobil` | 26 Routen mit FAQ, 0 Befunde |
  | `npm run faq-mobil -- --gegenprobe` | Auto-Schließen 2/2, fehlendes Nachscrollen 2/2 gemeldet |
  | `npm run tote-dateien` | keine (177 von 178 erreichbar, `Jobs.tsx` bewusst geparkt) |
  | `npm run nav` | 16/16 nach Korrektur einer veralteten Erwartung (O9, siehe unten) |
  | `npm run meta` | 0 von 29 Seiten außerhalb der Korridore |

* [x] **Gefunden dabei (O9):** `npm run nav` war schon vor diesem Paket rot: Das Lektorat (L01, 07.10.) benannte „Autoglas /
  Scheibenfolien“ in „Autoglas & Scheibenfolien“ um, die von Hand getippte Erwartung im Prüfer blieb stehen. Der Check läuft
  nicht im Build mit, deshalb fiel es zehn Tage nicht auf. Erwartung nachgezogen, mit Vermerk.
* [x] Desktop gegengeprüft (1440 × 900): Sektionen Blockfluss, Foto deckt die ganze Sektion, Abstand Kopf → Karten 64 px
  (Leistungen) und 48 px (Autoaufbereitung) wie vorher, keine Schattenebenen, FAQ-Fragen 18 px fett wie vorher.
* [x] Kodierung: 22 geänderte oder neue Dateien gültiges UTF-8, kein Mojibake, keine Steuerzeichen (Python/Perl-Scan mit
  Gegenprobe-Datei, die gemeldet wurde).
* [x] `CLAUDE.md` (Messwerkzeuge: `akkordeon` angepasst, `faq-mobil` neu), Vorgängerplanung (O6, O8, R27 nachgetragen),
  Optimierungsplan dieses Pakets, Kommentare.
* [ ] **Sichtabnahme auf dem Galaxy A56 und dem iPhone durch den User** (nach Push auf die Vorschau). Kopfloses Chrome misst
  Geometrie und Hauptthread, nicht das Gefühl der Bewegung auf dem Gerät.
**Referenzen:**
`scripts/check-akkordeon.mjs`
`scripts/check-faq-mobil.mjs`
`scripts/check-navigation.mjs`

### ✅ Phase 7 — R30: kein weißer Verlauf in den gepinnten Abläufen (User, 2026-10-18)
**Auftrag:** „Ja, nimm den weißen Verlauf auch in den zwei Ablauf-Sektionen mobil raus (R30), so wie bei den Karten.“
Betrifft „Unfallschaden? …“ (`AccidentDamageSection`) und „Fahrzeug aufbereiten lassen? …“
(`DetailingProcessSection`), beide `ScrollPinnedProcess` mit `PhotoBackdrop mobil="flaeche"`.
**Ist (Build 18.10. 00:11:45, 393 × 851, Bildschirmfotos `ablauf-vorher-*.png`):** Foto über die ganze gepinnte Bühne,
darüber `.cc-guard-mobil` (Weiß 82 → 78 % bis 62 % der Höhe, dann 50 %, Ausläufe oben und unten, Seitenränder 45 %).
Kopf 191–341 px, Schrittkarte 449–749 px (Unfall); 189–309 und 417–717 (Aufbereitung).
**Lösungswege:** Grid-Platzierung wie bei den Karten (Kopf und Karte stehen in EINEM Flex-Container, der am Desktop
nebeneinander läuft; ein Umbau träfe den Desktop) · Foto per Skript ab der Karte beginnen lassen (ResizeObserver) ·
**gewählt:** am Kopf eine DECKENDE weiße Fläche von der Bühnenoberkante bis zur Karte, die im Abstand davor (2rem) per
Kosinus-Verlauf ausläuft. Optisch dasselbe wie „Foto beginnt über der Karte“, CSS-nativ, Desktop unberührt. Bühne mobil
`overflow-hidden`, damit die Fläche nicht über die Bühne hinausragt. Am Foto der Bühne der gleiche gleichmäßige
Schleier wie bei den Karten (`.cc-guard-mobil-licht`, 60 %), unten Auslauf ins Weiß.
* [x] `ScrollPinnedProcess`: Kopf `cc-ablauf-kopf`, Bühne `max-lg:overflow-hidden` (Branch `2026-10-18-ablauf-schleier`).
* [x] `styles/textschutz.css`: `.cc-ablauf-kopf::before` (mobil, deckend weiß, Kosinus-Auslauf über 2rem bis zur
  Schrittkarte), `.cc-guard-mobil` entfernt (wurde nur hier genutzt).
* [x] `PhotoBackdrop` (`flaeche`): `.cc-guard-mobil-licht` (60 %, wie die Karten) und Auslauf unten (80 px) statt
  `.cc-guard-mobil`.
* [x] **Gemessen (Build 18.10.2026, 00:57:14, 393 × 851, Unfall-Ablauf bei Schritt 1, Pixel bei DPR 2):**

  | Stelle | vorher | nachher |
  |---|---|---|
  | links neben der Überschrift (30 / 200) | 229 231 228 (Foto schimmert durch) | 255 255 255 |
  | mitten in der Überschrift (380 / 300) | 220 222 215 | 255 255 255 |
  | rechts am Kopf (700 / 500) | 248 240 225 | 255 255 255 |
  | links neben dem Fortschritt (30 / 640) | 227 227 229 | 255 255 255 |
  | rechts neben der Schrittkarte (700 / 860) | 217 217 217 | 224 224 224 (Foto unter 60 % Schleier) |

  Lage unverändert (Kopf 191–341, Karte 449–749; Aufbereitung 189–309 und 417–717). Bildschirmfotos
  `ablauf-vorher-*.png` und `ablauf-nachher-*.png` im Scratchpad.
* [x] Desktop (1440 × 900) unberührt: Bühne `overflow: visible`, keine Fläche am Kopf, mobile Ebenen `display: none`.

### ✅ Phase 8 — Aufklappen ruhiger und flüssiger (Rückmeldung vom Handy, 2026-10-18)
**Auftrag:** „Nun wird es sauber angezeigt im Zentrum des Displays, aber der Effekt, wenn es aufklappt, ist viel zu bouncy
und unflüssig. Bitte mach es weniger bouncy, aber dafür flüssiger.“ (Branch `2026-10-18-akkordeon-bewegung`)
**Analyse (gerechnet, Kurve der Karten `[0.22, 1, 0.36, 1]`, 0,6 s, gleich für Aufklappen UND Mitgleiten):**

| Kurve | Start-Tempo | Spitze | 50 % Weg nach | 90 % Weg nach | Weg nach 10 % der Zeit |
|---|---|---|---|---|---|
| bisher `[0.22, 1, 0.36, 1]` | 4,5 × Mittel | 5,7 × bei 1 % | 13 % der Zeit | 37 % | 40 % |
| `ease` `[0.25, 0.1, 0.25, 1]` | 0,45 × | 2,8 × bei 27 % | 29 % | 62 % | 9 % |
| Material Standard `[0.4, 0, 0.2, 1]` | 0,02 × | 2,9 × bei 35 % | 35 % | 63 % | 3 % |

Bisher schnellen Karte und Seite in 60 ms um 40 % los und kriechen dann fast 0,4 s für die letzten 10 %: zwei
gleichzeitige Ruckbewegungen mit langem Auslauf, das liest sich als „Federn“. Dazu wechselt mitten in der Bewegung das
fensterhohe Hintergrundfoto (Dekodieren und Überblenden), auf dem Telefon Last genau in diesen Bildern.
**Lösungswege:** Feder (Framer `spring`) ohne Überschwingen (läuft auf dem Hauptthread, nicht mit der Compositor-Mechanik
vereinbar) · nur Dauer verlängern (Ruck bleibt, nur langsamer) · **gewählt:** gleichmäßige S-Kurve `ease`
(weicher Anfang ohne Ruck, sanftes Ende ohne Kriechen) für Aufklappen und Mitgleiten mobil, 0,65 s, und das
Hintergrundfoto erst NACH der Bewegung wechseln. Desktop unverändert (`KARTEN_UEBERGANG` für `flexGrow`). Die FAQ
bekommt dieselbe Kurve (einheitliche Bewegung).
* [x] `akkordeonMobil.ts`: eigene Bewegung `MOBIL_BEWEGUNG` (0,65 s, `ease` = `[0.25, 0.1, 0.25, 1]`) für FLIP,
  Schattenebene und Mitgleiten; `KARTEN_UEBERGANG` bleibt für den Desktop.
* [x] `ExpandingCardAccordion`: Hintergrundfoto mobil erst nach `MOBIL_BEWEGUNG.dauer` melden (neuer Tipp verwirft den
  alten Wechsel), Bildzoom mobil mit derselben Dauer und Kurve (vorher `ease-out` 0,7 s, Start mit Höchsttempo).
* [x] `FaqListe`: dieselbe Kurve, 0,4 s.
* [x] **Gemessen (Leistungen, Karte 5 bei 60 % getippt, 393 × 851, ohne Drossel, je 3 Läufe, alle gleich):**

  | | vorher (Build 00:57:14) | nachher (Build 01:12:37) |
  |---|---|---|
  | Weg nach 60 ms | 44 % | **10 %** |
  | Weg nach 120 ms | 72 % | **31 %** |
  | Weg nach 300 ms | 97 % | 82 % |
  | schnellstes Bild | 1,41–1,51 px/ms | **0,82–0,84 px/ms** |
  | Karte steht (unter 1 px vom Ziel) | 460 ms, danach Kriechen bis 600 ms | 628 ms, Ende mit der Animation |
  | Hintergrundfoto wechselt | nach 35–37 ms (mitten im Losschnellen) | **nach 664–667 ms** (Bewegung fertig) |

  Endlage unverändert mittig (gleiche Strecke −238 px).
* [x] **Alle Werkzeuge gegen den Endstand (Build 18.10.2026, 01:12:37; enthält Phase 7 und 8):** `kontrast` 6.342 Stellen,
  0 unter AA · `kontrast -- / --sektionen` 1.026 Stellen, 0 unter AA · `mobil` 29 × 3, 0 harte Befunde, 257 Hinweise wie
  zuvor · `cls` 29 × 4, 0 Befunde, 0 Hinweise · `aussparung` in Ordnung · `zielgruppen` in Ordnung · `akkordeon` 0
  Befunde (schnellste Bewegung der getippten Karte 1,5 statt 3,1 px/ms, Mitte +0,1 / +0,4 / −0,5 px, Maus 380 → 380) ·
  Gegenprobe 3/3, 3/3, 3/3, 3/3 · `faq-mobil` 26 Routen, 0 Befunde · Gegenprobe 2/2, 2/2 · `tote-dateien` keine ·
  `nav` 16/16 · `meta` 0/29.
* [ ] **Sichtabnahme am Telefon durch den User** (nach Push): ob die Bewegung jetzt ruhig genug ist, sieht nur das Gerät.

---

## Kommentare

### Phase 1
**Eingehalten:** Ursache per Ablation mit Pixelwerten bewiesen statt vermutet ✅, Compositor-Weg beibehalten (Transform und
Deckkraft, kein Layout je Bild) ✅, Desktop unverändert (Schatten dort weiter am Rahmen) ✅, unter 700 Zeilen
(`ExpandingCardAccordion` 504, `akkordeonMobil` 180) ✅, Gegenprobe ✅.
**Auffälligkeiten (nach Schwere):**
1. 🔴 **Kritisch (behoben, O1):** Meine eigene Technik vom 16.10. (Fenster in voller Höhe) erzeugte das „weiße Rechteck“.
   Die Vorgängerplanung hatte den Schleier als erledigt geführt (Phase 7), weil sie nur den Textschutz als Ursache sah.
   Lehre: Eine Rückmeldung gilt erst als erledigt, wenn die Ablation zeigt, dass nichts anderes mehr beiträgt.

### Phase 2
**Eingehalten:** CSS-nativ (Raster-Platzierung statt Messen per Skript, Projektregel) ✅, Kontrast gerechnet und gemessen ✅,
Desktop unverändert ✅, keine Inhalte entfernt (nur ein Schleier) ✅.
**Auffälligkeiten:**
1. 🟡 **Mittel (behoben, O4):** 48 px linearer Auslauf und runde Ecken zeichneten eine Kastenkante ins Foto.
2. 🟡 **Mittel (offen, R30):** Die gepinnten Abläufe tragen mobil weiter einen weißen Textschutz. Bewusst nicht angefasst
   (kein Akkordeon, dort steht der Kopf über dem Foto), dem User als Entscheidung vorgelegt.

### Phase 3
**Eingehalten:** gemessen in fünf Lagen statt einer ✅, Leisten gemessen statt als Zahl hinterlegt ✅, unterbrechbar
(Finger, neuer Tipp) ✅, Verankerung gegen den Sprung vom 16.10. beibehalten ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟠 **Hoch (behoben, O8):** Erste Fassung glitt auch nach dem Öffnen per Maus (Hover) mittig: auf schmalen Fenstern mit
   Maus eine Kette ohne Zutun. Gefunden beim Durchsehen des Diffs, nicht von einem Werkzeug; jetzt mit eigenem Test.
2. 🟢 **Hinweis (O6):** Der gedrosselte Kopflose zeichnet die geöffnete Karte teils erst nach über 1,6 s; Geometrie
   richtig, ohne Drossel sofort. Nur am Gerät zu beurteilen.

### Phase 4
**Eingehalten:** Ursache des Ruckelns gemessen (Lage der Frage je Bild, Rechenlast) ✅, Recherche zu `interpolate-size`,
Scroll-Verankerung in Safari und Akkordeon-Mustern ✅, Antworten im HTML (SEO-GEO §2.1, `check-faq-html`) ✅, ARIA-APG
(Knopf in `h3`, `aria-controls`, `inert`) ✅, eine Quelle für Dauer und Kurve ✅, `PageFAQ`-API unverändert ✅.
**Auffälligkeiten:**
1. 🟡 **Mittel (behoben, O5):** Nachgleiten mit fester Dauer war bei langen Antworten hastig (5,2 px/ms).
2. 🟢 **Verhaltensänderung, bewusst:** Auch am Desktop klappt beim Öffnen einer Frage keine andere mehr zu (eine Liste für
   alle Größen). Auf den Unterseiten sind die Antworten 2 bis 9 jetzt zu (Wunsch des Users), im HTML aber vollständig.

### Phase 5
**Eingehalten:** Pflichtfrage „Was besteht diese Prüfung, ohne dass die Sache in Ordnung ist?“ für jedes neue Kriterium
beantwortet ✅, Gegenproben für alle neuen Kriterien ✅, Prüferfehler an der Ursache behoben statt Grenze gesenkt ✅.
**Auffälligkeiten:** 1. 🟠 **Hoch (behoben, O3):** `npm run akkordeon` zählte rAF-Rückrufe als Bilder; seit dem Mitgleiten
fiel eine echte Höhen-Animation durch (Gegenprobe 0 von 3).

### Phase 6
**Eingehalten:** alle Werkzeuge gegen EINEN Endstand nach der letzten Korrektur ✅, Build-Zeitpunkt je Ergebnis belegt ✅,
Gegenproben gegen den Endstand ✅, Desktop gegengeprüft ✅, Kodierung geprüft samt Gegenprobe ✅.
**Auffälligkeiten (nach Schwere):**
1. 🟡 **Mittel (behoben, O9):** `npm run nav` war seit dem Lektorat vom 07.10. rot (veraltete, von Hand getippte
   Erwartung „Autoglas / Scheibenfolien“). Kein Fehler der Seite, aber zehn Tage unbemerkt.
2. 🟢 **Niedrig (eigener Ablauf):** Meine Messkette in zsh übergab `kontrast -- / --sektionen` als EIN Argument
   („Missing script“). Die drei Läufe mit Argumenten einzeln nachgeholt, Ergebnisse oben.

**Refactoring-/Folgeplan (nach Gewichtung):** 1. R30 klären (Schleier in den Abläufen, Entscheidung des Users).
2. R25: Mitarbeiterstimmen auf /karriere auf dieselbe Compositor-Technik umstellen (animieren noch die Höhe).
3. R26: Lenis-Schleife nur bei Bewegung laufen lassen. 4. `npm run nav` in den `postbuild` aufnehmen oder zumindest in
die Push-Routine, damit Namensänderungen aus dem Katalog nicht wieder unbemerkt bleiben (O9).
