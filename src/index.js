import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  scene: {
    preload: preload,
    create: create
  },
  backgroundColor: 0xffffff,
  width: 1024,
  height: 768,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  autoRound: false
};

const indicesSix = Array.from(Array(6).keys());

const getHexCorner = (centerX, centerY, size, i, degreesRotated = 0) => {
  const angleDegrees = 60 * i - degreesRotated;
  const angleRad = (Math.PI / 180) * angleDegrees;
  const cornerX = centerX + size * Math.cos(angleRad);
  const cornerY = centerY + size * Math.sin(angleRad);
  return new Phaser.Geom.Point(cornerX, cornerY)
}

const game = new Phaser.Game(config);

const styles = {
  lineStyle: [4, 0x000000, 1.0],
  fillStyle: [0xDDDDDD, 0.6]
}

class Hexagon extends Phaser.Geom.Polygon {
  constructor({ graphics, center: { x, y }, size, pointy = false }) {
    super(indicesSix.map(i => getHexCorner(x, y, size, i, pointy ? 30 : 0)))
    this.size = size;
    this.graphics = graphics;
    this.pointy = pointy;

    this.applyStyles();
  }

  width() {
    return (this.pointy ? Math.sqrt(3) : 2) * this.size;
  }

  height() {
    return (this.pointy ? 2 : Math.sqrt(3)) * this.size;
  }


  applyStyles() {
    this.graphics.lineStyle.apply(this.graphics, styles.lineStyle);
    this.graphics.fillStyle.apply(this.graphics, styles.fillStyle);
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

function preload() {
}

function create() {
  const graphics = this.add.graphics({ x: 0, y: 0 });
  const polygon = new Hexagon({ graphics, center: { x: 200, y: 200 }, size: 50 })
  polygon.render();

  this.input.on('pointerdown', function (pointer) {
    console.log(pointer.x, pointer.y);
  });
}
