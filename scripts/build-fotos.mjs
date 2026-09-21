#!/usr/bin/env node
/**
 * Rechnet eine Fotolieferung des Kunden in die Web-Fassung um: `npm run fotos`.
 *
 * AUFRUF:
 *   npm run fotos                          alle Fotos der Liste unten
 *   npm run fotos -- --nur ersatzwagen     nur Ziele, deren Name das Wort enthaelt
 *   npm run fotos -- --ordner "D:/…"       andere Quelle als der Lieferordner unten
 *
 * WARUM NEBEN `npm run images`: Das Ursprungskonzept bleibt — dieselben Werte wie dort (WebP,
 * Qualitaet 82, effort 6, hoechstens 2400 px breit, Zielname aus `name.webp.jpeg`). Diese
 * Lieferung braucht aber je Foto Entscheidungen, die ein Stapelumwandler nicht treffen kann:
 *  - HOCHFORMAT: Vier der elf Handyfotos liegen nur per EXIF-Vermerk aufrecht (orientation 6).
 *    Ohne Drehung kaemen sie quer heraus. Alle Einsatzorte sind Querformate (Karten 16:10,
 *    Akkordeon, Seitenhintergrund), deshalb bekommt jedes Hochformat einen 4:3-Ausschnitt um
 *    das Motiv — gewaehlt und hier festgehalten, nicht der Bildmitte ueberlassen.
 *  - KENNZEICHEN fremder Fahrzeuge werden unkenntlich gemacht. Gleiche Linie wie Backlog R16
 *    (Karriere-Video): Die Einwilligung der Mitarbeitenden deckt Personen, nicht die Halter der
 *    Kundenfahrzeuge. Eigene Fahrzeuge (Miet-Polos, Transporter) bleiben, wie sie sind.
 *    Das ist ein gewoehnlicher Weichzeichner, keine KI-Bearbeitung.
 *  - METADATEN: Titel, Beschreibung, Urheber, Rechtevermerk, Ort und Stichwoerter als XMP,
 *    dazu IPTC „Digital Source Type“ = digitalCapture. Das ist die maschinenlesbare Angabe
 *    „echtes Foto“ (Gegenstueck zu `trainedAlgorithmicMedia` fuer KI-Bilder, Art. 50 KI-VO).
 *    GPS-Position, Geraet und Seriennummern aus dem Handy-EXIF fallen weg.
 *
 * DIE QUELLE LIEGT NICHT IM REPOSITORY (wie beim Betriebsvideo, `scripts/build-video.mjs`).
 * Ausgeliefert wird nur, was hier daraus entsteht. `public/` wird 1:1 deployt — Originale
 * gehoeren nicht hinein.
 *
 * ⚠️ WAS DIESES SKRIPT BESTEHT, OHNE DASS DIE SACHE IN ORDNUNG IST (Pflichtfrage aus CLAUDE.md):
 *  1. Es rechnet, es beurteilt nicht. Ob ein Ausschnitt das Motiv trifft und ob ein
 *     Kennzeichen wirklich unlesbar ist, sieht nur ein Mensch — deshalb der Pruefbogen in
 *     `output/fotos-pruef/` (Ausschnitt eingezeichnet, jede weichgezeichnete Stelle vergroessert).
 *  2. Die Kennzeichen-Liste kennt nur, was bei der Sichtung gefunden wurde. Ein uebersehenes
 *     Kennzeichen geht durch — beim naechsten Foto also wieder ansehen, nicht nur rechnen.
 *  3. „digitalCapture“ steht hier, weil der User fuer diese Lieferung bestaetigt hat: echt,
 *     weder KI-generiert noch -bearbeitet (2026-09-21). Fuer ein Foto ohne diese Angabe gehoert
 *     der Wert NICHT hinein.
 */
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const wurzel = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const ZIEL = path.join(wurzel, 'public', 'assets');
const PRUEFUNG = path.join(wurzel, 'output', 'fotos-pruef');

const STANDARD_ORDNER =
  'C:/Users/Moham/Sameh & Hashoorzada GbR/Sameh & Hashoorzada GbR - General/Kunden/CarCare-Center/Fotos/Neue Fotos Schleife September';

/** Werte aus `scripts/convert-images.mjs` — das Ursprungskonzept. Nicht hier abweichend drehen. */
const QUALITAET = 82;
const AUFWAND = 6;
/**
 * Zielformat aller Fotos dieser Lieferung (quer) und ihre Breite.
 *
 * WARUM 4:3 UND NICHT 16:9 wie die echten Fotos vom Juli (2400 × 1357): Die meisten Einsatzorte
 * sind Karten — das aufgeklappte Akkordeon ist nahezu quadratisch, die Leistungskarten 16:10.
 * Aus 4:3 bleiben dort drei Viertel der Bildbreite stehen, aus 16:9 kaum mehr als die Haelfte.
 *
 * WARUM 2000 STATT DER HOECHSTBREITE 2400: dasselbe Pixelbudget wie die Juli-Fotos
 * (2000 × 1500 = 3,0 MP gegen 2400 × 1357 = 3,3 MP) und damit dieselbe Dateigroesse. Gemessen am
 * 2026-09-21: bei 2400 × 1800 lagen vier Fotos zwischen 495 und 555 KB, bei 2000 × 1500 zwischen
 * 211 und 339 KB. 2000 px decken den Seitenhintergrund auf Full-HD (1920) noch ohne Hochskalieren.
 */
const FORMAT = 4 / 3;
const MAX_BREITE = 2000;

const URHEBER = 'CarCare Center Leipzig (BS CarCare GmbH)';
const RECHTE = '© 2026 BS CarCare GmbH, Leipzig. Alle Rechte vorbehalten.';
const QUELLTYP_ECHT = 'http://cv.iptc.org/newscodes/digitalsourcetype/digitalCapture';
const LIEFERUNG = 'Lieferung „Neue Fotos Schleife September“, eingebaut am 2026-09-21';

/**
 * Die Fotos der Lieferung vom 2026-09-21.
 *
 * `oben` (nur Hochformat): Oberkante des 4:3-Ausschnitts, relativ zur Bildhoehe nach der Drehung.
 * `unkenntlich`: Rechtecke relativ zum GANZEN gedrehten Bild (x0, y0, x1, y1), vor dem Zuschnitt.
 * Beides wurde am Bild gemessen (vergroesserte Ausschnitte), nicht geschaetzt.
 * `beschreibung` beschreibt, was zu sehen ist — Markennamen bewusst nicht, wie in den
 * Alternativtexten der Seite („gelber Sportwagen“ statt Modellname).
 */
const FOTOS = [
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
    stellen: 'B38, B64, B69, B80, B86, B96 (B11 zeigt stattdessen das Video)',
    oben: 0.21,
    titel: 'Neu- und Reparaturlackierung im CarCare Center Leipzig',
    beschreibung: 'Lackierer trägt mit der Lackierpistole Lack auf einen abgeklebten Stoßfänger auf, das übrige Fahrzeug ist mit Folie und Papier abgedeckt.',
    stichwoerter: ['Autolackierung', 'Reparaturlackierung', 'Lackierpistole', 'Lackierkabine', 'Glasurit'],
  },
  {
    ziel: 'kacheln/dellenentfernung-leipzig-carcare.webp',
    quelle: 'dellenentfernung-leipzig-carcare.webp.jpeg',
    stellen: 'B13, B40, B60, B70, B79, B88',
    oben: 0.10,
    titel: 'Dellenentfernung ohne Lackieren im CarCare Center Leipzig',
    beschreibung: 'Dellentechniker richtet unter der Reflexionslampe mit einem Ausbeulwerkzeug eine Delle an der A-Säule eines dunkelgrauen Fahrzeugs aus, ohne den Lack zu beschädigen.',
    stichwoerter: ['Dellenentfernung', 'Ausbeulen ohne Lackieren', 'Smart Repair', 'Parkdelle', 'Reflexionslampe'],
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
];

const args = process.argv.slice(2);
const wert = (name) => (args.includes(name) ? args[args.indexOf(name) + 1] : null);
const ordner = wert('--ordner') ?? STANDARD_ORDNER;
const nur = wert('--nur');
const auswahl = FOTOS.filter((f) => !nur || f.ziel.includes(nur));

if (!fs.existsSync(ordner)) {
  console.error(`[fotos] Lieferordner nicht gefunden:\n        ${ordner}`);
  console.error('[fotos] Er liegt bewusst ausserhalb des Repositories. Pfad angeben mit:  npm run fotos -- --ordner "<Pfad>"');
  process.exit(1);
}
if (!auswahl.length) {
  console.error(`[fotos] Kein Ziel enthaelt "${nur}". Bekannt: ${FOTOS.map((f) => path.basename(f.ziel, '.webp')).join(', ')}`);
  process.exit(1);
}
const fehlend = auswahl.filter((f) => !fs.existsSync(path.join(ordner, f.quelle)));
if (fehlend.length) {
  console.error(`[fotos] Quelle fehlt im Lieferordner: ${fehlend.map((f) => f.quelle).join(', ')}`);
  process.exit(1);
}

const xml = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/** Aufnahmezeit aus dem Handy-EXIF: die frueheste Zeitangabe (DateTimeOriginal), ohne Zeitzone. */
const aufnahmezeit = (exif) => {
  if (!exif) return null;
  const zeiten = [...exif.toString('latin1').matchAll(/(\d{4}):(\d{2}):(\d{2}) (\d{2}):(\d{2}):(\d{2})/g)]
    .map((m) => `${m[1]}-${m[2]}-${m[3]}T${m[4]}:${m[5]}:${m[6]}`)
    .sort();
  return zeiten[0] ?? null;
};

const xmpPaket = (f, datum) => `<?xpacket begin="\uFEFF" id="W5M0MpCehiHzreSzNTczkc9d"?>
<x:xmpmeta xmlns:x="adobe:ns:meta/">
 <rdf:RDF xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#">
  <rdf:Description rdf:about=""
    xmlns:dc="http://purl.org/dc/elements/1.1/"
    xmlns:photoshop="http://ns.adobe.com/photoshop/1.0/"
    xmlns:xmpRights="http://ns.adobe.com/xap/1.0/rights/"
    xmlns:Iptc4xmpCore="http://iptc.org/std/Iptc4xmpCore/1.0/xmlns/"
    xmlns:Iptc4xmpExt="http://iptc.org/std/Iptc4xmpExt/2008-02-29/"
    photoshop:Headline="${xml(f.titel)}"
    photoshop:Credit="CarCare Center Leipzig"
    photoshop:City="Leipzig"
    photoshop:State="Sachsen"
    photoshop:Country="Deutschland"${datum ? `\n    photoshop:DateCreated="${datum}"` : ''}
    Iptc4xmpCore:CountryCode="DE"
    Iptc4xmpExt:DigitalSourceType="${QUELLTYP_ECHT}"
    xmpRights:Marked="True">
   <dc:title><rdf:Alt><rdf:li xml:lang="x-default">${xml(f.titel)}</rdf:li></rdf:Alt></dc:title>
   <dc:description><rdf:Alt><rdf:li xml:lang="x-default">${xml(f.beschreibung)}</rdf:li></rdf:Alt></dc:description>
   <dc:creator><rdf:Seq><rdf:li>${xml(URHEBER)}</rdf:li></rdf:Seq></dc:creator>
   <dc:rights><rdf:Alt><rdf:li xml:lang="x-default">${xml(RECHTE)}</rdf:li></rdf:Alt></dc:rights>
   <dc:subject><rdf:Bag>${[...f.stichwoerter, 'Leipzig', 'CarCare Center'].map((s) => `<rdf:li>${xml(s)}</rdf:li>`).join('')}</rdf:Bag></dc:subject>
  </rdf:Description>
 </rdf:RDF>
</x:xmpmeta>
<?xpacket end="w"?>`;

fs.mkdirSync(PRUEFUNG, { recursive: true });
const kb = (p) => `${Math.round(fs.statSync(p).size / 1024)} KB`;
const ergebnis = [];

for (const f of auswahl) {
  const quelle = path.join(ordner, f.quelle);
  const meta = await sharp(quelle).metadata();
  const datum = aufnahmezeit(meta.exif);

  // 1. Aufrichten (EXIF-Drehung) und als Rohdaten halten — sRGB, ohne Alphakanal.
  const { data, info } = await sharp(quelle).rotate().removeAlpha().toColourspace('srgb').raw()
    .toBuffer({ resolveWithObject: true });
  const W = info.width;
  const H = info.height;
  const roh = { raw: { width: W, height: H, channels: info.channels } };

  // 2. Kennzeichen unkenntlich: Stelle ausschneiden, stark weichzeichnen, zurueck einsetzen.
  //    Sigma nach der Hoehe der Stelle: Schrift dieser Groesse verschwindet vollstaendig.
  const flecken = [];
  for (const u of f.unkenntlich ?? []) {
    const left = Math.round(u.x0 * W);
    const top = Math.round(u.y0 * H);
    const width = Math.round((u.x1 - u.x0) * W);
    const height = Math.round((u.y1 - u.y0) * H);
    const sigma = Math.max(12, Math.round(height / 2));
    const fleck = await sharp(data, roh).extract({ left, top, width, height }).blur(sigma).raw().toBuffer();
    flecken.push({ input: fleck, raw: { width, height, channels: info.channels }, left, top, was: u.was });
  }
  // ⚠️ `composite` liefert Rohdaten MIT Alphakanal (4 statt 3 Kanaele). Wer sie danach mit der
  // alten Kanalzahl liest, bekommt ein zerschossenes Bild — so geschehen im ersten Lauf am
  // 2026-09-21, sichtbar nur im Pruefbogen. Deshalb Alpha weg und die Masse neu uebernehmen.
  let entschaerft = data;
  let rohFertig = roh;
  if (flecken.length) {
    const r = await sharp(data, roh)
      .composite(flecken.map(({ input, raw, left, top }) => ({ input, raw, left, top })))
      .removeAlpha().raw().toBuffer({ resolveWithObject: true });
    entschaerft = r.data;
    rohFertig = { raw: { width: r.info.width, height: r.info.height, channels: r.info.channels } };
  }

  // 3. Ausschnitt 4:3 quer. Querformate mit 4:3 bleiben vollstaendig.
  //    Ausnahme `ausschnitt` (Hintergrund-Fassungen): fester Rahmen, ohne `y1` im Format 16:10.
  let ausschnitt = { left: 0, top: 0, width: W, height: H };
  if (f.ausschnitt) {
    const a = f.ausschnitt;
    const width = Math.round((a.x1 - a.x0) * W);
    const height = Math.round(a.y1 !== undefined ? (a.y1 - a.y0) * H : width / 1.6);
    ausschnitt = { left: Math.round(a.x0 * W), top: Math.min(H - height, Math.round(a.y0 * H)), width, height };
  } else if (W / H < FORMAT - 0.01) {
    const hoehe = Math.round(W / FORMAT);
    const top = Math.min(H - hoehe, Math.max(0, Math.round((f.oben ?? 0.5 - hoehe / H / 2) * H)));
    ausschnitt = { left: 0, top, width: W, height: hoehe };
  } else if (W / H > FORMAT + 0.01) {
    const breite = Math.round(H * FORMAT);
    ausschnitt = { left: Math.round((W - breite) / 2), top: 0, width: breite, height: H };
  }

  // 4. Web-Fassung nach dem Ursprungskonzept, mit neuen Metadaten statt der Handy-Metadaten.
  const ziel = path.join(ZIEL, f.ziel);
  fs.mkdirSync(path.dirname(ziel), { recursive: true });
  await sharp(entschaerft, rohFertig)
    .extract(ausschnitt)
    .resize({ width: MAX_BREITE, withoutEnlargement: true })
    .webp({ quality: QUALITAET, effort: AUFWAND })
    .withExif({ IFD0: { Artist: 'BS CarCare GmbH', Copyright: '(c) 2026 BS CarCare GmbH, Leipzig' } })
    .withXmp(xmpPaket(f, datum))
    .toFile(ziel);
  const fertig = await sharp(ziel).metadata();

  // 5. Pruefbogen: ganzes Bild mit eingezeichnetem Ausschnitt (rot) und Weichzeichnung (gelb),
  //    daneben das Ergebnis; je weichgezeichnete Stelle eine Vergroesserung aus dem ERGEBNIS.
  const name = path.basename(f.ziel, '.webp');
  const vb = 520;
  const skala = vb / W;
  const rahmen = (r, farbe) => `<rect x="${r.left * skala}" y="${r.top * skala}" width="${r.width * skala}" height="${r.height * skala}" fill="none" stroke="${farbe}" stroke-width="3"/>`;
  const ueberlagerung = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${vb}" height="${Math.round(H * skala)}">${rahmen(ausschnitt, '#ef4444')}${flecken.map((fl) => rahmen({ left: fl.left, top: fl.top, width: fl.raw.width, height: fl.raw.height }, '#facc15')).join('')}</svg>`);
  const links = await sharp(entschaerft, rohFertig).resize({ width: vb }).composite([{ input: ueberlagerung, left: 0, top: 0 }]).jpeg().toBuffer();
  const rechts = await sharp(ziel).resize({ width: 640 }).jpeg().toBuffer();
  const hl = Math.round(H * skala);
  const hr = Math.round(640 / (fertig.width / fertig.height));
  await sharp({ create: { width: vb + 640 + 36, height: Math.max(hl, hr) + 24, channels: 3, background: '#111111' } })
    .composite([{ input: links, left: 12, top: 12 }, { input: rechts, left: vb + 24, top: 12 }])
    .jpeg({ quality: 80 })
    .toFile(path.join(PRUEFUNG, `${name}.jpg`));
  let n = 0;
  for (const fl of flecken) {
    // Lage der Stelle im Ergebnis: erst Ausschnitt, dann Skalierung auf die Zielbreite.
    const s = fertig.width / ausschnitt.width;
    const rand = 40;
    const left = Math.max(0, Math.round((fl.left - ausschnitt.left) * s) - rand);
    const top = Math.max(0, Math.round((fl.top - ausschnitt.top) * s) - rand);
    const width = Math.min(fertig.width - left, Math.round(fl.raw.width * s) + 2 * rand);
    const height = Math.min(fertig.height - top, Math.round(fl.raw.height * s) + 2 * rand);
    await sharp(ziel).extract({ left, top, width, height }).resize({ width: width * 4, kernel: 'nearest' }).jpeg({ quality: 90 })
      .toFile(path.join(PRUEFUNG, `${name}-unkenntlich-${++n}.jpg`));
  }

  ergebnis.push({ f, ziel, fertig, datum, flecken: flecken.map((fl) => fl.was), hochformat: !f.ausschnitt && ausschnitt.height < H });
}

console.log('[fotos] fertig:');
for (const e of ergebnis) {
  const rel = path.relative(wurzel, e.ziel).split(path.sep).join('/');
  const zusatz = [e.hochformat ? '4:3-Ausschnitt aus Hochformat' : '', e.f.ausschnitt ? 'Hintergrund-Ausschnitt' : '', e.flecken.length ? `unkenntlich: ${e.flecken.join('; ')}` : '']
    .filter(Boolean).join(' · ');
  console.log(`  ${rel.padEnd(62)} ${`${e.fertig.width}x${e.fertig.height}`.padEnd(10)} ${kb(e.ziel).padStart(7)}  ${e.datum ?? 'ohne Aufnahmezeit'}${zusatz ? `  · ${zusatz}` : ''}`);
}
console.log(`\n  Pruefbogen: output/fotos-pruef/*.jpg — Ausschnitt (rot) und Kennzeichen (gelb) ansehen, bevor eingebaut wird.`);
console.log(`  ${LIEFERUNG}. Herkunft und Kennzeichnung: docs/bilder/motive.json und data/bildherkunft.ts nachziehen.`);
