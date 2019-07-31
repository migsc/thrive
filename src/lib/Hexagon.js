import Phaser from "phaser";
import { isDivisibleBy } from "../utils/math";
import { first } from "lodash";
const indicesSix = Array.from(Array(6).keys());

const isPointyHex = angle => {
  if (angle === 0) return false;
  return isDivisibleBy(angle, 30);
};

const isFlatHex = angle => isDivisibleBy(angle, 60);

const getHexCorner = (centerX, centerY, size, i, angle = 0) => {
  const angleDegrees = 60 * i - angle;
  const angleRad = (Math.PI / 180) * angleDegrees;
  const cornerX = centerX + size * Math.cos(angleRad);
  const cornerY = centerY + size * Math.sin(angleRad);
  return new Phaser.Geom.Point(cornerX, cornerY);
};

const getHexWidth = (size, angle) => {
  if (isFlatHex(angle)) return 2 * size;
  if (isPointyHex(angle)) return Math.sqrt(3) * size;
  throw new Error(
    `Angle ${angle} unsupported for calculating hex width. Must be divisible by 30 or 60.`
  );
};

const getHexHeight = (size, angle) => {
  if (isFlatHex(angle)) return Math.sqrt(3) * size;
  if (isPointyHex(angle)) return 2 * size;
  throw new Error(
    `Angle ${angle} unsupported for calculating hex width. Must be divisible by 30 or 60.`
  );
};

const getHexAngle = orientation => {
  if (orientation === "pointy") return 30;
  else if (orientation === "flat") return 0;
  throw new Error(
    `Orientation '${orientation}' not supported for hexagon. Must be one of [pointy|flat]`
  );
};

const getHexPoints = (x, y, size, angle) =>
  indicesSix.map(i => getHexCorner(x, y, size, i, angle));

const styles = {
  lineStyle: [5, 0x000000, 1.0],
  fillStyle: [0xdddddd, 0.6]
};

export default class Hexagon {
  constructor({ graphics, size, orientation }) {
    this.graphics = graphics;
    this.size = size;
    this.angle = getHexAngle(orientation);
    this.width = getHexWidth(size, this.angle);
    this.height = getHexHeight(size, this.angle);
    this.applyStyles();
  }

  applyStyles() {
    return Object.keys(styles).forEach(key => {
      this.graphics[key](...styles[key]);
    });
  }

  getStrokeWidth() {
    return first(styles.lineStyle);
  }

  renderAt({ x, y }) {
    const points = getHexPoints(x, y, this.size, this.angle);
    this.graphics.beginPath();
    this.graphics.moveTo(points[0].x, points[0].y);
    points.forEach(point => {
      this.graphics.lineTo(point.x, point.y);
    });
    this.graphics.closePath();
    this.graphics.strokePath();
    this.graphics.fill();
  }
}
