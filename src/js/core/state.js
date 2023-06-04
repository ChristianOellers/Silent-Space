/**
 * Global game state.
 *
 * @todo Refactor: Decouple difficulty concept from generic state.
 * @todo Refactor: Replace intervals by requestAnimationFrame.
 * @todo Improve: Don't immediately increase difficulty on app start.
 * @module
 */
function Core_State() {
  // Difficulty: On every reached interval, difficulty slightly incrases
  // - '-1' is a cheat to ignore the immediate interval execution
  this.difficulty = -1;
  this.difficultyInterval = 1000;

  // Keep track of player
  this.playerPosition = null; // Vector2D

  // Internals
  this.playingTime = 0;
  this.intervalDifficulty = null;
  this.intervalScore = null;

  /**
   * Init, set states.
   */
  this.init = () => {
    this.increaseScore();
    this.increaseDifficulty();
  };

  /**
   * Set difficulty over time.
   * Value increases with each interval step reached.
   *
   * @private
   */
  this.increaseScore = () => {
    this.intervalDifficulty = setInterval(() => {
      customEvent = new CustomEvent('Player-Score');
      window.dispatchEvent(customEvent);
    }, 1000);
  };

  /**
   * Set difficulty over time.
   * Value increases with each interval step reached.
   *
   * @private
   */
  this.increaseDifficulty = () => {
    this.intervalScore = setInterval(() => {
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
