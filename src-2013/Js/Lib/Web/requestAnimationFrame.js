/**
 * requestAnimationFrame polyfill by Erik Möller with fixes from Paul Irish and Tino Zijdel.
 * - Modified version for ES5 strict syntax.
 *
 * @example
 *     // Request a new frame before render which is better
 *     // for the timeout fallback because of the delay.
 *     (function renderLoop () {
 *         requestAnimationFrame(renderLoop);
 *         render();
 *     })();
 *
 * @see      http://paulirish.com/2011/requestanimationframe-for-smart-animating/
 *           http://updates.html5rocks.com/2012/05/requestAnimationFrame-API-now-with-sub-millisecond-precision
 * @license  MIT license
 * @date     2015-03-03
 */
(function animationFrameShim () {
    'use strict';

    var x, lastTime = 0,
        vendors     = ['moz', 'webkit'];


    if (!window.requestAnimationFrame) {
        // Use vendor prefixed functions
        for (x = 0; x < vendors.length; ++x) {
            window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];

            /** @deprecated - Used by Webkit */
            window.cancelRequestAnimationFrame = window[vendors[x] + 'CancelRequestAnimationFrame'];
        }

        // setTimeout() fallback
        // *1) 4-16ms delay for ~60fps
        window.requestAnimationFrame = function requestAnimationFrame (callback) {
            var currTime   = new Date().getTime(),
                timeToCall = Math.max(0, 16 - (currTime - lastTime)), // *1
                id         = window.setTimeout (function requestAnimationFrameTimeout () {
                    callback(currTime + timeToCall);
                },
                timeToCall);

            lastTime = currTime + timeToCall;
            return id;
        };
    }


    if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function cancelAnimationFrame (id) {
            clearTimeout(id);
        };
    }


    if (!window.requestAnimFrame) {
        /** @deprecated - Old spec name */
        window.requestAnimFrame = window.requestAnimationFrame;
    }

}());

