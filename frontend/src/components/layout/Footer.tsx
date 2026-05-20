import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-[#2a2a2a] mt-16 py-10 bg-white dark:bg-[#0f0f0f]">
      <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <span className="text-lg font-black text-gray-900 dark:text-white">Vishe<span className="text-brand-500">sham</span><span className="text-brand-500">.online</span></span>
          <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">Kerala's AI-powered news aggregator</p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs text-gray-500">
          <Link href="/category/politics" className="hover:text-brand-500 transition-colors">Politics</Link>
          <Link href="/category/business" className="hover:text-brand-500 transition-colors">Business</Link>
          <Link href="/category/sports" className="hover:text-brand-500 transition-colors">Sports</Link>
          <Link href="/search" className="hover:text-brand-500 transition-colors">Search</Link>
          <Link href="/sitemap.xml" className="hover:text-brand-500 transition-colors">Sitemap</Link>
        </div>
        <p className="text-xs text-gray-400">© {new Date().getFullYear()} Vishesham</p>
      </div>
    </footer>
  );
}
