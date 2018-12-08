import { get, overArgs, camelCase } from "lodash";
import { connect } from "react-redux";
import update from "immutability-helper";
import makeActionCreator from "../redux/utils/makeActionCreator";
import { takeLatest, call, put } from "redux-saga/effects";
import { compose } from "redux";
import { withProps } from "recompose";
//  { Reducer, Action } from '../redux/utils/makeActionCreator';

const generateSuccessActionName = actionName => `${actionName}_SUCCESS`;
const generateRefreshActionName = actionName => `REFRESH_${actionName}`;
const generateFailureActionName = actionName => `${actionName}_FAILURE`;

export const makeStateForSuccessFailureAction = key => ({
  [key]: {
    isLoading: false,
    isRefreshing: false,
    error: null
  }
});

export function makeActionSuccessFailureReducer(actionName, params = {}) {
  const {
    successActionName = generateSuccessActionName(actionName),
    failureActionName = generateFailureActionName(actionName),
    refreshActionName = generateRefreshActionName(actionName),
    isLoadingName = `${camelCase(actionName)}IsLoading`,
    isRefreshingName = `${camelCase(actionName)}IsRefreshing`,
    errorName = `${camelCase(actionName)}Error`
  } = params;
  const camelActionName = camelCase(actionName);
  return reducer => {
    const preservedState = get(reducer, "initialState", {});

    const augmentedInitialState = {
      ...preservedState,
      networkInfo: {
        ...preservedState.networkInfo,
        ...makeStateForSuccessFailureAction(camelActionName)
      }
    };

    const handlers = {
      [actionName]: (state, { payload = {}, silent, namespace }) =>
        update(state, {
          networkInfo: {
            [namespace || camelActionName]: {
              $merge: {
                isLoading: !silent,
                error: null
              }
            }
          },
          $merge: payload
        }),
      [refreshActionName]: (state, { payload = {}, silent, namespace }) =>
        update(state, {
          networkInfo: {
            [namespace || camelActionName]: {
              $merge: {
                isRefreshing: !silent,
                error: null
              }
            }
          },
          $merge: payload
        }),
      [successActionName]: (state, { payload = {}, namespace }) =>
        update(state, {
          networkInfo: {
            [namespace || camelActionName]: {
              $merge: {
                isLoading: false,
                isRefreshing: false,
                error: null
              }
            }
          },
          $merge: payload
        }),
      [failureActionName]: (state, { error, payload = {}, namespace }) =>
        update(state, {
          networkInfo: {
            [namespace || camelActionName]: {
              $merge: {
                isLoading: false,
                isRefreshing: false,
                error
              }
            }
          },
          $merge: payload
        })
    };

    const augmentedReducer = (state = augmentedInitialState, action) => {
      return handlers[action.type]
        ? reducer(handlers[action.type](state, action), action)
        : reducer(state, action);
    };

    // Support adding more networkInfo entries across function calls
    augmentedReducer.initialState = augmentedInitialState;

    return augmentedReducer;
  };
}

// type SuccessFailActionCreators<X: string> = {
//   [X]: X
// };

export function makeSuccessFailActionCreators(
  actionName: string,
  ...params: Array<string>
) {
  const refreshName = generateRefreshActionName(actionName);
  const successName = generateSuccessActionName(actionName);
  const failureName = generateFailureActionName(actionName);

  const action = makeActionCreator(actionName, ...params, "payload");
  const refresh = makeActionCreator(refreshName, ...params, "payload");
  const success = makeActionCreator(successName, "payload");
  const failure = makeActionCreator(failureName, "error", "payload");

  return {
    action: (...params: Array<any>) => ({
      ...action(...params),
      success,
      failure
    }),
    refresh: (...params: Array<any>) => ({
      ...refresh(...params),
      success,
      failure,
      isRefresh: true
    }),
    success,
    failure,
    refreshActionName: refreshName,
    successActionName: successName,
    failureActionName: failureName
  };
}
