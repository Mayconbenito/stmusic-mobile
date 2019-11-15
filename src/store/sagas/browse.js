import { put, call, all, takeLatest } from 'redux-saga/effects';

import api from '~/services/api';

import {
  Types as BrowseTypes,
  Creators as BrowseActions,
} from '../ducks/browse';

const {
  successGenres,
  failureGenres,
  successRecentlyPlayed,
  failureRecentlyPlayed,
  successTrending,
  failureTrending,
  successMostPlayed,
  failureMostPlayed,
  successMostFollowed,
  failureMostFollowed,
} = BrowseActions;

function* fetchGenres() {
  try {
    const response = yield call(api.get, '/genres');

    yield put(successGenres(response.data.genres));
  } catch (err) {
    yield put(failureGenres(err));
  }
}

function* fetchRecentlyPlayed() {
  try {
    const response = yield call(api.get, '/me/recently-played', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(successRecentlyPlayed(response.data.tracks));
  } catch (err) {
    yield put(failureRecentlyPlayed(err));
  }
}

function* fetchTrending() {
  try {
    const response = yield call(api.get, '/browse/tracks/trending', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(successTrending(response.data.tracks));
  } catch (err) {
    yield put(failureTrending(err));
  }
}

function* fetchMostPlayed() {
  try {
    const response = yield call(api.get, '/browse/tracks/most-played', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(successMostPlayed(response.data.tracks));
  } catch (err) {
    yield put(failureMostPlayed(err));
  }
}

function* fetchMostFollowed() {
  try {
    const response = yield call(api.get, '/browse/artists/most-followed', {
      params: {
        page: 1,
        limit: 60,
      },
    });

    yield put(successMostFollowed(response.data.artists));
  } catch (err) {
    yield put(failureMostFollowed(err));
  }
}

export default function* browseSaga() {
  yield all([
    takeLatest(BrowseTypes.FETCH_GENRES, fetchGenres),
    takeLatest(BrowseTypes.FETCH_RECENTLY_PLAYED, fetchRecentlyPlayed),
    takeLatest(BrowseTypes.FETCH_TRENDING, fetchTrending),
    takeLatest(BrowseTypes.FETCH_MOST_PLAYED, fetchMostPlayed),
    takeLatest(BrowseTypes.FETCH_MOST_FOLLOWED, fetchMostFollowed),
  ]);
}
