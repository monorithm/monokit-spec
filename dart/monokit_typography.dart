// typography — GENERATED FILE, DO NOT EDIT.
// Source: contract/typography.json · Specification: 10-tokens/03-typography.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// IBM Plex, one superfamily, three registers: Sans for chrome and content, Serif strictly for
// reading surfaces, Mono for machine-shaped strings. Quiet chrome, loud content.


/// A resolved type role. Sizes are logical pixels (1rem = 16).
class MonokitTextStyle {
  const MonokitTextStyle({required this.size, required this.height,
      this.tracking = 0, this.family = MonokitFontFamily.sans});
  final double size;
  final double height;
  final double tracking;
  final MonokitFontFamily family;
}

enum MonokitFontFamily { sans, serif, mono }

class MonokitFontStack {
  const MonokitFontStack._();
  static const String sans = "\"IBM Plex Sans\",ui-sans-serif,system-ui,-apple-system,\"Segoe UI\",sans-serif";
  /// The reading register. The document reader and long-form body, nowhere else.
  static const String serif = "\"IBM Plex Serif\",ui-serif,Georgia,Cambria,serif";
  /// Machine-shaped strings the user reads rather than types.
  static const String mono = "\"IBM Plex Mono\",ui-monospace,SFMono-Regular,Menlo,Consolas,monospace";
}

class MonokitWeights {
  const MonokitWeights._();
  static const int regular = 400;
  static const int medium = 500;
  static const int semibold = 600;
  static const int bold = 700;
}

class MonokitType {
  const MonokitType._();
  static const MonokitTextStyle titleLarge = MonokitTextStyle(size: 18, height: 1.30);
  static const MonokitTextStyle titleMedium = MonokitTextStyle(size: 16, height: 1.35);
  static const MonokitTextStyle bodyLarge = MonokitTextStyle(size: 16, height: 1.50);
  static const MonokitTextStyle bodyMedium = MonokitTextStyle(size: 14, height: 1.45);
  static const MonokitTextStyle labelLarge = MonokitTextStyle(size: 14, height: 1.20);
  static const MonokitTextStyle labelMedium = MonokitTextStyle(size: 12, height: 1.20);
  static const MonokitTextStyle button = MonokitTextStyle(size: 14, height: 1.20);
  static const MonokitTextStyle code = MonokitTextStyle(size: 13, height: 1.50, family: MonokitFontFamily.mono);
  static const MonokitTextStyle prose = MonokitTextStyle(size: 17, height: 1.65, family: MonokitFontFamily.serif);
  static const MonokitTextStyle proseHeading = MonokitTextStyle(size: 22, height: 1.30, tracking: -0.01, family: MonokitFontFamily.serif);
  static const MonokitTextStyle mediaTitle = MonokitTextStyle(size: 16, height: 1.30, tracking: -0.0125);
  static const MonokitTextStyle mediaCaption = MonokitTextStyle(size: 14, height: 1.40);

  /// The four fluid roles interpolate against the layout width, per spec 03.
  static MonokitTextStyle displayLargeFor(double width) => MonokitTextStyle(
        size: _lerp(36, 44, width),
        height: 1.10, tracking: -0.025);
  static MonokitTextStyle displayMediumFor(double width) => MonokitTextStyle(
        size: _lerp(30, 36, width),
        height: 1.15, tracking: -0.02);
  static MonokitTextStyle headlineLargeFor(double width) => MonokitTextStyle(
        size: _lerp(24, 28, width),
        height: 1.20, tracking: -0.015);
  static MonokitTextStyle headlineMediumFor(double width) => MonokitTextStyle(
        size: _lerp(20, 22, width),
        height: 1.25, tracking: -0.01);

  static double _lerp(double min, double max, double width) {
    final t = ((width - 600) / 680).clamp(0.0, 1.0);
    return min + (max - min) * t;
  }

  /// Nothing renders below this.
  static const double floor = 12;
}
