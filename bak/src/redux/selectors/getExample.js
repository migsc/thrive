// import { createSelector } from "reselect";
// import { get, groupBy } from  "lodash";
// import moment from "moment";
// import { alertType } from "../../../constants";
// import Alert from "../../../models/Alert";

// export const getAlertsById = ({ alerts: { byId } }) => byId;

// export const getAlertsScreenFilter = ({ alertsScreen: { filter } }) => filter;

// export const getAlertTypeSelected = ({ alertsScreen: { typeSelected } }) => typeSelected;

// export const getActiveFilterSections = ({ alertsScreen: { activeFilterSections } }) => activeFilterSections;

// const getSortedAlerts = createSelector(
//   [getAlertsById],
//   (byId) => {
//     const alerts = Object.values(byId);
//     return alerts.sort((a, b) => moment(b.date).toDate() - moment(a.date).toDate() || b.id.localeCompare(a.id));
//   }
// );

// const getDerivedAlerts = createSelector(
//   [getAlertsById, getSortedAlerts],
//   (byId, alerts) => {
//     const alertIds = Object.keys(byId);

//     const groupedAlerts = groupBy(alertIds, alertId => byId[alertId].type);
//     const byType = {
//       ...groupedAlerts,
//       [alertType.POSITIVE_COST_AVOIDANCE]:
//         get(groupedAlerts, alertType.METER_PERFORMANCE, [])
//           .filter(id => +byId[id].data.costAvoidance >= 0)
//           .sort((a, b) => byId[b].data.costAvoidance - byId[a].data.costAvoidance),
//       [alertType.NEGATIVE_COST_AVOIDANCE]:
//         get(groupedAlerts, alertType.METER_PERFORMANCE, [])
//           .filter(id => +byId[id].data.costAvoidance < 0)
//           .sort((a, b) => byId[a].data.costAvoidance - byId[b].data.costAvoidance),
//     };

//     return {
//       alertsByType: byType,
//       alertsSortedByDate: alerts.map(({ id }) => id),
//     };
//   },
// );

// const getAlertsBySelectedType = createSelector(
//   [getAlertsById, getDerivedAlerts, getAlertTypeSelected],
//   (allAlertsById, { alertsByType, alertsSortedByDate }, typeSelected) =>
//     !typeSelected || typeSelected.value === 'All Types'
//       ? alertsSortedByDate.map(id => allAlertsById[id])
//       : get(alertsByType, typeSelected.value, []).map(alertId => allAlertsById[alertId])
// );

// export const getFilteredAlerts = createSelector(
//   [getAlertsBySelectedType, getAlertsScreenFilter],
//   (alerts, filter) => {
//     const searchTerm = filter.toLowerCase().trim();
//     return searchTerm ? Alert.searchAlerts(alerts, searchTerm) : alerts;
//   }
// );
