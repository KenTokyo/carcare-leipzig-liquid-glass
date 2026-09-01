# To-dos für die nächste Session

**Aufgenommen am 2026-08-04 nach Diktat des Users.** Reihenfolge = Bearbeitungsreihenfolge,
Nummern sind die Referenz für die Absprache („mach 3 und 4").

Stand des Projekts beim Aufschreiben: `main` auf `600f616`, Working Tree sauber,
Build mit `PRERENDER_STRICT=1` auf 21/21 Routen grün.

---

## Aufgabenliste

| # | Aufgabe | Betrifft | Vom User zu klären |
|---|---|---|---|
| 1 | Leistungsseite designtechnisch an die übrigen Subseiten angleichen (Foto-Hintergrund, Aufbau, Rhythmus wie bei Aufbereitung/Unfall) | `pages/ServicesPage.tsx` | Welches Motiv als Hintergrund? |
| 2 | Kartendesign der Startseite auf die Leistungskarten übernehmen | `pages/ServicesPage.tsx`, `components/ExpandingCardAccordion.tsx` | — |
| 3 | Karriere-Seite genauso angleichen (Design + Kartendesign) | `pages/CareerPage.tsx` | Motiv für den Hintergrund |
| 4 | Wissensdatenbank genauso angleichen (Design + Kartendesign) | `pages/KnowledgeHubPage.tsx`, `components/KnowledgeCategoryGrid.tsx` | Motiv für den Hintergrund |
| 5 | Socials oben rechts als Stickynote **und** im globalen Footer einfügen | neue Komponente, `components/Footer.tsx` | Welche Kanäle und die genauen Profil-URLs |
| 6 | „Über uns"-Seite bei Kontakt einfügen | `pages/ContactPage.tsx` bzw. neue Route | Eigene Seite oder Abschnitt? Inhalte/Team/Historie |
| 7 | Cookie-saubere Karte mit korrektem Standort beim Kontaktformular auf der Startseite | `components/ContactSection.tsx` / `RequestForm.tsx` | Kartenanbieter (siehe Hinweis unten) |
| 8 | Karten für Adresse, Öffnungszeiten und Telefon oben rechts, mit Übergangsbild | vermutlich `pages/ContactPage.tsx` | **Auf welcher Seite genau?** „oben rechts" ist noch nicht eindeutig |
| 9 | Motiv „Autohäuser & Fuhrparks" überall durch das echte Trailer-Bild ersetzen | `data/partners.ts`-Umfeld, `components/TargetGroupCards.tsx`, `pages/BusinessCustomersPage.tsx` | Bilddatei liefern |
| 10 | Bilder für den Abschnitt „Einblicke" auf der Aufbereitungsseite heraussuchen und einsetzen | `components/DetailingGallery.tsx` | Echte Fotos liefern (aktuell Platzhalterkacheln) |
| 11 | Wissensseite im Blog-Stil als echte Wissensdatenbank mit Suchfeld | `pages/KnowledgeHubPage.tsx`, `data/knowledgeArticles.ts` | — |
| 12 | Suchbot unten rechts: spricht Kunden aktiv an, fragt nach dem Bedarf, ist mit den Seiteninhalten verknüpft und führt direkt dorthin | neue Komponente | Rein regelbasiert über den vorhandenen Inhalt oder mit KI-Anbindung? |

---

## Hinweise, die beim Umsetzen sofort relevant werden

**Zu 7 (Karte):** „Cookie-sauber" heißt praktisch: Google Maps **nicht** direkt einbetten —
der iframe setzt Cookies und lädt Daten in die USA, bevor irgendeine Einwilligung vorliegt.
Zwei gangbare Wege: eine statische Kartengrafik mit Link auf die Route, oder eine
Klick-zum-Laden-Sperre („Karte laden" mit Hinweistext). Beides greift ineinander mit der
noch fehlenden Datenschutzerklärung — siehe unten.

**Zu 8:** Die Formulierung „oben rechts" ist ohne Seitenbezug nicht eindeutig. Vor dem
Umsetzen kurz abstimmen, sonst baue ich es an der falschen Stelle.

**Zu 12:** Ein Bot, der „direkt dahin führt", braucht einen durchsuchbaren Index der
Seiteninhalte. `data/services.ts` und `data/knowledgeArticles.ts` liefern den bereits
strukturiert — die Verknüpfung ist also machbar, ohne Inhalte doppelt zu pflegen.
Aufgabe 11 (Suchfeld) und 12 (Bot) sollten deshalb dieselbe Suchbasis nutzen.

---

## Bereits vorher offen (nicht Teil des Diktats, aber weiterhin unerledigt)

Damit die Liste oben nicht den Eindruck erweckt, es sei sonst nichts offen:

* **Impressum und Datenschutzerklärung fehlen vollständig** — keine Route, keine Datei;
  `components/Footer.tsx` verlinkt beide auf `href="#"`. Impressumspflicht nach § 5 DDG.
  Blockiert zudem Aufgabe 7, weil eine Karteneinbindung ohne Datenschutzerklärung nicht
  sauber wird. Registerdaten müssen vom Betrieb kommen.
* **EU-Vorhabensbeschreibung** nach Art. 50 VO (EU) 2021/1060 (Emblem ist da, Beschreibung fehlt).
* **Leasingrückgabe** hat weiterhin keine eigene URL, sondern ist ein Abschnitt der
  Aufbereitungsseite; vier Stellen zeigen darauf.
* **Prozesskarten verlinken** — die 10 Karten in `components/ScrollPinnedProcess.tsx`
  (Achtung: zwei tragen bereits einen inneren CTA, verschachtelte Anchors vermeiden).
* **Partnernamen verlinken** und Logo-Freigaben einholen.
* **`og:image`** zeigt weiterhin auf ein Unsplash-Stockfoto.
* **USP-Block** auf sieben Leistungsseiten nahezu wortgleich (Near-Duplicate).

---

## Kommentare
*Wird beim Abarbeiten je Aufgabe ergänzt.*
