/**
 * Player object: The space ship.
 *
 * @todo  Outsource particles, shield, sound.
 * @module
 */
function Obj_Ship_Player () {
    var MathHelper = new Lib_MathHelper();
    var self       = this;


    // Prevent parallel updates of the game.
    this.isUpdating         = false;

    // Graphic
    this.sprite             = document.getElementById('Asset_Ship');
    this.spriteShielded     = document.getElementById('Asset_ShipShielded');
    this.canvas             = document.getElementById('Game');
    this.ctx                = this.canvas.getContext('2d');

    // Sound
    this.SoundShieldCharge   = document.getElementById('SoundShieldCharge');
    this.soundShieldEnabled  = document.getElementById('SoundShieldEnabled');
    this.soundLaser          = document.getElementById('SoundLaser-' + MathHelper.getRandom(1, 2));
    this.soundLaserReady     = document.getElementById('SoundLaserReady');
    this.soundFuncBlocked    = document.getElementById('SoundFunctionBlocked');
    this.soundEngineThruster = document.getElementById('SoundEngineThruster');

    // Ship
    this.x                  = 0;    // Current position (x).
    this.y                  = 0;    // Current position (y).
    this.friction           = 0.93; // World friction: Close to 1 values create smooth surfaces.
    this.velocityX          = 0;    // Horizontal velocity.
    this.velocityY          = 0;    // Vertical velocity.
    this.rotation           = 0;    // Current rotation.
    this.rotationRadius     = 5;    // How fast the ship can rotate in degrees/frame.
    this.speed              = 0;    // Current speed.
    this.speedMax           = 5   + Math.random() * 3;    // Maximum speed.
    this.acceleration       = 0.3 + Math.random() * 0.25; // Speed +/- acceleration factor.
    this.movingDirection    = ''; // up, down, left, right

    // Shields
    this.CanvasCopyUnder    = document.getElementById('CanvasCopyUnder');
    this.CanvasCopyOver     = document.getElementById('CanvasCopyOver');
    this.ctxCanvasCopyUnder = this.CanvasCopyUnder.getContext('2d');
    this.ctxCanvasCopyOver  = this.CanvasCopyOver.getContext('2d');

    this.videoShield        = document.getElementById('VideoShield');
    this.spriteShield0      = document.getElementById('Asset_Shield0');
    this.spriteShield1      = document.getElementById('Asset_Shield1');
    this.shieldCooldownTime = (500 + Math.random() * 200) | 0; // Time in MS it takes until you can switch shield status.
    this.shieldCooldown     = false; // Flag (automatic)
    this.shieldActive       = false; // Flag (automatic)

    // Laser
    this.laserCooldownTime  = (1500 + Math.random() * 500) | 0; // Time in MS it takes until you can fire again.
    this.laserCooldown      = false; // Flag (automatic)

    // Engine
    this.engineSparksMax    = (10 + Math.random() * 50) | 0;
    this.engineSparks       = [];


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Initialize and run this object.
     *
     * @see  Core_Stage
     */
    this.init = function init () {
        console.info('This round`s ship specs:');
        console.log({
            "acceleration"       : this.acceleration,
            "speedMax"           : this.speedMax,
            "shieldCooldownTime" : this.shieldCooldownTime,
            "laserCooldownTime"  : this.laserCooldownTime,
            "engineSparksMax"    : this.engineSparksMax,
        });

        this.drawInit()
            .controlInit();

            
        // Todo: Find a better way to handle external dependencies/events
        window.addEventListener('ParticleMove', function(event) {
            var x       = event.detail.x;
                y       = event.detail.x;
                playerX = self.x,
                playerY = self.y;

            //console.log(self.x, self.y);
            //console.log(x,y);
        });

        self.soundEngineThruster.volume = 0.02;
        self.soundEngineThruster.play();
    };


    // ------------------------------------------------------------------------------------------------------- Game loop

    /**
     * Game loop extension.
     * - Lock updating status.
     * - Update speed and position.
     * - Redraw the changes.
     *
     * @public
     */
    this.loop = function loop () {
        if (!self.isUpdating) {
            self.isUpdating = true;

            self.setSpeed()
                .setPosition()
                .boundsBounce()
                .drawUpdate();
        }
    };


    // ------------------------------------------------------------------------------------------------------------ Draw

    /**
     * Create the ship within its Canvas context.

     * @return  {Object}  Self reference.
     */
    this.drawInit = function drawInit () {
        var ctx    = self.ctx,
            canvas = ctx.canvas;

        this.x = (canvas.width  / 2);
        this.y = (canvas.height / 2) + 100;

        ctx.filter = 'sharpen';

        ctx.drawImage(this.sprite, this.x, this.y);

        return self;
    };

    /**
     * Update the ship and its effects within its Canvas context.

     * @return  {Object}  Self reference.
     */
    this.drawUpdate = function drawUpdate () {
        var ctx         = self.ctx,
            ctxUnder    = self.ctxCanvasCopyUnder,
            ctxOver     = self.ctxCanvasCopyOver,
            videoShield = self.videoShield,
            sprite      = self.sprite;

        CanvasHelper.clear(self.ctx);
        self.drawRotation();


        if (self.shieldActive) {
            sprite = self.spriteShielded;

            ctx.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2));

            /* * /
            CanvasHelper
                .clear(ctxUnder)
                .clear(ctxOver);

            videoShield.play();

            ctxUnder.drawImage(sprite, 0, 0);
            /* */

            // Todo - Fix: Blend mode doesn't work as desired and creates black border
            /* * /
            ctxOver.drawImage(videoShield, 13, 15);
            ctxOver.blendOnto(ctxUnder, 'add');
            /* * /
            // 'src-in' could create some sort of cloaking
            // This is a dirty fix, still looking bad but less worse
            ctxOver.drawImage(videoShield, 13, 25);
            ctxOver.blendOnto(ctxUnder, 'src-in');

            ctx.drawImage(self.CanvasCopyUnder, -(sprite.width / 2), -(sprite.height / 2));
            /* */
        }
        else {
            ctx.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2));
        }

        self.drawEngineFire(-14, 20)
            .drawEngineFire(14, 20);

        ctx.restore();

        /* * /
        ctx.save();
        ctx.strokeStyle = 'white';
        ctx.strokeRect(self.x-20, self.y-70, 40, 100);
        ctx.restore();
        /* */

        self.isUpdating = false;

        
        return self;
    };

    /**
     * Rotate the canvas and reposition its content to the center.
     *
     * @see     http://developer.apple.com/library/safari/#documentation/AudioVideo/Conceptual/HTML-canvas-guide/...
     * @return  {Object}  Self reference.
     */
    this.drawRotation = function drawRotation () {
        var degree = self.rotation,
            radian = degree * (Math.PI / 180),
            ctx    = self.ctx;

        ctx.save();
        ctx.translate(self.x, self.y);
        ctx.rotate(radian);

        return self;
    };


    // ----------------------------------------------------------------------------------- Particles

    /**
     * Draw engine particle fire.
     *
     * @return  {Object}  Self reference.
     */
    this.drawEngineFire = function drawEngineFire (posX, posY) {
        var sparks = self.engineSparks,
            ctx    = self.ctx,
            i, o, obj, vx,
            x      = posX,
            y      = posY,
            renderMaxSparks = self.engineSparksMax / 4;

        if (self.movingDirection === 'up') {
            renderMaxSparks = self.engineSparksMax;
        }

        if (!sparks.length) {
            for (i = 0; i <= self.engineSparksMax; i++) {
                obj          = new Object();
                obj.lifetime = Math.round(50 + Math.random() * 50);
                obj.size     = 1 +  2 * Math.random();
                obj.x        = x +  5 * Math.random();
                obj.y        = y + 10 * Math.random();
                sparks.push(obj);
            }
        }
        else {
            var i = renderMaxSparks;

            for (obj in sparks) {
                if (i > 0) {
                    i--;
                }
                else {
                    // console.warn('STOP RENDERING AT: ' + i);
                    break;
                }

                o           = sparks[obj];
                o.fillStyle = 'hsla('+ (0 + Math.round(Math.random() * 50)) +', 100%, 70%, '+ (o.lifetime/100) +')';
                o.lifetime--;

                // Reset
                if (!o.lifetime) {
                    o.lifetime = Math.round(50 + Math.random() * 50);
                    o.size     = 1 +  2 * Math.random();
                    o.x        = x +  5 * Math.random();
                    o.y        = y + 10 * Math.random();
                }

                vx   = -1 * Math.random() + 0.5;
                o.x += vx * Math.random() * 2;
                o.y += vx * Math.random() * 2;

                ctx.fillStyle = o.fillStyle;
                ctx.fillRect(o.x-o.size/2, o.y-o.size/2, o.size, o.size);
            }
        }


        return self;
    };


    // -------------------------------------------------------------------------------------------------------- Controls

    /**
     * Enable controls.
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.controlInit = function controlInit () {
        document.addEventListener('keydown', this.keyControlDown, false);
        document.addEventListener('keyup',   this.keyControlUp,   false);

        return self;
    };

    /**
     * Control pressed keys.
     *
     * - All keys can be pressed simultaneously and repeated times, which allows for smooth movement.
     * - Some keys require special settings to prevent multiple key presses (block the functionality).
     *
     * @todo    Outsource interval closure function.
     * @param   {Object}  event  Keyboard event.
     * @private
     */
    this.keyControlDown = function keyControlDown (event) {
        var code             = event.which,
            fireKeyPressed   = false,
            shieldKeyPressed = false;

        self.movingDirection = '';
        self.soundEngineThruster.volume = 0.02;


        if (!trackedKeys[code]) {
            return;
        }

        if (!keys[code]) {
            keys[code] = true;
            keysCount++;
        }


        if (keyInterval !== null) {
            return;
        }

        keyInterval = setInterval(function onInterval () {
            // Todo: Find a way to allow permanent fire as optional mode (it's also attached to audio and visuals)
            var allowPermanentFire = false,
                direction          = '';

            // F
            if (keys[70] && (allowPermanentFire ? true : !fireKeyPressed)) {
                if (self.shieldActive === false) {
                    fireKeyPressed = true;
                    direction = 'F';
                    event.preventDefault();
                    self.fireLaser();
                }
                else {
                    // Laser trigger blocked
                    var sound = self.soundFuncBlocked;
                    sound.volume = 0.2;
                    sound.play();
                }
            }

            //  C (67)
            if (keys[67] && !shieldKeyPressed) {
                shieldKeyPressed = true;
                direction = 'C';
                event.preventDefault();
                self.enableShield();
            }

            // Check if north or south
            if (keys[119] || keys[87] || keys[38]) {
                direction = 'n';
                event.preventDefault();
                self.moveUp();
                self.movingDirection = 'up';
                self.soundEngineThruster.volume = 0.06;
            }
            else if (keys[115] || keys[83] || keys[40]) {
                direction = 's';
                event.preventDefault();
                self.moveDown();
                self.movingDirection = 'down';
                self.soundEngineThruster.volume = 0.04;
            }

            // Concat west or east
            if (keys[97] || keys[65] || keys[37]) {
                direction += 'w';
                event.preventDefault();
                self.moveLeft();
                //self.rotateLeft();
                self.movingDirection = 'left';
                self.soundEngineThruster.volume = 0.05;
            }
            else if (keys[100] || keys[68] || keys[39]) {
                direction += 'e';
                event.preventDefault();
                //self.rotateRight();
                self.moveRight();
                self.movingDirection = 'right';
                self.soundEngineThruster.volume = 0.05;
            }

            //keyCallback(direction);

        }, FPS);
    };

    /**
     * Control up keys and update all pressed ones.
     *
     * @param  {Object}  event  Keyboard event.
     * @private
     */
    this.keyControlUp = function keyControlUp (event) {
        var code = event.which;

        if (keys[code]) {
            delete keys[code];
            keysCount--;
        }

        // Check if keyboard movement stopped.
        if ((trackedKeys[code]) && (keysCount === 0)) {
            clearInterval(keyInterval);
            keyInterval = null;
        }
    };


    // ----------------------------------------------------------------------------------------------------- Fire weapon

    /**
     * Fire laser weapon, play sound and enable cooldown timer.
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.fireLaser = function fireLaser () {
        var sound = self.soundFuncBlocked,
            Weapon_Laser;


        if (!self.laserCooldown) {
            // Reset FX for next animation
            Fx.reset();

            self.soundLaser = document.getElementById('SoundLaser-' + MathHelper.getRandom(1, 2));
            self.soundLaser.play();

            Weapon_Laser = new Obj_Weapon_Laser();
            Stage.add(Weapon_Laser, 'Weapons');
            Weapon_Laser.run(self.x - 110, self.y - 225, self.rotation);

            self.laserCooldown = true;
            window.setTimeout(self.fireLaserCooldown, self.laserCooldownTime);
        }
        else {
            // Laser trigger blocked
            sound.volume = 0.2;
            sound.play();
        }


        return self;
    };

    /**
     * Laser cooldown timer.
     * Re-enable weapon.
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.fireLaserCooldown = function fireLaserCooldown () {
        var sound = self.soundLaserReady;

        self.laserCooldown = false;
        sound.volume       = 0.4;
        sound.play();

        return self;
   };


    // --------------------------------------------------------------------------------------------------------- Shields

    /**
     * Shields.
     * If shield does not require a cooldown, it can be either enabled or disabled.
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.enableShield = function enableShield () {
        var audioShield, 
            audioShieldCharge;


        if (!self.shieldCooldown) {
            if (!self.shieldActive) {
                self.shieldActive   = true;
                self.shieldCooldown = true;

                audioShieldCharge        = self.SoundShieldCharge;
                audioShieldCharge.volume = 0.2;
                audioShieldCharge.play();

                window.setTimeout(function() {
                    audioShield        = self.soundShieldEnabled;
                    audioShield.volume = 0.3;
                    audioShield.play();
                }, 100);

                window.setTimeout(self.shieldSwitchCooldown, self.shieldCooldownTime);
            }
            else {
                self.shieldActive = false;
            }

            self.drawUpdate();
            
            customEvent = new CustomEvent('PlayerShieldActive', {detail: {'active' : self.shieldActive}});
            window.dispatchEvent(customEvent);
        }
        else {
            audioShield        = self.soundFuncBlocked;
            audioShield.volume = 0.3;
            audioShield.play();
        }


        return self;
    };

    /**
     * Shield cooldown timer that
     * indirectly re-enables the weapon.
     *
     * @private
     */
    this.shieldSwitchCooldown = function shieldSwitchCooldown () {
        self.shieldCooldown = false;
    };


    // -------------------------------------------------------------------------------------------------------- Movement
    // --------------------------------------------------------------------------------------- Speed

    /**
     * Set speed depending on velocity.
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.setSpeed = function setSpeed ()  {
        var friction = self.friction,
            speed    = self.speed,
            speedMax = self.speedMax,
            vx       = self.velocityX,
            vy       = self.velocityY;

        self.velocityX *= friction;
        self.velocityY *= friction;
        self.speed     *= friction;


        if (speed > speedMax) {
            self.speed = speedMax;
        }

        if (vx > speedMax) {
            self.velocityX = speedMax;
        }
        else if (vx < -speedMax) {
            self.velocityX = -speedMax;
        }

        if (vy > speedMax) {
            self.velocityY = speedMax;
        }
        else if (vy < -speedMax) {
            self.velocityY = -speedMax;
        }


        return self;
    };


    // ---------------------------------------------------------------------------------------- Move

    /**
     * Move ship to the left.
     *
     * @private
     */
    this.moveLeft = function moveLeft () {
        self.velocityX -= self.acceleration;
    };

    /**
     * Move ship to the right.
     *
     * @private
     */
    this.moveRight = function moveRight () {
        self.velocityX += self.acceleration;
    };

    /**
     * Move ship up / accelerate.
     *
     * @private
     */
    this.moveUp = function moveUp () {
        var acc = self.acceleration;

        self.velocityY -= acc;
        self.speed     += acc;
    };

    /**
     * Move ship down / brake.
     */
    this.moveDown = function moveDown () {
        var acc = self.acceleration;

        self.velocityY += acc;
        self.speed     -= acc;
    };


    // -------------------------------------------------------------------------------------- Rotate

    /**
     * Set ship rotation in degrees.
     *
     * @private
     */
    this.rotateLeft = function rotateLeft () {
        self.rotation -= self.rotationRadius;

        if (self.rotation <= -360) {
            self.rotation = 0;
        }
    };

    /**
     * Set ship rotation in degrees.
     *
     * @private
     */
    this.rotateRight = function rotateRight () {
        self.rotation += self.rotationRadius;

        if (self.rotation >= 360) {
            self.rotation = 0;
        }
    };


    // --------------------------------------------------------------------------------- Positioning

    /**
     * Update position depending on its velocity.
     *
     * Two variants:
     * - Position depending on velocity.
     * - Position depending on rotation. [disabled]
     *
     * @return  {Object}  Self reference.
     * @private
     */
    this.setPosition = function setPosition () {
        /* */
        self.x += self.velocityX;
        self.y += self.velocityY;
        /* * /
        self.speed = Number(self.speed.toFixed(2));
        self.x += self.getPosX() * self.friction;
        self.y += self.getPosY() * self.friction;
        /* */

        return self;
    };

    /**
     * Get x-position based on rotation and speed.
     *
     * @return   {Number}  Laser X position.
     * @private
     */
    this.getPosX = function getPosX () {
        var radian = self.rotation * (Math.PI / 180),
            pos    = Math.sin(radian) * self.speed;

        return pos;
    };

    /**
     * Get y-position based on rotation and speed.
     *
     * @return   {Number}  Laser Y position.
     * @private
     */
    this.getPosY = function getPosY () {
        var radian = self.rotation * (Math.PI / 180),
            pos    = Math.cos(radian) * self.speed * -1;

        return pos;
    };


    // ---------------------------------------------------------------------------------------------------------- Bounds

    /**
     * Bounce off the boundaries.
     *
     * @todo              Subtract object size.
     * @return  {Object}  Self reference.
     * @private
     */
    this.boundsBounce = function boundsBounce () {
        var canvas = self.ctx.canvas,
            width  = canvas.width,
            height = canvas.height,
            x      = self.x,
            y      = self.y,
            vx     = self.velocityX;
            vy     = self.velocityY;


        if (x >= width) {
            self.x         = width;
            self.velocityX = -vx;
        }
        else if (x < 0) {
            self.x         = 0;
            self.velocityX = -vx;
        }


        if (y >= height) {
            self.y         = height;
            self.velocityY = -vy;
        }
        else if (y < 0) {
            self.y         = 0;
            self.velocityY = -vy;
        }


        return self;
    };

}

