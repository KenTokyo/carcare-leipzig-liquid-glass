# Übergabe Schleife 1

**Stand:** 2026-09-05
**Quelle der Aufgaben:** zwei Vor-Ort-Reviews mit André Bosse, `docs/backlog/schleife-1.md`
**Stand der Website:** `carcare-center.vercel.app` — **noch nicht öffentlich.**
Unter der Kundendomain `www.carcare-center.de` läuft weiterhin der alte Auftritt.

---

## 1. Was Schleife 1 umgesetzt hat

**25 von 29 Review-Punkten sind umgesetzt.** Die vier verbleibenden hängen an Texten
oder Bildern, die nur André liefern kann.

| Paket | Inhalt | Stand |
|---|---|---|
| **A** | Namensschreibweise, Gründungsjahr 1998, Fläche 3.000 m², durchgehend erste Person Plural | fertig |
| **B** | Informationsarchitektur Fahrzeugaufbereitung: eigene Seiten für Innen- und Außenaufbereitung, Kachelrochade, Ozon/Heißvernebelung neu einsortiert | fertig |
| **C** | `ServiceLayout` — sieben Leistungsseiten auf ein Layout vereinheitlicht; Erklärsektion strukturell vorhanden, Texte offen (1.29) | fertig bis auf Texte |
| **D** | Karriereseite mit Positionskarten, Ausbildungsreihe, Bewerbungsformular, Banner und Stellen-Popup, „Über uns" in der Navigation | fertig |
| **E** | Zusatzleistungen, echter Zeitstrahl, Anfrage-Dialog an allen Aufrufen, Leistungs-Vorauswahl, Formularversand | fertig bis auf Zugangsdaten |
| **Rechtsseiten** | `/impressum` gebaut, `/datenschutz` als Gerüst, falsche Matomo-Aussage entfernt | Angaben offen |

### Dinge, die nicht im Review standen und trotzdem nötig waren

- **Ein echter Barrierefreiheitsfehler** auf vier Leistungsseiten: Text unter dem
  AA-Kontrast, weil ein Verlauf über die Viewportbreite lief. Gemessen, nicht geschätzt.
- **Token-Reparatur:** 48 Fundstellen `text-blue-700`, dazu Graustufen — pro Fundstelle
  getrennt nach Text und Dekoration.
- **Eine unrichtige Datenschutzaussage** stand auf allen 25 Seiten („Webanalyse via
  Matomo"). Es gab nie ein Matomo. Der Satz stammte aus dem alten Auftritt, wo seit 2018
  selbst steht, dass kein Tracking stattfindet.
- **`.env` fehlte in `.gitignore`.** Geprüft: Es war nie eine im Repository, kein
  Schlüssel muss rotiert werden.
- **Vier Build-Wächter** neu oder repariert (siehe Abschnitt 5).

---

## 2. Was bei André liegt

Zehn Punkte, nach Dringlichkeit. Die ersten drei **blockieren den Livegang**.

### 🔴 Vor dem Livegang zwingend

| Nr. | Was | Warum es blockiert |
|---|---|---|
| **3.33** | **Impressumsangaben.** Vier Angaben fehlen: Telefonnummer (die Altseite nennt zwei), Handwerkskammer, gesetzliche Berufsbezeichnung samt Verleihungsstaat, Erklärung zur Verbraucherstreitbeilegung. | § 5 DDG. Die Kammer-Angaben fehlen **auch auf der Altseite** — Übernehmen allein löst es nicht. Wir schreiben auf jeder Seite „Meisterbetrieb". |
| **3.34** | **Datenschutzerklärung.** `/datenschutz` ist ein Gerüst. Das technische Faktenblatt liegt bereit: `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`. | Ohne sie darf die Seite nicht öffentlich sein. Sie muss **zwei** Auftragsverarbeiter nennen: Vercel (Hosting) und Resend (Mailversand), beides US-Unternehmen. |
| **3.38** | **Zugangsdaten für den Formularversand** (drei Umgebungsvariablen in Vercel, Vorlage `.env.example`). | Ohne sie sendet die Website nichts — sie sagt das ehrlich, aber Anfragen kommen nicht an. **Erst nach 3.34 freischalten**, sonst verarbeitet die Seite Daten über einen Dienstleister, der nirgends steht. |

### 🟠 Inhalte, die sichtbare Lücken schließen

| Nr. | Was | Wo es fehlt |
|---|---|---|
| **1.29** | Erklärtexte für sieben Leistungsseiten, je zwei bis drei Absätze „Was ist X?" | Die Sektion steht auf allen sieben Seiten und ist leer. Fachliche Aussage über Verfahren und Machbarkeit. |
| **1.27** | Meilensteine für den Zeitstrahl: Jahr und ein Satz je Station | Drei Platzhalter „Meilenstein 1–3" stehen sichtbar auf `/ueber-uns`. Zwei fertige, aber undatierte Texte liegen als Kandidaten im Code. |
| **1.18** | Liste der Zusatzleistungen fürs Aufbereitungsformular | Zwei Platzhalter im Formular. **Dabei klären:** Was ist Paket, was ist Zusatz — „Lackpflege / Politur" ist beides denkbar. |
| **3.32** | Ausbildung bestätigen: Wird im kommenden Jahrgang ausgebildet? Dazu je Beruf Beginn, Dauer, Voraussetzungen, Übernahmechancen | Die drei Ausbildungsberufe stehen mit Schleier und Initiativ-Aufruf. Das stimmt in jedem Fall — nach einer Zusage ist es ein Wort in den Daten. |
| **1.26** | Benefits und Mitarbeiterstimmen für die Karriereseite | Sektion bewusst leer. Geht gebündelt mit 3.32 raus. |

### 🟡 Bilder

| Nr. | Was |
|---|---|
| **3.35** | Echtes Vorschaubild statt Unsplash-Stockfoto. `og:image` zeigt auf allen Seiten ein Stockfoto — das ist das Bild, das Google in Rich Results und jede Plattform beim Teilen anzeigt. |
| **1.28** | Eigene Motive für Leasingrückgabe und Außenaufbereitung. Beide teilen sich derzeit ein Bild mit anderen Kacheln. |

**Bündelvorschlag:** 1.26 + 3.32 (Karriere) in einer Lieferung, 1.29 (Leistungstexte) in
einer zweiten, 3.35 + 1.28 (Bilder) in einer dritten. Die drei roten Punkte laufen
getrennt und zuerst.

---

## 3. Ein offener Fehler, keine Zulieferung: 3.36

**Fünf Reparaturseiten öffnen das falsche Formular.** Wer dort „… anfragen" klickt,
landet im **Aufbereitungs**formular und bekommt Felder für Pflegepakete und Wunschtermin
statt für Schadenart, Versicherung und Bilder.

Gemessen, nicht geschätzt:

| Seite | Aufruf zeigt heute auf | richtig wäre |
|---|---|---|
| `/dellenentfernung-leipzig` | `#contact-termin` | Schaden, Schadenart „Delle" |
| `/felgenreparatur-leipzig` | `#contact-termin` | Schaden, Schadenart „Felge" |
| `/autoglas-leipzig` | `#contact-termin` | Schaden, Schadenart „Glasschaden" *(existiert)* |
| `/smart-repair-leipzig` | `#contact-termin` | Schaden, Schadenart „Lackschaden" *(existiert)* |
| `/autolackierung-leipzig` | `#contact-termin` | Schaden, Schadenart „Lackschaden" *(existiert)* |
| `/hagelschadenreparatur-leipzig` | `#contact-schaden` | **bereits richtig** |
| `/fuhrparkservice-leipzig` | `#contact-termin` | Geschäftskunden — anderer Fall, B2B |

**Nicht die Beschriftungen sind falsch, sondern das Ziel.** „Dellenentfernung anfragen"
ist genau richtig, es führt nur an die falsche Stelle.

### Drei Wege, und was sie kosten

**A — Reparaturseiten öffnen das Schadenformular, mit vorausgewählter Schadenart.**
Empfohlen. Das Schadenformular fragt bereits genau das Richtige: Fahrzeug, Schadenart,
Versicherung, Bilderupload. Die Mechanik dafür steht seit 1.19 und 1.20 — es braucht
eine Zuordnungstabelle Route → Formularvariante und zwei neue Schadenarten („Delle",
„Felgenschaden"). **Keine der rund 40 Aufruf-Fundstellen wird angefasst.**
Aufwand: klein, eine Sitzung.

**B — Eigenes Reparaturformular als fünfte Variante.**
Nur sinnvoll, wenn Reparaturanfragen andere Felder brauchen als Schadenmeldungen. Nach
dem heutigen Stand tun sie das nicht; das einzige teilweise unpassende Feld ist
„Versicherung vorhanden", und dafür gibt es bereits die Antwort „Noch unklar". Ein
zweites, fast gleiches Formular ist der Anfang des Auseinanderlaufens.
Aufwand: mittel, plus dauerhafte Pflege.

**C — Weiterleitung auf ein externes Reparaturportal.**
⚠️ **Hier fehlt mir eine Information.** In der Aufgabe war von „reparatur.info" die Rede.
Diese Adresse kommt im gesamten Projekt und im gesamten Backlog **nicht vor**, und 3.34
ist die Datenschutzerklärung, die zur Formularführung nichts sagt. Falls es ein solches
Portal gibt, fehlt mir der Name und die Frage, ob dorthin überhaupt verwiesen werden
soll — eine Weiterleitung nach außen gäbe die Anfrage aus der Hand und bräuchte einen
eigenen Abschnitt in der Datenschutzerklärung.

**Empfehlung: A.** Kleinste Änderung, nutzt was schon gebaut ist, behebt genau die
Beschwerde. Auf ein Wort hin sofort umsetzbar.

---

## 4. Reihenfolge für Schleife 2

Begründet, nicht nur nummeriert:

**Zuerst — 3.36 beheben.** Der einzige bekannte Funktionsfehler auf der Seite. Kleine,
abgegrenzte Änderung, braucht nur eine Entscheidung zwischen A und C.

**Dann — die drei roten Punkte parallel bei André anstoßen** (3.33, 3.34, 3.38). Sie
haben die längste Durchlaufzeit, weil ein Dritter beteiligt ist: der
Datenschutzbeauftragte. Je früher sie laufen, desto weniger blockieren sie am Ende.

**Dann — 1.29, die Erklärtexte.** Größter inhaltlicher Hebel: Sieben Seiten haben eine
leere Sektion, die für die Auffindbarkeit gebaut wurde („Was ist Smart Repair?"). Ohne
die Texte trägt Paket C nur die halbe Wirkung.

**Dann — 1.17 scharf stellen**, sobald 3.34 und 3.38 stehen. Erst danach kommen
Formularanfragen tatsächlich an.

**Dann — 3.37, die Anhänge.** Erst wenn der Versand läuft, ist absehbar, wie oft Bilder
wirklich gebraucht werden und welcher Weg sich lohnt.

**Danach die Inhaltslücken** in der Reihenfolge, in der André liefert: Karriere (1.26,
3.32), Zeitstrahl (1.27), Zusatzleistungen (1.18), Bilder (3.35, 1.28).

**Nebenher, wenn Luft ist:**
- `npm run shots` und `npm run kontrast` ins Repository holen. Der Kontrastmesser hat
  gefunden, was drei Sichtprüfungen nicht gefunden haben. Spezifikation liegt in
  `docs/paket-c-serviceseiten/tasks/2026-09-03-paket-c-tasks.md`, §7.1/7.2.
- Fünf verwaiste Komponenten aufräumen (`About`, `AccidentFocus`, `Hero`, `Jobs`,
  `TargetGroups`). **`Hero.tsx` bleibt unangetastet**, ausdrückliche Vorgabe.
  `About.tsx` enthält echten Kundentext, der vor dem Löschen gesichtet werden muss.
- Die Footer-Icons stehen bei Kontrast 1,00:1 auf dunklem Grund. Gestaltungsfrage für
  André, keine technische.

---

## 5. Was jemand wissen muss, der hier weiterarbeitet

### Die Wächter und was sie NICHT prüfen

Der Build hat sechs Prüfungen. Jede beantwortet in ihrem Kopf die Frage *„Was besteht
diese Prüfung, ohne dass die Sache in Ordnung ist?"* — das ist Pflicht für jeden neuen
Wächter, siehe `docs/waechter/2026-09-03-notwendig-aber-nicht-hinreichend.md`.

| Prüfung | Fängt | Fängt nicht |
|---|---|---|
| `check-faq.mjs` | FAQ-Blöcke, die nicht aus der Quelle gespeist sind | — |
| `check-vercel-config.mjs` | Route ergänzt, `npm run vercel-config` vergessen | Route fehlt in **beiden** — dann sind sie einig |
| `check-faq-html.mjs` | fehlende oder leere vorgerenderte Seiten | — |
| `check-dummies.mjs` | Platzhalter über ihr Kennzeichen **und** über den Text | wer umbenennt **und** das Kennzeichen entfernt |
| `prerender.mjs` | bricht auf Vercel ab, wenn Chromium nicht startet | — |
| `npm run smoke` | ausgeliefertes Bundle ≠ eigener Build | — |

**Zum Dummy-Wächter:** Er bricht den Build auf Vercel ab, außer der Platzhalter steht
namentlich in seiner `ANERKANNT`-Liste. Derzeit stehen dort fünf Einträge aus 1.18 und
1.27. **Sobald André liefert, muss der Eintrag mit weg** — ein Eintrag, der auf nichts
mehr passt, ist selbst ein Fehler und bricht den Build. Die Liste kann nicht verrotten.

### Architekturentscheidungen, die man kennen sollte

- **Daten liegen in `data/`, nicht in Komponenten.** `services`, `faqs`, `jobs`,
  `historie`, `zusatzleistungen`, `leistungsauswahl`, `anfrageSchema`, `partners`.
  Ergänzen ist überall ein Dateneintrag, kein Umbau. Der Dummy-Wächter kann diese
  Module laden — aus einer Seitenkomponente ginge das nicht.
- **Der Anfrage-Dialog hängt einmal in `Layout`** und fängt Klicks auf bekannte
  Sprungziele ab (`ANFRAGE_ZIELE`). Das ist Fernwirkung und bewusst so: `#contact-termin`
  steht an rund 40 Stellen. Die Zuordnung ist eine sichtbare Liste, keine Bedingung im Code.
- **Pop-ups brauchen ein Portal.** `.site-main-shell` trägt `transform: translateZ(0)`,
  und ein Transform kapert den Bezugsrahmen für `position: fixed`.
- **Der ehrliche Zustand ist der Ausgangszustand.** Das Formular hält den Absenden-Knopf
  gesperrt, bis die Funktion bestätigt, dass sie senden kann. Kein Deployment kann eine
  Erfolgsmeldung zeigen, hinter der kein Versand steht.

### Drei Fallen, die in dieser Schleife Zeit gekostet haben

1. **Framer Motion überschreibt Tailwinds `transform`.** `-translate-x-1/2` ist wirkungslos,
   sobald Framer eine Skalierung inline schreibt. Zentrieren über negative Ränder.
2. **`initial={{ scale: 0 }}` plus `whileInView` am selben Element funktioniert nicht.**
   Ein auf null skaliertes Element hat keine Fläche — der Beobachter beobachtet es sich
   selbst weg. Beobachtet wird das Elternelement, die Kinder erben über `variants`.
3. **Prüfaufbauten erzeugen falsche Befunde.** Ein aufgeblasener Viewport schließt das
   Scrollen aus, das `whileInView` auslöst. Ein Klick auf gemessene Koordinaten geht ins
   Leere, solange Lenis noch nachscrollt. Zu jedem roten Befund gehört die Gegenfrage:
   *Habe ich den Defekt gemessen oder meinen Aufbau?*

### Sicherheit

- **`.env` war nie im Repository.** Geprüft mit `git log --all -- .env` und über alle je
  hinzugefügten Dateien. Es gibt auch keinen Schlüssel, der rotiert werden müsste — das
  Resend-Konto existiert noch nicht. `.gitignore` deckt `.env` jetzt ab; vorher fing nur
  `*.local` und damit `.env.local`, nicht `.env` selbst.
- **Werte gehören ausschließlich in die Vercel-Projekteinstellungen**, nie in eine Datei
  im Repository. `.env.example` ist die Vorlage und enthält keine Werte.
