import Link from 'next/link';
import Image from 'next/image';
import { timeAgo } from '@/lib/date';

interface Props {
  article: {
    id: string;
    title: string;
    slug: string;
    summary?: string | null;
    image_url?: string | null;
    published_at?: string | null;
    sources?: { name: string } | null;
  };
  variant?: 'default' | 'compact' | 'hero';
}

export default function ArticleCard({ article, variant = 'default' }: Props) {
  if (variant === 'compact') {
    return (
      <Link href={`/article/${article.slug}`} className="flex gap-3 group py-3 border-b border-gray-100 dark:border-[#222] last:border-0">
        {article.image_url && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded overflow-hidden">
            <Image src={article.image_url} alt={article.title} fill className="object-cover" sizes="64px" />
          </div>
        )}
        <div className="flex-1 min-w-0">
          <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">{article.title}</h3>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">{timeAgo(article.published_at ?? null)}</p>
        </div>
      </Link>
    );
  }

  if (variant === 'hero') {
    return (
      <Link href={`/article/${article.slug}`} className="group block">
        {article.image_url && (
          <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-4">
            <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 60vw" priority />
          </div>
        )}
        <div className="flex items-center gap-2 mb-2">
          {article.sources && <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{article.sources.name}</span>}
          <span className="text-xs text-gray-400">{timeAgo(article.published_at ?? null)}</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors leading-tight mb-2">{article.title}</h2>
        {article.summary && <p className="text-gray-600 dark:text-gray-400 text-base leading-relaxed line-clamp-3">{article.summary}</p>}
      </Link>
    );
  }

  return (
    <Link href={`/article/${article.slug}`} className="group block">
      {article.image_url && (
        <div className="relative aspect-[16/9] rounded-lg overflow-hidden mb-3">
          <Image src={article.image_url} alt={article.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
        </div>
      )}
      <div className="flex items-center gap-2 mb-1">
        {article.sources && <span className="text-xs font-semibold text-brand-500 uppercase tracking-wide">{article.sources.name}</span>}
        <span className="text-xs text-gray-400">{timeAgo(article.published_at ?? null)}</span>
      </div>
      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug mb-1">{article.title}</h3>
      {article.summary && <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 leading-relaxed">{article.summary}</p>}
    </Link>
  );
}
