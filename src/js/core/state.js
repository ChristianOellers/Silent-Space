/**
 * Global game state.
 *
 * @todo Refactor: Decouple difficulty concept from generic state.
 * @todo Improve: Don't immediately increase difficulty on app start.
 * @module
 */
function Core_State() {
  // Difficulty: On every reached interval, difficulty slightly incrases
  this.difficulty = 0;
  this.difficultyInterval = 1000;

  // Keep track of player
  this.playerPosition = null; // Vector2D

  // Internals
  this.playingTime = 0;
  this.interval = null;

  /**
   * Init, set states.
   */
  this.init = () => {
    this.increaseDifficultyOverTime();
  };

  /**
   * Set difficulty over time.
   * Value increases with each interval step reached.
   *
   * @private
   */
  this.increaseDifficultyOverTime = () => {
    this.interval = setInterval(() => {
      const difference = this.playingTime % this.difficultyInterval ? 0 : 1;

      this.difficulty += difference;
      this.playingTime++;

      if (difference) {
        customEvent = new CustomEvent('State-Difficulty');
        window.dispatchEvent(customEvent);
      }
    }, APP_GLOBAL.FPS);
  };
}
