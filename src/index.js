import Phaser from "phaser";
import Board from "./lib/Board";

import "./styles/index.scss";

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

  this.board = new Board({
    graphics,
    origin: {
      x: 0,
      y: 0
    },
    rows: 4,
    cols: 4,
    offsetMode: "even",
    orientation: "flat",
    hexagonSize: 50
  });

  this.board.render();
}
