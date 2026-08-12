#!/usr/bin/env node
/* monokit — specimen coverage check.
 *
 *   node build/check-specimens.mjs
 *
 * Three directives name a live component by key: example, anatomy and states. Everything else on
 * the site resolves from the contract at build time and fails loudly here when it cannot, but
 * these three resolve in the browser, on the page, when a reader opens it. A key with no builder
 * is a blank rectangle where a demonstration should be, and only on the one page that names it.
 *
 * So both directions are checked, the same way `check-nav.mjs` checks navigation:
 *
 *   a key used by a page with no builder    — the page shows an error box instead of a specimen
 *   a builder no page uses                  — dead weight in the bundle, or a page that lost a
 *                                             specimen it used to carry
 *
 * The registries are read by importing them, not by pattern-matching the source. They are
 * assembled across six declarations and three Object.assign calls, and a regex over that shape
 * would quietly under-report exactly when it matters.
 *
 * A third direction is checked too: every `K.member` the builders reach for must exist on the
 * component set. The workbench built K by regex over `export function`, so it picked up every
 * export automatically; rebuilding it from named imports dropped `modalFocusables`, and the two
 * specimens that prove the Modal focus trap threw on open — after a clean page load, a full mount
 * count and an empty console. Nothing that ran at build time could see it.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";
import esbuild from "esbuild";

import { RUNTIME_DIRECTIVES } from "../src/plugins/runtime-directives.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(root, "src", "content");
const specimens = join(root, "src", "islands", "specimens.jsx");

/* Load a JSX module and hand back its exports.
 *
 * React is bundled in rather than stubbed. Nothing here is rendered — the builders are counted and
 * their names inspected, never called — so React is imported and never used, and bundling it costs
 * a moment in a check that already shells out to esbuild. An earlier version marked it external
 * and swapped the import for a hand-written stub; the regex missed the imports esbuild hoists out
 * of the component files, and the check died on a module-resolution error. A build gate that
 * cannot run is worse than one that is slightly slower. */
async function load(entry) {
  const bundled = await esbuild.build({
    entryPoints: [entry],
    bundle: true,
    write: false,
    format: "esm",
    platform: "node",
    loader: { ".jsx": "jsx" },
    absWorkingDir: root,
  });
  const code = bundled.outputFiles[0].text;
  return import(`data:text/javascript;base64,${Buffer.from(code).toString("base64")}`);
}

const { EXAMPLES, STATES, ANATOMY } = await load(specimens);

const REGISTRIES = { example: EXAMPLES, states: STATES, anatomy: ANATOMY };

/* Every key every page asks for. */
const used = new Map();
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry.endsWith(".md")) {
      const page = relative(contentRoot, path).replace(/\.md$/, "");
      const source = readFileSync(path, "utf8");
      const re = new RegExp("^```monokit-(" + RUNTIME_DIRECTIVES.join("|") + ")\\s+(\\S+)", "gm");
      for (const [, kind, key] of source.matchAll(re)) {
        const id = `${kind}:${key}`;
        if (!used.has(id)) used.set(id, []);
        used.get(id).push(page);
      }
    }
  }
})(contentRoot);

const faults = [];

for (const [id, pages] of used) {
  const [kind, key] = id.split(":");
  if (!REGISTRIES[kind]?.[key]) {
    faults.push(
      `${kind} "${key}": used by ${pages.join(", ")}, but no builder of that name exists ` +
        `in src/islands/specimens.jsx`,
    );
  }
}

for (const [kind, registry] of Object.entries(REGISTRIES)) {
  for (const key of Object.keys(registry)) {
    if (!used.has(`${kind}:${key}`)) {
      faults.push(`${kind} "${key}": defined in src/islands/specimens.jsx, but no page uses it`);
    }
  }
}

/* Every K.member the builders reach for has to be on the component set. Faults accumulate rather
   than reporting here — a run that stopped at the registry check would hide these behind it. */
const { K } = await load(join(root, "src", "islands", "kit.jsx"));

/* Every module a builder can live in, not just specimens.jsx. The ported demos are separate files
   that receive the same `K` prop, so a K.member typo in one of them would otherwise reach a reader
   before it reached this check. */
const builderSources = [specimens, ...readdirSync(join(root, "src", "islands", "demos"))
  .filter((f) => f.endsWith(".jsx"))
  .map((f) => join(root, "src", "islands", "demos", f))];

const source = builderSources.map((f) => readFileSync(f, "utf8")).join("\n");
const reached = new Set([...source.matchAll(/\bK\.([A-Za-z_$][\w$]*)/g)].map((m) => m[1]));

for (const member of reached) {
  if (!(member in K)) {
    faults.push(
      `K.${member}: used in src/islands/specimens.jsx, but src/islands/kit.jsx does not export it ` +
        `— the specimen will throw when that code path runs, which may not be on page load`,
    );
  }
}

for (const member of Object.keys(K)) {
  if (!reached.has(member)) {
    faults.push(`K.${member}: on the component set in src/islands/kit.jsx, but no specimen uses it`);
  }
}

if (faults.length) {
  console.error(`monokit: ${faults.length} specimen fault(s)\n`);
  for (const fault of faults) console.error(`  ${fault}`);
  process.exit(1);
}

const builders = Object.values(REGISTRIES).reduce((n, r) => n + Object.keys(r).length, 0);
console.log(
  `monokit: ${used.size} specimen references, ${builders} builders, ` +
    `${reached.size} component-set members — every one resolves`,
);
