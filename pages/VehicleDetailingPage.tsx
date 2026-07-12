import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { FeatureGrid, PageCTA, PageFAQ, PageHero, PageMeta, ProcessList, SectionIntro } from '../components/PageBlocks';

const services = [
  { title: 'Innenaufbereitung', description: 'Sorgfältige Reinigung und Pflege von Cockpit, Oberflächen, Polstern und Innenraumdetails.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Außenaufbereitung', description: 'Schonende Außenreinigung, Lackreinigung und gepflegtes Erscheinungsbild.', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
  { title: 'Lackreinigung', description: 'Entfernung von typischen Anhaftungen und Vorbereitung für Politur oder Versiegelung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Lackpolitur', description: 'Politur für mehr Glanz, glattere Oberflächen und optische Aufwertung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Versiegelung', description: 'Schutz und Werterhalt für Lackoberflächen nach der Aufbereitung.', href: '/autoaufbereitung-wissen/lackaufbereitung' },
  { title: 'Geruchsentfernung', description: 'Innenraumbehandlung gegen unangenehme Gerüche und belastete Luft im Fahrzeug.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Polster- und Lederpflege', description: 'Materialgerechte Pflege für Sitzflächen, Leder und textile Innenraumteile.', href: '/autoaufbereitung-wissen/innenaufbereitung' },
  { title: 'Leasingrückgabe-Vorbereitung', description: 'Prüfung und Aufbereitung vor der Fahrzeugrückgabe.', href: '/autoaufbereitung-wissen/leasingrueckgabe-vorbereiten' },
  { title: 'Verkaufsaufbereitung', description: 'Professionelle optische Aufwertung vor Verkauf, Übergabe oder Präsentation.', href: '/autoaufbereitung-wissen/was-ist-autoaufbereitung' },
];

const carePackages = [
  { id: 'p1', title: 'Brillant Außenpflege', price: '169,00 €', description: 'Intensive Vorreinigung, Felgenreinigung, Insektenentfernung, schonende Oberwäsche inkl. Abledern, Scheibenreinigung, Lackreinigung, Hochglanzpolitur und Lackversiegelung.' },
  { id: 'p2', title: 'Intensiv Innenreinigung', price: '199,00 €', description: 'Oberwäsche inkl. Abledern, intensive Reinigung des gesamten Innenraumes, Polstershampoonierung – alternativ Lederpflege – sowie Scheibenreinigung innen und außen.' },
  { id: 'p3', title: 'Premiumpflege', price: '299,00 €', description: 'Brillant- und Intensivpflege kombiniert, inklusive Motorreinigung und Versiegelung. Fahrzeuge mit extremen Verschmutzungen (z. B. Tierhaare) bedürfen einer gesonderten Absprache.' },
  { id: 'p4', title: 'Premiumpflege „exklusiv“', price: 'ab 348,00 €', description: 'Aufbereitung in liebevoller Handarbeit mit ausgesuchten Produktlinien – u. a. Wachse von SWIZÖL mit Carnaubaanteilen von 30 bis 60 %. Je höher der Anteil, desto höher der Glanzgrad Ihres Lackes.' },
];

const disinfectionServices = [
  { id: 'd1', title: 'Ozonbehandlung', price: '45,00 €', description: 'Ozon ist eines der stärksten Desinfektionsmittel und verteilt sich als Gas gleichmäßig bis in unzugängliche Bereiche. Es zerstört zuverlässig die Zellwände von Mikroorganismen. Ca. 30 Minuten Einwirkzeit, danach etwa 30 Minuten sorgfältiges Ablüften.' },
  { id: 'd2', title: 'Heißvernebelung (KC-Refresher)', price: '59,00 €', description: 'Der KC-Refresher bekämpft Bakterien, behüllte Viren und Schimmelpilze wirkungsvoll und lang anhaltend. Die Wirksamkeit gegenüber Bakterien und Schimmel wurde vom Institut für Biochemie der Universität Mannheim bestätigt.' },
];

const expertPoints = [
  { title: 'Premiumfahrzeuge', description: 'Sorgfältiger Umgang mit hochwertigen Fahrzeugen und sensiblen Oberflächen.' },
  { title: 'Autohäuser', description: 'Planbare Aufbereitung für Präsentation, Übergabe und Fahrzeugbestand.' },
  { title: 'Fuhrparks', description: 'Wiederkehrende Pflege- und Werterhaltungsprozesse für gewerbliche Fahrzeuge.' },
  { title: 'Hohe Qualitätsstandards', description: 'Strukturierte Arbeitsweise, saubere Übergabe und sichtbarer Anspruch an Details.' },
];

const steps = [
  { title: 'Anfrage stellen', description: 'Fahrzeug, gewünschte Leistung und Wunschtermin an CarCare übermitteln.' },
  { title: 'Bedarf einschätzen', description: 'Gemeinsam wird geklärt, welche Aufbereitung sinnvoll ist.' },
  { title: 'Fahrzeug abgeben', description: 'Übergabe vor Ort mit kurzer Abstimmung zum Zustand.' },
  { title: 'Professionell aufbereiten', description: 'Innen, außen, Lack und Details werden passend bearbeitet.' },
  { title: 'Gepflegt zurückerhalten', description: 'Das Fahrzeug wird sauber, hochwertig und nachvollziehbar übergeben.' },
];

const faqs = [
  { id: 'dauer', question: 'Wie lange dauert eine Fahrzeugaufbereitung?', answer: 'Das hängt von Leistung, Zustand und Umfang ab. CarCare stimmt den Ablauf nach der Anfrage persönlich ab.' },
  { id: 'leasing', question: 'Hilft CarCare bei der Leasingrückgabe?', answer: 'Ja. Die Aufbereitung kann helfen, den Fahrzeugzustand vor der Rückgabe professionell zu verbessern.' },
  { id: 'business', question: 'Ist Autoaufbereitung auch für Autohäuser und Fuhrparks möglich?', answer: 'Ja. CarCare arbeitet für Privatkunden, Autohäuser, Fuhrparks und Geschäftskunden mit hohen Qualitätsstandards.' },
];

const VehicleDetailingPage: React.FC = () => (
  <>
    <PageMeta canonical="/fahrzeugaufbereitung-leipzig" title="Fahrzeugaufbereitung Leipzig | Professionelle Autoaufbereitung" description="Professionelle Fahrzeugaufbereitung in Leipzig: Innenaufbereitung, Außenaufbereitung, Lackreinigung, Lackpolitur, Versiegelung, Geruchsentfernung, Polster- und Lederpflege sowie Leasingrückgabe-Vorbereitung." />
    <PageHero
      eyebrow="Fahrzeugaufbereitung Leipzig"
      title="Professionelle Fahrzeugaufbereitung in Leipzig"
      description="CarCare ist Experte für professionelle Autoaufbereitung: Innenraum, Außenpflege, Lackreinigung, Politur, Versiegelung, Geruchsentfernung und Vorbereitung auf Verkauf oder Leasingrückgabe."
      primaryCta={{ label: 'Aufbereitungstermin anfragen', href: '/kontakt#contact-termin' }}
      secondaryCta={{ label: 'Ratgeber lesen', href: '/autoaufbereitung-wissen' }}
      keywords={['Autoaufbereitung Leipzig', 'Lackpolitur Leipzig', 'Leasingrückgabe Leipzig']}
    />
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Aufbereitungsleistungen" title="Innen, außen, Lack und Details professionell gepflegt." />
        <FeatureGrid items={services} columns="three" />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Expertise" title="Für Premiumfahrzeuge, Autohäuser, Fuhrparks und hohe Qualitätsstandards." description="CarCare arbeitet neutral, professionell und mit dem Anspruch, Fahrzeugzustand und Wert sichtbar zu verbessern." />
        <FeatureGrid items={expertPoints} columns="four" />
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="Ablauf" title="So läuft Ihre Autoaufbereitung bei CarCare." />
        <ProcessList steps={steps} />
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Pflegepakete & Preise"
          title="Transparente Aufbereitungspakete für jedes Budget."
          description="Vier aufeinander aufbauende Pakete – von der Brillant-Außenpflege bis zur exklusiven Handarbeit mit SWIZÖL-Carnaubawachs."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {carePackages.map((pkg, idx) => (
            <motion.article
              key={pkg.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold leading-tight text-gray-950">{pkg.title}</h3>
                <span className="shrink-0 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold tracking-wide text-white">{pkg.price}</span>
              </div>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{pkg.description}</p>
              <a href="/kontakt#contact-termin" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Paket anfragen <ArrowRight size={14} />
              </a>
            </motion.article>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          Alle Preise inkl. gesetzlicher Mehrwertsteuer. Der genaue Umfang wird nach Fahrzeugzustand und Wunsch persönlich abgestimmt.
        </p>
      </div>
    </section>
    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Desinfektion & Hygiene"
          title="Innenraum-Desinfektion gegen Keime, Viren und Gerüche."
          description="Für ein hygienisch sauberes Fahrzeug: professionelle Verfahren, die Bakterien, Viren, Schimmelpilze und Gerüche auch in unzugänglichen Bereichen erreichen."
        />
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {disinfectionServices.map((svc, idx) => (
            <motion.article
              key={svc.id}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-40px' }}
              transition={{ duration: 0.4, delay: idx * 0.05 }}
              className="flex flex-col rounded-2xl border border-gray-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60"
            >
              <div className="flex items-start justify-between gap-4">
                <h3 className="text-lg font-bold leading-tight text-gray-950">{svc.title}</h3>
                <span className="shrink-0 rounded-full bg-gray-950 px-3 py-1.5 text-xs font-bold tracking-wide text-white">{svc.price}</span>
              </div>
              <p className="mt-3 flex-grow text-sm leading-relaxed text-gray-600">{svc.description}</p>
              <a href="/kontakt#contact-termin" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
                Termin anfragen <ArrowRight size={14} />
              </a>
            </motion.article>
          ))}
        </div>
        <p className="mt-6 text-xs leading-relaxed text-gray-500">
          Alle Preise inkl. gesetzlicher Mehrwertsteuer. Ideal ergänzend zur Innenaufbereitung – z. B. bei Gerüchen, nach Krankheit oder vor dem Fahrzeugverkauf.
        </p>
      </div>
    </section>
    <section className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro eyebrow="FAQ" title="Häufige Fragen zur Fahrzeugaufbereitung." />
        <PageFAQ faqs={faqs} />
      </div>
    </section>
    <PageCTA title="Ihr Fahrzeug soll sichtbar gepflegter wirken?" description="Fragen Sie Ihren Aufbereitungstermin in Leipzig an. CarCare empfiehlt die passende Leistung für Zustand und Ziel." primaryLabel="Termin anfragen" primaryHref="/kontakt#contact-termin" />
  </>
);

export default VehicleDetailingPage;
