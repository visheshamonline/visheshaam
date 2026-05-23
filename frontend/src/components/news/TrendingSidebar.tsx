import { Article } from '@/lib/api';
import ArticleCard from './ArticleCard';

interface Props {
  articles: Article[];
}

export default function TrendingSidebar({ articles }: Props) {
  const top5 = articles.slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Trending widget */}
      <div>
        <div className="flex items-center gap-3 mb-4">
          <h3 className="text-xs font-black uppercase tracking-widest text-gray-500 dark:text-gray-400">
            Trending
          </h3>
          <div className="flex-1 h-px bg-[#e7e5e4] dark:bg-[#2a2927]" />
          <span className="inline-block w-2 h-2 rounded-full bg-orange-500 animate-pulse" />
        </div>
        <div>
          {top5.map((article, i) => (
            <ArticleCard key={article.id} article={article} variant="compact" rank={i + 1} />
          ))}
        </div>
      </div>

      {/* AI Notice */}
      <div className="rounded-lg bg-orange-50 dark:bg-orange-950/30 border border-orange-200 dark:border-orange-900/50 p-4">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[10px] font-black uppercase tracking-widest text-orange-600 dark:text-orange-400">
            AI Summaries
          </span>
          <span className="text-xs bg-orange-500 text-white px-1.5 py-0.5 rounded font-bold">AI</span>
        </div>
        <p className="text-xs text-orange-700 dark:text-orange-300 leading-relaxed">
          Articles marked with the{' '}
          <span className="font-bold">AI</span> badge include AI-generated summaries to help you grasp the key points quickly.
          Always click through to read the full story from the original source.
        </p>
      </div>
    </div>
  );
}
