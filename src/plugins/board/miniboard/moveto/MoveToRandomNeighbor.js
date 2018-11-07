import Clone from 'plugins/utils/object/Clone.js';

const Shuffle = Phaser.Utils.Array.Shuffle;

var MoveToRandomNeighbor = function () {
    var miniBoard = this.miniBoard;
    var mainBoard = miniBoard.mainBoard;
    // Not on a mainBoard
    if (mainBoard == null) {
        this.lastMoveResult = false;
        return this;
    }

    var directions = mainBoard.grid.allDirections;
    if (tmpDirections.length !== directions.length) {
        Clone(directions, tmpDirections);
    }
    Shuffle(tmpDirections);
    for (var i = 0, cnt = tmpDirections.length; i < cnt; i++) {
        this.moveToward(tmpDirections[i]);
        if (this.lastMoveResult) {
            return this;
        }
    }
    return this;
}

var tmpDirections = [];
export default MoveToRandomNeighbor;