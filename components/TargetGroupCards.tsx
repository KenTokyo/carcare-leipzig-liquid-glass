import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Building2, Briefcase, ArrowUpRight } from 'lucide-react';
import { TargetGroup } from '../types';

const groups: TargetGroup[] = [
  {
    id: 'privatkunden',
    title: 'Privatkunden',
    description: 'Fahrzeugpflege, Smart Repair, Leasingrückgabe und schnelle Hilfe bei Schäden.',
    cta: 'Für Privatkunden',
    iconName: 'User',
    href: '/fahrzeugaufbereitung-leipzig',
  },
  {
    id: 'versicherungen',
    title: 'Versicherungen & Agenturen',
    description: 'Zuverlässige Schadenaufnahme, klare Kommunikation und strukturierte Reparaturprozesse.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    href: '/unfallinstandsetzung-leipzig',
    accent: 'dark',
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    description: 'Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern und planbaren Abläufen.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '/geschaeftskunden',
  },
  {
    id: 'bewerber',
    title: 'Bewerber',
    description: 'Arbeiten in einem starken Team mit Fahrzeugen, Qualität und echtem Handwerk.',
    cta: 'Karriere entdecken',
    iconName: 'Briefcase',
    href: '/karriere',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  User: <User size={22} />,
  ShieldCheck: <ShieldCheck size={22} />,
  Building2: <Building2 size={22} />,
  Briefcase: <Briefcase size={22} />,
};

const TargetGroupCards: React.FC = () => {
  return (
    <section id="zielgruppen" aria-labelledby="target-groups-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Für wen wir arbeiten</span>
          <h2 id="target-groups-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            Der richtige Ansprechpartner für Ihr Fahrzeug.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Ob privat, gewerblich oder nach einem Unfall: CarCare verbindet persönliche Beratung mit professionellen Werkstattprozessen.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4">
          {groups.map((group, idx) => {
            const isAccent = group.accent === 'dark';
            return (
              <motion.a
                key={group.id}
                href={group.href}
                initial={{ opacity: 0, y: 18 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.45, delay: idx * 0.05 }}
                whileHover={{ y: -4 }}
                className={`group flex min-h-[270px] flex-col rounded-2xl border p-6 transition-all md:p-7 ${
                  isAccent
                    ? 'border-blue-600 bg-blue-600 text-white shadow-[0_24px_70px_-34px_rgb(var(--cc-trust-blue-rgb)/0.9)]'
                    : 'border-gray-100 bg-gray-50/70 text-gray-950 hover:border-blue-200 hover:bg-white hover:shadow-xl hover:shadow-gray-200/60'
                }`}
              >
                <div className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl ${isAccent ? 'bg-white/15' : 'bg-white text-blue-600 shadow-sm ring-1 ring-gray-100'}`}>
                  {iconMap[group.iconName]}
                </div>
                <h3 className="text-xl font-bold leading-tight">{group.title}</h3>
                <p className={`mt-3 text-sm leading-relaxed ${isAccent ? 'text-blue-50' : 'text-gray-600'}`}>{group.description}</p>
                <div className="mt-auto flex items-center justify-between pt-8">
                  <span className={`text-[11px] font-bold uppercase tracking-[0.18em] ${isAccent ? 'text-white' : 'text-gray-900'}`}>{group.cta}</span>
                  <span className={`flex h-9 w-9 items-center justify-center rounded-full transition-transform group-hover:rotate-45 ${isAccent ? 'bg-white text-blue-700' : 'bg-gray-950 text-white'}`}>
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupCards;
