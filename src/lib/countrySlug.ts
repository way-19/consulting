export function normalizeCountrySlug(slug?: string): string {
  // Only allow "georgia" or "global"
  if (!slug || slug === 'global') return 'global';
  return 'georgia';
}
