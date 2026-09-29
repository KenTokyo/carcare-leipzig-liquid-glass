import React from 'react';
import { Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text } from 'react-email';
import { BETREFF, FELDBESCHRIFTUNG, lesbarerWert } from '../data/anfrageSchema.js';
import type { RequestFormKind } from '../types.js';

export interface AnfrageEmailProps {
  art: RequestFormKind;
  daten: Record<string, string>;
  vorgang: string;
  /** Mitgesendete Dateien (Backlog 5.29, nur Bewerbung) — Name und Groesse fuer die Liste in der Mail. */
  anhaenge?: Array<{ name: string; bytes: number }>;
}

/** „220 KB" bzw. „1,4 MB" — lesbar fuer die Mail, nicht auf das Byte. */
const groesse = (bytes: number) =>
  bytes >= 1_000_000 ? `${(bytes / 1_000_000).toFixed(1).replace('.', ',')} MB` : `${Math.max(1, Math.round(bytes / 1000))} KB`;

const titel: Record<RequestFormKind, string> = {
  business: 'Neue Geschäfts\u00adkunden\u00adanfrage.',
  termin: 'Eine neue Terminanfrage.',
  schaden: 'Neue Schadenmeldung.',
  bewerbung: 'Eine neue Bewerbung.',
};

// Inspired by the restrained editorial layouts in react.email/templates.
// No remote fonts or images: the message stays complete when images are blocked.
export default function AnfrageEmail({ art, daten, vorgang, anhaenge = [] }: AnfrageEmailProps) {
  const name = daten.contact || daten.name || daten.company;
  const felder = Object.entries(FELDBESCHRIFTUNG).filter(([feld]) => daten[feld] && feld !== 'description');
  return (
    <Html lang="de">
      <Head><meta name="color-scheme" content="light" /></Head>
      <Preview>{`${BETREFF[art]} · ${name} · ${vorgang}`}</Preview>
      <Body style={{ backgroundColor: '#edf1f5', margin: 0, padding: '24px 12px', fontFamily: 'Arial, Helvetica, sans-serif', color: '#172337' }}>
        <Container style={{ maxWidth: '600px', width: '100%', backgroundColor: '#ffffff', borderRadius: '16px', overflow: 'hidden' }}>
          <Section style={{ backgroundColor: '#172337', padding: '32px 28px', borderTop: '5px solid #719ac2' }}>
            <Text style={{ color: '#ffffff', fontSize: '23px', fontWeight: 700, margin: 0 }}>CarCare Center</Text>
            <Text style={{ color: '#c8d8e8', fontSize: '11px', letterSpacing: '2px', margin: '8px 0 0' }}>LEIPZIG · FAHRZEUGPFLEGE & INSTANDSETZUNG</Text>
          </Section>
          <Section style={{ padding: '32px 28px 12px' }}>
            <Text style={{ color: '#456383', fontSize: '11px', letterSpacing: '1.5px', fontWeight: 700, margin: '0 0 12px' }}>{art === 'business' ? 'FÜR DIE GESCHÄFTSFÜHRUNG' : 'ANFRAGE ÜBER DIE WEBSITE'}</Text>
            <Heading as="h1" style={{ fontSize: '28px', lineHeight: '35px', letterSpacing: '-0.6px', margin: '0 0 16px', overflowWrap: 'anywhere' }}>{titel[art]}</Heading>
            <Text style={{ fontSize: '15px', lineHeight: '24px', color: '#526071', margin: '0 0 24px' }}>
              {name} hat uns über das Online-Formular kontaktiert. Die Angaben stehen unten; eine Antwort auf diese E-Mail geht direkt an die anfragende Person.
            </Text>
            <Section style={{ backgroundColor: '#edf3f8', borderRadius: '8px', padding: '16px 20px' }}>
              <Text style={{ fontSize: '10px', color: '#456383', letterSpacing: '1.4px', margin: '0 0 5px' }}>VORGANGSNUMMER</Text>
              <Text style={{ fontSize: '19px', fontFamily: 'Consolas, monospace', fontWeight: 700, margin: 0 }}>{vorgang}</Text>
            </Section>
          </Section>
          <Section style={{ padding: '8px 28px 24px' }}>
            <Heading as="h2" style={{ fontSize: '17px', margin: '16px 0' }}>Angaben zur Anfrage</Heading>
            {felder.map(([feld, label]) => (
              <Section key={feld} style={{ borderBottom: '1px solid #e5eaf0', padding: '11px 0' }}>
                <Text style={{ fontSize: '11px', color: '#526071', margin: '0 0 4px' }}>{label}</Text>
                <Text style={{ fontSize: '15px', lineHeight: '23px', margin: 0, whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{daten[feld].split(', ').map((wert) => lesbarerWert(feld, wert)).join(', ')}</Text>
              </Section>
            ))}
            {anhaenge.length > 0 && <>
              <Heading as="h2" style={{ fontSize: '17px', margin: '24px 0 12px' }}>Anhänge</Heading>
              {anhaenge.map((a) => (
                <Text key={a.name} style={{ fontSize: '15px', lineHeight: '23px', margin: '0 0 6px', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>📎 {a.name} · {groesse(a.bytes)}</Text>
              ))}
            </>}
            {daten.description && <>
              <Heading as="h2" style={{ fontSize: '17px', margin: '24px 0 12px' }}>Nachricht</Heading>
              <Text style={{ backgroundColor: '#f5f7fa', borderRadius: '8px', padding: '18px', fontSize: '15px', lineHeight: '25px', whiteSpace: 'pre-wrap', overflowWrap: 'anywhere', wordBreak: 'break-word' }}>{daten.description}</Text>
            </>}
            {/* Seit 2026-09-28 darf bei der Terminanfrage die E-Mail fehlen (Telefon ODER E-Mail). Dann ruft der
                Knopf zurueck, statt eine leere Adresse zu oeffnen. */}
            {daten.email ? <>
              <Button href={`mailto:${encodeURIComponent(daten.email)}?subject=${encodeURIComponent(`Re: [${vorgang}] ${BETREFF[art]}`)}`} style={{ backgroundColor: '#244d76', color: '#ffffff', borderRadius: '8px', padding: '15px 24px', fontSize: '14px', fontWeight: 700, marginTop: '12px' }}>Direkt antworten →</Button>
              <Text style={{ color: '#526071', fontSize: '12px', lineHeight: '20px' }}>Alternativ die Antwortfunktion Ihres E-Mail-Programms verwenden.</Text>
            </> : daten.phone ? <>
              <Button href={`tel:${daten.phone.replace(/[^\d+]/g, '')}`} style={{ backgroundColor: '#244d76', color: '#ffffff', borderRadius: '8px', padding: '15px 24px', fontSize: '14px', fontWeight: 700, marginTop: '12px' }}>{`Zurückrufen: ${daten.phone}`}</Button>
              <Text style={{ color: '#526071', fontSize: '12px', lineHeight: '20px' }}>Keine E-Mail-Adresse angegeben. Bitte telefonisch melden.</Text>
            </> : null}
            <Hr style={{ borderColor: '#e5eaf0', margin: '24px 0 16px' }} />
            <Text style={{ color: '#526071', fontSize: '12px', lineHeight: '20px', margin: 0 }}>
              {anhaenge.length > 0
                ? `Die ${anhaenge.length === 1 ? 'Datei hängt' : `${anhaenge.length} Dateien hängen`} an dieser E-Mail. Weitere Unterlagen kommen bei Bedarf separat mit der Vorgangsnummer.`
                : 'Bilder und Unterlagen werden bei Bedarf separat per E-Mail mit der Vorgangsnummer nachgereicht. Diese Nachricht enthält keine Anhänge.'}
            </Text>
          </Section>
          <Section style={{ backgroundColor: '#f5f7fa', padding: '20px 28px' }}>
            <Text style={{ fontSize: '11px', color: '#526071', lineHeight: '18px', margin: 0 }}>CarCare Center · Leipzig<br />Automatische Benachrichtigung aus unserem Anfrageformular.</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}
