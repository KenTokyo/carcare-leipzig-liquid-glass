import React from 'react';
import { PageHero, PageMeta } from '../components/PageBlocks';

/**
 * Impressum nach § 5 DDG.
 *
 * HERKUNFT DER ANGABEN: Alle hier stehenden Daten sind der bestehenden Kundenseite
 * `www.carcare-center.de/kontakt/impressum.html` entnommen und dort veroeffentlicht.
 * Nichts davon ist hergeleitet, geschaetzt oder aus anderen Quellen ergaenzt.
 *
 * WAS NICHT BELEGT IST, STEHT NICHT DA. Vier Angaben fehlen bewusst; sie sind unten
 * einzeln als TODO markiert. Kein sichtbarer Platzhalter, keine Vermutung — dieselbe
 * Regel wie bei den Benefits (1.18) und der Ausstattungsliste (1.29): ein leeres Feld
 * ist ein ehrlicher Zustand, ein geratenes ist eine falsche Angabe. Und eine falsche
 * Angabe im Impressum ist genau die Sorte Fehler, die der Matomo-Satz im Footer war.
 *
 * DASS DIE LUECKEN UNSICHTBAR SIND, IST DER PREIS DIESER REGEL. Getragen wird er von
 * Backlog 3.33, wo sie als Zulieferung mit dem Vermerk „vor dem Livegang" stehen.
 *
 * E-MAIL BEWUSST IM KLARTEXT: Auf der Altseite ist sie hinter JavaScript verborgen
 * („Diese E-Mail-Adresse ist vor Spambots geschuetzt"). Das Impressum muss unmittelbar
 * erreichbar sein — wer JavaScript blockiert, saehe dort gar keine Adresse.
 */

/** Eine Zeile der Angabenliste. Bewusst `<dl>`, nicht Tabelle: es sind Paare, keine Matrix. */
const Angabe: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="grid gap-1 border-b border-gray-200 py-4 sm:grid-cols-[13rem_1fr] sm:gap-6">
    <dt className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-600">{label}</dt>
    <dd className="text-base leading-relaxed text-gray-950">{children}</dd>
  </div>
);

const Abschnitt: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="mt-14 first:mt-0">
    <h2 className="mb-6 text-2xl font-bold tracking-tight text-gray-950 md:text-3xl">{title}</h2>
    {children}
  </section>
);

const ImpressumPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/impressum"
      title="Impressum | CarCare Center Leipzig"
      description="Impressum der BS CarCare GmbH, An den Tierkliniken 42, 04103 Leipzig. Angaben nach § 5 DDG, Handelsregister, Umsatzsteuer-Identifikationsnummer und Kontakt."
    />
    <PageHero
      eyebrow="Impressum"
      title="Impressum"
      description="Angaben nach § 5 DDG zur BS CarCare GmbH in Leipzig — Anschrift, Vertretung, Registereintrag und Kontakt."
    />

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto max-w-3xl">
        <Abschnitt title="Anbieter">
          <dl>
            <Angabe label="Firma">BS CarCare GmbH</Angabe>
            <Angabe label="Anschrift">
              An den Tierkliniken 42
              <br />
              04103 Leipzig
            </Angabe>
            <Angabe label="Vertreten durch">André Bosse, Geschäftsführung</Angabe>
          </dl>
        </Abschnitt>

        <Abschnitt title="Kontakt">
          <dl>
            {/*
              TODO (Backlog 3.33): TELEFONNUMMER FEHLT — bewusst.
              Die Altseite nennt ZWEI Nummern nebeneinander: 0341 - 222 96 20 und
              0341 - 261 77 90. Das Projekt fuehrt durchgaengig nur die zweite
              (CLAUDE.md, NAP_TELEFON). Welche ins Impressum gehoert, ob beide oder
              ob eine davon nicht mehr gilt, kann nur Andre sagen.
              Die Pflicht zur schnellen Kontaktaufnahme traegt bis dahin die E-Mail.
            */}
            <Angabe label="E-Mail">
              <a className="font-semibold text-blue-600 underline" href="mailto:info@carcare-center.de">
                info@carcare-center.de
              </a>
            </Angabe>
            <Angabe label="Telefax">0341 - 962 74 87</Angabe>
          </dl>
        </Abschnitt>

        <Abschnitt title="Registereintrag">
          <dl>
            <Angabe label="Registergericht">Amtsgericht Leipzig</Angabe>
            <Angabe label="Registernummer">HRB 23667</Angabe>
            <Angabe label="Umsatzsteuer-ID">
              DE 257 851 313
              <span className="mt-1 block text-sm text-gray-600">
                Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz
              </span>
            </Angabe>
          </dl>
        </Abschnitt>

        {/*
          TODO (Backlog 3.33): BERUFSRECHTLICHE ANGABEN FEHLEN GANZ — bewusst.
          § 5 Abs. 1 Nr. 5 DDG verlangt bei zulassungspflichtigen Handwerken die
          zustaendige Kammer, die gesetzliche Berufsbezeichnung, den Staat der
          Verleihung und die Bezeichnung der berufsrechtlichen Regelung.

          Wir schreiben auf jeder Seite „Meisterbetrieb" — damit ist das hier die
          auffaelligste Luecke des Impressums. Sie steht AUCH AUF DER ALTSEITE nicht;
          Uebernehmen allein loest sie also nicht. Erwartbar sind: Handwerkskammer
          zu Leipzig, Berufsbezeichnung (Kfz-Techniker- bzw. Maler- und
          Lackiererhandwerk), verliehen in Deutschland, Handwerksordnung (HwO).
          ERWARTBAR IST NICHT BELEGT — deshalb steht hier nichts.
        */}

        {/*
          TODO (Backlog 3.33): VERBRAUCHERSTREITBEILEGUNG FEHLT — bewusst.
          § 36 VSBG verlangt eine Aussage, ob an einem Streitbeilegungsverfahren vor
          einer Verbraucherschlichtungsstelle teilgenommen wird. Beide Antworten sind
          zulaessig, aber es muss eine dastehen. Welche, entscheidet Andre.
        */}

        <Abschnitt title="Haftung für Links">
          {/* Woertlich von der Altseite uebernommen — eigene Aussage des Kunden. */}
          <p className="text-base leading-relaxed text-gray-600">
            Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte
            externer Links. Für den Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber
            verantwortlich.
          </p>
        </Abschnitt>

        <Abschnitt title="Datenschutz">
          <p className="text-base leading-relaxed text-gray-600">
            Wie wir mit personenbezogenen Daten umgehen, steht in unserer{' '}
            <a className="font-semibold text-blue-600 underline" href="/datenschutz">
              Datenschutzerklärung
            </a>
            .
          </p>
        </Abschnitt>
      </div>
    </section>
  </>
);

export default ImpressumPage;
