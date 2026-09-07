import {
  AlertTriangle,
  Building2,
  CalendarClock,
  CircleDot,
  MapPin,
  Phone,
  Sparkles,
  User,
  Wrench,
  type LucideIcon,
} from 'lucide-react';
import { serviceGroups, servicesByGroup } from './services';

/**
 * Menuebaum der globalen Navigation.
 *
 * WARUM ABGELEITET UND NICHT GETIPPT: Bis 2026-09-07 fuehrte `Navbar.tsx` eine eigene
 * Liste von vier Menuekarten. Sie war mit `data/services.ts` nur zufaellig deckungsgleich
 * — `Felgenreparatur` und `Autoglas / Scheibenfolien` fehlten in der Navigation
 * vollstaendig und waren nur ueber `/leistungen` erreichbar. Genau dieselbe Doppelpflege
 * hatte 2026-08-03 schon zwischen Startseite und `/leistungen` zugeschlagen.
 *
 * Neue Leistungen werden deshalb ausschliesslich in `data/services.ts` ergaenzt und
 * erscheinen hier von selbst.
 */

/** Lucide-Icons, auf die `navIconName` in `data/services.ts` zeigen darf. */
const GRUPPEN_ICONS: Record<string, LucideIcon> = {
  Sparkles,
  Wrench,
  CircleDot,
  Building2,
};

export interface NavChild {
  label: string;
  href: string;
}

export interface NavCard {
  id: string;
  icon: LucideIcon;
  label: string;
  description: string;
  href: string;
  /** Dritte Ebene. Leer = die Karte klappt nicht auf. */
  children: NavChild[];
}

export interface NavSection {
  label: string;
  cards: NavCard[];
  /** Schmale Zusatzzeile unter den Karten; ohne Eintraege wird sie nicht gerendert. */
  footerLabel?: string;
  footerLinks?: NavChild[];
}

/**
 * Eine Gruppe wird zu einer Karte: Der als `groupHub` markierte Katalogeintrag liefert
 * das Ziel, alle uebrigen Eintraege der Gruppe werden zur dritten Ebene.
 *
 * Fehlt der Hub (`rad-glas` hat keine gemeinsame Uebersichtsseite), zeigt die Karte auf
 * den Abschnitt in `/leistungen`. Sie bleibt damit anklickbar statt zur toten
 * Ueberschrift zu werden — die dritte Ebene ist eine Ergaenzung, kein Ersatz fuer das
 * Ziel der Karte.
 */
const leistungsKarten: NavCard[] = serviceGroups.map((gruppe) => {
  const eintraege = servicesByGroup(gruppe.id);
  const hub = eintraege.find((eintrag) => eintrag.groupHub);
  const icon = GRUPPEN_ICONS[gruppe.navIconName];

  if (!icon) {
    throw new Error(
      `data/navigation.ts: Unbekanntes Icon "${gruppe.navIconName}" fuer Gruppe "${gruppe.id}". ` +
        'Icon in GRUPPEN_ICONS ergaenzen.'
    );
  }

  return {
    id: gruppe.id,
    icon,
    label: gruppe.navLabel,
    description: gruppe.navDescription,
    href: hub ? hub.href : `/leistungen#${gruppe.anchor}`,
    children: eintraege
      .filter((eintrag) => eintrag !== hub)
      .map((eintrag) => ({ label: eintrag.title, href: eintrag.href })),
  };
});

/**
 * Zielgruppenseiten stehen bewusst NICHT als fuenfte Karte.
 *
 * `Privatkunden` ist keine Leistungsgruppe und haette als einzige Karte keine dritte
 * Ebene — eine von fuenf Karten, die sich anders verhaelt, liest sich als Fehler. Beide
 * Seiten beantworten ausserdem eine andere Frage („fuer wen?" statt „was?") und stehen
 * deshalb in einer eigenen, schmalen Zeile darunter.
 */
const zielgruppenLinks: NavChild[] = [
  { label: 'Privatkunden', href: '/privatkunden' },
  { label: 'Geschäftskunden', href: '/geschaeftskunden' },
];

const kontaktKarten: NavCard[] = [
  {
    id: 'kontakt-anfahrt',
    icon: MapPin,
    label: 'Kontakt & Anfahrt',
    description: 'Ansprechpartner & Standort Leipzig',
    href: '/kontakt',
    children: [],
  },
  {
    id: 'kontakt-schaden',
    icon: AlertTriangle,
    label: 'Schaden melden',
    description: 'Online-Schadenformular ausfüllen',
    href: '/kontakt#contact-schaden',
    children: [],
  },
  {
    id: 'kontakt-termin',
    icon: CalendarClock,
    label: 'Termin anfragen',
    description: 'Aufbereitung & Reparatur buchen',
    href: '/kontakt#contact-termin',
    children: [],
  },
  {
    id: 'kontakt-telefon',
    icon: Phone,
    label: 'Direkt anrufen',
    description: '0341 - 261 77 90',
    href: 'tel:+493412617790',
    children: [],
  },
];

export const navSections: Record<string, NavSection> = {
  leistungen: {
    label: 'Leistungen',
    cards: leistungsKarten,
    footerLabel: 'Für wen?',
    footerLinks: zielgruppenLinks,
  },
  kontakt: {
    label: 'Kontakt',
    cards: kontaktKarten,
  },
};

/** Nur fuer den Zielgruppen-Block; `User` haengt sonst ungenutzt im Import. */
export const zielgruppenIcon: LucideIcon = User;
