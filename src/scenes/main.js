import Board from "plugins/board/board/Board";
import BoardShape from "plugins/board/shape/Shape";

import { differenceBy, flatten } from "lodash";
import { getUUID } from "../lib/utils";
import { PLAYER_UNIT, ACTION } from "../lib/constants";

const coordKeyExtractor = c => `${c.x}-${c.y}`;

export default class MainScene extends Phaser.Scene {
  constructor() {
    super({
      key: "MainScene"
    });
  }

  preload() {
    // this.load.tilemapJSON("map", "assets/map.json");
    this.load.spritesheet("honeybee", "assets/sprites/honeybee.png", {
      // TODO: Change this later to correspond to the actual hexagon size.
      frameWidth: 560,
      frameHeight: 479
    });
  }

  _initializeNewGame() {
    // create board
    this.tileCountW = 20;
    this.tileCountH = 20;
    this.tileSize = 40;
    this.nameIndex = -1;

    this.board = new GameBoard(this, {
      grid: getHexagonGrid(this, this.tileSize),
      width: this.tileCountW,
      height: this.tileCountH
    });

    this.round = 1;
    this.resources = {
      nectar: 0,
      honey: 100,
      jelly: 0,
      wax: 100
    };

    // Hide it with cover up tiles
    this.hiddenTiles = [];
    this.visibleTiles = [];

    let i;
    let j;
    for (i = 0; i < this.tileCountW; i++) {
      this.hiddenTiles.push([]);
      for (j = 0; j < this.tileCountH; j++) {
        this.hiddenTiles[i][j] = new HiddenTile({
          board: this.board,
          tileXY: {
            x: i,
            y: j
          }
        });
      }
    }

    let centerCoords = this.board.getCenterCoordinates();
    let defaultPlayerUnitConfig = {
      board: this.board,
      movingPoints: 3,
      hitPoints: 2,
      discoverRangePoints: 3
    };

    const getGodUnit = () =>
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: "God",
          movingPoints: 999,
          tileXY: {
            x: 0,
            y: 19
          }
        })
      );

    this.units = [
      // getGodUnit(),
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: PLAYER_UNIT.NAMES[++this.nameIndex],
          tileXY: {
            x: centerCoords.x - 2,
            y: centerCoords.y + 1
          }
        })
      ),
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: PLAYER_UNIT.NAMES[++this.nameIndex],
          tileXY: {
            x: centerCoords.x - 1,
            y: centerCoords.y - 1
          }
        })
      ),
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: PLAYER_UNIT.NAMES[++this.nameIndex],
          tileXY: {
            x: centerCoords.x + 2,
            y: centerCoords.y
          }
        })
      ),
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: PLAYER_UNIT.NAMES[++this.nameIndex],
          tileXY: {
            x: centerCoords.x - 3,
            y: centerCoords.y + 2
          }
        })
      ),
      new PlayerUnit(
        Object.assign({}, defaultPlayerUnitConfig, {
          name: PLAYER_UNIT.NAMES[++this.nameIndex],
          tileXY: {
            x: centerCoords.x - 2,
            y: centerCoords.y - 2
          }
        })
      )
    ];

    this.hive = [
      new Room({
        board: this.board,
        tileXY: centerCoords
      })
    ];

    this.resources = [];
    let placementProbability;
    let initialPlacementProbability = (placementProbability = 0.9);

    const place = (prob, i) => {
      if (Math.random() < prob) {
        this.resources.push(
          new Resource({
            board: this.board,
            tileXY: {
              x: i,
              y:
                this.board.verticalTileCount - 1 - Math.floor(Math.random() * 3)
            }
          })
        );
        if (prob < 0.3) {
          prob = 0;
        } else {
          prob -= 0.3;
        }
      } else {
        prob += 0.05;
      }

      return prob;
    };

    // Place resources
    let iX;
    for (iX = 0; iX < centerCoords.x - 8; iX++) {
      placementProbability = place(placementProbability, iX);
    }

    for (iX = this.board.width - 1; iX >= centerCoords.x + 8; iX--) {
      placementProbability = place(placementProbability, iX);
    }

    // placement progression
    // 100%
    // 90%
    // 80%
    // 70%
    //

    this.activeUnit = this.units[0];
    this.discoverTiles();
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

    // Manually calculated for 300x20 tiles
    this.mapBounds = { width: 20000, height: 3000 };

    this.cameras.main.setBounds(
      0,
      0,
      // (this.tileCountW * this.tileSize -
      //   (Math.ceil(this.tileCountW / 2) * this.tileSize) / 2) *
      //   window.devicePixelRatio,
      // this.tileCountW * this.tileSize * window.devicePixelRatio,

      // this.tileCountH * this.tileSize * window.devicePixelRatio
      this.mapBounds.width,
      this.mapBounds.height
    );

    this.lastMovedToTile = {
      x: 0,
      y: 0
    };

    this.activeUnit.select();

    this.game.events.emit("game.roundstart", { round: this.round });
    this.game.events.emit("game.mapupdate", { map: this.mapBounds });
    this.game.events.emit("game.unitsupdate", { units: this.units });

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
    this.game.events.on("ui.selectunit", this.unitWasSelected, this);
    this.game.events.on("ui.viewportdragged", this.updateViewport, this);

    this.game.events.on("unit.movedone", this.selectNextUnit, this);
    this.game.events.on("ui.actionselected", this.onActionSelected, this);

    this.add.sprite();
    // console.log(this.cameras.main);
  }

  unitWasSelected({ unit }) {
    this.setActiveUnit(unit);
    unit.select(false);
  }

  onActionSelected(event) {
    this.activeUnit.selectAction(event);
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

    /// Check if any player units are moving
    if (this.isAnyUnitMoving()) {
      this.discoverTiles();
    }
  }

  updateViewport(e) {
    let { position } = e;
    console.log("updateViewport", position);
    this.cameras.main.setScroll(position.x, position.y);
  }

  setActiveUnit(unit) {
    this.units.forEach(u => {
      u.hideMoveableArea();
    });
    this.activeUnit = unit;
  }

  isAnyUnitMoving() {
    return this.units.reduce((out, u) => u.moveTo.isRunning || out, false);
  }

  getAllVisibleUnitTiles() {
    return flatten(this.units.map(u => u.getVisibleCoords()));
  }

  discoverTiles() {
    let latestVisibleTiles = this.getAllVisibleUnitTiles();

    let tilesXYLeftBehind = differenceBy(
      this.visibleTiles,
      latestVisibleTiles,
      coordKeyExtractor
    );

    let tilesXYNewlyDiscovered = differenceBy(
      latestVisibleTiles,
      this.visibleTiles,
      coordKeyExtractor
    );

    tilesXYLeftBehind.forEach(coord => {
      this.hiddenTiles[coord.x][coord.y].visible = true;
    });

    tilesXYNewlyDiscovered.forEach(coord => {
      this.hiddenTiles[coord.x][coord.y].visible = false;
    });

    console.log("discoverTiles", this);

    this.visibleTiles = latestVisibleTiles;
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
    // background 80dfff
    this.horizontalTileCount = config.width;
    this.verticalTileCount = config.height;
    this.graphics = scene.add.graphics({
      lineStyle: {
        width: 1,
        color: 0xffffff,
        alpha: 1
      }
      // fillStyle: {
      //   color: 0x80dfff,
      //   alpha: 1
      // }
    });

    this.graphics.fillStyle(0x80dfff, 1.0);
    this.forEachTileXY((tileXY, board) => {
      var points = board.getGridPoints(tileXY.x, tileXY.y, true);
      this.graphics.strokePoints(points, true); // This draws the lines you see between the hexagons.
    });
    // enable touch events
    this.setInteractive();

    this.on(
      "board.pointerdown",
      pointer => {
        console.log("tiledown pointer", pointer);
      },
      this
    );
  }

  getCenterCoordinates() {
    return {
      x: Math.round(this.horizontalTileCount / 2),
      y: Math.round(this.verticalTileCount / 2)
    };
  }
}

// class Tile extends Shape {
//   constructor(options) {
//     let { board, tileXY } = options;
//     var scene = board.scene;
//     if (tileXY === undefined) {
//       throw "Please provide coordinates in tileXY. e.g. {x: 0, y: 5}";
//     }
//     // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
//     super(board, tileXY.x, tileXY.y, 1, 0xffff00, 0.5);
//   }
// }

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

class Resource extends BoardShape {
  constructor(options) {
    let { board, tileXY } = options;
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 2, 0x0000ff, 0.5);
    scene.add.existing(this);
  }
}

class PlayerUnit extends BoardShape {
  constructor(options = {}) {
    let {
      board,
      tileXY,
      movingPoints,
      discoverRangePoints,
      isTurnDone,
      name,
      key,
      hitPoints
    } = options;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 6, 0x00cc00);
    this.scene = board.scene;
    this.name = name.toUpperCase();
    this.key = key || name || getUUID();
    this.scene.add.existing(this);
    this.setDepth(1);
    this.setScale(0.75);

    // add behaviors
    this.moveTo = this.scene.rexBoard.add.moveTo(this);
    this.pathFinder = this.scene.rexBoard.add.pathFinder(this, {
      occupiedTest: true
    });

    // private members
    this.maxHitPoints = this.hitPoints = hitPoints;
    this.maxMovingPoints = this.movingPoints = movingPoints || 4;
    this.discoverRangePoints = discoverRangePoints;
    this._discoverRangeMap = {};
    this.moveableTiles = [];
    this._hasInteracted = false;
    this.isTurnDone = !!isTurnDone || false;

    // events
    this.on("board.pointerdown", this.onPointerDown.bind(this), this);
  }

  onPointerDown(pointer) {
    this.select();
  }

  resetMovingPoints() {
    this.movingPoints = this.maxMovingPoints;
  }

  getAvailableActions() {
    let actions = [];

    if (this.canMove()) {
      actions.push(ACTION.MOVE);
    }

    if (this.canBuild()) {
      actions.push(ACTION.BUILD);
    }

    if (this.canFarm()) {
      actions.push(ACTION.FARM);
    }

    if (this.canAttack()) {
      actions.push(ACTION.ATTACK);
    }
    console.log("getAvailableActions", actions);
    return actions;
  }

  canAct() {
    return (
      this.canMove() || this.canBuild() || this.canFarm() || this.canAttack()
    );
  }

  canMove() {
    return this.movingPoints > 0;
  }

  canBuild() {
    return false;
  }

  canFarm() {
    return false;
  }

  canAttack() {
    return false;
  }

  selectAction({ action }) {
    switch (action) {
      case ACTION.MOVE:
        this.selectMoveAction();
        return;
      case ACTION.BUILD:
        this.selectBuildAction();
        return;
      case ACTION.FARM:
        this.selectFarmAction();
        return;
      case ACTION.ATTACK:
        this.selectAttackAction();
        return;
    }
  }

  selectMoveAction() {
    this.showMoveableArea();
  }

  selectBuildAction() {}

  selectFarmAction() {}

  selectAttackAction() {}

  equals(other) {
    if (!other) return false;
    return this.key === other.key;
  }

  isSelected() {
    return this.equals(this.scene.activeUnit);
  }

  select(shouldEmit = true) {
    this.scene.setActiveUnit(this);
    this.scene.cameras.main.pan(
      this.x + window.innerWidth / 2,
      this.y + window.innerHeight / 2,
      1000
    );

    if (shouldEmit) {
      this.scene.game.events.emit("game.selectunit", {
        unit: this,
        position: { x: this.x, y: this.y }
      });
    }
  }

  getVisibleCoords() {
    return this.pathFinder
      .findArea(this.discoverRangePoints)
      .concat({ x: this.tileX, y: this.tileY });
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

    let tileDest = path.shift();
    this.tileX = tileDest.x;
    this.tileY = tileDest.y;

    this.moveTo.moveTo(tileDest);

    return this;
  }
}

class HiddenTile extends BoardShape {
  constructor(options) {
    let { board, tileXY } = options;
    var scene = board.scene;
    if (tileXY === undefined) {
      tileXY = board.getRandomEmptyTileXY(0);
    }
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 4, 0x0000ff, 1);
    scene.add.existing(this);
  }
}

class MoveableTile extends BoardShape {
  constructor(unit, tileXY) {
    //   console.log('MoveableTile constructor tileXY', tileXY);
    var board = unit.rexChess.board;
    var scene = board.scene;
    // Shape(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard)
    super(board, tileXY.x, tileXY.y, 5, 0x330000);
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
