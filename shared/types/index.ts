export interface Article {
  id: string;
  title: string;
  slug: string;
  summary: string | null;
  raw_content: string | null;
  clean_content: string | null;
  image_url: string | null;
  article_url: string;
  source_id: string;
  content_hash: string;
  language: string;
  status: 'draft' | 'published' | 'archived';
  ai_processing_status: 'pending' | 'processing' | 'done' | 'failed';
  is_summarized: boolean;
  is_categorized: boolean;
  published_at: string | null;
  created_at: string;
  source?: Source;
  categories?: Category[];
}

export interface Source {
  id: string;
  name: string;
  url: string;
  rss_url: string;
  logo_url: string | null;
  is_active: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  created_at: string;
}

export interface ArticleCategory {
  article_id: string;
  category_id: string;
}

export interface AiLog {
  id: string;
  article_id: string;
  task: 'summarize' | 'categorize' | 'cleanup';
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  cost_usd: number;
  status: 'success' | 'failed';
  created_at: string;
}

export interface ScrapeLog {
  id: string;
  source_id: string;
  articles_found: number;
  articles_saved: number;
  duplicates_skipped: number;
  errors: string | null;
  created_at: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  per_page: number;
  has_more: boolean;
}
