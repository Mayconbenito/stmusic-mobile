import { put, call, all, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

import {
  Types as LibraryPlaylistTypes,
  Creators as LibraryPlaylistActions,
} from '../ducks/libraryPlaylist';

const { successPlaylists, failurePlaylists } = LibraryPlaylistActions;

function* fetchPlaylists({ page = 1 }) {
  try {
    const response = yield call(api.get, '/me/playlists', {
      params: {
        page,
      },
    });

    yield put(
      successPlaylists(response.data.playlists, response.data.meta.total)
    );
  } catch (err) {
    yield put(failurePlaylists(err));
  }
}

export default function* librarySaga() {
  yield all([takeLatest(LibraryPlaylistTypes.FETCH_PLAYLISTS, fetchPlaylists)]);
}
