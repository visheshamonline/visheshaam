'use client';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Search, Sun, Moon, Menu, X } from 'lucide-react';
import { cn } from '@/lib/cn';

const CATEGORIES = [
  { name: 'Politics', slug: 'politics' },
  { name: 'Business', slug: 'business' },
  { name: 'Crime', slug: 'crime' },
  { name: 'Health', slug: 'health' },
  { name: 'Sports', slug: 'sports' },
  { name: 'Technology', slug: 'technology' },
];

export default function Navbar() {
  const [dark, setDark] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') { setDark(true); document.documentElement.classList.add('dark'); }
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    setDark(d => {
      const next = !d;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('theme', next ? 'dark' : 'light');
      return next;
    });
  };

  return (
    <header className={cn('fixed top-0 inset-x-0 z-50 transition-all duration-200', scrolled ? 'bg-white/95 dark:bg-[#0f0f0f]/95 backdrop-blur border-b border-gray-200 dark:border-[#2a2a2a]' : 'bg-white dark:bg-[#0f0f0f]')}>
      <div className="max-w-7xl mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-14 border-b border-gray-100 dark:border-[#222]">
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Vishe<span className="text-brand-500">sham</span>
            </span>
            <span className="text-[10px] font-semibold text-brand-500 uppercase tracking-widest mt-1 hidden sm:block">.online</span>
          </Link>

          <div className="flex items-center gap-3">
            <Link href="/search" className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors">
              <Search size={18} className="text-gray-600 dark:text-gray-400" />
            </Link>
            <button onClick={toggleTheme} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a] transition-colors">
              {dark ? <Sun size={18} className="text-gray-400" /> : <Moon size={18} className="text-gray-600" />}
            </button>
            <button onClick={() => setMenuOpen(o => !o)} className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-[#1a1a1a]">
              {menuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Category nav */}
        <nav className={cn('hidden sm:flex items-center gap-1 h-10 overflow-x-auto')}>
          {CATEGORIES.map(cat => (
            <Link key={cat.slug} href={`/category/${cat.slug}`} className="px-3 py-1 text-sm font-medium text-gray-600 dark:text-gray-400 hover:text-brand-500 dark:hover:text-brand-400 whitespace-nowrap transition-colors">
              {cat.name}
            </Link>
          ))}
        </nav>

        {/* Mobile menu */}
        {menuOpen && (
          <div className="sm:hidden py-2 border-t border-gray-100 dark:border-[#222]">
            {CATEGORIES.map(cat => (
              <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)} className="block px-2 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-brand-500">
                {cat.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
