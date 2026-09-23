/**
 * Videoplaetze der Website — Backlog 3.18, 3.20, 3.21.
 *
 * WARUM ALS DATENQUELLE UND NICHT JE SEITE: Der Kunde schneidet das Drohnen- und
 * Betriebsvideo selbst und liefert es nach. Das Einhaengen soll dann ein EINTRAG sein,
 * kein Umbau — `quelle` von `null` auf den Dateipfad setzen, `istPlatzhalter` auf
 * `false`, fertig. Wer das an drei Seitenkomponenten verteilt haette, muesste beim
 * Nachliefern drei Dateien treffen und wuerde die dritte vergessen.
 *
 * KEINE LAUFZEIT-IMPORTE in dieser Datei. `scripts/check-dummies.mjs` uebersetzt sie
 * einzeln, um die Platzhalter zu finden; ein echter Import waere dort nicht aufloesbar.
 *
 * ⚠️ BEIM NACHLIEFERN NICHT VERGESSEN: Der Titel des Platzes steht in der
 * `ANERKANNT`-Liste von `scripts/check-dummies.mjs`. Sobald `istPlatzhalter` auf `false`
 * geht, muss der Eintrag dort mit weg — eine Anerkennung, die auf nichts mehr passt,
 * bricht den Build. Das ist Absicht: So kann die Liste nicht verrotten.
 */

export interface VideoPlatz {
  /** Schluessel, ueber den eine Seite ihren Platz holt. */
  id: string;
  /**
   * Sichtbare Ueberschrift. Solange `istPlatzhalter` gilt, ist das zugleich der Text,
   * den der Dummy-Waechter erkennt — deshalb traegt er das Wort „Videoplatz".
   */
  titel: string;
  /** Sichtbarer Beschreibungstext unter der Ueberschrift. */
  beschreibung: string;
  /** Was das Video zeigen soll. Steht im Platzhalter und ist die Liefervorgabe. */
  zweck: string;
  /** Pfad zur Videodatei unter `public/`, z. B. `/assets/betrieb-drohne.mp4`. */
  quelle: string | null;
  /** Standbild, das vor dem Abspielen und bei reduzierter Bewegung erscheint. */
  poster: string | null;
  /** `true`, solange kein Material vorliegt. Der Dummy-Waechter liest genau dieses Feld. */
  istPlatzhalter: boolean;
  /** Backlog-Nummer, damit der Waechter im Build sagen kann, worauf gewartet wird. */
  backlog: string;
}

export const videoPlaetze: VideoPlatz[] = [
  {
    id: 'ueber-uns-hero',
    titel: 'Videoplatz Hero Über uns',
    beschreibung: 'Läuft als Hintergrund hinter dem Kopfbereich weiter, während gescrollt wird.',
    zweck:
      'Ruhiger Ausschnitt aus dem Betriebsvideo, der als Endlosschleife im Hintergrund tragen kann — ohne harte Schnitte, ohne Text im Bild.',
    // Geliefert am 2026-09-07. Ausschnitt 9,0–21,2 s aus `2. Video/CarCare .mov` — die
    // laengste schnittfreie Einstellung des Films, stumm, 1280 breit, 2,1 MiB statt
    // 115,6 MiB. Herleitung des Ausschnitts und der Parameter: `scripts/build-video.mjs`.
    //
    // Das Standbild kommt aus dem ERSTEN Bild der Schleife, nicht aus dem frueheren
    // `carcare-hero-workshop.webp`: Das zeigt eine andere Halle, das Bild waere beim
    // Anlaufen des Videos sichtbar umgesprungen. Das alte Foto bleibt, wo es ist —
    // `ExpandingCardAccordion` und `TargetGroupCards` nutzen es als Standardhintergrund.
    quelle: '/assets/carcare-ueber-uns-hero.mp4',
    poster: '/assets/carcare-ueber-uns-hero-standbild.webp',
    istPlatzhalter: false,
    backlog: '3.20',
  },
  {
    id: 'ueber-uns-betrieb',
    titel: 'Videoplatz Betriebsrundgang',
    beschreibung: 'Ein Durchgang durch alle Bereiche im laufenden Betrieb.',
    zweck:
      'Drohnenaufnahme: Anflug, Vogelperspektive, danach langsamer Durchflug durch alle Bereiche im aktiven Betrieb. Ausdrücklich kein Mitarbeiterporträt.',
    // Geliefert am 2026-09-07, Ausschnitt 21,5–52,2 s aus `2. Video/CarCare .mov`:
    // Waschplatz, Schadenaufnahme, Werkstatthalle, Karosseriearbeit, Lackierkabine —
    // ein Durchgang durch die Bereiche, wie hier verlangt. Stumm, weil `autoplay` nur
    // stumm erlaubt ist; der Film MIT Ton bleibt vorerst ungenutzt.
    //
    // Das Standbild stammt bewusst NICHT vom Anfang, sondern von 31,1 s (weite Halle):
    // Bei reduzierter Bewegung zeigt die Komponente ausschliesslich das Standbild, und
    // Windows meldet reduzierte Bewegung systemweit. Es muss die Sektion allein tragen.
    quelle: '/assets/carcare-betriebsrundgang.mp4',
    poster: '/assets/carcare-betriebsrundgang-standbild.webp',
    istPlatzhalter: false,
    backlog: '3.21',
  },
  {
    id: 'karriere-betrieb',
    titel: 'Videoplatz Arbeitsplatz',
    beschreibung: 'Zeigt den Betrieb, in dem gearbeitet wird — nicht nur eine Liste von Vorteilen.',
    zweck:
      'Derselbe Rundgang wie auf „Über uns", hier auf den Arbeitsplatz hin geschnitten: Hallen, Ausstattung, Arbeitsplätze im Betrieb.',
    // Geliefert am 2026-09-07, Ausschnitt 46,3–75,9 s aus derselben Quelle: Lackierkabine,
    // Teilevorbereitung, Politur, Hebebuehne, Reifenraum. Die Ueberschneidung mit dem
    // Rundgang ist gewollt — `zweck` verlangt ausdruecklich „derselben Rundgang, hier auf
    // den Arbeitsplatz hin geschnitten".
    //
    // Beginnt bei 46,3 s statt direkt am Schnitt (45,6 s): Davor faehrt die Kamera an
    // einer Saeule vorbei, die halbe linke Bildhaelfte ist schwarz.
    // Standbild von 71,1 s — zwei Kollegen am Fahrzeug. Auf einer Karriereseite zaehlen
    // Menschen bei der Arbeit, nicht eine leere Halle.
    quelle: '/assets/carcare-arbeitsplatz.mp4',
    poster: '/assets/carcare-arbeitsplatz-standbild.webp',
    istPlatzhalter: false,
    backlog: '3.18',
  },
  {
    id: 'startseite-lackierung',
    titel: 'Videoplatz Lackierung Startseite',
    beschreibung: 'Ein Kollege lackiert in der Lackierkabine eine Motorhaube.',
    zweck:
      'Kurze, ruhige Schleife aus der Lackierkabine für die Karte „Neu- und Reparaturlackierung“ der Startseite (Bildstelle B11).',
    // Geliefert am 2026-09-21 („Video - Lackieren.mov“, iPhone, hochkant, 28 s, 51 MiB).
    // Ausschnitt 2,0–15,0 s, quadratisch zugeschnitten, stumm, 720 × 720 — 0,9 MiB. Herleitung:
    // `scripts/build-video.mjs`, Schnitt `startseite-lackierung`.
    //
    // NUR AUF DER STARTSEITE (Wunsch des Users: „damit wir nicht zu viel Datenvolumen mit der
    // gesamten Seite fressen“). Alle anderen Stellen der Leistung zeigen das Foto aus
    // `data/services.ts`. Auch hier laedt das Video erst, wenn die Karte aufgeklappt wird.
    quelle: '/assets/carcare-autolackierung.mp4',
    poster: '/assets/carcare-autolackierung-standbild.webp',
    istPlatzhalter: false,
    backlog: 'B11',
  },

  /*
   * BEREICHSVIDEOS — Backlog R18, Wunsch des Users vom 2026-09-21: je ein Video fuer den
   * Karosserie- und Mechanik-, den Lackier- und den Aufbereitungsbereich, auf `/ueber-uns` UND
   * `/karriere`, drei in einer Reihe (`components/BereichsVideos.tsx`).
   *
   * EIN EINTRAG JE BEREICH, nicht je Seite: Beide Seiten zeigen denselben Film. Beim Nachliefern
   * wird hier `quelle`/`poster` gesetzt und `istPlatzhalter` auf `false` — beide Seiten haben
   * das Video dann zugleich. Die Kartentexte stehen je Seite in der Seitenkomponente, weil
   * „Unser Lackierbereich" und „Ihr Arbeitsplatz" verschiedene Saetze sind.
   *
   * `zweck` ist die Liefervorgabe und steht im Platzhalter — bewusst ohne erfundene Details
   * (keine Maschinennamen, keine Mitarbeiterzahlen je Bereich).
   */
  {
    id: 'bereich-karosserie',
    titel: 'Videoplatz Karosserie- und Mechanikbereich',
    beschreibung: 'Der Karosserie- und Mechanikbereich im laufenden Betrieb.',
    zweck: 'Kurzer Rundgang durch den Karosserie- und Mechanikbereich: Instandsetzung nach Unfallschäden, Richten, Schweißen und Montage — Menschen bei der Arbeit, kein Text im Bild.',
    // Geliefert am 2026-09-23 vom User („CarCare 2 Hebebühne.mov" aus dem Drohnenordner der
    // Lieferung vom 07.09.). Ganze Einstellung 0–10,1 s, stumm, 960 breit — 0,57 MiB statt
    // 13,4 MiB. Herleitung: `scripts/build-video.mjs`, Schnitt `bereich-karosserie`.
    //
    // ZWEI KUNDENKENNZEICHEN sind weichgezeichnet (Mercedes im Vordergrund, BMW auf der
    // Hebebühne) — dieselbe Pflicht wie bei R16. Am fertigen Video Bild für Bild
    // nachgeprüft, nicht nur an den acht Punkten des Prüfbogens.
    //
    // Dieser Clip ist bildstabilisiert und trägt schwarze Ränder (oben 12, links 20 px);
    // sie sind im Schnitt weggeschnitten. Gemessen mit `cropdetect`, nicht geschätzt.
    quelle: '/assets/carcare-bereich-karosserie.mp4',
    poster: '/assets/carcare-bereich-karosserie-standbild.webp',
    istPlatzhalter: false,
    backlog: 'R18',
  },
  {
    id: 'bereich-lack',
    titel: 'Videoplatz Lackierbereich',
    beschreibung: 'Der Lackierbereich im laufenden Betrieb.',
    zweck: 'Kurzer Rundgang durch den Lackierbereich: Vorbereitung, Farbtonbestimmung und Arbeit in der Lackierkabine — kein Text im Bild.',
    // Geliefert am 2026-09-23 vom User („CarCare Lackieren.mov"). Ausschnitt 1,6–11,9 s,
    // stumm, 960 breit — 0,73 MiB statt 15,8 MiB.
    //
    // Das Standbild stammt von 10,8 s: ganze Kabine, abgeklebtes Fahrzeug, Lackierer daneben.
    // Bei diesen Karten läuft das Video erst auf Klick — das Standbild ist also das, was
    // praktisch jeder sieht, und muss die Karte allein tragen.
    quelle: '/assets/carcare-bereich-lack.mp4',
    poster: '/assets/carcare-bereich-lack-standbild.webp',
    istPlatzhalter: false,
    backlog: 'R18',
  },
  {
    id: 'bereich-aufbereitung',
    titel: 'Videoplatz Aufbereitungsbereich',
    beschreibung: 'Der Aufbereitungsbereich im laufenden Betrieb.',
    zweck: 'Kurzer Rundgang durch den Aufbereitungsbereich: Innen- und Außenaufbereitung, Politur und Versiegelung — kein Text im Bild.',
    // Geliefert am 2026-09-23 vom User („CarCare 1 Polieren .mov"). Ausschnitt 0,8–16,8 s
    // von 25,4 s, stumm, 960 breit — 1,58 MiB statt 33,3 MiB. Ab etwa 17 s wandert die
    // Kamera nach rechts und es steht mehr Hallenboden als Arbeit im Bild.
    quelle: '/assets/carcare-bereich-aufbereitung.mp4',
    poster: '/assets/carcare-bereich-aufbereitung-standbild.webp',
    istPlatzhalter: false,
    backlog: 'R18',
  },
];

/**
 * Holt einen Platz ueber seine `id`.
 *
 * Wirft bewusst statt `undefined` zurueckzugeben: Eine Seite, die einen Platz anfordert
 * den es nicht gibt, ist ein Tippfehler — der soll beim ersten Rendern auffallen und
 * nicht als stillschweigend fehlende Sektion durchgehen.
 */
export const videoPlatz = (id: string): VideoPlatz => {
  const treffer = videoPlaetze.find((p) => p.id === id);
  if (!treffer) throw new Error(`videoPlatz: Kein Platz mit der id "${id}" in data/videos.ts.`);
  return treffer;
};
