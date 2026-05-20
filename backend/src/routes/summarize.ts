import { getPendingArticles, updateArticleAi, markAiFailed } from '../db/articles';
import { linkArticleCategories } from '../db/categories';
import { saveAiLog } from '../db/ai-logs';
import { summarizeArticle } from '../ai/summarize';
import { categorizeArticle } from '../ai/categorize';
import { logger } from '../utils/logger';

export async function runSummarize() {
  const articles = await getPendingArticles(20);
  logger.info('Processing ' + articles.length + ' articles');
  for (const article of articles) {
    try {
      const content = article.clean_content ?? '';
      const [summary, categories] = await Promise.all([
        summarizeArticle(article.title, content),
        categorizeArticle(article.title, content),
      ]);
      await updateArticleAi(article.id, summary, categories);
      await linkArticleCategories(article.id, categories);
      await saveAiLog({ article_id: article.id, task: 'summarize', model: 'mistralai/mistral-7b-instruct:free', prompt_tokens: 0, completion_tokens: 0, cost_usd: 0, status: 'success' });
      logger.info('Done: ' + article.title.slice(0, 50));
    } catch (e) {
      await markAiFailed(article.id);
      logger.error('Failed: ' + article.id, e);
    }
  }
}
