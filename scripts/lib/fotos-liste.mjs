/**
 * Fotoliste fuer `npm run fotos` (`scripts/build-fotos.mjs`): je Foto Quelle, Ziel, Ausschnitt, Weichzeichnung und
 * Metadaten. Reine Daten, die Verarbeitung steht im Skript.
 *
 * WARUM EIGENE DATEI (2026-10-14): Mit dem Kundenempfang (B24) kam `build-fotos.mjs` ueber die 700-Zeilen-Regel aus
 * CLAUDE.md. Die Liste waechst mit jeder Lieferung, die Verarbeitung nicht.
 */

/**
 * Zweiter Lieferordner (2026-10-03): das Anhaengerfoto fuer die Startseitenkarte „Autohaeuser & Fuhrparks“ liegt in den
 * gesichteten Fotos vom August. Eintraege mit `ordner` lesen von dort; `--ordner` aendert nur den Standard.
 */
const ORDNER_GESICHTET_AUG26 =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/Gesichtet/CarCare Fotos Aug 26_0';
/**
 * Porträts der Mitarbeiterstimmen (Backlog 5.28, 2026-10-03): WeTransfer-Lieferung vom 02.10.2026, noch im Download-Ordner
 * des Users. Vorname und Beruf stehen im Dateinamen. ⚠️ Beim Umzug in den Lieferordner diesen Pfad mitziehen.
 */
const ORDNER_STIMMEN_OKT26 = 'C:/Users/Moham/Downloads/wetransfer_image00001-jpeg_2026-10-02_1001';
/**
 * Bürofotos vom 2026-10-05 (Karriere-Karten Bürokaufmann/-frau, Backlog 6.16, und Serviceberater, B106): vom User als
 * Chat-Anhänge geliefert, dort ohne Dateinamen. Hier als Originale abgelegt und sprechend benannt.
 * ⚠️ Beim Umzug in den Lieferordner diesen Pfad mitziehen.
 */
const ORDNER_BUERO_OKT26 = 'C:/Users/Moham/Downloads/carcare-buero-fotos-2026-10-05';
/**
 * Empfangsfoto vom 2026-10-14 (B24, B32, B75): vom User als Chat-Anhang geliefert. Als Quelle dient die verlustfreie
 * PNG aus dem Bildwerkzeug (Downloads, `hf_20261013_234003_….png`, bildgleich mit dem Anhang), hier sprechend benannt.
 * ⚠️ Beim Umzug in den Lieferordner diesen Pfad mitziehen.
 */
const ORDNER_EMPFANG_OKT26 = 'C:/Users/Moham/Downloads/carcare-empfang-foto-2026-10-14';

/** IPTC „Edited using Generative AI“: echtes Foto, mit generativer KI bearbeitet (Plakette „KI-bearbeitet“). */
const QUELLTYP_KI_BEARBEITET = 'http://cv.iptc.org/newscodes/digitalsourcetype/compositeWithTrainedAlgorithmicMedia';

/**
 * Die Fotos der Lieferung vom 2026-09-21.
 *
 * `oben` (nur Hochformat): Oberkante des 4:3-Ausschnitts, relativ zur Bildhoehe nach der Drehung.
 * `unkenntlich`: Rechtecke relativ zum GANZEN gedrehten Bild (x0, y0, x1, y1), vor dem Zuschnitt.
 * Beides wurde am Bild gemessen (vergroesserte Ausschnitte), nicht geschaetzt.
 * `beschreibung` beschreibt, was zu sehen ist — Markennamen bewusst nicht, wie in den
 * Alternativtexten der Seite („gelber Sportwagen“ statt Modellname).
 * `format` / `breite` (seit 2026-09-28, optional): anderes Seitenverhaeltnis als 4:3 bzw. geringere
 * Breite als `MAX_BREITE` — fuer Einsatzorte, die ein anderes Format brauchen (Backlog 6.2: quadratisch,
 * rund 430 px breit dargestellt; 2000 px waeren dort nur Ladezeit).
 * `quelltyp` / `ki` (seit 2026-10-14, optional): IPTC „Digital Source Type“, wenn das Foto NICHT unbearbeitet ist
 * (Vorgabe `digitalCapture`), und das eingesetzte KI-System fuer `AISystemUsed`/`AISystemVersionUsed` (IPTC 2025.1).
 * Beides nur nach Aussage des Users, passend zum Eintrag in `data/bildherkunft.ts`.
 *
 * PORTRÄTS DER MITARBEITERSTIMMEN (Backlog 5.28, angekuendigt 2026-10-02): je Foto ein Eintrag mit
 * `breite: 480` (dargestellt 64–72 px rund, auch auf 3x-Bildschirmen scharf) und einem quadratischen
 * `ausschnitt` um Kopf und Schultern — mit allen vier Werten, denn ohne `y1` rechnet das Skript 16:10:
 * (x1 − x0) · Bildbreite = (y1 − y0) · Bildhoehe. Ziel `team/stimme-<beruf>-leipzig-carcare.webp`, andere
 * Lieferung, also `--ordner` angeben, und im Pruefbogen ansehen, ob das Gesicht mittig im Kreis sitzt.
 * Die uebrigen Schritte (Einwilligung, Herkunft, `foto` setzen) stehen im Kopf von `data/stimmen.ts`;
 * ohne bestaetigte Herkunft bricht der Build absichtlich.
 */
export const FOTOS = [
  {
    ziel: 'kacheln/unfallinstandsetzung-leipzig-carcare.webp',
    quelle: 'Unfallinstandsetzung-leipzig-carcare.webp.jpeg',
    stellen: 'B10, B36, B37, B77, B85, B95',
    unkenntlich: [{ was: 'Kennzeichen des schwarzen SUV im Hintergrund', x0: 0.2150, y0: 0.3545, x1: 0.2590, y1: 0.3760 }],
    titel: 'Unfallinstandsetzung im CarCare Center Leipzig',
    beschreibung: 'Karosseriebauer mit Schweißhelm schweißt an der Dachsäule eines weißen Unfallfahrzeugs, das für die Instandsetzung abgeklebt ist.',
    stichwoerter: ['Unfallinstandsetzung', 'Karosseriebau', 'Schweißen', 'Unfallreparatur', 'Karosseriewerkstatt'],
  },
  /*
   * HINTERGRUND-AUSSCHNITTE (zweite Fassung desselben Fotos fuer den Seitenhintergrund).
   *
   * WARUM: Der Seitenhintergrund (`BackdropLayout` → `PhotoBackdrop`, Textschutz `wide`) zeigt das
   * Foto nur RECHTS der Mitte, das Bildfenster liegt bei 72 % Breite; links liegt der weisse
   * Textschutz. Bei Unfallinstandsetzung und Lackierung steht das Motiv aber im linken Drittel:
   * Am 2026-09-21 zeigte die Unfallseite nur ein abgedecktes Auto ohne den Schweisser, die
   * Lackierseite eine graue Flaeche ohne Pistole (Bildschirmfotos 1440 × 900).
   * Deshalb ein eigener Ausschnitt, der das Motiv nach rechts rueckt (16:10 wie die Flaeche).
   * Karten und Kacheln behalten das ganze Bild. Gleiches Foto, gleiches Motiv — nur gerahmt.
   */
  {
    ziel: 'kacheln/unfallinstandsetzung-hintergrund-leipzig-carcare.webp',
    quelle: 'Unfallinstandsetzung-leipzig-carcare.webp.jpeg',
    stellen: 'B36 (Seitenhintergrund /unfallinstandsetzung-leipzig)',
    // Schweisser bei 25–55 % der Breite → im Ausschnitt bei 40–89 %.
    ausschnitt: { x0: 0, y0: 0.3, x1: 0.62 },
    unkenntlich: [{ was: 'Kennzeichen des schwarzen SUV im Hintergrund', x0: 0.2150, y0: 0.3545, x1: 0.2590, y1: 0.3760 }],
    titel: 'Unfallinstandsetzung im CarCare Center Leipzig',
    beschreibung: 'Karosseriebauer mit Schweißhelm schweißt an der Dachsäule eines weißen, für die Instandsetzung abgeklebten Unfallfahrzeugs.',
    stichwoerter: ['Unfallinstandsetzung', 'Karosseriebau', 'Schweißen', 'Unfallreparatur', 'Karosseriewerkstatt'],
  },
  {
    ziel: 'kacheln/autolackierung-hintergrund-leipzig-carcare.webp',
    quelle: 'autolackierung-leipzig-carcare.webp.jpeg',
    stellen: 'B69 (Seitenhintergrund /autolackierung-leipzig)',
    // Pistole bei 31–37 % der Breite, Hand bei 19–35 % → im Ausschnitt bei 62–74 % bzw. 38–70 %;
    // rechts davon die abgeklebte Stossfaengerkante. (Erster Versuch mit x1 = 0,4 setzte die
    // Pistole an den Rand und zeigte sonst nur Abdeckfolie — im Pruefbogen gesehen.)
    ausschnitt: { x0: 0, y0: 0.37, x1: 0.5 },
    titel: 'Neu- und Reparaturlackierung im CarCare Center Leipzig',
    beschreibung: 'Lackierpistole und Hand des Lackierers vor einem abgeklebten Stoßfänger in Nahaufnahme.',
    stichwoerter: ['Autolackierung', 'Reparaturlackierung', 'Lackierpistole', 'Lackierkabine', 'Glasurit'],
  },
  {
    ziel: 'kacheln/autolackierung-leipzig-carcare.webp',
    quelle: 'autolackierung-leipzig-carcare.webp.jpeg',
    // Seit 2026-10-03 zeigen alle Karten der Neu- und Reparaturlackierung das Lackiervideo (User: „überall“); das Foto
    // bleibt Rueckfall im Katalog und ist als `smart-repair-…` das Smart-Repair-Motiv (Eintraege oben).
    stellen: 'Rueckfall im Katalog (B11, B38, B64, B80, B86, B96, B131 zeigen das Video)',
    oben: 0.21,
    titel: 'Neu- und Reparaturlackierung im CarCare Center Leipzig',
    beschreibung: 'Lackierer trägt mit der Lackierpistole Lack auf einen abgeklebten Stoßfänger auf, das übrige Fahrzeug ist mit Folie und Papier abgedeckt.',
    stichwoerter: ['Autolackierung', 'Reparaturlackierung', 'Lackierpistole', 'Lackierkabine', 'Glasurit'],
  },
  /*
   * BILDTAUSCH 2026-10-03 (User): Smart Repair zeigt jetzt das Lackierfoto, Hagelschaden und Dellenentfernung bekommen
   * neue echte Fotos, die Startseitenkarte „Autohaeuser & Fuhrparks“ das Anhaengerfoto. Die abgeloesten Dateien liegen
   * in `docs/bilder/archiv/` (README dort). Herkunft aller vier: echt, laut User („Alle Bilder sind echt“).
   */
  {
    // Smart Repair: dasselbe Lackierfoto wie die Neu- und Reparaturlackierung (deren Karten zeigen seit 2026-10-03 das
    // Lackiervideo). Eigener Dateiname, damit Name und Metadaten zur Leistung passen (SEO-GEO 3.3).
    ziel: 'kacheln/smart-repair-leipzig-carcare.webp',
    quelle: 'autolackierung-leipzig-carcare.webp.jpeg',
    stellen: 'B12, B39, B61, B68 (Seitenhintergrund: eigener Ausschnitt unten), B78, B87, B97, B132',
    oben: 0.21,
    titel: 'Smart Repair im CarCare Center Leipzig',
    beschreibung: 'Lackierer trägt mit der Lackierpistole Lack auf einen abgeklebten Stoßfänger auf, das übrige Fahrzeug ist mit Folie und Papier abgedeckt.',
    stichwoerter: ['Smart Repair', 'Spot-Repair', 'Lackreparatur', 'Lackierpistole', 'Glasurit'],
  },
  {
    // Seitenhintergrund von /smart-repair-leipzig: wie bei der Lackierseite rueckt der Ausschnitt die Pistole nach rechts,
    // sonst laege sie unter dem Textschutz (siehe HINTERGRUND-AUSSCHNITTE oben). Gleiche Werte wie dort.
    ziel: 'kacheln/smart-repair-hintergrund-leipzig-carcare.webp',
    quelle: 'autolackierung-leipzig-carcare.webp.jpeg',
    stellen: 'B68 (Seitenhintergrund /smart-repair-leipzig)',
    ausschnitt: { x0: 0, y0: 0.37, x1: 0.5 },
    titel: 'Smart Repair im CarCare Center Leipzig',
    beschreibung: 'Lackierpistole und Hand des Lackierers vor einem abgeklebten Stoßfänger in Nahaufnahme.',
    stichwoerter: ['Smart Repair', 'Spot-Repair', 'Lackreparatur', 'Lackierpistole', 'Glasurit'],
  },
  {
    // Neues Motiv seit 2026-10-03 (User: „Dellenentfernung-leipzig-carcare-center“). Liegt schon im Querformat 4:3 vor
    // (1600 × 1200, kein EXIF), deshalb kein Ausschnitt und keine Hochskalierung auf 2000 px. Das fruehere Motiv (Ausbeulen
    // an der A-Saeule) ist archiviert; dieselbe Szene zeigt jetzt die Hagelschadenreparatur.
    ziel: 'kacheln/dellenentfernung-leipzig-carcare.webp',
    quelle: 'Dellenentfernung-leipzig-carcare-center.jpeg',
    stellen: 'B13, B40, B60, B70, B79, B88, B133',
    // Kennzeichen des weissen Porsche im Hintergrund links (Kundenfahrzeug), gemessen an der vergroesserten Aufnahme.
    unkenntlich: [{ was: 'Kennzeichen des weißen Porsche im Hintergrund', x0: 0.030, y0: 0.470, x1: 0.108, y1: 0.545 }],
    titel: 'Dellenentfernung ohne Lackieren im CarCare Center Leipzig',
    beschreibung: 'Leuchtschirm über dem Heck eines weißen Porsche: Im Streifenlicht wird die Delle neben der Heckleuchte sichtbar, die anschließend ohne Lackieren entfernt wird.',
    stichwoerter: ['Dellenentfernung', 'Ausbeulen ohne Lackieren', 'Leuchtschirm', 'Parkdelle', 'Smart Repair'],
  },
  {
    // Neu 2026-10-03 (User: „global für das Thema Hagelschaden“). Hochformat (EXIF 6) → 4:3 ab 10 % der Hoehe: oben der
    // Zuggriff, darunter beide Haende und die Klebestelle an der Dachsaeule (bei 55–58 %). Ersetzt
    // `hagelschadenreparatur-leipzig.webp` vollstaendig (archiviert).
    ziel: 'kacheln/hagelschadenreparatur-leipzig-carcare.webp',
    quelle: 'Hagelschaden-carcare-center-leipzig.jpeg',
    stellen: 'B14, B41, B71, B81, B89, B98, B134',
    oben: 0.10,
    titel: 'Hagelschadenreparatur im CarCare Center Leipzig',
    beschreibung: 'Ausbeultechniker zieht unter dem Leuchtschirm mit Gleithammer und Klebepad eine Delle an der Dachsäule eines dunklen Fahrzeugs heraus, ohne den Lack zu beschädigen.',
    stichwoerter: ['Hagelschadenreparatur', 'Hagelschaden', 'Ausbeulen ohne Lackieren', 'Klebetechnik', 'Leuchtschirm'],
  },
  {
    // Nur die Startseitenkarte „Autohaeuser & Fuhrparks“ (B26, User 2026-10-03: „nur hier, nicht in den Subseiten“).
    // Querformat 4:3 ohne Ausschnitt. Keine fremden Kennzeichen lesbar (Macan ohne vorderes Kennzeichen, BMW verdeckt);
    // „L CC 300“ ist unser Transporter und bleibt. Der Fahrer sitzt mit dem Ruecken zur Kamera.
    ziel: 'kacheln/autohaeuser-geschaeftskunden-haenger-leipzig-carcare.webp',
    ordner: ORDNER_GESICHTET_AUG26,
    quelle: 'Autohaueser und Geschaeftskunden Haenger.jpeg',
    stellen: 'B26 (nur Startseite)',
    titel: 'Fahrzeugtransport für Autohäuser und Geschäftskunden, CarCare Center Leipzig',
    beschreibung: 'Unser Autotransporter mit Anhänger bringt einen grünen und einen schwarzen Porsche, im Hintergrund die Werkstatthalle.',
    stichwoerter: ['Autohäuser', 'Fuhrpark', 'Geschäftskunden', 'Fahrzeugtransport', 'Autotransporter'],
  },
  {
    ziel: 'kacheln/ersatzwagen-leipzig-carcare.webp',
    quelle: 'ersatzwagen-leipzig-carcare.webp.jpeg',
    stellen: 'B23',
    oben: 0.32,
    // Kennzeichen des vorderen Polo nur angeschnitten am Rand — eigenes Mietfahrzeug, bleibt.
    titel: 'Ersatzwagen des CarCare Center Leipzig',
    beschreibung: 'Reihe weißer Kleinwagen mit der Beschriftung des CarCare Center vor unserer Werkstatt in Leipzig — unsere Ersatzwagen für die Dauer der Reparatur.',
    stichwoerter: ['Ersatzwagen', 'Werkstattersatzwagen', 'Mietwagen', 'Unfallreparatur', 'Werkstatt'],
  },
  {
    ziel: 'kacheln/autohaeuser-und-fuhrparks-leipzig-carcare.webp',
    quelle: 'autohaueser-und- fuhrparks-leipzig-carcare.webp.jpeg',
    stellen: 'B26, B84',
    // Der grüne Wagen auf dem Transporter traegt kein Kennzeichen, nur den leeren Halter.
    unkenntlich: [{ was: 'Kennzeichen des silbernen Cabrios im Hintergrund', x0: 0.8790, y0: 0.5455, x1: 0.9190, y1: 0.5645 }],
    titel: 'Für Autohäuser und Fuhrparks – CarCare Center Leipzig',
    beschreibung: 'Grüner Sportgeländewagen auf dem Autotransporter mit der Beschriftung des CarCare Center vor unserer Werkstatthalle in Leipzig.',
    stichwoerter: ['Autohaus', 'Fuhrpark', 'Fahrzeugtransport', 'Autotransporter', 'Geschäftskunden'],
  },
  {
    ziel: 'kacheln/innenaufbereitung-leipzig-carcare.webp',
    quelle: 'innenaufbereitung-leipzig-carcare.webp.jpeg',
    stellen: 'B27, B45, B67',
    titel: 'Innenaufbereitung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter reinigt mit Detailpinsel und Mikrofasertuch die Mittelkonsole eines hochwertigen Elektrosportwagens.',
    stichwoerter: ['Innenaufbereitung', 'Innenraumreinigung', 'Fahrzeugaufbereitung', 'Detailing', 'Cockpitpflege'],
  },
  {
    ziel: 'kacheln/lackaufbereitung-leipzig-carcare.webp',
    quelle: 'Lackaufbereitung-leipzig-carcare.webp.jpeg',
    stellen: 'B28',
    titel: 'Lackaufbereitung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiterin poliert mit der Poliermaschine den vorderen Kotflügel eines dunkelblauen SUV, der Radlauf ist abgeklebt.',
    stichwoerter: ['Lackaufbereitung', 'Politur', 'Poliermaschine', 'Außenaufbereitung', 'Fahrzeugaufbereitung'],
  },
  {
    ziel: 'kacheln/leasingrueckgabe-aufbereitung-leipzig-carcare.webp',
    quelle: 'leasingrueckgabe-aufbereitung-leipzig-carcare.webp.jpeg',
    stellen: 'B29',
    titel: 'Aufbereitung vor der Leasingrückgabe – CarCare Center Leipzig',
    beschreibung: 'Frisch aufbereiteter Außenspiegel und Fahrertür eines dunkelgrauen SUV in Nahaufnahme, der Lack glänzt ohne Gebrauchsspuren.',
    stichwoerter: ['Leasingrückgabe', 'Fahrzeugaufbereitung', 'Lackpflege', 'Werterhalt', 'Aufbereitung'],
  },
  {
    ziel: 'kacheln/aufbereitung-aktiv-leipzig-carcare.webp',
    quelle: 'Aufbereitung-aktiv-leipzig-carcare.webp.jpeg',
    stellen: 'B34',
    oben: 0.30,
    titel: 'Fahrzeugaufbereitung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter reinigt kniend die Scheibe der geöffneten Fahrertür eines kupferfarbenen SUV in unserer Aufbereitungshalle.',
    stichwoerter: ['Fahrzeugaufbereitung', 'Autoaufbereitung', 'Scheibenreinigung', 'Innenaufbereitung', 'Detailing'],
  },
  {
    ziel: 'kacheln/karriere-aufbereiter-leipzig-carcare.webp',
    quelle: 'karriere-aufbereiter-leipzig-carcare.webp.jpeg',
    stellen: 'B103, B108',
    titel: 'Kfz-Aufbereiter im CarCare Center Leipzig',
    beschreibung: 'Kfz-Aufbereiter wischt mit dem Mikrofasertuch den Türrahmen eines dunkelgrauen Sportwagens, im Lack spiegelt sich die Halle.',
    stichwoerter: ['Kfz-Aufbereiter', 'Karriere', 'Fahrzeugaufbereitung', 'Job Leipzig', 'Fahrzeugpflege'],
  },
  {
    ziel: 'kacheln/karriere-fahrzeugbau-leipzig-carcare.webp',
    quelle: 'karriere-fahrzeugbau-leipzig-carcare.webp.jpeg',
    stellen: 'B105',
    titel: 'Karosserie- und Fahrzeugbau im CarCare Center Leipzig',
    beschreibung: 'Karosseriebauer mit Schutzbrille setzt mit der Punktschweißzange Schweißpunkte am Dachrahmen eines Unfallfahrzeugs.',
    stichwoerter: ['Karosserie- und Fahrzeugbaumechaniker', 'Karriere', 'Punktschweißen', 'Karosseriebau', 'Ausbildung Leipzig'],
  },
  /*
   * BACKLOG 6.16 (User, 2026-10-05): echtes Foto einer Auszubildenden zur Bürokauffrau in unserem Büro, für die
   * Ausbildungskarte Bürokaufmann/-frau. Ersetzt dort `kalkulation-leipzig-carcare.webp`; diese Datei bleibt, sie steht
   * auch im Unfallbereich (`AccidentDamageSection`). Liegt schon im Format 4:3 (1448 × 1086): kein Ausschnitt, und
   * `withoutEnlargement` vergrößert nicht auf 2000 px. Kein Kennzeichen, kein Fremdlogo außer dem Gerätelogo.
   */
  {
    ziel: 'kacheln/karriere-buerokauffrau-leipzig-carcare.webp',
    ordner: ORDNER_BUERO_OKT26,
    quelle: 'buerokauffrau-ausbildung-carcare-leipzig.jpeg',
    stellen: 'B109 (Karriere › Ausbildung im Betrieb › Bürokaufmann/-frau)',
    titel: 'Ausbildung zur Bürokauffrau im CarCare Center Leipzig',
    beschreibung: 'Auszubildende zur Bürokauffrau am Schreibtisch mit Computer und Tastatur in unserem Büro, dahinter eine Zimmerpflanze und ein Wandbild.',
    stichwoerter: ['Bürokauffrau', 'Ausbildung', 'Karriere', 'Kaufmännische Ausbildung', 'Ausbildung Leipzig'],
  },
  /*
   * SERVICEBERATER (User, 2026-10-05): echtes Foto aus unserem Büro für die Karte „Serviceberater“ (B106). Ersetzt dort
   * `autohaus-fuhrpark-service-leipzig-carcare.webp`; diese Datei bleibt, sie steht noch an drei Stellen (Fuhrparkservice,
   * Titelbild). Hochformat 1086 × 1448 → 4:3-Ausschnitt, Oberkante bei 19 %: vom Haaransatz (rund 22 %) über den
   * Bildschirm (40–61 %) bis zu Händen und Laptopkante (rund 73 %). Auf dem Bildschirm unsere eigene Startseite.
   */
  {
    ziel: 'kacheln/karriere-serviceberater-leipzig-carcare.webp',
    ordner: ORDNER_BUERO_OKT26,
    quelle: 'serviceberatung-laptop-carcare-leipzig.jpeg',
    stellen: 'B106 (Karriere › Vier Gewerke unter einem Dach › Serviceberater)',
    oben: 0.19,
    titel: 'Serviceberatung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiterin von hinten am Laptop in unserem Büro, auf dem Bildschirm unsere Website mit dem Slogan „We Care. We Repair.“',
    stichwoerter: ['Serviceberater', 'Kundenservice', 'Karriere', 'Büro', 'Job Leipzig'],
  },
  /*
   * BACKLOG 6.2 (User, 2026-09-28): Bilder zum Schaum-/Tornador-Verfahren. Aus demselben Lieferordner, vom User
   * als Chat-Anhang ausgewaehlt; iPhone-Aufnahme vom 20.08.2026, 16:46 — zwischen dem Vorher- (14:55) und dem
   * Nachher-Foto (17:06) desselben Lenkrads, siehe `VERGLEICHE` unten.
   * QUADRATISCH: Die Karte steht neben der breiteren Vorher/Nachher-Karte (3/5 zu 2/5 der Reihe); gleich hoch
   * sind beide Bilder bei 16:10 dort und 1:1 hier. `oben` 0,14: Buerste mit Schaum (ab 0,22), Lenkradkranz
   * (0,31–0,80) und die zweite Hand rechts bleiben ganz im Bild.
   */
  {
    ziel: 'kacheln/alcantara-schaumreinigung-leipzig-carcare.webp',
    quelle: 'Alcantara Aufbereitung Waschen.jpeg',
    stellen: 'Innenaufbereitung › Exklusivleistungen (6.2)',
    format: 1,
    breite: 1200,
    oben: 0.14,
    titel: 'Schaumreinigung eines Alcantara-Lenkrads im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter arbeitet mit einer Bürste Reinigungsschaum in den Alcantara-Kranz eines ausgebauten Lenkrads ein, die Mitte ist mit Klebeband abgedeckt.',
    stichwoerter: ['Alcantara', 'Lenkrad', 'Schaumreinigung', 'Innenaufbereitung', 'Fahrzeugaufbereitung'],
  },
  /*
   * PORTRÄTS DER MITARBEITERSTIMMEN (Backlog 5.28, User 2026-10-03): fuenf iPhone-Aufnahmen vom 02.10.2026, Hochformat
   * (EXIF 6). Dargestellt als Karte im Akkordeon von `components/Stimmen.tsx`, die Textkachel im unteren Drittel.
   * AUSSCHNITT 3:4 (gleiche Anteile von Breite und Hoehe, weil das Original selbst 3:4 ist), gemessen am Raster der
   * Originale: Kopf bis Kinn zwischen rund 14 und 60 % der Hoehe. So bleibt das Gesicht in jedem Kartenfenster ueber
   * dem unteren Drittel (Geometrie im Kopf von `components/Stimmen.tsx`). 900 px breit: Die offene Karte ist hoechstens
   * 473 CSS-px breit, auf 2x-Bildschirmen also rund 950 Bildpunkte.
   * METADATEN OHNE NAMEN: Der Vorname steht auf der Seite (`data/stimmen.ts`), nicht in der Datei. Widerruft jemand,
   * verschwindet er mit dem Foto, statt in Bildsuchen weiter an der Datei zu haengen.
   * HERKUNFT: echte Fotos (User: „echte Mitarbeiter, die ihr Einverständnis … gegeben haben“; EXIF: Kamera, keine
   * Bearbeitungssoftware) → `digitalCapture` ist hier richtig.
   */
  {
    ziel: 'team/stimme-fahrzeuglackiererin-leipzig-carcare.webp',
    ordner: ORDNER_STIMMEN_OKT26,
    quelle: 'Josie-Lackiererin-Carcare-leipzig.jpeg',
    stellen: 'B142 (Karriere › Aus dem Team)',
    // Kopf 28–50 % des Originals, Gesichtsmitte bei 36 % der Breite → im Ausschnitt 22–50 % bzw. 45 %.
    ausschnitt: { x0: 0, y0: 0.10, x1: 0.80, y1: 0.90 },
    breite: 900,
    titel: 'Fahrzeuglackiererin im CarCare Center Leipzig',
    beschreibung: 'Porträt einer Fahrzeuglackiererin des CarCare Center in der Werkstatt. Sie hält einen feinen Pinsel und eine kleine Dose, links das Rad eines dunklen Geländewagens.',
    stichwoerter: ['Fahrzeuglackiererin', 'Mitarbeiterin', 'Team', 'Karriere', 'Lackiererei'],
  },
  {
    ziel: 'team/stimme-serviceberater-leipzig-carcare.webp',
    ordner: ORDNER_STIMMEN_OKT26,
    quelle: 'Marko-Serviceberater-Carcare-leipzig.jpeg',
    stellen: 'B143 (Karriere › Aus dem Team)',
    // Sitzt am Schreibtisch, Kopf 26–44 %, Gesichtsmitte bei 45 % der Breite → im Ausschnitt 25–48 % bzw. 50 %.
    ausschnitt: { x0: 0.05, y0: 0.06, x1: 0.85, y1: 0.86 },
    // Auf dem Schreibtisch ein handschriftlicher Zettel, am Klemmbrett rechts Auftragsblaetter: im Ergebnis kaum lesbar,
    // koennten aber Kundendaten tragen. Auf der Seite liegt beides unter der Textkachel, die Datei ist trotzdem oeffentlich.
    unkenntlich: [
      { was: 'handschriftlicher Zettel auf dem Schreibtisch', x0: 0.04, y0: 0.74, x1: 0.20, y1: 0.815 },
      { was: 'Auftragsblätter am Klemmbrett rechts', x0: 0.76, y0: 0.715, x1: 0.86, y1: 0.845 },
    ],
    breite: 900,
    titel: 'Serviceberater im CarCare Center Leipzig',
    beschreibung: 'Porträt eines Serviceberaters des CarCare Center am Schreibtisch im Büro.',
    stichwoerter: ['Serviceberater', 'Mitarbeiter', 'Team', 'Karriere', 'Kundenservice'],
  },
  {
    ziel: 'team/stimme-fahrzeuglackierer-leipzig-carcare.webp',
    ordner: ORDNER_STIMMEN_OKT26,
    quelle: 'Michal-Lackierer-Carcare-leipzig.jpeg',
    stellen: 'B144 (Karriere › Aus dem Team)',
    // Kopf 27–62 %, Gesichtsmitte bei 29 % der Breite → im Ausschnitt 14–56 % bzw. 34 %; rechts das abgeklebte Fahrzeug.
    ausschnitt: { x0: 0, y0: 0.15, x1: 0.85, y1: 1 },
    breite: 900,
    titel: 'Fahrzeuglackierer im CarCare Center Leipzig',
    beschreibung: 'Porträt eines Fahrzeuglackierers des CarCare Center neben einem für die Lackierung mit Folie abgedeckten Fahrzeug.',
    stichwoerter: ['Fahrzeuglackierer', 'Mitarbeiter', 'Team', 'Karriere', 'Lackiererei'],
  },
  {
    ziel: 'team/stimme-kfz-aufbereiter-leipzig-carcare.webp',
    ordner: ORDNER_STIMMEN_OKT26,
    quelle: 'Eshan-Aufbereiter-carcare-leipzig.jpeg',
    stellen: 'B145 (Karriere › Aus dem Team)',
    // Ganzes Bild: Kopf 17–54 %, Gesichtsmitte bei 50 % der Breite. Naeher heran ginge das Kinn ins untere Drittel.
    ausschnitt: { x0: 0, y0: 0, x1: 1, y1: 1 },
    breite: 900,
    titel: 'Kfz-Aufbereiter im CarCare Center Leipzig',
    beschreibung: 'Porträt eines Kfz-Aufbereiters des CarCare Center in der Halle, hinter ihm Fahrzeuge mit geöffneten Türen.',
    stichwoerter: ['Kfz-Aufbereiter', 'Fahrzeugaufbereitung', 'Mitarbeiter', 'Team', 'Karriere'],
  },
  {
    ziel: 'team/stimme-karosserie-fahrzeugbaumechaniker-leipzig-carcare.webp',
    ordner: ORDNER_STIMMEN_OKT26,
    quelle: 'Karol-Karosseriebauer-carcare-leipzig.jpeg',
    stellen: 'B146 (Karriere › Aus dem Team)',
    // Kopf 30 %, Bartende 68 % des Originals: Der lange Bart passt nicht ganz in 14–60 %. Ab 20 % liegt der Kopf bei
    // 12,5 %, das Bartende bei 60 %, Gesichtsmitte (45 % der Breite) bei 50 % des Ausschnitts.
    ausschnitt: { x0: 0.05, y0: 0.20, x1: 0.85, y1: 1 },
    breite: 900,
    titel: 'Karosserie- und Fahrzeugbaumechaniker im CarCare Center Leipzig',
    beschreibung: 'Porträt eines Karosserie- und Fahrzeugbaumechanikers des CarCare Center in der Werkstatthalle, neben ihm ein Fahrzeug mit geöffneter Motorhaube.',
    stichwoerter: ['Karosserie- und Fahrzeugbaumechaniker', 'Karosseriebau', 'Mitarbeiter', 'Team', 'Karriere'],
  },
  /*
   * KUNDENEMPFANG (User, 2026-10-14: „B24 überall anpassen“): ersetzt `privatkunden-leipzig-carcare.webp` an allen drei
   * Stellen (B24 Startseite Zielgruppenkarte, B32 Ablauf „Termin anfragen“, B75 Titelbild /privatkunden); die alte Datei
   * liegt in `docs/bilder/archiv/`. HERKUNFT laut User: echtes Foto aus unserem Betrieb, Motiv original, mit „Chat GPT
   * Image 2.5 Sunburst“ aufgewertet; die Zustimmungen aller abgebildeten Personen liegen vor.
   * GANZES BILD: `format` = Seitenverhaeltnis der Quelle, alle drei Einsatzorte sind breit und schneiden selbst zu.
   * 1344 px breit, mehr gibt die Quelle nicht her (`withoutEnlargement`).
   * NICHTS UNKENNTLICH ZU MACHEN (am vergroesserten Bild geprueft): Das Auto vorn links ist unscharf und zeigt kein
   * Kennzeichen; Namensschild und Tischaufsteller tragen nur unlesbare Scheinschrift aus der KI-Bearbeitung.
   */
  {
    ziel: 'kacheln/kundenempfang-schluesseluebergabe-leipzig-carcare.webp',
    ordner: ORDNER_EMPFANG_OKT26,
    quelle: 'kundenempfang-schluesseluebergabe-carcare-leipzig.png',
    stellen: 'B24, B32, B75',
    format: 1344 / 752,
    quelltyp: QUELLTYP_KI_BEARBEITET,
    ki: { system: 'ChatGPT Images (OpenAI)', version: '2.5 Sunburst' },
    titel: 'Kundenempfang im CarCare Center Leipzig',
    beschreibung: 'Ein Kunde übergibt am Empfangstresen mit dem Logo des CarCare Center seinen Fahrzeugschlüssel an unsere Mitarbeiterin, dahinter unser Büro. Echtes Foto, mit KI bearbeitet.',
    stichwoerter: ['Kundenempfang', 'Fahrzeugannahme', 'Schlüsselübergabe', 'Privatkunden', 'Autowerkstatt'],
  },
  {
    // Seitenhintergrund /privatkunden (B75), wie bei Unfall und Lackierung (HINTERGRUND-AUSSCHNITTE oben): Im ganzen Bild
    // lagen Mitarbeiterin, Schluessel und Logo unter dem Textschutz, im Bildfenster (72 % der Breite) stand nur der
    // Ruecken des Kunden, in Full HD vor allem Aktenregale (Aufnahmen 1440 × 900 und 1920 × 945, 2026-10-14). Ohne das
    // rechte Fuenftel (Bueroregale) rueckt die Uebergabe dorthin: Gesicht der Mitarbeiterin von 42 auf 53 %, Kunde von
    // 55–64 auf 69–80 % der Breite; bei 1440 steht er jetzt ganz im Profil, mit Schluessel in der ausgestreckten Hand.
    // VERGLICHEN: ohne das rechte Drittel (x1 0,7) war die Hand mittiger, aber 2× vergroessert und der Kopf abgeschnitten.
    ziel: 'kacheln/kundenempfang-schluesseluebergabe-hintergrund-leipzig-carcare.webp',
    ordner: ORDNER_EMPFANG_OKT26,
    quelle: 'kundenempfang-schluesseluebergabe-carcare-leipzig.png',
    stellen: 'B75 (Seitenhintergrund /privatkunden)',
    ausschnitt: { x0: 0, y0: 0, x1: 0.8 },
    quelltyp: QUELLTYP_KI_BEARBEITET,
    ki: { system: 'ChatGPT Images (OpenAI)', version: '2.5 Sunburst' },
    titel: 'Kundenempfang im CarCare Center Leipzig',
    beschreibung: 'Unsere Mitarbeiterin nimmt am Empfangstresen mit dem Logo des CarCare Center den Fahrzeugschlüssel eines Kunden entgegen. Echtes Foto, mit KI bearbeitet.',
    stichwoerter: ['Kundenempfang', 'Fahrzeugannahme', 'Schlüsselübergabe', 'Privatkunden', 'Autowerkstatt'],
  },
];

/**
 * VERGLEICHSBILDER (Backlog 6.2, User 2026-09-28: „ein sauberes Vorher/Nachher-Bild, was genau den Unterschied
 * einer solchen Dienstleistung zeigt“). EIN Bild aus zwei Aufnahmen: links vorher, rechts nachher, jede Haelfte
 * 4:5, dazwischen eine weisse Fuge. Beschriftet wird auf der Seite (HTML), nicht im Bild — scharf und vorlesbar.
 *
 * WARUM KEIN SCHIEBEREGLER: Der braucht deckungsgleiche Aufnahmen. Diese beiden sind aus verschiedenen Winkeln
 * fotografiert; uebereinandergelegt stuenden Kranz und Speiche an zwei Stellen.
 * WIE GERAHMT: gleicher Bildinhalt in beiden Haelften — der Uebergang vom Kranz zur Speiche mit Carbonblende und
 * Schalter —, und der Kranz etwa gleich dick (die Nachher-Aufnahme ist weiter weg, deshalb der engere Ausschnitt:
 * 0,65 statt 0,8 der Bildbreite). Drei Rahmungen verglichen (ganzes Bild, diese, noch enger); die engste zeigte den
 * Flor am deutlichsten, verlor aber die Speiche, an der man die Stelle wiedererkennt.
 * NUR ZUGESCHNITTEN: keine Retusche, keine Farbangleichung — sonst waere der Vergleich keiner. IPTC
 * „compositeCapture“ = Zusammenstellung echter Aufnahmen (Gegenstueck zu `digitalCapture` beim Einzelfoto).
 *
 * `x0`, `y0`, `b`: linke obere Ecke und Breite des Ausschnitts relativ zum aufgerichteten Bild; die Hoehe folgt aus 4:5.
 */
export const VERGLEICHE = [
  {
    ziel: 'kacheln/alcantara-lenkrad-vorher-nachher-leipzig-carcare.webp',
    stellen: 'Innenaufbereitung › Exklusivleistungen (6.2)',
    vorher: { quelle: 'Alcantara Lenkrad Vorher.jpeg', x0: 0.0, y0: 0.2, b: 0.8 },
    nachher: { quelle: 'Alacantara Lenkrad nachher.jpeg', x0: 0.15, y0: 0.18, b: 0.65 },
    titel: 'Alcantara-Lenkrad vor und nach der Aufbereitung – CarCare Center Leipzig',
    beschreibung: 'Dasselbe Alcantara-Lenkrad am Übergang zur Speiche: links vor der Aufbereitung mit verdichtetem, speckig glänzendem Flor im Griffbereich, rechts danach mit gleichmäßig aufgerichtetem Flor. Zwei Aufnahmen vom selben Tag, nur zugeschnitten.',
    stichwoerter: ['Alcantara', 'Lenkrad', 'Vorher Nachher', 'Innenaufbereitung', 'Fahrzeugaufbereitung'],
  },
];
