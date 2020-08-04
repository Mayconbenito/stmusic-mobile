import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useDispatch } from 'react-redux';

import { Creators as PlaylistModalActions } from '~/store/ducks/playlistModal';

function ToolBar({ data, onRemoveTrackFromPlaylist }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const menuRef = useRef();

  function showMenu() {
    menuRef.current.show();
  }

  function handleAddToPlaylist() {
    menuRef.current.hide();
    dispatch(PlaylistModalActions.openModal(data.trackId));
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
          <MaterialIcons name="more-vert" size={26} color="#d99207" />
        </TouchableOpacity>
      }
      animationDuration={0}
    >
      <MenuItem textStyle={{ color: '#fff' }} onPress={handleAddToPlaylist}>
        {t('commons.add_to_playlist')}
      </MenuItem>
      {data.isPlaylist && (
        <MenuItem
          textStyle={{ color: '#fff' }}
          onPress={() => onRemoveTrackFromPlaylist(data.trackId)}
        >
          {t('commons.remove_from_playlist')}
        </MenuItem>
      )}
    </Menu>
  );
}

export default ToolBar;
