/* monokit — token emitters.
   Pure functions: contract JSON in, file text out. No imports, no I/O, so this runs
   unchanged under Node (build/generate.mjs) or in a browser sandbox.

   The contract is this realization's build source. It is NOT the language's source of
   truth: every canonical number lives in its owning specification doc, and this file's
   `spec` fields name that doc. Where the two disagree, the specification wins and the
   contract is what changes. (Governance: "Single source of numbers"; D21 retired, making
   the token pipeline each realization's own concern.)  */

var BANNER_CSS = function (family, spec, description, notes) {
  var out = "/* " + family + " — GENERATED FILE, DO NOT EDIT.\n";
  out += "   Source: contract/" + family + ".json · Specification: " + spec + "\n";
  out += "   Regenerate with `node build/generate.mjs`; verify with `--check`.\n\n";
  out += wrapComment(description, 3);
  if (notes && notes.length) { out += "\n"; notes.forEach(function (n) { out += wrapComment("· " + n, 3); }); }
  return out + "*/\n\n";
};

function wrapComment(text, indent) {
  var pad = new Array(indent + 1).join(" "), words = String(text).split(/\s+/), lines = [], cur = "";
  words.forEach(function (w) {
    if ((cur + " " + w).trim().length > 92 - indent) { lines.push(cur.trim()); cur = w; }
    else cur += " " + w;
  });
  if (cur.trim()) lines.push(cur.trim());
  return lines.map(function (l) { return pad + l + "\n"; }).join("");
}

/* camelCase -> kebab-case. Digits stay attached (e0 -> e0, s4 -> s4); the handful of
   tokens that want a dash before the digit are listed in CSS_NAME. */
function kebab(name) {
  return name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
}

/* CSS variable names are load-bearing: every stylesheet and component in both
   realizations already depends on them, so the emitter maps to the established names
   rather than inventing a scheme. Irregulars are listed explicitly. */
var CSS_NAME = {
  "colors.light.chart1": "--chart-1", "colors.light.chart2": "--chart-2", "colors.light.chart3": "--chart-3",
  "colors.light.chart4": "--chart-4", "colors.light.chart5": "--chart-5",
  "colors.dark.chart1": "--chart-1", "colors.dark.chart2": "--chart-2", "colors.dark.chart3": "--chart-3",
  "colors.dark.chart4": "--chart-4", "colors.dark.chart5": "--chart-5",
  "motion.delays.toastHold": "--hold-toast",
  "motion.delays.staggerStep": "--stagger-step",
  "motion.delays.tooltip": "--delay-tooltip",
  "motion.delays.tooltipWarm": "--delay-tooltip-warm",
  "motion.delays.chromeRest": "--delay-chrome-rest",
  "space.chrome.headerHeight": "--header-height",
  "space.chrome.borderWidth": "--border-width",
  "space.reach.side": "--reach-side"
};
var PREFIX = {
  "space.spacing": "--space-", "space.radius": "--radius-", "space.breakpoints": "--breakpoint-",
  "space.containers": "--container-", "space.icons": "--icon-",
  "motion.durations": "--duration-", "motion.easings": "--ease-", "motion.roles": "--motion-",
  "motion.springs": "--spring-", "motion.loops": "--loop-",
  "interaction.timings": "--interaction-", "interaction.gestures": "--gesture-",
  "elevation.shadows": "--shadow-", "elevation.tiers": "--elevation-"
};

function varName(family, group, key) {
  var full = family + "." + group + "." + key;
  if (CSS_NAME[full]) return CSS_NAME[full];
  var p = PREFIX[family + "." + group];
  if (p) {
    var k = kebab(key);
    if (group === "spacing") k = k.replace(/^s/, "");
    if (group === "springs") k = k.replace(/^effect/, "effect-").replace(/^spatial/, "spatial-").replace(/--+/g, "-");
    return p + k;
  }
  return "--" + kebab(key);
}

function val(entry) { return entry && typeof entry === "object" && "value" in entry ? entry.value : entry; }
function desc(entry) { return entry && typeof entry === "object" ? entry.description : null; }

function decls(family, group, obj, indent) {
  var pad = new Array((indent || 2) + 1).join(" "), out = "";
  Object.keys(obj).forEach(function (key) {
    var e = obj[key], d = desc(e);
    if (d) out += "\n" + wrapComment("/* " + d + " */", indent || 2).replace(/^(\s*)/, "$1");
    out += pad + varName(family, group, key) + ":" + val(e) + ";\n";
  });
  return out;
}

/* ---------- colors ---------- */
function emitColors(c) {
  var out = BANNER_CSS("colors", c.spec, c.description, c.notes);
  out += ":root{\n" + decls("colors", "light", c.sets.light) + "\n" +
    "  /* on-media and broadcast: MODE-INVARIANT, identical in both themes */\n" +
    decls("colors", "invariant", c.sets.invariant) + "}\n\n";
  out += ".dark{\n" + decls("colors", "dark", c.sets.dark) + "}\n";
  return out;
}

/* ---------- space ---------- */
function emitSpace(c) {
  var g = c.groups, out = BANNER_CSS("space", c.spec, c.description, c.notes);
  out += ":root{\n";
  ["spacing", "radius", "breakpoints", "containers", "chrome", "icons", "list", "reach"].forEach(function (grp) {
    out += "\n  /* " + grp + " */\n" + decls("space", grp, g[grp]);
  });
  out += "\n  /* page inset and gutter — resolved per layout scope, never once per screen */\n";
  out += "  --page-inset:" + val(g.pageInset.compact) + ";\n";
  out += "  --gutter:" + val(g.gutter.base) + ";\n";
  out += "  --gutter-media:" + val(g.gutter.media) + ";\n";
  out += "\n  /* density — resolved from the primary input device, orthogonal to width */\n";
  ["touch", "pointer"].forEach(function (d) {
    var s = g.density[d];
    out += "  --target-" + d + ":" + val(s.minTarget) + "; --control-" + d + ":" + val(s.controlHeight) +
      "; --gap-" + d + ":" + val(s.gap) + ";\n";
    out += "  --row-" + d + "-1:" + val(s.row1) + "; --row-" + d + "-2:" + val(s.row2) +
      "; --row-" + d + "-3:" + val(s.row3) + ";\n";
  });
  out += "\n  /* Density resolves from the primary pointer, per spec 12 section 2.2: coarse -> touch,\n" +
    "     fine -> pointer. Session-stable: it must not flip mid-session on hybrid devices.\n" +
    "     These are the RESOLVED aliases every component reads; the columns above are the data.\n" +
    "     They are emitted in three places from ONE definition (resolved(), below), so a scope\n" +
    "     can never drift from the media query or from :root. */\n";
  out += "  " + resolved("pointer").split(";").join(";\n  ") + "\n";
  out += "}\n\n";
  out += "@media (min-width:" + val(g.breakpoints.compact) + "){:root{--page-inset:" + val(g.pageInset.medium) + "}}\n";
  out += "@media (min-width:" + val(g.breakpoints.medium) + "){:root{--page-inset:" + val(g.pageInset.expanded) +
    ";--gutter:" + val(g.gutter.medium) + ";--header-height:" + val(g.chrome.headerHeightExpanded) + "}}\n";
  out += "@media (pointer:coarse){:root{" + resolved("touch") + "}}\n\n";
  out += "/* Explicit density scope — the developer-configuration override the spec allows for\n" +
    "   embedded touch contexts inside pointer apps. Not an end-user setting. */\n";
  out += "[data-density=\"touch\"]{" + resolved("touch") + "}\n";
  out += "[data-density=\"pointer\"]{" + resolved("pointer") + "}\n";
  return out;
}

/* The density-resolved aliases, defined once. Emitted at :root (pointer), in the coarse
   media query (touch), and in both [data-density] scopes — identical every time. */
function resolved(d) {
  return [
    "--min-target:var(--target-" + d + ")",
    "--control-height:var(--control-" + d + ")",
    "--gap-density:var(--gap-" + d + ")",
    "--row-1:var(--row-" + d + "-1)",
    "--row-2:var(--row-" + d + "-2)",
    "--row-3:var(--row-" + d + "-3)",
    /* Chrome icons: 20 at touch, 16 at pointer, with the optical stroke floor following
       the 16 — the floor belongs to the size, not to the density. */
    "--icon-chrome:var(--icon-" + (d === "touch" ? "sm" : "xs") + ")",
    "--icon-stroke-chrome:var(--icon-stroke" + (d === "touch" ? "" : "-xs") + ")"
  ].join(";");
}

/* ---------- typography ---------- */
function fluid(spec, minBp, maxBp) {
  var min = parseFloat(spec.min), max = parseFloat(spec.max), d = +(max - min).toFixed(4);
  var span = parseInt(maxBp, 10) - parseInt(minBp, 10);
  return "clamp(" + spec.min + ",calc(" + spec.min + " + " + d + "*(100vw - " + minBp + ")/" + span + ")," + spec.max + ")";
}
function emitTypography(c, spaceContract) {
  var g = c.groups, out = BANNER_CSS("typography", c.spec, c.description, c.notes);
  var bp = spaceContract.groups.breakpoints;
  out += ":root{\n";
  Object.keys(g.families).forEach(function (k) {
    var d = desc(g.families[k]);
    if (d) out += wrapComment("/* " + d + " */", 2);
    out += "  --font-" + k + ":" + val(g.families[k]) + ";\n";
  });
  out += "\n";
  Object.keys(g.weights).forEach(function (k) { out += "  --weight-" + kebab(k) + ":" + val(g.weights[k]) + ";\n"; });
  out += "\n  /* content voice — FLUID between the top of compact and the bottom of wide */\n";
  Object.keys(g.fluid).forEach(function (k) {
    var s = g.fluid[k], n = "--text-" + kebab(k);
    out += "  " + n + ":" + fluid(s, val(bp.compact), val(bp.expanded)) + ";\n";
    out += "  " + n + "-lh:" + s.lineHeight + "; " + n + "-tracking:" + s.tracking + ";\n";
  });
  out += "\n  /* fixed at every width */\n";
  Object.keys(g.fixed).forEach(function (k) {
    var s = g.fixed[k], n = "--text-" + kebab(k);
    out += "  " + n + ":" + s.size + "; " + n + "-lh:" + s.lineHeight;
    if (s.tracking) out += "; " + n + "-tracking:" + s.tracking;
    out += ";\n";
  });
  out += "\n" + wrapComment("/* " + desc(g.floor.text) + " */", 2);
  out += "  --text-floor:" + val(g.floor.text) + ";\n}\n";
  return out;
}

/* ---------- elevation ---------- */
function emitElevation(c) {
  var out = BANNER_CSS("elevation", c.spec, c.description, c.notes);
  out += ":root{\n" + decls("elevation", "shadows", c.groups.shadows) + "\n" +
    "  /* tiers: e0 flat · e1 raised · e2 overlay · e3 modal (+ barrier) · e4 system */\n" +
    decls("elevation", "tiers", c.groups.tiers) + "}\n";
  return out;
}

/* ---------- motion ---------- */
function emitMotion(c) {
  var g = c.groups, out = BANNER_CSS("motion", c.spec, c.description, c.notes);
  out += ":root{\n";
  out += decls("motion", "durations", g.durations);
  out += "\n" + decls("motion", "easings", g.easings);
  out += "\n  /* semantic roles — components consume these, never raw tokens (D26) */\n";
  Object.keys(g.roles).forEach(function (k) {
    var r = g.roles[k];
    out += "  --motion-" + kebab(k) + ":var(--duration-" + kebab(r.duration) + ") var(--ease-" + kebab(r.easing) + ");\n";
  });
  out += "\n  /* springs, compiled to web approximations. Canonical physics live in 05-motion.md. */\n";
  out += decls("motion", "springs", g.springs);
  out += "\n" + decls("motion", "loops", g.loops);
  out += "\n" + decls("motion", "delays", g.delays);
  out += "}\n\n";
  out += "@keyframes mk-spin{to{transform:rotate(360deg)}}\n";
  out += "@keyframes mk-shimmer{0%{background-position:100% 0}100%{background-position:-100% 0}}\n";
  out += "@keyframes mk-pulse{0%,100%{opacity:1}50%{opacity:.6}}\n";
  out += "@keyframes mk-shake{0%,100%{transform:translateX(0)}17%{transform:translateX(-4px)}\n" +
    "  33%{transform:translateX(4px)}50%{transform:translateX(-4px)}67%{transform:translateX(4px)}83%{transform:translateX(-4px)}}\n\n";
  out += "/* D11: reduced motion collapses everything to a fade of at most `fast`, stops loops,\n" +
    "   and keeps haptics. This bar does not lower. */\n";
  out += "@media (prefers-reduced-motion:reduce){\n  :root{\n";
  ["instant", "base", "moderate", "slow", "slower", "slowest"].forEach(function (k) {
    out += "    --duration-" + k + ":" + (k === "instant" ? "0ms" : "100ms") + ";\n";
  });
  out += "  }\n  *,*::before,*::after{animation-duration:.001ms!important;animation-iteration-count:1!important;\n" +
    "    transition-duration:100ms!important;transition-property:opacity!important}\n}\n";
  return out;
}

/* ---------- interaction ---------- */
function emitInteraction(c) {
  var g = c.groups, out = BANNER_CSS("interaction", c.spec, c.description, c.notes);
  out += ":root{\n" + decls("interaction", "timings", g.timings);
  out += "\n" + wrapComment("/* " + desc(g.focusRing.offset) + " */", 2);
  out += "  --focus-ring-width:" + val(g.focusRing.width) + ";\n";
  out += "  --focus-ring-offset:" + val(g.focusRing.offset) + ";\n";
  out += "\n  /* gesture recognition — spec 07 section 4 owns the dismiss numbers */\n";
  out += decls("interaction", "gestures", g.gestures);
  out += "\n" + wrapComment("/* interaction axis, first match wins: " + val(g.statePrecedence) + " */", 2);
  out += "}\n";
  return out;
}

/* ---------- Dart ---------- */
function hexToArgb(hex) {
  var h = hex.replace("#", "");
  if (h.length === 6) return "0xFF" + h.toUpperCase();
  if (h.length === 8) return "0x" + h.slice(6, 8).toUpperCase() + h.slice(0, 6).toUpperCase();
  return null;
}
function bannerDart(family, spec, description) {
  var out = "// " + family + " — GENERATED FILE, DO NOT EDIT.\n";
  out += "// Source: contract/" + family + ".json · Specification: " + spec + "\n";
  out += "// Regenerate with `dart run` on the emitted output of build/generate.mjs.\n//\n";
  out += wrapComment(description, 0).split("\n").map(function (l) { return l ? "// " + l : ""; }).join("\n");
  return out + "\n";
}
function dartDoc(text, indent) {
  if (!text) return "";
  var pad = new Array((indent || 0) + 1).join(" ");
  return wrapComment(text, 0).split("\n").filter(function (l) { return l; })
    .map(function (l) { return pad + "/// " + l + "\n"; }).join("");
}

function emitColorsDart(c) {
  var light = c.sets.light, dark = c.sets.dark, inv = c.sets.invariant;
  var keys = Object.keys(light);
  var out = bannerDart("colors", c.spec, c.description) + "\nimport 'dart:ui' show Color;\n\n";
  out += "enum MonokitTheme { light, dark }\n\n";
  out += "/// One resolved palette. Fields are typed and final, so a typo fails at compile time.\n";
  out += "class MonokitColorSet {\n  const MonokitColorSet({\n";
  keys.forEach(function (k) { out += "    required this." + k + ",\n"; });
  out += "  });\n\n";
  keys.forEach(function (k) {
    out += dartDoc(desc(light[k]), 2);
    out += "  final Color " + k + ";\n";
  });
  out += "}\n\n";
  out += "class MonokitColors {\n  const MonokitColors._();\n\n";
  [["light", light], ["dark", dark]].forEach(function (pair) {
    out += "  static const MonokitColorSet " + pair[0] + " = MonokitColorSet(\n";
    keys.forEach(function (k) { out += "    " + k + ": Color(" + hexToArgb(val(pair[1][k])) + "),\n"; });
    out += "  );\n\n";
  });
  out += "  /// The only resolution entry point. Density does not affect colour.\n";
  out += "  static MonokitColorSet resolve(MonokitTheme theme) =>\n      theme == MonokitTheme.dark ? dark : light;\n}\n\n";
  out += "/// Mode-invariant: the media canvas is always dark, on both themes.\n";
  out += "class MonokitOnMedia {\n  const MonokitOnMedia._();\n\n";
  Object.keys(inv).forEach(function (k) {
    var v = val(inv[k]), argb = hexToArgb(v);
    out += dartDoc(desc(inv[k]), 2);
    out += argb ? "  static const Color " + k + " = Color(" + argb + ");\n"
                : "  static const double " + k + " = " + parseFloat(v) + ";\n";
  });
  out += "}\n";
  return out;
}

function emitSpaceDart(c) {
  var g = c.groups;
  var out = bannerDart("space", c.spec, c.description) + "\nenum MonokitDensity { touch, pointer }\n";
  out += "enum MonokitWidthClass { compact, medium, expanded, wide }\n\n";
  out += "/// The density-resolved geometry. Spec 12 section 2.2: resolved once from the primary\n";
  out += "/// input device and stable for the session — never flipped mid-session.\n";
  out += "class MonokitDensitySet {\n  const MonokitDensitySet({required this.minTarget, required this.controlHeight,\n";
  out += "      required this.gap, required this.row1, required this.row2, required this.row3});\n\n";
  ["minTarget", "controlHeight", "gap", "row1", "row2", "row3"].forEach(function (k) {
    out += dartDoc(desc(g.density.touch[k]), 2) + "  final double " + k + ";\n";
  });
  out += "}\n\n";
  out += "class MonokitSpace {\n  const MonokitSpace._();\n\n";
  ["touch", "pointer"].forEach(function (d) {
    var s = g.density[d];
    out += "  static const MonokitDensitySet " + d + " = MonokitDensitySet(\n";
    ["minTarget", "controlHeight", "gap", "row1", "row2", "row3"].forEach(function (k) {
      out += "    " + k + ": " + parseFloat(val(s[k])) + ",\n";
    });
    out += "  );\n\n";
  });
  out += "  static MonokitDensitySet resolve(MonokitDensity density) =>\n      density == MonokitDensity.touch ? touch : pointer;\n\n";
  out += "  /// Page inset resolves per layout scope, never once per screen.\n";
  out += "  static double pageInset(MonokitWidthClass w) => switch (w) {\n";
  ["compact", "medium", "expanded", "wide"].forEach(function (k) {
    out += "        MonokitWidthClass." + k + " => " + parseFloat(val(g.pageInset[k])) + ",\n";
  });
  out += "      };\n}\n\n";
  /* Every remaining group emits, derived from the contract itself. The CSS side iterates its
     own group list; deriving here means adding a group cannot reach one output and silently
     skip the other, which is exactly how nine values became CSS-only. */
  Object.keys(g).forEach(function (group) {
    if (DART_SPECIAL[group]) return;
    var entries = g[group];
    if (!entries || typeof entries !== "object") return;
    var cls = dartClassName(group);
    out += "class " + cls + " {\n  const " + cls + "._();\n";
    Object.keys(entries).forEach(function (k) {
      var t = dartConst(entries[k]);
      out += dartDoc(desc(entries[k]), 2);
      out += "  static const " + t.type + " " + k + " = " + t.literal + ";\n";
    });
    out += "}\n\n";
  });
  return out;
}

/* Class name per contract group. A group with no entry here still emits, under a derived name. */
var DART_CLASS = { icons: "MonokitIconSize" };
var DART_SPECIAL = { density: 1, pageInset: 1 };   /* emitted above, with their own resolvers */

function dartClassName(group) {
  return DART_CLASS[group] || "Monokit" + group.charAt(0).toUpperCase() + group.slice(1);
}

/* A token is a double when it reads as a number, with or without px. Anything else — a keyword
   like reach.side's `end` — is a String. Without this branch a keyword emits as NaN. */
function dartConst(entry) {
  var v = String(val(entry)).trim();
  return /^-?[\d.]+(px)?$/.test(v)
    ? { type: "double", literal: String(parseFloat(v)) }
    : { type: "String", literal: JSON.stringify(v) };
}

function emitMotionDart(c) {
  var g = c.groups;
  var out = bannerDart("motion", c.spec, c.description) + "\nimport 'package:flutter/animation.dart';\n\n";
  out += "/// A named motion role. D26: every animation binds to a role, never to a raw duration.\n";
  out += "class MonokitMotionRole {\n  const MonokitMotionRole(this.duration, this.curve);\n";
  out += "  final Duration duration;\n  final Curve curve;\n}\n\n";
  out += "class MonokitDurations {\n  const MonokitDurations._();\n";
  Object.keys(g.durations).forEach(function (k) {
    out += dartDoc(desc(g.durations[k]), 2);
    out += "  static const Duration " + k + " = Duration(milliseconds: " + parseInt(val(g.durations[k]), 10) + ");\n";
  });
  out += "}\n\nclass MonokitEasings {\n  const MonokitEasings._();\n";
  Object.keys(g.easings).forEach(function (k) {
    var v = val(g.easings[k]);
    out += dartDoc(desc(g.easings[k]), 2);
    if (v === "linear") { out += "  static const Curve " + k + " = Curves.linear;\n"; return; }
    var n = v.match(/-?[\d.]+/g);
    out += "  static const Cubic " + k + " = Cubic(" + n[0] + ", " + n[1] + ", " + n[2] + ", " + n[3] + ");\n";
  });
  out += "}\n\nclass MonokitMotion {\n  const MonokitMotion._();\n";
  Object.keys(g.roles).forEach(function (k) {
    var r = g.roles[k];
    out += "  static const MonokitMotionRole " + k +
      " = MonokitMotionRole(MonokitDurations." + r.duration + ", MonokitEasings." + r.easing + ");\n";
  });
  out += "\n  /// D11: reduced motion collapses every role to a fade of at most 100ms.\n";
  out += "  static MonokitMotionRole resolve(MonokitMotionRole role, {required bool reducedMotion}) =>\n";
  out += "      reducedMotion ? const MonokitMotionRole(Duration(milliseconds: 100), Curves.linear) : role;\n}\n";

  out += "\nclass MonokitLoops {\n  const MonokitLoops._();\n";
  Object.keys(g.loops).forEach(function (k) {
    out += dartDoc(desc(g.loops[k]), 2);
    out += "  static const Duration " + k + " = Duration(milliseconds: " + parseInt(val(g.loops[k]), 10) + ");\n";
  });
  out += "}\n\nclass MonokitDelays {\n  const MonokitDelays._();\n";
  Object.keys(g.delays).forEach(function (k) {
    out += dartDoc(desc(g.delays[k]), 2);
    out += "  static const Duration " + k + " = Duration(milliseconds: " + parseInt(val(g.delays[k]), 10) + ");\n";
  });
  out += "}\n\n/// Spring DURATIONS only. The web values these are generated from are\n" +
    "/// linear() approximations; the canonical damping ratios and stiffnesses live in the\n" +
    "/// motion specification and are not in the contract yet, so a Flutter implementation\n" +
    "/// should build SpringDescription from that document rather than from these numbers.\n";
  out += "class MonokitSpringDuration {\n  const MonokitSpringDuration._();\n";
  Object.keys(g.springs).forEach(function (k) {
    out += "  static const Duration " + k + " = Duration(milliseconds: " + parseInt(val(g.springs[k]), 10) + ");\n";
  });
  out += "}\n";
  return out;
}

/* Where every contract group lands in Dart, or why it deliberately does not. The emitters used to
   be checked by searching for a key name, which produced both false passes and false failures —
   MonokitType.floor is named for its role, not its contract key. An explicit manifest is the
   documentation of the mapping AND the thing the build gate checks. */
var DART_COVERAGE = {
  "colors.light": "MonokitColors.light",
  "colors.dark": "MonokitColors.dark",
  "colors.invariant": "MonokitOnMedia",
  "space.spacing": "MonokitSpacing",
  "space.radius": "MonokitRadius",
  "space.breakpoints": "MonokitBreakpoints",
  "space.containers": "MonokitContainers",
  "space.icons": "MonokitIconSize",
  "space.chrome": "MonokitChrome",
  "space.list": "MonokitList",
  "space.gutter": "MonokitGutter",
  "space.reach": "MonokitReach",
  "space.density": "MonokitSpace.resolve",
  "space.pageInset": "MonokitSpace.pageInset",
  "typography.families": "MonokitFontStack",
  "typography.weights": "MonokitWeights",
  "typography.fixed": "MonokitType",
  "typography.fluid": "MonokitType",
  "typography.floor": "MonokitType.floor",
  "elevation.shadows": "MonokitElevation",
  "elevation.tiers": "MonokitElevation.tiers",
  "motion.durations": "MonokitDurations",
  "motion.easings": "MonokitEasings",
  "motion.roles": "MonokitMotion",
  "motion.loops": "MonokitLoops",
  "motion.delays": "MonokitDelays",
  "motion.springs": "MonokitSpringDuration",
  "interaction.timings": "MonokitInteraction",
  "interaction.focusRing": "MonokitInteraction.focusRingWidth",
  "interaction.gestures": "MonokitInteraction",
  "interaction.statePrecedence": "MonokitInteraction.statePrecedence"
};

function emitInteractionDart(c) {
  var g = c.groups;
  var out = bannerDart("interaction", c.spec, c.description) + "\nclass MonokitInteraction {\n  const MonokitInteraction._();\n";
  Object.keys(g.timings).forEach(function (k) {
    out += dartDoc(desc(g.timings[k]), 2);
    out += "  static const Duration " + k + " = Duration(milliseconds: " + parseInt(val(g.timings[k]), 10) + ");\n";
  });
  out += "\n  static const double focusRingWidth = " + parseFloat(val(g.focusRing.width)) + ";\n";
  out += dartDoc(desc(g.focusRing.offset), 2);
  out += "  static const double focusRingOffset = " + parseFloat(val(g.focusRing.offset)) + ";\n\n";
  Object.keys(g.gestures).forEach(function (k) {
    out += dartDoc(desc(g.gestures[k]), 2);
    out += "  static const double " + k + " = " + parseFloat(val(g.gestures[k])) + ";\n";
  });
  out += "\n  /// " + val(g.statePrecedence) + "\n";
  out += "  static const List<String> statePrecedence = <String>[\n";
  String(val(g.statePrecedence)).split(",").forEach(function (s) { out += "    '" + s + "',\n"; });
  out += "  ];\n}\n";
  return out;
}

function emitTypographyDart(c, spaceContract) {
  var g = c.groups;
  var minBp = parseInt(val(spaceContract.groups.breakpoints.compact), 10);
  var maxBp = parseInt(val(spaceContract.groups.breakpoints.expanded), 10);
  /* No import: the fluid roles lerp against a raw double, so the width-class type is never
     referenced here. An unused import would fail `flutter analyze`, and the consumer cannot
     fix a generated file. */
  var out = bannerDart("typography", c.spec, c.description) + "\n";
  out += "/// A resolved type role. Sizes are logical pixels (1rem = 16).\n";
  out += "class MonokitTextStyle {\n  const MonokitTextStyle({required this.size, required this.height,\n";
  out += "      this.tracking = 0, this.family = MonokitFontFamily.sans});\n";
  out += "  final double size;\n  final double height;\n  final double tracking;\n  final MonokitFontFamily family;\n}\n\n";
  out += "enum MonokitFontFamily { sans, serif, mono }\n\n";
  out += "class MonokitFontStack {\n  const MonokitFontStack._();\n";
  Object.keys(g.families).forEach(function (k) {
    out += dartDoc(desc(g.families[k]), 2);
    out += "  static const String " + k + " = " + JSON.stringify(String(val(g.families[k]))) + ";\n";
  });
  out += "}\n\nclass MonokitWeights {\n  const MonokitWeights._();\n";
  Object.keys(g.weights).forEach(function (k) {
    out += "  static const int " + k + " = " + parseInt(val(g.weights[k]), 10) + ";\n";
  });
  out += "}\n\n";
  var rem = function (v) { return +(parseFloat(v) * 16).toFixed(2); };
  out += "class MonokitType {\n  const MonokitType._();\n";
  Object.keys(g.fixed).forEach(function (k) {
    var s = g.fixed[k];
    out += "  static const MonokitTextStyle " + k + " = MonokitTextStyle(size: " + rem(s.size) +
      ", height: " + s.lineHeight + (s.tracking ? ", tracking: " + parseFloat(s.tracking) : "") +
      (s.family ? ", family: MonokitFontFamily." + s.family : "") + ");\n";
  });
  out += "\n  /// The four fluid roles interpolate against the layout width, per spec 03.\n";
  Object.keys(g.fluid).forEach(function (k) {
    var s = g.fluid[k];
    out += "  static MonokitTextStyle " + k + "For(double width) => MonokitTextStyle(\n";
    out += "        size: _lerp(" + rem(s.min) + ", " + rem(s.max) + ", width),\n";
    out += "        height: " + s.lineHeight + ", tracking: " + parseFloat(s.tracking) + ");\n";
  });
  out += "\n  static double _lerp(double min, double max, double width) {\n";
  out += "    final t = ((width - " + minBp + ") / " + (maxBp - minBp) + ").clamp(0.0, 1.0);\n";
  out += "    return min + (max - min) * t;\n  }\n\n";
  out += "  /// Nothing renders below this.\n  static const double floor = " + rem(val(g.floor.text)) + ";\n}\n";
  return out;
}

function emitElevationDart(c) {
  var g = c.groups;
  var out = bannerDart("elevation", c.spec, c.description) + "\nimport 'dart:ui' show Color;\n\n";
  out += "/// Atmosphere, not drop-shadow graphics. Dark mode keeps the same values and expects\n";
  out += "/// them to read as near-invisible — never compensate.\n";
  out += "class MonokitShadow {\n  const MonokitShadow({required this.dx, required this.dy,\n";
  out += "      required this.blur, required this.color});\n";
  out += "  final double dx;\n  final double dy;\n  final double blur;\n  final Color color;\n}\n\n";
  out += "class MonokitElevation {\n  const MonokitElevation._();\n";
  Object.keys(g.shadows).forEach(function (k) {
    var n = String(val(g.shadows[k])).match(/(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(-?[\d.]+)(?:px)?\s+(#[0-9A-Fa-f]+)/);
    out += "  static const MonokitShadow " + k + " = MonokitShadow(dx: " + n[1] + ", dy: " + n[2] +
      ", blur: " + n[3] + ", color: Color(" + hexToArgb(n[4]) + "));\n";
  });
  out += "\n  /// e0 flat · e1 raised · e2 overlay · e3 modal · e4 system.\n";
  out += "  static const Map<String, List<MonokitShadow>> tiers = <String, List<MonokitShadow>>{\n";
  Object.keys(g.tiers).forEach(function (k) {
    var v = String(val(g.tiers[k]));
    var m = v.match(/--shadow-(\w+)/);
    out += "    '" + k + "': " + (m ? "<MonokitShadow>[" + m[1] + "]" : "<MonokitShadow>[]") + ",\n";
  });
  out += "  };\n}\n";
  return out;
}

/* ---------- orchestration ---------- */
function emitAll(contracts) {
  var out = {};
  out["tokens/colors.css"] = emitColors(contracts.colors);
  out["tokens/space.css"] = emitSpace(contracts.space);
  out["tokens/typography.css"] = emitTypography(contracts.typography, contracts.space);
  out["tokens/elevation.css"] = emitElevation(contracts.elevation);
  out["tokens/motion.css"] = emitMotion(contracts.motion);
  out["tokens/interaction.css"] = emitInteraction(contracts.interaction);
  out["dart/monokit_colors.dart"] = emitColorsDart(contracts.colors);
  out["dart/monokit_space.dart"] = emitSpaceDart(contracts.space);
  out["dart/monokit_typography.dart"] = emitTypographyDart(contracts.typography, contracts.space);
  out["dart/monokit_elevation.dart"] = emitElevationDart(contracts.elevation);
  out["dart/monokit_motion.dart"] = emitMotionDart(contracts.motion);
  out["dart/monokit_interaction.dart"] = emitInteractionDart(contracts.interaction);
  return out;
}

/* Every CSS custom property the emitter produces, name -> resolved value, for the
   value-parity check against the hand-written files this generator replaces. */
function tokenIndex(text) {
  var index = {}, re = /(--[a-z0-9-]+)\s*:\s*([^;}]+)/g, m;
  while ((m = re.exec(text))) index[m[1]] = m[2].trim();
  return index;
}

if (typeof module !== "undefined" && module.exports) {
  module.exports = { emitAll: emitAll, tokenIndex: tokenIndex, DART_COVERAGE: DART_COVERAGE };
}
