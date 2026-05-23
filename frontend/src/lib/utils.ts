/** Strip HTML tags from a string */
export function stripHtml(html: string | null | undefined): string {
  if (!html) return '';
  return html
    .replace(/<[^>]*>/g, '')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/** Human-readable relative time */
export function timeAgo(dateStr: string | null | undefined): string {
  if (!dateStr) return '';
  const now = Date.now();
  const then = new Date(dateStr).getTime();
  const diff = Math.max(0, now - then);

  const mins = Math.floor(diff / 60_000);
  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  const days = Math.floor(hrs / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
}

/** Tailwind classes for a category badge */
export function categoryBadgeClass(category: string | null | undefined): string {
  const slug = (category ?? '').toLowerCase().replace(/\s+/g, '-');
  const map: Record<string, string> = {
    politics: 'badge-politics',
    business: 'badge-business',
    crime: 'badge-crime',
    sports: 'badge-sports',
    health: 'badge-health',
    entertainment: 'badge-entertainment',
    education: 'badge-education',
  };
  return map[slug] ?? 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400';
}

/** Fallback gradient for missing images, deterministic by id */
export function placeholderGradient(id: string | number): string {
  const gradients = [
    'from-blue-900 to-blue-700',
    'from-emerald-900 to-teal-700',
    'from-orange-900 to-orange-700',
    'from-purple-900 to-purple-700',
    'from-rose-900 to-rose-700',
    'from-cyan-900 to-cyan-700',
    'from-amber-900 to-yellow-700',
    'from-indigo-900 to-indigo-700',
  ];
  const index = Math.abs(String(id).split('').reduce((a, c) => a + c.charCodeAt(0), 0)) % gradients.length;
  return gradients[index];
}

/** Slugify a category name */
export function slugify(str: string): string {
  return str.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

/** Source initial color (hue based on name) */
export function sourceColor(name: string): string {
  const colors = [
    'bg-blue-500', 'bg-emerald-500', 'bg-orange-500',
    'bg-purple-500', 'bg-rose-500', 'bg-cyan-500',
    'bg-amber-500', 'bg-indigo-500',
  ];
  const index = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % colors.length;
  return colors[index];
}
