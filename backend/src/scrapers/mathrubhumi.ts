import { parseRssFeed, RssItem } from '../utils/rss-parser';
import { cleanHtml, extractFirstImage } from '../utils/clean-html';
import { parseDate } from '../utils/date';

const RSS_URL = 'https://www.mathrubhumi.com/rss/kerala-news.xml';
const SOURCE_ID = 'mathrubhumi';

export interface ScrapedArticle {
  title: string;
  article_url: string;
  raw_content: string;
  clean_content: string;
  image_url: string | null;
  published_at: string;
  source_id: string;
}

export async function scrapeMathrubhumi(): Promise<ScrapedArticle[]> {
  const items = await parseRssFeed(RSS_URL);
  return items.slice(0, 20).map((item: RssItem) => {
    const raw = item.content ?? item.contentSnippet ?? '';
    return {
      title: item.title,
      article_url: item.link,
      raw_content: raw,
      clean_content: cleanHtml(raw),
      image_url: item.enclosure?.url ?? extractFirstImage(raw),
      published_at: parseDate(item.pubDate),
      source_id: SOURCE_ID,
    };
  });
}
