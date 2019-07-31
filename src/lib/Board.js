import Hexagon, { styles as hexStyles } from "./Hexagon";

import { isEven, isOdd } from "../utils/math";

const layouts = {
  "odd-r": {
    offsetMode: "odd",
    orientation: "pointy"
  },
  "even-r": {
    offsetMode: "even",
    orientation: "pointy"
  },
  "odd-q": { offsetMode: "odd", orientation: "flat" },
  "even-q": {
    offsetMode: "even",
    orientation: "flat"
  }
};

const getOffsetDistance = length => length * 0.5;

const getOffsetDistanceAt = (length, index, offsetMode) => {
  if (offsetMode === "even") {
    return isEven(index) ? getOffsetDistance(length) : 0;
  } else if (offsetMode === "odd") {
    return isOdd(index) ? getOffsetDistance(length) : 0;
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
      x:
        x + indexCol * width + getOffsetDistanceAt(width, indexRow, offsetMode),
      y: y + indexRow * height * (3 / 4)
    };
  } else if (orientation === "flat") {
    return {
      x: x + indexCol * width * (3 / 4),
      y:
        y +
        indexRow * height +
        getOffsetDistanceAt(height, indexCol, offsetMode)
    };
  }

  throw new Error(
    `Orientation '${orientation}' not supported for board. Must be one of [pointy|flat]`
  );
};

const getOriginFitted = ({ x, y }, hex, orientation) => {
  const stroke = hex.getStrokeWidth();

  return {
    x: x + hex.size + stroke,
    y: y + hex.size + stroke
  };
};

export default class Board {
  constructor({
    graphics,
    origin = { x: 0, y: 0 },
    rows = 16,
    cols = 16,
    hexagonSize = 50,
    layout = "odd-r"
  }) {
    this.rows = rows;
    this.cols = cols;
    this.offsetMode = layouts[layout].offsetMode;
    this.orientation = layouts[layout].orientation;

    this.hex = new Hexagon({
      graphics,
      orientation: this.orientation,
      size: hexagonSize
    });

    this.origin = getOriginFitted(origin, this.hex, this.orientation);
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
