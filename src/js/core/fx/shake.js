/**
 * Shake effect.
 *
 * @module
 */
function Core_Fx_Shake() {
  // DOM
  this.element = document.getElementById('Fx');

  // General
  this.className = 'fx-shake';

  /**
   * Init public events.
   *
   * @public
   */
  this.init = () => {
    this.bind();
  };

  /**
   * Remove CSS class to allow new CSS screen shake animation.
   *
   * @public
   */
  this.reset = () => {
    this.element.classList.remove(this.className);
  };

  /**
   * Bind events.
   *
   * @private
   */
  this.bind = () => {
    window.addEventListener('Fx-Shake', this.onShakeFx);
  };

  /**
   * Start CSS screen shake animation on event triggers.
   *
   * @private
   */
  this.onShakeFx = (_event) => {
    this.element.classList.add(this.className);
  };
}
