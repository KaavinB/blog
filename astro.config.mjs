import { defineConfig } from 'astro/config';

/*
 * Where the site lives.
 *
 * On GitHub Actions this is worked out automatically from the repository name:
 *   - a repo named  <username>.github.io  →  https://<username>.github.io/
 *   - any other repo, e.g. "blog"         →  https://<username>.github.io/blog/
 *
 * If you use a custom domain, set SITE to it (e.g. 'https://example.com')
 * and BASE to '/'. You also need a public/CNAME file (see README).
 */
const SITE = process.env.SITE_URL || '';
const BASE = process.env.BASE_PATH || '';

function fromGitHub() {
  const repository = process.env.GITHUB_REPOSITORY; // "owner/repo", set by GitHub Actions
  if (!repository) return { site: 'http://localhost:4321', base: '/' };

  const [owner, repo] = repository.split('/');
  const site = `https://${owner.toLowerCase()}.github.io`;
  const isUserSite = repo.toLowerCase() === `${owner.toLowerCase()}.github.io`;
  return { site, base: isUserSite ? '/' : `/${repo}` };
}

const detected = fromGitHub();

export default defineConfig({
  site: SITE || detected.site,
  base: BASE || detected.base,
  trailingSlash: 'always',

  // Images inside articles get resized versions for different screen sizes,
  // so a large photo from a phone isn't sent to every reader at full size.
  image: {
    layout: 'constrained',
    breakpoints: [480, 720, 1080, 1440],
  },

  markdown: {
    shikiConfig: {
      themes: { light: 'min-light', dark: 'min-dark' },
      defaultColor: false,
      wrap: false,
    },
  },
});
