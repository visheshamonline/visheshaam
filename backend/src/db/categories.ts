import { supabase } from '../utils/supabase';

const KNOWN_CATEGORIES = ['politics', 'crime', 'health', 'education', 'business', 'sports', 'weather', 'entertainment', 'technology', 'general'];

export async function ensureCategories() {
  for (const name of KNOWN_CATEGORIES) {
    await supabase.from('categories').upsert({ name, slug: name }, { onConflict: 'slug' });
  }
}

export async function linkArticleCategories(articleId: string, categoryNames: string[]) {
  const validNames = categoryNames.filter(n => KNOWN_CATEGORIES.includes(n.toLowerCase()));
  if (!validNames.length) return;

  const { data: cats } = await supabase
    .from('categories')
    .select('id, slug')
    .in('slug', validNames.map(n => n.toLowerCase()));

  if (!cats?.length) return;

  const links = cats.map(c => ({ article_id: articleId, category_id: c.id }));
  await supabase.from('article_categories').upsert(links, { onConflict: 'article_id,category_id' });
}
