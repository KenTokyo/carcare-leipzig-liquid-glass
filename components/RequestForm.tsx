import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BriefcaseBusiness, Building2, CalendarClock, CheckCircle2, Send } from 'lucide-react';
import { ausbildungsberufe, berufsbilder } from '../data/jobs';
import { enthaeltDummies, zusatzleistungen } from '../data/zusatzleistungen';
import { terminLeistungen } from '../data/leistungsauswahl';
import { HONIGTOPF } from '../data/anfrageSchema';
import SchadenFelder from './formulare/SchadenFelder';
import TerminFelder from './formulare/TerminFelder';
import GeschaeftskundenFelder from './formulare/GeschaeftskundenFelder';
import BewerbungFelder from './formulare/BewerbungFelder';
import { inputClass, labelClass, type FormFieldsByKind } from './formulare/felder';
import { RequestFormKind } from '../types';

interface RequestFormProps {
  kind: RequestFormKind;
  /**
   * Vorausgewaehlte Leistung fuer die Termin-Variante (Backlog 1.19). Kommt vom
   * Anfrage-Dialog, der sie aus der aufrufenden Seite ableitet
   * (`data/leistungsauswahl.ts`). Ohne Angabe bleibt das Feld auf „Bitte waehlen".
   */
  vorauswahl?: string;
}

const initialState: FormFieldsByKind = {
  schaden: { name: '', phone: '', email: '', vehicle: '', incident: '', insuranceAvailable: '', description: '' },
  termin: { name: '', phone: '', email: '', vehicle: '', service: '', zusatzleistungen: [], preferredDate: '', description: '' },
  business: { company: '', contact: '', phone: '', email: '', partnerType: '', description: '' },
  bewerbung: { name: '', email: '', phone: '', position: '', description: '' },
};

const headlineByKind: Record<RequestFormKind, { icon: React.ReactNode; eyebrow: string; title: string; subtitle: string }> = {
  schaden: {
    icon: <AlertTriangle size={14} />,
    eyebrow: 'Schaden melden',
    title: 'Unfall- oder Hagelschaden direkt melden.',
    subtitle: 'Name, Fahrzeug, Schadenart, Versicherung und Bilder helfen uns bei der schnellen Ersteinschätzung.',
  },
  termin: {
    icon: <CalendarClock size={14} />,
    eyebrow: 'Aufbereitungstermin',
    title: 'Aufbereitungstermin anfragen.',
    subtitle: 'Nennen Sie Fahrzeug, gewünschte Leistung und Wunschtermin. Wir melden uns persönlich zurück.',
  },
  business: {
    icon: <Building2 size={14} />,
    eyebrow: 'Geschäftskunden',
    title: 'Geschäftskundenanfrage stellen.',
    subtitle: 'Für Autohäuser, Fuhrparks, Versicherungen und Versicherungsagenturen mit strukturierten Abläufen.',
  },
  bewerbung: {
    icon: <BriefcaseBusiness size={14} />,
    eyebrow: 'Bewerbung',
    title: 'Bewerbung senden.',
    subtitle: 'Name, Kontakt und ein paar Sätze zu Ihrer Erfahrung genügen. Ein Lebenslauf hilft, ist aber keine Bedingung.',
  },
};

/**
 * VERSAND IST NOCH NICHT ANGEBUNDEN (Backlog 1.17, Paket E).
 *
 * `handleSubmit` setzt bis heute nur `submitted = true` — es geht nichts raus. Bei einer
 * BEWERBUNG ist das nicht vertretbar: Wer seinen Werdegang schickt und „wir melden uns"
 * liest, waehrend niemand etwas bekommen hat, wartet auf eine Antwort, die nie kommt.
 * Deshalb ist der Absenden-Knopf dieser Variante inaktiv und nennt den Weg, der
 * funktioniert. Sobald 1.17 steht, wird hier `true` gesetzt — sonst nichts.
 *
 * Die drei aelteren Varianten bleiben unveraendert: Sie sind seit Langem so live, und
 * ihre Umstellung ist eine eigene Entscheidung, nicht Teil von 1.22. Festgehalten im
 * Paket-D-Plan, Abschnitt 5.
 */
const VERSAND_AKTIV = true;

/**
 * Ist der Versand auf DIESEM Deployment eingerichtet?
 *
 * `VERSAND_AKTIV` oben ist der Notschalter im Code. Ob wirklich gesendet werden kann,
 * weiss aber nur die Umgebung: `api/anfrage.ts` braucht `RESEND_API_KEY`,
 * `ANFRAGE_EMPFAENGER` und `ANFRAGE_ABSENDER`. Fehlt eines, antwortet die Funktion mit
 * 503 und `{ bereit: false }`.
 *
 * ⚠️ DER EHRLICHE ZUSTAND IST DER AUSGANGSZUSTAND. Vor der Antwort gilt „nicht bereit":
 * Der Knopf ist gesperrt und nennt Telefon und E-Mail. Erst eine bestaetigte Bereitschaft
 * schaltet ihn frei. Damit kann kein Deployment eine Erfolgsmeldung zeigen, hinter der
 * kein Versand steht — der Fehler, der bis zum 2026-09-05 in allen vier Varianten steckte.
 *
 * Das Ergebnis wird je Sitzung einmal geholt: Auf der Kontaktseite und im Dialog stehen
 * bis zu zwei Formulare gleichzeitig, und beide braeuchten sonst eine eigene Anfrage.
 */
let versandStandCache: boolean | null = null;
let versandStandLaeuft: Promise<boolean> | null = null;

const versandBereitschaft = (): Promise<boolean> => {
  if (versandStandCache !== null) return Promise.resolve(versandStandCache);
  if (versandStandLaeuft) return versandStandLaeuft;
  versandStandLaeuft = fetch('/api/anfrage', { method: 'GET' })
    .then((r) => (r.ok ? r.json() : { bereit: false }))
    .then((j) => Boolean(j?.bereit))
    .catch(() => false)
    .then((bereit) => {
      versandStandCache = bereit;
      versandStandLaeuft = null;
      return bereit;
    });
  return versandStandLaeuft;
};

/**
 * Frischer Startwert je Variante.
 *
 * BEWUSST EINE KOPIE: `initialState` ist eine Vorlage, kein Zustand. Seit `termin` ein
 * Array fuehrt (`zusatzleistungen`), waere die geteilte Referenz zwischen zwei
 * gleichzeitig sichtbaren Formularen — Kontaktseite und Anfrage-Dialog — dieselbe Liste.
 * Bei reinen Zeichenketten fiel das nie auf, weil jede Aenderung ohnehin ein neues
 * Objekt erzeugt hat.
 */
const startwerte = (kind: RequestFormKind, vorauswahl?: string) => {
  const werte = structuredClone(initialState[kind]);
  // Vorauswahl gilt nur fuer die Termin-Variante und nur, wenn die Leistung existiert.
  // Ein unbekannter Wert wuerde das <select> auf einen Zustand setzen, den es nicht
  // anzeigen kann — das Feld saehe leer aus, waere aber belegt.
  if (kind === 'termin' && vorauswahl && terminLeistungen.some((l) => l.id === vorauswahl)) {
    (werte as FormFieldsByKind['termin']).service = vorauswahl;
  }
  return werte;
};

/**
 * Titel je Variante, abgeleitet aus derselben Quelle wie die sichtbare Ueberschrift.
 * Der Anfrage-Dialog braucht ihn fuer sein `aria-label` — ohne diesen Export haette er
 * einen zweiten Titelsatz gefuehrt, der beim naechsten Textwechsel auseinanderlaeuft.
 */
export const formularTitel = Object.fromEntries(
  Object.entries(headlineByKind).map(([art, kopf]) => [art, kopf.title])
) as Record<RequestFormKind, string>;

const RequestForm: React.FC<RequestFormProps> = ({ kind, vorauswahl }) => {
  const [values, setValues] = useState(() => startwerte(kind, vorauswahl));
  const [submitted, setSubmitted] = useState(false);
  const [bereit, setBereit] = useState(false);
  const [sendet, setSendet] = useState(false);
  const [fehler, setFehler] = useState<string | null>(null);
  /** Honigtopf. Fuer Menschen unsichtbar, Formularroboter fuellen ihn aus. */
  const [honigtopf, setHonigtopf] = useState('');

  React.useEffect(() => {
    if (!VERSAND_AKTIV) return;
    let abgemeldet = false;
    versandBereitschaft().then((b) => {
      if (!abgemeldet) setBereit(b);
    });
    return () => {
      abgemeldet = true;
    };
  }, []);

  /** Darf tatsaechlich gesendet werden? Notschalter UND Umgebung muessen zustimmen. */
  const versandMoeglich = VERSAND_AKTIV && bereit;
  const [gezeigteArt, setGezeigteArt] = useState(kind);

  /**
   * Variantenwechsel WAEHREND DES RENDERNS nachziehen, nicht in einem Effect.
   *
   * Vorher stand hier ein `useEffect([kind])`. Effects laufen NACH dem Rendern — der
   * erste Durchlauf mit der neuen Variante rendert also noch die Werte der alten. Bei
   * lauter Zeichenketten blieb das unsichtbar: ein Feld, das es in der neuen Variante
   * nicht gibt, ist `undefined` und rendert als leer.
   *
   * Mit `zusatzleistungen: string[]` wurde daraus ein Absturz — `undefined.includes(...)`
   * beim Wechsel auf den Termin-Reiter, gemessen auf `/kontakt#contact-termin`. Der
   * Fehler steckte also schon vorher im Bauteil und wurde nur nie sichtbar.
   *
   * Das ist Reacts dokumentiertes Muster fuer „Zustand an geaenderte Props anpassen":
   * Ein `set` waehrend des Renderns verwirft das Ergebnis und ruft die Komponente sofort
   * erneut auf, bevor irgendetwas ins DOM geht. Kein zusaetzlicher Frame, kein Flackern.
   *
   * ⚠️ ES ERSETZT ABER KEINE ABSICHERUNG BEIM LESEN. React laesst den laufenden Durchlauf
   * ZU ENDE laufen und wirft das Ergebnis erst danach weg — eine Ausnahme im Rumpf fliegt
   * vorher. Genau daran ist die erste Fassung dieses Fixes gescheitert: Der Absturz blieb.
   * Deshalb liest die Mehrfachauswahl unten ueber `?? []`. Beides zusammen, nicht eines
   * statt des anderen.
   */
  if (kind !== gezeigteArt) {
    setGezeigteArt(kind);
    setValues(startwerte(kind, vorauswahl));
    setSubmitted(false);
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setValues((prev) => ({ ...prev, [e.target.name]: e.target.value } as never));
  };

  /** Mehrfachauswahl: an- und abwaehlen, ohne die uebrigen Felder anzufassen. */
  const handleZusatzleistung = (id: string, aktiv: boolean) => {
    setValues((prev) => {
      const bisher = (prev as FormFieldsByKind['termin']).zusatzleistungen ?? [];
      const neu = aktiv ? [...bisher, id] : bisher.filter((eintrag) => eintrag !== id);
      return { ...prev, zusatzleistungen: neu } as never;
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Zweite Sperre neben dem inaktiven Knopf: faengt das Absenden per Eingabetaste
    // und ein spaeter versehentlich geaendertes `disabled`. Ohne bestaetigten Versand
    // gibt es keine Bestaetigung.
    if (!versandMoeglich || sendet) return;
    setSendet(true);
    setFehler(null);
    try {
      const antwort = await fetch('/api/anfrage', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ art: kind, daten: { ...values, [HONIGTOPF]: honigtopf } }),
      });
      const inhalt = await antwort.json().catch(() => ({}));
      if (!antwort.ok) {
        // Die Funktion liefert bei 503 mit, dass sie nicht eingerichtet ist. Dann ist
        // der Knopf ab sofort gesperrt statt bei jedem Versuch erneut zu scheitern.
        if (antwort.status === 503) {
          versandStandCache = false;
          setBereit(false);
        }
        setFehler(
          inhalt?.fehler ??
            'Die Anfrage konnte nicht zugestellt werden. Bitte rufen Sie uns an oder schreiben Sie direkt an info@carcare-center.de.'
        );
        return;
      }
      setSubmitted(true);
    } catch {
      setFehler(
        'Keine Verbindung zum Server. Bitte prüfen Sie Ihre Internetverbindung — oder rufen Sie uns an unter 0341 - 261 77 90.'
      );
    } finally {
      setSendet(false);
    }
  };

  const head = headlineByKind[kind];

  return (
    <motion.div
      key={kind}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="rounded-3xl border border-gray-100 bg-gray-50/70 p-6 md:p-10"
    >
      <div className="mb-8">
        <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1.5">
          <span className="text-blue-600">{head.icon}</span>
          <span className="text-[10px] font-bold uppercase tracking-[0.25em] text-gray-700">{head.eyebrow}</span>
        </div>
        <h3 className="mb-3 text-2xl font-bold leading-tight text-gray-950 md:text-3xl">{head.title}</h3>
        <p className="text-sm leading-relaxed text-gray-600 md:text-base">{head.subtitle}</p>
      </div>

      {submitted && versandMoeglich ? (
        <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="rounded-2xl border border-gray-200 bg-white p-8 text-center">
          <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-blue-600 text-white">
            <CheckCircle2 size={24} />
          </div>
          <h4 className="mb-2 text-lg font-bold text-gray-950">Anfrage übermittelt.</h4>
          <p className="text-sm leading-relaxed text-gray-600">
            Vielen Dank - wir melden uns zeitnah bei Ihnen. Bei dringenden Anliegen erreichen Sie uns telefonisch unter
            <span className="font-semibold text-gray-950"> 0341 - 261 77 90</span>.
          </p>
        </motion.div>
      ) : (
        <form onSubmit={handleSubmit} className="relative space-y-5">
          {kind === 'schaden' && (
            <SchadenFelder werte={values as FormFieldsByKind['schaden']} onChange={handleChange} />
          )}

          {kind === 'termin' && (
            <TerminFelder
              werte={values as FormFieldsByKind['termin']}
              onChange={handleChange}
              onZusatzleistung={handleZusatzleistung}
            />
          )}

          {kind === 'business' && (
            <GeschaeftskundenFelder werte={values as FormFieldsByKind['business']} onChange={handleChange} />
          )}

          {kind === 'bewerbung' && (
            <BewerbungFelder werte={values as FormFieldsByKind['bewerbung']} onChange={handleChange} />
          )}

          {/*
            ABSENDEN IST INAKTIV, SOLANGE `VERSAND_AKTIV` AUS IST — fuer ALLE Varianten.
            Bis zum 2026-09-05 galt das nur fuer die Bewerbung; die drei aelteren
            Varianten meldeten „Anfrage uebermittelt", ohne dass etwas hinausging.

            Was das geaendert hat: Seit 1.20 haengt dasselbe Formular im Anfrage-Dialog,
            und der oeffnet sich an rund 40 Handlungsaufrufen im ganzen Projekt. Eine
            Erfolgsmeldung, die nichts versendet, war vorher ein Fehler auf zwei Seiten —
            jetzt waere sie einer auf jeder.

            Statt Erfolg zu melden, nennt der Hinweis darunter die Wege, die funktionieren.
            Dasselbe Muster wie beim Bewerbungsformular aus Paket D.
          */}
          {/* Honigtopf: fuer Menschen unsichtbar, Formularroboter fuellen ihn aus.
              Bewusst NICHT `display:none` — manche Roboter ueberspringen genau das.
              `tabIndex={-1}` und `aria-hidden` halten Tastatur und Screenreader fern. */}
          <div aria-hidden="true" className="absolute h-0 w-0 overflow-hidden opacity-0">
            <label htmlFor={`${kind}-${HONIGTOPF}`}>Bitte nicht ausfüllen</label>
            <input
              id={`${kind}-${HONIGTOPF}`}
              name={HONIGTOPF}
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={honigtopf}
              onChange={(e) => setHonigtopf(e.target.value)}
            />
          </div>

          {fehler && (
            <p role="alert" className="rounded-xl border border-gray-200 bg-white p-4 text-sm leading-relaxed text-gray-950">
              {fehler}
            </p>
          )}

          <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center">
            <button
              type="submit"
              disabled={!versandMoeglich || sendet}
              className="cc-gradient-button inline-flex w-full items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white disabled:cursor-not-allowed disabled:opacity-50 sm:w-auto"
            >
              <Send size={14} />
              {sendet
                ? 'Wird gesendet …'
                : kind === 'bewerbung'
                  ? 'Bewerbung senden'
                  : 'Anfrage absenden'}
            </button>
            {!versandMoeglich ? (
              <p className="text-[11px] leading-relaxed text-gray-700">
                <span className="font-semibold text-gray-950">
                  {kind === 'bewerbung' ? 'Bewerbungen' : 'Anfragen'} nehmen wir derzeit telefonisch oder per E-Mail entgegen.
                </span>{' '}
                Der Online-Versand wird gerade eingerichtet. Sie erreichen uns unter{' '}
                <a href="tel:+493412617790" className="font-semibold text-gray-950 underline">0341 - 261 77 90</a>
                {' '}oder{' '}
                <a href="mailto:info@carcare-center.de" className="font-semibold text-gray-950 underline">info@carcare-center.de</a>.
              </p>
            ) : (
              <p className="text-[11px] leading-relaxed text-gray-600">
                Mit dem Absenden stimmen Sie der Verarbeitung Ihrer Daten gemäß{' '}
                <a href="/datenschutz" className="font-semibold text-gray-950 underline">Datenschutzerklärung</a> zu.
              </p>
            )}
          </div>
        </form>
      )}
    </motion.div>
  );
};

export default RequestForm;
