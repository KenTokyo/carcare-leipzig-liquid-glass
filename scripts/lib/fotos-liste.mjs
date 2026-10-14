/**
 * Fotoliste fuer `npm run fotos` (`scripts/build-fotos.mjs`): je Foto Quelle, Ziel, Ausschnitt, Weichzeichnung und
 * Metadaten. Reine Daten, die Verarbeitung steht im Skript.
 *
 * WARUM EIGENE DATEI (2026-10-14): Mit dem Kundenempfang (B24) kam `build-fotos.mjs` ueber die 700-Zeilen-Regel aus
 * CLAUDE.md. Die Liste waechst mit jeder Lieferung, die Verarbeitung nicht.
 */

/*
 * Der zweite Lieferordner (gesichtete Fotos „CarCare Fotos Aug 26_0“) lieferte nur das Anhaengerfoto fuer B26. Es ist seit
 * 2026-10-14 abgeloest (Eintrag `autohaus-partner-fahrzeugtransport-…` unten, alte Datei in `docs/bilder/archiv/`).
 */
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
/** Transporterfoto vom 2026-10-14 (B26), Herkunft wie beim Empfangsfoto: verlustfreie PNG, hier sprechend benannt. */
const ORDNER_TRANSPORTER_OKT26 = 'C:/Users/Moham/Downloads/carcare-transporter-foto-2026-10-14';
/** Rückgabefoto vom 2026-10-14 (B35, Ablauf Schritt 05): verlustfreie PNG des Bildwerkzeugs, hier sprechend benannt. */
const ORDNER_RUECKGABE_OKT26 = 'C:/Users/Moham/Downloads/carcare-rueckgabe-foto-2026-10-14';
/**
 * Gesichtete Fotos „Fotos 3“ im OneDrive-Lieferordner: Original des Ferrari-Waschfotos (B46, Backlog 5.36), gefunden am
 * 2026-10-14 per Bildvergleich mit dem Chat-Anhang (Abweichung 1,1; iPhone-Aufnahme, ohne Bearbeitungssoftware).
 */
const ORDNER_GESICHTET_FOTOS3 =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/Gesichtet/Fotos 3';
/** Lieferung „CarCare Innenaufbereitung und Keramikversiegelung“ (iPhone, 08.10.2026), weitere Galeriefotos (B51 …). */
const ORDNER_KERAMIK_OKT26 =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/CarCare Innenaufbereitung und Keramikversiegelung';
/** Lieferung „CarCare Innenaufbereitung Exklusiv mit Leder“ (iPhone, 08.10.2026), Quelle der Galeriefotos B48–B58. */
const ORDNER_LEDER_OKT26 =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/CarCare Innenaufbereitung Exklusiv mit Leder';

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
  {
    // NUR Startseite › Ablauf der Aufbereitung › Schritt 02 „Termin anfragen“ (B32), User 2026-10-14: „weniger Kopf, mehr
    // Laptop“. In dieser Karte deckt der Textkasten unten links fast alles ab (frei: oberes Drittel und rechte 40 % auf
    // Desktop, mobil nur das obere Viertel). Deshalb steht der Bildschirm OBEN: Oberkante bei 39 % des Originals, rechts
    // ohne das letzte Viertel (Kopf), Format 1,76 wie die Desktop-Karte, damit dort nichts mehr senkrecht abgeschnitten
    // wird. Drei Ausschnitte mit eingezeichnetem Kasten verglichen; „links unten“ verschwand hinter dem Kasten.
    ziel: 'kacheln/terminanfrage-buero-laptop-leipzig-carcare.webp',
    ordner: ORDNER_BUERO_OKT26,
    quelle: 'serviceberatung-laptop-carcare-leipzig.jpeg',
    stellen: 'B32 (nur Ablauf Schritt 02)',
    ausschnitt: { x0: 0, y0: 0.39, x1: 0.76, y1: 0.714 },
    titel: 'Terminanfrage im Büro des CarCare Center Leipzig',
    beschreibung: 'Mitarbeiterin am Laptop in unserem Büro, auf dem Bildschirm unsere Website mit dem Slogan „We Care. We Repair.“',
    stichwoerter: ['Terminanfrage', 'Fahrzeugaufbereitung', 'Kundenservice', 'Büro', 'Leipzig'],
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
    stellen: 'B24, B33, B75 (bis 14.10. auch B32)',
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
  /*
   * FAHRZEUGTRANSPORT FUER AUTOHAUS-PARTNER (User, 2026-10-14: „B26 nur mit dem angehangenen Bild anpassen“): nur die
   * Startseitenkarte „Autohaeuser & Fuhrparks“; ersetzt das Anhaengerfoto vom 03.10. (archiviert). Gezeigt werden soll
   * laut User der Schlepper fuer Zusammenarbeit und Mobilitaetsgarantie gegenueber Autohaus-Partnern.
   * HERKUNFT laut User: KI-bearbeitet (echte Aufnahme, gering aufgewertet). Quelle wie bei B24 eine verlustfreie PNG des
   * Bildwerkzeugs (`Downloads/hf_20261013_234333_….png`, bildgleich mit dem Chat-Anhang). KEIN `ki`: Das System hat der
   * User fuer dieses Bild nicht genannt, `AISystemUsed` bleibt deshalb leer statt geraten.
   * „L CC 300“ ist unser Transporter und bleibt (wie beim Vorgaenger); die Sportwagen tragen kein Kennzeichen.
   * Fassadenschild: auf Wunsch des Users unbeachtet (Leistungsbegriffe dort sind nicht Gegenstand der Karte).
   */
  {
    ziel: 'kacheln/autohaus-partner-fahrzeugtransport-leipzig-carcare.webp',
    ordner: ORDNER_TRANSPORTER_OKT26,
    quelle: 'autotransporter-anhaenger-sportwagen-carcare-leipzig.png',
    stellen: 'B26 (nur Startseite)',
    format: 1344 / 752,
    quelltyp: QUELLTYP_KI_BEARBEITET,
    titel: 'Fahrzeugtransport für Autohaus-Partner, CarCare Center Leipzig',
    beschreibung: 'Unser Fahrzeugtransporter mit Anhänger bringt zwei weiße Sportwagen, im Hintergrund unser Betriebsgebäude in Leipzig. Echtes Foto, mit KI bearbeitet.',
    stichwoerter: ['Autohäuser', 'Fahrzeugtransport', 'Autotransporter', 'Mobilitätsgarantie', 'Geschäftskunden'],
  },
  /*
   * FAHRZEUGRUECKGABE (User, 2026-10-14): NUR Startseite › Ablauf der Aufbereitung › Schritt 05 „Gepflegt zurueckerhalten“
   * (B35). Ersetzt dort `leasingrueckgabe-…`, das an B17, B59 und B129 bleibt. HERKUNFT laut User: KI-bearbeitet, „die
   * Lichtverhaeltnisse […] ein bisschen bearbeitet“; dieselben Personen wie beim Kundenempfang (Zustimmungen liegen vor).
   * Quelle: `Downloads/hf_20261013_222814_….png`, bildgleich mit dem Chat-Anhang. KEIN `ki`: System nicht genannt.
   * Kein Kennzeichen sichtbar (Wagen von der Seite); „MIET-GOLF“ und die Beschriftung sind unser Mietwagen.
   */
  {
    ziel: 'kacheln/fahrzeugrueckgabe-kundenannahme-leipzig-carcare.webp',
    ordner: ORDNER_RUECKGABE_OKT26,
    quelle: 'fahrzeugrueckgabe-kundenannahme-carcare-leipzig.png',
    stellen: 'B35 (nur Ablauf Schritt 05)',
    format: 1344 / 752,
    quelltyp: QUELLTYP_KI_BEARBEITET,
    titel: 'Fahrzeugrückgabe an der Kundenannahme, CarCare Center Leipzig',
    beschreibung: 'Unsere Mitarbeiterin übergibt einem Kunden vor unserer Kundenannahme den Fahrzeugschlüssel, daneben ein weißer Wagen mit der Beschriftung des CarCare Center. Echtes Foto, Licht mit KI bearbeitet.',
    stichwoerter: ['Fahrzeugrückgabe', 'Schlüsselübergabe', 'Kundenannahme', 'Fahrzeugaufbereitung', 'Autowerkstatt'],
  },
  /*
   * AUSSENAUFBEREITUNG (User, 2026-10-14: „B46 eins zu eins ersetzen“, Backlog 5.36): NUR /fahrzeugaufbereitung-leipzig ›
   * Überblick › Karte „Außenaufbereitung“. Das Politurfoto `lackaufbereitung-…` bleibt an B28, B47, B66 und B128.
   * HERKUNFT: echt (User: „natürlich ein echtes Bild“; EXIF iPhone 17 Pro, 16.07.2026, keine Bearbeitungssoftware) →
   * `digitalCapture`. Original 5712 × 4284, schon 4:3: kein Ausschnitt. Kein Kennzeichen sichtbar (beide Wagen vorn ohne).
   */
  {
    ziel: 'kacheln/aussenaufbereitung-fahrzeugwaesche-leipzig-carcare.webp',
    ordner: ORDNER_GESICHTET_FOTOS3,
    quelle: 'image00051.jpeg',
    stellen: 'B46 (nur Fahrzeugaufbereitung › Überblick › Außenaufbereitung)',
    // Nur als Karte im Dreierraster (rund 400 px breit), kein Seitenhintergrund: 1200 px reichen auch für 3x-Bildschirme.
    breite: 1200,
    // Herangezoomt (User, 14.10.: „mehr Fokus auf das gelbe Auto und die Waschung“): rund 1,35-fach, direkt im Kartenformat
    // 16:10. Verglichen mit 1,28 (viel Boden) und 1,41 (kniender Kollege halb abgeschnitten). Ferrari und Mitarbeiter mit
    // Lanze und Sprühstrahl vollständig, Decke und Hallentor-Oberteil weg.
    ausschnitt: { x0: 0.17, y0: 0.315, x1: 0.91 },
    titel: 'Außenaufbereitung im CarCare Center Leipzig',
    beschreibung: 'Zwei Mitarbeiter bei der Außenwäsche eines gelben Sportwagens in unserer Waschhalle: einer reinigt mit dem Hochdruckreiniger, der andere kniend an der Front, dahinter ein zweites gelbes Fahrzeug im offenen Hallentor.',
    stichwoerter: ['Außenaufbereitung', 'Fahrzeugwäsche', 'Hochdruckreinigung', 'Handwäsche', 'Fahrzeugaufbereitung'],
  },
  /*
   * GALERIE „ERGEBNISSE, DIE MAN SIEHT“ (/fahrzeugaufbereitung-leipzig, B48–B58, User ab 2026-10-14): je Platzhalter ein
   * echtes Foto, Ziel `galerie/<motiv>-leipzig-carcare.webp`. Die Kacheln sind HOCHKANT (Desktop rund 3:4, mobil rund
   * 0,54:1, beides `object-cover` mittig): Ausschnitt 3:4, das Motiv mittig, damit es auch mobil stehen bleibt. 900 px breit
   * (Kachel hoechstens rund 300 CSS-px). Eingebaut per `src`/`alt` in `components/DetailingGallery.tsx`; die Nummer bleibt
   * ueber `data-bild-ort`. Herkunft laut User: alle echt.
   */
  {
    // B54 „Lederpflege“ (Backlog 5.40: Lederpflege beim Auftragen). Original 5712 × 4284, iPhone 17 Pro, 08.10.2026.
    // Ausschnitt: Gesicht des Mitarbeiters links noch im Bild (Desktop), Hand mit Tuch und Pflegemittel mittig (mobil).
    ziel: 'galerie/lederpflege-sportsitz-leipzig-carcare.webp',
    ordner: ORDNER_LEDER_OKT26,
    quelle: 'image00006.jpeg',
    stellen: 'B54 (Galerie „Einblicke“ › Lederpflege)',
    ausschnitt: { x0: 0.06, y0: 0, x1: 0.5775, y1: 0.92 },
    breite: 900,
    titel: 'Lederpflege im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter trägt mit Handschuh und Tuch Lederpflege auf die Lehne eines schwarzen Ledersportsitzes auf, in der anderen Hand das Pflegemittel.',
    stichwoerter: ['Lederpflege', 'Innenaufbereitung', 'Ledersitz', 'Fahrzeugaufbereitung', 'Exklusivleistung'],
  },
  {
    // B48 „Innenaufbereitung“ (Backlog 5.37). Original 5712 × 4284, iPhone 17 Pro, 08.10.2026, dieselbe Lieferung wie B54.
    // Ausschnitt: frisch gereinigte Fußmatte mittig, links die Sitzecke, oben das Armaturenbrett. Rechts endet er vor dem
    // Aufkleber mit der Fahrgestellnummer am Türrahmen (ab rund 97 % der Breite).
    ziel: 'galerie/innenaufbereitung-fussraum-leipzig-carcare.webp',
    ordner: ORDNER_LEDER_OKT26,
    quelle: 'image00002.jpeg',
    stellen: 'B48 (Galerie „Einblicke“ › Innenaufbereitung)',
    ausschnitt: { x0: 0.2, y0: 0, x1: 0.7625, y1: 1 },
    breite: 900,
    titel: 'Innenaufbereitung im CarCare Center Leipzig',
    beschreibung: 'Frisch gereinigter Fahrerfußraum eines Sportwagens nach der Innenaufbereitung: saubere Velours-Fußmatte, daneben der Ledersitz, oben das Armaturenbrett.',
    stichwoerter: ['Innenaufbereitung', 'Fußraum', 'Fußmatte', 'Innenraumreinigung', 'Fahrzeugaufbereitung'],
  },
  {
    // B51 „Cockpit-Detail“ (Backlog 5.38). Original 5712 × 4284, iPhone 17 Pro, 08.10.2026. Der Chat-Anhang lag nicht als
    // Datei vor; zugeordnet per Kontaktbogen der Lieferung (Pinsel am Waehlhebel, Lenkrad oben links: image00007, nicht
    // das 4 s fruehere image00008 mit dem Pinsel an den Tasten). Ausschnitt eng um Pinsel, Waehlhebel und Hand.
    ziel: 'galerie/cockpit-detailpinsel-leipzig-carcare.webp',
    ordner: ORDNER_KERAMIK_OKT26,
    quelle: 'image00007.jpeg',
    stellen: 'B51 (Galerie „Einblicke“ › Cockpit-Detail)',
    ausschnitt: { x0: 0.12, y0: 0.1, x1: 0.62625, y1: 1 },
    breite: 900,
    titel: 'Cockpit-Detailreinigung im CarCare Center Leipzig',
    beschreibung: 'Behandschuhte Hand reinigt mit einem weichen Detailpinsel die Mittelkonsole rund um den Wählhebel eines Sportwagens.',
    stichwoerter: ['Cockpitreinigung', 'Detailpinsel', 'Mittelkonsole', 'Innenaufbereitung', 'Fahrzeugaufbereitung'],
  },
  {
    // B56 „Keramikschutz“ (Backlog 5.39: Keramik beim Auftragen). Original 5712 × 4284, iPhone 17 Pro, 08.10.2026. Anhang
    // wieder nur im Chat: per Vergleich der fuenf Keramikfotos zugeordnet (image00003: gelbes Tuch oben links, Flasche
    // aufrecht auf dem Mikrofasertuch). Ausschnitt: Flasche, Tuch und Applikator in der Hand.
    ziel: 'galerie/keramikversiegelung-auftragen-leipzig-carcare.webp',
    ordner: ORDNER_KERAMIK_OKT26,
    quelle: 'image00003.jpeg',
    stellen: 'B56 (Galerie „Einblicke“ › Keramikschutz)',
    ausschnitt: { x0: 0.24, y0: 0, x1: 0.8025, y1: 1 },
    breite: 900,
    titel: 'Keramikversiegelung im CarCare Center Leipzig',
    beschreibung: 'Behandschuhte Hand trägt mit dem Applikator eine Keramikversiegelung auf den türkisfarbenen Lack auf, dahinter die Flasche auf einem Mikrofasertuch.',
    stichwoerter: ['Keramikversiegelung', 'Lackschutz', 'Applikator', 'Lackaufbereitung', 'Fahrzeugaufbereitung'],
  },
  {
    // B57 „Politur-Finish“ (nur Desktop-Raster, Backlog 5.37). Original im Standard-Lieferordner („Neue Fotos Schleife
    // September“), iPhone 17 Pro, 19.08.2026. Ausschnitt mit den meisten Spiegelungen auf Haube und Kotfluegel, rechts der
    // Scheinwerfer; das Fahrzeug im Hintergrund links (Heck) liegt ausserhalb.
    ziel: 'galerie/politur-finish-lackglanz-leipzig-carcare.webp',
    quelle: 'Nahaufnahme - Porscheaufbereitung - Front.jpeg',
    stellen: 'B57 (Galerie „Einblicke“ › Politur-Finish)',
    ausschnitt: { x0: 0.3, y0: 0, x1: 0.8625, y1: 1 },
    breite: 900,
    titel: 'Politur-Finish im CarCare Center Leipzig',
    beschreibung: 'Frisch polierte Fronthaube und Kotflügel eines kupferfarbenen Sportwagens, die Hallenbeleuchtung spiegelt sich klar im Lack, rechts der Scheinwerfer.',
    stichwoerter: ['Politur', 'Lackaufbereitung', 'Hochglanz', 'Lackpflege', 'Fahrzeugaufbereitung'],
  },
  /*
   * B55, B49, B53, B50 (User, 2026-10-14, als Zwischennachrichten, Anhaenge nur im Chat): per Kontaktbogen den Fotos im
   * Standard-Lieferordner („Neue Fotos Schleife September“) zugeordnet, alle iPhone 17 Pro, ohne Bearbeitungssoftware.
   */
  {
    // B55 „Motorraumpflege“ (5.37), 19.08.2026. Mitarbeiter wischt die Motorabdeckung mit dem Mikrofasertuch.
    ziel: 'galerie/motorraumpflege-leipzig-carcare.webp',
    quelle: 'Motorreinigung - Porsche.jpeg',
    stellen: 'B55 (Galerie „Einblicke“ › Motorraumpflege)',
    ausschnitt: { x0: 0.13, y0: 0, x1: 0.6925, y1: 1 },
    breite: 900,
    titel: 'Motorraumpflege im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter reinigt im geöffneten Motorraum eines kupferfarbenen Sportwagens die Abdeckungen mit einem gelben Mikrofasertuch.',
    stichwoerter: ['Motorraumpflege', 'Motorraumreinigung', 'Mikrofasertuch', 'Fahrzeugaufbereitung', 'Detailing'],
  },
  {
    // B49 „Außenreinigung“ (5.37), 20.08.2026. Frisch gereinigter Sportwagen in der Halle, Heck im Dreiviertelprofil.
    // KENNZEICHEN des schwarzen SUV im Hintergrund rechts oben (fremdes Fahrzeug) weichgezeichnet, gemessen am
    // vergroesserten Raster (Schild x 0,750–0,797, y 0,221–0,238, hier mit Rand).
    ziel: 'galerie/aussenreinigung-sportwagen-leipzig-carcare.webp',
    quelle: 'Weissach Porsche Total Image.jpeg',
    stellen: 'B49 (Galerie „Einblicke“ › Außenreinigung)',
    ausschnitt: { x0: 0.26, y0: 0, x1: 0.8225, y1: 1 },
    unkenntlich: [{ was: 'Kennzeichen des schwarzen SUV im Hintergrund', x0: 0.746, y0: 0.217, x1: 0.801, y1: 0.242 }],
    breite: 900,
    titel: 'Außenreinigung im CarCare Center Leipzig',
    beschreibung: 'Frisch gereinigter hellblauer Sportwagen mit Heckflügel in unserer Halle, Heck und Hinterrad im Dreiviertelprofil, die Fahrertür steht offen.',
    stichwoerter: ['Außenreinigung', 'Fahrzeugwäsche', 'Außenaufbereitung', 'Fahrzeugaufbereitung', 'Sportwagen'],
  },
  {
    // B53 „Felgenreinigung“ (5.37), 16.07.2026. Felgenbürste in den Speichen eines eingeschäumten Rades.
    ziel: 'galerie/felgenreinigung-buerste-leipzig-carcare.webp',
    quelle: 'Felgenreinigung.jpeg',
    stellen: 'B53 (Galerie „Einblicke“ › Felgenreinigung)',
    ausschnitt: { x0: 0.17, y0: 0, x1: 0.7325, y1: 1 },
    breite: 900,
    titel: 'Felgenreinigung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter reinigt mit einer Felgenbürste die eingeschäumten Speichen am Vorderrad eines gelben Sportwagens.',
    stichwoerter: ['Felgenreinigung', 'Felgenbürste', 'Radreinigung', 'Außenaufbereitung', 'Fahrzeugaufbereitung'],
  },
  {
    // B50 „Lackpolitur“ (5.37), 20.08.2026. Rotationspoliermaschine mit Lammfellpad auf dunklem Lack, Polierspuren sichtbar.
    ziel: 'galerie/lackpolitur-poliermaschine-leipzig-carcare.webp',
    quelle: 'dynamischen Polieren- nahaufnahme.jpeg',
    stellen: 'B50 (Galerie „Einblicke“ › Lackpolitur)',
    ausschnitt: { x0: 0.3, y0: 0, x1: 0.8625, y1: 1 },
    breite: 900,
    titel: 'Lackpolitur im CarCare Center Leipzig',
    beschreibung: 'Rotationspoliermaschine mit Lammfellpad in Bewegung auf einem dunklen Lack, daneben die Polierspuren im Licht.',
    stichwoerter: ['Lackpolitur', 'Poliermaschine', 'Lackaufbereitung', 'Hochglanz', 'Fahrzeugaufbereitung'],
  },
  {
    // B58 „Endkontrolle“ (nur Desktop-Raster, Backlog 5.42), 20.08.2026. DASSELBE Foto wie die Karriere-Karte
    // „Kfz-Aufbereiter“ (`karriere-aufbereiter-…`, B103/B108), hier als eigener Hochformat-Ausschnitt: rechte Bildhaelfte,
    // der Mitarbeiter prueft den Lack aus naechster Naehe (Gesicht, Spiegelbild in der Tuer). Tuch links und Gesicht rechts
    // passen nicht beide in 3:4; verglichen mit dem Ausschnitt um das Tuch.
    ziel: 'galerie/endkontrolle-lackpruefung-leipzig-carcare.webp',
    quelle: 'karriere-aufbereiter-leipzig-carcare.webp.jpeg',
    stellen: 'B58 (Galerie „Einblicke“ › Endkontrolle)',
    ausschnitt: { x0: 0.4375, y0: 0, x1: 1, y1: 1 },
    breite: 900,
    titel: 'Endkontrolle im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter prüft nach der Aufbereitung den Lack einer dunkelgrauen Fahrzeugtür aus nächster Nähe, sein Spiegelbild zeigt sich im Lack.',
    stichwoerter: ['Endkontrolle', 'Qualitätskontrolle', 'Lackprüfung', 'Fahrzeugaufbereitung', 'Detailing'],
  },
  {
    // B52 „Versiegelung“ (User 2026-10-14; damit bleiben „Versiegelung“ und „Keramikschutz“ zwei Kacheln, 5.41 nicht
    // umgesetzt). Cabriodach wird mit Spray versiegelt, das Fahrzeug darunter abgedeckt. Ausschnitt um Hand, Dose und
    // Spruehnebel auf dem Verdeck.
    ziel: 'galerie/versiegelung-cabriodach-leipzig-carcare.webp',
    quelle: 'Cabriodachversiegelung.jpeg',
    stellen: 'B52 (Galerie „Einblicke“ › Versiegelung)',
    ausschnitt: { x0: 0.13, y0: 0, x1: 0.6925, y1: 1 },
    breite: 900,
    titel: 'Cabriodach-Versiegelung im CarCare Center Leipzig',
    beschreibung: 'Mitarbeiter sprüht eine Versiegelung auf das schwarze Stoffverdeck eines Cabrios, die Karosserie darunter ist mit Folie abgedeckt.',
    stichwoerter: ['Versiegelung', 'Cabriodach', 'Verdeckimprägnierung', 'Fahrzeugaufbereitung', 'Exklusivleistung'],
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
