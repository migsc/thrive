

export default function makeReducer(initialState, handlers) {
  const reducer = (state = initialState, action) =>
    handlers[action.type] ? handlers[action.type](state, action) : state;
  // Preserve the initial state so it can be augmented
  reducer.initialState = initialState;
  return reducer;
}