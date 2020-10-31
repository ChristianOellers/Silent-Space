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
  this.musicElement = document.getElementById('Music-Ambient');
  this.appElement = document.getElementById('App');

  // General
  this.backgroundCount = 5;
  this.particleCount = 3;

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
    const rndStaticBackground = (Math.random() * this.backgroundCount) | 0;

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
    for (let i = 0; i < this.particleCount; i++) {
      this.Stage.add(new this.ParticleType(), 'Particles');
    }
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
   * @private
   */
  this.playMusic = () => {
    const { musicElement } = this;

    musicElement.volume = 0.5;

    musicElement.load();
    musicElement.play();
  };
}
