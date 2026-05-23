import { supabase } from './supabase';
import { stripHtml } from './utils';

export interface Article {
  id: string;
  title: string;
  summary: string | null;
  content: string | null;
  image_url: string | null;
  source_name: string | null;
  source_url: string | null;
  category: string | null;
  slug: string | null;
  published_at: string | null;
  view_count: number | null;
  url: string | null;
}

export interface SourceStat {
  source_name: string;
  count: number;
}

function cleanArticle(raw: Record<string, unknown>): Article {
  return {
    id: String(raw.id ?? ''),
    title: stripHtml(raw.title as string),
    summary: raw.summary ? stripHtml(raw.summary as string) : null,
    content: raw.content ? stripHtml(raw.content as string) : null,
    image_url: (raw.image_url as string) ?? null,
    source_name: (raw.source_name as string) ?? null,
    source_url: (raw.source_url as string) ?? null,
    category: (raw.category as string) ?? null,
    slug: (raw.slug as string) ?? null,
    published_at: (raw.published_at as string) ?? null,
    view_count: (raw.view_count as number) ?? null,
    url: (raw.url as string) ?? null,
  };
}

/** Featured articles — prefer ones with images, ordered by published_at desc */
export async function getFeaturedArticles(limit = 5): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .not('image_url', 'is', null)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(cleanArticle);
}

/** Trending articles — ordered by view_count desc */
export async function getTrendingArticles(limit = 8): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .order('view_count', { ascending: false, nullsFirst: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(cleanArticle);
}

/** Paginated articles, optionally filtered by category */
export async function getArticles(
  page = 1,
  limit = 12,
  category?: string,
): Promise<{ data: Article[]; count: number }> {
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from('articles')
    .select('*', { count: 'exact' })
    .order('published_at', { ascending: false })
    .range(from, to);

  if (category) {
    query = query.ilike('category', category);
  }

  const { data, error, count } = await query;

  if (error || !data) return { data: [], count: 0 };
  return {
    data: (data as Record<string, unknown>[]).map(cleanArticle),
    count: count ?? 0,
  };
}

/** Full-text search on title and summary */
export async function searchArticles(query: string, limit = 24): Promise<Article[]> {
  if (!query.trim()) return [];

  const q = query.trim();

  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .or(`title.ilike.%${q}%,summary.ilike.%${q}%`)
    .order('published_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return (data as Record<string, unknown>[]).map(cleanArticle);
}

/** Source article counts in last 24 hours */
export async function getSourceStats(): Promise<SourceStat[]> {
  const since = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data, error } = await supabase
    .from('articles')
    .select('source_name')
    .gte('published_at', since)
    .not('source_name', 'is', null);

  if (error || !data) return [];

  const counts: Record<string, number> = {};
  for (const row of data as { source_name: string }[]) {
    if (row.source_name) {
      counts[row.source_name] = (counts[row.source_name] ?? 0) + 1;
    }
  }

  return Object.entries(counts)
    .map(([source_name, count]) => ({ source_name, count }))
    .sort((a, b) => b.count - a.count);
}

/** Single article by slug */
export async function getArticleBySlug(slug: string): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return cleanArticle(data as Record<string, unknown>);
}
