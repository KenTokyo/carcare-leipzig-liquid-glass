import { TargetGroupPartner } from '../types';

/**
 * Referenzpartner des Betriebs — Single Source of Truth.
 *
 * Gelesen von:
 *  - `components/TargetGroupCards.tsx` → Kacheln „Für wen wir arbeiten" (Startseite)
 *  - `pages/BusinessCustomersPage.tsx` → Geschäftskundenseite
 *
 * ⚠️ LOGOS UND LINKS NUR MIT FREIGABE. Volkswagen, Audi und Porsche sind eingetragene
 * Marken; Versicherer-Logos ebenso. Ohne schriftliche Freigabe des Partners steht nur der
 * NAME — und ein Herstellerlogo auf einer freien Werkstatt kann den unzutreffenden
 * Eindruck einer autorisierten Vertragspartnerschaft erwecken (Irrefuehrung nach UWG).
 *
 * FREIGABEN (Stand 2026-09-16, Protokoll in `docs/partnerlogos/README.md`):
 *   - Porsche Zentrum Leipzig — Link ja, Logo NEIN: Die Wortmarke gehoert der Porsche AG,
 *     nicht dem Autohaus; deren Lizenz schliesst die Nutzung hier aus. Logo nur, wenn das
 *     Autohaus eine Datei samt Nutzungsrecht liefert.
 *   - riparo — Link und Logo (Schadensteuerer, siehe `claimsPartners`)
 *
 * WEITERE FREIGABE = drei Schritte: Original nach `docs/partnerlogos/quelle/`, eine Zeile in
 * `scripts/build-partner-logos.mjs`, hier `logo`, `logoBreite`, `logoHoehe`, `url` setzen.
 */

/** Autohaus- und Werkspartner (Stand 2026-07-24, vom Betrieb benannt). */
export const dealerPartners: TargetGroupPartner[] = [
  { name: 'Volkswagen Automobile Leipzig' },
  { name: 'Audi Zentrum Leipzig' },
  // Freigabe 2026-09-16. `porsche-leipzig.de` ist die Adresse des Autohauses selbst und leitet
  // auf die aktuelle Porsche-Plattform weiter — sie ueberlebt deren naechsten Umbau.
  { name: 'Porsche Zentrum Leipzig', url: 'https://www.porsche-leipzig.de/' },
  { name: 'Porsche Werk Leipzig' },
  { name: 'Autohaus Otto Grimm' },
];

/**
 * Schadensteuerer (seit 2026-09-16). EIGENE Liste, weil sie keine Versicherer sind — die
 * Geschaeftskundenseite zaehlt „Mit diesen N Versicherern" aus `insurancePartners`, und
 * ein Schadensteuerer darin machte die Zahl falsch.
 *
 * riparo gmbh, Holzgerlingen: Schadenmanagement im Auftrag von Versicherern (Gesellschafter
 * u. a. Provinzial, R+V, Wuerttembergische). Marke durchgehend kleingeschrieben.
 */
export const claimsPartners: TargetGroupPartner[] = [
  {
    name: 'riparo',
    logo: '/assets/partner/riparo.webp',
    logoBreite: 208,
    logoHoehe: 50,
    logoIstName: true,
    url: 'https://riparo.de/',
  },
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
