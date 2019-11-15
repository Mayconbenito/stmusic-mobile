import { put, call, all, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

import {
  Types as LibraryArtistTypes,
  Creators as LibraryArtistActions,
} from '../ducks/libraryArtist';

const { successArtists, failureArtists } = LibraryArtistActions;

function* fetchArtists({ page = 1 }) {
  try {
    const response = yield call(api.get, '/me/following/artists', {
      params: {
        page,
      },
    });

    yield put(successArtists(response.data.artists, response.data.meta.total));
  } catch (err) {
    yield put(failureArtists(err));
  }
}

export default function* libraryArtistSaga() {
  yield all([takeLatest(LibraryArtistTypes.FETCH_ARTISTS, fetchArtists)]);
}
