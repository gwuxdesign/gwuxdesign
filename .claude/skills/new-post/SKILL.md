---
name: new-post
description: Scaffold a new blog post — adds the metadata entry to assets/data/posts.json and creates the matching Markdown file in posts/. User-invoked only.
disable-model-invocation: true
---

# New blog post

A blog post is two files kept in sync by hand — there's no build step to catch a mismatch:
1. An entry in `assets/data/posts.json` — `slug`, `title`, `date`, `summary`, `image`, `file`
2. A Markdown file at `posts/<slug>.md` — the post body, referenced by the `file` field above

If `file` doesn't exactly match the Markdown filename (including extension), the post fails silently at runtime: the page just shows "Unable to load this post right now." with no other symptom.

## Steps

1. Ask for: title, a one-sentence summary, and (optional) a hero image path under `assets/img/`.
2. Derive the slug from the title — lowercase, spaces to hyphens, strip punctuation. E.g. "Rebuilding this site, properly this time" → `rebuilding-this-site-properly-this-time`.
3. Add an entry to `assets/data/posts.json` (it's a JSON array — append, don't overwrite the existing posts):
   ```json
   {
     "slug": "<slug>",
     "title": "<title>",
     "date": "<today, YYYY-MM-DD>",
     "summary": "<one-sentence summary>",
     "image": "<path under assets/img/, or empty string>",
     "file": "<slug>.md"
   }
   ```
4. Create `posts/<slug>.md` with the post body. Ask for the content, or draft it from what's described. The body renders client-side via `marked` + `DOMPurify` (see `pages/blog/post.html`) — stick to plain Markdown: headings, paragraphs, links, bold/italic, lists. No embedded HTML, no frontmatter.
5. Add a `<url>` entry to `sitemap.xml` for the new post: `https://www.gwuxdesign.co.uk/pages/blog/post.html?slug=<slug>` with a `<lastmod>` matching the post's date. `sitemap.xml` isn't generated from `posts.json` — it's a second file that has to be kept in sync by hand, same as the Markdown-file/`file`-field pairing above.
6. Verify: serve the site locally and check the new post shows up correctly on the homepage listing *and* its own page (see the `site-preview` skill) — this catches a `file` typo immediately instead of leaving it for whoever clicks the post next.
