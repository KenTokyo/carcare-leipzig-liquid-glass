# L19 · Kontakt `/kontakt`

> Auszug `output/lektorat/auszuege/kontakt.md`, rund 250 Wörter: Titelbild, drei Anfragearten, Kontaktformular mit
> drei Reitern (Schaden über reparatur.info, Aufbereitungstermin, Geschäftskunden), Adresse, Öffnungszeiten, Telefon.
> Die Formulartexte selbst sind mit L00 geprüft. Kurz und sauber; keine Korrektur nötig.
>
> **Arten:** S = Vorschlag · H = Hinweis.

## S · Vorschläge (bitte entscheiden)

| Nr | Stelle | Vorher | Vorschlag | Begründung | Quelle |
|---|---|---|---|---|---|
| L19-01 | H1 | Kontakt zum CarCare Center Leipzig | Kontakt zum CarCare Center Leipzig. | 27 von 30 Seiten setzen den Punkt hinter die H1; ohne stehen nur „Impressum“ und „Datenschutzerklärung“, die reine Bezeichnungen sind | `pages/ContactPage.tsx:18` |
| L19-02 | Karten „Drei Wege zur richtigen Anfrage“, Linkzeile | Weiter · Mehr erfahren · Mehr erfahren | Zur Schadenmeldung · Zum Formular · Zum Formular | Die beiden letzten Karten springen zum Formular darunter, „Mehr erfahren“ verspricht eine Erklärseite. Die erste heißt im Formular schon „Zur Schadenmeldung“. Die Karten können eigene Linktexte (`linkLabel`) | `pages/ContactPage.tsx:8–10` |
| L19-03 | Adresse, Routenknöpfe | Route mit Google Maps · Apple Karten | Route mit Google Maps · Route mit Apple Karten | gleich gebaute Knöpfe, gleich gebaute Beschriftung | `components/KontaktDaten.tsx:42` |
| L19-04 | Formular, Einleitung | … rufen Sie uns gerne unter 0341 - 261 77 90 an. | … rufen Sie uns gern unter 0341 - 261 77 90 an. | beides richtig; die Website schreibt sonst siebenmal „gern“ | `components/ContactSection.tsx:57` |

## H · Hinweise (keine Änderung)

| Nr | Stelle | Hinweis |
|---|---|---|
| L19-05 | Formular-Einleitung | Die Telefonnummer im Satz ist kein Anruf-Link. Darunter steht sie als Link (Kachel „Telefon“), dazu „Direkt anrufen“ im Titelbild und die mobile Leiste; so lassen. |
| L19-06 | Auszug | Die Telefonnummer der Kachel „Telefon“ ist ein `tel:`-Link, der Auszug zeigt ihn nur nicht als Link (Link innerhalb eines größeren Blocks). Werkzeugschwäche, für den Text ohne Folgen. |

## Geprüft und ohne Befund

Titel und Beschreibung (58/155 Zeichen), Einleitung, Stichwortleiste, Kartentexte, Reiter, Schadenmeldung mit beiden
Wegen und Hinweis, Adresse, Öffnungszeiten (seit L00 „Mo–Fr: 7–18 Uhr“), Telefon-Kachel, JSON-LD.
