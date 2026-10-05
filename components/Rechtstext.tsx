import React from 'react';

/**
 * Bausteine der Rechtsseiten (Impressum, Datenschutzerklärung).
 *
 * WARUM EIGENE BAUSTEINE (2026-10-04): Beide Seiten sind langer Fließtext mit derselben Gliederung. Bis dahin standen
 * `Abschnitt` und `Angabe` nur im Impressum; die Datenschutzerklärung hätte sie kopiert.
 *
 * `break-words` AM RAHMEN: `datenschutzbeauftragter@carcare-center.de` ist breiter als die Textspalte eines
 * 375-px-Telefons und ragte sonst seitlich heraus.
 */

export const RechtstextRahmen: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <section className="bg-white px-6 py-20 md:py-28">
    <div className="container mx-auto max-w-3xl break-words">{children}</div>
  </section>
);

/** h2-Abschnitt. `id` für Sprungmarken (z. B. `/impressum#ki-verzeichnis`); `scroll-mt` hält ihn unter der Navbar frei. */
export const Abschnitt: React.FC<{ id?: string; title: string; children: React.ReactNode }> = ({ id, title, children }) => (
  <section id={id} className="mt-14 scroll-mt-28 first:mt-0">
    <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">{title}</h2>
    {children}
  </section>
);

export const Unterabschnitt: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <div className="mt-8 first:mt-0">
    <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-950">{title}</h3>
    {children}
  </div>
);

export const Absatz: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-4 text-base leading-relaxed text-gray-600 first:mt-0">{children}</p>
);

/** Anschriften und ähnliche Blöcke: dunkler als der Fließtext, Zeilen per `<br />`. */
export const Anschrift: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="mt-4 text-base leading-relaxed text-gray-950 first:mt-0">{children}</p>
);

export const Aufzaehlung: React.FC<{ punkte: React.ReactNode[] }> = ({ punkte }) => (
  <ul className="mt-4 space-y-3">
    {punkte.map((punkt, i) => (
      <li key={i} className="flex gap-3 text-base leading-relaxed text-gray-600">
        <span aria-hidden="true" className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-600" />
        <span>{punkt}</span>
      </li>
    ))}
  </ul>
);

/** Eine Zeile einer Angabenliste. Bewusst `<dl>`, nicht Tabelle: es sind Paare, keine Matrix. */
export const Angabe: React.FC<{ label: React.ReactNode; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid gap-1 border-b border-gray-200 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
    <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">{label}</dt>
    <dd className="text-base leading-relaxed text-gray-950">{children}</dd>
  </div>
);

/** Interner Link, `mailto:` oder `tel:` im Fließtext. Externe Ziele laufen über `ExternerLink`. */
export const Verweis: React.FC<{ href: string; children: React.ReactNode }> = ({ href, children }) => (
  <a className="font-semibold text-blue-600 underline" href={href}>
    {children}
  </a>
);
