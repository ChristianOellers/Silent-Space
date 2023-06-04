/**
 * Create game scene with objects and music.
 *
 * @module
 */
function Core_Scene() {
  // Dependencies
  this.Background = null;
  this.Hud = null;
  this.ParticleType = null;
  this.Player = null;
  this.Stage = null;

  // DOM
  this.musicElement1 = document.getElementById('Music-Ambient-Light');
  this.musicElement2 = document.getElementById('Music-Ambient-Dramatic');
  this.appElement = document.getElementById('App');

  // General
  this.musicVolume = 0.25;
  this.backgrounds = 5;

  // Cannot be higher now - See 'Stage' todo
  // this.particleCount = 1;

  /**
   * Set game objects.
   *
   * @public
   */
  this.init = () => {
    this.Background = Background;
    this.Hud = UiHud;
    this.ParticleType = Obj_Particle_Small;
    this.Player = Ship_Player;
    this.Stage = Stage;

    this.createBackground();
    this.bind();
  };

  /**
   * Bind events.
   *
   * @private
   */
  this.bind = () => {
    window.addEventListener('Fx-Displace', this.onDisplaceFx.bind(this));
  };

  /**
   * Run scene.
   *
   * @public
   */
  this.run = () => {
    this.createObjects();
    this.createPlayer();

    this.Background.run();
    this.playMusic();
  };

  /**
   * Set random background.
   *
   * @private
   */
  this.createBackground = () => {
    const { appElement } = this;
    const rndStaticBackground = (Math.random() * this.backgrounds) | 0;

    this.Background.init();

    appElement.classList.add('static-image');
    appElement.classList.add(`static-image-${rndStaticBackground}`);
  };

  /**
   * Set objects.
   *
   * @private
   */
  this.createObjects = () => {
    const p = new this.ParticleType();
    this.Stage.add(p, 'Particles');

    /* Future use * /
    for (let i = 0; i < this.particleCount; i++) {
      const p = new this.ParticleType();
      this.Stage.add(p, 'Particles');
    }
    /* */
  };

  /**
   * Create player object.
   *
   * @private
   */
  this.createPlayer = () => {
    const { Stage } = this;

    Stage.add(this.Player, 'Game');
    Stage.add(this.Hud, 'Hud');
  };

  /**
   * Play music.
   *
   * @todo Review: Loading music might not be required?
   * @private
   */
  this.playMusic = () => {
    const { musicElement } = this;

    musicElement.load();
    musicElement.volume = this.musicVolume;
    musicElement.play();
  };

  /**
   * On displace Fx (player hit with shield).
   *
   * @todo Refactor: Unfortunate coupling to effect 'dictating' time
   * @see Core_Fx_Displace
   * @private
   */
  this.onDisplaceFx = (_event) => {
    this.musicElement.volume = this.musicVolume / 2;

    setTimeout(() => {
      this.musicElement.volume = this.musicVolume;
    }, 250);
  };
}
