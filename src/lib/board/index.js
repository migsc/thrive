import {
    xyz2q,
    xyz2r
} from 'plugins/utils/grid/hexagon/CubeTransfer.js';

const getBoard = function (board, radius, out) {
    if (out === undefined) {
        out = [];
    }
    var mode = board.grid.mode;
    var r1, r2;
    for (var q = -radius; q <= radius; q++) {
        r1 = Math.max(-radius, -q - radius);
        r2 = Math.min(radius, -q + radius);
        for (var r = r1; r <= r2; r++) {
            out.push({
                x: xyz2q(mode, q, r, -q - r),
                y: xyz2r(mode, q, r, -q - r)
            });
        }
    }

    return out;
}
export default getBoard;