export interface ServiceItem {
  id: string;
  title: string;
  description: string;
  longDescription?: string;
  category: 'Pflege' | 'Reparatur' | 'Spezial';
  iconName: string;
  image?: string;
  price?: string;
}

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
}

export interface OverviewService {
  id: string;
  title: string;
  description: string;
  iconName: string;
  href: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface ProcessStep {
  step: number;
  title: string;
  description: string;
}

export interface TimelineTab {
  id: string;
  label: string;
  iconName: string;
  intro: string;
  steps: ProcessStep[];
}

export interface ReferencePoint {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface BusinessBenefit {
  id: string;
  title: string;
  description: string;
  iconName: string;
}

export interface KnowledgeCard {
  id: string;
  title: string;
  description: string;
  href: string;
  iconName: string;
}

export type RequestFormKind = 'schaden' | 'termin' | 'business';

export interface RequestFormConfig {
  kind: RequestFormKind;
  label: string;
  description: string;
  iconName: string;
}
