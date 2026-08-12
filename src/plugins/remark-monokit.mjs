/* The specimen directives.
 *
 * Every value on this site resolves from contract/*.json. Nothing is typed into a page — that is
 * the whole reason the directives exist, and `yarn check:prose` fails the build when someone
 * tries. Specimens are fenced blocks with a monokit-* language tag, so a page opened in any
 * ordinary markdown viewer degrades to readable source instead of breaking:
 *
 *     ```monokit-swatches colors.light
 *     ```
 *
 * Ported from the workbench's site/render.js. Two things changed and nothing else:
 *
 *   1. Resolution moved from the browser to the build. The workbench fetched twenty-two contract
 *      files on boot and filled the page in afterwards; here the values are in the HTML that gets
 *      served. Same output, same class names, so site.css did not move with it.
 *   2. Routes are real paths now, so `#/styles/color` is rewritten to `/styles/color/`.
 *
 * Three directives still need a running component and cannot resolve here — example, anatomy and
 * states. They emit a placeholder that src/islands/mount.jsx fills.
 */
import { readFileSync } from "node:fs";
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { visit } from "unist-util-visit";
import { RUNTIME_DIRECTIVES } from "./runtime-directives.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..", "..");

const CONTRACT_FAMILIES = ["colors", "space", "typography", "elevation", "motion", "interaction"];
const COMPONENT_CONTRACTS = ["pressable", "icon", "modal", "listgroup", "listrow",
  "button", "input", "field", "inputotp", "switch", "sheet", "screen", "screenheader",
  "pager", "pagedots", "avatar"];

const read = (p) => JSON.parse(readFileSync(join(root, p), "utf8"));

const MK = {
  contracts: Object.fromEntries(CONTRACT_FAMILIES.map((f) => [f, read(`contract/${f}.json`)])),
  components: Object.fromEntries(COMPONENT_CONTRACTS.map((c) => [c, read(`contract/${c}.json`)])),
  nav: read("src/nav.json"),

  /* Resolve a dotted path into a contract, e.g. "space.density.touch.minTarget". */
  lookup(path) {
    const [family, ...rest] = path.split(".");
    let node = MK.contracts[family] || MK.components[family];
    if (!node) return null;
    /* Contracts nest values under groups/sets/roles; walk transparently through those. */
    for (const key of rest) {
      if (node == null) return null;
      node = node[key] ?? node.groups?.[key] ?? node.sets?.[key] ?? node.roles?.[key];
    }
    return node ?? null;
  },

  value(entry) { return entry && typeof entry === "object" && "value" in entry ? entry.value : entry; },
  desc(entry) { return entry && typeof entry === "object" ? entry.description : null; },
};

/* ---------------------------------------------------------------- helpers */

function escape(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function kebab(s) { return s.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase(); }

function table(head, rows, cls) {
  return `<div class="specimen${cls ? " " + cls : ""}"><table${cls === "pages-inventory" ? ' class="pages-table"' : ""}>
    <thead><tr>${head.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
    <tbody>${rows.join("")}</tbody></table></div>`;
}

/* A directive that cannot resolve renders as a visible error rather than as nothing. A specimen
   that silently disappears takes the value it was carrying with it, and the page still reads as
   though it said something. */
function err(message) {
  return `<div class="specimen specimen-error"><strong>Specimen error</strong> — ${escape(message)}</div>`;
}

/* Inline formatting only — bold, italic, code, links. Directive bodies are one or two sentences
   of guidance; anything richer belongs in the page, not in a specimen. */
function inlineMd(text) {
  return escape(text)
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/\*\*([^*]+)\*\*/g, "<strong>$1</strong>")
    .replace(/\*([^*]+)\*/g, "<em>$1</em>")
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .split(/\n{2,}/).map((p) => `<p>${p.replace(/\n/g, " ")}</p>`).join("");
}

function guidance(kind, body) {
  return `<section class="guide" data-kind="${kind}">
    <h4>${kind === "do" ? "Do" : "Don't"}</h4>${inlineMd(body)}</section>`;
}

/* A hash route from the workbench becomes a real path. Trailing slash to match Astro's default
   build output, so no link takes a redirect on the way to the page it names. */
function href(path) {
  return `/${String(path).replace(/^#?\/?/, "").replace(/\/$/, "")}/`;
}

/* ---------------------------------------------------------------- directives */

const DIRECTIVES = {
  /* ```monokit-swatches colors.light``` — every colour in a set, with its resolved value. */
  swatches(arg) {
    const set = MK.lookup(arg);
    if (!set) return err(`no contract entry at "${arg}"`);
    const dark = arg.endsWith(".dark");
    const items = Object.entries(set).map(([name, entry]) => {
      const v = MK.value(entry);
      const d = MK.desc(entry);
      return `<figure class="sw"${dark ? ' data-on-dark="true"' : ""}>
        <span class="sw-chip" style="background:${v}"></span>
        <figcaption>
          <span class="sw-name">${name}</span>
          <span class="sw-val">${v}</span>
          ${d ? `<span class="sw-desc">${escape(d)}</span>` : ""}
        </figcaption>
      </figure>`;
    });
    return `<div class="specimen sw-grid">${items.join("")}</div>`;
  },

  /* ```monokit-scale space.spacing``` — a value ramp drawn to size.
     Composite entries (a motion role is a duration plus an easing) resolve the tokens they
     reference rather than printing their key names, so a row cannot drift from the values
     listed above it on the same page. */
  scale(arg) {
    const group = MK.lookup(arg);
    if (!group) return err(`no contract entry at "${arg}"`);
    const family = arg.split(".")[0];
    const rows = Object.entries(group).map(([name, entry]) => {
      const raw = MK.value(entry);
      if (raw && typeof raw === "object" && !Array.isArray(raw)) {
        const parts = Object.entries(raw).map(([key, ref]) => {
          const resolved = MK.value(MK.lookup(`${family}.${key}s.${ref}`));
          return resolved != null
            ? `<span class="ref" title="${family}.${key}s.${ref}">${escape(String(resolved))}</span>`
            : escape(String(ref));
        });
        return `<tr><th scope="row">${name}</th><td class="num">${parts.join(" · ")}</td><td></td>
          <td class="note">${escape(MK.desc(entry) || Object.entries(raw).map(([k, v]) => k + " " + v).join(", "))}</td></tr>`;
      }
      const v = String(raw);
      const px = parseFloat(v);
      const bar = Number.isFinite(px) && v.endsWith("px")
        ? `<span class="scale-bar" style="width:${Math.min(px, 320)}px"></span>` : "";
      return `<tr><th scope="row">${name}</th><td class="num">${v}</td><td>${bar}</td>
        <td class="note">${escape(MK.desc(entry) || "")}</td></tr>`;
    });
    return table(["token", "value", "", "notes"], rows);
  },

  /* ```monokit-table space.density``` — the touch and pointer columns side by side. */
  table(arg) {
    const group = MK.lookup(arg);
    if (!group) return err(`no contract entry at "${arg}"`);
    const cols = Object.keys(group);
    const keys = [...new Set(cols.flatMap((c) => Object.keys(group[c])))];
    const rows = keys.map((k) => `<tr><th scope="row">${k}</th>${
      cols.map((c) => `<td class="num">${MK.value(group[c][k]) ?? "—"}</td>`).join("")
    }<td class="note">${escape(MK.desc(group[cols[0]][k]) || "")}</td></tr>`);
    return table(["", ...cols, "notes"], rows);
  },

  /* ```monokit-type typography.fixed``` — every role set in itself. */
  type(arg) {
    const group = MK.lookup(arg);
    if (!group) return err(`no contract entry at "${arg}"`);
    const items = Object.entries(group).map(([name, s]) => {
      const size = s.size || `clamp(${s.min}, …, ${s.max})`;
      const font = s.family ? `var(--font-${s.family})` : "var(--font-sans)";
      const css = s.size
        ? `font-size:${s.size};line-height:${s.lineHeight};${s.tracking ? `letter-spacing:${s.tracking};` : ""}font-family:${font}`
        : `font-size:var(--text-${kebab(name)});line-height:${s.lineHeight};letter-spacing:${s.tracking};font-family:${font}`;
      return `<figure class="type-row">
        <p class="type-sample" style="${css}">Emerald on mist</p>
        <figcaption><span class="sw-name">${name}</span>
          <span class="sw-val">${size} · ${s.lineHeight}${s.tracking ? ` · ${s.tracking}` : ""}</span></figcaption>
      </figure>`;
    });
    return `<div class="specimen">${items.join("")}</div>`;
  },

  /* ```monokit-clauses pressable``` — the MUST/SHOULD/NEVER block, verbatim from the contract. */
  clauses(arg) {
    const c = MK.components[arg];
    if (!c || !c.clauses) return err(`no component contract "${arg}"`);
    const block = (kind) => (c.clauses[kind] || []).length
      ? `<section class="clauses" data-kind="${kind}">
           <h4>${kind}</h4>
           <ul>${c.clauses[kind].map((l) => `<li>${escape(l)}</li>`).join("")}</ul>
         </section>` : "";
    return `<div class="specimen clause-set">${block("MUST")}${block("SHOULD")}${block("NEVER")}</div>`;
  },

  /* ```monokit-tokens --min-target --row-1``` — what a component actually consumes.
     The names resolve here; the VALUES cannot. "resolved here" means the live cascade — the
     density scope the table is sitting in, and light or dark as the reader has it — so the cells
     are filled by src/scripts/live-tokens.ts from computed style, not baked in. */
  tokens(arg) {
    const names = arg.split(/\s+/).filter(Boolean);
    const rows = names.map((n) => `<tr><th scope="row"><code>${n}</code></th>
      <td class="num" data-live-token="${n}">…</td></tr>`);
    return table(["token", "resolved here"], rows, "live-tokens");
  },

  /* ```monokit-pages``` — what is written and what is not, generated from nav.json. A typed count
     is wrong from the next page onward, and this one sits on the page that reports honesty. */
  pages() {
    const nav = MK.nav;
    let done = 0, total = 0;
    const rows = nav.sections.map((s) => {
      const written = s.pages.filter((p) => !p.stub);
      const stubs = s.pages.filter((p) => p.stub);
      done += written.length;
      total += s.pages.length;
      const links = written.map((p) => `<a href="${href(p.path)}">${p.title}</a>`).join(", ");
      return `<tr><th scope="row">${s.title}</th>` +
        `<td class="num">${written.length} of ${s.pages.length}</td>` +
        `<td>${links || "—"}</td>` +
        `<td class="note">${stubs.length ? stubs.map((p) => p.title).join(", ") : "none"}</td></tr>`;
    });
    return table(["Section", "Written", "Pages", "Still stubs"], rows, "pages-inventory") +
      `<p class="sw-total">${done} of ${total} pages written.</p>`;
  },

  /* ```monokit-example pressable-press``` — a live component, mounted by the page's script. */
  example(arg) {
    return `<div class="specimen example" data-example="${escape(arg)}">
      <p class="example-fallback">Live example: ${escape(arg)}</p></div>`;
  },

  /* ```monokit-anatomy pressable``` — numbered callouts over the real rendered component. */
  anatomy(arg) {
    return `<div class="specimen anatomy" data-anatomy="${escape(arg)}">
      <p class="example-fallback">Anatomy: ${escape(arg)}</p></div>`;
  },

  /* ```monokit-states button``` — the interaction axis, in precedence order. */
  states(arg) {
    return `<div class="specimen states" data-states="${escape(arg)}">
      <p class="example-fallback">States: ${escape(arg)}</p></div>`;
  },

  /* ```monokit-do / monokit-dont``` — a guidance pair. Body is markdown. */
  do(arg, body) { return guidance("do", body); },
  dont(arg, body) { return guidance("dont", body); },
};

/* Declared in its own module so the page can ask the same question without importing this one —
   see the note in runtime-directives.mjs. */
const RUNTIME = new Set(RUNTIME_DIRECTIVES);

/* ---------------------------------------------------------------- plugin */

export function remarkMonokit() {
  return (tree) => {
    /* Fenced directives. */
    visit(tree, "code", (node, index, parent) => {
      if (!node.lang?.startsWith("monokit-")) return;
      const name = node.lang.slice(8);
      const directive = DIRECTIVES[name];
      const html = directive
        ? directive((node.meta || "").trim(), node.value || "")
        : err(`unknown directive "${node.lang}"`);
      parent.children[index] = { type: "html", value: html };
    });

    /* The inline form: `token:interaction.focusRing.width` resolves to the contract value with
       its path as the title, so a sentence can quote a number without owning a copy of it. */
    visit(tree, "inlineCode", (node, index, parent) => {
      const match = /^token:([\w.]+)$/.exec(node.value);
      if (!match) return;
      const path = match[1];
      const v = MK.value(MK.lookup(path));
      parent.children[index] = {
        type: "html",
        value: v == null
          ? `<code class="tok-missing" title="no contract entry at ${escape(path)}">${escape(path)}</code>`
          : `<span class="tok" title="${escape(path)}">${escape(String(v))}</span>`,
      };
    });

    /* Hash routes from the workbench become real paths. */
    visit(tree, "link", (node) => {
      if (node.url?.startsWith("#/")) node.url = href(node.url);
    });
  };
}
