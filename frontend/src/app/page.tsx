import { getFeaturedArticles, getTrendingArticles, getArticles } from '@/lib/api';
import ArticleCard from '@/components/news/ArticleCard';
import TrendingSidebar from '@/components/news/TrendingSidebar';

export const revalidate = 300; // ISR: refresh every 5 mins

export default async function HomePage() {
  const [featured, trending, { data: latest }] = await Promise.all([
    getFeaturedArticles(5),
    getTrendingArticles(8),
    getArticles(1, 12),
  ]);

  const hero = featured[0];
  const subFeatured = featured.slice(1, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      {/* Breaking bar */}
      <div className="flex items-center gap-3 mb-8 py-2 border-y border-gray-200 dark:border-[#2a2a2a]">
        <span className="text-xs font-black uppercase tracking-widest bg-brand-500 text-white px-2 py-0.5 rounded">Kerala</span>
        <span className="text-xs text-gray-500 dark:text-gray-400">AI-curated news from top Kerala sources</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2">
          {/* Hero article */}
          {hero && (
            <div className="mb-10 pb-10 border-b border-gray-200 dark:border-[#2a2a2a]">
              <ArticleCard article={hero} variant="hero" />
            </div>
          )}

          {/* Sub-featured grid */}
          {subFeatured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 pb-10 border-b border-gray-200 dark:border-[#2a2a2a]">
              {subFeatured.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">Latest News</h2>
            <div className="flex-1 h-px bg-gray-200 dark:bg-[#2a2a2a]" />
          </div>

          {/* Latest articles grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
            {latest.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <TrendingSidebar articles={trending} />
          </div>
        </aside>
      </div>
    </div>
  );
}
