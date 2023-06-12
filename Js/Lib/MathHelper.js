/**
 * Generic mathematical calculations.
 *
 * @module
 */
function Lib_MathHelper () {
    var self = this;

    /**
     * Get random value between given range.
     * 
     * @param    {Number}  min  Minimum value.
     * @param    {Number}  max  Maximum value.
     * @returns  {Number}
     * @public
     */
    this.getRandom = function getRandom (min, max) {
        var rnd = Math.random() * max + min | 0;

        return rnd;
    }
}

