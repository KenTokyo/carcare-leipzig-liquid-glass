import type { RequestFormKind } from '../types';
import {
  BETREFF,
  FELDBESCHRIFTUNG,
  HONIGTOPF,
  MAX_FELDER,
  MAX_LAENGE,
  PFLICHTFELDER,
} from '../data/anfrageSchema';

/**
 * Nimmt Anfragen aus den Formularen entgegen und schickt sie ins Postfach (Backlog 1.17).
 *
 * EDGE-LAUFZEIT, KEINE ABHAENGIGKEIT. Der Versand ist ein einzelner `fetch` an die
 * HTTP-Schnittstelle des Mail-Dienstes. Damit braucht das Projekt kein zusaetzliches
 * npm-Paket, und die Funktion startet ohne Kaltstart-Kosten.
 *
 * ⚠️ OHNE KONFIGURATION SENDET SIE NICHTS — UND SAGT DAS AUCH.
 * Fehlen `RESEND_API_KEY` oder `ANFRAGE_EMPFAENGER`, antwortet sie mit 503 und
 * `{ bereit: false }`. Das Formular fragt diesen Zustand beim Laden ab (GET) und laesst
 * den Absenden-Knopf so lange gesperrt, mit dem Hinweis auf Telefon und E-Mail.
 * DAS IST DIE WICHTIGE EIGENSCHAFT: Der ehrliche Zustand ist der Ausgangszustand. Wer
 * die Umgebungsvariablen setzt, schaltet den Versand frei, ohne eine Zeile Code zu
 * aendern; wer sie vergisst, bekommt keine stille Erfolgsmeldung.
 *
 * EINZURICHTEN IN VERCEL (Project Settings -> Environment Variables):
 *   RESEND_API_KEY       Schluessel des Mail-Dienstes
 *   ANFRAGE_EMPFAENGER   Zieladresse, z. B. info@carcare-center.de
 *   ANFRAGE_ABSENDER     verifizierte Absenderadresse, z. B. website@carcare-center.de
 *
 * KEINE ANHAENGE IN DIESER FASSUNG. Handyfotos liegen oft bei 3–8 MB je Bild, und das
 * Schadenformular erlaubt mehrere; die Anfragekoerper waeren regelmaessig zu gross und
 * der Versand waere unzuverlaessig — schlimmer als gar keiner, weil er beim Absender wie
 * ein Erfolg aussieht. Das Formular sagt deshalb ausdruecklich, dass Bilder und
 * Unterlagen per E-Mail nachgereicht werden. Backlog 3.37.
 *
 * WAS HIER NICHT PASSIERT: Es wird nichts gespeichert, nichts protokolliert und nichts
 * an Dritte ausser den Mail-Dienst gegeben. Siehe das Faktenblatt fuer den
 * Datenschutzbeauftragten, `docs/rechtsseiten/2026-09-04-faktenblatt-datenschutz.md`.
 */

export const config = { runtime: 'edge' };

const RESEND_ENDPUNKT = 'https://api.resend.com/emails';

const antwort = (koerper: unknown, status: number) =>
  new Response(JSON.stringify(koerper), {
    status,
    headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store' },
  });

/** Ist der Versand ueberhaupt eingerichtet? */
const einrichtung = () => {
  const schluessel = process.env.RESEND_API_KEY;
  const empfaenger = process.env.ANFRAGE_EMPFAENGER;
  const absender = process.env.ANFRAGE_ABSENDER;
  return { schluessel, empfaenger, absender, bereit: Boolean(schluessel && empfaenger && absender) };
};

/** Zeilenweise Klartextfassung der Anfrage, in der Reihenfolge der Beschriftungen. */
const alsText = (art: RequestFormKind, daten: Record<string, string>) => {
  const zeilen: string[] = [`Anfrageart: ${BETREFF[art]}`, ''];
  for (const [feld, beschriftung] of Object.entries(FELDBESCHRIFTUNG)) {
    const wert = daten[feld];
    if (!wert) continue;
    zeilen.push(`${beschriftung}: ${wert}`);
  }
  zeilen.push('', '—', 'Gesendet über das Formular auf carcare-center.de.');
  return zeilen.join('\n');
};

const entschaerfen = (s: string) =>
  s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export default async function handler(request: Request): Promise<Response> {
  const stand = einrichtung();

  // GET: Das Formular fragt vor dem Anzeigen, ob der Versand bereitsteht.
  if (request.method === 'GET') {
    return antwort({ bereit: stand.bereit }, stand.bereit ? 200 : 503);
  }

  if (request.method !== 'POST') {
    return antwort({ fehler: 'Nur GET und POST.' }, 405);
  }

  if (!stand.bereit) {
    return antwort(
      {
        bereit: false,
        fehler:
          'Der Online-Versand ist auf diesem Deployment nicht eingerichtet. ' +
          'Es fehlen RESEND_API_KEY, ANFRAGE_EMPFAENGER oder ANFRAGE_ABSENDER.',
      },
      503
    );
  }

  let roh: unknown;
  try {
    roh = await request.json();
  } catch {
    return antwort({ fehler: 'Anfrage nicht lesbar.' }, 400);
  }

  const koerper = roh as { art?: string; daten?: Record<string, unknown> };
  const art = koerper.art as RequestFormKind | undefined;
  if (!art || !(art in PFLICHTFELDER)) {
    return antwort({ fehler: 'Unbekannte Anfrageart.' }, 400);
  }

  const eingang = koerper.daten ?? {};
  if (Object.keys(eingang).length > MAX_FELDER) {
    return antwort({ fehler: 'Zu viele Felder.' }, 400);
  }

  // Honigtopf: stillschweigend annehmen und verwerfen. Eine Fehlermeldung wuerde dem
  // Absender verraten, woran er gescheitert ist.
  if (typeof eingang[HONIGTOPF] === 'string' && (eingang[HONIGTOPF] as string).trim() !== '') {
    return antwort({ ok: true }, 202);
  }

  const daten: Record<string, string> = {};
  for (const [feld, wert] of Object.entries(eingang)) {
    if (feld === HONIGTOPF) continue;
    const text = Array.isArray(wert) ? wert.join(', ') : String(wert ?? '');
    if (text.length > MAX_LAENGE) {
      return antwort({ fehler: `Feld "${feld}" ist zu lang.` }, 400);
    }
    if (text.trim()) daten[feld] = text.trim();
  }

  const fehlend = PFLICHTFELDER[art].filter((feld) => !daten[feld]);
  if (fehlend.length) {
    return antwort({ fehler: `Pflichtangaben fehlen: ${fehlend.join(', ')}` }, 400);
  }

  // Genuegt fuer den Zweck: Was hier durchkommt, landet in einem Postfach, das ein
  // Mensch liest — keine Verarbeitung, die auf eine strenge Adresspruefung angewiesen waere.
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(daten.email)) {
    return antwort({ fehler: 'E-Mail-Adresse sieht nicht gültig aus.' }, 400);
  }

  const text = alsText(art, daten);
  const versand = await fetch(RESEND_ENDPUNKT, {
    method: 'POST',
    headers: {
      authorization: `Bearer ${stand.schluessel}`,
      'content-type': 'application/json',
    },
    body: JSON.stringify({
      from: stand.absender,
      to: [stand.empfaenger],
      // Antworten geht direkt an den Absender der Anfrage, nicht an die Website-Adresse.
      reply_to: daten.email,
      subject: `${BETREFF[art]} — ${daten.name ?? daten.company ?? 'ohne Namen'}`,
      text,
      html: `<pre style="font:14px/1.6 ui-monospace,monospace">${entschaerfen(text)}</pre>`,
    }),
  }).catch(() => null);

  if (!versand || !versand.ok) {
    // Der Grund gehoert ins Log, nicht in die Antwort: Er kann Konfigurationsdetails
    // enthalten. Der Absender bekommt einen Weg, der funktioniert.
    console.error('[anfrage] Versand fehlgeschlagen:', versand?.status, await versand?.text().catch(() => ''));
    return antwort(
      {
        fehler:
          'Die Anfrage konnte nicht zugestellt werden. Bitte rufen Sie uns an ' +
          'oder schreiben Sie direkt an info@carcare-center.de.',
      },
      502
    );
  }

  return antwort({ ok: true }, 200);
}
