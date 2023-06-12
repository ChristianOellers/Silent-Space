/**
 * Main loop for every frame.
 *
 * @todo  Decouple Stage and Loop modules.
 * @module
 */
function Core_Loop () {
    var self = this;

    /**
     * Infinite game loop that will also
     * loop through all game objects on stage.
     *
     * @public
     */
    this.run = function run () {
        if (STOP) {
            delete Core_Loop;
            return;
        }

        for (obj in Stage.objects) {
            Stage.objects[obj].loop();
        }

        requestAnimFrame(self.run);
    };

}

