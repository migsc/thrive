import Phaser from "phaser";

const config = {
  type: Phaser.AUTO,
  parent: "phaser-example",
  width: 800,
  height: 600,
  scene: {
    preload: preload,
    create: create
  }
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

function preload() {
}

function create() {
  const polygon = new Phaser.Geom.Polygon(indicesSix.map(i => getHexCorner(200, 200, 50, i)));

  const graphics = this.add.graphics({ x: 0, y: 0 });

  graphics.lineStyle(2, 0x00aa00);

  graphics.beginPath();

  graphics.moveTo(polygon.points[0].x, polygon.points[0].y);

  for (var i = 1; i < polygon.points.length; i++) {
    graphics.lineTo(polygon.points[i].x, polygon.points[i].y);
  }

  graphics.closePath();
  graphics.strokePath();

}
