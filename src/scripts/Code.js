/**
 * Returns the module object, which has `describe`, `it`, and `assert` properties.
 * @returns {module:Utgs.UtgsObject}
 * @example
 * // init the variables
 * const {describe, it, assert} = utgs.module();
 *
 * // use them
 * describe("category", function () {
 *     it("test name", function () {
 *         assert.equals({actual: 'yes', expected: 'yes'});
 *     })
 * });
 * @see https://goog.it
 */
function module() {
  return Import.UtgsObject;
}
