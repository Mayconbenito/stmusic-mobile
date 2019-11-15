import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    fetchPlaylists: ['page'],
    successPlaylists: ['data', 'total'],
    failurePlaylists: ['error'],
    clearState: [],
  },
  {
    prefix: 'libraryPlaylist/',
  }
);

const initialState = {
  data: [],
  total: 0,
  page: 1,
  loading: true,
};

const fetchPlaylists = (state = initialState) => ({
  ...state,
  loading: true,
});

const successPlaylists = (state = initialState, action) => ({
  ...state,
  data: [...state.data, ...action.data],
  loading: false,
  total: action.total,
  page: state.page + 1,
});

const failurePlaylists = (state = initialState) => ({
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
  [Types.FETCH_PLAYLISTS]: fetchPlaylists,
  [Types.SUCCESS_PLAYLISTS]: successPlaylists,
  [Types.FAILURE_PLAYLISTS]: failurePlaylists,
  [Types.CLEAR_STATE]: clearState,
});
