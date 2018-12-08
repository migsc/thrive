let _store = null;
let _persistor = null

export function setStore(store) {
  _store = store;
}

export function getStore() {
  return _store;
}

export function setPersistor(persistor) {
  _persistor = persistor;
} 

export function getPersistor() {
  return _persistor;
}