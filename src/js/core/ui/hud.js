/**
 * Ingame HUD.
 *
 * @module
 */
function Core_Ui_Hud() {
  // Dependencies
  this.CanvasHelper = null;

  // Assets
  this.spriteHudShip = document.getElementById('Asset-Hud-Ship');

  // DOM
  this.canvas = document.getElementById('Hud');
  this.ctx = this.canvas.getContext('2d');

  // General
  this.hudBaseOpacity = 0.8; // 0-1; 1 = 100% opacity
  this.isUpdating = false;

  /**
   * Init module.
   *
   * @public
   */
  this.init = () => {
    this.CanvasHelper = CanvasHelper;

    this.bind();
    this.drawUpdate();
  };

  /**
   * Game loop extension.
   *
   * @public
   */
  this.loop = () => {
    if (!this.isUpdating) {
      this.isUpdating = true;
      this.drawUpdate();
    }
  };

  /**
   * Draw a slightly flickering HUD.
   *
   * @todo Increase intensity temporary during ship being hit.
   * @private
   */
  this.drawUpdate = () => {
    const { canvas } = this;
    const { ctx } = this;
    const rnd = Math.random() * 0.5;

    this.CanvasHelper.clear(this.ctx);

    ctx.save();
    ctx.globalAlpha = this.hudBaseOpacity + rnd;
    ctx.drawImage(this.spriteHudShip, canvas.width - 50 + rnd, canvas.height - 90 + rnd);
    ctx.restore();

    this.isUpdating = false;
  };

  /**
   * Bind events.
   *
   * @private
   */
  this.bind = () => {
    window.addEventListener('Player-Shield-Active', this.onPlayerShieldActive);
  };

  /**
   * Start screen shake CSS animation.
   *
   * @private
   */
  this.onPlayerShieldActive = (event) => {
    if (event.detail.active) {
      this.hudBaseOpacity = 0.2 + Math.random() / 5;
    } else {
      this.hudBaseOpacity = 0.8;
    }
  };
}
