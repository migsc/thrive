import "phaser";
import "bootstrap";
import "ui/bottom";
import "styles/index.scss";
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
  scene: [MainScene],
  plugins: {
    scene: [
      {
        key: "rexBoard",
        plugin: BoardPlugin,
        mapping: "rexBoard"
      }
    ]
  }
});

console.log("game", game);
