import { getArticles, getTrendingArticles, getSourceStats } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleCard from '@/components/news/ArticleCard';
import Sidebar from '@/components/news/Sidebar';

export const revalidate = 300;

interface Props { params: { slug: string } }

const VALID = ['politics','business','crime','sports','health','technology','entertainment','education'];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1) + ' News – Kerala' };
}

export default async function CategoryPage({ params }: Props) {
  if (!VALID.includes(params.slug)) notFound();

  const [{ data, count }, trending, sourceStats] = await Promise.all([
    getArticles(1, 24, params.slug),
    getTrendingArticles(8),
    getSourceStats(),
  ]);

  const displayName = params.slug.charAt(0).toUpperCase() + params.slug.slice(1);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded">
            {displayName}
          </span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">{displayName} News</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{count} articles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {data.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
          {data.length === 0 && (
            <p className="text-gray-500 py-12 text-center">No articles yet in this category.</p>
          )}
        </div>
        <aside>
          <div className="sticky top-28">
            <Sidebar trending={trending} sourceStats={sourceStats} />
          </div>
        </aside>
      </div>
    </div>
  );
}
