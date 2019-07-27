import Phaser from "phaser";
import Hexagon, { getHexWidth, getHexHeight } from "./lib/Hexagon";

const config = {
  type: Phaser.AUTO,
  scene: {
    preload: preload,
    create: create
  },
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false,
  backgroundColor: 0xffffff
};

// eslint-disable-next-line no-unused-vars
const game = new Phaser.Game(config);

function preload() {}

// eslint-disable-next-line max-statements
function create() {
  const graphics = this.add.graphics({ x: 0, y: 0 });
  const startPoint = { x: 200, y: 200 };
  const numColumns = 4;
  const numRows = 4;
  const size = 50;
  const degreesRotated = 30;
  const offset = false;

  let offsetRow = offset;
  const hexWidth = getHexWidth(size, degreesRotated);
  const hexHeight = getHexHeight(size, degreesRotated);
  for (let r = 0; r < numRows; r++) {
    for (let c = 0; c < numColumns; c++) {
      new Hexagon({
        graphics,
        center: {
          ...startPoint,
          x: startPoint.x + c * hexWidth - (offsetRow ? hexWidth * 0.5 : 0),
          y: startPoint.y + r * hexHeight * (3 / 4)
        },
        size,
        degreesRotated
      }).render();
    }
    offsetRow = !offsetRow;
  }
}
