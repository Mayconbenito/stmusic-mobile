import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    loadQueue: ['queue', 'predefinedQueue'],
    loadSingleTrack: ['track'],
    successLoadQueue: ['data'],
    play: ['track', 'queueId'],
    pause: [],
    resume: [],
    stop: [],
    prev: [],
    next: [],
    skipToIndex: ['index'],
    successNext: ['data'],
    successPrev: ['data'],
    setVolume: ['volume'],
  },
  {
    prefix: 'player/',
  }
);

const initialState = {
  showPlayer: false,
  active: false,
  queue: false,
};

const loadQueue = (state = initialState) => state;

const loadSingleTrack = (state = initialState) => state;

const successLoadQueue = (state = initialState, action) => ({
  ...state,
  ...action.data,
});

const play = (state = initialState) => state;

const pause = (state = initialState) => state;

const resume = (state = initialState) => state;

const stop = (state = initialState) => state;

const prev = (state = initialState) => state;

const next = (state = initialState) => state;

const successNext = (state = initialState, action) => ({
  ...state,
  queue: {
    ...state.queue,
    ...action.data,
  },
});

const successPrev = (state = initialState, action) => ({
  ...state,
  queue: {
    ...state.queue,
    ...action.data,
  },
});

export default createReducer(initialState, {
  [Types.LOAD_QUEUE]: loadQueue,
  [Types.LOAD_SINGLE_TRACK]: loadSingleTrack,
  [Types.SUCCESS_LOAD_QUEUE]: successLoadQueue,
  [Types.PLAY]: play,
  [Types.PAUSE]: pause,
  [Types.RESUME]: resume,
  [Types.STOP]: stop,
  [Types.PREV]: prev,
  [Types.NEXT]: next,
  [Types.SUCCESS_NEXT]: successNext,
  [Types.SUCCESS_PREV]: successPrev,
});
