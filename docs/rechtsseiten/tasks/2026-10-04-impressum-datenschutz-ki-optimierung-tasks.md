# Optimierung zu: Impressum, Datenschutzerklärung und KI-Verzeichnis

**Angelegt:** 2026-10-04
**Bezug:** `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md` (Kommentare, Phase 2)
**Status:** alle Punkte **offen, auf Zuruf**. Der User hat den Auftrag am 04.10. ausdrücklich auf die Rechtstexte
begrenzt („erstmal nur diese Sachen“); Infrastruktur und Postfächer werden nicht ungefragt geändert.

---

### ⬜ O1 — Formularversand beim Hosting über KUPPER IT (🟠 hoch)
**Ziel:** Die Formulare senden auch, wenn die Seite bei KUPPER IT liegt, und die Erklärung beschreibt den Weg richtig.
*Bis 04.10. abends hieß O1 „Formularfunktion nach Frankfurt“ (Vercel `iad1` → `fra1`). Überholt: Laut User wird die Website über KUPPER IT gehostet.*
* [ ] Mit KUPPER IT klären, ob dort Node.js für `/api/anfrage` läuft (Versand über netcup-SMTP, dieselben Umgebungsvariablen wie bei Vercel).
* [ ] Sonst den Versand bei Vercel lassen (dann `regions: ["fra1"]` in `vercel.json`) und Vercel Inc. als Empfänger in „Hosting und E-Mail“ und „Anfrageformulare“ ergänzen (USA, EU-US Data Privacy Framework).
* [ ] Danach R10: alle drei Formulararten live testen, Stand-Datum der Erklärung mitziehen.
**Referenzen:**
`api/anfrage.ts`
`pages/DatenschutzPage.tsx`

### ⬜ O2 — Kopien im Versandpostfach (🟡 mittel)
**Ziel:** Die Erklärung sagt „auf der Website wird nichts gespeichert“; Kopien im Versandpostfach bei netcup wären eine zweite Ablage.
* [ ] Prüfen, ob das Postfach `carcare.center.info@oalab.de` noch Kopien behält (Netcup-Plan: „behält zunächst Kopien für Eingangstests“).
* [ ] Vor dem Livegang abschalten, sonst in der Erklärung nennen (Speicherort, Löschung).
**Referenzen:**
`docs/netcup-email/tasks/2026-09-08-netcup-email-tasks.md`

### ⬜ O3 — „KUPA IT“ heißt KUPPER IT GmbH (🟢 niedrig)
**Ziel:** Der Dienstleister steht im Backlog so, wie er heißt.
* [ ] Fundstellen „KUPA IT“ in `docs/backlog/` (5.1, 6.10, 6.13, 6.19, 6.20, Kopf von `schleife-6.md`) einzeln berichtigen, Zitate aus dem Transkript als solche kennzeichnen. In 6.20 seit 04.10. vermerkt.
**Referenzen:**
`docs/backlog/schleife-6.md`
`docs/backlog/schleife-5.md`

---

## Kommentare

*(folgt bei Umsetzung)*
