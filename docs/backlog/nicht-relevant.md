# Ohne Schleifenzuordnung

Quelle: `docs/backlog/quelle/2026-09-06-alle-schleifen.csv`, Block „Nicht relevant",
13 Einträge.

> **Diese Einträge tragen keine Backlog-Nummer.** In der Quelle stehen sie außerhalb
> der drei Schleifen. Sie werden hier trotzdem geführt, weil sieben davon **abgenommene
> Entscheidungen** sind, die den heutigen Code erklären — wer sie nicht kennt, baut sie
> versehentlich zurück.

**Nicht nummerieren.** Eine erfundene Nummer in diesem Namensraum wäre genau der Fehler,
den `offene-punkte-konsolidiert.md` dokumentiert.

---

## Abgenommene Entscheidungen — nicht zurückbauen

| Bereich | Entscheidung | Status | Warum das im Code steht |
|---|---|---|---|
| Aufbereitung | Ablauf-Sektion bleibt (KI-SEO); Schritte Leistung wählen → Termin anfragen → Fahrzeug abgeben → Aufbereitung → gepflegtes Fahrzeug passen | erledigt | Deckt sich mit `CLAUDE.md`, „Ablauf-/Prozess-Sektionen bleiben" |
| Aufbereitung | Texte Leasingrückgabe bleiben unverändert (gefallen sehr gut) | erledigt | Erklärt, warum `LeasingrueckgabePage` bei Paket A nur minimal angefasst wurde |
| Aufbereitung | Expertise-/Über-uns-Block am Seitenende bleibt (SEO-Ranking der Subseite) | erledigt | Steht als Vorgabe in `CLAUDE.md` |
| Unfallinstandsetzung | Zusatzbausteine/Schlagworte bleiben (reine KI-SEO) | erledigt | Sieht wie Füllmaterial aus, ist aber gewollt |
| Serviceseiten | Subseiten bleiben rein informativ – Anfrage nur über zentralen Terminanfrage-Button | erledigt | Begründet die Architektur des Anfrage-Dialogs (1.20) |
| Serviceseiten | Autoglas: Schutzfolien für Lack bleiben drin (Ausführung über Subunternehmer) | erledigt | — |
| Geschäftskunden | Aufbau als Zusammenfassung des Relevantesten bleibt so | erledigt | — |
| Sonstiges | KI-Bild mit „Hammer"-Artefakt bleibt – Nacharbeit lohnt den Aufwand nicht | erledigt | Bekanntes Artefakt, kein Bug |

---

## Offene Punkte ohne Schleifenzuordnung

| Bereich | Aufgabe | Verantw. | Status | Stand im Projekt |
|---|---|---|---|---|
| Offene Frage | Programmname: „Beta Motive" vs. „Data Motive" – korrekte Schreibweise bestätigen | André | Klärung | ✅ *Überholt. `pages/BusinessCustomersPage.tsx:70` hält fest, dass „Data Motive" vom Kunden bestätigt wurde; so ist es ausgeliefert. Die CSV ist an dieser Stelle älter als die Bestätigung.* |
| Bringschuld André | Fotogrundregel: Handyfotos, unbearbeitet, während der Bearbeitung oder kurz vor Ende – keine reinen Ergebnisbilder | André | Prinzip | **Gilt für alle Fotolieferungen** — 3.23–3.29, 2.14, 2.16, 2.20, R7. Bei der Anforderung mitschicken. |
| Über uns | Videografen kontaktieren (Kontakt über Hariege, Leipzig/Dubai) – diese Woche | Oalab | offen | *Voraussetzung für 3.21 (Drohnenvideo) und damit für 3.18 und 3.20. Die längste Durchlaufzeit von allem Offenen.* |
| Sonstiges | Instagram-Beispiele frei durch Deutschland fahrender Autoaufbereiter an André schicken | Oalab | offen | *Reine Zuarbeit, kein Website-Thema.* |
| Sonstiges | Idee zur Prüfung: Aufbereiter mit Kamerabrille, komplette Aufbereitung filmen, 1-Minuten-Video für Social Media | André | Idee | *Idee, keine Aufgabe. Kein Website-Thema.* |

---

## Wichtig für die Planung

**„Videografen kontaktieren" ist der eigentliche Engpass der Videokette.** Ohne
Videograf kein Drohnenvideo (3.21), ohne Drohnenvideo kein Hero-Video (3.20) und keine
Betriebsdarstellung auf der Karriereseite (3.18). Das Kästchen sagt „diese Woche" und
steht in der Liste ganz unten, weil es als „nicht relevant" einsortiert wurde — für die
Terminplanung ist es das Gegenteil.

---

**Verwandte Dateien**
`docs/backlog/README.md` · `docs/backlog/schleife-3.md`
