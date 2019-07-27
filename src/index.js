import Phaser from "phaser";

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

const indicesSix = Array.from(Array(6).keys());

const getHexCorner = (centerX, centerY, size, i, degreesRotated = 0) => {
  const angleDegrees = 60 * i - degreesRotated;
  const angleRad = (Math.PI / 180) * angleDegrees;
  const cornerX = centerX + size * Math.cos(angleRad);
  const cornerY = centerY + size * Math.sin(angleRad);
  return new Phaser.Geom.Point(cornerX, cornerY);
};

const game = new Phaser.Game(config);

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
    for (let key in styles) {
      this.graphics[key].apply(this.graphics, styles[key]);
    }
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

function preload() {}

function create() {
  const graphics = this.add.graphics({ x: 0, y: 0 });
  const polygon = new Hexagon({
    graphics,
    center: { x: 200, y: 200 },
    size: 50,
    degreesRotated: 30
  });
  polygon.render();
}
