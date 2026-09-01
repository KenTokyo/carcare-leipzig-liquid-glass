# Optimierung — Findings aus dem Parallax-Kit-Export

> **Referenz:** `docs/parallax-scroll-kit/tasks/2026-08-31-parallax-scroll-kit-export-tasks.md`
>
> **Status: BEWUSST OFFEN.** Alle Punkte hier betreffen die BESTEHENDE Seite. Der Auftrag
> vom 2026-08-31 lautete ausdruecklich, an ihr nichts zu veraendern — deshalb wurden die
> Funde dokumentiert statt sofort behoben. Das ist die einzige Stelle in diesem Projekt,
> an der von der „direkt mitfixen"-Regel abgewichen wurde, und zwar auf ausdrueckliche
> Nutzeranweisung. Vor Umsetzung bitte kurz freigeben lassen.

---

### 🟠 Phase A — `@types/react` nachziehen, Typecheck scharf stellen
**Ziel:** `npm run typecheck` soll wieder etwas aussagen.
**Befund:** React 19 buendelt keine Typen mehr; `node_modules/@types/` enthaelt nur `node`,
`estree` und babel-Pakete. Jedes JSX-Element ist damit `any`. Der Check laeuft nur gruen
durch, weil `strict` in `tsconfig.json` aus ist — mit `strict: true` faellt sofort TS7026
(„no interface JSX.IntrinsicElements exists") ueber die gesamte Codebasis.
**Nachgewiesen:** Ein frisches Vergleichsprojekt mit `@types/react@19.2` typecheckt das
exportierte Kit unter `strict: true` fehlerfrei — die Toolchain funktioniert, es fehlt
schlicht das Paket.

* [ ] `npm i -D @types/react@^19 @types/react-dom@^19`
* [ ] `npx tsc --noEmit` laufen lassen und die dann sichtbar werdenden Fehler sichten
* [ ] Fehler beheben (erwartungsgemaess vor allem fehlende Prop-Typen und implizite `any`)
* [ ] Erst danach `"strict": true` in `tsconfig.json` erwaegen — schrittweise, beginnend
      mit `noImplicitAny`, sonst wird es ein Big-Bang-Refactoring
* [ ] Ergebnis dokumentieren

**Risiko:** mittel — beruehrt `package.json`/`package-lock.json` und legt bisher unsichtbare
Typfehler frei. Kein Laufzeitrisiko (Typen werden nicht gebuendelt), aber potenziell viel
Folgearbeit. Deshalb eigene Sitzung.

---

### 🟡 Phase B — `DetailingGallery` auf `useScrollProgress` umstellen
**Ziel:** Den letzten `useScroll({ target })`-Aufruf im Projekt ersetzen.
**Befund:** `components/DetailingGallery.tsx:170` nutzt
`useScroll({ target: bandRef, offset: ['start end', 'end start'] })` — genau den Weg, den
`hooks/useScrollProgress.ts` und die hero-parallax-Planung als fragil dokumentieren
(Einfrieren bei 0 durch overflow-Vorfahren; „Target ref is defined but not hydrated").
Letzteres hat real bereits eine weisse Seite auf `/fahrzeugaufbereitung-leipzig`
verursacht (dort mit `bandRef`-Workaround entschaerft, nicht beseitigt).
Der Kit-Export hat dafuer den Messmodus `cover` bekommen, der das Framer-Offset
`['start end', 'end start']` exakt nachbildet:

```ts
// vorher
const { scrollYProgress } = useScroll({ target: bandRef, offset: ['start end', 'end start'] });
// nachher
const scrollYProgress = useScrollProgress(bandRef, { distance: 'cover' });
```

* [ ] `distance: 'cover'` in `hooks/useScrollProgress.ts` ergaenzen (Implementierung steht in
      `parallax-scroll-kit/src/hooks/useScrollProgress.ts`, Zeilen um den `cover`-Zweig)
* [ ] `DetailingGallery` umstellen, `useScroll`-Import entfernen
* [ ] Gegen `dist/` verifizieren (Port 3007 bedient den Haupt-Worktree, Fehler bleiben dort stumm)
* [ ] Pruefen, ob der `bandRef`-am-aeusseren-Container-Workaround danach noch noetig ist

**Nutzen:** entfernt die letzte Stelle, an der ein kuenftiger Layout-Wrapper mit
`overflow-x: hidden` einen Effekt stillschweigend abschalten koennte.

---

### 🟢 Phase C — 4-Spalten-Limit der Galerie aufheben
**Ziel:** Spaltenanzahl frei konfigurierbar machen.
**Befund:** `DetailingGallery` erzeugt vier fest verdrahtete `useTransform`-Aufrufe
(`y0`…`y3`), weil Hooks nicht in Schleifen laufen duerfen. Eine fuenfte Spalte erfordert
heute eine Code-Aenderung an drei Stellen.
**Loesung (im Kit bereits umgesetzt):** Jede Spalte wird eine eigene Komponente und ruft
ihr `useTransform` selbst auf — siehe `parallax-scroll-kit/src/components/ParallaxColumns.tsx`.

* [ ] `Column`-Komponente das `y` selbst ableiten lassen
* [ ] `COLUMNS`-Array bleibt einzige Konfigurationsstelle

**Nutzen:** gering, rein struktureller Aufraeumer. Nur mitnehmen, wenn die Galerie ohnehin
angefasst wird (z. B. bei Phase B).
