import { Body, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'react-email';
import {
  GUTSCHEIN_BETREFF, GUTSCHEIN_HINWEIS_ABLAUF, GUTSCHEIN_HINWEIS_VERSAND, adresseZeilen, auswahlText,
  type GutscheinDaten,
} from '../data/gutschein.js';

export interface GutscheinEmailProps {
  daten: GutscheinDaten;
  vorgang: string;
  /** `betrieb`: Eingang fuer das CarCare Center. `kunde`: Bestaetigung an die anfragende Person. */
  fuer: 'betrieb' | 'kunde';
}

const klein = { fontSize: '11px', color: '#526071', margin: '0 0 4px' } as const;
const wert = { fontSize: '15px', lineHeight: '23px', margin: 0, overflowWrap: 'anywhere', wordBreak: 'break-word' } as const;

/** Gleicher Aufbau wie `AnfrageEmail.tsx`: keine Webfonts, keine Bilder, vollstaendig auch ohne Nachladen. */
export default function GutscheinEmail({ daten, vorgang, fuer }: GutscheinEmailProps) {
  const r = daten.rechnung;
  const zeilen: Array<[string, string]> = [
    ['Gutschein', auswahlText(daten)],
    ['Rechnungsadresse', adresseZeilen(r).join('\n')],
    ['E-Mail', r.email],
    ['Telefon', r.telefon],
    ['Versandadresse', daten.versandGleich ? 'Wie Rechnungsadresse' : adresseZeilen(daten.versand).join('\n')],
    ['Versand', GUTSCHEIN_HINWEIS_VERSAND],
  ];
  const kunde = fuer === 'kunde';
  return (
    <Html lang="de">
      <Head><meta name="color-scheme" content="light" /></Head>
      <Preview>{kunde ? `Ihre Gutscheinanfrage · ${vorgang}` : `${GUTSCHEIN_BETREFF} · ${r.name} · ${vorgang}`}</Preview>
      <Body style={{ backgroundColor: '#edf1f5', margin: 0, padding: '24px 12px', fontFamily: 'Arial, Helvetica, sans-serif', color: '#172337' }}>
        <Container style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>
          <Section style={{ backgroundColor: '#172337', padding: '32px 28px', borderTop: '5px solid #719ac2' }}>
            <Text style={{ color: '#ffffff', fontSize: '23px', fontWeight: 700, margin: 0 }}>CarCare Center</Text>
            <Text style={{ color: '#c8d8e8', fontSize: '11px', letterSpacing: '2px', margin: '8px 0 0' }}>LEIPZIG · FAHRZEUGPFLEGE & INSTANDSETZUNG</Text>
          </Section>
          <Section style={{ padding: '32px 28px 12px' }}>
            <Text style={{ color: '#456383', fontSize: '11px', letterSpacing: '1.5px', fontWeight: 700, margin: '0 0 12px' }}>
              {kunde ? 'IHRE GUTSCHEINANFRAGE' : 'GUTSCHEINANFRAGE ÜBER DIE WEBSITE'}
            </Text>
            <Heading as="h1" style={{ fontSize: '28px', lineHeight: '35px', letterSpacing: '-0.6px', margin: '0 0 16px' }}>
              {kunde ? 'Vielen Dank für Ihre Anfrage.' : 'Eine neue Gutscheinanfrage.'}
            </Heading>
            <Text style={{ fontSize: '15px', lineHeight: '24px', color: '#526071', margin: '0 0 24px' }}>
              {kunde
                ? `Guten Tag ${r.name}, Ihre Gutscheinanfrage ist bei uns angekommen. ${GUTSCHEIN_HINWEIS_ABLAUF} Der Versand ist kostenfrei.`
                : `${r.name} möchte einen Gutschein. Bitte Rechnung an die Rechnungsadresse senden, Zahlungseingang prüfen und danach den Gutschein versandkostenfrei an die Versandadresse schicken. Eine Antwort auf diese E-Mail geht direkt an die anfragende Person.`}
            </Text>
            <Section style={{ backgroundColor: '#edf3f8', borderRadius: '8px', padding: '16px 20px' }}>
              <Text style={{ fontSize: '10px', color: '#456383', letterSpacing: '1.4px', margin: '0 0 5px' }}>VORGANGSNUMMER</Text>
              <Text style={{ fontSize: '19px', fontFamily: 'Consolas, monospace', fontWeight: 700, margin: 0 }}>{vorgang}</Text>
            </Section>
          </Section>
          <Section style={{ padding: '8px 28px 24px' }}>
            <Heading as="h2" style={{ fontSize: '17px', margin: '16px 0' }}>{kunde ? 'Ihre Angaben' : 'Angaben zur Anfrage'}</Heading>
            {zeilen.map(([label, inhalt]) => (
              <Section key={label} style={{ borderBottom: '1px solid #e5eaf0', padding: '11px 0' }}>
                <Text style={klein}>{label}</Text>
                <Text style={{ ...wert, whiteSpace: 'pre-wrap' }}>{inhalt}</Text>
              </Section>
            ))}
            <Hr style={{ borderColor: '#e5eaf0', margin: '24px 0 16px' }} />
            <Text style={{ color: '#526071', fontSize: '12px', lineHeight: '20px', margin: 0 }}>
              {kunde
                ? 'Fragen zu Ihrer Anfrage? Antworten Sie einfach auf diese E-Mail oder rufen Sie uns an: 0341 - 261 77 90.'
                : 'Rechnung und Zahlung laufen nicht über die Website. Diese Nachricht enthält keine Anhänge.'}
            </Text>
          </Section>
          <Section style={{ backgroundColor: '#f5f7fa', padding: '20px 28px' }}>
            <Text style={{ fontSize: '11px', color: '#526071', lineHeight: '18px', margin: 0 }}>
              CarCare Center · An den Tierkliniken 42 · 04103 Leipzig<br />
              {kunde ? 'Automatische Bestätigung Ihrer Anfrage über carcare-center.de.' : 'Automatische Benachrichtigung aus dem Gutscheinformular.'}
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
