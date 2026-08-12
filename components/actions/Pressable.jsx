import React from "react";

/* Pressable — the gesture primitive. Every native touch affordance goes through it:
   it reports press within one frame (data-pressed), recognises long-press at the
   specified 500ms threshold, and cancels cleanly when the finger leaves the target.
   Haptics: light impact on press-in, medium on long-press recognition (documented
   here; the web has no actuator). */
export function Pressable({
  as = "button", onPress, onLongPress, longPressDelay = 500, disabled = false,
  pending = false, scale = false, className = "", style, children, ...rest
}) {
  const [pressed, setPressed] = React.useState(false);
  const timer = React.useRef(null);
  const fired = React.useRef(false);
  const node = React.useRef(null);
  /* Activation tracks a ref, not the state: pointerdown and pointerup can land in the same
     tick (a synthetic tap, a fast stylus), and reading the state's render closure would
     drop the activation. The state exists for painting, the ref for deciding. */
  const active = React.useRef(false);
  const Tag = as;

  const clear = () => { if (timer.current) { clearTimeout(timer.current); timer.current = null; } };
  const down = () => {
    if (disabled || pending) return;
    fired.current = false;
    active.current = true;
    setPressed(true);
    if (onLongPress) timer.current = setTimeout(() => { fired.current = true; onLongPress(); }, longPressDelay);
  };
  const up = () => {
    clear();
    if (!active.current) return;
    active.current = false;
    setPressed(false);
    if (!fired.current && !disabled && !pending && onPress) onPress();
  };
  const cancel = () => { clear(); active.current = false; setPressed(false); };

  /* Keyboard activation. A natively activatable element synthesises a click for Enter and Space,
     and that click carries detail 0 — a pointer-driven click carries 1 or more. Discriminating on
     detail activates the keyboard path without double-firing after a tap.

     A non-native tag gets no such click, so it needs its own key handler. Which means it also needs
     to be focusable and to announce itself as a button, or the handler can never run: without
     role and tabIndex, `as="div"` was unreachable by keyboard and by switch device, and silently
     defeated the detail-0 mechanism rather than failing loudly.

     Both handlers stay live on both paths. detail 0 is the sole discriminator, and it is the route
     assistive technology uses to activate a role="button" element — browse-mode Enter, VO-Space,
     switch access and element.click() all arrive that way. Gating it on native tags made a control
     that announces as a button impossible to activate. There is no double-fire to guard against:
     a non-native element gets no synthesised click from a keypress, and a pointer tap's click
     carries detail 1. */
  const native = as === "button" || (as === "a" && rest.href);
  const click = (e) => {
    if (e.detail !== 0) return;
    if (disabled || pending) return;
    if (onPress) onPress();
  };
  const key = (e) => {
    if (native) return;
    if (e.key !== "Enter" && e.key !== " " && e.key !== "Spacebar") return;
    if (disabled || pending) return;
    e.preventDefault();                  /* Space would scroll the page */
    if (onPress) onPress();
  };

  React.useEffect(() => clear, []);

  /* Two development asserts the contract requires. Both fire on every render rather than once,
     because both depend on resolved layout: density can change scope, and a label can arrive or
     disappear with props.

     1. SHOULD: warn when a target renders below the density minimum, so undersized targets fail
        loudly instead of shipping. Measured against the resolved --min-target.
     2. MUST: an icon-only target carries an accessible name. There is no visual label to fall
        back on, so an unlabelled one is unusable rather than merely untidy — and it is invisible
        in review, which is why this is an assert and not a guideline. */
  React.useEffect(() => {
    const el = node.current;
    if (!el || typeof getComputedStyle !== "function") return;

    const min = parseFloat(getComputedStyle(el).getPropertyValue("--min-target")) || 0;
    const box = el.getBoundingClientRect();
    /* The hit area may exceed the box via slop, so measure the slop pseudo-element too. */
    const slop = parseFloat(getComputedStyle(el, "::before").top) || 0;
    const height = box.height + (slop < 0 ? -slop * 2 : 0);
    if (box.height && (height + 0.5 < min || box.width + 0.5 < min)) {
      console.warn("monokit: target is " + Math.round(box.width) + "x" + Math.round(height) +
        ", below the " + min + " minimum for this density.", el);
    }

    /* Icon-only means: renders content, but none of it is text a user could read. An empty
       decorative wrapper is not the same thing, so a target with no content at all is skipped. */
    const named = el.getAttribute("aria-label") || el.getAttribute("aria-labelledby") ||
      el.getAttribute("title") || el.getAttribute("aria-hidden") === "true";
    const text = (el.textContent || "").trim();
    const hasContent = el.childElementCount > 0 || text.length > 0;
    if (hasContent && !text && !named) {
      console.warn("monokit: icon-only target has no accessible name. Pass a label — there is no " +
        "visible text to fall back on.", el);
    }
  });

  return (
    <Tag
      ref={node}
      className={"mk-pressable " + (scale ? "mk-press-scale " : "") + className}
      style={style}
      data-pressed={pressed ? "true" : "false"}
      data-pending={pending ? "true" : "false"}
      disabled={as === "button" ? disabled || pending : undefined}
      role={native ? undefined : "button"}
      tabIndex={native ? undefined : (disabled || pending ? -1 : 0)}
      aria-disabled={!native && (disabled || pending) ? "true" : undefined}
      type={as === "button" ? "button" : undefined}
      onPointerDown={down}
      onPointerUp={up}
      onPointerLeave={cancel}
      onPointerCancel={cancel}
      onClick={click}
      onKeyDown={key}
      onContextMenu={(e) => { if (onLongPress) e.preventDefault(); }}
      {...rest}
    >{children}</Tag>
  );
}
