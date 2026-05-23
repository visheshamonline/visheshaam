'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const CATEGORIES = [
  { label: 'Top Stories', slug: '' },
  { label: 'Politics', slug: 'politics' },
  { label: 'Business', slug: 'business' },
  { label: 'Crime', slug: 'crime' },
  { label: 'Sports', slug: 'sports' },
  { label: 'Health', slug: 'health' },
  { label: 'Technology', slug: 'technology' },
  { label: 'Entertainment', slug: 'entertainment' },
  { label: 'Education', slug: 'education' },
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [lang, setLang] = useState<'EN' | 'ML'>('EN');
  const searchRef = useRef<HTMLInputElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  /* Sync dark state from DOM on mount */
  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggleDark() {
    const next = !dark;
    setDark(next);
    if (next) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }

  function openSearch() {
    setSearchOpen(true);
    setTimeout(() => searchRef.current?.focus(), 50);
  }

  function handleSearchSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  }

  function activeCategory(): string {
    if (pathname === '/') return '';
    const match = pathname.match(/^\/category\/([^/]+)/);
    return match ? match[1] : '';
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 shadow-sm">
      {/* Row 1 — dark bar */}
      <div className="bg-[#1a1a18] text-white">
        <div className="max-w-7xl mx-auto px-4 h-12 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <span className="text-[10px] font-semibold tracking-[0.2em] text-orange-400 uppercase">
              വിശേഷം
            </span>
            <span className="w-px h-4 bg-gray-600" />
            <span
              className="text-lg font-bold tracking-tight"
              style={{ fontFamily: 'Lora, Georgia, serif' }}
            >
              Vishesham
            </span>
          </Link>

          {/* Right side controls */}
          <div className="flex items-center gap-2">
            {/* Search */}
            {searchOpen ? (
              <form onSubmit={handleSearchSubmit} className="flex items-center">
                <input
                  ref={searchRef}
                  type="text"
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onBlur={() => !searchQuery && setSearchOpen(false)}
                  placeholder="Search news…"
                  className="bg-[#2a2a28] text-white placeholder-gray-500 text-sm px-3 py-1.5 rounded-l outline-none border border-[#3a3a38] w-48 sm:w-64"
                />
                <button
                  type="submit"
                  className="bg-orange-500 hover:bg-orange-600 transition-colors px-3 py-1.5 rounded-r"
                  aria-label="Search"
                >
                  <SearchIcon />
                </button>
              </form>
            ) : (
              <button
                onClick={openSearch}
                className="p-1.5 hover:text-orange-400 transition-colors"
                aria-label="Open search"
              >
                <SearchIcon />
              </button>
            )}

            {/* Language toggle */}
            <button
              onClick={() => setLang(l => (l === 'EN' ? 'ML' : 'EN'))}
              className="text-xs font-semibold tracking-widest px-2 py-1 rounded border border-gray-600 hover:border-orange-400 hover:text-orange-400 transition-colors"
            >
              {lang}
            </button>

            {/* Dark mode toggle */}
            <button
              onClick={toggleDark}
              className="p-1.5 hover:text-orange-400 transition-colors"
              aria-label="Toggle dark mode"
            >
              {dark ? <SunIcon /> : <MoonIcon />}
            </button>
          </div>
        </div>
      </div>

      {/* Row 2 — category tabs */}
      <div className="bg-white dark:bg-[#1c1b1a] border-b border-[#e7e5e4] dark:border-[#2a2927]">
        <div className="max-w-7xl mx-auto px-4">
          <nav
            className="flex overflow-x-auto hide-scrollbar gap-0"
            aria-label="Category navigation"
          >
            {CATEGORIES.map(cat => {
              const href = cat.slug ? `/category/${cat.slug}` : '/';
              const isActive = activeCategory() === cat.slug;
              return (
                <Link
                  key={cat.slug}
                  href={href}
                  className={`shrink-0 text-xs font-semibold tracking-wide px-4 py-3 transition-colors whitespace-nowrap ${
                    isActive ? 'tab-active' : 'tab-inactive'
                  }`}
                >
                  {cat.label}
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </header>
  );
}

function SearchIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
    </svg>
  );
}

function SunIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="5" />
      <line x1="12" y1="1" x2="12" y2="3" />
      <line x1="12" y1="21" x2="12" y2="23" />
      <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
      <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
      <line x1="1" y1="12" x2="3" y2="12" />
      <line x1="21" y1="12" x2="23" y2="12" />
      <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
      <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
    </svg>
  );
}
