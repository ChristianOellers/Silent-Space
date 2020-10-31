/**
 * Canvas helpers.
 *
 * @module
 */
function Lib_Canvas() {
  /**
   * Clear canvas data but save settings like transformations.
   *
   * @param {Object} ctx Canvas context object
   * @public
   */
  this.clear = (ctx) => {
    const { canvas } = ctx;

    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };
}
