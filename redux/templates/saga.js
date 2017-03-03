import { put, takeEvery } from 'redux-saga';
import { MY_ACTION_TYPE, receivedMyActionType } from '../actions/<%= dashed %>';

export function* myWorker() {
  // const response = apiDataService.getAll();
  const response = [];
  yield put(receivedMyActionType(response));
}

export function* getMyActionType() {
  yield takeEvery(MY_ACTION_TYPE, myWorker);
}
