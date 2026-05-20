import * as cheerio from 'cheerio';

export function cleanHtml(html: string): string {
  const $ = cheerio.load(html);
  $('script, style, nav, footer, header, aside, .ad, .advertisement, iframe').remove();
  return $('body').text().replace(/\s+/g, ' ').trim();
}

export function extractFirstImage(html: string): string | null {
  const $ = cheerio.load(html);
  const img = $('img').first().attr('src');
  return img || null;
}
