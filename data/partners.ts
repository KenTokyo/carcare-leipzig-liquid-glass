import { TargetGroupPartner } from '../types';

/**
 * Referenzpartner des Betriebs — Single Source of Truth.
 *
 * Gelesen von:
 *  - `components/TargetGroupCards.tsx` → Kacheln „Für wen wir arbeiten" (Startseite)
 *  - `pages/BusinessCustomersPage.tsx` → Geschäftskundenseite
 *
 * ⚠️ LOGOS BEWUSST NICHT HINTERLEGT. Volkswagen, Audi und Porsche sind eingetragene
 * Marken; Versicherer-Logos ebenso. Ihre Logos duerfen nicht ohne schriftliche Freigabe
 * des jeweiligen Partners eingebunden werden — und ein Herstellerlogo auf einer freien
 * Werkstatt kann den unzutreffenden Eindruck einer autorisierten Vertragspartnerschaft
 * erwecken (Irrefuehrung nach UWG). Die reine NAMENSnennung als Referenz ist davon zu
 * unterscheiden und hier bewusst gewaehlt.
 *
 * Sobald Freigaben und offizielle monochrome Dateien vorliegen: Dateien unter
 * `/public/assets/partner/` ablegen und je Partner das Feld `logo` setzen.
 * Siehe docs/zielgruppen-partner/tasks/.
 */

/** Autohaus- und Werkspartner (Stand 2026-07-24, vom Betrieb benannt). */
export const dealerPartners: TargetGroupPartner[] = [
  { name: 'Volkswagen Automobile Leipzig' },
  { name: 'Audi Zentrum Leipzig' },
  { name: 'Porsche Zentrum Leipzig' },
  { name: 'Porsche Werk Leipzig' },
  { name: 'Autohaus Otto Grimm' },
];

/** Versicherer, mit denen CarCare Schadenfaelle abwickelt (Stand 2026-07-24). */
export const insurancePartners: TargetGroupPartner[] = [
  { name: 'HUK Coburg' },
  { name: 'HUK 24' },
  { name: 'Gothaer Versicherung' },
  { name: 'Debeka' },
  { name: 'VHV Versicherung' },
  { name: 'Dialog' },
  { name: 'Cosmos Direkt' },
  { name: 'vrk+' },
  { name: 'Generali' },
  { name: 'janitos' },
  { name: 'Concordia Versicherung' },
  { name: 'Alte Leipziger' },
  { name: 'Barmenia' },
  { name: 'Continentale' },
  { name: 'Deutsche Post' },
  { name: 'Ecclesia' },
  { name: 'freeyou ag' },
  { name: 'Friday Insurance' },
  { name: 'GVV' },
  { name: 'Helvetia' },
  { name: 'Itzehoer' },
  { name: 'Nexible' },
  { name: 'Nürnberger' },
  { name: 'Provinzial' },
  { name: 'R+V' },
  { name: 'S-direkt' },
  { name: 'Signal Iduna' },
  { name: 'Verti' },
  { name: 'Volkswohl Bund' },
  { name: 'Wefox' },
  { name: 'Württembergische Versicherung' },
];
