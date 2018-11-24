var memoize = require("memoizee");

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
