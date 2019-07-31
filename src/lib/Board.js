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

const styles = {
  text: {
    fontSize: 16,
    color: "#000"
  }
};

const getTextPositionAdjusted = ({ x, y }) => {
  console.log("fontSize", styles.text.fontSize);
  return {
    x: x - parseFloat(styles.text.fontSize),
    y: y - parseFloat(styles.text.fontSize) / 2
  };
};

export default class Board {
  constructor({
    game,
    graphics,
    origin = { x: 0, y: 0 },
    rows = 16,
    cols = 16,
    hexagonSize = 50,
    layout = "odd-r",
    renderText = () => {}
  }) {
    this.game = game;
    this.rows = rows;
    this.cols = cols;
    this.offsetMode = layouts[layout].offsetMode;
    this.orientation = layouts[layout].orientation;
    this.renderText = renderText;

    this.hex = new Hexagon({
      graphics,
      orientation: this.orientation,
      size: hexagonSize
    });

    this.origin = getOriginFitted(origin, this.hex, this.orientation);
  }

  render() {
    let point;
    let textPosition;
    for (let c = 0; c < this.cols; c++) {
      for (let r = 0; r < this.rows; r++) {
        point = getNextHexCenter(
          this.hex,
          this.origin,
          [r, c],
          this.offsetMode,
          this.orientation
        );
        console.log("point", point);
        this.hex.renderAt(point);

        textPosition = getTextPositionAdjusted(point);
        console.log("textPosition", textPosition);
        this.renderText(
          textPosition.x,
          textPosition.y,
          `${c},${r}`,
          styles.text
        );
      }
    }
  }
}
