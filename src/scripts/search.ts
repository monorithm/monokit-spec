/* Search across the whole specification.
 *
 * The workbench built its index in the browser by fetching all thirty-one pages on boot. That
 * cost was invisible there because the SPA paid it once; with real routes it would be paid on
 * every navigation. The index is generated at build time instead (src/pages/search-index.json.ts)
 * and fetched once, lazily, when someone actually types.
 */

interface Entry {
  path: string;
  title: string;
  section: string;
  headings: string[];
  text: string;
}

interface Hit {
  entry: Entry;
  heading?: string;
  snippet: string;
  score: number;
}

let INDEX: Entry[] | null = null;
let loading: Promise<Entry[]> | null = null;

function loadIndex(): Promise<Entry[]> {
  if (INDEX) return Promise.resolve(INDEX);
  loading ??= fetch('/search-index.json')
    .then((res) => (res.ok ? res.json() : []))
    .then((data: Entry[]) => (INDEX = data))
    .catch(() => (INDEX = []));
  return loading;
}

function search(query: string, index: Entry[]): Hit[] {
  const term = query.trim().toLowerCase();
  if (term.length < 2) return [];

  const hits: Hit[] = [];
  for (const entry of index) {
    const inTitle = entry.title.toLowerCase().includes(term);
    const heading = entry.headings.find((h) => h.toLowerCase().includes(term));
    const at = entry.text.indexOf(term);
    if (!inTitle && !heading && at < 0) continue;
    const snippet = at >= 0
      ? entry.text.slice(Math.max(0, at - 40), at + 60).replace(/\s+/g, ' ').trim()
      : '';
    hits.push({ entry, heading, snippet, score: inTitle ? 0 : heading ? 1 : 2 });
  }
  return hits.sort((a, b) => a.score - b.score).slice(0, 8);
}

function escape(s: string) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export function wireSearch() {
  const input = document.getElementById('q') as HTMLInputElement | null;
  const box = document.getElementById('results');
  const status = document.getElementById('search-status');
  if (!input || !box || !status) return;

  let announce: ReturnType<typeof setTimeout>;

  const close = () => {
    box.hidden = true;
    box.innerHTML = '';
    status.textContent = '';
  };

  /* Warm the index on first intent rather than on load, so a reader who never searches never
     pays for it. */
  input.addEventListener('focus', () => { void loadIndex(); }, { once: true });

  input.addEventListener('input', async () => {
    const index = await loadIndex();
    const hits = search(input.value, index);
    if (!hits.length) return close();

    box.hidden = false;
    /* Debounced so the count is announced once the reader stops typing, not per keystroke. */
    clearTimeout(announce);
    announce = setTimeout(() => {
      status.textContent = `${hits.length} result${hits.length === 1 ? '' : 's'}`;
    }, 500);

    box.innerHTML = hits.map((h) => `<a href="/${h.entry.path}/">
      <span class="r-title">${escape(h.entry.title)}</span>
      <span class="r-section">${escape(h.entry.section)}</span>
      ${h.heading ? `<span class="r-snip">${escape(h.heading)}</span>`
                  : h.snippet ? `<span class="r-snip">…${escape(h.snippet)}…</span>` : ''}
    </a>`).join('');
  });

  input.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { close(); input.blur(); }
  });
  box.addEventListener('click', close);
  document.addEventListener('click', (e) => {
    if (!(e.target as HTMLElement).closest('.search')) close();
  });
}
