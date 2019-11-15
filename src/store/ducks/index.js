import { combineReducers } from 'redux';

import browse from './browse';
import libraryArtist from './libraryArtist';
import libraryPlaylist from './libraryPlaylist';
import player from './player';
import playlistModal from './playlistModal';

export default combineReducers({
  browse,
  libraryArtist,
  libraryPlaylist,
  player,
  playlistModal,
});
