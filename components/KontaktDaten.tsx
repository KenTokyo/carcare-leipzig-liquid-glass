import React from 'react';
import { Clock, MapPin, Phone } from 'lucide-react';

/**
 * Adresse, Oeffnungszeiten und Telefon — Backlog 2.6.
 *
 * WARUM EIGENSTAENDIG: Diese drei Karten steckten bis 2026-09-06 fest im
 * Kontaktformular-Block (`ContactSection`). Als das Formular von der Startseite genommen
 * wurde, waeren sie mit verschwunden — und damit die einzigen Kontaktdaten oberhalb des
 * Footers. Der Auftrag lautete ausdruecklich, das Formular von den Adressdaten zu
 * ENTKOPPELN, nicht beides zu entfernen.
 *
 * ZWEI EINSATZORTE, EIN BAUSTEIN:
 *  - eingebettet   → nur die drei Karten, unter dem Formular auf `/kontakt`
 *  - eigenstaendig → eigene Sektion mit Ueberschrift und Handlungsaufruf, auf der
 *                    Startseite an der Stelle, an der frueher das Formular stand
 *
 * Der Handlungsaufruf zeigt bewusst auf `#contact-termin`: Dieses Sprungziel faengt der
 * Anfrage-Dialog global ab (`ANFRAGE_ZIELE`). So oeffnet der Knopf das Pop-up, ohne dass
 * diese Komponente den Dialog kennen muss — und bleibt ein echter Link, der auch dann
 * irgendwo hinfuehrt, wenn das Abfangen einmal ausfaellt.
 */

const KARTEN = [
  {
    icon: <MapPin size={18} />,
    titel: 'Adresse',
    inhalt: (
      <p className="text-sm leading-relaxed text-gray-600">
        An den Tierkliniken 42
        <br />
        04103 Leipzig
      </p>
    ),
  },
  {
    icon: <Clock size={18} />,
    titel: 'Öffnungszeiten',
    inhalt: (
      <p className="text-sm leading-relaxed text-gray-600">
        Mo - Fr: 07:00 - 18:00 Uhr
        <br />
        Sa: nach Vereinbarung
      </p>
    ),
  },
  {
    icon: <Phone size={18} />,
    titel: 'Telefon',
    inhalt: (
      <>
        <a href="tel:+493412617790" className="text-lg font-bold tracking-tight text-gray-950 transition-colors hover:text-blue-600">
          0341 - 261 77 90
        </a>
        <p className="mt-2 text-sm leading-relaxed text-gray-600">
          Für akute Schadenfälle ist der direkte Anruf oft der schnellste Weg.
        </p>
      </>
    ),
  },
];

const Karten: React.FC = () => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
    {KARTEN.map((k) => (
      <div key={k.titel} className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
        <div className="mb-3 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600">{k.icon}</span>
          <h3 className="text-sm font-bold text-gray-950">{k.titel}</h3>
        </div>
        {k.inhalt}
      </div>
    ))}
  </div>
);

const KontaktDaten: React.FC<{ eingebettet?: boolean }> = ({ eingebettet = false }) => {
  if (eingebettet) return <div className="mt-10"><Karten /></div>;

  return (
    <section id="kontakt-daten" aria-labelledby="kontakt-daten-heading" className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="mb-12 max-w-3xl md:mb-16">
          <span className="mb-4 block text-xs font-bold uppercase tracking-[0.24em] text-blue-600">Kontakt</span>
          <h2 id="kontakt-daten-heading" className="text-3xl font-bold leading-tight tracking-tight text-gray-950 md:text-5xl">
            Sprechen Sie uns an.
          </h2>
          <p className="mt-5 text-base leading-relaxed text-gray-600 md:text-lg">
            Schadenmeldung, Aufbereitungstermin oder Anfrage als Geschäftskunde: Ihre Anfrage
            öffnet sich direkt hier auf der Seite. Für akute Fälle erreichen Sie uns am
            schnellsten telefonisch.
          </p>
          <a
            href="#contact-termin"
            className="cc-gradient-button mt-8 inline-flex items-center justify-center rounded-full px-7 py-4 text-sm font-bold text-white"
          >
            Anfrage stellen
          </a>
        </div>
        <Karten />
      </div>
    </section>
  );
};

export default KontaktDaten;
