import axios from 'axios';
import { parseRSS, getImageFromItem } from '../utils/rss-parser';
import { cleanHtml } from '../utils/clean-html';
import { upsertArticle, logScrape } from '../db/articles';
import { logger } from '../utils/logger';

const RSS_URL = 'https://www.thehindu.com/news/national/kerala/feeder/default.rss';

export async function scrapeTheHindu(sourceId: string): Promise<void> {
  let found = 0, added = 0, dupes = 0;

  try {
    const items = await parseRSS(RSS_URL);
    found = items.length;

    for (const item of items) {
      if (!item.title || !item.link) continue;

      let clean_content = item.contentSnippet ?? '';
      let image_url = getImageFromItem(item);

      try {
        const res = await axios.get(item.link, { timeout: 8000 });
        clean_content = cleanHtml(res.data).substring(0, 5000);
        if (!image_url) {
          const match = res.data.match(/<meta property="og:image" content="([^"]+)"/);
          if (match) image_url = match[1];
        }
      } catch {
        // fallback
      }

      const id = await upsertArticle({
        title: item.title,
        article_url: item.link,
        source_id: sourceId,
        raw_content: item.content ?? '',
        clean_content,
        image_url,
        published_at: item.pubDate,
        language: 'en',
      });

      if (id) added++;
      else dupes++;
    }
  } catch (err) {
    logger.error(`TheHindu scrape failed`, err);
  }

  await logScrape({ source_id: sourceId, articles_found: found, articles_new: added, articles_duplicate: dupes });
  logger.info(`TheHindu: found=${found} new=${added} dupes=${dupes}`);
}
