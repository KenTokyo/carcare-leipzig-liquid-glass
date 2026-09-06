# Schleife 2 – Backlog

Quelle: Kundenreview mit André Bosse, geliefert als Gesamtliste am 2026-09-06
(`docs/backlog/quelle/2026-09-06-alle-schleifen.csv`, Block „2. Schleife", 27 Punkte).

> **Diese Datei ist eine Rekonstruktion, kein Original.** Die Quelle trägt keine
> Nummern. Die Zuordnung 2.1–2.27 ist aus der Sortierung der Liste abgeleitet und am
> einzigen bekannten Anker geprüft: **2.26** wird in `schleife-1.md` zitiert als
> „Zulieferung der Zusatzleistungsliste durch André" — und genau das steht hier unter
> 2.26. Die Ableitungsregel ist in
> `docs/backlog/tasks/2026-09-06-schleifen-2-3-import-tasks.md` belegt.

**Aufgabentext ist unverändert aus der Quelle übernommen.** Ergänzungen von uns stehen
kursiv in der Spalte „Stand im Projekt" und sind als solche erkennbar.

Status je Aufgabe laut Kunde: `offen` · `erledigt` · `Klärung` · `terminiert`.

---

## Global (2.1 – 2.3)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.1 | Karten-Styling: transparent statt weiß, Transparenz so justieren dass Lesbarkeit erhalten bleibt – einheitlich über gesamte Seite | Oalab | offen | *Berührt den A11y-Befund aus Paket C: Transparenz über Foto hat dort den AA-Kontrast gerissen. Vor Umsetzung `npm run kontrast` verfügbar machen.* |
| 2.2 | Blaue Platzhalter-Füllung ersetzen | Oalab | offen | *Zu prüfen, welche Flächen gemeint sind — die Token-Reparatur (`e77b3b0`) hat blaue Werte bereits angefasst.* |
| 2.3 | Alle Zeitstrahl- und Prozessdarstellungen einheitlich im Stil „Ablauf in fünf Schritten zum Ziel" (kfz-lindner.de) animieren | Oalab | offen | *Teilweise: `components/Timeline.tsx` existiert seit 2026-09-04 (Zeitstrahl `/ueber-uns`). Die Ablauf-Sektionen der Serviceseiten folgen dem Muster noch nicht.* |

---

## Mainpage (2.4 – 2.8)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.4 | Hero-Text kürzen, weniger Platz einnehmen lassen | Oalab | offen | — |
| 2.5 | Kacheln verlinken künftig auf die jeweilige Detail-Subseite, nicht auf die Paketübersicht | Oalab | offen | *Teilweise durch Paket B erledigt (Kachelrochade, neue Subseiten). Verlinkungsziele einzeln gegenprüfen.* |
| 2.6 | Kontaktformular aus der letzten Sektion komplett entfernen, wandert in den Kontaktbereich | Oalab | offen | *Berührt 1.20: Anfragen laufen jetzt über den Dialog. Kann die Sektion damit ganz entfallen?* |
| 2.7 | Globalen Slogan anpassen: „Premium" bleibt, Fahrzeugpflege geringer gewichten, Unfallinstandsetzung / Karosserie- und Lackierarbeiten aufnehmen, ggf. „alles aus einer Hand" | Oalab | offen | *Blockiert durch 3.36 (Wortlaut noch nicht final).* |
| 2.8 | Angepassten Slogan überall konsistent platzieren | Oalab | offen | *Hängt an 2.7.* |

---

## Aufbereitung (2.9 – 2.15)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.9 | Klarstellen: Paket „Exklusiv" betrifft auch den Innenraum, nicht nur außen | Oalab | offen | *Textarbeit, ohne Zulieferung machbar.* |
| 2.10 | Textlich klarstellen: Brillant-Außenpflege ist Basis/Voraussetzung für Keramikversiegelung – Versiegelung selbst nicht enthalten, kommt hinzu | Oalab | offen | *Textarbeit, ohne Zulieferung machbar.* |
| 2.11 | Zusatzleistungen als optionale, wählbare Zusatzleistungen auf der Subseite aufführen (Fußnote/Hinweis) | Oalab | offen | *Hängt an 2.26 — die Liste fehlt. Struktur steht in `data/zusatzleistungen.ts`.* |
| 2.12 | Prüfen, ob die erklärende Darstellung (Innen-/Außen-/Lackaufbereitung) auch für die Pakete oben übernommen wird | Oalab | offen | — |
| 2.13 | Premium vs. Exklusiv fotografisch schwer trennbar → vorerst ohne Foto, ggf. über Textbausteine lösen | Oalab | offen | — |
| 2.14 | Leasingrückgabe braucht ein eigenes Bild | André | offen | **Dopplung:** *entspricht dem repo-lokal vergebenen „1.28". Als ein Punkt führen.* |
| 2.15 | Innenaufbereitung: KI-Bild ersetzen – kein Transporter, eher exklusives Fahrzeug | Oalab | offen | *Deckt sich mit 3.29 (Bringschuld André). Zusammen anfordern.* |

---

## Unfallinstandsetzung (2.16 – 2.18)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.16 | Hero-Bild ersetzen – wirkt wie Schadensaufnahme, nicht wie Instandsetzung | Oalab / André | offen | *Braucht Motiv von André.* |
| 2.17 | Karte „Karosseriearbeiten" → „Karosserie- und Lackierarbeiten" | Oalab | offen | **Sofort umsetzbar.** *Reine Umbenennung.* |
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | Oalab | offen | *Gleiche Ursache wie der A11y-Befund aus Paket C. Mit 2.1 bündeln.* |

---

## Serviceseiten (2.19)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.19 | „Mehr erfahren"-Verlinkungen: Dellen → Dellenentfernung; Komplettlackierung → Neu- & Reparaturlackierung; Spot Repair → Wissensbeitrag (neu anlegen); Unsichtbare Reparatur → Wissensbeitrag Farbtongenauigkeit | Oalab | offen | **Zwei Ziele existieren noch nicht** — *die Wissensbeiträge „Spot Repair" und „Farbtongenauigkeit" müssen angelegt werden (`data/knowledgeArticles.ts`).* |

---

## Geschäftskunden (2.20 – 2.21)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.20 | Foto Fuhrpark-/Autohausservice (Hänger) einbauen | Oalab | offen | *Braucht Motiv von André.* |
| 2.21 | Mietwagenbild / weiße Mietwagenflotte einarbeiten | Oalab | offen | *Deckt sich mit 3.4 (eigener Mietwagen statt Symbolbild).* |

---

## Formular (2.22 – 2.25)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.22 | Terminanfrage-Button analog kfz-lindner.de: Klick → Pop-up mit Auswahl aus zwei Servicebereichen | Oalab | offen | **Erledigt durch 1.20.** *`components/AnfrageDialog.tsx`, eingehängt über `ANFRAGE_ZIELE`. Deckt inzwischen drei Anfragearten statt zwei.* |
| 2.23 | Unfallinstandsetzung → Weiterleitung zu PDR Cloud / reparatur.info-Link (kein eigenes Formular) | Oalab | offen | ⚠️ **Widerspricht der Umsetzung vom 2026-09-05.** *Gebaut wurde ein eigenes Schadenformular; reparatur.info ist ausdrücklich nur „spätere Option". Zusätzlich blockiert durch 3.34 (wird reparatur.info überhaupt genutzt?). Muss entschieden werden.* |
| 2.24 | Geschäftskunden-Anfragen an André's persönliche Mailadresse, nicht an Info-Adresse | Oalab | offen | *Heute geht alles an eine Adresse (`ANFRAGE_EMPFAENGER`). Braucht eine zweite Variable — mit 3.38 zusammen einrichten.* |
| 2.25 | Geschäftskunden-Formular reduzieren auf: Autohaus, Fuhrpark, Versicherung, Rahmenvertrag, Sonstiges – „laufende Zusammenarbeit" streichen | Oalab | offen | *Optionen stimmen (5 Stück), aber Option 4 heißt `Rahmenvertrag / laufende Zusammenarbeit` (`components/formulare/GeschaeftskundenFelder.tsx:45`) — Begriff zusammengeführt, nicht gestrichen. Wörtlich offen.* |

---

## Bringschuld André (2.26 – 2.27)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.26 | Liste aller Sonder-/Zusatzleistungen Aufbereitung (Keramikversiegelung, Nanoversiegelung, leichte Kratzerentfernung, Steinschläge auslegen, Türkanten verfüllen) per Mail | André | offen | **Blockiert 1.18 und 2.11.** *Zwei anerkannte Platzhalter stehen in `data/zusatzleistungen.ts` und brechen den Build, sobald ihre Anerkennung verrottet.* |
| 2.27 | Liste lokaler Jobbörsen / Arbeitsamt / Recruiting-Portale notieren – für spätere Weiterleitung auf die offizielle Karriereseite | André | offen | *Kein Blocker, reine Zulieferung.* |

---

## Was Schleife 1 hiervon bereits miterledigt hat

| Nr. | Befund |
|---|---|
| **2.22** | vollständig erledigt (Anfrage-Dialog, 1.20) |
| **2.3** | teilweise — Zeitstrahl steht, Ablauf-Sektionen folgen dem Muster noch nicht |
| **2.5** | teilweise — Kachelrochade aus Paket B, Ziele einzeln prüfen |
| **2.25** | strittig — Optionen stimmen, Wortlaut nicht |
| **2.14** | Dopplung mit dem repo-lokalen „1.28" |

## Unauflösbare Fremdverweise

Keine in Schleife 2.

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-1.md` · `docs/backlog/schleife-3.md`
`docs/backlog/offene-punkte-konsolidiert.md`
