# Blog

A small personal blog built with [Astro](https://astro.build), published on GitHub Pages, and editable in the browser with [Pages CMS](https://pagescms.org).

```
src/
  content/
    posts/         ← one Markdown file per article
    images/        ← every uploaded image (thumbnails, covers, images in articles)
    pages/about.md ← the About page
  data/site.json   ← your name, homepage introduction, site description
  styles/global.css← colours, fonts, article typography
  components/      ← header, footer, article list
  pages/           ← routes: home, /writing/<name>/, /about/, /rss.xml, 404
.pages.yml         ← Pages CMS configuration
.github/workflows/deploy.yml ← builds and publishes on every push to main
```

## First-time setup

You need Node 22.12 or newer to run the site locally. You don't need Node to publish through Pages CMS.

1. **Create a repository on GitHub.** The name sets the address:
   - `<your-username>.github.io` → `https://<your-username>.github.io/`
   - any other name, e.g. `blog` → `https://<your-username>.github.io/blog/`

   Both work without changes. The build reads the repository name and sets the paths itself (see `astro.config.mjs`).

2. **Push this folder to it:**
   ```sh
   git add -A
   git commit -m "Initial commit"
   git remote add origin https://github.com/<your-username>/<repo-name>.git
   git push -u origin main
   ```

3. **Turn on GitHub Pages:** in the repository, go to *Settings → Pages → Build and deployment → Source* and choose **GitHub Actions**.

4. **Deploy:** go to the *Actions* tab. The "Deploy to GitHub Pages" workflow runs on every push to `main`. If the first run happened before step 3, open it and click *Re-run all jobs*. When it finishes, the site's address appears on the run page and under *Settings → Pages*.

5. **Connect Pages CMS:**
   1. Go to [app.pagescms.org](https://app.pagescms.org) and sign in with GitHub.
   2. When asked, install the Pages CMS GitHub App. Give it access to this repository (choosing "Only select repositories" is fine).
   3. Open the repository in Pages CMS. It reads `.pages.yml` and shows three sections: **Writing**, **About page** and **Site settings**.

## Before you publish anything

The three posts starting with `demo-` are **drafts**. Drafts never appear on the live site, so the homepage shows "Nothing here yet." until you publish something. They're only there to show you the layout when you run the site locally. Delete them whenever you like:

- `src/content/posts/demo-*.md`
- `src/content/images/demo-*.jpg`

Then fill in the About page. It contains only placeholder text.

## Publishing an article

### With Pages CMS (in the browser)

1. Open **Writing** and click **Add an entry**.
2. Fill in the title and date. The short description, thumbnail and cover image are optional.
3. Write or paste the article into the editor. Use the editor's image button to upload images into the text.
4. Leave **Draft** unchecked and click **Save**.

Saving commits the file to GitHub. That starts the deploy workflow, and the article goes live in a minute or two. The file name (and so the URL) is taken from the title when the post is created, e.g. "On Changing Your Mind" → `/writing/on-changing-your-mind/`. To save something without publishing it, check **Draft**.

### Without Pages CMS

Create a file in `src/content/posts/`, e.g. `on-changing-your-mind.md`. You can do this on GitHub with *Add file → Create new file*, or in any editor:

```markdown
---
title: On Changing Your Mind
date: 2026-11-17
description: A short reflection on uncertainty.   # optional
thumbnail: ../images/my-photo.jpg                # optional
cover: ../images/my-photo.jpg                    # optional
coverAlt: Describe the cover image               # optional
draft: false                                     # optional, defaults to false
---

The article starts here, written in Markdown.
```

Put images in `src/content/images/` and refer to them as `../images/name.jpg`, both in the frontmatter and in the text (`![Description](../images/name.jpg)`). Commit and push to `main`, and the site rebuilds itself.

To preview locally: `npm install`, then `npm run dev`, then open http://localhost:4321. Drafts are visible locally and marked "Draft".

### Notes on writing

- **Captions:** write a line in *italics* directly under an image:
  ```markdown
  ![A street in the rain](../images/street.jpg)
  *Taken from the bus window, March.*
  ```
- **Image formats:** JPG, PNG, WebP and AVIF. iPhone HEIC photos need converting first. Exporting or sharing them as JPEG usually does this. Large photos are fine: they're resized automatically.
- **Alt text:** the text in `![…]` describes the image for screen readers. Thumbnails on the homepage are treated as decorative, so they don't need one.
- Headings (`##`), lists, quotes (`>`), links, code blocks, tables, footnotes (`[^1]`) and section breaks (`---`) all work. Start the article with ordinary paragraphs, not a heading, because the title is already shown.

## Changing things

| What | Where |
| --- | --- |
| Your name, homepage introduction, site description | Pages CMS → **Site settings**, or `src/data/site.json` |
| About page text and photo | Pages CMS → **About page**, or `src/content/pages/about.md` |
| Colours (light and dark) | the variables at the top of `src/styles/global.css` |
| Fonts | `--serif` and `--sans` in `src/styles/global.css` |
| Line length | `--measure` in `src/styles/global.css` |
| Article typography (headings, quotes, images, code) | the `.prose` rules in `src/styles/global.css` |
| The article list (thumbnail size, spacing) | `src/components/PostList.astro` |
| Header and footer | `src/components/Header.astro`, `src/components/Footer.astro` |
| Favicon | `public/favicon.svg` |
| Date format | `formatDate` in `src/lib/utils.ts` |

The site follows the reader's light or dark system setting. There is no toggle.

## Using a custom domain

1. Add a file `public/CNAME` containing just the domain, e.g. `example.com`.
2. In `.github/workflows/deploy.yml`, add environment variables to the build step:
   ```yaml
      - name: Build with Astro
        uses: withastro/action@v6
        with:
          node-version: 24
        env:
          SITE_URL: https://example.com
          BASE_PATH: /
   ```
3. Set the domain under *Settings → Pages → Custom domain*, and configure DNS as [GitHub describes](https://docs.github.com/en/pages/configuring-a-custom-domain-for-your-github-pages-site).

## Why the images live in `src/content/images`

Uploaded images are referenced with relative paths (`../images/…`), not `/images/…`. That lets Astro resize and compress them, and it means their URLs are always correct, whether the site is at `username.github.io/` or `username.github.io/blog/`. `.pages.yml` sets this up with `input: src/content/images` and `output: ../images`. If you move the posts folder, keep the two folders side by side.

## Commands

| Command | |
| --- | --- |
| `npm install` | install dependencies |
| `npm run dev` | local preview at http://localhost:4321 (shows drafts) |
| `npm run build` | build the site into `dist/` |
| `npm run preview` | serve the built site locally |
