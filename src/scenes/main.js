import BoardPlugin from "plugins/board-plugin";
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
    var config = {
      grid: getHexagonGrid(this),
      // grid: getQuadGrid(this),
      width: 8,
      height: 8
      // wrap: true
    };
    this.board = new GameBoard(this, config);

    // add chess
    this.chessA = new ChessA(this.board);

    // add some blockers
    for (var i = 0; i < 20; i++) {
      new Blocker(this.board);
    }

    this.chessA.showMoveableArea();
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

var getHexagonGrid = function(scene) {
  var staggeraxis = "x";
  var staggerindex = "odd";
  var grid = scene.rexBoard.add.hexagonGrid({
    x: 100,
    y: 100,
    size: 30,
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
    var graphics = scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1
      }
    });
    this.forEachTileXY(function(tileXY, board) {
      var points = board.getGridPoints(tileXY.x, tileXY.y, true);
      graphics.strokePoints(points, true);
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
  constructor(board, tileXY) {
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x00cc00);
    scene.add.existing(this);
    this.setDepth(1);

    // add behaviors
    this.moveTo = scene.rexBoard.add.moveTo(this);
    this.pathFinder = scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true
    });

    // private members
    this.movingPoints = 4;
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
    if (this.moveTo.isRunning) {
      return false;
    }
    var tileXYArray = this.pathFinder.getPath(endTile.rexChess.tileXYZ);
    this.moveAlongPath(tileXYArray);
    return true;
  }

  moveAlongPath(path) {
    if (path.length === 0) {
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
    return this;
  }
}

class MoveableTile extends BoardShape {
  constructor(chess, tileXY) {
    var board = chess.rexChess.board;
    var scene = board.scene;
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, -1, 0x330000);
    scene.add.existing(this);
    this.setScale(0.5);

    // on pointer down, move to this tile
    this.on(
      "board.pointerdown",
      function() {
        if (!chess.moveToTile(this)) {
          return;
        }
        this.setFillStyle(0xff0000);
      },
      this
    );
  }
}
