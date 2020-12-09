import { all, fork } from 'redux-saga/effects';

import player from './player';

export default function* rootSaga() {
  yield all([fork(player)]);
}
