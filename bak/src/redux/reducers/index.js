import { combineReducers } from "redux";
import { get, pick } from "lodash";
import ui from "./ui";
import uiSectionTop from "./uiSectionTop";
import uiSectionBottom from "./uiSectionBottom";
import uiTabMap from "./uiTabMap";
import uiTabUnits from "./uiTabUnits";

import update from "immutability-helper";

const appReducer = combineReducers({
  ui,
  uiSectionTop,
  uiSectionBottom,
  uiTabMap,
  uiTabUnits
});

export default function rootReducer(state, action) {
  let { ...nextState } = appReducer(state, action);
  return nextState;
}
