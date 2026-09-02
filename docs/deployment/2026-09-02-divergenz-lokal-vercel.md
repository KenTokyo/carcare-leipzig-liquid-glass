# Wo lokaler Build und Vercel-Deployment auseinanderlaufen können

Bestandsaufnahme aus dem Repository heraus, ohne Build-Logs. **Keine Änderungen.**

Anlass: `vercel.json` war die achte Stelle, an der eine neue Seite hängt — übersehen,
Folge waren 404 auf zwei Routen. Die Frage ist, welche Kategorien dieser Art es sonst
noch gibt.

**Leitunterscheidung:** Es gibt Dinge, die Vercel **baut** (die prüft ein lokaler Build
mit), und Dinge, die Vercel **liest oder stellt** (die prüft er nicht). Nur die zweite
Gruppe kann lautlos auseinanderlaufen.

---

## A — Was Vercel liest, statt es zu bauen

| # | Stelle | Zustand | Risiko |
|---|---|---|---|
| **A1** | `vercel.json` | 24 Rewrites, deckungsgleich mit `routes.mjs` | **War die Ursache.** Wird nicht im Build erzeugt; Vercel liest sie vor dem Build. Nach jeder Routenänderung `npm run vercel-config` + committen. Ein lokaler Build merkt davon nichts, weil dort die statischen Prerender-Dateien greifen. |
| **A2** | Fehlende `headers`-Regeln | `vercel.json` enthält **nur** `rewrites` | Caching, `X-Robots-Tag`, Security-Header laufen auf Vercel-Standard. Kein akutes Problem, aber nichts davon ist im Repo festgelegt — es lässt sich also auch nicht lokal prüfen. |
| **A3** | Kein `.vercelignore` | fehlt | Ohne die Datei lädt Vercel das ganze Repo hoch, inklusive `docs/` und Task-Dateien. Kein Fehler, aber Deploy-Größe und Inhalt sind unbeobachtet. |
| **A4** | Projekt-Einstellungen im Vercel-Dashboard | **aus dem Repo nicht sichtbar** | Build Command, Output Directory, Install Command, Framework-Preset, Production Branch. Weicht eines davon ab, ist das im Repo nicht erkennbar. **Nur im Dashboard prüfbar.** |

## B — Laufzeitumgebung

| # | Stelle | Zustand | Risiko |
|---|---|---|---|
| **B1** | **Node-Version** | Weder `engines` in `package.json` noch `.nvmrc` oder `.node-version`. Lokal läuft **Node 24.12.0**, Vercel wählt seine Standardversion | **Höchstes ungelöstes Risiko dieser Liste.** Zwei verschiedene Node-Versionen bauen dasselbe Repo. Puppeteer reagiert auf Node-Versionen empfindlich. Festschreiben würde die Umgebungen angleichen. |
| **B2** | Env-Variablen | Keine `.env`-Datei im Repo. `scripts/prerender.mjs` liest `PUPPETEER_EXECUTABLE_PATH` | Ist die Variable im Dashboard gesetzt (oder eben nicht), ändert das das Verhalten des Prerenders — im Repo nicht erkennbar. |
| **B3** | `NODE_ENV` | nicht gesetzt im Repo | Stünde `NODE_ENV=production` in den Projekt-Einstellungen, würde npm die `devDependencies` überspringen — dort liegen `vite`, `puppeteer`, `tailwindcss` und seit heute die React-Typen. Der Build bräche dann sofort, wäre also auffällig. |
| **B4** | Dateisystem groß-/kleinschreibungssensitiv | Windows ist es nicht, Vercel (Linux) schon | **Geprüft: 118 relative Importe in 68 Dateien, keine Abweichung.** Aktuell also sauber. Wiederholbar mit dem Skript aus dieser Session. |

## C — Build-Cache und erzeugte Artefakte

| # | Stelle | Zustand | Risiko |
|---|---|---|---|
| **C1** | **Chromium für Puppeteer** | `.puppeteerrc.cjs` legt den Cache nach `.cache/puppeteer` im Projekt, `scripts/ensure-chromium.mjs` lädt ihn im `prebuild` nach | **Der aktuelle Verdachtsfall.** `.cache/` ist gitignored, existiert also nur, wenn Vercels Cache ihn wiederherstellt oder der Download läuft. Beides ist aus dem Repo nicht verifizierbar. |
| **C2** | Nicht blockierende Fehlerbehandlung | `ensure-chromium.mjs` und `prerender.mjs` beenden sich bei Fehlern **mit Exitcode 0** | Beabsichtigt: kein Deploy-Ausfall wegen SEO. Preis: Ein vollständiger Prerender-Ausfall erzeugt einen **grünen** Deploy. Genau das ist eingetreten und blieb wochenlang unbemerkt. |
| **C3** | `public/sitemap.xml` | gitignored, wird im `prebuild` erzeugt | Läuft mit, unkritisch — solange der `prebuild` durchläuft. |
| **C4** | `dist/` | gitignored, wird gebaut | unkritisch |

## D — Was lokal geprüft wird und dort trotzdem nichts aussagt

| # | Prüfung | Was sie wirklich abdeckt |
|---|---|---|
| **D1** | `scripts/check-faq.mjs` (prebuild) | Quellcode. Gilt in **beiden** Umgebungen — läuft auch auf Vercel. |
| **D2** | `scripts/check-faq-html.mjs` (postbuild) | Das **lokal** gebaute `dist/`. Auf Vercel läuft es zwar mit, findet bei ausgesetztem Prerender aber **null** FAQPage-Blöcke und meldet folgerichtig „ok". **Schützt die Umgebung nicht, auf die es ankommt.** |
| **D3** | `tsc --noEmit` | Nur lokal — `npm run build` ruft ausschließlich `vite build`, und Vite typprüft nicht. Ein Typfehler bricht den Deploy also **nicht** ab. |
| **D4** | **Neu: `npm run smoke`** | Das echte Deployment. Schließt die Lücke von D2. |

---

## Rangfolge nach Risiko

1. **C1 + C2** — Prerender fällt aus, Deploy bleibt grün. Wartet auf die Build-Logs.
2. **B1** — Node-Version nirgends festgeschrieben. Zwei Umgebungen, zwei Versionen.
   Das ist unabhängig von der Ursachensuche behebbar und würde eine ganze
   Fehlerklasse schließen.
3. **A4 + B2** — Dashboard-Einstellungen und Env-Variablen sind aus dem Repo
   grundsätzlich nicht prüfbar. Einmal abgleichen und dokumentieren.
4. **A2 + A3** — `headers` und `.vercelignore` fehlen. Kein akutes Problem.
5. **D3** — Typecheck ist nicht Teil des Deploy-Builds. Bewusst entscheiden,
   ob er es werden soll.

**Bereits geschlossen:** A1 (vercel.json ergänzt, Abgleich gegen `routes.mjs` ergibt
null fehlende), B4 (Groß-/Kleinschreibung geprüft), D2 → D4 (Smoke-Test gebaut).
