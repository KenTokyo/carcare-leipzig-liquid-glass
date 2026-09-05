import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, BriefcaseBusiness, Building2, CalendarClock, CheckCircle2, Send } from 'lucide-react';
import { ausbildungsberufe, berufsbilder } from '../data/jobs';
import { enthaeltDummies, zusatzleistungen } from '../data/zusatzleistungen';
import { terminLeistungen } from '../data/leistungsauswahl';
import { HONIGTOPF } from '../data/anfrageSchema';
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

interface FormFieldsByKind {
  schaden: {
    name: string;
    phone: string;
    email: string;
    vehicle: string;
    incident: string;
    insuranceAvailable: string;
    description: string;
  };
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
  const inputClass =
    'w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/10 transition-all';
  const labelClass = 'block text-xs font-bold uppercase tracking-[0.15em] text-gray-600 mb-2';

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
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-name">Name</label>
                  <input id="schaden-name" name="name" required value={(values as FormFieldsByKind['schaden']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-phone">Telefon</label>
                  <input id="schaden-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['schaden']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-email">E-Mail</label>
                  <input id="schaden-email" name="email" required type="email" value={(values as FormFieldsByKind['schaden']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-vehicle">Fahrzeug</label>
                  <input id="schaden-vehicle" name="vehicle" value={(values as FormFieldsByKind['schaden']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="schaden-incident">Schadenart</label>
                  <select id="schaden-incident" name="incident" value={(values as FormFieldsByKind['schaden']).incident} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="unfall">Unfallschaden</option>
                    <option value="hagel">Hagelschaden</option>
                    <option value="lack">Lackschaden</option>
                    <option value="glas">Glasschaden</option>
                    <option value="sonstiges">Sonstiges</option>
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="schaden-insurance">Versicherung vorhanden?</label>
                  <select id="schaden-insurance" name="insuranceAvailable" value={(values as FormFieldsByKind['schaden']).insuranceAvailable} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    <option value="ja">Ja</option>
                    <option value="nein">Nein</option>
                    <option value="unklar">Noch unklar</option>
                  </select>
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-images">Bilderupload</label>
                <input id="schaden-images" name="images" type="file" multiple accept="image/*" className={inputClass} />
              </div>
              <div>
                <label className={labelClass} htmlFor="schaden-description">Nachricht</label>
                <textarea id="schaden-description" name="description" required rows={4} value={(values as FormFieldsByKind['schaden']).description} onChange={handleChange} className={inputClass} placeholder="Hergang, Datum, Umfang ..." />
              </div>
            </>
          )}

          {kind === 'termin' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-name">Name</label>
                  <input id="termin-name" name="name" required value={(values as FormFieldsByKind['termin']).name} onChange={handleChange} className={inputClass} placeholder="Max Mustermann" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-phone">Telefon</label>
                  <input id="termin-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['termin']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-email">E-Mail</label>
                  <input id="termin-email" name="email" required type="email" value={(values as FormFieldsByKind['termin']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-vehicle">Fahrzeug</label>
                  <input id="termin-vehicle" name="vehicle" value={(values as FormFieldsByKind['termin']).vehicle} onChange={handleChange} className={inputClass} placeholder="Marke / Modell" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="termin-service">Gewünschte Leistung</label>
                  {/* Optionen aus `data/leistungsauswahl.ts` — dieselbe Quelle, aus der
                      die Vorauswahl abgeleitet wird (1.19). Zwei Listen waeren zwei Orte,
                      an denen dieselben Schluessel gepflegt werden muessten. */}
                  <select id="termin-service" name="service" value={(values as FormFieldsByKind['termin']).service} onChange={handleChange} className={inputClass}>
                    <option value="">Bitte wählen</option>
                    {terminLeistungen.map((leistung) => (
                      <option key={leistung.id} value={leistung.id}>{leistung.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className={labelClass} htmlFor="termin-date">Wunschtermin</label>
                  <input id="termin-date" name="preferredDate" type="date" value={(values as FormFieldsByKind['termin']).preferredDate} onChange={handleChange} className={inputClass} />
                </div>
              </div>
              {/*
                ZUSATZLEISTUNGEN (Backlog 1.18). Die Liste kommt vollstaendig aus
                `data/zusatzleistungen.ts` — hier steht kein einziger Eintrag fest
                verdrahtet. Ergaenzen ist eine Zeile in den Daten.

                <fieldset> mit <legend> statt eines <div> mit Ueberschrift: Screenreader
                sagen die Gruppenbeschriftung dann bei JEDEM Kaestchen mit an. Ohne das
                hoert man fuenfmal „Kontrollkaestchen" ohne zu wissen, wozu sie gehoeren.
              */}
              <fieldset className="rounded-xl border border-gray-200 p-4">
                <legend className="px-1 text-xs font-bold uppercase tracking-[0.15em] text-gray-600">
                  Gewünschte Zusatzleistungen
                </legend>
                {enthaeltDummies && (
                  <p className="mb-3 rounded-lg bg-gray-100 px-3 py-2 text-[11px] leading-relaxed text-gray-700">
                    Diese Auswahl ist noch in Abstimmung — die endgültigen Zusatzleistungen folgen.
                    Nennen Sie Ihren Wunsch gern zusätzlich in der Nachricht.
                  </p>
                )}
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {zusatzleistungen.map((leistung) => {
                    // `?? []`: Beim Reiterwechsel laeuft genau ein Renderdurchlauf mit den
                    // Werten der VORHERIGEN Variante, in denen es dieses Feld nicht gibt.
                    // Siehe die Begruendung oben am Variantenwechsel.
                    const gewaehlt = ((values as FormFieldsByKind['termin']).zusatzleistungen ?? []).includes(leistung.id);
                    return (
                      <label
                        key={leistung.id}
                        htmlFor={`termin-${leistung.id}`}
                        className={`flex cursor-pointer gap-3 rounded-lg border p-3 transition-colors ${
                          gewaehlt ? 'border-blue-600 bg-blue-600/5' : 'border-gray-200 bg-white hover:border-gray-300'
                        }`}
                      >
                        <input
                          id={`termin-${leistung.id}`}
                          type="checkbox"
                          name="zusatzleistungen"
                          value={leistung.id}
                          checked={gewaehlt}
                          onChange={(e) => handleZusatzleistung(leistung.id, e.target.checked)}
                          className="mt-0.5 h-4 w-4 shrink-0 accent-blue-600"
                        />
                        <span className="min-w-0">
                          <span className="block text-sm font-semibold text-gray-950">{leistung.label}</span>
                          {leistung.hinweis && (
                            <span className="mt-0.5 block text-[11px] leading-relaxed text-gray-600">{leistung.hinweis}</span>
                          )}
                        </span>
                      </label>
                    );
                  })}
                </div>
              </fieldset>
              <div>
                <label className={labelClass} htmlFor="termin-description">Nachricht</label>
                <textarea id="termin-description" name="description" rows={4} value={(values as FormFieldsByKind['termin']).description} onChange={handleChange} className={inputClass} placeholder="Sonderwünsche, Fahrzeugzustand ..." />
              </div>
            </>
          )}

          {kind === 'business' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="business-company">Firma</label>
                  <input id="business-company" name="company" required value={(values as FormFieldsByKind['business']).company} onChange={handleChange} className={inputClass} placeholder="Autohaus / Fuhrpark / Agentur" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-contact">Ansprechpartner</label>
                  <input id="business-contact" name="contact" required value={(values as FormFieldsByKind['business']).contact} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="business-phone">Telefon</label>
                  <input id="business-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['business']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
                <div>
                  <label className={labelClass} htmlFor="business-email">E-Mail</label>
                  <input id="business-email" name="email" required type="email" value={(values as FormFieldsByKind['business']).email} onChange={handleChange} className={inputClass} placeholder="kontakt@firma.de" />
                </div>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-partner">Art der Zusammenarbeit</label>
                <select id="business-partner" name="partnerType" value={(values as FormFieldsByKind['business']).partnerType} onChange={handleChange} className={inputClass}>
                  <option value="">Bitte wählen</option>
                  <option value="autohaus">Autohaus</option>
                  <option value="fuhrpark">Fuhrpark</option>
                  <option value="versicherung">Versicherung / Versicherungsagentur</option>
                  <option value="rahmenvertrag">Rahmenvertrag / laufende Zusammenarbeit</option>
                  <option value="sonstiges">Sonstiges</option>
                </select>
              </div>
              <div>
                <label className={labelClass} htmlFor="business-description">Nachricht</label>
                <textarea id="business-description" name="description" required rows={4} value={(values as FormFieldsByKind['business']).description} onChange={handleChange} className={inputClass} placeholder="Umfang, Frequenz, Sonderwünsche ..." />
              </div>
            </>
          )}

          {kind === 'bewerbung' && (
            <>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="bewerbung-name">Name</label>
                  <input id="bewerbung-name" name="name" required value={(values as FormFieldsByKind['bewerbung']).name} onChange={handleChange} className={inputClass} placeholder="Vor- und Nachname" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bewerbung-phone">Telefon</label>
                  <input id="bewerbung-phone" name="phone" required type="tel" value={(values as FormFieldsByKind['bewerbung']).phone} onChange={handleChange} className={inputClass} placeholder="0341 - ..." />
                </div>
              </div>
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className={labelClass} htmlFor="bewerbung-email">E-Mail</label>
                  <input id="bewerbung-email" name="email" required type="email" value={(values as FormFieldsByKind['bewerbung']).email} onChange={handleChange} className={inputClass} placeholder="name@beispiel.de" />
                </div>
                <div>
                  <label className={labelClass} htmlFor="bewerbung-position">Bereich</label>
                  {/*
                    NICHT AUSGESCHRIEBENE BEREICHE BLEIBEN SICHTBAR, sind aber nicht
                    waehlbar — man soll sehen, dass es den Beruf gibt.

                    NATIVES `disabled`, NICHT `aria-disabled`: Die Sorge, deaktivierte
                    Elemente seien fuer Screenreader unerreichbar, gilt fuer `<button>`
                    und `<input>` — die fallen aus der Tabreihenfolge. Ein `<option>`
                    ist ein anderer Fall: Der `<select>` bleibt fokussierbar, die Option
                    bleibt in der Liste. `aria-disabled` waere hier schlechter, weil die
                    ARIA-Zuordnung fuer native Optionen duenn ist UND die Auswahl nicht
                    verhindert — man haette eine Option, die als „nicht verfuegbar"
                    angesagt wird und sich trotzdem waehlen laesst.

                    ABSICHERUNG: Manche Screenreader ueberspringen deaktivierte Optionen
                    beim Durchgehen. Deshalb steht der Grund IM BESCHRIFTUNGSTEXT, nicht
                    nur im Zustand — plus ein sichtbarer Hinweis unter dem Feld.
                  */}
                  <select id="bewerbung-position" name="position" value={(values as FormFieldsByKind['bewerbung']).position} onChange={handleChange} className={inputClass} aria-describedby="bewerbung-position-hinweis">
                    <option value="">Bitte wählen</option>
                    <optgroup label="Berufsbilder">
                      {berufsbilder.map((job) => (
                        <option key={job.id} value={job.id} disabled={job.status !== 'suchend'}>
                          {job.title}
                          {job.status === 'suchend' ? '' : ' — zurzeit keine offene Stelle'}
                        </option>
                      ))}
                    </optgroup>
                    <optgroup label="Ausbildung">
                      {ausbildungsberufe.map((job) => (
                        <option key={job.id} value={job.id} disabled={job.status !== 'suchend'}>
                          {job.title}
                          {job.status === 'suchend' ? '' : ' — zurzeit keine offene Stelle'}
                        </option>
                      ))}
                    </optgroup>
                    <option value="initiativ">Anderer Bereich / Initiativbewerbung</option>
                  </select>
                  <p id="bewerbung-position-hinweis" className="mt-2 text-[11px] leading-relaxed text-gray-600">
                    Ausgegraute Bereiche gehören zum Betrieb, sind aber gerade nicht ausgeschrieben.
                    Wählen Sie dafür „Anderer Bereich / Initiativbewerbung" und nennen Sie den Beruf in der Nachricht.
                  </p>
                </div>
              </div>
              {/* Lebenslauf ausdruecklich OPTIONAL, und das Formular ist auch ohne Anhang
                  absendbar — beides Vorgabe aus 1.22. Deshalb kein `required` und ein
                  Hinweis, der das benennt, statt es nur wegzulassen. */}
              <div>
                <label className={labelClass} htmlFor="bewerbung-cv">Lebenslauf <span className="text-gray-500">(optional)</span></label>
                <input id="bewerbung-cv" name="cv" type="file" accept=".pdf,.doc,.docx,image/*" className={inputClass} />
                <p className="mt-2 text-[11px] leading-relaxed text-gray-600">
                  PDF, Word oder Foto. Ohne Anhang geht es genauso — wir melden uns und klären den Rest.
                </p>
              </div>
              <div>
                <label className={labelClass} htmlFor="bewerbung-description">Nachricht</label>
                <textarea id="bewerbung-description" name="description" required rows={4} value={(values as FormFieldsByKind['bewerbung']).description} onChange={handleChange} className={inputClass} placeholder="Ein paar Sätze zu Ihrer Erfahrung und dazu, ab wann Sie können ..." />
              </div>
            </>
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
