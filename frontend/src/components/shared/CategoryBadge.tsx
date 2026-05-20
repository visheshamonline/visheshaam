import Link from 'next/link';

export default function CategoryBadge({ name, slug }: { name: string; slug: string }) {
  return (
    <Link href={`/category/${slug}`} className="inline-block px-2.5 py-0.5 rounded text-xs font-semibold bg-brand-50 dark:bg-brand-500/10 text-brand-600 dark:text-brand-400 hover:bg-brand-100 transition-colors">
      {name}
    </Link>
  );
}
