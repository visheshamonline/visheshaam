import { supabase } from '../utils/supabase';
import { logger } from '../utils/logger';

export async function runCleanup() {
  const cutoff = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString();
  const { count } = await supabase
    .from('articles')
    .delete({ count: 'exact' })
    .lt('created_at', cutoff)
    .eq('ai_processing_status', 'failed');
  logger.info('Cleanup removed ' + (count ?? 0) + ' stale articles');
}
