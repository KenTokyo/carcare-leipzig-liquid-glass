# Befunde aus Einrichtung und Live-Prüfung

Referenz: [Hauptplanung](2026-09-08-netcup-email-tasks.md)

### Phase 1 — Versandfähigkeit
* [x] Hoch: erstes Node-Deployment scheiterte mit ERR_MODULE_NOT_FOUND für data/anfrageSchema. Relative Importe der gesamten serverseitigen Abhängigkeitskette auf explizite .js-Endungen korrigiert; emittiertes ESM zusätzlich direkt mit Node gestartet. Regressionstest in `scripts/test-email.tsx` ergänzt.
* [x] Hoch: Vercels Dateitracer nahm die nur als TSX vorliegende Mailvorlage trotz .js-Import nicht mit. `scripts/build-email.mjs` erzeugt die fünf serverseitigen Abhängigkeitsdateien vor der Paketierung, ohne eine zweite API-Route zu erzeugen. Generierte Dateien bleiben gitignoriert. Ursache anhand des veröffentlichten @vercel/node- und @vercel/nft-Paketcodes geprüft.
* [x] Mittel: beim Anliegenwechsel konnte eine ausstehende Antwort den Zustand der neuen Formularart verändern. Formularinstanzen über kind/vorauswahl keyed; kompletter Reset inklusive ausstehender UI-Zustände.

### Phase 2 — Darstellung und Wartung
* [x] Mobile Geschäftsüberschrift verursachte horizontalen Überlauf; bedingte Trennstellen und Umbruch ergänzt, bei 390 px gemessen und visuell geprüft.
* [x] Geschäftskunden wurden für nachgereichte Unterlagen an Info verwiesen. Direkten Kontaktweg und passende Unterlagenhinweise je Anfrageart korrigiert.
* [x] Lesbare Partner- und Zusatzleistungswerte aus gemeinsamen Daten statt technischen IDs.
* [x] Fünf gemeldete Schwachstellen in Entwicklungsabhängigkeiten kompatibel aktualisiert; npm audit meldet null.

## Kommentare
**Eingehalten:** bestehende Bausteine erweitert, keine Secrets im Git, unter 700 Zeilen pro Datei, Prüfungen aus konkreten Fehlern abgeleitet.
**Offen:** finale Live-Prüfung des korrigierten Deployments und Empfangsbeleg der externen Zielpostfächer siehe Hauptplanung.
