import Parser from 'rss-parser';

const parser = new Parser({
  timeout: 10000,
  headers: { 'User-Agent': 'Vishesham/1.0 (+https://vishesham.online)' },
});

export interface RssItem {
  title: string;
  link: string;
  pubDate?: string;
  content?: string;
  contentSnippet?: string;
  enclosure?: { url?: string };
}

export async function parseRssFeed(url: string): Promise<RssItem[]> {
  const feed = await parser.parseURL(url);
  return feed.items.map((item) => ({
    title: item.title ?? '',
    link: item.link ?? '',
    pubDate: item.pubDate,
    content: item.content ?? item['content:encoded'] ?? '',
    contentSnippet: item.contentSnippet ?? '',
    enclosure: item.enclosure,
  }));
}
