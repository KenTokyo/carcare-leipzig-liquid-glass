import React from 'react';
import { motion } from 'framer-motion';
import { User, ShieldCheck, Building2, Briefcase, ArrowUpRight } from 'lucide-react';
import { TargetGroup } from '../types';

const groups: TargetGroup[] = [
  {
    id: 'privat',
    title: 'Privatkunden',
    description: 'Fahrzeugpflege, Smart Repair, Leasingrückgabe und schnelle Hilfe bei Schäden.',
    cta: 'Für Privatkunden',
    iconName: 'User',
    href: '#services',
    accent: 'light',
  },
  {
    id: 'versicherung',
    title: 'Versicherungen & Agenturen',
    description: 'Zuverlässige Schadenaufnahme, klare Kommunikation und strukturierte Reparaturprozesse.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    href: '#unfall',
    accent: 'dark',
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    description: 'Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern und planbaren Abläufen.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '#geschaeft',
    accent: 'light',
  },
  {
    id: 'karriere',
    title: 'Bewerber',
    description: 'Arbeiten in einem starken Team mit Fahrzeugen, Qualität und echtem Handwerk.',
    cta: 'Karriere entdecken',
    iconName: 'Briefcase',
    href: '#jobs',
    accent: 'light',
  },
];

const iconMap: Record<string, React.ReactNode> = {
  User: <User size={22} />,
  ShieldCheck: <ShieldCheck size={22} />,
  Building2: <Building2 size={22} />,
  Briefcase: <Briefcase size={22} />,
};

const TargetGroups: React.FC = () => {
  return (
    <div className="bg-white py-24 md:py-32 px-6">
      <div className="container mx-auto">
        <div className="max-w-3xl mb-14 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-4 mb-6">
              <div className="h-[1px] w-12 bg-blue-600" />
              <span className="text-xs font-bold uppercase tracking-[0.25em] text-blue-600">Für wen wir arbeiten</span>
            </div>
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-[1.1]">
              Der richtige Ansprechpartner für Ihr Fahrzeug –{' '}
              <span className="text-gray-400">egal, ob privat, gewerblich oder nach einem Unfall.</span>
            </h2>
          </motion.div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-6">
          {groups.map((group, idx) => {
            const isDark = group.accent === 'dark';
            return (
              <motion.a
                key={group.id}
                href={group.href}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -4 }}
                className={`group relative rounded-[2rem] p-7 md:p-8 border transition-all duration-500 overflow-hidden flex flex-col min-h-[280px] ${
                  isDark
                    ? 'bg-gray-900 text-white border-gray-900 hover:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)]'
                    : 'bg-gray-50/50 text-gray-900 border-gray-100 hover:border-gray-300 hover:shadow-2xl hover:shadow-gray-200/50'
                }`}
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${isDark ? 'bg-white/10 text-white' : 'bg-white text-gray-900 shadow-sm border border-gray-100'}`}>
                  {iconMap[group.iconName]}
                </div>
                <h3 className="text-xl md:text-2xl font-bold leading-snug mb-3">{group.title}</h3>
                <p className={`text-sm leading-relaxed mb-8 ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>{group.description}</p>
                <div className="mt-auto flex items-center justify-between">
                  <span className={`text-[10px] font-bold uppercase tracking-[0.2em] ${isDark ? 'text-white' : 'text-gray-900'}`}>{group.cta}</span>
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-300 ${isDark ? 'bg-white text-gray-900 group-hover:rotate-45' : 'bg-gray-900 text-white group-hover:rotate-45'}`}>
                    <ArrowUpRight size={16} />
                  </div>
                </div>
              </motion.a>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TargetGroups;
