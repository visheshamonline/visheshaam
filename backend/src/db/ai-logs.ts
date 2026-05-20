import { supabase } from '../utils/supabase';

export async function saveAiLog(log: {
  article_id: string;
  task: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number;
  status: 'success' | 'failed';
}) {
  await supabase.from('ai_logs').insert(log);
}
