/**
 * Animated parallax background.
 *
 * @module
 */
function Obj_Background () {
    var self = this;

    this.stopped         = false;  // Stop animation like this, because cancelAnimationFrame does not work.
    this.tileHeight      = 500;    // Tile graphic height in px.
    this.maxHeight       = 500;    // Level height, e.g. canvas0.height | fixed value.
    this.scrollSpeed0    = 0.4;    // How fast the level will scroll in px.
    this.scrollSpeed1    = 1.0;    // How fast the level will scroll in px.
    this.TileTypes0Count = 4;      // Different tile graphics (img assets), Number 0-N.
    this.TileTypes1Count = 6;      // Different tile graphics (img assets), Number 0-N.
    this.TileTypes0      = [];     // Available different tile types.
    this.TileTypes1      = [];     // Available different tile types.
    this.Queue0          = [];     // Current animation Queue0 with a few required tiles.
    this.Queue1          = [];     // Current animation Queue1 with a few required tiles.

    // Animation type
    this.intervalDuration = 100;   // Animation duration in frames.
    this.useInterval      = false; // If to use interval animation instead requestAnimFrame.
    this.interval;                 // Interval object for alternate animation type.

    // Graphic
    this.canvas0; // canvas0 DOM element
    this.canvas1; // canvas1 DOM element
    this.ctx0;    // canvas0 context object
    this.ctx1;    // canvas1 context object


    // ------------------------------------------------------------------------------------------------------ Initialize

    /**
     * Set up objects, generate level and run animation loop.
     *
     * @public
     */
    this.init = function init () {
        self.canvas0 = document.getElementById('Background');
        self.canvas1 = document.getElementById('Foreground');
        self.ctx0    = self.canvas0.getContext('2d');
        self.ctx1    = self.canvas1.getContext('2d');

        self.createTileTypeList();
        self.createQueue();

        /** /
        self.interval    = window.setInterval(self.animate, 100);
        self.useInterval = true;
        /**/
        self.animate();
    };


    // ----------------------------------------------------------------------------------------------------------- Loops

    /**
     * Main loop.
     *
     * @private
     */
    this.animate = function animate () {
        if (self.stopped) {
            return;
        }

        self.clearCanvas();
        self.drawLoop();

        if (self.useInterval) {
            if (self.intervalDuration > 0) {
                self.intervalDuration--;
            }
            else {
                clearInterval(self.interval);
                return;
            }
        }
        else {
            requestAnimFrame(function() {
                self.animate();
            });
        }
    };

    /**
     * Main loop graphic updates.
     *
     * @private
     */
    this.drawLoop = function drawLoop () {
        self.updateQueue();
        self.moveTiles();
        self.drawTiles();
    };


    // ------------------------------------------------------------------------------------------------------------ Draw

    /**
     * Draw tiles on stage.
     *
     * @private
     */
    this.drawTiles = function drawTiles () {
        var obj;

        for (obj in self.Queue0) {
            self.ctx0.drawImage(
                self.Queue0[obj].img,
                0,
                self.Queue0[obj].posY,
                self.canvas0.width,
                self.tileHeight
            );
        }

        for (obj in self.Queue1) {
            self.ctx1.drawImage(
                self.Queue1[obj].img,
                0,
                self.Queue1[obj].posY,
                self.canvas1.width,
                self.tileHeight
            );
        }
    };

    /**
     * Clear used canvas elements.
     *
     * @private
     */
    this.clearCanvas = function clearCanvas () {
        self.clear(self.ctx0, self.canvas0);
        self.clear(self.ctx1, self.canvas1);
    };

    /**
     * Performant way to clear all canvas data but save the settings, like transformations.
     *
     * @see  http://simonsarris.com/blog/346-how-you-clear-your-canvas-matters
     * @private
     */
    this.clear = function clear (ctx, canvas) {
        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();
    };


    // ----------------------------------------------------------------------------------------------------------- Queue

    /**
     * Generate tile Queue0 for this level.
     * Set Y-position and use a random tile type.
     *
     * Do not change queue fixed length of '3'.
     *
     * @private
     */
    this.createQueue = function createQueue () {
        var posYIncrement = self.tileHeight,
            obj, i;

        for (i = 0; i < 3; i++) {
            obj      = new Object();
            obj.posY = -self.tileHeight * i;
            obj.img  = self.getRandomTile0Type();
            self.Queue0.push(obj);
        }

        for (i = 0; i < 3; i++) {
            obj      = new Object();
            obj.posY = -self.tileHeight * i;
            obj.img  = self.getRandomTile1Type();
            self.Queue1.push(obj);
        }
    };

    /**
     * Change tiles.
     *
     * @private
     */
    this.updateQueue = function updateQueue () {
        var i;

        for (i = 0; i < self.Queue0.length; i++) {
            if (self.Queue0[i].posY >= self.maxHeight) {
                self.Queue0[i].posY  = self.getTopmostY();
                self.Queue0[i].img   = self.getRandomTile0Type();
            }
        }

        for (i = 0; i < self.Queue1.length; i++) {
            if (self.Queue1[i].posY >= self.maxHeight) {
                self.Queue1[i].posY  = self.getTopmostY();
                self.Queue1[i].img   = self.getRandomTile1Type();
            }
        }
    };


    // -------------------------------------------------------------------------------------------------------- Movement

    /**
     * Get the topmost tile coordinate for positioning the next tile.
     *
     * @return   {Number}  Next free Y coordinate to create tile at.
     * @private
     */
    this.getTopmostY = function getTopmostY () {
        var i, topY = self.Queue0[0].posY;

        for (i = 0; i < self.Queue0.length; i++) {
            if (self.Queue0[i].posY < topY) {
                topY = self.Queue0[i].posY;
            }
        }

        return topY - self.tileHeight;
    };

    /**
     * Scroll available tiles vertically.
     *
     * @private
     */
    this.moveTiles = function moveTiles () {
        for (var obj in self.Queue0) {
            self.Queue0[obj].posY += self.scrollSpeed0;
            self.Queue1[obj].posY += self.scrollSpeed1;
        }
    };


    // ----------------------------------------------------------------------------------------------------------- Tiles

    /**
     * Add all available tiles to a list.
     *
     * @private
     */
    this.createTileTypeList = function createTileTypeList () {
        var i;

        for (i = 0; i <= self.TileTypes0Count; i++) {
            self.TileTypes0.push(document.getElementById('Tile-0-' + i));
        }

        for (i = 0; i <= self.TileTypes1Count; i++) {
            self.TileTypes1.push(document.getElementById('Tile-1-' + i));
        }
    };

    /**
     * Get random tile type from list.
     *
     * @private
     */
    this.getRandomTile0Type = function getRandomTile0Type () {
        var i = Math.round(Math.random() * self.TileTypes0Count);

        return self.TileTypes0[i];
    };

    /**
     * Get random tile type from list.
     *
     * @private
     */
    this.getRandomTile1Type = function getRandomTile1Type () {
        var i = Math.round(Math.random() * self.TileTypes1Count);

        return self.TileTypes1[i];
    };
}

