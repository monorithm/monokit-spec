// @ts-check
import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import react from '@astrojs/react';

import { remarkMonokit } from './src/plugins/remark-monokit.mjs';
import { rehypeMonokit } from './src/plugins/rehype-monokit.mjs';

// Served from its own subdomain, so the site sits at the root and `base` stays '/'.
// public/CNAME is what tells GitHub Pages the custom domain on deploy.
const SITE = 'https://monokit.monorithm.dev';

export default defineConfig({
  site: SITE,

  markdown: {
    // Astro 7's default processor is Sätteri, and `markdown.remarkPlugins` is deprecated in
    // favour of passing plugins to whichever processor is configured. Remark is the one with
    // the plugin ecosystem these two are written against, so it is selected explicitly.
    processor: unified({
      remarkPlugins: [remarkMonokit],
      rehypePlugins: [rehypeMonokit],

      // Off, because it cannot reach everywhere. Guidance bodies inside ```monokit-do and
      // ```monokit-dont are rendered by the directive itself and never enter this pipeline, so
      // smart punctuation curled the quotes in a page's prose and left them straight in the
      // do-and-don't pair directly beneath it — both visible at once, on a page about
      // typography. Straight everywhere is also what the authors typed.
      smartypants: false,
    }),

    // No Shiki. The site is built entirely from the system's own tokens so that it cannot drift
    // from what it documents, and a third-party highlighting theme would be the one palette on
    // the page that the contract does not own. Code blocks are `pre.code`, styled by site.css.
    syntaxHighlight: false,
  },

  integrations: [react()],

  // Every navigation is a document swap, and the document is the cheap part: 12-44kB of HTML,
  // with the CSS and JS content-hashed and already cached. Fetching it on hover removes the
  // waiting from the click without giving up a real page per route.
  //
  // `hover` rather than `viewport`: the navigation rail lists all thirty-one pages, so a viewport
  // strategy would fetch the entire specification on first paint to save a click that may never
  // come.
  prefetch: {
    prefetchAll: true,
    defaultStrategy: 'hover',
  },

  // A page and its trailing-slash variant are the same page. Picking one keeps every internal
  // link off a redirect, and the directive that rewrites the old hash routes builds the same shape.
  trailingSlash: 'always',

  build: { format: 'directory' },
});
