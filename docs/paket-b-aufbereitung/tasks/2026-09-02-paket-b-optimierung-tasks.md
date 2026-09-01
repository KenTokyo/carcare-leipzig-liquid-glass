# Optimierungen aus Paket B

Referenz: `docs/paket-b-aufbereitung/tasks/2026-09-02-paket-b-tasks.md`
Abarbeitung: nach Paket B, aber **nach** Punkt 2 des Paket-A-Plans
(`@types/react`) — siehe dort, die Reihenfolge hat der User gesetzt.

---

### ⬜ 1. 🟠 Hoch — `DetailingGallery` führt eine zweite, ungeprüfte Leistungsliste
**Vor dem Einsetzen echter Fotos konsolidieren.**

`components/DetailingGallery.tsx` pflegt in `ITEMS` elf Labels:

```
Innenaufbereitung · Außenreinigung · Lackpolitur · Cockpit-Detail ·
Versiegelung · Felgenreinigung · Lederpflege · Motorraumpflege ·
Keramikschutz · Politur-Finish · Endkontrolle
```

Diese Liste hat **keinen Abgleich** mit den übrigen Quellen:

| Quelle | Was sie führt |
|---|---|
| `data/services.ts` | Leistungskatalog für Startseite und `/leistungen` |
| `data/detailing.ts` → `detailingScopes` | Innen-, Außen-, Lackaufbereitung |
| `data/detailing.ts` → `carePackages` | Pflegepakete mit Preisen |
| `data/detailing.ts` → `disinfectionServices` | Ozon, Heißvernebelung |
| **`DetailingGallery.tsx` → `ITEMS`** | **elf frei formulierte Labels** |

**Solange es Platzhalter sind, ist das folgenlos** — die Kacheln zeigen
Farbverläufe mit Icon, niemand liest sie als Leistungsversprechen. **Sobald echte
Fotos einziehen, wird die Liste zu einer Aussage über das Leistungsangebot** und
muss zu den anderen Quellen passen.

Zwei Beispiele, die das heute schon zeigen:

- **`Keramikschutz`** steht als Label sichtbar auf der Seite, während die
  zugehörige Exklusivleistung „Keramikversiegelung" auf
  `/aussenaufbereitung-leipzig` bewusst ohne Beschreibung bleibt (1.18, Zulieferung
  André). Die Galerie verspricht damit etwas, das die Leistungsseite noch nicht
  erklärt.
- **`Scheinwerfer-Politur`** war bis 2026-09-02 Teil dieser Liste — und die
  **einzige** Fundstelle einer Leistung, die aus rechtlichen Gründen verschwinden
  musste (1.12). Sie war nirgends sonst ausgezeichnet, aber sichtbar. Genau der
  Fall, den eine ungeprüfte Zweitliste erzeugt.

* [ ] Vor dem Einsetzen der Fotos: `ITEMS` gegen `serviceCatalog`,
      `detailingScopes`, `carePackages` und `disinfectionServices` abgleichen
* [ ] Entweder aus diesen Quellen ableiten oder die Labels bewusst als reine
      Bildunterschriften kennzeichnen — dann aber ohne Leistungsnamen
* [ ] Prüfen, ob ein Wächter das absichern kann (Muster: `scripts/check-faq.mjs`)

---

### ⬜ 2. 🟡 Mittel — Bildmotive doppelt belegt
Siehe Backlog **1.28**: Leasingrückgabe und Außenaufbereitung teilen sich ihr
Motiv mit anderen Kacheln (`smart-repair-…`, `fahrzeugaufbereitung-…`). Dateiname
und Einsatzort fallen dadurch auseinander. Umbenennen scheidet aus, weil die
Namen an ihren anderen Einsatzorten korrekt sind — es braucht eigene Motive.

* [ ] Nach Fotolieferung André: eigene Dateien anlegen, `aufbereitungKacheln`
      in `data/detailing.ts` umhängen (eine Stelle, seit Paket B einquellig)
