import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

export interface MegaItem {
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
}

export interface MegaSection {
  label: string;
  items: MegaItem[];
}

interface NavMegaMenuProps {
  activeKey: string | null;
  sections: Record<string, MegaSection>;
  onNavigate: (e: React.MouseEvent<HTMLAnchorElement>, href: string, closeAll?: boolean) => void;
  onMouseEnter: () => void;
  onMouseLeave: () => void;
}

/**
 * Breites Hover-Mega-Menü unter der globalen Navbar.
 * - Positioniert absolut im nav-shell -> spannt exakt die Navbar-Breite (left-0/right-0),
 *   geht nie über die Außenkanten hinaus und ist per Offset leicht abgesetzt.
 * - Nur Desktop (xl:block); mobil greift das bestehende Menü.
 */
const NavMegaMenu: React.FC<NavMegaMenuProps> = ({ activeKey, sections, onNavigate, onMouseEnter, onMouseLeave }) => {
  const section = activeKey ? sections[activeKey] : null;

  return (
    <AnimatePresence>
      {section && (
        <motion.div
          key={activeKey}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 6 }}
          transition={{ duration: 0.16, ease: 'easeOut' }}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="pointer-events-auto absolute left-0 right-0 top-[calc(100%+14px)] z-50 hidden rounded-[22px] border border-black/[0.05] bg-white p-5 shadow-[0_30px_70px_-34px_rgb(var(--cc-carbon-rgb)/0.4)] xl:block"
        >
          <div className="mb-4 border-b border-gray-100 px-1 pb-3">
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-[rgb(var(--cc-graphite-rgb)/0.62)]">
              {section.label}
            </span>
          </div>

          <div className="grid grid-cols-4 gap-3">
            {section.items.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => onNavigate(e, item.href, true)}
                  className="group flex min-h-[132px] flex-col rounded-2xl border border-black/[0.04] bg-gray-50/70 p-5 transition-colors duration-200 hover:border-blue-100 hover:bg-gray-100/70"
                >
                  <span className="text-[rgb(var(--cc-graphite-rgb)/0.5)] transition-colors duration-200 group-hover:text-blue-600">
                    <Icon size={20} strokeWidth={1.75} aria-hidden="true" />
                  </span>
                  <span className="mt-auto pt-6 text-[15px] font-bold leading-tight tracking-tight text-[var(--cc-carbon)]">
                    {item.label}
                  </span>
                  <span className="mt-1 text-[12.5px] leading-snug text-[rgb(var(--cc-graphite-rgb)/0.6)]">
                    {item.description}
                  </span>
                </a>
              );
            })}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NavMegaMenu;
