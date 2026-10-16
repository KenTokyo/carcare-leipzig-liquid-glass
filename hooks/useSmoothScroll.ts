import { useEffect } from 'react';
import Lenis from 'lenis';

/**
 * Globales Smooth-Scrolling per Lenis — der Grund, warum sich die skiper29-Referenz
 * („Siena") deutlich fluessiger anfuehlt als nativer Wheel-Scroll.
 *
 * Warum ueberhaupt: Nativ springt ein Mausrad-Klick in harten Stufen (~100 px). Jeder
 * scroll-gekoppelte Effekt (Hero-Parallax, Footer-Reveal) springt dann mit. Lenis faengt
 * Wheel/Touch ab und interpoliert die Scrollposition Frame fuer Frame → die ganze Seite
 * gleitet, und alle scroll-gekoppelten Effekte erben die Fluessigkeit automatisch.
 *
 * Referenz-Messung (live an skiper-ui.com/v1/preview/skiper29, echter Chrome):
 * ein WheelEvent(deltaY:300) rollt dort ueber ~600 ms aus (scrollY 94→162→205→…→293).
 * Aus der Restdistanz-Kurve zurueckgerechnet: ~0.90 pro Frame → `lerp: 0.1` = Lenis-Default.
 * Deren Parallax-Mapping selbst ist linear (keine Daempfung) — die Fluessigkeit kommt also
 * ausschliesslich vom Scrollen. Deshalb hier Standard-Lenis statt Spring auf den Effekt.
 *
 * Zusammenspiel mit dem Projekt:
 * - `useScrollProgress` misst gegen `window` (scroll-Event + getBoundingClientRect). Lenis
 *   scrollt das window programmatisch → scroll-Events feuern weiter → Hook laeuft unveraendert.
 * - `html { scroll-behavior: smooth }` wurde in `index.css` entfernt: Lenis besitzt die
 *   Glaettung jetzt, die CSS-Regel wuerde native Spruenge doppelt animieren.
 * - In-Page-Anker (#contact-schaden …) scrollt Lenis (seit 2026-10-16 ueber `beiAnkerKlick` statt `anchors: true`,
 *   Begruendung dort). BEWUSST ohne eigenen
 *   Offset: die Ankerziele tragen bereits `scroll-mt-32` (= 128 px, siehe ContactSection /
 *   ArticleLayout) und Lenis respektiert `scroll-margin-top`. Ein zusaetzlicher Offset
 *   wuerde den Navbar-Abstand doppelt zaehlen (gemessen: 128 + 88 = 216 px statt 128).
 * - BEWUSST kein `prefers-reduced-motion`-Gate: Windows meldet reduced-motion systemweit
 *   (siehe HeroSection / mobile-accordion-animation-tasks.md, Phase 5) — ein Gate wuerde die
 *   Fluessigkeit genau bei dem Nutzer abschalten, der sie angefordert hat.
 * - `allowNestedScroll: true` (seit 2026-09-17): Lenis faengt das Mausrad seitenweit ab.
 *   Ohne diese Option scrollte KEIN innerer Bereich per Rad. Vorher/nachher gemessen:
 *     · Karten-Texte auf /karriere (`ExpandingCardAccordion`, 7 Karten mit 73–163 px
 *       verdecktem Text): Rad lief am Text vorbei auf die Seite → jetzt scrollt erst der Text.
 *     · Anfragedialog in Fenstern unter 536 px Hoehe (Lenis ist dort gestoppt): 0 px →
 *       jetzt scrollt der Dialog.
 *     · Zielgruppenkarten: Kartentext im halb angedockten Fenster (960 px) → jetzt erreichbar.
 *   Mit der Option prueft Lenis je Ereignis, ob ein Bereich unter dem Zeiger in Drehrichtung
 *   noch scrollen kann: Solange ja, scrollt er nativ; an seinem Ende uebernimmt wieder Lenis
 *   und die Seite gleitet weiter. Das ersetzt `data-lenis-prevent`, das die Seite auch am
 *   Listenende nur ruckartig (nativ) weitergab. Geprueft von `npm run zielgruppen` (echtes
 *   Mausrad). ⚠️ Nicht mit `overscroll-behavior: contain` kombinieren: Dann haelt Lenis den
 *   Bereich auch an dessen Ende fest (siehe `hasNestedScroll` in lenis.mjs).
 */

let instance: Lenis | null = null;

/**
 * Zugriff auf die laufende Lenis-Instanz fuer **programmatische** Scrolls.
 * Wichtig: nicht `window.scrollTo` verwenden, solange Lenis laeuft — sonst kaempfen
 * Lenis-Interpolation und nativer Sprung gegeneinander. Gibt `null` zurueck, solange
 * Lenis nicht initialisiert ist (z. B. im Prerender) → Aufrufer brauchen einen Fallback.
 */
export const getLenis = (): Lenis | null => instance;

/** Einmal an der App-Wurzel aufrufen. */
export const useSmoothScroll = (): void => {
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.1, // Referenz-Wert (Lenis-Default), aus deren Ausrollkurve verifiziert
      // In-Page-Anker uebernimmt seit 2026-10-16 `beiAnkerKlick` unten statt `anchors: true` (Offset weiterhin aus
      // `scroll-mt-32` der Ziele, hier keinen zweiten setzen).
      anchors: false,
      allowNestedScroll: true, // innere Scrollbereiche per Mausrad erreichbar — siehe oben
    });
    instance = lenis;

    /**
     * IN-PAGE-ANKER, ABER NUR WENN NIEMAND DEN KLICK ABGEFANGEN HAT (2026-10-16).
     * Lenis' eigener Handler (`anchors: true`, lenis.mjs `onClick`) scrollt bei jedem Link auf einen Anker derselben
     * Seite und fragt `defaultPrevented` nicht ab. Gefunden mit `npm run akkordeon`: Auf /karriere zeigen die
     * Stellenkarten auf `/karriere#bewerbung`; der erste Tipp soll die Karte nur aufklappen (`preventDefault` in
     * `ExpandingCardAccordion`), Lenis scrollte trotzdem rund 7.000 px zum Formular. Dasselbe galt fuer jeden Anker, den
     * der Anfrage-Dialog abfaengt, sobald sein Ziel auf der Seite steht.
     * Gleiche Bedingung wie bei Lenis (gleicher Host und Pfad, mit Hash), dazu: nicht abgefangen, schlichter Linksklick.
     * Am `window` und damit nach Reacts Wurzel und dem Dialog-Handler am `document`: Beide haben dann schon entschieden.
     */
    const beiAnkerKlick = (event: MouseEvent) => {
      if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const link = event.composedPath().find((knoten): knoten is HTMLAnchorElement => knoten instanceof HTMLAnchorElement && !!knoten.href);
      if (!link) return;
      const ziel = new URL(link.href);
      const hier = new URL(window.location.href);
      if (ziel.host !== hier.host || ziel.pathname !== hier.pathname || !ziel.hash) return;
      lenis.scrollTo(decodeURIComponent(ziel.hash));
    };
    window.addEventListener('click', beiAnkerKlick);

    // Eigener rAF-Loop statt `autoRaf`, damit der Teardown deterministisch ist.
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('click', beiAnkerKlick);
      lenis.destroy();
      instance = null;
    };
  }, []);
};
