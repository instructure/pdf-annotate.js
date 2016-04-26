/**
 * Ensure that a value is an Array
 *
 * @param {Object} o The value to coerce to an Array
 * @return {Array}
 */
export default function arrayFrom(o) {
  return Array.isArray(o) ? o : [o];
}
