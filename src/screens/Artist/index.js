import React, { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { View, TouchableOpacity, SectionList } from 'react-native';
import {
  useQuery,
  useInfiniteQuery,
  useMutation,
  useQueryCache,
} from 'react-query';
import { useDispatch } from 'react-redux';

import BigAlbumItem from '~/components/BigAlbumItem';
import HeaderBackButton from '~/components/HeaderBackButton';
import Loading from '~/components/Loading';
import TrackItem from '~/components/TrackItem';
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

  const artistFollowingStateQuery = useQuery(
    `artist-${artistId}-followingState`,
    async () => {
      const response = await api.get(
        `/app/me/library/following/artists/contains?artists=${artistId}`
      );

      return response.data;
    }
  );
  const artistQuery = useQuery(`artist-${artistId}`, async () => {
    const response = await api.get(`/app/artists/${artistId}`);

    return response.data;
  });

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

  const mostPlayedTracksQuery = useQuery(
    `artist-${artistId}-mostPlayedTracks`,
    async () => {
      const response = await api.get(
        `/app/artists/${artistId}/most-played-tracks?page=1&limit=10`
      );

      return response.data;
    }
  );
  const tracksQuery = useQuery(`artist-${artistId}-tracks`, async () => {
    const response = await api.get(
      `/app/artists/${artistId}/tracks?page=1&limit=10`
    );

    return response.data;
  });

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
    if (
      !albumsQuery.isLoading &&
      !mostPlayedTracksQuery.isLoading &&
      !tracksQuery.isLoading
    ) {
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

  const sections = [
    {
      title: t('commons.albums'),
      horizontal: true,
      data: [
        albumsQuery.isSuccess && totalAlbums
          ? albumsQuery?.data?.reduce((acc, val) => acc.concat(val.albums), [])
          : [],
      ],
    },
    {
      title: t('artist.most_played_tracks'),
      horizontal: false,
      type: 'most_played_tracks',
      data: mostPlayedTracksQuery.data?.tracks?.length
        ? mostPlayedTracksQuery?.data?.tracks
        : [],
    },
    {
      title: t('commons.tracks'),
      horizontal: false,
      type: 'tracks',
      data: tracksQuery.data?.tracks?.length ? tracksQuery?.data?.tracks : [],
    },
  ];

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

          {!isLoading() && (
            <ScrollerContainer style={{ marginTop: 0 }}>
              <SectionList
                sections={sections}
                stickySectionHeadersEnabled={false}
                initialNumToRender={8}
                keyExtractor={item => `key-${item.id}`}
                renderSectionHeader={({ section }) => (
                  <>
                    <ScrollerHeader>
                      <ScrollerTitleText>{section.title}</ScrollerTitleText>

                      {section.type === 'most_played_tracks' && (
                        <TouchableOpacity
                          onPress={() =>
                            dispatch(
                              PlayerActions.loadQueue(null, {
                                name: `${t('commons.most_played_from')} ${
                                  artistQuery.data.name
                                }`,
                                id: `most-played-${artistId}`,
                                type: 'tracks',
                                tracks: section.data,
                              })
                            )
                          }
                          activeOpacity={0.5}
                        >
                          <ScrollerHeaderButton />
                        </TouchableOpacity>
                      )}

                      {section.type === 'tracks' && (
                        <TouchableOpacity
                          onPress={() =>
                            dispatch(
                              PlayerActions.loadQueue(null, {
                                name: artistQuery.data.name,
                                id: `tracks-${artistId}`,
                                type: 'tracks',
                                tracks: section.data,
                              })
                            )
                          }
                          activeOpacity={0.5}
                        >
                          <ScrollerHeaderButton />
                        </TouchableOpacity>
                      )}
                    </ScrollerHeader>
                  </>
                )}
                renderItem={({ item, section }) => {
                  if (section.horizontal) {
                    return (
                      <List
                        key={section.type}
                        data={section.data[0]}
                        keyExtractor={track => `key-${track.id}`}
                        renderItem={({ item: horizontalItem }) => (
                          <BigAlbumItem
                            data={horizontalItem}
                            onPress={() =>
                              navigation.navigate('Album', {
                                id: horizontalItem.id,
                              })
                            }
                          />
                        )}
                        onEndReached={onAlbumsEndReached}
                        onEndReachedThreshold={0.6}
                        initialNumToRender={1}
                        showsHorizontalScrollIndicator={false}
                        getItemLayout={(data, index) => ({
                          length: 180,
                          offset: 180 * index,
                          index,
                        })}
                        horizontal
                      />
                    );
                  }
                  return <TrackItem key={item.id} data={item} />;
                }}
              />
            </ScrollerContainer>
          )}
        </Container>
      )}
    </ParentContainer>
  );
}

export default Artist;
