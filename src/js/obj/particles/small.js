/**
 * Particle effect.
 *
 * @todo Simplify math (not all is needed)?
 * @todo Replace math by library functions.
 * @module
 */
function Obj_Particle_Small() {
  // Dependencies
  this.CanvasHelper = null;

  // Assets
  this.sprite = document.getElementById('Asset-Particle-Small');

  // Graphic
  this.canvas = document.getElementById('Particles');
  this.ctx = this.canvas.getContext('2d');
  this.width = 5; // Sprite width in px
  this.height = 5; // Sprite height in px

  // General
  this.y = 0; // Current position (y)
  this.x = 0; // Current position (x)
  this.speed = 0; // Current speed
  this.rotation = 0; // Current rotation
  this.lifetime = 0; // Object lifespan until reset

  // Internals
  this.isUpdating = false; // Prevent parallel updates of the game
  this.remove = false; // Mark for removal from stage

  /**
   * Init and run this object.
   *
   * @public
   */
  this.init = () => {
    this.CanvasHelper = CanvasHelper;

    this.initParticle();
    this.drawUpdate();
  };

  /**
   * Init/reset position, rotation and speed.
   *
   * @private
   */
  this.initParticle = () => {
    this.x = 50 + Math.random() * 700;
    this.y = -(10 + Math.random() * 50);
    this.rotation = -2 + Math.random() * 2;
    this.speed = 4 + Math.random() * 3;
    this.lifetime = 100 + Math.random() * 200;
  };

  /**
   * Game loop extension.
   *
   * @public
   */
  this.loop = () => {
    if (this.isUpdating) {
      return;
    }

    this.isUpdating = true;

    this.move();
    this.drawUpdate();
  };

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

  /**
   * Draw object.
   *
   * @private
   */
  this.drawUpdate = () => {
    const { ctx } = this;

    this.CanvasHelper.clear(ctx);
    ctx.drawImage(this.sprite, this.x, this.y);
    ctx.restore();

    this.isUpdating = false;
  };

  /**
   * Update position depending on its velocity.
   * Mark object for removal if it has left the stage.
   *
   * @private
   */
  this.move = () => {
    this.x += this.getPosX() * 1;
    this.y -= this.getPosY() * 1;
    this.lifetime--;

    // Remove from stage
    if (this.lifetime <= 0) {
      this.initParticle();
    }

    this.publish('Particle-Move', { x: this.x, y: this.y });
  };

  /**
   * Get x-position based on rotation and speed.
   *
   * @return {Number} X position
   * @private
   */
  this.getPosX = () => {
    const rad = this.rotation * (Math.PI / 180);
    const pos = Math.sin(rad) * this.speed;

    return pos;
  };

  /**
   * Get y-position based on rotation and speed.
   *
   * @return {Number} Y position
   * @private
   */
  this.getPosY = () => {
    const rad = this.rotation * (Math.PI / 180);
    const pos = Math.cos(rad) * this.speed * -1;

    return pos;
  };
}
