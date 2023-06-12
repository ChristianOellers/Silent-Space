/**
 * Particle effect.
 * 
 * @todo  Rewrite articles to support instances (-> refactor Canvas drawing + Context use)
 * @module
 */
function Obj_Particle () {
    var MathHelper = new Lib_MathHelper();
    var self       = this;

    this.isUpdating     = false; // Prevent parallel updates of the game.
    this.remove         = false; // Mark for removal from stage.

    // Graphic
    this.sprite         = document.getElementById('Asset_Particle');
    this.canvas         = document.getElementById('Particles');
    this.ctx            = this.canvas.getContext('2d');
    this.width          = 5; // Sprite width  in px
    this.height         = 5; // Sprite height in px

    // Object
    this.y              = 0; // Current position (y)
    this.x              = 0; // Current position (x)
    this.speed          = 0; // Current speed
    this.rotation       = 0; // Current rotation
    this.lifetime       = 0; // Object lifespan till reset


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Initialize and run this object.
     *
     * @see  Core_Stage
     */
    this.init = function init () {
        this.initParticle();
        this.drawUpdate();
    };

    /**
     * Init/Reset position, rotation and speed.
     */
    this.initParticle = function initParticle () {
        self.x        = 50 + Math.random() * 700;
        self.y        = - (10 + Math.random() * 50);
        self.rotation = -2 + Math.random() * 2;
        self.speed    = 4 + Math.random() * 3;
        self.lifetime = 100 + Math.random() * 200;
    };


    // ------------------------------------------------------------------------------------------------------- Game loop

    /**
     * Game loop extension.
     *
     * @public
     */
    this.loop = function loop () {
        if (self.isUpdating) {
            return;
        }

        self.isUpdating = true;

        self.move()
            .drawUpdate();
    };


    // ------------------------------------------------------------------------------------------------------------ Draw

    /**
     * Draw object.
     *
     * @return   {Object}  Self reference.
     * @private
     */
    this.drawUpdate = function drawUpdate () {
        var ctx = self.ctx;

        CanvasHelper.clear(ctx);
        ctx.drawImage(self.sprite, self.x, self.y);
        ctx.restore();

        self.isUpdating = false;
        return self;
    };


    // -------------------------------------------------------------------------------------------------------- Movement

    /**
     * Update position depending on its velocity.
     * Mark object for removal if it has left the stage.
     *
     * @return   {Object}  Self reference.
     * @private
     */
    this.move = function move () {
        self.x += self.getPosX() * 1;
        self.y -= self.getPosY() * 1;
        self.lifetime--;

        // Remove from stage
        if (self.lifetime <= 0) {
            self.initParticle();
        }

        customEvent = new CustomEvent('ParticleMove', {detail: {'x': self.x, 'y': self.y}});
        window.dispatchEvent(customEvent);

        return self;
    };


    // -------------------------------------------------------------------------------------------------- Math

    /**
     * Get x-position based on rotation and speed.
     *
     * @return   {Number}  Laser X position.
     * @private
     */
    this.getPosX = function getPosX () {
        var rad = self.rotation * (Math.PI / 180),
            pos = Math.sin(rad) * self.speed;

        return pos;
    };

    /**
     * Get y-position based on rotation and speed.
     *
     * @return   {Number}  Laser Y position.
     * @private
     */
    this.getPosY = function getPosY () {
        var rad = self.rotation * (Math.PI / 180),
            pos = Math.cos(rad) * self.speed * -1;

        return pos;
    };

}

