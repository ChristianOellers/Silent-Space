/**
 * Create game scene with objects and music.
 *
 * @†odo Optimize: Make background types a choice for users?
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
  this.rootElement = document.getElementById('App-Container');
  // this.appElement = document.getElementById('App');

  // DOM - Audio
  this.musicElements = [document.getElementById('Music-Ambient-Light'), document.getElementById('Music-Ambient-Dramatic')];
  this.musicElement = null; // Randomly chosen

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

    this.setMusic();
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

    // @todo Optimize: Use or remove background variant?
    this.Background.run();
    this.playMusic();
  };

  /**
   * Choose random ambient music.
   *
   * @private
   */
  this.setMusic = () => {
    const rnd = parseInt((Math.random() * 100) % this.musicElements.length, 10);

    this.musicElement = this.musicElements[rnd];
  };

  /**
   * Set random background.
   *
   * @†odo Optimize: What background variant to use? Scroll or Ken Burns?
   * @private
   */
  this.createBackground = () => {
    const { rootElement } = this;
    const rndStaticBackground = (Math.random() * this.backgrounds) | 0;

    this.Background.init();

    rootElement.classList.add('static-image');
    rootElement.classList.add(`static-image-${rndStaticBackground}`);
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
