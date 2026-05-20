# Vishesham.online

AI-powered Kerala news aggregation platform. Reuters-style editorial UI with AI summaries.

## Tech Stack
- **Frontend**: Next.js 14 App Router + TypeScript + TailwindCSS → Vercel
- **Backend**: Node.js + TypeScript → GitHub Actions (cron)
- **Database**: Supabase PostgreSQL (full-text search, RLS)
- **AI**: OpenRouter API (Mistral 7B free tier)
- **Scraping**: RSS-first with axios + cheerio

## Project Structure
```
vishesham/
├── frontend/          # Next.js app → deploy to Vercel
├── backend/           # Scraper + AI pipeline → runs via GitHub Actions
├── shared/types/      # Shared TypeScript types
├── .github/workflows/ # Cron automation
└── supabase-schema.sql
```

## Setup

### 1. Supabase
1. Create project at supabase.com
2. Run `supabase-schema.sql` in SQL Editor
3. Copy URL + anon key + service role key

### 2. OpenRouter
1. Register at openrouter.ai
2. Get free API key (Mistral 7B is free)

### 3. Backend
```bash
cd backend
cp .env.example .env   # fill in vars
npm install
npm run scrape         # test scraper
npm run summarize      # test AI
```

### 4. Frontend
```bash
cd frontend
cp .env.example .env.local   # fill in vars
npm install
npm run dev
```
Open http://localhost:3000

### 5. Deploy Frontend to Vercel
```bash
cd frontend
npx vercel --prod
# Set env vars in Vercel dashboard
```

### 6. GitHub Actions
In repo Settings → Secrets → Actions, add:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_KEY`
- `OPENROUTER_API_KEY`

Workflows run automatically:
- Scrape: every 15 minutes
- Summarize: every 15 minutes (offset 5 min)
- Cleanup: daily at 2am UTC

## Environment Variables

### backend/.env
```
SUPABASE_URL=
SUPABASE_SERVICE_KEY=
OPENROUTER_API_KEY=
ADMIN_SECRET=
```

### frontend/.env.local
```
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
ADMIN_SECRET=
```

## Adding New Scrapers
1. Create `backend/src/scrapers/newsource.ts`
2. Export `scrapeNewsource()` returning `ScrapedArticle[]`
3. Add to `backend/src/routes/scrape.ts` SCRAPERS array
4. Add source to `supabase-schema.sql` sources table

## Adding Languages (Malayalam)
1. Add `language: 'ml'` to scraped article
2. Use `to_tsvector('simple', ...)` in search for non-English
3. Add language selector to frontend
