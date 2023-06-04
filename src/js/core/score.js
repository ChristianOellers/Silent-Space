/**
 * Score + Stats.
 *
 * @todo WIP: Implement scoring to be dynamic, allow negative values.
 * @module
 */
function Core_Score() {
  // DOM
  this.hitsElement = document.getElementById('Score-Hits');
  this.shotsElement = document.getElementById('Score-Shots');
  this.scoreElement = document.getElementById('Score-Score');

  // Score
  this.score = {
    hits: 0,
    shots: 0,
    score: 0,
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
   * Update score by type.
   *
   * @private
   */
  this.update = (type) => {
    this.score[type]++;
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
    this.update('hits');
    this.render();
  };

  /**
   * On player shots (weapon hits).
   *
   * @private
   */
  this.onPlayerShot = (_event) => {
    this.update('shots');
    this.render();
  };

  /**
   * On player score.
   *
   * @private
   */
  this.onPlayerScore = (_event) => {
    this.update('score');
    this.render();
  };
}
