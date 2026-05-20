import { callAi } from '../utils/ai-client';
import { logger } from '../utils/logger';

const CATEGORIES = 'politics,crime,health,education,business,sports,weather,entertainment,technology,general';

export async function categorizeArticle(title: string, content: string): Promise<string[]> {
  const truncated = content.slice(0, 500);
  const prompt = `Categorize this Kerala news article. Choose 1-2 from: ${CATEGORIES}
Reply with comma-separated categories only. No extra text.

Title: ${title}
Content: ${truncated}`;

  const res = await callAi(prompt);
  return res.text
    .toLowerCase()
    .split(',')
    .map(c => c.trim())
    .filter(c => CATEGORIES.split(',').includes(c));
}
