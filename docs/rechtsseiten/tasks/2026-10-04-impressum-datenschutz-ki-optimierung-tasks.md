# Optimierung zu: Impressum, Datenschutzerklärung und KI-Verzeichnis

**Angelegt:** 2026-10-04
**Bezug:** `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md` (Kommentare, Phase 2)
**Status (23.10.):** O3 erledigt, O1 und O2 offen und im Plan vom 23.10. (Phase 6) gebündelt. Bis dahin: alle Punkte **offen, auf Zuruf**. Der User hat den Auftrag am 04.10. ausdrücklich auf die Rechtstexte
begrenzt („erstmal nur diese Sachen“); Infrastruktur und Postfächer werden nicht ungefragt geändert.

---

### ⬜ O1 — Formularversand beim Hosting über KUPPER IT (🟠 hoch; seit 23.10. laut User geregelt, Live-Test nach dem Umzug offen)
**Ziel:** Die Formulare senden auch, wenn die Seite bei KUPPER IT liegt, und die Erklärung beschreibt den Weg richtig.
*Bis 04.10. abends hieß O1 „Formularfunktion nach Frankfurt“ (Vercel `iad1` → `fra1`). Überholt: Laut User wird die Website über KUPPER IT gehostet.*
*2026-10-23 (Rechtsprüfung): Hosting über KUPPER IT vom User bestätigt. Gemessen: Der heutige Webserver der Domain ist ein Plesk-Server im
Netz von KUPPER IT (`web01.trusted-datacenter.cloud`). Plesk kann Node.js per Erweiterung; sonst braucht `/api/anfrage` eine PHP-Fassung.
Die Postfächer liegen bei Microsoft 365, nicht bei KUPPER IT; die Erklärung sagt das seit 23.10.*
* [x] Mit KUPPER IT klären, ob dort Node.js für `/api/anfrage` läuft (Versand über netcup-SMTP, dieselben Umgebungsvariablen wie bei Vercel). *Laut User am 23.10. geregelt („1 und 5 sind geregelt“); wie, steht nicht im Repo.*
* [ ] Nur falls der Versand doch bei Vercel bleibt: `regions: ["fra1"]` in `vercel.json` und Vercel Inc. als Empfänger in „Hosting und E-Mail“ und „Anfrageformulare“ ergänzen (USA, EU-US Data Privacy Framework).
* [ ] Nach dem Umzug R10: alle drei Formulararten auf der echten Domain live testen, Empfang bei info@ und abosse@ prüfen, Stand-Datum der Erklärung mitziehen, falls sich am Weg etwas ändert.
**Referenzen:**
`api/anfrage.ts`
`pages/DatenschutzPage.tsx`

### ⬜ O2 — Kopien im Versandpostfach (🟡 mittel, seit 23.10. dringlicher)
**Ziel:** Die Erklärung sagt „auf der Website wird nichts gespeichert“; Kopien im Versandpostfach bei netcup wären eine zweite Ablage.
*2026-10-23: Seit dem Live-Test vom 22.10. liegt dort mindestens eine Bewerbung mit PDF. Das Postfach gehört OALAB, also braucht es
zusätzlich einen AV-Vertrag zwischen der BS CarCare GmbH und OALAB (netcup als Unterauftragnehmer). Gebündelt im Plan vom 23.10., Phase 6.*
* [ ] Prüfen, ob das Postfach `carcare.center.info@oalab.de` noch Kopien behält (Netcup-Plan: „behält zunächst Kopien für Eingangstests“).
* [ ] Vor dem Livegang abschalten, sonst in der Erklärung nennen (Speicherort, Löschung).
**Referenzen:**
`docs/netcup-email/tasks/2026-09-08-netcup-email-tasks.md`

### ✅ O3 — „KUPA IT“ heißt KUPPER IT GmbH (🟢 niedrig, erledigt am 2026-10-23)
**Ziel:** Der Dienstleister steht im Backlog so, wie er heißt.
* [x] Fundstellen „KUPA IT“ in `docs/backlog/` berichtigt: 5.1 und Livegang-Absatz in `schleife-5.md`, Kopf, 6.10, 6.13, 6.19, 6.20 und Livegang-Zeile in `schleife-6.md`, R6 in `offene-punkte-konsolidiert.md` (zusammen 10). Das Transkriptzitat steht gekennzeichnet in 5.1, 6.20 und der Standzeile von Schleife 6.
**Referenzen:**
`docs/backlog/schleife-6.md`
`docs/backlog/schleife-5.md`

---

## Kommentare

*(folgt bei Umsetzung)*
