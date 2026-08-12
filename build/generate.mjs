#!/usr/bin/env node
/* monokit — token generator CLI.
 *
 *   node build/generate.mjs           write every output
 *   node build/generate.mjs --check   re-emit and diff; exit 1 on any drift, naming the files
 *
 * The emitters live in build/emit.js as plain functions so the same code runs here and in
 * a browser sandbox. This file is only I/O and reporting.
 *
 * Outputs are GENERATED. Editing tokens/*.css or dart/*.dart by hand is a mistake the
 * --check mode exists to catch: change contract/<family>.json instead.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, "..");
const require = createRequire(import.meta.url);
const { emitAll, tokenIndex, DART_COVERAGE } = require("./emit.js");

const FAMILIES = ["colors", "space", "typography", "elevation", "motion", "interaction"];

const contracts = {};
for (const family of FAMILIES) {
  contracts[family] = JSON.parse(readFileSync(join(root, "contract", `${family}.json`), "utf8"));
}

const emitted = emitAll(contracts);
const check = process.argv.includes("--check");
const drift = [];
let written = 0;

/* Generated Dart has to pass `flutter analyze`, which exits non-zero on an unused import —
 * and the consumer cannot fix a DO-NOT-EDIT file. So the emitters are audited here rather
 * than trusted: an import whose shown names are never referenced fails the build. */
const importFaults = [];
for (const [rel, text] of Object.entries(emitted)) {
  if (!rel.endsWith(".dart")) continue;
  const body = text.replace(/^import[^;]+;/gm, "");
  for (const [, path, shown] of text.matchAll(/^import\s+'([^']+)'(?:\s+show\s+([^;]+))?;/gm)) {
    if (!shown) continue;
    const unused = shown.split(",").map((s) => s.trim())
      .filter((n) => !new RegExp(`\\b${n}\\b`).test(body));
    if (unused.length) importFaults.push(`${rel}: unused import '${path}' show ${unused.join(", ")}`);
  }
}
if (importFaults.length) {
  console.error("monokit: generated Dart would fail analysis\n");
  for (const line of importFaults) console.error(`  ${line}`);
  process.exit(1);
}

/* Every contract group must reach BOTH outputs. The emitters used to iterate two hand-written
 * group lists, so a group added to one silently skipped the other — nine space values reached
 * CSS and never reached Dart. The Dart side now derives from the contract, and DART_COVERAGE
 * declares where each group lands, so the mapping is documented rather than inferred by a
 * name search (which produced both false passes and false failures). */
const coverageFaults = [];
for (const [family, contract] of Object.entries(contracts)) {
  const groups = contract.groups ?? contract.sets ?? {};
  for (const [group, entries] of Object.entries(groups)) {
    if (!entries || typeof entries !== "object") continue;
    const key = `${family}.${group}`;
    const home = DART_COVERAGE[key];
    if (!home) {
      coverageFaults.push(`${key}: not declared in DART_COVERAGE (build/emit.js)`);
      continue;
    }
    const dart = Object.entries(emitted).find(([p]) => p.includes(`monokit_${family}`))?.[1] ?? "";
    const symbol = home.split(".").pop();
    if (!new RegExp(`\\b${symbol}\\b`).test(dart)) {
      coverageFaults.push(`${key}: declared as ${home}, absent from the emitted Dart`);
    }
    const sample = Object.entries(entries)
      .find(([, e]) => e && typeof e === "object" && "value" in e && typeof e.value !== "object");
    const css = Object.entries(emitted).find(([p]) => p.endsWith(`${family}.css`))?.[1] ?? "";
    if (sample && !css.includes(String(sample[1].value))) {
      coverageFaults.push(`${key}: sample "${sample[0]}" absent from the emitted CSS`);
    }
  }
}
if (coverageFaults.length) {
  console.error("monokit: contract groups did not reach both outputs\n");
  for (const line of coverageFaults) console.error(`  ${line}`);
  process.exit(1);
}

/* Generated Dart must also be brace-balanced — a mis-assembled class body is a build error the
 * consumer cannot fix in a DO-NOT-EDIT file. */
const unbalanced = Object.entries(emitted)
  .filter(([p]) => p.endsWith(".dart"))
  .filter(([, t]) => (t.match(/{/g) || []).length !== (t.match(/}/g) || []).length);
if (unbalanced.length) {
  console.error("monokit: generated Dart is not brace-balanced\n");
  for (const [p] of unbalanced) console.error(`  ${p}`);
  process.exit(1);
}

for (const [rel, text] of Object.entries(emitted)) {
  const path = join(root, rel);
  const current = existsSync(path) ? readFileSync(path, "utf8") : null;

  if (check) {
    if (current !== text) {
      /* Report what actually differs, not just that something does — a hash manifest
         fails at exactly the moment it cannot tell you why. */
      if (rel.endsWith(".css") && current) {
        const a = tokenIndex(current), b = tokenIndex(text);
        const changed = Object.keys({ ...a, ...b }).filter((k) => a[k] !== b[k]);
        drift.push(`${rel}: ${changed.length ? changed.map((k) => `${k} (${a[k] ?? "absent"} -> ${b[k] ?? "absent"})`).join(", ") : "formatting only"}`);
      } else {
        drift.push(`${rel}: ${current ? "content differs" : "missing"}`);
      }
    }
    continue;
  }

  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, text, "utf8");
  written += 1;
}

if (check) {
  if (drift.length) {
    console.error(`monokit: ${drift.length} output(s) no longer match their contract\n`);
    for (const line of drift) console.error(`  ${line}`);
    process.exit(1);
  }
  console.log(`monokit: ${Object.keys(emitted).length} outputs match contract/`);
} else {
  console.log(`monokit: wrote ${written} files from ${FAMILIES.length} contracts`);
}
