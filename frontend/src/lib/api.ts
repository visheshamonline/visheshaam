import { supabase } from './supabase';

export async function getArticles(page = 1, perPage = 20) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count } = await supabase
    .from('articles')
    .select('id, title, slug, summary, image_url, published_at, source_id, sources(name, logo_url)', { count: 'exact' })
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(from, to);
  return { data: data ?? [], total: count ?? 0 };
}

export async function getFeaturedArticles(limit = 5) {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, summary, image_url, published_at, sources(name)')
    .eq('status', 'published')
    .eq('is_summarized', true)
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getTrendingArticles(limit = 8) {
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, published_at, sources(name)')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit);
  return data ?? [];
}

export async function getArticleBySlug(slug: string) {
  const { data } = await supabase
    .from('articles')
    .select('*, sources(name, url, logo_url), article_categories(categories(name, slug))')
    .eq('slug', slug)
    .single();
  return data;
}

export async function getArticlesByCategory(categorySlug: string, page = 1, perPage = 20) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data: cat } = await supabase.from('categories').select('id, name').eq('slug', categorySlug).single();
  if (!cat) return { data: [], total: 0, category: null };
  const { data: links, count } = await supabase.from('article_categories').select('article_id', { count: 'exact' }).eq('category_id', cat.id);
  if (!links?.length) return { data: [], total: 0, category: cat };
  const ids = links.map((l: { article_id: string }) => l.article_id);
  const { data } = await supabase
    .from('articles')
    .select('id, title, slug, summary, image_url, published_at, sources(name)')
    .in('id', ids)
    .order('published_at', { ascending: false })
    .range(from, to);
  return { data: data ?? [], total: count ?? 0, category: cat };
}

export async function searchArticles(query: string, page = 1, perPage = 20) {
  const from = (page - 1) * perPage;
  const to = from + perPage - 1;
  const { data, count } = await supabase
    .from('articles')
    .select('id, title, slug, summary, image_url, published_at, sources(name)', { count: 'exact' })
    .or('title.ilike.%' + query + '%,summary.ilike.%' + query + '%')
    .range(from, to);
  return { data: data ?? [], total: count ?? 0 };
}

export async function getCategories() {
  const { data } = await supabase.from('categories').select('*').order('name');
  return data ?? [];
}
