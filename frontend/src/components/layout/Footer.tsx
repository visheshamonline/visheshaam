import Link from 'next/link';

const FOOTER_LINKS = [
  { label: 'About', href: '/about' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Terms', href: '/terms' },
  { label: 'Contact', href: '/contact' },
];

const SOURCES = [
  'Manorama Online',
  'Mathrubhumi',
  'Asianet News',
  'Kerala Kaumudi',
  'Deepika',
  'The Hindu Kerala',
];

export default function Footer() {
  return (
    <footer className="bg-[#1a1a18] text-gray-400 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 pb-8 border-b border-[#2a2927]">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-[10px] font-semibold tracking-[0.2em] text-orange-400 uppercase">
                വിശേഷം
              </span>
              <span className="w-px h-3 bg-gray-600" />
              <span
                className="text-white text-lg font-bold"
                style={{ fontFamily: 'Lora, Georgia, serif' }}
              >
                Vishesham
              </span>
            </div>
            <p className="text-sm leading-relaxed">
              AI-powered Kerala news aggregation. Fresh stories from trusted sources, curated for you.
            </p>
          </div>

          {/* Sources */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
              News Sources
            </h4>
            <ul className="space-y-1">
              {SOURCES.map(s => (
                <li key={s} className="text-sm">
                  {s}
                </li>
              ))}
            </ul>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-xs font-black uppercase tracking-widest text-gray-500 mb-3">
              Pages
            </h4>
            <ul className="space-y-1">
              {FOOTER_LINKS.map(l => (
                <li key={l.href}>
                  <Link
                    href={l.href}
                    className="text-sm hover:text-white transition-colors"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-600">
          <p>© {new Date().getFullYear()} Vishesham. All rights reserved.</p>
          <p className="flex items-center gap-1.5">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-orange-500" />
            AI-curated news. Not responsible for source content.
          </p>
        </div>
      </div>
    </footer>
  );
}
