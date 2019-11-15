import React, { useEffect } from 'react';
import { FlatList } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Loading from '~/components/Loading';
import PlaylistItem from '~/components/PlaylistItem';
import getPlayerHeight from '~/helpers/getPlayerHeight';
import { Creators as LibraryPlaylistActions } from '~/store/ducks/libraryPlaylist';

import {
  Container,
  CreatePlaylistButton,
  CreatePlaylistButtonText,
  WarningText,
} from './styles';

function Playlists({ navigation }) {
  const { fetchPlaylists } = LibraryPlaylistActions;
  const libraryPlaylist = useSelector(state => state.libraryPlaylist);
  const dispatch = useDispatch();
  const playerHeight = getPlayerHeight();

  useEffect(() => {
    if (libraryPlaylist.data.length === 0) dispatch(fetchPlaylists());
  }, []);

  function endReached() {
    if (
      libraryPlaylist.total > libraryPlaylist.data.length &&
      !libraryPlaylist.loading
    ) {
      dispatch(fetchPlaylists(libraryPlaylist.page));
    }
  }
  return (
    <Container playerHeight={playerHeight}>
      {libraryPlaylist.loading && <Loading />}

      {!libraryPlaylist.loading && (
        <>
          <FlatList
            ListHeaderComponent={
              <>
                <CreatePlaylistButton
                  onPress={() => navigation.navigate('CreatePlaylist')}
                >
                  <CreatePlaylistButtonText>
                    Criar Playlist
                  </CreatePlaylistButtonText>
                </CreatePlaylistButton>
                {!libraryPlaylist.data.length > 0 && (
                  <WarningText>
                    Você ainda não tem nenhuma playlist.
                  </WarningText>
                )}
              </>
            }
            data={libraryPlaylist.data}
            keyExtractor={item => `key-${item.id}`}
            renderItem={({ item }) => (
              <PlaylistItem
                onPress={() => navigation.navigate('Playlist', { id: item.id })}
                data={item}
              />
            )}
            onEndReached={endReached}
            onEndReachedThreshold={0.1}
          />
        </>
      )}
    </Container>
  );
}

export default Playlists;
