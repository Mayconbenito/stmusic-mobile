import TrackPlayer from 'react-native-track-player';
import { put, call, all, takeLatest, select } from 'redux-saga/effects';

import env from '~/config/env';

import api from '../../services/api';
import {
  Types as PlayerTypes,
  Creators as PlayerActions,
} from '../ducks/player';

const { successLoadQueue, successNext, successPrev } = PlayerActions;

function* init() {
  try {
    yield call(TrackPlayer.setupPlayer, {
      icon: require('../../assets/images/notification-icon.png'),
    });

    yield call(TrackPlayer.updateOptions, {
      stopWithApp: true,
      alwaysPauseOnInterruption: true,
      waitForBuffer: true,
      capabilities: [
        TrackPlayer.CAPABILITY_PLAY,
        TrackPlayer.CAPABILITY_PAUSE,
        TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
        TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
        TrackPlayer.CAPABILITY_STOP,
      ],
      icon: require('../../assets/images/notification-icon.png'),
    });

    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function* loadQueue({ queue, predefinedQueue }) {
  try {
    const playerState = yield select(state => state.player);

    if (!predefinedQueue) {
      if (playerState.active && playerState.queue.id !== queue.id) {
        yield call(TrackPlayer.reset);
      }

      yield put(
        successLoadQueue({
          active: true,
          showPlayer: true,
          queue: {
            name: queue.name,
            id: queue.id,
            type: queue.type,
            preloadedTrack: queue.preloadedTrack,
          },
        })
      );

      const queueResponse = yield call(
        api.get,
        `/app/${queue.type}/${queue.id}`
      );

      const queueTracksResponse = yield call(
        api.get,
        `/app/${queue.type}/${queue.id}/tracks`,
        {
          params: {
            limit: 100,
            page: 1,
          },
        }
      );

      const tracks = queueTracksResponse.data.tracks.map(track => ({
        id: track.id,
        url: `${env.STREAMER_URL}/yt?url=${track.youtubeId}`,
        duration: track.duration,
        title: track.name,
        artist: track.artists.map(
          (artist, index) => (index ? ', ' : '') + artist.name
        )[0],
        artwork: track.picture,
        album: queue.type === 'albums' ? queue.name : track.album.name,
      }));

      let name;
      if (queueResponse.data.playlist) {
        name = queueResponse.data.playlist.name;
      }

      if (queueResponse.data.artist) {
        name = queueResponse.data.artist.name;
      }

      if (queueResponse.data.genre) {
        name = queueResponse.data.genre.name;
      }

      if (queueResponse.data.album) {
        name = queueResponse.data.album.name;
      }

      const tracksQueue = yield call(TrackPlayer.getQueue);
      const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
      const currentTrackIndex = tracksQueue.findIndex(
        track => track.id === currentTrackId
      );

      yield call(TrackPlayer.add, tracks);

      yield call(TrackPlayer.play);

      yield put(
        successLoadQueue({
          active: true,
          showPlayer: true,
          queue: {
            name,
            currentTrackIndex,
            id: queue.id,
            items: queueTracksResponse.data.meta.items,
            total: queueTracksResponse.data.meta.total,
            page: queueTracksResponse.data.meta.page,
            type: queue.type,
          },
        })
      );
    } else {
      if (playerState.active && playerState.queue.id !== predefinedQueue.id) {
        yield call(TrackPlayer.reset);
      }

      yield put(
        successLoadQueue({
          active: true,
          showPlayer: true,
          queue: {
            name: predefinedQueue.name,
          },
        })
      );

      const tracks = predefinedQueue.tracks.map(track => ({
        id: track.id,
        url: `${env.STREAMER_URL}/yt?url=${track.youtubeId}`,
        duration: track.duration,
        title: track.name,
        artist: track.artists.map(
          (artist, index) => (index ? ', ' : '') + artist.name
        )[0],
        artwork: track.picture,
        album: track.album?.name,
      }));

      yield call(TrackPlayer.add, tracks);

      const tracksQueue = yield call(TrackPlayer.getQueue);
      const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
      const currentTrackIndex = tracksQueue.findIndex(
        track => track.id === currentTrackId
      );

      yield call(TrackPlayer.play);

      yield put(
        successLoadQueue({
          active: true,
          showPlayer: true,
          queue: {
            name: predefinedQueue.name,
            currentTrackIndex,
            id: predefinedQueue.id,
            items: predefinedQueue.tracks.length,
            total: predefinedQueue.tracks.length,
            page: 1,
            type: 'predefinedQueue',
          },
        })
      );
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function* loadSingleTrack({ track }) {
  try {
    yield call(TrackPlayer.reset);

    yield call(TrackPlayer.add, [
      {
        id: track.id,
        url: `${process.env.REACT_APP_STREAM_URL}/yt?url=${track.youtubeId}`,
        duration: track.duration,
        title: track.name,
        artist: track.artists.map(
          (artist, index) => (index ? ', ' : '') + artist.name
        )[0],
        artwork: track.picture,
        album: track.album?.name,
      },
    ]);

    const tracksQueue = yield call(TrackPlayer.getQueue);

    const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
    const currentTrackIndex = tracksQueue.findIndex(
      trackFromQueue => trackFromQueue.id === currentTrackId
    );

    yield put(
      successLoadQueue({
        active: true,
        showPlayer: true,
        queue: {
          name: track.name,
          currentTrackIndex,
          id: `singleTrack-${track.id}`,
          items: 1,
          total: 1,
          page: 1,
          type: 'singleTrack',
        },
      })
    );

    yield call(TrackPlayer.play);
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function* play({ track, queueId }) {
  try {
    const playerState = yield select(state => state.player);

    if (playerState.active && playerState.queue.id === queueId) {
      yield call(TrackPlayer.play);

      const currentTrack = yield call(TrackPlayer.getCurrentTrack);

      if (currentTrack) {
        yield call(TrackPlayer.skip, String(track.id));

        const tracksQueue = yield call(TrackPlayer.getQueue);
        const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
        const currentTrackIndex = tracksQueue.findIndex(
          trackFromQueue => trackFromQueue.id === currentTrackId
        );

        yield put(
          successNext({
            currentTrackIndex,
          })
        );
      }
    }
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function* resume() {
  yield call(TrackPlayer.play);
}

function* pause() {
  yield call(TrackPlayer.pause);
}

function* next() {
  try {
    const tracksQueue = yield call(TrackPlayer.getQueue);
    const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
    const currentTrackIndex = tracksQueue.findIndex(
      track => track.id === currentTrackId
    );

    if (tracksQueue[currentTrackIndex + 1]) {
      yield call(TrackPlayer.skipToNext);
    }

    yield put(
      successNext({
        currentTrackIndex,
      })
    );
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

function* prev() {
  try {
    const tracksQueue = yield call(TrackPlayer.getQueue);
    const currentTrackId = yield call(TrackPlayer.getCurrentTrack);
    const currentTrackIndex = tracksQueue.findIndex(
      track => track.id === currentTrackId
    );

    if (tracksQueue[currentTrackIndex - 1]) {
      yield call(TrackPlayer.skipToPrevious);
    }

    yield put(
      successPrev({
        currentTrackIndex,
      })
    );
    // eslint-disable-next-line no-empty
  } catch (err) {}
}

export default function* playerSaga() {
  yield all([
    init(),
    takeLatest(PlayerTypes.LOAD_QUEUE, loadQueue),
    takeLatest(PlayerTypes.LOAD_SINGLE_TRACK, loadSingleTrack),
    takeLatest(PlayerTypes.PLAY, play),
    takeLatest(PlayerTypes.RESUME, resume),
    takeLatest(PlayerTypes.PAUSE, pause),
    takeLatest(PlayerTypes.NEXT, next),
    takeLatest(PlayerTypes.PREV, prev),
  ]);
}
