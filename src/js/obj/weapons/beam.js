/**
 * Weapon type - Beam.
 *
 * @todo Improve: Randomize explosion audio?
 * @todo Refactor: Replace math by library functions.
 * @todo Refactor: Outsource sound.
 * @module
 */
function Obj_Weapon_Beam() {
  // Dependencies
  this.CanvasHelper = null;
  this.MathHelper = null;

  // Assets
  this.audio = document.getElementById('Sound-Explosions-0');
  this.sprite = document.getElementById('Asset-Weapon-Beam');

  // Graphic
  this.canvas = document.getElementById('Weapons');
  this.ctx = this.canvas.getContext('2d');
  this.width = 8; // Sprite width in px
  this.height = 25; // Sprite height in px

  // Weapon
  this.originX = 0; // Initial X coordinate
  this.originY = 0; // Initial Y coordinate
  this.originRotation = 0; // Initial object rotation (degrees)
  this.x = 0; // Current position (x)
  this.y = 0; // Current position (y)
  this.speed = 10; // Current speed
  this.acceleration = 0.3; // Acceleration factor
  this.rotation = 0; // Current rotation
  this.hitChance = 70; // Percentage

  // Internals
  this.isUpdating = false; // Prevent parallel updates of the game
  this.remove = false; // Mark for removal from stage

  // ------------------------------------------------------------------------------------------------------ Initialize

  /**
   * Set dependencies.
   *
   * @public
   */
  this.init = () => {
    this.CanvasHelper = CanvasHelper;
    this.MathHelper = MathHelper;
  };

  /**
   * Run object.
   *
   * @param {Number} x X coordinate to create object at
   * @param {Number} y Y coordinate to create object at
   * @param {Number} rotation Initial object rotation in degrees
   * @private
   */
  this.run = (x, y, rotation) => {
    this.originX = x - this.width / 2;
    this.originY = y;
    this.originRotation = rotation;
  };

  // ------------------------------------------------------------------------------------------------------- Game loop

  /**
   * Game loop extension.
   *
   * @public
   */
  this.loop = () => {
    if (this.isUpdating) {
      return;
    }

    if (this.remove) {
      this.CanvasHelper.clear(this.ctx);
      return;
    }

    this.isUpdating = true;

    this.move();
    this.drawUpdate();
  };

  // ------------------------------------------------------------------------------------------------------------ Draw

  /**
   * Draw weapon.
   *
   * @private
   */
  this.drawUpdate = () => {
    const { ctx } = this;

    this.CanvasHelper.clear(ctx);

    this.drawRotation();
    ctx.drawImage(this.sprite, this.x, this.y);
    ctx.restore();

    this.isUpdating = false;
  };

  /**
   * Rotate weapon.
   *
   * @private
   */
  this.drawRotation = () => {
    const { ctx } = this;
    const degree = this.originRotation;
    const radian = degree * (Math.PI / 180);

    ctx.save();
    ctx.translate(this.originX, this.originY);
    ctx.rotate(radian);
  };

  /**
   * Destroy/remove object and explode. Also there's a chance
   * of to cause a screen shake effect with exploding sound.
   *
   * @private
   */
  this.destroySelf = () => {
    const rand = Math.round(Math.random() * 100);
    const hitChance = (Math.random() * this.hitChance) | 0;
    let customEvent;

    if (this.remove) {
      return;
    }

    this.remove = true;

    if (rand <= hitChance) {
      this.audio.play();

      customEvent = new CustomEvent('Player-Shot', { detail: true });
      window.dispatchEvent(customEvent);

      customEvent = new CustomEvent('Fx-Shake');
      window.dispatchEvent(customEvent);
    }
  };

  // -------------------------------------------------------------------------------------------------------- Movement

  /**
   * Update position depending on its velocity.
   * Mark object for removal if it has left the stage.
   *
   * @private
   */
  this.move = () => {
    this.x += this.getPosX() * 1;
    this.y += this.getPosY() * 1;
    this.speed += this.acceleration;

    // Remove from stage (arbitrary value)
    if (this.y < -400) {
      this.destroySelf();
    }
  };

  // ---------------------------------------------------------------------------------------------------- Math

  /**
   * Get x-position based on rotation and speed.
   *
   * @return {Number} X position
   * @private
   */
  this.getPosX = () => {
    return this.MathHelper.getPosX(this.rotation, this.speed);
  };

  /**
   * Get y-position based on rotation and speed.
   *
   * @return {Number} Y position
   * @private
   */
  this.getPosY = () => {
    return this.MathHelper.getPosY(this.rotation, this.speed);
  };
}
