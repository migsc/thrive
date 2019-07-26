import { zipObject } from 'lodash';

export default function makeActionCreator(type, ...argNames) {
  return (...args) => ({
    type,
    ...zipObject(argNames, args),
  });
}