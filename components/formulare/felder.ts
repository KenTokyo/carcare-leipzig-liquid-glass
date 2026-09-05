import type React from 'react';

/**
 * Gemeinsame Grundlage der vier Formularvarianten.
 *
 * Der Schnitt entstand am 2026-09-05: `RequestForm.tsx` stand bei 654 Zeilen bei einer
 * Projektgrenze von 700, und der anstehende Umbau des Schadenformulars (Backlog 3.36)
 * haette sie gesprengt. Die Variantenbloecke liegen deshalb einzeln in
 * `components/formulare/`; `RequestForm` behaelt Rahmen, Zustand und Versand.
 *
 * BEWUSST EIN REINER UMZUG. Dieser Schritt aendert kein Verhalten — er ist ein eigener
 * Commit vor dem inhaltlichen Umbau, damit Refactoring und neue Felder nicht in
 * demselben Diff liegen und einzeln nachvollziehbar bleiben.
 */

interface FormFieldsByKind {
  /**
   * Offen typisiert, weil die Feldliste DATEN sind: `data/schadenFelder.ts`. Ein fester
   * Typ muesste bei jedem gestrichenen Feld mitgepflegt werden — genau die zweite
   * Stelle, die der datengetriebene Aufbau vermeiden soll. Die verbindliche Pruefung
   * macht ohnehin der Server gegen dieselbe Quelle (`data/anfrageSchema.ts`).
   */
  schaden: Record<string, string>;
  termin: {
    name: string;
    phone: string;
    email: string;
    vehicle: string;
    service: string;
    /** Mehrfachauswahl, Quelle: `data/zusatzleistungen.ts` (Backlog 1.18). */
    zusatzleistungen: string[];
    preferredDate: string;
    description: string;
  };
  business: {
    company: string;
    contact: string;
    phone: string;
    email: string;
    partnerType: string;
    description: string;
  };
  bewerbung: {
    name: string;
    email: string;
    phone: string;
    position: string;
    description: string;
  };
}

export type { FormFieldsByKind };

/** Einheitliches Aussehen aller Eingabefelder. */
export const inputClass =
  'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all';

/** Einheitliches Aussehen aller Feldbeschriftungen. */
export const labelClass = 'block text-xs font-bold uppercase tracking-[0.15em] text-gray-600 mb-2';

/** Signatur des Aenderungshandlers, den alle Varianten bekommen. */
export type FeldAenderung = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
) => void;
