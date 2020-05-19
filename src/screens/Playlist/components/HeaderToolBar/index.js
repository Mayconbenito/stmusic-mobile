import React, { useRef } from 'react';
import { TouchableOpacity } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

import api from '~/services/api';
import { Creators as LibraryPlaylistActions } from '~/store/ducks/libraryPlaylist';

export default function HeaderToolBar({ playlistId, navigation }) {
  const dispatch = useDispatch();
  const menuRef = useRef();

  function showMenu() {
    menuRef.current.show();
  }

  async function handleDeletePlaylist() {
    try {
      const response = await api.delete(`/playlists/${playlistId}`);

      if (response.status === 204) {
        dispatch(LibraryPlaylistActions.clearState());
        dispatch(LibraryPlaylistActions.fetchPlaylists());
        navigation.goBack();
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Menu
      ref={menuRef}
      style={{ backgroundColor: '#1a1919', borderRadius: 1 }}
      button={
        <TouchableOpacity
          hitSlop={{ top: 50, left: 50, bottom: 50, right: 50 }}
          style={{ marginRight: 5 }}
          activeOpacity={0.5}
          onPress={showMenu}
        >
          <MaterialIcons name="more-vert" size={26} color="#fff" />
        </TouchableOpacity>
      }
      animationDuration={0}
    >
      <MenuItem textStyle={{ color: '#fff' }} onPress={handleDeletePlaylist}>
        Excluir Playlist
      </MenuItem>
    </Menu>
  );
}
