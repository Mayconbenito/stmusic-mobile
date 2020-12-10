import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity } from 'react-native';
import { useInfiniteQuery, useMutation, useQueryCache } from 'react-query';
import { useDispatch } from 'react-redux';

import BigAlbumItem from '~/components/BigAlbumItem';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
import { useFetch } from '~/hooks/useFetch';
import api from '~/services/api';
import { Creators as PlayerActions } from '~/store/ducks/player';

import {
  ParentContainer,
  Container,
  Details,
  Image,
  DetailsTitle,
  Buttons,
  Button,
  List,
  TextButton,
  ScrollerContainer,
  ScrollerHeader,
  ScrollerHeaderButton,
  ScrollerTitleText,
} from './styles';

function Artist({ navigation, route }) {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const queryCache = useQueryCache();
  const [totalAlbums, setTotalAlbums] = useState(0);

  const artistId = route.params.id;

  navigation.setOptions({
    title: t('commons.artist'),
    headerTitleStyle: {
      flex: 1,
      textAlign: 'center',
      color: '#FFF',
      textTransform: 'uppercase',
    },
    headerLeft: () => <HeaderBackButton onPress={() => navigation.goBack()} />,
    headerRight: () => <View />,
  });

  const artistFollowingStateQuery = useFetch(
    `artist-${artistId}-followingState`,
    `/app/me/library/following/artists/contains?artists=${artistId}`
  );
  const artistQuery = useFetch(
    `artist-${artistId}`,
    `/app/artists/${artistId}`
  );
  const albumsQuery = useInfiniteQuery(
    `artist-${artistId}-albums`,
    async (key, page = 1) => {
      const response = await api.get(
        `/app/artists/${artistId}/albums?page=${page}&limit=10`
      );

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

  const mostPlayedTracksQuery = useFetch(
    `artist-${artistId}-mostPlayedTracks`,
    `/app/artists/${artistId}/most-played-tracks?page=1&limit=10`
  );
  const tracksQuery = useFetch(
    `artist-${artistId}-tracks`,
    `/app/artists/${artistId}/tracks?page=1&limit=10`
  );

  const [followArtist] = useMutation(
    async () => {
      const response = await api.put('/app/me/library/following/artists', {
        artists: [parseInt(artistId)],
      });

      return response.data;
    },
    {
      onSettled: () => {
        queryCache.invalidateQueries('libraryArtists');
        queryCache.invalidateQueries(`artist-${artistId}-followingState`);
      },
      onMutate: () => {
        queryCache.cancelQueries(`artist-${artistId}-followingState`);

        const previousFollowingState = queryCache.getQueryData(
          `artist-${artistId}-followingState`
        );

        queryCache.setQueryData(`artist-${artistId}-followingState`, () => {
          return {
            artists: [parseInt(artistId)],
          };
        });

        return () =>
          queryCache.setQueryData(
            `artist-${artistId}-followingState`,
            previousFollowingState
          );
      },
      onError: (err, _, rollback) => rollback(),
    }
  );

  const [unfollowArtist] = useMutation(
    async () => {
      const response = await api.delete('/app/me/library/following/artists', {
        data: { artists: [artistId] },
      });

      return response.data;
    },
    {
      onSettled: () => {
        queryCache.invalidateQueries('libraryArtists');
        queryCache.invalidateQueries(`artist-${artistId}-followingState`);
      },
      onMutate: () => {
        queryCache.cancelQueries(`artist-${artistId}-followingState`);

        const previousFollowingState = queryCache.getQueryData(
          `artist-${artistId}-followingState`
        );

        queryCache.setQueryData(`artist-${artistId}-followingState`, old => {
          return {
            artists: old.artists.filter(artist => {
              return artist !== parseInt(artistId);
            }),
          };
        });

        return () =>
          queryCache.setQueryData(
            `artist-${artistId}-followingState`,
            previousFollowingState
          );
      },
      onError: (err, _, rollback) => rollback(),
    }
  );

  function handleFollowing() {
    if (
      artistFollowingStateQuery.isSuccess &&
      !artistFollowingStateQuery.data.artists.find(
        itemId => itemId === parseInt(artistId)
      )
    ) {
      followArtist();
    } else {
      unfollowArtist();
    }
  }

  function isLoading() {
    if (!albumsQuery.isLoading) {
      return false;
    }

    if (!mostPlayedTracksQuery.isLoading) {
      return false;
    }

    if (!tracksQuery.isLoading) {
      return false;
    }

    return true;
  }

  const onAlbumsEndReached = useCallback(() => {
    albumsQuery.fetchMore();
  }, []);

  useEffect(() => {
    if (albumsQuery.isSuccess) {
      albumsQuery.data.forEach(group => {
        setTotalAlbums(totalAlbums + group.albums.length);
      });
    }
  }, [albumsQuery.isSuccess, albumsQuery.data]);

  return (
    <ParentContainer>
      {artistQuery.isLoading && <Loading />}
      {artistQuery.isSuccess && (
        <Container>
          <Details>
            <Image
              source={{ uri: artistQuery.data?.artist?.picture }}
              fallback={require('~/assets/images/fallback-square.png')}
            />
            <DetailsTitle>{artistQuery.data.artist.name}</DetailsTitle>
            <Buttons>
              <Button onPress={handleFollowing}>
                <TextButton>
                  {artistFollowingStateQuery.isSuccess &&
                  artistFollowingStateQuery.data.artists.find(
                    itemId => itemId === parseInt(artistId)
                  )
                    ? t('commons.following')
                    : t('commons.follow')}
                </TextButton>
              </Button>
            </Buttons>
          </Details>

          {isLoading() && <Loading size={24} style={{ marginTop: 5 }} />}

          {albumsQuery.isSuccess && totalAlbums > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.albums')}</ScrollerTitleText>
              </ScrollerHeader>
              <List
                data={albumsQuery.data.reduce(
                  (acc, val) => acc.concat(val.albums),
                  []
                )}
                keyExtractor={track => `key-${track.id}`}
                renderItem={({ item }) => (
                  <BigAlbumItem
                    data={item}
                    onPress={() =>
                      navigation.navigate('Album', { id: item.id })
                    }
                  />
                )}
                onEndReached={onAlbumsEndReached}
                onEndReachedThreshold={0.6}
                horizontal
              />
            </ScrollerContainer>
          )}

          {mostPlayedTracksQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>
                  {t('artist.most_played_tracks')}
                </ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: `Mais tocadas de ${artistQuery.data.name}`,
                        tracks: mostPlayedTracksQuery.data.tracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {mostPlayedTracksQuery.data?.tracks?.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}

          {tracksQuery.data?.tracks?.length > 0 && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <ScrollerHeader>
                <ScrollerTitleText>{t('commons.tracks')}</ScrollerTitleText>
                <TouchableOpacity
                  onPress={() =>
                    dispatch(
                      PlayerActions.playPlaylist({
                        name: artistQuery.data.name,
                        tracks: tracksQuery.data.tracks,
                      })
                    )
                  }
                  activeOpacity={0.5}
                >
                  <ScrollerHeaderButton />
                </TouchableOpacity>
              </ScrollerHeader>
              {tracksQuery.data?.tracks?.map(item => (
                <TrackItem key={item.id} data={item} />
              ))}
            </ScrollerContainer>
          )}
        </Container>
      )}
    </ParentContainer>
  );
}

export default Artist;
