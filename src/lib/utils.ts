import { getCollection, type CollectionEntry } from 'astro:content';

/**
 * Prefix an internal path with the site's base, so links work both on
 * username.github.io and on username.github.io/repo-name/.
 *   url('/about/') → '/about/'  or  '/blog/about/'
 */
export function url(path = '/'): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `${base}${clean}`;
}

export const postUrl = (post: CollectionEntry<'posts'>) => url(`/writing/${post.id}/`);

/** Published posts, newest first. Drafts are visible only in `npm run dev`. */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export function formatDate(date: Date, style: 'long' | 'month' = 'long'): string {
  return date.toLocaleDateString('en-GB', {
    day: style === 'long' ? 'numeric' : undefined,
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  });
}
