/**
 * Marken und Modelle fuer das Aufbereitungsformular (User, 2026-09-28): „Marke als Dropdown mit den
 * gaengigsten Marken in Europa, Modell ebenso — Marke und Modell voneinander getrennt“.
 *
 * AUSWAHL (OALAB, Stand 2026-09): die volumenstarken Marken im deutschen und europaeischen Markt, dazu
 * die Premium- und Sportmarken, die in unserer Aufbereitung regelmaessig stehen (Porsche, Bentley,
 * Ferrari, Lamborghini, Maserati). Je Marke die verbreiteten Modelle der letzten rund 15 Jahre, auch
 * Vorgaenger, die noch viel gefahren werden, und die gaengigen Transporter (Fuhrparks). Varianten
 * (GTI, AMG, RS, M, Kombi, Cabrio) stehen nicht einzeln da — sie gehoeren zum Grundmodell.
 *
 * KEINE SACKGASSE: Fehlt eine Marke oder ein Modell, gibt es „Andere Marke“ bzw. „Anderes Modell“ mit
 * einem Freitextfeld. Nachtragen ist eine Zeile hier; die Reihenfolge sortiert das Formular selbst
 * (Marken alphabetisch, Modelle natuerlich: 1er vor 2er vor 10er).
 *
 * Nur im Browser gebraucht — die Versandfunktion prueft die Werte nicht gegen diese Liste (Freitext ist
 * ohnehin moeglich), sie begrenzt nur die Laenge.
 */

export const ANDERE_MARKE = 'Andere Marke';
export const ANDERES_MODELL = 'Anderes Modell';

export const fahrzeugmarken: Record<string, string[]> = {
  'Alfa Romeo': ['Giulia', 'Giulietta', 'Junior', 'MiTo', 'Stelvio', 'Tonale'],
  Audi: ['A1', 'A2', 'A3', 'A4', 'A5', 'A6', 'A6 e-tron', 'A7', 'A8', 'e-tron GT', 'Q2', 'Q3', 'Q4 e-tron', 'Q5', 'Q6 e-tron', 'Q7', 'Q8', 'Q8 e-tron', 'R8', 'TT'],
  Bentley: ['Bentayga', 'Continental GT', 'Flying Spur'],
  BMW: ['1er', '2er', '2er Active Tourer', '2er Gran Coupé', '3er', '4er', '5er', '6er', '7er', '8er', 'i3', 'i4', 'i5', 'i7', 'iX', 'iX1', 'iX2', 'iX3', 'X1', 'X2', 'X3', 'X4', 'X5', 'X6', 'X7', 'XM', 'Z4'],
  BYD: ['Atto 2', 'Atto 3', 'Dolphin', 'Dolphin Surf', 'Han', 'Seal', 'Seal U', 'Sealion 7', 'Tang'],
  'Citroën': ['Ami', 'Berlingo', 'C1', 'C3', 'C3 Aircross', 'C4', 'C4 X', 'C5 Aircross', 'C5 X', 'Jumper', 'Jumpy', 'SpaceTourer'],
  Cupra: ['Ateca', 'Born', 'Formentor', 'Leon', 'Tavascan', 'Terramar'],
  Dacia: ['Bigster', 'Duster', 'Jogger', 'Logan', 'Sandero', 'Spring'],
  DS: ['DS 3', 'DS 4', 'DS 7', 'DS 9'],
  Ferrari: ['12Cilindri', '296 GTB', '296 GTS', '488', '812 Superfast', 'California', 'F8 Tributo', 'Portofino', 'Purosangue', 'Roma', 'SF90 Stradale'],
  Fiat: ['500', '500e', '500L', '500X', '600', 'Doblò', 'Ducato', 'Grande Panda', 'Panda', 'Scudo', 'Tipo'],
  Ford: ['C-Max', 'Capri', 'EcoSport', 'Explorer', 'Fiesta', 'Focus', 'Galaxy', 'Ka', 'Kuga', 'Mondeo', 'Mustang', 'Mustang Mach-E', 'Puma', 'Ranger', 'S-Max', 'Tourneo Connect', 'Tourneo Custom', 'Transit', 'Transit Custom'],
  Honda: ['Civic', 'CR-V', 'e:Ny1', 'HR-V', 'Jazz', 'ZR-V'],
  Hyundai: ['Bayon', 'i10', 'i20', 'i30', 'Inster', 'Ioniq', 'Ioniq 5', 'Ioniq 6', 'ix35', 'Kona', 'Santa Fe', 'Tucson'],
  Jaguar: ['E-Pace', 'F-Pace', 'F-Type', 'I-Pace', 'XE', 'XF'],
  Jeep: ['Avenger', 'Compass', 'Grand Cherokee', 'Renegade', 'Wrangler'],
  Kia: ['Ceed', 'EV3', 'EV6', 'EV9', 'Niro', 'Picanto', 'ProCeed', 'Rio', 'Sorento', 'Soul', 'Sportage', 'Stonic', 'XCeed'],
  Lamborghini: ['Aventador', 'Huracán', 'Revuelto', 'Temerario', 'Urus'],
  'Land Rover': ['Defender', 'Discovery', 'Discovery Sport', 'Range Rover', 'Range Rover Evoque', 'Range Rover Sport', 'Range Rover Velar'],
  Lexus: ['CT', 'ES', 'IS', 'LBX', 'NX', 'RX', 'RZ', 'UX'],
  Maserati: ['Ghibli', 'GranTurismo', 'Grecale', 'Levante', 'MC20', 'Quattroporte'],
  Mazda: ['CX-3', 'CX-30', 'CX-5', 'CX-60', 'CX-80', 'Mazda2', 'Mazda3', 'Mazda6', 'MX-30', 'MX-5'],
  'Mercedes-Benz': ['A-Klasse', 'AMG GT', 'B-Klasse', 'C-Klasse', 'Citan', 'CLA', 'CLE', 'CLS', 'E-Klasse', 'EQA', 'EQB', 'EQC', 'EQE', 'EQE SUV', 'EQS', 'EQS SUV', 'EQV', 'G-Klasse', 'GLA', 'GLB', 'GLC', 'GLE', 'GLS', 'S-Klasse', 'SL', 'Sprinter', 'T-Klasse', 'V-Klasse', 'Vito'],
  MG: ['Cyberster', 'HS', 'MG3', 'MG4', 'MG5', 'ZS'],
  MINI: ['Aceman', 'Cabrio', 'Clubman', 'Cooper', 'Countryman', 'Paceman'],
  Mitsubishi: ['ASX', 'Colt', 'Eclipse Cross', 'L200', 'Outlander', 'Space Star'],
  Nissan: ['Ariya', 'Juke', 'Leaf', 'Micra', 'Navara', 'Note', 'Qashqai', 'Townstar', 'X-Trail'],
  Opel: ['Adam', 'Astra', 'Combo', 'Corsa', 'Crossland', 'Frontera', 'Grandland', 'Insignia', 'Karl', 'Meriva', 'Mokka', 'Movano', 'Vivaro', 'Zafira'],
  Peugeot: ['108', '2008', '208', '3008', '308', '408', '5008', '508', 'Boxer', 'Expert', 'Partner', 'Rifter', 'Traveller'],
  Polestar: ['Polestar 2', 'Polestar 3', 'Polestar 4'],
  Porsche: ['718 Boxster', '718 Cayman', '911', 'Cayenne', 'Macan', 'Panamera', 'Taycan'],
  Renault: ['Arkana', 'Austral', 'Captur', 'Clio', 'Espace', 'Kadjar', 'Kangoo', 'Koleos', 'Master', 'Mégane', 'Rafale', 'Renault 4', 'Renault 5', 'Scénic', 'Symbioz', 'Trafic', 'Twingo', 'Zoe'],
  Seat: ['Alhambra', 'Arona', 'Ateca', 'Ibiza', 'Leon', 'Mii', 'Tarraco'],
  'Škoda': ['Citigo', 'Elroq', 'Enyaq', 'Fabia', 'Kamiq', 'Karoq', 'Kodiaq', 'Octavia', 'Rapid', 'Scala', 'Superb', 'Yeti'],
  smart: ['#1', '#3', '#5', 'forfour', 'fortwo'],
  Suzuki: ['Across', 'Baleno', 'e Vitara', 'Ignis', 'Jimny', 'S-Cross', 'Swace', 'Swift', 'Vitara'],
  Tesla: ['Model 3', 'Model S', 'Model X', 'Model Y'],
  Toyota: ['Aygo X', 'bZ4X', 'C-HR', 'Camry', 'Corolla', 'Corolla Cross', 'GR86', 'GR Yaris', 'Hilux', 'Land Cruiser', 'Prius', 'Proace', 'Proace City', 'RAV4', 'Supra', 'Yaris', 'Yaris Cross'],
  Volkswagen: ['Amarok', 'Arteon', 'Beetle', 'Caddy', 'California', 'Crafter', 'Golf', 'Golf Sportsvan', 'ID. Buzz', 'ID.3', 'ID.4', 'ID.5', 'ID.7', 'Multivan', 'Passat', 'Polo', 'Scirocco', 'Sharan', 'T-Cross', 'T-Roc', 'Taigo', 'Tiguan', 'Touareg', 'Touran', 'Transporter', 'up!'],
  Volvo: ['EC40', 'EX30', 'EX40', 'EX90', 'S60', 'S90', 'V40', 'V60', 'V90', 'XC40', 'XC60', 'XC90'],
};

const sortierung = new Intl.Collator('de', { numeric: true, sensitivity: 'base' });

/** Marken alphabetisch (Š wie S, Ë wie E). */
export const markenListe: string[] = Object.keys(fahrzeugmarken).sort(sortierung.compare);

/** Modelle einer Marke, natuerlich sortiert; leer fuer „Andere Marke“ oder unbekannt. */
export const modelleVon = (marke: string): string[] => [...(fahrzeugmarken[marke] ?? [])].sort(sortierung.compare);
