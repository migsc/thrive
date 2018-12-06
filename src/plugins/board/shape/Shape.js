import CreateChessData from "../chess/GetChessData.js";
import IsMiniBoardObject from "./../miniboard/IsMiniBoardObject.js";

class Shape extends Phaser.GameObjects.Polygon {
  constructor(board, tileX, tileY, tileZ, fillColor, fillAlpha, addToBoard) {
    if (addToBoard === undefined) {
      addToBoard = true;
    }

    // Chess-Container
    var isMiniBoard = IsMiniBoardObject(board),
      miniBoard;
    if (isMiniBoard) {
      miniBoard = board;
      board = miniBoard.board;
    }

    var scene = board.scene;
    var worldX, worldY;
    if (addToBoard) {
      worldX = 0;
      worldY = 0;
    } else {
      worldX = tileX;
      worldY = tileY;
    }
    var points = board.getGridPoints(undefined, undefined, true);
    shiftToO(points);
    super(scene, worldX, worldY, points, fillColor, fillAlpha);

    this.tileX = tileX;
    this.tileY = tileY;

    if (addToBoard) {
      if (isMiniBoard) {
        // Chess-Container
        miniBoard.addChess(this, tileX, tileY, tileZ);
      } else {
        board.addChess(this, tileX, tileY, tileZ, true);
      }
    } else {
      CreateChessData(this);
    }
  }
}

var shiftToO = function(points) {
  var minX = Infinity;
  var minY = Infinity;
  var point;
  for (var i = 0, cnt = points.length; i < cnt; i++) {
    point = points[i];
    minX = Math.min(minX, point.x);
    minY = Math.min(minY, point.y);
  }
  if (minX === 0 && minY === 0) {
    return points;
  }
  for (var i = 0, cnt = points.length; i < cnt; i++) {
    point = points[i];
    point.x -= minX;
    point.y -= minY;
  }
  return points;
};

export default Shape;
