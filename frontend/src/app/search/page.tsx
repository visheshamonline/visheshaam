import { searchArticles } from '@/lib/api';
import type { Metadata } from 'next';
import ArticleCard from '@/components/news/ArticleCard';
import SearchBar from '@/components/shared/SearchBar';

export const metadata: Metadata = { title: 'Search Kerala News' };

interface Props { searchParams: { q?: string } }

export default async function SearchPage({ searchParams }: Props) {
  const query = searchParams.q ?? '';
  const { data, total } = query ? await searchArticles(query) : { data: [], total: 0 };

  return (
    <div className="max-w-4xl mx-auto px-4 pb-16">
      <h1 className="text-3xl font-black text-gray-900 dark:text-white mb-6">Search</h1>
      <div className="mb-8">
        <SearchBar defaultValue={query} />
      </div>

      {query && (
        <p className="text-sm text-gray-500 mb-6">{total} results for "<span className="font-semibold text-gray-900 dark:text-white">{query}</span>"</p>
      )}

      {data.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-8">
          {data.map(article => (
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
  );
}
