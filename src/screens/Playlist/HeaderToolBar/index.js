import React, { useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableOpacity } from 'react-native';
import Menu, { MenuItem } from 'react-native-material-menu';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useMutation, useQueryCache } from 'react-query';

import api from '~/services/api';

function HeaderToolBar({ playlistId, navigation }) {
  const { t } = useTranslation();

  const menuRef = useRef();

  const queryCache = useQueryCache();

  function showMenu() {
    menuRef.current.show();
  }

  const [deletePlaylist] = useMutation(
    async () => {
      const response = await api.delete(
        `/app/me/library/playlists/${playlistId}`
      );

      return response.data;
    },
    {
      onSettled: () => {
        queryCache.invalidateQueries('libraryPlaylists');
        navigation.goBack();
      },
    }
  );

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
      <MenuItem textStyle={{ color: '#fff' }} onPress={deletePlaylist}>
        {t('playlist.tool_bar_delete_playlist')}
      </MenuItem>
    </Menu>
  );
}

export default HeaderToolBar;
