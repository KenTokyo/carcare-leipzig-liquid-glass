import React, { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import ExpandingCardAccordion, { type ExpandingCardItem } from './ExpandingCardAccordion';

/** Kachel-Foto je Karte — gleiche Quelle/Benennung wie Leistungsuebersicht (ServiceGrid). */
const kachel = (name: string) => `/assets/kacheln/${name}.webp`;

/**
 * Expertise-Karten. Nutzen bewusst **dieselbe Komponente** wie die Leistungsuebersicht
 * (`ExpandingCardAccordion`, skiper52 Desktop horizontal / skiper53 Mobile vertikal) — dadurch
 * sind Kartenaufteilung UND Animation exakt identisch statt nur nachgebaut. Ersetzt die
 * frueheren flachen Artikel-Chips (gleiche Ziele, jetzt mit Bild + Beschreibung).
 *
 * ⚠️ INTERIM-FOTOS: Bis die finalen Motive vom Kunden kommen, sind vorhandene Kacheln
 * eingesetzt — bewusst VIER UNTERSCHIEDLICHE, denn der Aufklapp-Effekt lebt vom Bildwechsel.
 * Tausch spaeter = nur der `backgroundImage`-Pfad je Karte.
 */
const expertiseCards: ExpandingCardItem[] = [
  {
    id: 'innen',
    title: 'Innenaufbereitung',
    description: 'Sorgfältige Reinigung und Pflege von Cockpit, Oberflächen, Polstern und Innenraumdetails.',
    href: '/autoaufbereitung-wissen/innenaufbereitung',
    cta: 'Zur Innenaufbereitung',
    backgroundImage: kachel('fahrzeugaufbereitung-leipzig-carcare'),
  },
  {
    id: 'aussen',
    title: 'Außenaufbereitung',
    description: 'Schonende Außenreinigung, Lackreinigung und ein durchgehend gepflegtes Erscheinungsbild.',
    href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung',
    cta: 'Zur Außenaufbereitung',
    backgroundImage: kachel('autolackierung-leipzig-carcare'),
  },
  {
    id: 'lack',
    title: 'Lackaufbereitung',
    description: 'Lackreinigung, Politur und Versiegelung für mehr Glanz und langfristigen Werterhalt.',
    href: '/autoaufbereitung-wissen/lackaufbereitung',
    cta: 'Zur Lackaufbereitung',
    backgroundImage: kachel('smart-repair-leipzig-carcare'),
  },
  {
    id: 'leasing',
    title: 'Leasingrückgabe vorbereiten',
    description: 'Prüfung und fachgerechte Aufbereitung vor der Rückgabe, damit der Fahrzeugzustand überzeugt.',
    href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten',
    cta: 'Leasingrückgabe ansehen',
    backgroundImage: kachel('leasingrueckgabe-leipzig-carcare'),
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
            <a href="/autoaufbereitung-wissen" className="mt-6 inline-flex items-center gap-2 font-bold text-gray-950 transition-colors hover:text-blue-700">
              Autoaufbereitung Wissen ansehen
              <ArrowUpRight size={16} />
            </a>
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
