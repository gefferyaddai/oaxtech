import { flushSync } from "react-dom";

/**
 * Runs a state update inside the native View Transitions API, when available
 * and when the visitor hasn't asked for reduced motion. `flushSync` forces
 * React to commit synchronously inside the transition callback — without it,
 * React's batching means the DOM hasn't actually changed yet when the browser
 * takes its "after" snapshot, and the transition silently does nothing.
 *
 * Falls back to a plain, instant state update everywhere else: older Safari,
 * Firefox, and reduced-motion — no polyfill, no library, just the update.
 */
export function withViewTransition(update: () => void) {
  const supportsViewTransitions = typeof document !== "undefined" && "startViewTransition" in document;
  const reducedMotion =
    typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (!supportsViewTransitions || reducedMotion) {
    update();
    return;
  }

  document.startViewTransition(() => flushSync(update));
}
