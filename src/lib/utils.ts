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

/**
 * Published posts, newest first, by their posting date. Posts with the same
 * date are ordered by when each was created, newest first.
 * Drafts are visible only in `npm run dev`.
 */
export async function getPosts() {
  const posts = await getCollection('posts', ({ data }) => import.meta.env.DEV || !data.draft);
  return posts.sort(
    (a, b) =>
      b.data.date.valueOf() - a.data.date.valueOf() ||
      createdAt(b).valueOf() - createdAt(a).valueOf(),
  );
}

/** Run a git command and return its output, or '' if git isn't available. */
const gitCache = new Map<string, string>();
function git(...args: string[]): string {
  const key = args.join('\0');
  if (!gitCache.has(key)) {
    let out = '';
    try {
      out = execFileSync('git', args, { encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] }).trim();
    } catch {}
    gitCache.set(key, out);
  }
  return gitCache.get(key)!;
}

/** When a post's file was first added to the repository (now, if not yet committed). */
function createdAt(post: CollectionEntry<'posts'>): Date {
  if (!post.filePath) return new Date();
  const added = git('log', '--diff-filter=A', '--format=%cI', '--', post.filePath).split('\n').pop();
  return added ? new Date(added) : new Date();
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

/**
 * Your GoatCounter code (the "xyz" in xyz.goatcounter.com), from site.json.
 * Empty means view counting is switched off.
 */
export const goatcounter = /^[a-z0-9-]+$/i.test(site.goatcounter ?? '') ? site.goatcounter : '';

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
  const out = git('log', '-1', '--format=%cI', '--', post.filePath);
  if (!out) return undefined;
  const edited = new Date(out);
  const editedDay = isoDay(edited, siteTimeZone);
  const postDay = isoDay(post.data.date);
  return editedDay > postDay ? edited : undefined;
}
