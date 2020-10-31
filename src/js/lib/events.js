/**
 * Event helper.
 *
 * @module
 */
function Lib_Events() {
  /**
   * Publish events.
   *
   * @param {String} Event name
   * @param {Object} Event data
   * @private
   */
  this.publish = (name, data) => {
    const customEvent = new CustomEvent(name, { detail: data });

    window.dispatchEvent(customEvent);
  };
}
