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
    // Kein sichtbarer Platzhalter: Hier steht bereits das Werkstattfoto und traegt den
    // Kopfbereich vollstaendig. Sobald `quelle` gesetzt ist, tritt das Video an seine
    // Stelle und das Foto wird automatisch zum Standbild.
    quelle: null,
    poster: '/assets/carcare-hero-workshop.webp',
    istPlatzhalter: false,
    backlog: '3.20',
  },
  {
    id: 'ueber-uns-betrieb',
    titel: 'Videoplatz Betriebsrundgang',
    beschreibung: 'Ein Durchgang durch alle Bereiche im laufenden Betrieb.',
    zweck:
      'Drohnenaufnahme: Anflug, Vogelperspektive, danach langsamer Durchflug durch alle Bereiche im aktiven Betrieb. Ausdrücklich kein Mitarbeiterporträt.',
    quelle: null,
    poster: '/assets/carcare-hero-workshop.webp',
    istPlatzhalter: true,
    backlog: '3.21',
  },
  {
    id: 'karriere-betrieb',
    titel: 'Videoplatz Arbeitsplatz',
    beschreibung: 'Zeigt den Betrieb, in dem gearbeitet wird — nicht nur eine Liste von Vorteilen.',
    zweck:
      'Derselbe Rundgang wie auf „Über uns", hier auf den Arbeitsplatz hin geschnitten: Hallen, Ausstattung, Arbeitsplätze im Betrieb.',
    quelle: null,
    poster: '/assets/carcare-hero-workshop.webp',
    istPlatzhalter: true,
    backlog: '3.18',
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
