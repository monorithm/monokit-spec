/* Prose markup, shaped the way site.css expects it.
 *
 * The workbench hand-rolled its markdown renderer, so it emitted exactly the markup its CSS
 * styled. Astro brings a real CommonMark parser, which is a straight upgrade everywhere except
 * here: remark's output for tables and code blocks is not the output site.css was written
 * against. Rather than restyle a stylesheet built from the system's own tokens, the markup is
 * brought back to what it documents.
 *
 * Specimen markup is left alone. Those tables arrive as raw HTML from the remark plugin already
 * wrapped in `.specimen`, and wrapping them again would put a scroll container inside a scroll
 * container.
 */
import { visitParents } from "unist-util-visit-parents";

const classesOf = (node) => {
  const c = node.properties?.className;
  return Array.isArray(c) ? c : typeof c === "string" ? c.split(/\s+/) : [];
};

const insideSpecimen = (ancestors) =>
  ancestors.some((a) => classesOf(a).includes("specimen"));

export function rehypeMonokit() {
  return (tree) => {
    visitParents(tree, "element", (node, ancestors) => {
      const parent = ancestors[ancestors.length - 1];
      if (!parent) return;

      /* Wide tables scroll inside their own container rather than pushing the page sideways. */
      if (node.tagName === "table" && !insideSpecimen(ancestors)) {
        const index = parent.children.indexOf(node);
        parent.children[index] = {
          type: "element",
          tagName: "div",
          properties: { className: ["prose-table"] },
          children: [node],
        };
        return;
      }

      /* Syntax highlighting is off — the site is built from its own tokens, and a third-party
         theme's palette on top of that would be the one thing on the page not from the contract. */
      if (node.tagName === "pre" && !insideSpecimen(ancestors)) {
        node.properties ??= {};
        node.properties.className = [...new Set([...classesOf(node), "code"])];
        const code = node.children?.find((c) => c.tagName === "code");
        const lang = classesOf(code ?? {}).find((c) => c.startsWith("language-"));
        if (lang) node.properties["data-lang"] = lang.slice("language-".length);
      }
    });

    /* The first cell of a body row names the row. Screen readers announce it with each cell,
       which is most of what makes a measurement table navigable without sight. remark emits
       every body cell as <td>, so the row headers are restored here. */
    visitParents(tree, "element", (node, ancestors) => {
      if (node.tagName !== "tbody" || insideSpecimen(ancestors)) return;
      for (const row of node.children) {
        if (row.tagName !== "tr") continue;
        const first = row.children.find((c) => c.type === "element");
        if (!first || first.tagName !== "td") continue;
        first.tagName = "th";
        first.properties = { ...first.properties, scope: "row" };
      }
    });
  };
}
