import { execFileSync } from 'node:child_process';
import { getCollection, type CollectionEntry } from 'astro:content';
import site from '../data/site.json';

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

/**
 * Format a date like "17 November 2026".
 * Post dates are plain calendar dates, so they're read as UTC. Edit times are
 * real moments, so they're shown in your timezone (set in src/data/site.json).
 */
export function formatDate(date: Date, timeZone = 'UTC'): string {
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone,
  });
}

/** "YYYY-MM-DD" for a date in the given timezone (for <time datetime>). */
export function isoDay(date: Date, timeZone = 'UTC'): string {
  return date.toLocaleDateString('en-CA', { timeZone });
}

/** The timezone from site.json, or UTC if it's missing or not a real timezone. */
export const siteTimeZone = (() => {
  try {
    new Intl.DateTimeFormat('en', { timeZone: site.timezone });
    return site.timezone || 'UTC';
  } catch {
    return 'UTC';
  }
})();

/**
 * When a post was last changed, taken from the repository's history, so it
 * updates by itself whenever you save the post (in Pages CMS or anywhere else).
 * Returns undefined if the post was last edited on its own date, or if the
 * file hasn't been committed yet.
 */
export function lastEdited(post: CollectionEntry<'posts'>): Date | undefined {
  if (!post.filePath) return undefined;
  let edited: Date;
  try {
    const out = execFileSync('git', ['log', '-1', '--format=%cI', '--', post.filePath], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    }).trim();
    if (!out) return undefined;
    edited = new Date(out);
  } catch {
    return undefined;
  }
  const editedDay = isoDay(edited, siteTimeZone);
  const postDay = isoDay(post.data.date);
  return editedDay > postDay ? edited : undefined;
}
