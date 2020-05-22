import { put, call, all, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

import {
  Types as BrowseTypes,
  Creators as BrowseActions,
} from '../ducks/browse';

const { failure, setList } = BrowseActions;

function* fetchBrowse() {
  try {
    const recentlyPlayed = yield call(api.get, '/me/recently-played', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    put(setList(recentlyPlayed.data.tracks, 'recentlyPlayed'));

    const trending = yield call(api.get, '/browse/tracks/trending', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(setList(trending.data.tracks, 'trending'));

    const genres = yield call(api.get, '/genres');

    yield put(setList(genres.data.genres, 'genres'));

    const mostPlayed = yield call(api.get, '/browse/tracks/most-played', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(setList(mostPlayed.data.tracks, 'mostPlayed'));

    const mostFollowed = yield call(api.get, '/browse/artists/most-followed', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(setList(mostFollowed.data.artists, 'mostFollowed'));
  } catch (err) {
    yield put(failure(err));
  }
}

export default function* browseSaga() {
  yield all([takeLatest(BrowseTypes.FETCH_BROWSE, fetchBrowse)]);
}
