import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus } from 'lucide-react';
import type { FAQItem } from '../types';
import GanzwortTitel from './GanzwortTitel';
import { RAND, freierBereich, gleitenUm } from '../lib/freierBereich';

/**
 * FAQ als Akkordeon, EINE Liste für alle Seiten (seit 2026-10-17): Startseite und Ratgeber (`FAQSection`), alle
 * Unterseiten (`PageFAQ`). Bis dahin klappte nur die Startseite auf; auf den Unterseiten standen alle Antworten offen.
 * User: „Ich möchte, dass du das gerne vereinheitlichst wie auf der Mainpage und achte darauf, dass es nicht ruckelt,
 * weil jetzt gerade auf der Mainpage zum Beispiel ruckelt es immer, wenn ich das aufmache.“
 *
 * WARUM ES RUCKELTE (gemessen 17.10., Startseite, 393 × 851): Frage 1 offen, Tipp auf Frage 3. Frage 1 klappte dabei zu,
 * und die getippte Frage rutschte in 300 ms von 446 auf 309 px nach oben, unter dem Finger weg. Die Rechenlast war es
 * nicht: 1,3 ms Hauptthread je Bild bei 4-fach gedrosselter CPU. Plan und Messwerte: docs/mobil-akkordeon-faq/tasks/.
 *
 * DESHALB:
 *  - Jede Frage öffnet und schließt FÜR SICH. Über der getippten Frage ändert sich nichts, sie bleibt stehen. Mehrere
 *    offene Antworten lassen sich außerdem vergleichen.
 *  - Höhe per `grid-template-rows` als CSS-Übergang (styles/faq.css), ohne Messen per Skript im ersten Bild.
 *  - Mobil: Ragt die geöffnete Antwort unter die Knopfleiste, gleitet die Seite gleichzeitig so weit nach, dass sie ganz
 *    zu sehen ist, aber nie weiter, als die Frage unter der Navbar verschwinden ließe (`lib/freierBereich.ts`).
 *  - Die erste Frage ist offen, wie bisher auf der Startseite.
 *
 * ⚠️ DIE ANTWORT BLEIBT IMMER IM DOM (seit 2026-09-01, `check-faq-html` prüft es nach jedem Build). Google und viele
 * KI-Crawler lesen nur das ausgelieferte HTML; FAQ-Inhalte hinter Aufklapp-Elementen sind erlaubt, solange sie dort
 * stehen. Geschlossen ist die Antwort `inert` und `aria-hidden`: kein Fokus, nicht im Accessibility-Tree, und nur offene
 * Antworten tragen ihre `role="region"` bei (keine Landmark-Flut, ARIA-APG). Die Frage sitzt als Knopf in einer echten
 * `h3` (Überschriften-Navigation, ARIA-APG-Muster für Akkordeons).
 */

/**
 * Dauer (s) und Kurve des Aufklappens; das gleichzeitige Nachscrollen nutzt dieselbe Kurve, bei langen Wegen länger.
 * Kurve seit 2026-10-18 die gleichmäßige S-Kurve `ease` wie bei den Karten (`MOBIL_BEWEGUNG` in `akkordeonMobil.ts`,
 * Rückmeldung „zu bouncy“): Die frühere [0.22, 1, 0.36, 1] schnellte los und kroch dann.
 */
const DAUER = 0.4;
const KURVE: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const UEBERGANG: React.CSSProperties = {
  transitionDuration: `${DAUER}s`,
  transitionTimingFunction: `cubic-bezier(${KURVE.join(', ')})`,
};

const anfang = (faqs: FAQItem[]): ReadonlySet<string> => new Set(faqs[0] ? [faqs[0].id] : []);

/**
 * Dauer des Nachgleitens: mindestens so lang wie das Aufklappen, bei langen Wegen länger (1,14 ms je Pixel, höchstens
 * 0,9 s). Gemessen am 17.10.: Mit fester Dauer glitt /fahrzeugaufbereitung-leipzig 463 px in 0,36 s, Spitze 5,2 px/ms,
 * das wirkte hastig. Mit der Kurve `ease` (Spitze 2,8-faches Mitteltempo) bleibt die Spitze damit unter 2,5 px/ms.
 */
const gleitDauer = (dy: number) => Math.min(0.9, Math.max(DAUER, (Math.abs(dy) * 1.14) / 1000));

/**
 * Mobil (unter 1024 px): Steht die Antwort nach dem Aufklappen nicht ganz im freien Bereich, die Seite sanft so weit
 * nachziehen. Gerechnet mit der Endhöhe der Antwort (`scrollHeight` der inneren Hülle), denn die Fläche wächst erst noch.
 */
const insBild = (artikel: HTMLElement) => {
  if (!window.matchMedia('(max-width: 1023px)').matches) return;
  const innen = artikel.querySelector<HTMLElement>('.cc-faq-antwort__innen');
  if (!innen) return;
  const frei = freierBereich();
  const r = artikel.getBoundingClientRect();
  // Endlage der Unterkante: jetzige Unterkante, ohne die schon offene Höhe (Tipp während des Zuklappens), plus volle Antwort.
  const unten = r.bottom - innen.getBoundingClientRect().height + innen.scrollHeight;
  const fehlt = unten - (frei.unten - RAND);
  if (fehlt <= 0) return;
  const dy = Math.min(fehlt, r.top - (frei.oben + RAND));
  gleitenUm(dy, gleitDauer(dy), KURVE);
};

interface FaqListeProps {
  faqs: FAQItem[];
  /** Präfix der ids von Frage und Antwort, je Seite eindeutig (Startseite: `faq`, wie bis 2026-10-17). */
  idPraefix: string;
}

const FaqListe: React.FC<FaqListeProps> = ({ faqs, idPraefix }) => {
  // Andere Fragen (Wechsel zwischen Ratgeberartikeln ohne Neuaufbau): wieder mit der ersten offen beginnen. Während des
  // Renderns statt in einem Effekt (React: „Storing information from previous renders“), also ohne falsches Zwischenbild.
  // Verglichen wird über die ids, nicht über das Array: `PageFAQ` übergibt ohne Einträge jedes Mal ein neues `[]`.
  const schluessel = faqs.map((faq) => faq.id).join('|');
  const [stand, setStand] = useState(() => ({ schluessel, offen: anfang(faqs) }));
  if (stand.schluessel !== schluessel) setStand({ schluessel, offen: anfang(faqs) });
  const offen = stand.schluessel === schluessel ? stand.offen : anfang(faqs);

  const umschalten = (id: string, artikel: HTMLElement | null) => {
    const aufmachen = !offen.has(id);
    setStand((alt) => {
      const neu = new Set(alt.offen);
      if (aufmachen) neu.add(id);
      else neu.delete(id);
      return { ...alt, offen: neu };
    });
    if (aufmachen && artikel) insBild(artikel);
  };

  return (
    <div className="space-y-3">
      {faqs.map((faq, idx) => {
        const istOffen = offen.has(faq.id);
        const knopfId = `${idPraefix}-trigger-${faq.id}`;
        const antwortId = `${idPraefix}-panel-${faq.id}`;
        return (
          <motion.article
            key={faq.id}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.4, delay: idx * 0.04 }}
            className={`cc-karte overflow-hidden rounded-2xl border transition-colors ${istOffen ? 'border-blue-200' : 'border-gray-100'}`}
          >
            <h3>
              {/* Ohne Tipp-Hervorhebung: `index.css` gibt sonst die Android-Fläche über die ganze Zeile; Rückmeldung gibt
                  das Aufklappen selbst (wie an den Karten, `ExpandingCardAccordion`). Fokusring bleibt der des Browsers. */}
              <button
                type="button"
                id={knopfId}
                aria-expanded={istOffen}
                aria-controls={antwortId}
                onClick={(event) => umschalten(faq.id, event.currentTarget.closest('article'))}
                className="flex w-full items-center justify-between gap-5 p-5 text-left [-webkit-tap-highlight-color:transparent] md:p-6"
              >
                {/* Frage ohne Silbentrennung (`GanzwortTitel`, User 2026-10-03), Hülle als `span`: kein `div` im Knopf. */}
                <GanzwortTitel
                  als="span"
                  huelleAls="span"
                  text={faq.question}
                  huelle="min-w-0 flex-1"
                  className="block font-bold leading-snug text-gray-950 [--titel-max:1rem] md:[--titel-max:1.125rem]"
                />
                <span
                  aria-hidden="true"
                  className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-[transform,background-color,color] duration-300 ${istOffen ? 'rotate-45 bg-blue-600 text-white' : 'bg-gray-50 text-gray-950'}`}
                >
                  <Plus size={17} />
                </span>
              </button>
            </h3>
            <div
              id={antwortId}
              role="region"
              aria-labelledby={knopfId}
              aria-hidden={!istOffen}
              inert={!istOffen}
              data-offen={istOffen}
              className="cc-faq-antwort"
              style={UEBERGANG}
            >
              <div className="cc-faq-antwort__innen">
                <p className="px-5 pb-6 text-sm leading-relaxed text-gray-600 md:px-6 md:text-base">{faq.answer}</p>
              </div>
            </div>
          </motion.article>
        );
      })}
    </div>
  );
};

export default FaqListe;
