import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { BackHandler } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryCache } from 'react-query';
import { useSelector, useDispatch } from 'react-redux';

import Loading from '~/components/Loading';
import PlaylistItem from '~/components/PlaylistItem';
import api from '~/services/api';
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
  const queryCache = useQueryCache();
  const playlistModal = useSelector(state => state.playlistModal);

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

  const [addTrackToPlaylist] = useMutation(
    async ({ playlistId }) => {
      await api.post(`/app/me/library/playlists/${playlistId}/tracks`, {
        tracks: [playlistModal.trackId],
      });

      return { playlistId };
    },
    {
      onMutate: ({ playlistId }) => {
        queryCache.invalidateQueries('libraryPlaylists');
        queryCache.invalidateQueries(`playlist-${playlistId}-tracks`);
      },
    }
  );

  function handleBackPress() {
    dispatch(PlaylistModalActions.closeModal());
    return true;
  }

  useEffect(() => {
    BackHandler.addEventListener('hardwareBackPress', handleBackPress);

    return () => {
      BackHandler.removeEventListener('hardwareBackPress', handleBackPress);
    };
  }, []);

  const onEndReached = useCallback(() => {
    playlistsQuery.fetchMore();
  }, []);

  useEffect(() => {
    if (!playlistsQuery.isLoading) {
      playlistsQuery.data.forEach(group => {
        setTotalPlaylists(totalPlaylists + group.playlists.length);
      });
    }
  }, [playlistsQuery.isLoading, playlistsQuery.data]);

  function handleCloseModal() {
    dispatch(PlaylistModalActions.closeModal());
  }

  return (
    <Container>
      <ClickArea onStartShouldSetResponder={handleCloseModal} />
      <Selector>
        <Header>
          <HeaderText>{t('playlist_modal.select_playlist')}</HeaderText>
        </Header>

        {totalPlaylists === 0 && !playlistsQuery.isLoading && (
          <WarningText>
            {t('playlist_modal.you_dont_have_any_playlist')}
          </WarningText>
        )}

        {playlistsQuery.isLoading && <Loading />}

        {totalPlaylists > 0 && !playlistsQuery.isLoading && (
          <List
            data={playlistsQuery.data.reduce(
              (acc, val) => acc.concat(val.playlists),
              []
            )}
            keyExtractor={item => `item-${item.id}`}
            renderItem={({ item }) => (
              <PlaylistItem
                data={item}
                imageBorder
                onPress={() => addTrackToPlaylist({ playlistId: item.id })}
              />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.1}
          />
        )}
      </Selector>
    </Container>
  );
}

export default PlaylistModal;
