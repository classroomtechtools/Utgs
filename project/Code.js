/**
 * Returns the module object, which has `describe`, `it`, and `assert` properties.
 * @returns {module:Utgs.UtgsObject}
 * @example
 * // init the variables
 * const {describe, it, assert} = Utgs.module();
 *
 * // use them
 * describe("category", function () {
 *     it("test name", function () {
 *         assert.equals({actual: 'yes', expected: 'yes'});
 *     })
 * });
 * @see https://classroomtechtools.github.io/Utgs/global.html#module
 */
function module() {
  return Import.UtgsObject;
}
