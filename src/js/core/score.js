/**
 * Score + Stats.
 *
 * @todo Refactor: Duplicate code can be optimized.
 * @todo WIP: Implement scoring to be dynamic, allow negative values.
 * @module
 */
function Core_Score() {
  // DOM
  this.hitsElement = document.getElementById('Score-Hits');
  this.shotsElement = document.getElementById('Score-Shots');
  this.scoreElement = document.getElementById('Score-Score');

  // Score
  // - Score '-10' cheats around immediate start trigger
  this.score = {
    hits: 0, // Space debris (losses)
    shots: 0, // Shots (explosions) - No effect
    score: -10, // Time survived vs. losses
  };

  /**
   * Set dependencies.
   *
   * @public
   */
  this.init = () => {
    this.bind();
  };

  /**
   * Bind events.
   *
   * @private
   */
  this.bind = () => {
    window.addEventListener('Player-Hit', this.onPlayerHit.bind(this));
    window.addEventListener('Player-Shot', this.onPlayerShot.bind(this));
    window.addEventListener('Player-Score', this.onPlayerScore.bind(this));
  };

  /**
   * Render view.
   *
   * @private
   */
  this.render = () => {
    this.hitsElement.innerHTML = this.score.hits;
    this.shotsElement.innerHTML = this.score.shots;
    this.scoreElement.innerHTML = this.score.score;
  };

  /**
   * On player hits (by space debris).
   *
   * @private
   */
  this.onPlayerHit = (_event) => {
    this.score.hits++;
    this.render();
  };

  /**
   * On player shots (weapon hits).
   *
   * @private
   */
  this.onPlayerShot = (_event) => {
    this.score.shots++;
    this.render();
  };

  /**
   * On player score.
   * - Grant +10 for good actions
   * - Grant -50 (or more) for bad actions
   *
   * @private
   */
  this.onPlayerScore = (event) => {
    let score = 10;

    if (event.detail) {
      score = -(50 * this.score.hits);
    }

    this.score.score += score;
    this.render();
  };
}
