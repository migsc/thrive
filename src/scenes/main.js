import Board from "plugins/board/board/Board";
import BoardShape from "plugins/board/shape/Shape";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload() {}

  create() {
    // create board
    this.tileCountW = 40;
    this.tileCountH = 19;
    this.tileSize = 40;

    let config = {
      grid: getHexagonGrid(this, this.tileSize),
      // grid: getQuadGrid(this),
      width: this.tileCountW,
      height: this.tileCountH
      // wrap: true
    };
    this.board = new GameBoard(this, config);
    // this.board.i nfinityMode = true;
    // add chess
    this.chessA = new ChessA({
      board: this.board,
      movingPoints: 10,
      tileXY: { x: 0, y: 0 }
    });
    // this.chessB = new ChessA({board: this.board, movingPoints: 2});
    // this.cameras.main.startFollow(this.chessA);

    // add some blockers
    for (var i = 0; i < 20; i++) {
      new Blocker(this.board);
    }

    this.chessA.showMoveableArea();
    this.cameras.main.fadeIn(1500);

    console.log("MainScene.create this", this, this.game.debug);

    const cursors = this.input.keyboard.createCursorKeys();
    this.controls = new Phaser.Cameras.Controls.FixedKeyControl({
      camera: this.cameras.main,
      left: cursors.left,
      right: cursors.right,
      up: cursors.up,
      down: cursors.down,
      speed: 0.5
    });
    // this.cameras.main.setBounds(0, 0, this.tileCountW * this.tileSize, this.tileCountH * this.tileSize * 1.82);
    this.cameras.main.setBounds(0, 0, 5000, 5000);

    this.lastMovedToTile = {
      x: 0,
      y: 0
    };

    //

    // console.log(this.cameras.main);
  }

  update(time, delta) {
    //this.add
    // .text(16, 64, `Camera x:${this.cameras.main.worldView.x}, y: ${this.cameras.main.worldView.y}`, {
    //   font: "18px monospace",
    //   fill: "#ffffff",
    //   padding: { x: 20, y: 10 },
    //   backgroundColor: "#000000"
    // })
    // .setScrollFactor(0);

    this.controls.update(delta);
    // this.board.gridAlign();
    // this.board.grid.x++

    // console.log(this.board);
    // console.log(this.cameras.main);

    //this.cameras.main.follow(this.chessA);
    // this.board.grid.x++;
    // this.cameras.main.scrollX++;
  }

  render() {
    scene.debug.cameraInfo(game.camera, 32, 32);
  }
}

var getQuadGrid = function(scene) {
  var grid = scene.rexBoard.add.quadGrid({
    x: 400,
    y: 100,
    cellWidth: 100,
    cellHeight: 50,
    type: 1
  });
  return grid;
};

var getHexagonGrid = function(scene, size) {
  var staggeraxis = "y";
  var staggerindex = "odd";
  var grid = scene.rexBoard.add.hexagonGrid({
    x: size,
    y: size,
    size: size,
    staggeraxis: staggeraxis,
    staggerindex: staggerindex
  });
  return grid;
};

class GameBoard extends Board {
  constructor(scene, config) {
    // create board
    super(scene, config);
    // draw grid
    this.graphics = scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1
      }
    });
    this.forEachTileXY((tileXY, board) => {
      var points = board.getGridPoints(tileXY.x, tileXY.y, true);
      this.graphics.strokePoints(points, true);
    });
    // enable touch events
    this.setInteractive();
  }
}

class Blocker extends BoardShape {
  constructor(board, tileXY) {
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x555555);
    scene.add.existing(this);
  }
}

class ChessA extends BoardShape {
  constructor(options = {}) {
    let { board, tileXY, movingPoints } = options;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x00cc00);
    this.scene = board.scene;

    this.scene.add.existing(this);
    this.setDepth(1);

    // add behaviors
    this.moveTo = this.scene.rexBoard.add.moveTo(this);
    this.pathFinder = this.scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true
    });

    // private members
    this.movingPoints = movingPoints || 4;
    this.moveableTiles = [];
  }

  showMoveableArea() {
    this.hideMoveableArea();
    var tileXYArray = this.pathFinder.findArea(this.movingPoints);
    for (var i = 0, cnt = tileXYArray.length; i < cnt; i++) {
      this.moveableTiles.push(new MoveableTile(this, tileXYArray[i]));
    }
    return this;
  }

  hideMoveableArea() {
    for (var i = 0, cnt = this.moveableTiles.length; i < cnt; i++) {
      this.moveableTiles[i].destroy();
    }
    this.moveableTiles.length = 0;
    return this;
  }

  moveToTile(endTile) {
    console.log("ChessA.moveToTile endTile", endTile, endTile.rexChess.tileXYZ);

    if (this.moveTo.isRunning) {
      return false;
    }

    let tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
    console.log("ChessA.moveToTile tileXYArray");
    this.scene.cameras.main.startFollow(this);
    this.moveAlongPath(tileXYArray);

    return true;
  }

  moveAlongPath(path) {
    if (path.length === 0) {
      this.scene.cameras.main.stopFollow();
      this.showMoveableArea();
      return;
    }

    this.moveTo.once(
      "complete",
      function() {
        this.moveAlongPath(path);
      },
      this
    );
    this.moveTo.moveTo(path.shift());

    // const cursors = this.scene.input.keyboard.createCursorKeys();
    // this.scene.controls = new Phaser.Cameras.Controls.FixedKeyControl({
    //     camera: this.scene.cameras.main,
    //     left: cursors.left,
    //     right: cursors.right,
    //     up: cursors.up,
    //     down: cursors.down,
    //     speed: 0.5
    // });
    return this;
  }
}

class MoveableTile extends BoardShape {
  constructor(chess, tileXY) {
    //   console.log('MoveableTile constructor tileXY', tileXY);
    var board = chess.rexChess.board;
    var scene = board.scene;
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, -1, 0x330000);
    scene.add.existing(this);
    this.setScale(0.5);

    // on pointer down, move to this tile
    this.on(
      "board.pointerdown",
      function(pointer) {
        console.log(
          `Moving to title with x,y,pointer`,
          this.x,
          this.y,
          pointer
        );
        if (!chess.moveToTile(this)) {
          return;
        }
        this.setFillStyle(0xff0000);
      },
      this
    );
  }
}
