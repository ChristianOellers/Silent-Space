/**
 * Player object: The space ship.
 *
 * @todo Refactor: Outsource particles, shield, sound.
 * @todo Refactor: Replace math by library functions.
 * @module
 */
function Obj_Ship_Player() {
  // Dependencies
  this.Ext_Vector2D = null;
  this.FxAnaglyph3D = null;
  this.FxDisplace = null;
  this.MathHelper = null;
  this.WeaponType = null;
  this.State = null;

  // Assets
  this.spriteDamaged = document.getElementById('Asset-Ship-Damaged');
  this.spriteDamagedShielded = document.getElementById('Asset-Ship-Damaged-Shielded');
  this.spriteHealthy = document.getElementById('Asset-Ship-Healthy');
  this.spriteHealthyShielded = document.getElementById('Asset-Ship-Healthy-Shielded');

  // Assets - Sounds
  this.soundShieldEnabled = document.getElementById('Sound-Shield-Enabled');
  this.soundUiFunctionBlocked = document.getElementById('Sound-Ui-Function-Blocked');
  this.soundEngineThruster = document.getElementById('Sound-Engine-Thruster');
  this.soundWeapon = null;

  // Graphic
  this.canvas = document.getElementById('Game');
  this.ctx = this.canvas.getContext('2d');

  // Ship
  this.x = 0; // Current position (x)
  this.y = 0; // Current position (y)
  this.friction = 0.93; // World friction: Close to 1 values create smooth surfaces
  this.velocityX = 0; // Horizontal velocity
  this.velocityY = 0; // Vertical velocity
  this.rotation = 0; // Current rotation
  this.rotationRadius = 5; // How fast the ship can rotate in degrees/frame
  this.speed = 0; // Current speed
  this.speedMax = 5 + Math.random() * 3; // Maximum speed
  this.acceleration = 0.3 + Math.random() * 0.25; // Speed +/- acceleration factor
  this.movingDirection = ''; // Values: up, down, left, right

  // Health
  this.isDamaged = false;

  // Shields
  this.shieldCooldownTime = (500 + Math.random() * 200) | 0; // Time in MS it takes until you can switch shield status.
  this.shieldCooldown = false; // Flag (automatic)
  this.shieldActive = false; // Flag (automatic)

  // Weapon
  this.weaponCooldownTime = (1000 + Math.random() * 500) | 0; // Time in MS it takes until you can fire again.
  this.weaponCooldown = false; // Flag (automatic)

  // Engine
  this.engineSparksMax = (20 + Math.random() * 10) | 0;
  this.engineSparks = [];

  // Internals
  this.isBeingHit = false;
  this.isUpdating = false;

  // DEV + DEBUG
  // Keep empty to randome
  this.overrideWeapon = ''; // beam phaser

  // ------------------------------------------------------------------------------------------------------------ Init

  /**
   * Init, set events and audio.
   */
  this.init = () => {
    this.Ext_Vector2D = Ext_Vector2D;
    this.FxAnaglyph3D = FxAnaglyph3D;
    this.FxDisplace = FxDisplace;
    this.MathHelper = MathHelper;
    this.State = State;

    this.soundUiFunctionBlocked.volume = 0.1;

    this.setWeapon(this.getRandomWeapon());
    this.drawInit();
    this.controlInit();
    this.playSound();

    window.addEventListener('Particle-Move', this.onParticleHit.bind(this));
    window.addEventListener('Player-Shot', this.onPlayerShot.bind(this));
  };

  /**
   * Set player weapon.
   */
  this.setWeapon = (type) => {
    switch (type) {
      case 'beam':
        this.WeaponType = Obj_Weapon_Beam;
        this.soundWeapon = document.getElementById('Sound-Weapon-Beam');
        break;
      case 'phaser':
        this.WeaponType = Obj_Weapon_Phaser;
        this.soundWeapon = document.getElementById('Sound-Weapon-Phaser');
        break;
      default:
        console.error(`Unknown 'type' parameter: ${type}`);
        break;
    }
  };

  /**
   * Play engine sound.
   */
  this.playSound = () => {
    this.soundEngineThruster.volume = 0.02;
    this.soundEngineThruster.play();
  };

  /**
   * React to particle hit.
   * Simply compare coordinates with a range of +/- N pixels.
   */
  this.onParticleHit = (event) => {
    const { x, y } = event.detail;

    // Prevent duplicate hits
    if (this.isBeingHit) {
      return;
    }

    const isInRangeX = Math.abs(x - this.x) <= 25;
    const isInRangeY = Math.abs(y - this.y) <= 50;

    if (isInRangeX && isInRangeY) {
      // Hit's don't count with defense enabled,
      // but the shield will be disabled.
      if (this.shieldActive) {
        this.FxDisplace.run();
        this.hardResetShield();

        customEvent = new CustomEvent('Fx-Displace');
        window.dispatchEvent(customEvent);
        return;
      }

      this.FxAnaglyph3D.run();

      this.isBeingHit = true;
      this.isDamaged = true;

      customEvent = new CustomEvent('Fx-Shake');
      window.dispatchEvent(customEvent);

      customEvent = new CustomEvent('Player-Hit', { detail: true });
      window.dispatchEvent(customEvent);

      // Reset state
      setTimeout(() => {
        FxShake.reset();

        this.isBeingHit = false;
      }, 2000);
    }
  };

  /**
   * React to player shot.
   *
   * Switch weapon (just for demo purposes).
   */
  this.onPlayerShot = (_event) => {
    const weapon = this.getRandomWeapon();

    this.setWeapon(weapon);

    // DEV + DEBUG
    if (this.overrideWeapon) {
      this.setWeapon(this.overrideWeapon);
    }
  };

  /**
   * Get random weapon type.
   *
   * @todo Refactor: Change to polymorphic structure.
   */
  this.getRandomWeapon = () => {
    const rnd = parseInt((Math.random() * 100) % 3, 10);
    let weapon = '';

    switch (rnd) {
      case 0:
        weapon = 'beam';
        break;
      case 1:
        weapon = 'phaser';
        break;
      default:
        weapon = 'laser';
        break;
    }

    return weapon;
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
  this.loop = () => {
    if (!this.isUpdating) {
      this.isUpdating = true;

      this.setSpeed();
      this.setPosition();
      this.boundsBounce();
      this.drawUpdate();
    }
  };

  // ------------------------------------------------------------------------------------------------------------ Draw

  /**
   * Create the ship within its Canvas context.
   */
  this.drawInit = () => {
    const { canvas } = this;
    const { ctx } = this;

    this.x = canvas.width / 2;
    this.y = canvas.height / 2 + 100;

    ctx.filter = 'sharpen';

    ctx.drawImage(this.spriteHealthy, this.x, this.y);
  };

  /**
   * Update the ship and its effects within its Canvas context.
   */
  this.drawUpdate = () => {
    const { ctx } = this;
    let sprite = this.spriteHealthy;

    CanvasHelper.clear(this.ctx);

    // this.drawRotation();
    ctx.save();
    ctx.translate(this.x, this.y);

    if (this.shieldActive) {
      sprite = this.spriteHealthyShielded;

      if (this.isDamaged) {
        sprite = this.spriteDamagedShielded;
      }

      ctx.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2));
    } else {
      if (this.isDamaged) {
        sprite = this.spriteDamaged;
      }

      ctx.drawImage(sprite, -(sprite.width / 2), -(sprite.height / 2));
    }

    this.drawEngineFire(-14, 20);
    this.drawEngineFire(14, 20);

    ctx.restore();

    this.isUpdating = false;
  };

  // ----------------------------------------------------------------------------------- Particles

  /**
   * Draw engine particle fire.
   *
   * @todo Review - Check if spark rendering really works
   */
  this.drawEngineFire = (posX, posY) => {
    const sparks = this.engineSparks;
    const { ctx } = this;
    let i;
    let o;
    let obj;
    let vx;
    const x = posX;
    const y = posY;
    let renderMaxSparks = this.engineSparksMax / 4;

    if (this.movingDirection === 'up') {
      renderMaxSparks = this.engineSparksMax;
    }

    const sparksToRender = renderMaxSparks | 0;

    if (!sparks.length) {
      for (i = 0; i <= sparksToRender; i++) {
        obj = {};
        obj.lifetime = Math.round(50 + Math.random() * 50);
        obj.size = 1 + 2 * Math.random();
        obj.x = x + 5 * Math.random();
        obj.y = y + 10 * Math.random();
        sparks.push(obj);
      }
    } else {
      i = sparksToRender;

      // eslint-disable-next-line no-restricted-syntax, guard-for-in
      for (obj in sparks) {
        if (i > 0) {
          i--;
        } else {
          break;
        }

        o = sparks[obj];
        o.fillStyle = `hsla(${0 + Math.round(Math.random() * 50)}, 100%, 70%, ${o.lifetime / 100})`;
        o.lifetime--;

        // Reset
        if (!o.lifetime) {
          o.lifetime = Math.round(50 + Math.random() * 50);
          o.size = 1 + 2 * Math.random();
          o.x = x + 5 * Math.random();
          o.y = y + 10 * Math.random();
        }

        vx = -1 * Math.random() + 0.5;
        o.x += vx * Math.random() * 2;
        o.y += vx * Math.random() * 2;

        ctx.fillStyle = o.fillStyle;
        ctx.fillRect(o.x - o.size / 2, o.y - o.size / 2, o.size, o.size);
      }
    }
  };

  // -------------------------------------------------------------------------------------------------------- Controls

  /**
   * Enable controls.
   *
   * @private
   */
  this.controlInit = () => {
    document.addEventListener('keydown', this.keyControlDown.bind(this), false);
    document.addEventListener('keyup', this.keyControlUp.bind(this), false);
  };

  /**
   * Control pressed keys.
   *
   * - All keys can be pressed simultaneously and repeated times, which allows for smooth movement.
   * - Some keys require special settings to prevent multiple key presses (block the functionality).
   *
   * @todo    Refactor: Outsource interval closure function.
   * @param   {Object}  event  Keyboard event.
   * @private
   */
  this.keyControlDown = (event) => {
    const code = event.which;
    let fireKeyPressed = false;
    let shieldKeyPressed = false;

    this.movingDirection = '';
    this.soundEngineThruster.volume = 0.02;

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

    keyInterval = setInterval(() => {
      // @todo Feature: Find a way to allow permanent fire as optional mode.
      // - Note: It's also attached to audio and visuals.
      const allowPermanentFire = false;
      let direction = '';

      // F
      if (keys[70] && (allowPermanentFire ? true : !fireKeyPressed)) {
        if (this.shieldActive === false) {
          fireKeyPressed = true;
          direction = 'F';

          event.preventDefault();
          this.fireWeapon();
        } else {
          // Weapon trigger blocked
          const sound = this.soundUiFunctionBlocked;
          sound.play();
        }
      }

      //  C (67)
      if (keys[67] && !shieldKeyPressed) {
        shieldKeyPressed = true;
        direction = 'C';

        event.preventDefault();
        this.enableShield();
      }

      // Check if north or south
      if (keys[119] || keys[87] || keys[38]) {
        direction = 'n';

        event.preventDefault();
        this.moveUp();

        this.movingDirection = 'up';
        this.soundEngineThruster.volume = 0.05;
      } else if (keys[115] || keys[83] || keys[40]) {
        direction = 's';

        event.preventDefault();
        this.moveDown();

        this.movingDirection = 'down';
        this.soundEngineThruster.volume = 0.03;
      }

      // Concat west or east
      if (keys[97] || keys[65] || keys[37]) {
        direction += 'w';

        event.preventDefault();
        this.moveLeft();
        // this.rotateLeft();

        this.movingDirection = 'left';
        this.soundEngineThruster.volume = 0.04;
      } else if (keys[100] || keys[68] || keys[39]) {
        direction += 'e';

        event.preventDefault();
        // this.rotateRight();
        this.moveRight();

        this.movingDirection = 'right';
        this.soundEngineThruster.volume = 0.04;
      }

      // keyCallback(direction);
    }, APP_GLOBAL.FPS);
  };

  /**
   * Control up keys and update all pressed ones.
   *
   * @param  {Object}  event  Keyboard event.
   * @private
   */
  this.keyControlUp = (event) => {
    const code = event.which;

    if (keys[code]) {
      delete keys[code];
      keysCount--;
    }

    // Check if keyboard movement stopped.
    if (trackedKeys[code] && keysCount === 0) {
      clearInterval(keyInterval);
      keyInterval = null;
    }
  };

  // ----------------------------------------------------------------------------------------------------- Fire weapon

  /**
   * Fire weapon, play sound and enable cooldown timer.
   *
   * @private
   */
  this.fireWeapon = () => {
    const sound = this.soundUiFunctionBlocked;

    if (!this.weaponCooldown) {
      // Reset FX for next animation
      FxShake.reset();

      this.soundWeapon.volume = 0.5;
      this.soundWeapon.play();

      const Weapon = new this.WeaponType();

      Stage.add(Weapon, 'Weapons');

      Weapon.init();
      Weapon.run(this.x - 110, this.y - 225, this.rotation);

      this.weaponCooldown = true;

      window.setTimeout(this.fireWeaponCooldown.bind(this), this.weaponCooldownTime);
    } else {
      // Weapon trigger blocked
      sound.play();
    }
  };

  /**
   * Weapon cooldown timer.
   * Re-enable weapon.
   *
   * @private
   */
  this.fireWeaponCooldown = () => {
    this.weaponCooldown = false;
  };

  // --------------------------------------------------------------------------------------------------------- Shields

  /**
   * Shields.
   * If shield does not require a cooldown, it can be either enabled or disabled.
   *
   * @private
   */
  this.enableShield = () => {
    let audioShield;

    if (!this.shieldCooldown) {
      if (!this.shieldActive) {
        this.shieldActive = true;
        this.shieldCooldown = true;

        window.setTimeout(() => {
          audioShield = this.soundShieldEnabled;
          audioShield.volume = 0.3;
          audioShield.play();
        }, 100);

        window.setTimeout(this.shieldSwitchCooldown.bind(this), this.shieldCooldownTime);
      } else {
        this.shieldActive = false;
      }

      this.drawUpdate();

      customEvent = new CustomEvent('Player-Shield-Active', { detail: { active: this.shieldActive } });
      window.dispatchEvent(customEvent);
    } else {
      audioShield = this.soundUiFunctionBlocked;
      audioShield.play();
    }
  };

  /**
   * Shield cooldown timer that
   * indirectly re-enables the weapon.
   *
   * @private
   */
  this.shieldSwitchCooldown = () => {
    this.shieldCooldown = false;
  };

  /**
   * Shield can become inactive immediately.
   *
   * @private
   */
  this.hardResetShield = () => {
    this.shieldActive = false;
    this.shieldCooldown = false;
  };

  // -------------------------------------------------------------------------------------------------------- Movement
  // --------------------------------------------------------------------------------------- Speed

  /**
   * Set speed depending on velocity.
   *
   * @private
   */
  this.setSpeed = () => {
    const { friction } = this;
    const { speed } = this;
    const { speedMax } = this;
    const vx = this.velocityX;
    const vy = this.velocityY;

    this.velocityX *= friction;
    this.velocityY *= friction;
    this.speed *= friction;

    if (speed > speedMax) {
      this.speed = speedMax;
    }

    if (vx > speedMax) {
      this.velocityX = speedMax;
    } else if (vx < -speedMax) {
      this.velocityX = -speedMax;
    }

    if (vy > speedMax) {
      this.velocityY = speedMax;
    } else if (vy < -speedMax) {
      this.velocityY = -speedMax;
    }
  };

  // ---------------------------------------------------------------------------------------- Move

  /**
   * Move ship to the left.
   *
   * @private
   */
  this.moveLeft = () => {
    this.velocityX -= this.acceleration * 1.25;
  };

  /**
   * Move ship to the right.
   *
   * @private
   */
  this.moveRight = () => {
    this.velocityX += this.acceleration * 1.25;
  };

  /**
   * Move ship up / accelerate.
   *
   * @private
   */
  this.moveUp = () => {
    const acc = this.acceleration;

    this.velocityY -= acc;
    this.speed += acc;
  };

  /**
   * Move ship down / brake.
   */
  this.moveDown = () => {
    const acc = this.acceleration;

    this.velocityY += acc;
    this.speed -= acc;
  };

  // -------------------------------------------------------------------------------------- Rotate

  /**
   * Set ship rotation to left.
   *
   * @private
   */
  this.rotateLeft = () => {
    this.rotation -= this.rotationRadius;

    if (this.rotation <= -360) {
      this.rotation = 0;
    }
  };

  /**
   * Set ship rotation to right.
   *
   * @private
   */
  this.rotateRight = () => {
    this.rotation += this.rotationRadius;

    if (this.rotation >= 360) {
      this.rotation = 0;
    }
  };

  // --------------------------------------------------------------------------------- Positioning

  /**
   * Update position depending on its velocity.
   *
   * Two variants:
   * - Position depending on velocity
   * - Position depending on rotation (inactive)
   *
   * @private
   */
  this.setPosition = () => {
    this.x += this.velocityX;
    this.y += this.velocityY;

    this.State.playerPosition = new this.Ext_Vector2D(this.x, this.y);

    /* * /
    // @todo Check - Speed change seems not useful?
    this.speed = Number(this.speed.toFixed(2));
    this.x += this.getPosX() * this.friction;
    this.y += this.getPosY() * this.friction;
    /* */
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

  // ---------------------------------------------------------------------------------------------------------- Bounds

  /**
   * Bounce off boundaries.
   *
   * @todo Improve: Subtract object size.
   * @private
   */
  this.boundsBounce = () => {
    const { canvas } = this.ctx;
    const { width } = canvas;
    const { height } = canvas;
    const { x } = this;
    const { y } = this;
    const vx = this.velocityX;
    const vy = this.velocityY;

    if (x >= width) {
      this.x = width;
      this.velocityX = -vx;
    } else if (x < 0) {
      this.x = 0;
      this.velocityX = -vx;
    }

    if (y >= height) {
      this.y = height;
      this.velocityY = -vy;
    } else if (y < 0) {
      this.y = 0;
      this.velocityY = -vy;
    }
  };
}
