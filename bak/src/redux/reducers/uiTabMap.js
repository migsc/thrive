import makeReducer from "../utils/makeReducer";
import makeActionCreator from "../utils/makeActionCreator";

// export const CHANGE_ALERTS_TYPES_SELECTED = 'CHANGE_ALERTS_TYPES_SELECTED';
// export const changeAlertsTypesSelected = makeActionCreator(CHANGE_ALERTS_TYPES_SELECTED, 'alertTypesSelected');

// export const CHANGE_ASSIGNED_USERS_SELECTED = 'CHANGE_ASSIGNED_USERS_SELECTED';
// export const changeAssignedUsersSelected = makeActionCreator(CHANGE_ASSIGNED_USERS_SELECTED, 'assignedUsersSelected');

// export const UPDATE_ACTIVE_ALERTS_FILTER_SECTIONS = 'UPDATE_ACTIVE_ALERTS_FILTER_SECTIONS';
// export const updateActiveAlertsFilterSections = makeActionCreator(UPDATE_ACTIVE_ALERTS_FILTER_SECTIONS, 'activeFilterSections')

const initialState = {};

const handlers = {
  // [ALERTS_ENTER_EDIT_MODE]: (state) => ({
  //   ...state,
  //   editMode: true,
  // }),
  // [ALERTS_EXIT_EDIT_MODE]: (state) => ({
  //   ...state,
  //   editMode: false,
  // }),
  // [CHANGE_ALERTS_FILTER]: (state, { filter }) => ({
  //   ...state,
  //   filter,
  // }),
  // [CHANGE_ALERTS_TYPE_SELECTED]: (state, { typeSelected }) => ({
  //   ...state,
  //   typeSelected,
  // }),
  // [CHANGE_STATUS_FILTER]: (state, { statusFilter }) => ({
  //   ...state,
  //   statusFilter
  // }),
  // [CHANGE_SORT_METHOD]: (state, {sortMethodSelected}) => ({
  //   ...state,
  //   sortMethodSelected
  // }),
  // [CHANGE_ALERTS_TYPES_SELECTED]: (state, {alertTypesSelected}) => ({
  //   ...state,
  //   alertTypesSelected
  // }),
  // [CHANGE_ASSIGNED_USERS_SELECTED]: (state, {assignedUsersSelected})=> ({
  //   ...state,
  //   assignedUsersSelected
  // }),
  // [UPDATE_ACTIVE_ALERTS_FILTER_SECTIONS]: (state, {activeFilterSections}) => ({
  //   ...state,
  //   activeFilterSections
  // })
};

export default makeReducer(initialState, handlers);
