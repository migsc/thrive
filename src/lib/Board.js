import Hexagon, { getHexAngle } from "./Hexagon";

import { isEven, isOdd } from "../utils/math";

const getOffsetDistance = (length, index, offsetMode) => {
  const n = index + 1;

  if (offsetMode === "even") {
    return isEven(n) ? length * 0.5 : 0;
  } else if (offsetMode === "odd") {
    return isOdd(n) ? length * 0.5 : 0;
  }
  throw new Error(
    `Offset mode '${offsetMode}' not supported for board. Must be one of [even|odd].`
  );
};

const getNextHexCenter = (
  { width, height },
  { x, y },
  [indexRow, indexCol],
  offsetMode,
  orientation
) => {
  if (orientation === "pointy") {
    return {
      x: x + indexCol * width - getOffsetDistance(width, indexRow, offsetMode),
      y: y + indexRow * height * (3 / 4)
    };
  } else if (orientation === "flat") {
    return {
      x: x + indexCol * width * (3 / 4),
      y: y + indexRow * height - getOffsetDistance(height, indexCol, offsetMode)
    };
  }

  throw new Error(
    `Orientation '${orientation}' not supported for board. Must be one of [pointy|flat]`
  );
};

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
    this.orientation = orientation;
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
          this.hex,
          this.origin,
          [r, c],
          this.offsetMode,
          this.orientation
        );
        this.hex.renderAt(point);
      }
    }
  }
}
