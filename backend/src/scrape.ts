import dotenv from 'dotenv';
dotenv.config();

import { getActiveSources } from './db/articles';
import { scrapeManorama } from './scrapers/manorama';
import { scrapeMathrubhumi } from './scrapers/mathrubhumi';
import { scrapeTheHindu } from './scrapers/thehindu';
import { scrapeMediaOne } from './scrapers/mediaone';
import { logger } from './utils/logger';

const SCRAPERS: Record<string, (id: string) => Promise<void>> = {
  'Manorama Online': scrapeManorama,
  'Mathrubhumi': scrapeMathrubhumi,
  'The Hindu Kerala': scrapeTheHindu,
  'MediaOne': scrapeMediaOne,
};

async function main() {
  logger.info('Starting scrape run');
  const sources = await getActiveSources();

  for (const source of sources) {
    const scraper = SCRAPERS[source.name];
    if (!scraper) {
      logger.warn(`No scraper for: ${source.name}`);
      continue;
    }
    logger.info(`Scraping: ${source.name}`);
    await scraper(source.id);
    await new Promise(r => setTimeout(r, 2000)); // polite delay
  }

  logger.info('Scrape run complete');
}

main().catch(err => {
  logger.error('Fatal scrape error', err);
  process.exit(1);
});
