/**
 * Menu.
 *
 * @module
 */
function Core_Ui_Menu() {
  // Dependencies
  this.readyCallback = null;

  // Assets
  this.btnPlayElement = document.getElementById('Ui-Btn-Play');
  this.menuElement = document.getElementById('Ui-Menu');

  /**
   * Set dependencies.
   *
   * @public
   */
  this.init = () => {
    this.bind();
  };

  /**
   * Register 'ready' callback.
   *
   * @param {Function} fn Callback
   * @public
   */
  this.ready = (fn) => {
    this.readyCallback = fn;
  };

  /**
   * Hide menu.
   *
   * @private
   */
  this.hideMenu = () => {
    this.menuElement.classList.add('fx-fade-menu');
    this.btnPlayElement.classList.add('fx-fade-menu');

    window.setTimeout(() => {
      this.btnPlayElement.classList.add('hidden');
    }, 1000);
  };

  /**
   * Bind UI events.
   *
   * @private
   */
  this.bind = () => {
    this.btnPlayElement.addEventListener('click', this.onPlay);
  };

  /**
   * UI event callback - Play.
   * Trigger external callback function.
   *
   * @private
   */
  this.onPlay = () => {
    if (this.readyCallback) {
      this.readyCallback();
      this.hideMenu();

      // Reset to prevent duplicate calls
      this.readyCallback = null;
    }
  };
}
