// space — GENERATED FILE, DO NOT EDIT.
// Source: contract/space.json · Specification: 10-tokens/04-space-and-layout.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// One rhythm: the 4pt grid, one spacing scale, one radius scale, one column grid. Space
// declares hierarchy — s4 to s8 is one unit, s12 to s16 siblings, s24 and up different
// sections.


enum MonokitDensity { touch, pointer }
enum MonokitWidthClass { compact, medium, expanded, wide }

/// The density-resolved geometry. Spec 12 section 2.2: resolved once from the primary
/// input device and stable for the session — never flipped mid-session.
class MonokitDensitySet {
  const MonokitDensitySet({required this.minTarget, required this.controlHeight,
      required this.gap, required this.row1, required this.row2, required this.row3});

  /// The visual glyph may be smaller; the hit area may not.
  final double minTarget;
  final double controlHeight;
  final double gap;
  final double row1;
  final double row2;
  final double row3;
}

class MonokitSpace {
  const MonokitSpace._();

  static const MonokitDensitySet touch = MonokitDensitySet(
    minTarget: 44,
    controlHeight: 44,
    gap: 8,
    row1: 48,
    row2: 64,
    row3: 88,
  );

  static const MonokitDensitySet pointer = MonokitDensitySet(
    minTarget: 32,
    controlHeight: 36,
    gap: 4,
    row1: 40,
    row2: 56,
    row3: 76,
  );

  static MonokitDensitySet resolve(MonokitDensity density) =>
      density == MonokitDensity.touch ? touch : pointer;

  /// Page inset resolves per layout scope, never once per screen.
  static double pageInset(MonokitWidthClass w) => switch (w) {
        MonokitWidthClass.compact => 16,
        MonokitWidthClass.medium => 24,
        MonokitWidthClass.expanded => 32,
        MonokitWidthClass.wide => 32,
      };
}

class MonokitSpacing {
  const MonokitSpacing._();
  static const double s4 = 4;
  static const double s8 = 8;
  static const double s12 = 12;
  static const double s16 = 16;
  static const double s20 = 20;
  static const double s24 = 24;
  static const double s32 = 32;
  static const double s40 = 40;
  static const double s48 = 48;
}

class MonokitRadius {
  const MonokitRadius._();
  /// Every other radius is a proportional multiplier of this.
  static const double base = 10;
  static const double xs = 4;
  static const double sm = 6;
  static const double md = 8;
  static const double lg = 10;
  static const double xl = 14;
  static const double xxl = 18;
  static const double xxxl = 22;
  static const double huge = 26;
  /// Circle or capsule only.
  static const double full = 999;
}

class MonokitBreakpoints {
  const MonokitBreakpoints._();
  /// Semantic, not device names. A desktop window dragged narrow IS compact and gets the compact
  /// composition.
  static const double compact = 600;
  static const double medium = 960;
  static const double expanded = 1280;
}

class MonokitContainers {
  const MonokitContainers._();
  /// A phone-proportioned max: the feed never becomes a grid, at any width.
  static const double feed = 480;
  static const double content = 640;
  static const double sheet = 640;
  static const double page = 1200;
  static const double dialogSm = 400;
  static const double dialogMd = 560;
  static const double dialogLg = 720;
  static const double sidebar = 280;
  static const double rail = 72;
}

class MonokitChrome {
  const MonokitChrome._();
  /// Compact and medium. The title aligns to the content column, not the screen edge.
  static const double headerHeight = 56;
  static const double borderWidth = 1;
  /// Expanded and up. Chrome gains height with the layout, not with the type scale.
  static const double headerHeightExpanded = 64;
}

class MonokitGutter {
  const MonokitGutter._();
  static const double base = 16;
  static const double medium = 24;
  /// Media grids at every width — the grid reads as one surface.
  static const double media = 4;
}

class MonokitIconSize {
  const MonokitIconSize._();
  static const double xs = 16;
  static const double sm = 20;
  static const double md = 24;
  static const double lg = 28;
  static const double xl = 32;
  static const double stroke = 1.5;
  static const double strokeActive = 2;
  /// The system's one sanctioned stroke deviation: an optical floor at 16px. Never applied
  /// per-component.
  static const double strokeXs = 1.75;
}

class MonokitReach {
  const MonokitReach._();
  /// D25. A first-class theme token that flips ALL thumb-arc placements together for
  /// left/right-handed reach and RTL. Values: start | end.
  static const String side = "end";
}

class MonokitList {
  const MonokitList._();
  /// One swipe-action cell: a comfortable touch target with room for an icon and a label. Wider
  /// than the 44 minimum on purpose. At most two per side.
  static const double swipeActionCell = 72;
  /// The list leading slot when it holds an avatar, at radius full. The separator inset is
  /// measured from it.
  static const double leadingAvatar = 40;
}

