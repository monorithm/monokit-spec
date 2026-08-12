// elevation — GENERATED FILE, DO NOT EDIT.
// Source: contract/elevation.json · Specification: 10-tokens/02-color-and-surface.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// Borders and light, not shadows. Resting surfaces are flat and hairline-separated; shadows
// exist at overlay tiers only.


import 'dart:ui' show Color;

/// Atmosphere, not drop-shadow graphics. Dark mode keeps the same values and expects
/// them to read as near-invisible — never compensate.
class MonokitShadow {
  const MonokitShadow({required this.dx, required this.dy,
      required this.blur, required this.color});
  final double dx;
  final double dy;
  final double blur;
  final Color color;
}

class MonokitElevation {
  const MonokitElevation._();
  static const MonokitShadow sm = MonokitShadow(dx: 0, dy: 1, blur: 2, color: Color(0x0F090B0C));
  static const MonokitShadow md = MonokitShadow(dx: 0, dy: 4, blur: 12, color: Color(0x1A090B0C));
  static const MonokitShadow lg = MonokitShadow(dx: 0, dy: 12, blur: 32, color: Color(0x29090B0C));

  /// e0 flat · e1 raised · e2 overlay · e3 modal · e4 system.
  static const Map<String, List<MonokitShadow>> tiers = <String, List<MonokitShadow>>{
    'e0': <MonokitShadow>[],
    'e1': <MonokitShadow>[],
    'e2': <MonokitShadow>[md],
    'e3': <MonokitShadow>[lg],
    'e4': <MonokitShadow>[lg],
  };
}
