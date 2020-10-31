/**
 * Math helpers.
 *
 * @module
 */
function Lib_Math() {
  /**
   * Get random value between given range.
   *
   * @param {Number} min Minimum value
   * @param {Number} max Maximum value
   * @returns {Number}
   * @public
   */
  this.getRandom = (min, max) => {
    const rnd = (Math.random() * max + min) | 0;

    return rnd;
  };

  /**
   * Get x-position based on rotation and speed.
   *
   * @param {Number} rotation Element rotation
   * @param {Number} speed Element speed
   * @return {Number} X position
   * @public
   */
  this.getPosX = (rotation, speed) => {
    const rad = rotation * (Math.PI / 180);
    const pos = Math.sin(rad) * speed;

    return pos;
  };

  /**
   * Get y-position based on rotation and speed.
   *
   * @param {Number} rotation Element rotation
   * @param {Number} speed Element speed
   * @return {Number} Y position
   * @public
   */
  this.getPosY = (rotation, speed) => {
    const rad = rotation * (Math.PI / 180);
    const pos = Math.cos(rad) * speed * -1;

    return pos;
  };
}
