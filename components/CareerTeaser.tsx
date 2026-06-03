import React from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Paintbrush, Cog, User, ArrowRight } from 'lucide-react';

const jobs = [
  { title: 'Kfz-Aufbereiter', area: 'Aufbereitung', icon: <Briefcase size={22} /> },
  { title: 'Fahrzeuglackierer', area: 'Lackierung', icon: <Paintbrush size={22} /> },
  { title: 'Karosserie- und Fahrzeugbaumechaniker', area: 'Karosserie', icon: <Cog size={22} /> },
  { title: 'Serviceberater', area: 'Kundenbetreuung', icon: <User size={22} /> },
];

const CareerTeaser: React.FC = () => {
  return (
    <section id="karriere" aria-labelledby="career-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Karriere bei CarCare</span>
            <h2 id="career-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
              Dein Job bei CarCare: Fahrzeuge, Qualität und ein starkes Team.
            </h2>
            <p className="mt-6 text-base leading-relaxed text-gray-600 md:text-lg">
              Ob Aufbereitung, Lackierung, Karosserie oder Service: Bei CarCare arbeitest du in einem professionellen Umfeld, in dem saubere Arbeit zählt.
            </p>
            <a href="/kontakt" className="mt-7 inline-flex items-center gap-2 font-bold text-gray-950 transition-colors hover:text-blue-700">
              Initiativ bewerben
              <ArrowRight size={16} />
            </a>
          </motion.div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {jobs.map((job, idx) => (
              <motion.article
                key={job.title}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                className="group rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
              >
                <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700 transition-colors group-hover:bg-blue-600 group-hover:text-white">
                  {job.icon}
                </div>
                <h3 className="text-xl font-bold leading-tight text-gray-950">{job.title}</h3>
                <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-[0.16em] text-gray-500">
                  <span className="rounded-full bg-gray-50 px-3 py-1">{job.area}</span>
                  <span className="rounded-full bg-gray-50 px-3 py-1">Leipzig</span>
                  <span className="rounded-full bg-gray-50 px-3 py-1">Vollzeit</span>
                </div>
              </motion.article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CareerTeaser;
