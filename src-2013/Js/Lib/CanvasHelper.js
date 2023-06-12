/**
 * General canvas helper functions for graphics/animation development.
 *
 * @module
 */
function Lib_CanvasHelper () {
    var self = this,
        ctx  = false;

    /**
     * Draw visual helper points.
     * Useful when creating new graphics and animations.
     *
     * @param   {Number}  x      X coordinate
     * @param   {Number}  y      Y coordinate
     * @param   {String}  color  Color string.
     * @return  {Object}         Self reference.
     */
    this.drawHelperPoint = function (x, y, color) {
        var ctx = self.ctx;

        ctx.fillStyle = color ? color : 'rgba(255, 0, 0, 1)';
        ctx.fillRect(x-1, y-1, 2, 2);

        return self;
    };

    /**
     * Clear all canvas data but save settings like transformations.
     *
     * @see     http://simonsarris.com/blog/346-how-you-clear-your-canvas-matters
     * @param   {Object}   ctx  Canvas context object.
     * @return  {Object}        Self reference.
     * @public
     */
    this.clear = function clear (ctx) {
        var canvas = false;

        if (!ctx) {
            return self;
        }

        canvas = ctx.canvas;

        ctx.save();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.restore();


        return self;
    };

}

