import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import site from '../data/site.json';
import { getPosts, postUrl, url } from '../lib/utils';

export async function GET(context: APIContext) {
  const posts = await getPosts();
  const siteUrl = new URL(url('/'), context.site);

  return rss({
    title: site.name,
    description: site.description,
    site: siteUrl,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.date,
      description: post.data.description,
      link: new URL(postUrl(post), context.site).href,
    })),
    customData: `<language>${site.language}</language>`,
  });
}
