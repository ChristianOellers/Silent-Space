/**
 * Particle effect.
 *
 * @todo Improve: Simplify math (not all is needed)?
 * @todo Improve: Add trail to sprite (should fades over time)
 * @module
 */
function Obj_Particle_Small() {
  // Dependencies
  this.Ext_Vector2D = null;
  this.CanvasHelper = null;
  this.MathHelper = null;
  this.State = null;

  // Assets
  this.sprites = [
    document.getElementById('Asset-Particle-0'),
    document.getElementById('Asset-Particle-1'),
    document.getElementById('Asset-Particle-2'),
  ];

  // Graphic
  this.canvas = document.getElementById('Particles');
  this.ctx = this.canvas.getContext('2d');
  this.width = 5 * 2; // Sprite size in px + Implicit hit area (*2)
  this.height = 5 * 2; // Sprite size in px + Implicit hit area (*2)

  // General
  this.y = 0; // Current position (y)
  this.x = 0; // Current position (x)
  this.rotation = 0; // Current rotation
  this.borderDistance = 25; // Don't generate close to border
  this.speedMin = 3; // Min. speed
  this.speedMax = 15; // Max. speed
  this.speed = 0; // Current speed
  this.lifetimeMin = 50; // Min. lifetime
  this.lifetimeMax = 150; // Max. lifetime
  this.lifetime = 0; // Object lifespan until reset
  this.spriteVariant = 0; // Random choice of existing

  // Internals
  this.isUpdating = false; // Prevent parallel updates of the game

  /**
   * Init and run this object.
   *
   * @public
   */
  this.init = () => {
    this.Ext_Vector2D = Ext_Vector2D;
    this.CanvasHelper = CanvasHelper;
    this.MathHelper = MathHelper;
    this.State = State;

    this.initParticle();
    this.drawUpdate();

    this.bind();
  };

  /**
   * Bind events.
   *
   * @private
   */
  this.bind = () => {
    window.addEventListener('State-Difficulty', this.onDifficultyChange.bind(this));
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
   * Init/reset position, rotation and speed.
   *
   * @private
   */
  this.initParticle = () => {
    const border = this.borderDistance;
    const screenWidth = this.ctx.canvas.clientWidth - border;
    const size = this.width;

    this.x = border + Math.random() * screenWidth;
    this.y = -(size + Math.random() * size * 4);
    this.rotation = -1 + Math.random() * 1;
    this.speed = this.speedMin + Math.random() * 1.5;
    this.lifetime = this.lifetimeMin + Math.random() * 2 * this.lifetimeMin;
    this.spriteVariant = parseInt((Math.random() * 100) % this.sprites.length, 10);
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
   * Draw object.
   *
   * @private
   */
  this.drawUpdate = () => {
    const { ctx } = this;
    const sprite = this.sprites[this.spriteVariant];

    this.CanvasHelper.clear(ctx);
    ctx.drawImage(sprite, this.x, this.y);
    ctx.restore();

    this.isUpdating = false;
  };

  /**
   * Update position depending on its velocity.
   * Mark object for removal if it has left the stage.
   *
   * @todo Fix: Vector math of approaching player is odd
   * @private
   */
  this.move = () => {
    this.x += this.getPosX() * 1;
    this.y -= this.getPosY() * 1;
    this.lifetime--;

    if (this.State.playerPosition) {
      const screenWidth = this.ctx.canvas.clientWidth;
      const screenHeight = this.ctx.canvas.clientHeight;
      const playerPos = this.State.playerPosition;

      // Set screen center as 0,0 point
      playerPos.x -= screenWidth / 2;
      playerPos.y -= screenHeight / 2;
      playerPos.normalize();

      this.x += playerPos.x * 1.25;
      this.y += playerPos.y * 1.25;
    }

    // Reset position
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

  /**
   * On difficulty change:
   * - Increase particles
   *
   * @private
   */
  this.onDifficultyChange = (_event) => {
    const { difficulty } = this.State;

    this.lifetimeMin += this.lifetime < this.lifetimeMax ? 1 : 0;
    this.speedMin += this.speed < this.speedMax ? 1 : 0;
  };
}
