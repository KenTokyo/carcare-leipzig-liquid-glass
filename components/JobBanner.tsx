import React from 'react';
import { ArrowRight, BriefcaseBusiness } from 'lucide-react';
import { offeneStellen } from '../data/jobs';

/**
 * „Jetzt bewerben"-Banner oben auf `/karriere` (Backlog 1.23).
 *
 * WARUM ALS EIGENE SEKTION UNTER DEM HERO und nicht darueber: Ueber dem Hero laege es
 * hinter der schwebenden Navigationsleiste (`PageHero` traegt nicht ohne Grund
 * `pt-32`). Direkt darunter ist es die erste Sache nach der Ueberschrift und damit
 * genauso weit oben, wie die Vorgabe meint.
 *
 * WARUM ES DEN BESTEHENDEN CTA NICHT VERDOPPELT: Der Hero-CTA heisst „Initiativ
 * bewerben" und richtet sich an alle. Dieses Banner nennt die KONKRETE Zahl offener
 * Stellen — es sagt etwas, was der Hero nicht sagt, statt denselben Satz lauter zu
 * wiederholen. Faellt die Zahl auf null, verschwindet das Banner; ein Aufruf zur
 * Bewerbung auf nichts waere schlechter als keiner.
 */

interface JobBannerProps {
  /** Ziel des Handlungsaufrufs. */
  href: string;
}

const JobBanner: React.FC<JobBannerProps> = ({ href }) => {
  const anzahl = offeneStellen.length;
  if (anzahl === 0) return null;

  return (
    <section className="bg-white px-6 pb-4 pt-2 md:pb-8">
      <div className="container mx-auto">
        <div className="flex flex-col gap-5 rounded-[1.5rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 md:flex-row md:items-center md:justify-between md:p-8">
          <div className="flex items-start gap-4">
            <span className="mt-0.5 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
              <BriefcaseBusiness size={20} />
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.22em] text-blue-600">
                {anzahl === 1 ? 'Eine offene Stelle' : `${anzahl} offene Stellen`}
              </p>
              <p className="mt-1.5 text-lg font-bold leading-tight tracking-tight text-gray-950 md:text-xl">
                {offeneStellen.map((job) => job.title).join(' · ')}
              </p>
              <p className="mt-2 text-sm leading-relaxed text-gray-600">
                Bewerbung mit Name, Kontakt und ein paar Sätzen zu Ihrer Erfahrung — Lebenslauf gern,
                aber nicht zwingend.
              </p>
            </div>
          </div>
          <a
            href={href}
            className="cc-gradient-button inline-flex w-fit shrink-0 items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white"
          >
            Jetzt bewerben
            <ArrowRight size={16} />
          </a>
        </div>
      </div>
    </section>
  );
};

export default JobBanner;
