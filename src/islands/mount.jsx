/* Mounts the live specimens into the placeholders the remark plugin emitted.
 *
 * The specification's prose, values, tables and clauses are all static HTML resolved from the
 * contract at build time. Only three directives need a running component — example, anatomy and
 * states — and only those pull React. A page with none of them never loads this module.
 *
 * The component set lives in kit.jsx so a build check can verify it without loading a renderer.
 */
import React from "react";
import { createRoot } from "react-dom/client";

import { K } from "./kit.jsx";
import { EXAMPLES, STATES, ANATOMY } from "./specimens.jsx";

/* Icon resolves a role to a glyph through two generated maps that the workbench loaded as
   classic scripts. They stay classic scripts in the layout head, so this only has to wait for
   them rather than own them. */
function iconsReady() {
  if (typeof window !== "undefined" && window.MonokitIconPaths) return Promise.resolve();
  return new Promise((resolve) => {
    if (document.readyState !== "loading") return resolve();
    document.addEventListener("DOMContentLoaded", () => resolve(), { once: true });
  });
}

/* Each specimen is a COMPONENT, mounted as an element — not a function called at mount time.
   Calling one directly would run its hooks outside a render, which React rejects. */
function mountRegistry(attr, registry) {
  for (const host of document.querySelectorAll(`[${attr}]`)) {
    const key = host.getAttribute(attr);
    const Build = registry[key];
    if (host.dataset.mounted) continue;
    if (!Build) {
      /* A placeholder with no builder is a page referring to a specimen that does not exist.
         The workbench left it as a silent empty box; a specification should say so. */
      host.dataset.mounted = "failed";
      host.innerHTML =
        `<p class="specimen-error">No <code>${attr.replace("data-", "")}</code> named ` +
        `<code>${key}</code>. Add it to <code>src/islands/specimens.jsx</code>.</p>`;
      continue;
    }
    host.dataset.mounted = "true";
    host.innerHTML = "";
    createRoot(host).render(<Build K={K} />);
  }
}

export async function mountSpecimens() {
  await iconsReady();
  mountRegistry("data-example", EXAMPLES);
  mountRegistry("data-states", STATES);
  mountRegistry("data-anatomy", ANATOMY);
  /* Annotations read computed styles off the mounted components, so they resolve after, not
     before. spec.js re-runs on mutation anyway; this makes the first pass land in one go. */
  if (window.MonokitSpec) window.MonokitSpec.resolve();
}
