import dotenv from 'dotenv';
dotenv.config();

import { getPendingArticles, updateArticleAI, setCategoryOnArticle, logAI } from './db/articles';
import { summarizeArticle, categorizeArticle } from './utils/ai-client';
import { logger } from './utils/logger';
import { supabase } from './utils/supabase';

async function main() {
  logger.info('Starting AI pipeline');
  const articles = await getPendingArticles(20);
  logger.info(`Processing ${articles.length} articles`);

  for (const article of articles) {
    // Mark as processing
    await supabase
      .from('articles')
      .update({ ai_processing_status: 'processing' })
      .eq('id', article.id);

    try {
      const content = article.clean_content ?? article.raw_content ?? '';

      // Summarize
      const summary = await summarizeArticle(article.title, content);

      // Categorize
      const category = await categorizeArticle(article.title, summary);

      await updateArticleAI(article.id, summary, 'done');
      await setCategoryOnArticle(article.id, category.toLowerCase());

      await logAI({
        article_id: article.id,
        task: 'summarize+categorize',
        prompt_tokens: 0, // approximate
        completion_tokens: 0,
        model: 'mistralai/mistral-7b-instruct:free',
        status: 'done',
      });

      logger.info(`Processed: ${article.title.substring(0, 50)}`);
      await new Promise(r => setTimeout(r, 1000)); // rate limit
    } catch (err) {
      logger.error(`AI failed for ${article.id}`, err);
      await updateArticleAI(article.id, '', 'failed');
      await logAI({
        article_id: article.id,
        task: 'summarize+categorize',
        prompt_tokens: 0,
        completion_tokens: 0,
        model: 'mistralai/mistral-7b-instruct:free',
        status: 'failed',
      });
    }
  }

  logger.info('AI pipeline complete');
}

main().catch(err => {
  logger.error('Fatal AI error', err);
  process.exit(1);
});
