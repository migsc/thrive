import Board from "plugins/board/board/Board";
import BoardShape from "plugins/board/shape/Shape";

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload() {}

  _initializeNewGame() {
    // create board

    this.board = new GameBoard(this, {
      grid: getHexagonGrid(this, 40),
      // grid: getQuadGrid(this),
      width: 54,
      height: 20
      // wrap: true
    });

    this.round = 1;
    this.resources = {
      nectar: 0,
      honey: 100,
      jelly: 0,
      wax: 100
    };

    let centerCoords = this.board.getCenterCoordinates();

    this.units = [
      // new PlayerUnit({
      //   board: this.board,
      //   movingPoints: 999
      // }),
      new PlayerUnit({
        board: this.board,
        movingPoints: 3,
        tileXY: {
          x: centerCoords.x - 1,
          y: centerCoords.y - 1
        }
      }),
      new PlayerUnit({
        board: this.board,
        movingPoints: 3,
        tileXY: {
          x: centerCoords.x + 2,
          y: centerCoords.y
        }
      }),
      new PlayerUnit({
        board: this.board,
        movingPoints: 3,
        tileXY: {
          x: centerCoords.x - 2,
          y: centerCoords.y + 1
        }
      })
    ];

    this.hive = [
      new Room({
        board: this.board,
        tileXY: centerCoords
      })
    ];

    this.activeUnit = this.units[0];
  }

  create() {
    // Initialize resources
    this._initializeNewGame();

    // add some blockers
    // for (var i = 0; i < 20; i++) {
    //   new Blocker({ board: this.board });
    // }

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

    this.activeUnit.select();

    this.game.events.emit("game.roundstart", { round: this.round });

    this.game.events.on(
      "ui.showmoveable",
      this.activeUnit.showMoveableArea,
      this.activeUnit
    );
    this.game.events.on(
      "ui.hidemoveable",
      this.activeUnit.hideMoveableArea,
      this.activeUnit
    );
    this.game.events.on("unit.movedone", this.selectNextUnit, this);
    // console.log(this.cameras.main);
  }

  selectNextUnit() {
    let nextUnit = this.units.find(u => u.canAct());
    if (nextUnit) {
      nextUnit.select();
    } else {
      this.endRound();
    }
  }

  endRound() {
    this.game.events.emit("game.roundend", { round: this.round });
    this.startRound();
  }

  startRound() {
    this.game.events.emit("game.roundstart", { round: ++this.round });
    this.units.forEach(u => {
      u.resetMovingPoints();
    });
    this.selectNextUnit();
  }

  getWidth() {
    return window.innerWidth;
  }

  getHeight() {
    return window.innerHeight;
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

  setActiveUnit(unit) {
    this.units.forEach(u => {
      u.hideMoveableArea();
    });
    this.activeUnit = unit;
  }
}

const getHexagonGrid = function(scene, size) {
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
    this.horizontalTileCount = config.width;
    this.verticalTitleCount = config.height;
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

  getCenterCoordinates() {
    return {
      x: Math.round(this.horizontalTileCount / 2),
      y: Math.round(this.verticalTitleCount / 2)
    };
  }
}

class Room extends BoardShape {
  constructor(options) {
    let { board, tileXY } = options;
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 1, 0xffff00, 0.5);
    scene.add.existing(this);
  }
}

class Blocker extends BoardShape {
  constructor(options) {
    let { board, tileXY } = options;
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 0, 0x555555);
    scene.add.existing(this);
  }
}

class PlayerUnit extends BoardShape {
  constructor(options = {}) {
    let { board, tileXY, movingPoints, isTurnDone } = options;
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
    this.initialMovingPoints = this.movingPoints = movingPoints || 4;
    this.moveableTiles = [];
    this.isTurnDone = !!isTurnDone || false;

    // events
    this.on("board.pointerdown", this.onPointerDown.bind(this), this);
  }

  onPointerDown(pointer) {
    this.select();
  }

  resetMovingPoints() {
    this.movingPoints = this.initialMovingPoints;
  }

  canAct() {
    return this.movingPoints > 0;
  }

  select() {
    this.scene.setActiveUnit(this);
    this.scene.cameras.main.pan(
      this.x + this.scene.getWidth() / 2,
      this.y + this.scene.getHeight() / 2,
      1000
    );
    this.showMoveableArea();
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
    this.movingPoints -= tileXYArray.length;
    console.log("ChessA.moveToTile tileXYArray");
    // this.scene.cameras.main.startFollow(this);
    this.events = this.scene.game.events;

    this.moveAlongPath(tileXYArray);

    return true;
  }

  moveAlongPath(path) {
    if (path.length === 0) {
      // this.scene.cameras.main.stopFollow();
      this.showMoveableArea();

      this.events.emit("unit.movedone");

      return;
    }

    this.moveTo.once(
      "complete",
      () => {
        this.moveAlongPath(path);
      },
      this
    );

    this.moveTo.moveTo(path.shift());

    return this;
  }
}

class MoveableTile extends BoardShape {
  constructor(unit, tileXY) {
    //   console.log('MoveableTile constructor tileXY', tileXY);
    var board = unit.rexChess.board;
    var scene = board.scene;
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, -1, 0x330000);
    scene.add.existing(this);
    this.setScale(0.5);
    this.tileXY = tileXY;
    this.unit = unit;
    this.events = unit.scene.game.events;

    // on pointer down, move to this tile
    this.on("board.pointerdown", this.onPointerDown.bind(this), this);
  }

  onPointerDown(pointer) {
    console.log(`Moving to tile with x,y,pointer`, this.x, this.y, pointer);
    if (!this.unit.moveToTile(this)) {
      return;
    }

    this.setFillStyle(0xff0000);
    console.log(this);
    this.events.emit("tile.moved", { tile: this, pointer });
  }
}
