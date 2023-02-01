/**
 * Confines `value` to the interval `[a, b]`.
 * If `value` is outside of the interval, returns either `a` or `b`, whichever is closer.
 *
 * @param {number} value
 * @param {number} a
 * @param {number} b
 */
export const confine = (value, a, b) => {
  if (a > b) {
    const temp = a;
    a = b;
    b = temp;
  }

  return Math.max(a, Math.min(value, b));
};
