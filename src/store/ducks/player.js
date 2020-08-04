import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    fetchPlaylist: ['playlistId', 'playlistType'],
    successPlaylist: ['playlist'],
    playPlaylist: ['playlist'],
    play: ['track'],
    pause: [],
    resume: [],
    stop: [],
    prev: [],
    next: [],
    showPlayer: ['show'],
    clearState: [],
  },
  {
    prefix: 'player/',
  }
);

const initialState = {
  isPlaying: 'STOPPED',
  active: false,
  playlist: false,
};

const successPlaylist = (state = initialState, action) => ({
  ...state,
  isPlaying: 'PLAYING',
  active: action.playlist.tracks[0],
  playlist: action.playlist,
});

const playPlaylist = (state = initialState, action) => ({
  ...state,
  isPlaying: 'PLAYING',
  active: action.playlist.tracks[0],
  playlist: action.playlist,
  showPlayer: true,
});

const play = (state = initialState, action) => ({
  ...state,
  isPlaying: 'PLAYING',
  playlist: false,
  active: action.track,
  showPlayer: true,
});

const pause = (state = initialState) => ({
  ...state,
  isPlaying: 'PAUSED',
});

const resume = (state = initialState) => ({
  ...state,
  isPlaying: 'PLAYING',
});

const stop = (state = initialState) => ({
  ...state,
  isPlaying: 'STOPPED',
});

const prev = (state = initialState) => {
  if (state.playlist) {
    const activeTrackIndex = state.playlist.tracks.findIndex(
      i => i.id === state.active.id
    );
    if (activeTrackIndex >= 1) {
      return {
        ...state,
        isPlaying: 'PLAYING',
        active:
          state.playlist.tracks[
            state.playlist.tracks.findIndex(
              i => parseInt(i.id) === parseInt(state.active.id)
            ) - 1
          ],
      };
    }
  }
  return state;
};

const next = (state = initialState) => {
  if (state.playlist) {
    const activeTrackIndex = state.playlist.tracks.findIndex(
      i => i.id === state.active.id
    );

    if (activeTrackIndex < state.playlist.tracks.length - 1) {
      return {
        ...state,
        isPlaying: 'PLAYING',
        active:
          state.playlist.tracks[
            state.playlist.tracks.findIndex(
              i => parseInt(i.id) === parseInt(state.active.id)
            ) + 1
          ],
      };
    }
  }
  return state;
};

const showPlayer = (state = initialState, action) => ({
  ...state,
  showPlayer: action.show,
});

const clearState = () => initialState;

export default createReducer(initialState, {
  [Types.SUCCESS_PLAYLIST]: successPlaylist,
  [Types.PLAY_PLAYLIST]: playPlaylist,
  [Types.PLAY]: play,
  [Types.PAUSE]: pause,
  [Types.RESUME]: resume,
  [Types.STOP]: stop,
  [Types.PREV]: prev,
  [Types.NEXT]: next,
  [Types.SHOW_PLAYER]: showPlayer,
  [Types.CLEAR_STATE]: clearState,
});
