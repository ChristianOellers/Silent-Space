/**
 * Displacement effect.
 *
 * @module
 */
function Core_Fx_Displace() {
  // DOM - Filters
  this.svgFilter = document.getElementById('Fx-Displace');
  this.svgFilterDisplace = document.querySelector('#Fx-Displace feDisplacementMap');
  this.svgFilterTurbulence = document.querySelector('#Fx-Displace feTurbulence');
  this.svgFilterOffset = document.querySelector('#Fx-Displace feOffset');
  
  // DOM
  this.canvasGame = document.getElementById('Game');
  this.canvasFG = document.getElementById('Foreground');

  // Animation
  this.totalTime = 250; // Ms

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
   * @todo Optimize - Split complex code
   * @private
   */
  this.animate = () => {
    this.canvasGame.classList.add("fx-displace");
    this.canvasFG.classList.add("fx-displace");

    const dx = +this.svgFilterOffset.getAttribute('dx');
    const dy = +this.svgFilterOffset.getAttribute('dy');
    const bfOriginal = +this.svgFilterTurbulence.getAttribute('baseFrequency');
    const scaleOriginal = +this.svgFilterDisplace.getAttribute('scale');

    this.interval = setInterval(() => {
      this.currentTime++;

      // Conceptually; 1->0 from start to end of time (actual values differ)
      const expiryFactor = Math.cos(this.currentTime / (this.totalTime / Math.PI)) + 1;

      const scaleNew = scaleOriginal - (expiryFactor / 2);
      const bfNew = bfOriginal * expiryFactor;

      this.svgFilterTurbulence.setAttribute('baseFrequency', bfNew);
      this.svgFilterDisplace.setAttribute('scale', scaleNew);

      if (this.currentTime >= this.totalTime) {
        clearInterval(this.interval);

        this.svgFilterTurbulence.setAttribute('baseFrequency', bfOriginal);
        this.svgFilterDisplace.setAttribute('scale', scaleOriginal);

        this.canvasGame.classList.remove("fx-displace");
        this.canvasFG.classList.remove("fx-displace");

        this.isRunning = false;
        this.interval = null;
        this.currentTime = 0;
      }
    }, APP_GLOBAL.FPS);
  };
}
