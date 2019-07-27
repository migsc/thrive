import Phaser from "phaser";

const indicesSix = Array.from(Array(6).keys());

const getHexCorner = (centerX, centerY, size, i, degreesRotated = 0) => {
  const angleDegrees = 60 * i - degreesRotated;
  const angleRad = (Math.PI / 180) * angleDegrees;
  const cornerX = centerX + size * Math.cos(angleRad);
  const cornerY = centerY + size * Math.sin(angleRad);
  return new Phaser.Geom.Point(cornerX, cornerY);
};

const isDivisibleBy = (n, d) => n % d === 0;

const isPointyHex = angle => {
  if (angle === 0) return false;
  return isDivisibleBy(angle, 30);
};

const isFlatHex = angle => isDivisibleBy(angle, 60);

export const getHexWidth = (size, angle) => {
  if (isFlatHex(angle)) return 2 * size;
  if (isPointyHex(angle)) return Math.sqrt(3) * size;
  throw new Error(`Angle ${angle} unsupported for calculating hex width!`);
};

export const getHexHeight = (size, angle) => {
  if (isFlatHex(angle)) return Math.sqrt(3) * size;
  if (isPointyHex(angle)) return 2 * size;
  throw new Error(`Angle ${angle} unsupported for calculating hex width!`);
};

const styles = {
  lineStyle: [3, 0x000000, 1.0],
  fillStyle: [0xdddddd, 0.6]
};

class Hexagon extends Phaser.Geom.Polygon {
  constructor({ graphics, center: { x, y }, size, degreesRotated }) {
    super(indicesSix.map(i => getHexCorner(x, y, size, i, degreesRotated)));
    this.graphics = graphics;
    this.applyStyles();
  }

  applyStyles() {
    return Object.keys(styles).forEach(key => {
      this.graphics[key](...styles[key]);
    });
  }

  render() {
    this.graphics.beginPath();
    this.graphics.moveTo(this.points[0].x, this.points[0].y);
    this.points.forEach(point => {
      this.graphics.lineTo(point.x, point.y);
    });
    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.fill();
  }
}

export default Hexagon;
