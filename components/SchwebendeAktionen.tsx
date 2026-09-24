import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Phone } from 'lucide-react';
import { useAnfrageDialog } from './AnfrageDialog';
import { SCHADENMELDUNG_EXTERN, SCHADENMELDUNG_URL } from '../data/schadenmeldung';
import { ExternMarke, externAttribute } from './ExternerLink';
import { useNaheSeitenende } from '../hooks/useNaheSeitenende';
import { useAusweichzone } from '../hooks/useAusweichzone';

/**
 * „Anrufen" und „Schaden melden" als schwebende Knoepfe unten rechts — ab `lg` (1024 px).
 * Wunsch des Users vom 2026-09-24: die beiden Aktionen „als Sticky-Floating auf der Seite".
 *
 * DAS GEGENSTUECK ZU `MobileStickyCTA`: Unter `lg` steht dort die Leiste mit vier Knoepfen am
 * unteren Rand, ab `lg` ist sie ausgeblendet. Die Navbar zeigt ihre beiden Aktionsknoepfe aber
 * erst ab `xl` (1280) — zwischen 1024 und 1279 px gab es bis hierher GAR KEINE sichtbare Aktion,
 * nur das Menue. Diese Komponente schliesst die Luecke und steht ab `xl` zusaetzlich zur Navbar.
 *
 * WARUM IM `Layout` UND NICHT IN EINER SEITE: `.site-main-shell` traegt `transform:
 * translateZ(0)` — ein Transform macht `<main>` zum Bezugsrahmen fuer `position: fixed`, das
 * Element klebte dann an `<main>` statt am Fenster (dieselbe Falle wie bei `JobPopup` und dem
 * Anfrage-Dialog). `Layout` rendert es deshalb neben `<main>`, genau wie `MobileStickyCTA`.
 *
 * VOR DEM FOOTER AUS: wie die mobile Leiste (gemeinsamer Hook `useNaheSeitenende`). AUSWEICHEN
 * ueber Flaechen mit `data-aktionen-ausweichen` (`useAusweichzone`). Ausgeblendet ist es `inert` —
 * sonst blieben zwei unsichtbare Links per Tabulator erreichbar und anklickbar.
 *
 * WAS SONST UNTEN RECHTS SITZT: das Stellen-Pop-up auf `/karriere` (`JobPopup`) steht ab `lg`
 * deshalb hoeher, ueber diesen Knoepfen.
 */

/*
 * KOMPAKT, NICHT ALS BESCHRIFTETE PILLE (gemessen 2026-09-24): Die erste Fassung — zwei Pillen
 * mit Text, 209 × 106 px untereinander — lag auf Full HD ueber der Versichererliste der
 * Zielgruppenkarten (`npm run zielgruppen`: 6 Befunde), bei 1280 ueber der Vertrauensleiste des
 * Heros und bei 1024 ueber der Textbox der Prozesskarte. Die Seite hat viele bildschirmhohe
 * Buehnen mit Inhalt bis in die rechte untere Ecke. Jetzt zwei Kreise NEBENEINANDER, 104 × 48 px
 * — ein Viertel der Flaeche; nebeneinander statt untereinander, weil der untere Rand weniger
 * belegt ist als der rechte (Listen und Textboxen enden meist ueber der Unterkante).
 *
 * MUSTER DER NAVBAR (`navActionClass` in Navbar.tsx): Kreis mit Symbol, der beim Ueberfahren
 * oder per Tastaturfokus seine Beschriftung ausklappt. Hier nach LINKS — die Gruppe haengt am
 * rechten Rand. `flex-row-reverse` haelt das Symbol dabei an der rechten Kante fest: Wuchse die
 * Pille mit dem Symbol links, liefe das Symbol unter dem Mauszeiger weg, und `mouseleave` liesse
 * sie wieder zuklappen — ein Flackern.
 *
 * 48 px: Mindestgroesse fuer Klickziele aus SEO-GEO-STANDARDS 2.3 (die Navbar nutzt 44).
 */
const KNOPF =
  'cc-gradient-button group pointer-events-auto inline-flex h-12 w-12 flex-row-reverse items-center justify-start overflow-hidden whitespace-nowrap rounded-full border text-[10px] font-bold uppercase tracking-[0.14em] text-white transition-[width] duration-300 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[var(--cc-ice-blue)]';
const SYMBOL = 'flex h-12 w-12 shrink-0 items-center justify-center';
const TEXT =
  'max-w-0 overflow-hidden pl-0 opacity-0 transition-[max-width,opacity,padding] duration-200 group-hover:max-w-[132px] group-hover:pl-4 group-hover:opacity-100 group-focus-visible:max-w-[132px] group-focus-visible:pl-4 group-focus-visible:opacity-100';

const SchwebendeAktionen: React.FC = () => {
  const { oeffnen } = useAnfrageDialog();
  const naheEnde = useNaheSeitenende();
  // Flaechen, die die Ecke dauerhaft belegen und die Aktionen selbst anbieten, markieren sich
  // mit `data-aktionen-ausweichen` (Hero und Zielgruppenstapel der Startseite). Siehe Hook.
  const imWeg = useAusweichzone();
  const versteckt = naheEnde || imWeg;

  return (
    <motion.div
      initial={{ y: 24, opacity: 0 }}
      animate={{ y: versteckt ? 32 : 0, opacity: versteckt ? 0 : 1 }}
      transition={{ type: 'spring', stiffness: 220, damping: 26 }}
      inert={versteckt}
      // Fester Haken fuer Messskripte und Waechter — Klassen aendern sich, der Name nicht.
      data-schwebende-aktionen=""
      // Abstand = Rahmenbreite des Seitenrahmens (`--cc-shell-gap`) plus 1,5 rem Luft: So liegen
      // die Knoepfe sicher innerhalb des Rahmens und frei von dessen abgerundeter Ecke.
      className="pointer-events-none fixed bottom-[calc(var(--cc-shell-gap)_+_1.5rem)] right-[calc(var(--cc-shell-gap)_+_1.5rem)] z-40 hidden items-center gap-2 lg:flex print:hidden"
    >
      <a
        href="tel:+493412617790"
        className={`${KNOPF} hover:w-[148px] focus-visible:w-[148px]`}
        aria-label="CarCare Center anrufen: 0341 - 261 77 90"
        title="0341 - 261 77 90"
      >
        <span className={SYMBOL}>
          <Phone size={17} strokeWidth={2.4} aria-hidden="true" />
        </span>
        <span className={TEXT}>Anrufen</span>
      </a>
      {/* Wie in `MobileStickyCTA`: seit 2026-09-16 ein Link zur Schadenseite auf reparatur.info
          (Backlog 2.23). Mit dem Schalter in `data/schadenmeldung.ts` wieder das eigene Formular. */}
      {SCHADENMELDUNG_EXTERN ? (
        <a
          href={SCHADENMELDUNG_URL}
          {...externAttribute(SCHADENMELDUNG_URL)}
          className={`${KNOPF} hover:w-[196px] focus-visible:w-[196px]`}
          aria-label="Schaden melden (öffnet in einem neuen Tab)"
        >
          <span className={SYMBOL}>
            <AlertTriangle size={17} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className={`${TEXT} inline-flex items-center gap-1.5`}>
            Schaden melden
            <ExternMarke href={SCHADENMELDUNG_URL} groesse={13} />
          </span>
        </a>
      ) : (
        <button
          type="button"
          onClick={() => oeffnen('schaden')}
          className={`${KNOPF} hover:w-[176px] focus-visible:w-[176px]`}
          aria-label="Schaden melden"
        >
          <span className={SYMBOL}>
            <AlertTriangle size={17} strokeWidth={2.4} aria-hidden="true" />
          </span>
          <span className={TEXT}>Schaden melden</span>
        </button>
      )}
    </motion.div>
  );
};

export default SchwebendeAktionen;
