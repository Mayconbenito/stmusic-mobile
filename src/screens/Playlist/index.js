import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useInfiniteQuery, useMutation, useQueryCache } from 'react-query';
import { useDispatch } from 'react-redux';

import Fallback from '~/assets/images/fallback-square.png';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import { useFetch } from '~/hooks/useFetch';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';

import HeaderToolBar from './HeaderToolBar';
import {
  ParentContainer,
  Container,
  Details,
  Image,
  DetailsTitle,
  Button,
  List,
  TextButton,
  WarningText,
} from './styles';

function Playlist({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryCache = useQueryCache();

  const playlistId = route.params.id;

  navigation.setOptions({
    title: t('commons.playlist'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => (
      <HeaderToolBar playlistId={route.params.id} navigation={navigation} />
    ),
  });

  const [totalTracks, setTotalTracks] = useState(0);

  const playlistQuery = useFetch(
    `playlist-${playlistId}`,
    `/app/playlists/${playlistId}`
  );

  const tracksQuery = useInfiniteQuery(
    `playlist-${playlistId}-tracks`,
    async (key, page = 1) => {
      const response = await api.get(
        `/app/playlists/${playlistId}/tracks?page=${page}`
      );

      return response.data;
    },
    {
      getFetchMore: lastGroup => {
        if (Math.ceil(lastGroup?.meta.total / 10) > lastGroup?.meta.page) {
          return lastGroup?.meta.page + 1;
        }

        return false;
      },
    }
  );

  const onEndReached = useCallback(() => {
    tracksQuery.fetchMore();
  }, []);

  const [removeTrackFromPlaylist] = useMutation(
    async ({ trackId }) => {
      const response = await api.delete(
        `/app/me/library/playlists/${playlistId}/tracks`,
        {
          data: { tracks: [trackId] },
        }
      );

      return response.data;
    },
    {
      onMutate: ({ trackId }) => {
        queryCache.cancelQueries(`playlist-${playlistId}-tracks`);

        const previousTodos = queryCache.getQueryData(
          `playlist-${playlistId}-tracks`
        );

        queryCache.setQueryData(`playlist-${playlistId}-tracks`, old => {
          return old.map(group => {
            return {
              meta: {
                ...group.meta,
                total: group.total - 1,
              },
              tracks: group.tracks.filter(track => track.id !== trackId),
            };
          });
        });

        return () =>
          queryCache.setQueryData(
            `playlist-${playlistId}-tracks`,
            previousTodos
          );
      },
      onError: (err, _, rollback) => rollback(),
      onSettled: () => {
        queryCache.invalidateQueries(`playlist-${playlistId}-tracks`);
      },
    }
  );

  useEffect(() => {
    if (tracksQuery.isSuccess) {
      tracksQuery.data.forEach(group => {
        setTotalTracks(totalTracks + group?.tracks.length);
      });
    }
  }, [tracksQuery.isSuccess, tracksQuery.data]);

  function handlePlaylistPlay() {
    dispatch(PlayerActions.fetchPlaylist(playlistId, 'playlists'));
  }

  return (
    <ParentContainer>
      {playlistQuery.isLoading && <Loading />}
      {playlistQuery.isSuccess && (
        <Container>
          <List
            ListHeaderComponent={
              <Details>
                <Image
                  source={{ uri: playlistQuery.data?.playlist?.picture }}
                  fallback={Fallback}
                />
                <DetailsTitle>
                  {playlistQuery.data?.playlist?.name}{' '}
                </DetailsTitle>
                {totalTracks > 0 ? (
                  <Button onPress={handlePlaylistPlay}>
                    <TextButton>{t('commons.play_tracks_button')}</TextButton>
                  </Button>
                ) : (
                  <WarningText>{t('commons.no_track_available')}</WarningText>
                )}
              </Details>
            }
            data={
              totalTracks > 0
                ? tracksQuery.data.reduce(
                    (acc, val) => acc.concat(val.tracks),
                    []
                  )
                : []
            }
            keyExtractor={track => `key-${track.id}`}
            renderItem={({ item }) => (
              <TrackItem
                data={item}
                margin
                isPlaylist
                onRemoveTrackFromPlaylist={() =>
                  removeTrackFromPlaylist({ trackId: item.id })
                }
              />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.4}
            ListFooterComponent={
              tracksQuery.isFetchingMore && <Loading size={24} />
            }
            ListFooterComponentStyle={{
              marginTop: 10,
            }}
          />
        </Container>
      )}
    </ParentContainer>
  );
}

export default Playlist;
