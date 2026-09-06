import React from 'react';
import HeroSection from '../components/HeroSection';
import ServiceGrid from '../components/ServiceGrid';
import AccidentDamageSection from '../components/AccidentDamageSection';
import TargetGroupCards from '../components/TargetGroupCards';
import AutoDetailingExpertiseSection from '../components/AutoDetailingExpertiseSection';
import DetailingProcessSection from '../components/DetailingProcessSection';
import FAQSection from '../components/FAQSection';
import KontaktDaten from '../components/KontaktDaten';
import { PageMeta } from '../components/PageBlocks';

// Schlanke, conversion-fokussierte Startseite (8 Sektionen statt 13).
// 2026-07-22: Sektion „Prozess" (ProcessTimeline) entfernt — der Unfallablauf stand dreifach
// (hier, in AccidentDamageSection und auf /unfallinstandsetzung-leipzig). Der Aufbereitungs-
// ablauf ist in AutoDetailingExpertiseSection gewandert, der Unfallablauf ist als 5. Karte
// in AccidentDamageSection aufgegangen. Siehe docs/prozess-konsolidierung/.
// 2026-07-22 (später): Sub-Hero-Sektion „TrustBar" aufgeloest — ihre vier Vertrauensfakten
// sitzen jetzt als Leiste an der Unterkante des Heros. Nach dem Hero startet die Seite direkt
// mit der Leistungsuebersicht. Siehe docs/hero-minimalisierung/.
// Ausgelagert: Geschäftskunden -> /geschaeftskunden, Karriere -> /karriere.
// Zusammengeführt: Kontaktabschluss (ContactCTA) in ContactSection.
// Ersetzt (offen): generische „Vertrauen"-Sektion -> echte Google-Bewertungen (echte Daten nötig).
const HomePage: React.FC = () => (
  <>
    <PageMeta
      canonical="/"
      title="Karosserie, Lack & Aufbereitung Leipzig | CarCare Center"
      description="Unfallinstandsetzung, Karosserie, Lackierung, Smart Repair und Fahrzeugaufbereitung in Leipzig. Meisterbetrieb seit 1998, alles auf über 3.000 m²."
    />
    <HeroSection />
    <ServiceGrid />
    <AccidentDamageSection />
    <TargetGroupCards />
    <AutoDetailingExpertiseSection />
    <DetailingProcessSection />
    <FAQSection />
    {/* Backlog 2.6: Das Kontaktformular stand hier als letzte Sektion. Es ist
        entfernt, weil jede Anfrage seit 1.20 ueber den Anfrage-Dialog laeuft — ein
        zweites Formular auf derselben Seite waere ein zweiter Weg zum selben Ziel.
        Die Kontaktdaten bleiben; sie waren nie Teil des Formulars, sondern lagen nur
        im selben Block. Das vollstaendige Formular steht weiterhin auf /kontakt. */}
    <KontaktDaten />
  </>
);

export default HomePage;
