import { all, fork } from 'redux-saga/effects';

import browse from './browse';
import libraryArtist from './libraryArtist';
import libraryPlaylist from './libraryPlaylist';
import player from './player';

export default function* rootSaga() {
  yield all([
    fork(browse),
    fork(libraryArtist),
    fork(libraryPlaylist),
    fork(player),
  ]);
}
