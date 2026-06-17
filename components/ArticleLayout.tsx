import React from 'react';
import { ArrowRight, CheckCircle2, ChevronRight, MapPin, Phone } from 'lucide-react';
import { KnowledgeArticle } from '../data/knowledgeArticles';
import FAQSection from './FAQSection';

interface ArticleLayoutProps {
  article: KnowledgeArticle;
  relatedArticles: KnowledgeArticle[];
}

interface ArticleSection {
  id: string;
  title: string;
  items?: string[];
  paragraphs?: string[];
  ordered?: boolean;
}

const ArticleContentSection: React.FC<ArticleSection> = ({ id, title, items, ordered, paragraphs }) => {
  const ListTag = ordered ? 'ol' : 'ul';

  return (
    <section id={id} aria-labelledby={`${id}-heading`} className="scroll-mt-28 rounded-2xl border border-gray-100 bg-white p-6 shadow-sm md:p-8">
      <h2 id={`${id}-heading`} className="text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-3xl">
        {title}
      </h2>
      {paragraphs?.map((paragraph) => (
        <p key={paragraph} className="mt-4 text-base leading-relaxed text-gray-600">
          {paragraph}
        </p>
      ))}
      {items && (
        <ListTag className="mt-5 space-y-3">
          {items.map((item, idx) => (
            <li key={item} className="flex gap-3 text-sm leading-relaxed text-gray-700 md:text-base">
              <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-50 text-xs font-bold text-blue-700">
                {ordered ? idx + 1 : <CheckCircle2 size={15} />}
              </span>
              <span>{item}</span>
            </li>
          ))}
        </ListTag>
      )}
    </section>
  );
};

const ArticleLayout: React.FC<ArticleLayoutProps> = ({ article, relatedArticles }) => {
  const sections: ArticleSection[] = [
    { id: 'definition', title: 'Definition', paragraphs: article.definition },
    { id: 'wann-lohnt-es-sich', title: 'Wann lohnt sich das?', items: article.whenItPays },
    { id: 'ablauf', title: 'Ablauf', items: article.process, ordered: true },
    { id: 'kostenfaktoren', title: 'Kostenfaktoren', items: article.costFactors },
    { id: 'profi-tipps', title: 'Profi-Tipps von CarCare', items: article.tips },
    { id: 'haeufige-fehler', title: 'Häufige Fehler', items: article.mistakes },
  ];

  return (
    <article className="bg-white">
      <header className="bg-gradient-to-br from-blue-50 via-white to-white px-6 pb-14 pt-32 md:pb-20 md:pt-40">
        <div className="container mx-auto max-w-5xl">
          <nav aria-label="Breadcrumb" className="mb-7 flex flex-wrap items-center gap-2 text-sm font-semibold text-gray-500">
            <a href="/" className="transition-colors hover:text-blue-700">Start</a>
            <ChevronRight size={15} />
            <a href="/autoaufbereitung-wissen" className="transition-colors hover:text-blue-700">Autoaufbereitung Wissen</a>
            <ChevronRight size={15} />
            <span className="text-gray-950">{article.cardTitle}</span>
          </nav>
          <div className="mb-5 flex flex-wrap items-center gap-2">
            <span className="rounded-full border border-blue-100 bg-white px-4 py-2 text-[11px] font-bold uppercase tracking-[0.2em] text-blue-700">
              {article.category}
            </span>
            <span className="rounded-full bg-gray-100 px-4 py-2 text-xs font-bold text-gray-600">{article.readTime} Lesezeit</span>
          </div>
          <h1 className="text-4xl font-bold leading-[1.05] tracking-tight text-gray-950 md:text-6xl">{article.title}</h1>
          <p className="mt-6 max-w-4xl text-lg leading-relaxed text-gray-700 md:text-xl">{article.introAnswer}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <a href="/kontakt#contact-termin" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              Termin in Leipzig anfragen
              <ArrowRight size={16} />
            </a>
            <a href="/fahrzeugaufbereitung-leipzig" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-7 py-4 text-sm font-bold text-white">
              Fahrzeugaufbereitung Leipzig
            </a>
          </div>
        </div>
      </header>

      <section className="bg-gray-50/70 px-6 py-14 md:py-20">
        <div className="container mx-auto grid max-w-6xl grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_18rem]">
          <div className="space-y-6">
            {sections.map((section) => (
              <ArticleContentSection key={section.id} {...section} />
            ))}

            <section aria-labelledby="local-cta-heading" className="rounded-[2rem] border border-blue-100 bg-gradient-to-br from-blue-50 via-white to-white p-6 md:p-8">
              <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
                <MapPin size={15} />
                CarCare Leipzig
              </span>
              <h2 id="local-cta-heading" className="text-2xl font-bold leading-tight tracking-tight text-gray-950 md:text-3xl">
                Beratung und professionelle Umsetzung vor Ort.
              </h2>
              <p className="mt-4 text-base leading-relaxed text-gray-600">
                Wenn Sie eine fachliche Einschätzung für Ihr Fahrzeug wünschen, unterstützt CarCare Leipzig bei Autoaufbereitung, Lackpflege, Leasingrückgabe-Vorbereitung und Smart Repair.
              </p>
              <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                <a href="/kontakt#contact-termin" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold text-white">
                  Anfrage senden
                  <ArrowRight size={15} />
                </a>
                <a href="tel:+493412617790" className="cc-gradient-button inline-flex items-center justify-center gap-2 rounded-full border px-6 py-3 text-sm font-bold text-white">
                  <Phone size={15} />
                  0341 - 261 77 90
                </a>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-2xl border border-gray-100 bg-white p-5 shadow-sm lg:sticky lg:top-28">
            <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Im Artikel</h2>
            <nav aria-label="Artikelabschnitte" className="mt-4 space-y-2">
              {sections.map((section) => (
                <a key={section.id} href={`#${section.id}`} className="block rounded-xl px-3 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-blue-50 hover:text-blue-700">
                  {section.title}
                </a>
              ))}
            </nav>
            {relatedArticles.length > 0 && (
              <div className="mt-7 border-t border-gray-100 pt-5">
                <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-gray-500">Weiterlesen</h2>
                <ul className="mt-4 space-y-3">
                  {relatedArticles.map((related) => (
                    <li key={related.slug}>
                      <a href={related.path} className="group inline-flex items-start gap-2 text-sm font-bold leading-snug text-gray-950 transition-colors hover:text-blue-700">
                        <ArrowRight size={14} className="mt-0.5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1" />
                        {related.cardTitle}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </aside>
        </div>
      </section>

      <FAQSection
        id="artikel-faq"
        className="bg-white"
        faqs={article.faqs}
        title="Häufige Fragen zu diesem Thema."
        description="Kurz und fachlich eingeordnet, damit Sie Aufwand, Nutzen und Grenzen besser einschätzen können."
      />
    </article>
  );
};

export default ArticleLayout;
