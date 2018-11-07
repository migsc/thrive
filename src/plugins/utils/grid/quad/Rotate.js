const Wrap = Phaser.Math.Wrap;
var Rotate = function (src, dir, out) {
    if (out === undefined) {
        out = tmp;
    }
    dir = Wrap(dir, 0, 3);
    var newTileX;
    var newTileY;
    switch (dir) {
        case 1:
            newTileX = -src.y;
            newTileY = src.x;
            break;
        case 2:
            newTileX = -src.x;
            newTileY = -src.y;
            break;
        case 3:
            newTileX = src.y;
            newTileY = -src.x;
            break;
        default:
            newTileX = src.x;
            newTileY = src.y;
            break;
    }
    // TODO: staggered?
    out.x = newTileX;
    out.y = newTileY;
    return out;
}
var tmp = {
    x: 0,
    y: 0
};
export default Rotate;