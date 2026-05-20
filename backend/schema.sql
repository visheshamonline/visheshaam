-- Vishesham.online Database Schema
-- Run in Supabase SQL Editor

-- Enable extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";

-- Sources
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  url TEXT NOT NULL,
  rss_url TEXT NOT NULL,
  logo_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Categories
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Articles
CREATE TABLE articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  summary TEXT,
  raw_content TEXT,
  clean_content TEXT,
  image_url TEXT,
  article_url TEXT NOT NULL UNIQUE,
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  content_hash TEXT NOT NULL UNIQUE,
  language TEXT DEFAULT 'en' CHECK (language IN ('en', 'ml')),
  status TEXT DEFAULT 'published' CHECK (status IN ('draft', 'published', 'archived')),
  ai_processing_status TEXT DEFAULT 'pending' CHECK (ai_processing_status IN ('pending', 'processing', 'done', 'failed')),
  is_summarized BOOLEAN DEFAULT false,
  is_categorized BOOLEAN DEFAULT false,
  published_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  -- Full text search
  search_vector TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', coalesce(title, '') || ' ' || coalesce(summary, '') || ' ' || coalesce(clean_content, ''))
  ) STORED
);

-- Article <-> Category (many-to-many)
CREATE TABLE article_categories (
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- AI Logs
CREATE TABLE ai_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  article_id UUID REFERENCES articles(id) ON DELETE CASCADE,
  task TEXT NOT NULL,
  prompt_tokens INTEGER DEFAULT 0,
  completion_tokens INTEGER DEFAULT 0,
  model TEXT NOT NULL,
  status TEXT DEFAULT 'done' CHECK (status IN ('pending', 'processing', 'done', 'failed')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Scrape Logs
CREATE TABLE scrape_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id) ON DELETE SET NULL,
  articles_found INTEGER DEFAULT 0,
  articles_new INTEGER DEFAULT 0,
  articles_duplicate INTEGER DEFAULT 0,
  errors TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX idx_articles_status ON articles(status);
CREATE INDEX idx_articles_ai_status ON articles(ai_processing_status);
CREATE INDEX idx_articles_source_id ON articles(source_id);
CREATE INDEX idx_articles_search ON articles USING GIN(search_vector);
CREATE INDEX idx_articles_slug ON articles(slug);
CREATE INDEX idx_article_categories_article ON article_categories(article_id);
CREATE INDEX idx_article_categories_category ON article_categories(category_id);
CREATE INDEX idx_scrape_logs_created ON scrape_logs(created_at DESC);

-- Seed sources
INSERT INTO sources (name, url, rss_url, is_active) VALUES
  ('Manorama Online', 'https://www.manoramaonline.com', 'https://www.manoramaonline.com/news/kerala.rss-feeds.news-kerala.xml', true),
  ('Mathrubhumi', 'https://www.mathrubhumi.com', 'https://www.mathrubhumi.com/rss/news/kerala-news.xml', true),
  ('The Hindu Kerala', 'https://www.thehindu.com', 'https://www.thehindu.com/news/national/kerala/feeder/default.rss', true),
  ('Deccan Chronicle Kerala', 'https://www.deccanchronicle.com', 'https://www.deccanchronicle.com/rss_feed/kerala.xml', true),
  ('MediaOne', 'https://mediaone.tv', 'https://mediaone.tv/rss', true);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('Politics', 'politics', 'Political news from Kerala'),
  ('Crime', 'crime', 'Crime and law enforcement news'),
  ('Business', 'business', 'Business and economy news'),
  ('Sports', 'sports', 'Sports news and updates'),
  ('Entertainment', 'entertainment', 'Entertainment and culture news'),
  ('Technology', 'technology', 'Technology and innovation news'),
  ('Health', 'health', 'Health and medical news'),
  ('Education', 'education', 'Education news'),
  ('Environment', 'environment', 'Environment and climate news'),
  ('National', 'national', 'National news affecting Kerala');

-- RLS: Public read access
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (is_active = true);

-- Service role bypass (for backend)
CREATE POLICY "Service full access articles" ON articles USING (auth.role() = 'service_role');
CREATE POLICY "Service full access categories" ON categories USING (auth.role() = 'service_role');
CREATE POLICY "Service full access sources" ON sources USING (auth.role() = 'service_role');
