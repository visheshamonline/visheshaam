import dotenv from 'dotenv';
dotenv.config();

import { runScrape } from './routes/scrape';
import { runSummarize } from './routes/summarize';
import { runCleanup } from './routes/cleanup';
import { ensureCategories } from './db/categories';
import { logger } from './utils/logger';

const command = process.argv[2];

async function main() {
  await ensureCategories();

  switch (command) {
    case 'scrape':
      await runScrape();
      break;
    case 'summarize':
      await runSummarize();
      break;
    case 'cleanup':
      await runCleanup();
      break;
    default:
      logger.error('Unknown command: ' + command);
      process.exit(1);
  }

  logger.info('Done: ' + command);
  process.exit(0);
}

main().catch((e) => {
  logger.error('Fatal error', e);
  process.exit(1);
});
