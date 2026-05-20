import { supabase } from '../utils/supabase';
import { hashContent } from '../utils/hash';
import { uniqueSlug } from '../utils/slug';
import { logger } from '../utils/logger';

export interface ArticleInsert {
  title: string;
  article_url: string;
  raw_content: string;
  clean_content: string;
  image_url: string | null;
  published_at: string;
  source_id: string;
}

export async function isDuplicate(url: string, contentHash: string): Promise<boolean> {
  const { data } = await supabase
    .from('articles')
    .select('id')
    .or(`article_url.eq.${url},content_hash.eq.${contentHash}`)
    .limit(1);
  return (data?.length ?? 0) > 0;
}

export async function saveArticle(article: ArticleInsert): Promise<string | null> {
  const hash = hashContent(article.title + article.article_url);
  const dup = await isDuplicate(article.article_url, hash);
  if (dup) return null;

  const slug = uniqueSlug(article.title, hash);
  const { data, error } = await supabase
    .from('articles')
    .insert({
      ...article,
      slug,
      content_hash: hash,
      language: 'en',
      status: 'published',
      ai_processing_status: 'pending',
      is_summarized: false,
      is_categorized: false,
    })
    .select('id')
    .single();

  if (error) {
    logger.error('Save article error', error.message);
    return null;
  }
  return data.id;
}

export async function getPendingArticles(limit = 10) {
  const { data } = await supabase
    .from('articles')
    .select('id, title, clean_content')
    .eq('ai_processing_status', 'pending')
    .is('is_summarized', false)
    .limit(limit);
  return data ?? [];
}

export async function updateArticleAi(
  id: string,
  summary: string,
  categories: string[]
) {
  await supabase
    .from('articles')
    .update({
      summary,
      ai_processing_status: 'done',
      is_summarized: true,
      is_categorized: categories.length > 0,
    })
    .eq('id', id);
}

export async function markAiFailed(id: string) {
  await supabase
    .from('articles')
    .update({ ai_processing_status: 'failed' })
    .eq('id', id);
}
