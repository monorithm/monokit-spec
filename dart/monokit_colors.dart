// colors — GENERATED FILE, DO NOT EDIT.
// Source: contract/colors.json · Specification: 10-tokens/02-color-and-surface.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// Emerald on mist. A near-monochrome field of cool mist slate neutrals with one rationed
// accent. Colour is information, never decoration: emerald appears only where the user acts or
// the brand speaks; status hues only when the system reports state. If a screen is colourful,
// something is wrong.


import 'dart:ui' show Color;

enum MonokitTheme { light, dark }

/// One resolved palette. Fields are typed and final, so a typo fails at compile time.
class MonokitColorSet {
  const MonokitColorSet({
    required this.background,
    required this.foreground,
    required this.card,
    required this.cardForeground,
    required this.popover,
    required this.popoverForeground,
    required this.muted,
    required this.mutedForeground,
    required this.accent,
    required this.accentForeground,
    required this.secondary,
    required this.secondaryForeground,
    required this.primary,
    required this.primaryForeground,
    required this.primarySoft,
    required this.destructive,
    required this.destructiveForeground,
    required this.destructiveSoft,
    required this.destructiveText,
    required this.success,
    required this.successForeground,
    required this.successSoft,
    required this.successText,
    required this.warning,
    required this.warningForeground,
    required this.warningSoft,
    required this.warningText,
    required this.info,
    required this.infoForeground,
    required this.infoSoft,
    required this.infoText,
    required this.border,
    required this.input,
    required this.ring,
    required this.chart1,
    required this.chart2,
    required this.chart3,
    required this.chart4,
    required this.chart5,
    required this.sidebar,
    required this.sidebarForeground,
    required this.sidebarPrimary,
    required this.sidebarPrimaryForeground,
    required this.sidebarAccent,
    required this.sidebarAccentForeground,
    required this.sidebarBorder,
    required this.sidebarRing,
    required this.primaryText,
    required this.mutedText,
  });

  final Color background;
  final Color foreground;
  /// In light mode card and background are the same white, so the hairline IS the card. Never
  /// assume a luminance difference.
  final Color card;
  final Color cardForeground;
  final Color popover;
  final Color popoverForeground;
  /// The de-emphasis well. Native fields are wells rather than bordered boxes.
  final Color muted;
  /// De-emphasis is carried by colour, never by a smaller size or lighter weight.
  final Color mutedForeground;
  /// The transient fill for rows and menu items on hover and press.
  final Color accent;
  final Color accentForeground;
  final Color secondary;
  final Color secondaryForeground;
  final Color primary;
  final Color primaryForeground;
  final Color primarySoft;
  final Color destructive;
  final Color destructiveForeground;
  final Color destructiveSoft;
  final Color destructiveText;
  /// success is not primary.
  final Color success;
  final Color successForeground;
  final Color successSoft;
  final Color successText;
  final Color warning;
  final Color warningForeground;
  final Color warningSoft;
  final Color warningText;
  final Color info;
  final Color infoForeground;
  final Color infoSoft;
  final Color infoText;
  /// 1px, everywhere structure is needed. Two stacked hairlines double their alpha and read as a
  /// seam, so shared edges are collapsed.
  final Color border;
  final Color input;
  /// Neutral mid-mist by design: focus is not intent.
  final Color ring;
  final Color chart1;
  final Color chart2;
  final Color chart3;
  final Color chart4;
  final Color chart5;
  final Color sidebar;
  final Color sidebarForeground;
  final Color sidebarPrimary;
  final Color sidebarPrimaryForeground;
  final Color sidebarAccent;
  final Color sidebarAccentForeground;
  final Color sidebarBorder;
  final Color sidebarRing;
  /// Brand ink on primarySoft. The dimmer emerald that dark mode uses as a brand surface; on the
  /// light soft fill it is the ink. primary itself measures 4.45 there, under AA.
  final Color primaryText;
  /// De-emphasis ink on the muted well. mutedForeground is verified on background, not on muted,
  /// where it measures 4.14.
  final Color mutedText;
}

class MonokitColors {
  const MonokitColors._();

  static const MonokitColorSet light = MonokitColorSet(
    background: Color(0xFFFFFFFF),
    foreground: Color(0xFF090B0C),
    card: Color(0xFFFFFFFF),
    cardForeground: Color(0xFF090B0C),
    popover: Color(0xFFFFFFFF),
    popoverForeground: Color(0xFF090B0C),
    muted: Color(0xFFF1F3F3),
    mutedForeground: Color(0xFF67787C),
    accent: Color(0xFFF1F3F3),
    accentForeground: Color(0xFF161B1D),
    secondary: Color(0xFFECEFEF),
    secondaryForeground: Color(0xFF161B1D),
    primary: Color(0xFF007A55),
    primaryForeground: Color(0xFFECFDF5),
    primarySoft: Color(0xFFCBF3E0),
    destructive: Color(0xFFE7000B),
    destructiveForeground: Color(0xFFFAFAFA),
    destructiveSoft: Color(0xFFFFE1DB),
    destructiveText: Color(0xFF9F0712),
    success: Color(0xFF00A63E),
    successForeground: Color(0xFFFAFAFA),
    successSoft: Color(0xFFD7F9DC),
    successText: Color(0xFF016630),
    warning: Color(0xFFE17100),
    warningForeground: Color(0xFFFAFAFA),
    warningSoft: Color(0xFFFFE6CB),
    warningText: Color(0xFF973C00),
    info: Color(0xFF155DFC),
    infoForeground: Color(0xFFFAFAFA),
    infoSoft: Color(0xFFDDEFFF),
    infoText: Color(0xFF193CB8),
    border: Color(0xFFE3E7E8),
    input: Color(0xFFE3E7E8),
    ring: Color(0xFF9CA8AB),
    chart1: Color(0xFFD0D6D8),
    chart2: Color(0xFF67787C),
    chart3: Color(0xFF4B585B),
    chart4: Color(0xFF394447),
    chart5: Color(0xFF22292B),
    sidebar: Color(0xFFF9FBFB),
    sidebarForeground: Color(0xFF090B0C),
    sidebarPrimary: Color(0xFF009966),
    sidebarPrimaryForeground: Color(0xFFECFDF5),
    sidebarAccent: Color(0xFFF1F3F3),
    sidebarAccentForeground: Color(0xFF161B1D),
    sidebarBorder: Color(0xFFE3E7E8),
    sidebarRing: Color(0xFF9CA8AB),
    primaryText: Color(0xFF006045),
    mutedText: Color(0xFF4B585B),
  );

  static const MonokitColorSet dark = MonokitColorSet(
    background: Color(0xFF0B1113),
    foreground: Color(0xFFF9FBFB),
    card: Color(0xFF161B1D),
    cardForeground: Color(0xFFF9FBFB),
    popover: Color(0xFF161B1D),
    popoverForeground: Color(0xFFF9FBFB),
    muted: Color(0xFF22292B),
    mutedForeground: Color(0xFF9CA8AB),
    accent: Color(0xFF22292B),
    accentForeground: Color(0xFFF9FBFB),
    secondary: Color(0xFF263033),
    secondaryForeground: Color(0xFFF9FBFB),
    primary: Color(0xFF006045),
    primaryForeground: Color(0xFFECFDF5),
    primarySoft: Color(0xFF19342A),
    destructive: Color(0xFFFF6467),
    destructiveForeground: Color(0xFF090B0C),
    destructiveSoft: Color(0xFF3F1919),
    destructiveText: Color(0xFFFF6467),
    success: Color(0xFF05DF72),
    successForeground: Color(0xFF090B0C),
    successSoft: Color(0xFF0A2E17),
    successText: Color(0xFF05DF72),
    warning: Color(0xFFFFB900),
    warningForeground: Color(0xFF090B0C),
    warningSoft: Color(0xFF332400),
    warningText: Color(0xFFFFB900),
    info: Color(0xFF51A2FF),
    infoForeground: Color(0xFF090B0C),
    infoSoft: Color(0xFF14273E),
    infoText: Color(0xFF51A2FF),
    border: Color(0x1AFFFFFF),
    input: Color(0x26FFFFFF),
    ring: Color(0xFF67787C),
    chart1: Color(0xFFD0D6D8),
    chart2: Color(0xFF67787C),
    chart3: Color(0xFF4B585B),
    chart4: Color(0xFF9CA8AB),
    chart5: Color(0xFFC7CFD1),
    sidebar: Color(0xFF161B1D),
    sidebarForeground: Color(0xFFF9FBFB),
    sidebarPrimary: Color(0xFF00BC7D),
    sidebarPrimaryForeground: Color(0xFF002C22),
    sidebarAccent: Color(0xFF22292B),
    sidebarAccentForeground: Color(0xFFF9FBFB),
    sidebarBorder: Color(0x1AFFFFFF),
    sidebarRing: Color(0xFF67787C),
    primaryText: Color(0xFF00BC7D),
    mutedText: Color(0xFF9CA8AB),
  );

  /// The only resolution entry point. Density does not affect colour.
  static MonokitColorSet resolve(MonokitTheme theme) =>
      theme == MonokitTheme.dark ? dark : light;
}

/// Mode-invariant: the media canvas is always dark, on both themes.
class MonokitOnMedia {
  const MonokitOnMedia._();

  /// Broadcast. Mode-invariant, badge scale only.
  static const Color live = Color(0xFFFB2C36);
  static const Color liveForeground = Color(0xFFFFFFFF);
  /// True black in both themes, so letterboxing disappears.
  static const Color mediaCanvas = Color(0xFF000000);
  static const Color onMedia = Color(0xFFFFFFFF);
  static const Color onMediaMuted = Color(0xB8FFFFFF);
  /// The one sanctioned gradient in the system. Never tinted to brand the media.
  static const Color scrim = Color(0x66000000);
  static const Color scrimStrong = Color(0x99000000);
  static const Color overlayScrim = Color(0x99090A0B);
  /// Glass has exactly three parts: fill, border, 16px blur. Over media always the dark-context
  /// recipe, regardless of app theme.
  static const Color glassFill = Color(0x1AFFFFFF);
  static const Color glassBorder = Color(0x26FFFFFF);
  static const Color glassFillLight = Color(0x0D000000);
  static const Color glassBorderLight = Color(0x14000000);
  static const double glassBlur = 16;
}
