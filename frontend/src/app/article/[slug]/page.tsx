import { getArticleBySlug, getTrendingArticles, getSourceStats } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import Link from 'next/link';
import Image from 'next/image';
import Sidebar from '@/components/news/Sidebar';
import { timeAgo, categoryBadgeClass } from '@/lib/utils';
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
  const [article, trending, sourceStats] = await Promise.all([
    getArticleBySlug(params.slug),
    getTrendingArticles(6),
    getSourceStats(),
  ]);

  if (!article) notFound();

  const externalUrl = article.url ?? '#';
  const catClass = categoryBadgeClass(article.category);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <article>
          {/* Meta */}
          <div className="mb-4 flex flex-wrap items-center gap-2">
            {article.category && (
              <span className={`text-xs font-bold uppercase tracking-widest px-2 py-0.5 rounded ${catClass}`}>
                {article.category}
              </span>
            )}
            {article.source_name && (
              <span className="text-xs font-semibold text-orange-500 uppercase tracking-wide">
                {article.source_name}
              </span>
            )}
          </div>

          {/* Headline */}
          <h1
            className="text-3xl sm:text-4xl font-bold leading-tight text-gray-900 dark:text-white mb-4"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            {article.title}
          </h1>

          {/* Byline */}
          <div className="flex items-center gap-3 mb-6 pb-6 border-b border-gray-200 dark:border-[#2a2927]">
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {timeAgo(article.published_at)}
            </span>
            <Link
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-gray-400 hover:text-orange-500 transition-colors ml-auto"
            >
              Original source <ExternalLink size={12} />
            </Link>
          </div>

          {/* Hero image */}
          {article.image_url && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden mb-8">
              <Image
                src={article.image_url}
                alt={article.title}
                fill
                className="object-cover"
                sizes="(max-width:768px) 100vw, 60vw"
                priority
              />
            </div>
          )}

          {/* AI Summary */}
          {article.summary && (
            <div className="mb-8 p-5 rounded-xl bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30">
              <p className="text-xs font-bold uppercase tracking-widest text-orange-500 mb-2">AI Summary</p>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{article.summary}</p>
            </div>
          )}

          {/* Content */}
          <div className="prose-article max-w-none">
            {(article.content ?? '').split('\n').filter(Boolean).map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>

          {/* Source link */}
          <div className="mt-10 pt-6 border-t border-gray-200 dark:border-[#2a2927]">
            <Link
              href={externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm font-medium text-orange-500 hover:text-orange-600 transition-colors"
            >
              Read original article at {article.source_name ?? 'source'} <ExternalLink size={14} />
            </Link>
          </div>
        </article>

        {/* Sidebar */}
        <aside>
          <div className="sticky top-28">
            <Sidebar trending={trending as any} sourceStats={sourceStats} />
          </div>
        </aside>
      </div>
    </div>
  );
}
