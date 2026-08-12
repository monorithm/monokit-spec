#!/usr/bin/env node
/* monokit — prose-number check.
 *
 *   node build/check-prose.mjs
 *
 * Dropping the single-source-of-numbers rule left one hole: the generator governs the files it
 * emits, but a value typed into a SENTENCE is invisible to it — and those are the numbers people
 * read. This closes it. Any numeral in src/content that matches a contract value must be written
 * as a directive instead, so the page and the contract cannot disagree.
 *
 * Numerals that match nothing in the contract are fine: page counts, ratios, WCAG clause numbers.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const FAMILIES = ["colors", "space", "typography", "elevation", "motion", "interaction"];

/* Every value the contract owns, mapped back to the path that owns it. */
const owned = new Map();
const walk = (node, path) => {
  if (node == null) return;
  if (typeof node === "object" && !Array.isArray(node)) {
    if ("value" in node && typeof node.value !== "object") register(String(node.value), path);
    for (const [k, v] of Object.entries(node)) {
      if (k === "description" || k === "value") continue;
      walk(v, path ? `${path}.${k}` : k);
    }
    return;
  }
  if (typeof node === "string" || typeof node === "number") register(String(node), path);
};
function register(value, path) {
  const v = value.trim();
  /* Only guard values distinctive enough that a collision means a real reference. Bare 0-2 digit
     numbers with no unit appear in ordinary prose constantly. */
  if (!/^[\d.]+(px|ms|s|%)$/.test(v) && !/^#[0-9A-Fa-f]{6,8}$/.test(v)) return;
  if (!owned.has(v)) owned.set(v, path);
}

for (const family of FAMILIES) {
  const c = JSON.parse(readFileSync(join(root, "contract", `${family}.json`), "utf8"));
  walk(c.groups ?? c.sets ?? c, family);
}

/* Collect the markdown. */
const pages = [];
(function collect(dir) {
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) collect(p);
    else if (name.endsWith(".md")) pages.push(p);
  }
})(join(root, "src", "content"));

const faults = [];
for (const page of pages) {
  const lines = readFileSync(page, "utf8").split("\n");
  let inFence = false;
  lines.forEach((line, i) => {
    if (/^```/.test(line)) { inFence = !inFence; return; }
    if (inFence) return;                       /* directives and code are exempt by definition */
    for (const [value, path] of owned) {
      /* Word-boundary match so 16px does not fire inside 216px. */
      const re = new RegExp(`(^|[^\\w.#])${value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`);
      if (re.test(line)) {
        faults.push({ page: relative(root, page), line: i + 1, value, path, text: line.trim() });
      }
    }
  });
}

if (faults.length) {
  console.error(`monokit: ${faults.length} contract value(s) typed into prose\n`);
  for (const f of faults) {
    console.error(`  ${f.page}:${f.line}  "${f.value}" is ${f.path}`);
    console.error(`      ${f.text}`);
    console.error(`      use a directive: \`\`\`monokit-scale ${f.path.split(".").slice(0, 2).join(".")}\n`);
  }
  process.exit(1);
}
console.log(`monokit: ${pages.length} pages clean — no contract value typed as a literal`);
