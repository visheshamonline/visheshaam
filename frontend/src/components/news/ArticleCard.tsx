import Link from 'next/link';
import Image from 'next/image';
import { Article } from '@/lib/api';
import { timeAgo, categoryBadgeClass, placeholderGradient } from '@/lib/utils';

interface Props {
  article: Article;
  variant?: 'hero' | 'sub' | 'default' | 'compact';
  rank?: number;
}

export default function ArticleCard({ article, variant = 'default', rank }: Props) {
  const href = article.slug
    ? `/article/${article.slug}`
    : article.url ?? '#';
  const isExternal = !article.slug && !!article.url;
  const catClass = categoryBadgeClass(article.category);
  const gradient = placeholderGradient(article.id);

  if (variant === 'hero') return <HeroCard article={article} href={href} isExternal={isExternal} catClass={catClass} gradient={gradient} />;
  if (variant === 'sub') return <SubCard article={article} href={href} isExternal={isExternal} catClass={catClass} gradient={gradient} />;
  if (variant === 'compact') return <CompactCard article={article} href={href} isExternal={isExternal} catClass={catClass} gradient={gradient} rank={rank} />;
  return <DefaultCard article={article} href={href} isExternal={isExternal} catClass={catClass} gradient={gradient} />;
}

/* ─── Hero card ─────────────────────────────────────────────── */
function HeroCard({ article, href, isExternal, catClass, gradient }: CardProps) {
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      {/* Image / gradient */}
      <div className="relative w-full aspect-[16/9] rounded-lg overflow-hidden mb-4 bg-gray-900">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(max-width:1024px) 100vw, 60vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            priority
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        {/* Badges over image */}
        <div className="absolute top-3 left-3 flex gap-2">
          {article.category && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${catClass}`}>
              {article.category}
            </span>
          )}
          {article.summary && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500 text-white">
              AI
            </span>
          )}
        </div>

        {/* Headline over image */}
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h2
            className="text-white text-2xl sm:text-3xl font-bold leading-tight line-clamp-3"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            {article.title}
          </h2>
          <div className="flex items-center gap-2 mt-2 text-gray-300 text-xs">
            {article.source_name && <span className="font-medium">{article.source_name}</span>}
            {article.source_name && article.published_at && <span>·</span>}
            {article.published_at && <span>{timeAgo(article.published_at)}</span>}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Sub-hero card (right stack) ───────────────────────────── */
function SubCard({ article, href, isExternal, catClass, gradient }: CardProps) {
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group block"
    >
      <div className="relative w-full aspect-[16/9] rounded-md overflow-hidden mb-3 bg-gray-900">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="40vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
        {article.category && (
          <span className={`absolute top-2 left-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded ${catClass}`}>
            {article.category}
          </span>
        )}
        {article.summary && (
          <span className="absolute top-2 right-2 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded bg-orange-500 text-white">
            AI
          </span>
        )}
        <div className="absolute bottom-0 left-0 right-0 p-3">
          <h3
            className="text-white font-semibold text-sm leading-snug line-clamp-3"
            style={{ fontFamily: 'Lora, Georgia, serif' }}
          >
            {article.title}
          </h3>
          <div className="flex items-center gap-1.5 mt-1.5 text-gray-300 text-[11px]">
            {article.source_name && <span>{article.source_name}</span>}
            {article.published_at && <><span>·</span><span>{timeAgo(article.published_at)}</span></>}
          </div>
        </div>
      </div>
    </Link>
  );
}

/* ─── Default card (grid) ────────────────────────────────────── */
function DefaultCard({ article, href, isExternal, catClass, gradient }: CardProps) {
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex flex-col bg-white dark:bg-[#1c1b1a] border border-[#e7e5e4] dark:border-[#2a2927] rounded-lg overflow-hidden hover:border-orange-300 dark:hover:border-orange-800 transition-colors"
    >
      {/* Thumbnail */}
      <div className="relative w-full h-[120px] bg-gray-100 dark:bg-gray-800 overflow-hidden">
        {article.image_url ? (
          <Image
            src={article.image_url}
            alt={article.title}
            fill
            sizes="(max-width:640px) 100vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-2">
          {article.category && (
            <span className={`text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded ${catClass}`}>
              {article.category}
            </span>
          )}
          {article.summary && (
            <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400">
              AI
            </span>
          )}
        </div>

        <h3
          className="text-gray-900 dark:text-gray-100 text-sm font-semibold leading-snug line-clamp-3 flex-1"
          style={{ fontFamily: 'Lora, Georgia, serif' }}
        >
          {article.title}
        </h3>

        <div className="flex items-center gap-1.5 mt-2 text-gray-400 dark:text-gray-500 text-[11px]">
          {article.source_name && (
            <span className="font-medium text-gray-500 dark:text-gray-400">{article.source_name}</span>
          )}
          {article.published_at && (
            <><span>·</span><span>{timeAgo(article.published_at)}</span></>
          )}
        </div>
      </div>
    </Link>
  );
}

/* ─── Compact card (trending list row) ──────────────────────── */
function CompactCard({ article, href, isExternal, gradient, rank }: CardProps) {
  return (
    <Link
      href={href}
      target={isExternal ? '_blank' : undefined}
      rel={isExternal ? 'noopener noreferrer' : undefined}
      className="group flex items-center gap-3 py-3 border-b border-[#e7e5e4] dark:border-[#2a2927] last:border-0"
    >
      {/* Rank */}
      {rank !== undefined && (
        <span className="text-3xl font-black text-gray-100 dark:text-[#2a2927] leading-none w-6 shrink-0 select-none">
          {rank}
        </span>
      )}

      {/* Text */}
      <div className="flex-1 min-w-0">
        <h4
          className="text-sm font-semibold text-gray-900 dark:text-gray-100 leading-snug line-clamp-2 group-hover:text-orange-500 transition-colors"
          style={{ fontFamily: 'Lora, Georgia, serif' }}
        >
          {article.title}
        </h4>
        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
          {article.source_name && <span>{article.source_name}</span>}
          {article.published_at && <><span>·</span><span>{timeAgo(article.published_at)}</span></>}
        </div>
      </div>

      {/* Thumbnail */}
      <div className="relative w-14 h-14 shrink-0 rounded overflow-hidden bg-gray-100 dark:bg-gray-800">
        {article.image_url ? (
          <Image src={article.image_url} alt="" fill sizes="56px" className="object-cover" />
        ) : (
          <div className={`absolute inset-0 bg-gradient-to-br ${gradient}`} />
        )}
      </div>
    </Link>
  );
}

interface CardProps {
  article: Article;
  href: string;
  isExternal: boolean;
  catClass: string;
  gradient: string;
  rank?: number;
}
