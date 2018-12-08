import { race, take } from "redux-saga/effects";
import { delay } from "redux-saga";

const promiseMiddleware = ({
  sagaMiddleware,
  timeout = 60000
}) => store => next => action => {
  if (!action.success || !action.failure) {
    return next(action);
  }

  const successType = action.success().type;
  const failureType = action.failure().type;

  return new Promise((resolve, reject) => {
    next(action);
    sagaMiddleware.run(function*() {
      const [success, failure, timedOut] = yield race([
        take(successType),
        take(failureType),
        delay(timeout)
      ]);
      console.log("success", success);
      console.log("failure", failure);
      if (success) {
        resolve(success);
      } else if (failure) {
        reject(failure);
      } else if (timedOut) {
        reject(new Error(`Action: ${action.type} timed out after ${timeout}`));
      } else {
        // This should not be reachable
        reject(new Error(`Action: ${action.type} did not succeed, fail, or time out. Something went wrong ¯\\_(ツ)_/¯`));
      }
    });
  });
};

export default promiseMiddleware;
