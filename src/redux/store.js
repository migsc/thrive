import { createStore, applyMiddleware, compose } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import createSagaMiddleware from "redux-saga";
import reducers from "./reducers";
import rootSaga from "./sagas";
import promiseMiddleware from "./middleware/promiseMiddleware";

const persistConfig = {
  key: "root",
  storage,
  blacklist: ["alerts", "buildings"]
};

const persistedReducer = persistReducer(persistConfig, reducers);

export function configureStore() {
  const sagaMiddleware = createSagaMiddleware();
  const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

  const store = createStore(
    persistedReducer,
    composeEnhancers(
      applyMiddleware(sagaMiddleware, promiseMiddleware({ sagaMiddleware }))
    )
  );

  sagaMiddleware.run(rootSaga);
  return store;
}
