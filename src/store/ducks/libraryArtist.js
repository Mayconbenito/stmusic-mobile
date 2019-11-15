import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    fetchArtists: ['page'],
    successArtists: ['data', 'total'],
    failureArtists: ['error'],
    clearState: [],
  },
  {
    prefix: 'libraryArtist/',
  }
);

const initialState = {
  data: [],
  total: 0,
  page: 1,
  loading: true,
};

const fetchArtists = (state = initialState) => ({
  ...state,
  loading: true,
});

const successArtists = (state = initialState, action) => ({
  ...state,
  data: [...state.data, ...action.data],
  loading: false,
  total: action.total,
  page: state.page + 1,
});

const failureArtists = (state = initialState) => ({
  ...state,
  loading: false,
});

const clearState = (state = initialState) => ({
  ...state,
  data: [],
  total: 0,
  page: 1,
  loading: true,
});

export default createReducer(initialState, {
  [Types.FETCH_ARTISTS]: fetchArtists,
  [Types.SUCCESS_ARTISTS]: successArtists,
  [Types.FAILURE_ARTISTS]: failureArtists,
  [Types.CLEAR_STATE]: clearState,
});
