import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FlatList } from 'react-native';
import { useInfiniteQuery } from 'react-query';

import Loading from '~/components/Loading';
import PlaylistItem from '~/components/PlaylistItem';
import api from '~/services/api';

import {
  Container,
  CreatePlaylistButton,
  CreatePlaylistButtonText,
  WarningText,
} from './styles';

function Playlists({ navigation }) {
  const { t } = useTranslation();

  const [totalPlaylists, setTotalPlaylists] = useState(0);

  const playlistsQuery = useInfiniteQuery(
    'libraryPlaylists',
    async (key, page = 1) => {
      const response = await api.get(`/app/me/library/playlists?page=${page}`);

      return response.data;
    },
    {
      getFetchMore: lastGroup => {
        if (Math.ceil(lastGroup.meta.total / 10) > lastGroup.meta.page) {
          return lastGroup.meta.page + 1;
        }

        return false;
      },
    }
  );

  const onEndReached = useCallback(() => {
    playlistsQuery.fetchMore();
  }, []);

  useEffect(() => {
    if (playlistsQuery.isSuccess) {
      playlistsQuery.data.forEach(group => {
        setTotalPlaylists(totalPlaylists + group.playlists.length);
      });
    }
  }, [playlistsQuery.isSuccess, playlistsQuery.data]);

  return (
    <Container>
      {playlistsQuery.isLoading && <Loading />}
      {playlistsQuery.isSuccess && (
        <FlatList
          ListHeaderComponent={
            <>
              <CreatePlaylistButton
                onPress={() => navigation.navigate('CreatePlaylist')}
              >
                <CreatePlaylistButtonText>
                  {t('library.create_playlist_button')}
                </CreatePlaylistButtonText>
              </CreatePlaylistButton>
              {!totalPlaylists > 0 && (
                <WarningText>
                  {t('library.you_dont_have_any_playlist')}
                </WarningText>
              )}
            </>
          }
          data={
            totalPlaylists > 0
              ? playlistsQuery.data.reduce(
                  (acc, val) => acc.concat(val.playlists),
                  []
                )
              : []
          }
          keyExtractor={item => `key-${item.id}`}
          renderItem={({ item }) => (
            <PlaylistItem
              onPress={() => navigation.navigate('Playlist', { id: item.id })}
              data={item}
            />
          )}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            playlistsQuery.isFetchingMore && <Loading size={24} />
          }
          ListFooterComponentStyle={{
            marginTop: 10,
          }}
        />
      )}
    </Container>
  );
}

export default React.memo(Playlists);
