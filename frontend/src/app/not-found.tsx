import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-32 text-center">
      <p className="text-8xl font-black text-gray-100 dark:text-[#1a1a1a] mb-4">404</p>
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Page not found</h2>
      <p className="text-gray-500 mb-8">The article or page you are looking for does not exist.</p>
      <Link href="/" className="inline-flex items-center px-6 py-3 rounded-xl bg-brand-500 text-white font-semibold hover:bg-brand-600 transition-colors">
        Back to Home
      </Link>
    </div>
  );
}
