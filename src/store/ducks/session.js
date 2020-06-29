import { createActions, createReducer } from 'reduxsauce';

export const { Types, Creators } = createActions(
  {
    createSession: ['data'],
    updateUserData: ['user'],
    deleteSession: [],
  },
  {
    prefix: 'session/',
  }
);

const initialState = {
  jwt: null,
  user: null,
};

const createSession = (state = initialState, action) => ({
  ...state,
  jwt: action.data.jwt,
  user: action.data.user,
});

const updateUserData = (state = initialState, action) => ({
  ...state,
  user: action.user,
});

const deleteSession = () => ({});

export default createReducer(initialState, {
  [Types.CREATE_SESSION]: createSession,
  [Types.UPDATE_USER_DATA]: updateUserData,
  [Types.DELETE_SESSION]: deleteSession,
});
