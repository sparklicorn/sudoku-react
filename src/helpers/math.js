/**
 * Confines `value` to the interval `[a, b]`.
 * If `value` is outside of the interval, returns either `a` or `b`, whichever is closer.
 *
 * @param {number} value
 * @param {number} a
 * @param {number} b
 */
export const confine = (value, a, b) => {
  const min = Math.min(a, b);
  const max = Math.max(a, b);

  return Math.max(min, Math.min(value, max));
};
