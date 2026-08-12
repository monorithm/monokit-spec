import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import nav from '../nav.json';

/* The search index, built once at build time.
 *
 * The workbench fetched all thirty-one pages in the browser to assemble this. That was affordable
 * exactly once, in a single-document SPA; with real routes it would have been thirty-one requests
 * per navigation. Here it is one file, fetched the first time someone focuses the search box.
 *
 * The body is indexed as raw markdown, matching the workbench's behaviour: directive arguments
 * are searchable, which is how `colors.light` finds the Color page.
 */
export const GET: APIRoute = async () => {
  const sectionOf = new Map<string, { section: string; title: string }>();
  for (const section of nav.sections) {
    for (const page of section.pages) {
      sectionOf.set(page.path, { section: section.title, title: page.title });
    }
  }

  const pages = await getCollection('spec');

  const index = pages.flatMap((entry) => {
    const meta = sectionOf.get(entry.id);
    if (!meta) return [];
    const body = entry.body ?? '';
    return [{
      path: entry.id,
      title: meta.title,
      section: meta.section,
      headings: [...body.matchAll(/^#{2,3}\s+(.*)$/gm)].map((m) => m[1]),
      text: body.toLowerCase(),
    }];
  });

  return new Response(JSON.stringify(index), {
    headers: { 'Content-Type': 'application/json' },
  });
};
