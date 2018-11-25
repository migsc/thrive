import Hexagon from "plugins/utils/grid/hexagon/Hexagon.js";
import SaveOrigin from "../utils/SaveOrigin.js";
import RestoreOrigin from "../utils/RestoreOrigin.js";
import GetNeighborTileX from "plugins/utils/grid/hexagon/GetNeighborTileX.js";
import GetNeighborTileY from "plugins/utils/grid/hexagon/GetNeighborTileY.js";
import GetNeighborTileDirection from "plugins/utils/grid/hexagon/GetNeighborTileDirection.js";
import GetOppositeDirection from "plugins/utils/grid/hexagon/GetOppositeDirection.js";
import Offset from "plugins/utils/grid/hexagon/Offset.js";
import Rotate from "plugins/utils/grid/hexagon/Rotate.js";
import GetDistance from "plugins/utils/grid/hexagon/GetDistance.js";
import GetGridPoints from "./GetGridPoints.js";
import GetGridPolygon from "./GetGridPolygon.js";

class HexagonGrid extends Hexagon {
  constructor(config) {
    super(config);
  }

  resetFromJSON(o) {
    super.resetFromJSON(o);
    this.directions = 6;
  }

  setDirectionMode(mode) {
    return this;
  }

  get allDirections() {
    return ALLDIR;
  }

  // board-match
  get halfDirections() {
    return HALFDIR;
  }

  // setOriginPosition
  // setCellSize
  // setType
  // getWorldX
  // getWorldY
  // getTileX
  // getTileY
  // getGridPolygon
}

const ALLDIR = [0, 1, 2, 3, 4, 5];
const HALFDIR = [0, 1, 2];

var methods = {
  saveOrigin: SaveOrigin,
  restoreOrigin: RestoreOrigin,
  getNeighborTileX: GetNeighborTileX,
  getNeighborTileY: GetNeighborTileY,
  getNeighborTileDirection: GetNeighborTileDirection,
  getOppositeDirection: GetOppositeDirection,
  offset: Offset,
  rotate: Rotate,
  getDistance: GetDistance,
  getGridPoints: GetGridPoints,
  getGridPolygon: GetGridPolygon
};
Object.assign(HexagonGrid.prototype, methods);

export default HexagonGrid;
