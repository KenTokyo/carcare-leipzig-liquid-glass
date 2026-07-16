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
 * - `anchors: true` uebernimmt In-Page-Anker (#contact-schaden …). BEWUSST ohne eigenen
 *   Offset: die Ankerziele tragen bereits `scroll-mt-32` (= 128 px, siehe ContactSection /
 *   ArticleLayout) und Lenis respektiert `scroll-margin-top`. Ein zusaetzlicher Offset
 *   wuerde den Navbar-Abstand doppelt zaehlen (gemessen: 128 + 88 = 216 px statt 128).
 * - BEWUSST kein `prefers-reduced-motion`-Gate: Windows meldet reduced-motion systemweit
 *   (siehe HeroSection / mobile-accordion-animation-tasks.md, Phase 5) — ein Gate wuerde die
 *   Fluessigkeit genau bei dem Nutzer abschalten, der sie angefordert hat.
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
      anchors: true, // Offset kommt aus `scroll-mt-32` der Ziele — hier keinen zweiten setzen
    });
    instance = lenis;

    // Eigener rAF-Loop statt `autoRaf`, damit der Teardown deterministisch ist.
    let raf = 0;
    const loop = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      instance = null;
    };
  }, []);
};
