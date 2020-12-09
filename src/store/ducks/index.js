import { combineReducers } from 'redux';

import player from './player';
import playlistModal from './playlistModal';

export default combineReducers({
  player,
  playlistModal,
});
