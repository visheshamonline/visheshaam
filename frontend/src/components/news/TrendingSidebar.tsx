import Link from 'next/link';
import { TrendingUp } from 'lucide-react';
import { timeAgo } from '@/lib/date';

interface Props {
  articles: Array<{
    id: string;
    title: string;
    slug: string;
    published_at?: string | null;
    sources?: { name: string } | null;
  }>;
}

export default function TrendingSidebar({ articles }: Props) {
  return (
    <aside className="w-full">
      <div className="flex items-center gap-2 mb-4 pb-3 border-b border-gray-200 dark:border-[#2a2a2a]">
        <TrendingUp size={16} className="text-brand-500" />
        <h2 className="text-sm font-bold uppercase tracking-widest text-gray-700 dark:text-gray-300">Trending</h2>
      </div>
      <ol className="space-y-0">
        {articles.map((article, i) => (
          <li key={article.id} className="flex gap-3 py-3 border-b border-gray-100 dark:border-[#1e1e1e] last:border-0">
            <span className="text-2xl font-black text-gray-200 dark:text-[#2a2a2a] leading-none mt-0.5 w-7 flex-shrink-0">{i + 1}</span>
            <div>
              <Link href={`/article/${article.slug}`} className="text-sm font-semibold text-gray-900 dark:text-gray-100 hover:text-brand-500 transition-colors line-clamp-2 leading-snug block">
                {article.title}
              </Link>
              <div className="flex items-center gap-2 mt-1">
                {article.sources && <span className="text-xs text-brand-500 font-medium">{article.sources.name}</span>}
                <span className="text-xs text-gray-400">{timeAgo(article.published_at ?? null)}</span>
              </div>
            </div>
          </li>
        ))}
      </ol>
    </aside>
  );
}
