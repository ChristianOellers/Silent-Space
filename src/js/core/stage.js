/**
 * Stage manager for objects and canvas elements.
 *
 * @todo Decouple Stage from Loop and DOM requirements?
 * @module
 */
function Core_Stage() {
  this.objects = {};

  /**
   * Add object to target canvas DOM element.
   *
   * @param {Object} obj Game module object (instance)
   * @param {String} canvasId Canvas DOM element ID
   * @public
   */
  this.add = (obj, canvasId) => {
    if (this.isValid(obj, canvasId)) {
      this.objects[canvasId] = obj;

      if (obj.init) {
        obj.init();
      }
    }
  };

  /**
   * Validate required object 'interface' method and canvas element existence.
   * All stage objects must implement a loop() method for the game loop.
   *
   * @param {Object} obj Game module object (instance)
   * @param {String} canvasId Canvas DOM element ID
   * @return {Boolean} True if object is valid
   * @private
   */
  this.isValid = (obj, canvasId) => {
    return obj.loop && document.getElementById(canvasId);
  };
}
