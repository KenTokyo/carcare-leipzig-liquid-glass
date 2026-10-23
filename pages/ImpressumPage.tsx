import React from 'react';
import { PageHero, PageMeta } from '../components/PageBlocks';
import { Abschnitt, Absatz, Anschrift, Angabe, ExternVerweis, RechtstextRahmen, Verweis } from '../components/Rechtstext';
import { HERKUNFT_ERKLAERUNG, HERKUNFT_TEXT, KI_WERKZEUGE } from '../data/bildherkunft';
import type { Bildherkunft } from '../data/bildherkunft';

/**
 * Impressum nach § 5 DDG.
 *
 * HERKUNFT DER ANGABEN: Seit 2026-10-04 vom User bestätigt (Firmendaten, wie sie in Andrés Signatur stehen; Block in
 * `docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md`). Bis dahin stammte alles von der Altseite
 * `www.carcare-center.de/kontakt/impressum.html`.
 *
 * DREI ANGABEN DES BLOCKS SIND BEWUSST NICHT ÜBERNOMMEN, Begründung jeweils an der Stelle: die Telefonnummer
 * 222 96 20 und das Fax (Andrés Entscheidungen vom 25. und 28.09., Backlog 5.30 und R5) sowie „USt-IdNr.
 * DE 231/106/12214“ (Format einer Steuernummer; André hat am 28.09. die USt-ID der Altseite bestätigt).
 *
 * BERUFSRECHT UND STREITBEILEGUNG waren bis 2026-10-04 bewusst leer (Backlog R5) und stehen seitdem auf Anweisung
 * des Users da („Dann pack die dazu“). Was davon abgeleitet statt belegt ist, steht mit ⚠️ an der Stelle. Die
 * Grundregel bleibt: Ein leeres Feld ist ein ehrlicher Zustand, ein geratenes ist eine falsche Angabe.
 *
 * E-MAIL BEWUSST IM KLARTEXT: Auf der Altseite ist sie hinter JavaScript verborgen („Diese E-Mail-Adresse ist vor
 * Spambots geschuetzt“). Das Impressum muss unmittelbar erreichbar sein; wer JavaScript blockiert, saehe dort gar
 * keine Adresse.
 *
 * KI-VERZEICHNIS (Backlog 6.21, seit 2026-10-04): steht hier, weil Bildnachweise ueblicherweise ins Impressum gehoeren
 * und der Footer-Link es von jeder Seite mit einem Klick erreichbar macht. Werkzeug und Wortlaut kommen aus
 * `data/bildherkunft.ts`, derselben Quelle wie die Plaketten am Bild (`components/KiMarke.tsx`). Die
 * Datenschutzerklaerung verlinkt auf `#ki-verzeichnis`.
 *
 * RECHTSPRUEFUNG 2026-10-23 (Auftrag des Users, `docs/rechtsseiten/tasks/2026-10-23-impressum-rechtspruefung-tasks.md`):
 * jede Angabe gegen § 5 DDG, § 36 VSBG, § 18 Abs. 2 MStV, DL-InfoV und Art. 50 KI-VO geprueft, das Protokoll Angabe
 * fuer Angabe steht dort. USt-IdNr. am 23.10. in VIES gueltig. Seitdem neu: Link zur Kammer, „Redaktionell
 * verantwortlich“. Offene Kundenfragen (Handwerksrolle, Innung, Haftpflichtversicherung) stehen dort in Phase 6.
 */

const HWO_URL = 'https://www.gesetze-im-internet.de/hwo/';
/** Website der Kammer, am 2026-10-23 am Impressum der Kammer bestaetigt (Name, Anschrift, Domain). */
const HWK_URL = 'https://www.hwk-leipzig.de/';

/** Reihenfolge im KI-Verzeichnis: von der staerksten Veraenderung zur echten Aufnahme. */
const KENNZEICHNUNGEN: Bildherkunft[] = ['generiert', 'aufgewertet', 'echt'];

/** Dieselbe Plakette wie am Bild, damit man sie wiedererkennt. `normal-case`, weil `<dt>` Versalien setzt. */
const Plakette: React.FC<{ herkunft: Bildherkunft }> = ({ herkunft }) =>
  HERKUNFT_TEXT[herkunft] ? (
    <span className="cc-ki-marke inline-block normal-case">{HERKUNFT_TEXT[herkunft]}</span>
  ) : (
    <>Ohne Kennzeichnung</>
  );

const ImpressumPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/impressum"
      title="Impressum der BS CarCare GmbH | CarCare Center Leipzig"
      description="Impressum der BS CarCare GmbH, An den Tierkliniken 42, 04103 Leipzig: Angaben nach § 5 DDG, Handelsregister, Kontakt und KI-Verzeichnis unserer Bilder."
    />
    <PageHero
      eyebrow="Impressum"
      title="Impressum"
      description="Angaben nach § 5 DDG zur BS CarCare GmbH in Leipzig: Anschrift, Vertretung, Registereintrag, Kammer und Kontakt, dazu unser KI-Verzeichnis."
    />

    <RechtstextRahmen>
      <Abschnitt title="Anbieter">
        <dl>
          <Angabe label="Firma">BS CarCare GmbH</Angabe>
          {/* Seit 2026-10-04 ausdruecklich (Angabe des Users: „Rechtsform: GmbH, Sitz: Leipzig“). */}
          <Angabe label="Rechtsform und Sitz">Gesellschaft mit beschränkter Haftung (GmbH), Sitz Leipzig</Angabe>
          {/*
            Backlog 4.11 (2026-09-10): Bezeichnung laut Kunde. Das ist die BETRIEBS-
            bezeichnung, nicht die gesetzliche Berufsbezeichnung nach § 5 Abs. 1 Nr. 5 DDG;
            die steht seit 2026-10-04 im Abschnitt „Berufsrechtliche Angaben“.
          */}
          <Angabe label="Betrieb">Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk</Angabe>
          <Angabe label="Anschrift">
            An den Tierkliniken 42
            <br />
            04103 Leipzig
          </Angabe>
          {/* 2026-10-04: „Geschaeftsfuehrer“ statt „Geschaeftsfuehrung“, wie in der Angabe des Users. Schreibweise
              „André“ wie in Andrés eigenen Dateien (Autor der Schleife-4-Liste); die Signatur schreibt „Andre“. */}
          <Angabe label="Vertreten durch">Geschäftsführer André Bosse</Angabe>
        </dl>
      </Abschnitt>

      <Abschnitt title="Kontakt">
        <dl>
          {/*
            TELEFON GEKLAERT (Backlog 5.30, Meeting 2026-09-25): Die Nummer mit der 90 am Ende
            „reicht vollkommen aus" (André), dieselbe wie ueberall im Projekt (CLAUDE.md, NAP_TELEFON).
            Die Altseite nennt zwei (0341 - 222 96 20 und 0341 - 261 77 90). Das Telefax 0341 - 962 74 87
            ist entfallen, ebenso im Footer.
            2026-09-28 (Meeting, Backlog R5): André: „die alte Nummer mit 29620 nicht mehr nennen“.
            2026-10-04: Der Firmenblock des Users nennt wieder 222 96 20 und das Fax. Er ist erkennbar Andrés
            E-Mail-Signatur; seine ausdruecklichen Entscheidungen vom 25. und 28.09. gelten weiter.
          */}
          <Angabe label="Telefon">
            <Verweis href="tel:+493412617790">0341 - 261 77 90</Verweis>
          </Angabe>
          <Angabe label="E-Mail">
            <Verweis href="mailto:info@carcare-center.de">info@carcare-center.de</Verweis>
          </Angabe>
        </dl>
      </Abschnitt>

      <Abschnitt title="Registereintrag">
        <dl>
          <Angabe label="Registergericht">Amtsgericht Leipzig</Angabe>
          <Angabe label="Registernummer">HRB 23667</Angabe>
          {/*
            USt-IdNr. bleibt die der Altseite: André hat sie am 2026-09-28 bestaetigt („Ja, die passt“, Backlog R5).
            Der Firmenblock des Users vom 04.10. nennt „USt-IdNr.: DE 231/106/12214“. Das ist das Format einer
            saechsischen STEUERNUMMER (3/3/5 Ziffern, 231 = Finanzamt Leipzig I); eine USt-IdNr. ist „DE“ plus neun
            Ziffern. § 5 Abs. 1 Nr. 6 DDG verlangt die USt-IdNr.; die Steuernummer muss nicht veroeffentlicht werden und
            wird wegen Missbrauchsgefahr meist weggelassen.
          */}
          <Angabe label="Umsatzsteuer-ID">
            DE 257 851 313
            <span className="mt-1 block text-sm text-gray-600">
              Umsatzsteuer-Identifikationsnummer gemäß § 27a Umsatzsteuergesetz
            </span>
          </Angabe>
        </dl>
      </Abschnitt>

      {/*
        BERUFSRECHTLICHE ANGABEN nach § 5 Abs. 1 Nr. 5 DDG (zulassungspflichtiges Handwerk), seit 2026-10-04 auf
        Anweisung des Users. Bis dahin bewusst leer, weil auch die Altseite nichts dazu nannte (Backlog R5).
        - PFLICHT ODER FREIWILLIG (Rechtspruefung 2026-10-23): Der ZDH verlangt Kammer und Berufsbezeichnung nur von
          Gesundheitshandwerken („Praxis Recht Impressumspflicht“, 07/2025). Nach dem Wortlaut von Nr. 5 ist jedes
          Handwerk mit Meisterpflicht ein reglementierter Beruf; das Impressum folgt dieser vorsichtigen Lesart. Auch
          freiwillige Angaben muessen stimmen, deshalb bleibt die Pruefung gegen die Handwerksrolle offen.
        - Kammer: folgt aus dem Betriebssitz Leipzig. Name, Anschrift und Website am 2026-10-23 am Impressum der Kammer
          bestaetigt; der Link folgt der Empfehlung „zuständige Handwerkskammer (mit Link)“ (DHZ, 31.01.2026).
        - Berufsbezeichnung: zuerst aus Andrés Angabe 4.11 („Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk“)
          abgeleitet. BERICHTIGT 2026-10-23 (User, „ganz wichtig“): nicht „Maler und Lackierer“, sondern
          „Fahrzeuglackierer“. „Karosserie- und Fahrzeugbauer“ bleibt, bis der Eintrag in der Handwerksrolle vorliegt
          (Frage 1 der Mail an André, `docs/rechtsseiten/2026-10-23-mail-andre-offene-punkte.md`): Steht dort ein
          weiteres Handwerk (etwa Kraftfahrzeugtechniker), gehoert es hier dazu; fehlt eines, muss es hier raus.
        - Eine Aufsichtsbehoerde (Nr. 3) nennt der ZDH im Handwerk nur fuer Bezirksschornsteinfeger und Buechsenmacher.
      */}
      <Abschnitt title="Berufsrechtliche Angaben">
        <dl>
          <Angabe label="Zuständige Kammer">
            Handwerkskammer zu Leipzig
            <br />
            Dresdner Straße 11/13, 04103 Leipzig
            <br />
            <ExternVerweis href={HWK_URL}>www.hwk-leipzig.de</ExternVerweis>
            <span className="mt-1 block text-sm text-gray-600">Eintragung in die Handwerksrolle</span>
          </Angabe>
          <Angabe label="Berufsbezeichnung">Karosserie- und Fahrzeugbauer, Fahrzeuglackierer</Angabe>
          <Angabe label="Verliehen in">Bundesrepublik Deutschland</Angabe>
          <Angabe label="Berufsrechtliche Regelung">
            Gesetz zur Ordnung des Handwerks (Handwerksordnung, HwO), abrufbar unter{' '}
            <ExternVerweis href={HWO_URL}>gesetze-im-internet.de/hwo</ExternVerweis>
          </Angabe>
        </dl>
      </Abschnitt>

      {/*
        REDAKTIONELL VERANTWORTLICH nach § 18 Abs. 2 MStV, seit 2026-10-23 (Rechtspruefung). Der Wissensbereich
        (`/autoaufbereitung-wissen`, sieben Ratgeberbeitraege, Ausbau mit 3.22) kann als journalistisch-redaktionell
        gestaltetes Angebot gelten; ob ein Firmenratgeber darunter faellt, ist umstritten, die Nennung kostet nichts.
        Verlangt ist eine NATUERLICHE Person (keine Firma) mit Name und Anschrift. Vorbelegt mit dem Geschaeftsfuehrer;
        verantwortet jemand anderes die Beitraege, wird nur der Name getauscht (offener Punkt im Plan, Phase 6).
      */}
      <Abschnitt title="Redaktionell verantwortlich">
        <Absatz>
          Verantwortlich für unsere redaktionellen Inhalte, etwa die Ratgeberbeiträge im Wissensbereich, ist nach
          § 18 Abs. 2 Medienstaatsvertrag (MStV):
        </Absatz>
        <Anschrift>
          André Bosse
          <br />
          An den Tierkliniken 42
          <br />
          04103 Leipzig
        </Anschrift>
      </Abschnitt>

      {/*
        VERBRAUCHERSTREITBEILEGUNG nach § 36 VSBG, seit 2026-10-04 auf Anweisung des Users. Variante „nicht bereit und
        nicht verpflichtet“: Im Projekt gibt es keinen Hinweis auf eine Innungsmitgliedschaft.
        BERICHTIGT 2026-10-23 (Rechtspruefung): Hier stand, ein Innungsbetrieb mit Kfz-Schiedsstelle sei zur Teilnahme
        verpflichtet und muesse diesen Satz ersetzen. Das stimmt nicht. Die Kfz-Schiedsstellen (ZDK, BVfK) sind keine
        anerkannten Verbraucherschlichtungsstellen (Liste des EVZ); § 36 Abs. 1 Nr. 2 VSBG greift nur bei solchen. Der
        Satz bleibt also auch fuer einen Innungsbetrieb richtig. Ist der Betrieb Innungsmitglied, darf FREIWILLIG ein
        zweiter Satz folgen („Als Innungsbetrieb nehmen wir an Verfahren der Kfz-Schiedsstelle teil.“), nur mit
        Bestaetigung durch André.
        § 36 Abs. 3 VSBG: Bei hoechstens zehn Beschaeftigten am 31.12. des Vorjahres entfiele die Pflicht; der Satz
        schadet dann nicht.
        Einen Link auf die EU-OS-Plattform NICHT setzen: Sie ist seit dem 20.07.2025 abgeschaltet.
      */}
      <Abschnitt title="Verbraucherstreitbeilegung">
        <Absatz>
          Wir sind nicht bereit und nicht verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle
          teilzunehmen.
        </Absatz>
      </Abschnitt>

      <Abschnitt title="Haftung für Links">
        {/* Woertlich von der Altseite uebernommen — eigene Aussage des Kunden. */}
        <Absatz>
          Trotz sorgfältiger inhaltlicher Kontrolle übernehmen wir keine Haftung für die Inhalte externer Links. Für den
          Inhalt der verlinkten Seiten sind ausschließlich deren Betreiber verantwortlich.
        </Absatz>
      </Abschnitt>

      <Abschnitt id="ki-verzeichnis" title="KI-Verzeichnis">
        <Absatz>
          Einige Bilder auf dieser Website haben wir mit künstlicher Intelligenz (KI) bearbeitet. Jedes dieser Bilder
          trägt seine Kennzeichnung direkt am Bild.
        </Absatz>
        <dl className="mt-6">
          <Angabe label="Eingesetzte KI">
            {KI_WERKZEUGE.map((w) => `${w.name} (${w.anbieter})`).join(', ')}
          </Angabe>
          {KENNZEICHNUNGEN.map((herkunft) => (
            <Angabe key={herkunft} label={<Plakette herkunft={herkunft} />}>
              {HERKUNFT_ERKLAERUNG[herkunft]}
            </Angabe>
          ))}
        </dl>
        <Absatz>
          Mit KI hinzugefügte Bildteile dienen der Veranschaulichung unserer Leistungen. Sie zeigen keine konkreten, von
          uns ausgeführten Arbeiten und keine Vorher-Nachher-Ergebnisse.
        </Absatz>
      </Abschnitt>

      <Abschnitt title="Datenschutz">
        <Absatz>
          Wie wir mit personenbezogenen Daten umgehen, steht in unserer{' '}
          <Verweis href="/datenschutz">Datenschutzerklärung</Verweis>.
        </Absatz>
      </Abschnitt>
    </RechtstextRahmen>
  </>
);

export default ImpressumPage;
