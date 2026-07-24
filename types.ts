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
   * Monochromes Logo mit transparentem Hintergrund (SVG bevorzugt, sonst WebP/PNG),
   * abgelegt unter `/public/assets/partner/`.
   *
   * OPTIONAL und aktuell bei allen Partnern LEER: Herstellerlogos sind geschuetzte
   * Marken und duerfen nur mit schriftlicher Freigabe des jeweiligen Partners
   * eingebunden werden (siehe Kommentar an der Partnerliste in TargetGroupCards).
   * Ohne Datei zeigt die Kachel nur den Namen — das Raster bleibt identisch, die
   * Logos lassen sich also spaeter ohne Layout-Aenderung nachruesten.
   */
  logo?: string;
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
   * Referenzpartner, die auf der Kachel namentlich genannt werden.
   *
   * Darstellung richtet sich nach der Anzahl (siehe TargetGroupCards):
   * bis 8 Partner als Raster mit Logo-Slot, darueber als kompakter Fliesstext —
   * 31 Versicherer im Raster waeren rund 350 px hoch und wuerden die Kachel sprengen.
   */
  partners?: TargetGroupPartner[];
  /** Ueberschrift ueber der Partnerliste. Default: „Partnerbetriebe". */
  partnersLabel?: string;
  /**
   * Viewporthoehe, unter der die Partnerliste auf Desktop weicht.
   *
   * Pro Kachel unterschiedlich, weil die Kachelhoehe mit dem Stapelindex abnimmt
   * (`100svh - i x --bar`): Die Versicherungs-Kachel hat ~112 px mehr Inhalt als die
   * Gewerbe-Kachel und vertraegt die Liste deshalb bis zu einer niedrigeren Schwelle.
   * Nur diese beiden Werte, damit die Klassen fuer Tailwind statisch bleiben.
   */
  partnersHideBelow?: 760 | 860;
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

export type RequestFormKind = 'schaden' | 'termin' | 'business';

export interface RequestFormConfig {
  kind: RequestFormKind;
  label: string;
  description: string;
  iconName: string;
}
