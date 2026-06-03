import React from 'react';
import ContactCTA from '../components/ContactCTA';
import ArticleCard from '../components/KnowledgeArticleCard';
import KnowledgeCategoryGrid from '../components/KnowledgeCategoryGrid';
import { PageHero, PageMeta, SectionIntro } from '../components/PageBlocks';
import { knowledgeArticles, knowledgeCategories } from '../data/knowledgeArticles';

const KnowledgeHubPage: React.FC = () => (
  <>
    <PageMeta
      canonical="/autoaufbereitung-wissen"
      title="Autoaufbereitung Wissen | Ratgeber zu Fahrzeugpflege & Werterhalt"
      description="Autoaufbereitung Wissen von CarCare: verständliche Ratgeber zu Fahrzeugpflege, Innenaufbereitung, Lackaufbereitung, Leasingrückgabe und Smart Repair."
    />
    <PageHero
      eyebrow="Autoaufbereitung Wissen"
      title="Autoaufbereitung, Fahrzeugpflege und Werterhalt verständlich erklärt."
      description="Der Wissensbereich von CarCare erklärt fachlich und praxisnah, wann professionelle Fahrzeugaufbereitung sinnvoll ist, wie typische Arbeiten ablaufen und wo Smart Repair oder Leasingrückgabe-Vorbereitung helfen können."
      primaryCta={{ label: 'Artikel ansehen', href: '#artikel' }}
      secondaryCta={{ label: 'Fahrzeugaufbereitung Leipzig', href: '/fahrzeugaufbereitung-leipzig' }}
      keywords={['Autoaufbereitung', 'Fahrzeugpflege', 'Werterhalt', 'Leasingrückgabe', 'Smart Repair']}
    />

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Themenbereiche"
          title="Wissen nach Pflege, Werterhalt und kleinen Schäden sortiert."
          description="Starten Sie mit Grundlagen oder springen Sie direkt zu Innenraum, Lack, Leasingrückgabe und Dellenentfernung."
        />
        <KnowledgeCategoryGrid articles={knowledgeArticles} categories={knowledgeCategories} />
      </div>
    </section>

    <section id="artikel" aria-labelledby="knowledge-articles-heading" className="bg-gray-50/70 px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <SectionIntro
          eyebrow="Erste Ratgeber"
          title="Fünf Artikel für bessere Entscheidungen rund ums Fahrzeug."
          description="Die Texte sind bewusst fachlich gehalten: klare Antworten, realistische Grenzen und konkrete Hinweise für Vorbereitung, Pflege und Reparatur."
        />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {knowledgeArticles.map((article, idx) => (
            <ArticleCard key={article.slug} article={article} featured={idx === 0} />
          ))}
        </div>
      </div>
    </section>

    <section className="bg-white px-6 py-20 md:py-28">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
          <article className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <h2 className="text-xl font-bold leading-tight text-gray-950">Professionelle Umsetzung in Leipzig</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Wenn aus Wissen ein konkreter Bedarf wird, hilft die Seite zur Fahrzeugaufbereitung Leipzig mit Leistungen, Ablauf und Anfrage.
            </p>
            <a href="/fahrzeugaufbereitung-leipzig" className="mt-5 inline-flex font-bold text-blue-700 hover:text-blue-800">
              Fahrzeugaufbereitung Leipzig ansehen
            </a>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <h2 className="text-xl font-bold leading-tight text-gray-950">Termin oder Einschätzung anfragen</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Für Innenraum, Lack, Leasingrückgabe oder kleine Schäden können Sie CarCare direkt mit Fahrzeugdaten kontaktieren.
            </p>
            <a href="/kontakt#contact-termin" className="mt-5 inline-flex font-bold text-blue-700 hover:text-blue-800">
              Kontaktformular öffnen
            </a>
          </article>
          <article className="rounded-2xl border border-gray-100 bg-gray-50/70 p-6">
            <h2 className="text-xl font-bold leading-tight text-gray-950">Unfall oder größerer Schaden?</h2>
            <p className="mt-3 text-sm leading-relaxed text-gray-600">
              Bei Unfallschäden geht es um Schadenaufnahme, Kalkulation, Karosserie, Lack und Abstimmung mit Beteiligten.
            </p>
            <a href="/unfallinstandsetzung-leipzig" className="mt-5 inline-flex font-bold text-blue-700 hover:text-blue-800">
              Unfallinstandsetzung Leipzig
            </a>
          </article>
        </div>
      </div>
    </section>

    <ContactCTA />
  </>
);

export default KnowledgeHubPage;
