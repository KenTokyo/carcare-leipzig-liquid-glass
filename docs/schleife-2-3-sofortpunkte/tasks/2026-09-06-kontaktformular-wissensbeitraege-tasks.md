# 2.19, 2.6 und der Anfrage-Dialog

**Angelegt:** 2026-09-06
**Auftrag (User):** Mit 2.19 anfangen. Kontaktformular von der Startseite nehmen und
**vollständig von den Adressdaten entkoppeln**. Der Dialog soll **zuerst** nach dem
Anliegen fragen — Schaden melden, Aufbereitungstermin, Geschäftskunden — und danach ins
jeweilige Formular führen. Geschäftskundenanfragen dürfen ausdrücklich schriftlich kommen.

**Vorab geklärt:** 2.2 (blaue Flächen) betrifft die Aufbereitungs-Subseite und wird mit
**Bildern** gefüllt — kein Farbthema. Als zurückgestellt vermerkt, nichts zu tun.

---

### ✅ Phase 1 — 2.19: die zwei fehlenden Wissensbeiträge
**Ziel:** Zwei der vier „Mehr erfahren"-Ziele existierten nicht. Beide sind
Wissensbeiträge, die geschrieben werden mussten.

* [x] `Was ist Spot Repair?` — `/autoaufbereitung-wissen/spot-repair`
* [x] `Was bedeutet Farbtongenauigkeit beim Lackieren?` — `/autoaufbereitung-wissen/farbtongenauigkeit`
* [x] Beide mit Definition, Eignung, Ablauf, Kostenfaktoren, Tipps, Fehlern und drei FAQ
* [x] In die Kategorie „Smart Repair & kleine Schäden" aufgenommen — sonst tauchen sie
      im Wissens-Hub nicht auf
* [x] Querverlinkt: untereinander, mit `lackaufbereitung` und
      `dellen-ohne-lackieren-entfernen`. Der Dellen-Artikel verweist zurück — keine
      verwaisten Seiten (SEO-GEO §4.4)
* [x] `pages/SmartRepairPage.tsx`: beide Karten haben jetzt ein `href`
* [x] Sitemap und `vercel.json` neu erzeugt — **29 statt 27 Routen**

**Inhaltliche Leitplanke:** Beide Texte beschreiben **Handwerksverfahren**, keine
Aussagen über den Betrieb. Damit fallen sie nicht unter 1.29, wo André liefern muss.
Genannt wird nur, was belegt ist: die Glasurit-Partnerschaft. Keine Preise, keine
Bearbeitungsdauern — beides wäre erfunden.

**Referenzen:**
`data/knowledgeArticles.ts`
`pages/SmartRepairPage.tsx`

---

### ✅ Phase 2 — 2.6: Formular von den Adressdaten entkoppeln
**Ziel:** Formular von der Startseite nehmen, ohne die Kontaktdaten mitzunehmen.

* [x] **Befund vorab:** `ContactSection` lief auf **beiden** Seiten (`/` und `/kontakt`)
      und trug Formular **und** Kontaktblock im selben Bauteil. Ein simples Entfernen
      hätte der Startseite alle Kontaktdaten oberhalb des Footers genommen.
* [x] `components/KontaktDaten.tsx` erzeugt (106 Zeilen) — zwei Einsatzarten:
      `eingebettet` (unter dem Formular auf `/kontakt`) und eigenständig (Startseite,
      mit Überschrift und Handlungsaufruf)
* [x] `ContactSection` nutzt den neuen Baustein, Darstellung auf `/kontakt` unverändert
* [x] `HomePage`: `ContactSection` → `KontaktDaten`
* [x] Geprüft: Startseite hat **kein** `<form>` mehr, aber `#kontakt-daten`;
      `/kontakt` hat Formular, Kontaktblock **und** alle drei Sprungziele

**Referenzen:**
`components/KontaktDaten.tsx`
`components/ContactSection.tsx`
`pages/HomePage.tsx`

---

### ✅ Phase 3 — Dialog fragt zuerst nach dem Anliegen
**Ziel:** Alle drei Wege sichtbar machen, ohne die Absicht des Aufrufs zu verlieren.

* [x] Zustand getrennt: `offen` (Fenster steht) und `art` (`null` = Auswahlschritt)
* [x] `oeffnen()` nimmt die Art jetzt **optional** und startet immer im Auswahlschritt
* [x] Auswahlschritt mit drei Karten; die vom Aufruf nahegelegte ist hervorgehoben und
      trägt „Vorgeschlagen"
* [x] „Zurück" führt vom Formular zur Auswahl, ohne das Fenster zu schließen
* [x] Escape, Fokusfalle und Scroll-Sperre hängen jetzt am Fenster statt an der
      Formularart — sonst hätten sie im Auswahlschritt nicht gegriffen
* [x] **Regression geprüft:** 1.19 (Leistungs-Vorauswahl) und 3.36 (Seitenzuordnung
      plus vorbelegte Schadenart) funktionieren unverändert

**Referenzen:**
`components/AnfrageDialog.tsx`

---

### ✅ Phase 4 — Bauen und prüfen
* [x] Build grün: 29/29 Routen, alle sechs Wächter, Typecheck sauber
* [x] Im Browser durchgespielt: Auswahl → Formular → Zurück → Auswahl
* [x] Mobil bei 375 px gemessen: Panel 369 px breit, 523 px hoch, passt in den Viewport;
      Touch-Ziele 82 px

---

## Kommentare

### Phasen 1–4
**Eingehalten:** Mobile-First (bei 375 px gemessen, nicht geschätzt) ✅,
unter 700 Zeilen je Datei ✅ (`knowledgeArticles.ts` 565, `AnfrageDialog.tsx` 348),
Antwort-zuerst in beiden Artikeln (`introAnswer`) ✅, keine verwaisten Seiten ✅,
erste Person Plural ✅, keine erfundenen Zahlen ✅, Dev-Server nicht gestartet ✅,
Regressionen aktiv gegengeprüft statt angenommen ✅.

**Auffälligkeiten/Findings (nach Schwere):**

1. 🟠 **Hoch: 2.6 war keine Ein-Zeilen-Aufgabe.** Formular und Kontaktblock steckten im
   selben Bauteil, das auf **zwei** Seiten läuft. Wer nur `<ContactSection />` aus der
   Startseite entfernt, nimmt ihr unbemerkt auch Adresse, Öffnungszeiten und Telefon.
   Der Auftrag „entkoppeln" war genau richtig formuliert — ohne ihn wäre das ein
   stiller Inhaltsverlust gewesen.

2. 🟠 **Hoch: Der Auswahlschritt hätte zwei ältere Punkte aushebeln können.** 1.19
   (Leistungs-Vorauswahl) und 3.36 (Reparaturseiten → Schadenformular) hängen daran,
   dass beim Öffnen ein Kontext gesetzt wird. Beide wurden **im Browser nachgemessen**,
   nicht nur gelesen. Sie greifen weiter, weil der Kontext beim Öffnen entsteht und der
   Auswahlschritt ihn nur durchreicht.

3. 🟡 **Mittel: Der „Zurück"-Knopf lag zuerst falsch.** Bei `left-4 top-4` läge er über
   der Kopfzeile des Formulars (Eyebrow-Pille bei `p-6`/`p-10`). Sitzt jetzt rechts
   neben dem Schließen-Knopf, wo die Fläche frei ist.

4. 🟡 **Mittel: „Vorgeschlagen" machte die hervorgehobene Karte auf dem Telefon höher.**
   Gemessen bei 375 px: 94 px statt 81 px, weil das Etikett die Beschreibung in einen
   Umbruch drängte. Ab `sm` sichtbar, darunter tragen Rahmen und Fläche die Aussage.
   Danach alle drei Karten 82 px.

5. 🔵 **Niedrig: Framer-Motion-Animationen laufen im ausgeblendeten Vorschaubereich
   nicht zu Ende.** Die gemessene Deckkraft blieb bei 0,85 stehen, während das Bild
   den Endzustand zeigte. Kein Fehler der Seite, sondern die Bildwiederholung des
   Bereichs. **Merksatz:** Deckkraft und Transformation sind im Vorschaubereich kein
   verlässlicher Messwert — Struktur, Größe und Text schon.

**Kein Optimierungsplan nötig:** 1 und 2 waren Fallen, die vermieden wurden;
3 und 4 sind behoben; 5 ist ein Verfahrenshinweis.
