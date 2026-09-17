import React from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, CalendarClock, Camera } from 'lucide-react';
import { SCHADENMELDUNG_PORTAL, SCHADENMELDUNG_URL } from '../data/schadenmeldung';
import { ExternMarke, externAttribute } from './ExternerLink';

/**
 * Uebergabe an die Schadenseite auf reparatur.info — steht dort, wo bis 2026-09-16 das
 * eigene Schadenformular stand (Kontaktseite, Reiter „Schaden melden").
 *
 * WARUM EINE UEBERGABE UND NICHT EINFACH DER LINK: Auf `/kontakt` waehlt man zuerst das
 * Anliegen und sieht danach das Formular. Ein Reiter, der ohne Vorwarnung einen neuen Tab
 * oeffnet, braeche dieses Muster — und wer von einem alten Lesezeichen auf
 * `/kontakt#contact-schaden` kommt, saehe gar nichts. Die Karte sagt deshalb, was einen
 * dort erwartet, und fuehrt mit EINEM Klick weiter. Die beiden Punkte in der Liste sind
 * die beiden Wege, die die Schadenseite selbst anbietet (geprueft 2026-09-16).
 *
 * `imDialog`: deckende Flaeche wie der Auswahlschritt im Anfrage-Dialog. Dort ist die Karte
 * nur Absicherung — der Dialog verlinkt „Schaden melden" schon im Auswahlschritt direkt.
 */
const SchadenUebergabe: React.FC<{ imDialog?: boolean }> = ({ imDialog = false }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35 }}
    className={`rounded-3xl border border-gray-100 p-6 md:p-10 ${imDialog ? 'bg-white shadow-xl' : 'bg-gray-50/70'}`}
  >
    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
      <span className="text-blue-600">
        <AlertTriangle size={14} />
      </span>
      <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">Schaden melden</span>
    </div>
    <h3 className="mb-3 pr-10 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">
      Schaden online melden — mit Fotos.
    </h3>
    <p className="text-sm leading-relaxed text-gray-600 md:text-base">
      Schadenmeldungen nehmen wir über unsere Schadenseite auf {SCHADENMELDUNG_PORTAL} entgegen. Dort haben Sie
      zwei Wege:
    </p>

    <ul className="mt-6 space-y-3">
      <li className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <Camera size={17} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-950">Schadeninformation übermitteln</span>
          <span className="mt-0.5 block text-sm leading-relaxed text-gray-600">
            Schadendaten und Fotos hochladen — für eine schnelle Ersteinschätzung.
          </span>
        </span>
      </li>
      <li className="flex items-start gap-3 rounded-2xl border border-gray-100 bg-white p-4">
        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
          <CalendarClock size={17} />
        </span>
        <span className="min-w-0">
          <span className="block text-sm font-bold text-gray-950">Besichtigungstermin vereinbaren</span>
          <span className="mt-0.5 block text-sm leading-relaxed text-gray-600">
            Lieber persönlich? Dann kommen Sie mit dem Fahrzeug vorbei.
          </span>
        </span>
      </li>
    </ul>

    <a
      href={SCHADENMELDUNG_URL}
      {...externAttribute(SCHADENMELDUNG_URL)}
      className="cc-gradient-button mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white sm:w-auto"
    >
      Zur Schadenmeldung
      <ExternMarke href={SCHADENMELDUNG_URL} />
    </a>
    <p className="mt-4 text-xs leading-relaxed text-gray-600">
      Die Schadenseite öffnet sich in einem neuen Tab. Für akute Fälle erreichen Sie uns direkt unter{' '}
      <a href="tel:+493412617790" className="font-semibold text-gray-950 underline-offset-2 hover:underline">
        0341 - 261 77 90
      </a>
      .
    </p>
  </motion.div>
);

export default SchadenUebergabe;
