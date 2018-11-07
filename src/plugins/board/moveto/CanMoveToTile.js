var CanMoveToTile = function (tileX, tileY, direction) {
    var board = this.chessData.board;
    // Chess is not in a board
    if (board == null) {
        return false;
    }
    var myTileXYZ = this.chessData.tileXYZ;
    var myTileX = myTileXYZ.x,
        myTileY = myTileXYZ.y,
        myTileZ = myTileXYZ.z;
    // Move to current position
    if ((tileX === myTileX) && (tileY === myTileY)) {
        return true;
    }
    // Target position is not in board
    if (!board.contains(tileX, tileY)) {
        return false;
    }

    if (direction === undefined) {
        direction = this.chessData.getTileDirection(tileX, tileY);
    }

    // Occupied test
    if (this.occupiedTest) {
        if (board.contains(tileX, tileY, myTileZ)) {
            return false;
        }
    }

    // Blocker test
    if (this.blockerTest) {
        if (board.hasBlocker(tileX, tileY)) {
            return false;
        }
    }

    // Edge-blocker test
    if (this.edgeBlockerTest) {
        var chess = this.TileXYToChessArray(myTileX, myTileY, tmpChessArray);
        if (chess.length > 1) {
            for (var i = 0, cnt = chess.length; i < cnt; i++) {
                if (chess[i] === this.gameObject) {
                    continue;
                }
                if (board.hasEdgeBlocker(myTileX, myTileY, this.chessToTileXYZ(chess[i]).z, direction)) {
                    tmpChessArray.length = 0;
                    return false;
                }
            }
        }
        tmpChessArray.length = 0;

        // TODO
    }

    // Custom moveable test
    if (this.moveableTestCallback) {
        tmpTileXYZ.x = tileX;
        tmpTileXYZ.y = tileY;
        tmpTileXYZ.direction = direction;
        if (this.moveableTestScope) {
            var moveable = this.moveableTestCallback.call(this.moveableTestScope, myTileXYZ, tmpTileXYZ, board);
        } else {
            var moveable = this.moveableTestCallback(myTileXYZ, tmpTileXYZ, board);
        }
        if (!moveable) {
            return false;
        }
    }

    return true;
}

var tmpTileXYZ = {
    x: 0,
    y: 0,
    direction: null
};

var tmpChessArray = [];

export default CanMoveToTile;