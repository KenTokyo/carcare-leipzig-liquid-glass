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
| 1.14 | Layout durchgehend vereinheitlichen (Hintergrundfoto oben, weich übergehend in Weiß) für: Neu- & Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas & Scheibenfolierung, Leasingrückgabe, Fuhrparkservice | umgesetzt |
| 1.15 | Jede Leistung kurz und eigenständig erklären (Ziel: direkte Landung bei Suche „Smart Repair Leipzig") | Struktur umgesetzt, Texte offen (**1.29**) |

**Hinweis:** 1.14 ist ein Fall für eine gemeinsame Layout-Komponente, nicht für
acht einzeln angepasste Seiten. Erst Komponente bauen, dann Seiten migrieren.

**Paket C abgeschlossen** (2026-09-03): `components/ServiceLayout.tsx` trägt das
Gerüst, sieben Seiten sind migriert. Leasingrückgabe hatte `BackdropLayout` bereits
und bleibt außen vor — sie weicht mit sechs Sektionen bewusst vom Muster ab.

Bei 1.15 steht die Struktur: Die Erklärsektion ist fester Bestandteil der Komponente
und sitzt vor der Fachsektion. Das Feld `erklaerung` ist ein **Pflichtfeld**, steht
aber auf allen sieben Seiten auf `null` — „Text steht noch aus", nicht „wird nicht
gebraucht". Ein Vergessen wäre ein Typfehler beim Build. Bewusst kein Platzhaltertext:
erfundener Text sieht im Review wie fertiger Text aus und geht so live. Die Texte
liefert André, siehe 1.29.

Findings: `docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`

---

## Paket D – Karriere, Geschäftskunden, Navigation

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.21 | Karriereseite mit Karten im Website-Stil je Position: Fahrzeug-/Karosseriebauer, Lackierer, Aufbereiter, Mechaniker – keine Drehanimationen | umgesetzt |
| 1.22 | Bewerbungsformular: Name, E-Mail, Telefon, Nachricht; Lebenslauf optional, Absenden auch ohne Anhang | Formular steht, **Versand offen (1.17)** |
| 1.23 | „Jetzt bewerben"-Banner oben auf der Karriereseite | umgesetzt, zzgl. abschaltbarem Stellen-Pop-up |
| 1.24 | Serviceberater aus den offenen Positionen entfernen | umgesetzt (als Status „nicht suchend") |
| 1.25 | Über-uns-Seite ist nirgends verlinkt → in Navigation aufnehmen | umgesetzt |
| 1.16 | Geschäftskunden: volldigitale Abwicklung über eigenes Programm namentlich erwähnen | umgesetzt |

**1.16 ist blockiert:** Schreibweise „Data Motive" vs. „Beta Motive" bei André
bestätigen lassen. Alternativ zunächst ohne Produktnamen umsetzen
(„über unser eigenes System") und den Namen später einsetzen.

**1.21/1.24 teilweise blockiert:** Ob Ausbildungsstellen aktuell besetzt werden
sollen, ist offen. Kartenstruktur bauen, Ausbildungskarte nachziehen.

**Paket D umgesetzt** (2026-09-03), bis auf zwei benannte Reste:

- **1.24 wurde umgedreht.** Der Serviceberater ist nicht entfernt, sondern hat den
  Status „nicht suchend" (`data/jobs.ts`). Berufsbild und Ausschreibungsstand sind
  damit getrennt: `JobPosting`-Markup entsteht nur aus offenen Stellen, die Karte
  bleibt sichtbar. Ein Wechsel ist ein Wort in den Daten statt sieben Stellen im Code.
  `/karriere` ging dadurch von 9 auf 8 JSON-LD-Blöcke.
- **1.22 wartet auf 1.17.** Das Formular steht vollständig, der Absenden-Knopf ist
  inaktiv und nennt Telefon und E-Mail. Grund: `handleSubmit` versendet bis heute
  nichts. Bei einer Bewerbung ist eine falsche Empfangsbestätigung nicht vertretbar.
  Schalter: `VERSAND_AKTIV` in `components/RequestForm.tsx`.
- **Ausbildungskarte** weiterhin offen — sie entsteht mit einem Eintrag in
  `data/jobs.ts`, sobald André zusagt.

Findings: `docs/paket-d-karriere/tasks/2026-09-03-paket-d-tasks.md`

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

## Paket F – Rechtsseiten

Nicht aus dem Kundenreview, sondern ein Befund aus der Paket-D-Session: Die
Footer-Links „Impressum“ und „Datenschutz“ standen auf `href="#"`, es gab weder
Route noch Seite noch Inhalt – in Produktion antworteten beide Pfade mit HTTP 404.

| Aufgabe | Status |
|---|---|
| Falsche Datenschutzaussage im Footer entfernt („Webanalyse via Matomo“ – es gab nie ein Matomo) | erledigt |
| `/impressum` gebaut aus den belegten Angaben der Altseite, E-Mail im Klartext statt JavaScript-verborgen | erledigt |
| `/datenschutz` als Gerüst angelegt, `noindex`, nicht in der Sitemap | erledigt |
| Beide Footer-Links und der Datenschutzverweis im Formular zeigen auf die neuen Routen | erledigt |
| Wächter `check-vercel-config.mjs`: bricht den Build, wenn `vercel.json` nicht mehr zur Routenliste passt | erledigt |
| Technisches Faktenblatt für Andrés Datenschutzbeauftragten | erledigt |
| **Impressumsangaben vervollständigen** | offen (André), **3.33** |
| **Datenschutzerklärung** | offen (André), **3.34** |

**⚠️ Vor dem Livegang zwingend:** 3.33 und 3.34. Beides ist Zulieferung, beides ist
ohne André nicht entscheidbar, und beides muss stehen, bevor die Seite unter der
Kundendomain erreichbar ist. Solange nur die Vercel-Adresse läuft, ist es eine
Aufgabe; mit dem Livegang wird es eine Pflicht.

**Der alte Datenschutztext von 2020 wird bewusst nicht übernommen und nicht
verlinkt.** Er beschreibt einen anderen Hoster, nennt Matomo als eingesetztes
Analysewerkzeug und kennt die vier Formulare dieser Seite nicht. Ihn zu verlinken
wiederholte genau den Fehler, den der Matomo-Satz gemacht hat: einen fremden Text
als Aussage über das eigene System auszugeben.

Findings: `docs/rechtsseiten/tasks/2026-09-04-rechtsseiten-tasks.md`
Faktenblatt: `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`

---

## Ohne Umsetzungsaufwand

| Nr. | Aufgabe | Status |
|---|---|---|
| 1.5 | FAQ-Block pro Subseite bleibt (KI-SEO) – von André geprüft und freigegeben | abgenommen |
| 1.26 | Benefits + Mitarbeiterstimmen für die Karriereseite zusammentragen | offen (André) |
| 1.28 | Eigene Bildmotive für Leasingrückgabe und Außenaufbereitung liefern. Aktuell teilen sich beide ein Motiv mit anderen Kacheln (`smart-repair-…`, `fahrzeugaufbereitung-…`), weshalb Dateiname und Einsatzort auseinanderfallen. Mit eigenen Motiven löst sich das von selbst. Passt zur ohnehin offenen Fotolieferung. | offen (André) |
| 1.27 | Zeitleiste auf `/ueber-uns`: Gibt es zwischen der Gründung 1998 und heute weitere Meilensteine, die dort stehen sollen? Aktuell nur zwei Stationen („1998 — Gründung", „Heute"). | offen (André) |
| 3.32 | **Ausbildung bestätigen und Eckdaten liefern.** Die drei Ausbildungsberufe (Fahrzeuglackierer/in, Karosserie- und Fahrzeugbaumechaniker/in, Industriekaufmann/-frau) stehen auf `/karriere` als eigene Reihe, alle auf Status „nicht suchend" — sie erscheinen also mit Schleier und Initiativ-Aufruf. **Zu bestätigen:** Wird im kommenden Jahrgang ausgebildet? **Zu liefern, je Beruf:** Ausbildungsbeginn, Dauer, schulische Voraussetzungen, Übernahmechancen. Ohne diese Angaben bleiben die Karten fachlich dünn; erfundene Eckdaten zu einer Ausbildung liest jemand als Zusage. Geht gebündelt mit 1.26 raus. | offen (André) |
| 1.29 | **Erklärtexte für die sieben Leistungsseiten** (Grundlage für 1.15). Je Leistung zwei bis drei Absätze, die die Frage „Was ist X?" beantworten: was das Verfahren ist, wann es infrage kommt, wo seine Grenzen liegen. Das ist fachliche Aussage über Machbarkeit und Verfahren — nichts, was sich ohne André formulieren lässt, ohne dass er es hinterher korrigiert. Betrifft: Neu- & Reparaturlackierung, Smart Repair, Dellenentfernung, Hagelschadenreparatur, Felgenreparatur, Autoglas & Scheibenfolierung, Fuhrparkservice. Die Sektion steht bereits, sie ist leer. | offen (André) |
| 3.33 | **Impressumsangaben vervollständigen.** `/impressum` steht mit allen Angaben, die auf der Altseite belegt sind (Firma, Anschrift, Geschäftsführung, Amtsgericht Leipzig HRB 23667, USt-IdNr. DE 257 851 313, Telefax, Haftungshinweis). **Vier Angaben fehlen und sind bewusst leer geblieben statt geraten:** (1) **Telefonnummer** – die Altseite nennt zwei nebeneinander (`0341 - 222 96 20` und `0341 - 261 77 90`), das Projekt führt nur die zweite; welche gilt? (2) **Handwerkskammer, gesetzliche Berufsbezeichnung, Staat der Verleihung und berufsrechtliche Regelung** – nach § 5 Abs. 1 Nr. 5 DDG bei zulassungspflichtigen Handwerken erforderlich, fehlt **auch auf der Altseite**, Übernehmen allein löst es also nicht; wir schreiben auf jeder Seite „Meisterbetrieb“. (3) **Verbraucherstreitbeilegung nach § 36 VSBG** – Teilnahme ja oder nein, beide Antworten zulässig, aber eine muss dastehen. (4) Zu prüfen: ob der Wissensbereich ein Angebot nach § 18 Abs. 2 MStV ist und ein Verantwortlicher zu benennen wäre. **Muss vor dem Livegang stehen.** | offen (André) |
| 3.34 | **Datenschutzerklärung.** `/datenschutz` existiert als Gerüst mit verantwortlicher Stelle und Themenübersicht, `noindex` und nicht in der Sitemap. Der Text von 2020 wird **nicht** übernommen und **nicht** verlinkt – er beschreibt einen anderen Hoster, nennt Matomo und kennt die vier Formulare nicht. Das technische Faktenblatt für den Datenschutzbeauftragten liegt bereit: `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`. **Zu klären sind im Kern zwei Dinge:** Vercel als Auftragsverarbeiter (US-Unternehmen, Auslieferung aus Frankfurt, AVV und Unterauftragsverarbeiter) und der künftige Weg der Formulardaten. **Achtung Kopplung:** Derzeit überträgt kein Formular etwas – es gibt im ganzen Projekt keinen Netzwerkaufruf. Die Erklärung beschreibt also den Zustand **nach 1.17**, und beides muss gemeinsam scharf gestellt werden. **Muss vor dem Livegang stehen.** | offen (André) |
| 3.35 | **Echtes Vorschaubild statt Stockfoto.** `og:image` und das `image` der strukturierten Daten zeigen auf allen Seiten auf ein generisches Unsplash-Foto (`photo-1619642751034-765dfdf7c58e`). Datenschutzrechtlich harmlos – der Browser des Besuchers ruft es nicht ab, es sind reine Metadaten. Aber es ist das Bild, das Google in Rich Results und jede Plattform beim Teilen eines Links anzeigt: ein Leipziger Meisterbetrieb wirbt dort mit einem Stockfoto. Braucht ein eigenes Motiv, passt zur ohnehin offenen Fotolieferung (1.28). | offen (André) |
