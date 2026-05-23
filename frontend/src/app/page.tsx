import { getFeaturedArticles, getTrendingArticles, getArticles, getSourceStats } from '@/lib/api';
import HeroSection from '@/components/news/HeroSection';
import ArticleCard from '@/components/news/ArticleCard';
import Sidebar from '@/components/news/Sidebar';

export const revalidate = 300; // ISR: refresh every 5 mins

export default async function HomePage() {
  const [featured, trending, { data: latest }, sourceStats] = await Promise.all([
    getFeaturedArticles(5),
    getTrendingArticles(8),
    getArticles(1, 12),
    getSourceStats(),
  ]);

  const subFeatured = featured.slice(3, 5); // 4th and 5th for secondary grid

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      {/* Breaking bar */}
      <div className="flex items-center gap-3 mb-6 py-2 border-y border-[#e7e5e4] dark:border-[#2a2927]">
        <span className="text-[10px] font-black uppercase tracking-widest bg-orange-500 text-white px-2 py-0.5 rounded">
          Kerala
        </span>
        <span className="text-xs text-gray-400 dark:text-gray-500">
          AI-curated news from top Kerala sources
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        {/* ── Main content ── */}
        <div className="min-w-0">
          {/* Hero section: big left + 2 stacked right */}
          <HeroSection featured={featured} />

          {/* Sub-featured row (cards 4–5) */}
          {subFeatured.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-10 pb-10 border-b border-[#e7e5e4] dark:border-[#2a2927]">
              {subFeatured.map(a => (
                <ArticleCard key={a.id} article={a} />
              ))}
            </div>
          )}

          {/* Section header */}
          <div className="flex items-center gap-3 mb-6">
            <h2 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400 shrink-0">
              Latest News
            </h2>
            <div className="flex-1 h-px bg-[#e7e5e4] dark:bg-[#2a2927]" />
          </div>

          {/* 3-column article grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
            {latest.map(article => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        </div>

        {/* ── Sidebar ── */}
        <aside className="lg:col-span-1">
          <div className="sticky top-28">
            <Sidebar trending={trending} sourceStats={sourceStats} />
          </div>
        </aside>
      </div>
    </div>
  );
}
