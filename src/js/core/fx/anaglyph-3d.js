/**
 * Anaglyph 3D stereoscopic effect.
 *
 * @module
 */
function Core_Fx_Anaglyph3D() {
  // DOM
  this.svgFilterLeft = document.getElementById('Fx-Anaglyph3D-Left');
  this.svgFilterRight = document.getElementById('Fx-Anaglyph3D-Right');

  // Animation
  this.totalTime = 30; // Ms

  // State
  this.isRunning = false;

  // Internals
  this.interval = null;
  this.currentTime = 0;

  /**
   * Init public events.
   *
   * @public
   */
  this.init = () => {
    this.bind();
  };

  /**
   * Run effect.
   *
   * @public
   */
  this.run = () => {
    if (!this.isRunning) {
      this.isRunning = true;
      this.animate();
    }
  };

  /**
   * Animate effect.
   *
   * @private
   */
  this.animate = () => {
    const dxLeft = +this.svgFilterLeft.getAttribute('dx');
    const dxRight = +this.svgFilterRight.getAttribute('dx');

    this.interval = setInterval(() => {
      this.currentTime++;

      if (this.currentTime < this.totalTime) {
        this.svgFilterLeft.setAttribute('dx', Math.random() * -4);
        this.svgFilterRight.setAttribute('dx', Math.random() * 4);
      } else {
        clearInterval(this.interval);

        this.svgFilterLeft.setAttribute('dx', 0);
        this.svgFilterRight.setAttribute('dx', 0);
        this.isRunning = false;
        this.interval = null;
        this.currentTime = 0;
      }
    }, APP_GLOBAL.FPS);
  };
}
