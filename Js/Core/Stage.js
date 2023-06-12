/**
 * Stage manager for objects and canvas elements.
 *
 * @todo  Decouple Stage and Loop modules.
 * @module
 */
function Core_Stage () {
    this.objects = {};

    /*
     * Add object to target canvas DOM element
     * and call its init() method if available.
     *
     * Note that all stage objects need to implement a
     * loop() method which is used by the game loop.
     *
     * @todo    canvasId should be an object reference instead.
     * @param   {Object}   obj       Game module object (instance).
     * @param   {String}   canvasId  Canvas DOM element ID.
     * @return  {Object}             Self reference.
     * @public
     */
    this.add = function add (obj, canvasId) {
        if (obj.loop && document.getElementById(canvasId)) {
            this.objects[canvasId] = obj;

            if (obj.init) {
                obj.init();
            }

            return this;
        }

        return this;
    };

}

