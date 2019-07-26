import { delay } from 'redux-saga';
import {
  take,
  race,
  call,
} from 'redux-saga/effects';

export default function* every(secs, saga, cancelAction) {
  function* loop(secs, saga) {
    while (true) {
      yield* saga();
      yield delay(secs);
    }
  }
  yield race([
    call(loop, secs, saga),
    take(cancelAction),
  ]);
}