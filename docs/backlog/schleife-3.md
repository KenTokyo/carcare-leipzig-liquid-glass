# Schleife 3 – Backlog

Quelle: Kundenreview mit André Bosse, geliefert als Gesamtliste am 2026-09-06
(`docs/backlog/quelle/2026-09-06-alle-schleifen.csv`, Block „3. Schleife", 37 Punkte).

> **Diese Datei ist eine Rekonstruktion, kein Original.** Die Quelle trägt keine
> Nummern. Die Zuordnung 3.1–3.37 ist aus der Sortierung der Liste abgeleitet und am
> einzigen bekannten Anker geprüft: **3.17** wird in `schleife-1.md` zitiert als
> „der Formularbau erfolgt zuletzt" — und genau das steht hier unter 3.17.
> Die Ableitungsregel ist in
> `docs/backlog/tasks/2026-09-06-schleifen-2-3-import-tasks.md` belegt.

> ⚠️ **Nummernkollision.** Die Nummern **3.32 bis 3.40** wurden im Repository ein
> zweites Mal vergeben, für eigene Befunde. **3.33 und 3.34 bedeuten dort etwas
> völlig anderes als hier** — und ausgerechnet unter diesen beiden Nummern sind die
> Livegang-Blocker an André kommuniziert worden. Gegenüberstellung und Auflösung:
> `docs/backlog/offene-punkte-konsolidiert.md`

**Aufgabentext ist unverändert aus der Quelle übernommen.** Ergänzungen von uns stehen
kursiv in der Spalte „Stand im Projekt".

Status je Aufgabe laut Kunde: `offen` · `erledigt` · `Klärung` · `Prinzip` · `vereinbart` · `Recherche`.

---

## Global (3.1 – 3.3)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.1 | Scroll-/Sticky-Effekt (5 Kacheln): Verhalten ist gewollt, aber Ablauf flüssiger machen – auch auf Tablet und Handy testen | Oalab | offen | *Deckt sich mit dem offenen Punkt „visueller Nachweis des gepinnten Zustands wurde nie erbracht". `components/ScrollPinnedProcess.tsx`.* |
| 3.2 | Grundsatz: jeder technische Begriff wird perspektivisch mit Wissensbeitrag unterfüttert; nicht unterfütterbare Inhalte auf Nutzen prüfen | Oalab | Prinzip | *Steht bereits als Vorgabe in `CLAUDE.md`, Abschnitt „Inhaltliche SEO-Vorgaben des Kunden".* |
| 3.3 | Wissensdatenbank wird nach Deploy sukzessive gefüllt, kein Livegang-Blocker | Oalab | vereinbart | *Entscheidung, keine Aufgabe. Entlastet den Livegang.* |

---

## Mainpage (3.4 – 3.5)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.4 | Bild 5 (Ersatzwagen nach Verfügbarkeit) durch Foto eines eigenen Mietwagens ersetzen (nice to have) | Oalab / André | offen | *Deckt sich mit 2.21. Braucht Motiv.* |
| 3.5 | Optionalen „Jetzt bewerben"-Banner schaltbar machen | Oalab | offen | *Halb erledigt: `STELLEN_POPUP_AKTIV` (`data/jobs.ts:206`) schaltet das **Popup**. `components/JobBanner.tsx` hat keinen Schalter — es blendet sich nur aus, wenn keine Stelle offen ist. Schalter fehlt.* |

---

## Aufbereitung (3.6)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.6 | Parallax-Bereich: keine „dreckig/sauber"-Vergleiche, sondern Endbilder bzw. Bilder kurz vor Fertigstellung / während der Arbeit | Oalab | offen | *Passt zur Fotogrundregel im Block „ohne Schleifenzuordnung": Handyfotos während der Bearbeitung, keine reinen Ergebnisbilder.* |

---

## Unfallinstandsetzung (3.7 – 3.9)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.7 | Text „Alle Marken" ändern in: „Als markenunabhängiger Meisterbetrieb bearbeiten wir alle Fabrikate unter Verwendung von ausschließlich Originalersatzteilen." | Oalab | offen | **Sofort umsetzbar** — *der Ersatztext ist vom Kunden fertig formuliert und freigegeben.* |
| 3.8 | Sektion „Schadenaufnahme": Hintergrundbild ändern, ruhigeres Motiv im Stil der Aufbereitungsseite | Oalab | offen | *Zusammen mit 2.18 (gleiche Sektion, Transparenz).* |
| 3.9 | Prüfen, ob der obere Block auf jeder Serviceseite wiederholt werden muss oder einmal auf der Subseite reicht | Oalab | Recherche | *Berührt `ServiceLayout` aus Paket C — dort ist der Block heute fester Bestandteil aller sieben Seiten.* |

---

## Serviceseiten (3.10 – 3.15)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.10 | Smart-Repair-Foto ersetzen – zeigt Kratzerentfernung/Aufbereitung, nicht Smart Repair | Oalab | offen | *Motiv kommt über 3.25.* |
| 3.11 | Dellenentfernung: sauberes Bild hinterlegen | Oalab | offen | *Motiv kommt über 3.24.* |
| 3.12 | Hagelschadenreparatur: BVAT-Logo einbinden + kurzer Hinweis zur Mitgliedschaft | Oalab | offen | *Braucht Logo-Datei und Bestätigung der Mitgliedschaft. Gleiche Freigabefrage wie 3.31.* |
| 3.13 | Autoglas: Angaben PKW/LKW-Neuverglasung inhaltlich prüfen | Oalab / André | offen | *Hängt mit 3.30 zusammen (Vintech-Klärung).* |
| 3.14 | Caravan-Segment nicht bewerben (nur vereinzelt für Bestandskunden) | – | erledigt | *Entscheidung, keine Aufgabe.* |
| 3.15 | Leasingrückgabe: Text bleibt; Seite wird von Fuhrpark/Autohaus und Privat angesteuert | – | erledigt | *Bestätigt die Sonderrolle der Seite: sie ist bewusst nicht auf `ServiceLayout` migriert.* |

---

## Geschäftskunden (3.16)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.16 | Partner nach Freigabe direkt verlinken („geschenkte Leads") | Oalab | wartet auf „Nr. 78" | ⚠️ *„Nr. 78" ist eine Nummer aus der globalen Durchnummerierung der Originalliste und **nicht rekonstruierbar** (die CSV ist umsortiert). Inhaltlich naheliegend gemeint: **3.31** (Freigaben Partner-Logos). Als Lesart gekennzeichnet, nicht als Fakt.* |

---

## Formular (3.17)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.17 | Formularbau zum Schluss, nachdem alle Inhalte stehen | Oalab | terminiert | ⚠️ **Bewusst abgewichen.** *Paket E hat die Formulare in Schleife 1 gebaut. Der Konflikt ist in `schleife-1.md` benannt und war dort schon bekannt.* |

---

## Karriere (3.18 – 3.19)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.18 | Nicht nur Benefits zeigen, sondern den Betrieb (Drohnen-/Rundgangvideo zentral) | Oalab | offen | *Hängt an 3.21 (Video existiert nicht).* |
| 3.19 | Mitarbeiterstimmen anonymisiert – nur Berufsbezeichnung + kurzer Kommentar, keine Namen | Oalab | offen | **Präzisiert 1.26.** *Wichtige Vorgabe: keine Namen. Bei der Zulieferung mitgeben.* |

---

## Über uns (3.20 – 3.21)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.20 | Statisches Hero-Foto durch Video ersetzen, das beim Scrollen im Hintergrund weiterläuft | Oalab | offen | *Hängt an 3.21. Performance beachten: LCP-Budget aus `SEO-GEO-STANDARDS.md` §2.2.* |
| 3.21 | Drohnen-/Betriebsvideo: Anflug, Vogelperspektive, langsamer Durchflug durch alle Bereiche im aktiven Betrieb – kein Mitarbeiterporträt | Oalab / André | offen | *Größte offene Produktion. Videograf-Kontakt steht im Block „ohne Schleifenzuordnung".* |

---

## Sonstiges (3.22)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 3.22 | Wissensdatenbank-Seite bleibt vorerst Platzhalter, wird komplett neu gestaltet | Oalab | offen | *Zusammen mit 3.3 zu lesen: kein Livegang-Blocker.* |

---

## Bringschuld André – Fotos und Freigaben (3.23 – 3.31)

Neun Zulieferungen. **Als ein Paket anfordern**, nicht einzeln.

| Nr. | Aufgabe | Verantw. | Status |
|---|---|---|---|
| 3.23 | Fotopaket Aufbereitung: Versiegelung, Felgenreinigung, Politur, Keramikapplikation während der Arbeit (Termin Dienstag) | André | offen |
| 3.24 | Foto: Delle, während sie entfernt wird | André | offen |
| 3.25 | Foto: Smart Repair, echte Nahaufnahme | André | offen |
| 3.26 | Foto: Neu-/Reparaturlackierung – Stoßstange beim Schleifen, angeschliffenes Teil oder Lackierkabine | André | offen |
| 3.27 | Foto: Hagelschaden (Archiv oder anstehendes Fahrzeug) | André | offen |
| 3.28 | Foto: Felge in Reparatur / beim Lackieren (vorhanden nur beschädigte Felgen) | André | offen |
| 3.29 | Bilder Innenaufbereitung: exklusives Fahrzeug, kein Transporter | André | offen |
| 3.30 | Klärung Vintech – ob und wie der Autoglaspartner genannt werden darf; Inhalte Autoglas-Subseite zuliefern | André | offen |
| 3.31 | Freigaben Partner-Logos (Autohäuser, Versicherungen, Agenturen) für Logo-Nutzung und Verlinkung einholen | André | offen |

*Ergänzung: 3.23–3.29 bedienen direkt 3.10, 3.11, 2.15 und 2.16. Die Fotogrundregel
(Handyfotos, unbearbeitet, während der Bearbeitung) steht im Block ohne
Schleifenzuordnung. **3.31 blockiert 3.16** — ohne Freigabe dürfen die Logos nicht stehen.*

---

## Offene Fragen – blockieren Umsetzung (3.32 – 3.37)

Alle sechs sind Entscheidungen, die nur der Kunde treffen kann.

| Nr. | Frage | Verantw. | Status | Was daran hängt |
|---|---|---|---|---|
| 3.32 | Ausbildungsstellen: widersprüchlich – erst „nein", dann „haben wir aktuell auch schon". Vor Umsetzung der Karrierekarten klären | André | Klärung | *Die drei Ausbildungsberufe stehen auf `/karriere` mit Schleier und Initiativ-Aufruf. Nach einer Zusage ist es ein Wort in `data/jobs.ts`.* |
| 3.33 | Bilder-Upload im Formular: Entscheidung „raus" steht, André sieht aber Nutzen zur Ersteinschätzung → finales Go, alternativ über reparatur.info kommunizieren | André | Klärung | *Die Upload-Felder sind am 2026-09-05 entfernt worden; an ihre Stelle trat eine Vorgangsnummer mit vorbereitetem E-Mail-Weg. **Diese Frage entscheidet, ob das so bleibt.*** |
| 3.34 | reparatur.info / PDR Cloud: Wird aktiv genutzt? Falls nein, kippt die Logik aus „Nr. 66 und 103" | André | Klärung | ⚠️ *„Nr. 66/103" nicht rekonstruierbar. Inhaltlich hängen daran sicher **2.23** (Weiterleitung statt eigenem Formular) und **3.33**. Als Lesart gekennzeichnet.* |
| 3.35 | Preisdarstellung Zusatzleistungen: „nicht bepreisen" vs. „Ab-Preise wären aus Kundensicht wünschenswert" – final entscheiden | André | Klärung | *Betrifft 2.26 und 2.11 — die Liste kommt mit oder ohne Preise.* |
| 3.36 | Slogan-Wortlaut: Richtung klar, exakte Formulierung noch offen | Oalab / André | Klärung | **Blockiert 2.7 und 2.8.** |
| 3.37 | „Bildtechnisch noch was ändern" (Teil 1) – unklar, ob Bildgrößen/-formate oder Darstellung gemeint waren | André | Klärung | *Rückfrage nötig — der Satz ist im Protokoll unvollständig.* |

---

## Was Schleife 1 hiervon bereits miterledigt hat

| Nr. | Befund |
|---|---|
| **3.2** | als Prinzip in `CLAUDE.md` verankert |
| **3.5** | halb — Popup schaltbar, Banner nicht |
| **3.15** | bestätigt: Leasingrückgabe bleibt außerhalb von `ServiceLayout` |
| **3.17** | bewusst abgewichen — Formulare wurden vorgezogen |
| **3.31** | im konsolidierten Backlog bereits als Punkt „Partnerlogos" geführt |

## Sofort umsetzbar, ohne jede Zulieferung

**3.7** (Ersatztext liegt fertig vor) · **3.5** (Schalter ergänzen) · **3.9** (Recherche)

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-1.md` · `docs/backlog/schleife-2.md`
`docs/backlog/offene-punkte-konsolidiert.md`
