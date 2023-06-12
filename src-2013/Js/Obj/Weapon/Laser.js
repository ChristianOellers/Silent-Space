/**
 * Laser weapon.
 *
 * @todo  Outsource sound.
 * @module
 */
function Obj_Weapon_Laser () {
    var MathHelper = new Lib_MathHelper();
    var self       = this;

    this.isUpdating     = false; // Prevent parallel updates of the game.
    this.remove         = false; // Mark for removal from stage.

    // Graphic
    this.sprite         = document.getElementById('Asset_Weapon_Laser');
    this.canvas         = document.getElementById('Weapons');
    this.ctx            = this.canvas.getContext('2d');
    this.width          = 8;   // Sprite width  in px
    this.height         = 25;  // Sprite height in px

    // Sound
    
    this.audio          = document.getElementById('SoundExplosion-' + MathHelper.getRandom(1, 2));
    this.audio.volume   = 1;

    // Laser
    this.originX        = 0;   // Initial X coordinate
    this.originY        = 0;   // Initial Y coordinate
    this.originRotation = 0;   // Initial object rotation (degrees)
    this.x              = 0;   // Current position (x)
    this.y              = 0;   // Current position (y)
    this.speed          = 10;  // Current speed
    this.acceleration   = 0.3; // Acceleration factor
    this.rotation       = 0;   // Current rotation


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Initialize object.
     *
     * @param   {Number}  x         X coordinate to create object at.
     * @param   {Number}  y         Y coordinate to create object at.
     * @param   {Number}  rotation  Initial object rotation in degrees.
     * @public
     */
    this.run = function run (x, y, rotation) {
        this.originX        = x - self.width / 2;
        this.originY        = y;
        this.originRotation = rotation;
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
     * Draw laser.
     *
     * @return   {Object}  Self reference.
     * @private
     */
    this.drawUpdate = function drawUpdate () {
        var ctx = self.ctx;

        CanvasHelper.clear(ctx);

        self.drawRotation();
        ctx.drawImage(self.sprite, self.x, self.y);
        ctx.restore();

        self.isUpdating = false;
        return self;
    };

    /**
     * Rotate laser.
     *
     * @see      http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/HTML-canvas-guide/...
     * @return   {Object}  Self reference.
     * @private
     */
    this.drawRotation = function drawRotation () {
        var degree = self.originRotation,
            radian = degree * (Math.PI / 180),
            ctx    = self.ctx;

        ctx.save();
        ctx.translate(self.originX, self.originY);
        ctx.rotate(radian);

        return self;
    };


    /**
     * Destroy/remove object and explode. Also there's a chance
     * of 20% to cause a screen shake effect with exploding sound.
     *
     * @return   {Object}  Self reference.
     * @private
     */
    this.destroySelf = function destroySelf () {
        var rnd, 
            hitChance = Math.random() * 5 | 0, // ^= 0-50%
            customEvent;

        if (self.remove) {
            return;
        }

        self.remove = true;
        rnd         = Math.round(Math.random()) * 10;

        if (rnd <= hitChance) {
            
            self.audio = document.getElementById('SoundExplosion-' + MathHelper.getRandom(1, 2));
            self.audio.play();

            customEvent = new CustomEvent('ShakeFx');
            window.dispatchEvent(customEvent);
        }

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
        self.x     += self.getPosX() * 1;
        self.y     += self.getPosY() * 1;
        self.speed += self.acceleration;

        // Remove from stage
        if (self.y < -250) {
            self.destroySelf();
        }

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

