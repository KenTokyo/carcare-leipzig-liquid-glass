import React from 'react';
import { PageCTA, PageHero, PageMeta } from '../components/PageBlocks';

const NotFoundPage: React.FC = () => (
  <>
    <PageMeta noindex title="Seite nicht gefunden | CarCare Center Leipzig" description="Diese Seite wurde nicht gefunden. Zurück zu CarCare Center Leipzig." />
    <PageHero
      eyebrow="404"
      title="Diese Seite wurde nicht gefunden."
      description="Die gewünschte Adresse existiert aktuell nicht. Über die Startseite oder Kontaktseite finden Sie schnell den passenden Einstieg."
      primaryCta={{ label: 'Zur Startseite', href: '/' }}
      secondaryCta={{ label: 'Kontakt aufnehmen', href: '/kontakt' }}
    />
    <PageCTA title="Brauchen Sie direkt Hilfe?" description="CarCare Leipzig hilft bei Schadenmeldung, Aufbereitungstermin oder Geschäftskundenanfrage." primaryLabel="Kontakt öffnen" primaryHref="/kontakt" />
  </>
);

export default NotFoundPage;
