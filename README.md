# Blog

My personal blog, at **https://kaavinb.github.io/blog/**.

## Writing a post

**In the browser:** open [Pages CMS](https://app.pagescms.org), choose this repo, go to **Writing → Add an entry**, and save. The site rebuilds within a couple of minutes. Tick **Draft** to save without publishing.

**As a file:** add a Markdown file to `src/content/posts/`. The file name becomes the URL (`on-reading.md` → `/writing/on-reading/`).

```markdown
---
title: On Reading
date: 2026-11-17
description: Optional line shown on the homepage.
thumbnail: ../images/photo.jpg   # optional
cover: ../images/photo.jpg       # optional
coverAlt: What the cover shows
draft: false
---

Text starts here.
```

Images go in `src/content/images/` and are referenced as `../images/name.jpg`. A line of *italics* directly under an image becomes its caption. Use JPG, PNG, WebP or AVIF; iPhone HEIC photos need exporting as JPEG first.

## Where things live

| | |
| --- | --- |
| Posts | `src/content/posts/` |
| Images | `src/content/images/` |
| About page | `src/content/pages/about.md` |
| Name, intro, site description | `src/data/site.json` |
| Colours, fonts, typography | `src/styles/global.css` |
| Pages CMS settings | `.pages.yml` |

The `demo-` posts are drafts that never appear on the site. Delete them when you no longer need them.

## Running locally

```sh
npm install
npm run dev      # http://localhost:4321 (drafts are shown here)
```

Every push to `main` deploys through `.github/workflows/deploy.yml`.
