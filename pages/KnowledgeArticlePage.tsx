import React from 'react';
import ArticleLayout from '../components/ArticleLayout';
import { PageMeta } from '../components/PageBlocks';
import { KnowledgeArticle, getKnowledgeArticleBySlug } from '../data/knowledgeArticles';

interface KnowledgeArticlePageProps {
  article: KnowledgeArticle;
}

const KnowledgeArticlePage: React.FC<KnowledgeArticlePageProps> = ({ article }) => {
  const relatedArticles = article.relatedSlugs
    .map((slug) => getKnowledgeArticleBySlug(slug))
    .filter((related): related is KnowledgeArticle => Boolean(related));

  return (
    <>
      <PageMeta
        canonical={article.path}
        title={article.metaTitle}
        description={article.metaDescription}
        og={{ type: 'article', title: article.metaTitle, description: article.metaDescription }}
      />
      <ArticleLayout article={article} relatedArticles={relatedArticles} />
    </>
  );
};

export default KnowledgeArticlePage;
