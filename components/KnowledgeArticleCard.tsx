import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Clock3 } from 'lucide-react';
import { KnowledgeArticle } from '../data/knowledgeArticles';

interface KnowledgeArticleCardProps {
  article: KnowledgeArticle;
  featured?: boolean;
}

const KnowledgeArticleCard: React.FC<KnowledgeArticleCardProps> = ({ article, featured = false }) => (
  <motion.a
    href={article.path}
    initial={{ opacity: 0, y: 18 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ duration: 0.45 }}
    className={`group flex h-full flex-col rounded-2xl border bg-white p-6 shadow-sm transition-all hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl hover:shadow-gray-200/60 ${
      featured ? 'border-blue-100 md:p-8' : 'border-gray-100'
    }`}
  >
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <span className="rounded-full bg-blue-50 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.16em] text-blue-700">
        {article.category}
      </span>
      <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-500">
        <Clock3 size={13} />
        {article.readTime}
      </span>
    </div>
    <h3 className={`${featured ? 'text-2xl md:text-3xl' : 'text-xl'} font-bold leading-tight tracking-tight text-gray-950`}>
      {article.cardTitle}
    </h3>
    <p className="mt-4 flex-1 text-sm leading-relaxed text-gray-600 md:text-base">{article.cardDescription}</p>
    <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-blue-700">
      Artikel lesen
      <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
    </span>
  </motion.a>
);

export default KnowledgeArticleCard;
