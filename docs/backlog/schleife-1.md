# Schleife 1 – Backlog

Quelle: zwei Vor-Ort-Reviews mit André Bosse.
Status je Aufgabe: `offen` → `in Arbeit` → `umgesetzt` → `abgenommen`.

---

## Paket A – Globale Text- und Namenskorrekturen

Querschnittlich, betrifft potenziell jede Datei. Zuerst umsetzen, damit alle
folgenden Pakete auf korrigiertem Stand aufsetzen.

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.1 | Jahreszahl überall korrigieren: „seit 1993" → „seit 1998" (inkl. Fußzeile) | umgesetzt |
| 1.2 | Flächenangabe überall auf „über 3.000 m²" vereinheitlichen | umgesetzt |
| 1.3 | „CarCare" allein nicht mehr verwenden → durchgehend „CarCare Center" oder „wir". Falschschreibweisen (Kcare, KCare, Kare) mit korrigieren | umgesetzt |
| 1.4 | Alle Texte aus der 3. Person in die 1. Person Plural umschreiben – vollständige Umformulierung inkl. Verbform, Possessivpronomen und Satzbau, keine wortweise Ersetzung. Kundenansprache bleibt „Sie" | umgesetzt |

**Hinweis zu 1.3 und 1.4:** kein Suchen-und-Ersetzen.

- Bei 1.3 wird pro Fundstelle entschieden, ob „CarCare Center" oder eine
  Formulierung mit „wir" besser passt.
- Bei 1.4 wird der **gesamte Satz** neu formuliert. Verbform, Possessivpronomen
  und Satzbau müssen mitgezogen werden. Ein ausgetauschtes Subjekt allein
  ergibt grammatikalisch falsche Sätze.
- 1.3 und 1.4 greifen häufig in denselben Satz und werden daher gemeinsam
  bearbeitet, nicht in zwei Durchläufen.
- Die Ansprache des Kunden bleibt beim „Sie". Nur die Eigenperspektive wechselt.

---

## Paket A – abgeschlossen

1.1 bis 1.4 sind umgesetzt und in `main` gemergt (2026-09-02). Offene Folgepunkte
stehen in `docs/textkorrekturen-schleife-1/tasks/2026-09-01-paket-a-optimierung-tasks.md`.
**Direkt nach Paket B** kommt dort Punkt 2 (fehlende React-Typen) — je mehr
Komponenten Paket B erzeugt, desto mehr ungeprüfte Props sammeln sich an.

---

## Paket B – Informationsarchitektur Fahrzeugaufbereitung

Größtes Paket, enthält zwei neue Seiten. Ggf. auf zwei Sessions aufteilen
(B1 = neue Subseiten anlegen, B2 = Mainpage/Bestandsseite anpassen).

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.8 | Neue Subseite „Außenaufbereitung" – inkl. Lackaufbereitung ausführlich + Exklusivleistungen (Keramikversiegelung, Nanoversiegelung, Lackbausteine) | umgesetzt |
| 1.9 | Neue Subseite „Innenaufbereitung" – inkl. Exklusivleistungen (z. B. Alcantara-Lenkrad ausbauen und aufarbeiten, Schaum-/Tornador-Verfahren) | umgesetzt |
| 1.7 | Kachel „Lackaufbereitung" auf der Mainpage entfernen – verbleiben: Innenaufbereitung, Außenaufbereitung, Leasingrückgabe | umgesetzt |
| 1.6 | Kacheltext Aufbereitung: Botschaft erweitern auf Werterhalt und Wohlfühlen im Alltag, nicht nur Verkauf/Leasingrückgabe | umgesetzt |
| 1.10 | Ozonbehandlung / Heißvernebelung weiter nach oben – direkt unter die Aufbereitungspakete mit Preisen | umgesetzt |
| 1.11 | Ozon/Heißvernebelung zusätzlich als optional buchbar bei Innenaufbereitung (v. a. Intensiv-Innenreinigung) hinterlegen | umgesetzt |
| 1.12 | Scheinwerferaufbereitung herausnehmen (rechtlich heikel) | umgesetzt |
| 1.13 | Bild-Rochade: Lackaufbereitungsbild → Außenaufbereitung; bisheriges Außenaufbereitungsbild → Leasingrückgabe | umgesetzt |

**Reihenfolge:** 1.8 und 1.9 zuerst, danach 1.7 (sonst zeigen die Kacheln
zwischenzeitlich ins Leere). — So umgesetzt am 2026-09-02.

**Paket B abgeschlossen** (2026-09-02): 1.6 bis 1.13 umgesetzt, 1.16 mit erledigt.
Neue Seiten `/aussenaufbereitung-leipzig` und `/innenaufbereitung-leipzig`.
Offen bleibt allein die Zulieferung durch André (1.18, 1.28) — die
Exklusivleistungs-Abschnitte stehen strukturell, aber bewusst ohne Text.
Findings: `docs/paket-b-aufbereitung/tasks/2026-09-02-paket-b-optimierung-tasks.md`

---

## Paket C – Serviceseiten-Layout vereinheitlichen

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.14 | Layout durchgehend vereinheitlichen (Hintergrundfoto oben, weich übergehend in Weiß) für: Neu- & Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas & Scheibenfolierung, Leasingrückgabe, Fuhrparkservice | offen |
| 1.15 | Jede Leistung kurz und eigenständig erklären (Ziel: direkte Landung bei Suche „Smart Repair Leipzig") | offen |

**Hinweis:** 1.14 ist ein Fall für eine gemeinsame Layout-Komponente, nicht für
acht einzeln angepasste Seiten. Erst Komponente bauen, dann Seiten migrieren.

---

## Paket D – Karriere, Geschäftskunden, Navigation

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.21 | Karriereseite mit Karten im Website-Stil je Position: Fahrzeug-/Karosseriebauer, Lackierer, Aufbereiter, Mechaniker – keine Drehanimationen | offen |
| 1.22 | Bewerbungsformular: Name, E-Mail, Telefon, Nachricht; Lebenslauf optional, Absenden auch ohne Anhang | offen |
| 1.23 | „Jetzt bewerben"-Banner oben auf der Karriereseite | offen |
| 1.24 | Serviceberater aus den offenen Positionen entfernen | offen |
| 1.25 | Über-uns-Seite ist nirgends verlinkt → in Navigation aufnehmen | offen |
| 1.16 | Geschäftskunden: volldigitale Abwicklung über eigenes Programm namentlich erwähnen | umgesetzt |

**1.16 ist blockiert:** Schreibweise „Data Motive" vs. „Beta Motive" bei André
bestätigen lassen. Alternativ zunächst ohne Produktnamen umsetzen
(„über unser eigenes System") und den Namen später einsetzen.

**1.21/1.24 teilweise blockiert:** Ob Ausbildungsstellen aktuell besetzt werden
sollen, ist offen. Kartenstruktur bauen, Ausbildungskarte nachziehen.

---

## Paket E – Formulare Aufbereitung

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.17 | Aufbereitung → eigenes Formular, Anfrage direkt ins E-Mail-Postfach, auch mit Pop-up | offen |
| 1.18 | Aufbereitungsformular: neben Pflegepaketen auch „gewünschte Zusatzleistungen" auswählbar machen | offen |
| 1.19 | Gewählte Leistung beim Aufruf automatisch vorauswählen | offen |
| 1.20 | Kontaktanfrage als Pop-up, keine Weiterleitung | offen |

**Konflikt beachten:** André hat im Review festgelegt, dass der Formularbau
zuletzt erfolgt, wenn alle Inhalte stehen (Punkt 3.17). Paket E steht in
Schleife 1 – entweder bewusst vorziehen oder ans Ende der Schleife legen.
1.18 hängt zudem an der Zulieferung der Zusatzleistungsliste durch André (2.26).

---

## Ohne Umsetzungsaufwand

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.5 | FAQ-Block pro Subseite bleibt (KI-SEO) – von André geprüft und freigegeben | abgenommen |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite zusammentragen | offen (André) |
| 1.28 | Eigene Bildmotive für Leasingrückgabe und Außenaufbereitung liefern. Aktuell teilen sich beide ein Motiv mit anderen Kacheln (`smart-repair-…`, `fahrzeugaufbereitung-…`), weshalb Dateiname und Einsatzort auseinanderfallen. Mit eigenen Motiven löst sich das von selbst. Passt zur ohnehin offenen Fotolieferung. | offen (André) |
| 1.27 | Zeitleiste auf `/ueber-uns`: Gibt es zwischen der Gründung 1998 und heute weitere Meilensteine, die dort stehen sollen? Aktuell nur zwei Stationen („1998 — Gründung", „Heute"). | offen (André) |
