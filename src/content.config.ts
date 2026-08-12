import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';

/* The specification itself. Plain markdown, no frontmatter: the first H1 is the title and the
   path is the route, so every page reads correctly on GitHub and on the site. src/nav.json owns
   the order and the sections; `yarn check:nav` fails the build if the two disagree in either
   direction. */
const spec = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content' }),
});

export const collections = { spec };
