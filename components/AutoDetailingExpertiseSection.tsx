import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExpandingCardAccordion, { type ExpandingCardItem } from './ExpandingCardAccordion';

/** Kachel-Foto je Karte — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

/**
 * Expertise-Karten. Nutzen bewusst **dieselbe Komponente** wie die Leistungsuebersicht
 * (`ExpandingCardAccordion`, skiper52 Desktop horizontal / skiper53 Mobile vertikal) — dadurch
 * sind Kartenaufteilung UND Animation exakt identisch statt nur nachgebaut. Ersetzt die
 * frueheren flachen Artikel-Chips (gleiche Ziele, jetzt mit Bild + Beschreibung).
 *
 * Karte 5 („Mehr über Aufbereitung erfahren") ersetzt seit 2026-07-22 den frueheren kleinen
 * Textlink „Autoaufbereitung Wissen ansehen" neben dem Intro: Er fuehrt jetzt als vollwertige
 * Karte auf den Wissenshub, statt als leicht uebersehbarer Link danebenzustehen. Der Textlink
 * wurde entfernt — sonst stuende dasselbe Ziel zweimal in derselben Sektion.
 *
 * FOTO-STAND (2026-07-22): „Innenaufbereitung" und „Mehr über Aufbereitung erfahren" haben
 * ihre FINALEN Kundenmotive. „Außenaufbereitung" und „Lackaufbereitung" tragen die vom User
 * bewusst umsortierten Bestandsfotos, „Leasingrückgabe" laeuft noch auf einem Interim-Motiv.
 * Alle fuenf sind unterschiedlich — der Aufklapp-Effekt lebt vom Bildwechsel.
 * Tausch = nur der `backgroundImage`-Pfad je Karte.
 */
const expertiseCards: ExpandingCardItem[] = [
  {
    id: 'innen',
    title: 'Innenaufbereitung',
    description: 'Sorgfältige Reinigung und Pflege von Cockpit, Oberflächen, Polstern und Innenraumdetails.',
    href: '/autoaufbereitung-wissen/innenaufbereitung',
    cta: 'Zur Innenaufbereitung',
    backgroundImage: kachel('innenaufbereitung-leipzig-carcare'),
  },
  {
    id: 'aussen',
    title: 'Außenaufbereitung',
    description: 'Schonende Außenreinigung, Lackreinigung und ein durchgehend gepflegtes Erscheinungsbild.',
    href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung',
    cta: 'Zur Außenaufbereitung',
    backgroundImage: kachel('smart-repair-leipzig-carcare'),
  },
  {
    id: 'lack',
    title: 'Lackaufbereitung',
    description: 'Lackreinigung, Politur und Versiegelung für mehr Glanz und langfristigen Werterhalt.',
    href: '/autoaufbereitung-wissen/lackaufbereitung',
    cta: 'Zur Lackaufbereitung',
    backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare'),
  },
  {
    id: 'leasing',
    title: 'Leasingrückgabe vorbereiten',
    description: 'Prüfung und fachgerechte Aufbereitung vor der Rückgabe, damit der Fahrzeugzustand überzeugt.',
    href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten',
    cta: 'Leasingrückgabe ansehen',
    backgroundImage: kachel('leasingrueckgabe-leipzig-carcare'),
  },
  {
    id: 'wissen',
    title: 'Mehr über Aufbereitung erfahren',
    description:
      'Ratgeber rund um Innenraum, Lack, Werterhalt und Leasingrückgabe – verständlich erklärt im Wissensbereich.',
    href: '/autoaufbereitung-wissen',
    cta: 'Zum Wissensbereich',
    backgroundImage: kachel('wissensdatenbank-leipzig-carcare'),
  },
];

const AutoDetailingExpertiseSection: React.FC = () => {
  // Full-Bleed-Section-Hintergrund: das Akkordeon meldet via onActiveImageChange das Bild der
  // AKTUELL AUFGEKLAPPTEN Karte hoch (auf Desktop ist immer genau eine offen, auf Mobile `null`).
  // Identische Mechanik wie in ServiceGrid.
  const [activeImage, setActiveImage] = useState<string | null>(null);

  return (
    // `relative isolate` = eigener Stacking-Context, damit die -z-10-Ebene sauber hinter dem
    // Content und ueber der Section-Bg bleibt (exakt wie ServiceGrid).
    <section
      id="autoaufbereitung"
      aria-labelledby="detailing-heading"
      className="relative isolate bg-gray-50/70 px-6 py-20 md:py-28"
    >
      {/* Hintergrund hinter dem Grid: Bild der aufgeklappten Karte, Crossfade beim Wechsel —
          dieselben drei Veils wie in der Leistungsuebersicht (vertikaler Veil, Header-Schutz
          horizontal, weisse Rand-Vignette). */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-[var(--cc-nav-radius)]"
      >
        <AnimatePresence>
          {activeImage && (
            <motion.div
              key={activeImage}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="absolute inset-0"
            >
              <img src={activeImage} alt="" decoding="async" className="h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/75 via-white/[0.18] to-white/45" />
              <div
                className="absolute inset-0"
                style={{ background: 'linear-gradient(to right, rgb(255 255 255 / 0.85) 0%, rgb(255 255 255 / 0.45) 28%, rgb(255 255 255 / 0) 52%)' }}
              />
              <div
                className="absolute inset-0"
                style={{ background: 'radial-gradient(ellipse closest-side at 58% 48%, rgb(255 255 255 / 0) 33%, rgb(255 255 255 / 1) 90%)' }}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="container relative mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-end">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-7"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Autoaufbereitung als Expertise</span>
            <h2 id="detailing-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Autoaufbereitung ist mehr als Reinigung. Es ist Werterhalt.
            </h2>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.08 }}
            className="lg:col-span-5"
          >
            <p className="text-base leading-relaxed text-gray-600 md:text-lg">
              CarCare bereitet Fahrzeuge für Privatkunden, Autohäuser und Fuhrparks mit langjähriger Erfahrung auf und erklärt transparent, welche Pflege- und Aufbereitungsleistungen sinnvoll sind, wann sie sich lohnen und worauf Kunden bei Lack, Innenraum und Leasingrückgabe achten sollten.
            </p>
          </motion.div>
        </div>

        {/* Expertise-Karten im Leistungsuebersicht-Design (identische Komponente + Animation).
            Der Ablauf „Wie laeuft eine Autoaufbereitung ab?" ist seit 2026-07-22 eine eigene,
            scroll-gepinnte Sektion (`DetailingProcessSection`) direkt darunter — im exakt
            gleichen Aufbau wie „Unfall & Schaden Leipzig". */}
        <ExpandingCardAccordion items={expertiseCards} onActiveImageChange={setActiveImage} className="mt-12" />
      </div>
    </section>
  );
};

export default AutoDetailingExpertiseSection;
