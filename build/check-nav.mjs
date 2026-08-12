#!/usr/bin/env node
/* monokit — navigation coverage check.
 *
 *   node build/check-nav.mjs
 *
 * src/nav.json is the information architecture: it decides the sections, their order, and which
 * page is home. src/content/**.md is the specification itself. Nothing keeps the two in step.
 *
 * Both directions fail silently and differently. A nav entry with no file used to render a
 * "not written yet" stub, which is indistinguishable from a page deliberately left for later. A
 * file with no nav entry is worse: it builds, it is reachable by URL, and it appears in search,
 * but no reader can navigate to it — a page of the specification that is published and hidden.
 *
 * Neither is acceptable now that the site IS the specification, so both are build failures.
 */
import { readFileSync, readdirSync, statSync } from "node:fs";
import { join, dirname, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentRoot = join(root, "src", "content");
const nav = JSON.parse(readFileSync(join(root, "src", "nav.json"), "utf8"));

/* Every path the navigation claims exists, mapped to the section that claims it. */
const claimed = new Map();
for (const section of nav.sections) {
  for (const page of section.pages) {
    if (claimed.has(page.path)) {
      claimed.set(page.path, `${claimed.get(page.path)} and ${section.title}`);
      continue;
    }
    claimed.set(page.path, section.title);
  }
}

/* Every page on disk. */
const onDisk = new Set();
(function walk(dir) {
  for (const entry of readdirSync(dir)) {
    const path = join(dir, entry);
    if (statSync(path).isDirectory()) walk(path);
    else if (entry.endsWith(".md")) {
      onDisk.add(relative(contentRoot, path).replace(/\.md$/, ""));
    }
  }
})(contentRoot);

const faults = [];

for (const [path, section] of claimed) {
  if (!onDisk.has(path)) {
    faults.push(`${path}: listed under "${section}" in src/nav.json, but src/content/${path}.md does not exist`);
  }
}

for (const path of onDisk) {
  if (!claimed.has(path)) {
    faults.push(`${path}: src/content/${path}.md exists, but no section in src/nav.json lists it — it would build, and no reader could reach it`);
  }
}

/* Home is a route like any other, and a home that 404s takes the whole site with it. */
if (!claimed.has(nav.home)) {
  faults.push(`home is "${nav.home}", which no section lists`);
}

if (faults.length) {
  console.error(`monokit: ${faults.length} navigation fault(s)\n`);
  for (const fault of faults) console.error(`  ${fault}`);
  process.exit(1);
}

console.log(`monokit: ${claimed.size} pages — navigation and content agree`);
