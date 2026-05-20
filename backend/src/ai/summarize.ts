import { callAi } from '../utils/ai-client';
import { logger } from '../utils/logger';

export async function summarizeArticle(title: string, content: string): Promise<string> {
  const truncated = content.slice(0, 1000);
  const prompt = `Summarize this Kerala news article in 2-3 sentences. Be concise and factual.

Title: ${title}
Content: ${truncated}

Summary:`;

  const res = await callAi(prompt);
  logger.info('Summarized', { tokens: res.prompt_tokens + res.completion_tokens });
  return res.text;
}
