/* eslint-disable prefer-const */

/**
 * Define all keys the project requires in this file.
 *
 * @see http://yojimbo87.github.com/2012/08/23/repeated-and-multiple-key-press-events-without-stuttering-in-javascript.html
 */

let keys = {};
let keysCount = 0;
let keyInterval = false;

const trackedKeys = {
  // Steering
  119: true, // W
  87: true, // w
  115: true, // S
  83: true, // s
  97: true, // A
  65: true, // a
  100: true, // D
  68: true, // d
  37: true, // VK_LEFT
  38: true, // VK_UP
  39: true, // VK_RIGHT
  40: true, // VK_DOWN

  // Misc
  32: true, // SPACE
  70: true, // f
  67: true, // c
};
