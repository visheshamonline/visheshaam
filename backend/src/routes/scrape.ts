import { scrapeManorama } from '../scrapers/manorama';
import { scrapeMathrubhumi } from '../scrapers/mathrubhumi';
import { scrapeMediaOne } from '../scrapers/mediaone';
import { scrapeAsianet } from '../scrapers/asianet';
import { saveArticle } from '../db/articles';
import { saveScrapeLog } from '../db/scrape-logs';
import { logger } from '../utils/logger';

const SCRAPERS = [
  { fn: scrapeManorama, id: 'manorama' },
  { fn: scrapeMathrubhumi, id: 'mathrubhumi' },
  { fn: scrapeMediaOne, id: 'mediaone' },
  { fn: scrapeAsianet, id: 'asianet' },
];

export async function runScrape() {
  for (const { fn, id } of SCRAPERS) {
    let found = 0, saved = 0, dupes = 0;
    const errors: string[] = [];
    try {
      const articles = await fn();
      found = articles.length;
      for (const article of articles) {
        if (!article.title || !article.article_url) continue;
        try {
          const result = await saveArticle(article);
          if (result) saved++;
          else dupes++;
        } catch (e: unknown) {
          errors.push(e instanceof Error ? e.message : String(e));
        }
      }
    } catch (e: unknown) {
      errors.push(e instanceof Error ? e.message : String(e));
      logger.error('Scraper failed: ' + id, e);
    }
    await saveScrapeLog({ source_id: id, articles_found: found, articles_saved: saved, duplicates_skipped: dupes, errors: errors.join('; ') || undefined });
    logger.info(id + ': found=' + found + ' saved=' + saved + ' dupes=' + dupes);
  }
}
