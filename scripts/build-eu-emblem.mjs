// Erzeugt das Emblem der Europäischen Union als SVG — geometrisch exakt nach der
// amtlichen Spezifikation.
//
// Warum generiert statt heruntergeladen:
// Das Emblem ist ein förderrechtlich verbindliches Zeichen. Bei Nichtbeachtung der
// Publizitätsvorgaben können Förderungen gekürzt werden. Eine irgendwo gefundene
// Bilddatei lässt sich nicht überprüfen — eine aus der amtlichen Beschreibung
// gerechnete Geometrie schon. Alle Werte unten stammen aus der offiziellen
// Beschreibung und sind hier nachvollziehbar hinterlegt.
//
// AMTLICHE BESCHREIBUNG (sinngemäß):
//   „Das Emblem hat die Form einer blauen rechteckigen Flagge, deren Breite das
//   Anderthalbfache der Höhe misst. Zwölf goldene Sterne bilden in gleichmäßigem
//   Abstand einen unsichtbaren Kreis, dessen Mittelpunkt der Schnittpunkt der
//   Diagonalen des Rechtecks ist. Der Radius dieses Kreises beträgt ein Drittel der
//   Höhe. Jeder Stern hat fünf Zacken, deren Spitzen einen unsichtbaren Kreis mit
//   einem Radius von einem Achtzehntel der Höhe berühren. Alle Sterne stehen
//   senkrecht, das heißt mit einer Zacke nach oben. Die Sterne sind wie die Stunden
//   auf dem Zifferblatt einer Uhr angeordnet. Ihre Zahl ist unveränderlich."
//
// FARBEN: Pantone Reflex Blue = #003399 · Pantone Yellow = #FFCC00
//
// WEISSER RAND: Auf farbigem oder dunklem Untergrund erhält das Rechteck einen
// weißen Rand von 1/25 der Höhe. Der Footer dieser Seite liegt auf einem dunklen
// Foto — der Rand ist hier also nicht optional, sondern vorgeschrieben.
//
// Aufruf: node scripts/build-eu-emblem.mjs

import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';
import { writeFileSync, statSync } from 'node:fs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = resolve(root, 'public/assets/eu-emblem.svg');

/** Höhe der Flagge im internen Koordinatensystem. Frei wählbar — SVG skaliert verlustfrei. */
const H = 600;
/** Breite = 1,5 × Höhe. */
const W = H * 1.5;
/** Weißer Rand auf farbigem Untergrund: 1/25 der Höhe. */
const BORDER = H / 25;
/** Radius des unsichtbaren Sternenkreises: 1/3 der Höhe. */
const RING_R = H / 3;
/** Radius des Umkreises eines einzelnen Sterns: 1/18 der Höhe. */
const STAR_R = H / 18;
/**
 * Innenradius des Fünfzackpolygons. cos(72°)/cos(36°) ist das Verhältnis, das einen
 * regelmäßigen Fünfzackstern (Pentagramm-Kontur) ergibt — jede andere Zahl liefert
 * entweder zu spitze oder zu stumpfe Zacken.
 */
const STAR_INNER_R = STAR_R * (Math.cos((72 * Math.PI) / 180) / Math.cos((36 * Math.PI) / 180));

const BLUE = '#003399';
const GOLD = '#FFCC00';

const totalW = W + 2 * BORDER;
const totalH = H + 2 * BORDER;
/** Mittelpunkt = Schnittpunkt der Diagonalen des blauen Rechtecks. */
const cx = BORDER + W / 2;
const cy = BORDER + H / 2;

const round = (n) => Number(n.toFixed(3));

/** Ein aufrecht stehender Fünfzackstern um (x, y). */
function star(x, y) {
  const pts = [];
  for (let k = 0; k < 10; k += 1) {
    // Start bei 90° = eine Zacke senkrecht nach oben; danach alle 36° abwechselnd
    // Außen- und Innenpunkt.
    const angle = ((90 + k * 36) * Math.PI) / 180;
    const r = k % 2 === 0 ? STAR_R : STAR_INNER_R;
    // SVG zählt y nach unten -> Sinus abziehen statt addieren.
    pts.push(`${round(x + r * Math.cos(angle))},${round(y - r * Math.sin(angle))}`);
  }
  return `    <polygon points="${pts.join(' ')}" />`;
}

const stars = [];
for (let hour = 0; hour < 12; hour += 1) {
  // Uhrzeigerstellung: 0 = 12 Uhr (oben), dann im Uhrzeigersinn je 30°.
  const angle = (hour * 30 * Math.PI) / 180;
  stars.push(star(cx + RING_R * Math.sin(angle), cy - RING_R * Math.cos(angle)));
}

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${totalW} ${totalH}" width="${totalW}" height="${totalH}" role="img" aria-labelledby="eu-emblem-title">
  <title id="eu-emblem-title">Flagge der Europäischen Union</title>
  <!-- Weisser Rand (1/25 der Hoehe) - vorgeschrieben auf farbigem/dunklem Untergrund. -->
  <rect width="${totalW}" height="${totalH}" fill="#FFFFFF" />
  <rect x="${BORDER}" y="${BORDER}" width="${W}" height="${H}" fill="${BLUE}" />
  <g fill="${GOLD}">
${stars.join('\n')}
  </g>
</svg>
`;

writeFileSync(OUT, svg, 'utf8');

console.log(`[eu-emblem] ${OUT.replace(root, '.')}  ${(statSync(OUT).size / 1024).toFixed(1)} KB`);
console.log(`[eu-emblem] Flagge ${W}x${H} (Verhaeltnis ${(W / H).toFixed(2)}:1), Rand ${BORDER} = H/25`);
console.log(`[eu-emblem] Sternenkreis r=${RING_R} = H/3 | Stern-Umkreis r=${round(STAR_R)} = H/18 | 12 Sterne`);
