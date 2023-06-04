/**
 * Weapon type - Phaser.
 *
 * @todo Improve: Randomize explosion audio?
 * @todo Refactor: Replace math by library functions.
 * @todo Refactor: Outsource sound.
 * @module
 */
function Obj_Weapon_Phaser() {
  // Dependencies
  this.CanvasHelper = null;
  this.MathHelper = null;

  // Assets
  this.audio = document.getElementById('Sound-Explosions-1');
  this.sprite = document.getElementById('Asset-Weapon-Beam');

  // Graphic
  this.canvas = document.getElementById('Weapons');
  this.ctx = this.canvas.getContext('2d');
  this.width = 20; // Graphic size, px
  this.height = 2; // Graphic size, px

  // Weapon
  this.originX = 0; // Initial X coordinate
  this.originY = 0; // Initial Y coordinate
  this.originRotation = 0; // Initial object rotation (degrees)
  this.x = 0; // Current position (x)
  this.y = 0; // Current position (y)
  this.speed = 30; // Current speed
  this.acceleration = 0.5; // Acceleration factor
  this.rotation = 0; // Current rotation
  this.lifespan = 60; // How long weapon can be active
  this.lifetime = 0; // Increases until lifespan is reached; then 'isDead = true'
  this.beamLength = 18; // Size (cheat: Stick out of screen)
  this.hitChance = 80; // Percentage

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
    this.originX = 119 + x - this.width / 2;
    this.originY = 145 + y;
    this.originRotation = 270 + rotation;
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

    ctx.save();
    this.drawRotation();
    this.drawGfx();
    ctx.restore();

    this.isUpdating = false;
  };
  
  /**
   * Graphic animation.
   *
   * @todo Fix - Move graphic away from ship (rotation is mismatching?)
   * @private
   */
  this.drawGfx = () => {
    const { ctx, x, y, width, height, lifetime, lifespan } = this;

    let percent = (lifetime / lifespan);
    let widthScale = this.beamLength * width + (width / 2 * percent) / 2;

    ctx.fillStyle = 'rgba(245, 0, 245, 0.2)';
    ctx.fillRect(50, -4, -50 + widthScale * 1.05, height * 5);
    ctx.fillStyle = 'rgba(240, 0, 240, 0.3)';
    ctx.fillRect(100, -3, -100 + widthScale * 1.15, height * 4);
    ctx.fillStyle = 'rgba(235, 0, 235, 0.4)';
    ctx.fillRect(150, -2, -150 + widthScale * 1.25, height * 3);
    ctx.fillStyle = 'rgba(230, 0, 230, 0.5)';
    ctx.fillRect(200, -1, -200 + widthScale * 1.35, height * 2);

    ctx.fillStyle = this.getGfxFill();
    ctx.fillRect(0, 0, widthScale, height);
  };

  /**
   * Fill color animation.
   *
   * @private
   */
  this.getGfxFill = () => {
    const { ctx, width, lifetime, lifespan } = this;

    const alpha = this.getGfxAlpha();

    let gradient = ctx.createLinearGradient(0, 0, width, 0);
    let percent = (lifetime / lifespan);
    let alphaBack = (alpha / 2) * (percent * 25);

    const color0 = 'rgba(192, 0, 255, ' + alpha / alphaBack + ')';
    const color1 = 'rgba(255, 0, 192, ' + alpha + ')';

    gradient.addColorStop(0, color0);
    gradient.addColorStop(1, color1);

    return gradient;
  };
  
  /**
   * Alpha value animation.
   *
   * 1) Fade from 1 to zero over full lifetime.
   *
   * @see https://www.geogebra.org/classic/agmchckr
   * @private
   */
  this.getGfxAlpha = () => {
    const { lifetime, lifespan } = this;

    // 1)
    const alpha = Math.cos(lifetime / (lifespan / Math.PI)) * 0.5 + 1;

    return (alpha > 1) ? 1 : alpha;
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
    this.lifetime += this.speed * 0.1;

    // Remove from stage
    if (this.lifetime >= this.lifespan) {
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

