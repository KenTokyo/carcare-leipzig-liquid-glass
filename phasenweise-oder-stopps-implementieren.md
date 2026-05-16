BITTE NACH FOLGENDEN REGELN WEITERARBEITEN, HALTE DICH DARAN!

1. **Planungsvalidierung (ZWINGEND VOR CODE):**
   - User-Planung mitgegeben? → Lesen, prüfen ob Task enthalten
   - Task enthalten? → JA: Implementieren · NEIN: Planung erweitern
   - Keine Planung? → In `docs/[feature]/tasks/`
   - **ERST nach Planungserweiterung darf programmiert werden!**

Falls keine Masterplanung existiert: Tasks-Datei mit Phasen erstellen. Existiert bereits eine? Nicht überschreiben — diese Datei definiert deinen Workflow, halte dich an diese Regeln!

Danach phasenweise implementieren, was sinnvoll ist — alle Phasen durcharbeiten ohne aufzuhören. 

**Aber Dokumentiere nach jeder phase und arbeite im Loop weiter!:**

Weil du machst ein Kontext-condensing. Das heisst, du vergisst sehr viel, damit du es nicht vergisst, immer dokumentieren in der Task-Datei, immer welche Phase du gemacht hast und welche davor dann noch gemacht werden muss. So hältst du alles im Lauf und kannst alle Phasen hintereinander machen, ohne dass du mich fragen musst.

## 6.7 Phasen mit To-dos ist unser Phasenformat! (Pflicht)
Wichtig ist bei Phasen in Planungen, dass du die Phasen mit To-dos markierst. Also innerhalb von Phasen To-dos anlegen und dann schreiben, was genau gemacht worden ist.

**Beispiel:**
```markdown
### ✅ Phase NUMMER — Kurzbeschreibung *z. B. Architektur, Modus-Trennung, Save-Basis*
**Ziel:** Hier schreiben, worum es geht.
* [x] `Komponente XYZ` erzeugt (604 Zeilen Code), .....
* [ ] `AUFGABE ABC` implementieren.
**Referenzen:**
`Hier Pfade der Unterplanungen, Historien, Completed, Besprechungen angeben`
`Jeweils getrennt pro Zeile`
```

### Kommentar Sektion unter der Phasenplanung
Nach Abschluss bitte schreiben, an welchen Kriterien du dich gehalten hast, speziell also mit komma getrennt in einer Zeile 
und danach **Welche Auffäligkeiten/Fehler/Regelverstoße** dir aufgefallen sind, notieren und ein Refactoring Plan empfehlen, mitsamt aller Funde und nach Gewichtung sortieren
Kriterien eingehalten z.B. 

```markdown
## Kommentare
### Phase 1
**Eingehalten**: unter 700 Zeilen ✅, architektur ✅, Edge-Cases betrachtet ✅, ...
**Auffäligkeiten/Performance-Issues/Probleme/Kritische Findings (nach Schwere):**: 
1. 🔴 **Kritisch:** Start-Crash durch fehlerhafte QuizPack-Umwandlung
Beschreibung hierzu notieren, falls notwendig
Refactoring, Zeilenlimit überschrieben, Ungültige Tab-Werte entdeckt in Komponente XYZ und konnten eine Render-Schleife auslösen! Versehentlich angehängte Restzeilen entdeckt! Event-Werte blindcast entdeckt! State-Updates nicht idempotent - Rerender-Kette möglich!
2. 🟠 **Hoch:** über 700 Zeilen, Coding Regel gebrochen

### Phase 2....
```

So kurz halt und am besten **unterhalb aller Phasen**, als Kommentar sektion
Zusätzlich bitte auch die **Hauptkomponentenpfade** in die Referenzen aufnehmen — **maximal 3 pro Phase**, und zwar die, **an denen am meisten geändert wurde**.

- **Falls Auffäligkeiten/Performance-Issues/Probleme/Kritische Findings vorliegen** direkt Optimierungsplan erzeugen mit Verweis auf die Planung als Referenz, also im selben in `docs/[feature]/tasks/...optimierung-tasks.md` alle Findings dort warten und nach Abschluss aller Phasen in dieser Planung - erst danach die Optimierungs-tasks durchgehen und im Loop alles fixen!

# Weitere WICHTIGE Regeln
- Nach allen Änderungen also wenn du alle Phasen vollendet, erzeuge dann Masterplanung direkt um die Auffälligkeiten zu beheben, die du bei den Phasen festgestellt hast, falls diese noch nicht durch deine Änderungen behoben wurden, damit wir immer aufräumen und cleanen code haben

- Falls du dann auch die Auffälligkeiten behoben und die Phasen auch dokumentiert hast, auch dann melden und vorschlagen, welche Verbesserung man als nächstes machen könnte bzw. ein Feature was dir beim verbessern/entwickeln deiner vorherigen Aufgabe aufgefallen ist, was dieser App extrem helfen könnte!, Versuche also auch bewusst, Verbesserungen/Features zu finden, können auch kleine sein, aber was die App verbessern könnte! Kann alles sein, such dir das aus


BITTE KEIN MOJIBAKE, achte auf ENCODING
- Bitte alle verbesserungen/auffälligkeiten direkt auch mitfixen, die du entdeckt hast, während du an der Aufgabe dran bist OHNE PAUSE die dir gegeben worden ist und zwar OHNE Nachfrage und OHNE PAUSE, direkt verbessern! also aufschreiben, danach implementieren/fixen und als fixed markieren in der gleichen doku!!! und dokumentieren,
- Bevor Implementierung bzw. Planung - Suche mehrere Arten erstmal rauswie man das Problem lösen könnte, dann suche du die beste davon aus, um das Problem zu lösen, Feature zu implementieren..

- Wenn Änderung vorliegen, die du nicht gemacht hast, einfach weitermachen und ignorieren, es arbeiten pararell andere Leute!

- bitte nicht aufhören, statt mir die sinnvollen schritte zu nennne einfach machen, also das gehört auch zu den aufgaben, dass erkennen von sinnvollen schritten und danach diese auch umsetzen im loop, quasi die sinnvollen schritte rausfinden und umsetzen

Analysiere zuerst selbst, worum es geht, welche Expertenrolle passt und welche Struktur der Prompt braucht. Verbessere meinen Rohprompt danach zu einem klaren, vollständigen und gut ausführbaren Zielprompt für dich intern, also im Gedanken aufnehmen.

Achtung: Du wirst mit einer anderen KI verglichen, sobald du fertig bist also den CHAT beendest wird deine Arbeit kontrolliert. 

Du hast kein 2.ten Versuch, es wird direkt alles verglichen. Wenn du frühzeitig stoppst oder faul bist, kannst du also verlieren in dem Duell, versuche dein bestes, immer das höchste und die beste Qualität rauszuholen, auch websearch bzw webfetch also sinnvoll einzusetzen in jeder Phase um das maximalste rauszufinden bzw qualität anzubieten