# Partnerlogos — Freigaben und Vorgehen

**Angelegt:** 2026-09-16 · Backlog **3.16** (Partner verlinken), **3.31** (Freigaben Partnerlogos),
**3.12 / 4.13** (BVAT)

> **Wozu diese Datei.** Der Kunde gibt Freigaben einzeln und nach und nach. Jede weitere
> Freigabe soll in wenigen Minuten und immer gleich eingebaut werden — und nachvollziehbar
> bleiben: *wer* hat *wann* *was* freigegeben, und woher stammt die Datei.

---

## Freigabe-Protokoll

| Partner | Art | Freigabe | Umfang auf der Seite | Datei | Stand |
|---|---|---|---|---|---|
| **riparo** (riparo gmbh, Holzgerlingen) | Schadensteuerer | vom Kunden mitgeteilt 2026-09-16 | **Logo + Link** `riparo.de` | `quelle/riparo_logo.png` von riparo.de, SHA-256 `3dba852d…` | ✅ eingebaut |
| **Porsche Zentrum Leipzig** | Autohaus | vom Kunden mitgeteilt 2026-09-16 | **nur Link** `porsche-leipzig.de` | — | ⚠️ Logo **nicht** eingebaut, siehe unten |
| **BVAT** (Bundesverband Ausbeultechnik und Hagelinstandsetzung e.V.) | Verband, **Mitgliedschaft** | Mitgliedssiegel für Mitglieder (Verbandsangabe) | **Siegel + Link** `bvat.de` | `quelle/BVAT-Logo-2024-komplett-Web.png` von bvat.de, SHA-256 `e68b746c…` | ✅ eingebaut |

**Offen beim Kunden:** Die schriftlichen Freigaben selbst liegen nicht im Repository. Bitte bei
OALAB bzw. André ablegen — im Streitfall zählt das Schreiben, nicht dieses Protokoll.

### Warum Porsche Zentrum Leipzig kein Logo hat

Das Autohaus hat freigegeben — aber die Marke gehört nicht dem Autohaus, sondern der
**Dr. Ing. h.c. F. Porsche AG**. Deren offizielles Asset-Paket (`@porsche-design-system/assets`)
ist lizenziert nur für Anwendungen „on behalf of Porsche" und untersagt ausdrücklich, den
Eindruck einer Porsche-Partnerschaft zu erwecken. Ein Händler kann diese Rechte in aller Regel
nicht weitergeben. Dazu kommt der UWG-Punkt, der schon in `data/partners.ts` steht: Ein
Herstellerlogo auf der Seite einer freien Werkstatt kann nach autorisierter Vertragswerkstatt
aussehen.

**Weg zum Logo:** Das Autohaus liefert selbst eine Datei und bestätigt schriftlich, dass es
deren Nutzung für eine Referenzliste freigeben darf (bei Porsche-Zentren meist über die
Marketingabteilung bzw. die CI-Vorgaben der Porsche Deutschland GmbH). Bis dahin: Name + Link.

---

## Vorgehen bei einer neuen Freigabe

1. **Freigabe prüfen.** Schriftlich? Vom **Markeninhaber** oder von jemandem, der für ihn
   freigeben darf? (Autohaus ≠ Hersteller, siehe Porsche.) Umfang: nur Name, Link, Logo?
2. **Offizielle Datei besorgen** — von der Website des Partners oder direkt vom Partner.
   Keine Logo-Sammelseiten. Unverändert ablegen unter `docs/partnerlogos/quelle/`
   (**nicht** unter `public/` — dort würde das Original mit ausgeliefert).
3. **Eine Zeile in `scripts/build-partner-logos.mjs`** — Modus `mono` für Partner
   (einfarbig Graphit aus der Form des Originals), `original` für Siegel und Verbandszeichen.
4. **`npm run partnerlogos`** — schreibt `public/assets/partner/<name>.webp` und gibt die
   Pixelmaße aus.
5. **Eintrag in `data/partners.ts`** — `logo`, `logoBreite`, `logoHoehe`, `url`; bei reinen
   Wortmarken `logoIstName: true`. Versicherer nach `insurancePartners`, Autohäuser nach
   `dealerPartners`, Schadensteuerer nach `claimsPartners`. Mitgliedschaften stattdessen in
   `data/mitgliedschaften.ts`.
6. **Zeile im Freigabe-Protokoll oben** — Quelle, Prüfsumme (`sha256sum`), Datum.
7. **Build und Sichtprüfung** — `npm run build`, dann `npm run shots` für `/` und
   `/geschaeftskunden`.

Die Darstellung kommt automatisch: `components/PartnerEintrag.tsx` zeigt Logo und Link auf
beiden Listen, `components/ExternerLink.tsx` setzt neuen Tab, `rel="noopener noreferrer"`
und die Ansage für Vorlesegeräte.

---

## Datenschutz — braucht ein Partnerlink einen Hinweis?

**Nein**, geprüft am 2026-09-16 (Begründung ausführlich in
`docs/preise-partner-schadenlink/tasks/2026-09-16-preise-partner-schadenlink-tasks.md`, Phase 6):
Ein einfacher Link verarbeitet selbst keine Daten; die Verbindung zum Partner entsteht erst
durch den Klick des Besuchers, und `noreferrer` verhindert, dass der Partner erfährt, von
welcher Seite er kam. Das Logo liegt **auf unserem Server** — beim Seitenaufruf geht keine
Anfrage an den Partner.

**Das ändert sich, sobald** ein Logo von der Partnerseite **eingebunden** statt kopiert wird
(Hotlink), oder ein Widget, Iframe oder Tracking-Pixel des Partners dazukommt. Dann fließt die
IP-Adresse beim Seitenaufruf ab — das wäre erklärungs- und ggf. einwilligungspflichtig.
