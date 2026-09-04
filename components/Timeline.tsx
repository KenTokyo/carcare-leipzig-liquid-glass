import React, { useState } from 'react';
import { motion, type Variants } from 'framer-motion';

/**
 * Zeitstrahl fuer Unternehmensstationen (Backlog 1.27).
 *
 * ECHTE ACHSE, NICHT NUR EINE LINIE ZWISCHEN KACHELN. Eine fruehere Fassung war ein
 * Kartenraster mit verbindender Linie — technisch eine Zeitleiste, gelesen aber als
 * Raster. Jetzt traegt eine durchgehende Achse die Aussage: Sie laeuft von links nach
 * rechts, jeder Meilenstein sitzt als Punkt DARAUF, und die Karten haengen abwechselnd
 * darueber und darunter. Die Richtung ist damit sichtbar, nicht nur nummeriert.
 *
 * DIE ACHSE ZEICHNET SICH BEIM EINTRETEN. Sie waechst von links nach rechts, und jeder
 * Punkt erscheint in dem Moment, in dem die Linie ihn erreicht (`punktVerzoegerung`).
 * Danach folgt seine Karte.
 *
 * ⚠️ WARUM DIE ANIMATION UEBER VARIANTEN LAEUFT UND NICHT PER `whileInView` AM ELEMENT
 * SELBST — das ist der Kern dieser Datei, nicht Geschmack:
 *
 *   Die erste Fassung setzte `initial={{ scale: 0 }}` UND `whileInView` auf denselben
 *   Knopf. Ein auf null skaliertes Element hat aber keine Flaeche, und der
 *   IntersectionObserver, der es beobachten soll, sitzt auf ebendiesem Element. Es
 *   beobachtet sich selbst weg: kein Schnitt, kein Ausloesen, der Knopf bleibt fuer
 *   immer bei `scale(0)`. Gemessen auf 390x844 — `box=0x0`, `transform=matrix(0,...)`,
 *   auch nach 4 Sekunden unveraendert, waehrend die Karten daneben (die nur `opacity`
 *   und `y` animieren und ihre Flaeche behalten) sauber erschienen.
 *
 *   Deshalb: Beobachtet wird das `<li>`, das immer eine Flaeche hat. Punkt und Karte
 *   bekommen den Zustand ueber `variants` vererbt. Wer hier auf `whileInView` am
 *   animierten Element zurueckbaut, holt den Fehler zurueck — und zwar nur auf schmalen
 *   Schirmen, weil ein sehr hoher Viewport ihn zufaellig verdeckt.
 *
 * INTERAKTIV: Punkt und Karte gehoeren zusammen und heben sich gemeinsam hervor, bei
 * Zeigerkontakt wie bei Tastaturfokus. Der Punkt ist ein `<button>` mit
 * `aria-describedby` auf seine Karte.
 *
 * ⚠️ DIE KARTENFLAECHE IST PFLICHT, KEINE DEKORATION. Auf `/ueber-uns` liegt die
 * Sektion mit `bg-gray-50/70` ueber einem Werkstattfoto (`BackdropLayout`). Eine
 * Zwischenfassung ohne Flaeche war ueber den dunklen Fahrzeugen praktisch unlesbar —
 * gemessen 2026-09-04.
 *
 * ZWEI RICHTUNGEN, EIN MARKUP: waagerechte Achse ab `lg`, darunter senkrecht mit den
 * Karten rechts daneben. Abwechselnd oben/unten funktioniert auf 390px nicht. Bewusst
 * KEIN zweiter Markup-Block — sonst stuende derselbe Text zweimal im HTML.
 */

export interface TimelineStation {
  /** Jahr oder Zeitraum. Leer lassen, solange die Angabe fehlt — siehe `istPlatzhalter`. */
  zeit?: string;
  title: string;
  description: string;
  /**
   * Station ohne zugelieferten Inhalt.
   *
   * Steuert die ruhigere Darstellung UND wird vom Dummy-Waechter ausgelesen
   * (`scripts/check-dummies.mjs`). Wer den Text ersetzt, muss dieses Feld entfernen —
   * sonst bricht der Build. Genau das ist die Absicht: Ein umbenannter Platzhalter
   * bleibt ein Platzhalter.
   *
   * KEINE reduzierte Deckkraft auf dem Text — das druecke den Kontrast auf der
   * halbtransparenten Karte unter AA. Die Kennzeichnung traegt das Wort „Jahr offen",
   * nicht die Farbe allein (WCAG 1.4.1).
   */
  istPlatzhalter?: boolean;
}

/** Wie lange die Achse braucht, um von links nach rechts durchzulaufen. */
const ACHSE_DAUER = 1.1;

/**
 * Spaltenzahl als AUSGESCHRIEBENE Klassen.
 *
 * Tailwind liest den Quelltext als Text — eine zusammengesetzte Klasse wie
 * `lg:grid-cols-${n}` steht dort nie und wird nicht erzeugt. Das Raster fiele stumm auf
 * eine Spalte zurueck.
 */
const SPALTEN: Record<number, string> = {
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
  5: 'lg:grid-cols-5',
  6: 'lg:grid-cols-6',
};

/** Der Punkt erscheint, wenn die Linie ihn erreicht. */
const punktVerzoegerung = (idx: number, anzahl: number) =>
  0.12 + (idx / Math.max(anzahl - 1, 1)) * ACHSE_DAUER;

const ACHSE: Variants = {
  ruhe: { scaleX: 0, scaleY: 0 },
  an: { scaleX: 1, scaleY: 1 },
};

const PUNKT: Variants = {
  ruhe: { scale: 0, opacity: 0 },
  an: { scale: 1, opacity: 1 },
};

const KARTE: Variants = {
  ruhe: { opacity: 0, y: 14 },
  an: { opacity: 1, y: 0 },
};

const Timeline: React.FC<{ stations: TimelineStation[] }> = ({ stations }) => {
  const [aktiv, setAktiv] = useState<number | null>(null);
  const anzahl = stations.length;

  return (
    <div className="relative">
      {/* ---------------------------------------------------------- Die Achse ---
          Senkrecht auf schmalen Schirmen (links neben den Karten), ab `lg` waagerecht
          auf halber Hoehe. `aria-hidden`: Die Abfolge steckt in der <ol>.
          Der beobachtete Traeger behaelt seine Flaeche; nur die Kinder skalieren. */}
      <motion.div
        aria-hidden="true"
        initial="ruhe"
        whileInView="an"
        viewport={{ once: true, margin: '-60px' }}
        className="pointer-events-none absolute left-[1.375rem] top-0 h-full w-px lg:left-0 lg:top-1/2 lg:h-px lg:w-full"
      >
        <div className="h-full w-full bg-gray-200" />
        <motion.div
          variants={ACHSE}
          transition={{ duration: ACHSE_DAUER, ease: [0.25, 0.6, 0.3, 1] }}
          className="absolute inset-0 origin-top bg-blue-600/40 lg:hidden"
        />
        <motion.div
          variants={ACHSE}
          transition={{ duration: ACHSE_DAUER, ease: [0.25, 0.6, 0.3, 1] }}
          className="absolute inset-0 hidden origin-left bg-blue-600/40 lg:block"
        />
      </motion.div>

      <ol className={`relative grid grid-cols-1 gap-6 lg:gap-4 ${SPALTEN[anzahl] ?? 'lg:grid-cols-5'}`}>
        {stations.map((station, idx) => {
          const oben = idx % 2 === 0;
          const istAktiv = aktiv === idx;
          const kartenId = `zeitstrahl-karte-${idx}`;
          const verzoegerung = punktVerzoegerung(idx, anzahl);

          return (
            <motion.li
              key={station.title}
              // Beobachtet wird DIESES Element — es hat immer eine Flaeche.
              initial="ruhe"
              whileInView="an"
              viewport={{ once: true, margin: '-60px' }}
              className="relative flex items-start gap-4 lg:block lg:h-[26rem]"
              onMouseEnter={() => setAktiv(idx)}
              onMouseLeave={() => setAktiv((jetzt) => (jetzt === idx ? null : jetzt))}
            >
              {/* ------------------------------------------------------ Punkt --- */}
              <motion.button
                type="button"
                aria-describedby={kartenId}
                aria-pressed={istAktiv}
                onFocus={() => setAktiv(idx)}
                onBlur={() => setAktiv((jetzt) => (jetzt === idx ? null : jetzt))}
                onClick={() => setAktiv((jetzt) => (jetzt === idx ? null : idx))}
                variants={PUNKT}
                transition={{ delay: verzoegerung, duration: 0.42, ease: [0.34, 1.4, 0.5, 1] }}
                /*
                  ⚠️ ZENTRIERT UEBER NEGATIVE RAENDER, NICHT UEBER `-translate-x-1/2`.
                  Framer schreibt `transform` inline (hier die Skalierung), und das
                  ueberschreibt Tailwinds Translate-Klassen vollstaendig. Die vorige
                  Fassung nutzte `lg:-translate-x-1/2 lg:-translate-y-1/2` — die Punkte
                  sassen dadurch 22px rechts der Spaltenmitte UND 22px unter der Achse.
                  Weil alle fuenf gleich verschoben waren, sah der Abstand stimmig aus;
                  gemessen fiel es erst auf, als die Punktmitte gegen die Spaltenmitte
                  gerechnet wurde (224 statt 201,6 bei 243,19px Spaltenbreite).
                  1,375rem ist die halbe Knopfgroesse (h-11 = 2,75rem).
                */
                className={`relative z-10 flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold transition-colors lg:absolute lg:left-1/2 lg:top-1/2 lg:-ml-[1.375rem] lg:-mt-[1.375rem] ${
                  istAktiv
                    ? 'bg-blue-600 text-white ring-4 ring-blue-600/15'
                    : station.istPlatzhalter
                      ? 'bg-white text-gray-500 ring-1 ring-gray-200'
                      : 'bg-white text-blue-600 ring-1 ring-gray-200'
                }`}
              >
                {idx + 1}
                <span className="sr-only">
                  {' — '}
                  {station.zeit ?? 'Jahr offen'}: {station.title}
                </span>
              </motion.button>

              {/* ------------------------------------------------------ Karte --- */}
              <motion.div
                id={kartenId}
                variants={KARTE}
                transition={{ delay: verzoegerung + 0.16, duration: 0.45 }}
                className={`min-w-0 flex-1 lg:absolute lg:inset-x-0 ${
                  oben ? 'lg:bottom-1/2 lg:mb-9' : 'lg:top-1/2 lg:mt-9'
                }`}
              >
                {/* Stichleitung vom Punkt zur Karte — macht die Zuordnung eindeutig,
                    wenn Karten ueber und unter der Achse haengen. */}
                <span
                  aria-hidden="true"
                  className={`absolute left-1/2 hidden w-px bg-gray-200 lg:block ${
                    oben ? 'top-full h-9' : 'bottom-full h-9'
                  }`}
                />
                <div
                  className={`rounded-2xl border bg-gray-50/70 p-5 transition-shadow ${
                    istAktiv ? 'border-blue-200 shadow-lg shadow-gray-300/40' : 'border-gray-100'
                  }`}
                >
                  {station.zeit ? (
                    <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-blue-600">
                      {station.zeit}
                    </span>
                  ) : (
                    station.istPlatzhalter && (
                      <span className="mb-1 block text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">
                        Jahr offen
                      </span>
                    )
                  )}
                  <h3 className="text-base font-bold leading-snug text-gray-950">{station.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-gray-600">{station.description}</p>
                </div>
              </motion.div>
            </motion.li>
          );
        })}
      </ol>
    </div>
  );
};

export default Timeline;
