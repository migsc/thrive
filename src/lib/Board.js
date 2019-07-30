import Hexagon, { getHexAngle } from "./Hexagon";

import { isEven, isOdd } from "../utils/math";

const getOffsetDistance = (hexWidth, indexRow, offsetMode) => {
  const offset = hexWidth * 0.5;
  const n = indexRow + 1;
  if (offsetMode === "even") return isEven(n) ? offset : 0;
  else if (offsetMode === "odd") return isOdd(n) ? offset : 0;
  else
    throw new Error(
      `Offset mode '${offsetMode}' not supported. Must be one of [even|odd].`
    );
};

const getNextHexCenter = (
  originX,
  originY,
  width,
  height,
  indexCol,
  indexRow,
  offsetMode
) => ({
  x:
    originX + indexCol * width - getOffsetDistance(width, indexRow, offsetMode),
  y: originY + indexRow * height * (3 / 4)
});

export default class Board {
  constructor({
    graphics,
    origin = { x: 0, y: 0 },
    rows = 16,
    cols = 16,
    offsetMode = "even",
    orientation = "flat",
    hexagonSize = 50
  }) {
    this.rows = rows;
    this.cols = cols;
    this.origin = origin;
    this.offsetMode = offsetMode;
    this.hex = new Hexagon({
      graphics,
      orientation,
      size: hexagonSize
    });
  }

  render() {
    let point;
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.cols; c++) {
        point = getNextHexCenter(
          this.origin.x,
          this.origin.y,
          this.hex.width,
          this.hex.height,
          c,
          r,
          this.offsetMode
        );
        this.hex.renderAt(point);
      }
    }
  }
}
