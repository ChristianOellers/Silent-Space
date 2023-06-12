/**
 * Game HUD.
 *
 * @module
 */
function Core_Hud () {
    var self = this;

    this.spriteHudShip  = document.getElementById('Asset_HudShip');
    this.canvas         = document.getElementById('Hud');
    this.ctx            = this.canvas.getContext('2d');

    this.isUpdating     = false; // Prevent parallel updates of the game.
    this.hudBaseOpacity = 0.8;   // 0-1; 1 = 100% opacity


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Initialize module.
     *
     * @see  Core_Stage
     * @public
     */
    this.init = function init () {
        this.drawUpdate();
        
        // Todo: Find a better way to handle external dependencies/events
        window.addEventListener('PlayerShieldActive', this.onPlayerShieldActive);
    };


    // ---------------------------------------------------------------------------------------------------------- Events

    /**
     * Start screen shake CSS animation.
     *
     * @private
     */
    this.onPlayerShieldActive = function onPlayerShieldActive (event) {
        if (event.detail.active) {
            self.hudBaseOpacity = 0.2 + Math.random() / 5;
        }
        else {
            self.hudBaseOpacity = 0.8;
        }
    };


    // ------------------------------------------------------------------------------------------------------- Game loop

    /**
     * Game loop extension.
     *
     * @see  Core_Loop
     * @public
     */
    this.loop = function loop () {
        if (!self.isUpdating) {
            self.isUpdating = true;
            self.drawUpdate();
        }
    };


    // ------------------------------------------------------------------------------------------------------------ Draw

    /**
     * Draw a slightly flickering HUD.
     *
     * @todo  Increase intensity if ship is hit by an enemy; reduce with shields enabled (by sine curve).
     * @private
     */
    this.drawUpdate = function drawUpdate () {
        var ctx    = self.ctx,
            canvas = self.canvas,
            rnd    = Math.random() * 0.75;

        CanvasHelper.clear(self.ctx);
        ctx.save();

        ctx.globalAlpha = self.hudBaseOpacity + rnd;
        ctx.drawImage(
            self.spriteHudShip,
            canvas.width  - 50 + rnd,
            canvas.height - 90 + rnd
        );

        ctx.restore();
        self.isUpdating = false;
    };

}

