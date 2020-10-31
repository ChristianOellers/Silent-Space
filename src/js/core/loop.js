/* global APP_GLOBAL */

/**
 * Global application loop.
 *
 * @module
 */
function Core_Loop() {
  // Dependencies
  this.Stage = null;

  /**
   * Set dependencies.
   *
   * @public
   */
  this.init = () => {
    this.Stage = Stage;
  };

  /**
   * Infinite loop with all objects on stage.
   *
   * @public
   */
  this.run = () => {
    const { Stage } = this;

    if (APP_GLOBAL.STOP) {
      return;
    }

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const obj in Stage.objects) {
      Stage.objects[obj].loop();
    }

    window.requestAnimationFrame(this.run.bind(this));
  };
}
