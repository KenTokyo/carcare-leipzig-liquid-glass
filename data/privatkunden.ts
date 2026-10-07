/**
 * Vorteile für Privatkunden — EINE Quelle für die Unterseite `/privatkunden` und die Privatkunden-Karte der
 * Startseite („Für wen wir arbeiten").
 *
 * WARUM HIER (Backlog 6.4, User 2026-09-28): „die Texte in kurzer Form aus der Subseite der Privatkunden auf die
 * Textkacheln auf der Hauptseite unter Privatkunden". Die Unterseite zeigt `beschreibung`, die Startseite `kurz`.
 * Stuenden die Kurzfassungen in der Kartenkomponente, liefe die Startseite beim naechsten Textwechsel der
 * Unterseite still hinterher. Titel teilen sich beide — so erkennt man die Kachel auf der Unterseite wieder.
 *
 * `kurz`: eine Aussage, dieselbe Tatsache wie die Langfassung, keine neue Behauptung. Unter 70 Zeichen, damit
 * die Kachel in der schmalen Kartenspalte (ab 25 rem) kurz bleibt. Betrag und Einheit mit geschütztem Leerzeichen
 * (` `): Auf 1366 px brach „169,00 / €“ sonst zwischen Zahl und Währung um.
 * `startseite`: nur diese Kacheln stehen auf der Startseite. Die Karte hat die Höhe eines Fensters abzüglich
 * Navigation und Titelleiste; mehr als vier Kacheln hätten auf einem Laptop (1366 × 657) gescrollt werden müssen.
 */
export interface PrivatkundenVorteil {
  title: string;
  /** Langfassung auf `/privatkunden`. */
  beschreibung: string;
  /** Kurzfassung für die Kachel auf der Startseite. */
  kurz: string;
  /** Steht als Kachel auf der Startseite. */
  startseite?: boolean;
}

export const privatkundenVorteile: PrivatkundenVorteil[] = [
  {
    title: 'Ein Betrieb statt drei Werkstätten',
    beschreibung: 'Karosserie, Lack, Smart Repair, Felgen, Glas und Aufbereitung liegen auf über 3.500 m² im eigenen Haus. Ihr Fahrzeug wird zwischen den Schritten nicht weitergereicht, und Sie haben einen Ansprechpartner statt drei.',
    kurz: 'Alles auf über 3.500 m² und ein Ansprechpartner statt drei.',
    startseite: true,
  },
  {
    title: 'Feste Paketpreise bei der Aufbereitung',
    beschreibung: 'Die Pflegepakete haben feste Paketpreise: ab 169 € für die Brillant Außenpflege, ab 199 € für die Intensiv Innenraumreinigung, ab 299 € für beides als Premiumpflege. Für Geländewagen, Großraumlimousinen und Transporter gilt ein fester Aufpreis. Sie wissen vorher, was es kostet.',
    kurz: 'Feste Pflegepakete ab 169 €: Sie wissen vorher, was es kostet.',
    startseite: true,
  },
  {
    title: 'Wir empfehlen die kleinere Lösung zuerst',
    beschreibung: 'Wo Spot-Repair fachlich ausreicht, raten wir dazu statt zur Komplettlackierung. Ist die Delle lackfrei zu drücken, wird gar nicht lackiert. Reicht das nicht aus, sagen wir das ebenso deutlich.',
    kurz: 'Wo Spot-Repair oder lackfreies Ausbeulen reicht, raten wir dazu.',
    startseite: true,
  },
  {
    title: 'Sie verhandeln nicht mit der Versicherung',
    beschreibung: 'Auf Wunsch übernehmen wir Kostenvoranschlag, Schriftverkehr und die Abstimmung mit Versicherern, Agenturen und Gutachtern. Bei Hagelschäden rechnen wir direkt ab, ohne Anzahlung Ihrerseits.',
    kurz: 'Auf Wunsch klären wir alles mit Versicherung und Gutachter.',
    startseite: true,
  },
  {
    title: 'Sie bleiben mobil',
    beschreibung: 'Für die Dauer der Reparatur organisieren wir nach Verfügbarkeit einen Ersatzwagen. Sprechen Sie uns bei der Terminvereinbarung darauf an.',
    kurz: 'Ersatzwagen nach Verfügbarkeit.',
  },
  {
    title: 'Originallack bleibt erhalten',
    beschreibung: 'Die lackfreie Dellenentfernung ist lackschonend: Der Originallack bleibt erhalten, und die reparierte Stelle ist danach nicht zu sehen. Die Methode ist bei Versicherungen und Gutachtern anerkannt.',
    kurz: 'Lackfreie Dellenentfernung, danach nicht zu sehen.',
  },
  {
    title: 'Farbtongenau als Glasurit-Lackpartner',
    beschreibung: 'Ziel jeder Lackreparatur ist, dass weder Farbton- noch Effektunterschiede zur Originallackierung für das Auge erkennbar sind, mit umweltschonenden Wasserbasislacken.',
    kurz: 'Kein erkennbarer Unterschied zur Originallackierung.',
  },
  {
    title: 'Markenunabhängig und erfahren',
    // Backlog 4.11 + R13: neue Bezeichnung; „seit 1998 am Markt" haengt am Betrieb, nicht am Meistertitel.
    beschreibung: 'Meisterbetrieb im Kfz-Lackier- und Karosseriebauhandwerk, seit 1998 am Markt, über 50 Mitarbeiter, alle Fabrikate vom Kleinwagen bis zum Premiumfahrzeug.',
    kurz: 'Meisterbetrieb seit 1998, alle Marken.',
  },
];

/** Die Kacheln der Privatkunden-Karte auf der Startseite. */
export const privatkundenKacheln = privatkundenVorteile.filter((vorteil) => vorteil.startseite);
