import { getArticleBySlug, getTrendingArticles } from '@/lib/api';
import { formatDate } from '@/lib/date';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import TrendingSidebar from '@/components/news/TrendingSidebar';
import CategoryBadge from '@/components/shared/CategoryBadge';
import { ExternalLink } from 'lucide-react';

export const revalidate = 3600;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug);
  if (!article) return { title: 'Not Found' };
  return {
    title: article.title,
    description: article.summary ?? '',
    openGraph: {
      title: article.title,
      description: article.summary ?? '',
      images: article.image_url ? [article.image_url] : [],
      type: 'article',
      publishedTime: article.published_at ?? '',
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const [article, trending] = await Promise.all([
    getArticleBySlug(params.slug),
    getTrendingArticles(6),
  ]);

  if (!article) notFound();

  const categories = article.article_categories
    ?.map((ac: { categories: { name: string; slug: string } }) => ac.categories)
    .filter(Boolean) ?? [];

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <article className="lg:col-span-2">
          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {categories.map((cat: { name: string; slug: string }) => (
              <CategoryBadge key={cat.slug} name={cat.name} slug={cat.slug} />
            ))}
            {article.sources && (
              <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{article.sources.name}</span>
            )}
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl font-black leading-tight text-gray-900 dark:text-white mb-4">
            {article.title}
          </h1>

          {/* Byline */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-[#2a2a2a]">
            <div className="w-px h-4 bg-gray-300 dark:bg-gray-600" />
            <span className="text-sm text-gray-500 dark:text-gray-400">{formatDate(article.published_at)}</span>
            {article.sources && (
              <Link href={article.article_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-500 transition-colors ml-auto">
                Original source <ExternalLink size={12} />
              </Link>
            )}
          </div>

          {/* Hero image */}
          {article.image_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="(max-width: 768px) 100vw, 60vw" priority />
            </div>
          )}

          {/* Summary (AI) */}
          {article.summary && (
            <div className="mb-8 p-5 rounded-xl bg-brand-50 dark:bg-brand-500/5 border border-brand-100 dark:border-brand-500/10">
              <p className="text-xs font-bold uppercase tracking-widest text-brand-500 mb-2">AI Summary</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose-article max-w-none">
            {(article.clean_content ?? article.raw_content ?? '').split('\n').filter(Boolean).map((p: string, i: number) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Source link */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#2a2a2a]">
            <Link href={article.article_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-brand-500 hover:text-brand-600 transition-colors">
              Read original article at {article.sources?.name} <ExternalLink size={14} />
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <TrendingSidebar articles={trending as any} />
          </div>
        </aside>
      </div>
    </div>
  );
}
