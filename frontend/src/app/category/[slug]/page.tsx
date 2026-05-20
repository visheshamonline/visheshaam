import { getArticlesByCategory, getTrendingArticles } from '@/lib/api';
import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import ArticleCard from '@/components/news/ArticleCard';
import TrendingSidebar from '@/components/news/TrendingSidebar';

export const revalidate = 300;

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  return { title: params.slug.charAt(0).toUpperCase() + params.slug.slice(1) + ' News – Kerala' };
}

export default async function CategoryPage({ params }: Props) {
  const [{ data, total, category }, trending] = await Promise.all([
    getArticlesByCategory(params.slug),
    getTrendingArticles(8),
  ]);

  if (!category) notFound();

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-xs font-black uppercase tracking-widest bg-brand-500 text-white px-2 py-0.5 rounded">{category.name}</span>
        </div>
        <h1 className="text-3xl font-black text-gray-900 dark:text-white">{category.name} News</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">{total} articles</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {data.map((article) => (
              <ArticleCard key={article.id} article={article as any} />
            ))}
          </div>
          {data.length === 0 && (
            <p className="text-gray-500 py-12 text-center">No articles yet in this category.</p>
          )}
        </div>
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <TrendingSidebar articles={trending as any} />
          </div>
        </aside>
      </div>
    </div>
  );
}
