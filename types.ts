export interface JobOffer {
  id: string;
  title: string;
  type: string;
  location: string;
}

export interface NavLink {
  label: string;
  href: string;
}

/** Ein namentlich genannter Referenzpartner auf einer Zielgruppen-Kachel. */
export interface TargetGroupPartner {
  /** Firmierung wie vom Partner selbst verwendet. */
  name: string;
  /**
   * Monochromes Logo mit transparentem Hintergrund, abgelegt unter
   * `/public/assets/partner/`, erzeugt mit `npm run partnerlogos`.
   *
   * NUR MIT SCHRIFTLICHER FREIGABE des Partners — und nur, wenn der Partner die Rechte an
   * der Marke hat. Beispiel Porsche Zentrum Leipzig (2026-09-16): Das Autohaus hat
   * freigegeben, die Wortmarke gehoert aber der Porsche AG, deren Lizenz die Nutzung
   * ausserhalb von Porsche-Anwendungen ausschliesst. Dort steht deshalb nur der Link.
   * Vorgehen: `docs/partnerlogos/README.md`. Ohne Datei zeigt die Liste nur den Namen.
   */
  logo?: string;
  /** Pixelmasse der Logodatei — gegen Layout-Verschiebung (SEO-GEO §2.2). Pflicht mit `logo`. */
  logoBreite?: number;
  logoHoehe?: number;
  /**
   * Das Logo ist eine reine Wortmarke (z. B. „riparo"). Dann steht der Name nur fuer
   * Vorlesegeraete daneben — sichtbar stuende er sonst doppelt da.
   */
  logoIstName?: boolean;
  /**
   * Offizielle Website des Partners. Gesetzt nur bei freigegebenen Partnern — der Link
   * oeffnet in einem neuen Tab, ohne Referer (`components/ExternerLink.tsx`).
   */
  url?: string;
}

export interface TargetGroup {
  id: string;
  title: string;
  description: string;
  cta: string;
  iconName: string;
  href: string;
  accent?: 'light' | 'dark';
  /** Hintergrundbild der Kachel (Pfad in /public/assets). Pro Kachel frei austauschbar. */
  backgroundImage?: string;
  /** Zweiter CTA neben `cta`/`href`, im blauen CI-Verlauf gesetzt. */
  secondaryCta?: { label: string; href: string };
  /**
   * Referenzpartner, die auf der Kachel namentlich genannt werden — egal wie viele, immer
   * im selben Raster (`components/ZielgruppenPartner.tsx`). Die Liste nimmt den Platz, der
   * in der Kachel frei bleibt, und scrollt darin.
   *
   * Bis 2026-09-17 gab es hier `partnersHideBelow`: Unter 860 px Fensterhoehe verschwand die
   * Liste auf Desktop ganz — auf einem Full-HD-Bildschirm mit Browserleisten und Zoom also
   * genau dann, wenn der Kunde hinsah. Entfernt, siehe
   * `docs/zielgruppen-partner-sichtbarkeit/tasks/`.
   */
  partners?: TargetGroupPartner[];
  /** Ueberschrift ueber der Partnerliste. Default: „Partnerbetriebe". */
  partnersLabel?: string;
}

export interface OverviewService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  href: string;
  /** Kurzer CTA-Text der aufgeklappten Karte (z. B. "Zur Aufbereitung"). */
  cta?: string;
  /** Hintergrundbild der Karte (Pfad in /public/assets). Pro Karte austauschbar. */
  backgroundImage?: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export type RequestFormKind = 'schaden' | 'termin' | 'business' | 'bewerbung';

export interface RequestFormConfig {
  kind: RequestFormKind;
  label: string;
  description: string;
  iconName: string;
}
