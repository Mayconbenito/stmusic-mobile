import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    openModal: ['trackId'],
    closeModal: [],
    clearState: [],
  },
  {
    prefix: 'playlistModal/',
  }
);

const initialState = {
  open: false,
  trackId: null,
};

const openModal = (state = initialState, action) => ({
  ...state,
  open: true,
  trackId: action.trackId,
});

const closeModal = (state = initialState) => ({ ...state, open: false });

const clearState = () => initialState;

export default createReducer(initialState, {
  [Types.OPEN_MODAL]: openModal,
  [Types.CLOSE_MODAL]: closeModal,
  [Types.CLEAR_STATE]: clearState,
});
