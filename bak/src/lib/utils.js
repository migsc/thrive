let memoize = require("memoizee");
let crypto = require("crypto");

export const getFibNumAt = memoize(
  n => (n < 2 ? n : getFibNumAt(n - 1) + getFibNumAt(n - 2)),
  { length: 1, primitive: true }
);

export const getFibNumListTo = (i, _result = []) => {
  if (i === -1) return _result;
  else {
    _result.unshift(getFibNumAt(i));
    return getFibNumListTo(--i, _result);
  }
};

export const getGraphFibTo = i => {
  return getFibNumListTo(i).map((fibNum, position) => ({
    x: position,
    y: fibNum
  }));
};

const _rng = crypto.randomBytes(16);
const _bytesToUuid = (buf, offset) => {
  var i = offset || 0;
  var bth = byteToHex;
  // join used to fix memory issue caused by concatenation: https://bugs.chromium.org/p/v8/issues/detail?id=3175#c4
  return [
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    "-",
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]],
    bth[buf[i++]]
  ].join("");
};

export const getUUID = (options, buf, offset) => {
  let i = (buf && offset) || 0;

  if (typeof options == "string") {
    buf = options === "binary" ? new Array(16) : null;
    options = null;
  }
  options = options || {};

  let rnds = options.random || (options.rng || rng)();

  // Per 4.4, set bits for version and `clock_seq_hi_and_reserved`
  rnds[6] = (rnds[6] & 0x0f) | 0x40;
  rnds[8] = (rnds[8] & 0x3f) | 0x80;

  // Copy bytes to buffer, if provided
  if (buf) {
    for (let ii = 0; ii < 16; ++ii) {
      buf[i + ii] = rnds[ii];
    }
  }

  return buf || _bytesToUuid(rnds);
};
