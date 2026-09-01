# CLAUDE.md

> Führende Regel- und Konfigurationsdatei für Claude Code in diesem Projekt.
> Ersetzt die frühere `AGENTS.md` (diese verweist jetzt nur noch hierher).

## Verbindliche Standards

Für alle SEO-/GEO-/Meta-/Content-Aufgaben gilt verbindlich:
@SEO-GEO-STANDARDS.md

Design/Verhalten gemäß:
@DESIGN.md

## Arbeitsweise & Workflow

Phasenweises Vorgehen und Stopp-Punkte gemäß:
@phasenweise-oder-stopps-implementieren.md

## Code- & UI-Regeln

- **Mobile-First** entwickeln.
- **Maximal 700 Zeilen pro Datei.**

## Dev-Server

- **NIEMALS automatisch `npm run dev` oder `pnpm dev` starten.**
- Der Dev-Server läuft oft bereits im Hintergrund.
- Automatisches Starten verursacht Port-Konflikte (`EADDRINUSE`).

## Kunde

CarCare Center, Leipzig. Kfz-Meisterbetrieb mit Lackierhandwerk.
Zwei Hauptgeschäftsbereiche: **Fahrzeugaufbereitung** und **Unfallinstandsetzung**.
Ansprechpartner beim Kunden: André Bosse.

## Verbindliche Textregeln

Gelten für alle Seiten, auch für neu erstellte. Ergänzend zu @SEO-GEO-STANDARDS.md.

1. **Namensschreibweise:** „CarCare Center", ohne Bindestrich.
   „CarCare" darf nicht allein stehen – entweder „CarCare Center" oder „wir".
   Falsch und zu ersetzen: „Kcare", „KCare", „K-Care", „Kare", „KKR".
2. **Ansprache:** Alle Texte stehen in der ersten Person Plural. Sätze in der
   dritten Person werden **umformuliert, nicht wortweise ersetzt** – das
   betrifft Verbform, Possessivpronomen und ggf. den Satzbau.
   Falsch: „CarCare Center kümmert sich um Ihr Fahrzeug."
   Falsch: „Wir kümmert sich um Ihr Fahrzeug." (reine Ersetzung)
   Richtig: „Wir kümmern uns um Ihr Fahrzeug."
   Ebenso: „In seinem Betrieb …" → „In unserem Betrieb …",
   „Das Unternehmen bietet …" → „Wir bieten …".
   Die Kundenansprache bleibt beim „Sie".
   Ausnahme 1 – Firmenname: Wo er aus SEO-Gründen bewusst stehen soll
   (Hero, strukturierte Daten), bleibt er erhalten. Faustregel für den
   Fließtext: **Der Name darf stehen, aber nie als Subjekt eines Verbs in
   der dritten Person.** „Warum CarCare Center Leipzig" ist richtig,
   „CarCare Center kümmert sich" ist falsch.
   Ausnahme 2 – strukturierte Daten: In JSON-LD-Beschreibungen
   (`description` in `seo/structuredData.ts` und `seo/pageSchemas.ts`, z. B.
   `AutoRepair` und `aboutPageSchema`) bleibt auch die **dritte Person**
   erhalten. Das sind Maschinen-Metadaten über die Entität, nicht die
   Selbstbeschreibung im Fließtext; dort ist die dritte Person die
   konventionelle Form. Sichtbarer Seitentext fällt nicht darunter.
   Entschieden am 2026-09-02, nicht neu aufmachen.
3. **Gründungsjahr:** „seit 1998". Nicht 1993, nicht 1996.
4. **Betriebsfläche:** „über 3.000 m²" bzw. „über 3.000 Quadratmeter".
5. **Meisterbetrieb:** Der Begriff bleibt auch im Aufbereitungsbereich erhalten
   (SEO-relevant), obwohl Aufbereitung kein Meisterhandwerk ist.

## Inhaltliche SEO-Vorgaben des Kunden

Vom Kunden abgenommen, nicht wegoptimieren:

- FAQ-Block pro Subseite bleibt: dient als maschinenlesbare Zusammenfassung
  für KI-Suchmaschinen, die Karteninhalte nicht auslesen können.
- Ablauf-/Prozess-Sektionen bleiben: werden von KI-Suchmaschinen bevorzugt.
- Expertise-/Über-uns-Block am Ende jeder Subseite bleibt: hebt das Ranking
  der Subseite, nicht der Hauptseite.
- Technische Fachbegriffe sind Auffindbarkeitspotenzial und werden
  perspektivisch mit Wissensbeiträgen unterfüttert.

## Umsetzungsprinzipien

- CSS-native Lösungen vor JavaScript, wo Performance relevant ist
  (z. B. `position: sticky` mit gestaffelten Offsets statt Scroll-Listener).
- Sticky- und Scroll-Verhalten früh auf Tablet und Smartphone prüfen,
  nicht erst am Ende.

## Backlog

Offene Aufgaben aus den Kundenreviews liegen unter:
`docs/backlog/schleife-1.md`

Aufgaben werden über ihre Nummer referenziert (z. B. „setze 1.7 und 1.8 um").
Ein Arbeitspaket = ein Branch = eine Session.
Stopp-Punkte innerhalb eines Pakets gemäß @phasenweise-oder-stopps-implementieren.md.
