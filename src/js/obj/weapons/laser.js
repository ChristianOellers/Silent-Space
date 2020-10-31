/**
 * Weapon type - Laser.
 *
 * @todo Replace math by library functions.
 * @todo  Outsource sound.
 * @module
 */
function Obj_Weapon_Laser() {
  // Dependencies
  this.CanvasHelper = null;

  // Assets
  this.audio = document.getElementById('Sound-Explosions-Laser');
  this.sprite = document.getElementById('Asset-Weapon-Laser');

  // Graphic
  this.canvas = document.getElementById('Weapons');
  this.ctx = this.canvas.getContext('2d');
  this.width = 8; // Sprite width in px
  this.height = 25; // Sprite height in px

  // Sound
  this.audio.volume = 1;

  // Weapon
  this.originX = 0; // Initial X coordinate
  this.originY = 0; // Initial Y coordinate
  this.originRotation = 0; // Initial object rotation (degrees)
  this.x = 0; // Current position (x)
  this.y = 0; // Current position (y)
  this.speed = 10; // Current speed
  this.acceleration = 0.3; // Acceleration factor
  this.rotation = 0; // Current rotation
  this.hitChance = 50; // Percentage

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
    if (this.y < -250) {
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
