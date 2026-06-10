# Redesign: Entfernung der abgerundeten Ecken am Fuß der Hauptseite

Dieses Dokument beschreibt die Schritte zur Entfernung der abgerundeten Ecken am unteren Ende des Hauptcontainers (`.site-main-shell`), um einen flachen Übergang zum Footer zu gewährleisten und störende visuelle Effekte zu vermeiden.

## Phasenplanung

### 📅 Phase 1 — Entfernung der abgerundeten Ecken unten
**Ziel:** CSS-Anpassung des Hauptcontainers (`.site-main-shell`), um die abgerundeten Ecken am unteren Ende zu entfernen.
* [ ] In `index.css` die Klasse `.site-main-shell` so anpassen, dass `border-radius` nur oben angewendet wird (`border-radius: var(--cc-shell-radius) var(--cc-shell-radius) 0 0;`).
* [ ] Die Darstellung im Browser verifizieren.

**Referenzen:**
`index.css`

## Kommentare
*Noch keine abgeschlossen.*
