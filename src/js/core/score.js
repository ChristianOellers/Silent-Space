/**
 * Score + Stats.
 *
 * @module
 */
function Core_Score() {
  // DOM
  this.hitsElement = document.getElementById('Score-Hits');
  this.shotsElement = document.getElementById('Score-Shots');

  // Score
  this.score = {
    hits: 0,
    shots: 0,
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
}
