/* Card annotation values, resolved from the running page.
 *
 * Specimen cards state numbers beside live components, and a typed number goes stale the moment
 * the component changes — three annotations on one card drifted in a single session before this
 * existed. The site solved it with contract-resolved directives; this is the same discipline for
 * cards, and it works in both the static guideline cards and the React component cards because it
 * is plain DOM.
 *
 *   <span class="spec-meta" data-spec-token="--row-touch-1"></span>
 *   <span class="spec-meta" data-spec-probe=".mk-row[data-lead='icon']"
 *         data-spec-pseudo="::after" data-spec-prop="left" data-spec-prefix="from "></span>
 *
 * token — a custom property read from the nearest [data-density] scope, or from a data-spec-scope
 *         selector, or the document root.
 * probe — a real rendered element: a CSS property of it or of one of its pseudo-elements, or its
 *         box height when no property is named.
 *
 * A value that cannot be resolved renders as an em dash and marks itself, so a broken annotation
 * looks broken instead of looking like a number.
 *
 * Scheduling deliberately avoids requestAnimationFrame: preview hosts throttle it hard enough that
 * a frame-gated guard flag may never release, which silently blanks every annotation. Re-entrancy
 * is handled by disconnecting the observer around the write instead.
 */
(function () {
  var observer = null;
  var pending = false;

  /* Keep sub-unit values as decimals — a dismiss fraction rounded to an integer is 0. */
  function num(v) {
    var s = String(v).trim();
    var n = parseFloat(s);
    if (!isFinite(n)) return s;
    return String(Math.abs(n) >= 1 ? Math.round(n) : Math.round(n * 100) / 100);
  }

  function scopeFor(el, sel) {
    if (sel) return el.closest(sel) || document.querySelector(sel);
    return el.closest("[data-density]") ||
      document.querySelector("[data-density]") ||
      document.documentElement;
  }

  function computeLength(scope, expression) {
    var probe = document.createElement("div");
    probe.style.cssText = "position:absolute;visibility:hidden;height:0;width:" + expression;
    scope.appendChild(probe);
    var w = getComputedStyle(probe).width;
    scope.removeChild(probe);
    return w;
  }

  function resolveOne(el) {
    var d = el.dataset;
    if (d.specToken) {
      var scope = scopeFor(el, d.specScope);
      if (!scope) return null;
      var raw = getComputedStyle(scope).getPropertyValue(d.specToken);
      if (!raw || !raw.trim()) return null;
      /* A custom property is substituted, not computed: a token defined as calc() comes back as
         the expression. Resolving it means using it — a throwaway element in the same scope,
         given the value as a width, reports the computed length. */
      if (/calc\(|var\(/.test(raw)) return num(computeLength(scope, raw));
      return num(raw);
    }
    if (d.specProbe) {
      var target = document.querySelector(d.specProbe);
      if (!target) return null;
      if (d.specProp) {
        var v = getComputedStyle(target, d.specPseudo || null).getPropertyValue(d.specProp);
        return v && v.trim() && v !== "auto" ? num(v) : null;
      }
      var h = target.getBoundingClientRect().height;
      return h ? String(Math.round(h)) : null;
    }
    return null;
  }

  function resolve() {
    if (observer) observer.disconnect();
    try {
      var nodes = document.querySelectorAll("[data-spec-token],[data-spec-probe]");
      for (var i = 0; i < nodes.length; i++) {
        var el = nodes[i];
        var v = resolveOne(el);
        var text = v == null ? "\u2014"
          : (el.dataset.specPrefix || "") + v + (el.dataset.specSuffix || "");
        if (el.textContent !== text) el.textContent = text;
        el.dataset.specResolved = v == null ? "false" : "true";
      }
    } finally {
      if (observer && document.body) {
        observer.observe(document.body, { childList: true, subtree: true });
      }
    }
  }

  /* React cards mount after their sources transpile, so resolution is re-run rather than run once.
     Density and width changes matter too — the values differ per scope. */
  function schedule() {
    if (pending) return;
    pending = true;
    setTimeout(function () { pending = false; resolve(); }, 0);
  }

  function watch() {
    observer = new MutationObserver(schedule);
    resolve();
    window.addEventListener("resize", schedule);
    var coarse = window.matchMedia("(pointer: coarse)");
    if (coarse.addEventListener) coarse.addEventListener("change", schedule);
  }

  window.MonokitSpec = { resolve: resolve };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", watch);
  else watch();
})();
