import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '~/components/Loading';
import PlaylistItem from '~/components/PlaylistItem';
import api from '~/services/api';
import { Creators as LibraryPlaylistActions } from '~/store/ducks/libraryPlaylist';
import { Creators as PlaylistModalActions } from '~/store/ducks/playlistModal';

import {
  Container,
  ClickArea,
  Selector,
  Header,
  HeaderText,
  WarningText,
  List,
} from './styles';

function PlaylistModal() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const playlistModal = useSelector(state => state.playlistModal);

  const playlistInitialState = {
    data: [],
    total: 0,
    page: 1,
    loading: true,
  };

  const [playlist, setPlaylist] = useState(playlistInitialState);

  async function fetchPlaylists() {
    try {
      const response = await api.get('/me/playlists', {
        params: {
          page: playlist.page,
        },
      });

      setPlaylist({
        data: [...playlist.data, ...response.data.playlists],
        page: playlist.page + 1,
        total: response.data.meta.total,
        loading: false,
      });
    } catch (err) {
      console.log(err);
    }
  }

  function handleBackPress() {
    dispatch(PlaylistModalActions.closeModal());
    return true;
  }

  useEffect(() => {
    fetchPlaylists();
  }, []);

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  function endReached() {
    if (playlist.total > playlist.data.length) {
      fetchPlaylists();
    }
  }

  function handleCloseModal() {
    dispatch(PlaylistModalActions.closeModal());
  }

  async function addTrackToPlaylist(playlistId) {
    try {
      handleCloseModal();
      const response = await api.post(`/playlists/${playlistId}/tracks`, {
        tracks: [playlistModal.trackId],
      });

      if (response.status === 204) {
        dispatch(LibraryPlaylistActions.clearState());
        dispatch(LibraryPlaylistActions.fetchPlaylists());
      }
    } catch (err) {
      console.log(err);
    }
  }

  return (
    <Container>
      <ClickArea onStartShouldSetResponder={handleCloseModal} />
      <Selector>
        <Header>
          <HeaderText>{t('playlist_modal.select_playlist')}</HeaderText>
        </Header>

        {playlist.data.length === 0 && (
          <WarningText>
            {t('playlist_modal.you_dont_have_any_playlist')}
          </WarningText>
        )}

        {playlist.loading && <Loading />}

        {playlist.data.length > 0 && !playlist.loading && (
          <List
            data={playlist.data}
            keyExtractor={item => `item-${item.id}`}
            renderItem={({ item }) => (
              <PlaylistItem
                data={item}
                imageBorder
                onPress={() => addTrackToPlaylist(item.id)}
              />
            )}
            onEndReached={endReached}
            onEndReachedThreshold={0.1}
          />
        )}
      </Selector>
    </Container>
  );
}

export default PlaylistModal;
