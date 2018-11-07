import MoveToTask from 'plugins/behaviors/moveto/MoveTo.js';
import TickTask from 'plugins/utils/ticktask/TickTask.js';
import GetChessData from '../chess/GetChessData.js';

import CanMoveToTile from './CanMoveToTile.js';
import MoveToTile from './MoveToTile.js';
import MoveToward from './MoveToward.js';
import MoveToRandomNeighbor from './MoveToRandomNeighbor.js';
import MoveAway from './MoveAway.js';
import MoveCloser from './MoveCloser.js';

const GetValue = Phaser.Utils.Objects.GetValue;

class MoveTo extends TickTask {
    constructor(gameObject, config) {
        super(gameObject, config);

        this.gameObject = gameObject;
        this.chessData = GetChessData(gameObject);
        this.scene = gameObject.scene;
        this.moveToTask = new MoveToTask(gameObject, moveToTaskConfig);

        this.resetFromJSON(config);
        this.boot();
    }

    resetFromJSON(o) {
        this.isRunning = GetValue(o, 'isRunning', false);
        this.setEnable(GetValue(o, 'enable', true));
        this.timeScale = GetValue(o, 'timeScale', 1);
        this.setSpeed(GetValue(o, 'speed', 400));
        this.setRotateToTarget(GetValue(o, 'rotateToTarget', false));
        this.setOccupiedTest(GetValue(o, 'occupiedTest', false));
        this.setBlockerTest(GetValue(o, 'blockerTest', false));
        this.setEdgeBlockerTest(GetValue(o, 'edgeBlockerTest', false));
        this.setMoveableTestCallback(GetValue(o, 'moveableTest', undefined), GetValue(o, 'moveableTestScope', undefined));
        this.destinationTileX = GetValue(o, 'destinationTileX', null);
        this.destinationTileY = GetValue(o, 'destinationTileY', null);
        this.destinationDirection = GetValue(o, 'destinationDirection', null);
        this.lastMoveResult = GetValue(o, 'lastMoveResult', undefined);
        return this;
    }

    toJSON() {
        return {
            isRunning: this.isRunning,
            enable: this.enable,
            timeScale: this.timeScale,
            speed: this.speed,
            occupiedTest: this.occupiedTest,
            blockerTest: this.blockerTest,
            edgeBlockerTest: this.edgeBlockerTest,
            moveableTest: this.moveableTestCallback,
            moveableTestScope: this.moveableTestScope,
            rotateToTarget: this.rotateToTarget,
            destinationTileX: this.destinationTileX,
            destinationTileY: this.destinationTileY,
            destinationDirection: this.destinationDirection,
            lastMoveResult: this.lastMoveResult,
            tickingMode: this.tickingMode
        };
    }

    boot() {
        super.boot();
        if (this.gameObject.on) { // oops, bob object does not have event emitter
            this.gameObject.on('destroy', this.destroy, this);
        }
    }

    shutdown() {
        this.moveToTask.shutdown();
        super.shutdown();
        this.gameObject = undefined;
        this.scene = undefined;
    }

    destroy() {
        this.shutdown();
    }

    startTicking() {
        super.startTicking();
        this.scene.events.on('update', this.update, this);
    }

    stopTicking() {
        super.stopTicking();
        this.scene.events.off('update', this.update, this);
    }

    set enable(value) {
        this.moveToTask.setEnable(value);
    }

    get enable() {
        return this.moveToTask.enable;
    }

    setEnable(e) {
        if (e == undefined) {
            e = true;
        }
        this.enable = e;
        return this;
    }

    get timeScale() {
        return this.moveToTask.timeScale;
    }

    set timeScale(value) {
        this.moveToTask.timeScale = value;
    }

    set speed(value) {
        this.moveToTask.setSpeed(value);
    }

    get speed() {
        return this.moveToTask.speed;
    }

    setSpeed(speed) {
        this.speed = speed;
        return this;
    }

    set rotateToTarget(value) {
        this.moveToTask.setRotateToTarget(value);
    }

    get rotateToTarget() {
        return this.moveToTask.rotateToTarget;
    }

    setRotateToTarget(rotateToTarget) {
        this.rotateToTarget = rotateToTarget;
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

    setMoveableTestCallback(callback, scope) {
        this.moveableTestCallback = callback;
        this.moveableTestScope = scope;
        return this;
    }

    pause() {
        this.isRunning = false;
        return this;
    }

    resume() {
        this.isRunning = true;
        return this;
    }

    stop() {
        this.isRunning = false;
        return this;
    }

    /** @private */
    moveAlongLine(startX, startY, endX, endY) {
        if (startX !== undefined) {
            this.gameObject.x = startX;
        }
        if (startY !== undefined) {
            this.gameObject.y = startY;
        }
        this.moveToTask.moveTo(endX, endY);
        return this;
    };

    /** @private */
    addMoveLine(startX, startY, endX, endY) {
        if (!this.moveToTask.hasOwnProperty('nextlines')) {
            this.moveToTask.nextlines = [];
        }
        this.moveToTask.nextlines.push(
            [startX, startY, endX, endY]
        );
        return this;
    };

    /** @private */
    moveNextLine() {
        var nextlines = this.moveToTask.nextlines;
        if (!nextlines) {
            return false;
        }
        if (nextlines.length === 0) {
            return false;
        }
        // has next line
        this.moveAlongLine.apply(this, nextlines[0]);
        nextlines.length = 0;
        return true;
    }

    /** @private */
    update(time, delta) {
        if ((!this.isRunning) || (!this.enable)) {
            return this;
        }

        var moveToTask = this.moveToTask;
        moveToTask.update(time, delta);
        if (!moveToTask.isRunning) {
            if (!this.moveNextLine()) {
                this.complete();
            }
            return this;
        }
        return this;
    }
}

const moveToTaskConfig = {
    tickingMode: 0
};

var methods = {
    canMoveTo: CanMoveToTile,
    moveTo: MoveToTile,
    moveToward: MoveToward,
    moveToRandomNeighbor: MoveToRandomNeighbor,
    moveAway: MoveAway,
    moveCloser: MoveCloser,
};
Object.assign(
    MoveTo.prototype,
    methods
);


export default MoveTo;