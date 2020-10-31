/**
 * Animated parallax background.
 *
 * @todo Refactor duplicate code + Split into micro-libraries (generation, queue, animation).
 * @module
 */
function Obj_Background() {
  // Graphic
  this.canvas0 = null; // canvas0 DOM element
  this.canvas1 = null; // canvas1 DOM element
  this.ctx0 = null; // canvas0 context object
  this.ctx1 = null; // canvas1 context object

  // Animation
  this.intervalDuration = 100; // Animation duration in frames
  this.useInterval = false; // If to use interval animation instead requestAnimationFrame
  this.interval = null; // Interval object for alternate animation type

  // Tiles
  this.TileTypes0Count = 4; // Different tile graphics (img assets), Number 0-N
  this.TileTypes1Count = 6; // Different tile graphics (img assets), Number 0-N
  this.TileTypes0 = []; // Available different tile types
  this.TileTypes1 = []; // Available different tile types

  // General
  this.tileHeight = 500; // Tile graphic height in px
  this.maxHeight = 500; // Level height, e.g. canvas0.height | fixed value
  this.scrollSpeed0 = 0.4; // How fast the level will scroll in px
  this.scrollSpeed1 = 1.0; // How fast the level will scroll in px

  // Internal
  this.Queue0 = []; // Current animation queue with a few required tiles
  this.Queue1 = []; // Current animation queue with a few required tiles
  this.stopped = false; // Stop animation

  // -------------------------------------------------------------------------------------------------------- Initialize

  /**
   * Set up objects, generate level
   *
   * @public
   */
  this.init = () => {
    this.canvas0 = document.getElementById('Background');
    this.canvas1 = document.getElementById('Foreground');
    this.ctx0 = this.canvas0.getContext('2d');
    this.ctx1 = this.canvas1.getContext('2d');

    this.createTileTypeList();
    this.createQueue();
  };

  /**
   * Run animation loop.
   *
   * @public
   */
  this.run = () => {
    this.animate();
  };

  // ------------------------------------------------------------------------------------------------------------- Loops

  /**
   * Main loop.
   *
   * @private
   */
  this.animate = () => {
    if (this.stopped) {
      return;
    }

    this.clearCanvas();
    this.drawLoop();

    if (this.useInterval) {
      if (this.intervalDuration > 0) {
        this.intervalDuration--;
      } else {
        clearInterval(this.interval);
      }
    } else {
      window.requestAnimationFrame(this.animate.bind(this));
    }
  };

  /**
   * Main loop graphic updates.
   *
   * @private
   */
  this.drawLoop = () => {
    this.updateQueue();
    this.moveTiles();
    this.drawTiles();
  };

  // -------------------------------------------------------------------------------------------------------------- Draw

  /**
   * Draw tiles on stage.
   *
   * @private
   */
  this.drawTiles = () => {
    let obj;

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (obj in this.Queue0) {
      this.ctx0.drawImage(this.Queue0[obj].img, 0, this.Queue0[obj].posY, this.canvas0.width, this.tileHeight);
    }

    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (obj in this.Queue1) {
      this.ctx1.drawImage(this.Queue1[obj].img, 0, this.Queue1[obj].posY, this.canvas1.width, this.tileHeight);
    }
  };

  // -------------------------------------------------------------------------------------------------- Helper

  /**
   * Clear used canvas elements.
   *
   * @private
   */
  this.clearCanvas = () => {
    this.clear(this.ctx0, this.canvas0);
    this.clear(this.ctx1, this.canvas1);
  };

  /**
   * Performant way to clear all canvas data but save the settings, like transformations.
   *
   * @private
   */
  this.clear = (ctx, canvas) => {
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.restore();
  };

  // ------------------------------------------------------------------------------------------------------------- Queue

  /**
   * Generate tile Queue0 for this level.
   * Set Y-position and use a random tile type.
   *
   * Do not change queue fixed length of '3'.
   *
   * @private
   */
  this.createQueue = () => {
    const posYIncrement = this.tileHeight;
    let obj;
    let i;

    for (i = 0; i < 3; i++) {
      obj = {};
      obj.posY = -this.tileHeight * i;
      obj.img = this.getRandomTile0Type();
      this.Queue0.push(obj);
    }

    for (i = 0; i < 3; i++) {
      obj = {};
      obj.posY = -this.tileHeight * i;
      obj.img = this.getRandomTile1Type();
      this.Queue1.push(obj);
    }
  };

  /**
   * Change tiles.
   *
   * @private
   */
  this.updateQueue = () => {
    let i;

    for (i = 0; i < this.Queue0.length; i++) {
      if (this.Queue0[i].posY >= this.maxHeight) {
        this.Queue0[i].posY = this.getTopmostY();
        this.Queue0[i].img = this.getRandomTile0Type();
      }
    }

    for (i = 0; i < this.Queue1.length; i++) {
      if (this.Queue1[i].posY >= this.maxHeight) {
        this.Queue1[i].posY = this.getTopmostY();
        this.Queue1[i].img = this.getRandomTile1Type();
      }
    }
  };

  // ---------------------------------------------------------------------------------------------------------- Movement

  /**
   * Get the topmost tile coordinate for positioning the next tile.
   *
   * @return   {Number}  Next free Y coordinate to create tile at.
   * @private
   */
  this.getTopmostY = () => {
    let topY = this.Queue0[0].posY;

    for (let i = 0; i < this.Queue0.length; i++) {
      if (this.Queue0[i].posY < topY) {
        topY = this.Queue0[i].posY;
      }
    }

    return topY - this.tileHeight;
  };

  /**
   * Scroll available tiles vertically.
   *
   * @private
   */
  this.moveTiles = () => {
    // eslint-disable-next-line no-restricted-syntax, guard-for-in
    for (const obj in this.Queue0) {
      this.Queue0[obj].posY += this.scrollSpeed0;
      this.Queue1[obj].posY += this.scrollSpeed1;
    }
  };

  // ------------------------------------------------------------------------------------------------------------- Tiles

  /**
   * Add all available tiles to a list.
   *
   * @private
   */
  this.createTileTypeList = () => {
    let i;

    for (i = 0; i <= this.TileTypes0Count; i++) {
      this.TileTypes0.push(document.getElementById(`Tile-0-${i}`));
    }

    for (i = 0; i <= this.TileTypes1Count; i++) {
      this.TileTypes1.push(document.getElementById(`Tile-1-${i}`));
    }
  };

  /**
   * Get random tile type from list.
   *
   * @private
   */
  this.getRandomTile0Type = () => {
    const i = Math.round(Math.random() * this.TileTypes0Count);

    return this.TileTypes0[i];
  };

  /**
   * Get random tile type from list.
   *
   * @private
   */
  this.getRandomTile1Type = () => {
    const i = Math.round(Math.random() * this.TileTypes1Count);

    return this.TileTypes1[i];
  };
}
