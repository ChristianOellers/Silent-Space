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
   * @todo Optimize: Split complex code
   * @private
   */
  this.animate = () => {
    const svgFilterL = this.svgFilterLeft;
    const svgFilterR = this.svgFilterRight;
    const dxLeft = +svgFilterL.getAttribute('dx');
    const dxRight = +svgFilterR.getAttribute('dx');

    this.interval = setInterval(() => {
      this.currentTime++;

      if (this.currentTime < this.totalTime) {
        svgFilterL.setAttribute('dx', Math.random() * -4);
        svgFilterR.setAttribute('dx', Math.random() * 4);
      } else {
        clearInterval(this.interval);

        svgFilterL.setAttribute('dx', 0);
        svgFilterR.setAttribute('dx', 0);

        this.isRunning = false;
        this.interval = null;
        this.currentTime = 0;
      }
    }, APP_GLOBAL.FPS);
  };
}
