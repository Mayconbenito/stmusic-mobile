import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    fetchGenres: [],
    successGenres: ['data'],
    failureGenres: ['error'],
    fetchRecentlyPlayed: [],
    successRecentlyPlayed: ['data'],
    failureRecentlyPlayed: ['error'],
    fetchTrending: [],
    successTrending: ['data'],
    failureTrending: ['error'],
    fetchMostPlayed: [],
    successMostPlayed: ['data'],
    failureMostPlayed: ['error'],
    fetchMostFollowed: [],
    successMostFollowed: ['data'],
    failureMostFollowed: ['error'],
  },
  {
    prefix: 'browse/',
  }
);

const initialState = {
  genres: [],
  loadingGenres: false,
  recentlyPlayed: [],
  loadingRecentlyPlayed: false,
  trending: [],
  loadingTrending: false,
  mostPlayed: [],
  loadingMostPlayed: false,
  mostFollowed: [],
  loadingMostFollowed: false,
};

const fetchGenres = (state = initialState) => ({
  ...state,
  loadingGenres: true,
});

const successGenres = (state = initialState, action) => ({
  ...state,
  genres: action.data,
  loadingGenres: false,
});

const failureGenres = (state = initialState) => ({
  ...state,
  loadingGenres: false,
});

const fetchRecentlyPlayed = (state = initialState) => ({
  ...state,
  loadingRecentlyPlayed: true,
});

const successRecentlyPlayed = (state = initialState, action) => ({
  ...state,
  recentlyPlayed: action.data,
  loadingRecentlyPlayed: false,
});

const failureRecentlyPlayed = (state = initialState) => ({
  ...state,
  loadingRecentlyPlayed: false,
});

const fetchTrending = (state = initialState) => ({
  ...state,
  loadingTrending: true,
});

const successTrending = (state = initialState, action) => ({
  ...state,
  trending: action.data,
  loadingTrending: false,
});

const failureTrending = (state = initialState) => ({
  ...state,
  loadingTrending: false,
});

const fetchMostPlayed = (state = initialState) => ({
  ...state,
  loadingMostPlayed: true,
});

const successMostPlayed = (state = initialState, action) => ({
  ...state,
  mostPlayed: action.data,
  loadingMostPlayed: false,
});

const failureMostPlayed = (state = initialState) => ({
  ...state,
  loadingMostPlayed: false,
});

const fetchMostFollowed = (state = initialState) => ({
  ...state,
  loadingMostFollowed: true,
});

const successMostFollowed = (state = initialState, action) => ({
  ...state,
  mostFollowed: action.data,
  loadingMostFollowed: false,
});

const failureMostFollowed = (state = initialState) => ({
  ...state,
  loadingMostFollowed: false,
});

export default createReducer(initialState, {
  [Types.FETCH_GENRES]: fetchGenres,
  [Types.SUCCESS_GENRES]: successGenres,
  [Types.FAILURE_GENRES]: failureGenres,
  [Types.FETCH_RECENTLY_PLAYED]: fetchRecentlyPlayed,
  [Types.SUCCESS_RECENTLY_PLAYED]: successRecentlyPlayed,
  [Types.FAILURE_RECENTLY_PLAYED]: failureRecentlyPlayed,
  [Types.FETCH_TRENDING]: fetchTrending,
  [Types.SUCCESS_TRENDING]: successTrending,
  [Types.FAILURE_TRENDING]: failureTrending,
  [Types.FETCH_MOST_PLAYED]: fetchMostPlayed,
  [Types.SUCCESS_MOST_PLAYED]: successMostPlayed,
  [Types.FAILURE_MOST_PLAYED]: failureMostPlayed,
  [Types.FETCH_MOST_FOLLOWED]: fetchMostFollowed,
  [Types.SUCCESS_MOST_FOLLOWED]: successMostFollowed,
  [Types.FAILURE_MOST_FOLLOWED]: failureMostFollowed,
});
