/**
 * Herkunft der Bilder — die eine Quelle für die Kennzeichnung auf der Seite.
 *
 * WARUM: Seit dem 02.08.2026 gilt die Transparenzpflicht aus Art. 50 KI-VO. Fotorealistische
 * Bilder, die mit KI erzeugt oder inhaltlich verändert wurden, müssen erkennbar sein — und zwar
 * am Bild, nicht nur in einem Hinweis im Fußbereich.
 *
 * ENTSCHEIDUNG DES USERS (2026-09-20): Bis zur Einzelklärung gilt **alles außer den Videos als
 * KI-generiert**. Sobald feststeht, welches Motiv nur aufgewertet wurde und welches mit KI verändert
 * ist, wird hier je Datei EINE Zeile geändert — sonst nichts. Die Plakette am Bild folgt automatisch.
 *
 * WAS DIE KATEGORIEN BEDEUTEN (Definition des Users, 2026-10-04, steht so im KI-Verzeichnis des Impressums):
 *  - `generiert`  („KI-generiert“): in das Foto wurden mit KI Gegenstände oder Personen hineingeneriert.
 *  - `aufgewertet` („KI-bearbeitet“): Grundbild unverändert, nur die Lichtverhältnisse mit KI angepasst.
 * Wer eine Datei einträgt, ordnet sie nach DIESEN Sätzen ein: Ein getauschter Hintergrund ist nicht „aufgewertet“.
 * SEIT 2026-10-03 IST JEDE AUSGELIEFERTE DATEI GEKLÄRT (Herkunftsbogen, Angabe des Users, Block unten): Kein Foto
 * gilt mehr als vollständig erzeugt. Die Vorgabe `STANDARD` greift nur noch für neue Bilder ohne Eintrag.
 *
 * ⚠️ NICHT NACH AUGENSCHEIN EINTRAGEN. Einem Bild sieht man seine Herkunft nicht an, und eine
 * FALSCHE Kennzeichnung ist derselbe Mangel wie eine fehlende: Ein echtes Foto als „KI-generiert“
 * auszuweisen, entwertet die eigene Arbeit und ist irreführend. Nur eintragen, was der Kunde oder
 * die eigene Bildproduktion bestätigt.
 *
 * KEINE PLAKETTE bekommen:
 *  - Videos und ihre Standbilder: Aufnahmen aus dem Betrieb (Lieferungen 07.09. und 21.09.2026).
 *  - Die elf Fotos der Lieferung vom 21.09.2026: vom User als echt bestätigt (Liste unten).
 *  - Logos, Siegel, Wortmarken, das EU-Emblem: Grafiken, keine fotorealistischen Darstellungen;
 *    sie fallen nicht unter die Norm (und ein KI-Label an einem Verbandssiegel wäre schlicht falsch).
 *  - Das Unsplash-Stockfoto der Teilen-Vorschau: ein echtes Foto, nur nicht unseres.
 *
 * Die Liste aller Bildstellen mit fester Nummer steht in `docs/bilder/README.md` (`npm run bilder`).
 */

export type Bildherkunft = 'generiert' | 'aufgewertet' | 'echt';

/** Sichtbarer Text der Plakette. `echt` trägt keine. */
export const HERKUNFT_TEXT: Record<Bildherkunft, string> = {
  generiert: 'KI-generiert',
  aufgewertet: 'KI-bearbeitet',
  echt: '',
};

/**
 * Was die Kennzeichnungen bedeuten, im Wortlaut des KI-Verzeichnisses (`pages/ImpressumPage.tsx`, Backlog 6.21).
 * Grundlage ist die Definition des Users vom 2026-10-04 (Kopfkommentar). Ändert sich, was eine Plakette bedeutet,
 * ändert sich dieser Text mit, sonst verspricht das Verzeichnis etwas anderes als die Plakette am Bild.
 */
export const HERKUNFT_ERKLAERUNG: Record<Bildherkunft, string> = {
  generiert:
    'Ein Foto, in das wir mit KI Gegenstände oder Personen hineingeneriert haben. Mit KI hinzugefügte Personen sind nicht real und zeigen keine Mitarbeitenden unseres Betriebs.',
  // Einwilligung der abgebildeten Personen zur KI-Bearbeitung vom User bestätigt (2026-10-04: „Ja“).
  aufgewertet:
    'Ein echtes Foto mit unverändertem Bildinhalt. Mit KI haben wir nur die Lichtverhältnisse angepasst. Abgebildete Personen sind real und haben der Bearbeitung zugestimmt.',
  echt: 'Echte Fotos und Videos ohne KI. Wir haben sie höchstens zugeschnitten oder Details wie Kennzeichen unkenntlich gemacht.',
};

/**
 * Für Bilder eingesetzte KI (Angabe des Users, 2026-10-04: „ChatGPT Image 2.5“). Bei OpenAI heißt das Produkt
 * „ChatGPT Images 2.5“ (Modell GPT Image 2.5, erschienen am 08.09.2026); Vertragspartner im EWR ist OpenAI Ireland.
 * Gelesen vom KI-Verzeichnis im Impressum und von der Datenschutzerklärung. Kommt ein Werkzeug dazu: eine Zeile hier.
 */
export const KI_WERKZEUGE: ReadonlyArray<{ name: string; anbieter: string; gesellschaft: string }> = [
  { name: 'ChatGPT Images 2.5', anbieter: 'OpenAI', gesellschaft: 'OpenAI Ireland Ltd., Dublin' },
];

/**
 * Ausnahmen je Datei. Was hier nicht steht, gilt als `STANDARD`.
 * Schlüssel ist der Pfad, wie er im Code steht (mit `/assets/`).
 *
 * AUCH BESTÄTIGTES „generiert“ HIER EINTRAGEN (seit 2026-09-28): Für die Plakette ändert das nichts,
 * aber die Datei gilt dann als geklärt (`istGeklaert`). Das Bildinventar (`npm run bilder`) zeigt so
 * „KI-generiert“ statt „KI-generiert (Vorgabe, ungeklärt)“ — und R15 lässt sich am Stand ablesen.
 */
const AUSNAHMEN: Record<string, Bildherkunft> = {
  // Betriebsvideo des Kunden und die daraus gezogenen Standbilder — echte Aufnahmen.
  '/assets/carcare-ueber-uns-hero.mp4': 'echt',
  '/assets/carcare-ueber-uns-hero-standbild.webp': 'echt',
  '/assets/carcare-betriebsrundgang.mp4': 'echt',
  '/assets/carcare-betriebsrundgang-standbild.webp': 'echt',
  '/assets/carcare-arbeitsplatz.mp4': 'echt',
  '/assets/carcare-arbeitsplatz-standbild.webp': 'echt',

  // Lieferung „Neue Fotos Schleife September“, eingebaut am 2026-09-21. Vom User bestätigt:
  // „alle Anhänge sind echt. Nichts ist KI-generiert oder aufgewertet.“ Aufbereitet mit
  // `npm run fotos` bzw. `npm run video` (Zuschnitt, zwei Kennzeichen weichgezeichnet — keine KI).
  // ⚠️ Fünf davon tragen den NAMEN eines früheren Motivs (autolackierung, dellenentfernung,
  // ersatzwagen, autohaeuser-und-fuhrparks, innenaufbereitung): Die Datei ist ersetzt, deshalb gilt
  // die Zeile dem neuen Foto. Die alten Motive stehen als `lackierkabine-…` und `fahrzeugabgabe-…`
  // weiter unter dem Standard.
  '/assets/kacheln/unfallinstandsetzung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/unfallinstandsetzung-hintergrund-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autolackierung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autolackierung-hintergrund-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/dellenentfernung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/ersatzwagen-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/innenaufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/lackaufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/leasingrueckgabe-aufbereitung-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/aufbereitung-aktiv-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/karriere-aufbereiter-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/karriere-fahrzeugbau-leipzig-carcare.webp': 'echt',
  '/assets/carcare-autolackierung.mp4': 'echt',
  '/assets/carcare-autolackierung-standbild.webp': 'echt',
  // Backlog 6.12 (2026-09-28): derselbe Film, eigener Querschnitt als Seitenhintergrund der Lackierseite.
  '/assets/carcare-autolackierung-hintergrund.mp4': 'echt',
  '/assets/carcare-autolackierung-hintergrund-standbild.webp': 'echt',

  // Bereichsvideos (R18), geliefert vom User am 2026-09-23: drei Drohnenclips aus derselben
  // Aufnahme wie das Betriebsvideo vom 07.09.2026 — echte Aufnahmen aus dem Betrieb. Im
  // Karosserieclip sind zwei Kundenkennzeichen weichgezeichnet; das ist eine Unkenntlichmachung
  // aus Datenschutzgründen, keine generative Veränderung — die Herkunft bleibt „echt“.
  '/assets/carcare-bereich-karosserie.mp4': 'echt',
  '/assets/carcare-bereich-karosserie-standbild.webp': 'echt',
  '/assets/carcare-bereich-lack.mp4': 'echt',
  '/assets/carcare-bereich-lack-standbild.webp': 'echt',
  '/assets/carcare-bereich-aufbereitung.mp4': 'echt',
  '/assets/carcare-bereich-aufbereitung-standbild.webp': 'echt',

  // Backlog 6.2 (2026-09-28): Alcantara-Serie aus der Lieferung „Neue Fotos Schleife September“, vom User als
  // Anhang für das Vorher/Nachher-Bild ausgewählt. Laut EXIF drei iPhone-Aufnahmen desselben Lenkrads vom 20.08.2026
  // (Vorher 14:55, Schaum 16:46, Nachher 17:06). Aufbereitet mit `npm run fotos`: nur zugeschnitten, keine Retusche.
  // Ein Vorher/Nachher ist nur als echte Aufnahme ehrlich — deshalb „echt“; Bestätigung beim User erbeten (6.2).
  '/assets/kacheln/alcantara-lenkrad-vorher-nachher-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/alcantara-schaumreinigung-leipzig-carcare.webp': 'echt',

  // Bildtausch vom 2026-10-03, vom User als echt bestaetigt („Alle Bilder sind echt“). Aufbereitet mit `npm run fotos`:
  // nur Zuschnitt, beim Dellenfoto ein Kundenkennzeichen weichgezeichnet, keine KI. Die Dellendatei steht oben schon als
  // „echt“ (neuer Inhalt unter demselben Namen, Lieferordner „Neue Fotos Schleife September“).
  '/assets/kacheln/smart-repair-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/smart-repair-hintergrund-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/hagelschadenreparatur-leipzig-carcare.webp': 'echt',
  '/assets/kacheln/autohaeuser-geschaeftskunden-haenger-leipzig-carcare.webp': 'echt',

  // Herkunftsbogen vom 2026-10-03: Der User hat die Herkunft der 16 bis dahin ungeklärten Fotos angegeben, ausdrücklich
  // „final“. Wortlaut: „echt: Bild 1,2,3,4,7,16 · Der Rest braucht den Batch KI-aufgewertet“ (Nr. aus dem
  // Bogen hinter jeder Zeile). „KI-aufgewertet“ ist die Kategorie `aufgewertet`. Die Plakette dazu heißt seit dem
  // 21.09. „KI-bearbeitet“ (HERKUNFT_TEXT).
  // ⚠️ Die Angabe weicht vom Meeting am 25.09. ab (Backlog 5.9). Dort hieß die Felge „echt“ (Andrés Cupra-Felge).
  // Schaden melden, Privatkunden und Fahrzeugabgabe hießen dort „KI-generiert“. Es gilt die spätere Angabe des Users.
  '/assets/hero-leipzig-carcare-desktop.webp': 'echt', // Nr. 1
  '/assets/hero-leipzig-carcare-mobile.webp': 'echt', // Nr. 2
  '/assets/footer-leipzig-carcare.webp': 'echt', // Nr. 3
  '/assets/kacheln/fahrzeugaufbereitung-leipzig-carcare.webp': 'echt', // Nr. 4
  '/assets/kacheln/leasingrueckgabe-leipzig-carcare.webp': 'echt', // Nr. 7
  '/assets/kacheln/lackierkabine-leipzig-carcare.webp': 'echt', // Nr. 16
  '/assets/kacheln/felgenreparatur-leipzig-carcare.webp': 'aufgewertet', // Nr. 5
  '/assets/kacheln/autoglas-scheibenreparatur-leipzig-carcare.webp': 'aufgewertet', // Nr. 6
  '/assets/kacheln/autohaus-fuhrpark-service-leipzig-carcare.webp': 'aufgewertet', // Nr. 8
  '/assets/kacheln/schaden-melden-leipzig-carcare.webp': 'aufgewertet', // Nr. 9
  '/assets/kacheln/versicherung-schadenabwicklung-leipzig-carcare.webp': 'aufgewertet', // Nr. 10
  '/assets/kacheln/kalkulation-leipzig-carcare.webp': 'aufgewertet', // Nr. 11
  '/assets/kacheln/versicherungsabwicklung-leipzig-carcare.webp': 'aufgewertet', // Nr. 12
  '/assets/kacheln/privatkunden-leipzig-carcare.webp': 'aufgewertet', // Nr. 13
  '/assets/kacheln/versicherungen-und-agenturen-leipzig-carcare.webp': 'aufgewertet', // Nr. 14
  '/assets/kacheln/fahrzeugabgabe-leipzig-carcare.webp': 'aufgewertet', // Nr. 15

  // Porträts der Mitarbeiterstimmen (Backlog 5.28), eingebaut 2026-10-03. Der User: „Es handelt sich hier um echte
  // Mitarbeiter, die ihr Einverständnis zur Nutzung der Bilder gegeben haben.“ Laut EXIF iPhone-Aufnahmen vom
  // 02.10.2026 ohne Bearbeitungssoftware. Aufbereitet mit `npm run fotos`: nur Zuschnitt, beim Serviceberater zwei
  // Schreibtischzettel weichgezeichnet (Datenschutz, keine KI). `components/Stimmen.tsx` verlangt diesen Eintrag.
  '/assets/team/stimme-fahrzeuglackiererin-leipzig-carcare.webp': 'echt',
  '/assets/team/stimme-serviceberater-leipzig-carcare.webp': 'echt',
  '/assets/team/stimme-fahrzeuglackierer-leipzig-carcare.webp': 'echt',
  '/assets/team/stimme-kfz-aufbereiter-leipzig-carcare.webp': 'echt',
  '/assets/team/stimme-karosserie-fahrzeugbaumechaniker-leipzig-carcare.webp': 'echt',

  // Ausbildungskarte Bürokaufmann/-frau (Backlog 6.16), eingebaut 2026-10-05. Der User: Bild einer echten Auszubildenden
  // zur Bürokauffrau im Betrieb. Aufbereitet mit `npm run fotos`: weder Zuschnitt noch Vergrößerung, keine KI.
  '/assets/kacheln/karriere-buerokauffrau-leipzig-carcare.webp': 'echt',
  // Karte „Serviceberater“ (B106), eingebaut 2026-10-05: echtes Foto aus unserem Büro, Angabe des Users wie oben.
  // Nur 4:3-Ausschnitt aus dem Hochformat (`npm run fotos`), keine KI.
  '/assets/kacheln/karriere-serviceberater-leipzig-carcare.webp': 'echt',
};

/**
 * Vorgabe für alles, was nicht in den Ausnahmen steht (Stand 2026-09-20). Seit 2026-10-03 steht jede ausgelieferte
 * Datei in den Ausnahmen; die Vorgabe gilt also nur noch für ein neues Bild, dessen Herkunft noch niemand bestätigt
 * hat. Es zeigt dann vorsorglich „KI-generiert“, und das Bildinventar führt es als „Vorgabe, ungeklärt“.
 */
const STANDARD: Bildherkunft = 'generiert';

/** Marken- und Verbandsgrafiken tragen nie eine Plakette. */
const GRAFIK = /\/assets\/(carcare-center-|partner\/|eu-emblem)/;

export const herkunftVon = (quelle?: string | null): Bildherkunft => {
  if (!quelle) return 'echt';
  if (!quelle.startsWith('/assets/')) return 'echt'; // externe Bilder (Stockfoto der Teilen-Vorschau)
  if (GRAFIK.test(quelle)) return 'echt';
  return AUSNAHMEN[quelle] ?? STANDARD;
};

/**
 * Ist die Herkunft ausdrücklich geklärt — Eintrag in `AUSNAHMEN`, Grafik oder externes Bild?
 * `false` heißt: Die Plakette folgt nur der Vorgabe `STANDARD` (offen in Backlog R15).
 * Gelesen vom Bildinventar (`scripts/bilder-inventar.mjs`), nicht von der Seite.
 */
export const istGeklaert = (quelle?: string | null): boolean =>
  !quelle || !quelle.startsWith('/assets/') || GRAFIK.test(quelle) || quelle in AUSNAHMEN;

/** Text für die Plakette an genau diesem Bild; leer heißt: keine Plakette. */
export const hinweisFuer = (quelle?: string | null): string => HERKUNFT_TEXT[herkunftVon(quelle)];
