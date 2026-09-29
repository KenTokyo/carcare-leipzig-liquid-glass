import React from 'react';
import { Star } from 'lucide-react';
import { SectionIntro } from './PageBlocks';
import { ExternMarke, externAttribute } from './ExternerLink';
import { GESAMTWERTUNG, GOOGLE_PROFIL, bewertungen } from '../data/bewertungen';

/**
 * Google-Bewertungen auf „Über uns" und seit 2026-09-28 abends auch auf der Startseite vor der FAQ (Backlog 6.22,
 * Seitendurchgang mit dem User) — statisch, Daten und Begründung in `data/bewertungen.ts`. Ein Block, zwei Orte:
 * Änderungen hier gelten auf beiden Seiten.
 *
 * HINWEISPFLICHT (§ 5b Abs. 3 UWG): Wer Verbraucherbewertungen zugänglich macht, muss sagen, ob und wie er ihre
 * Echtheit sicherstellt. Der Satz unter dem Block sagt beides ehrlich: Google prüft nach eigener Angabe nicht, entfernt
 * aber gefälschte Inhalte, die es findet; wir prüfen nicht selbst und zeigen eine Auswahl — alle stehen im Profil.
 * ⚠️ Prüft der Betrieb künftig selbst (etwa Abgleich mit Aufträgen), gehört das in diesen Satz.
 *
 * STERNE: dekorativ (`aria-hidden`), die Zahl steht als Text daneben. Der letzte Stern ist anteilig gefüllt (4,7 →
 * 70 %), gezeichnet als zweiter, beschnittener Stern über einem leeren.
 */
const GELB = 'text-[#E8A200]';

const Sterne: React.FC<{ wert: number; groesse?: number }> = ({ wert, groesse = 18 }) => (
  <span aria-hidden="true" className="inline-flex items-center gap-0.5">
    {[0, 1, 2, 3, 4].map((i) => {
      const anteil = Math.max(0, Math.min(1, wert - i));
      return (
        <span key={i} className="relative inline-block" style={{ width: groesse, height: groesse }}>
          <Star size={groesse} className="absolute inset-0 text-gray-300" />
          {anteil > 0 && (
            <span className="absolute inset-0 overflow-hidden" style={{ width: `${anteil * 100}%` }}>
              <Star size={groesse} className={`${GELB} fill-current`} />
            </span>
          )}
        </span>
      );
    })}
  </span>
);

const zahl = (wert: number) => wert.toLocaleString('de-DE', { minimumFractionDigits: 1, maximumFractionDigits: 1 });

const GoogleBewertungen: React.FC = () => (
  <section id="bewertungen" className="bg-white px-6 py-20 md:py-28">
    <div className="container mx-auto">
      <SectionIntro
        eyebrow="Google-Bewertungen"
        title="Was Kunden über uns sagen."
        description={`${zahl(GESAMTWERTUNG.sterne)} von 5 Sternen aus ${GESAMTWERTUNG.anzahl} Bewertungen in unserem Google-Unternehmensprofil (Stand: ${GESAMTWERTUNG.stand}).`}
      />

      <div className="cc-karte flex flex-col gap-5 rounded-2xl border border-gray-100 p-6 shadow-sm sm:flex-row sm:items-center sm:justify-between md:p-8">
        <div className="flex items-center gap-4">
          <span className="text-5xl font-bold leading-none tracking-tight text-gray-950">{zahl(GESAMTWERTUNG.sterne)}</span>
          <span>
            <Sterne wert={GESAMTWERTUNG.sterne} groesse={22} />
            <span className="mt-1.5 block text-sm text-gray-600">{GESAMTWERTUNG.anzahl} Bewertungen bei Google</span>
          </span>
        </div>
        <a
          href={GOOGLE_PROFIL}
          {...externAttribute(GOOGLE_PROFIL)}
          className="cc-gradient-button inline-flex w-fit items-center justify-center gap-2 rounded-full border px-6 py-3.5 text-sm font-bold text-white"
        >
          Alle Bewertungen auf Google lesen
          <ExternMarke href={GOOGLE_PROFIL} groesse={15} />
        </a>
      </div>

      {bewertungen.length > 0 && (
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {bewertungen.map((b) => (
            <li key={`${b.name}-${b.datum}`} className="cc-karte flex flex-col rounded-2xl border border-gray-100 p-6 shadow-sm">
              <Sterne wert={b.sterne} />
              <span className="sr-only">{b.sterne} von 5 Sternen</span>
              <blockquote className="mt-4 flex-grow text-sm leading-relaxed text-gray-700">„{b.text}“</blockquote>
              <p className="mt-4 text-xs font-bold uppercase tracking-[0.14em] text-gray-950">
                {b.name} <span className="font-semibold normal-case tracking-normal text-gray-600">· {b.datum} · Google</span>
              </p>
            </li>
          ))}
        </ul>
      )}

      <p className="mt-6 max-w-3xl text-xs leading-relaxed text-gray-600">
        Hinweis zu den Bewertungen: Sie stammen aus unserem Google-Unternehmensprofil
        {bewertungen.length > 0 ? ', die gezeigten sind eine Auswahl und wörtlich übernommen' : ''}. Google überprüft
        Rezensionen nach eigener Angabe nicht, entfernt aber gefälschte Inhalte, die es findet. Wir selbst prüfen nicht, ob
        die Verfasser bei uns Kunde waren. Alle Bewertungen finden Sie im Profil.
      </p>
    </div>
  </section>
);

export default GoogleBewertungen;
