import {
  apply,
  put,
  takeLatest,
  takeEvery,
  select,
  all
} from "redux-saga/effects";
import {
  FETCH_UNASSIGNED_ALERTS_COUNT,
  fetchUnassignedAlertsCountSuccess,
  FETCH_ALERTS,
  ASSIGN_ALERTS,
  ESCALATE_ALERTS,
  DEESCALATE_ALERTS,
  RESOLVE_ALERTS,
  REJECT_ALERTS,
  REFRESH_FETCH_ALERTS,
  ADD_COMMENT_TO_ALERTS,
  fetchAlerts,
  ASSIGN_ALERTS_SUCCESS,
  ESCALATE_ALERTS_SUCCESS,
  RESOLVE_ALERTS_SUCCESS,
  REJECT_ALERTS_SUCCESS,
  DEESCALATE_ALERTS_SUCCESS,
  UNREJECT_ALERTS_SUCCESS,
  UNRESOLVE_ALERTS_SUCCESS,
  UNRESOLVE_ALERTS,
  UNREJECT_ALERTS,
  DELEGATE_ALERTS_SUCCESS,
  DELEGATE_ALERTS,
  UNASSIGN_ALERTS,
  UNASSIGN_ALERTS_SUCCESS,
  fetchUnassignedAlertsCount
} from "../reducers/alerts";
import AlertsService from "../../services/AlertsService";
import getUser from "../selectors/user/getUser";
import { showToast } from "../reducers/toast";
import getSelectedProgram from "../selectors/getSelectedProgram";
import update from "immutability-helper";
import { statusFilterOptionsMap, status } from "../../constants";
import getStatusFilter from '../selectors/alertsScreen/getStatusFilter';

function removeAlerts(byId, alerts) {
  return update(byId, {
    $unset: alerts.map(({ id }) => id)
  });
}

function addAlerts(byId, alerts) {
  return update(byId, {
    $merge: alerts.reduce((accum, alert) => ({ ...accum, [alert.id]: alert }))
  });
}

function removeTasks(tasks, tasksToRemove) {
  return {
    tasks: tasksToRemove.reduce(
      (accum, taskToRemove) =>
        accum.filter(task => task.id !== taskToRemove.id),
      tasks
    )
  };
}

function* watchFetchUnassignedAlertsCount() {
  try {
    const user = yield select(getUser);
    const unassignedCount = yield apply(
      AlertsService,
      "getUnassignedAlertsCount",
      [user]
    );

    yield put(fetchUnassignedAlertsCountSuccess(unassignedCount));
  } catch (err) {
    console.log(err);
  }
}

function* watchFetchAlerts({ user, status: _status, program, success, failure }) {
  try {
    const filterType = statusFilterOptionsMap(user)[_status.value];
    let alerts = [];

    if (filterType === status.UNASSIGNED) {
      alerts = yield apply(AlertsService, "getUnassignedAlerts", [user, program]);
    } else if (filterType === status.ASSIGNED) {
      alerts = yield apply(AlertsService, "getAssignedAlerts", [user]);
    } else {
      alerts = yield apply(AlertsService, 'getAlertsByStatus', [filterType]);
    } 

    const byId = alerts.reduce(
      (accum, alert) => ({ ...accum, [alert.id]: alert }),
      {}
    );
    yield put(success({ byId }));

  } catch (err) {
    yield put(failure(err));
    console.log(err);
  }
}

function* watchAssignAlerts({ alerts, success, failure }) {
  const user = yield select(getUser);

  try {
    const res = yield apply(AlertsService, "assignAlertsTo", [alerts, user]);

    const title = res.length > 1 ? `Assigned ${res.length} alerts` : "Assigned";

    const text =
      res.length > 1
        ? "You assigned these alerts to yourself. See them in the 'My Tasks' tab below."
        : "You assigned this alert to yourself. See it in the 'My Tasks' tab below.";

    yield put(
      showToast({
        title,
        text,
        type: "success",
        overlay: true,
        displayFrom: "topNav"
      })
    );

    yield put(success());
  } catch (err) {
    yield put(failure(err));
    console.log(err);
  }
}

function* watchUnassignAlerts({ alerts, user, success, failure }) {
  try {
    const res = yield apply(AlertsService, "unassignAlertsFrom", [
      alerts,
      user
    ]);

    const title =
      res.length > 1 ? `Unassigned ${res.length} tasks` : "Unassigned";

    const text =
      res.length > 1
        ? "You unassigned these alerts."
        : "You unassigned this alert.";

    yield put(success());

    yield put(
      showToast({
        title,
        text,
        type: "info",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchEscalateAlerts({ alerts, params, success, failure }) {
  const { toUser, toUserRole, comments } = params;

  try {
    let res;
    if (toUserRole) {
      res = yield apply(AlertsService, "escalateAlertsToRole", [
        alerts,
        toUserRole,
        comments
      ]);
    } else if (toUser) {
      res = yield apply(AlertsService, "escalateAlertsToUser", [
        alerts,
        toUser,
        comments
      ]);
    } else {
      const error =
        "toUserRole or toUser must be passed to ESCALATE_ALERTS params";
      console.error(error);
      yield put(failure(error));
      return;
    }

    yield put(success());
    const message =
      res.length === 1
        ? `You escalated this task. Someone should be on it soon.`
        : `You escalated ${res.length} tasks. Someone should be on these soon.`;
    yield put(
      showToast({
        title: "Escalated",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchDeEscalateAlerts({ alerts, comments, success, failure }) {
  try {
    const res = yield apply(AlertsService, "deEscalateAlerts", [
      alerts,
      comments
    ]);

    yield put(success());
    const message =
      res.length === 1
        ? `You de-escalated this task to a specialist. They should should be on it soon.`
        : `You de-escalated ${res.length} tasks to their previous specialists.`;
    yield put(
      showToast({
        title: "De-Escalated",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchResolveAlerts({
  alerts,
  resolution,
  comments,
  success,
  failure
}) {
  try {
    const res = yield apply(AlertsService, "resolveAlerts", [
      alerts,
      resolution,
      comments
    ]);

    yield put(success());
    const message =
      res.length === 1
        ? `You resolved this task!`
        : `You resolved ${res.length} tasks! Nice.`;
    yield put(
      showToast({
        title: "Resolved",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchUnresolveAlerts({ alerts, byUser, success, failure }) {
  try {
    const res = yield apply(AlertsService, "unresolveAlerts", [alerts, byUser]);
    yield put(success());

    const message =
      res.length === 1
        ? `You unresolved this task!`
        : `You unreolved ${res.length} tasks!`;
    yield put(
      showToast({
        title: "Unresolved",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchRejectAlerts({ alerts, success, failure }) {
  try {
    const res = yield apply(AlertsService, "rejectAlerts", [alerts]);
    yield put(success());
    const message =
      res.length === 1
        ? "This alert has been deleted. No one else will see it."
        : "These alerts have been deleted. No one else will see them.";
    yield put(
      showToast({
        title: "Rejected",
        text: message,
        type: "info",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchUnrejectAlerts({ alerts, byUser, toUser, success, failure }) {
  try {
    const res = yield apply(AlertsService, "unrejectAlerts", [
      alerts,
      byUser,
      toUser
    ]);

    yield put(success());

    const message =
      res.length === 1
        ? `You unrejected this task!`
        : `You unrejected ${res.length} tasks!`;
    yield put(
      showToast({
        title: "Unreject",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchAddCommentToAlerts({ alerts, comments, success, failure }) {
  try {
    const user = yield select(getUser);
    yield all(
      alerts.map(alert =>
        apply(AlertsService, "addCommentToAlert", [alert, user, comments])
      )
    );
    yield put(success());
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchDelegateAlerts({ alerts, toUser, byUser, success, failure }) {
  try {
    const user = yield select(getUser);

    const res = yield apply(AlertsService, "delegateAlertsTo", [
      alerts,
      toUser,
      user
    ]);

    yield put(success());

    const message =
      res.length === 1
        ? `You delegated this task!`
        : `You delegated ${res.length} tasks!`;
    yield put(
      showToast({
        title: "Delegate",
        text: message,
        type: "success",
        overlay: true
      })
    );
  } catch (err) {
    console.log(err);
    yield put(failure(err));
  }
}

function* watchSilentFetchAlerts() {
  const user = yield select(getUser);
  const programSelected = yield select(getSelectedProgram);
  const statusFilterTypeSelected = yield select(getStatusFilter);

  yield put(fetchAlerts(user, statusFilterTypeSelected, programSelected));
  yield put(fetchUnassignedAlertsCount());
}

export default function* alertsSaga() {
  yield all([
    takeLatest(FETCH_UNASSIGNED_ALERTS_COUNT, watchFetchUnassignedAlertsCount),
    takeLatest([FETCH_ALERTS, REFRESH_FETCH_ALERTS], watchFetchAlerts),
    takeEvery(ASSIGN_ALERTS, watchAssignAlerts),
    takeEvery(UNASSIGN_ALERTS, watchUnassignAlerts),
    takeEvery(ESCALATE_ALERTS, watchEscalateAlerts),
    takeEvery(DEESCALATE_ALERTS, watchDeEscalateAlerts),
    takeEvery(RESOLVE_ALERTS, watchResolveAlerts),
    takeEvery(REJECT_ALERTS, watchRejectAlerts),
    takeEvery(UNREJECT_ALERTS, watchUnrejectAlerts),
    takeEvery(UNRESOLVE_ALERTS, watchUnresolveAlerts),
    takeEvery(ADD_COMMENT_TO_ALERTS, watchAddCommentToAlerts),
    takeEvery(DELEGATE_ALERTS, watchDelegateAlerts),
    takeEvery(
      [
        ASSIGN_ALERTS_SUCCESS,
        UNASSIGN_ALERTS_SUCCESS,
        ESCALATE_ALERTS_SUCCESS,
        DEESCALATE_ALERTS_SUCCESS,
        RESOLVE_ALERTS_SUCCESS,
        REJECT_ALERTS_SUCCESS,
        UNREJECT_ALERTS_SUCCESS,
        UNRESOLVE_ALERTS_SUCCESS,
        DELEGATE_ALERTS_SUCCESS
      ],
      watchSilentFetchAlerts
    )
  ]);
}
