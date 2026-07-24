# EU-Förderhinweis im Footer

**Erstellt:** 2026-07-24
**Ziel:** Pflichtangabe „Kofinanziert von der Europäischen Union." inkl. offiziellem
EU-Emblem in der Fußzeile.

---

## Ausgangslage

Anders als die übrigen Aufgaben in diesem Projekt ist das **keine Gestaltungsfrage**,
sondern eine förderrechtliche Pflicht. Die Publizitätsvorgaben für die Förderperiode
2021–2027 schreiben Wortlaut, Emblem-Geometrie, Farben, Schriftart und Platzierung vor.
Bei Nichtbeachtung sind Kürzungen der Förderung möglich.

Deshalb wurde vor der Umsetzung recherchiert statt gestaltet.

### Recherchierte Vorgaben

| Vorgabe | Quelle / Wert |
| --- | --- |
| Wortlaut | „Kofinanziert von der Europäischen Union" — **darf nicht abgekürzt werden** |
| Platzierung | Text steht **neben** dem Emblem und darf es nicht überschneiden |
| Seitenverhältnis Flagge | Breite = 1,5 × Höhe |
| Sternenkreis | Radius = 1/3 der Höhe, Mittelpunkt = Schnittpunkt der Diagonalen |
| Einzelstern | Umkreis-Radius = 1/18 der Höhe, aufrecht (eine Zacke nach oben) |
| Sternanzahl | 12, auf den Stundenpositionen einer Uhr, unveränderlich |
| Farben | Pantone Reflex Blue `#003399` · Pantone Yellow `#FFCC00` |
| Dunkler Untergrund | weißer Rand um das Rechteck, Breite = **1/25 der Höhe** |
| Zulässige Schriften | Arial, Auto, Calibri, Garamond, Tahoma, Trebuchet, Ubuntu |
| Unzulässig | Kursivschrift, Unterstreichungen, Schrifteffekte |

**Quellen:**
`https://commission.europa.eu/system/files/2021-05/eu-emblem-rules_de.pdf`
`https://www.efre.gv.at/fileadmin/user_upload/2021-2027/downloadcenter/Publizitaet/Leitlinie_Verwendung_EU-Emblem_21-27_de_korr.pdf`

---

## Phasen

### ✅ Phase 1 — Emblem als geprüfte Geometrie statt Fundstück
**Ziel:** Ein Emblem, dessen Korrektheit nachweisbar ist.
* [x] `scripts/build-eu-emblem.mjs` erzeugt das SVG aus der amtlichen Beschreibung
* [x] Amtlicher Wortlaut der Beschreibung im Skript hinterlegt, alle Maße daraus abgeleitet
* [x] Innenradius der Zacken = `cos(72°)/cos(36°)` × Außenradius — jedes andere Verhältnis
      ergibt zu spitze oder zu stumpfe Zacken
* [x] Weißer Rand (H/25) fest eingebaut: Der Footer liegt auf einem dunklen Foto, der Rand
      ist dort vorgeschrieben und nicht optional
* [x] `public/assets/eu-emblem.svg`, 2,5 KB, verlustfrei skalierbar
* [x] Visuell gegengeprüft (gerendert und angesehen)

**Warum generiert statt heruntergeladen:** Eine irgendwo gefundene Bilddatei lässt sich
nicht auf Spezifikationstreue prüfen — eine aus der Beschreibung gerechnete Geometrie
schon, und sie bleibt reproduzierbar.

**Referenzen:**
`scripts/build-eu-emblem.mjs`
`public/assets/eu-emblem.svg`

---

### ✅ Phase 2 — Einbau in den Footer
**Ziel:** Sichtbar, konform, ohne den Footer zu stören.
* [x] Eigene Zeile oberhalb der Copyright-Zeile, innerhalb des `legal`-Reveal-Blocks
* [x] Emblem links, Text rechts daneben — keine Überschneidung (belegt: `ueberschneidung: false`)
* [x] Emblem 48 px hoch mobil, 56 px ab `md` — deutlich sichtbar ohne zu dominieren
* [x] `alt="Flagge der Europäischen Union"`, `width`/`height` gesetzt (kein Layout-Shift)
* [x] **Schriftart Arial statt Space Grotesk** — Space Grotesk steht nicht auf der Liste
      der zulässigen Schriften
* [x] Kein `drop-shadow` (an anderen Footer-Stellen vorhanden) — Schrifteffekte sind unzulässig
* [x] `text-white` für maximalen Kontrast auf dem Hintergrundfoto
* [x] `components/Footer.tsx` bei 301 Zeilen (Limit 700)

**Referenzen:**
`components/Footer.tsx`

---

### ✅ Phase 3 — Verifikation
* [x] `npm run typecheck` sauber
* [x] Gemessen im echten Browser, Desktop **und** Mobile:
      Emblem-Verhältnis 1.463 (= 948/648, Flagge 1,5 + Rand), Schrift `Arial, Helvetica, sans-serif`,
      `font-style: normal`, `text-decoration: none`, `text-shadow: none`, keine Überschneidung
* [x] `npm run build` + Prerender: 20/20 Routen
* [x] **20/20 statische Snapshots** enthalten Emblem und Wortlaut — auch Crawler ohne
      JavaScript sehen die Pflichtangabe
* [x] Emblem wird ausgeliefert (`dist/assets/eu-emblem.svg`, 2,5 KB)
* [x] Screenshots: `output/preloader-verify/footer-eu-desktop.png`, `-mobile.png`

**Referenzen:**
`scripts/build-eu-emblem.mjs`

---

## Kommentare

### Phase 1
**Eingehalten:** Vorgaben recherchiert statt angenommen ✅, Geometrie aus der amtlichen Beschreibung abgeleitet ✅, reproduzierbar ✅
**Auffälligkeiten:**
1. 🟡 **Mittel (Werkzeug):** Die amtlichen PDFs ließen sich per WebFetch nicht auslesen (komprimierte Streams). Die Maße wurden deshalb aus mehreren unabhängigen Quellen gegengeprüft, statt sich auf eine zu verlassen.

### Phase 2
**Eingehalten:** Text neben statt über dem Emblem ✅, weißer Rand auf dunklem Grund ✅, zulässige Schrift ✅, keine Schrifteffekte ✅
**Auffälligkeiten:**
1. 🟠 **Hoch (erkannt & berücksichtigt):** Die Projektschrift **Space Grotesk steht nicht auf der Liste der zulässigen Schriften**. Für diese eine Zeile wird deshalb bewusst Arial gesetzt — visuell ein kleiner Bruch, förderrechtlich die sichere Seite. Das ist eine Abwägung, die der Betrieb kennen sollte.
2. 🟡 **Mittel (vermieden):** Der Footer nutzt an mehreren Stellen `drop-shadow`. Für den Hinweistext wurde das bewusst weggelassen — Schrifteffekte sind unzulässig.

### Phase 3
**Eingehalten:** im echten Browser gemessen statt geschätzt ✅, Desktop und Mobile ✅, Snapshots geprüft ✅

---

## Offene Punkte für den Betrieb (nicht technisch lösbar)

1. 🟠 **Programm-/Fondsangabe prüfen:** Je nach Förderprogramm ist zusätzlich der
   **konkrete Fonds** zu nennen (z. B. EFRE, ESF+, JTF) — teils mit eigenem Programmlogo
   des Bundeslandes. Was genau gefordert ist, steht im Zuwendungsbescheid bzw. sagt die
   Bewilligungsbehörde. Der jetzige Stand deckt die Grundanforderung ab.
2. 🟠 **Weitere Publizitätspflichten:** Für geförderte Vorhaben ist oft zusätzlich eine
   **Projektbeschreibung auf der Website** und ein **Poster (mind. A3) am Standort**
   vorgeschrieben. Beides liegt außerhalb dieser Aufgabe.
3. 🟢 **Logo-Hierarchie:** Werden weitere Förderlogos ergänzt, darf das EU-Emblem nicht
   kleiner dargestellt werden als das größte der anderen Logos.
