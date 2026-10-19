# Optimierung zu R31 (Zeichenlücken am MacBook)

**Bezug:** `docs/mac-zeichenluecken/tasks/2026-10-19-mac-zeichenluecken-tasks.md`
**Stand:** 2026-10-19. Nummern sind Repo-Befunde (`R31-a` …), keine Kundennummern.

| Nr. | Schwere | Befund | Beleg | Stand |
|---|---|---|---|---|
| **R31-a** | 🟠 | **Safari ist nicht gemessen.** Der Fehler ist in Chrome belegt (alle Versionen 143–155 auf dem Mac). WebKits eigene Aufnahmen zeichnen die Seite neu und zeigen Compositor-Lücken nicht; ein echtes Fensterfoto braucht die Bildschirmaufnahme-Freigabe von macOS, WebDriver für Safari die Einstellung „Entfernte Automatisierung erlauben“. Beides sind Sicherheitseinstellungen des Users. | `safaridriver`: „You must enable 'Allow remote automation'“; Fensterliste ohne Freigabe leer | ⬜ offen: Sichtprüfung am MacBook in Safari nach dem Deploy (Startseite bis unter beide Akkordeons scrollen). Beide Fixes wirken auch in WebKit in die richtige Richtung (weniger Glas-Ebenen, kein runder Seitenbeschnitt). |
| **R31-b** | 🟡 | **Warum Windows sauber war, ist nicht gemessen.** Auf dem Mac zeigt jedes Chromium den Fehler, auch headless, ohne GPU und bei Windows-typischen Fenstern (1920 × 945, 1536 × 730 bei 125 %). Vermutung: größeres Kachelbudget unter Windows/DirectX oder ein anderer Browser dort. | Phase 1 der Planung | ⬜ offen: `npm run zeichnen -- --gegenprobe` einmal am Windows-Rechner. Exit 2 („zeigt die Lücke nicht“) bestätigt die Vermutung, Exit 0 hieße: Windows war nur Glück. |
| **R31-c** | 🟢 | **Volllauf dauert lange** (29 Routen × 4 Fenster, Retina-Aufnahmen, rund 30 min). | Lauf 2026-10-19 | ⬜ bei Bedarf: `--schnell` (nur 1440 × 790 Retina und 390 × 844, doppelte Schrittweite) für den Alltag; der Volllauf vor dem Livegang. |
| **R31-d** | 🟢 | **Werkzeug: Scheinbefunde im Bau** (Ausschnitt außerhalb des Bildes, Handy-Aufnahmen in CSS-Pixeln, Hintergrund-Tab mit falscher Bildgröße, ausbleibender Ebenenbaum). | Phase 2 | ✅ behoben (eigener Browser je Messstrang, Maßstab aus dem Bild, Fühler im Fenster) |
| **R31-e** | 🟢 | **In-App-Browser zeigte die Lücken auch, lief aber verborgen** (11 Bilder/s). Hätte als Beleg getäuscht, wäre der Fehler dort ein Darstellungsartefakt gewesen. | Phase 1 | ✅ als Hinweis in der Planung; Memory `layoutpruefung-headless-statt-pane` deckt es ab |

## Vorschläge für später (nicht beauftragt)

- **Glas-Budget als Regel im Werkzeug:** Neben „seitengroße Ebenen“ auch „sichtbare Weichzeichner-Ebenen je Fenster“
  begrenzen (heute höchstens 6 mobil, 4 am Desktop). Jedes neue Liquid-Glass-Element kostet eine Ebene samt
  Weichzeichner-Durchgang je Bild; auf schwachen Android-Geräten ist das spürbar, bevor es zu Lücken kommt.
- **`npm run zeichnen` in die Livegang-Liste** (`docs/deployment/`), zusammen mit `cls` und `weiterleitungen --live`.
