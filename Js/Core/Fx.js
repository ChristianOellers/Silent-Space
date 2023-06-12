/**
 * Game effects.
 *
 * @todo  Improve method consistency by using events only.
 * @module
 */
function Core_Fx () {
    var self     = this,
        FxHolder = document.getElementById('Fx');


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Initialize module and add public events.
     *
     * @public
     */
    this.init = function init () {
        window.addEventListener('ShakeFx', this.onShakeFx);
    };


    // ----------------------------------------------------------------------------------------------------------- Reset

    /**
     * Remove CSS class to allow for
     * a new CSS screen shake animation.
     *
     * @public
     */
    this.reset = function reset () {
        FxHolder.setAttribute('class', '');
    };


    // ---------------------------------------------------------------------------------------------------------- Events

    /**
     * Start screen shake CSS animation.
     *
     * @private
     */
    this.onShakeFx = function onShakeFx (event) {
        FxHolder.setAttribute('class', 'shake');
    };

}

