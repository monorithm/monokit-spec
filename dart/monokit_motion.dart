// motion — GENERATED FILE, DO NOT EDIT.
// Source: contract/motion.json · Specification: 10-tokens/05-motion.md
// Regenerate with `dart run` on the emitted output of build/generate.mjs.
//
// Two schemes and only two. Calm for all utility motion — the user should notice only its
// absence. Expressive springs are a budget, not a style, spent on exactly three moments: a
// reaction landing, a purchase succeeding, and going live.


import 'package:flutter/animation.dart';

/// A named motion role. D26: every animation binds to a role, never to a raw duration.
class MonokitMotionRole {
  const MonokitMotionRole(this.duration, this.curve);
  final Duration duration;
  final Curve curve;
}

class MonokitDurations {
  const MonokitDurations._();
  static const Duration instant = Duration(milliseconds: 50);
  static const Duration fast = Duration(milliseconds: 100);
  static const Duration base = Duration(milliseconds: 150);
  static const Duration moderate = Duration(milliseconds: 220);
  static const Duration slow = Duration(milliseconds: 300);
  static const Duration slower = Duration(milliseconds: 400);
  /// A ceiling, not a target.
  static const Duration slowest = Duration(milliseconds: 600);
}

class MonokitEasings {
  const MonokitEasings._();
  static const Cubic standard = Cubic(0.2, 0, 0, 1);
  /// The signature deceleration.
  static const Cubic monoOut = Cubic(0.23, 1, 0.32, 1);
  static const Cubic decelerate = Cubic(0.05, 0.7, 0.1, 1);
  static const Cubic accelerate = Cubic(0.3, 0, 0.8, 0.15);
  /// Continuous processes only.
  static const Curve linear = Curves.linear;
}

class MonokitMotion {
  const MonokitMotion._();
  static const MonokitMotionRole state = MonokitMotionRole(MonokitDurations.fast, MonokitEasings.standard);
  static const MonokitMotionRole enter = MonokitMotionRole(MonokitDurations.base, MonokitEasings.monoOut);
  static const MonokitMotionRole exit = MonokitMotionRole(MonokitDurations.fast, MonokitEasings.accelerate);
  static const MonokitMotionRole emphasis = MonokitMotionRole(MonokitDurations.moderate, MonokitEasings.decelerate);
  static const MonokitMotionRole screen = MonokitMotionRole(MonokitDurations.slow, MonokitEasings.decelerate);
  static const MonokitMotionRole press = MonokitMotionRole(MonokitDurations.instant, MonokitEasings.linear);

  /// D11: reduced motion collapses every role to a fade of at most 100ms.
  static MonokitMotionRole resolve(MonokitMotionRole role, {required bool reducedMotion}) =>
      reducedMotion ? const MonokitMotionRole(Duration(milliseconds: 100), Curves.linear) : role;
}

class MonokitLoops {
  const MonokitLoops._();
  static const Duration spinner = Duration(milliseconds: 800);
  static const Duration shimmer = Duration(milliseconds: 1200);
  static const Duration progress = Duration(milliseconds: 1200);
  static const Duration pulse = Duration(milliseconds: 2000);
}

class MonokitDelays {
  const MonokitDelays._();
  static const Duration tooltip = Duration(milliseconds: 400);
  static const Duration tooltipWarm = Duration(milliseconds: 300);
  static const Duration chromeRest = Duration(milliseconds: 3000);
  static const Duration toastHold = Duration(milliseconds: 4000);
  static const Duration staggerStep = Duration(milliseconds: 25);
}

/// Spring DURATIONS only. The web values these are generated from are
/// linear() approximations; the canonical damping ratios and stiffnesses live in the
/// motion specification and are not in the contract yet, so a Flutter implementation
/// should build SpringDescription from that document rather than from these numbers.
class MonokitSpringDuration {
  const MonokitSpringDuration._();
  static const Duration effectFast = Duration(milliseconds: 65);
  static const Duration effectDefault = Duration(milliseconds: 100);
  static const Duration effectSlow = Duration(milliseconds: 140);
  static const Duration spatialFast = Duration(milliseconds: 120);
  static const Duration spatialDefault = Duration(milliseconds: 170);
  static const Duration celebrate = Duration(milliseconds: 230);
}
