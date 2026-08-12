import { resolveLiveTokens } from './live-tokens';

/* The compact-width navigation panel and the theme toggle. */

function wireMenu() {
  const btn = document.getElementById('menu');
  const nav = document.getElementById('nav');
  const barrier = document.getElementById('nav-barrier');
  if (!btn || !nav || !barrier) return;

  const compact = window.matchMedia('(max-width:760px)');

  const set = (open: boolean) => {
    document.body.dataset.navOpen = open ? 'true' : 'false';
    btn.setAttribute('aria-expanded', open ? 'true' : 'false');
    barrier.hidden = !open;
    /* Concealed chrome is concealed to every modality, not just to the eye. */
    (nav as HTMLElement).inert = !open && compact.matches;
    if (open) nav.querySelector('a')?.focus();
  };

  btn.addEventListener('click', () => set(document.body.dataset.navOpen !== 'true'));
  barrier.addEventListener('click', () => { set(false); btn.focus(); });
  nav.addEventListener('click', (e) => {
    if ((e.target as HTMLElement).closest('a')) set(false);
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && document.body.dataset.navOpen === 'true') { set(false); btn.focus(); }
  });

  /* Leaving compact restores the pinned rail, so the panel state cannot strand the nav. */
  const sync = () => {
    if (!compact.matches) set(false);
    else (nav as HTMLElement).inert = document.body.dataset.navOpen !== 'true';
  };
  compact.addEventListener('change', sync);
  sync();
}

/* The workbench was one document, so a toggle held for the whole session. Real routes mean a
   fresh document per page, and an unremembered choice would be undone by every navigation. */
const STORAGE_KEY = 'monokit-theme';

function wireTheme() {
  const btn = document.getElementById('theme');
  if (!btn) return;

  const paint = (dark: boolean) => {
    btn.setAttribute('aria-pressed', dark ? 'true' : 'false');
    btn.textContent = dark ? 'Light' : 'Dark';
  };

  /* The head script has already applied the stored choice; this only catches the label up. */
  paint(document.documentElement.classList.contains('dark'));

  btn.addEventListener('click', () => {
    const dark = document.documentElement.classList.toggle('dark');
    paint(dark);
    /* The "resolved here" column of a monokit-tokens table means what the token resolves to in the
       live cascade, and half the colour tokens resolve differently in dark. Without this the cells
       keep reporting the theme the reader arrived in — a stale number on the page whose subject is
       that numbers must never be stale. */
    resolveLiveTokens();
    try {
      localStorage.setItem(STORAGE_KEY, dark ? 'dark' : 'light');
    } catch (e) {
      /* Private mode, or storage denied. The toggle still works for this page. */
    }
  });
}

export function wireChrome() {
  wireMenu();
  wireTheme();
}
