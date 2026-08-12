// interaction — GENERATED FILE, DO NOT EDIT.
// Source: contract/interaction.json · Specification: 20-patterns/07-interaction.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// Recognition thresholds and behavioural timings. These gate behaviour; any animation they
// trigger uses the motion tokens.


class MonokitInteraction {
  const MonokitInteraction._();
  /// Adopts Flutter's kLongPressTimeout; identical on every platform.
  static const Duration longPress = Duration(milliseconds: 500);
  static const Duration doubleTap = Duration(milliseconds: 300);
  /// The pointer must dwell this long before tooltips and hover cards open.
  static const Duration hoverIntent = Duration(milliseconds: 400);
  /// The pointer may leave the trigger for this long before a hover surface closes.
  static const Duration hoverGrace = Duration(milliseconds: 200);
  /// Medium-risk destructive controls.
  static const Duration holdToConfirm = Duration(milliseconds: 800);
  static const Duration undoWindow = Duration(milliseconds: 5000);
  /// Rate limiter. Composed patterns count as one event.
  static const Duration hapticMinGap = Duration(milliseconds: 100);

  static const double focusRingWidth = 2;
  /// Painted OUTSIDE the control's bounds so it never shifts layout, and bound to focus-visible
  /// only.
  static const double focusRingOffset = 2;

  /// Drag-dismiss commits when travel exceeds 30% of the surface's height along the dismiss axis.
  static const double dismissFraction = 0.3;
  /// Or when release velocity exceeds this. Whichever comes first; otherwise the surface returns
  /// on the spatial spring.
  static const double dismissVelocity = 700;
  /// Displacement damping past an end stop. Not specified upstream — a realization choice,
  /// recorded in AMENDMENTS.md.
  static const double rubberBand = 0.55;

  /// disabled,pending,dragged,pressed,hovered,focusVisible,rest
  static const List<String> statePrecedence = <String>[
    'disabled',
    'pending',
    'dragged',
    'pressed',
    'hovered',
    'focusVisible',
    'rest',
  ];
}
