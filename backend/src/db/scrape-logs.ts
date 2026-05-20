import { supabase } from '../utils/supabase';

export async function saveScrapeLog(log: {
  source_id: string;
  articles_found: number;
  articles_saved: number;
  duplicates_skipped: number;
  errors?: string;
}) {
  await supabase.from('scrape_logs').insert(log);
}
