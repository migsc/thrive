import GetChessData from '../chess/GetChessData.js';
import CONST from './const.js';
import AStarSearch from './astartsearch/AStarSearch.js';
import GetCost from './GetCost.js';
import FindArea from './FindArea.js';
import GetPath from './GetPath.js';
import FindPath from './FindPath.js';
import TileXYToCost from './TileXYToCost.js';

const GetValue = Phaser.Utils.Objects.GetValue;
const BLOCKER = CONST.BLOCKER;
const INFINITY = CONST.INFINITY;

class PathFinder {
    constructor(gameObject, config) {
        this.gameObject = gameObject;
        this.chessData = GetChessData(gameObject);
        this.nodesManager = undefined;
        this.resetFromJSON(config);
    }

    resetFromJSON(o) {
        var costCallback = GetValue(o, 'costCallback', undefined);
        var costCallbackScope = GetValue(o, 'costCallbackScope', undefined);
        if (costCallback === undefined) {
            costCallback = GetValue(o, 'cost', 1);
        }
        this.setOccupiedTest(GetValue(o, 'occupiedTest', false));
        this.setBlockerTest(GetValue(o, 'blockerTest', false));
        this.setEdgeBlockerTest(GetValue(o, 'edgeBlockerTest', false));
        this.setCostFunction(costCallback, costCallbackScope);
        this.setPathMode(GetValue(o, 'pathMode', 0));
        this.setCacheCostMode(GetValue(o, 'cacheCost', true));
        this.setWeight(GetValue(o, 'weight', 10));
        this.setShuffleNeighborsMode(GetValue(o, 'shuffleNeighbors', false));
        return this;
    }

    boot() {
        if (this.gameObject.on) { // oops, bob object does not have event emitter
            this.gameObject.on('destroy', this.destroy, this);
        }
    }

    shutdown() {
        if (this.nodesManager !== undefined) {
            this.nodesManager.destroy();
        }
        this.gameObject = undefined;
        this.chessData = undefined;
        return this;
    }

    destroy() {
        this.shutdown();
        return this;
    }

    setCostFunction(callback, scope) {
        this.costCallback = callback;
        this.costCallbackScope = scope;
        return this;
    }

    setPathMode(mode) {
        if (typeof (mode) === 'string') {
            mode = CONST[mode];
        }
        this.pathMode = mode;
        return this;
    }

    setCacheCostMode(value) {
        if (value === undefined) {
            value = true;
        }
        this.cacheCost = value;
        return this;
    }

    setOccupiedTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.occupiedTest = enable;
        return this;
    }

    setBlockerTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.blockerTest = enable;
        return this;
    }

    setEdgeBlockerTest(enable) {
        if (enable === undefined) {
            enable = true;
        }
        this.edgeBlockerTest = enable;
        return this;
    }

    setWeight(value) {
        this.weight = value;
        return this;
    }

    setShuffleNeighborsMode(value) {
        if (value === undefined) {
            value = true;
        }
        this.shuffleNeighbors = value;
        return this;
    }

    get BLOCKER() {
        return BLOCKER;
    }

    get INFINITY() {
        return INFINITY;
    }

    get board() {
        return this.chessData.board;
    }
}

var methods = {
    aStarSearch: AStarSearch,
    getCost: GetCost,
    findArea: FindArea,
    getPath: GetPath,
    findPath: FindPath,
    tileXYToCost: TileXYToCost,
};
Object.assign(
    PathFinder.prototype,
    methods
);

const PATHMODE = {
    'random': 0,
    'diagonal': 1,
    'straight': 2,
    'A*': 3,
    'line': 4,
    'A*-line': 5,
    'A*-random': 6
}

export default PathFinder;