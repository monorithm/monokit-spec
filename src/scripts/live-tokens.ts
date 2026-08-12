/* Fills the "resolved here" column of a ```monokit-tokens``` table.
 *
 * The token NAMES resolve at build time, in the remark plugin, like every other specimen value.
 * These cells cannot: the column means what the token resolves to in the live cascade — the
 * density scope the table sits in, light or dark as the reader has it — which is a fact about the
 * running document rather than about the contract.
 *
 * Six lines and no React. A page whose only specimen is a token table stays static.
 */
export function resolveLiveTokens() {
  const root = getComputedStyle(document.documentElement);
  for (const cell of document.querySelectorAll<HTMLElement>('[data-live-token]')) {
    const name = cell.dataset.liveToken;
    if (!name) continue;
    cell.textContent = root.getPropertyValue(name).trim() || '—';
  }
}
