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
| 2.2 | Blaue Platzhalter-Füllung ersetzen | Oalab | ⏸️ **zurückgestellt** | *Geklärt am 2026-09-06: Die blauen Flächen stehen **auf der Aufbereitungs-Subseite** und werden **mit Bildern gefüllt**. Damit ist es kein Farb-, sondern ein Bildthema und gehört zur offenen Fotolieferung (2.13–2.16, 3.23–3.29). **Bis zur Bildlieferung nichts tun.*** |
| 2.3 | Alle Zeitstrahl- und Prozessdarstellungen einheitlich im Stil „Ablauf in fünf Schritten zum Ziel" (kfz-lindner.de) animieren | Oalab | offen | *Teilweise: `components/Timeline.tsx` existiert seit 2026-09-04 (Zeitstrahl `/ueber-uns`). Die Ablauf-Sektionen der Serviceseiten folgen dem Muster noch nicht.* |

---

## Mainpage (2.4 – 2.8)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.4 | Hero-Text kürzen, weniger Platz einnehmen lassen | Oalab | ✅ **erledigt** | *H1 von 75 auf 53 Zeichen, Subline von 165 auf 128. Zugleich neu gewichtet: Die H1 führt jetzt mit „Unfallinstandsetzung, Karosserie und Lack" statt mit der Aufbereitung — das folgt der Richtung aus 2.7 und bedient die suchstärksten Begriffe des Gewerks. Die Frage „…? Wir kümmern uns." ist raus; die Subline trägt stattdessen 1998, 3.000 m² und „alles aus einer Hand". 2026-09-06* |
| 2.5 | Kacheln verlinken künftig auf die jeweilige Detail-Subseite, nicht auf die Paketübersicht | Oalab | ✅ **erledigt (geprüft)** | *Gegengeprüft 2026-09-06: Alle 13 Ziele in `data/services.ts` zeigen auf Detailseiten. Die zwei Hub-Ziele (`/fahrzeugaufbereitung-leipzig`, `/geschaeftskunden`) sind eigene Einstiegsseiten, keine Paketübersicht. Kam mit Paket B.* |
| 2.6 | Kontaktformular aus der letzten Sektion komplett entfernen, wandert in den Kontaktbereich | Oalab | ✅ **erledigt** | *Formular von der Startseite entfernt. **Vom Kontaktblock entkoppelt statt mit ihm gelöscht:** Adresse, Öffnungszeiten und Telefon lagen nur im selben Block und stehen jetzt als `components/KontaktDaten.tsx` eigenständig — sonst hätte die Startseite keine Kontaktdaten oberhalb des Footers mehr. Das vollständige Formular bleibt auf `/kontakt`. 2026-09-06* |
| 2.7 | Globalen Slogan anpassen: „Premium" bleibt, Fahrzeugpflege geringer gewichten, Unfallinstandsetzung / Karosserie- und Lackierarbeiten aufnehmen, ggf. „alles aus einer Hand" | Oalab | offen | *Blockiert durch 3.36 (Wortlaut noch nicht final).* |
| 2.8 | Angepassten Slogan überall konsistent platzieren | Oalab | offen | *Hängt an 2.7.* |

---

## Aufbereitung (2.9 – 2.15)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.9 | Klarstellen: Paket „Exklusiv" betrifft auch den Innenraum, nicht nur außen | Oalab | ✅ **erledigt** | *`data/detailing.ts`: „Aufbereitung von außen und innen …" plus Schlusssatz „Der Innenraum wird dabei ebenso behandelt wie der Lack." **Auch die maschinenlesbare Fassung** (`priceOffers` → `Offer`-Schema) nachgezogen, sonst widerspräche das Schema dem sichtbaren Text. 2026-09-06* |
| 2.10 | Textlich klarstellen: Brillant-Außenpflege ist Basis/Voraussetzung für Keramikversiegelung – Versiegelung selbst nicht enthalten, kommt hinzu | Oalab | ✅ **erledigt** | *`data/detailing.ts`: zwei Sätze ergänzt, die **Lackversiegelung** (im Paket enthalten) und **Keramikversiegelung** (kommt hinzu) auseinanderhalten — die Verwechslung war im alten Text angelegt. 2026-09-06* |
| 2.11 | Zusatzleistungen als optionale, wählbare Zusatzleistungen auf der Subseite aufführen (Fußnote/Hinweis) | Oalab | offen | *Hängt an 2.26 — die Liste fehlt. Struktur steht in `data/zusatzleistungen.ts`.* |
| 2.12 | Prüfen, ob die erklärende Darstellung (Innen-/Außen-/Lackaufbereitung) auch für die Pakete oben übernommen wird | Oalab | ✅ **beantwortet und umgesetzt** | *Geprüft: Die Darstellung besteht aus Foto + Erklärung + Link auf eine eigene Subseite. **Das Foto ist durch 2.13 bereits ausgeschlossen** (Premium/Exklusiv fotografisch nicht trennbar), und eigene Paket-Subseiten wären Thin Content. Übertragbar war der **Textteil** — die Orientierungshilfe „welches Paket passt" steht jetzt über den Preisen, Wortlaut aus der bereits abgenommenen FAQ. 2026-09-06* |
| 2.13 | Premium vs. Exklusiv fotografisch schwer trennbar → vorerst ohne Foto, ggf. über Textbausteine lösen | Oalab | offen | — |
| 2.14 | Leasingrückgabe braucht ein eigenes Bild | André | offen | **Dopplung:** *entspricht dem repo-lokal vergebenen „1.28". Als ein Punkt führen.* |
| 2.15 | Innenaufbereitung: KI-Bild ersetzen – kein Transporter, eher exklusives Fahrzeug | Oalab | offen | *Deckt sich mit 3.29 (Bringschuld André). Zusammen anfordern.* |

---

## Unfallinstandsetzung (2.16 – 2.18)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.16 | Hero-Bild ersetzen – wirkt wie Schadensaufnahme, nicht wie Instandsetzung | Oalab / André | offen | *Braucht Motiv von André.* |
| 2.17 | Karte „Karosseriearbeiten" → „Karosserie- und Lackierarbeiten" | Oalab | ✅ **erledigt** | *Karte auf `/unfallinstandsetzung-leipzig` umbenannt und die Beschreibung um die Lackierarbeiten ergänzt. **Nicht global ersetzt:** Von 8 Fundstellen nannten 6 die Lackierung bereits daneben — dort wäre die Umbenennung eine Dopplung. Mitgezogen wurden `data/services.ts` (nannte Lack nicht) und `components/AccidentFocus.tsx`. 2026-09-06* |
| 2.18 | Sektion „Schadenaufnahme": Transparenz reduzieren (bei viel Text unübersichtlich) | Oalab | offen | *Gleiche Ursache wie der A11y-Befund aus Paket C. Mit 2.1 bündeln.* |

---

## Serviceseiten (2.19)

| Nr. | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| 2.19 | „Mehr erfahren"-Verlinkungen: Dellen → Dellenentfernung; Komplettlackierung → Neu- & Reparaturlackierung; Spot Repair → Wissensbeitrag (neu anlegen); Unsichtbare Reparatur → Wissensbeitrag Farbtongenauigkeit | Oalab | ✅ **erledigt** | *Alle vier Ziele stehen. Die zwei fehlenden Wissensbeiträge sind am 2026-09-06 **neu geschrieben** worden: „Was ist Spot Repair?" und „Was bedeutet Farbtongenauigkeit beim Lackieren?" — je mit Definition, Ablauf, Kostenfaktoren, Fehlern und drei FAQ. Beide sind im Wissens-Hub gelistet und untereinander sowie mit `lackaufbereitung` und `dellen-ohne-lackieren-entfernen` verlinkt, also nicht verwaist. Das Projekt hat jetzt **29 statt 27 Routen**.* |

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
| 2.22 | Terminanfrage-Button analog kfz-lindner.de: Klick → Pop-up mit Auswahl aus zwei Servicebereichen | Oalab | ✅ **erledigt** | **Erledigt durch 1.20.** *`components/AnfrageDialog.tsx`, eingehängt über `ANFRAGE_ZIELE`. Deckt inzwischen drei Anfragearten statt zwei.* |
| 2.23 | Unfallinstandsetzung → Weiterleitung zu PDR Cloud / reparatur.info-Link (kein eigenes Formular) | Oalab | **zurückgestellt** | ✅ **Entschieden — bleibt vorerst so.** *Gebaut wurde bewusst ein eigenes Schadenformular statt der Weiterleitung; reparatur.info bleibt „spätere Option". Die Abweichung ist eine Entscheidung von Oalab, kein Versehen, und wird **im Nachgang** angepasst. **Nicht "aufräumen".** Hängt zusätzlich an 3.34 (wird reparatur.info überhaupt genutzt?).* |
| 2.24 | Geschäftskunden-Anfragen an André's persönliche Mailadresse, nicht an Info-Adresse | Oalab | ✅ **gebaut** | *`ANFRAGE_EMPFAENGER_BUSINESS` in `api/anfrage.ts`. **Optional mit Rückfall:** Fehlt die Variable, geht alles wie bisher an `ANFRAGE_EMPFAENGER` — ein fehlender Eintrag darf nicht dazu führen, dass gar nichts ankommt. Adresse eintragen zusammen mit R10. 2026-09-06* |
| 2.25 | Geschäftskunden-Formular reduzieren auf: Autohaus, Fuhrpark, Versicherung, Rahmenvertrag, Sonstiges – „laufende Zusammenarbeit" streichen | Oalab | ✅ **erledigt** | *Die fünf Optionen stimmen. Option 4 heißt `Rahmenvertrag / laufende Zusammenarbeit` — **das Zusammenführen ist am 2026-09-06 von Oalab ausdrücklich bestätigt worden.** Der Begriff sollte nicht als eigene Option stehen, aber als Bestandteil der Rahmenvertrags-Option erhalten bleiben. **Nicht „aufräumen".** Keine Codeänderung nötig.* |

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
| **2.23** | bewusst abgewichen — Entscheidung von Oalab, wird im Nachgang angepasst |
| **2.22** | vollständig erledigt (Anfrage-Dialog, 1.20) — Statusspalte am 2026-09-06 nachgezogen |
| **2.5** | erledigt, am 2026-09-06 gegen `data/services.ts` gegengeprüft |
| **2.25** | war strittig, am 2026-09-06 entschieden: Zusammenführen ist gewollt |

## Am 2026-09-06 erledigt

**2.4** · **2.5** · **2.6** · **2.9** · **2.10** · **2.12** · **2.17** · **2.19** · **2.22** · **2.24** · **2.25** — elf Punkte.

Verbleibend ohne Zulieferung machbar: **2.4** (Hero-Text kürzen — gemessen H1 75 Z.,
Absatz 165 Z., eher ein Blick-Urteil), **2.12** (Prüfauftrag),
**2.24** (zweite Empfängeradresse, scharf erst mit 3.38).

### Nachgezogen aus 2.6: Der Dialog fragt jetzt zuerst nach dem Anliegen

Weil das Formular von der Startseite verschwunden ist, ist der Anfrage-Dialog der
einzige Weg zu einer schriftlichen Anfrage. Öffnete er direkt das Formular des
angeklickten Aufrufs, erführe niemand, dass es die anderen beiden Wege gibt — **vor
allem die Geschäftskundenanfrage, die ausdrücklich auch schriftlich kommen darf.**

Der Dialog zeigt deshalb als **ersten Schritt** die drei Anliegen (Schaden melden ·
Aufbereitungstermin · Geschäftskunden) und führt danach ins jeweilige Formular.
Die Absicht des Aufrufs geht nicht verloren: Die passende Karte ist hervorgehoben und
mit „Vorgeschlagen" beschriftet. Ein „Zurück" führt vom Formular zur Auswahl.

**Geprüft, dass nichts kaputtgegangen ist:** Die Leistungs-Vorauswahl aus **1.19**
greift weiterhin (von `/innenaufbereitung-leipzig` aus steht „Innenaufbereitung" im
Formular), und die Seitenzuordnung aus **3.36** ebenso (von
`/dellenentfernung-leipzig` ist „Schaden melden" vorgeschlagen und die Schadenart
„Delle / Beule" vorbelegt).
| **2.14** | Dopplung mit dem repo-lokalen „1.28" |

## Unauflösbare Fremdverweise

Keine in Schleife 2.

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-1.md` · `docs/backlog/schleife-3.md`
`docs/backlog/offene-punkte-konsolidiert.md`
