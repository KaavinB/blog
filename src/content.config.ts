import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

/*
 * Pages CMS writes `null` (or an empty string) when an optional image is
 * cleared, so treat those the same as "no image".
 */
const emptyToUndefined = (value: unknown) =>
  value === null || value === '' ? undefined : value;

const posts = defineCollection({
  // Every .md file in src/content/posts becomes an article.
  // The file name becomes the URL: on-reading.md → /writing/on-reading/
  loader: glob({ base: './src/content/posts', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string().min(1),
      date: z.coerce.date(),
      description: z.string().optional(),
      thumbnail: z.preprocess(emptyToUndefined, image().optional()),
      cover: z.preprocess(emptyToUndefined, image().optional()),
      coverAlt: z.string().optional().default(''),
      draft: z.boolean().optional().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/[^_]*.md' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      photo: z.preprocess(emptyToUndefined, image().optional()),
      photoAlt: z.string().optional().default(''),
    }),
});

export const collections = { posts, pages };
