import React, { useState, useEffect } from 'react';
import { BackHandler } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

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
  List,
} from './styles';

export default function PlaylistModal() {
  const dispatch = useDispatch();
  const playlistModalState = useSelector(state => state.playlistModal);
  const [playlists, setPlaylists] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  async function fetchPlaylists() {
    try {
      const response = await api.get('/me/playlists', {
        params: {
          page,
        },
      });

      setPage(page + 1);
      setPlaylists([...playlists, ...response.data.playlists]);
      setTotal(response.data.meta.total);
    } catch (e) {
      console.log(e);
    }
  }

  function handleBackPress() {
    dispatch(PlaylistModalActions.closeModal());
    return true;
  }

  useEffect(() => {
    fetchPlaylists();

    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  function endReached() {
    if (total > playlists.length) {
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
        tracks: [playlistModalState.trackId],
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
          <HeaderText>Escolha a Playlist</HeaderText>
        </Header>
        {playlists.length > 0 && (
          <List
            data={playlists}
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
