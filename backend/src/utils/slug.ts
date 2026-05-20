export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 100)
    .trim();
}

export function uniqueSlug(base: string, suffix: string): string {
  return `${slugify(base)}-${suffix.slice(0, 8)}`;
}
