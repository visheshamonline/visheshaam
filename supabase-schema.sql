-- ============================================
-- Vishesham.online – Supabase Schema
-- Run this in Supabase SQL Editor
-- ============================================

-- Enable pg_trgm for fuzzy search
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- ============================================
-- SOURCES
-- ============================================
CREATE TABLE IF NOT EXISTS sources (
  id          TEXT PRIMARY KEY,
  name        TEXT NOT NULL,
  url         TEXT NOT NULL,
  rss_url     TEXT NOT NULL,
  logo_url    TEXT,
  is_active   BOOLEAN DEFAULT true,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO sources (id, name, url, rss_url) VALUES
  ('manorama', 'Manorama Online', 'https://www.manoramaonline.com', 'https://www.manoramaonline.com/news/kerala.rss.xml'),
  ('mathrubhumi', 'Mathrubhumi', 'https://www.mathrubhumi.com', 'https://www.mathrubhumi.com/rss/kerala-news.xml'),
  ('mediaone', 'Media One', 'https://mediaone.tv', 'https://mediaone.tv/rss.xml'),
  ('asianet', 'Asianet News', 'https://asianetnews.com', 'https://asianetnews.com/rss/kerala-news')
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- CATEGORIES
-- ============================================
CREATE TABLE IF NOT EXISTS categories (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  slug        TEXT NOT NULL UNIQUE,
  description TEXT,
  created_at  TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO categories (name, slug) VALUES
  ('Politics', 'politics'),
  ('Crime', 'crime'),
  ('Health', 'health'),
  ('Education', 'education'),
  ('Business', 'business'),
  ('Sports', 'sports'),
  ('Weather', 'weather'),
  ('Entertainment', 'entertainment'),
  ('Technology', 'technology'),
  ('General', 'general')
ON CONFLICT (slug) DO NOTHING;

-- ============================================
-- ARTICLES
-- ============================================
CREATE TABLE IF NOT EXISTS articles (
  id                    UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title                 TEXT NOT NULL,
  slug                  TEXT NOT NULL UNIQUE,
  summary               TEXT,
  raw_content           TEXT,
  clean_content         TEXT,
  image_url             TEXT,
  article_url           TEXT NOT NULL UNIQUE,
  source_id             TEXT NOT NULL REFERENCES sources(id),
  content_hash          TEXT NOT NULL UNIQUE,
  language              TEXT DEFAULT 'en',
  status                TEXT DEFAULT 'published' CHECK (status IN ('draft','published','archived')),
  ai_processing_status  TEXT DEFAULT 'pending' CHECK (ai_processing_status IN ('pending','processing','done','failed')),
  is_summarized         BOOLEAN DEFAULT false,
  is_categorized        BOOLEAN DEFAULT false,
  published_at          TIMESTAMPTZ,
  created_at            TIMESTAMPTZ DEFAULT NOW(),

  -- Full-text search vector
  search_vector         TSVECTOR GENERATED ALWAYS AS (
    to_tsvector('english', COALESCE(title, '') || ' ' || COALESCE(summary, '') || ' ' || COALESCE(clean_content, ''))
  ) STORED
);

-- ============================================
-- ARTICLE CATEGORIES (many-to-many)
-- ============================================
CREATE TABLE IF NOT EXISTS article_categories (
  article_id  UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  PRIMARY KEY (article_id, category_id)
);

-- ============================================
-- AI LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS ai_logs (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  article_id        UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
  task              TEXT NOT NULL,
  model             TEXT NOT NULL,
  prompt_tokens     INT DEFAULT 0,
  completion_tokens INT DEFAULT 0,
  cost_usd          NUMERIC(10,6) DEFAULT 0,
  status            TEXT DEFAULT 'success',
  created_at        TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- SCRAPE LOGS
-- ============================================
CREATE TABLE IF NOT EXISTS scrape_logs (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_id           TEXT NOT NULL REFERENCES sources(id),
  articles_found      INT DEFAULT 0,
  articles_saved      INT DEFAULT 0,
  duplicates_skipped  INT DEFAULT 0,
  errors              TEXT,
  created_at          TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_source_id ON articles(source_id);
CREATE INDEX IF NOT EXISTS idx_articles_ai_status ON articles(ai_processing_status);
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING GIN(search_vector);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_article_categories_cat ON article_categories(category_id);

-- ============================================
-- ROW LEVEL SECURITY (read-only public)
-- ============================================
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE sources ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE scrape_logs ENABLE ROW LEVEL SECURITY;

-- Public can read published articles
CREATE POLICY "Public read articles" ON articles FOR SELECT USING (status = 'published');
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read sources" ON sources FOR SELECT USING (is_active = true);
CREATE POLICY "Public read article_categories" ON article_categories FOR SELECT USING (true);

-- Service role can write (backend uses service key)
CREATE POLICY "Service write articles" ON articles FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write ai_logs" ON ai_logs FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service write scrape_logs" ON scrape_logs FOR ALL USING (auth.role() = 'service_role');
