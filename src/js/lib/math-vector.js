/**
 * 2D vector math calculations.
 */
class Vector2D {
  constructor (x, y) {
    this.x = x;
    this.y = y;
  }

  normalize () {
    const x    = this.x;
    const y    = this.y;
    const size = Math.sqrt(x * x + y * y);

    if (size !== 0) {
      this.x /= size;
      this.y /= size;
    }
  }

  add (vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  subtract (vector) {
    this.x -= vector.x;
    this.y -= vector.y;
  }

  crossProduct (vector) {
    return (this.x * vector.y) - (this.y * vector.x);
  }

  dotProduct (vector) {
    return (this.x * vector.x) + (this.y * vector.y);
  }

  invert () {
    this.x = -this.x;
    this.y = -this.y;
  }

  rotate (angleRadians) {
    const x   = this.x;
    const y   = this.y;
    const cos = Math.cos(angleRadians);
    const sin = Math.sin(angleRadians);

    this.x = (x * cos) - (y * sin);
    this.y = (y * cos) + (x * sin);
  }

  scale (factor) {
    this.x *= factor;
    this.y *= factor;
  }

  sizeSqrt () {
    const x = this.x;
    const y = this.y;

    return Math.sqrt(x * x + y * y);
  }

  sizeSquared () {
    const x = this.x;
    const y = this.y;

    return x * x + y * y;
  }
}
