import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight } from 'lucide-react';
import { TargetGroup } from '../types';

/**
 * Standard-Hintergrundbild der Kacheln.
 * Zum Tauschen: entweder diese Konstante aendern (gilt fuer alle Kacheln ohne
 * eigenes Bild) ODER pro Kachel das Feld `backgroundImage` unten setzen.
 * Neue Bilder in `public/assets/` ablegen und den Pfad hier eintragen.
 */
const DEFAULT_CARD_BG = '/assets/carcare-hero-workshop.webp';

/** Animierte CarCare-Marke fuer das Logo-Badge unten rechts. */
const logoMarkVideoSrc = '/assets/carcare-center-mark-animated.mp4';

const groups: TargetGroup[] = [
  {
    id: 'privatkunden',
    title: 'Privatkunden',
    description: 'Fahrzeugpflege, Smart Repair, Leasingrückgabe und schnelle Hilfe bei Schäden.',
    cta: 'Für Privatkunden',
    iconName: 'User',
    href: '/fahrzeugaufbereitung-leipzig',
    backgroundImage: DEFAULT_CARD_BG,
  },
  {
    id: 'versicherungen',
    title: 'Versicherungen & Agenturen',
    description: 'Zuverlässige Schadenaufnahme, klare Kommunikation und strukturierte Reparaturprozesse.',
    cta: 'Schadenpartner kennenlernen',
    iconName: 'ShieldCheck',
    href: '/unfallinstandsetzung-leipzig',
    backgroundImage: DEFAULT_CARD_BG,
  },
  {
    id: 'gewerbe',
    title: 'Autohäuser & Fuhrparks',
    description: 'Professionelle Fahrzeugdienstleistungen mit festen Ansprechpartnern und planbaren Abläufen.',
    cta: 'Geschäftskundenservice ansehen',
    iconName: 'Building2',
    href: '/geschaeftskunden',
    backgroundImage: '/assets/kacheln/fuhrparkservice-leipzig-carcare.webp',
  },
];

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

        <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
          {groups.map((group, idx) => (
            <motion.a
              key={group.id}
              href={group.href}
              aria-label={`${group.title} – ${group.cta}`}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.45, delay: idx * 0.05 }}
              whileHover={{ y: -4 }}
              className="group relative flex min-h-[280px] overflow-hidden rounded-2xl shadow-[0_26px_60px_-32px_rgb(var(--cc-carbon-rgb)/0.55)] transition-shadow hover:shadow-[0_34px_80px_-30px_rgb(var(--cc-carbon-rgb)/0.65)] md:min-h-[320px]"
            >
              {/* Layer 1 – Hintergrundbild (pro Kachel austauschbar) */}
              <img
                src={group.backgroundImage ?? DEFAULT_CARD_BG}
                alt=""
                aria-hidden="true"
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
              />
              {/* Subtile Tiefe, damit beliebige Tauschbilder ruhig wirken */}
              <div
                aria-hidden="true"
                className="absolute inset-0 bg-gradient-to-tr from-[rgb(var(--cc-carbon-rgb)/0.30)] via-transparent to-transparent"
              />

              {/* Layer 2 – Textbox (90 % Weiss) + Layer 3 – Text */}
              <div className="relative z-10 m-3 flex max-w-[68%] flex-col rounded-xl bg-[rgb(255_255_255/0.9)] p-6 shadow-[0_10px_30px_-18px_rgb(var(--cc-carbon-rgb)/0.5)] sm:max-w-[60%] md:p-7">
                <h3 className="text-xl font-bold leading-tight tracking-tight text-gray-950 md:text-2xl">
                  {group.title}
                  <span aria-hidden="true" className="ml-1 inline-block h-1.5 w-1.5 rounded-full bg-blue-600 align-top" />
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-gray-600">{group.description}</p>
                <div className="mt-auto flex items-center justify-between gap-3 pt-8">
                  <span className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-900">{group.cta}</span>
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-950 text-white transition-transform duration-300 group-hover:rotate-45">
                    <ArrowUpRight size={16} />
                  </span>
                </div>
              </div>

              {/* Logo-Badge unten rechts – CarCare-Marke (Kachel ist klickbar) */}
              <span className="absolute bottom-3 right-3 z-20 flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-lg ring-1 ring-gray-200 transition-transform duration-300 group-hover:scale-105 md:h-14 md:w-14">
                <video
                  src={logoMarkVideoSrc}
                  className="h-full w-full object-contain"
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="metadata"
                  aria-hidden="true"
                />
              </span>
            </motion.a>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TargetGroupCards;
