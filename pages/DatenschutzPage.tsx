import React from 'react';
import { PageHero, PageMeta } from '../components/PageBlocks';
import {
  Abschnitt,
  Absatz,
  Anschrift,
  Aufzaehlung,
  ExternVerweis,
  RechtstextRahmen,
  Unterabschnitt,
  Verweis,
} from '../components/Rechtstext';
import { KI_WERKZEUGE } from '../data/bildherkunft';

/**
 * Datenschutzerklaerung (Backlog R6), seit 2026-10-04 als Volltext statt Geruest.
 *
 * GRUNDLAGE IST DER GEMESSENE STAND, nicht eine Vorlage: das Faktenblatt
 * `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md` mit seinen Nachtraegen und die Vorgaben des Users vom
 * 04.10. (`docs/rechtsseiten/tasks/2026-10-04-impressum-datenschutz-ki-tasks.md`). Aus der alten Erklaerung (2020)
 * stammen nur Eigenaussagen des Kunden: Datenschutzbeauftragter, Hinweis zur E-Mail, Widerspruch gegen Werbe-Mails.
 * Ihr uebriger Text beschreibt ein anderes System (Newsletter, Session-Cookies) und ist NICHT uebernommen.
 *
 * WER HIER ETWAS AENDERT, prueft es gegen das System. Der Matomo-Satz im Footer (bis 2026-09-04) war eine
 * uebernommene Aussage ueber ein Werkzeug, das es auf dieser Seite nie gab.
 *
 * MATOMO ENTFERNT (User 2026-10-23: „Matomo wird erstmal rausgenommen“, Backlog 6.20). Vom 04.10. bis dahin stand hier
 * ein Abschnitt „Webanalyse mit Matomo (unter Vorbehalt)“; eingebunden war Matomo nie. Kommt Webanalyse spaeter doch:
 * zuerst eine Einwilligungsabfrage (§ 25 Abs. 1 TDDDG, Art. 6 Abs. 1 lit. a DSGVO), dann ein Abschnitt mit Server,
 * Speicherdauer und Widerruf, und „Auf einen Blick“ sowie der Footer-Satz „keine Analyse- oder Tracking-Dienste“ aendern
 * sich mit. Vorher nichts davon hierher schreiben: Eine Erklaerung beschreibt, was laeuft, nicht was geplant ist.
 *
 * HOSTER IST DIE KUPPER IT GMBH (Entscheidung des Users 2026-10-04: „weil das auch über Kupper IT gehostet wird“,
 * am 2026-10-23 bestaetigt: „Hosting läuft über KupperIT“), nicht Vercel. Auf Vercel laeuft die Vorschau (`carcare-center.vercel.app`; dort gemessen: Seiten aus Frankfurt,
 * Formularfunktion in `iad1`, USA). ⚠️ `/api/anfrage` ist eine Vercel-Funktion (Node.js, Versand ueber netcup-SMTP).
 * Liegt die Seite bei KUPPER IT, muss der Versand dort laufen. Bleibt er bei Vercel, gehoert Vercel Inc. (USA, EU-US
 * Data Privacy Framework) als Empfaenger zurueck in „Hosting und E-Mail“ und „Anfrageformulare“.
 * Laut User am 2026-10-23 geregelt („1 und 5 sind geregelt“); wie, steht nicht im Repo. Nach dem Umzug live testen (R10).
 *
 * STAND-DATUM bei jeder inhaltlichen Aenderung mitziehen.
 */

const STAND = '23.10.2026';

const AUFSICHT_URL = 'https://www.datenschutz.sachsen.de';

/** Werkzeug und Hersteller, keine Gesellschaft: Begründung bei `KI_WERKZEUGE` (`data/bildherkunft.ts`). */
const KI_EINGESETZT = KI_WERKZEUGE.map((w) => `${w.name} von ${w.anbieter}`).join(' sowie ');

const DatenschutzPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/datenschutz"
      title="Datenschutzerklärung der BS CarCare GmbH in Leipzig"
      description="Datenschutzerklärung der BS CarCare GmbH in Leipzig: welche Daten wir bei Anfragen, Bewerbungen und Schadenmeldungen verarbeiten und welche Rechte Sie haben."
    />
    <PageHero
      eyebrow="Datenschutz"
      title="Datenschutzerklärung"
      description="Welche Daten wir verarbeiten, wenn Sie unsere Website besuchen, uns schreiben, eine Anfrage senden oder sich bewerben, und welche Rechte Sie dabei haben."
    />

    <RechtstextRahmen>
      <div className="rounded-2xl border border-gray-200 bg-gray-50 p-6 md:p-8">
        <span className="mb-3 block text-[11px] font-bold uppercase tracking-[0.2em] text-blue-600">Auf einen Blick</span>
        <p className="text-base leading-relaxed text-gray-950">
          Beim Besuch dieser Website setzen wir keine Cookies und keine Analyse- oder Werbedienste ein. Schriften, Bilder
          und Videos kommen vom selben Server wie die Seite.
        </p>
        <p className="mt-4 text-base leading-relaxed text-gray-600">
          Personenbezogene Daten verarbeiten wir vor allem dann, wenn Sie uns schreiben, eine Anfrage senden, einen
          Schaden melden oder sich bewerben. Wofür, auf welcher Rechtsgrundlage und wie lange, steht in den Abschnitten
          unten.
        </p>
      </div>

      <div className="mt-14">
        <Abschnitt id="verantwortlicher" title="Verantwortliche Stelle">
          <Absatz>Verantwortlich für die Verarbeitung personenbezogener Daten auf dieser Website ist:</Absatz>
          <Anschrift>
            BS CarCare GmbH
            <br />
            An den Tierkliniken 42
            <br />
            04103 Leipzig
            <br />
            Vertreten durch den Geschäftsführer André Bosse
          </Anschrift>
          <Absatz>
            Telefon <Verweis href="tel:+493412617790">0341 - 261 77 90</Verweis>, E-Mail{' '}
            <Verweis href="mailto:info@carcare-center.de">info@carcare-center.de</Verweis>. Weitere Angaben stehen in
            unserem <Verweis href="/impressum">Impressum</Verweis>.
          </Absatz>
        </Abschnitt>

        {/* Aus der alten Erklaerung (Eigenaussage des Kunden). Ob die Rolle besetzt und das Postfach erreichbar ist,
            steht als Rueckfrage im Task-Dokument vom 04.10. */}
        <Abschnitt id="datenschutzbeauftragter" title="Datenschutzbeauftragter">
          <Absatz>
            Unseren Datenschutzbeauftragten erreichen Sie unter der oben genannten Anschrift mit dem Zusatz
            „Datenschutzbeauftragter“ oder per E-Mail an{' '}
            <Verweis href="mailto:datenschutzbeauftragter@carcare-center.de">datenschutzbeauftragter@carcare-center.de</Verweis>.
          </Absatz>
        </Abschnitt>

        {/*
          GEMESSEN 2026-10-23 (Rechtspruefung): Der Webserver der Domain (185.141.122.210, `web01.trusted-datacenter.cloud`,
          Plesk) liegt im Netz der KUPPER IT GmbH (RIPE: Prager Strasse 15, Leipzig). Die Post fuer carcare-center.de nimmt
          aber Microsoft an (MX `carcarecenter-de01i.mail.protection.outlook.com`, Microsoft 365, so auch im Netcup-Plan
          vom 22.10.). Bis dahin stand hier, KUPPER IT hoste auch die Postfaecher. Betreut KUPPER IT den Microsoft-Mandanten,
          aendert das nichts am Empfaenger Microsoft; offen ist nur der AV-Vertrag (Plan 2026-10-23, Phase 6).
        */}
        <Abschnitt id="hosting" title="Hosting und E-Mail">
          <Absatz>
            Diese Website und unsere Domain carcare-center.de hostet die KUPPER IT GmbH, Prager Straße 15, 04103 Leipzig.
            Sie verarbeitet in unserem Auftrag (Art. 28 DSGVO) die Daten, die beim Aufruf der Website anfallen, und die
            Inhalte abgesendeter Formulare.
          </Absatz>
          <Absatz>
            Unsere E-Mail-Postfächer liegen bei Microsoft 365 (Exchange Online) der Microsoft Ireland Operations Limited,
            One Microsoft Place, South County Business Park, Leopardstown, Dublin 18, Irland. Microsoft verarbeitet in
            unserem Auftrag (Art. 28 DSGVO) die E-Mails, die Sie uns schreiben, und die Anfragen aus unseren Formularen.
            Eine Übermittlung an die Microsoft Corporation in den USA ist dabei nicht ausgeschlossen. Sie ist nach dem
            EU-US Data Privacy Framework zertifiziert, für das ein Angemessenheitsbeschluss der EU-Kommission besteht
            (Art. 45 DSGVO).
          </Absatz>
          <Absatz>
            Rechtsgrundlage für Hosting und E-Mail ist unser berechtigtes Interesse an einer sicheren und zuverlässigen
            Bereitstellung der Website und an unserer Erreichbarkeit (Art. 6 Abs. 1 lit. f DSGVO).
          </Absatz>
        </Abschnitt>

        <Abschnitt id="besuch" title="Beim Besuch dieser Website">
          <Unterabschnitt title="Server-Logdateien">
            <Absatz>
              Bei jedem Seitenaufruf erfasst unser Hoster automatisch Daten, die Ihr Browser übermittelt: IP-Adresse,
              Datum und Uhrzeit, aufgerufene Seite oder Datei, die zuvor besuchte Seite (Referrer), Browsertyp und
              -version, Betriebssystem, Statuscode und übertragene Datenmenge.
            </Absatz>
            <Absatz>
              Wir brauchen diese Daten, um die Website auszuliefern, ihre Sicherheit zu gewährleisten und Fehler zu
              beheben. Wir führen sie nicht mit anderen Datenquellen zusammen. Rechtsgrundlage ist Art. 6 Abs. 1 lit. f
              DSGVO. Die Protokolle werden gelöscht, sobald sie für diese Zwecke nicht mehr erforderlich sind.
            </Absatz>
          </Unterabschnitt>
          {/* Gemessen: `Set-Cookie` auf keiner Seite; einziger Speicherzugriff ist `cc-preloader-v1` (hooks/usePreloader.ts,
              index.html). Kommt ein Eintrag dazu, gehoert er hierher. */}
          <Unterabschnitt title="Keine Cookies, ein Eintrag für die Startanimation">
            <Absatz>
              Wir setzen keine Cookies. Damit die Startanimation nur beim ersten Aufruf läuft, legen wir im
              Sitzungsspeicher Ihres Browsers (sessionStorage) einen Eintrag ab, der nur vermerkt, dass die Animation schon gelaufen ist. Er enthält
              keine Kennung, über die Sie sich wiedererkennen ließen, und verschwindet, sobald Sie das Browserfenster
              schließen. Wir speichern ihn nur, um Ihnen die aufgerufene Website ohne Wiederholung der Animation
              anzuzeigen (§ 25 Abs. 2 Nr. 2 TDDDG).
            </Absatz>
          </Unterabschnitt>
          <Unterabschnitt title="Schriften, Bilder und Videos">
            <Absatz>
              Schriftarten, Bilder und Videos werden vom selben Server geladen wie die Seite. Eine Verbindung zu Google Fonts,
              Kartendiensten, Videoplattformen oder sozialen Netzwerken entsteht beim Aufruf nicht.
            </Absatz>
          </Unterabschnitt>
          <Unterabschnitt title="Verschlüsselung">
            <Absatz>
              Diese Website nutzt eine TLS-Verschlüsselung (HTTPS). Daten, die Sie über unsere Formulare senden, können so
              auf dem Weg zu uns nicht von Dritten mitgelesen werden.
            </Absatz>
          </Unterabschnitt>
        </Abschnitt>

        <Abschnitt id="kontakt" title="Kontakt per E-Mail oder Telefon">
          <Absatz>
            Wenn Sie uns per E-Mail oder telefonisch kontaktieren, verarbeiten wir Ihre Angaben, um Ihr Anliegen zu
            bearbeiten. Geht es um einen Auftrag oder dessen Vorbereitung, ist Rechtsgrundlage Art. 6 Abs. 1 lit. b DSGVO,
            sonst unser berechtigtes Interesse an der Beantwortung Ihrer Anfrage (Art. 6 Abs. 1 lit. f DSGVO). Wir löschen
            die Daten, sobald Ihr Anliegen erledigt ist und keine gesetzlichen Aufbewahrungspflichten entgegenstehen.
          </Absatz>
          {/* Sicherheitshinweis der alten Erklaerung, Eigenaussage des Kunden. */}
          <Absatz>
            Bei der Kommunikation per E-Mail können wir eine vollständige Datensicherheit nicht gewährleisten. Für
            vertrauliche Informationen empfehlen wir deshalb den Postweg.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="formulare" title="Anfrageformulare">
          <Absatz>
            Über unsere Formulare können Sie eine Fahrzeugaufbereitung anfragen oder als Geschäftskunde Kontakt aufnehmen.
            Wir verarbeiten dabei die Angaben, die Sie eintragen: bei der Terminanfrage Ihren Namen, Ihre Telefonnummer
            oder E-Mail-Adresse, Marke und Modell Ihres Fahrzeugs, die gewünschte Leistung und Zusatzleistungen, einen
            Wunschtermin und Ihre Nachricht; bei Geschäftskunden Firma, Ansprechpartner, Telefonnummer, E-Mail-Adresse,
            Art der Zusammenarbeit und Ihre Nachricht. Pflichtfelder sind gekennzeichnet.
          </Absatz>
          <Absatz>
            Ihr Browser überträgt die Angaben verschlüsselt an unseren Webserver. Von dort geht die Anfrage als E-Mail über
            den Mailserver der netcup GmbH, Daimlerstraße 25, 76185 Karlsruhe, an unser Postfach. Auf der Website selbst
            wird nichts gespeichert, es gibt keine Datenbank. Beim Versand protokollieren wir nur technische Angaben, keine
            Inhalte Ihrer Anfrage.
          </Absatz>
          <Absatz>
            Wir verwenden Ihre Angaben ausschließlich, um Ihre Anfrage zu bearbeiten und Rückfragen mit Ihnen zu klären.
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO, soweit Ihre Anfrage auf einen Auftrag zielt, sonst Art. 6
            Abs. 1 lit. f DSGVO. Wir löschen die Anfrage, sobald sie erledigt ist und keine gesetzlichen
            Aufbewahrungspflichten, etwa nach Handels- oder Steuerrecht, entgegenstehen.
          </Absatz>
          <Absatz>
            Gegen automatisierte Einsendungen enthalten die Formulare ein für Menschen unsichtbares Feld. Wir setzen dafür
            kein CAPTCHA ein und werten Ihr Verhalten auf der Seite nicht aus.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="schadenmeldung" title="Schadenmeldung über reparatur.info">
          <Absatz>
            Die Schaltflächen „Schaden melden“ führen auf unsere Schadenseite bei reparatur.info, einer Anwendung der
            PDR.cloud GmbH, Attilastraße 16, 12529 Schönefeld. Dort können Sie uns Angaben und Fotos zu einem Schaden
            übermitteln oder einen Besichtigungstermin vereinbaren. Unsere Website überträgt beim Klick nichts, Ihre
            Angaben machen Sie erst auf der Schadenseite.
          </Absatz>
          <Absatz>
            Die PDR.cloud GmbH verarbeitet diese Daten in unserem Auftrag (Art. 28 DSGVO). Wir nutzen die Daten für die
            Schadenaufnahme, den Kostenvoranschlag und die Abwicklung der Reparatur (Art. 6 Abs. 1 lit. b DSGVO). Bitte
            beachten Sie, dass Fotos von Unfallschäden oft das Kennzeichen und manchmal auch Personen zeigen.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="bewerbungen" title="Bewerbungen">
          <Absatz>
            Über unsere Karriereseite können Sie sich online bewerben. Wir verarbeiten dabei Ihren Namen, Ihre
            Kontaktdaten, den gewünschten Bereich, Ihre Nachricht und die Unterlagen, die Sie anhängen (bis zu drei
            Dateien, zusammen höchstens 3 MB). Die Bewerbung gelangt auf demselben Weg wie eine Anfrage als E-Mail mit
            Anhängen in unser Bewerbungspostfach. Auf der Website wird nichts gespeichert.
          </Absatz>
          <Absatz>
            Rechtsgrundlage ist Art. 6 Abs. 1 lit. b DSGVO (Anbahnung eines Beschäftigungsverhältnisses), ergänzend
            § 26 Abs. 1 BDSG. Kommt es zu einer Einstellung, nehmen wir Ihre Unterlagen in die Personalakte
            auf. Andernfalls löschen wir sie spätestens sechs Monate nach Abschluss des Bewerbungsverfahrens.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="links" title="Links zu anderen Anbietern">
          <Absatz>
            Wir verlinken unter anderem auf Google Maps und Apple Karten für die Anfahrt, auf unser Unternehmensprofil bei
            Google mit den Bewertungen und auf Partnerbetriebe. Das sind gewöhnliche Links. Erst wenn Sie einen anklicken,
            verbindet sich Ihr Browser mit dem jeweiligen Anbieter, und es gilt dessen Datenschutzerklärung. Von welcher
            unserer Seiten Sie kommen, übermitteln wir dabei nicht.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="ki" title="Künstliche Intelligenz bei Bildern">
          <Absatz>
            Einige Bilder auf dieser Website haben wir mit künstlicher Intelligenz (KI) bearbeitet. Eingesetzt haben wir
            dafür {KI_EINGESETZT}. Personen, die auf so bearbeiteten Fotos zu sehen sind, haben der Bearbeitung zugestimmt
            (Art. 6 Abs. 1 lit. a DSGVO, § 22 KUG).
          </Absatz>
          <Absatz>
            Beim Besuch dieser Website werden keine Daten an KI-Dienste übermittelt. Die Bildbearbeitung ist ein
            abgeschlossener Arbeitsschritt vor der Veröffentlichung. Welche Kennzeichnungen es gibt und was sie bedeuten,
            steht im <Verweis href="/impressum#ki-verzeichnis">KI-Verzeichnis</Verweis> unseres Impressums.
          </Absatz>
        </Abschnitt>

        <Abschnitt id="rechte" title="Ihre Rechte">
          <Absatz>Sie haben uns gegenüber folgende Rechte bezüglich Ihrer personenbezogenen Daten:</Absatz>
          <Aufzaehlung
            punkte={[
              <>
                <strong className="text-gray-950">Auskunft</strong> (Art. 15 DSGVO) über die Daten, die wir über Sie
                verarbeiten, ihre Zwecke, Empfänger und Speicherdauer.
              </>,
              <>
                <strong className="text-gray-950">Berichtigung</strong> (Art. 16 DSGVO) unrichtiger und Vervollständigung
                unvollständiger Daten.
              </>,
              <>
                <strong className="text-gray-950">Löschung</strong> (Art. 17 DSGVO), soweit keine gesetzliche
                Aufbewahrungspflicht entgegensteht.
              </>,
              <>
                <strong className="text-gray-950">Einschränkung der Verarbeitung</strong> (Art. 18 DSGVO), etwa solange
                die Richtigkeit Ihrer Daten geprüft wird.
              </>,
              <>
                <strong className="text-gray-950">Datenübertragbarkeit</strong> (Art. 20 DSGVO) der Daten, die Sie uns
                bereitgestellt haben, in einem gängigen, maschinenlesbaren Format.
              </>,
              <>
                <strong className="text-gray-950">Widerruf einer Einwilligung</strong> (Art. 7 Abs. 3 DSGVO) jederzeit
                mit Wirkung für die Zukunft. Die bis dahin erfolgte Verarbeitung bleibt rechtmäßig.
              </>,
            ]}
          />
          <Absatz>
            Wenden Sie sich dafür formlos an die oben genannte verantwortliche Stelle oder an unseren
            Datenschutzbeauftragten.
          </Absatz>

          {/* Art. 21 Abs. 4 DSGVO: getrennt von anderen Informationen hervorheben, deshalb eigener Kasten. */}
          <div className="mt-8 rounded-2xl border border-gray-950 p-5 md:p-6">
            <h3 className="mb-3 text-lg font-bold tracking-tight text-gray-950">Widerspruchsrecht nach Art. 21 DSGVO</h3>
            <p className="text-base leading-relaxed text-gray-950">
              Verarbeiten wir Ihre Daten auf Grundlage unseres berechtigten Interesses (Art. 6 Abs. 1 lit. f DSGVO), können
              Sie dieser Verarbeitung aus Gründen, die sich aus Ihrer besonderen Situation ergeben, jederzeit widersprechen.
              Wir verarbeiten die Daten dann nicht mehr, es sei denn, wir können zwingende schutzwürdige Gründe nachweisen,
              die Ihre Interessen, Rechte und Freiheiten überwiegen, oder die Verarbeitung dient der Geltendmachung,
              Ausübung oder Verteidigung von Rechtsansprüchen.
            </p>
          </div>

          <Unterabschnitt title="Beschwerde bei der Aufsichtsbehörde">
            <Absatz>
              Sie können sich bei einer Datenschutz-Aufsichtsbehörde beschweren (Art. 77 DSGVO). Für uns zuständig ist:
            </Absatz>
            {/* Anschrift seit April 2025 (Umzug aus der Devrientstrasse), am 04.10.2026 recherchiert. */}
            <Anschrift>
              Die Sächsische Datenschutz- und Transparenzbeauftragte
              <br />
              Maternistraße 17
              <br />
              01067 Dresden
              <br />
              <ExternVerweis href={AUFSICHT_URL}>www.datenschutz.sachsen.de</ExternVerweis>
            </Anschrift>
          </Unterabschnitt>
        </Abschnitt>

        <Abschnitt id="weitere-hinweise" title="Weitere Hinweise">
          <Unterabschnitt title="Keine automatisierten Entscheidungen">
            <Absatz>
              Wir treffen keine automatisierten Entscheidungen und betreiben kein Profiling im Sinne von Art. 22 DSGVO.
            </Absatz>
          </Unterabschnitt>
          <Unterabschnitt title="Pflicht zur Angabe">
            <Absatz>
              Sie sind nicht verpflichtet, uns über diese Website Daten mitzuteilen. Ohne die Pflichtangaben eines
              Formulars können wir Ihre Anfrage darüber aber nicht entgegennehmen. Sie erreichen uns dann telefonisch oder
              per E-Mail.
            </Absatz>
          </Unterabschnitt>
          {/* Aus der alten Erklaerung, Eigenaussage des Kunden, in die erste Person gesetzt. */}
          <Unterabschnitt title="Widerspruch gegen Werbe-E-Mails">
            <Absatz>
              Der Nutzung der im Impressum veröffentlichten Kontaktdaten zur Übersendung nicht ausdrücklich angeforderter
              Werbung und Informationsmaterialien widersprechen wir hiermit. Rechtliche Schritte im Fall unverlangt
              zugesandter Werbung, etwa durch Spam-E-Mails, behalten wir uns ausdrücklich vor.
            </Absatz>
          </Unterabschnitt>
        </Abschnitt>

        <p className="mt-14 text-sm text-gray-600">Stand: {STAND}</p>
      </div>
    </RechtstextRahmen>
  </>
);

export default DatenschutzPage;
