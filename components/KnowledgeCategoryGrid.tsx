import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, BookOpen, Car, Wrench } from 'lucide-react';
import { KnowledgeArticle, KnowledgeCategory } from '../data/knowledgeArticles';

interface KnowledgeCategoryGridProps {
  articles: KnowledgeArticle[];
  categories: KnowledgeCategory[];
}

const icons: Record<string, React.ReactNode> = {
  grundlagen: <BookOpen size={22} />,
  werterhalt: <Car size={22} />,
  'smart-repair': <Wrench size={22} />,
};

const KnowledgeCategoryGrid: React.FC<KnowledgeCategoryGridProps> = ({ articles, categories }) => (
  <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
    {categories.map((category, idx) => {
      const categoryArticles = category.articleSlugs
        .map((slug) => articles.find((article) => article.slug === slug))
        .filter((article): article is KnowledgeArticle => Boolean(article));

      return (
        <motion.article
          key={category.id}
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-40px' }}
          transition={{ duration: 0.45, delay: idx * 0.05 }}
          className="rounded-2xl border border-gray-100 bg-white p-6 shadow-sm"
        >
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-700">
            {icons[category.id]}
          </div>
          <h3 className="text-xl font-bold leading-tight text-gray-950">{category.title}</h3>
          <p className="mt-3 text-sm leading-relaxed text-gray-600">{category.description}</p>
          <ul className="mt-6 space-y-3">
            {categoryArticles.map((article) => (
              <li key={article.slug}>
                <a href={article.path} className="group inline-flex items-start gap-2 text-sm font-bold leading-snug text-gray-950 transition-colors hover:text-blue-700">
                  <ArrowRight size={15} className="mt-0.5 shrink-0 text-blue-600 transition-transform group-hover:translate-x-1" />
                  {article.cardTitle}
                </a>
              </li>
            ))}
          </ul>
        </motion.article>
      );
    })}
  </div>
);

export default KnowledgeCategoryGrid;
