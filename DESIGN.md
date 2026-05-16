# Design System & Architektur: CarCare Premium Detailing

Dieses Dokument beschreibt das aktuelle Design, die Architektur und die UI/UX-Prinzipien der CarCare Premium Detailing Web-App. Es dient als Referenz für die konsistente Weiterentwicklung des Frontends.

## 1. Übersicht & Ästhetik (Mood)
Das Design der CarCare-Webseite vermittelt eine **Premium-Ästhetik**, die sich durch Klarheit, Eleganz und eine hochwertige Anmutung auszeichnet. 
- **Stil:** Clean, Minimalistisch, Light-Mode-fokussiert (mit Ausnahme des starken, dunklen Hero-Bereichs).
- **Zielgruppe:** Premium-Kunden, Autohäuser, Firmenfuhrparks und anspruchsvolle Privatkunden.
- **Leitprinzipien:** Strukturierte Typografie, großzügiges Spacing (viel Weißraum zur Strukturierung), subtile und flüssige Animationen (Framer Motion) sowie eine professionelle Bildsprache.

---

## 2. Farben (Color Palette)
Die App nutzt vorwiegend eine monochromatische Farbpalette, gepaart mit einer gezielten Akzentfarbe, um den High-End-Charakter zu unterstreichen, ohne unruhig zu wirken.

*   **Primärfarben (Greyscale / Premium):**
    *   `gray-900` (`#111827`) / Schwarz: Haupttextfarbe, markante Überschriften und dunkle Hintergründe/Icons im Hover-Zustand.
    *   `white` (`#ffffff`): Seitenhintergrund für den sauberen Light-Mode-Look.
    *   `gray-50` bis `gray-200`: Für subtile Abgrenzungen, Hintergründe in Karten/Kategorien und feine Rahmen (Borders), um Tiefe zu erzeugen.
*   **Akzentfarben:**
    *   `blue-600`: Wird äußerst sparsam für wichtige Highlights eingesetzt (z.B. "Über Uns"-Label, Hover-Effekte bei Job-Titeln).
    *   **Glassmorphismus:** Weiß- und Schwarz-Transparenzen (z.B. `bg-white/10`, `backdrop-blur-md`) werden verwendet, um Layering abzubilden (vor allem in der Navbar und Floating Cards).

---

## 3. Typografie
Als alleinige Schriftart kommt **Inter** (sans-serif) zum Einsatz. Dies verleiht der Seite einen modernen, hochtechnischen und sehr gut lesbaren Look.

*   **Headings (Überschriften):** Es werden extrem große Schriftgrade verwendet (z.B. `text-6xl` bis `text-9xl` im Hero). Die Schriftschnitte sind meist `font-bold` in Kombination mit verringertem Zeichenabstand (`tracking-tight`), um Kompaktheit und Stärke zu suggerieren.
*   **Labels & Kicker (Eyecatcher):** Oft in sehr kleinen Größen (`text-[10px]` oder `text-xs`), in Versalien (`uppercase`) und mit enormem Zeichenabstand (`tracking-[0.2em]`, `tracking-widest`) gesetzt. Dies ist ein klassisches Premium-Design-Pattern aus Zeitschriften.
*   **Fließtext (Body Text):** Große und lesbare Basis-Größen (`text-md` bis `text-lg`), oft `font-light` oder `font-medium`, mit einer entspannten Zeilenhöhe (`leading-relaxed`), meist in weicherem Grau (`gray-600` bis `gray-400`).

---

## 4. Animationen & Interaktionen
Die App nutzt extensiv **Framer Motion** für ein flüssiges "App-Feeling", wodurch sich die Seite interaktiv und hochwertig anfühlt.

*   **Scroll-Driven Animations (Navbar):** Die Navigationstransformation basiert auf dem `useScroll`-Hook. Sie startet als transparenter Bereich, der die gesamte Bildschirmbreite einnimmt, und verwandelt sich beim Scrollen fließend in eine schwebende ("floating"), schmalere Pille mit Glass-Blur und Schlagschatten. Auch die Schriftfarbe ändert sich beim Übergang.
*   **Reveal Animations:** Nahezu alle Inhalts-Sektionen (About, Services, Jobs) nutzen `whileInView`-Animationen. Inhalte gleiten sanft von unten in das Blickfeld (`initial={{ opacity: 0, y: 20 }}`).
*   **Micro-Interaktionen:** 
    *   Butterweiche Bildskalierung (`scale-110`) beim Hovern über Service-Karten.
    *   Pfeil-Animationen auf Buttons (z.B. Translation nach rechts bei Links oder Rotate bei Telefon-Icons).
    *   Layout-Animationen (`layout`-Prop in Framer Motion) beim Filtern und Aufklappen der detaillierten Service-Karten-Texte.

---

## 5. Komponenten-Architektur im Detail

### 5.1. Hero-Sektion (`Hero.tsx`)
*   **Layout:** Fullscreen (`h-screen`) mit stark verdunkeltem Overlay auf einem Hintergrundbild, um extremen Kontrast zur weißen Typografie herzustellen.
*   **Typografie:** Riesige "PREMIUM CARE"-Hauptschrift mit einem markanten transparenten Text-Gradienten (`from-gray-200 to-gray-500`).
*   **Eye-Catcher:** Eine absolut positionierte "Floating Card" im unteren rechten Bereich (Glassmorphism-Look), die als Call-to-Action für aktuelle Themen dient (z.B. Desinfektion). Ein pulsierender "Scroll Down" Indikator rundet die Experience ab.

### 5.2. Navigation (`Navbar.tsx`)
*   **Struktur:** Dynamisch gestaltete Header-Leiste.
*   **Layout:** Ein durchdachtes 3-Spalten-Grid (`grid-cols-[1fr_auto_1fr]`), wodurch das zentrale Menü immer exakt in der Mitte zentriert bleibt, unabhängig vom Inhalt links (Logo) und rechts (Telefon-Button). 

### 5.3. About-Sektion (`About.tsx`)
*   **Layout:** Asymmetrisches CSS-Grid (5 Spalten links, 7 Spalten rechts).
*   **Besonderheiten:** Eine massive typografische Outline-"01" im Hintergrund (`text-[12rem]`), die visuelle Tiefe schafft. Links steht die fokussierte Hauptansprache, rechts die detaillierten Informationen (Fließtext und Info-Karten).

### 5.4. Services-Sektion (`Services.tsx`)
*   **Navigation / Filter:** Ein pillenförmiges Interface (`rounded-full`) zum Filtern von Kategorien (Alle, Pflege, Reparatur, Spezial).
*   **Karten-Design:** Große Abrundungen (`rounded-[2rem]`), Bild-Container oben, "Bento-Style" Grid-Layout.
*   **Akkordeon-Funktion:** Ein Klick auf "Mehr erfahren" klappt die Karte flüssig nach unten auf (gesteuert über `AnimatePresence`). Dabei nimmt die erweiterte Karte dynamisch eine zweite Zeile im Grid ein (`row-span-2`), was durch CSS Grid und Framer Motion nahtlos animiert wird.

### 5.5. Jobs / Karriere (`Jobs.tsx`)
*   **Layout:** Eine klassische Split-Screen Ansicht.
    *   **Links:** Ein fixierter (sticky) Info-Bereich, der beim Scrollen neben der Liste stehen bleibt (`sticky top-32`).
    *   **Rechts:** Eine vertikale, scrollende Liste der Jobangebote in sauberen Boxen.
*   **Interaktion:** Hover-States auf den Boxen invertieren die minimalistischen Icons im Hintergrund (hell zu dunkel) und zeigen subtile blaue Hervorhebungen in der Typografie an. Tags gliedern die Anforderungen übersichtlich.

### 5.6. Footer (`Footer.tsx`)
*   **Layout:** 4-Spalten-Grid für strukturierte Informationsvermittlung (Brand, Kontakt, Öffnungszeiten, Seitenstruktur).
*   **Visuell:** Ein extrem sauberer und abgesetzter Kontaktblock am Ende der Seite, typografisch klein gehalten (`text-sm` und `text-[10px]`), um nicht vom Gesamtlayout abzulenken, jedoch vollständige rechtliche (Datenschutz, Impressum) und kontaktbezogene Informationen abzubilden.
