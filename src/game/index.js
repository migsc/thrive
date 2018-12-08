import "phaser";
import MainScene from "scenes/main";
import BoardPlugin from "plugins/board-plugin";

let game = new Phaser.Game({
  type: Phaser.AUTO,
  width: window.innerWidth * window.devicePixelRatio,
  height: window.innerHeight * window.devicePixelRatio,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: 200 }
    }
  },
  zoom: 1 / window.devicePixelRatio, // Set the zoom to the inverse of the devicePixelRatio
  scene: [MainScene],
  plugins: {
    scene: [
      {
        key: "rexBoard",
        plugin: BoardPlugin,
        mapping: "rexBoard"
      }
    ]
  },
  autoFocus: true
});

window.game = game;

export default game;
