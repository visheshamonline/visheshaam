import { searchArticles, getTrendingArticles, getSourceStats } from '@/lib/api';
import type { Metadata } from 'next';
import ArticleCard from '@/components/news/ArticleCard';
import SearchBar from '@/components/shared/SearchBar';
import Sidebar from '@/components/news/Sidebar';

export const metadata: Metadata = { title: 'Search Kerala News' };

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q?.trim() ?? '';

  const [results, trending, sourceStats] = await Promise.all([
    query ? searchArticles(query) : Promise.resolve([]),
    getTrendingArticles(8),
    getSourceStats(),
  ]);

  return (
    <div className="max-w-7xl mx-auto px-4 pb-16">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Search</h1>
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {query && (
        <p className="text-sm text-gray-500 mb-6">
          {results.length} results for "
          <span className="font-semibold text-gray-900 dark:text-white">{query}</span>"
        </p>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-8">
        <div>
          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {results.map(article => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          ) : query ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg mb-2">No results found</p>
              <p className="text-gray-400 text-sm">Try different keywords</p>
            </div>
          ) : (
            <div className="text-center py-16 text-gray-400">Enter a search term above</div>
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
