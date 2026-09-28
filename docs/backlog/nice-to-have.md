# Nice to have — für später

> **Eigene Vorschläge von OALAB, nicht beauftragt.** Hier landet, was der User „für später“ parkt.
> Umgesetzt wird erst auf Zuruf. Die Liste wird **nicht gezählt**: `npm run push-stand` liest sie nicht,
> sie erscheint also nicht unter den offenen Punkten.
>
> **Nummern:** nach der Repo-Regel `R<n>` (siehe `CLAUDE.md`, Abschnitt Backlog) — nie eine freie
> `x.y`-Nummer, die Räume 1.x–5.x gehören dem Kunden. Vor dem Vergeben die höchste `R`-Nummer in
> `docs/backlog/` suchen.

| Nr. | Bereich | Vorschlag | Warum | Aufwand | Geparkt |
|---|---|---|---|---|---|
| R19 | Karriere / SEO | **Eine eigene Seite je offener Stelle** (`/karriere/<stelle>`) mit sichtbarer Stellenbeschreibung, Anforderungen, Beginn (`hinweis`, z. B. „Beginn Sommer 2027“), Bewerben-Knopf mit vorausgewählter Stelle und **genau einem** `JobPosting`. Die Sammelseite `/karriere` verlinkt nur noch dorthin und trägt selbst kein Stellen-Markup mehr. Geschlossene Stellen bekommen keine Seite mit Markup. | Google verlangt das Stellen-Markup auf der „most detailed leaf page possible“ und ausdrücklich nicht auf Seiten, die eine Liste von Stellen zeigen ([Dokumentation](https://developers.google.com/search/docs/appearance/structured-data/job-posting), geprüft 2026-09-27). Heute stehen alle `JobPosting` auf `/karriere` (`seo/pageSchemas.ts`) — seit 5.26 sechs Stück (3 Stellen, 3 Ausbildungsplätze). So sind sie für die Stellensuche bei Google vermutlich nicht berechtigt. | mittel: Routen, Prerender, `vercel.json` (`check-vercel-config`), Sitemap, Title/Description je Seite (`npm run meta`), Breadcrumb, Suchindex (≥ 200 Zeichen je Route); Texte aus `data/jobs.ts` | 2026-09-28 — Vorschlag nach Schleife 5, Paket 1 (`docs/schleife-5-umsetzung/tasks/2026-09-27-paket-1-tasks.md`) |
